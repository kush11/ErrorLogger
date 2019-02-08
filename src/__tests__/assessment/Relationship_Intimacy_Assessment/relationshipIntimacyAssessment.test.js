import React from 'react';

import 'isomorphic-fetch';
import GetAssessmentInfoService from "../../../api/assessment/AssessmentInfoService";
//Tests to check report functionality in assessment module
describe('Back End assesment list data', () => {
    // request object

    let reqItem = "Relationship & Intimacy";
    let themeCode = "RAI";
    let description = "An intimate relationship is an interpersonal relationship that involves physical or emotional intimacy. Physical intimacy is characterized by friendship, platonic love, romantic love, or sexual activity. While the term intimate relationship commonly implies the inclusion of a sexual relationship, the term is also used as a euphemism for a relationship that is strictly sexual."
    let data;

    it('proper json response should come from backend', async function () {
        data = await GetAssessmentInfoService.fetchAssessmentInfo(reqItem);
        expect(data).toBeTruthy();
    });
     it('proper json response should come from backend', async function () {

        expect(data[0].themeName).toEqual(reqItem);
        
    });
    it('check for the themeCode',async function(){
        expect(data[0].themeCode).toEqual(themeCode);
    })

    it('check for the decription',async function(){
        expect(data[0].description).toEqual(description);
    })
}
);
