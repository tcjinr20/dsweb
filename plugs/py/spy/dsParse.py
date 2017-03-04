#!/usr/bin/env python
# coding:utf-8
from lxml import etree

class dsParse:

    def __init__(self, par):
        self.spy = par

    def parse(self, item):
        if item.status == 0:
            return item
        page = etree.HTML(item.body)
        hrefs = page.xpath(u"//a")
        hs = set()
        oh = set()
        ms = set()
        for href in hrefs:
            if 'href' in href.attrib:
                ul = href.attrib['href']
                if self.isImgURL(ul):
                    ms.add(self.fullurl(ul))
                    continue
                if not self.badURL(ul):
                    if self.indoamin(ul):
                        hs.add(self.fullurl(ul))
                    else:
                        oh.add(ul)

        imgs = page.xpath(u'//img[@src]')

        for m in imgs:
            if 'src' in m.attrib:
                ul = m.attrib['src']
                if self.isImgURL(ul) and not self.badURL(ul):
                    ms.add(self.fullurl(ul))

        item.imgs =ms
        item.hrefs = hs
        item.other = oh
        return item

    def indoamin(self, url):
        return url.startswith('/') or url.startswith('http://'+self.spy.domain) or url.startswith('https://'+self.spy.domain)

    def isImgURL(self, url):
        for s in ['.png', '.jpeg', '.jpg']:
            if (url.startswith('http') or url.startswith('https')) and url.endswith(s):
                return True
        return False

    def badURL(self, url):
        return url.find('javascript') != -1 or url.count('http') > 1 or url.count("#") > 0 or url == '/' or url == self.spy.domain

    def fullurl(self, url):
        if url.startswith('/'):
            url = self.spy.domain+url
        if url.count('http') == 0:
            url = "http://"+url
        return url

