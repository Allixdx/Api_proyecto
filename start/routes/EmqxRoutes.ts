import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.post('/publishEMQXTopic','EmqxController.publishEMQXTopic')
    Route.post('/topic-retained','EmqxController.getEMQXTopic')
}).prefix('/api/emqx')