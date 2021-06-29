//JOBS
$(document).ready(function () {
    var jobnameDiv = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black" ' +
        'for="existingquery">' +
        '<a href="#" id="addNewJobName" class="ax-text-success">' +
        '<i class="fa fa-plus ax-plus-btn" aria-hidden="true"></i></a> ' +
        ' <a href="#" id="removeJobName" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        ' job Name</label><div class="clearfix"></div>' +
        '<select name="namefilterOptions" class="form-control pull-left no-border-radius" style="width: 110px;">' +
        '<option>Contains</option>' +
        '<option>Is</option>' +
        '<option>Is Not</option>' +
        '<option>Starts With</option>' +
        '<option>Ends With</option>' +
        '<option>Does not Contain</option>' +
        '<option>Is Blank</option>' +
        '<option>Is Not Blank</option>' +
        '</select>' +
        '<div class="btn-group ax-btn-form-group m-l-10">' +
        '<a class="btn ax-btn-form-control dropdown-toggle" id="ax-from-name-color-btn" data-toggle="dropdown" href="#" style="width: 50px"> ' +
        '<span class="caret visible-hide"></span></a> ' +
        '<ul class="dropdown-menu min-width-50 no-border-radius no-padding no-margin"> ' +
        '<li class="bg-dropdown-skyblue ax-form-color-li" data-id="bg-dropdown-skyblue" data-name="name"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-red ax-form-color-li" data-id="bg-dropdown-red" data-name="name"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-green ax-form-color-li" data-id="bg-dropdown-green" data-name="name"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-orange ax-form-color-li" data-id="bg-dropdown-orange" data-name="name"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-blue ax-form-color-li" data-id="bg-dropdown-blue" data-name="name"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-black ax-form-color-li" data-id="bg-dropdown-black" data-name="name"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-yellow ax-form-color-li" data-id="bg-dropdown-yellow" data-name="name"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-purple ax-form-color-li" data-id="bg-dropdown-purple" data-name="name"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '</ul></div>' +
        '<input type="text" class="form-control pull-right" name="namefilter" style="width:calc(100% - 180px);" id="namefilter">' +
        '</div>';

    var jobbumberDiv = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black" ' +
        'for="existingquery">' +
        '<a href="#" id="addNewJobNumber" class="ax-text-success">' +
        '<i class="fa fa-plus ax-plus-btn" aria-hidden="true"></i></a> ' +
        ' <a href="#" id="removeJobNumber" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        ' job Number</label><div class="clearfix"></div>' +
        '<select name="namefilterOptions" class="form-control pull-left no-border-radius" style="width: 110px;">' +
        '<option>Contains</option>' +
        '<option>Is</option>' +
        '<option>Is Not</option>' +
        '<option>Starts With</option>' +
        '<option>Ends With</option>' +
        '<option>Does not Contain</option>' +
        '<option>Is Blank</option>' +
        '<option>Is Not Blank</option>' +
        '</select>' +
        '<div class="btn-group ax-btn-form-group m-l-10">' +
        '<a class="btn ax-btn-form-control dropdown-toggle" id="ax-from-name-color-btn" data-toggle="dropdown" href="#" style="width: 50px"> ' +
        '<span class="caret visible-hide"></span></a> ' +
        '<ul class="dropdown-menu min-width-50 no-border-radius no-padding no-margin"> ' +
        '<li class="bg-dropdown-skyblue ax-form-color-li" data-id="bg-dropdown-skyblue" data-name="name"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-red ax-form-color-li" data-id="bg-dropdown-red" data-name="name"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-green ax-form-color-li" data-id="bg-dropdown-green" data-name="name"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-orange ax-form-color-li" data-id="bg-dropdown-orange" data-name="name"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-blue ax-form-color-li" data-id="bg-dropdown-blue" data-name="name"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-black ax-form-color-li" data-id="bg-dropdown-black" data-name="name"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-yellow ax-form-color-li" data-id="bg-dropdown-yellow" data-name="name"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-purple ax-form-color-li" data-id="bg-dropdown-purple" data-name="name"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '</ul></div>' +
        '<input type="text" class="form-control pull-right" name="namefilter" style="width:calc(100% - 180px);" id="namefilter">' +
        '</div>';

    var dateDiv = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black" ' +
        'for="existingquery">' +
        '<a href="javascript:;" id="addNewDate" class="ax-text-success">' +
        '<i class="fa fa-plus ax-plus-btn" aria-hidden="true"></i></a>' +
        ' <a href="javascript:;" id="removeDate" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        ' Date</label><div class="clearfix"></div>' +
        '<select name="namefilterOptions" class="form-control pull-left" style="width: 110px;">' +
        '<option>Contains</option>' +
        '<option>Is</option>' +
        '<option>Is Not</option>' +
        '<option>Starts With</option>' +
        '<option>Ends With</option>' +
        '<option>Does not Contain</option>' +
        '<option>Is Blank</option>' +
        '<option>Is Not Blank</option>' +
        '</select>' +
        '<div class="btn-group ax-btn-form-group m-l-10">' +
        '<a class="btn ax-btn-form-control dropdown-toggle" id="ax-from-date-color-btn" data-toggle="dropdown" href="#" style="width: 50px"> ' +
        '<span class="caret visible-hide"></span></a> ' +
        '<ul class="dropdown-menu min-width-50 no-border-radius no-padding no-margin"> ' +
        '<li class="bg-dropdown-skyblue ax-form-color-li" data-id="bg-dropdown-skyblue" data-name="date"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-red ax-form-color-li" data-id="bg-dropdown-red" data-name="date"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-green ax-form-color-li" data-id="bg-dropdown-green" data-name="date"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-orange ax-form-color-li" data-id="bg-dropdown-orange" data-name="date"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-blue ax-form-color-li" data-id="bg-dropdown-blue" data-name="date"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-black ax-form-color-li" data-id="bg-dropdown-black" data-name="date"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-yellow ax-form-color-li" data-id="bg-dropdown-yellow" data-name="date"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-purple ax-form-color-li" data-id="bg-dropdown-purple" data-name="date"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '</ul></div>' +
        '<div class="input-daterange input-group pull-right" id="date-range" style="width:calc(100% - 180px);">' +
        '<input type="text" class="form-control" name="start">' +
        '<span class="input-group-addon bg-default b-0">to</span>' +
        '<input type="text" class="form-control" name="end">' +
        '</div>';

    var dropdownDiv = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black" ' +
        'for="existingquery">' +
        '<a href="javascript:;" id="addNewDropdown" class="ax-text-success">' +
        '<i class="fa fa-plus ax-plus-btn" aria-hidden="true"></i></a> ' +
        ' <a href="javascript:;" id="removeDropdown" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        ' Dropdown</label><div class="clearfix"></div>' +
        '<select name="namefilterOptions" class="form-control pull-left" style="width: 110px;">' +
        '<option>Contains</option>' +
        '<option>Is</option>' +
        '<option>Is Not</option>' +
        '<option>Starts With</option>' +
        '<option>Ends With</option>' +
        '<option>Does not Contain</option>' +
        '<option>Is Blank</option>' +
        '<option>Is Not Blank</option>' +
        '</select>' +
        '<div class="btn-group ax-btn-form-group m-l-10">' +
        '<a class="btn ax-btn-form-control dropdown-toggle" id="ax-from-dd-color-btn" data-toggle="dropdown" href="#" style="width: 50px"> ' +
        '<span class="caret visible-hide"></span></a> ' +
        '<ul class="dropdown-menu min-width-50 no-border-radius no-padding no-margin"> ' +
        '<li class="bg-dropdown-skyblue ax-form-color-li" data-id="bg-dropdown-skyblue" data-name="dd"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-red ax-form-color-li" data-id="bg-dropdown-red" data-name="dd"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-green ax-form-color-li" data-id="bg-dropdown-green" data-name="dd"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-orange ax-form-color-li" data-id="bg-dropdown-orange" data-name="dd"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-blue ax-form-color-li" data-id="bg-dropdown-blue" data-name="dd"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-black ax-form-color-li" data-id="bg-dropdown-black" data-name="dd"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-yellow ax-form-color-li" data-id="bg-dropdown-yellow" data-name="dd"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '<li class="bg-dropdown-purple ax-form-color-li" data-id="bg-dropdown-purple" data-name="dd"><a href="#" class="visible-hide no-padding">Red</a></li> ' +
        '</ul></div>' +
        '<select class="form-control pull-right" style="width:calc(100% - 180px);">' +
        '<option></option><option></option>' +
        '</select>' +
        '</div>';

    $("#jobs-newcriteria").on("change", function () {
        if ($("#jobs-newcriteria").val() == 'jobname') {
            $("#jobs-addNewCriteriaContent").append(jobnameDiv);
        }
        if ($("#jobs-newcriteria").val() == 'jobnumber') {
            $("#jobs-addNewCriteriaContent").append(jobbumberDiv);
        }
        if ($("#jobs-newcriteria").val() == 'date') {
            $("#jobs-addNewCriteriaContent").append(dateDiv);
        }
        if ($("#jobs-newcriteria").val() == 'dropdown') {
            $("#jobs-addNewCriteriaContent").append(dropdownDiv);
        }
    });

    $(document).on('click', '#addNewJobName', function () {
        $("#jobs-addNewCriteriaContent").append(jobnameDiv);
    });

    $(document).on('click', '#removeJobName', function () {
        $(this).closest(".form-group").remove();
    });

    $(document).on('click', '#addNewJobNumber', function () {
        $("#jobs-addNewCriteriaContent").append(jobbumberDiv);
    });

    $(document).on('click', '#removeJobNumber', function () {
        $(this).closest(".form-group").remove();
    });

    $(document).on('click', '#addNewDate', function () {
        $("#jobs-addNewCriteriaContent").append(dateDiv);
    });

    $(document).on('click', '#removeDate', function () {
        $(this).closest(".form-group").remove();
    });

    $(document).on('click', '#addNewDropdown', function () {
        $("#jobs-addNewCriteriaContent").append(dropdownDiv);
    });

    $(document).on('click', '#removeDropdown', function () {
        $(this).closest(".form-group").remove();
    });


    $(document).on('click', '.ax-form-color-li', function () {
        // console.log($(this).attr('data-dname'));

        // $('#ax-from-name-color-btn')[0].className = $('#ax-from-name-color-btn')[0].className.replace(/\bbg.*?\b/g, '');
        $(this).closest(".btn-group").find(".ax-btn-form-control")[0].className =
            $(this).closest(".btn-group").find(".ax-btn-form-control")[0].className.replace(/\bbg.*?\b/g, '');

        $(this).closest(".btn-group").find(".ax-btn-form-control").addClass($(this).data("id"));
    });


    //DATETANGEPICKER
    $(document).on('focus', '#date-range', function () {
        $(this).datepicker({
            toggleActive: true,
            autoclose: true
        });
    });
});