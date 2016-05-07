function overlay(content){
    
    $('#overlayGutter').remove();
    
    var gutter = $('<div/>').attr({
        id: 'overlayGutter'
    }).click(function(){
        closeOverlay();
    });
    
    var overlay = $('<div/>').attr({
        id: 'overlay'    
    }).appendTo(gutter);
    
    gutter.appendTo('body');
    
    var content = $('<div/>').attr({
        id: 'overlayContent'    
    }).html(content).appendTo(overlay);
    
    gutter.appendTo('body');

    $(document).keypress(function(e){
        if (e.keyCode == 27){
            closeOverlay();
        }
    });

    $(overlay).on('click', function(event){
        event.stopPropagation();
        closeOverlay();
    });


    $(overlayContent).on('click', function(event){
        event.stopPropagation();
    });
}

function closeOverlay(){
    $('#overlayGutter').remove();
    
    $(document).unbind('keypress');
}
    
    
