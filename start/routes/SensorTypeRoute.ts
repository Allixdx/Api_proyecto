import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
    Route.get('/','SensorTypesController.index').middleware('auth:api')
    Route.post('/','SensorTypesController.store')
    Route.put('/:id','SensorTypesController.update').middleware('auth:api')
    Route.delete('/:id','SensorTypesController.destroy').middleware('auth:api')
}).prefix('/api/sensorType')