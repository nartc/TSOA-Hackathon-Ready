import {Document} from 'mongoose';

export interface BaseModel extends Document {
    _id: string;
    createdOn?: Date;
    updatedOn?: Date;
}