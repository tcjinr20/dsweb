#!/usr/bin/env python
# coding:utf-8

from dsNet import dsNet
from dsParse import dsParse
from dsResult import dsRes
import threading


class dsSpy(threading.Thread):
    status = 1

    def __init__(self, url, domain=''):
        threading.Thread.__init__(self)
        self.domain = domain
        self.item = dsItem(url)
        self.net = dsNet(self)
        self.par = dsParse(self)
        self.res = dsRes(self)

    def run(self):
        if self.item.status == 1:
            self.net.load(self.item)
        if self.item.status == 1:
            self.par.parse(self.item)
        if self.item.status == 1:
            self.res.res(self.item)

    def exit(self):
        self.status = 0
        pass


class dsItem:
    def __init__(self, url):
        self.url = url
        self.status = 1
