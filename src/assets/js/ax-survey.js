$(document).ready(function () {
    $(document).on('click', '#startsurvey', function (e) {
        e.preventDefault();
        $("#survey1").addClass("active");
        $("#next").removeClass("hide");
        $("#bottom-btn").removeClass("hide");
        $("#welcome").addClass("hide");
        $("#start-btn").addClass("hide");
    });

    $(document).on('click', '#finish', function (e) {
        e.preventDefault();
        $('.Survey').find('.form-group').removeClass('active');
        $("#end").removeClass("hide");
        $("#next").addClass("hide");
        $("#prev").addClass("hide");
        $("#welcome").addClass("hide");
        $("#finish").addClass("hide");
        $("#bottom-btn").addClass("hide");
    });

    $(document).on('click', '#next', function (e) {
        e.preventDefault();
        $("#prev").removeClass("hide");

        var nextid = $('.Survey').find('.form-group.active').data("id") + 1;
        var isnextavail =  $(".Survey").find("[data-id='" + nextid + "']").length;
        var isfinal =  $(".Survey").find("[data-id='" + (nextid + 1) + "']").length;

        if(!isNaN(nextid) && isnextavail != 0) {
            // nextid = nextid + 1;
            $('.Survey').find('.form-group').removeClass('active');
            $(".Survey").find("[data-id='" + nextid + "']").addClass('active');
        }

        if(isfinal == 0){
            $("#next").addClass("hide");
            $("#finish").removeClass("hide");
        }
    });

    $(document).on('click', '#prev', function (e) {
        e.preventDefault();

        var nextid = $('.Survey').find('.form-group.active').data("id") - 1;
        var isnextavail =  $(".Survey").find("[data-id='" + nextid + "']").length;
        var isfinal =  $(".Survey").find("[data-id='" + (nextid + 1) + "']").length;

        console.log(nextid);

        if(!isNaN(nextid) && isnextavail != 0) {
            $('.Survey').find('.form-group').removeClass('active');
            $(".Survey").find("[data-id='" + nextid + "']").addClass('active');
        }

        if((nextid - 1) == 0){
            $("#prev").addClass("hide");
        }

        if(isfinal != 0){
            $("#next").removeClass("hide");
            $("#finish").addClass("hide");
        }
    });

    $(".Survey-yesno li").hover(function () {
        $(this).toggleClass("pre-selected");
    });

    $(".Survey-yesno li").click(function(e){
        $(".Survey-yesno li").removeClass("selected");
        $(this).addClass("selected");
    });

    $(".Survey-list-rating li").click(function(e){
        $(".Survey-list-rating li").removeClass("selected");
        $(this).addClass("selected");
    });

    $(".Survey-multi-select li").click(function(e){
        $(this).toggleClass("selected");
    });

    $(".Survey-thumb span").click(function(e){
        $(".Survey-thumb span").removeClass("selected");
        $(this).addClass("selected");
    });

    $(".Survey-img li").click(function(e){
        $(".Survey-img li").removeClass("selected");
        $(this).addClass("selected");
    });

    $(".Survey-star-rating li").hover(function(e){
        var id = $(this).data("id");
        for(var i = 1; i <= id; i++){
            var ratingid = "#rating"+i;
            $(ratingid).toggleClass("hovered");
        }
    });

    $(".Survey-star-rating li").click(function(e){
        $(".Survey-star-rating li").removeClass("selected");
        var id = $(this).data("id");
        for(var i = 1; i <= id; i++){
            var ratingid = "#rating"+i;
            $(ratingid).addClass("selected");
        }
    });

    $(".yncontainer").click(function(e){
        $(".yncontainer").removeClass("selected");
        $(this).addClass("selected");
    })
});