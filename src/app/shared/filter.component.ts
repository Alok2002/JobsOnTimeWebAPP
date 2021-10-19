import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Job } from '../models/job';
import { Session } from '../models/session';
import { User } from '../models/user';
import { Client } from './../models/client';
import * as appGlobal from './enum';
import { SharedServices } from '../services/shared.services';
import { UserServices } from '../services/user.services';
import { EventServices } from '../services/event.services';
import { map } from 'rxjs/operators';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styles: [
    `.add-cr-btn {float: right;height: 26px;}.add-cr-input{float:left;width:calc(100% - 35px)}
    .add-multi-cri-btn:focus {outline: none !important}`
  ]
})

export class FilterComponent implements OnInit {
  @Output() filterSubmit = new EventEmitter();
  @Output() panelMemberInit = new EventEmitter();
  @Input() entity: string;
  @Input() showFilter: string;
  @Input() isUpdateFiler: boolean;
  @Output() filtersEmit = new EventEmitter();

  @Input() surveyId: number;
  @Input() selectedFilterId: number;
  @Input() jobId = 0;
  @Input() isPanelMember = false;
  @Input() showLoadExistingQuery = true;

  //Filterpart
  filterColors: Array<{ text: string, style: string, value: number }> = appGlobal.FilterColors;
  filterCriterias = [{ 'caption': '', 'type': '', 'value': '' }];
  filterCriCount = 1;
  selectedCriteriaIndex: number;
  filterCompareMethods = [];
  filters: Array<{
    caption: string, value1: string, value2: string, value3: string, value4: string, value5: string, value6: string, value7: string,
    comparison: string, color: number, type: string, options: Array<{ text: string, value: string }>
  }> = [];

  maxrecords: number;

  selectedexistingfilterid: number = -1;
  existingfilterlist = [];

  clients = [];
  jobs = [];
  jobSessions = [];
  eventTypes: any;
  staffs: Array<User>;

  colorIndex = 1;
  addNewCriteriaIds = [];
  addNewCriteriaIdsTemp = [];
  newcriteriasearch: string;

  constructor(private http: HttpClient, private sharedService: SharedServices,
    private eventservice: EventServices, private userService: UserServices) {
  }

  ngOnInit() {
    this.getExistingQueryList();
    this.getFilterCriteria();
    this.getFilterCompareMethods();
    if (this.selectedFilterId == null) {
      this.getDefaultFilter();
    }
    this.getEventClients();
    this.getEventTypes();
    this.getActiveUsers();
  }

  ngOnChanges() {
    console.log(this.selectedFilterId);
    console.log(this.isUpdateFiler);
    // debugger
    if (this.isUpdateFiler) {
      this.getExistingQueryList();
    }

    if (this.selectedFilterId) {
      this.selectedexistingfilterid = this.selectedFilterId;
      this.getExistingQueryList();
    }
  }

  getFilterCriteria() {
    this.sharedService.getFilterCriteria(this.entity, this.surveyId)
      .subscribe((res: any) => {
        console.log(res);
        this.filterCriterias = res.value;

        if (this.entity != 'respondent' && this.entity != 'ClientJobSurvey') {
          this.filterCriterias.sort((a, b) => {
            if (a.caption > b.caption) return 1;
            if (a.caption < b.caption) return -1;
            else return 0;
          })
        }
      });
  }

  async changeSelectedCriteriaDropdown() {
    return new Promise(resolve => {
      this.sharedService.getFilterItemList(this.entity, this.filterCriterias[this.selectedCriteriaIndex].caption, this.surveyId)
        .subscribe((res: any) => {
          console.log(res);
          for (var i = 0; i < this.filterCriCount; i++) {
            var comparsion = 'Is';
            if (this.filterCriterias[this.selectedCriteriaIndex].caption.indexOf('Question') > -1)
              comparsion = 'Contains';
            var fl = {
              caption: this.filterCriterias[this.selectedCriteriaIndex].caption,
              value1: '', value2: '', value3: '', value4: '', value5: '', value6: '', value7: '', color: this.filterCriCount > 1 ? this.filterColors[this.colorIndex].value : 0, comparison: comparsion, options: [],
              type: this.filterCriterias[this.selectedCriteriaIndex].type
            };

            fl.options = res.value;

            if (fl.options && fl.options.length > 0)
              fl.value1 = fl.options[0].value;

            fl = JSON.parse(JSON.stringify(fl));
            this.filters.push(fl);
          }
          setTimeout(() => {
            resolve(true);
          }, 1000)
        });
    });
  }

  async changeSelectedCriteria(isMultiple?) {
    return new Promise(async resolve => {
      if (this.selectedCriteriaIndex != -1) {
        if (this.filterCriterias[this.selectedCriteriaIndex].type == 'DropDown') {
          await this.changeSelectedCriteriaDropdown().then((data: string) => {
            console.log("index " + this.selectedCriteriaIndex)
            this.changeSelectedCriteriaHelper(isMultiple);
            resolve(true);
          });
        }
        else {
          for (var i = 0; i < this.filterCriCount; i++) {
            var comparsion = 'Is';
            if (this.filterCriterias[this.selectedCriteriaIndex].type == 'Text')
              comparsion = 'Contains';

            var fl = {
              caption: this.filterCriterias[this.selectedCriteriaIndex].caption,
              value1: '', value2: '', value3: '', value4: '', value5: '', value6: '', value7: '', color: this.filterCriCount > 1 ? this.filterColors[this.colorIndex].value : 0, comparison: comparsion, options: [],
              type: this.filterCriterias[this.selectedCriteriaIndex].type
            };

            this.filters.push(fl);
          }

          this.changeSelectedCriteriaHelper(isMultiple);
          resolve(true);
        }
      }
    })
  }

  changeSelectedCriteriaHelper(isMultiple) {
    if (this.filterCriCount > 1) {
      this.colorIndex++;
      this.filterCriCount = 1;
    }

    this.filtersEmit.emit(this.filters);
    if (isMultiple && this.addNewCriteriaIdsTemp.length == 0) {
      setTimeout(() => {
        this.selectedCriteriaIndex = -1;
      }, 500);
    } else {
      setTimeout(() => {
        this.selectedCriteriaIndex = -1;
      }, 500);
    }

    if (isMultiple && this.addNewCriteriaIdsTemp.length > 0)
      this.submitAddNewCriteriaMultiselect(false);
  }

  getFilterCompareMethods() {
    this.sharedService.getFilterCompareMethods()
      .subscribe((res: any) => {
        console.log(res);
        this.filterCompareMethods = res.value;
      });
  }

  addNewCriteria(i) {
    var jsstr = JSON.stringify(this.filters[i]);
    this.filters.push(JSON.parse(jsstr));
    this.filtersEmit.emit(this.filters);
  }

  removeCriteria(i) {
    this.filters.splice(i, 1);
    this.filtersEmit.emit(this.filters);
  }

  getFilterColor(colorvalue) {
    var ret = '';
    this.filterColors.forEach((fc) => {
      if (fc.value == colorvalue)
        ret = fc.style;
    });
    return ret;
  }

  loadExistingFilter() {
    var index = this.existingfilterlist.findIndex((ex) => ex.id == this.selectedexistingfilterid);
    if (index >= 0) {
      this.maxrecords = this.existingfilterlist[index].maxRecords ? this.existingfilterlist[index].maxRecords : null;
    }
    // debugger

    this.sharedService.getExistingFilter(this.entity, this.selectedexistingfilterid)
      .subscribe((res: any) => {
        console.log(res);

        this.filters = [];
        res.value.forEach(el => {
          var fl = {
            caption: el.caption,
            value1: el.values[0], value2: el.values[1], value3: el.values[2], value4: el.values[3], value5: el.values[4], value6: el.values[5], value7: el.values[6],
            color: el.groupID, comparison: el.comparisonMethod, options: [],
            type: el.typeValue
          };

          if (el.typeValue == 'DropDown') {
            this.sharedService.getFilterItemList(this.entity, el.caption, this.surveyId)
              .subscribe((res: any) => {
                console.log(res);
                fl.options = res.value;
              });
          }

          if (el.typeValue == 'Date') {
            //var date1 = moment(fl.value1, ['DD-MMM-YY','DD-MMM-YY']);
            //fl.value1 = date1.format();
            // var date1 = moment(this.GetDate(fl.value1), 'DD/MM/YYYY');
            // console.log(date1);
          }

          if (el.typeValue == 'ClientJobGroupEvent') {
            if (fl.value1) this.getJobByClient(fl.value1);
            if (fl.value2) this.getJobGroupByJob(fl.value2);
          }

          this.filters.push(fl);
          console.log(this.filters);
        });

        this.filtersEmit.emit(this.filters);
        setTimeout(() => {
          this.selectedexistingfilterid = -1;
        }, 500);
      });

    //filters;
    //var data = "Job Number|||||Contains|";
  }

  /*GetDate(str) {
      // debugger;
              var arr = str.split('-');
             var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
             var i = 1;
             for (i; i <= months.length; i++) {
                    if (months[i] == arr[1])
                     {
                       break;
                     }
                }
              //   var formatddate = i  + '/' + arr[0] + '/' + arr[2];
                var formatddate = arr[0]  + '/' + i + '/' + arr[2];
                return formatddate;
          }*/

  filterSubmitFn() {
    var filter = { 'filters': this.filters, 'maxrecords': this.maxrecords };
    this.filterSubmit.emit(filter);
  }

  getDefaultFilter(resetfilter?) {
    this.sharedService.getDefaultFilter(this.entity)
      .subscribe((res: any) => {
        console.log(res);

        res.value.forEach(el => {
          var comparsion = 'Is';
          if (el.typeValue == 'Text')
            comparsion = 'Contains';
          if (el.typeValue == 'DropDown' && el.caption.indexOf('Question') > -1)
            comparsion = 'Contains';

          var fl = {
            caption: el.caption,
            value1: '', value2: '', value3: '', value4: '', value5: '', value6: '', value7: '', color: -1, comparison: comparsion, options: [],
            type: el.typeValue
          };

          if (el.typeValue == 'DropDown') {
            this.sharedService.getFilterItemList(this.entity, el.caption, this.surveyId)
              .subscribe((res: any) => {
                console.log(res);
                fl.options = res.value;
              });
          }

          this.filters.push(fl);
        });
        this.filtersEmit.emit(this.filters);

        if (resetfilter) {
          var filter = { 'filters': this.filters, 'maxrecords': this.maxrecords };
          console.log(filter);
          this.filterSubmit.emit(filter);
          this.panelMemberInit.emit(true);
        }
      });
  }

  getExistingQueryList() {
    console.log('inside existig query');
    this.sharedService.getExistingQueryList(this.entity, this.jobId)
      .subscribe((res: any) => {
        console.log(res);
        this.existingfilterlist = res.value;
        if (this.selectedexistingfilterid > 0)
          this.loadExistingFilter();
      });
  }

  resetFilter() {
    this.filters = [];
    this.selectedexistingfilterid = -1;
    this.selectedCriteriaIndex = -1;
    this.maxrecords = null;
    this.getDefaultFilter(true);

    // var filter = { 'filters': this.filters, 'maxrecords': this.maxrecords };
    // console.log(filter);
    // this.filterSubmit.emit(filter);
    // this.panelMemberInit.emit(true);
  }

  getEventClients() {
    this.eventservice.getClients()
      .subscribe((res: any) => {
        console.log(res);
        this.clients = res.value;
      })
  }

  getJobByClient(clientid) {
    this.eventservice.getJobListIncludingPast(clientid)
      .subscribe((res: any) => {
        console.log(res);
        // this.jobs = [];
        res.value.forEach((va) => {
          va['clientId'] = clientid;
          this.jobs.push(va);
        })
      })
  }

  getJobByClientHelper(clientid) {
    var ret = [];
    this.jobs.forEach(jb => {
      if (jb.clientId == clientid)
        ret.push(jb)
    })
    return ret
  }

  getJobGroupByJob(jobid) {
    this.eventservice.getGroupListIncludingPast(jobid)
      .subscribe((res: any) => {
        console.log(res);
        // this.jobSessions = [];
        res.value.forEach((va) => {
          va['jobId'] = jobid;
          this.jobSessions.push(va);
        })
      })
  }

  getJobGroupByJobHelper(jobId) {
    var ret = [];
    this.jobSessions.forEach(jb => {
      if (jb.jobId == jobId)
        ret.push(jb)
    })
    return ret
  }

  getEventTypes() {
    this.eventservice.getEventTypes()
      .subscribe((res: any) => {
        console.log(res);
        this.eventTypes = res.value;
      })
  }

  getActiveUsers() {
    this.userService.getActiveUsers()
      .subscribe((res: any) => {
        console.log(res);
        this.staffs = res.value;
      });
  }

  checkAddNewCriteriaMultiselect(cri) {
    var ret = false;
    var index = this.addNewCriteriaIds.indexOf(cri);
    if (index >= 0)
      ret = true;
    return ret;
  }

  changeAddNewCriteriaMultiselect(event) {
    console.log(event)
    if (event.target.checked) {
      this.addNewCriteriaIds.push(event.target.value);
    } else {
      var index = this.addNewCriteriaIds.indexOf(event.target.value);
      if (index >= 0)
        this.addNewCriteriaIds.splice(index, 1);
    }
  }

  async submitAddNewCriteriaMultiselect(isFirstTime) {
    if (isFirstTime) {
      this.addNewCriteriaIdsTemp = JSON.parse(JSON.stringify(this.addNewCriteriaIds));
    }

    if (!isFirstTime)
      this.addNewCriteriaIdsTemp.splice(0, 1);

    console.log(this.addNewCriteriaIdsTemp)
    if (this.addNewCriteriaIdsTemp && this.addNewCriteriaIdsTemp.length > 0) {
      this.selectedCriteriaIndex = this.addNewCriteriaIdsTemp[0];
      await this.changeSelectedCriteria(true);
    }
  }

  resetAddNewCriteriaCheckbox() {
    if (typeof jQuery != 'undefined') {
      jQuery('.cri-checkbox').prop('checked', false);
      jQuery('#add-new-cri').animate({ scrollTop: 0 });
    }
  }

  searchAddNewCriteria(search) {
    var ret = false;
    if (this.newcriteriasearch == null || this.newcriteriasearch == "") ret = true;
    else if (
      search.toLowerCase().search(this.newcriteriasearch.toLowerCase()) > -1
    )
      ret = true;
    else ret = false;
    return ret;
  }

  /*ngAfterViewInit() {
    if (typeof jQuery != 'undefined') {
      jQuery(document).ready(function () {
        setTimeout(function () {
          jQuery("form").find('[autocomplete="off"]').val(null);
        }, 1000);
      });
    }
  }*/
}
