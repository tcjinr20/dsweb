#!/usr/bin/env python
# coding:utf-8

import shutil
import time
import urllib
from glob import glob
import cv2
from monodb import conn
# from pymongo import MongoClient
import  sys
"""递归限制解除"""
# sys.setrecursionlimit(1000000)
import descripe as desc
import dssetting as config
import functions as fun
from descripe import *
from spy.redisdb import DBhash
import shutil


# conn = MongoClient('127.0.0.1', 27017)


class AnalysisByDB:
    count = 0
    netfile = DBhash('netfile')
    classing = DBhash("dsimg:classing")
    fileinfo = DBhash("dsimg:fileinfo")
    files = conn.blog.fileinfotable
    claes = conn.blog.classfytable
    status = 1

    def run(self):
        fp = self.netfile.getPart(self.count)
        self.count = fp[0]
        self.checkfeture(fp[1])

    def checkfeture(self, fmap):
        for (k, v) in fmap.items():
            info = dealfile(k)
            if info:
                info['url'] = v
                self.classing.addK(info['name'], info['identity'])
                self.fileinfo.addK(info['name'], info)
            self.netfile.delK(k)

        if self.count != 0 and self.status == 1:
            return self.run()
        else:
            """完成指纹提取，进入指纹分类"""
            Classfy().run()
            self.stop()

    def stop(self):
        self.status = 0


class AnalysisByFold:
    status = 1
    classing = DBhash("dsimg:classing")
    fileinfo = DBhash("dsimg:fileinfo")

    def run(self, fold):
        if not os.path.isdir(fold):
            print u'找不到文件夹'+os.path.realpath(fold)
            return
        fold = os.path.realpath(fold)
        self.checkfeture(glob(fold+"/*.*"))

    def checkfeture(self, files):
        if len(files) <= 0:
            print u'文件夹没有图片'
            return

        for fie in files:
            if fun.isImage(fie):
                info = dealfile(fie)
                if info:
                    self.fileinfo.addK(info['loc'], info)
        Classfy().run()
        self.stop()

    def stop(self):
        print 'stop'
        self.status = 0


class Classfy:
    status = 0
    fileinfo = DBhash("dsimg:fileinfo")

    def __init__(self):
        """分类结果"""
        self.classfy = DBhash('dsimg:classfy')
        """待分类临时数据"""
        self.classing = DBhash('dsimg:classing')

    def loop(self, clas, ik):
        ikv = eval(self.classing.getK(ik))
        self.classing.delK(ik)
        for ic in clas:
            icv = eval(self.classfy.getK(ic))
            dist = desc.homodist(ikv, icv)
            if dist < config.homodis:
                info = eval(self.fileinfo.getK(ik))
                if info.has_key('classfy') is False:
                    info['classfy'] = []
                info['classfy'].append(ic)
                self.fileinfo.addK(ik, info)
                return None, None
        return ik, ikv

    """计算指纹并分类"""
    def run(self):
        clas = self.classfy.getALLKey()
        ides = self.classing.getALLKey()
        while len(ides) > 0:
            ik, ikv = self.loop(clas, ides.pop(0))
            if ik:
                self.classfy.addK(ik, ikv)
                clas.append(ik)

    def stop(self):
        self.status = 0


class Search:

    status = 0

    def __init__(self, le):
        self.level = le
        self.file = conn.blog.fileinfotable
        self.clafy = conn.blog.classfytable

    def search(self, qimg, limit=10):
        ff = Descripe(qimg, 2)
        nor = ff.colorInfo()
        res = self.findCla(nor)
        rback = []
        for key in sorted(res.keys()):
            rr = self.findSmilar(nor, res[key])
            rback.extend(rr)
        rback.sort()
        rrback =[]
        for k, v in rback[0:10]:
            o ={}
            for kk in v.keys():
                o[str(kk)] = str(v[kk])
            rrback.append(o)
        """url 中可能包含汉字所以返回unicode字符串"""
        return rrback

    def findSmilar(self, tar, cla):
        rback = []
        count = 0
        for fd in self.file.find({'classfy': {'$all':[cla]}}):
            print fd
            dis = homodist(tar, fd['identity'])
            if dis < config.homodis:
                rback.append((dis, fd))
            count += 1
            if count > config.limit:
                break
        return rback

    def findCla(self, tar, pg=0, limit=1000):
        count = self.clafy.count()
        page = pg
        result = {}
        while page * limit < count:
            course = self.clafy.find().skip(page * limit).limit(limit)
            for uu in course:
                nor = uu['identity']
                dis = homodist(nor, tar)
                if dis < config.homodis:
                    result[dis] = uu['key']
            page += 1
        return result

    def stop(self):
        self.status = 0


def dealfile(file):
    img = cv2.imread(file)
    if img is None:
        return None
    mh, mw = img.shape[:2]
    if mh < config.imgw or mw < config.imgw:
        return None
    # 移动文件
    basename = os.path.basename(file).rsplit('.', 1)
    rname = str(time.time())
    newf = rname + '.' + basename[1]
    newf = os.path.join(config.copypath, newf)
    shutil.copy2(file, newf)
    os.remove(file)
    des = desc.Descripe(newf, 2)
    # 生成指纹
    # self.identify.addK(basename[0], des.colorInfo())
    # 生成文件信息
    fle = {}
    fle['size'] = os.path.getsize(newf)
    fle['type'] = basename[1]
    fle['name'] = rname
    fle['loc'] = newf
    fle['width'], fle['height'] =mw,mh
    fle['identity'] = des.colorInfo()
    return fle
