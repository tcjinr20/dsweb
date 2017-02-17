#!/usr/bin/env python
# coding:utf-8
import pymongo
from setting import mongodb as config

conn = pymongo.MongoClient(config['host'], config['port'])
status = conn.blog.spystatustable
