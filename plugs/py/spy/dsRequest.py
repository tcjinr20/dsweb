#!/usr/bin/env python
# coding:utf-8
from redisdb import DBset


class dsRequest:
    def __init__(self, par):
        self.spy = par
        self.count = 0
        self.initdb()

    def next(self):
        if len(self.urls) > 0:
            return self.urls.pop()
        else:
            self.initdb()
            if len(self.urls) > 0:
                return self.urls.pop()
            return None

    def initdb(self):
        ug = DBset(self.spy.domain + ":ready").getPart(self.count)
        self.urls = ug[1]
        self.count = ug[0]
        if len(self.urls) < 1:
            if self.spy.domain.count('http') ==0:
                self.urls.append("http://" + self.spy.domain)
            else:
                self.urls.append(self.spy.domain)

