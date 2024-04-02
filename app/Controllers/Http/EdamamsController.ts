import EdamamResource from "App/Resources/EdamamResource";
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SensorType from "App/Models/SensorType";

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
 *               alimentos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                       description: Nombre del alimento.
 *                     peso:
 *                       type: number
 *                       description: Peso del alimento en gramos.
 *               peso:
 *                 type: number
 *                 description: Peso total de la porción en gramos para la cual se desea calcular la información nutricional.
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
    const { alimentos, peso } = request.only(['alimentos', 'peso']);
    const unidad = await SensorType.findBy('name', 'Peso');
    if (!unidad) {
      return response.status(404).send({
        title: 'Error',
        message: 'No se encontró el tipo de sensor especificado.',
        type: 'error',
      });
    }
    const unidadString = JSON.stringify(unidad);

    if (!alimentos || alimentos.length === 0) {
      return response.badRequest({ error: 'Por favor, proporciona la lista de alimentos.' });
    }
    const edamamResponse = await EdamamResource.getNutritionDetails(alimentos, peso, unidadString);

    if (!edamamResponse || edamamResponse.error) {
      return response.notFound({ error: 'No se pudieron obtener los detalles nutricionales.' });
    }
    return response.ok(edamamResponse);
  } catch (error) {
    console.error('Error al calcular la nutrición:', error.message);
    return response.status(500).json({ error: 'Ocurrió un error al calcular la nutrición.', errormensaje: error.message });
  }
}
}

  

