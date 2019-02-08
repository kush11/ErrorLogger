import React from "react";
import {BASE_URL,headers} from '../../api/config/Config';
export default class ReportQuestionService {

    static fetchFeedback = (requestObject) =>{
    return fetch(BASE_URL + '/api/savefeedback', {
      method: 'POST',
      headers,
      body: JSON.stringify(requestObject)
    }).then((response) => response.json());
  }
}