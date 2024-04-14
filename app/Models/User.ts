// app/Models/User.ts

import { DateTime } from 'luxon';
import { BaseModel, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm';
import Habit from './Habit';
import Dispositivo from './Dispositivo';


/**
 * @swagger
 * components:
 *  schemas:
 *    Users:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          example: 10
 *        name:
 *          type: string
 *          example:  Naruto
 *        lastname:
 *          type: string
 *          example:  Uzumaki
 *        email:
 *          type: string
 *          example: bolillo@gmail.com
 *        password:
 *          type: string
 *          example: passwd1234
 *      required:
 *        - id
 *        - name
 *        - lastname
 *        - email
 *        - password
 */
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
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @hasMany(() => Dispositivo,{
    localKey: 'id',  
    foreignKey: 'id_usuario'})
  public dispositivo: HasMany<typeof Dispositivo>;

  @manyToMany(() => Habit, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'habito_id',
  })
  public Habit: ManyToMany<typeof Habit>
}
