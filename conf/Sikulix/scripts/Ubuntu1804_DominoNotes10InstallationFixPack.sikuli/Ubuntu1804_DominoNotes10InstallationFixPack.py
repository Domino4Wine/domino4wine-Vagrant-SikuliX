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
        keyDown(Key.ALT)
        type(Key.F1)
        keyUp(Key.ALT)
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
                                if exists("1556275994102.png"):
                                    click("1556275994102.png")
                                    if exists("1555945546079.png"):
                                        click("1555945546079.png")
                                        if exists("1556283717146.png"):
                                            click("1556283717146.png")
                                            if exists("1555945546079.png"):
                                                click("1555945546079.png")
                                                if exists("1556284859893.png"):
                                                    click("1556284859893.png")
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
                                                                     type("Notes")
                                                                     sleep(3)
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