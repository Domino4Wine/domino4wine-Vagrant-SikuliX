#!/usr/bin/env bash
##Make it to where if they pass -i (ip address) -g (gateway) -n (netmask)  -c (skip check for updates/install) -d (DHCP) -v (display gui) -b (download applicable branches)
while getopts "i:n:g:c:b:d:v:" opt; do
    case $opt in
        i ) Static_IP=$OPTARG
        ;;
        n ) Netmask=$OPTARG
        ;;
        g ) Gateway=$OPTARG
        ;;
        c ) check=$OPTARG
        ;;
        b ) branch=$OPTARG
        ;;
        d ) DHCP=$OPTARG
        ;;
        v ) gui=$OPTARG
        ;;
    esac
done
##git ls-remote --heads https://github.com/prominic/domino4wine-Vagrant-SikuliX.git
##Added so that we can get the Branches available and present as an option if no parameter specified
##create switch statement based on this
scheck=$check
## Check if Mac or Ubuntu or Centos
if [ -f /etc/os-release ]; then
    # freedesktop.org and systemd
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
elif type lsb_release >/dev/null 2>&1; then
    # linuxbase.org
    OS=$(lsb_release -si)
    VER=$(lsb_release -sr)
elif [ -f /etc/lsb-release ]; then
    # For some versions of Debian/Ubuntu without lsb_release command
    . /etc/lsb-release
    OS=$DISTRIB_ID
    VER=$DISTRIB_RELEASE
elif [ -f /etc/debian_version ]; then
    # Older Debian/Ubuntu/etc.
    OS=Debian
    VER=$(cat /etc/debian_version)
else
    # Fall back to uname, e.g. "Linux <version>", also works for BSD, etc.
    OS=$(uname -s)
    VER=$(uname -r)
fi

##Check if Pre-Requesites are installed
if ! [ -x "$(command -v git)" ]; then
  echo 'Error: git is not installed.' >&2
  sgit=false
  exit 1
fi
if ! [ -x "$(command -v VBoxManage)" ]; then
  echo 'Error: VirtualBox is not installed.' >&2
  exit 1
  svbox=false
fi
if ! [ -x "$(command -v vagrant)" ]; then
  echo 'Error: vagrant is not installed.' >&2
  exit 1
  svagrant=false
fi

if [[ $svagrant = false || $svbox = false || $sgit = false || $scheck = false  ]]; then
 install;
fi

function install () { 
       ## If the OS detected is supported, Darwin, Ubuntu and CentOS, and the Pre-Requsites need to be installed do:
       if [ OS == "Darwin" ]; then
           echo "Mac OS X platform: $(uname)"
           /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
           brew cask install virtualbox 
           brew cask install vagrant
           brew cask install vagrant-manager
           brew install git
       elif [ OS == "CentOS Linux" ]; then
           echo "Linux platform: $(uname) $(OS)"
           yum -y install gcc dkms make qt libgomp patch kernel-headers kernel-devel binutils glibc-headers glibc-devel font-forge
           cd /etc/yum.repo.d/ || return
           wget http://download.virtualbox.org/virtualbox/rpm/rhel/virtualbox.repo
           yum install -y VirtualBox-5.1
           /sbin/rcvboxdrv setup
           yum -y install https://releases.hashicorp.com/vagrant/1.9.6/vagrant_1.9.6_x86_64.rpm
           sudo yum install git
       elif [ OS == "Ubuntu" ]; then
           echo "Linux platform: $(uname) $(OS)"
             sudo apt-get install virtualbox vagrant git-core -y 
       fi
}


function StaticIP () {
##SetStaticIP
sipsan="192.168.2.97"
snetmasksan="255.255.255.0"
sgatewaysan="192.168.2.1"
if [ -z "$Static_IP" ];
then
    echo "example: sh MacandLinux.sh 192.168.1.111 255.255.255.0 192.168.2.1"
    read -p "Please enter the Static IP $sipsan: " ipsan
else
    ipsan=$Static_IP
fi
if [ -z "$ipsan" ];
then
    ipsan=$sipsan
fi

if [ -z "$Netmask" ];
then
    read -p "Please enter the Netmask $snetmasksan: "  netmasksan
else
    netmasksan=$Netmask
fi
if [ -z "$netmasksan" ];
then
    netmasksan=$snetmasksan
fi

if [ -z "$Gateway" ];
then
    read  -p "Please enter the Gateway IP $sgatewaysan: " gatewaysan
else
    gatewaysan=$Gateway
fi
if [ -z "$gatewaysan" ];
then
    gatewaysan=$sgatewaysan
fi
}
if [  -z "$DHCP" ];
then
    StaticIP;
elif [ "$DHCP" == "false" ];
then
    StaticIP;
fi
if [ -z "$branch" ];
then
    git clone https://github.com/prominic/domino4wine-Vagrant-SikuliX.git
    cd domino4wine-Vagrant-SikuliX
    vagrant plugin install vagrant-disksize
    vagrant plugin install vagrant-reload
    vagrant up --provision-with ansible_local,reload
else
    git clone https://github.com/prominic/domino4wine-Vagrant-SikuliX.git
    git clone -b $branch https://github.com/prominic/domino4wine-Vagrant-SikuliX.git $branch
    /bin/cp -rf $branch/* domino4wine-Vagrant-SikuliX/
    rm -rf $branch
    vagrant plugin install vagrant-disksize
    vagrant plugin install vagrant-reload
    cd domino4wine-Vagrant-SikuliX
    vagrant up --provision-with ansible_local,reload
fi
