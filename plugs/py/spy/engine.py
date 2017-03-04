#!/usr/bin/env python
# coding:utf-8
from monodb import status
import threading
import psutil
from dsRequest import dsRequest
from dsSpy import dsSpy


class dsEngine:
    dss = list()
    status = 1

    def start(self):
        while self.status != 0:
            for d in self.dss:
                dsSpy(d.next(), d.domain).run()
                if d.status == 0:
                    self.delReq(d)

    def add(self, ds):
        self.dss.append(dsRequest(ds))

    def delReq(self, req):
        self.dss.remove(req)

    def stop(self, reason=''):
        self.status = 0
        pass

    def exit(self):
        status.update({'status':'spy'},{'$set':{'running':0}})
        print 'close'
        import sys
        sys.exit(0)

    def performance(self):
        psutil.virtual_memory().percent
        psutil.cpu_percent(0)

