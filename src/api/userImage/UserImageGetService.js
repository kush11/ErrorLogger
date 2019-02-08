import React from "react";
export default class GetUserImageData {

    static fetchUserGetData = () => {
        return fetch("https://profile-image-be7aa.firebaseio.com/profile_image.json", {
            method: "GET"
        })
            .then(res => res.json())
    }
}


