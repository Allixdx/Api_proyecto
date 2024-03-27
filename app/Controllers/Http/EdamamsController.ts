import EdamamResource from "App/Resources/EdamamResource";
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from "axios";

export default class EdamamsController {
  /**
   * @swagger
   * /api/users/foods:
   *   get:
   *     tags:
   *       - Foods
   *     summary: Obtener información sobre todos los alimentos.
   *     description: Obtiene información sobre todos los alimentos disponibles en la base de datos de Edamam.
   *     responses:
   *       200:
   *         description: Información sobre los alimentos obtenida correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Mensaje de éxito.
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       food:
   *                         type: object
   *                         description: Información sobre el alimento.
   *                       weight:
   *                         type: number
   *                         description: Peso total del alimento en gramos.
   *       400:
   *         description: Error al obtener información sobre los alimentos.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Mensaje de error.
   *                 error:
   *                   type: string
   *                   description: Descripción del error.
   */
  public async obtenerAlimentos({ response }: HttpContextContract) {
    try {
      const alimentos = await EdamamResource.getAllFoods();
      return response.ok({ message: 'Información sobre los alimentos obtenida correctamente.', data: alimentos });
    } catch (error) {
      console.error('Error al obtener información sobre los alimentos:', error.message);
      throw error;
    }
  }
  /**
   * 
   * @swagger
   * /api/edamam:
   *  get:
   *    tags:
   *      - Edamam
   *    summary:  List food 
   *    produces:
   *      - application/json
   *    responses:
   *      200:
   *        description:  Success!!
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                title:
   *                  type: string
   *                  description: title
   *                data:
   *                  type: string
   *                  description:  data  
   */
  public async comida({response, params}:HttpContextContract){
    const res = await axios.get(`https://api.edamam.com/api/food-database/v2/parser?app_id=682c72ac&app_key=%20b1f12eef79856885a89a3787aeb39a9e&nutrition-type=logging`)
    return response.status(200).send({
      title:'Success!!',
      message:'List of food',
      data:res.data
    })
  }
}



  

