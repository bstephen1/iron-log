import { Pool } from 'pg'

//pool handles managing the client connections
const pool = new Pool()

export async function test() {
    try {
        const res = await pool.query('select * from exercise')
        return res.rows
    } catch (e) {
        console.log(e)
    }
}