## Here are the Order of Operations for Windows 10 or Server 2016 and higher in order to get this project up and running:

### 1) Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

### 2) choco install vagrant

### 3) choco install virtualbox

### 4) choco install git.install

### 5) git clone https://github.com/prominic/domino4wine-Vagrant-SikuliX.git

### 6) navigate to the project directory, by default this is: domino4wine-Vagrant-SikuliX

### 7) Edit the Hosts.yml with your favorite Text Editor

### 8) Download if you do not already have the base install files and fixpack and hot fixes:

Register for a Trial: https://www.ibm.com/account/reg/us-en/signup?formid=urx-33713

Or if You obtained a file from HCL, example filenames such as:
- notes1001FP2_standard_win.exe   is a Fix Pack, this would go into the FP folder
- NOTESDOMD_A_V10.0.1_FOR_WIN_EN.exe   is a Base installer, this would go into the Base Folder

### 9) Place the Notes 10 base installer executable into the Projects AppInstall Folder under base:

##### "projectFolder" is just a placeholder for the folder you saved the git project to.

projectFolder/conf/AppInstall/ND10/base/

### 10) Place the Notes Fix Pack installer executable into the Projects AppInstall/ND10 Folder under FP:

##### "projectFolder" is just a placeholder for the folder you saved the git project to.

projectFolder/conf/AppInstall/ND10/FP/

### 11) Place the Notes Fix Pack installer executable into the Projects AppInstall Folder under FP:

##### "projectFolder" is just a placeholder for the folder you saved the git project to.

projectFolder/conf/AppInstall/ND10/HF/

### 12) vagrant up

### 13) Navigate to http://IP.IN.HOST.YML:8080

### 14) Right Click on "DominoNotesBottle" and select Build

### 15) Once the Builds have completed, RDP into VM to IP.IN.HOST.YML 

### 16) Login to XRDP with vagrant vagrant

### 17) Notes Should be installed






