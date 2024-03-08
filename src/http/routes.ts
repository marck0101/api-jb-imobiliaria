import { Router, Request, Response, NextFunction } from 'express';
import { createSession } from './controllers/auth/create-session';
import { createCasa } from './controllers/casa';

export const routes = Router();

routes.get(
  '/',
  async (request: Request, response: Response, next: NextFunction) => {
    response
      .status(200)
      .json({ message: 'Welcome to the jbimobiliaria API!!' });
    console.log(next);
  },
);

routes.post('/authenticate', createSession);
routes.post('/home', createCasa);
