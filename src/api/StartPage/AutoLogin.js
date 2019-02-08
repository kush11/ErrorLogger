import React from "react";
import {BASE_URL,headers} from '../../api/config/Config';
//export default class AutoLogin {

   export  const autoLogin = (token1) => {             
        return fetch(BASE_URL + '/api/autoLogin', {
            method: 'POST',   
            headers,         
            body: JSON.stringify({
              token: token1,
            })
          }).then((response) => response.json()).catch((error) => {
            console.error(error);
        });
        
    }
// }
