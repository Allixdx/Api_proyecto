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
        .where('sensors.activo', 1).preload('sensores');
      return response.status(200).send({
        type: 'Success!!',
        title: 'Acceso a lista de dispositivos',
        message: 'Lista de dispositivos',
        data: dispositivos,
      });
    } catch (error) {
      return response.status(500).send({
        type: 'Error',
        title: 'Error al acceder a la lista',
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
        type: 'Exitoso!!',
        title: 'Dispositivo creado',
        message: 'Dispositivo creado exitosamente',
        data: tipodispositivo,
      });
    } catch (error) {
      return response.status(500).json({
        type: 'Error',
        title: 'Error al crear',
        message: 'Se produjo un error al crear el dispositivo',
        error: error.message,
      });
    }
  }
  /**
   * @swagger
   * /api/dispositivos/crear-dispositivo:
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
   *                 description: Tipo de dispositivo  ( 'brazalete':1,'pesa':2)
   *               nombre:
   *                 type: string
   *                 description: Nombre de dispositivo
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
    // en este el sensor_type son todos los tipos de sensores que hay pesa Peso y Brazalete 5 sensores diferentes
    try {
      const tipoDispositivo = request.input('tipoDispositivo');
      const userId = auth.user?.id;
      const nombre = request.input('nombre')

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

      // const tipoDeSensor = await SensorType.query()
      //   .where('name', tipoDispositivo === 'pesa' ? 'Peso' : 'Distancia')
      //   .firstOrFail();

      let valorSensor = tipoDispositivo === 'pesa' ? 1 : 5;

      if(tipoDispositivo == 'brazalete'){
        for(let i = 1; i<=5; i++){
          const sensor = await Sensor.create({
            sensor_type_id: i,
            dispositivo_id: ultimoDispositivo.id,
            value: valorSensor,
            activo: 1
          });
          await Sensor.create(sensor)
        }
      }else if(tipoDispositivo == 'pesa'){
        const tipoDeSensor = await SensorType.query()
        .where('name', 'Peso')
        .firstOrFail();
        const sensor = await Sensor.create({
          sensor_type_id: tipoDeSensor.id,
          dispositivo_id: ultimoDispositivo.id,
          value: valorSensor,
          activo: 1
        });
        await Sensor.create(sensor)
      }

      // const sensor = await Sensor.create({
      //   sensor_type_id: tipoDeSensor.id,
      //   dispositivo_id: ultimoDispositivo.id,
      //   value: valorSensor,
      //   activo: 1,
      // });

      return response.status(201).json({
        type: 'Exitoso!!',
        title: 'Dispositivo creado',
        message: 'Dispositivo creado exitosamente',
        data: {
          device: dispositivo
        },
      });
    } catch (error) {
      return response.status(500).json({
        type: 'Error',
        title: 'Error al crear dispositivo',
        message: 'Ocurrio un error al crear el dispositivo',
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
      return response.status(200).json({
        type: 'Exitoso!!',
        title: 'Recurso obtenido',
        message: 'Exito al obtener el dispositivo por identificador',
        data: dispositivo

      });
    } catch (error) {
      return response.status(404).json({
        type: 'Error',
        title: 'Error al obtener recurso',
        message: 'Se produjo un error al obtener el recurso'
      });
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
      return response.status(200).json({
        type: 'Exitoso!!',
        title: 'Dispositivo eliminado',
        message: 'Dispositivo eliminado exitosamente',
        data: dispositivo
      });
    } catch (error) {
      return response.status(500).json({
        type: 'Error',
        title: 'Error al eliminar',
        message: 'Se produjo un error al eliminar el dispositivo',
        error: error.message,
      });
    }
  }
}


