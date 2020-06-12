const express = require("express")
const app = express()
const fs = require("fs")
const accountsRouter = require("./routers/accounts.js")

app.use(express.json())

//aciona os routes exportado do arquivo accounts.js 
app.use("/account", accountsRouter)


app.listen(3000, function () {
    try {
        fs.readFile("accounts.json", "utf8", (err, data) => {
            if (err) {
                const initialJson = {
                    nextId: 1,
                    accounts: []
                }

                fs.writeFile("accounts.json", JSON.stringify(initialJson), err => {
                    if (err) {
                        console.log(err)
                    }
                })
            }
        })
    } catch (err) {
        console.log(err)
    }
    console.log('API Started')
})