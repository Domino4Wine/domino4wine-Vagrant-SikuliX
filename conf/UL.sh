#!/bin/bash
while getopts u:i: option
do
case "${option}"
in
u) USERNAME=${OPTARG};;
i) IDLEMAX=${OPTARG};;
esac
done
X11USERS=$(ls -l /tmp/.X11-unix | grep ${USERNAME} | awk '{print $9}')
[ ! -z $X11USERS ] && EXISTS=1 || EXISTS=0 || exit 1
SID=$X11USERS && SID=$(echo $SID | cut -d "X" -f 2 ) && SID=":${SID}"
[ $EXISTS -eq 1 ] && ( 
    USERIDLE=$(export DISPLAY=$SID && sudo -u $USERNAME xprintidle) && [ ! $USERIDLE -lt $IDLEMAX ] && (
         GUSERS=$(loginctl list-sessions | grep -v vagrant | grep -v gdm | grep -v SESSION | grep -v "sessions listed"  | grep -v ^[[:space:]]*$ | grep $USERNAME  | awk '{print $1}');
         loginctl terminate-session ${GUSERS};
         echo "Session Terminated after idletime of: $USERIDLE";) ||  echo $USERIDLE )  ||  echo "$USERNAME is not Logged in."
