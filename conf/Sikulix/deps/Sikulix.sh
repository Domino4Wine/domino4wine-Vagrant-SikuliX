#!/bin/sh
if [ -z "$DISPLAY" ]
then
      echo "\$DISPLAY is NULL, not starting Sikulix"
else
      echo "\$DISPLAY is $DISPLAY"
	  echo "Adding Jruby and Jython Extensions"
      #sudo cp /vagrant/Sikulix/deps/jython-* /vagrant
      #sudo cp /vagrant/Sikulix/deps/jruby-* /vagrant
	  echo "Starting Sikulix in Screen Session"
       screen -dmS Sikulix "sudo /usr/lib/jvm/java-11-openjdk-amd64/bin/java -jar /vagrant/sikulix.jar -v"
      sleep 5
      echo "Done"
fi


