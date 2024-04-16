import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Sensor from 'App/Models/Sensor'

export default class SensorsController {
/**
 * @swagger
 * /api/sensor:
 *   get:
 *     summary: Obtiene la lista de sensores
 *     tags:
 *       - Sensors
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   description: Tipo de respuesta
 *                 title:
 *                   type: string
 *                   description: Título de la respuesta
 *                 message:
 *                   type: string
 *                   description: Mensaje de la respuesta
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID del sensor
 *                       name:
 *                         type: string
 *                         description: Nombre del sensor
 *                       sensorType:
 *                         type: object
 *                         description: Tipo de sensor
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: ID del tipo de sensor
 *                           name:
 *                             type: string
 *                             description: Nombre del tipo de sensor
 */
  public async index({response}: HttpContextContract) {
    const sensores = await Sensor.query().preload('sensorType')
    return response.status(200).send({
      type: 'Exitoso',
      title:'El recurso de sensores fue obtenido con exito',
      message:'Lista de sensores',
      data:sensores
    })
  }
/**
 * @swagger
 * /api/sensor:
 *   post:
 *     summary: Crea un nuevo sensor
 *     tags:
 *       - Sensors
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sensor_type_id:
 *                 type: number
 *                 description: ID del tipo de sensor
 *               value:
 *                 type: number
 *                 description: Valor del sensor
 *     responses:
 *       200:
 *         description: ¡Éxito! Todo ha ido bien :)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   description: Tipo de respuesta
 *                 title:
 *                   type: string
 *                   description: Título de la respuesta
 *                 message:
 *                   type: string
 *                   description: Mensaje de la respuesta
 *                 data:
 *                   type: object
 *                   description: Datos de la respuesta
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID del sensor creado
 *                     sensor_type_id:
 *                       type: number
 *                       description: ID del tipo de sensor
 *                     value:
 *                       type: number
 *                       description: Valor del sensor
 */
  public async store({request, response}: HttpContextContract) {
    const {sensor_type_id, value} = request.body()
    const newSensor = new Sensor()

    newSensor.sensor_type_id = sensor_type_id
    newSensor.activo = 1
    newSensor.value = value

    await newSensor.save()

    return response.status(200).send({
      type: 'Exitoso',
      title:'Recurso Creado',
      message:'Sensor creado con exito',
      data: newSensor
    })
  }
/**
 * @swagger
 * /api/sensor/{id}:
 *   put:
 *     summary: Activa o desactiva un sensor por su ID
 *     tags:
 *       - Sensors
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del sensor
 *         schema:
 *           type: integer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: ¡Éxito! Todo ha ido bien :)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   description: Tipo de respuesta
 *                 title:
 *                   type: string
 *                   description: Título de la respuesta
 *                 message:
 *                   type: string
 *                   description: Mensaje de la respuesta
 *                 data:
 *                   type: object
 *                   description: Datos de la respuesta
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID del sensor actualizado
 *                     activo:
 *                       type: integer
 *                       description: Estado de activación del sensor (0 para desactivado, 1 para activado)
 */
  public async update({response, request, params}: HttpContextContract) {
    try {
      const {} = request.body()
      const updateSensor = await Sensor.findOrFail(params.id)
      if(updateSensor.activo==1){
        updateSensor.activo = 0
        await updateSensor.save()
    
        return response.status(200).send({
          type: 'Exitoso',
          title: 'Sensor Actualizado',
          message:'Sensor desactivado exitosamente',
          data:updateSensor
        })  

        }else if(updateSensor.activo==0){
          updateSensor.activo = 1
          await updateSensor.save()
      
          return response.status(200).send({
            type: 'Exitoso',
            title: 'Sensor Actualizado',
            message:'Sensor activado exitosamente',
            data:updateSensor
          })  
        
      }
    } catch (error) {
      if(error.code === 'E_ROW_NOT_FOUND'){
        return response.status(200).send({
          type: 'Error',
          title: 'Error al obtener sensor',
          message:'Sensor no encontrado'
        })
      }
    
    }   
  }
/**
 * @swagger
 * /api/sensor/{id}:
 *   delete:
 *     summary: Elimina un sensor por su ID
 *     tags:
 *       - Sensors
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del sensor
 *         schema:
 *           type: integer
 *     produces:
 *       - application/json
 *     responses:
 *       204:
 *         description: ¡Éxito! Todo ha ido bien :)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   description: Tipo de respuesta
 *                 title:
 *                   type: string
 *                   description: Título de la respuesta
 *                 message:
 *                   type: string
 *                   description: Mensaje de la respuesta
 *                 data:
 *                   type: object
 *                   description: Datos de la respuesta
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID del sensor eliminado
 */
  public async destroy({response, params}: HttpContextContract) {
    try {
      const delSensor = await Sensor.findOrFail(params.id)
      await delSensor.delete()
      return response.status(204).send({
        type: 'Exitoso',
        title: 'Sensor eliminado',
        message: 'Sensor eliminado exitosamente',
        data: delSensor
      })
    } catch (error) {
      if(error.code === 'E_ROW_NOT_FOUND'){
        return response.status(200).send({
          type: 'Error',
          title:'Error al eliminar sensor',
          message:'Se produjo un error al eliminar sensor D:'
        })
      }
    }
  }
}
