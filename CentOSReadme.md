## Here are the Order of Operations for any verison of CentOS 7 and higher in order to get this project up and running:

### 1) yum -y install gcc dkms make qt libgomp patch kernel-headers kernel-devel binutils glibc-headers glibc-devel font-forge

### 2) cd /etc/yum.repo.d/ && wget http://download.virtualbox.org/virtualbox/rpm/rhel/virtualbox.repo

### 3) yum install -y VirtualBox-5.1

### 4) /sbin/rcvboxdrv setup

### 5) yum -y install https://releases.hashicorp.com/vagrant/1.9.6/vagrant_1.9.6_x86_64.rpm

### 6) yum install git

### 7) git clone https://github.com/prominic/domino4wine-Vagrant-SikuliX.git

### 8) navigate to the project directory, by default this is: domino4wine-Vagrant-SikuliX

### 9) Edit the Hosts.yml with your favorite Text Editor

### 10) Download if you do not already have the base install files and fixpack and hot fixes:

Register for a Trial: https://www.ibm.com/account/reg/us-en/signup?formid=urx-33713

Or if You obtained a file from HCL, example filenames such as:
- notes1001FP2_standard_win.exe   is a Fix Pack, this would go into the FP folder
- NOTESDOMD_A_V10.0.1_FOR_WIN_EN.exe   is a Base installer, this would go into the Base Folder

### 11) Place the Notes 10 base installer executable into the Projects AppInstall Folder under base:

##### "projectFolder" is just a placeholder for the folder you saved the git project to.

projectFolder/conf/AppInstall/ND10/base/

### 12) Place the Notes Fix Pack installer executable into the Projects AppInstall/ND10 Folder under FP:

##### "projectFolder" is just a placeholder for the folder you saved the git project to.

projectFolder/conf/AppInstall/ND10/FP/

### 13) Place the Notes Fix Pack installer executable into the Projects AppInstall Folder under FP:

##### "projectFolder" is just a placeholder for the folder you saved the git project to.

projectFolder/conf/AppInstall/ND10/HF/

### 14) vagrant up

### 15) Navigate to http://IP.IN.HOST.YML:8080

### 16) Right Click on "DominoNotesBottle" and select Build

### 17) Once the Builds have completed, RDP into VM to IP.IN.HOST.YML 

### 18) Login to XRDP with vagrant vagrant

### 19) Notes Should be installed
