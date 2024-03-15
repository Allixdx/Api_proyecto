import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, column, belongsTo, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import DispositivoSensor from 'App/Models/DispositivoSensor'

export default class Dispositivo extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public tipo_dispositivo_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relación con el modelo User (pertenece a un usuario)
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  // Relación con el modelo BraceletSensor (tiene muchos sensores)
  @hasMany(() => DispositivoSensor)
  public sensors: HasMany<typeof DispositivoSensor>
}
