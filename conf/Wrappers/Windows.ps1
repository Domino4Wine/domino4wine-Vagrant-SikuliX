param([string]$Static_IP = $sipsan,[string]$Netmask = $snetmasksan,[string]$Gateway = $sgatewaysan,[string]$addBranch = "",[string]$ChocoInstalled = "true",[string]$GUI = "true",[string]$DHCP = "true")
Write-Output "Checking if Dependencies are installed:"
##git ls-remote --heads https://github.com/prominic/domino4wine-Vagrant-SikuliX.git
##Added so that we can get the Branches available and present as an option if no parameter specified
##create switch statement based on this
if ([string]::IsNullOrWhiteSpace($addBranch)) { $Branch = $false }
else { $Branch = $true }
if (Get-Command choco.exe -ErrorAction SilentlyContinue) { $ChocoInstalled = true }
else
{ Set-ExecutionPolicy Bypass -Scope Process -Force; Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1')) }
$vag = choco list -li | Select-String vagrant
$VB = choco list -li | Select-String Virtualbox
$git = choco list -li | Select-String "Git "
if ($vag -like '*vagrant*') {}
else { choco install vagrant }
if ($VB -like '*VirtualBox*') {}
else { choco install virtualbox }
if ($git -like 'Git *') {}
else { choco install git.install }
##Suggested  Vaules
$sipsan = "192.168.2.97"
$snetmasksan = "255.255.255.0"
$sgatewaysan = "192.168.2.1"
# Check if no arguments are passed, and prompt for some based on the suggest values, if none passed use suggested values
if ([string]::IsNullOrWhiteSpace($Static_IP)) {
	Write-Output "Either execute this with the arguments in the order of IP address netmask gateway, or use the prompts if no arguments are passed"
	Write-Output "example: PS Windows.ps1 192.168.1.111 255.255.255.0 192.168.2.1"
	$ipsan = Read-Host -Prompt "Enter the IP [$sipsan]" }
else { $ipsan = $Static_IP }
if ([string]::IsNullOrWhiteSpace($ipsan)) { $ipsan = $sipsan }
if ([string]::IsNullOrWhiteSpace($Netmask)) { $netmasksan = Read-Host -Prompt "Enter the Netmask [$snetmasksan]" }
else { $netmasksan = $Netmask }
if ([string]::IsNullOrWhiteSpace($netmasksan)) { $netmasksan = $snetmasksan }
if ([string]::IsNullOrWhiteSpace($Gateway)) { $gatewaysan = Read-Host -Prompt "Enter the Gateway [$sgatewaysan]" }
else { $gatewaysan = $Gateway }
if ([string]::IsNullOrWhiteSpace($gatewaysan)) { $gatewaysan = $sgatewaysan }
git clone https://github.com/prominic/domino4wine-Vagrant-SikuliX.git
if ($Branch) {
	git clone -b $addBranch https://github.com/prominic/domino4wine-Vagrant-SikuliX.git $addBranch
	cp Domino-Notes/* domino4wine-Vagrant-SikuliX -force -r
	vagrant plugin install vagrant-disksize
	vagrant plugin install vagrant-reload
        rm -force -r .\Domino-Notes\
	Set-Location domino4wine-Vagrant-SikuliX
	vagrant up --provision-with ansible_local,reload }
else {
	vagrant plugin install vagrant-disksize
	vagrant plugin install vagrant-reload
        Set-Location domino4wine-Vagrant-SikuliX
	vagrant up --provision-with ansible_local,reload
      }
