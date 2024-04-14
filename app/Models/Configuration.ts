import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import HabitUser from './HabitUser'

/**
 * @swagger
 * components:
 *  schemas:
 *    Configuration:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          example: 10
 *        user_id:
 *          type: integer
 *          example:  10
 *        data:
 *          type: string
 *          example:  43
 *        tipo_configuracion_id:
 *          type: integer
 *          example: 1
 *      required:
 *        - id
 *        - user_id
 *        - data
 *        - tipo_configuracion_id
 */
export default class Configuration extends BaseModel {
  public static table = "configuracion_habito"

  @column({ isPrimary: true })
  public id: number
  
  @column()
  public user_id: number 

  @column()
  public data: string

  @column()
  public tipo_configuracion_id: number

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @belongsTo(() => HabitUser, {
    localKey: 'id',  
    foreignKey: 'user_id',
  })
  public habit_user: BelongsTo<typeof HabitUser>
}
