import React from "react";
export default class GetUserImagePostData {

    static fetchUserPostData = (Base64) => {
        return fetch("https://us-central1-profile-image-be7aa.cloudfunctions.net/storeImage", {
                method: "POST",
                body: JSON.stringify({
                    image: Base64
                })
            })
                .then((response) => response.json())
    }
}


