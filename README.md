#  bitLock ![logo](https://i.ibb.co/Db9Hs0C/logo-32-html.png)
>Chrome extension for private bookmarks
>
BitLock is a chrome extension that stores bookmarks in a safe and secure way. It uses hashing and encryption to store the bookmarks using the Chrome API.

# Installation
Go to **Extensions** and enable **Developer mode**.  Select the **load unpack** option and go to the directory in which you have downloaded or cloned bitLock.

## Extra information
Since this extension uses the Chrome Storage API to persist its bookmarks and user password, its shouldn't be use to save sensitive information. 
bitLock mitigates this by encrypting the bookmarks and hashing the password with salt before storing them.
>bitLock is a **reserved** password
>
Don't use it 