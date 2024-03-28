import EdamamResource from "App/Resources/EdamamResource";
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios';


interface FoodNutrients {
  ENERC_KCAL: number; // Energía en kilocalorías (calorías)
  PROCNT: number; // Proteínas en gramos
  FAT: number; // Grasas en gramos
  CHOCDF: number; // Carbohidratos en gramos
  FIBTG: number; // Fibra en gramos
}
export default class EdamamsController {
  /**
   * @swagger
   * /api/foods:
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
 * @swagger
 * /api/foods/obteneralimento:
 *   get:
 *     tags:
 *       - Foods
 *     summary: Obtener información sobre un alimento específico.
 *     description: Obtiene información sobre un alimento específico basado en el nombre proporcionado.
 *     parameters:
 *       - in: query
 *         name: nombrealimento
 *         description: Nombre del alimento que se desea buscar.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Información sobre el alimento obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito.
 *                 data:
 *                   type: object
 *                   properties:
 *                     food:
 *                       type: object
 *                       description: Información sobre el alimento.
 *                     weight:
 *                       type: number
 *                       description: Peso total del alimento en gramos.
 *       400:
 *         description: Error al obtener información sobre el alimento.
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
public async findFood({ request, response }: HttpContextContract) {
  try {
      const nombrealimento = request.input('nombrealimento'); // Obtener el nombre del alimento de la consulta
    
      if (!nombrealimento) {
          return response.badRequest({ error: 'Por favor, proporciona el nombre del alimento.' });
      }

      const alimento = await EdamamResource.getfood(nombrealimento);
      
      console.log('Respuesta de la API de Edamam:', alimento); // Agregar este console.log para verificar la respuesta de la API

      return response.ok(alimento);
  } catch (error) {
      console.error('Error al buscar el alimento:', error.message);
      return response.status(500).json({ error: 'Ocurrió un error al buscar el alimento.' });
  }
}
}



  

