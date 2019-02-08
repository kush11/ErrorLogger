import 'isomorphic-fetch';
import GetAssessmentInfoService from "../../../api/assessment/AssessmentInfoService";
//Tests to check report functionality in assessment module
describe('Back End assesment list data', () => {
    // request object

    let reqItem = "Strength & Energy";
    let reqCode='SAE';
    let reqDescription="Strength has several shades of meaning. The strength of something can be the measure of how much force or pressure it can withstand over time (like a flood wall). Or its potency (like a pesticide). Or its intensity level (like a radio signal). Its fighting capabilities (like an army). Or its specialty: A chameleon's strength is actually in its ability to blend in with its surroundings."
    let reqImageURL="";
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
