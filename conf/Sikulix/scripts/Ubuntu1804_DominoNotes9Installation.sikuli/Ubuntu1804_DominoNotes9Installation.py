import unittest
import os
import sys
import logging
import traceback
from xmlrunner import *
from sikuli import *
installFound = False
updateFound = False 
setupConfig = False
notesInstall = False
licenseNotes = False
finalConfig  = False
notesBottle  = False
cntr = 0
try:
    jbuild = sys.argv[1]
except IndexError:
    jbuild = 'null'
Settings.UserLogs = True
Settings.UserLogTime = True
Settings.InfoLogs = True
Debug.user("Jenkins Build: " + jbuild )
setShowActions(True)
##Check if Crossover is Running, if it is, start the Process, else start Crossover from the Start menu/Application menu
while installFound == False and cntr < 5:
        if installFound == False:
            if exists("1555640491324.png", 1):
              click("1555640491324.png")
              sleep(5)
            else:
                if exists("1555673527872.png",0.5):
                    click("1555673527872.png")
            if exists("1555673780356.png"):
                click("1555673780356.png")
            type("Crossover")
            if exists("1555674013636.png"):
                doubleClick("1555674013636.png")
            cntr = cntr + 1    
            if exists("1555842843141.png", 0.5):
                installFound = True
cntr = 0 
while notesBottle == False and cntr < 5:    
        if exists("1559159350610.png", 0.5):
            click("1559195009233.png")
        if exists(Pattern("1559195033775.png").similar(0.73), 0.5):
            click(Pattern("1559195033775.png").targetOffset(-10,6))
            rightClick("1559195424938.png")
            sleep(1)
            type(Key.DOWN)
            type(Key.ENTER)
            click("1559157136006.png")
            sleep(2)
            type("Base")
            type(Key.ENTER)
            sleep(20)
            notesBottle = False
        cntr = cntr + 1 
            
cntr = 0 
while setupConfig == False and cntr < 5:
    cntr = cntr + 1
    click("1555842843141.png")
    click("1555945115941.png")
    click("1559157315163.png")
    if exists("1559157339318.png"):
        if exists("1555945199155.png", 0.5):
            click("1555945199155.png")
            if exists("1555945220301.png", 0.5):
                click("1555945220301.png")
                click("1555945241668.png")
                click("1555945292497.png")
                if exists("1555962141405.png"):
                    click(Pattern("1555962141405.png").targetOffset(0,17))
                    type("vagrant")
                    if exists(Pattern("1555962207736.png").exact()):
                        click("1555962207736.png")
                    if exists("1555945513312.png"):
                        click("1555945513312.png")
                        if exists("1555945546079.png"):
                            click("1555945546079.png")
                            if exists("1556275994102.png"):
                                click("1556275994102.png")
                                if exists("1555945546079.png"):
                                    click("1555945546079.png")
                                    if exists("1556276030471.png"):
                                        click("1556276030471.png")
                                        if exists("1555945546079.png"):
                                            click("1555945546079.png")
                                            if exists("1556276072739.png"):
                                                click("1556276072739.png")
                                                click("1555952506135.png")
                                                if exists("1556276334515.png"):
                                                    click(Pattern("1556276334515.png").targetOffset(-2,12))
                                                    click("1555952506135.png")
                                                    if exists("1555962578848.png", 0.5):
                                                         if exists("1555962549884.png", 0.5):
                                                             click("1555962549884.png")
                                                             if exists("1555841975754.png", 0.5):
                                                                 click("1555841975754.png")
                                                                 sleep(2)
                                                                 type("Unlisted")
                                                                 sleep(2)
                                                                 type(Key.DOWN)
                                                                 type(Key.ENTER)
                                                                 setupConfig = True

cntr = 0       
cntr1 = 0                                                               
while finalConfig == False and cntr < 10:  
    cntr = cntr + 1
    if exists("1555964566981.png", 0.5):
        click("1555964566981.png")
        if exists("1555963791866.png", 0.5):
            if exists("1555963836444.png", 0.5):
                click("1555963836444.png")
                sleep(5)
                # Installation of Notes Application
                if exists("1555966358181.png", 0.5):
                    click("1555966358181.png")
                    sleep(8)
                if exists("1556089772488.png"):
                    sleep(5)
                if exists ("1555956093762.png",0.5):
                    click("1555956093762.png")
                    sleep(180)
                if exists ("1555956093762.png",0.5):
                    click("1555956093762.png")
                    while licenseNotes == False and cntr1 < 5:
                        cntr1 = cntr1 + 1
                        if exists ("1555946502227.png",0.5):
                            click("1555946502227.png");
                            type("a", KEY_ALT)
                        if  exists ("1556090206050.png",0.5):
                            licenseNotes == True
                    if exists ("1555946399933.png",0.5):
                        click("1555946399933.png")  
                        if exists ("1555946399933.png",0.5):
                            click("1555946399933.png")
                            if exists ("1555956851368-1.png",0.5):
                                click(Pattern("1555956851368-1.png").targetOffset(-74,0))
                                type(Key.DOWN)
                                type(Key.ENTER)
                            if exists ("1555957663947-1.png",0.5):
                                if exists (Pattern("1555957005849-1.png").similar(0.83),0.5):
                                    click(Pattern("1555957005849-1.png").similar(0.83).targetOffset(-45,0))
                                    type(Key.DOWN)
                                    type(Key.ENTER)
                                    if exists ("1555957663947-1.png",0.5):
                                        if exists ("1555946399933.png",0.5):
                                            click("1555946399933.png") 
                                        if exists ("1555958532863-1.png",0.5):
                                            click("1555958532863-1.png") 
                                            sleep(360) 
                                        if exists("1555958861159-1.png", 1):
                                            click("1555958861159-1.png") 
                                            sleep(20)
                                        if exists(Pattern("1555848367704.png").similar(0.80), 1):
                                            click(Pattern("1555848391359.png").exact().targetOffset(25,-37))
                                            sleep(10)
                                            if exists("1555848885259-1.png", 1):
                                                click("1555848885259-1.png")
                                                finalconfig = True
class UnitTestA(unittest.TestCase):
    def testRunScript(self):
        self.assertTrue(True, "Empty succcess test")
        doInstall()
        try:
            doInstall()
            
        except Exception as e:
            self.assertTrue(False, str(e))
            popup(str(e))
    #def tearDown(self):
    #    popup("tearing things down")

tests = unittest.TestLoader().loadTestsFromTestCase(UnitTestA)
testResult = XMLTestRunner(file("unittest.xml", "w")).run(tests)
