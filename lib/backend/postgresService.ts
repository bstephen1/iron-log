import { Pool } from 'pg'

//pool handles managing the client connections
const pool = new Pool()

export async function fetchAllExercises() {
    try {
        const res = await pool.query('select exercise_name, is_active, comments from exercise ')
        return res.rows
    } catch (e) {
        console.error(e)
    }
}

export async function fetchActiveExercises() {
    try {
        const res = await pool.query('select exercise_name, comments from exercise where is_active = true')
        return res.rows
    } catch (e) {
        console.error(e)
    }
}