import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SensorType from 'App/Models/SensorType'

export default class SensorTypesController {
  /**
 * 
 * @swagger
 * /api/sensorType:
 *  get:
 *    tags:
 *      - SensorsTypes
 *    summary: Lista de tipos de sensores
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Success!!
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  description: titulo
 *                data:
 *                  type: string 
 *                  description: descripcion
 */
  public async index({ response }: HttpContextContract) {
   try{
    const SensorTypes = await SensorType.all()
    return response.status(200).send({
      title: 'Success!!',
      message: 'Lista de tipos de sensores',
      data: SensorTypes
    });
  }catch(error){
    return response.status(500).send({
      status: 'error',
      message: 'Error al obtener los tipo de sensores',
      error: error.message,
    });
  }
}
  /**
  * @swagger
  * /api/sensorType:
  *   post:
  *     tags:
  *       - SensorsTypes
  *     summary: Crear un nuevo tipo de sensor
  *     produces:
  *       - application/json 
  *     requestBody:
  *       response: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               name:
  *                 type: string
  *                 description: nombre
  *               unit:
  *                 type: number
  *                 description: unidad
  *     responses:
  *       200:
  *         description: Success! Tout va bien :)
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 name:
  *                   type: string
  *                   description: titulo
  *                 unit:
  *                   type: string
  *                   description: unidad
  */ 
  public async store({response, request}: HttpContextContract) {
    const {name, unit} = request.body()
    const newSensorType = new SensorType()
    newSensorType.name = name
    newSensorType.unit = unit
    await newSensorType.save()
    return response.status(200).send({
      title:'Success!!',
      message:'Nuevo tipo de sensor creado',
      data:newSensorType
    })
  }
  /**
   * 
   * @swagger
   * /api/sensorType/{id}:
   *  put:
   *    tags:
   *      - SensorsTypes
   *    summary:  Actualizar tipo de sensor
   *    parameters:
   *      - name: id
   *        in: path
   *        required: true
   *        description: id sensor
   *        schema: 
   *          type: integer 
   *    produces:
   *      - application/json
   *    requestBody:
   *      response: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              name:
   *                type: string
   *                description: Nombre
   *              unit:
   *                type: string
   *                description: Unidad
   *    responses:
   *      200:
   *        description: Success! Tout va bien :)
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                title:
   *                  type: string
   *                  description: Titulo de la respuestinha sinha sinha
   *                data:
   *                  type: string
   *                  description: datos de respuesta
   */
  public async update({request, params, response}: HttpContextContract) {
    try {
      const {name, unit} = request.body()
      const upSensorType = await SensorType.findOrFail(params.id)
      upSensorType.name = name
      upSensorType.unit = unit
      await upSensorType.save()
      return response.status(200).send({
        title:'Success!!',
        message:'Tipo de sensor actualizado',
        data:upSensorType 
      })
    } catch (error) {
      if(error.code === 'E_ROW_NOT_FOUND'){
        return response.status(404).send({
          title:'ERROR!!',
          message:'Tipo de sensor no encontrado, intenta otro identificador :/'
        })
      }
    }
  }
 /**
 * @swagger
 * /api/sensorType/{id}:
 *  delete:
 *    tags:
 *      - SensorsTypes
 *    summary: Eliminar tipo de sensor
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: Id del cliente
 *        schema:
 *          type: integer
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Success! Tout va bien :)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  description: Titulo de la respuestinha sinha sinha
 *                data:
 *                  type: string
 *                  description: datos de respuesta
 */
  public async destroy({params, response}: HttpContextContract) {
    try {
      const delSensorType = await SensorType.findOrFail(params.id)
      await delSensorType.delete()
      return response.status(200).send({
        title:'Success!!',
        message:'Tipo de sensor eliminado D:',
        data:delSensorType
      })
    } catch (error) {
      if(error.code === 'E_ROW_NOT_FOUND'){
        return response.status(404).send({
          title:'ERROR!!',
          message:'Tipo de sensor no encontrado, intenta con otro identificador :/'
        })
      }
    }
  }
}
