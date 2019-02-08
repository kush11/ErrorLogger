const initialState = {
    isTutorialVisible:false
 }
 
 
 const TutorialReducer = (state = initialState, action) => {
     switch (action.type) {
         case 'TutorialReducer_TutorialVisible': {
             state = { ...state, isTutorialVisible: action.payload }
             break;
         }
     }
     return state;
 }
 
 export default TutorialReducer;