import React from 'react';

import 'isomorphic-fetch';
import GetImageDataService from "../../api/userImage/UserImageGetService";
//Tests to check report functionality in assessment module
describe('Back End assesment report data', () => {

    let userId = "-LRkZadQbddq_KzlXRjX";
    let userName = "zul"
    let data = [];
    const ImageList = [];

    getImageData = (data) => {
        for (let key in data) { ImageList.push({ ...data[key], id: key }); }
    }

    it('proper json response should come from the Firebase', async function () {
        data = await GetImageDataService.fetchUserGetData();
        expect(data).toBeTruthy();
        getImageData(data);
    });
    it('proper Name should come from the firebase', async function () {
        expect(ImageList[0].user).toEqual(userName)
    });
    it('proper ID should come from the firebase', async function () {
        expect(ImageList[0].id).toEqual(userId)    
    });
    it('proper Image URL Should be stored to the firebase', async function () {
        expect(ImageList[0].image.imageUrl).toBeTruthy();
    });
}
);
