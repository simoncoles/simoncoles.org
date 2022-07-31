FROM gitpod/workspace-full
USER gitpod

# Update and install Python and Ruby
RUN sudo apt-get update && sudo apt-get install -y git
RUN sudo apt-get upgrade -y 
RUN sudo apt-get install -y rubygems ruby-dev aspell enchant 
# Install Jekyll
RUN sudo gem install bundler jekyll

RUN sudo rm -rf /var/lib/apt/lists/*

# More information: https://www.gitpod.io/docs/config-docker/
