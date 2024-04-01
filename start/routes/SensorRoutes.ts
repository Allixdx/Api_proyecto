import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{

    Route.get('/','SensorsController.index')
    Route.post('/','SensorsController.store')
    Route.put('/:id','SensorsController.update')
    Route.delete(':id','SensorsController.destroy').middleware('auth:api')
    
}).prefix('/api/sensor')