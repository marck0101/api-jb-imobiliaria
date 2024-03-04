import { Router, Request, Response, NextFunction } from 'express'

import { createSession } from './controllers/auth/create-session'
// import { getCep } from './controllers/ceps/get-cep'
// import { getCfop } from './controllers/cfops/get-cfop'
// import { getCnpj } from './controllers/cnpjs/get-cnpj'

// import {
//   createCteos,
//   deleteCteos,
//   fetchCteos,
//   updateCteos,
// } from './controllers/cteos'
// import {
//   createVehicle,
//   deleteVehicle,
//   fetchVehicles,
//   updateVehicle,
// } from './controllers/vehicles'
// import {
//   createTrip,
//   deleteTrip,
//   fetchTrips,
//   updateTrip,
// } from './controllers/trips'

// import { createCustomer } from './controllers/customers/create-customer'
// import { fetchCustomers } from './controllers/customers/fetch-customers'
// import { updateCustomer } from './controllers/customers/update-customers'
// import { deleteCustomer } from './controllers/customers/delete-customer'
import { createCasa } from './controllers/casa'

// import auth from './middlewares/auth';

export const routes = Router()

routes.get(
  '/',
  async (request: Request, response: Response, next: NextFunction) => {
    response.status(200).json({ message: 'Welcome to the jbimobiliaria API!!' })
    console.log(next)
  }
)

routes.post('/authenticate', createSession)

routes.post('/home', createCasa)
// routes.get('/home/:id*?', fetchTrips)
// routes.put('/home/:id', updateTrip)
// routes.delete('/home/:id', deleteTrip)
