const functions = require("firebase-functions");

const cors = require("cors")({ origin: true });

const fs = require("fs");

const UUID = require("uuid-v4");


// Creating the Configuration file for the project 
// keyFilename is the the generated private key from the firebase project Setting
const gcConfig = {
    projectId: "profile-image-be7aa",
    keyFilename: "profile-image-be7aa-firebase.json"
};

// Google 
const { Storage } = require("@google-cloud/storage");

const gcs = new Storage(gcConfig);

// Creating the function with the name storeImage to target the http request
exports.storeImage = functions.https.onRequest((request, response) => {

    // cors is used to allow access to function from other origin
    cors(request, response, () => {

        const body = JSON.parse(request.body);

        fs.writeFileSync("/tmp/uploaded-image.jpg", body.image, "base64", err => {
            console.log(err);
            return response.status(500).json({ error: err });
        }
        );
        const bucket = gcs.bucket("profile-image-be7aa.appspot.com");
        const uuid = UUID();
        bucket.upload("/tmp/uploaded-image.jpg", {
            uploadType: "media",
            destination: "/profileImage/" + uuid + ".jpg",
            metadata: {
                metadata: {
                    contentType: "image/jpeg",
                    firebaseStorageDownloadToken: uuid
                }
            }
        },
            (err, file) => {
                if (!err) {
                    response.status(201).json({
                        imageUrl: "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" +
                            encodeURIComponent(file.name) + "?alt=media&token=" + uuid
                    });
                } else {
                    console.log(err);
                    response.status(500).json({ error: err });
                }
            }
        );
    });
});