import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Dispositivo from 'App/Models/Dispositivo';
import Sensor from 'App/Models/Sensor';
import SensorType from 'App/Models/SensorType';
import TipoDispositivo from 'App/Models/TipoDispositivo';

export default class DispositivosController {
  /**
   * @swagger
   * /api/dispositivos:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Dispositivos
   *     summary: Obtener todos los dispositivos
   *     responses:
   *       200:
   *         description: Respuesta exitosa
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: Successfully retrieved all devices
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Dispositivo'
   */
  public async index({ response }: HttpContextContract) {
    try {
      const dispositivos = await Dispositivo.query()
      .joinRaw('inner join sensors on sensors.dispositivo_id = dispositivo.id')
      .where('sensors.activo',1).preload('sensores');
      return response.status(200).send({
        status: 'success',
        message: 'Successfully retrieved all devices',
        data: dispositivos,
      });
    } catch (error) {
      return response.status(500).send({
        status: 'error',
        message: 'An error occurred while retrieving devices',
        error: error.message,
      });
    }
  }
/**
 * @swagger
 * /api/dispositivos:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Dispositivos
 *     summary: Crear un nuevo tipo dispositivo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipoDispositivo:
 *                 type: string
 *                 description: Tipo de dispositivo ('pesa' o 'reloj')
 *     responses:
 *       201:
 *         description: Dispositivo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Device created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Dispositivo'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tipo de dispositivo inválido
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error creating device
 *                 error:
 *                   type: string
 */
public async store({ request, response }: HttpContextContract) {
  try {
    const name = request.input('tipoDispositivo');

    if (name !== 'pesa' && name !== 'brazalete') {
      return response.status(400).json({
        message: 'Tipo de dispositivo inválido',
      });
    }
    const tipodispositivo = await TipoDispositivo.create({
      name,
    });

    return response.status(201).json({
      status: 'success',
      message: 'Dispositivo creado exitosamente',
      data: tipodispositivo,
    });
  } catch (error) {
    return response.status(500).json({
      message: 'Error al crear el dispositivo',
      error: error.message,
    });
  }
}
/**
 * @swagger
 * /api/dispositivos/creardispositivo:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Dispositivos
 *     summary: Crear un nuevo dispositivo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipoDispositivo:
 *                 type: string
 *                 description: Tipo de dispositivo ('pesa' o 'brazalete')
 *               nombre:
 *                 type: string
 *                 description: Nombre del brazalate otorgado por el usuario
 *     responses:
 *       201:
 *         description: Dispositivo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Dispositivo creado exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/TipoDispositivo'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tipo de dispositivo inválido
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al crear el dispositivo
 *                 error:
 *                   type: string
 */
public async creardispositivo({ request, response, auth }: HttpContextContract) {
  //agregar por el id del tipo dispositivo y el nombre = nombre especial para el brazalete que le pone el usuario
  try {
    const tipoDispositivo = request.input('tipoDispositivo');
    const nombre = request.input('nombre')
    const userId = auth.user?.id;



    if (tipoDispositivo !== 'pesa' && tipoDispositivo !== 'brazalete') {
      return response.status(400).json({
        message: 'Tipo de dispositivo inválido',
      });
    }

    let tipoDispositivoExistente = await TipoDispositivo.query()
      .where('name', tipoDispositivo === 'pesa' ? 'pesa' : 'brazalete')
      .first();

    if (!tipoDispositivoExistente) {
      tipoDispositivoExistente = await TipoDispositivo.create({
        name: tipoDispositivo === 'pesa' ? 'pesa' : 'brazalete',
      });
    }

    const dispositivo = await Dispositivo.create({
      tipoDispositivoId: tipoDispositivoExistente.id,
      id_usuario: userId,
      nombre: nombre
    });

    const ultimoDispositivo = await Dispositivo.query().orderBy('id', 'desc').firstOrFail();

    const tipoDeSensor = await SensorType.query()
      .where('name', tipoDispositivo === 'pesa' ? 'Peso' : 'Distancia')
      .firstOrFail();

    let valorSensor = tipoDispositivo === 'brazalete' ?  1 : 5;

    // cuando es pesa se relaciona con el sensor de peso y si es brazalete con los sensores de brazaletes
    const sensor = await Sensor.create({
      sensor_type_id: tipoDeSensor.id,
      dispositivo_id: ultimoDispositivo.id,
      value: valorSensor,
      activo: 1,
    });

    return response.status(200).json({
      status: 'success',
      message: 'Dispositivo creado exitosamente',
      data: dispositivo, 
      sensor: sensor,
    });
  } catch (error) {
    return response.status(500).json({
      message: 'Error al crear el dispositivo',
      error: error.message,
    });
  }
}
/**
   * @swagger
   * /api/dispositivos/{id}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Dispositivos
   *     summary: Obtener un dispositivo por su ID
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID del dispositivo a obtener
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Dispositivo encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Dispositivo'
   *       404:
   *         description: Dispositivo no encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Device not found
   */
public async show({ params, response }: HttpContextContract) {
    try {
      const dispositivo = await Dispositivo.findOrFail(params.id);
      return response.status(200).json(dispositivo);
    } catch (error) {
      return response.status(404).json({ message: 'Device not found' });
    }
  }
  /**
   * @swagger
   * /api/dispositivos/{id}:
   *   delete:
   *     security:
     *       - bearerAuth: []
   *     tags:
   *       - Dispositivos
   *     summary: Eliminar un dispositivo por su ID
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID del dispositivo a eliminar
   *         schema:
   *           type: integer
   *     responses:
   *       204:
   *         description: Dispositivo eliminado correctamente
   *       404:
   *         description: Dispositivo no encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Device not found
   *       500:
   *         description: Error interno del servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Error deleting device
   *                 error:
   *                   type: string
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const dispositivo = await Dispositivo.findOrFail(params.id);
      await dispositivo.delete();
      return response.status(204).json({ message: 'Device deleted successfully' });
    } catch (error) {
      return response.status(500).json({
        message: 'Error deleting device',
        error: error.message,
      });
    }
  }
}


