import React from "react";
import { themeCode } from '../../components/utility/assessment/themeCodes';
import {BASE_URL,headers} from '../../api/config/Config';
export default class GetAssessmentReportService {

    static fetchAssessmentReport = (reqId) => {
        return fetch(BASE_URL + '/api/getReport', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                id: reqId,
            })
        }).then((response) => response.json())
    }
}
