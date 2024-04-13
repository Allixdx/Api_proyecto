import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    
    Route.post('/publish-emqx-topic','EmqxController.publishEMQXTopic')
    Route.post('/topic-retained','EmqxController.getEMQXTopic')
    Route.post('/obtener-distancia','EmqxController.obtenerDistancia')
    Route.post('/obtene-pasos','EmqxController.obtenerPasos')
    Route.post('/obtener-ritmo','EmqxController.obtenerRitmo')
    Route.post('/obtener-alcohol','EmqxController.obtenerAlcohol')
    Route.post('/mandar-a-pantalla','EmqxController.MandarAPantalla')
    Route.post('/obtener-temperatura','EmqxController.obtenerTemperatura')
    Route.post('/obtener-peso','EmqxController.obtenerPeso')
}).prefix('/api/emqx').middleware('auth:api')