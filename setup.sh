curl -o- "https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh" | bash

. ~/.bashrc

nvm install --lts

npm install -g npm

npm install -g yarn

export PATH="$PATH:$HOME/.yarn/bin"

curl -o- "https://get.docker.com" | bash

sudo groupadd docker

sudo usermod -aG docker $USER

sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/bin/docker-compose

sudo ufw enable
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https

sudo apt update

sudo apt install nginx

sudo rm /etc/nginx/sites-enabled/default

sudo cp ./nginx/nginx.conf /etc/nginx/sites-enabled/default

sudo nginx -t

sudo systemctl nginx restart

sudo apt install snapd

sudo snap install core; sudo snap refresh core

sudo snap install --classic certbot

sudo ln -s /snap/bin/certbot /usr/local/bin/certbot

cd ./server

cp .env.example .env

yarn

cd ../
