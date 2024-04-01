// app/Models/DispositivoSensor.ts
import { DateTime } from 'luxon';
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import Dispositivo from './Dispositivo';
import Sensor from './Sensor';

export default class DispositivoSensor extends BaseModel {
  public static table = 'dispositivo_sensors';

  @column({ isPrimary: true })
  public id: number;

  @column()
  public dispositivo_id: number;

  @column()
  public sensor_id: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Dispositivo)
  public dispositivo: BelongsTo<typeof Dispositivo>;

  @belongsTo(() => Sensor)
  public sensor: BelongsTo<typeof Sensor>;
}
