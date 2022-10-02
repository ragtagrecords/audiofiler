# Download and extract archive containing mp3s and zips for local file-server
curl https://files.ragtagrecords.com/zips/audio-files.tar.gz -O -J -L 
tar -xzvf audio-files.tar.gz
rm audio-files.tar.gz
mv audio-files file-server
