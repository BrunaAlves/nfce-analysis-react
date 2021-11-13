import axios from "axios";
import AuthService from "../services/auth.service";

class Requester {
    get(url, options) {
        return new Promise((resolve, reject) => {
            axios.get(url, options).then((r) => resolve(r)).catch((error) => {
                if(error.response && (error.response.status == 401 || error.response.status == 403)){
                    AuthService.logout()
                    window.location.reload()
                }
                reject(error)
            });
        })
    }
}

export default new Requester ();