import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import swal from 'sweetalert2';
import { SurveyQuestionsComponent } from "../survey/surveyquestions.component";
declare var jQuery: any;

@Injectable()
export class ConfirmDeactivateGuard implements CanDeactivate<SurveyQuestionsComponent> {
  canDeactivate(target: any) {
    if (target.childSurveyQuestion && target.childSurveyQuestion.alertChangeDetect()) {
      //var ret = false;
      var ret = swal({
        title: 'Are you sure?',
        text: "Survey is not saved. You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.value) {
          console.log("inside true");
          return true;
        }
        else
          return false;
      });
      if (typeof jQuery != 'undefined') {
        jQuery('.swal2-container').css("z-index", 9999);
      }
      return ret;
      //return window.confirm('Do you really want to cancel?');
    }
    return true;
  }
}
