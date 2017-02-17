#!/usr/bin/env python
# coding:utf-8

from dsNet import dsNet
from dsParse import dsParse
from dsRequest import dsRequest
from dsResult import dsRes


class dsImg:
    status = 1

    def __init__(self, dm, pro='http://'):
        if dm.startswith('http'):
            raise

        self.domain = dm
        self.protocol = pro
        self.db = dsRequest(self)
        self.net = dsNet(self)
        self.par = dsParse(self)
        self.res = dsRes(self)

    def getDomain(self):
        return self.protocol+self.domain

    def run(self):
        i = dsItem()
        i.url = self.db.next()
        if i.url is None:
            return None
        if self.net.load(i) is None:
            return None
        if self.par.parse(i) is None:
            return None
        if self.res.res(i) is None:
            return None
        return 1

    def exit(self):
        self.status = 0
        pass

class dsItem:
    status = 1
    pass