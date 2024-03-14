import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import DispositivoSensor from 'App/Models/DispositivoSensor'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public dispositivo_sensors_id: number

  @column()
  public description: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relación con el modelo DispositivoSensor (pertenece a un sensor de brazalete)
  @belongsTo(() => DispositivoSensor)
  public DispositivoSensor: BelongsTo<typeof DispositivoSensor>
}
