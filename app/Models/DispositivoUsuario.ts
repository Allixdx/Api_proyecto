import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class DispositivoUsuario extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column ()
  public user_id: number

  @column()
  public dispositivo_id:number

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
}
