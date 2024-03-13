import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios, { AxiosResponse } from 'axios';

export default class EmqxController {

public async publishEMQXTopic({ response }: HttpContextContract) {
    try {
        const url = 'http://localhost:18083/api/v5/publish';
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
                username: '98ed0e75fce083af',
                password: 'YpyA8NXUSsyt9ALL6a02h7Rp5kaRPL7Yrzod7qxuzLSO'
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

}
