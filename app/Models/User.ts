// app/Models/User.ts

import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Bracelet from 'App/Models/Bracelet'

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

  @hasMany(() => Bracelet)
  public bracelets: HasMany<typeof Bracelet>

  // Método ejecutado antes de guardar el usuario para hashear la contraseña
  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
