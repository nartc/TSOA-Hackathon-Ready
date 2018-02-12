import {Document} from 'mongoose';

export interface IBaseRepository<T extends Document> {
    getAll(): Promise<T[]>;
    getById(id: string): Promise<T>;
    create(newResource: T): Promise<T>;
    update(id: string, updatedResource: T): Promise<T>;
    delete(id: string): Promise<T>;
}