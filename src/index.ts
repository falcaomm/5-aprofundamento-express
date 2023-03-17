import express, { Request, Response } from 'express'
import cors from 'cors'
import { accounts } from './database'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

app.get("/accounts", (req: Request, res: Response) => {
    res.status(200).send(accounts)
})

app.get("/accounts/:id", (req: Request, res: Response) => {
    const { id } = req.params
    // console.log(id);

    const result = accounts.filter((account) => {
        return account.id === id
    })
    
    res.status(200).send({ resultadoFiltro: result }) //forma que ter cuidado com a documentação pro front 
})

app.get("/accounts/:id", (req: Request, res: Response) => {
    const { id } = req.params
    // console.log(id);

    const result = accounts.filter((account) => {
        return account.id === id
    })
    
    res.status(200).send({ resultadoFiltro: result }) //forma que ter cuidado com a documentação pro front 
})

app.delete("/accounts/:id", (req: Request, res: Response) => {
    const { id } = req.params

    const accountResult = accounts.findIndex((account) => {
        return account.id ===id
    })

    // console.log(accountResult);

    // if (accountResult < 0) {
    //     res.status(404).send("Item não encontrado")

    // } else {
    //     accounts.splice(accountResult, 1)

    //     res.status(200).send("Item deletado com sucesso")
    // }

    accountResult < 0 ?
        res.status(404).send("Item não encontrado")
        :
        (accounts.splice(accountResult, 1)

        , res.status(200).send("Item deletado com sucesso"))
})

app.put("/accounts/:id", (req: Request, res: Response) => {
    const { id } = req.params

    // const newOwnerName = req.body.ownerName
    // const newBalance = req.body.balance
    // const newType = req.body.type
    
    const newId = req.body.id
    const {ownerName, balance, type} = req.body

    const accountFind = accounts.find((account) => {
        return account.id === id
    })

    if (accountFind) {
        accountFind.id = newId || accountFind.id
        accountFind.ownerName = ownerName || accountFind.ownerName
        accountFind.balance = balance || accountFind.balance
        accountFind.type = type || accountFind.type
        res.status(200).send("atualização realizada com sucesso")
    } else {
        res.status(404).send("Item não encontrado")
    }
})
