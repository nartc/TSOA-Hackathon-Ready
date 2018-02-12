import {authenticate, PassportStatic} from 'passport';
import {ExtractJwt, StrategyOptions} from 'passport-jwt';
import {get} from 'config';

export const authenticateUser = (passport: PassportStatic) => {

    const options: StrategyOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        secretOrKey: process.env.JWT_SECRET || get('auth.jwt_secret')
    };
};

export const expressAuthentication = authenticate('jwt', {session: false});
