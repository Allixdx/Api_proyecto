// start/routes.ts

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'UserController.index')
  Route.get('/:user_id', 'UserController.show')
  Route.post('/', 'UserController.store')
  Route.put('/:user_id', 'UserController.update')
  Route.delete('/:user_id', 'UserController.destroy')
  Route.post('/login', 'UserController.authLogin')
}).prefix('/api/users')
