import unittest
import os
import sys
import logging
import traceback
from xmlrunner import *
from sikuli import *
keyDown(KEY_WIN)
type("IBM Notes")
if exists("1556309958917.png"):
    doubleClick("1556309958917.png")
    