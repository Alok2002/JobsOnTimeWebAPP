function nullorEmptyValidation(id) {
    if ($("#" + id).val() == null || $("#" + id).val() == "") {
        $("#" + id).addClass("ax-form-error-input");
        $("#" + id).next(".errorInfo").removeClass("hide");
        $("#" + id).next(".errorInfo").attr("data-content","Required.");
        return false;
    }
    return true;
}

function removeErrorClass(id) {
    $("#" + id).removeClass("ax-form-error-input");
}

$(document).ready(function () {
    $(document).on('click', '#addclientbtn', function (e) {
        e.preventDefault();

        var result = true;
        if (!nullorEmptyValidation("name")) {
            result = false;
        }
        if (!nullorEmptyValidation("shortname")) {
            result = false;
        }
        if (!nullorEmptyValidation("phone")) {
            result = false;
        }
        if (!nullorEmptyValidation("fax")) {
            result = false;
        }


        if (result == true) {
            $("addclientform").submit();

            //Success Message
            swal("Good job!", "", "success");
        }
    });

    $("#name, #shortname, #phone, #fax").focus(function () {
        removeErrorClass(this.id);
        $(this).next(".errorInfo").addClass("hide");
    });

    $('[data-toggle="popover"]').popover({
        placement : 'top',
        trigger : 'hover'
    });
});