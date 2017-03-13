#!/usr/bin/env python
# coding:utf-8
import urllib2
import log

class dsNet:
    def __init__(self, par):
        self.spy = par

    def load(self, item):
        try:
            f = urllib2.urlopen(item.url)
        except Exception, e:
            log.error(item.url+e.message)
            item.status = 0
            return item
        item.body = f.read()
        return item
