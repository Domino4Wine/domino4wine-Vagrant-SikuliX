# domino4wine-Vagrant-SikuliX
Primary goal is to use Vagrant on Windows, Mac, and Linux to deploy Crossover in an Ubuntu 18.04 VM, in order to automate how new builds of certain applications affect services we run. 

We will focus on IBM Notes, Designer and Administrator, then move on to other projects. 

We will use branches for testing indvidual applications with the Master branch, by storing the Sikuli Scripts in the Branch and any additional files that are needed to get the application tested.
 
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You will need some software on your Desktop, Mac or other Machine, here are the most important:

```
git
Vagrant
Virtualbox
```

## Automatic Installation and Start
Open a Powershell or a Terminal on Your Mac, Linux or Windows Machine

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

We would rather use Powershell:

CMD
```bat
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
choco install vagrant
choco install virtualbox
choco install git.install
```

#### Mac
Just like Windows and other Linux repos, there is a similar package manager for Mac OSx, Homebrew, We will utilize that to install the prequsites.

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

### Vagrant Plugins

This project utlizes a few extra plugins provided by the Vagrant community, Once Vagrant has been installed, add these plugins:

```shell
vagrant plugin install vagrant-disksize
vagrant plugin install vagrant-reload
```

### Downloading domino4wine-Vagrant-SikuliX Project

Open up a terminal and perform the following git command:

```shell
git clone https://github.com/prominic/domino4wine-Vagrant-SikuliX.git
cd domino4wine-Vagrant-SikuliX
```

If you want to install a Branch Application follow use this:

```shell
git clone -b  Domino-Notes https://github.com/prominic/domino4wine-Vagrant-SikuliX.git
cd domino4wine-Vagrant-SikuliX
```

### Starting Vagrant
The installation process is estimated to take about 15 - 30 Minutes (mayber longer on older machines)

#### Standard (DHCP)

To start the project with DHCP (Most users) in mind, run:

```shell
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

#### NOTE: If you are running this as a headless VM, ensure that you remove the line in the Vagrantfile: "vb.gui = true"

If you are using the Static IP Scripts, then this will automatically started headless.

### Running Sikulix

Once the VM has popped up on your Desktop, it will reboot once and do a final update check and it should automatically login to the Vagrant user account (in Progress).

If not, Login with the username Vagrant, and the Password Vagrant

Once logged in, the Sikulix Application will launch

##### OR

Then Launch Terminal:
```shell
sh /vagrant/Sikulix.sh
```

## Running the tests

Once Sikulix has loaded, if you have added the Branch for your application, you can find the scripts in /vagrant/(#branchname)

Open SikuliX and then select File open, Once opened, navigate to the aforementioned path and open the Sikulix file.

You can now Press run if your Sikuli Script doesn't require any other setup.

To launch this automatically create a Jar file and place in .profile like the Sikulix Startup script  -- To Do

### Break down into end to end tests

#### Domino-Notes

Assuming you cloned the repository with the Branch clone command, the Domino-Notes

```
Commands that enable Sikulix to run Domino Notes Scripts Automatically

```

Major Tasks
Install Domino Designer, Administrator and Notes via SikuliX Script (Specifically logging which version which was used to compile)
Open Notes
Open Administrator
Open Designer

Minor Tasks: 
See Domino-Notes Readme -- To be filled out

#### Horizon-View

Assuming you cloned the repository with the Branch clone command, the Horizon-View

```
To be filled out
```

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

This project is licensed under the SSPLv1 - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
