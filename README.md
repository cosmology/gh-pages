# Currency exchange market demo

This demo was built for Teradata dev challenge purpose to showcase the use of proprietary covalent core components,
Angular 4 in combination with Material 2 UI components using Typescript

Deployed demo can be found at  [**demo**](https://currency-market.herokuapp.com/)

Currently the only real time polling service is the forex service, others use mock data hardcoded (real past 5 years history data). 
To see all the filtering features in action I had to add fake items.json path. so adding files on heroku is not working until I add another dyno
or build another RESTful endpoints app and serve it from heroku. The fake RESTful API services run locally just fine.

## Installation


* Fire json server `npm run json-server`
* Ensure you have Node 4.4+ and NPM 3+ installed. `sudo n 6.9.0`
* Install YARN `npm i -g yarn`
* Install Angular CLI `yarn global add angular-cli@latest`
* Install Typescript 2.0 `yarn global add typescript`
* Install TSLint `yarn global add tslint`
* Install Protractor for e2e testing `yarn global add protractor`
* Install Node packages `yarn i`
* Update Webdriver `webdriver-manager update` and `./node_modules/.bin/webdriver-manager update`
* Run local build `ng serve`




