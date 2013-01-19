$('#submitbutton').click(function(){
	console.log("clicked upload");
    var formData = new FormData($('form')[0]);
    var $ret = 0;
    $.ajax({
        url: 'http://developer.echonest.com/api/v4/track/upload',  //server script to process data
        type: 'POST',
        data: formData,
        //Options to tell JQuery not to process data or worry about content-type
        cache: false,
        contentType: false,
        processData: false,

        success: function(data) {
        	saveEchoNest(data);
        },

        //Ajax events
        /*
        beforeSend: beforeSendHandler,
        success: completeHandler,
        error: errorHandler,
        */
    });
    return $ret;
});

function saveEchoNest(data) {
    console.log("saving");
}