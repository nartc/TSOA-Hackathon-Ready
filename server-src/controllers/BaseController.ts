import {Controller} from 'tsoa';
import {MongoError} from 'mongodb';
import {IErrorResponse} from '../models/responses/IErrorResponse';

export class BaseController extends Controller {
    public static resolveErrorResponse(error: MongoError | null, message: string): IErrorResponse {
        return {
            thrown: true,
            error,
            message
        };
    }
}