# Installs node modules on the host machine so the IDE can resolve them
cd ./client && npm install --legacy-peer-deps
cd ../server && npm install
cd ../file-server && npm install
