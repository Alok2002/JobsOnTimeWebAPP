$('.survey-select-que').on('click', 'button', function (e) {
    $("#surveyQueModal").find(".modal-body").empty();
    $("#surveyQueModal").modal('show');

    $("#selectedQuesId").remove();
    $("#inputQues").val("");
    $("#inputStaffNotes").val("");

    var inputid = '<form>' +
        '<div class="form-group"> ' +
        '<label class="control-label">Question</label> ' +
        '<input type="text" class="form-control" id="inputQues"> ' +
        '</div> ' +
        '<a class="btn btn-ocean pull-right" data-id="1" id="inputquessubmit">Save</a> ' +
        '<div class="clearfix"></div> ' +
        '</form> ' +
        '<div class="clearfix"></div>';

    if ($(this).data('id') == 99) {
        for (var i = 1; i < 6; i++) {
            inputid = '<div id="selectedQuesContent" class="pull-left">' +
                '<div class="selectedQuesContainer" data-id="99"> ' +
                '<div id="selectedQuesNo" class="pull-left">' +
                '<div class="selectedQuesNo pull-left">1</div> ' +
                '</div> ' +
                '<div id="selectedQues" class="pull-left selectedQues" data-id="99" style="width: calc(100% - 45px);"> ' +
                '<div class="selectedqueslist"> ' +
                '<span class="field-icon-select-que-list field-icon statement"></span> ' +
                '<span class="txt">Question ' + i + '</span> ' +
                '</div> ' +
                '</div> ' +
                '<div class="clearfix"></div> ' +
                '</div> ' +
                '</div>' +
                '<div class="clearfix"></div> ';

            $("#surveyQueModal").find(".modal-body").append(inputid);
        }
    }

    else {
        $("#surveyQueModal").find(".modal-body").append(inputid);
    }

    if ($("#selectedQuesContent").find(".activeque").closest(".selectedQuesContainer").data("id") != null) {
        console.log("insise");
        var pos = $("#selectedQuesContent").find(".activeque").closest(".selectedQuesContainer").data("id");
        var posinput = "<input type='hidden' name='pos' id='insertPos' value=" + pos + ">";
        $("#surveyQueModal").find(".modal-body").append(posinput);
    }
});

$(document).on('click', '#inputquessubmit', function (e) {
    $("#surveyQueModal").modal('hide');
    var length = $(".selectedQuesNo").length;
    if (length == 0) {
        length = 1;
    } else {
        var num = $(".selectedQuesContainer").map(function () {
            return $(this).data('id');
        }).get();//get all data values in an array

        var highest = Math.max.apply(Math, num);//find the highest value from them
        length = highest + 1;
    }

    if ($("#insertPos").val() == null) {
        $("#selectedQuesContent").append("<div class='selectedQuesContainer' data-id='" + length + "'></div>");
    }
    else {
        $("#selectedQuesContent").find($(".selectedQuesContainer[data-id=" + $("#insertPos").val() + "]"))
            .after("<div class='selectedQuesContainer' data-id='" + length + "'></div>")
    }

    var quenodiv = "<div id='selectedQuesNo' class='pull-left'>" +
        "<div class='selectedQuesNo pull-left'>" + length + "</div>" +
        "</div>";

    var quesdiv = "<div id='selectedQues' class='pull-left selectedQues' data-id='" + length + "'>" +
        "<div class='selectedqueslist'>" +
        "<span class='field-icon-select-que-list field-icon statement'></span>" +
        "<span class='txt'>" +
        $("#inputQues").val() +
        "</span>" +
        "<div class='pull-right rightsidebtn'>" +
        "<div class='pull-left inline-checkbox'>" +
        "<div class='checkbox checkbox-primary font-12'>" +
        "<input id='checkbox1' type='checkbox'>" +
        "<label for='checkbox1'>Mandatory</label>" +
        "</div>" +
        "<div class='checkbox checkbox-primary font-12'>" +
        "<input id='checkbox1' type='checkbox'>" +
        "<label for='checkbox1'>Inactive</label>" +
        "</div>" +
        "<div class='checkbox checkbox-primary font-12'>" +
        "<input id='checkbox1' type='checkbox'>" +
        "<label for='checkbox1'>Randomize Option</label>" +
        "</div>" +
        "</div>" +
        "<span class='p-l-10 p-r-10'>|</span>" +
        "<i class='ti-move'></i>" +
        "<span class='duplicateselectedques'>" +
        "<i class='ti-files'></i>" +
        "</span>" +
        "<span class='deleteselectedques'>" +
        "<i class='ti-trash'></i>" +
        "</span>" +
        "</div>" +
        "</div>" +
        "</div>";

    var quesaccdiv = "<div id='selectedQuesAccordion' class='pull-left'>" +
        "<div class='selectedQuesAccordion' data-id=" + length + ">" +
        "<a style='color: #4c5667;'>" +
        "<i class='fa fa-plus'></i>" +
        "</a>" +
        "</div>" +
        "</div>" +
        "<div class='clearfix'></div> ";

    var quesacccontentdiv = '<div class="quesacccontent" data-id=' + length + '>' +
        '</div>';

    $("#selectedQuesContent").find($(".selectedQuesContainer[data-id=" + length + "]")).append(quenodiv);
    $("#selectedQuesContent").find($(".selectedQuesContainer[data-id=" + length + "]")).append(quesdiv);
    $("#selectedQuesContent").find($(".selectedQuesContainer[data-id=" + length + "]")).append(quesaccdiv);

    $(".selectedQues[data-id=" + length + "]").append(quesacccontentdiv);

    if ($("#insertPos").val() != null) {
        updateQuesNo();
    }
});

$(document).on('click', '.selectedQuesAccordion', function (e) {
    // console.log($(this).data('id'));
    $(".quesacccontent[data-id=" + $(this).data('id') + "]").empty();
    $(".quesacccontent[data-id=" + $(this).data('id') + "]").toggleClass("quesacccontent-show");

    generateAccContent($(this).data('id'));
    updateAccValue($(this).data('id'));
});

$(document).on('click', '#submitAccForm', function (e) {
    var id = $(this).data('id');

    $(".selectedQues[data-id=" + id + "]").find(".txt").html($(".quesinput[data-id=" + id + "]").val());
});

$(document).on('click', '.deleteselectedques', function (e) {
    $(this).closest($(".selectedQuesContainer")).remove();
    updateQuesNo();
});

$(document).on('click', '.duplicateselectedques', function (e) {
    var num = $(".selectedQuesContainer").map(function () {
        return $(this).data('id');
    }).get();//get all data values in an array

    var highest = Math.max.apply(Math, num);//find the highest value from them
    var maxid = highest + 1;

    var clonediv = $(this).closest($(".selectedQuesContainer")).clone();
    clonediv.attr("data-id", maxid);
    clonediv.find(".selectedQues").attr("data-id", maxid);
    clonediv.find(".quesacccontent").attr("data-id", maxid);
    clonediv.find(".selectedQuesAccordion").attr("data-id", maxid);

    $(this).closest($(".selectedQuesContainer")).after(clonediv);
    updateQuesNo();
});

//Insertbetween
$(document).on('click', '.selectedQuesNo', function (e) {
    $("#selectedQuesContent").find("*").removeClass("activeque");
    $(this).addClass("activeque");
});

$(document).on("click", function (e) {
    if ($(e.target).is(".selectedQuesNo, .survey-select-que > button") === false) {
        $("#selectedQuesContent").find("*").removeClass("activeque");
    }
});


function generateAccContent(id) {
    var div = '<form>' +
        '<div class="form-group">' +
        '<label class="control-label">Question</label>' +
        '<input type="text" class="form-control quesinput" data-id=' + id + '>' +
        '</div>' +
        '<table class="table no-bordeer-table">' +
        '<tbody>' +
        '<tr>' +
        '<td class="text-left no-padding-left" style="width: 15px; padding: 3px 0px;">' +
        '<a href="javascript:;" class="ax-text-success">' +
        '<i class="fa fa-plus ax-plus-btn" aria-hidden="true"></i>' +
        '</a> <br>' +
        ' <a href="javascript:;" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i>' +
        '</a>' +
        '</td>' +
        '<td class="ax-table-x150">' +
        '<input type="text" class="form-control" placeholder="Option">' +
        '</td>' +
        '<td class="ax-table-x150">' +
        '<select class="form-control">' +
        '<option value="">Action</option>' +
        '</select>' +
        '</td>' +
        '<td class="ax-table-x150">' +
        '<select class="form-control">' +
        '<option value="">Action Details</option>' +
        '</select>' +
        '</td>' +
        '<td style="padding-right: 0px">' +
        '<select class="form-control">' +
        '<option>staff Action</option>' +
        '</select>' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td class="text-left no-padding-left" style="width: 15px; padding: 3px 0px;">' +
        '<a href="javascript:;" class="ax-text-success">' +
        '<i class="fa fa-plus ax-plus-btn" aria-hidden="true"></i>' +
        '</a> <br>' +
        ' <a href="javascript:;" class="ax-text-danger">' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i>' +
        '</a>' +
        '</td>' +
        '<td class="ax-table-x150">' +
        '<input type="text" class="form-control" placeholder="Option">' +
        '</td>' +
        '<td class="ax-table-x150">' +
        '<select class="form-control">' +
        '<option value="">Action</option>' +
        '</select>' +
        '</td>' +
        '<td class="ax-table-x150">' +
        '<select class="form-control">' +
        '<option value="">Action Details</option>' +
        '</select>' +
        '</td>' +
        '<td style="padding-right: 0px">' +
        '<select class="form-control">' +
        '<option>staff Action</option>' +
        '</select>' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '<div class="form-group">' +
        '<label class="control-label">staff Notes</label>' +
        '<textarea rows="3" class="form-control"></textarea>' +
        '</div>' +
        '<a class="btn btn-ocean pull-right" id="submitAccForm" data-id="' + id + '">Save</a>' +
        '<div class="clearfix"></div>' +
        '</form>';

    $(".quesacccontent[data-id=" + id + "]").append(div);
}

function updateAccValue(id) {
    var value = $(".selectedQues[data-id=" + id + "]").find($(".txt")).html();

    $(".quesinput[data-id=" + id + "]").val(value);
}

function updateQuesNo() {

    $('#selectedQuesContent > .selectedQuesContainer').each(function (key) {
        $(this).find($('.selectedQuesNo')).html(key + 1);
    });
}

$(function () {
    $("#selectedQuesContent").sortable({
        stop: function (event, ui) {
            updateQuesNo()
        }
    });
    $("#selectedQuesContent").disableSelection();
});