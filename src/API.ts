import axios from "axios";
import store2 from "store2";

const BASE_URL = "https://api-im.chatdaddy.tech/";


const token = store2.get("accessToken", "");

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
    },
});


export const API = {
    get: (url = '', params = {}) => {
        return instance.get(url, { 
            ...params, 
        });
    },
    post: (url = '', data = {}, params = {}) => {
        return  instance.post(url, data,  { 
            ...params, 
         
        });
    },
  
};

