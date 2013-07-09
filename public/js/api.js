/*global $*/
(function ($) {

    $('#api_title').on('keyup blur', function () {
        $('#api_url').val($(this).val().replace(/[^\w\/]+/g, '-').replace(/-\/-/g, '/').toLowerCase());
    });

    $('#grab_api_url').on('click', function () {
        var val = $('#api_dataUrl').val();

        $.ajax({
            url: '?url=' + encodeURIComponent(val),
            method: 'get',
            success : function (data) {
                console.log(data);
            }
        });
    });

}($));
