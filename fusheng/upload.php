<?php

require_once 'hi/servlet.php';
require_once 'hi/route.php';

class upload implements \hi\servlet {

    public function handler(\hi\request $req, \hi\response $res) {
        $app = \hi\route::get_instance();

        $app->add('{^/upload/?$}', array('POST'), function ($rq, $rs, &$param) {
            $rs->headers['Content-Type'] = 'application/json;charset=utf-8';
            $data = array('err' => 1);
            if (array_key_exists('upload', $rq->form)) {
                $temp_path = $rq->form['upload'];
                $basename = basename($temp_path);
                if (file_exists($temp_path)) {
                    $upload_path = 'html/public_html/assets/upload/' . $basename;
                    if (rename($temp_path, $upload_path)) {
                        $data['err'] = 0;
                        $data['upload_path'] = 'assets/upload/' . $basename;
                    } else {
                        unlink($temp_path);
                    }
                }
            }
            $rs->content = json_encode($data);
            $rs->status = 200;
        });

        $app->run($req, $res);
    }

}
