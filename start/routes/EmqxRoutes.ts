import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    
    Route.post('/publishEMQXTopic','EmqxController.publishEMQXTopic')
    Route.post('/topic-retained','EmqxController.getEMQXTopic')
    Route.post('/obtenerDistancia','EmqxController.obtenerDistancia')
    Route.post('/obtenerPasos','EmqxController.obtenerPasos')
    Route.post('/obtenerRitmo','EmqxController.obtenerRitmo')

}).prefix('/api/emqx')