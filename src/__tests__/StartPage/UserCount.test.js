import 'isomorphic-fetch';
import GetUserCountService from "../../api/StartPage/UsersCountService";
//Tests to check report functionality in assessment module
describe('Users list data', () => {
    
    // request object
    let data;
    it('proper json response should come from backend', async function () {
        data = await GetUserCountService.fetchUsersCount();
        expect(data).toBeTruthy();
    });
}
);