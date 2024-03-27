import { DateTime } from 'luxon'
import { BaseModel, HasOne, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Habit from './Habit'

export default class Configuration extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  public static table = "configuracion_habito"

  @column()
  public habit_id: number 

  @column()
  public name: String 

  @column()
  public data: String

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Habit, {
    localKey: 'habit_id',  
    foreignKey: 'id',
  })
  public habit: HasOne<typeof Habit>
}
