import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
    Route.get('/','ConfigurationsController.index')
    Route.post('/','ConfigurationsController.store')
    Route.get('/:id','ConfigurationsController.show')
    Route.put('/:id','ConfigurationsController.update')
    Route.delete('/:id','ConfigurationsController.destroy')
    Route.get('/user-conf/:id','ConfigurationsController.userConfiguration')
}).prefix('/api/configurations').middleware('auth:api')