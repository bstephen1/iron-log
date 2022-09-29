import { Dayjs } from 'dayjs'
import useSWR from 'swr'
import Exercise from '../../models/Exercise'
import { DayRecord } from '../../models/record/DayRecord'
import { DATE_FORMAT } from './utils'

const fetcher = async (
    input: RequestInfo,
    init: RequestInit,
    ...args: any[]
) => {
    const res = await fetch(input, init);
    return res.json();
};

export function useRecord(date: Dayjs) {
    const { data, error } = useSWR<DayRecord, any>('/api/records/' + date.format(DATE_FORMAT), fetcher)

    return {
        record: data,
        isError: error,
    }
}

export function useExercises() {
    const { data, error } = useSWR<Exercise[], any>('/api/exercises', fetcher)

    return {
        exercises: data,
        isError: error,
    }
}