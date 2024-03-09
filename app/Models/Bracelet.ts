import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, column, belongsTo, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import BraceletSensor from 'App/Models/BraceletSensor'

export default class Bracelet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'user_id' }) 
  public userId: number

  @column()
  public name: string

  @column()
  public description: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relación con el modelo User (pertenece a un usuario)
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  // Relación con el modelo BraceletSensor (tiene muchos sensores)
  @hasMany(() => BraceletSensor)
  public sensors: HasMany<typeof BraceletSensor>
}
