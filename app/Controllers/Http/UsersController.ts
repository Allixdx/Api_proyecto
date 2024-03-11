import Mail from '@ioc:Adonis/Addons/Mail'
import Hash from '@ioc:Adonis/Core/Hash'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'


export default class UsersController {
/**
   * @swagger
   * /api/users:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - users
   *     produces:
   *       - application/json
   *     summary: Obtener todos los usuarios
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
   *                   example: Successfully retrieved all users
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/User'
   */
  public async index({ response }: HttpContextContract) {
    try {
      const users = await User.all()

      return response.status(200).send({
        status: 'success',
        message: 'Successfully retrieved all users',
        data: users,
      })
    } catch (error) {
      return response.status(500).send({
        status: 'error',
        message: 'An error occurred while retrieving users',
        error: error.message,
      })
    }
  }
 /**
   * @swagger
   * /api/users:
   *   post:
   *     tags:
   *       - users
   *     summary: Crear un nuevo usuario
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserInput'
   *     responses:
   *       201:
   *         description: Usuario creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
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
   *                   example: Error al crear el usuario
   *                 error:
   *                   type: string
   */
 public async store({ request, response }: HttpContextContract) {
  try {
    const name = request.input('name')
    const lastname = request.input('lastname')
    const email = request.input('email')
    const password = request.input('password')

    function generateVerificationCode() {
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      return randomNumber.toString();
    }

    const verificationCode = generateVerificationCode();
    const emailData = { code: verificationCode };

    const newUser = new User()
    newUser.name = name
    newUser.lastname = lastname
    newUser.email = email
    newUser.password = await Hash.make(password)
    await newUser.save()

    await Mail.send((message) => {
      message
        .from(Env.get('SMTP_USERNAME'), 'Healthy App')
        .to(email)
        .subject('Healthy App - Verificación de cuenta')
        .htmlView('emails/welcome', emailData)
    })

    return response.status(201).json({
      data: {
        user_id: newUser.id,
        name: newUser.name,
        lastname: newUser.lastname,
        email: newUser.email,
      },
    })
  } catch (error) {
    return response.status(400).json({
      message: 'Error al crear usuario',
      error: error.message,
    })
  }
}
/**
   * @swagger
   * components:
   *   schemas:
   *     User:
   *       type: object
   *       properties:
   *         id:
   *           type: integer
   *         name:
   *           type: string
   *         lastname:
   *           type: string
   *         email:
   *           type: string
   *         createdAt:
   *           type: string
   *           format: date-time
   *         updatedAt:
   *           type: string
   *           format: date-time
   *
   *     UserInput:
   *       type: object
   *       properties:
   *         name:
   *           type: string
   *         lastname:
   *           type: string
   *         email:
   *           type: string
   *           format: email
   *         password:
   *           type: string
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const user_id = params.user_id
      const user = await User.findOrFail(user_id)
      return response.status(200).send(user)
    } catch (error) {
      return response.status(404).json({ message: 'Error al encontrar usuario' })
    }
  }
/**
   * @swagger
   * /api/users/{user_id}:
   *   put:
   *     tags:
   *       - users
   *     summary: Actualizar un usuario por su ID
   *     parameters:
   *       - name: user_id
   *         in: path
   *         required: true
   *         description: ID del usuario a actualizar
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserInput'
   *     responses:
   *       200:
   *         description: Usuario actualizado correctamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       404:
   *         description: Usuario no encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Usuario no encontrado
   *       500:
   *         description: Error interno del servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Error al actualizar el usuario
   *                 error:
   *                   type: string
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const user_id = params.user_id
      const user = await User.findOrFail(user_id)

      const { email } = request.only(['email'])

      user.email = email

      await user.save()

      return response.status(200).send(user)
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.status(404).json({ message: 'Usuario no encontrado' })
      }
      return response.status(500).json({
        message: 'Error al actualizar el usuario',
        error: error.message,
      })
    }
  }
/**
   * @swagger
   * /api/users/{user_id}:
   *   delete:
   *     tags:
   *       - users
   *     summary: Eliminar un usuario por su ID
   *     parameters:
   *       - name: user_id
   *         in: path
   *         required: true
   *         description: ID del usuario a eliminar
   *         schema:
   *           type: integer
   *     responses:
   *       204:
   *         description: Usuario eliminado correctamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Usuario eliminado correctamente
   *       404:
   *         description: Usuario no encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Usuario no encontrado
   *       500:
   *         description: Error interno del servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Error al eliminar el usuario
   *                 error:
   *                   type: string
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const user_id = params.user_id
      const user = await User.findOrFail(user_id)
      await user.delete()

      return response.status(204).json({ message: 'Usuario eliminado correctamente' })
    } catch (error) {
      return response.status(500).json({
        message: 'Error al eliminar el usuario',
        error: error.message,
      })
    }
  }
}
