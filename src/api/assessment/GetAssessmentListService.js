import React from "react";
import {BASE_URL,headers} from '../../api/config/Config';

export default class GetAssessmentListService {

    static fetchAssessmentList = (reqData) =>{
    return fetch(BASE_URL + '/api/getAssessmentList', {
        method: 'POST',
        headers,
        body: JSON.stringify(reqData)
    }).then((response) => response.json())
  }
}