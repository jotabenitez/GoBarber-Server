import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/contollers/UserController';
import SessionController from './app/contollers/SessionController';
import FileController from './app/contollers/FileController';
import ProviderController from './app/contollers/ProviderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// Rotas
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

// rotas do curso
routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);

routes.post('/files', upload.single('file'), FileController.store);

// rotas adiciocadas p mim
routes.get('/users', UserController.show);
routes.delete('/users', UserController.delete);

export default routes;
