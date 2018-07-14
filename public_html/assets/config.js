$(function () {
    $('a[title]').tooltip();

    $.getJSON('http://ip-api.com/json/?callback=?', function (result) {

        var user_name = prompt("请输入您的名字", "小蝶");
        if (user_name == null) {
            user_name = '小蝶';
        }
        var address = result.country + '/' + result.regionName + '/' + result.city + '/' + result.query + '/' + user_name;

        function add_msg(str, p) {
            try {
                var data = JSON.parse(str);
                var msg = $('<div class="text-' + p + ' fusheng rcorners"></div>').append("<span>" + data.name + "</span>" + ' said:<br>' + '<p>' + data.message + '</p>');
                var id = $('#myTab li.active a').attr('data-original-title');
                $('#' + id).append(msg);
                $('.tab-content').animate({scrollTop: $('.tab-pane').height()}, 30);
            } catch (err) {
                console.log('server:' + str + '\nclient:' + err);
            }
        }

        var ws = new ReconnectingWebSocket('ws://127.0.0.1:9999');

        ws.onopen = function ()
        {
            var data = {name: address, message: 'connected.'};
            add_msg(JSON.stringify(data), 'right');
        };

        ws.onmessage = function (evt)
        {
            if (evt.data.indexOf(address) == -1) {
                add_msg(evt.data, 'left');
            } else {
                add_msg(evt.data, 'right');
            }

        };

        ws.onclose = function ()
        {
        };



        var filter_reg = new RegExp('<([a-zA-Z])+.*/?>(.*</([a-zA-Z])+>)?', 'gi');

        $('#submit').click(function () {
            var str = $.trim($("#editor")[0].value).replace(filter_reg, '');
            if (str.length > 140) {
                alert('Too long.');
            } else if (str.length > 0) {
                var data = {};
                data.gid = 0;
                data.uid = 0;
                data.gfilter = [];
                data.ufilter = [];
                data.name = address;
                data.message = str;
                var json = JSON.stringify(data);
                ws.send(json);
            } else {
                alert('error message format.');
            }
        });
    });


});


