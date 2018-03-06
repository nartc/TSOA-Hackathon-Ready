import {Document} from 'mongoose';

export interface Base extends Document {
    createdAt?: Date;
    updatedAt?: Date;
}

export interface BaseVm {
    createdAt?: Date;
    updatedAt?: Date;
    _id?: string;
}