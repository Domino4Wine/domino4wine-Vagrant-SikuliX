class Hosts
  def Hosts.configure(config, settings)
    # Configure scripts path variable
    scriptsPath = File.dirname(__FILE__) + '/scripts'

    # Prevent TTY errors
    config.ssh.shell = "bash -c 'BASH_ENV=/etc/profile exec bash'"
    config.ssh.forward_agent = true
    config.ssh.forward_x11 = true
	config.vm.boot_timeout = 900
	config.disksize.size = '15GB'

    # Set VirtualBox as provider
    config.vm.provider 'virtualbox'
	
    #Main loop to configure VM
    settings['hosts'].each_with_index do |host, index|
      autostart = host.has_key?('autostart') && host['autostart']

      config.vm.define "#{host['name']}", autostart: autostart do |server|
        server.vm.box = host['box'] || 'ubuntu/bionic64'

        if settings.has_key?('boxes')
          boxes = settings['boxes']

          if boxes.has_key?(server.vm.box)
            server.vm.box_url = settings['boxes'][server.vm.box]
          end
        end

        server.vm.hostname = host['identifier']
        ## Need to make check for if IP, Mac address, Netmask or Gateway not Set

        server.vm.network "public_network", ip: host['ip'], bridge: "1) Bridge", auto_config: true, :mac => host['mac'], :netmask => host['netmask'], gateway:  host['gateway']

        # VirtulBox machine configuration
        server.vm.provider :virtualbox do |vb|
          vb.name = host['identifier']
          vb.customize ['modifyvm', :id, '--natdnsproxy1', 'on']
          vb.customize ['modifyvm', :id, '--natdnshostresolver1', 'on']
          vb.customize ['modifyvm', :id, '--ostype', 'Ubuntu_64']

          if host.has_key?('provider')
            host['provider'].each do |param|
              vb.customize ['modifyvm', :id, "--#{param['directive']}", param['value']]
            end
          end
        end
      
        # Register shared folders
        if host.has_key?('folders')
          host['folders'].each do |folder|
            mount_opts = folder['type'] == 'nfs' ? ['actimeo=1'] : []

            server.vm.synced_folder folder['map'], folder ['to'],
              type: folder['type'],
              owner: folder['owner'] ||= 'vagrant',
              group: folder['group'] ||= 'vagrant',
              mount_options: mount_opts
            end
        end
		
        
		# Add Branch Files to Vagrant Share on VM
        if host.has_key?('branch')
            server.vm.provision 'shell' do |s|
              s.path = scriptsPath + '/add-branch.sh'
              s.args = host['branch']
            end
        end
		
        ##Start Ansible Loop
        config.vm.provision :ansible_local do |ansible|
          ansible.playbook = "Setup.yml"
          ansible.extra_vars = { ansible_python_interpreter:"/usr/bin/python3",ip:host['ip'] }
          ansible.compatibility_mode = "2.0"
          ansible.install_mode = "pip"
          ansible.version = "2.7.10"   
        end
        
         ##Restart VM to ensure that the GUI and Installations complete
        config.vm.provision :reload
        
         ##Start Ansible Loop after reboot
        config.vm.provision :ansible_local do |ansible|
          ansible.playbook = "PostReboot.yml"
          ansible.extra_vars = { ansible_python_interpreter:"/usr/bin/python3",ip:host['ip']}
          ansible.compatibility_mode = "2.0"
          ansible.install_mode = "pip"
          ansible.version = "2.7.10"   
        end
        # Run custom provisioners
        if host.has_key?('provision')
            host['provision'].each do |file|
                server.vm.provision 'shell', path: file
            end
        end
      end
    end
  end
end
