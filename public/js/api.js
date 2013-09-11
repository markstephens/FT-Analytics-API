/*global $*/
(function ($) {
    "use strict";

    function process_ijento(data) {

        return {
            title: $('results', data).attr('report'),
            columns: $('results column-data *', data).map(function () { return $(this).attr('label'); }).get()
        };
    }

    $('#api_title').on('keyup blur', function () {
        $('#api_url').val($(this).val().replace(/[^\w\/]+/g, '-').replace(/-\/-/g, '/').toLowerCase());
    });

    $('#grab_api_url').on('click', function () {
        var val = $('#api_dataUrl').val();

        $.ajax({
            url: '?url=' + encodeURIComponent(val),
            method: 'get',
            success : function (data) {
                // iJento XML doc
                if ($('results column-data', data).length > 0) {
                    var api = process_ijento(data);

                    if ($('#api_title').val() === "") {
                        $('#api_title').val(api.title).blur();
                    }

                    if ($('#api_description').val() === "") {
                        $('#api_description').val(api.title);
                    }

                    $('#api_columns').html('');
                    $.each(api.columns, function (i, label) {
                        $('#api_columns').append(['<li>', label, '</li>'].join(''));
                    });
                }
            }
        });
    });

}($));
