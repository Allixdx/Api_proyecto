import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios';
import Env from '@ioc:Adonis/Core/Env'


export default class EmqxController {
  /**
   * @swagger
   * /api/emqx/publishEMQXTopic1:
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
  public async publishEMQXTopic1({ response }: HttpContextContract) {
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
  *     parameters:
  *       - name: topic
  *         in: query
  *         required: true
  *         schema:
  *           type: string
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
      const topic = request.input('topic');
      const url = Env.get('MQTT_HOST') + '/mqtt/retainer/message/' + topic;

      const axiosResponse = await axios.get(url, {
        auth: {
          username: Env.get('MQTT_API_KEY'),
          password: Env.get('MQTT_SECRET_KEY')
        }
      });

      if (axiosResponse.status !== 200) {
        return response.status(axiosResponse.status).send({
          title: 'Error',
          message: 'Ocurrió un error al obtener el mensaje retenido más reciente.',
          type: 'error',
          data: {
            error: axiosResponse.statusText
          },
        });
      }

      const retainedMessage = axiosResponse.data;

      // Decodificar el payload del mensaje retenido
      const decodedPayload = Buffer.from(retainedMessage.payload, 'base64').toString('utf-8');

      // Intentar analizar el contenido decodificado como JSON
      let parsedPayload;
      try {
        parsedPayload = JSON.parse(decodedPayload);
      } catch (error) {
        // Si no se puede analizar como JSON, simplemente usa el contenido decodificado
        parsedPayload = decodedPayload;
      }

      return response.status(200).send({
        title: 'Mensaje retenido más reciente obtenido con éxito',
        message: 'El último mensaje retenido del tema ha sido recuperado correctamente.',
        type: 'success',
        data: {
          retained_message: parsedPayload
        },
      });
    } catch (error) {
      let errorMessage = 'Ocurrió un error interno al procesar la solicitud.';
      if (error.response) {
        errorMessage = `Se recibió una respuesta con el estado ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = 'No se recibió ninguna respuesta del servidor.';
      } else {
        errorMessage = `Error al realizar la solicitud: ${error.message}`;
      }
      return response.status(500).send({
        title: 'Error',
        message: errorMessage,
        type: 'error',
        data: {
          error: error.message
        },
      });
    }
  }
  /**
     * @swagger
     * /api/emqx/publishEMQXTopic:
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
     *               topic_message:
     *                 topic: string
     *             required:
     *               - topic_name
     *               - topic_message
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
  public async publishEMQXTopic({ request, response }: HttpContextContract) {
    try {
      const body = request.all()
      const url = Env.get('MQTT_HOST') + '/publish'
      const payload = {
        "payload_encoding": "plain",
        "topic": body.topic_name,
        "qos": 0,
        "payload": body.topic_message,
        "properties": {
          "user_properties": {
            "foo": "bar"
          }
        },
        "retain": true
      }

      const res = await axios.post(url, payload, {
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
        data: res.data,
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

  public async webhookRes({ request, response }: HttpContextContract) {
    const body = request.all()
    console.log('============================= INICIA LOG DE WEBHOOK ============================')
    console.log(body)
    console.log('============================= TERMINA =============================')
    return response.send(body)
  }
  /**
   * @swagger
   * /api/emqx/obtenerPasos:
   *   post:
   *     tags:
   *       - EMQX
   *     summary: Obtener el último mensaje retenido de pasos.
   *     description: |
   *       Esta ruta permite obtener el último mensaje retenido de pasos desde el servidor EMQX.
   *     responses:
   *       200:
   *         description: Último mensaje retenido de pasos obtenido correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 title:
   *                   type: string
   *                   description: Título de la respuesta.
   *                 message:
   *                   type: string
   *                   description: Mensaje de éxito.
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta.
   *                 data:
   *                   type: object
   *                   description: Datos de respuesta.
   *                   properties:
   *                     retained_message:
   *                       type: object
   *                       description: Último mensaje retenido de pasos.
   *       500:
   *         description: Error interno al procesar la solicitud.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 title:
   *                   type: string
   *                 message:
   *                   type: string
   *                   description: Descripción del error.
   *                 type:
   *                   type: string
   *                   description: Tipo de error.
   *                 data:
   *                   type: object
   *                   description: Datos adicionales relacionados con el error.
   *                   properties:
   *                     error:
   *                       type: string
   *                       description: Mensaje de error detallado.
   */
  public async obtenerPasos({ response }: HttpContextContract) {
    try {
      const url = Env.get('MQTT_HOST') + '/mqtt/retainer/message/ritmo';

      const axiosResponse = await axios.get(url, {
        auth: {
          username: Env.get('MQTT_API_KEY'),
          password: Env.get('MQTT_SECRET_KEY')
        }
      });
      //aun no esta creado el topico paso
      if (axiosResponse.status !== 200) {
        return response.status(axiosResponse.status).send({
          title: 'Error',
          message: 'Ocurrió un error al obtener el ritmo cardiaco más reciente.',
          type: 'error',
          data: {
            error: axiosResponse.statusText
          },
        });
      }

      const retainedMessage = axiosResponse.data;

      // Decodificar el payload del mensaje retenido
      const decodedPayload = Buffer.from(retainedMessage.payload, 'base64').toString('utf-8');

      // Intentar analizar el contenido decodificado como JSON
      let parsedPayload;
      try {
        parsedPayload = JSON.parse(decodedPayload);
      } catch (error) {
        // Si no se puede analizar como JSON, simplemente usa el contenido decodificado
        parsedPayload = decodedPayload;
      }

      return response.status(200).send({
        title: 'ritmo cardiaco más reciente obtenido con éxito',
        message: 'El último ritmo cardiaco ha sido recuperado correctamente.',
        type: 'success',
        data: {
          retained_message: parsedPayload
        },
      });
    } catch (error) {
      let errorMessage = 'Ocurrió un error interno al procesar la solicitud.';
      if (error.response) {
        errorMessage = `Se recibió una respuesta con el estado ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = 'No se recibió ninguna respuesta del servidor.';
      } else {
        errorMessage = `Error al realizar la solicitud: ${error.message}`;
      }
      return response.status(500).send({
        title: 'Error',
        message: errorMessage,
        type: 'error',
        data: {
          error: error.message
        },
      });
    }
  }
  /**
   * @swagger
   * /api/emqx/obtenerRitmo:
   *   post:
   *     tags:
   *       - EMQX
   *     summary: Obtener el último mensaje retenido del ritmo cardíaco.
   *     description: |
   *       Esta ruta permite obtener el último mensaje retenido del ritmo cardíaco desde el servidor EMQX.
   *     responses:
   *       200:
   *         description: Último mensaje retenido del ritmo cardíaco obtenido correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 title:
   *                   type: string
   *                   description: Título de la respuesta.
   *                 message:
   *                   type: string
   *                   description: Mensaje de éxito.
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta.
   *                 data:
   *                   type: object
   *                   description: Datos de respuesta.
   *                   properties:
   *                     retained_message:
   *                       type: object
   *                       description: Último mensaje retenido del ritmo cardíaco.
   *       500:
   *         description: Error interno al procesar la solicitud.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 title:
   *                   type: string
   *                 message:
   *                   type: string
   *                   description: Descripción del error.
   *                 type:
   *                   type: string
   *                   description: Tipo de error.
   *                 data:
   *                   type: object
   *                   description: Datos adicionales relacionados con el error.
   *                   properties:
   *                     error:
   *                       type: string
   *                       description: Mensaje de error detallado.
   */
  public async obtenerRitmo({ response }: HttpContextContract) {
    try {
      const url = Env.get('MQTT_HOST') + '/mqtt/retainer/message/pasos';
      //aun no esta creado el topico ritmo

      const axiosResponse = await axios.get(url, {
        auth: {
          username: Env.get('MQTT_API_KEY'),
          password: Env.get('MQTT_SECRET_KEY')
        }
      });

      if (axiosResponse.status !== 200) {
        return response.status(axiosResponse.status).send({
          title: 'Error',
          message: 'Ocurrió un error al obtener los pasos más reciente.',
          type: 'error',
          data: {
            error: axiosResponse.statusText
          },
        });
      }

      const retainedMessage = axiosResponse.data;

      // Decodificar el payload del mensaje retenido
      const decodedPayload = Buffer.from(retainedMessage.payload, 'base64').toString('utf-8');

      // Intentar analizar el contenido decodificado como JSON
      let parsedPayload;
      try {
        parsedPayload = JSON.parse(decodedPayload);
      } catch (error) {
        // Si no se puede analizar como JSON, simplemente usa el contenido decodificado
        parsedPayload = decodedPayload;
      }

      return response.status(200).send({
        title: 'pasos más recientes obtenido con éxito',
        message: 'Los pasos han sido recuperado correctamente.',
        type: 'success',
        data: {
          retained_message: parsedPayload
        },
      });
    } catch (error) {
      let errorMessage = 'Ocurrió un error interno al procesar la solicitud.';
      if (error.response) {
        errorMessage = `Se recibió una respuesta con el estado ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = 'No se recibió ninguna respuesta del servidor.';
      } else {
        errorMessage = `Error al realizar la solicitud: ${error.message}`;
      }
      return response.status(500).send({
        title: 'Error',
        message: errorMessage,
        type: 'error',
        data: {
          error: error.message
        },
      });
    }
  }
  /**
   * @swagger
   * /api/emqx/obtenerDistancia:
   *   post:
   *     tags:
   *       - EMQX
   *     summary: Obtener el último mensaje retenido de distancia.
   *     description: |
   *       Esta ruta permite obtener el último mensaje retenido de distancia desde el servidor EMQX.
   *     responses:
   *       200:
   *         description: Último mensaje retenido de distancia obtenido correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 title:
   *                   type: string
   *                   description: Título de la respuesta.
   *                 message:
   *                   type: string
   *                   description: Mensaje de éxito.
   *                 type:
   *                   type: string
   *                   description: Tipo de respuesta.
   *                 data:
   *                   type: object
   *                   description: Datos de respuesta.
   *                   properties:
   *                     retained_message:
   *                       type: object
   *                       description: Último mensaje retenido de distancia.
   *       500:
   *         description: Error interno al procesar la solicitud.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 title:
   *                   type: string
   *                 message:
   *                   type: string
   *                   description: Descripción del error.
   *                 type:
   *                   type: string
   *                   description: Tipo de error.
   *                 data:
   *                   type: object
   *                   description: Datos adicionales relacionados con el error.
   *                   properties:
   *                     error:
   *                       type: string
   *                       description: Mensaje de error detallado.
   */
  public async obtenerDistancia({ response }: HttpContextContract) {
    try {
      const url = Env.get('MQTT_HOST') + '/mqtt/retainer/message/distancia';
      //aun no esta creado el topico distancia

      const axiosResponse = await axios.get(url, {
        auth: {
          username: Env.get('MQTT_API_KEY'),
          password: Env.get('MQTT_SECRET_KEY')
        }
      });

      if (axiosResponse.status !== 200) {
        return response.status(axiosResponse.status).send({
          title: 'Error',
          message: 'Ocurrió un error al obtener la distancia más reciente.',
          type: 'error',
          data: {
            error: axiosResponse.statusText
          },
        });
      }

      const retainedMessage = axiosResponse.data;

      // Decodificar el payload del mensaje retenido
      const decodedPayload = Buffer.from(retainedMessage.payload, 'base64').toString('utf-8');

      // Intentar analizar el contenido decodificado como JSON
      let parsedPayload;
      try {
        parsedPayload = JSON.parse(decodedPayload);
      } catch (error) {
        // Si no se puede analizar como JSON, simplemente usa el contenido decodificado
        parsedPayload = decodedPayload;
      }

      return response.status(200).send({
        title: 'Distancia más reciente obtenida con éxito',
        message: 'La Distancia ha sido recuperada correctamente.',
        type: 'success',
        data: {
          retained_message: parsedPayload
        },
      });
    } catch (error) {
      let errorMessage = 'Ocurrió un error interno al procesar la solicitud.';
      if (error.response) {
        errorMessage = `Se recibió una respuesta con el estado ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = 'No se recibió ninguna respuesta del servidor.';
      } else {
        errorMessage = `Error al realizar la solicitud: ${error.message}`;
      }
      return response.status(500).send({
        title: 'Error',
        message: errorMessage,
        type: 'error',
        data: {
          error: error.message
        },
      });
    }
  }
}    

