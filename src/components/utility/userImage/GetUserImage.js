import UserGetImageService from '../../../api/userImage/UserImageGetService'
import {updateFetchedUrl } from '../../../store/actions/index'
import { connect } from 'react-redux';

export const getImageHandler = (userName,UpdateURL) => {
    const ImageList = [];
    UserGetImageService.fetchUserGetData()
        .then(parsedRes => {
            for (let key in parsedRes) {
                ImageList.push({
                    ...parsedRes[key],
                    id: key
                });
            }
        })
        .then(() => {
            const data = ImageList
            let uri = null;
            let id = null;
            for (let i = 0; i < data.length; i++) {
                if (data[i].user === userName) {
                    uri = data[i].image.imageUrl
                    id = data[i].id;
                }
            }
            console.log(uri)
            UpdateURL(uri);
            //return uri
        })
        .catch(err => {
            
            console.log(err);
        });


};
// export default connect(null,mapDispatchToProps)(getImageHandler);