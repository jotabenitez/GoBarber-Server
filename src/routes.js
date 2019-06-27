import { Router } from 'express';

import UserController from './app/contollers/UserController';
import SessionController from './app/contollers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);
routes.get('/users', UserController.show);
routes.delete('/users', UserController.delete);

export default routes;
