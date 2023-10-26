import Record from 'models/Record'
import { createContext, useContext } from 'react'
// todo: could change to just directly being a record, or just the id
// supposedly wrapping in an object prevents the object from changing and triggering
// a rerender. But it's still rerendering the whole record card anyway.
export interface RecordContext {
  record: Record
}

export const defaultRecordContext: RecordContext = {
  record: new Record('2000-01-01'),
}

export const RecordContext = createContext<RecordContext>(defaultRecordContext)

export const useRecordContext = () => useContext(RecordContext)
