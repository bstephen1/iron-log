
export default interface Exercise {
    _id: string,
    name: string,
    isActive: boolean,
    comments?: string,
    validModifierRefs: string[],
}