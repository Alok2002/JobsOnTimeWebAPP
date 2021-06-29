$(document).ready(function () {
    var specificID = '<div class="form-group col-md-12 p-l-0 p-r-0">' +
        '<label class="control-label ax-color-black">' +
        '<a href="javascript:;" id="addSpecifiID" class="ax-text-success"> ' +
        '<i class="fa fa-plus ax-plus-btn" aria-hidden="true"></i> ' +
        '</a> ' +
        '<a href="javascript:;" id="removeSpecifiID" class="ax-text-danger"> ' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i> ' +
        '</a> ' +
        '<span class="vertical-middle">Specific ID</span></label> ' +
        '<div class="clearfix"></div> ' +
        '<select class="form-control pull-left" style="width: 110px;"> ' +
        '<option value="">Contains</option> ' +
        '</select> ' +
        '<select class="form-control pull-left" style="width: 70px; margin-left: 10px"> ' +
        '<option value=""></option> ' +
        '</select> ' +
        '<input type="text" class="form-control pull-right" style="width: calc(100% - 200px)"> ' +
        '</div>';

    var name = '<div class="form-group col-md-12 p-l-0 p-r-0" id="name"> ' +
        '<label class="control-label ax-color-black"> ' +
        '<a href="javascript:;" id="addName" class="ax-text-success"> ' +
        '<i class="fa fa-plus ax-plus-btn" aria-hidden="true"></i> ' +
        '</a> ' +
        '<a href="javascript:;" id="removeName" class="ax-text-danger"> ' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i> ' +
        '</a> ' +
        '<span class="vertical-middle">Name</span></label> ' +
        '<div class="clearfix"></div> ' +
        '<select class="form-control pull-left" style="width: 110px;"> ' +
        '<option value="">Is</option> ' +
        '</select> ' +
        '<select class="form-control pull-left" style="width: 70px; margin-left: 10px"> ' +
        '<option value=""></option> ' +
        '</select> ' +
        '<input type="text" class="form-control pull-right"' +
        'style="width: calc(100% - 200px)"> ' +
        '</div>';

    var mobileno = '<div class="form-group col-md-12 p-l-0 p-r-0"> ' +
        '<label class="control-label ax-color-black"> ' +
        '<a href="javascript:;" id="addMobileNo" class="ax-text-success"> ' +
        '<i class="fa fa-plus ax-plus-btn" aria-hidden="true"></i> ' +
        '</a> ' +
        '<a href="javascript:;" id="removeMobileNo" class="ax-text-danger"> ' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i> ' +
        '</a> ' +
        '<span class="vertical-middle">Mobile No</span></label> ' +
        '<div class="clearfix"></div> ' +
        '<select class="form-control pull-left" style="width: 110px;"> ' +
        '<option value="">Contains</option> ' +
        '</select> ' +
        '<select class="form-control pull-left" style="width: 70px; margin-left: 10px"> ' +
        '<option value=""></option> ' +
        '</select> ' +
        '<input type="text" class="form-control pull-right" style="width: calc(100% - 200px)"> ' +
        '</div>';

    var email = '<div class="form-group col-md-12 p-l-0 p-r-0"> ' +
        '<label class="control-label ax-color-black"> ' +
        '<a href="javascript:;" id="addEmail" class="ax-text-success"> ' +
        '<i class="fa fa-plus ax-plus-btn" aria-hidden="true"></i> ' +
        '</a> ' +
        '<a href="javascript:;" id="removeEmail" class="ax-text-danger"> ' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i> ' +
        '</a> ' +
        '<span class="vertical-middle">Email Address</span></label> ' +
        '<div class="clearfix"></div> ' +
        '<select class="form-control pull-left" style="width: 110px;"> ' +
        '<option value="">Contains</option> ' +
        '</select> ' +
        '<select class="form-control pull-left" style="width: 70px; margin-left: 10px"> ' +
        '<option value=""></option> ' +
        '</select> <input type="text" class="form-control pull-right" style="width: calc(100% - 200px)"> ' +
        '</div>';

    var age = '<div class="form-group col-md-12 p-l-0 p-r-0"> ' +
        '<label class="control-label ax-color-black"> ' +
        '<a href="javascript:;" id="addAge" class="ax-text-success"> ' +
        '<i class="fa fa-plus ax-plus-btn" aria-hidden="true"></i> ' +
        '</a> ' +
        '<a href="javascript:;" id="removeAge" class="ax-text-danger"> ' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i> ' +
        '</a> ' +
        '<span class="vertical-middle">Age</span></label> ' +
        '<div class="clearfix"></div> ' +
        '<select class="form-control pull-left" style="width: 110px;"> ' +
        '<option value="">Is</option> ' +
        '</select> ' +
        '<select class="form-control pull-left" style="width: 70px; margin-left: 10px"> ' +
        '<option value=""></option> ' +
        '</select> ' +
        '<input type="text" class="form-control pull-right" style="width: calc(100% - 200px)"> ' +
        '</div>';

    var smr = '<div class="form-group col-md-12 p-l-0 p-r-0"> ' +
        '<label class="control-label ax-color-black"> ' +
        '<a href="javascript:;" id="addSMR" class="ax-text-success"> ' +
        '<i class="fa fa-plus ax-plus-btn" aria-hidden="true"></i> ' +
        '</a> ' +
        '<a href="javascript:;" id="removeSMR" class="ax-text-danger"> ' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i> ' +
        '</a> ' +
        '<span class="vertical-middle">Six Month Rule</span></label> ' +
        '<div class="clearfix"></div> ' +
        '<select class="form-control pull-left" style="width: 110px;"> ' +
        '<option value="">Is</option> ' +
        '</select> ' +
        '<select class="form-control pull-left" style="width: 70px; margin-left: 10px"> ' +
        '<option value=""></option> ' +
        '</select> <input type="checkbox" class="form-control pull-right" style="width: calc(100% - 200px)"> ' +
        '</div>';

    var oor = '<div class="form-group col-md-12 p-l-0 p-r-0"> ' +
        '<label class="control-label ax-color-black"> ' +
        '<a href="javascript:;" id="addOOR" class="ax-text-success"> ' +
        '<i class="fa fa-plus ax-plus-btn" aria-hidden="true"></i> ' +
        '</a> ' +
        '<a href="javascript:;" id="removeOOR" class="ax-text-danger"> ' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i> ' +
        '</a> ' +
        '<span class="vertical-middle">Only One Off Respondents</span></label> ' +
        '<div class="clearfix"></div> ' +
        '<select class="form-control pull-left" style="width: 110px;"> ' +
        '<option value="">Is</option> ' +
        '</select> ' +
        '<select class="form-control pull-left" style="width: 70px; margin-left: 10px"> ' +
        '<option value=""></option> ' +
        '</select> ' +
        '<input type="checkbox" class="form-control pull-right" style="width: calc(100% - 200px)"> ' +
        '</div>';

    var ednc = '<div class="form-group col-md-12 p-l-0 p-r-0"> ' +
        '<label class="control-label ax-color-black"> ' +
        '<a href="javascript:;" id="addEDNC" class="ax-text-success"> ' +
        '<i class="fa fa-plus ax-plus-btn" aria-hidden="true"></i> ' +
        '</a> ' +
        '<a href="javascript:;" id="removeEDNC" class="ax-text-danger"> ' +
        '<i class="fa fa-minus ax-minus-btn" aria-hidden="true"></i> ' +
        '</a> ' +
        '<span class="vertical-middle">Exclude Do Not Call</span></label> ' +
        '<div class="clearfix"></div> ' +
        '<select class="form-control pull-left" style="width: 110px;"> ' +
        '<option value="">Is</option> ' +
        '</select> ' +
        '<select class="form-control pull-left" style="width: 70px; margin-left: 10px"> ' +
        '<option value=""></option> ' +
        '</select> ' +
        '<input type="checkbox" class="form-control pull-right" style="width: calc(100% - 200px)"> ' +
        '</div>';

    $(document).on('click', '#addSpecifiID', function () {
        $("#addNewCriteriaContent").append(specificID);
    });

    $(document).on('click', '#addName', function () {
        $("#addNewCriteriaContent").append(name);
    });

    $(document).on('click', '#addMobileNo', function () {
        $("#addNewCriteriaContent").append(mobileno);
    });

    $(document).on('click', '#addEmail', function () {
        $("#addNewCriteriaContent").append(email);
    });

    $(document).on('click', '#addAge', function () {
        $("#addNewCriteriaContent").append(age);
    });

    $(document).on('click', '#addSMR', function () {
        $("#addNewCriteriaContent").append(smr);
    });

    $(document).on('click', '#addOOR', function () {
        $("#addNewCriteriaContent").append(oor);
    });

    $(document).on('click', '#addEDNC', function () {
        $("#addNewCriteriaContent").append(ednc);
    });

    $(document).on('click', '#removeSpecifiID, #removeName, #removeMobileNo, #removeEmail, ' +
        '#removeAge, #removeSMR, #removeOOR, #removeEDNC', function () {
        $(this).closest(".form-group").remove();
    });
});