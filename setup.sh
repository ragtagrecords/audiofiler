# Download and extract zip containing mp3s and zips for local file-server
curl https://files.ragtagrecords.com/zips/audio-files.zip -O -J -L
unzip audio-files.zip
rm audio-files.zip
mv audio-files file-server
