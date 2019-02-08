import React from "react";
import {BASE_URL,headers} from '../../api/config/Config';
export default class GetUserCountService {

    static fetchUsersCount = () => {
        let requestUrl = BASE_URL + '/api/userCount';
        return fetch(requestUrl, {
            method: 'GET',
            headers
        }).then((response) => response.json()).catch((error) => {
            console.error(error);
        });
        
    }
}