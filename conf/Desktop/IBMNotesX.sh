#/bin/bash
/opt/cxoffice/bin/wine --bottle Notes10Demo --check --wait-children --start "C:/users/crossover/Start Menu/Programs/IBM Applications/IBM Notes.lnk" 
#Now we wait for an exit code
#User has exited, run logout.sh
#Check if Administrator is open
/usr/share/applications/logout.sh
# whoami run asnible script
