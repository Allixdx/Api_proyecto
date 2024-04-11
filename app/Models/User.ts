// app/Models/User.ts

import { DateTime } from 'luxon';
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import Habit from './Habit';


/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          example: 10
 *        name:
 *          type: string
 *          example:  Arthur
 *        lastname:
 *          type: string
 *          example:  Morgan
 *        email:
 *          type: string
 *          example:  hola@example.com
 *      required:
 *        - id
 *        - name
 *        - lastname
 *        - email
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
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => Habit)
  public habitos: HasMany<typeof Habit>;
}
