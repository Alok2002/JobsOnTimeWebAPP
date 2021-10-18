import { Component, EventEmitter, Inject, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import * as JWT from 'jwt-decode';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { LazyLoadEvent } from 'primeng/api';
import swal from 'sweetalert2';

import { ckEditorConfig, isMobile } from '../app.component';
import { Client } from '../models/client';
import { ClientContact } from '../models/clientcontact';
import { Email } from '../models/email';
import { EmailTemplate } from '../models/emailtemplate';
import { ManageEmail } from '../models/manageemail';
import { PtableColumn } from '../models/ptablecolumn';
import { User } from '../models/user';
import { ClientServices } from '../services/client.services';
import { EmailServices } from '../services/email.services';
import { SharedServices } from '../services/shared.services';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { SecurityInfoResolve } from './../services/securityinfo.reslove';
import { UserServices } from './../services/user.services';

declare var jQuery: any;
declare var tinymce: any;
declare var $: any;

// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import * as Editor from './../../assets/ckeditor/build/ckeditor';
@Component({
    selector: 'ClientComponent',
    templateUrl: './client.component.html',
})

export class ClientComponent {
    editor;
    client: Client;
    clients: Array<Client> = [];
    cols: Array<PtableColumn> = [];

    noofrows = 50;
    dataTablesParameters = {
        start: 0,
        length: this.noofrows,
        draw: 1,
        order: [],
        columns: [],
        search: { regex: false, value: "" }
    }

    colVisData = [];
    maxrecords: any = null;
    filters: any;
    loading = true;
    totalRecords = 0;

    viewContacts: Array<ClientContact>;
    selectedRowData = [];

    deleteItemIds = [];
    isSelectAllItem = false;
    selected: Array<Client> = [];
    selectedColumns: Array<PtableColumn> = [];

    email: Email = new Email();
    @ViewChild("emailBtn") emailBtn;
    // public editor: any;
    @Output() onEditorKeyup = new EventEmitter<any>();

    //Email Model
    selectedUser: string;
    tempalteId: number;
    users: Array<User> = [];
    emailtemplates: Array<EmailTemplate> = [];
    subject: string;
    body: string;

    saveQueryName: string;
    @ViewChild("saveQueryBtn") saveQueryBtn;
    isSubmitForm = false;
    isUpdateFiler = false;
    @ViewChild("saveQueryCancelBtn") saveQueryCancelBtn;
    contactTypeList = [];
    recipients = [];
    selectedContactTypes = [];
    loginusername: string;
    contactType: string;
    bccrecipients = [];
    showEmailSuccessMsg = false;
    dropdownSettings = {};

    isShowFilter = true;
    emailAttachments = [];

    /*public Editor = ClassicEditor;
    public onReady(editor) {
        editor.ui.getEditableElement().parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
        );
    }*/
    selectedFilterId = null;

    manageEmails: Array<ManageEmail> = [];
    isMobile = isMobile;
    ckEditorConfig = JSON.parse(JSON.stringify(ckEditorConfig));
    isBrowser = false;

    constructor(private sharedService: SharedServices, private _clientservice: ClientServices,
        private securityInfoResolve: SecurityInfoResolve, private _userService: UserServices, private emailService: EmailServices,
        private cookieservice: CookieService, private sharedservice: SharedServices, @Inject(PLATFORM_ID) platformId: Object) {
        /*this.isBrowser = isPlatformBrowser(platformId);
        if (this.isBrowser) {
            const ClassicEditor = require('./../../assets/ckeditor/build/ckeditor');
            this.editor = ClassicEditor;
        }*/
    }

    ngOnInit() {
        console.log(isMobile)
        this.getAllClients();
        this.addNew();
        this.newEmail();
        //this.initTinymce();
        this.getAllMangeEmails();
        this.getEmailTemplates();
        this.getClientJobContactTypeList();
        this.getLoginUserRoles();
        this.emailAttachments.length = 1;
    }

    addNew() {
        this.client = new Client();
    }

    unCheckAllItems() {
        this.deleteItemIds = [];
        this.selectedRowData = [];
    }

    deleteClient() {
        this.deleteItemIds = [];
        this.selectedRowData.forEach(rd => {
            this.deleteItemIds.push(rd.id);
        })

        //if(this.checkPermission()){
        if (this.deleteItemIds.length > 0) {
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
                    this._clientservice.deleteClient(this.deleteItemIds)
                        .subscribe((res: any) => {
                            console.log(res);

                            if (res.succeeded) {
                                this.deleteItemIds = [];
                                //this.getAllClients();
                                this.loadData({ first: 0, rows: this.noofrows });
                                this.unCheckAllItems();

                                /*for (var i = 0; i < this.clients.length; i++) {
                                  this.selected[i] = false;
                                }*/

                                swal(
                                    'Deleted!',
                                    'Selected item has been deleted.',
                                    'success'
                                )
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
                    // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
                } else if (result.dismiss === swal.DismissReason.cancel) {
                    swal(
                        'Cancelled',
                        'Selected item is safe :)',
                        'error'
                    )
                }
            });
        }
        else {
            swal(
                'Oops...',
                'Please select an item to delete.',
                'info'
            )
        }
        /*}*/
    }

    updateDeleteList(id: number, e) {
        if (e.target.checked) {
            this.deleteItemIds.push(id);
        }
        else {
            this.deleteItemIds.forEach((di, i) => {
                if (di == id) {
                    this.deleteItemIds.splice(i, 1);
                }
            });
        }
    }

    exporttoExcel() {
        this.securityInfoResolve.checkPermission(SecurityRights.ExportAllResults)
            .subscribe((res: any) => {
                if (res.succeeded) {
                    this.exporttoExcelHelper();
                } else {
                    /*var err = "";
                    res.errors.forEach((er) => {
                      err = err + " " + er;
                    });*/
                    swal(
                        'Access Denied!',
                        SecurityRightsExportError,
                        'error'
                    )
                }
            })
    }

    exporttoExcelHelper() {
        const workbook = new Excel.Workbook();
        var sheet = workbook.addWorksheet('My Sheet');

        sheet.columns = [
            { header: 'Client Name', key: 'name', width: 30 },
            { header: 'Jobs', key: 'jobCount', width: 15 },
            { header: 'Card ID', key: 'cardId', width: 15 },
            { header: 'Category', key: 'category', width: 15 },
            { header: 'Website', key: 'website', width: 30 },
            { header: 'Created Date', key: 'createdDate', width: 20 },
            { header: 'Last Updated', key: 'lastUpdatedDate', width: 22 }
        ];

        this.clients.forEach((am) => {
            var cdate, udate = "";

            if (am.createdDate) {
                cdate = moment(am.createdDate).format('DD/MM/YYYY');
            }
            if (am.lastUpdatedDate) {
                udate = moment(am.lastUpdatedDate).format('DD/MM/YYYY');
            }

            //sheet
            sheet.addRow({
                name: am.name,
                jobCount: am.jobCount,
                cardId: am.cardId,
                category: am.category,
                website: am.website,
                createdDate: cdate,
                lastUpdatedDate: udate,
                address: am.address,
            });
        });

        sheet.getRow('1').font = {
            size: 14,
            bold: true
        };

        var filename = "Client Report.xlsx";
        /* save to file */
        workbook.xlsx.writeBuffer().then(function (data) {
            saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
        });
    }

    /*initTinymce() {
        tinymce.remove();
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
                            if (editor.id == "galleryPreDeployment") {
                                //template.galleryPreDeployment = content;
                                //this.body = content;
                            }
                        });
                }
            });
            jQuery(".mce-tinymce").css('display', 'block');
        });
    }*/

    /*getUsers() {
        this._userService.getAllUser()
            .subscribe((res: any) => {
                this.users = res.value;
                console.log(this.users);
            });
    }*/

    getAllMangeEmails() {
        this.sharedservice.getAllMangeEmails()
            .subscribe((res: any) => {
                this.manageEmails = res.value;
                console.log(this.manageEmails);
            });
    }

    getEmailTemplates() {
        this.emailService.getEmailTemplates()
            .subscribe((res: any) => {
                this.emailtemplates = res.value;
            })
    }

    changeTemplate() {
        this.emailtemplates.forEach((te) => {
            if (te.id == this.tempalteId) {
                this.email.subject = te.subject;
                this.email.body = te.body;

                //tinymce.remove();
                //this.initTinymce();
            }
        })
    }

    filterSubmit(res) {
        console.log(res);
        this.filters = res.filters;
        this.maxrecords = res.maxrecords;
        this.loadData({ first: 0, rows: this.noofrows });
    }

    saveQuery(form) {
        this.isUpdateFiler = false;
        this.isSubmitForm = true;
        if (!form.invalid) {
            this.sharedService.saveQuery('client', null, '', this.saveQueryName, this.filters)
                .subscribe((res: any) => {
                    console.log(res);
                    this.isSubmitForm = false;
                    if (res.succeeded) {
                        this.selectedFilterId = res.value;
                        this.isUpdateFiler = true;
                        this.saveQueryCancelBtn.nativeElement.click();
                        /*swal('Successfully Saved!',
                          '',
                          'success');*/
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
                })
        }
    }

    filtersEmit(res) {
        console.log(res);
        this.filters = res;
    }

    openSaveQueryModal() {
        this.saveQueryName = "";
        if (this.filters && this.filters.length > 0) {
            this.saveQueryBtn.nativeElement.click()
        }
        else {
            swal(
                'Oops...',
                'Select at least one filter to save query.',
                'info'
            )
        }
    }

    getClientJobContactTypeList() {
        this.contactTypeList = [];
        this.sharedService.getReferenceDataProvider('ClientContactType')
            .subscribe((res: any) => {
                console.log(res);
                res.value.forEach((ct) => {
                    if (ct.id)
                        this.contactTypeList.push({ id: ct.id, itemName: ct.description });;
                })
            })
    }

    getClientContactsByType(e) {
        this.recipients = [];
        var contactTypes = [];

        this.selectedContactTypes.forEach(ct => {
            contactTypes.push(ct.itemName);
        })

        this._clientservice.getClientContactsByTypeId(contactTypes, this.deleteItemIds)
            .subscribe((res: any) => {
                console.log(res);
                res.value.forEach((rs) => {
                    if (rs.emailAddress != null && rs.emailAddress != '')
                        this.recipients.push({ display: rs.emailAddress, value: rs.emailAddress });;
                });
            })


        /*this._clientservice.getContactbyClient(1)
          .subscribe(res => {
            console.log(res)
            if(res.value){
              res.value.forEach((rs) => {
                this.recipients.push(rs.emailAddress);
              });
            }
          })*/
    }

    getLoginUserRoles() {
        var token = JWT(this.cookieservice.get('auth_token'));
        console.log(token);
        this.loginusername = token["unique_name"];
        this.selectedUser = this.loginusername;
    }

    resetEmailModel() {
        this.tempalteId = null;
        this.contactType = null;
        this.recipients = [];
        this.bccrecipients = [];
        this.subject = null;
        this.body = null;
        this.selectedContactTypes = [];
        this.showEmailSuccessMsg = false;
    }

    checkPermission() {
        this.sharedService.checkPermission("ClientAdmin")
            .subscribe((res: any) => {
                console.log(res);
                if (!res.succeeded) {
                    swal(
                        'Permission Denied',
                        res.errors[0],
                        'info'
                    )
                    return false;
                }
                else {
                    return true;
                }
            })
    }

    sendEmail(form) {
        this.deleteItemIds = [];
        this.selectedRowData.forEach(rd => {
            this.deleteItemIds.push(rd.id);
        })

        this.email.recipients = this.recipients.map(e => e.value).join(",");
        this.email.bccRecipients = this.bccrecipients.map(e => e.value).join(",");
        this.email.isClientEmail = true;
        this.email.respondentIds = null;

        /*this.sharedService.sendEmail(this.email)
            .subscribe((res: any) => {
                console.log(res);
                if (res.succeeded) {
                    this.unCheckAllItems();
                    this.showEmailSuccessMsg = true;
                }
            })*/
        this.isSubmitForm = true;
        if (form.invalid || this.recipients.length < 1) { }
        else {
            this.emailService.postEmail(this.email, this.emailAttachments)
                .subscribe((res: any) => {
                    console.log(res);
                    this.isSubmitForm = false;
                    if (res.succeeded) {
                        this.unCheckAllItems();
                        this.showEmailSuccessMsg = true;
                    }
                })
        }
    }

    newEmail() {
        this.email = new Email();
        this.email.addToElectronicDocuments = true;
        this.email.body = '';
    }

    openViewContacts(viewcontact) {
        this.viewContacts = viewcontact;
        this.viewContacts.sort((a, b) => {
            if (a.firstname.toLowerCase() < b.firstname.toLowerCase())
                return -1;
            if (a.firstname.toLowerCase() > b.firstname.toLowerCase())
                return 1;
            return 0;
        });
    }

    openEmailModal() {
        this.deleteItemIds = [];
        this.selectedRowData.forEach(rd => {
            this.deleteItemIds.push(rd.id);
        })

        if (this.deleteItemIds.length < 1) {
            /*swal({
                title: 'Are you sure?',
                text: "You have not selected any Client. Do you want to perform this action for all the Clients?",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes'
            }).then((result) => {
                if (result.value) {
                    this.emailBtn.nativeElement.click();
                }
            });*/
            swal('Oops...',
                'Please select an item.',
                'info')
        }
        else {
            this.emailBtn.nativeElement.click();
        }
    }

    getAllClients() {
        this.loading = true;

        this.cols = [
            { field: 'name', header: 'Client Name', index: 0, minWidth: '250', sort: true },
            { field: 'jobCount', header: 'Jobs', index: 1, width: '75', sort: false },
            { field: 'contacts', header: 'Contacts', index: 2, width: '150', sort: false, textAlign: 'center' },
            { field: 'cardId', header: 'Card ID', index: 3, width: '150', sort: false },
            { field: 'category', header: 'Category', index: 4, width: '150', sort: true },
            { field: 'website', header: 'Website', index: 5, width: '300', sort: false },
            { field: 'createdDate', header: 'Created Date', index: 6, width: '150', sort: true, textAlign: 'center' },
            { field: 'lastUpdatedDate', header: 'Last Updated', index: 7, width: '150', sort: true, textAlign: 'center' },
        ];

        this.selectedColumns = this.cols;
    }

    loadData(event: LazyLoadEvent) {
        this.loading = true;

        if (!event.sortField) { event.sortField = "name" }
        if (!event.sortOrder) { event.sortOrder = 1 }

        console.log(event);
        /*this.dataTablesParameters.start = event.first;
        this.dataTablesParameters.length = event.rows;*/

        console.log(this.filters)
        var flts = [];
        var index = -1;
        if (this.filters && this.filters.length > 0) {
            flts = JSON.parse(JSON.stringify(this.filters));
            index = this.filters.findIndex(fl => fl.caption == "Inactive Status");
        }

        if (index < 0) {
            flts.push({
                caption: "Inactive Status", comparison: "Is", type: "DropDown",
                value1: "Active Only", value2: "", value3: "", value4: "", value5: "", value6: "", value7: ""
            });
        }

        console.log(flts)
        debugger
        this.sharedService.getDataWithFilter(event, this.colVisData, this.maxrecords, flts, "client", null)
            .subscribe((resp: any) => {
                // debugger;
                this.clients = resp.value;
                console.log(resp);

                this.loading = false;
                this.totalRecords = resp.totalCount;
            });
    }

    updateSelectedColumnsIndex() {
        this.selectedColumns.sort((a, b) => {
            if (a.index > b.index) return 1;
            if (a.index < b.index) return -1;
            return 0;
        })
    }

    selectEmailAttachmentFiles(e) {
        console.log(e);
        //if(this.emailAttachments && !this.emailAttachments[0].hasOwnProperty('name')) this.emailAttachments.splice(0,1);
        //this.emailAttachments = this.emailAttachments.concat(e.target.files);

        for (let i = 0; i < e.target.files.length; i++) {
            this.emailAttachments.push(e.target.files[i]);
        }

        if (this.emailAttachments.length == 4) this.emailAttachments.splice(0, 1);
    }

    removeEmailAttachmentFiles(i) {
        this.emailAttachments.splice(i, 1);
        if (this.emailAttachments.length < 3) this.emailAttachments.unshift(null);
    }
}