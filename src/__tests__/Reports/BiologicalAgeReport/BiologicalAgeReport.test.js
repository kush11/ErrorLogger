import React from 'react';

import 'isomorphic-fetch';
import GetAssessmentReportService from "../../../api/assessment/AssessmentReportService";
//Tests to check report functionality in assessment module
describe('Back End assesment report data', () => {
    
    let reqItem = "5c1b59be13a7f90004674be4";
    let data;

    it('proper json response should come from backend', async function () {
        data = await GetAssessmentReportService.fetchAssessmentReport(reqItem);
        expect(data).toBeTruthy();
    });
    it('proper Final Score should come from backend', async function () {
        expect(data.biologicalAge).toEqual(16.5625);    
    });
    it('proper Final Score should come from backend', async function () {
        expect(data.calendarAge).toEqual(13);    
    });
    
}
);
