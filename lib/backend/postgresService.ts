import { Pool } from 'pg'
import { ExerciseStatus } from '../../models/ExerciseStatus'

//pool handles managing the client connections
const pool = new Pool()

export async function fetchExercises() {
    try {
        const res = await pool.query('select exercise_id as id, e.name, cues, s.name as status from exercise e join exercise_status s using (exercise_status_id)')
        await Promise.all(res.rows.map(async (exercise) => exercise.validModifiers = await fetchValidModifiersForExercise(exercise.id)))
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
        await Promise.all(res.rows.map(async (exercise) => exercise.validModifiers = await fetchValidModifiersForExercise(exercise.id)))
        return res.rows
    } catch (e) {
        console.error(e)
    }
}

export async function fetchSession(date: string) {
    try {
        const res = await pool.query('select session_id as id, date from session where date = $1', [date])
        const session = res.rows[0]
        session.records = await fetchRecordsForSession(session.id)
        return session
    } catch (e) {
        console.error(e)
    }
}

async function fetchRecordsForSession(sessionId: number) {
    const res = await pool.query('select r.record_id as id, e.name as exercise, e.cues, r.type from session join record r using (session_id) join exercise e using (exercise_id) where session_id = $1', [sessionId])
    const records = res.rows
    await Promise.all(records.map(async (record) => record.sets = await fetchSetsForRecord(record.id)))
    return records
}

async function fetchSetsForRecord(recordId: number) {
    const res = await pool.query('select weight_kg as weight, reps, rpe, bodyweight_kg as bodyweight from record r join set s using (record_id) where record_id = $1', [recordId])
    return res.rows
}


async function fetchValidModifiersForExercise(exerciseId: number) {
    const res = await pool.query('select m.name from exercise_valid_modifier join modifier m using (modifier_id) where exercise_id = $1', [exerciseId])
    return res.rows
}

