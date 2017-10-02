# UI Automation test 

## Introduction
The aim of this project is to create a base to develop UI automated tests that can be extended. The idea is to create a suite of tests that run the functionality in a Chrome browser.

## Involved tools & frameworks
* [Headless Chrome Automation tool](https://github.com/graphcool/chromeless)
* [Tape - JS Testing framework](https://github.com/substack/tape)

## Prerequisites
The following software must be installed
* [Node >= v8](https://nodejs.org/en/)
* [Chrome >= v60](https://www.google.com.mx/chrome/browser/desktop/?brand=CHBD&gclid=EAIaIQobChMIoKPtv8HF1QIVohXTCh0X_Qu2EAAYASAAEgJO4vD_BwE)
* [Git](https://git-scm.com/downloads) - optional

## Folder structure
* root: Contains the README.md, the main configuration to execute the project such as package.json or any other configuration file.
* processes: Contains the scripts to start/stop Chrome in headless mode or any other system script required to run the tests.
* src/test: Contains the test suites to run. Any test that is needed to be ran must be inside this folder.
* src/utilities: Custom modules implemented to cover shared functionality between test such as login in the app, use the search functionality, cover and submit a form...
* node_modules: Contains third party JS libraries used in this project

## Getting started
Download the code
```
git clone https://github.com/sapetti/chromeless.git
```

Install dependencies
```
npm install
```

Run test without an instance of Chrome in headless mode running. This will start the headless process before the tests and will stop it after all tests are ran
```
npm test
```

Instead of the previous step, run test with an instance of Chrome in headless mode already running or allowing chromeless module to open a new Chrome window showing the steps executed during the test
```
npm tape
```

## Environment
* The project should be ran in a Windows environment as **setup** and **teardown** scripts use .bat files. But **tape** script can be ran in other environments.
* Chrome should be installed in **c:\Program Files (x86)\Google\Chrome\Application**, if it is not the case update the path in **processes/start-chrome-headless.bat**.

## Examples
You can find 2 files with some test examples in the patch src/test:
* simple.tape.test.js - Some lines of code showing how tape.js could work to test some values.
* chromeless.test.js - Some tests in a sample [webapp](http://todomvc.com/examples/vanillajs/) that will cover actions like create or delete TODOs.
