import { CookieService } from 'ngx-cookie-service';
// import 'tinymce/tinymce.min';
import { Component, EventEmitter, Inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { Ticket } from '../models/ticket';
import { User } from '../models/user';
import { SharedServices } from '../services/shared.services';
import { TicketServices } from '../services/ticket.services';
import { UserServices } from '../services/user.services';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ckEditorConfig, timeMask } from '../app.component';
// import * as Editor from './../../assets/ckeditor/build/ckeditor';
import { isPlatformBrowser } from '@angular/common';
import * as JWT from 'jwt-decode';
import * as moment from 'moment';

declare var jQuery: any;
// declare var tinymce: any;

@Component({
  selector: 'TicketEditComponent',
  templateUrl: './ticketedit.component.html',
  styleUrls: ['./ticket.component.css']
})

export class TicketEditComponent implements OnInit {
  editor;
  users: Array<User> = [];
  ticket: Ticket;

  ticketstatuslist = [];
  tickettypelist = [];
  ticketprioritylist = [];
  ticketmodulelist = [];
  // public editor: any;
  @Output()
  onEditorKeyup = new EventEmitter<any>();

  editId: number;
  isSubmitForm = false;
  isSubmitFormSpinner = false;

  isLoading = true;
  allowedTypes: any;

  /*public Editor = ClassicEditor;
  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }*/
  timeMask = timeMask;
  ckEditorConfig = JSON.parse(JSON.stringify(ckEditorConfig));
  isBrowser = false;
  dTaskConfig: any;
  cTaskConfig: any;

  loginusername: string;
  initTicket: Ticket;
  accordionList = [];

  constructor(private router: Router, private sharedservice: SharedServices, private _userService: UserServices,
    private activateroute: ActivatedRoute, private _ticketService: TicketServices, @Inject(PLATFORM_ID) platformId: Object,
    private cookieservice: CookieService,) {
    /*this.isBrowser = isPlatformBrowser(platformId);
    if(this.isBrowser) {
      const ClassicEditor = require('./../../assets/ckeditor/build/ckeditor');
      this.editor = ClassicEditor;
    }*/
    // tinymce.remove();
  }

  ngOnInit() {
    this.dTaskConfig = JSON.parse(JSON.stringify(this.ckEditorConfig));
    this.dTaskConfig.height = 150;
    this.cTaskConfig = JSON.parse(JSON.stringify(this.ckEditorConfig));
    this.cTaskConfig.height = 295;
    this.accordionList.push('design');
    this.accordionList.push('development');

    this.activateroute.params.subscribe(params => {
      if (params['id']) {
        this.editId = params['id'];

        this.getTicketById(this.editId);
      }
    });

    if (!this.editId) {
      this.addNew();
    }

    this.getLoginUserRoles();
    this.getUsers();
    // this.initTinymce();
    this.getTicketPriorityList();
    this.getTicketModuleList();
    this.getTicketStatusList();
    this.getTicketTypeList();
  }

  addNew() {
    this.ticket = new Ticket();
    this.ticket.designTask = '';
    this.ticket.developmentTask = '';
    this.ticket.completedTask = '';
  }

  getUsers() {
    this._userService.getAllUser()
      .subscribe((res: any) => {
        this.users = res.value;
        this.users.forEach((usr) => {
          usr['fullNameWithLoginUserName'] = usr.fullName + ' (' + this.loginusername + ')';
        })
      });
  }

  /*initTinymce() {
    var self = this;
    setTimeout(() => {
      tinymce.baseURL = "../../../assets/custom/tinymce";// trailing slash important      
      tinymce.init({
        selector: '.tinymce-editor', // change this value according to your HTML
        skin_url: '../../../assets/tinymce/skins/lightgray',
        branding: false,
        elementpath: false,
        height: 250,
        plugins: [
          "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
          "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
          "save table contextmenu directionality emoticons template paste textcolor"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | l      ink image | preview media fullpage | forecolor backcolor",
        style_formats: [
          { title: 'Bold text', inline: 'b' },
          { title: 'Red text', inline: 'span', styles: { color: '#ff0000' } },
          { title: 'Red header', block: 'h1', styles: { color: '#ff0000' } },
          { title: 'Example 1', inline: 'span', classes: 'example1' },
          { title: 'Example 2', inline: 'span', classes: 'example2' },
          { title: 'Table styles' },
          { title: 'Table row 1', selector: 'tr', classes: 'tablerow1' }
        ],
        setup: function (editor: any) {
          self.editor = editor;
          editor.on('keyup change blur',
            () => {
              console.log(editor);
              const content = editor.getContent();
              console.log(content);
              self.onEditorKeyup.emit(content);
              if (editor.id == "elm1") {
                //template.galleryPreDeployment = content;
                self.ticket.requiredEffect = content;
              }
              if (editor.id == "elm2") {
                //template.galleryPreDeployment = content;
                self.ticket.description = content;
              }
              if (editor.id == "elm3") {
                //template.galleryPreDeployment = content;
                self.ticket.events = content;
              }
            });
        }
      });
      jQuery(".mce-tinymce").css('display', 'block');

      this.isLoading = false;
    }, 2000);
  }*/

  getTicketById(id) {
    this._ticketService.getTicketById(id)
      .subscribe((res: any) => {
        this.ticket = res.value;
        if (this.ticket.dateAssignedToUat)
          this.ticket.dateAssignedToUat = moment(this.ticket.dateAssignedToUat).toDate();

        this.initTicket = JSON.parse(JSON.stringify(this.ticket));
        this.ticket.assignedToStaffHistoryList.forEach((sl, i) => {
          this.ticket.assignedToStaffHistoryList[i] = { display: sl }
        });

        setTimeout(() => {
          this.initPopOver();
        }, 1000)
        console.log(this.ticket);
      });
  }

  getTicketPriorityList() {
    this._ticketService.GetTicketPriorityList()
      .subscribe((res: any) => {
        this.ticketprioritylist = res.value;
        console.log(res);
      });
  }

  getTicketStatusList() {
    this._ticketService.GetTicketStatusList()
      .subscribe((res: any) => {
        this.ticketstatuslist = res.value;
        console.log(res);
      });
  }

  getTicketTypeList() {
    this._ticketService.GetTicketTypeList()
      .subscribe((res: any) => {
        this.tickettypelist = res.value;
        console.log(res);
      });
  }

  getTicketModuleList() {
    this._ticketService.GetTicketModuleList()
      .subscribe((res: any) => {
        console.log(res);
        this.ticketmodulelist = [];
        res.value.forEach(va => {
          this.ticketmodulelist.push(va.code);
        });
      });
  }

  submitTicket(form) {
    this.isSubmitForm = true;
    this.isSubmitFormSpinner = true;
    if (form.invalid) {
      //this.isSubmitForm = false;
      this.isSubmitFormSpinner = false;
    }
    else {
      console.log(this.ticket);
      /*if (this.ticket.assignedToStaffHistoryList && this.ticket.assignedToStaffHistoryList.length > 0)
        this.ticket.assignedToStaffHistory = this.ticket.assignedToStaffHistoryList.map((elem) => { return elem.display; }).join("~");*/

      if (this.ticket.dateAssignedToUat) {
        var dateReceived = moment(this.ticket.dateAssignedToUat, 'YYYY-MM-DD');
        this.ticket.dateAssignedToUat = dateReceived.utcOffset(0, true).format();
      }

      if (this.ticket.id) {
        if (this.ticket.assignedToStaff != this.initTicket.assignedToStaff) {
          if (!this.initTicket.assignedToStaffHistoryList) this.initTicket.assignedToStaffHistoryList = [];
          this.initTicket.assignedToStaffHistoryList.push(this.initTicket.assignedToStaff + ' (' + this.initTicket.assignedByStaff + ')');
          this.ticket.assignedToStaffHistory = this.initTicket.assignedToStaffHistoryList.join('~');
        } else {
          this.ticket.assignedByStaff = this.initTicket.assignedByStaff;
        }
      }

      if (!this.ticket.lastChangedStaff)
        this.ticket.lastChangedStaff = this.loginusername;

      this._ticketService.postTicket(this.ticket)
        .subscribe(res => {
          console.log(res);
          if (res) this.router.navigate(['/support-ticket']);
        });
    }
  }

  uploadFile(e) {
    var files = e.files;
    this.sharedservice.uploadFile(files)
      .subscribe((res: any) => {
        console.log(res);
        if (this.ticket.ticketImageUrls == null)
          this.ticket.ticketImageUrls = res.join('|');
        else
          this.ticket.ticketImageUrls = this.ticket.ticketImageUrls + "|" + res.join('|');
        console.log(this.ticket.ticketImageUrls);
      });
  }

  removeFile(imgurl, index) {
    console.log(imgurl);
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
        var arr = this.ticket.ticketImageUrls.split('|');
        arr.forEach((ar, i) => {
          if (ar == imgurl && i == index) arr.splice(i, 1);
        });

        if (arr.length > 0) this.ticket.ticketImageUrls = arr.join('|');
        else this.ticket.ticketImageUrls = null;
      }
    });
  }

  changeAssignedTo() {
    this.ticket.assignedByStaff = this.loginusername;
  }

  getLoginUserRoles() {
    var token = this.getToken();
    console.log(token);
    this.loginusername = token["primarysid"];
  }

  getToken() {
    let cookieExists = this.cookieservice.check('auth_token');
    console.log(cookieExists);
    if (cookieExists) {
      var token = JWT(this.cookieservice.get('auth_token'));
      return token;
    }
  }

  checkAccOpen(tab) {
    var ret = false;
    var index = this.accordionList.indexOf(tab);
    if (index >= 0) ret = true;
    return ret;
  }

  toggleAccordion(tab) {
    var index = this.accordionList.indexOf(tab);
    if (index >= 0) this.accordionList.splice(index, 1);
    else this.accordionList.push(tab);
  }

  getTicketStatusHistory() {
    var ret = 'Nil';
    if (this.ticket && this.ticket.statusHistoryList) {
      ret = "<ul style='padding: 0;margin: 0px 0px 0px 15px;'>";
      this.ticket.statusHistoryList.forEach((sh) => {
        ret += "<li>" + sh + "</li>";
      })
      ret += "</ul>"
    }
    return ret;
  }

  initPopOver() {
    if (typeof jQuery != 'undefined') {
      jQuery('[data-toggle="popover"]').popover()
    }
  }

  ngOnDestroy() {
    if (typeof jQuery != 'undefined') {
      jQuery('[data-toggle="popover"]').popover('hide');
    }
  }
}
