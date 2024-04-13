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
 *        habit_id:
 *          type: integer
 *          example:  10
 *        name:
 *          type: string
 *          example:  Arthur Morgan
 *        data:
 *          type: string
 *          example:  Datos
 *      required:
 *        - id
 *        - habit_od
 *        - name
 *        - data
 */
export default class Configuration extends BaseModel {
  public static table = "configuracion_habito"

  @column({ isPrimary: true })
  public id: number
  
  @column()
  public user_id: number 

  @column()
  public data: String

  @column()
  public tipo_configuracion_id: number

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @belongsTo(() => HabitUser, {
    localKey: 'id',  
    foreignKey: 'habit_user_id',
  })
  public habit_user: BelongsTo<typeof HabitUser>
}
