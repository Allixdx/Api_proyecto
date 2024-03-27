import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
    Route.get('/','EdamamsController.comida')
    Route.get('/obteneralimento','EdamamsController.findFood')
}).prefix('/api/foods')