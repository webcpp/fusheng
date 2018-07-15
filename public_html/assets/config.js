$(function () {
    $('a[title]').tooltip();

    var quill = new Quill('#editor-container', {
        modules: {
            formula: true,
            syntax: true,
            toolbar: '#toolbar-container'
        },
        placeholder: 'To be a good man!',
        theme: 'snow'
    });

    var toast = new PomeloToast();

    $.getJSON('http://ip-api.com/json/?callback=?', function (result) {
        var user_name = prompt("请输入您的名字", "小蝶");
        if (user_name == null) {
            user_name = '小蝶';
        }
        var address = result.country + '/' + result.regionName + '/' + result.city + '/' + result.query + '/' + user_name;

        function add_msg(str) {
            var data = {};
            var tmp = str.split("\r\n");
            var n = 0;
            for (var i = 0; i < tmp.length; ++i) {
                var cur = tmp[i];
                var pos = cur.indexOf(": ");
                if (pos != -1) {
                    var k = cur.substr(0, pos), v = cur.substr(pos + 2, cur.length - 2 - pos);
                    if (k == 'name') {
                        data.name = v;
                        ++n;
                    } else if (k == 'message') {
                        data.message = v;
                        ++n;
                    } else if (k == 'room') {
                        data.room = v;
                        ++n;
                    }
                }
                if (n == 3) {
                    break;
                }
            }
            if (typeof data.name == 'undefined' || typeof data.message == 'undefined') {
                data.name = '无名氏';
                data.message = str;
            }
            if (data.name.indexOf(address) == -1) {
                p = 'left';
            } else {
                p = 'right';
            }
            var msg = $('<div class="text-' + p + ' fusheng panel panel-default"></div>').append("<div class='panel-body'><span>"
                    + data.name + "</span>" + ' said:<br>' + '<p>' + (data.message) + '</p></div>');
            var cur_id = $('#myTab li.active a').attr('data-original-title');
            if (typeof data.room == 'undefined') {
                data.room = cur_id;
            }
            var id = data.room;
            $('#' + id).append(msg);
            $('.tab-content').animate({scrollTop: $('.tab-pane').height()}, 30);
            $('pre code').each(function (i, block) {
                hljs.highlightBlock(block);
            });
            if (cur_id !== id) {
                toast.show({

                    // 'error', 'warning', 'success'
                    // 'white', 'blue'
                    type: 'success',

                    // toast message
                    text: id + '有新消息',

                    // default: 3000
                    time: 3000 // 5 seconds

                });
            }
        }

        var ws = new ReconnectingWebSocket('ws://127.0.0.1:9999/');
//        var ws = new WebSocket('ws://127.0.0.1:9999/');

        ws.onopen = function ()
        {
            var data = '';
            data = data.concat("name: ").concat(address).concat("\r\n").concat("message: ").concat('connected.\r\n');
            add_msg(data);
        };

        ws.onmessage = function (evt)
        {
            add_msg(evt.data);

        };

        ws.onclose = function (evt)
        {

        };

        ws.onerror = function (evt) {
            toast.show({

                // 'error', 'warning', 'success'
                // 'white', 'blue'
                type: 'error',

                // toast message
                text: 'error',

                // default: 3000
                time: 3000 // 5 seconds

            });
        }

        var filter_reg = new RegExp('<([a-zA-Z])+.*/?>(.*</([a-zA-Z])+>)?', 'gi');

        $('#submit').click(function () {
//            var str = $.trim($("#editor")[0].value).replace(filter_reg, '');
            var str = quill.root.innerHTML;
            if (str.length > 204800) {
                alert('Too long.');
            } else if (str.length > 0) {
                var data = '';
                data = data.concat("uid: 0\r\n")
                        .concat("gid: 0\r\n")
                        .concat("ufilter: \r\n")
                        .concat("gfilter: \r\n")
                        .concat("message: ").concat(str).concat("\r\n")
                        .concat("name: ").concat(address).concat("\r\n")
                        .concat("room: ").concat($('#myTab li.active a').attr('data-original-title')).concat('\r\n');

                ws.send(data);
            } else {
                alert('error message format.');
            }
        });
    });


});


