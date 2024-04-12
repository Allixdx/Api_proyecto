// app/Models/ConfiguracionHabito.ts
import { DateTime } from 'luxon';
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm';
import Habito from './Habito';



export default class ConfiguracionHabito extends BaseModel {
  public static table ='configuracion_habito'

  @column({ isPrimary: true })
  public id: number;

  @column()
  public habitId: number;

  @column()
  public name: string;

  @column()
  public data: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Habito)
  public habito: BelongsTo<typeof Habito>;
}
