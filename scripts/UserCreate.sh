#!/bin/bash
SESSIONHOST=("d4w1.prominic.net")
HPATH=("/Array-0/hosts")
while [ -n "$1" ]; do # while loop starts
    case "$1" in
    -h)
        param="$2"
        SESSIONHOST=($param)   # -h is for Session Hosts
        shift
        ;;
    -u)
        param="$2"
        USERNAME=($param) # -u is for Session Host Client Username
        shift
        ;;
    -p)
        param="$2"
        USERPASS=($param)  # -p is for Session Host Client Password
        shift
        ;;
    -i)
        param="$2"
        UserIDFilePath=($param)  # -i is for Session Host Client User ID File Path
        shift
        ;;
    -d)
        param="$2"
        HPATH=($param) # -d is for Host Directory Session Host Datastores are located
        shift
        ;;
    -k)  # -k is for Session Host Script User Login Key
        param="$2"
        SSHKEY=($param)
        shift
        ;;
    -n)  # -n is for Notes 10 Setup.txt scriptable Installation Users Domino User Name  ie "Mark Gilbert"
        param="$2"
        NAME=($param)
        shift
        ;;
    -s)
        param="$2"
        DOMINOSERVER=($param) # -s is for Notes 10 Setup.txt scriptable Installation Domino Server Selection
        shift
        ;;

    --)
        shift
        break
        ;;
    *) echo "Option $1 not recognized" ;;
    esac
    shift
done
SCRIPT="ansible-playbook /vagrant/ansible/playbook.yml -e 'dominoserver=${DOMINOSERVER} realusername=\"${NAME[0]} ${NAME[1]}\" user=${USERNAME[i]} userid=/vagrant/user-data/user.id userpass=${USERPASS[i]}'"
for i in ${!SESSIONHOST[*]} ; do
      SHPATH=("/$HPATH/${SESSIONHOST[i]}/domino4wine-Vagrant-SikuliX")
      SSHKEY=("${SHPATH}/.vagrant/machines/domino4wine/virtualbox/private_key")
      if [ -f ${UserIDFilePath[i]} ];
      then
         mv ${UserIDFilePath[i]} /Array-0/hosts/${SESSIONHOST[i]}/domino4wine-Vagrant-SikuliX/conf/user-data/user.id;
      else
         echo "No user.id in directory specified, using the last known good one in Vagrant Shared Folder";
      fi
      ssh  -i ${SSHKEY[i]} vagrant\@${SESSIONHOST[i]} "${SCRIPT}"
done

