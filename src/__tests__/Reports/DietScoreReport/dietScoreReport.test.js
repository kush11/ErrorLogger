import React from 'react';

import 'isomorphic-fetch';
import GetAssessmentReportService from "../../../api/assessment/AssessmentReportService";
//Tests to check report functionality in assessment module
describe('Back End assesment report data', () => {
    
    let reqItem = "5bebb34156778e3a80c42b67";
    let data;

    it('proper json response should come from backend', async function () {
        data = await GetAssessmentReportService.fetchAssessmentReport(reqItem);
        expect(data).toBeTruthy();
    });
    it('proper Final Score should come from backend', async function () {
        expect(data.finalScore).toBeTruthy();    
    });
    it('proper Final Score should come from backend', async function () {
        expect(data.finalScore).toEqual(25);    
    });
    
}
);
