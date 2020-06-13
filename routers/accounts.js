const express = require('express')
const router = express.Router()
const fs = require("fs").promises

//Cria o arquivo accouts.json caso ele não exista e cria novos clientes no mesmo
router.post("/", async (req, res) => {
    let account = req.body
    try {
        let data = await fs.readFile("accounts.json", "utf8")
        let json = JSON.parse(data)

        let obj = { id: json.nextId++, ...account }
        json.accounts.push(obj)

        await fs.writeFile("accounts.json", JSON.stringify(json))

        res.send("Dados cadastrados")
        res.end()

        logger.info(`POST /account - ${JSON.stringify(account)}`)
    } catch (err) {
        res.status(400).send({ error: err.message })
        logger.error(`POST /account - ${err.message}`)
    }
})

//Consultar todos os clientes registrados no arquivo accounts.json
router.get('/', async (_, res) => {
    try {
        let data = await fs.readFile('accounts.json', 'utf8')
        let jsn = JSON.parse(data)
        delete jsn.nextId
        res.send(jsn)

        logger.info(`GET /account`)

    } catch (err) {
        res.status(400).send({ error: err.message })
        logger.error(`GET /account - ${err.message}`)
    }

})

//Consultar um unico cliente no arquivo accounts.json
router.get("/:id", async (req, res) => {
    try {
        let data = await fs.readFile('accounts.json', 'utf8')

        let json = JSON.parse(data)
        const account = json.accounts.find(account => account.id === parseInt(req.params.id, 10))
        if (account) {
            res.send(account)
            logger.info(`GET /account/:id - ${JSON.stringify(account)}`)

        } else {
            res.end()
            logger.error(`GET /account/:id`)
        }        
    } catch (err) {
        res.status(400).send({ error: err.message })
        logger.error(`GET /account/:id - ${err.message}`)

    }
})

//Deletar uma conta de acordo com seu ID.
router.delete("/:id", async (req, res) => {
    try {
        let data = await fs.readFile('accounts.json', 'utf8')

        let json = JSON.parse(data)
        let accounts = json.accounts.filter(account => account.id !== parseInt(req.params.id, 10))
        json.accounts = accounts

        await fs.writeFile("accounts.json", JSON.stringify(json))

        res.send("Registro deletado")
        res.end()

        logger.info(`DELETE /account/:id - ${req.params.id}`)

    } catch (err) {
        res.status(400).send({ error: err.message })
        logger.error(`DELETE /account/:id - ${err.message}`)
    }
})

//Alterar um único registro, seguindo seu ID.
router.put("/", async (req, res) => {
    try {
        let newAccount = req.body
        let data = await fs.readFile("accounts.json", "utf8")
        let json = JSON.parse(data)

        let oldIndex = json.accounts.findIndex(account => account.id === newAccount.id)
        json.accounts[oldIndex].name = newAccount.name
        json.accounts[oldIndex].balance = newAccount.balance


        await fs.writeFile("accounts.json", JSON.stringify(json))

        res.send("Atualização realizada com sucesso!")
        res.end()

        logger.info(`PUT /account - ${JSON.stringify(newAccount)}`)
    } catch (err) {
        res.status(400).send({ error: err.message })
        logger.error(`PUT /account - ${err.message}`)
    }
})

router.post("/transaction", async (req, res) => {
    try {
        let transaction = " "
        let params = req.body
        let data = await fs.readFile("accounts.json", "utf8")

        let json = JSON.parse(data)
        let index = json.accounts.findIndex(account => account.id === params.id)

        if ((params.value < 0) && (json.accounts[index].balance + params.value < 0)) {
            throw new Error("Não há saldo suficiente!")
        }

        json.accounts[index].balance += params.value

        if (params.value < 0) {
            transaction = "Saque"
        } else {
            transaction = "Depósito"
        }

        await fs.writeFile("accounts.json", JSON.stringify(json))

        res.send("Transação de " + transaction + " realizada com sucesso: " + "R$" + params.value)
        res.end()

        logger.info(`POST /account/transaction - ${JSON.stringify(params)}`)
    } catch (err) {
        res.status(400).send({ error: err.message })
        logger.error(`POST /account/transaction - ${err.message}`)
    }
})

module.exports = router