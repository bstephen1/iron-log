import Modifier from './Modifier';

export default interface Exercise {
    name: string,
    active?: boolean,
    comments?: string,
    modifiers?: Modifier[],
}