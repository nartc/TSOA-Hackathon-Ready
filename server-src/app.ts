import * as mongoose from 'mongoose';
import {connect, Connection, Mongoose} from 'mongoose';
import * as express from 'express';
import {Application, Request, Response} from 'express';
import {get} from 'config';
import * as cors from 'cors';
import * as logger from 'morgan';
import * as swaggerUI from 'swagger-ui-express';
import * as passport from 'passport';
import {initialize, session} from 'passport';
import {MongoError} from 'mongodb';
import {json, urlencoded} from 'body-parser';
import {setupLogging, winstonLogger} from './middlewares/common/WinstonLogger';
import {APIDocsRouter} from './middlewares/common/Swagger';
import {authenticateUser} from './middlewares/security/Passport';
import {RegisterRoutes} from './routes';

class App {
    public mongooseConnection: Connection;
    public app: Application;
    private environmentHost: string = process.env.NODE_ENV || 'Development';
    private apiDocsRouter: APIDocsRouter = new APIDocsRouter();

    constructor() {
        this.app = express();
        setupLogging(this.app);
        this.configure();
    }

    private configure(): void {
        /**
         * Connect to Mongo Database
         */
        (mongoose as Mongoose).Promise = global.Promise;
        connect(process.env.MONGO_URI || get('mongo.mongo_uri'))
            .then(() => {
                /**
                 * on connectionSuccess
                 */
                this.mongooseConnection = mongoose.connection;
                App.onMongoConnection();
            })
            .catch((error: MongoError) => {
                /**
                 * on connectionError
                 * @type {MongoError}
                 */
                App.onMongoConnectionError(error);
            });

        /**
         * CORS Middleware
         */
        this.app.use(cors());
        this.app.options('*', cors());

        /**
         * Morgan Middleware
         */
        this.environmentHost === 'Development'
            ? this.app.use(logger('combined'))
            : this.app.use(logger('common'));

        /**
         * BodyParser Middleware
         */
        this.app.use(json());
        this.app.use(urlencoded({
            extended: false,
            limit: '5mb',
            parameterLimit: 5000
        }));

        /**
         * Passport Middleware
         */
        this.app.use(initialize());
        this.app.use(session());
        authenticateUser(passport);

        /**
         * SwaggerUI
         */
        this.app.use('/', this.apiDocsRouter.getRouter());
        this.app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(null, {
            explorer: true,
            swaggerOptions: {
                docExpansion: 'none'
            },
            swaggerUrl: this.environmentHost === 'Development'
                ? `http://${get('express.host')}:${get('express.port')}/api/docs/swagger.json`
                : `https://${get('express.host')}/api/docs/swagger.json`
        }));

        /**
         * Test / Route
         */
        this.app.get('/', (req: Request, res: Response) => {
            res.send('Server worked');
        });

        /**
         * Load Routes
         */
        RegisterRoutes(this.app);
    }

    private static onMongoConnection(): void {
        winstonLogger.info(
            `-------------
       Connected to Database
      `
        );
    }

    private static onMongoConnectionError(error: MongoError): void {
        winstonLogger.error(
            `-------------
       Error on connection to database: ${error}
      `
        );
    }
}

export default new App();