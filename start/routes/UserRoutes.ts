// start/routes.ts

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/','UsersController.index')

  Route.post('/codeVerify/:id','UsersController.SendCodigo')
  
  Route.post('/logout', 'UsersController.logout').middleware('auth:api')

  Route.get('/:id', 'UsersController.show')

  Route.post('/', 'UsersController.register')

  Route.put('/:id', 'UsersController.update').middleware('auth:api')

  Route.delete('/:id', 'UsersController.destroy').middleware('auth:api')

  Route.post('/authlogin', 'UsersController.authLogin')

  Route.get('/foods','EdamamsController.obtenerAlimentos')

  Route.post('/publishEMQXTopic','EmqxController.publishEMQXTopic')

  Route.get('/obtenerMensajesDelTopico','EmqxController.obtenerMensajesDelTopico')

  Route.post('/login','UsersController.login')

  Route.post('/recuperar-contra','UsersController.correorecuperacion')

  Route.put('/update-password/:id','UsersController.updatePassword')

}).prefix('/api/users')