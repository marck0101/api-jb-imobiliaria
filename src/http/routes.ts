import { Router, Request, Response, NextFunction } from 'express';

import { createSession } from './controllers/auth/create-session';
import { getCep } from './controllers/ceps/get-cep';
import { getCfop } from './controllers/cfops/get-cfop';
import { getCnpj } from './controllers/cnpjs/get-cnpj';

import {
  createCteos,
  deleteCteos,
  fetchCteos,
  updateCteos,
} from './controllers/cteos';
import {
  createVehicle,
  deleteVehicle,
  fetchVehicles,
  updateVehicle,
} from './controllers/vehicles';
import {
  createTrip,
  deleteTrip,
  fetchTrips,
  updateTrip,
} from './controllers/trips';

import { createCustomer } from './controllers/customers/create-customer';
import { fetchCustomers } from './controllers/customers/fetch-customers';
import { updateCustomer } from './controllers/customers/update-customers';
import { deleteCustomer } from './controllers/customers/delete-customer';

// import auth from './middlewares/auth';

export const routes = Router();

routes.get(
  '/',
  async (request: Request, response: Response, next: NextFunction) => {
    response.status(200).json({ message: 'Welcome to the VDR Petri API!!' });
    console.log(next);
  },
);

routes.post('/authenticate', createSession);

// routes.use('/vehicles', auth);
// routes.use('/cteos', auth);
// routes.use('/ceps', auth);
// routes.use('/cfops', auth);
// routes.use('/cfops', auth);

routes.post('/vehicles', createVehicle);
routes.get('/vehicles/:id*?', fetchVehicles);
routes.delete('/vehicles/:id', deleteVehicle);
routes.put('/vehicles/:id', updateVehicle);

routes.post('/cteos', createCteos);
routes.get('/cteos', fetchCteos);
routes.post('/cteos/webhooks', updateCteos);
routes.delete('/cteos/:id', deleteCteos);

routes.get('/ceps/:cep', getCep);
routes.get('/cfops/:cfop', getCfop);
routes.get('/cfops/:cnpj', getCnpj);
routes.get('/cnpjs/:cnpj', getCnpj);

routes.post('/customers', createCustomer);
routes.get('/customers/:id*?', fetchCustomers);
routes.put('/customers/:id', updateCustomer);
routes.delete('/customers/:id', deleteCustomer);

routes.post('/trips', createTrip);
routes.get('/trips/:id*?', fetchTrips);
routes.put('/trips/:id', updateTrip);
routes.delete('/trips/:id', deleteTrip);
