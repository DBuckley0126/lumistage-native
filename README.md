# lumistage-native
Synchronise music streaming services to your mood lights.

### iOS
In the root directory
* Install dependencies: `npm install`

In the `ios` directory

* Install Pods: `gem install cocoapods`
* Install Pods: `pod install`
* Install xcpretty: `gem install xcpretty`
* Launch: `open Sample.xcworkspace`

### Android

* To run from command line try: `react-native run-android`

### Tests

The integration tests are run using [Jest](https://jestjs.io/).

To run tests:

* Make sure you have the 9.0 simulators installed in XCode
* Launch simulator and tests: `npm test`

### Compiling

You can compile and put it on the phone with: `npm run install:staging`

Not that there's a staging server at this point, but it's an example of how to compile things via the command line.

## License

MIT