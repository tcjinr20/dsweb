#!/usr/bin/env python
# coding:utf-8

import os
import sys
from getopt import getopt
from analysis import AnalysisByDB, AnalysisByFold, Classfy
from monodb import status
import threading


def check():
    if app and app.status == 0:
        status.update({'status': 'analysis'}, {'$set': {'running': 0}})
        return
    sta = status.find({'status': 'analysis'}).next()
    if sta['running'] == 0:
        if app:
            app.stop()

    threading.Timer(2, check).start()

if __name__ == '__main__':
    opt, arg = getopt(sys.argv[1:], 'sdf:')
    opt = dict(opt)

    threading.Timer(2, check).start()

    app = None
    if opt.get('-s') is not None:
        app = Classfy()
        app.run()
    elif opt.get('-d') is not None:
        app = AnalysisByDB()
        app.run()
    elif opt.get('-f') is not None:
        path = os.path
        pp = path.join(opt.get('-f'))
        app = AnalysisByFold()
        app.run(pp)
    else:
        print "wrong argreents"




