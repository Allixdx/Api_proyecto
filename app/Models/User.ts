// app/Models/User.ts

import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Dispositivo from 'App/Models/Dispositivo'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public lastname: string

  @column()
  public email: string

  @column()
  public email_verified_at: string

  @column()
  public verification_code: string | null // Asegúrate de tener esta línea

  @column({ serializeAs: null }) // No incluir el campo en las respuestas JSON
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Dispositivo)
  public dispositivos: HasMany<typeof Dispositivo>
}
