#!/usr/bin/env python
# coding:utf-8

from redisdb import DBhash
netfile = DBhash('netfile')
print netfile.getPart(0)