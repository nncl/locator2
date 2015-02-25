openMenu = function() {
    $('.open-menu').click(function(){

        $('.open-menu').removeClass('active');
        $('.menu').animate({
            width: 'hide'
        },200 );

        $(this).addClass('active');

        $(this).next('.menu').animate({
            width: 'hide'
        },200 );

        if ($(this).next('.menu').is(':visible')) {
            
            $(this).next('.menu').animate({
                width: 'hide'
            },200 );

            $('.open-menu').removeClass('active');
        }

        else { 
                $(this).next('.menu').animate({
                    width: 'toggle',
                    speed: 'slow',
                    easing: 'linear'
                },200 );
        };
        
    });
};

$(document).ready(function(){
    openMenu();
});
