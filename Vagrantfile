Vagrant.configure(2) do |config|
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "4086"
    vb.cpus = "2"
    vb.gui = true
  end
    config.disksize.size = '25GB'
    config.vm.network "public_network", bridge: "1) ensp2", bootproto: "dhcp"
    config.vm.box = "ubuntu/bionic64"
    config.vm.provision "shell",
       run: "always",
       inline: "dpkg --add-architecture i386 && sudo apt-get update -y"
    config.vm.synced_folder "vagrant", "/vagrant", :mount_options => ["rw"]
    config.vm.synced_folder "vagrant/install", "/sikulix", :mount_options => ["ro"]
    config.vm.provision :ansible_local do |ansible|
      ansible.playbook = "ub1810-crossover-playbook.yml"
      ansible.extra_vars = { ansible_python_interpreter:"/usr/bin/python3" }
      ansible.compatibility_mode = "2.0"
     config.vm.provision :reload
  end
end