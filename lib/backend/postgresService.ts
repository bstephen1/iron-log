import { Pool } from 'pg'
import { ExerciseStatus } from '../../models/ExerciseStatus'

//pool handles managing the client connections
const pool = new Pool()

export async function fetchExercises() {
    try {
        const res = await pool.query('select exercise_id as id, e.name, cues, s.name as status from exercise e join exercise_status s using (exercise_status_id)')
        return res.rows
    } catch (e) {
        console.error(e)
    }
}

export async function fetchExercisesWithStatus(status: string) {
    if (!Object.values(ExerciseStatus).includes(status as ExerciseStatus)) {
        console.warn('invalid status: ' + status)
        return []
    }

    try {
        const res = await pool.query('select exercise_id as id, e.name, cues, s.name as status from exercise e join exercise_status s using (exercise_status_id) where s.name = $1', [status])
        return res.rows
    } catch (e) {
        console.error(e)
    }
}