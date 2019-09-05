##################################################################################
##################################################################################
##    Copyright (C) 2019-present Prominic.NET, Inc.                             ##
##                                                                              ##
##    This program is free software: you can redistribute it and/or modify      ##
##    it under the terms of the Server Side Public License, version 1,          ##
##    as published by MongoDB, Inc.                                             ##
##                                                                              ##
##    This program is distributed in the hope that it will be useful,           ##
##    but WITHOUT ANY WARRANTY; without even the implied warranty of            ##
##    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the             ##
##    Server Side Public License for more details.                              ##
##                                                                              ##
##    You should have received a copy of the Server Side Public License         ##
##    along with this program. If not, see:                                     ##
##                                                                              ##
##    http://www.mongodb.com/licensing/server-side-public-license               ##
##                                                                              ##
##    As a special exception, the copyright holders give permission to link the ##
##    code of portions of this program with the OpenSSL library under certain   ##
##    conditions as described in each individual source file and distribute     ##
##    linked combinations including the program with the OpenSSL library. You   ##
##    must comply with the Server Side Public License in all respects for       ##
##    all of the code used other than as permitted herein. If you modify file(s)##
##    with this exception, you may extend this exception to your version of the ##
##    file(s), but you are not obligated to do so. If you do not wish to do so, ##
##    delete this exception statement from your version. If you delete this     ##
##    exception statement from all source files in the program, then also delete##
##    it in the license file.                                                   ##
##################################################################################
##################################################################################
class Hosts
  def Hosts.configure(config, settings)
    # Configure scripts path variable
    scriptsPath = File.dirname(__FILE__) + '/scripts'
    # Prevent TTY errors
    config.ssh.shell = "bash -c 'BASH_ENV=/etc/profile exec bash'"
    config.ssh.forward_agent = true
    config.ssh.forward_x11 = true
	config.vm.boot_timeout = 900

    # Set VirtualBox as provider
    config.vm.provider 'virtualbox'
	
    #Main loop to configure VM
    settings['hosts'].each_with_index do |host, index|
      autostart = host.has_key?('autostart') && host['autostart']

      config.vm.define "#{host['name']}", autostart: autostart do |server|
        server.vm.box = host['box'] || 'ubuntu/bionic64'
        server.disksize.size = '80GB'

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
        server.vm.provision :ansible_local do |ansible|
          ansible.playbook = "Setup.yml"
          ansible.extra_vars = { ip:host['ip'] }
        end
         ##Start Ansible Loop after reboot
        server.vm.provision :ansible_local do |ansible|
          ansible.playbook = "PostReboot.yml"
          ansible.extra_vars = { ip:host['ip']}
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
