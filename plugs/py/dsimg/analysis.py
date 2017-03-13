#!/usr/bin/env python
# coding:utf-8

import shutil
import time
from glob import glob

import descripe as desc
import functions as fun
import setting as config
from descripe import *
from monodb import conn
from redisdb import DBhash

'''抓取的全部图片'''
netfile = DBhash('netfile')
'''临时记录每张图片的指纹，在分类时删除'''
classing = DBhash("dsimg:classing")
'''记录所有合格的图片数据'''
fileinfo = DBhash("dsimg:fileinfo")
'''图片来源'''
urlfile = DBhash('urlfile')
'''备份'''
backup = DBhash('backup')
"""最终的分类结果"""
classfy = DBhash('dsimg:classfy')

clafy = conn.blog.classfytable
'''mongo的图片信息'''
monfile = conn.blog.fileinfotable
'''每张图片的指纹（指纹有多种）'''
identity = conn.blog.identitytable
'''数值统计'''
ana = conn.blog.analysis


class AnalysisByDB:
    count = 0
    status = 1

    def start(self):
        self.run()
        while self.count != 0 and self.status == 1:
            self.run()
        Classfy().run()
        self.stop()

    def run(self):
        fp = netfile.getPart(self.count)
        self.count = fp[0]
        self.checkfeture(fp[1])

    def checkfeture(self, fmap):
        for (k, v) in fmap.items():
            info = dealfile(k)
            if info:
                info['url'] = v
                info['sourceurl']=urlfile.getK(k)
                classing.addK(info['name'], info['identity'])
                identity.insert_one({'f': info['name'], 'c': info['identity']})
                del info['identity']
                fileinfo.addK(info['name'], info)
                monfile.insert_one(info)

            backup.addK(netfile.getK(k),urlfile.getK(k))
            netfile.delK(k)
            urlfile.delK(k)

    def stop(self):
        self.status = 0


class AnalysisByFold:
    status = 1

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
                    fileinfo.addK(info['loc'], info)
        Classfy().run()
        self.stop()

    def stop(self):
        print 'stop'
        self.status = 0


class Classfy:
    status = 0

    '''单文件分类，找到分类返回None, 没有找到返回元数据'''
    def loop(self, clas, ik):
        ikv = eval(classing.getK(ik))
        classing.delK(ik)
        for ic in clas:
            icv = eval(classfy.getK(ic))
            dist = desc.homodist(ikv, icv)
            if dist < config.homodis:
                info = eval(fileinfo.getK(ik))
                if info.has_key('classfy') is False:
                    info['classfy'] = []
                info['classfy'].append(ic)
                if fileinfo.addK(ik, info) ==1:
                    monfile.insert(info)
                    ana.insert({'type':'file','num':1})
                else:
                    monfile.find_and_modify({'name':ik},{'$push': {'classfy':ic}})
                    ana.find_and_modify({"type": 'file'}, [], {"$inc": {'num': 1}})


                return None, None
        return ik, ikv

    """计算指纹并分类"""
    def run(self):
        clas = classfy.getALLKey()
        ides = classing.getALLKey()
        while len(ides) > 0:
            ik, ikv = self.loop(clas, ides.pop(0))
            if ik:
                if classfy.addK(ik, ikv) == 1:
                    clafy.insert({'classfy':ik,'identity':ikv})
                    ana.find_and_modify({"type":'class'}, [], {"$inc":{'num':1}})
                    monfile.find_and_modify({'name': ik}, {'$push': {'classfy': ik}})
                clas.append(ik)

    def stop(self):
        self.status = 0


class Search:
    '''颜色c,形状s,布局g 对应identity字段'''
    checkfun = ('c', 's', 'g')
    status = 0

    def __init__(self, le):
        self.level = le
        # self.file = conn.blog.fileinfotable

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

    def findSmilar(self, tar, cla, check=0):
        rback = []
        count = 0

        for fd in file.find({'classfy': {'$all':[cla]}}):
            rs = identity.find_one({'f': fd['name']})
            if rs is not None:
                dis = homodist(tar, rs[self.checkfun[check]])
                if dis < config.homodis:
                    rback.append((dis, fd))
                count += 1
                if count > config.limit:
                    break
        return rback

    def findCla(self, tar, pg=0, limit=1000):
        count = clafy.count()
        page = pg
        result = {}
        while page * limit < count:
            course = clafy.find().skip(page * limit).limit(limit)
            for uu in course:
                nor = uu['identity']
                dis = homodist(nor, tar)
                if dis < config.homodis:
                    result[dis] = uu['classfy']
            page += 1
        return result

    def stop(self):
        self.status = 0

'''分析图片并生成图片数据'''
def dealfile(file):
    img = cv2.imread(file)
    if img is None:
        return None
    mh, mw = img.shape[:2]
    '''过滤小图片'''
    if mh < config.imgw or mw < config.imgw:
        return None

    # 移动文件
    mdate = time.strftime('%Y-%m-%d', time.localtime(time.time()))
    urlfold = os.path.join(config.urlfold, mdate)
    copyfold = os.path.join(config.copyfold, urlfold)
    if os.path.exists(copyfold) is False:
        os.makedirs(copyfold)

    basename = os.path.basename(file).rsplit('.', 1)
    localtime = str((time.time()*1000).as_integer_ratio()[0])
    newfilename = localtime + '.' + basename[1]
    newfile = os.path.join(copyfold, newfilename)
    shutil.copy2(file, newfile)
    os.remove(file)
    des = desc.Descripe(img, 2)
    fle = {}
    fle['size'] = img.size
    fle['type'] = basename[1]
    fle['name'] = localtime
    fle['loc'] = os.path.join(urlfold, newfilename)
    fle['width'], fle['height'] =mw, mh
    fle['identity'] =eval(str(des.colorInfo()))
    return fle
