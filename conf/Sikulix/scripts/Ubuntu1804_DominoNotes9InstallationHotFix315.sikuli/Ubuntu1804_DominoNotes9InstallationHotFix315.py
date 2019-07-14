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
cntr = 0 
while setupConfig == False and cntr < 5:
    cntr = cntr + 1
    click("1555945115941.png")
    click("1555945148654.png")
    if exists("1555945176737.png"):
        if exists("1555945199155.png", 0.5):
            click("1555945199155.png")
            if exists("1555945220301.png", 0.5):
                click("1555945220301.png")
                click("1555945241668.png")
                click("1555945292497.png")
                if exists("1555962141405.png"):
                    click(Pattern("1555962141405.png").targetOffset(0,17))
                    type("vagrant")
                    if exists("1555962207736.png"):
                        click("1555962207736.png")
                        if exists("1555945513312.png"):
                            click("1555945513312.png")
                            if exists("1555945546079.png"):
                                click("1555945546079.png")
                                if exists("1556275994102-2.png"):
                                    click("1556275994102-2.png")
                                    if exists("1555945546079-3.png"):
                                        click("1555945546079-3.png")
                                        if exists("1556276030471-2.png"):
                                            click("1556276030471-2.png")
                                            if exists("1555945546079-3.png"):
                                                click("1555945546079-3.png")
                                                if exists("1556281784227.png"):
                                                    click("1556281784227.png")
                                                    click("1555952506135-3.png")
                                                    if exists("1556276334515-2.png"):
                                                        click(Pattern("1556276334515-2.png").targetOffset(-2,12))
                                                        click("1555952506135-1.png")
                                                        if exists("1555962578848-1.png", 0.5):
                                                            if exists("1555962549884-1.png", 0.5):
                                                                click("1555962549884-1.png")
                                                                if exists("1555841975754-1.png", 0.5):
                                                                    click("1555841975754-1.png")
                                                                    sleep(2)
                                                                    type("Notes")
                                                                    sleep(3)
                                                                    type(Key.DOWN)
                                                                    type(Key.ENTER)
                                                                    setupConfig = True
cntr = 0       
cntr1 = 0                                                               
while finalConfig == False and cntr < 10:  
    cntr = cntr + 1
    if exists("1555964566981-1.png", 0.5):
        click("1555964566981-1.png")
        if exists("1555963791866-1.png", 0.5):
            if exists("1555963836444-1.png", 0.5):
                click("1555963836444-1.png")
                sleep(5)
                # Installation of Notes Application
                if exists("1555966358181-1.png", 0.5):
                    click("1555966358181-1.png")
                    sleep(8)
                if exists("1556280641885.png"):
                    sleep(120)
                if exists ("1555956093762-1.png",0.5):
                    click("1555956093762-1.png")
                    sleep(120)
                if exists("1555956093762-1.png",0.5):
                    click("1555956093762-1.png")
                    while licenseNotes == False and cntr1 < 5:
                        cntr1 = cntr1 + 1
                        if exists (Pattern("1555946502227-1.png").similar(0.82),0.5):
                            click(Pattern("1555946502227-1.png").similar(0.76));
                            type("a" + KEY_ALT)
                        if  exists ("1556090206050-1.png",0.5):
                            licenseNotes == True
                    if exists ("1555946399933-1.png",0.5):
                        click("1555946399933-1.png")  
                        if exists ("1555946399933-1.png",0.5):
                            click("1555946399933-1.png")
                            type(KEY_ALT + "i")
                            sleep(130)      
                            if exists("1555958861159-2.png", 1):
                                click("1555958861159-2.png") 
                                sleep(20)
                            if exists(Pattern("1555848367704-2.png").similar(0.80), 1):
                                click(Pattern("1555848391359-2.png").exact().targetOffset(25,-37))
                                sleep(10)
                            if exists("1555848885259-3.png", 1):
                                click("1555848885259-3.png")    
                                finalconfig = True