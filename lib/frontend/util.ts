import { v4 as uuidv4 } from 'uuid';


//manually create a globally unique id across all tables. This should be used for ALL new records
//we want to manually handle the IDs so that ID generation is not tied to the specific database being used,
//and to ensure no information is leaked from the ID (eg, userId=55 implies users 1-54 exist)
export function generateId() {
    return uuidv4()
}