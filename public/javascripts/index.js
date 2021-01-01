jQuery(function ($) {
    $('.game').on('click', function (event) {
        var target = $(event.target);
        if(target.is('div'))
            target = target.children().eq(1);
        else if(target.is('img'))
            target = target.next();
        window.location.href ='http://localhost:3000/' + target[0].innerText.toLowerCase() + '-list'
    })
})