#!/bin/bash
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
    -d)
        param="$2"
        HPATH=($param) # -d is for Host Directory Session Host Datastores are located
        shift
        ;;
    -i)
        param="$2"
        IDLEMAX=($param) # -i IDLEMAX Time in Milliseconds
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
#SCRIPT="ansible-playbook /vagrant/ansible/UserLogoff.yml -e 'user=${USERNAME[i]}'"
SCRIPT="sudo sh /vagrant/UL.sh -i ${IDLEMAX} -u ${USERNAME}"
for i in ${!SESSIONHOST[*]} ; do
      SHPATH=("/$HPATH/${SESSIONHOST[i]}/domino4wine-Vagrant-SikuliX")
      SSHKEY=("${SHPATH}/.vagrant/machines/domino4wine/virtualbox/private_key")
      ssh  -i ${SSHKEY[i]} vagrant\@${SESSIONHOST[i]} "${SCRIPT}"
done
