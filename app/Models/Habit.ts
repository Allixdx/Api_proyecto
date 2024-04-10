import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Configuration from './Configuration'

export default class Habit extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  public static table = "habitos"


  @column()
  public name: String 

  @column()
  public description: String 

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  @hasMany(() => Configuration, {
    localKey: 'id',  
    foreignKey: 'habit_id',
  })
  public configuration: HasMany<typeof Configuration>

}
