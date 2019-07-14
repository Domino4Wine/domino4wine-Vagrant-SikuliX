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
type("Administrator")
if exists("1556313514305.png"):
    doubleClick("1556313514305.png")
if exists("1555966358181.png", 0.5):
    click("1555966358181.png")
sleep(15)   
if exists("1556313561110.png", 0.5):
    click("1556313561110.png")
keyDown(Key.ALT)
type("h")
type("a")
keyUp(Key.ALT)
sleep(1)
if exists("1556313667799.png", 0.5):
    type(Key.ENTER)
    keyDown(Key.ALT)
    type("f")
    type("x")
    keyUp(Key.ALT)
    

