import React from 'react';

import 'isomorphic-fetch';
import GetAssessmentInfoService from "../../../api/assessment/AssessmentInfoService";
//Tests to check report functionality in assessment module
describe('Diet Score list data', () => {
    // request object
    
    let reqItem = "Diet Score";
    let reqCode='DAN';
    let reqImageURL="";
    let reqDescription="A score indicating compliance to the Mediterranean diet. A high intake of the Mediterranean foods: cereals, legumes, fruits, vegetables, olive oil and fish were scored positive (1) and and a high intake of the non-Mediterranean foods: dairy and meat negative (0). The score ranged from 0 to 9 and the higher the score the better the compliance to a traditional Mediterranean diet.";
    let data;

    it('proper json response should come from backend', async function () {
        data = await GetAssessmentInfoService.fetchAssessmentInfo(reqItem);
        expect(data).toBeTruthy();
    });
    it('proper theme Name should come from backend', async function () {
        expect(data[0].themeName).toEqual(reqItem);    
    });
    it('proper theme Code should come from backend', async function () {
        expect(data[0].themeCode).toEqual(reqCode);    
    });
    it('proper description should come from backend', async function () {
        expect(data[0].description).toEqual(reqDescription);    
    });
    it('proper imageURL should come from backend', async function () {
        expect(data[0].imageURL).toEqual(reqImageURL);    
 
    });
}
);
