import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import BraceletSensor from 'App/Models/BraceletSensor'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public braceletSensorId: number

  @column()
  public description: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relación con el modelo BraceletSensor (pertenece a un sensor de brazalete)
  @belongsTo(() => BraceletSensor)
  public braceletSensor: BelongsTo<typeof BraceletSensor>
}
