import {Document} from 'mongoose';

export interface IBaseRepository<T extends Document> {
    getAll();

    getById(id: string);

    getByIds(ids: string[]);

    getOne(value: any, queryBy: string);

    create(newResource: T);

    update(id: string, updatedResource: T);

    delete(id: string);

}