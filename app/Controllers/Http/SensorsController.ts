import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Sensor from 'App/Models/Sensor'

export default class SensorsController {
  /**
   * 
   * @swagger
   * /api/sensor:
   *  get:
   *    tags:
   *      - Sensors
   *    summary: list of sensors
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
   *                  description: title 
   *                data:
   *                  type: string 
   *                  description: jajajaj
   */
  public async index({response}: HttpContextContract) {
    const sensores = await Sensor.all()
    return response.status(200).send({
      title:'Success!!',
      message:'List of sensors',
      data:sensores
    })
  }
  /**
  * @swagger
  * /api/sensor:
  *   post:
  *     tags:
  *       - Sensors
  *     summary: Create new sensor
  *     produces:
  *       - application/json 
  *     requestBody:
  *       response: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               sensor_type_id:
  *                 type: number
  *                 description: Type sensor
  *               activo: 
  *                 type: number
  *                 description: status
  *               value:
  *                 type: number
  *                 description: value
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
  *                   description: Titulo de la respuestinha sinha sinha
  *                 last_name:
  *                   type: string
  *                   description: datos de respuesta
  */ 
  public async store({request, response}: HttpContextContract) {
    const {sensor_type_id, activo, value} = request.body()
    const newSensor = new Sensor()

    newSensor.sensor_type_id = sensor_type_id
    newSensor.activo = activo
    newSensor.value = value

    await newSensor.save()

    return response.status(200).send({
      title:'Success',
      message:'Created new sensor',
      data: newSensor
    })
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
