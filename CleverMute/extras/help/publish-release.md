# How to make the extension available to the public


1 - Review manifest.json for any required change

5 - Generate a dev build
    go to chrome://extensions/
    make sure developer mode is enabled
    click on "load uncompressed" to activate the chrome extension

2 - Manually run all the tests as defined on the project tests protocol
    (See the related help file for docs on how to launch tests)

3 - If extension works as expected, commit all changes to repo

4 - Make sure the git tag is updated with the new project version we want to publish
    (Either in git local and remote repos)

5 - Generate a release build

6 - test that it works with chrome
    go to chrome://extensions/
    make sure developer mode is enabled
    click on "load uncompressed" to activate the chrome extension

7 - Create a zip file with the release files. Root of the zip must be the manifest.json file
    zip filename is not important, any name will do
    
8 - Upload the zip to chrome web store
    - Make sure the rest of the information that is required when uploading the zip is updated
