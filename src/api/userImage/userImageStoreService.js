import React from "react";
export default class GetUserImagePostData {

    static fetchUserStoreData = (userImage) => {
        return fetch("https://profile-image-be7aa.firebaseio.com/profile_image.json", {
            method: "POST",
            body: JSON.stringify(userImage)
        })
    }
}


