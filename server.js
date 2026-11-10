import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import pool from './db.js'
import dotwnv from 'dotenv/config'

const PORT = 3000
const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'))
const JWT_PASSWORD = process.env.JWT_SENHA
const SALT = await bcrypt.genSalt(10)

app.get('/', (req, res) =>{
    res.redirect('/login.html')
})

//ROTAS DE REGISTRO E LOGIN//

app.post('/register', async (req, res) =>{
    const {nome, email, senha} = req.body;
    const senhaHash = await bcrypt.hash(senha, SALT)
    try{
        const postUser = await pool.query("INSERT INTO usuario (nome, email, senha) VALUES ($1, $2, $3) RETURNING *", [nome, email, senhaHash])
        return res.status(201).json(postUser.rows[0])
    } catch(err){
        return res.status(400).json("Erro ao registrar usuário")
    }
})

app.post('/login', async (req, res) =>{
    try {
        const {email, senha} = req.body;

        const login = await pool.query("SELECT * FROM usuario WHERE email = $1", [email])

        if (login.rows.length === 0){
            return res.status(400).json({erro: "credenciais inválidas"})
        }

        const colaborador = login.rows[0]

        if (colaborador.email !== email){
            return res.status(400).json({erro: "credenciais inválidas"})
        }

        const isPasswordValid = await bcrypt.compare(senha, colaborador.senha)
        if (!isPasswordValid){
            return res.status(400).json({erro: "credenciais inválidas"})
        }

        return res.status(200).json({
            mensagem: "login realizado",
            user:{
                "nome": colaborador.nome
            }
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: "Erro interno no servidor" })
    }
})


//ROTAS DE GERENCIAMENTO DE SOLICITANTES//

app.post('/solicitante', async (req, res)=>{
    const {nome, email, telefone} = req.body;
    const telefoneHash = await bcrypt.hash(telefone, SALT)
    try{
        const postSolicitante = await pool.query("INSERT INTO solicitante (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *", [nome, email, telefoneHash])
        return res.status(201).json(postSolicitante.rows[0])
    }catch(err){
        return res.status(400).json("Erro ao registrar solicitante.")
    }
})

app.get('/solicitante', async (req, res) =>{
    try{
        const getSolcitante = await pool.query("SELECT * FROM solicitante")
        return res.status(200).json(getSolcitante.rows[0])
    } catch(err){
        console.log("Erro ao buscar solicitantes.")
    }
})

app.put('/solicitante/:id', async (req, res) =>{
    const {id} = req.params;
    const {nome, email, telefone} = req.body;
    const telefoneHash = await bcrypt.hash(telefone, SALT)
    try{
        const putSolicitante = await pool.query("UPDATE solicitante SET nome = $1, email = $2, telefone = $3 WHERE id = $4 RETURNING *", [nome, email, telefoneHash, id])
        return res.status(200).json(putSolicitante.rows[0])
    }catch(err){
        return res.status(400).json("Erro ao atualizar solicitante")
    }
})

app.delete('/solicitante/:id', async (req, res)=>{
    const {id} = req.params;
    try{
        const deleteSolicitante = await pool.query("DELETE FROM solicitante WHERE id = $1 RETURNING *", [id])
        return res.status(200).json("Usuário deletado com sucesso")
    } catch(err){
        return res.status(400);json("Erro ao deletar solicitante.")
    }
})

//ROTAS DE CHAMADO TÉCNICO//

app.post('/chamado', async (req, res) =>{
    const {servico, data_chamado, id_solicitante} = req.body;
    try{
        const postChamado = await pool.query("INSERT INTO chamado (servico, data_chamado, id_solicitante) VALUES ($1, $2, $3) RETURNING *", [servico, data_chamado, id_solicitante])
        return res.status(201).json(postChamado.rows[0])
    } catch(err){
        return res.status(400).json("Erro ao abrir chamado.")
    }
})

app.get('/chamado', async (req, res) =>{
    try{
        const getChamado = await pool.query("SELECT * FROM chamado")
        return res.status(200).json(getChamado.rows[0])
    } catch(err) {
        return res.status(400).json("Erro ao buscrar chamados")
    }
})

app.put('/chamado/:id', async (req, res) =>{
    const {id} = req.params;
    const {servico, data_chamado, id_solicitante} = req.body;
    try{
        const putChamado = await pool.query("UPDATE chamado SET servico = $1, data_chamado = $2, id_solicitante = $3 WHERE id = $4 RETURNING *", [servico, data_chamado, id_solicitante, id])
        return res.status(200).json(putChamado.rows[0])
    } catch(err){
        return res.status(400).json("Erro ao atualizar chamado.")
    }
})

app.delete('chamado/:id', async (req, res)=>{
    const {id} = req.params;
    try{
        const deleteChamado = await pool.query("DELETE FROM chamado WHERE id = $1 RETURNING *", [id])
        return res.status(200).json("Chamado fechado com sucesso.")
    } catch(err){
        return res.status(400).json("Erro ao deletar chamado")
    }
})

app.listen(PORT, () =>{
    console.log(`Servidor rodando na porta: ${PORT}`)
})