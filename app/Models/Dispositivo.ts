import { DateTime } from 'luxon';
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm';
import User from './User';
import TipoDispositivo from './TipoDispositivo';
import Sensor from './Sensor';

export default class Dispositivo extends BaseModel {

  // Especificar el nombre de la tabla como una variable estática
  public static table = 'dispositivo';

  @column({ isPrimary: true })
  public id: number;

  @column()
  public tipoDispositivoId: number;

  @column()
  public id_usuario: number;

  @column()
  public nombre: String;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => User)
  public usuario: BelongsTo<typeof User>;

  @hasMany(() => Sensor, {
    localKey: 'id',
    foreignKey: 'dispositivo_id', 
  })
  public sensores: HasMany<typeof Sensor>
  @belongsTo(() => TipoDispositivo)
  public tipoDispositivo: BelongsTo<typeof TipoDispositivo>;
}
