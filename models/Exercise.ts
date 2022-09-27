import Modifier from './Modifier';

export default interface Exercise {
    name: string,
    isActive?: boolean,
    comments?: string,
    modifiers?: Modifier[],
}