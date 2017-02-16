#!/usr/bin/env python
# coding:utf-8
import redis
from dssetting import redisdb as config

db = redis.StrictRedis(host=config['host'], port=config['port'], password=config['password'])


class DBres:
    def __getattr__(self, attr):
        global db
        return getattr(db, attr, 'unfind')

    def unfind(self, *arg):
        print 'can not find function'

class DBlist:
    def __init__(self, name):
        self.name = name

    def addK(self, value):
        db.lpush(self.name, value)


class DBset:
    def __init__(self, name):
        self.name = name

    def addK(self, value):
        return db.sadd(self.name, value)

    def removeK(self, keys):
        return db.srem(self.name,keys)

    def getALL(self):
        return db.smembers(self.name)

    def getPart(self, count=0, page=1000):
        return db.sscan(self.name, count, None, page)

class DBhash:
    def __init__(self, name):
        self.name = name

    def addK(self, key, value):
        return db.hset(self.name, **{'key': key, 'value': value})

    def hasK(self, key):
       return db.hexists(self.name,key)

    def getPart(self, count=0, page=10000):
        return db.hscan(self.name, count, None,page)

    def getALLKey(self):
        return db.hkeys(self.name)

    def getK(self, key):
        return db.hget(self.name, key)

    def set(self,map):
        db.hmset(self.name, map)

    def delAll(self):
        db.delete(self.name)

    def delK(self, key):
        db.hdel(self.name, key)

    def getAllVal(self):
        return db.hvals(self.name)

"""
ready爬下来的 url，准备下次的图片爬取
packing 已经爬取过的url
other 爬取过程中不是本域名下的url
netfile 下载完成后的图片数据，便于图片数据分析
"""
def DB(domain):
    return DBset(domain + ":ready"), DBset(domain + ":packing"), DBset(domain+':other'),DBhash('netfile')
