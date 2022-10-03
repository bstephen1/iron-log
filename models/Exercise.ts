import { ObjectId } from 'mongodb';
import Modifier from './Modifier';

export default interface Exercise {
    _id: ObjectId,
    name: string,
    isActive: boolean,
    comments?: string,
    validModifiers: Modifier[],
}