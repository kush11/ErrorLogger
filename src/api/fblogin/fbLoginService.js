import React from "react";
import { themeCode } from '../../components/utility/assessment/themeCodes';
import { BASE_URL, headers } from '../../api/config/Config';
export default class GetFacebookInfoService {

    static fetchFacebookInfo = (accessToken) => {
        let requestUrl = 'https://graph.facebook.com/v2.5/me?fields=email,name,friends,picture.type(large)&access_token=' + accessToken
        return fetch(requestUrl)
            .then((response) => response.json())
    }
}