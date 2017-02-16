#!/usr/bin/env python
# coding:utf-8
from monodb import status


class dsEngine:

    dss = list()
    status = 1

    def start(self):
        while self.status != 0:
            self._run()

        for d in self.dss:
            d.exit()
        self.exit()

    def _run(self):
        stopds = []
        for d in self.dss:
            bool = d.run()
            if bool is None:
                stopds.append(d)
        # 移除停止的蜘蛛
        if len(stopds) > 0:
            for s in stopds:
                s.exit()
                self.dss.remove(s)

        if len(self.dss) == 0:
            self.stop()

    def add(self, ds):
        self.dss.append(ds)

    def stop(self, reason=''):
        self.status = 0
        pass

    def exit(self):
        status.update({'status':'spy'},{'$set':{'running':0}})
        print 'close'
        import sys
        sys.exit(0)

