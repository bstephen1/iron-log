
export default interface Modifier {
    _id: string,
    name: string,
    isActive: boolean,
    canDelete: boolean, //certain modifiers that enable special behavior can't be deleted 
}
