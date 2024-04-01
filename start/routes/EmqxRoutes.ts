import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    
    Route.post('/publishEMQXTopic','EmqxController.publishEMQXTopic')
    Route.post('/topic-retained','EmqxController.getEMQXTopic')
    Route.post('/obtenerDistancia','EmqxController.obtenerDistancia')
    Route.post('/obtenerPasos','EmqxController.obtenerPasos')
    Route.post('/obtenerRitmo','EmqxController.obtenerRitmo')
    Route.post('/obtenerAlcohol','EmqxController.obtenerAlcohol')
    Route.post('/MandarAPantalla','EmqxController.MandarAPantalla')
    Route.post('/obtenerTemperatura','EmqxController.obtenerTemperatura')
    Route.post('/obtenerPeso','EmqxController.obtenerPeso')
}).prefix('/api/emqx').middleware('auth:api')