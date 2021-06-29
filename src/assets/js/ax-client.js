$(document).ready(function () {
    var clientName = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black">' +
        '<a href="javascript:;" id="removeClientName" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        '<span class="vertical-middle"> client Name</span></label><div class="clearfix"></div>' +
        '<input type="text" name="clientname" class="form-control">'+
        '</div>';

    var clientPhone = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black">' +
        '<a href="javascript:;" id="removeClientPhone" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        '<span class="vertical-middle"> client Phone</span></label><div class="clearfix"></div>' +
        '<input type="text" name="clientphone" class="form-control">'+
        '</div>';

    var clientEmail = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black">' +
        '<a href="javascript:;" id="removeClientEmail" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        '<span class="vertical-middle"> client Email</span></label><div class="clearfix"></div>' +
        '<input type="text" name="clientemail" class="form-control">'+
        '</div>';

    var clientWebsite = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black">' +
        '<a href="javascript:;" id="removeClientWebsite" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        '<span class="vertical-middle"> client Website</span></label><div class="clearfix"></div>' +
        '<input type="text" name="clientname" class="form-control">'+
        '</div>';

    var contactName = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black" ' +
        'for="existingquery">' +
        '<a href="javascript:;" id="removeContactName" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        '<span class="vertical-middle"> Contact Name</span></label><div class="clearfix"></div>' +
        '<input type="text" name="contactname" class="form-control">'+
        '</div>';

    var contactMobile = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black" ' +
        'for="existingquery">' +
        '<a href="javascript:;" id="removeContactMobile" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        '<span class="vertical-middle"> Contact Mobile</span></label><div class="clearfix"></div>' +
        '<input type="text" name="contactmobile" class="form-control">'+
        '</div>';

    var contactEmail = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black" ' +
        'for="existingquery">' +
        '<a href="javascript:;" id="removeContactEmail" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        '<span class="vertical-middle"> Contact Email</span></label><div class="clearfix"></div>' +
        '<input type="text" name="contactemail" class="form-control">'+
        '</div>';

    var feedBack = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black" ' +
        'for="existingquery">' +
        '<a href="javascript:;" id="removeFeedBack" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
        '<span class="vertical-middle"> Feedback</span></label><div class="clearfix"></div>' +
        '<select class="form-control">' +
        '<option>Positive</option>' +
        '<option>Negative</option>' +
        '</select>'+
        '</div>';

    $("#newcriteria").on("change", function () {
        if ($("#newcriteria").val() == 'clientname') {
            if (!$("input[name='clientname']").length){
                $("#addNewCriteriaContent").append(clientName);
            }
        }
        if ($("#newcriteria").val() == 'clientphone') {
            if (!$("input[name='clientphone']").length) {
                $("#addNewCriteriaContent").append(clientPhone);
            }
        }
        if ($("#newcriteria").val() == 'clientemail') {
            if (!$("input[name='clientemail']").length) {
                $("#addNewCriteriaContent").append(clientEmail);
            }
        }
        if ($("#newcriteria").val() == 'clientwebsite') {
            if (!$("input[name='clientwebsite']").length) {
                $("#addNewCriteriaContent").append(clientWebsite);
            }
        }
        if ($("#newcriteria").val() == 'contactname') {
            if (!$("input[name='contactname']").length) {
                $("#addNewCriteriaContent").append(contactName);
            }
        }
        if ($("#newcriteria").val() == 'contactmobile') {
            if (!$("input[name='contactmobile']").length) {
                $("#addNewCriteriaContent").append(contactMobile);
            }
        }
        if ($("#newcriteria").val() == 'contactemail') {
            if (!$("input[name='contactemail']").length) {
                $("#addNewCriteriaContent").append(contactEmail);
            }
        }
        if ($("#newcriteria").val() == 'feedback') {
            if (!$("#removeFeedBack").length) {
                $("#addNewCriteriaContent").append(feedBack);
            }
        }
    });

    $(document).on('click', '#addClientName', function () {
        $("#addNewCriteriaContent").append(clientName);
    });

    $(document).on('click', '#removeClientName', function () {
        $(this).closest(".form-group").remove();
    });

    $(document).on('click', '#addClientPhone', function () {
        $("#addNewCriteriaContent").append(clientPhone);
    });

    $(document).on('click', '#removeClientPhone', function () {
        $(this).closest(".form-group").remove();
    });

    $(document).on('click', '#addClientEmail', function () {
        $("#addNewCriteriaContent").append(clientEmail);
    });

    $(document).on('click', '#removeClientEmail', function () {
        $(this).closest(".form-group").remove();
    });

    $(document).on('click', '#addClientWebsite', function () {
        $("#addNewCriteriaContent").append(clientWebsite);
    });

    $(document).on('click', '#removeClientWebsite', function () {
        $(this).closest(".form-group").remove();
    });

    $(document).on('click', '#addContactName', function () {
        $("#addNewCriteriaContent").append(contactName);
    });

    $(document).on('click', '#removeContactName', function () {
        $(this).closest(".form-group").remove();
    });

    $(document).on('click', '#addContactMobile', function () {
        $("#addNewCriteriaContent").append(contactMobile);
    });

    $(document).on('click', '#removeContactMobile', function () {
        $(this).closest(".form-group").remove();
    });

    $(document).on('click', '#addContactEmail', function () {
        $("#addNewCriteriaContent").append(contactEmail);
    });

    $(document).on('click', '#removeContactEmail', function () {
        $(this).closest(".form-group").remove();
    });

    $(document).on('click', '#removeFeedBack', function () {
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