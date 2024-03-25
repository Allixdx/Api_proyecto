import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo,BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Configuration from './Configuration'

export default class Habit extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  public static table = "habitos"

  @column()
  public user_id: number 

  @column()
  public name: String 

  @column()
  public description: String 

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  
  @belongsTo(() => User, {
    localKey: 'user_id',  
    foreignKey: 'id',
  })
  public user: BelongsTo<typeof User>

  @hasMany(() => Configuration, {
    localKey: 'id',  
    foreignKey: 'habit_id',
  })
  public configuration: HasMany<typeof Configuration>

}
