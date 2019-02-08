import 'isomorphic-fetch';
import GetAssessmentInfoService from "../../../api/assessment/AssessmentInfoService";
//Tests to check Though control assessment  functionality in assessment module
describe('Biological Age list data', () => {
    // request object

    let reqItem = "Biological Age";
    let reqCode='BLA';
    let reqDescription="Biological Age is a concept used loosely, and with little objectivity, to describe a shortfall between a population cohort average life expectancy and the perceived life expectancy of an individual of the same age. Biomarkers of aging are biomarkers that better predict functional capacity at a later age than chronological age. Stated another way, biomarkers of aging would give the true 'biological age', which may be different from the chronological age."
    let reqImageURL="https://zulimageapi.herokuapp.com/image/A10022-min.jpg";
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
