$(document).ready(function () {
//input type question
    var inputques;

    function generateInput(id) {
        inputques = '<form>' +
            '<div class="form-group">' +
            '<label class="control-label">Question</label>' +
            '<input type="text" class="form-control" id="inputtext' + id + '">' +
            '</div>' +
            '<div class="form-group">' +
            '<label class="control-label">staff Notes</label>' +
            '<textarea rows="3" class="form-control"></textarea>' +
            '</div>' +
            '<a class="btn btn-ocean pull-right" data-id="' + id + '" id="inputquessubmit">Save</a>' +
            '<div class="clearfix"></div>' +
            '</form>';
    }

    $(document).on('click', '#inputquessubmit', function (e) {
        e.preventDefault();
        var id = "#inputtext" + $(this).data('id');

        $('#surveyQueModal').modal('hide');

        var exists = $('.inputques[data-id="' + $(this).data('id') + '"]').length;
        if (exists == 0) {
            $('#selectedQues').append('<div class="selectedqueslist inputques" ' +
                'data-id="' + $(this).data('id') + '">' +
                '<span class="field-icon-select-que-list field-icon statement"></span>' + $(id).val() + '</div>');

            generateAccordion($(this).data('id'));
        }
        else {
            $('.inputques[data-id="' + $(this).data('id') + '"]').html($(id).val());
            $('.inputques[data-id="' + $(this).data('id') + '"]').append('<span class="field-icon-select-que-list field-icon statement"></span>');
        }

        appendBtns('inputques', $(this).data('id'));
    });

    $(document).on('click', '.inputques', function (e) {
        $("#surveyQueModal").modal('show');
        $("#surveyQueModal").find(".modal-body").empty();

        generateInput($(this).data("id"));
        $("#surveyQueModal").find(".modal-body").append(inputques);

        var id = "#inputtext" + $(this).data('id');
        var html = $(this).clone().children().remove().end().text();
        $(id).val(html);
    });

//yesorno question
    var yesorno;

    function generateYesorNo(id) {
        yesorno = '<form>' +
            '<div class="form-group">' +
            '<label class="control-label">Enter Question Name</label>' +
            '<input type="text" class="form-control" id="yesornoQuesName' + id + '">' +
            '</div>' +
            '<div class="form-group">' +
            '<label class="control-label">Value for Yes</label>' +
            '<input type="text" class="form-control" id="yesornoYes' + id + '">' +
            '</div>' +
            '<div class="form-group">' +
            '<label class="control-label">Value for No</label>' +
            '<input type="text" class="form-control" id="yesornoNo' + id + '">' +
            '</div>' +
            '<a class="btn btn-ocean pull-right" data-id="' + id + '" id="yesnosubmit">Save</a>' +
            '<div class="clearfix"></div>' +
            '</form>';
    }

    $(document).on('click', '#yesnosubmit', function (e) {
        e.preventDefault();

        var yesnoqueid = "#yesornoQuesName" + $(this).data('id');
        var yesnoyesid = "#yesornoYes" + $(this).data('id');
        var yesnonoid = "#yesornoNo" + $(this).data('id');

        var divdata = '<div class="selectedqueslist yesnoques" ' +
            'data-id="' + $(this).data('id') + '">' +
            '<span class="field-icon-select-que-list field-icon yes-no"></span>' + $(yesnoqueid).val() +
            '<span class="visible-hide" id="yesval">' + $(yesnoyesid).val() + '</span>' +
            '<span class="visible-hide" id="noval">' + $(yesnonoid).val() + '</span>' +
            '</div>';

        $('#surveyQueModal').modal('hide');

        var exists = $('.yesnoques[data-id="' + $(this).data('id') + '"]').length;

        if (exists == 0) {
            $('#selectedQues').append(divdata);
            generateAccordion($(this).data('id'));
        }
        else {
            var updatediv = '<span class="visible-hide" id="yesval">' + $(yesnoyesid).val() + '</span>' +
                '<span class="visible-hide" id="noval">' + $(yesnonoid).val() + '</span>';

            $('.yesnoques[data-id="' + $(this).data('id') + '"]').html($(yesnoqueid).val());
            $('.yesnoques[data-id="' + $(this).data('id') + '"]').append(updatediv);
            $('.yesnoques[data-id="' + $(this).data('id') + '"]').append('<span class="field-icon-select-que-list field-icon yes-no"></span>');
        }

        appendBtns('yesnoques', $(this).data('id'));
    });

    $(document).on('click', '.yesnoques', function (e) {
        $("#surveyQueModal").modal('show');
        $("#surveyQueModal").find(".modal-body").empty();

        generateYesorNo($(this).data("id"));
        $("#surveyQueModal").find(".modal-body").append(yesorno);

        var yesnoqueid = "#yesornoQuesName" + $(this).data('id');
        var yesnoyesid = "#yesornoYes" + $(this).data('id');
        var yesnonoid = "#yesornoNo" + $(this).data('id');

        var html = $(this).clone().children().remove().end().text();

        $(yesnoqueid).val(html);
        $(yesnoyesid).val($(this).find("#yesval").html());
        $(yesnonoid).val($(this).find("#noval").html());
    });

//SELECT QUESTION TYPE
    $('.survey-select-que').on('click', 'button', function (e) {
        $("#surveyQueModal").find(".modal-dialog").removeClass("modal-lg");

        if ($(this).data("id") == 1) {
            generateInput($(document).find('.inputques').length + 1);

            $("#surveyQueModal").modal('show');
            $("#surveyQueModal").find(".modal-body").empty();
            $("#surveyQueModal").find(".modal-body").append(inputques);
        }

        if ($(this).data("id") == 7) {
            generateYesorNo($(document).find('.yesnoques').length + 1);

            $("#surveyQueModal").modal('show');
            $("#surveyQueModal").find(".modal-body").empty();
            $("#surveyQueModal").find(".modal-body").append(yesorno);
        }

        if ($(this).data("id") == 5) {
            $("#surveyQueModal").find(".modal-dialog").addClass("modal-lg");
            var rankingdiv = '<form>' +
                '<div class="form-group">' +
                '<label class="control-label">Question</label>' +
                '<input type="text" class="form-control">' +
                '</div>' +
                '<table class="table no-bordeer-table">' +
                '<tbody>' +
                '<tr>' +
                '<td class="text-left no-padding-left" style="padding-top: 15px; width: 45px">' +
                '<a href="javascript:;" class="ax-text-success"><i class="fa fa-plus ax-plus-btn" aria-hidden="true"></i> </a>' +
                '<a href="javascript:;" class="ax-text-danger"><i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i></a>' +
                '</td>' +
                '<td class="ax-table-x150"><input type="text" class="form-control" placeholder="Option"></td>' +
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
                '<input type="text" class="form-control" placeholder="staff Notes">' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '<div class="form-group">' +
                '<label class="control-label">staff Notes</label>' +
                '<textarea rows="3" class="form-control"></textarea>' +
                '</div>' +
                '<a class="btn btn-ocean pull-right">Save</a>' +
                '<div class="clearfix"></div>' +
                '</form>';

            $("#surveyQueModal").modal('show');
            $("#surveyQueModal").find(".modal-body").empty();
            $("#surveyQueModal").find(".modal-body").append(rankingdiv);
        }

        if ($(this).data("id") == 6) {
            var stardiv = '<form>' +
                '<div class="form-group">' +
                '<label class="control-label">Question</label>' +
                '<input type="text" class="form-control">' +
                '</div>' +
                '<div class="form-group">' +
                '<label class="control-label">Select Star Rating</label>' +
                '<input id="demo3" type="text" value="" name="demo3" data-bts-max="10">' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="range_01" class="control-label ax-color-black">Select Star Rating</label>' +
                '<div>' +
                '<input type="text" id="range_01">' +
                '</div>' +
                '</div>' +
                '<div class="form-group">' +
                '<label class="control-label">staff Notes</label>' +
                '<textarea rows="3" class="form-control"></textarea>' +
                '</div>' +
                '<a class="btn btn-ocean pull-right">Save</a>' +
                '<div class="clearfix"></div>' +
                '</form>';

            $("#surveyQueModal").modal('show');
            $("#surveyQueModal").find(".modal-body").empty();
            $("#surveyQueModal").find(".modal-body").append(stardiv);

            $("#range_01").ionRangeSlider({
                min: 0,
                max: 10
            });

            $("input[name='demo3']").TouchSpin({
                buttondown_class: "btn btn-primary",
                buttonup_class: "btn btn-primary"
            });
        }

        if ($(this).data("id") == 13) {
            var datediv = '<form>' +
                '<div class="form-group">' +
                '<label class="control-label">Question</label>' +
                '<input type="text" class="form-control">' +
                '</div>' +
                '<div class="form-group">' +
                '<label class="control-label">staff Notes</label>' +
                '<textarea rows="3" class="form-control"></textarea>' +
                '</div>' +
                '<a class="btn btn-ocean pull-right">Save</a>' +
                '<div class="clearfix"></div>' +
                '</form>';

            $("#surveyQueModal").modal('show');
            $("#surveyQueModal").find(".modal-body").empty();
            $("#surveyQueModal").find(".modal-body").append(datediv);
        }

        if ($(this).data("id") == 14) {
            var datediv = '<form>' +
                '<div class="form-group">' +
                '<label class="control-label">Question</label>' +
                '<input type="text" class="form-control">' +
                '</div>' +
                '<div class="form-group">' +
                '<label class="control-label">Video Url</label>' +
                '<input type="text" class="form-control">' +
                '</div>' +
                '<div class="form-group">' +
                '<label class="control-label">staff Notes</label>' +
                '<textarea rows="3" class="form-control"></textarea>' +
                '</div>' +
                '<a class="btn btn-ocean pull-right">Save</a>' +
                '<div class="clearfix"></div>' +
                '</form>';

            $("#surveyQueModal").modal('show');
            $("#surveyQueModal").find(".modal-body").empty();
            $("#surveyQueModal").find(".modal-body").append(datediv);
        }
    });

    function appendBtns(classname, divid) {
        var length = $('.' + classname + '[data-id="' + divid + '"]').closest(".selectedqueslist").find(".rightsidebtn").length;

        if (length == 0) {
            $('.' + classname + '[data-id="' + divid + '"]')
                .closest(".selectedqueslist").append('<div class="pull-right rightsidebtn">' +
                '<div class="pull-left inline-checkbox">' +
                '<div class="checkbox checkbox-primary font-12">' +
                '<input id="checkbox1" type="checkbox">' +
                '<label for="checkbox1">Mandatory</label>' +
                '</div>' +
                '<div class="checkbox checkbox-primary font-12">' +
                '<input id="checkbox1" type="checkbox">' +
                '<label for="checkbox1">Inactive</label>' +
                '</div>' +
                '<div class="checkbox checkbox-primary font-12">' +
                '<input id="checkbox1" type="checkbox">' +
                '<label for="checkbox1">Randomize</label>' +
                '</div>' +
                '</div><span class="p-l-10 p-r-10">|</span>' +
                '<i class="ti-move"></i>' +
                '<span class="duplicateselectedques"><i class="ti-files"></i></span>' +
                '<span class="deleteselectedques"><i class="ti-trash"></i></span>' +
                '</div>');
        }

        updateQuestionNo();
    }

    $(document).on('click', '.deleteselectedques', function (e) {
        e.preventDefault();
        e.stopPropagation();

        $(this).closest(".selectedqueslist").remove();

        updateQuestionNo();
    });

    $(document).on('click', '.duplicateselectedques', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var classname = $(".selectedqueslist").attr('class').split(' ')[1];
        var newid = $(document).find('.' + classname + '').length + 1;

        var clonediv = $(this).closest($(".selectedqueslist")).clone().prop('data-id', newid);
        $('#selectedQues').append(clonediv);

        updateQuestionNo();
    });

    function updateQuestionNo() {
        $("#selectedQuesNo").empty();
        var length = $(".selectedqueslist").length;

        for (var i = 0; i < length; i++) {
            var nodiv = '<div class="selectedQuesNo pull-left" data-id='+i+'>' + (i + 1) + '</div>';

            $("#selectedQuesNo").append(nodiv);
        }
    }

    function generateAccordion(dataid) {
        console.log(dataid);
        var exists = $('.selectedqueslist').attr("data-id", dataid).find($('.collapsed')).length;
        console.log(exists);
        if (exists == 0) {
            var length = $('[data-toggle="collapse"]').length;
            var accicon = '<div class="selectedQuesAccordion" data-id='+ length + '>' +
                '<a data-toggle="collapse" data-parent="#accordion-' + length + '" href="#collapseOne-' + length + '"' +
                'aria-expanded="false" class="collapsed toggle-collapse" data-id='+ length + '>' +
                '<i class="fa"></i>' +
                '</a>' +
                '</div><div class="clearfix"></div>';

            $('#selectedQuesAccordion').append(accicon);

            var acccontent = '<div class="panel-group m-b-0" id="accordion-' + length + '">' +
                '<div class="panel panel-default">' +
                '<div id="collapseOne-' + length + '" class="panel-collapse collapse" aria-expanded="true">' +
                '<div class="panel-body">' +
                'Options' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';

            // $('#selectedQuesAccordionContent').append(acccontent);
            $('.selectedqueslist').attr("data-id", dataid).closest('#selectedQues').append(acccontent);
        }
    }

    function AppendMargin(){

    }

    $(document).on('click', '.toggle-collapse', function (e) {
        var id = $(this).attr("href");
        var dataid = $(this).data("id") + 1;

        if($(this).hasClass("collapsed")) {
            $(".selectedQuesNo[data-id=" + dataid + "]")
                .css("margin-top", 0);
            $(".selectedQuesAccordion[data-id=" + dataid + "]")
                .css("margin-top", 0);
        }
        else{
            $(".selectedQuesNo[data-id=" + dataid + "]")
                .css("margin-top", $(id).find('.panel-body').height() + 12);
            $(".selectedQuesAccordion[data-id=" + dataid + "]")
                .css("margin-top", $(id).find('.panel-body').height() + 12);
        }
    });
});