import axios from "axios";

export default class EdamamaResource {
    public static async comida(){
        const res = await axios.get('url')
        return res.data
    }
}