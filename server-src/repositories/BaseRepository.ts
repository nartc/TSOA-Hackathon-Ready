import {Document, Model} from 'mongoose';
import {IBaseRepository} from './interfaces/IBaseRepository';

export class BaseRepository<T extends Document> implements IBaseRepository<T> {

    private _model: Model<T>;

    constructor(model: Model<T>) {
        this._model = model;
    }

    async getAll(): Promise<T[]> {
        return await this._model.find().exec();
    }

    async getById(id: string): Promise<T> {
        return await this._model.findById(id).exec();
    }

    async getByIds(ids: string[]): Promise<T[]> {
        return await this._model.find({_id: {$in: ids}}).exec();
    }

    async create(newResource: T): Promise<T> {
        return await this._model.create(newResource);
    }

    async update(id: string, updatedResource: T): Promise<T> {
        return await this._model.findByIdAndUpdate(id, updatedResource).exec();
    }

    async delete(id: string): Promise<T> {
        return await this._model.findByIdAndRemove(id).exec();
    }
}