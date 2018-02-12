/* tslint:disable */
import { error } from 'util';

import { Controller, ValidateParam, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import * as passport from 'passport';
import { expressAuthentication } from './middlewares/security/Passport';

const models: TsoaRoute.Models = {
};

export function RegisterRoutes(app: any) {


    function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode;
                if (controllerObj instanceof Controller) {
                    const controller = controllerObj as Controller
                    const headers = controller.getHeaders();
                    Object.keys(headers).forEach((name: string) => {
                        response.set(name, headers[name]);
                    });

                    statusCode = controller.getStatus();
                }

                if (data) {
                    response.status(statusCode || 200).json(data);
                } else {
                    response.status(statusCode || 204).end();
                }
            })
            .catch((error: any) => response.status(500).json(error));
    }

    function getValidatedArgs(args: any, request: any): any[] {
        const errorFields: FieldErrors = {};
        const values = Object.keys(args).map(function(key) {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return ValidateParam(args[key], request.query[name], models, name, errorFields);
                case 'path':
                    return ValidateParam(args[key], request.params[name], models, name, errorFields);
                case 'header':
                    return ValidateParam(args[key], request.header(name), models, name, errorFields);
                case 'body':
                    return ValidateParam(args[key], request.body, models, name, errorFields);
                case 'body-prop':
                    return ValidateParam(args[key], request.body[name], models, name, errorFields);
                case 'formData':
                    return ValidateParam(args[key], request.file, models, name, errorFields);
            }
        });

        if (Object.keys(errorFields).length > 0) {
            throw new ValidateError(errorFields, '');
        }
        return values;
    }
}
