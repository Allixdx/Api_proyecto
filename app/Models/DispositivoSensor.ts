import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Sensor from 'App/Models/Sensor'
import Dispositivo from 'App/Models/Dispositivo'

export default class DispositivoSensor extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public dispositivo_id: number

  @column()
  public sensor_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relación con el modelo dispositivo (pertenece a un dispositivo)
  @belongsTo(() => Dispositivo)
  public dispositivo: BelongsTo<typeof Dispositivo>

  // Relación con el modelo Sensor (pertenece a un sensor)
  @belongsTo(() => Sensor)
  public sensor: BelongsTo<typeof Sensor>
}
