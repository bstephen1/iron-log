import { Button, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export default function LogEntryClock() {
    const [initialTime, setInitialTime] = useState(dayjs().valueOf())
    const [initialRestTime, setInitialRestTime] = useState(dayjs().valueOf())
    const [running, setRunning] = useState(false)
    const [deltaTime, setDeltaTime] = useState(0)
    const [deltaRestTime, setDeltaRestTime] = useState(0)
    const millisecondsPerInterval = 1000 //can be off by ~15ms based on when interval executes

    function startClock() {
        setInitialTime(dayjs().valueOf())
        setInitialRestTime(dayjs().valueOf())
        setRunning(true)
    }

    function stopClock() {
        setRunning(false)
    }

    function resetClock() {
        setDeltaTime(0)
        setDeltaRestTime(0)
        setRunning(false)
    }

    function resetRestClock() {
        setInitialRestTime(dayjs().valueOf())
        setDeltaRestTime(0)
    }

    function formatDeltaTime(milliseconds: number) {
        const totalSeconds = milliseconds / 1000
        const hours = ('0' + Math.floor(totalSeconds / 3600)).slice(-2)
        const minutes = ('0' + Math.floor((totalSeconds / 60) % 60)).slice(-2)
        const seconds = ('0' + Math.floor(totalSeconds % 60)).slice(-2)

        return `${hours}:${minutes}:${seconds}`
    }

    useEffect(() => {
        if (!running) return

        const interval = setInterval(() => {
            //calculating a delta is more accurate and reliable than incrementing the time 
            //based on the interval (esp when the app loses focus)
            setDeltaTime(dayjs().valueOf() - initialTime)
            setDeltaRestTime(dayjs().valueOf() - initialRestTime)
        }, millisecondsPerInterval)

        return () => clearInterval(interval)
    }, [running])


    useEffect(() => {
        console.log(initialRestTime)
        console.log(deltaRestTime)
    }, [deltaRestTime])

    return (
        <Stack direction='row'>
            <Typography>Total time: {formatDeltaTime(deltaTime)}</Typography>
            <Typography>Rest time: {formatDeltaTime(deltaRestTime)}</Typography>
            <Button onClick={startClock}>Start Session Clock</Button>
            <Button onClick={stopClock}>Pause Clock</Button>
            <Button onClick={resetClock}>Reset Clock</Button>
            <Button onClick={resetRestClock}>Reset Rest Clock</Button>
        </Stack>
    )

}