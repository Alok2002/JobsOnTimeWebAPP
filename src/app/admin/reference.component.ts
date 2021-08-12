import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import swal from 'sweetalert2';

import { RespondentServices } from '../services/respondent.services';
import { SecurityInfoResolve } from '../services/securityinfo.reslove';
import { SecurityRights, SecurityRightsExportError } from '../shared/enum';
import { PtableColumn } from '../models/ptablecolumn';
import { TableModule } from 'primeng/table';

declare var jQuery: any;

@Component({
    selector: 'ReferenceComponent',
    templateUrl: './reference.component.html'
})

export class ReferenceComponent implements OnInit {
    resId = 0;

    respondentDataArr = [];
    deleteItemIds = [];
    selected = [];

    isSubmitForm = false;
    isSubmitFormSpinner = false;
    isLoading = true;

    @ViewChild("closeAddNewModal") closeAddNewModal;
    @ViewChild("checkBox") checkBox;

    tabletitle: string;
    selectedType: string;
    addnewValue: string;

    menuList = [
        {
            title: 'Research Preferences',
            submenu: [{ title: 'Research Locations', field: 'Region' },
            { title: 'Closest Main City', field: 'MainCityLocation' }]
        },
        {
            title: 'Occupation Details',
            submenu: [{ title: 'Occupation List', field: 'Occupation' },
            { title: 'Industry List', field: 'Industry' },
            ]
        },
        {
            title: 'Family Details',
            submenu: [{ title: 'Home Ownership Types', field: 'ResidenceOwnership' },
            { title: 'Household Types', field: 'HouseholdType' },
            { title: 'Marital Status', field: 'MaritalStatus' },
            { title: 'Residence Types', field: 'ResidenceType' }
            ]
        },
        {
            title: 'Finance',
            submenu: [{ title: 'Credit Unions', field: 'CreditUnions' },
            { title: 'Banks', field: 'Banks' },
            { title: 'Banking Products', field: 'BankProducts' },
            { title: 'Investment Types', field: 'Investment' },
            { title: 'Payment Methods', field: 'PaymentMethods' },
            { title: 'Secondary Income platforms', field: 'SecondIncomePlatforms' },
            { title: 'Superannuation Funds', field: 'Superannuation' }
            ]
        },
        {
            title: 'Health Details',
            submenu: [{ title: 'Allergies', field: 'Allergy' },
            { title: 'Beauty', field: 'Beauty' },
            { title: 'Dietary Requirements', field: 'DietaryRequirement' },
            { title: 'Disabilty Assistance', field: 'DisabiltyAssistances' },
            { title: 'Eye Conditions', field: 'OpticalIssue' },
            { title: 'Fitness Activity', field: 'FitnessActivity' },
            { title: 'Fitness Devices', field: 'FitnessDevices' },
            { title: 'Health Cover Type', field: 'HealthCoverTypes' },
            { title: 'Health Funds', field: 'HealthFunds' },
            { title: 'Health Problems', field: 'HealthProblems' },
            { title: 'Mental Health Conditions', field: 'MentalHealthConditions' }
            ]
        },
        {
            title: 'Insurance & Government',
            submenu: [{ title: 'Govt Subsidy Payments', field: 'GovtSubsidyPayments' },
            { title: 'Insurance Policies', field: 'InsuranceType' },
            { title: 'Insurance Providers', field: 'Insurance' }
            ]
        },
        {
            title: 'Service & Utilities',
            submenu: [{ title: 'Energy Providers', field: 'EnergyProvider' },
            { title: 'Services', field: 'ServicesType' },
            { title: 'Solar', field: 'SolarQuestions' }
            ]
        },
        {
            title: 'Social',
            submenu: [{ title: 'Alcohol Retailers', field: 'AlcoholRetailers' },
            { title: 'Alcohol Drinks', field: 'DrinkType' },
            { title: 'Non Alcoholic drinks', field: 'NonAlcoholicDrinks' },
            { title: 'Alcohol Habits', field: 'AlcoholHabits' },
            { title: 'Cigarette Brands', field: 'SmokeBrand' },
            { title: 'Cigarette Frequency', field: 'CigaretteFrequency' },
            { title: 'Food Choices', field: 'FoodChoices' },
            { title: 'Gaming Choices', field: 'GamingChoices' },
            { title: 'Gaming Websites', field: 'GamingWebsites' },
            { title: 'Shopping Retailers', field: 'ShoppingRetailers' },
            { title: 'Sports Played', field: 'Sports' },
            { title: 'Sports Watched', field: 'WatchedSports' },
            { title: 'Hobbies', field: 'Hobbies' },
            { title: 'Pets', field: 'Pets' },
            { title: 'Quit Methods', field: 'SmokeQuitMethod' },
            { title: 'Nicotine Replacements', field: 'SmokeNRTType' },
            { title: 'General Products', field: 'GeneralProduct' }
            ]
        },
        {
            title: 'Technology',
            submenu: [{ title: 'Technology Devices Owned', field: 'TechnologyDevices' },
            { title: 'Technology Devices Used', field: 'TechnologyUsed' },
                // { title: 'Portable Devices Owned', field: 'PortableDevices' }
            ]
        },
        {
            title: 'Telecommunications',
            submenu: [{ title: 'Internet Provider', field: 'InternetProvider' },
            // { title: 'NBN Provider', field: 'Nbnproviders' },
            { title: 'Mobile Phone Providers', field: 'MobileProviders' },
            { title: 'Landline Providers', field: 'PhoneCompany' },
            { title: 'Smartphones Brands', field: 'SmartPhoneBrands' },
            { title: 'Streaming Services', field: 'StreamingServices' },
            { title: 'Internet Connection Type', field: 'InternetConnectionTypes' },
            { title: 'NBN Connection Type', field: 'NbnConnectionTypes' },
                // { title: 'TV Providers', field: 'Tvprovider' },
            ]
        },
        {
            title: 'Transport',
            submenu: [{ title: 'Vehicle Finance', field: 'VehicleFinances' },
            { title: 'Vehicle Licence Type', field: 'VehicleLicenceTypes' },
            { title: 'Vehicle Sales Methods', field: 'VehicleSalesMethods' },
            { title: 'Modes of Transportation', field: 'TransportationModes' },
            { title: 'Public Transport', field: 'PublicTransportTypes' },
            { title: 'Ride Share Services', field: 'RideShareServices' },
            { title: 'Vehicle Make', field: 'VehicleMake' },
            // { title: 'Vehicle Model', field: 'VehicleModels' },
            { title: 'Vehicle Type', field: 'VehicleTypes' },
            ]
        },
        {
            title: 'Travel & Loyalty Program',
            submenu: [{ title: 'Frequent Flyer Membership', field: 'FrequentFlyerProgram' },
            { title: 'Loyalty Programmes', field: 'LoyaltyProgram' },
            { title: 'Travel Apps', field: 'TravelApps' },
            { title: 'Travel Websites', field: 'TravelWebsites' },
            { title: 'Travel Packages', field: 'TravelPackages' },
            { title: 'Tour Operators', field: 'TourOperators' },
            { title: 'Travel Agents', field: 'TravelAgent' },
            { title: 'Travel Booking Methods', field: 'TravelBookingMethods' },
            { title: 'Travel Destinations', field: 'TravelDestinations' },
            { title: 'Travel Frequency', field: 'TravelFrequency' },
            { title: 'Travel Location', field: 'TravelLocation' },
            { title: 'Travel Reason', field: 'TravelReason' },
            { title: 'Travel Companions', field: 'TravelCompanions' },
            { title: 'Travel Type', field: 'TravelTypes' },
            ]
        },
        {
            title: 'Other',
            submenu: [{ title: 'Private Respondent List', field: 'RespondentList' },
            { title: 'Source Types', field: 'SourceType' },
            ]
        },
        {
            title: 'Jobs',
            submenu: [{ title: 'Job Topic', field: 'JobTopic' },
            { title: 'Research Topic', field: 'ResearchTopic' },
            { title: 'Job Incentives', field: 'Incentive' },
            ]
        },
        {
            title: 'Disability',
            submenu: [{ title: 'Assistive Technology', field: 'AssistiveTechnology' },
            { title: 'Disability Devices', field: 'ImpairmentDevices' },
            { title: 'Disability Types', field: 'ImpairmentTypes' },
            ]
        }
    ];

    searchref: string;
    searchSource = [];
    isUpdateItem = false;
    selectedMainMenu: any;

    selectedItem: any;

    noofrows = 50;
    selectedColumns: Array<PtableColumn> = [];
    cols: Array<PtableColumn> = [];
    selectedRowData = [];
    ptablesearch: string;
    isUpdatePtable = false;
    @ViewChild("dt") dt: TableModule;

    constructor(private resService: RespondentServices,
        private _sanitizer: DomSanitizer, private securityInfoResolve: SecurityInfoResolve) { }

    ngOnInit() {
        this.selectedColumns = [
            { field: "description", header: this.tabletitle, width: 'auto', index: 0, sort: true }
        ]
        //this.getRespondentData('phoneproviders', 'Phone Providers');

        this.menuList.forEach((ml) => {
            ml.submenu.forEach((sm) => {
                this.searchSource.push({ id: sm.title, value: sm.field, sm: sm });
            })
        });
    }

    autocompleListFormatter = (data: any) => {
        let html = `<span>${data.id}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    }

    getRespondentData(field, tabletitle) {
        this.isUpdatePtable = false;
        this.tabletitle = tabletitle;
        this.selectedType = field;
        this.deleteItemIds = [];
        this.selected = [];
        this.selectedColumns = [];
        this.selectedColumns = [
            { field: "description", header: this.tabletitle, width: 'auto', index: 0, sort: true }
        ];

        this.resService.getRespondentData(field, this.resId)
            .subscribe((res: any) => {
                console.log(res);
                this.respondentDataArr = res.value;
                this.ptablesearch = null;
                this.isUpdatePtable = true;
            });
    }

    deleteRespondentData() {
        this.deleteItemIds = [];
        this.selectedRowData.forEach(rd => {
            this.deleteItemIds.push(rd.id);
        })

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
                    // swal(
                    //     'Deleted!',
                    //     'Selected item has been deleted.',
                    //     'success'
                    // )

                    this.resService.deleteRespondentData(this.selectedType, this.deleteItemIds)
                        .subscribe((res: any) => {
                            if (res.succeeded) {
                                this.deleteItemIds = [];
                                this.getRespondentData(this.selectedType, this.tabletitle);

                                for (var i = 0; i < this.respondentDataArr.length; i++) {
                                    this.selected[i] = false;
                                }
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
    }

    updateRespondent(item) {
        this.selectedItem = item;
        this.addnewValue = this.selectedItem.description;
        this.isUpdateItem = true
    }

    updateRespondentDataSubmit() {
        if (!this.validateItemName(this.addnewValue)) {
            var resdata = {};
            if (this.isUpdateItem)
                resdata = { 'id': this.selectedItem.id, 'description': this.addnewValue, 'selected': false };
            else
                resdata = { 'id': 0, 'description': this.addnewValue, 'selected': false };

            this.resService.updateRespondentData(this.selectedType, resdata)
                .subscribe((res: any) => {
                    if (res.succeeded) {
                        this.closeAddNewModal.nativeElement.click();
                        this.getRespondentData(this.selectedType, this.tabletitle);
                    }
                });
        }
    }

    searchRefData(searchref) {
        console.log(searchref);
        this.getRespondentData(searchref.value, searchref.id);
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
            { header: this.tabletitle, key: 'description', width: 50 },
        ];

        this.respondentDataArr.forEach((am) => {
            var dataobj = {};
            //sheet
            sheet.columns.forEach(cl => {
                dataobj[cl.key] = am[cl.key];
            });

            sheet.addRow(dataobj);
        });

        sheet.getRow('1').font = {
            size: 14,
            bold: true
        };

        var filename = "System Reference - " + this.tabletitle + ".xlsx";
        /* save to file */
        workbook.xlsx.writeBuffer().then(function (data) {
            saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
        });
    }

    validateItemName(val) {
        var ret = false;
        this.respondentDataArr.forEach(ra => {
            if (ra.description && val) {
                if (ra.description.toLowerCase() == val.toLowerCase() && !this.isUpdateItem) {
                    console.log(ra);
                    ret = true;
                }
            }
        });
        return ret;
    }

    // clearSearchBox() {
    //     jQuery('.dataTables_filter').find('input[type=search]').val('');
    //     jQuery('.dataTables_filter').find('input[type=search]').trigger(jQuery.Event('keyup', { keycode: 13 }));
    // }

    updateSelectedColumnsIndex() {
        this.selectedColumns.sort((a, b) => {
            if (a.index > b.index) return 1;
            if (a.index < b.index) return -1;
            return 0;
        })
    }

    customSort(event) {
        if (event.order == 1) {
            this.respondentDataArr.sort((a, b) => {
                if (a.description > b.description) return 1
                if (a.description < b.description) return -1
                return 0;
            })
        }
        if (event.order == -1) {
            this.respondentDataArr.sort((a, b) => {
                if (a.description > b.description) return -1
                if (a.description < b.description) return 1
                return 0;
            })
        }
    }
}