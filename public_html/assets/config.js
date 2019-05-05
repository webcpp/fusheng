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

    hljs.initHighlightingOnLoad();

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
    var user_name = prompt("请输入您的名字", "小蝶");
    if (user_name == null) {
        user_name = "小蝶";
    }
    var ip_geo = null;

    function create_response(data) {
        var p = 'left';
        var msg = $('<div class="text-' + p + ' fusheng panel panel-default"></div>').append("<div class='panel-body text-justify' style='word-wrap: break-word;' ><p><span>"
            + data.ip + '/' + data.name + ':' + "</span>" + '</p><br/>' + unescape(data.message)
            + '<p><span class="pull-right">' + (data.time) + '</span></p><br/><p><span class="pull-right">当前在线: ' + (data.u_size) + '</span></p><br/></div>');

        msg.find("img").addClass("img-responsive").addClass("img-rounded").addClass('img-thumbnail').css({ 'height': 100, 'width': 100 }).addClass('lightzoom');
        msg.find("a").filter(function () {
            return this.href.match(/\.(jpg|jpeg|png|gif)$/);
        }).addClass('lightzoom');


        var id = (data.room);
        $('#' + id).append(msg);
        $('.lightzoom').lightzoom();
        renderMathInElement(document.body);
        $('.tab-content').animate({ scrollTop: $('.tab-pane').height() }, 80);
        $('pre,code').each(function (i, block) {
            $(block).addClass('pre-scrollable')
            hljs.highlightBlock(block);
        });
        //        hljs.initHighlighting.called = false;
        //        hljs.initHighlighting();

        var cur_id = $('#myTab li.active a').attr('data-original-title');
        if (cur_id != id) {
            toast.show({

                // 'error', 'warning', 'success'
                // 'white', 'blue'
                type: 'success',

                // toast message
                text: id + '有新消息',

                // default: 3000
                time: 500 // 5 seconds

            });
        }
    }

    function add_msg(data) {

        if (typeof data.name == 'undefined'
            || typeof data.message == 'undefined'
            || typeof data.time == 'undefined'
            || typeof data.room == 'undefined') {
            return;
        }

        //create_response(data)

        if (ip_geo == null) {
            create_response(data);
            $.get('https://api.ip.sb/geoip/' + data.ip, function (ret) {
                ip_geo = ret.country + ret.region + ret.city
                data.ip = ip_geo
                // console.log(ip_geo)
                // create_response(data)
            }).fail(function () {
                // console.log('get ip_geo error')
                // create_response(data)
            })
        } else {
            data.ip = ip_geo;
            create_response(data)
        }


    }

    var ws = new ReconnectingWebSocket('wss://fusheng.hi-nginx.com/chat');
    ws.binaryType = "arraybuffer";
    //        var ws = new WebSocket('ws://127.0.0.1:9999/');

    ws.onopen = function () {
        //        var data = {};
        //        data.name = (address);
        //        data.message = ('connected.');
        //        data.room = ($('#myTab li.active a').attr('data-original-title'));
        //        data.time = ((new Date()).toLocaleString());
        //        add_msg(data);
        toast.show({

            // 'error', 'warning', 'success'
            // 'white', 'blue'
            type: 'success',

            // toast message
            text: 'connected.',

            // default: 3000
            time: 3000 // 5 seconds

        });
        $('#submit').removeClass('btn-primary').addClass('btn-success');
    };

    ws.onmessage = function (evt) {
        //            console.log(evt.data);
        try {
            var msg = JSON.parse((evt.data));
            console.log(evt.data);
            if (msg.error !== undefined) {
                toast.show({

                    // 'error', 'warning', 'success'
                    // 'white', 'blue'
                    type: 'error',

                    // toast message
                    text: msg.message,

                    // default: 3000
                    time: 3000 // 5 seconds

                });
            } else {
                add_msg(msg);
            }
        } catch (err) {
            toast.show({

                // 'error', 'warning', 'success'
                // 'white', 'blue'
                type: 'error',

                // toast message
                text: err.message,

                // default: 3000
                time: 3000 // 5 seconds

            });
        }
    };

    ws.onclose = function (evt) {
        toast.show({

            // 'error', 'warning', 'success'
            // 'white', 'blue'
            type: 'success',

            // toast message
            text: 'disconnected',

            // default: 3000
            time: 3000 // 5 seconds

        });
        console.log(evt);
        $('#submit').removeClass('btn-success').addClass('btn-primary');
    };

    ws.onerror = function (evt) {
        //        console.log(evt.data);
        toast.show({

            // 'error', 'warning', 'success'
            // 'white', 'blue'
            type: 'error',

            // toast message
            text: 'some errro happend.',

            // default: 3000
            time: 3000 // 5 seconds

        });
    }

    //    var filter_reg = new RegExp('<([a-zA-Z])+.*/?>(.*</([a-zA-Z])+>)?', 'gi');


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
            data.name = user_name;
            data.message = escape(str);
            data.room = ($('#myTab li.active a').attr('data-original-title'));
            data.time = ((new Date()).toLocaleString());

            ws.send((JSON.stringify(data)));
            quill.setText('');
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


