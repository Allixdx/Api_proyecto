import axios from "axios";

export default class EdamamaResource {
    public static async comida(){
        const res = await axios.get('https://api.edamam.com/doc/open-api/food-db-v2.json')
        return res.data
    }
}