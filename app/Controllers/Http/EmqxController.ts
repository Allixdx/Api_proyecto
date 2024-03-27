import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios';
import Env from '@ioc:Adonis/Core/Env'


export default class EmqxController {
/**
 * @swagger
 * /api/emqx/publishEMQXTopic:
 *   post:
 *     tags:
 *       - EMQX
 *     summary: Publicar en un topic de EMQX
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Publicación exitosa
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               example: Topico enviado
 *             message:
 *               type: string
 *               example: null
 *             type:
 *               type: string
 *               example: success
 *             data:
 *               type: object
 *               example: null
 *       202:
 *         description: Publicación aceptada pero no procesada completamente
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               example: Error
 *             message:
 *               type: string
 *               example: Ocurrió un error
 *             type:
 *               type: string
 *               example: error
 *             data:
 *               type: object
 *               example: { error: "Mensaje de error" }
 *       500:
 *         description: Error interno del servidor
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               example: Error
 *             message:
 *               type: string
 *               example: Ocurrió un error
 *             type:
 *               type: string
 *               example: error
 *             data:
 *               type: object
 *               example: { error: "Mensaje de error" }
 */
public async publishEMQXTopic({ response }: HttpContextContract) {
    try {
        const url = 'http://143.198.135.231:18083/api/v5/publish';
        const payload = {
            "payload_encoding": "plain",
            "topic": "test/2",
            "qos": 0, // Se cambió "gos" a "qos"
            "payload": "wilvardo",
            "properties": {
                "user_properties": {
                    "foo": "bar"
                }
            },
            "retain": true // Se movió el parámetro "retain" dentro del payload
        };
        
        const res = await axios.post(url, payload, {
            auth: {
                username: 'c153ae5d87158c33',
                password: '6qayTX9CkL0ByD6KvAFPJvhSVm6lDs6iLb9Cz3oy9ANZ3H'
            }
        });

        if (res.status === 200) { // Se corrigió el chequeo del estado de respuesta
            return response.status(res.status).send({
                title: 'Topico enviado',
                message: 'prueba',
                type: 'success',
                data: null
            });

        } else {
            return response.status(500).send({
                title: 'Error',
                message: 'Ocurrio un error',
                type: 'error',
                data: { error: res.data } // Se corrigió para tomar res.data en lugar de res.response
            });
        }
    } catch (error) {
        return response.status(500).send({
            title: 'Error',
            message: 'Ocurrió dddun error',
            type: 'error',
            data: { error: error.message } // Se corrigió para tomar error.message
        });
    }
}
/**
    * @swagger
    * /api/emqx/topic-retained:
    *   post:
    *     tags:
    *       - EMQX
    *     produces:
    *       - application/json
    *     requestBody:
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               topic_name:
    *                 topic: string
    *             required:
    *               - topic_name
    *     responses:
    *       200:
    *         description: Todo salió bien cuando mandamos este estatus
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 type:
    *                   type: string
    *                 title:
    *                   type: string
    *                   description: Titulo de la respuesta
    *                 message:
    *                   type: string
    *                 data:
    *                   type: object
    *                   description: Datos de respuesta
    *                   properties:
    *                     user:
    *                       type: object
    *                       $ref: '#/components/schemas/User'
    */
public async getEMQXTopic({ request, response }: HttpContextContract) {
  try {
    const body = request.all()
    const url = Env.get('MQTT_HOST') + '/mqtt/retainer/message/' + body.topic_name

    const res = await axios.get(url, {
      auth: {
        username: Env.get('MQTT_API_KEY'),
        password: Env.get('MQTT_SECRET_KEY')
      }
    }).catch((error) => error)
    if (!res.status && res.response.status !== 202) {
      return response.status(res.response.status).send({
        title: 'Error',
        message: 'Ocurrio un error',
        type: 'error',
        data: {
          error: res.response
        },
      })
    }

    return response.status(200).send({
      title: 'Topico enviado',
      message: '',
      type: 'success',
      data: {...res.data, message_decoded: atob(res.data.payload)},
    })

  } catch (error) {
    return response.status(500).send({
      title: 'Error',
      message: 'Ocurrio un error',
      type: 'error',
      data: {
        error: error.message
      },
    })
  }
}

public async webhookRes ({ request, response }: HttpContextContract) {
  const body = request.all()
  console.log('============================= INICIA LOG DE WEBHOOK ============================')
  console.log(body)
  console.log('============================= TERMINA =============================')
  return response.send(body)
}

    }    

