import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{

    Route.get('/','SensorsController.index').middleware('auth:api')
    Route.post('/','SensorsController.store')
    Route.put('/:id','SensorsController.update').middleware('auth:api')
    Route.delete(':id','SensorsController.destroy').middleware('auth:api')
    
}).prefix('/api/sensor')