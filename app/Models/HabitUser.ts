import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Habit from './Habit'
import User from './User'
import Configuration from './Configuration'

export default class HabitUser extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  public static table = "habit_user"

  @column()
  public habito_id: number 
  @column()
  public user_id: number 

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  
  @belongsTo(() => Habit, {
    localKey: 'id',  
    foreignKey: 'habito_id',
  })
  public habit: BelongsTo<typeof Habit>
  
  @belongsTo(() => User, {
    localKey: 'id',  
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>
  @hasMany(() =>Configuration, {
    localKey: 'id',
    foreignKey: 'habit_user_id', 
  })
  public trip: HasMany<typeof Configuration>
}
