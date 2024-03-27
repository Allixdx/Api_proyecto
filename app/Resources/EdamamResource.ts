import axios from 'axios';
import Env from '@ioc:Adonis/Core/Env';

export default class EdamamResource {
  public static async getAllFoods() {
    try {
      const baseURL = 'https://api.edamam.com/api/food-database/v2/parser';
      const params = {
        app_id: Env.get('app_id'),
        app_key: Env.get('app_key')
      };
      const response = await axios.get(baseURL, { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener información sobre los alimentos:', error.response.data);
      throw new Error('Error al obtener información sobre los alimentos');
    }
  }
  public static async getfood(nombrealimento: string) {
    try {
      const baseURL = 'https://api.edamam.com/api/food-database/v2/parser';
      const params = {
        app_id: Env.get('app_id'),
        app_key: Env.get('app_key'),
        ingr: nombrealimento,
      };
      const response = await axios.get(baseURL, { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener información sobre los alimentos:', error.response.data);
      throw new Error('Error al obtener información sobre los alimentos');
    }
  }
}
