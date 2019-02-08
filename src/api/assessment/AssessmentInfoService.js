import React from "react";
import { themeCode } from '../../components/utility/assessment/themeCodes';
import {BASE_URL,headers} from '../../api/config/Config';
export default class GetAssessmentInfoService {

    static fetchAssessmentInfo = (reqItem) => {
        let requestUrl = BASE_URL + '/api/theme/getSummary?themeCode=' + themeCode(reqItem);
        return fetch(requestUrl, {
            method: 'GET',
            headers
        }).then((response) => response.json())
    }
}