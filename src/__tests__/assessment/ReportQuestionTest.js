import React from 'react';

import 'isomorphic-fetch';
import ReportQuestionService from "../../api/assessment/ReportQuestionService";
//Tests to check report functionality in assessment module
describe('report question method accepts data',()=>{
    // request object

    let requestObject = {
      questionId: "sample_question_id",
      feedback:"sample feedback",
      user:"sample user",
      assessmentId:"sample_assessment_id"
    } ;
    let data;

    it('proper json response should come from backend', async function (){
        data = await ReportQuestionService.fetchFeedback(requestObject);
        expect(data).toBeTruthy();
    });
    it('response id should be defined', async () => {        
          expect(data._id).toBeTruthy();
    });
     it('feedback id should be defined', async () => {        
          expect(data.feedbackId).toBeTruthy();
    });
    it('questionId should be same as of request object', async () => {
          expect(data.questionId).toEqual(requestObject.questionId);
    });
    it('feedback should be same as of request object', async () => {
          expect(data.feedback).toEqual(requestObject.feedback);
    });
    it('user should be same as of request object', async () => {
          expect(data.user).toEqual(requestObject.user);
    });
    it('assessmentId should be same as of request object', async () => {
          expect(data.assessmentId).toEqual(requestObject.assessmentId);
    });


 }
);
