import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
    Route.get('/','SensorsController.index')
    Route.post('/','SensorsController.store')
}).prefix('/api/sensor')