import 'isomorphic-fetch';
import AutoLogin from "../../api/StartPage/AutoLogin";
//Tests to check report functionality in assessment module
describe('Users list data', () => {
    
    // request object
    let data;
    let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzA3N2M5ZjM5Y2I1OTAwMDQ5MWMyODYiLCJpYXQiOjE1NDQ1MDc4MDV9.bfDUdIxcychieZaEzCcXkVjxdgfDbqvV4C3gxC2tn0E"
    it('proper json response should come from backend', async function () {
        data = await AutoLogin.autoLogin(token);
        expect(data).toBeTruthy();
    });
    it('proper name must be returned from the backend', async function () {
        expect(data.name).toEqual("Shaswat Patra");    
    });
}
);