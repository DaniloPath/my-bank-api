const express = require("express")
const app = express()
const fs = require("fs").promises
const accountsRouter = require("./routers/accounts.js")

app.use(express.json())

//aciona os routes exportado do arquivo accounts.js 
app.use("/account", accountsRouter)


app.listen(3000, async () => {
    try {
        await fs.readFile("accounts.json", "utf8")
        console.log('API Started')

    } catch (err) {
        const initialJson = {
            nextId: 1,
            accounts: []
        }

        fs.writeFile("accounts.json", JSON.stringify(initialJson)).catch(err => {
            console.log(err)
        })
    }

})

/* fs.readFile("accounts.json", "utf8", (err, data) => {
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
} */
