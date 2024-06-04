[![eDev](/public/eDevFactory.webp)](https://play-factory.edevv.dev/)

![](/public/heroShoot.webp)

[LinkedIn](https://www.linkedin.com/in/edson-a%C3%B1awaya/)

Download the latest release [here](https://github.com/edsonarios/play-factory-dev/releases)

## Acknowledgements

`eDev - Play Factory` icon designed by `Fabiola Torrez`

## Use App

```bash
git clone ...
npm install
npm run dev

# build
npm run build
```

## Know Issues
### Issue: Unable to Cancel Conversion Process in Release Version
Currently, it is not possible to cancel the conversion process in the standard release version of the application.

### Alternative Version with Cancellation Feature
There is an alternative version available that allows you to cancel a conversion process. However, this version is not easily distributable.

Using the Alternative Version (Windows Only)
1. Download the Alternative Version: Go to the Releases section of the repository and download the alternative version.
2. Extract the Files: Once downloaded, extract the files. This version works similarly to a portable application.

### Building Your Own Alternative Version
If you prefer to create your own alternative version, follow these steps:

1. Download the Project: Clone or download the entire project from the repository.
2. Modify the Code:
* Open `electron/main.ts`.
* Uncomment the code on lines 14 and 132, and comment out the code for version 1. This will switch the application to use version 2, which supports cancelling conversions.
3. Build the Application:
* Run the build command: `npm run build`.
* After the build process completes, you will find a folder named win-unpacked in the output directory `/release/"currectVersion e.g.(1.0.0)"`. This folder contains the application, ready to use without installation.
* This version allows you to cancel the conversion process if needed.

By following these steps, you can either use the pre-built alternative version or create your own, ensuring you have the ability to cancel conversions when necessary.
