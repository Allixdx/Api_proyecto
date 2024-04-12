import { DateTime } from 'luxon';
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import User from './User';
import TipoDispositivo from './TipoDispositivo';

/**
 * @swagger
 * components:
 *  schemas:
 *    Dispositivo:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          example: 10
 *        nombre:
 *          type: string
 *          example: Omnitrix
 *        tipoDispositivoId:
 *          type: integer
 *          example:  10
 *        id_usuarios:
 *          type: integer
 *          example:  10
 *        data:
 *          type: string
 *          example:  Datos
 *      required:
 *        - id
 *        - nombre
 *        - tipoDispositivoId
 *        - id_usuarios
 *        - data
 */
export default class Dispositivo extends BaseModel {

  // Especificar el nombre de la tabla como una variable estática
  public static table = 'dispositivo';

  @column({ isPrimary: true })
  public id: number;

  @column()
  public nombre: string;

  @column()
  public tipoDispositivoId: number;

  @column()
  public id_usuario: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => User)
  public usuario: BelongsTo<typeof User>;

  @belongsTo(() => TipoDispositivo)
  public tipoDispositivo: BelongsTo<typeof TipoDispositivo>;
}
