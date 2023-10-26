import SessionLog from 'models/SessionLog'
import { createContext, useContext } from 'react'

export interface SessionLogContext {
  sessionLog: SessionLog | null
  date: string
}

export const defaultSessionLogContext: SessionLogContext = {
  sessionLog: null,
  date: '',
}

export const SessionLogContext = createContext<SessionLogContext>(undefined!)

export const useSessionLogContext = () => useContext(SessionLogContext)
