const express = require("express")
const app = express()
const fs = require("fs").promises
const accountsRouter = require("./routers/accounts.js")
const winston = require("winston")

const {combine, timestamp, label, printf} = winston.format
const myFormat = printf(({level, message, label, timestamp})=>{
    return `${timestamp} [${label}] ${level} ${message}`
})

global.logger = winston.createLogger({
    level: "silly",
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: "my-bank-api"})
    ],
    format: combine(
        label( {label: "my-bank-api"}),
        timestamp(),
        myFormat
    )
})

app.use(express.json())

//aciona os routes exportado do arquivo accounts.js 
app.use("/account", accountsRouter)


app.listen(3000, async () => {
    try {
        await fs.readFile("accounts.json", "utf8")
        logger.info('API Started')

    } catch (err) {
        const initialJson = {
            nextId: 1,
            accounts: []
        }

        fs.writeFile("accounts.json", JSON.stringify(initialJson)).catch(err => {
            logger.error(err)
        })
    }

})