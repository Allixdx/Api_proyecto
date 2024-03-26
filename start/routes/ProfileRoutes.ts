// start/routes.ts

import Route from '@ioc:Adonis/Core/Route'

// Rutas públicas
Route.post('/login', 'AuthController.login')

// Rutas protegidas que requieren autenticación
Route.group(() => {
  Route.get('/profile', 'ProfileController.show')
  Route.put('/profile', 'ProfileController.update')
  Route.get('dashboard', 'UserController.dashboard')
}).middleware('auth')
