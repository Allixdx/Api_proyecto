import EdamamResource from "App/Resources/EdamamResource";
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SensorType from "App/Models/SensorType";
import axios from 'axios';
import Env from '@ioc:Adonis/Core/Env';

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
/**
 * @swagger
 * /api/foods/calculatenutrition:
 *   post:
 *     tags:
 *       - Foods
 *     summary: Calcular información nutricional basada en uno o más alimentos y el peso total.
 *     description: Calcula información nutricional basada en uno o más alimentos específicos y el peso total proporcionado en gramos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ingr:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de ingredientes en el formato "cantidad unidad nombre".
 *     responses:
 *       200:
 *         description: Información nutricional calculada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uri:
 *                   type: string
 *                   description: URI única para la receta.
 *                 yield:
 *                   type: number
 *                   description: Rendimiento de la receta.
 *                 calories:
 *                   type: number
 *                   description: Calorías totales de la receta.
 *                 totalCO2Emissions:
 *                   type: number
 *                   description: Emisiones totales de CO2 de la receta.
 *                 co2EmissionsClass:
 *                   type: string
 *                   description: Clasificación de las emisiones de CO2 de la receta.
 *                 totalWeight:
 *                   type: number
 *                   description: Peso total de la receta en gramos.
 *                 dietLabels:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Etiquetas de dieta para la receta.
 *                 healthLabels:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Etiquetas de salud para la receta.
 *                 totalNutrients:
 *                   type: object
 *                   description: Datos nutricionales totales de la receta.
 *                 totalDaily:
 *                   type: object
 *                   description: Porcentaje diario de los nutrientes totales de la receta.
 *       400:
 *         description: Error al procesar la solicitud debido a datos faltantes o incorrectos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Descripción del error.
 *       404:
 *         description: El alimento no fue encontrado en la base de datos externa.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Descripción del error.
 *       500:
 *         description: Error interno al calcular la información nutricional.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Descripción del error.
 */

public async calculateNutrition({ request, response }) {
  try {
    const sensorType = await SensorType.findBy('name', 'Peso');

    if (!sensorType) {
      console.error('La unidad "gr" no se encontró en la base de datos.');
      return response.status(400).json({ error: 'La unidad "peso" no se encontró en la base de datos.' });
    }
    const unit = sensorType.unit;
    const body = request.all();

    console.log('Title:', body.title);
    console.log('Ingredients:', body.ingr);
    console.log ('unidad',{unit});
   
    const requestData = {
      title:'x', 
      ingr: body.ingr.map(ingredient => `${ingredient} ${unit}`)
    };

    const params = {
      app_id: '0ca38ce0',
      app_key: '6d1af65e035c952a1ab92ee42668d728'
    };

    const edamamResponse = await axios.post('https://api.edamam.com/api/nutrition-details', requestData, { params });

    return response.json(edamamResponse.data);
  } catch (error) {
    console.error('Error al calcular la información nutricional:', error);
    return response.status(500).json({ error: 'Ocurrió un error al calcular la información nutricional.', errorMessage: error.message });
  }
}


  
}
