# domino4wine-Vagrant-SikuliX
Primary goal is to use Vagrant on Windows, Mac, and Linux to deploy Crossover in an Ubuntu 19.04 VM, in order to run regression tests and automating GUI based installations and configuration of applications.

Our Primary Focus is on IBM Notes, Designer and Administrator, however this project is meant to be used as multi-tool for other projects that require GUI based automation.

We will keep the Master branch as the core of the project and any application that we want to Automate/Regression Test we will branch in order to compartmentalize the project for use with mutiple applications.
 
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system. You MUST have the Vagrant, Virtualbox and Git installed on your machine. Please follow the instructions below for setting up your VM with the pre-requistes. 

### Prerequisites

You will need some software on your PC or Mac:

```
git
Vagrant
Virtualbox
```

### Installing

A step by step series of examples that tell you how to get a development env running

To ease deployment, we have a few handy scripts that will utlize a package manager for each OS to get the pre-requisite software for your host OS.

#### Windows
Powershell has a package manager named Chocalatey which is very similar to SNAP, YUM, or other Package manager, We will utilize that to quickly install Virtualbox, Vagrant and Git.

Powershell
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
choco install vagrant
choco install virtualbox
choco install git.install
```

For those that need to run this in a Command Prompt, you can use this:

CMD
```bat
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
choco install vagrant
choco install virtualbox
choco install git.install
```

#### Mac
Just like Windows and other Linux repos, there is a similar package manager for Mac OS X, Homebrew, We will utilize that to install the prequsites. You will likley need to allow unauthenticated applications in the Mac OS X Security Settings, there are reports that Mac OS X Mojave will require some additional work to get running correctly. You do NOT have to use these scripts to get the pre-requisites on your Mac, it is recommened. 

```shell
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew cask install virtualbox
brew cask install vagrant
brew cask install vagrant-manager
brew install git
```

#### CentOS 7
We will utilize YUM and a few other bash commands to get the Virtualbox, Git,  and Vagrant installed.

YUM
```shell
yum -y install gcc dkms make qt libgomp patch kernel-headers kernel-devel binutils glibc-headers glibc-devel font-forge
cd /etc/yum.repo.d/
wget http://download.virtualbox.org/virtualbox/rpm/rhel/virtualbox.repo
yum install -y VirtualBox-5.1
/sbin/rcvboxdrv setup
yum -y install https://releases.hashicorp.com/vagrant/1.9.6/vagrant_1.9.6_x86_64.rpm
sudo yum install git
```

#### Ubuntu
We will utilize APT to get the Virtualbox, Git,  and Vagrant installed.

APT
```shell
sudo apt-get install virtualbox vagrant git-core -y 
```

## Downloading domino4wine-Vagrant-SikuliX Project to a Local folder

Open up a terminal and perform the following git command in order to save the Project to a local folder:

```shell
git clone https://github.com/prominic/domino4wine-Vagrant-SikuliX.git

```
### Configuring the Environment
Once you have navigated into the projects directory. You will need to modify the Hosts.yml to your specific Environment.
Please set the configuration file with the correct, Network and Memory and CPU settings your host machine will allow, as these may vary from system to system, I cannot predict your Machines CPU and Network Requirements. You will need to make sure that you do not over allocate CPU, and RAM. In regards to Networking, you MUST change the networking, you will need to set the IP to that of one that is not in use by any other machine on your network.

If you want to change to a different branch for different Application Builds, change the branch variable to that of an existing branch in this repo.

```
cd domino4wine-Vagrant-SikuliX
vi Hosts.yml
```

Once you have configured the Hosts.yml file. You should now be set to go on getting the VM up and running.

### Starting the VM
The installation process is estimated to take about 15 - 30 Minutes. 

```
vagrant up
```

#### Example of a Succesful run:

<details><summary>Details:</summary>
<p>

#### Example of a Succesful run:

```powershell
PS C:\Users\Markg\domino4wine-Vagrant-SikuliX> vagrant up
Bringing machine 'default' up with 'virtualbox' provider...
==> default: Importing base box 'ubuntu/bionic64'...
==> default: Matching MAC address for NAT networking...
==> default: Checking if box 'ubuntu/bionic64' version '20190411.0.0' is up to date...
==> default: Setting the name of the VM: domino4wine-Vagrant-SikuliX_default_1555657863340_92999
==> default: Clearing any previously set network interfaces...
==> default: Specific bridge '1) ensp2' not found. You may be asked to specify
==> default: which network to bridge to.
==> default: Preparing network interfaces based on configuration...
    default: Adapter 1: nat
    default: Adapter 2: bridged
==> default: Forwarding ports...
    default: 22 (guest) => 2222 (host) (adapter 1)
==> default: Running 'pre-boot' VM customizations...
==> default: Resized disk: old 10240 MB, req 15360 MB, new 15360 MB
==> default: You may need to resize the filesystem from within the guest.
==> default: Booting VM...
==> default: Waiting for machine to boot. This may take a few minutes...
    default: SSH address: 127.0.0.1:2222
    default: SSH username: vagrant
    default: SSH auth method: private key
    default: Warning: Connection reset. Retrying...
    default: Warning: Connection aborted. Retrying...
    default:
    default: Vagrant insecure key detected. Vagrant will automatically replace
    default: this with a newly generated keypair for better security.
    default:
    default: Inserting generated public key within guest...
    default: Removing insecure key from the guest if it's present...
    default: Key inserted! Disconnecting and reconnecting using new SSH key...
==> default: Machine booted and ready!
==> default: Checking for guest additions in VM...
    default: The guest additions on this VM do not match the installed version of
    default: VirtualBox! In most cases this is fine, but in rare cases it can
    default: prevent things such as shared folders from working properly. If you see
    default: shared folder errors, please make sure the guest additions within the
    default: virtual machine match the version of VirtualBox you have installed on
    default: your host and reload your VM.
    default:
    default: Guest Additions Version: 5.2.18
    default: VirtualBox Version: 6.0
==> default: Configuring and enabling network interfaces...
==> default: Mounting shared folders...
    default: /sikulix => C:/Users/Markg/domino4wine-Vagrant-SikuliX/vagrant/install
    default: /vagrant => C:/Users/Markg/domino4wine-Vagrant-SikuliX/vagrant
==> default: Running provisioner: ansible_local...
    default: Installing Ansible...
    default: Running ansible-playbook...
 [WARNING]: file /vagrant/tasks/Domino-Notes.yml is empty and had no tasks to
include

PLAY [all] *********************************************************************

TASK [Gathering Facts] *********************************************************
ok: [default]

TASK [Enabling i386 Repo for Crossover and Updating Sources] *******************
changed: [default]

TASK [Disable IPv6 with sysctl] ************************************************
changed: [default] => (item=net.ipv6.conf.all.disable_ipv6)
changed: [default] => (item=net.ipv6.conf.default.disable_ipv6)
changed: [default] => (item=net.ipv6.conf.lo.disable_ipv6)

TASK [Adding additional Repos] *************************************************
changed: [default]

TASK [Updating via apt-get update] *********************************************
changed: [default]

TASK [Install Desktop, Java 11, and XRDP -- Takes about 25 Mins] ***************
changed: [default]

TASK [Ensure ansible-cache directory exists] ***********************************
changed: [default]

TASK [Install Required SikuliX Dependencies -- Takes about 5 Mins] *************
changed: [default]

TASK [Downloading Leptonica sources] *******************************************
changed: [default]

TASK [Unpacking Leptonica] *****************************************************
changed: [default]

TASK [Configuring leptonica source] ********************************************
changed: [default]

TASK [Installing Leptonica -- Takes about 7 Mins] ******************************
changed: [default]

TASK [Downloading tesseract sources] *******************************************
changed: [default]

TASK [Unpacking tesseract] *****************************************************
changed: [default]

TASK [Configuring tesseract source] ********************************************
changed: [default]

TASK [Installing tesseract -- Takes about 10 Mins] *****************************
changed: [default]

TASK [Adding Desktop Icon for Sikulix] *****************************************
changed: [default]

TASK [Set Sikulix to start on User Login] **************************************
changed: [default]

TASK [Setting Automatic Login to True] *****************************************
changed: [default]

TASK [Setting Automatic Login to Vagrant] **************************************
changed: [default]

TASK [Set Add OpenCV to Bin] ***************************************************
changed: [default]

TASK [Changing perm of Desktop Icon] *******************************************
changed: [default]

TASK [Install Required Dependencies for Crossover -- Takes about 3 Mins] *******
changed: [default]

TASK [Download and Install Crossover -- Takes about 5 Mins] ********************
changed: [default]

TASK [Install extra Libraries and Drivers] *************************************
changed: [default]

TASK [Checking for Additional Libraries and Software:] *************************
ok: [default]

TASK [Software Needed:] ********************************************************
ok: [default] => {
    "results": [
        "None"
    ]
}

PLAY RECAP *********************************************************************
default                    : ok=27   changed=24   unreachable=0    failed=0

==> default: Running provisioner: reload...
==> default: Attempting graceful shutdown of VM...
==> default: Checking if box 'ubuntu/bionic64' version '20190411.0.0' is up to date...
==> default: Clearing any previously set forwarded ports...
==> default: Clearing any previously set network interfaces...
==> default: Specific bridge '1) ensp2' not found. You may be asked to specify
==> default: which network to bridge to.
==> default: Preparing network interfaces based on configuration...
    default: Adapter 1: nat
    default: Adapter 2: bridged
==> default: Forwarding ports...
    default: 22 (guest) => 2222 (host) (adapter 1)
==> default: Running 'pre-boot' VM customizations...
==> default: Booting VM...
==> default: Waiting for machine to boot. This may take a few minutes...
    default: Warning: Connection reset. Retrying...
    default: Warning: Connection aborted. Retrying...
==> default: Machine booted and ready!
==> default: Checking for guest additions in VM...
    default: The guest additions on this VM do not match the installed version of
    default: VirtualBox! In most cases this is fine, but in rare cases it can
    default: prevent things such as shared folders from working properly. If you see
    default: shared folder errors, please make sure the guest additions within the
    default: virtual machine match the version of VirtualBox you have installed on
    default: your host and reload your VM.
    default:
    default: Guest Additions Version: 5.2.18
    default: VirtualBox Version: 6.0
==> default: Configuring and enabling network interfaces...
==> default: Mounting shared folders...
    default: /sikulix => C:/Users/Markg/domino4wine-Vagrant-SikuliX/vagrant/install
==> default: Detected mount owner ID within mount options. (uid: 1000 guestpath: /sikulix)
==> default: Detected mount group ID within mount options. (gid: 1000 guestpath: /sikulix)
    default: /vagrant => C:/Users/Markg/domino4wine-Vagrant-SikuliX/vagrant
==> default: Detected mount owner ID within mount options. (uid: 1000 guestpath: /vagrant)
==> default: Detected mount group ID within mount options. (gid: 1000 guestpath: /vagrant)
==> default: Machine already provisioned. Run `vagrant provision` or use the `--provision`
==> default: flag to force provisioning. Provisioners marked to run always will still run.
```
</p>
</details>


Once the VM has popped up on your Desktop, it will reboot once and do a final update check.

Once the VM is fully setup, You should be able to RDP into the VM or use the Virtualbox GUI to manage the VM. If you are using RDP, simply RDP to the IP you setup in the Host.yml.

##### Bug
(At the beginning of the project, we wanted the user to not have to sign in when using the Virtualbox GUI. This creates a session and will prevent RDP from working.) -- Workaround -- Kill all instances of the Vagrant session. You can run this after using vagrant ssh to access the VM and then issuing a kill command to remove all instances of the Vagrant user.

```
sudo pkill -KILL -u vagrant
```

or via the Virtuablbox Gui, if the GUI logged you in automatically, then go to the top right of the desktop and log out of the user Vagrant.

Once we remove this, you should be able to RDP into your VM via the IP address you specified in the Host.yml, and you will be prompted after entering RDP for the login name and password. Login with the username Vagrant, and the Password Vagrant.

### Running Sikulix

Once you are logged in, you can now launch Sikulix from the Desktop Icon.

#### Bug
(in the current build, Desktop Icons are broken at this moment) to launch Sikulix Without an desktop Icon run this command: 

```
usr/lib/jvm/java-11-openjdk-amd64/bin/java -jar /jars/sikulix.jar
```


## Location of Sikulix Scripts and Jenkins Jobs -- Important

On the VM, you can find the Sikulix Scripts on the ROOT of The VMs drive. In the VM use the File Explorer to navigate to the ROOT of the drive. Then open up the /vagrant folder/ This folder is shared with your Host Machine, any file you place in this will be accessible to both machines. 

This Folder on the VM, exists in the folder that you downloaded. So if you were on your Desktop and ran the git command, You would go to your desktop, then into the Vagrant Project Folder, then to the "conf" folder. If you  look closely you will see the same files that are on the Vagrant VM. in the Vagrant Share folder.

We recommend testing the scripts on the VM, and then uploading them to Git from the Host.

### Installing IBM Notes
Before you can run the Sikulix Jobs that will install Notes. You will need to place the Installer Files into their respective installation folders in the Vagrant Share folder.

#### Notes 9
- Place the Base Installer EXE into Vagrant Shared folder, on the host it would be: projectFolder/conf/AppInstall/ND9/base/
- Place the latest Fix Pack Installer EXE into the Vagrant Shared Foldder,  on the host it would be: projectFolder/conf/AppInstall/ND9/FP/
- Place the latest Hot Fix Installer EXE into the Vagrant Shared Foldder,  on the host it would be: projectFolder/conf/AppInstall/ND9/HF/

#### Notes 10
- Place the Base Installer EXE into Vagrant Shared folder,  on the host it would be: projectFolder/conf/AppInstall/ND10/base/
- Place the latest Fix Pack Installer EXE into the Vagrant Shared Foldder,  on the host it would be: projectFolder/conf/AppInstall/ND10/FP/
- Place the latest Hot Fix Installer EXE into the Vagrant Shared Foldder, on the host it would be: projectFolder/conf/AppInstall/ND10/HF/

Once you have placed the files into the respective folders. You will then use a browser on your Host Machine, and navigate to http://IP.IN.HOST.YML:8080 which will show Jenkins and a list of Jobs that can be ran.

Execute The Jobs in this order for the Version of Notes you respectively want to install:
1) Install Notes Bottle
2) Install Notes Base
3) Install Notes Fix Pack
4) Install Notes Hot Fix

Right now, I recommend to manually install Notes on top of Crossover as the Sikulix Scripts are fragile and may not always work due to the fragility of the Sikulix Scripts and the environment it is run in. 

Later this is likley to be simplied to a Single task that calls each of these. This should open and install the the files you provided the VM, and setup the bottle with Notes.

You should at this point be able to launch Notes via CrossOver and Sign in.

## Built With
* [Vagrant](https://www.vagrantup.com/) - Portable Development Environment Suite.
* [VirtualBox](https://www.virtualbox.org/wiki/Downloads) - Hypervisor.
* [Ansible](https://www.ansible.com/) - Virtual Manchine Automation Management.
* [Sikuli](https://sikulix-2014.readthedocs.io/en/latest/newslinux.html) - OCR and Scripted Automation Testing Suite.
* [vagrant-vbguest](https://github.com/dotless-de/vagrant-vbguest) - A Vagrant plugin to keep your VirtualBox Guest Additions up to date.
* [CrossOver](https://www.codeweavers.com/products/crossover-mac) - Windows Compatability Layer for Linux and Mac.
* [vagrant-reload](https://github.com/aidanns/vagrant-reload) - A Vagrant plugin that allows you to reload a Vagrant plugin as a provisioning step.
* [vagrant-disksize](https://github.com/sprotheroe/vagrant-disksize) - A Vagrant plugin to resize disks in VirtualBox.
* [Domino4Wine](https://www.prominic.net) - Making this entire project possible.
* [DominoHelp](http://dominohelp.com/) - Great resource for Domino related issues and advice.

## Contributing

Please read [CONTRIBUTING.md](https://www.prominic.net) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Mark Gilbert** - *Initial work* - [Makr91](https://github.com/Makr91)

See also the list of [contributors](https://github.com/prominic/domino4wine-Vagrant-SikuliX/graphs/contributors) who participated in this project.

## License

This project is licensed under the SSLP v3 License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
