// app/Models/User.ts
import { DateTime } from 'luxon';
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import Habito from './Habito';

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
