import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
    Route.get('/obteneralimento','EdamamsController.findFood')
    Route.post('/calculatenutrition','EdamamsController.calculateNutrition')
}).prefix('/api/foods').middleware('auth:api')