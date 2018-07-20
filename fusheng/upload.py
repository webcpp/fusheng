#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
import os.path


def upload(req, res):
    res.header('Content-Type', 'application/json;charset=utf-8')
    data = {'err':1}
    if req.method() == 'POST':
        if req.has_form('upload'):
            temp_path = req.get_form('upload')
            basename = os.path.basename(temp_path)
            if os.path.exists(temp_path):
                upload_path = 'html/public_html/assets/upload/' + basename
                os.rename(temp_path, upload_path)
                data['upload_path'] = 'assets/upload/' + basename
                data['err'] = 0
                #os.unlink(upload_path)
    res.content(json.dumps(data))
    res.status(200)

if __name__ == "__main__":
    upload(hi_req, hi_res)
