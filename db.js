import 'dotenv/config'
import { Pool } from 'pg'

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "senai",
    port: 5432,
    database: "PROVA_WILLER_10/11"
})

export default pool