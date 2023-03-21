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

    try {
            
        const { id } = req.params

        const result = accounts.find((account) => account.id === id)     
        
        console.log(result);
        

        if (!result) {
            res.status(404)
            throw new Error("Conta não encontrada. Verifique o ID");
        }
        
        res.status(200).send(result)

        // res.status(200).send({ resultadoFiltro: result })
        //forma que ter cuidado com a documentação pro front
        
    } catch (error) {

        if (res.statusCode === 200) {
            res.status(500)
            res.send("Erro nã identificado no servidor ")
        }
        res.send(error.message)
    }
})


app.delete("/accounts/:id", (req: Request, res: Response) => {

    try {        
        const { id } = req.params

        console.log(id);
        
        if (id === ":id") {
            res.status(400)
            throw new Error("Conta não encontrada. Verifique o ID");
        }

        if (id[0] !== "a") {
            res.status(400)
            throw new Error("'id' inválido. deve iniciar com a letra 'a'")
        }

        const accountResult = accounts.findIndex((account) => {
            return account.id === id
        })
    
        // console.log(accountResult);
    
        // if (accountResult < 0) {
        //     res.status(404).send("Item não encontrado")
    
        // } else {
        //     accounts.splice(accountResult, 1)
    
        //     res.status(200).send("Item deletado com sucesso")
        // }
    
       !accountResult || accountResult < 0 ?
            res.status(404).send("Item não encontrado")
            :
            (accounts.splice(accountResult, 1)
    
            , res.status(200).send("Item deletado com sucesso"))
        
    } catch (error) {
        
        if (res.statusCode === 200) {
            res.status(500)
            res.send("Erro nã identificado no servidor ")
        }
        res.send(error.message)
    }

})

app.put("/accounts/:id", (req: Request, res: Response) => {
    try {
        const { id } = req.params

        // const newOwnerName = req.body.ownerName
        // const newBalance = req.body.balance
        // const newType = req.body.type
        
        const newId = req.body.id
        const {ownerName, balance, type} = req.body

        if (balance !== undefined) {
            if (typeof balance !== 'number') {
                res.status(400)
                throw new Error("Balance deve ser um número");
            }
            if (balance < 0) {
                res.status(400)
                throw new Error("Balance deve ser maior ou igual a zero");
            }
        }

        if (type !== undefined) {
            if (type !== "Ouro" && type !== "Platina" && type !== "Black") {
                res.status(400)
                throw new Error("Type deve ser ua categoria válida: Ouro, Platina ou Black");
            }
        }

        if (newId[0] !== 'a') {
            res.status(400)
            throw new Error("'id' inválido. deve iniciar com a letra 'a'")
        }

        if (ownerName.length < 2) {
            res.status(400)
            throw new Error("Seu nome deve ter no mínimo dois caracteres")
        }

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
   } catch (error) {
        if (res.statusCode === 200) {
                res.status(500)
                res.send("Erro nã identificado no servidor ")
            }
        res.send(error.message)
   }
})
