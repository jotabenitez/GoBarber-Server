import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/contollers/UserController';
import SessionController from './app/contollers/SessionController';
import FileController from './app/contollers/FileController';
import ProviderController from './app/contollers/ProviderController';
import AppointmentController from './app/contollers/AppointmentController';
import ScheduleController from './app/contollers/ScheduleController';
import NotificationController from './app/contollers/NotificationController';
import AvailableController from './app/contollers/AvailableController';

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
routes.get('/providers/:providerId/available', AvailableController.index);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/schedule', ScheduleController.index);

routes.get('/notification', NotificationController.index);
routes.put('/notification/:id', NotificationController.update);

// rotas adiciocadas p mim
routes.get('/users', UserController.show);
routes.delete('/users', UserController.delete);
routes.get('/users/all', UserController.index);

export default routes;
