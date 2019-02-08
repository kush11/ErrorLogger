import React from 'react';

import 'isomorphic-fetch';
import GetAssessmentReportService from "../../../api/assessment/AssessmentReportService";
//Tests to check report functionality in assessment module
describe('Back End assesment report data', () => {
    
    let reqItem = "5bed4f606ae73140cc4b8aeb";
    let reqTheme="Relationship & Intimacy"
    let data;

    it('proper json response should come from backend', async function () {
        data = await GetAssessmentReportService.fetchAssessmentReport(reqItem);
        expect(data).toBeTruthy();
    });
    it('proper Final Score should come from backend', async function () {
        expect(data.finalScore).toBeTruthy();    
    });
    it('proper Final Score should come from backend', async function () {
        expect(data.finalScore).toEqual(85.5);    
    });
    it('theme name must be equal to Relationship & Intimacy', async function () {
        expect(data.answer[0].theme).toEqual(reqTheme);    
    });
    
}
);
