const express = require('express')
const router = express.Router()
const fs = require("fs")

//Cria o arquivo accouts.json caso ele não exista e cria novos clientes no mesmo
router.post("/", (req, res) => {
    let account = req.body
    fs.readFile("accounts.json", "utf8", (err, data) => {
        if (!err) {
            try {
                let json = JSON.parse(data)
                let obj = { id: json.nextId++, ...account }
                json.accounts.push(obj)

                fs.writeFile("accounts.json", JSON.stringify(json), err => {
                    if (err) {
                        res.status(400).send({ error: err.message })
                    } else {
                        res.send("Dados cadastrados")
                        res.end()
                    }
                })
            } catch (err) {
                res.status(400).send({ error: err.message })
            }
        } else {
            res.status(400).send({ error: err.message })
        }
    })
})

//Consultar todos os clientes registrados no arquivo accounts.json
router.get('/', (_, res) => {
    fs.readFile('accounts.json', 'utf8', (err, data) => {
        if (!err) {
            let jsn = JSON.parse(data)
            delete jsn.nextId
            res.send(jsn)

        } else {
            res.status(400).send({ error: err.message })
        }
    })
})

//Consultar um unico cliente no arquivo accounts.json
router.get("/:id", (req, res) => {
    fs.readFile('accounts.json', 'utf8', (err, data) => {
        try {
            if (err) throw err

            let json = JSON.parse(data)
            const account = json.accounts.find(account => account.id === parseInt(req.params.id, 10))
            if (account) {
                res.send(account)

            } else {
                res.end()
            }
        } catch {
            res.status(400).send({ error: err.message })
        }
    })
})

//Deletar uma conta de acordo com seu ID.
router.delete("/:id", (req, res) => {
    fs.readFile('accounts.json', 'utf8', (err, data) => {
        try {
            if (err) throw err

            let json = JSON.parse(data)
            let accounts = json.accounts.filter(account => account.id !== parseInt(req.params.id, 10))
            json.accounts = accounts

            fs.writeFile("accounts.json", JSON.stringify(json), err => {
                if (err) {
                    res.status(400).send({ error: err.message })
                } else {
                    res.send("Registro deletado")
                    res.end()
                }
            })

        } catch (err) {
            res.status(400).send({ error: err.message })
        }
    })

})

//Alterar um único registro, seguindo seu ID.
router.put("/", (req, res) => {
    let newAccount = req.body
    fs.readFile("accounts.json", "utf8", (err, data) => {
        try {
            if (err) throw err
            let json = JSON.parse(data)
            let oldIndex = json.accounts.findIndex(account => account.id === newAccount.id)
            json.accounts[oldIndex].name = newAccount.name
            json.accounts[oldIndex].balance = newAccount.balance


            fs.writeFile("accounts.json", JSON.stringify(json), err => {
                if (err) {
                    res.status(400).send({ error: err.message })
                } else {
                    res.end()
                }
            })

            res.send("Atualização realizada com sucesso!")
        } catch (err) {
            res.status(400).send({ error: err.message })
        }
    })

})

router.post("/transaction", (req, res) => {
    let params = req.body
    fs.readFile("accounts.json", "utf8", (err, data) => {
        try {
            if (err) throw err
            let json = JSON.parse(data)
            let index = json.accounts.findIndex(account => account.id === params.id)

            if ((params.value < 0) && (json.accounts[index].balance + params.value < 0)) {
                throw new Error("Não há saldo suficiente!")
            }

            json.accounts[index].balance += params.value


            fs.writeFile("accounts.json", JSON.stringify(json), err => {
                if (err) {
                    res.status(400).send({ error: err.message })
                } else {
                    res.end()
                }
            })

            res.send("Transação realizada com sucesso " + "R$" + params.value)
        } catch (err) {
            res.status(400).send({ error: err.message })
        }
    })


})

module.exports = router