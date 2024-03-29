import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Sensor from 'App/Models/Sensor'

export default class SensorType extends BaseModel {
  public static table='sensor_types'
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public unit: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @hasMany(() => Sensor)
  public sensors: HasMany<typeof Sensor>
}
