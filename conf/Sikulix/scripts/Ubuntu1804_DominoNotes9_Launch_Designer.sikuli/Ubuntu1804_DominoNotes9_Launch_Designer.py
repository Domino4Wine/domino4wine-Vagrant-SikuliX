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
type("Designer")
if exists("1556312923260.png"):
    doubleClick("1556312923260.png")
if exists("1555966358181.png", 0.5):
    click("1555966358181.png")
sleep(25)   
if exists("1556313000211.png", 0.5):
    click("1556313000211.png")
keyDown(Key.ALT)
type("h")
type(Key.END)
type(Key.ENTER)
keyUp(Key.ALT)
sleep(1)
if exists(Pattern("1556313018593.png").similar(0.98), 0.5):
    type(Key.ENTER)
    keyDown(Key.ALT)
    type("f")
    type("x")
    keyUp(Key.ALT)
    

