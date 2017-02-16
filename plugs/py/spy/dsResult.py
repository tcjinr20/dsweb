#!/usr/bin/env python
# coding:utf-8

from redisdb import DBlist, DBset, DBhash
import time, os, threading
import os.path as path
import urllib
import dssetting as config
import functions as fun


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

        DownThread(mms).run()

        return item


class DownThread(threading.Thread):
    def __init__(self, arg):
        super(DownThread, self).__init__()  # 注意：一定要显式的调用父类的初始化函数。
        self.arg = arg
        self.netfile = DBhash('netfile')
        self.fold = time.strftime('%Y-%m-%d', time.localtime(time.time()))
        self.downloadfold = ff = path.join(config.download, self.fold)
        if not path.exists(ff):
            os.makedirs(ff)

    def run(self):
        for m in self.arg:
            if fun.isImage(m):
                pp = path.realpath(path.join(self.downloadfold, path.basename(m)))
                try:
                    urllib.urlretrieve(m, pp)
                except:
                    continue
                self.netfile.addK(pp, m)


