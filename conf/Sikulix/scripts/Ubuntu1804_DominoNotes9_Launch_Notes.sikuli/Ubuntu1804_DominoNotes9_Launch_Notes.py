import unittest
import os
import sys
import logging
import traceback
from xmlrunner import *
from sikuli import *
keyDown(Key.ALT)
type(Key.F1)
keyUp(Key.ALT)
type("IBM Notes")
if exists("1556309958917.png"):
    doubleClick("1556309958917.png")
    sleep(25)
if exists("1555966358181-1.png", 0.5):
    click("1555966358181-1.png")
if exists("1556312051714.png", 0.5):
    click("1556312051714.png")
keyDown(Key.ALT)
type("h")
type("a")
keyUp(Key.ALT)
if exists("1556312589456.png", 0.5):
    type(Key.ENTER)
    keyDown(Key.ALT)
    type("f")
    type("x")
    keyUp(Key.ALT)
    

