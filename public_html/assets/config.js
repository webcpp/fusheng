$(function () {
    $('a[title]').tooltip();

    var quill = new Quill('#editor-container', {
        modules: {
            formula: true,
            syntax: true,
            toolbar: '#toolbar-container'
        },
        placeholder: 'To be a good man! The best brower is Chrome.',
        theme: 'snow',
    });
    var toolbar = quill.getModule('toolbar');
    toolbar.addHandler('image', function (e) {
        document.getElementById('get_file').click();
    });

    $('#get_file').change(function () {
        var upload_form = $('#upload_form');
        var options = {
            url: '/upload',
            type: 'post',
            success: function (ret) {
                if (ret.err == 0) {
                    var range = quill.getSelection();
                    quill.insertEmbed(range.index, 'image', ret.upload_path);
                    $('#get_file').val('');
                } else {
                    toast.show({

                        // 'error', 'warning', 'success'
                        // 'white', 'blue'
                        type: 'error',

                        // toast message
                        text: 'upload error',

                        // default: 3000
                        time: 3000 // 5 seconds

                    });
                }
            },
            error: function () {
                toast.show({
                    type: 'error', text: 'upload error or too big.', time: 3000
                });
            }

        }
        upload_form.ajaxSubmit(options);

    });

    var toast = new PomeloToast();

    $.getJSON('http://ip-api.com/json/?callback=?', function (result) {
        var user_name = prompt("请输入您的名字", "小蝶");
        if (user_name == null) {
            user_name = '小蝶';
        }
        var address = result.country + '/' + result.regionName + '/' + result.city + '/' + user_name;

        function add_msg(data) {

            if (typeof data.name == 'undefined'
                    || typeof data.message == 'undefined'
                    || typeof data.time == 'undefined'
                    || typeof data.room == 'undefined') {
                return;
            }
            var p = 'left';
            var msg = $('<div class="text-' + p + ' fusheng panel panel-default"></div>').append("<div class='panel-body'><p><span>"
                    + (data.name) + "</span>" + '</p><br><p class="text-muted">' + (data.message)
                    + '</p><br/><p><span class="pull-right">' + (data.time) + '</span></p><br/><p><span class="pull-right">' + result.query + '</span></p></div>');
            msg.find("a").filter(function () {
                return this.href.match(/\.(jpg|jpeg|png|gif)$/);
            }).addClass('lightzoom');
            msg.find("img").addClass("img-responsive").addClass("img-rounded");



            var id = (data.room);
            $('#' + id).append(msg);
            $('.lightzoom').lightzoom();
            renderMathInElement(document.body);
            $('.tab-content').animate({scrollTop: $('.tab-pane').height()}, 80);
            $('pre code').each(function (i, block) {
                hljs.highlightBlock(block);
            });

            var cur_id = $('#myTab li.active a').attr('data-original-title');
            if (cur_id != id) {
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
            var data = {};
            data.name = (address);
            data.message = ('connected.');
            data.room = ($('#myTab li.active a').attr('data-original-title'));
            data.time = ((new Date()).toLocaleString());
            add_msg(data);
        };

        ws.onmessage = function (evt)
        {
//            console.log(evt.data);
            try {
                add_msg(JSON.parse(wtf8.decode(evt.data)));
            } catch (err) {
                var data = {};
                data.name = (address);
                data.message = ('recv error.');
                data.room = ($('#myTab li.active a').attr('data-original-title'));
                data.time = ((new Date()).toLocaleString());
                add_msg(data);
            }
        };

        ws.onclose = function (evt)
        {
            var data = {};
            data.name = (address);
            data.message = ('unconnected.');
            data.room = ($('#myTab li.active a').attr('data-original-title'));
            data.time = ((new Date()).toLocaleString());
            add_msg(data);
        };

        ws.onerror = function (evt) {
            console.log(evt.data);
//            toast.show({
//
//                // 'error', 'warning', 'success'
//                // 'white', 'blue'
//                type: 'error',
//
//                // toast message
//                text: 'send error or too long',
//
//                // default: 3000
//                time: 3000 // 5 seconds
//
//            });
        }

        var filter_reg = new RegExp('<([a-zA-Z])+.*/?>(.*</([a-zA-Z])+>)?', 'gi');


        $('#submit').click(function () {
            //var str = filterXSS(quill.root.innerHTML);
            var str = quill.root.innerHTML;
            var length = quill.getLength();
            if (length > 5000) {
                toast.show({

                    // 'error', 'warning', 'success'
                    // 'white', 'blue'
                    type: 'error',

                    // toast message
                    text: 'too long.At most 5000 words.',

                    // default: 3000
                    time: 3000 // 5 seconds

                });
            } else if (length >= 10 && length <= 5000) {
                var data = {};
                data.gid = 0;
                data.uid = 0;
                data.gfilter = [];
                data.ufilter = [];
                data.name = (address);
                data.message = (str);
                data.room = ($('#myTab li.active a').attr('data-original-title'));
                data.time = ((new Date()).toLocaleString());

                ws.send(wtf8.encode(JSON.stringify(data)));
            } else {
                toast.show({

                    // 'error', 'warning', 'success'
                    // 'white', 'blue'
                    type: 'error',

                    // toast message
                    text: 'too short.At least 10 words.',

                    // default: 3000
                    time: 3000 // 5 seconds

                });
            }
        });
    });


});


