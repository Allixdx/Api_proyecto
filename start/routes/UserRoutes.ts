// start/routes.ts

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'UsersController.index')
  Route.get('/:user_id', 'UsersController.show')
  Route.post('/', 'UsersController.store')
  Route.put('/:user_id', 'UsersController.update')
  Route.delete('/:user_id', 'UsersController.destroy')
  Route.post('/login', 'UsersController.authLogin')
  Route.post('/publishEMQXTopic','emqx.publishEMQXTopic')
}).prefix('/api/users')
