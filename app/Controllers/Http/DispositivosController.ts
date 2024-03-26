import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Dispositivo from 'App/Models/Dispositivo';

export default class DispositivosController {
  /**
   * @swagger
   * /api/dispositivos:
   *   get:
   *     tags:
   *       - dispositivos
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
      const dispositivos = await Dispositivo.all();
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
 *     tags:
 *       - dispositivos
 *     summary: Crear un nuevo dispositivo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipoDispositivoId:
 *                 type: integer
 *                 description: ID del tipo de dispositivo
 *               idUsuario:
 *                 type: integer
 *                 description: ID del usuario asociado al dispositivo
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
 *                   example: Bad Request
 *                 errors:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: string
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
public async store({ request, response, auth }: HttpContextContract) {
    try {
      const tipoDispositivo = request.input('tipoDispositivo');
      const idUsuario = auth.user?.id; // Obtener el ID del usuario autenticado desde el token

      // Validar el tipo de dispositivo seleccionado
      if (tipoDispositivo !== 'pesa' && tipoDispositivo !== 'reloj') {
        return response.status(400).json({
          message: 'Tipo de dispositivo inválido',
        });
      }

      // Crear el dispositivo basado en la selección
      const dispositivo = await Dispositivo.create({
        tipoDispositivoId: tipoDispositivo === 'pesa' ? 1 : 2, // Suponiendo que 'pesa' tiene ID 1 y 'reloj' tiene ID 2 en la tabla de tipos de dispositivo
        idUsuario,
      });

      return response.status(201).json({
        status: 'success',
        message: 'Device created successfully',
        data: dispositivo,
      });
    } catch (error) {
      return response.status(500).json({
        message: 'Error creating device',
        error: error.message,
      });
    }
  }
/**
   * @swagger
   * /api/dispositivos/{id}:
   *   get:
   *     tags:
   *       - dispositivos
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
   *   put:
   *     tags:
   *       - dispositivos
   *     summary: Actualizar un dispositivo por su ID
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID del dispositivo a actualizar
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Dispositivo'
   *     responses:
   *       200:
   *         description: Dispositivo actualizado correctamente
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
   *       500:
   *         description: Error interno del servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Error updating device
   *                 error:
   *                   type: string
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const dispositivo = await Dispositivo.findOrFail(params.id);
      const dispositivoData = request.only(['tipoDispositivoId', 'idUsuario']);
      dispositivo.merge(dispositivoData);
      await dispositivo.save();
      return response.status(200).json(dispositivo);
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.status(404).json({ message: 'Device not found' });
      }
      return response.status(500).json({
        message: 'Error updating device',
        error: error.message,
      });
    }
  }

  /**
   * @swagger
   * /api/dispositivos/{id}:
   *   delete:
   *     tags:
   *       - dispositivos
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


