import 'isomorphic-fetch';
import GetAssessmentInfoService from "../../../api/assessment/AssessmentInfoService";
//Tests to check Though control assessment  functionality in assessment module
describe('Thought Control list data', () => {
    // request object

    let reqItem = "Thought Control";
    let reqCode='TAC';
    let reqDescription="Thought Control is attempt to restrict ideas and impose opinions through censorship and the control of curricula in schools."
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
