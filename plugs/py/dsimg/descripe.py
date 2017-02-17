#!/usr/bin/env python
# coding:utf-8

import cv2
import os
import numpy as np


#颜色描述
class Descripe:
    def __init__(self,file, level):
        if type(file) is str:
            self.img = resize(file)
        else:
            self.img = file
        # self.img = cv2.resize(self.img, (8, 8))
        self.level = level
        self.bins = (8, 12, 3)

    def grayInfo(self):
        hsv = cv2.cvtColor(self.img, cv2.COLOR_BGR2GRAY)
        features = []
        masks = self.slices(hsv)
        for m in masks:
            hist = self.ghist(hsv, m)
            features.extend(hist)
        return features

    def colorInfo(self):
        hsv = cv2.cvtColor(self.img, cv2.COLOR_BGR2HSV)
        features = []
        masks = self.slices(hsv)
        # for m in masks:
        #     hist = self.chist(hsv, m)
        #     features.extend(hist)

        features.extend(self.chist(hsv, None))
        return features

    def ghist(self, image, mask):
        hist = cv2.calcHist([image], [0], mask, [128], [0, 256])
        hist = cv2.normalize(hist).flatten()
        return hist

    def chist(self, image, mask):
        hist = cv2.calcHist([image], [0, 1, 2], mask, self.bins, [0, 180, 0, 256, 0, 256])
        hist = cv2.normalize(hist).flatten()
        return hist

    def slices(self, img):
        rinfo = []
        (h, w) = img.shape[:2]
        ellipse = np.zeros(img.shape[:2], dtype='uint8')
        (cX, cY) = (int(w * 0.5), int(h * 0.5))
        (axesX, axesY) = (int(w * 0.75) / 2, int(h * 0.75) / 2)
        cv2.ellipse(ellipse, (cX, cY), (axesX, axesY), 0, 0, 360, 255, -1)
        rinfo.append(ellipse)
        segments = [(0, cX, 0, cY), (cX, w, 0, cY), (cX, w, cY, h), (0, cX, cY, h)]
        for (startX, endX, startY, endY) in segments:
            cornerMask = np.zeros(img.shape[:2], dtype="uint8")
            cv2.rectangle(cornerMask, (startX, startY), (endX, endY), 255, -1)
            cornerMask = cv2.subtract(cornerMask, ellipse)
            rinfo.append(cornerMask)
        return rinfo


# 形状描述
class GraphDescripe:
    def __init__(self,level):
        self.level = level
        pass

    def graph(self, fn):
        img = resize(file)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        tholod = 60
        can = cv2.Canny(img, tholod, tholod*3)
        can = cv2.resize(can, (8, 8))
        can = cv2.normalize(can).flatten()
        return can


"""颜色直方图"""
def drawhist(img, color=[(255, 0, 0), (0, 255, 0), (0, 0, 255)],mask=None):
    h = np.zeros((256, 256, 3))  # 创建用于绘制直方图的全0图像
    bins = np.arange(256).reshape(256, 1)  # 直方图中各bin的顶点位置
    for ch, col in enumerate(color):
        originHist = cv2.calcHist([img], [ch], mask, [256], [0, 256])
        cv2.normalize(originHist, originHist, 0, 255 * 0.9, cv2.NORM_MINMAX)
        hist = np.int32(np.around(originHist))
        pts = np.column_stack((bins, hist))
        cv2.polylines(h, [pts], False, col)
    h = np.flipud(h)
    return h


def normalize(dst):
    va = np.mean(dst)
    re = [1 if i > va else 0 for i in dst]
    return re


def homodist(m, n, eps=1e-10):
    d = 0.5 * np.sum([((a - b) ** 2) / (a + b + eps)
                      for (a, b) in zip(m, n)])
    # nm = np.array(m)-np.array(n)
    # return abs(np.sum(nm))

    return d


def resize(file):
    img = cv2.imread(file)

    h, w = img.shape[:2]
    mm = max(h, w)
    if mm>256:
        scale = 256.0/mm
        w = int(w*scale)
        h = int(h*scale)
        img = cv2.resize(img, (w, h))
    return img


