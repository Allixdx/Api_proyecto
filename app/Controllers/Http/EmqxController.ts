import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios';

export default class EmqxController {
/**
 * @swagger
 * /api/users/publishEMQXTopic:
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
            "topic": "topicohttp",
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

        if (res.status === 202) { // Se corrigió el chequeo del estado de respuesta
            return response.status(res.status).send({
                title: 'Topico enviado',
                message: null,
                type: 'success',
                data: null
            });
        } else {
            return response.status(res.status).send({
                title: 'Error',
                message: 'Ocurrió un error',
                type: 'error',
                data: { error: res.data } // Se corrigió para tomar res.data en lugar de res.response
            });
        }
    } catch (error) {
        return response.status(500).send({
            title: 'Error',
            message: 'Ocurrió un error',
            type: 'error',
            data: { error: error.message } // Se corrigió para tomar error.message
        });
    }
}
/**
 * @swagger
 * /api/users/obtenerMensajesDelTopico:
 *   get:
 *     tags:
 *       - EMQX
 *     summary: Suscribirse a un tópico de EMQX y obtener mensajes retenidos
 *     responses:
 *       200:
 *         description: Suscripción exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   example: Suscripción exitosa
 *                 message:
 *                   type: string
 *                   example: Te has suscrito al tópico exitosamente
 *                 type:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   example: null
 *       500:
 *         description: Error al suscribirse al tópico
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   example: Error
 *                 message:
 *                   type: string
 *                   example: Ocurrió un error al suscribirse al tópico
 *                 type:
 *                   type: string
 *                   example: error
 *                 data:
 *                   type: object
 *                   example: { error: "Mensaje de error" }
 */
 public async obtenerMensajesDelTopico({ response }: HttpContextContract) {
    try {
      const url = 'http://143.198.135.231:18083/api/v5/messages/retained/test2';
      const res = await axios.get(url, {
        auth: {
          username: 'admin2', 
          password: 'admin2waos' 
        }
      });

      if (res.status === 200) {
        console.log('Mensajes retenidos en el tópico:', res.data);
        return response.status(200).send(res.data);
      } else {
        console.error('Error al obtener los mensajes del tópico:', res.data);
        return response.status(500).send({
          title: 'Error',
          message: 'Ocurrió un error al obtener los mensajes del tópico',
          type: 'error',
          data: { error: res.data }
        });
      }
    } catch (error) {
      console.error('Error al obtener los mensajes del tópico:', error);
      return response.status(500).send({
        title: 'Error',
        message: 'Ocurrió un error al obtener los mensajes catch del tópico',
        type: 'error',
        data: { error: error.message }
      });
    }
  }
    }    

