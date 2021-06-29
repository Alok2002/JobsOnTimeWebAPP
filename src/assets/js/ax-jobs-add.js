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

//DATETANGEPICKER
$(document).on('focus', '#date-range', function () {
    $(this).datepicker({
        toggleActive: true,
        autoclose: true
    });
});