// start/routes.ts

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/logout', 'UsersController.logout')
  Route.get('/:id', 'UsersController.show')
  Route.post('/', 'UsersController.register')
  Route.put('/:id', 'UsersController.update')
  Route.delete('/:id', 'UsersController.destroy')
  Route.post('/login', 'UsersController.authLogin')
  Route.post('/publishEMQXTopic','EmqxController.publishEMQXTopic')
  Route.get('/foods','EdamamsController.obtenerAlimentos')
}).prefix('/api/users')
