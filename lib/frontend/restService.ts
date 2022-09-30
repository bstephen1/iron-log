import { Dayjs } from 'dayjs'
import useSWR from 'swr'
import Exercise from '../../models/Exercise'
import { DayRecord } from '../../models/record/DayRecord'
import { DATE_FORMAT, URI_EXERCISES, URI_RECORDS } from './constants'


const fetcher = (url: any) => fetch(url).then(r => r.json())

//'use' is useSWR's convention for 'get'
export function useRecord(date: Dayjs) {
    const { data, error, mutate } = useSWR<DayRecord, any>(URI_RECORDS + date.format(DATE_FORMAT), fetcher)

    return {
        record: data,
        isError: error,
        mutate: mutate,
    }
}

export function useExercises() {
    const { data, error, mutate } = useSWR<Exercise[], any>(URI_EXERCISES, fetcher)

    return {
        exercises: data,
        isError: error,
        mutate: mutate,
    }
}

export async function createRecord(record: DayRecord) {
    fetch(URI_RECORDS + record.date, {
        method: 'POST',
        body: JSON.stringify(record)
    })
        .catch(e => console.error(e))
}

export async function updateRecord(newRecord: DayRecord) {
    fetch(URI_RECORDS + newRecord.date, {
        method: 'PUT',
        body: JSON.stringify(newRecord)
    })
        .catch(e => console.error(e))
}
