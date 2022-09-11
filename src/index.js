const { request, response } = require('express');
const express = require('express')
const { v4: uuidv4 } = require("uuid")

const app = express();

const customers = []

app.use(express.json())

function verifyIfExistsAccountCPF(request, response, next) {
    const {cpf} = request.headers;
    
    const customer = customers.find(
        (customer) => customer.cpf === cpf
    )

    if (!customer) {
        return response.status(400).json({error: "Customer not found"});
    }

    request.customer = customer;

    return next();
}

// app.use(verifyIfExistsAccountCPF)

app.get('/statement', verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;
    return response.json(customer.statement)
})

app.post('/account', (request, response) => {
    const {cpf, name} = request.body

    const customerAlreadyExists = customers.some(
        (customer) => customer.cpf === cpf
    )
    
    if (customerAlreadyExists) {
        return response.status(400).json({error: "Customer already exists!"})
    }

    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    })
   return response.status(201).send(customers);
})

app.post('/deposit', verifyIfExistsAccountCPF, function (request, response) {
  const { description, amount } = request.body

  const { customer } = request;

  const statementOperation ={
    description,
    amount,
    created_at: new Date(),
    type: "credit"
  }

  customer.statement.push(statementOperation);

  return response.status(201).send();
})

app.put('/courses/:id', (request, response) => {
    const { id } = request.params;
    console.log(id)
    return response.json([
        "Curso 6",
        "Curso 2",
        "Curso 3",
        "Curso 4"
    ])
})

app.patch('/courses/:id', (request, response) => {
    return response.json([
        "Curso 6",
        "Curso 7",
        "Curso 3",
        "Curso 4"
    ])
})

app.delete('/courses/:id', (request, response) => {
    return response.json([
        "Curso 6",
        "Curso 7",
        "Curso 4"
    ])
})

app.listen(3333)