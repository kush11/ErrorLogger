import React from "react";
import { themeCode } from '../../components/utility/assessment/themeCodes';
import Config from '../config/Config';
import {BASE_URL,headers} from '../../api/config/Config';
//TODO: put api calls from config
export default class OverviewStatsApi {

    static getOverviewStats = (userobject) => {
        return fetch(BASE_URL+"/api/dashboard/userData", {
            method: 'POST',
            headers,
            body: JSON.stringify(userobject)
        }).then((response) => response.json())

    }
}
