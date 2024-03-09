import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Bracelet from 'App/Models/Bracelet'
import Sensor from 'App/Models/Sensor'

export default class BraceletSensor extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public braceletId: number

  @column()
  public sensorId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relación con el modelo Bracelet (pertenece a un brazalete)
  @belongsTo(() => Bracelet)
  public bracelet: BelongsTo<typeof Bracelet>

  // Relación con el modelo Sensor (pertenece a un sensor)
  @belongsTo(() => Sensor)
  public sensor: BelongsTo<typeof Sensor>
}
