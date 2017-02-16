#!/usr/bin/env python
# coding:utf-8
import urllib2
from redisdb import DBlist, DBset, DBhash

class dsNet:

    def __init__(self, par):
        self.spy = par

    def load(self, item):
        try:
            f = urllib2.urlopen(item.url)
        except Exception, e :
            print item.url , Exception,e
            item.status = 0
            return item
        # print f.getcode()
        # print f.info()
        # print f.geturl()
        # print f.read()
        item.body = f.read()
        return item
