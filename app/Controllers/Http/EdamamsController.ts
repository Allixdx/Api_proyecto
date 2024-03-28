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
      const nombrealimento = request.input('nombrealimento');

      if (!nombrealimento) {
        return response.badRequest({ error: 'Por favor, proporciona el nombre del alimento.' });
      }

      const alimento = await EdamamResource.getfood(nombrealimento);

      if (!alimento || (alimento.parsed.length === 0 && alimento.hints.length === 0)) {
        return response.notFound({ error: 'El alimento no existe.' });
      }

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
   *     summary: Calcular información nutricional basada en un alimento y el último peso registrado.
   *     description: Calcula información nutricional basada en un alimento específico y el último peso registrado en el sistema.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nombrealimento:
   *                 type: string
   *                 description: Nombre del alimento del cual se desea calcular la información nutricional.
   *     responses:
   *       200:
   *         description: Información nutricional calculada correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 food:
   *                   type: string
   *                   description: Nombre del alimento.
   *                 weight:
   *                   type: number
   *                   description: Peso total del alimento en gramos.
   *                 calories:
   *                   type: number
   *                   description: Calorías calculadas para el alimento.
   *                 nutrients:
   *                   type: object
   *                   description: Datos nutricionales del alimento.
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
  public async calculateNutrition({ request, response }: HttpContextContract) {
    try {
      const nombrealimento = request.input('nombrealimento');

      if (!nombrealimento) {
        return response.badRequest({ error: 'Por favor, proporciona el nombre del alimento.' });
      }

      const url = Env.get('MQTT_HOST') + '/mqtt/retainer/message/peso';
      const axiosResponse = await axios.get(url, {
        auth: {
          username: Env.get('MQTT_API_KEY'),
          password: Env.get('MQTT_SECRET_KEY'),
        },
      });

      console.log('Respuesta de Axios:', axiosResponse.data);

      if (axiosResponse.status !== 200 || !axiosResponse.data) {
        return response.status(500).json({ error: 'No se pudo obtener el peso.' });
      }

      const retainedMessage = axiosResponse.data;

      const decodedPayload = Buffer.from(retainedMessage.payload, 'base64').toString('utf-8');

      const peso = parseFloat(decodedPayload);

      const edamamResponse = await EdamamResource.getfood(nombrealimento);

      if (!edamamResponse || (edamamResponse.parsed.length === 0 && edamamResponse.hints.length === 0)) {
        return response.notFound({ error: 'El alimento no existe.' });
      }

      const foodNutrients: FoodNutrients = edamamResponse.parsed[0].food.nutrients;

      const calories = (foodNutrients.ENERC_KCAL * peso) / 100; // Suponiendo que los nutrientes están en 100 gramos

      return response.ok({
        food: nombrealimento,
        weight: peso,
        calories: calories,
        nutrients: foodNutrients,
      });
    } catch (error) {
      console.error('Error al calcular la nutrición:', error.message);
      return response.status(500).json({ error: 'Ocurrió un error al calcular la nutrición.' });
    }
  }
}

