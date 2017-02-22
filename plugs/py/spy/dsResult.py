#!/usr/bin/env python
# coding:utf-8

import os
import os.path as path
import threading
import time
import urllib

import functions as fun
import setting as config
from redisdb import DBset, DBhash


class dsRes:
    def __init__(self, par):
        self.spy = par
        self.ready = DBset(self.spy.domain + ":ready")
        self.packing = DBset(self.spy.domain + ":packing")
        self.other = DBset(self.spy.domain+':other')
        self.imgs = DBset(self.spy.domain+':imgs')

    def res(self, item):
        self.ready.removeK(item.url)
        if item.status == 0:
            return item

        for h in item.hrefs:
            if self.packing.addK(h):
                self.ready.addK(h)

        for o in item.other:
            self.other.addK(o)
        mms = []
        for m in item.imgs:
            if self.imgs.addK(m) == 1:
                mms.append(m)

        DownThread(mms,item.url).run()

        return item


class DownThread(threading.Thread):
    def __init__(self, arg,url):
        super(DownThread, self).__init__()  # 注意：一定要显式的调用父类的初始化函数。
        self.arg = arg
        self.url = url
        self.netfile = DBhash('netfile')
        self.urlfile = DBhash('urlfile')
        self.fold = time.strftime('%Y-%m-%d', time.localtime(time.time()))
        self.downloadfold = ff = path.join(config.download, self.fold)
        if not path.exists(ff):
            os.makedirs(ff)

    def run(self):
        for m in self.arg:
            if fun.isImage(m):
                pp = path.join(self.downloadfold, path.basename(m))
                try:
                    urllib.urlretrieve(m, pp)
                except:
                    continue
                self.netfile.addK(pp, m)
                self.urlfile.addK(pp,self.url)


