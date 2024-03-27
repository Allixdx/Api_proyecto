import Mail from '@ioc:Adonis/Addons/Mail'
import Hash from '@ioc:Adonis/Core/Hash'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'

export default class UsersController {
  /**
   * @swagger
   * /api/users:
   *  get:
   *    tags:
   *      - users
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
  public async index({response}:HttpContextContract){
    const users = await User.all()
    return response.status(200).send({
      title:'Success!!',
      messgae:'Lista de usuarios',
      data:users
    })
  }
/**
 * @swagger
 * /api/users:
 *  post:
 *      tags:
 *        - users
 *      summary: Crear un nuevo usuario
 *      description: Crea un nuevo usuario con los datos proporcionados y envía un correo electrónico de verificación.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserInput'
 *      responses:
 *        201:
 *          description: Usuario creado exitosamente. Se ha enviado un correo electrónico de verificación.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: object
 *                    properties:
 *                      user_id:
 *                        type: number
 *                        description: ID del usuario creado.
 *                      name:
 *                        type: string
 *                        description: Nombre del usuario.
 *                      lastname:
 *                        type: string
 *                        description: Apellido del usuario.
 *                      email:
 *                        type: string
 *                        description: Correo electrónico del usuario.
 *        400:
 *          description: Error al crear el usuario. El correo electrónico proporcionado ya está registrado.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Error al crear usuario
 *                  error:
 *                    type: string
 *                    example: Correo electrónico ya registrado
 *        500:
 *          description: Error interno del servidor al intentar crear el usuario.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Error al crear usuario
 *                  error:
 *                    type: string
 *                    example: Descripción del error interno
 *  components:
 *    schemas:
 *      UserInput:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *          lastname:
 *            type: string
 *          email:
 *            type: string
 *          password:
 *            type: string
 *        required:
 *          - name
 *          - lastname
 *          - email
 *          - password
 *        example:
 *          name: John
 *          lastname: Doe
 *          email: john.doe@example.com
 *          password: password123
 */
 public async register({ request, response }: HttpContextContract) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  try {
    const name = request.input('name');
    const lastname = request.input('lastname');
    const email = request.input('email');
    const password = request.input('password');

    // Verificar si el correo electrónico ya existe
    const existingUser = await User.findBy('email', email);
    if (existingUser) {
      return response.status(400).json({
        message: 'Error al crear usuario',
        error: 'Correo electrónico ya registrado',
      });
    }

    const newUser = new User();
    newUser.name = name;
    newUser.lastname = lastname;
    newUser.email = email;
    newUser.password = await Hash.make(password);

    const verificationCode = this.generateVerificationCode();
    newUser.verificationCode = verificationCode;

    await newUser.save();

    const emailData = { code: verificationCode };

    await Mail.send((message) => {
      message
        .from(Env.get('SMTP_USERNAME'), 'Healthy App')
        .to(email)
        .subject('Healthy App - Verificación de cuenta')
        .htmlView('emails/welcome', emailData);
    });

    return response.status(201).json({
      data: {
        user_id: newUser.id,
        name: newUser.name,
        lastname: newUser.lastname,
        email: newUser.email,
      },
    });
  } catch (error) {
    return response.status(400).json({
      message: 'Error al crear usuario',
      error: error.message,
    });
  }
}
private generateVerificationCode() {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return randomNumber.toString();
}
/**
 * @swagger
 * /api/users/{id}:
 *  put:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - users
 *    summary: Actualización de datos de usuario
 *    description: Actualiza los datos de un usuario existente.
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: ID del usuario a actualizar.
 *        schema:
 *          type: integer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              lastname:
 *                type: string
 *              email:
 *                type: string
 *    responses:
 *       200:
 *        description: Datos de usuario actualizados exitosamente.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Mensaje indicando el éxito de la actualización.
 */
public async update({ auth, request, response }: HttpContextContract) {
  try {
    const user = auth.user

    if (!user) {
      return response.status(401).json({ error: 'Usuario no autenticado' })
    }

    user.merge(request.only(['name', 'lastname', 'email',]))
    await user.save()

    return response.status(200).json({ message: 'Datos de usuario actualizados' })
  } catch (error) {
    return response.status(500).json({ error: 'Error interno del servidor al actualizar los datos del usuario' })
  }
}
/**
 * @swagger
 * /api/users/update-password/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - users
 *     summary: Actualización de contraseña de usuario
 *     description: Actualiza la contraseña de un usuario existente.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario cuya contraseña se va a actualizar.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario.
 *               password:
 *                 type: string
 *                 description: Nueva contraseña del usuario.
 *     responses:
 *       '200':
 *         description: Contraseña de usuario actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje indicando el éxito de la actualización de contraseña.
 *       '400':
 *         description: La contraseña debe tener al menos 8 caracteres.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error.
 *       '404':
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error.
 *       '500':
 *         description: Error interno del servidor al actualizar la contraseña del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error.
 */

public async updatePassword({ params, request, response }: HttpContextContract) {
  try {
    const userId = params.id; // Obtener el ID del usuario de los parámetros de la solicitud
    const email = request.input('email'); // Obtener el correo electrónico del usuario de la solicitud
    const newPassword = request.input('password'); // Obtener la nueva contraseña del cuerpo de la solicitud

    // Verificar que la nueva contraseña tenga al menos 8 caracteres
    if (newPassword.length < 8) {
      return response.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }

    // Intentar encontrar al usuario por ID o correo electrónico
    const user = userId ? await User.find(userId) : await User.findBy('email', email);

    if (!user) {
      return response.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar la contraseña del usuario
    user.password = await Hash.make(newPassword);
    await user.save();

    return response.status(200).json({ message: 'Contraseña de usuario actualizada' });
  } catch (error) {
    return response.status(500).json({ error: 'Error interno del servidor al actualizar la contraseña del usuario' });
  }
}
/**
 * @swagger
 * /api/users/{id}:
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - users
 *    summary: Eliminación de cuenta de usuario
 *    description: Elimina la cuenta de usuario actual.
 *    parameters:
 *      - name: user_id
 *        in: path
 *        required: true
 *        description: ID del usuario a eliminar.
 *        schema:
 *          type: integer
 *    responses:
 *      '200':
 *        description: Cuenta de usuario eliminada exitosamente.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Mensaje indicando el éxito de la eliminación.
 */
public async destroy({ auth, response }: HttpContextContract) {
  const user = auth.user!
  await user.delete()

  return response.json({ message: 'Cuenta de usuario eliminada' })
}
/**
 * @swagger
 * /api/users/authlogin:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - users
 *    summary: Verificar sesión de usuario.
 *    description: Inicia sesión de usuario verificando el correo electrónico y el código de verificación.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              user_email:
 *                type: string
 *                format: email
 *              password:
 *                type: string
 *              verification_code:
 *                type: string
 *            required:
 *              - user_email
 *              - password
 *              - verification_code
 *    responses:
 *      200:
 *        description: Inicio de sesión exitoso.
 *        content:
 *          application/json:
 *            example:
 *              message: Inicio de sesión exitoso
 *      401:
 *        description: Datos inválidos o usuario no verificado.
 *        content:
 *          application/json:
 *            example:
 *              title: Datos inválidos
 *              message: Usuario no verificado o datos incorrectos
 *              type: warning
 *      400:
 *        description: Error al iniciar sesión.
 *        content:
 *          application/json:
 *            example:
 *              message: Error al iniciar sesión
 *              error: Descripción del error
 */
public async authLogin({ request, response }: HttpContextContract) {
  try {
    const user_email = request.input('user_email');
    const password = request.input('password');
    const verificationCode = request.input('verification_code');

    const user = await User.query()
      .where('email', user_email)
      .where('verification_code', verificationCode)
      .whereNull('deleted_at')
      .first();

    if (!user || user.verificationCode !== verificationCode) {
      // Devolver error de datos inválidos
      return response.status(401).send({
        title: 'Datos inválidos',
        message: 'Usuario no verificado o datos incorrectos',
        type: 'warning',
      });
    }

    if (!(await Hash.verify(user.password, password))) {
      return response.status(401).send({
        title: 'Datos inválidos',
        message: 'Contraseña incorrecta',
        type: 'warning',
      });
    }

    user.verificationCode = null;
    await user.save();

    return response.status(200).json({ message: 'Cuenta Verificada Correctamente' });
  } catch (error) {
    return response.status(400).json({
      message: 'Error al iniciar sesión',
      error: error.message,
    });
  }
}
/**
 * @swagger
 * /api/users/logout:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - users
 *    summary: Cierre de sesión de usuario
 *    description: Cierra la sesión actual del usuario.
 *    responses:
 *       200:
 *        description: Sesión cerrada exitosamente.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Mensaje indicando el éxito del cierre de sesión.
 */
public async logout({ auth, response }: HttpContextContract) {
  await auth.logout()
  return response.json({ message: 'Cierre de sesión exitoso' })
}
/**
 * @swagger
 * /api/users/login:
 *  post:
 *    tags:
 *      - users
 *    summary: Iniciar sesión de usuario
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                description: Correo electrónico del usuario
 *              password:
 *                type: string
 *                description: Contraseña del usuario
 *    responses:
 *      200:
 *        description: Inicio de sesión exitoso
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  description: Token de autenticación generado
 *      401:
 *        description: Credenciales inválidas
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Usuario no encontrado
 *      500:
 *        description: Error interno del servidor
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Error al iniciar sesión
 *                error:
 *                  type: string
 */
public async login({ request, auth, response }: HttpContextContract) {
  try {
    const email = request.input('email');
    const password = request.input('password');

    // Verificar las credenciales del usuario
    const user = await User.query().where('email', email).first();

    if (!user) {
      return response.status(401).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await Hash.verify(user.password, password);

    if (!isPasswordValid) {
      return response.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = await auth.use('api').generate(user, { expiresIn: '3 days' });

    return response.status(200).json({
      data:{
        token,
        user,
      },
    });
  } catch (error) {
    return response.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
}
/**
 * @swagger
 * /api/users/recuperar-contra:
 *   post:
 *     tags:
 *       - users
 *     summary: Solicitar recuperación de contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del administrador para recuperar la contraseña
 *     responses:
 *       200:
 *         description: Correo electrónico enviado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Se ha enviado un correo electrónico con un código de recuperación.
 *       400:
 *         description: Correo electrónico no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se encontró un administrador con este correo electrónico.
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al enviar el correo electrónico de recuperación.
 *                 error:
 *                   type: string
 *                   example: Mensaje de error detallado
 */
public async correorecuperacion({ request, response }: HttpContextContract) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  try {
    const email = request.input('email')
    const user = await User.findBy('email', email)

    if (!user) {
      return response.status(400).json({
        message: 'No se encontró un usuario con este correo electrónico.',
      })
    }

    const verificationCode = this.generarcodigo()

    user.verificationCode = verificationCode
    await user.save()

    await Mail.send((message) => {
      message
        .from(Env.get('SMTP_USERNAME'), 'Healthy App')
        .to(email)
        .subject('Recuperación de Contraseña')
        .htmlView('emails/recuperacion', { verificationCode }) 
    })

    return response.status(200).json({
      message: 'Se ha enviado un correo electrónico con un código de recuperación.',
    })
  } catch (error) {
    return response.status(500).json({
      message: 'Error al enviar el correo electrónico de recuperación.',
      error: error.message,
    })
  }
}
public generarcodigo() {
  const randomNumber = Math.floor(1000 + Math.random() * 9000)
  return randomNumber.toString()
}
/**
* @swagger
* /api/users/actualizarpassword:
*   post:
*     tags:
*       - users
*     summary: Actualizar la contraseña del administrador utilizando un código de recuperación
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - email
*               - recoveryCode
*               - newPassword
*             properties:
*               email:
*                 type: string
*                 format: email
*               recoveryCode:
*                 type: string
*               newPassword:
*                 type: string
*                 format: password
*     responses:
*       200:
*         description: Contraseña actualizada exitosamente
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Contraseña actualizada exitosamente.
*       400:
*         description: Código de recuperación no válido
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: El código de recuperación no es válido.
*       404:
*         description: Administrador no encontrado
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: No se encontró un administrador con este correo electrónico.
*       500:
*         description: Error del servidor
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Error al actualizar la contraseña.
*                 error:
*                   type: string
*                   example: Mensaje de error detallado
*/
public async actualizarPassword({ request, response }: HttpContextContract) {
  try {
    const { email, recoveryCode, newPassword } = request.only(['email', 'recoveryCode', 'newPassword'])
    const user = await User.findByOrFail('email', email)

    if (user.verificationCode!== recoveryCode || !user.verificationCode) {
      return response.status(400).json({
        message: 'El código de recuperación no es válido.',
      });
    }      
    user.password = await Hash.make(newPassword)
    user.verificationCode = null
    await user.save()

    return response.status(200).json({
      message: 'Contraseña actualizada exitosamente.',
    })
  } catch (error) {
    return response.status(500).json({
      message: 'Error al actualizar la contraseña.',
      error: error.message,
    })
  }
}
}