# YouTube - Disable Adblocker Detection

This repository contains Chromium/Chrome extension code developed to prevent YouTube popup warnings for using ad-blockers and enable uninterrupted usage of YouTube without purchasing YouTube Premium or encountering YouTube ads.

![YouTube popup message](/images/youtube-cover.png)

## About Ad Blockers

Ad-blocking extensions, also known as ad-blockers, are browser extensions or software tools designed to prevent advertisements from displaying on websites as users browse the internet. These extensions work by blocking or hiding various types of online advertisements, including banner ads, pop-ups, video ads, and more. Ad-blockers enhance the user's online experience by reducing visual clutter, speeding up page load times, and improving privacy by preventing some tracking mechanisms used by advertisers. While ad-blockers are appreciated for their ability to create a cleaner and more efficient browsing environment, they can also raise ethical and financial concerns for content creators and publishers who rely on ad revenue to support their websites and content.

If you are okay with running an ad-blocker and are facing issues with YouTube usability, this is the tool for you.

## Requirements

To run this extension correctly, you need to add and enable it in Chrome and have an ad-blocking extension running simultaneously.

The ad-blocker I like to use can be found [here](https://chrome.google.com/webstore/detail/adblock-%E2%80%94-best-ad-blocker/gighmmpiobklfepjocnamgkkbiglidom?hl=en).

## Setup

### Run Only

You can run the extension from the unpacked folder located at `compiled/unpacked`.

**Steps:**

1. Click on the `<> Code` button on this page and select `Download ZIP`.
2. Extract the files from the ZIP.
3. Open Google Chrome and navigate to `chrome://extensions/`.
4. Enable developer mode.
5. Click on `Load unpacked`.
6. Load the extension from the `compiled/unpacked` directory into the Chrome browser.

```shell
├── compiled
│   ├── packed
│   └── unpacked <-- load from this folder
├── extension
├── images
├── LICENCE
└── README
```

![setup steps](/images/setup-step.png)

7. Make sure to enable the extension

![extension settings](/images/extension-popup.png)

### Build & Run

If you'd like to build the extension yourself, make sure you have [Node.js](https://nodejs.org/en) installed on your machine and follow these steps:

1. Clone this repository to your local machine.
2. Open a terminal and navigate to the root directory of the extension folder.
3. Install the dependencies with:

```shell
npm install
```

4. Build the app with:

```shell
npm run build
```

5. Follow the steps in the `Run Only` section, but on step 6, make sure to load the extension from the `extension/build` folder, which is generated in the previous step 4.

```shell
├── compiled
├── extension/
│   ├── build <-- generated folder
│   ├── icons
│   ├── src
│   ├── styles
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.json
│   └── webpack.config.js
├── images
├── LICENCE
└── README
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

[Emil Kovacevic](https://github.com/emilkovacevic)

## Contributions

Contributions are welcome!
