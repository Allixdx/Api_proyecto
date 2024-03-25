import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Habit from 'App/Models/Habit'

export default class HabitsController {
    /**
    * @swagger
    * /api/habits:
    *   get:
    *     description: Lista de todas los habitos en el sistema
    *     tags:
    *       - Habits
    *     security:
    *       - bearerAuth: []
    *     produces:
    *       - application/json
    *     parameters:
    *       - in: query
    *         name: page
    *         schema:
    *           type: number
    *         required: false
    *         description: Pagina que se mostrara
    *       - in: query
    *         name: limit
    *         schema:
    *           type: number
    *         required: false
    *         description: Limite de elementos que se mostraran en la pagina actual (3 por defecto)
    *     responses:
    *       200:
    *         description: La busqueda fue exitosa
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 type:
    *                   type: string
    *                   descripcion: tipo de respuesta
    *                 title:
    *                   type: string
    *                   descripcion: titulo de la respuesta
    *                 message:
    *                   type: string
    *                   descripcion: mensaje de la respuesta
    *                 data: 
    *                   type: object
    *                   descripcion: Datos de la respuesta
    *       500:
    *         description: Hubo un fallo en el servidor durante la solicitud 
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 type:
    *                   type: string
    *                   descripcion: tipo de error
    *                 title:
    *                   type: string
    *                   descripcion: titulo del error
    *                 message:
    *                   type: string
    *                   descripcion: mensaje del error
    *                 errors: 
    *                   type: object
    *                   descripcion: Datos del error 
    * 
	*/
    public async index({request}: HttpContextContract) {
    
        var habit: Habit[] 
        if(request.input('page')||request.input('limit')){
          const page = request.input('page',1)
          const limit = request.input('limit',3)
          habit = await Habit.query()
            .preload('user')
            .preload('configuration')
            .paginate(page,limit)
        }else{
          habit = await Habit.query()
            .preload('user')
            .preload('configuration')
        }
    
        return {
          "type":"Exitoso",
          "title":"Recursos encontrados",
          "message":"La lista de recursos de habitos ha sido encontrada con exito",
          "data":habit,
        }
      }
    
      public async store({request,response}: HttpContextContract) {
        /**
        * @swagger
        * /api/habits:
        *   post:
        *     description: Crea un nuevo recurso de habito en la base de datos. 
        *     tags:
        *       - Habits
        *     security:
        *       - bearerAuth: []
        *     produces:
        *       - application/json
        *     requestBody:
        *       description: Ingresa los datos basicos para un habito
        *       required: true
        *       content:
        *         application/json:
        *           schema:
          *             type: object
        *             properties:
        *               name:
        *                 type: string
        *                 descripcion: Nombre del habito
        *                 required: true
        *               description: 
        *                 type: string
        *                 descripcion: Descripcion del habito
        *                 required: true
        *               user_id:
        *                 type: number
        *                 descripcion: Id de usuario
        *                 required: true
        *     responses:
        *       201:
        *         description: La creacion del recurso fue exitosa
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 type:
        *                   type: string
        *                   descripcion: tipo de respuesta
        *                 title:
        *                   type: string
        *                   descripcion: titulo de la respuesta
        *                 message:
        *                   type: string
        *                   descripcion: mensaje de la respuesta
        *                 data: 
        *                   type: object
        *                   descripcion: Datos de la respuesta
        *       422:
        *         description: Los datos en el cuerpo de la solicitud no son procesables porque el formato es incorrecto o falta un elemento en el cuerpo de la solicitud 
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 errors:
        *                   type: array
        *                   items:
        *                     type: object
        *                   descripcion: errores en la solicitud   
        *       500:
        *         description: Hubo un fallo en el servidor durante la solicitud 
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 type:
        *                   type: string
        *                   descripcion: tipo de error
        *                 title:
        *                   type: string
        *                   descripcion: titulo del error
        *                 message:
        *                   type: string
        *                   descripcion: mensaje del error
        *                 errors: 
        *                   type: object
        *                   descripcion: Datos del error 
        * 
        */
        
        const body = request.all()
    
        await request.validate({
          schema: schema.create({
            name: schema.string(),
            description: schema.string(),
            user_id: schema.number()
          }),
          messages: {
            'name.required': 'El nombre del habito es obligatorio para crear un recurso de habito',
            'description.required': 'La descripcion del habito es obligatoria para crear un recurso de habito',
            'user_id.required': 'El id de usuario es obligatorio para crear un recurso de habito',
            'user_id.number': 'El id del user debe ser un numero entero'
            }
        })
    
        const habit = new Habit()
        try{
          habit.name = body.name
          habit.description = body.description
          habit.user_id = body.user_id
          await habit.save()
        }catch(error){
          response.internalServerError({                 
            "type":"Error",
            "title": "Error de sevidor",
            "message": "Hubo un fallo en el servidor durante el registro de los datos",
            "errors": error
          })
          return
        }
        
        response.status(201)
        response.send ({
          "type":"Exitoso",
          "title":"Recurso creado",
          "message":"El recurso persona ha sido creado exitosamente",
          "data":habit,
        })
      }
    
      public async show({params,response}: HttpContextContract) {
        /**
        * @swagger
        * /api/habits/{habit_id}:
        *   get:
        *     description: Muestra un habito especifico identificado por el numero id que se pasa como parametro.
        *     tags:
        *       - Habits
        *     security:
        *       - bearerAuth: []
        *     produces:
        *       - application/json
        *     parameters:
        *       - in: path
        *         name: habit_id
        *         schema:
        *           type: number
        *         required: true
        *         description: Id de habito que se va a mostrar
        *     responses:
        *       200:
        *         description: La busqueda fue exitosa
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 type:
        *                   type: string
        *                   descripcion: tipo de respuesta
        *                 title:
        *                   type: string
        *                   descripcion: titulo de la respuesta
        *                 message:
        *                   type: string
        *                   descripcion: mensaje de la respuesta
        *                 data: 
        *                   type: object
        *                   descripcion: Datos de la respuesta
        *       404:
        *         description: No se pudo encontrar el recurso de habito 
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 type:
        *                   type: string
        *                   descripcion: tipo de error
        *                 title:
        *                   type: string
        *                   descripcion: titulo del error
        *                 message:
        *                   type: string
        *                   descripcion: mensaje del error
        *                 errors: 
        *                   type: object
        *                   descripcion: Datos del error   
        *       500:
        *         description: Hubo un fallo en el servidor durante la solicitud 
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 type:
        *                   type: string
        *                   descripcion: tipo de error
        *                 title:
        *                   type: string
        *                   descripcion: titulo del error
        *                 message:
        *                   type: string
        *                   descripcion: mensaje del error
        *                 errors: 
        *                   type: object
        *                   descripcion: Datos del error 
        * 
        */
        const habit = await Habit.query()
          .where('habit_id',params.habit_id)
          .preload('user')
          .preload('configuration')
          .first()
        if(habit){
          response.send ({
            "type":"Exitoso",
            "title":"Recurso encontrado",
            "message":"El recurso de habito ha sido encontrado con exito",
            "data":habit,
          })
        }
        else{
          response.notFound({                 
            "type":"Error",
            "title": "Recurso no encontrado",
            "message": "El recurso de habito no pudo encontrarse",
            "errors": [] 
          })
        }
      }
    
      public async update({params,request,response}: HttpContextContract) {
        /**
        * @swagger
        * /api/habits/{habit_id}:
        *   put:
        *     description: Actualiza el recurso de habito, se pueden actualizar los datos que se necesiten.
        *     tags:
        *       - Habito
        *     security:
        *       - bearerAuth: []
        *     produces:
        *       - application/json
        *     requestBody:
        *       description: Se pueden cambiar los datos que sean necesarios
        *       required: true
        *       content:
        *         application/json:
        *           schema:
          *             type: object
        *             properties:
        *               name:
        *                 type: string
        *                 descripcion: Nombre del habito
        *                 required: false
        *               description: 
        *                 type: string
        *                 descripcion: Descripcion del habito
        *                 required: false
        *               user_id:
        *                 type: number
        *                 descripcion: Id de usuario
        *                 required: false
        *     parameters:
        *       - in: path
        *         name: habit_id
        *         schema:
        *           type: number
        *         required: true
        *         description: Id de habito que se va a actualizar
        *     responses:
        *       200:
        *         description: La actualizacion del recurso fue exitosa
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 type:
        *                   type: string
        *                   descripcion: tipo de respuesta
        *                 title:
        *                   type: string
        *                   descripcion: titulo de la respuesta
        *                 message:
        *                   type: string
        *                   descripcion: mensaje de la respuesta
        *                 data: 
        *                   type: object
        *                   descripcion: Datos de la respuesta
        *       422:
        *         description: Los datos en el cuerpo de la solicitud no son procesables porque el formato es incorrecto o falta un elemento en el cuerpo de la solicitud 
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 errors:
        *                   type: array
        *                   items:
        *                     type: object
        *                   descripcion: errores en la solicitud  
        *       400:
        *         description: Los datos en el cuerpo de la solicitud no estan bien formulados, por un tipo de dato incorrecto 
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 type:
        *                   type: string
        *                   descripcion: tipo de error
        *                 title:
        *                   type: string
        *                   descripcion: titulo del error
        *                 message:
        *                   type: string
        *                   descripcion: mensaje del error
        *                 errors: 
        *                   type: object
        *                   descripcion: Datos del error  
        *       404:
        *         description: No se pudo encontrar el recurso de habito para su actualizacion
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 type:
        *                   type: string
        *                   descripcion: tipo de error
        *                 title:
        *                   type: string
        *                   descripcion: titulo del error
        *                 message:
        *                   type: string
        *                   descripcion: mensaje del error
        *                 errors: 
        *                   type: object
        *                   descripcion: Datos del error   
        *       500:
        *         description: Hubo un fallo en el servidor durante la solicitud 
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 type:
        *                   type: string
        *                   descripcion: tipo de error
        *                 title:
        *                   type: string
        *                   descripcion: titulo del error
        *                 message:
        *                   type: string
        *                   descripcion: mensaje del error
        *                 errors: 
        *                   type: object
        *                   descripcion: Datos del error 
        * 
        */
    
        const body = request.all()
    
        await request.validate({
            schema: schema.create({
              name: schema.string.nullableAndOptional(),
              description: schema.string.nullableAndOptional(),
              user_id: schema.number.nullableAndOptional()
            }),
            messages: {
              'user_id.number': 'El id del user debe ser un numero entero'
              }
          })
    
        var habit = await Habit.find(params.habit_id)
        if(!habit){
            response.notFound({                 
                "type":"Error",
                "title": "Recurso no encontrado",
                "message": "El recurso de habito no pudo encontrarse",
                "errors": [] 
            })
            return
        }
    
        try{
          if(body.name){
            habit.name = body.name
          }
          if(body.description){
            habit.description = body.description
          }
          if(body.user_id){
            habit.user_id = body.user_id
          }
        }catch(error){
          response.internalServerError({                 
            "type":"Error",
            "title": "Error de sevidor",
            "message": "Hubo un fallo en el servidor durante el registro de los datos",
            "errors": error
          })
          return
        }
    
        response.send ({
          "type":"Exitoso",
          "title":"Recurso actualizado",
          "message":"El recurso habito ha sido actualizado exitosamente",
          "data":habit,
        })
        
      }
    
      public async destroy({params,response}: HttpContextContract) {
        /**
        * @swagger
        * /api/habits/{habit_id}:
        *   delete:
        *     description: Elimina de la base de datos al habito identificado por el numero id indicado.
        *     tags:
        *       - Habits
        *     security:
        *       - bearerAuth: []
        *     produces:
        *       - application/json
        *     parameters:
        *       - in: path
        *         name: habit_id
        *         schema:
        *           type: number
        *         required: true
        *         description: Id de habit que se va a eliminar
        *     responses:
        *       200:
        *         description: La eliminacion fue exitosa
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 type:
        *                   type: string
        *                   descripcion: tipo de respuesta
        *                 title:
        *                   type: string
        *                   descripcion: titulo de la respuesta
        *                 message:
        *                   type: string
        *                   descripcion: mensaje de la respuesta
        *                 data: 
        *                   type: object
        *                   descripcion: Datos de la respuesta
        *       404:
        *         description: No se pudo encontrar el recurso de habito para su eliminacion
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 type:
        *                   type: string
        *                   descripcion: tipo de error
        *                 title:
        *                   type: string
        *                   descripcion: titulo del error
        *                 message:
        *                   type: string
        *                   descripcion: mensaje del error
        *                 errors: 
        *                   type: object
        *                   descripcion: Datos del error   
        *       500:
        *         description: Hubo un fallo en el servidor durante la solicitud 
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 type:
        *                   type: string
        *                   descripcion: tipo de error
        *                 title:
        *                   type: string
        *                   descripcion: titulo del error
        *                 message:
        *                   type: string
        *                   descripcion: mensaje del error
        *                 errors: 
        *                   type: object
        *                   descripcion: Datos del error 
        * 
        */
        const habit = await Habit.query().where('habit_id',params.habit_id).preload('configuration').first()
    
        if(habit){
         
          await habit.related('configuration').query().delete()
          await habit.delete()
    
          response.send ({
            "type":"Exitoso",
            "title":"Recurso eliminado",
            "message":"El recurso habito ha sido eliminado exitosamente",
            "data":habit,
          })
        }
        else{
          response.notFound({                 
            "type":"Error",
            "title": "Recurso no encontrado",
            "message": "El recurso de habito no pudo encontrarse",
            "errors": [] 
          })
        }
    
      }
    }