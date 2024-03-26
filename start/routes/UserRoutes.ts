// start/routes.ts

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/','UsersController.index')
  
  Route.post('/logout', 'UsersController.logout')

 Route.get('/:id', 'UsersController.show')

  Route.post('/', 'UsersController.register')

  Route.put('/:id', 'UsersController.update')

  Route.delete('/:id', 'UsersController.destroy')

  Route.post('/authlogin', 'UsersController.authLogin')

  Route.get('/foods','EdamamsController.obtenerAlimentos')

  Route.post('/publishEMQXTopic','EmqxController.publishEMQXTopic')

  Route.get('/obtenerMensajesDelTopico','EmqxController.obtenerMensajesDelTopico')

  Route.post('/login','UsersController.login')

  Route.put('/update-password/:id','UsersController.updatePassword')

}).prefix('/api/users')
