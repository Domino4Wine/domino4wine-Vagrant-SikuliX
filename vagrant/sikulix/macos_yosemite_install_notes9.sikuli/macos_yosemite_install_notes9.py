installFound = False
cntr = 0
while installFound == False and cntr < 5:
    cntr = cntr + 1
    if exists("1553458688111.png", 10):
        click("1553458688111.png")
        installFound = True
    else:
        if exists("1553974194626.png"):
            click("1553974194626.png")
            installFound = True
        else:
            if exists("1554320381143.png"):
                click("1554320403022.png")
                installFound = True
    if installFound == False:
        click("1554750995962.png")
        sleep(5)
        if exists("1554751084872.png"):
            click("1554751112533.png")
        sleep(5)
        if exists("1554751147655.png"):
            doubleClick("1554751160582.png")
        if exists("1554751408013.png"):
            doubleClick("1554751424645.png")
            
setAutoWaitTimeout(30)
wait("1553726095500.png")

click("1553725850815.png")

type("Lotus Notes")
type(Key.DOWN)
type(Key.ENTER)
click("1553726129931.png")
#click("1553459043797.png")
click("1553459081290.png")
if exists("1553459230442.png"):
    click("1553459243182.png")
sleep(16)
if exists("1554318232888.png"):
    click("1554318288686.png")
else:
    if exists("1554318726236.png"):
        click("1554318726236.png")
if exists("1554830897253.png"):
    click("1554830915705.png")
else:
    if exists("1554830985248.png"):
        click("1554830999841.png")
        
click("1553806121322.png")
wait("1553806962065.png")
click("1553806962065.png")

wait("1553807980844.png")

click("1553459512295.png")
if exists("1554320276063.png"):
    click("1554320311166.png")
else:
    click("1554320246806.png")
setAutoWaitTimeout(300)
#wait for fonts install (always first)
wait("1554067949808.png")
click("1554067104423.png")

installed_count=0
while installed_count < 5:
    sleep(20)
    if exists("1553459670626.png",5):
        wait("1553459670626.png")
        click("1553459681122.png")
        wait("1553459693322.png")
        click("1553459701052.png")
        wait("1553459713981.png")
        click("1553459722998.png")
        wait("1553459740326.png")
        click("1553459748498.png")
        click("1553459759206.png")
        installed_count = 1 + installed_count
    if exists("1553459796817.png",5):
        wait("1553459796817.png")
        click("1553459806498.png")
        click("1553459817876.png")
        wait("1553459831220.png")
        sleep(5)
        if exists("1553459839606.png"):
            click("1553459839606.png")
        else:
           click("1554149470015.png")
        sleep(15)
        if exists("1554149515809.png"):
            click("1554149548861.png")
        installed_count = 1 + installed_count

    if exists("1553459859163.png",5):  
        wait("1553459859163.png")
        click("1553459866799.png")
        wait("1553459875257.png")
        click("1553459884684.png")
        click("1553459893832.png")
        wait("1553459911383.png")
        click("1553459918158.png")
        wait("1553459929517.png")
        click("1553459935667.png")
        wait("1553459946892.png")
        click("1553459953587.png")
        installed_count = 1 + installed_count

    if exists("1553459976893.png",5):
        wait("1553459976893.png")
        click("1553459984892.png")
        wait("1553459997556.png")
        click("1553460004342.png")
        wait("1553460016750.png")
        click("1553460022914.png")
        wait("1553460070106.png")
        click("1553460077704.png")
        #wait("1553460169218.png")
        #click("1553460177244.png")
        installed_count = 1 + installed_count
    if exists("1553812773324.png",5):
        click("1553812801235.png")
        installed_count = 1 + installed_count

wait("1553460218249.png")
click("1553460304194.png")
wait("1554322366534.png")
sleep(180)
wait("1554323030463.png")
click("1554323043045.png")
wait("1554323088004.png")
click("1553460490666.png")
click("1553460515217.png")
wait("1553460540750.png")
click("1553460548786.png")
#wait("1553460565342.png")
wait("1553903448880.png")

click(Pattern("1554835977896.png").targetOffset(-22,-1))
type(Key.DOWN)
type(Key.DOWN)
type(Key.ENTER)
click(Pattern("1554836441076.png").targetOffset(-57,0)
type(Key.DOWN)
type(Key.DOWN)
type(Key.ENTER)
        

click("1553460572559.png")
wait("1553460582850.png")
click("1553460594577.png")
wait("1553460659490.png", 120)
wait("1553980589624.png", 600)
click("1553460870001.png")
wait("1553460893672.png", 120)
click("1553976982369.png")
wait("1553460978486.png", 300)
click("1553461022190.png")
type("q", Key.CMD)
wait("1553978988503.png", 120)
click("1553978988503.png")
click("1553979075018.png")

