/* eslint-disable no-console */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { ENVIRONMENT } from 'react-native-dotenv';
import { testButtonGet } from './actions/AppActions';
import DeviceManager from './helpers/DeviceManager';
import DeviceDiscoveryManager from './helpers/DeviceDiscoveryManager';
import Colours from './helpers/Colours';

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colours.white,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colours.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colours.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colours.black,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colours.black,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

const App = () => {
  const dispatch = useDispatch();
  const managers = useSelector((state) => state.deviceManagers.NANOLEAF);

  if (ENVIRONMENT === 'development') {
    console.log('Environment: Development');
    console.log(global.HermesInternal == null ? 'Engine: Default' : 'Engine: Hermes');
  }

  const authenticating = useSelector((state) => state.app.authenticating);
  const ssdpSearching = useSelector((state) => state.app.ssdpSearching);

  const testFunction = async () => {
    const devices = await DeviceDiscoveryManager.discoverNanoleafs(dispatch);
    console.log(devices);
    const nanoleafDeviceManager = new DeviceManager(dispatch, devices[0]);
    nanoleafDeviceManager.setupUser();

    // dispatch(testButtonGet());
  };

  const testAuthentication = async () => {
    const manager = managers[Object.keys(managers)[0]];

    console.log(manager.authenticated);
    const infomation = await manager.lightInfomation;
    console.log(infomation);
    const powerStatus = await manager.powerStaus;
    console.log(powerStatus);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          <View style={styles.body}>
            <Button
              onPress={() => {
                testFunction();
              }}
              title="Press me"
            />
            <Button
              onPress={() => {
                testAuthentication();
              }}
              title="Test Authentication"
            />
            { authenticating ? (
              <Text>Authenticating</Text>
            ) : null}
            { ssdpSearching ? (
              <Text>Searching for devices</Text>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;
