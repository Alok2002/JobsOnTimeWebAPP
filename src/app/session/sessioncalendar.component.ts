import { JobSessionServices } from './../services/jobsession.services';
import { Component, OnInit } from '@angular/core';
declare var jQuery: any;
declare var $: any;

@Component({
  templateUrl: './sessioncalendar.component.html'
})

export class SessionCalendarComponent implements OnInit {
  // sessioncalendar: SessionCalendar;
  // sessioncalendars: Array<SessionCalendar> = [];
  //
  // @ViewChild(DataTableDirective)
  // dtElement: DataTableDirective;
  // //dtInstance: DataTables.Api;
  // dtOptions: any = {
  //   pagingType: 'four_button',
  //   pageLength: 500,
  //   lengthMenu: [[50, 100, 200, -1], [50, 100, 200, "All"]],
  //   order: [1, "asc"],
  //   //columnDefs: [{ "orderable": false, "targets": 0 }, { "orderable": false, "targets": 2 }],
  //   columns: [
  //     { "name": "Job No" },
  //     { "name": "Job Name" },
  //     { "name": "Client" },
  //     { "name": "session Name" },
  //     { "name": "Type" },
  //     { "name": "Project Manager" },
  //     { "name": "Req" },
  //     { "name": "Qual" },
  //     { "name": "Confirmed" },
  //     { "name": "Other" }
  //   ],
  //   dom: '<"ax-sysconfig-data-table-top ax-data-table-top-x700 col-md-6 no-padding">' +
  //     '<"col-md-6 no-padding text-right ax-mobile-res-datatable"<"ax-table-filter dis-in-bl"Zflip>' +
  //     '<"displaycolum displaycolsysconfig dis-in-bl"><"clear">>rt<"ax-data-table-bottom-1"<"clear">>',
  //   language: { sZeroRecords: "No data available", lengthMenu: "_MENU_", search: "_INPUT_", searchPlaceholder: "Search", info: "Showing page _PAGE_ of _PAGES_", infoFiltered: "", infoEmpty: "Showing page _PAGE_ of _PAGES_" },
  //   buttons: ['print'],
  //   bAutoWidth: false,
  //   bInfo: true,
  //   bStateSave: true
  // };
  // dtTrigger: Subject<any> = new Subject();
  //
  // deleteItemIds = [];
  // isSubmitForm = false;
  // isSubmitFormSpinner = false;
  //
  // @ViewChild("closeAddNewModal") closeAddNewModal;
  // @ViewChild("checkBox") checkBox;
  //
  // selected = [];
  //
  // isLoading = true;

  constructor(private sessionsevice: JobSessionServices) { }

  ngOnInit() {
    //this.getSessionCalendar();
  }

  /*getSessionCalendar() {
    this.sessionsevice.getSessionCalendar()
      .subscribe((res) => {
        console.log(res);
        this.sessioncalendars = res.value;
        console.log(this.sessioncalendars);

          this.destroyDataTable();
          this.dtTrigger.next();

          this.updateDataTable();
      });
  }

  updateDataTable() {
    var self = this;
    var sysconfigcount = "<span class='m-l-1 btn btn-default btn-xs btn-square'>Total " + this.sessioncalendars.length + " Records</span>";

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var columns = dtInstance.settings().init().columns;
      var state = dtInstance.state.loaded();
      var displaycolsysconfig = "";

      displaycolsysconfig = '<div class="m-l-1 table-rep-plugin">' +
        '<button class="btn btn-default btn-xs btn-square dropdown-toggle no-border-radius js-col-list" ' +
        'data-toggle="dropdown" aria-expanded="true">Show Column<span class="caret"></span></button>' +
        '<ul class="dropdown-menu ax-table-custom-col">';

      state.columns.forEach((col, i) => {
        if (i > 1 && i != (state.columns.length - 1)) {
          var check = "";
          if (col.visible) check = "checked";

          displaycolsysconfig = displaycolsysconfig +
            '<li class="checkbox-row" data-column="' + i + '">' +
            '<input type="checkbox" name="toggle-checkbox-' + i + '" ' + check + ' value="' + i + '"> ' +
            '<label>' + columns[i].name + '</label></li>';
        }
      });

      displaycolsysconfig = displaycolsysconfig + '</ul></div>';

      jQuery('.displaycolsysconfig').append(sysconfigcount);
      jQuery('.displaycolsysconfig').append(displaycolsysconfig);

      //hide filter
      var hidebtn = "<a type='button' class='btn btn-default btn-square btn-xs waves-effect' id='filterToggle'>" +
        "<i class='md md-visibility'></i> Show Filter</a>";

      jQuery('.displaycolsysconfig').append(hidebtn);

      // jQuery(document).on('click', '#filterToggle', function () {
      jQuery('#filterToggle').click(function () {
        $("#filterBox").toggleClass("hidden");
        if ($("#filterBox").is(":hidden")) {
          $("#filterToggle").html("<i class='md md-visibility'></i> Show Filter");
        }
        else {
          $("#filterToggle").html("<i class='md md-visibility-off'></i> Hide Filter");
        }
      });

      jQuery('.dataTables_filter').prepend("<a class='btn btn-xs btn-default btn-square'><i class='md md-search'></i></button>");
      jQuery('.dataTables_filter').append("<a class='btn btn-xs btn-default btn-square' id='js-clear-filter'>" +
        "<i class='md md-clear'></i></button>");

    });

    setTimeout(() => {
      jQuery('.checkbox-row').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();

        var checkbox = jQuery(this).find("input[type='checkbox']");
        if (checkbox.is(':checked')) {
          checkbox.prop("checked", false);
        }
        else {
          checkbox.prop('checked', true);
        }

        // Get the column API object

        self.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          var column = dtInstance.column(jQuery(this).attr('data-column'));

          // Toggle the visibility
          column.visible(!column.visible());
        });
      });

      jQuery('#js-clear-filter').on('click', function (e) {
        console.log("inside click");
        jQuery('.dataTables_filter').find('input[type=search]').val('');
        jQuery('.dataTables_filter').find('input[type=search]').trigger(jQuery.Event('keyup', { keycode: 13 }));
      });

      this.isLoading = false;
    }, 1000);
  }

  destroyDataTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
    });
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  exporttoExcel(){
    const workbook = new Excel.Workbook();
    var sheet = workbook.addWorksheet('My Sheet');

    sheet.columns = [
      { header: 'Job No', key: 'clientJobId', width: 10 },
      { header: 'Job Name', key: 'jobName', width: 20 },
      { header: 'Client', key: 'clientName', width: 15 },
      { header: 'Session Name', key: 'name', width: 25 },
      { header: 'Type', key: 'groupType', width: 25 },
      { header: 'Project Manager', key: 'projectManagerUsername', width: 20 },
      { header: 'Req', key: 'respondentsRequired', width: 10 },
      { header: 'Qual', key: 'numberOfQualifiedRespondents', width: 10 },
      { header: 'Confirmed', key: 'numberOfConfirmedRespondents', width: 15 },
      { header: 'Other', key: 'other', width: 50 },
    ];

    this.sessioncalendars.forEach((am) => {
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

    var filename = "Session Calendar.xlsx";

    workbook.xlsx.writeBuffer().then(function (data) {
      saveAs(new Blob([data], { type: 'application/octet-stream' }), filename);
    });
  }*/
}
