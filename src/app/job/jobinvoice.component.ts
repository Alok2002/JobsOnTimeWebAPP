import { Component, OnInit, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { JobInvoice } from '../models/jobinvoice';
import { Job } from '../models/job';
import { JobServices } from '../services/job.services';
import { ClientServices } from '../services/client.services';
import { Client } from '../models/client';
import { User } from '../models/user';
import { UserServices } from '../services/user.services';
import { SharedServices } from '../services/shared.services';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { ClientPO } from '../models/clientpo';
import { Note } from '../models/note';
import * as JWT from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights } from '../shared/enum';
import { invoiceDesSource } from '../app.component';
declare var jQuery: any;

@Component({
  selector: 'JobInvoiceComponent',
  templateUrl: './jobinvoice.component.html'
})

export class JobInvoiceComponent implements OnInit {
  @Input() id: number;
  @Input() isUpdateJob: boolean;

  invoices: Array<JobInvoice> = [];
  invoiceDesSource = invoiceDesSource;

  quotedTotal = 0;
  actualTotal = 0;
  quotedTotalTax = 0;
  actualTotalTax = 0;
  job: Job;
  clients: Array<Client>;
  staffs: Array<User>;
  isLoading = true;

  invoicestatus = [];
  quotestatuslist = [];

  clientpo = new ClientPO();
  selectedContactList = [];
  contactList = [];
  dropdownSettings = {};
  isSubmitForm = false;
  isSubmitFormSpinner = false;

  @ViewChild('closeAddNewModal') closeAddNewModal;

  clientpos: Array<ClientPO>;
  clientNotes: Array<Note> = [];
  hasQuotePermission = false;
  hasMyObPermission = false;

  @ViewChild('container', { read: ViewContainerRef })
  public containerRef: ViewContainerRef;
  hasMyObSecutiry = false;
  isFarronResearch = false;
  countrycode: string;
  accountingSystemName: string;

  constructor(private jobsevice: JobServices, private userService: UserServices, private cookieservice: CookieService,
    private clientservice: ClientServices, private sharedservice: SharedServices, private securityInfoResolve: SecurityInfoResolve) {
  }

  ngOnInit() {
    //this.addNewFirstTime();
    this.getIsFarronResearch();
    this.checkMyobSecurityRights();
    this.getPermissionDetails();
    this.getJobById();
    this.getInvoicesByJobId();
    this.getAllClients();
    this.getStaffs();
    this.getInvoiceStatusList();
    this.getQuoteStatusList();
    this.getCountryCode();
    this.getAccountingSystemName();
  }

  getAccountingSystemName() {
    this.jobsevice.getAccountingSystemName()
      .subscribe((res: any) => {
        console.log(res)
        this.accountingSystemName = res.value.value;
      })
  }

  getCountryCode() {
    this.sharedservice.getCountryCode()
      .subscribe((res: any) => {
        console.log(res)
        this.countrycode = res.value.value;
      })
  }

  getIsFarronResearch() {
    this.sharedservice.getIsFarronResearch()
      .subscribe((res: any) => {
        this.isFarronResearch = res.value;        
      })
  }

  checkMyobSecurityRights() {
    this.securityInfoResolve.checkPermission(SecurityRights.StaffMYOBAccess)
      .subscribe((res: any) => {
        console.log(res)
        if (res.succeeded) this.hasMyObSecutiry = true;
      })
  }

  getJobById() {
    this.jobsevice.getJobsByJob(this.id)
      .subscribe((res: any) => {
        this.job = res.value;
        console.log(this.job);
        if (this.job.dateQuoted)
          this.job.dateQuoted = moment(this.job.dateQuoted).toDate();
        if (this.job.dateJobApproved)
          this.job.dateJobApproved = moment(this.job.dateJobApproved).toDate();
        if (this.job.invoiceSent)
          this.job.invoiceSent = moment(this.job.invoiceSent).toDate();
        if (this.job.quoteFollowUpDate)
          this.job.quoteFollowUpDate = moment(this.job.quoteFollowUpDate).toDate();

        if (this.job.invoiceNumber == null) this.job.invoiceNumber = 'Auto';

        this.getContactbyClient(this.job.clientId);
        this.getClientPObyClientId(this.job.clientId);
        this.getInvoiceWarningByClient(this.job.clientId);
      });
  }

  getInvoicesByJobId() {
    this.jobsevice.getInvoicesByJobId(this.id)
      .subscribe((res: any) => {
        this.invoices = res.value;
        this.invoices.sort((a, b) => {
          if (a.itemOrder > b.itemOrder) return 1;
          if (a.itemOrder < b.itemOrder) return -1;
          return 0
        });
        console.log(this.invoices);
        this.calcuateTotal();

        // this.invoices.forEach(inv => {
        //   this.invoiceDesSource.forEach(ids => {
        //     if (inv.itemDescription == ids.value)
        //       inv.itemDescriptionObj = ids;
        //   });
        // });

        if (!this.invoices || this.invoices.length < 1)
          this.addNewFirstTime();
      });
  }

  getInvoiceWarningByClient(cid) {
    this.jobsevice.getInvoiceWarningByClient(cid)
      .subscribe((res: any) => {
        this.clientNotes = res.value;
        console.log(this.clientNotes);
      })
  }

  addNewFirstTime() {
    for (var i = 0; i < 4; i++) {
      var newInvoice = new JobInvoice();
      newInvoice.clientJobId = this.id;

      this.invoices.push(newInvoice);
    }
  }

  addNew() {
    var newInvoice = new JobInvoice();
    newInvoice.clientJobId = this.id;
    this.invoices.push(newInvoice);
  }

  addNewWithIndex(i) {
    i++;
    var newInvoice = new JobInvoice();
    newInvoice.clientJobId = this.id;
    //this.invoices.push(newInvoice);
    this.invoices.splice(i, 0, newInvoice);
  }

  removeFromList(i) {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this item!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#ffaa00',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        console.log(this.invoices[i]);
        if (this.invoices[i].id && this.invoices[i].id != null && this.invoices[i].id != 0) {
          this.jobsevice.deleteInvoice(this.invoices[i].id)
            .subscribe((res: any) => {
              console.log(res)
              if (res.succeeded) {
                //this.invoices.splice(i, 1);
                this.getInvoicesByJobId();
              }
            })
        } else {
          this.invoices.splice(i, 1);
          //this.getInvoicesByJobId();
        }
      } else if (result.dismiss === swal.DismissReason.cancel) {
        swal(
          'Cancelled',
          'Selected item is safe :)',
          'error'
        );
      }
    });
  }

  calcuateTotal() {
    this.quotedTotal = 0;
    this.actualTotal = 0;
    this.quotedTotalTax = 0;
    this.actualTotalTax = 0;

    this.invoices.forEach((inv) => {
      var quoted = 0;
      var actual = 0;
      if (inv.itemQuotedQty && inv.itemQuotedAmount)
        quoted = inv.itemQuotedQty * inv.itemQuotedAmount;
      if (inv.itemActualQty && inv.itemActualAmount)
        actual = inv.itemActualQty * inv.itemActualAmount;

      this.quotedTotal = this.quotedTotal + quoted;
      this.actualTotal = this.actualTotal + actual;

      if (inv.itemTaxCode == 'GST') {
        var gstper = 0.1;
        if(this.countrycode == 'NZ')  gstper = 0.15;
        var quoTax = (inv.itemQuotedQty * inv.itemQuotedAmount) * gstper;
        var actTax = (inv.itemActualQty * inv.itemActualAmount) * gstper;

        this.quotedTotalTax = this.quotedTotalTax + quoTax;
        this.actualTotalTax = this.actualTotalTax + actTax;
      }
    });
  }

  submitInvoice() {
    /*this.invoices.forEach(inv => {
      console.log(inv);
      if (inv.itemDescriptionObj && inv.itemDescriptionObj.value)
        inv.itemDescription = inv.itemDescriptionObj.value;
    });*/

    this.jobsevice.updateInvoice(this.invoices)
      .subscribe((res: any) => {
        console.log(res);
        this.getInvoicesByJobId();
        if (res.succeeded) {
          this.submitJob();
        }
      });
  }

  submitJob() {
    debugger
    if (this.job.dateQuoted) {
      var dateQuoted = moment(this.job.dateQuoted, 'YYYY-MM-DD');
      this.job.dateQuoted = dateQuoted.format();
    }

    if (this.job.dateJobApproved) {
      var dateJobApproved = moment(this.job.dateJobApproved, 'YYYY-MM-DD');
      this.job.dateJobApproved = dateJobApproved.format();
    }

    if (this.job.invoiceSent) {
      var invoiceSent = moment(this.job.invoiceSent, 'YYYY-MM-DD');
      this.job.invoiceSent = invoiceSent.format();
    }

    this.jobsevice.updateJob(this.job)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded) {
          swal(
            'Successfully Saved!',
            '',
            'success'
          );

          this.getJobById();
        } else {
          var err = "";
          res.errors.forEach((er) => {
            err = err + " " + er;
          });
          swal(
            'Error!',
            err,
            'error'
          )
        }
      });
  }

  getAllClients() {
    this.clientservice.getAllClients()
      .subscribe((res: any) => {
        this.clients = res.value;
      });
  }

  getStaffs() {
    this.userService.getAllUser()
      .subscribe((res: any) => {
        this.staffs = res.value;

        console.log(this.staffs);
        this.isLoading = false;
      });
  }

  getInvoiceStatusList() {
    this.sharedservice.getInvoiceStatusList()
      .subscribe((res: any) => {
        this.invoicestatus = res.value;
      });
  }

  getQuoteStatusList() {
    this.sharedservice.getQuoteStatusList()
      .subscribe((res: any) => {
        this.quotestatuslist = res.value;
      });
  }

  listFormatter(data: any): string {
    return data['value'];
  }

  /**CLIENT PO**/
  addNewClientPO() {
    this.clientpo = new ClientPO();
    this.selectedContactList = [];
  }

  getContactbyClient(id) {
    this.clientservice.getContactbyClient(id)
      .subscribe((res: any) => {
        console.log(res);
        res.value.forEach(va => {
          this.contactList.push({ 'id': va.id, 'itemName': va.fullName });
        });
      });
  }

  submitClientPo(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    }
    else {
      this.clientpo.clientId = this.job.clientId;
      /*this.selectedContactList.forEach(re => {
        if (this.clientpo.associatedContacts)
          this.clientpo.associatedContacts = this.clientpo.associatedContacts + "|" + re.id
        else
          this.clientpo.associatedContacts = re.id + "|";
      });*/
      this.clientpo.associatedContacts = this.selectedContactList.map(e => e.id).join('|');
      console.log(this.clientpo.associatedContacts);

      this.clientservice.updateClientPO(this.clientpo)
        .subscribe((res: any) => {
          this.isSubmitFormSpinner = false;
          this.isSubmitForm = false;
          if (res.succeeded) {
            this.closeAddNewModal.nativeElement.click();
            this.getClientPObyClientId(this.job.clientId);
          }
        });
    }
  }

  getClientPObyClientId(id) {
    this.clientservice.getClientPoByClientId(id)
      .subscribe((res: any) => {
        console.log(res);
        this.clientpos = res.value;
      });
  }

  getContactValue(con) {
    var ret = '';
    this.contactList.forEach((cl) => {
      if (cl.id == con)
        ret = cl.itemName;
    });
    return ret;
  }

  pushMyOb() {
    console.log(this.id);
    this.jobsevice.callMyOBAuthentication(this.id)
      .subscribe((res: any) => {
        console.log(res)
        if (res.succeeded) {
          //window.open(res.value);
          window.location.href = res.value;
        }
        else {
          var err = "";
          res.errors.forEach((er) => {
            err = err + " " + er;
          });
          /*swal(
            'Error!',
            err,
            'error'
          )*/
          swal({
            title: 'Are you sure?',
            text: err,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            confirmButtonColor: '#ffaa00',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.value) {
              debugger
              window.location.href = res.value;
            }
          });
        }
      })
    /*this.jobsevice.getInvoicePush(this.id)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded) {
          this.getJobById();
        }
        else {
          var err = "";
          res.errors.forEach((er) => {
            err = err + " " + er;
          });
          swal(
            'Error!',
            err,
            'error'
          )
        }
      });*/
  }

  ChangeQuoteStatus() {
    var today = moment().format();

    if (this.job.quoteStatus.startsWith("Quote")) {
      if (this.job.projectReceivedDate == null) this.job.projectReceivedDate = today.toString();
      if (this.job.dateQuoted == null) this.job.dateQuoted = today.toString();
      if (this.job.quotedBy == null || this.job.quotedBy == '') {
        var token = JWT(this.cookieservice.get('auth_token'));
        this.job.quotedBy = token['primarysid'];
      }

      if (this.job.quoteStatus == 'Quote Approved') {
        if (this.job.invoiceStatus == null) this.job.invoiceStatus = 'Order';
        if (this.job.dateJobApproved == null) this.job.dateJobApproved = today.toString();
        if (this.job.jobStatus == null) this.job.jobStatus = 'To be allocated to Manager';
      }
    }
  }

  setTwoNumberDecimal($event) {
    if ($event.target.value)
      $event.target.value = parseFloat($event.target.value).toFixed(2);
  }

  getPermissionDetails() {
    this.securityInfoResolve.checkPermission(SecurityRights.Quoting)
      .subscribe((res: any) => {
        if (res.succeeded) {
          this.hasQuotePermission = true;
        }
      });
    this.securityInfoResolve.checkPermission(SecurityRights.StaffMYOBAccess)
      .subscribe((res: any) => {
        console.log(res);
        if (res.succeeded) {
          this.hasMyObPermission = true;
        }
      });
  }

  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     jQuery('#quotedBy').focus();    
  //   }, 1000)    
  // }
}
