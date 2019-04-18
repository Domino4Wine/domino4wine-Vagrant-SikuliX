# domino4wine-Vagrant-SikuliX

Primary goal is to use Vagrant on Windows, Mac, and Linux to deploy Crossover in an Ubuntu 18.04 VM, in order to install IBM Notes, Designer and Administrator and run it against automated testing using SikuliX 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to Download and install:

```
git
Vagrant
Virtualbox
IBM Notes, Designer and Administrator Installation files and Fix Packs
```

### Installing

A step by step series of examples that tell you how to get a development env running

To ease deployment, we have a few handy scripts that will utlize a package manager for each OS to get the pre-requisite software for your host OS.

#### Windows

Powershell has a package manager named Chocalatey which is very similar to SNAP, YUM, or other Package manager, We will utilize that to quickly install Virtualbox, Vagrant and Git.

Powershell
```
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
choco install vagrant
choco install virtualbox
choco install git.install
```

We would rather use Powershell:

CMD
```
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
choco install vagrant
choco install virtualbox
choco install git.install
```

#### Mac

Just like Windows and other Linux repos, there is a similar package manager for Mac OSx, Homebrew, We will utilize that to install the prequsites.

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew cask install virtualbox
brew cask install vagrant
brew cask install vagrant-manager
brew install git
```

#### CentOS 7

We will utilize YUM and a few other bash commands to get the Virtualbox, Git,  and Vagrant installed.

YUM
```
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
```
sudo apt-get install virtualbox vagrant git-core -y 
```

### Vagrant Plugins

This project utlizes a few extra plugins provided by the Vagrant community, Once Vagrant has been installed, add these plugins:

```
vagrant plugin install vagrant-disksize
vagrant plugin install vagrant-reload
```

### Downloading domino4wine-Vagrant-SikuliX Project

Open up a terminal and perform the following git command:

```
git clone https://github.com/prominic/domino4wine-Vagrant-SikuliX.git
cd domino4wine-Vagrant-SikuliX
```

### Starting Vagrant

```
vagrant up
```
The installation process is estimated to take about 15 - 30 Minutes (mayber longer on older machines)

### Running Sikulix
Once the VM has popped up on your Desktop, it will reboot once and do a final update check.

Login with the username Vagrant, and the Password Vagrant

Then Launch Terminal:
```
sudo cp /vagrant/install/* /vagrant 
java -jar /vagrant/sikulix.jar -v
```

## Running the tests

To be filled out

### Break down into end to end tests

Explain what these tests test and why - -To be filled out

```
Give an example -To be filled out
```

## Built With

* [Vagrant](https://www.vagrantup.com/) - VM Management
* [VirtualBox](https://www.virtualbox.org/wiki/Downloads) - Hypervisor
* [Sikuli](https://sikulix-2014.readthedocs.io/en/latest/newslinux.html) - Used automate GUI testing
* [CrossOver](https://www.codeweavers.com/products/crossover-mac) - Windows Emulation software

## Contributing

Please read [CONTRIBUTING.md](https://www.prominic.net) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Mark Gilbert** - *Initial work* - [Makr91](https://github.com/Makr91)

See also the list of [contributors](https://github.com/prominic/domino4wine-Vagrant-SikuliX/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
