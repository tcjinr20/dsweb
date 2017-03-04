#!/usr/bin/env python
# coding:utf-8
from redisdb import DBset


class dsRequest:
    def __init__(self, domain):
        self.status =1
        self.domain = domain
        self.count = 0
        self.initdb()

    def next(self):
        if len(self.urls) > 0:
            return self.urls.pop()
        else:
            self.initdb()
            if len(self.urls) > 0:
                return self.urls.pop()
            self.status = 0

    def initdb(self):
        ug = DBset(self.domain + ":ready").getPart(self.count)
        self.urls = ug[1]
        self.count = ug[0]
        if len(self.urls) < 1:
            if self.domain.count('http') ==0:
                self.urls.append("http://" + self.domain)
            else:
                self.urls.append(self.domain)

