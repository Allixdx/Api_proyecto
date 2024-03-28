import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    
    Route.post('/publishEMQXTopic1','EmqxController.publishEMQXTopic1')
    Route.post('/topic-retained','EmqxController.getEMQXTopic')
    Route.post('/obtenerDistancia','EmqxController.obtenerDistancia')
    Route.post('/obtenerPasos','EmqxController.obtenerPasos')
    Route.post('/obtenerRitmo','EmqxController.obtenerRitmo')

}).prefix('/api/emqx')