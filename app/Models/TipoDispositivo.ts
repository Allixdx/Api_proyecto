// app/Models/TipoDispositivo.ts
import { DateTime } from 'luxon';
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import Dispositivo from './Dispositivo';

export default class TipoDispositivo extends BaseModel {
  public static table='tipo_dispositivo'
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => Dispositivo)
  public dispositivos: HasMany<typeof Dispositivo>;
}
