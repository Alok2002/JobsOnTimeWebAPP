//JOBS
$(document).ready(function () {
    var nameDiv = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black" ' +
        'for="existingquery">' +
        '<a href="#" id="addNewName" class="ax-text-success">' +
        '<i class="fa fa-plus ax-plus-btn" aria-hidden="true"></i></a> ' +
        ' <a href="#" id="removeName" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        ' Name</label><div class="clearfix"></div>' +
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

    $("#newcriteria").on("change", function () {
        if ($("#newcriteria").val() == 'name') {
            $("#addNewCriteriaContent").append(nameDiv);
        }
        if ($("#newcriteria").val() == 'date') {
            $("#addNewCriteriaContent").append(dateDiv);
        }
        if ($("#newcriteria").val() == 'dropdown') {
            $("#addNewCriteriaContent").append(dropdownDiv);
        }
    });

    $(document).on('click', '#addNewName', function () {
        $("#addNewCriteriaContent").append(nameDiv);
    });

    $(document).on('click', '#removeName', function () {
        $(this).closest(".form-group").remove();
    });

    $(document).on('click', '#addNewDate', function () {
        $("#addNewCriteriaContent").append(dateDiv);
    });

    $(document).on('click', '#removeDate', function () {
        $(this).closest(".form-group").remove();
    });

    $(document).on('click', '#addNewDropdown', function () {
        $("#addNewCriteriaContent").append(dropdownDiv);
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

//NOTES LOAD QUERY
$(document).ready(function () {
    var NotesUser = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black">' +
        '<a href="javascript:;" id="removeNotesUser" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        '<span class="vertical-middle"> User</span></label><div class="clearfix"></div>' +
        '<select name="notesuser" class="form-control">' +
        '<option>Ash Jacobs</option>' +
        '</select>'+
        '</div>';

    var NotesNotes = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black">' +
        '<a href="javascript:;" id="removeNotesNotes" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        '<span class="vertical-middle"> Notes</span></label><div class="clearfix"></div>' +
        '<input type="text" name="notesnotes" class="form-control">' +
        '</div>';

    var NotesType = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black">' +
        '<a href="javascript:;" id="removeNotesType" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        '<span class="vertical-middle"> Type</span></label><div class="clearfix"></div>' +
        '<select name="notestype" class="form-control">' +
        '<option>Internal</option>' +
        '<option>External</option>' +
        '</select>'+
        '</div>';

    var NotesDate = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black">' +
        '<a href="javascript:;" id="removeNotesDate" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        '<span class="vertical-middle"> Date Range</span></label><div class="clearfix"></div>' +
        '<div class="input-daterange input-group date-range">' +
        '<input type="text" class="form-control" name="start">' +
        '<span class="input-group-addon bg-default b-0">to</span>' +
        '<input type="text" class="form-control" name="end">' +
        '</div>';
        '</div>';

    $("#notes-newcriteria").on("change", function () {
        if ($("#notes-newcriteria").val() == 'notesuser') {
            if (!$("#removeNotesUser").length) {
                $("#notes-addNewCriteriaContent").append(NotesUser);
            }
        }
        if ($("#notes-newcriteria").val() == 'notesnotes') {
            if (!$("#removeNotesNotes").length) {
                $("#notes-addNewCriteriaContent").append(NotesNotes);
            }
        }
        if ($("#notes-newcriteria").val() == 'notestype') {
            if (!$("#removeNotesType").length) {
                $("#notes-addNewCriteriaContent").append(NotesType);
            }
        }
        if ($("#notes-newcriteria").val() == 'notesdate') {
            if (!$("#removeNotesDate").length) {
                $("#notes-addNewCriteriaContent").append(NotesDate);
            }
        }
    });

    $(document).on('click', '#removeNotesUser, #removeNotesNotes, #removeNotesType, #removeNotesDate', function () {
        $(this).closest(".form-group").remove();
    });

    $(document).on('click', '.ax-form-color-li', function () {
        // console.log($(this).attr('data-dname'));

        // $('#ax-from-name-color-btn')[0].className = $('#ax-from-name-color-btn')[0].className.replace(/\bbg.*?\b/g, '');
        $(this).closest(".btn-group").find(".ax-btn-form-control")[0].className =
            $(this).closest(".btn-group").find(".ax-btn-form-control")[0].className.replace(/\bbg.*?\b/g, '');

        $(this).closest(".btn-group").find(".ax-btn-form-control").addClass($(this).data("id"));
    });
});

//DOCS LOAD QUERY
$(document).ready(function () {
    var DocsUser = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black">' +
        '<a href="javascript:;" id="removeDocsUser" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        '<span class="vertical-middle"> User</span></label><div class="clearfix"></div>' +
        '<select name="docsuser" class="form-control">' +
        '<option>Ash Jacobs</option>' +
        '</select>'+
        '</div>';

    var DocsName = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black">' +
        '<a href="javascript:;" id="removeDocsName" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        '<span class="vertical-middle"> Document Name</span></label><div class="clearfix"></div>' +
        '<input type="text" name="docsname" class="form-control">' +
        '</div>';

    var DocsType = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black">' +
        '<a href="javascript:;" id="removeDocsType" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        '<span class="vertical-middle"> Type</span></label><div class="clearfix"></div>' +
        '<select name="docstype" class="form-control">' +
        '<option>PDF</option>' +
        '<option>Excel</option>' +
        '</select>'+
        '</div>';

    var DocsDate = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black">' +
        '<a href="javascript:;" id="removeDocsDate" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        '<span class="vertical-middle"> Date Range</span></label><div class="clearfix"></div>' +
        '<div class="input-daterange input-group date-range">' +
        '<input type="text" class="form-control" name="start">' +
        '<span class="input-group-addon bg-default b-0">to</span>' +
        '<input type="text" class="form-control" name="end">' +
        '</div>';
    '</div>';

    $("#docs-newcriteria").on("change", function () {
        if ($("#docs-newcriteria").val() == 'docsuser') {
            if (!$("#removeDocsUser").length) {
                $("#docs-addNewCriteriaContent").append(DocsUser);
            }
        }
        if ($("#docs-newcriteria").val() == 'docsname') {
            if (!$("#removeDocsName").length) {
                $("#docs-addNewCriteriaContent").append(DocsName);
            }
        }
        if ($("#docs-newcriteria").val() == 'docstype') {
            if (!$("#removeDocsType").length) {
                $("#docs-addNewCriteriaContent").append(DocsType);
            }
        }
        if ($("#docs-newcriteria").val() == 'docsdate') {
            if (!$("#removeDocsDate").length) {
                $("#docs-addNewCriteriaContent").append(DocsDate);
            }
        }
    });

    $(document).on('click', '#removeDocsUser, #removeDocsName, #removeDocsType, #removeDocsDate', function () {
        $(this).closest(".form-group").remove();
    });

    $(document).on('click', '.ax-form-color-li', function () {
        // console.log($(this).attr('data-dname'));

        // $('#ax-from-name-color-btn')[0].className = $('#ax-from-name-color-btn')[0].className.replace(/\bbg.*?\b/g, '');
        $(this).closest(".btn-group").find(".ax-btn-form-control")[0].className =
            $(this).closest(".btn-group").find(".ax-btn-form-control")[0].className.replace(/\bbg.*?\b/g, '');

        $(this).closest(".btn-group").find(".ax-btn-form-control").addClass($(this).data("id"));
    });
});

//FEEDBACK LOAD QUERY
$(document).ready(function () {
    var FeedbackUser = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black">' +
        '<a href="javascript:;" id="removeFeedbackUser" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        '<span class="vertical-middle"> User</span></label><div class="clearfix"></div>' +
        '<select name="feedbackuser" class="form-control">' +
        '<option>Ash Jacobs</option>' +
        '</select>'+
        '</div>';

    var FeedbackFeedback = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black">' +
        '<a href="javascript:;" id="removeFeedbackFeedback" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        '<span class="vertical-middle"> Feedback</span></label><div class="clearfix"></div>' +
        '<input type="text" name="feedbackfeedback" class="form-control">' +
        '</div>';

    var FeedbackType = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black">' +
        '<a href="javascript:;" id="removeFeedbackType" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        '<span class="vertical-middle"> Type</span></label><div class="clearfix"></div>' +
        '<select name="feedbacktype" class="form-control">' +
        '<option>Positive</option>' +
        '<option>Negative</option>' +
        '</select>'+
        '</div>';

    var FeedbackDate = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black">' +
        '<a href="javascript:;" id="removeFeedbackDate" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        '<span class="vertical-middle"> Date Range</span></label><div class="clearfix"></div>' +
        '<div class="input-daterange input-group date-range">' +
        '<input type="text" class="form-control" name="start">' +
        '<span class="input-group-addon bg-default b-0">to</span>' +
        '<input type="text" class="form-control" name="end">' +
        '</div>';
    '</div>';

    $("#feedback-newcriteria").on("change", function () {
        if ($("#feedback-newcriteria").val() == 'feedbackuser') {
            if (!$("#removeFeedbackUser").length) {
                $("#feedback-addNewCriteriaContent").append(FeedbackUser);
            }
        }
        if ($("#feedback-newcriteria").val() == 'feedbackfeedback') {
            if (!$("#removeFeedbackFeedback").length) {
                $("#feedback-addNewCriteriaContent").append(FeedbackFeedback);
            }
        }
        if ($("#feedback-newcriteria").val() == 'feedbacktype') {
            if (!$("#removeFeedbackType").length) {
                $("#feedback-addNewCriteriaContent").append(FeedbackType);
            }
        }
        if ($("#feedback-newcriteria").val() == 'feedbackdate') {
            if (!$("#removeFeedbackDate").length) {
                $("#feedback-addNewCriteriaContent").append(FeedbackDate);
            }
        }
    });

    $(document).on('click', '#removeFeedbackUser, #removeFeedbackFeedback, #removeFeedbackType, #removeFeedbackDate', function () {
        $(this).closest(".form-group").remove();
    });

    $(document).on('click', '.ax-form-color-li', function () {
        // console.log($(this).attr('data-dname'));

        // $('#ax-from-name-color-btn')[0].className = $('#ax-from-name-color-btn')[0].className.replace(/\bbg.*?\b/g, '');
        $(this).closest(".btn-group").find(".ax-btn-form-control")[0].className =
            $(this).closest(".btn-group").find(".ax-btn-form-control")[0].className.replace(/\bbg.*?\b/g, '');

        $(this).closest(".btn-group").find(".ax-btn-form-control").addClass($(this).data("id"));
    });
});

//ACTIVITY LOAD QUERY
$(document).ready(function () {
    var ActUser = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black">' +
        '<a href="javascript:;" id="removeActUser" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        '<span class="vertical-middle"> User</span></label><div class="clearfix"></div>' +
        '<select name="actuser" class="form-control">' +
        '<option>Ash Jacobs</option>' +
        '</select>'+
        '</div>';

    var ActActivity = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black">' +
        '<a href="javascript:;" id="removeActFeedback" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        '<span class="vertical-middle"> Feedback</span></label><div class="clearfix"></div>' +
        '<input type="text" name="actactivity" class="form-control">' +
        '</div>';

    var ActDate = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black">' +
        '<a href="javascript:;" id="removeActDate" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        '<span class="vertical-middle"> Date Range</span></label><div class="clearfix"></div>' +
        '<div class="input-daterange input-group date-range">' +
        '<input type="text" class="form-control" name="start">' +
        '<span class="input-group-addon bg-default b-0">to</span>' +
        '<input type="text" class="form-control" name="end">' +
        '</div>';
    '</div>';

    $("#act-newcriteria").on("change", function () {
        if ($("#act-newcriteria").val() == 'actuser') {
            if (!$("#removeActUser").length) {
                $("#act-addNewCriteriaContent").append(ActUser);
            }
        }
        if ($("#act-newcriteria").val() == 'actactivity') {
            if (!$("#removeActActivity").length) {
                $("#act-addNewCriteriaContent").append(ActActivity);
            }
        }
        if ($("#act-newcriteria").val() == 'actdate') {
            if (!$("#removeActDate").length) {
                $("#act-addNewCriteriaContent").append(ActDate);
            }
        }
    });

    $(document).on('click', '#removeActUser, #removeActActivity, #removeActDate', function () {
        $(this).closest(".form-group").remove();
    });

    $(document).on('click', '.ax-form-color-li', function () {
        // console.log($(this).attr('data-dname'));

        // $('#ax-from-name-color-btn')[0].className = $('#ax-from-name-color-btn')[0].className.replace(/\bbg.*?\b/g, '');
        $(this).closest(".btn-group").find(".ax-btn-form-control")[0].className =
            $(this).closest(".btn-group").find(".ax-btn-form-control")[0].className.replace(/\bbg.*?\b/g, '');

        $(this).closest(".btn-group").find(".ax-btn-form-control").addClass($(this).data("id"));
    });
});


//DATETANGEPICKER
$(document).on('focus', '#date-range', function () {
    $(this).datepicker({
        toggleActive: true,
        autoclose: true
    });
});