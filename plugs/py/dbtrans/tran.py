#!/usr/bin/env python
# coding:utf-8

from monodb import conn
from spy.redisdb import DBhash

class RedisToMongo:

    def __init__(self):
        self.fileinfo = DBhash("dsimg:fileinfo")
        self.classfy = DBhash('dsimg:classfy')
        self.files = conn.blog.fileinfotable
        self.claes = conn.blog.classfytable

    def trans(self):
        self.copyCla()
        self.copyFile()

    def copyFile(self, count=0):
        (count, identy) = self.fileinfo.getPart(count)
        for cc in identy.keys():
            self.files.insert(eval(identy[cc]))
        if count != 0:
            self.copyFile(count)
        else:
            self.fileinfo.delAll()

    def copyCla(self, count=0):
        (count, identy) = self.classfy.getPart(count)
        for cc in identy.keys():
            self.claes.insert({'identity': eval(identy[cc]), 'key': cc})
        if count != 0:
            self.copyCla(count)
        else:
            self.fileinfo.delAll()

if __name__ == "__main__":
    RedisToMongo().trans()