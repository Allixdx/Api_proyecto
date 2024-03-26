// app/Models/User.ts
<<<<<<< HEAD
import { DateTime } from 'luxon';
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import Habito from './Habito';
=======

import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Dispositivo from 'App/Models/Dispositivo'
>>>>>>> 76a7df716ac4ac2eeacab74a0c6ae7e45b483c0b

export default class User extends BaseModel {
  public static table='users'
  
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public lastname: string;

  @column()
  public email: string;

  @column.dateTime({ autoCreate: true })
  public emailVerifiedAt: DateTime;

  @column()
  public verificationCode: string | null;

  @column()
  public password: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => Habito)
  public habitos: HasMany<typeof Habito>;
}
