## Here are the Order of Operations for Mac OS X 10.14.5 in order to get this project up and running:

### 1) /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

### 2) brew cask install virtualbox

### 3) brew cask install vagrant

### 4) brew cask install vagrant-manager

### 5) brew install git

### 6) git clone https://github.com/prominic/domino4wine-Vagrant-SikuliX.git

### 7) navigate to the project directory, by default this is: domino4wine-Vagrant-SikuliX

### 8) Edit the Hosts.yml with your favorite Text Editor

### 9) Download if you do not already have the base install files and fixpack and hot fixes:

Register for a Trial: https://www.ibm.com/account/reg/us-en/signup?formid=urx-33713

Or if You obtained a file from HCL, example filenames such as:
- notes1001FP2_standard_win.exe   is a Fix Pack, this would go into the FP folder
- NOTESDOMD_A_V10.0.1_FOR_WIN_EN.exe   is a Base installer, this would go into the Base Folder

### 10) Place the Notes 10 base installer executable into the Projects AppInstall Folder under base:

##### "projectFolder" is just a placeholder for the folder you saved the git project to.

projectFolder/conf/AppInstall/ND10/base/

### 11) Place the Notes Fix Pack installer executable into the Projects AppInstall/ND10 Folder under FP:

##### "projectFolder" is just a placeholder for the folder you saved the git project to.

projectFolder/conf/AppInstall/ND10/FP/

### 12) Place the Notes Fix Pack installer executable into the Projects AppInstall Folder under FP:

##### "projectFolder" is just a placeholder for the folder you saved the git project to.

projectFolder/conf/AppInstall/ND10/HF/

### 13) vagrant up

### 14) Navigate to http://IP.IN.HOST.YML:8080

### 15) Right Click on "DominoNotesBottle" and select Build

### 16) Once the Builds have completed, RDP into VM to IP.IN.HOST.YML 

### 17) Login to XRDP with vagrant vagrant

### 18) Notes Should be installed






