import unittest
import os
import sys
import logging
import traceback
from xmlrunner import *
from sikuli import *
#def doInstall():
installFound = False
updateFound = False 
bottleConfig = False
depInstalls = False
cntr = 0
##Check if Crossover is Running, if it is, start the Process, else start Crossover from the Start menu/Application menu
while installFound == False and cntr < 5:
    cntr = cntr + 1
    if exists("1555842843141.png", 0.5):
        click("1555842843141.png")
        installFound = True
    else:
        if exists("1555842843141.png"):
            click("1555842843141.png")
            installFound = True
        else:
            if exists("1555842843141.png"):
                click("1555842843141.png")
                installFound = True
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
    if exists("1555842843141.png", 0.5):
        click("1555842843141.png")
        installFound = True
    else:
        if exists("1555842843141.png"):
            click("1555842843141.png")
            installFound = True
        else:
            if exists("1555842843141.png"):
                click("1555842843141.png")
                installFound = True
if exists("1555841861430.png", 4):
    click("1555841861430.png")
    setAutoWaitTimeout(30)
while bottleConfig == False and cntr < 5:
    cntr = cntr + 1
    click("1555841975754.png")
    sleep(2)
    type("Notes")
    sleep(3)
    type(Key.DOWN)
    type(Key.ENTER)
    if exists("1555842036458.png", 0.5):
      click("1555842036458.png")
##  Screen is very large here for some reason
    x1, y1, x2, y2 = (700, 50, 50, 50)
    start = Location(x1, y1)
    end = Location(x2, y2)
    stepX = 10 # adjust this as needed
    stepY = int((y2-y1)/((x2-x1)/stepX))
    run = start
    mouseMove(start); wait(0.5)
    mouseDown(Button.LEFT); wait(0.5)
    while run.getX() < end.getX():
       run = run.right(stepX).below(stepY) # use below instead of down
       mouseMove(run)
    mouseMove(end)
    mouseUp()
    if exists("1555842098103.png", 1):
        click("1555842098103.png")
    sleep(5)
    bottleConfig = True
setAutoWaitTimeout(20)
#### Prompts
##Prompt For Licensing
alldeps  = 0
while depInstalls == False or alldeps < 9:
        if exists("1555681312444.png", 0.5):
            click("1555681312444.png")
            alldeps = alldeps + 1
         
##Georgia Font Family
        if exists("1555681422910.png", 0.5):
            click("1555681422910.png")
            alldeps = alldeps + 1

          
#Internet Explorer
        if exists("1555846226935.png",0.5):
            if exists("1555681823763.png",0.5):
                click("1555681823763.png")
            if exists("1555681843954.png", 0.5):
                click("1555681843954.png")
            if exists("1555681861622.png", 0.5):
                click("1555681861622.png")
                sleep(1)
            if exists("1555846271464.png", 0.5):
                click("1555846271464.png")
                alldeps = alldeps + 1
          
##Microsoft XML Parser
        if exists("1555681552384.png", 0.5):
            click("1555681552384.png")
        if exists("1555852946000-1.png", 0.5):
             click("1555852946000-1.png")
             type(Key.DOWN)
             type(Key.UP)
        if exists("1555843792681.png", 0.5):
            click("1555843792681.png")
            click("1555843792681.png")
            if exists("1555848198394.png", 0.5):
                click("1555848198394.png")
        if exists("1555681765819.png", 0.5):
            click("1555681765819.png")
            alldeps = alldeps + 1
##Adobe
        if exists("1555845945785-1.png",1):
            if exists("1555847156929-1.png", 1):
                click("1555676650012-2.png",1)
                click(Pattern("1555847198157-1.png").similar(0.50),5)
            if exists(Pattern("1555848135521-1.png").targetOffset(-5,0), 0.5):
                click(Pattern("1555848135521-1.png").targetOffset(-5,0))
                alldeps = alldeps + 1
     

##Firefox     
        if exists("1555846165374.png",0.5):
            if exists("1555682073568-1.png", 0.5):
                click("1555682073568-1.png")
            if exists("1555682073568-1.png", 0.5):
                click("1555682073568-1.png")
            if exists("1555848254209.png", 0.5):
                click("1555848254209.png")
            if exists("1555683657892.png", 0.5):
                click(Pattern("1555683657892.png").targetOffset(-50,0))
            if exists("1555682208079-1.png", 0.5):
                click("1555682208079-1.png")
                alldeps = alldeps + 1
    
##C+++ Restart
        if exists("1555846115396.png", 1):
          click("1555682251947.png")
          alldeps = alldeps + 1
          depInstalls == True
          sleep(12)
##Close Firefox
if exists("1560019000906.png", 1):
    click("1560019000906.png")
    click("1560019033216.png")
    if exists("1555848885259.png", 1):
        click("1555848885259.png")    


class UnitTestA(unittest.TestCase):
    def testRunScript(self):
        self.assertTrue(True, "Empty success test")
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