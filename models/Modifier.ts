
export default interface Modifier {
    id: string,
    name: string,
    isActive: boolean, //todo: change to status
    canDelete: boolean, //certain modifiers that enable special behavior can't be deleted 
}
