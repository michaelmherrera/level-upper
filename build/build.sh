# Get into the root of the repo
cd `dirname $0`
cd ..
ROOT=$(pwd)

# Create a dir for the temporary files used in the build process
mkdir tmp-files

# Create a dir to place the compiled binaries
rm -r bin
mkdir bin

# Compile the typescript
tsc -b

# Inline the javascript and html into one file
inliner --skip-absolute-urls web/index.html > tmp-files/inlined.html

# Inject the html file into a go file
go-bindata -o cmd/levelup/bindata.go -prefix tmp-files tmp-files/inlined.html

# Compile the go project and place the result in the bin directory
cd cmd/levelup 
GOOS=windows GOARCH=amd64 go build -ldflags="-s -w" . 
GOARCH=amd64 go build -ldflags="-s -w" . 
mv levelup levelup.exe $ROOT/bin
cd $ROOT

# Compress the binaries
FLAG="--no-compress"
if [ "$1" != "$FLAG" ]
then
    cd $ROOT/bin
    ls
    upx --best levelup.exe levelup
    cd $ROOT
fi

# Turn the macOS binary into a .app then zip it
cd $ROOT/bin
appify -name "Levelup" -icon $ROOT/assets/streetcode.png $ROOT/bin/levelup 
rm levelup
zip -r levelup_mac.zip Levelup.app
rm -r Levelup.app
cd $ROOT


# Clean up
rm -r tmp-files