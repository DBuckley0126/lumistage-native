/* eslint-disable no-console */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
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

import Env from '../Env';
import DeviceManager from './helpers/DeviceManager';
import DeviceDiscoveryManager from './helpers/DeviceDiscoveryManager';
import Colours from './helpers/Colours';
import { NanoleafPanel } from './helpers/models/index';

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

  // Only run on App startup
  useEffect(() => {
    console.log(`Environment: ${Env.ENVIRONMENT}`);
    // @ts-ignore
    console.log(global.HermesInternal == null ? 'Engine: Default' : 'Engine: Hermes');
  }, []);

  const authenticating = useSelector((state) => state.app.authenticating);
  const ssdpSearching = useSelector((state) => state.app.ssdpSearching);

  const findDevices = async () => {
    const devices = await DeviceDiscoveryManager.discoverNanoleafs(dispatch);
    console.log(devices);
    if (devices[0]) {
      const nanoleafDeviceManager = new DeviceManager(dispatch, devices[0]);
      if (!nanoleafDeviceManager.authenticated) {
        nanoleafDeviceManager.setupUser();
      }
    }
  };

  const testAuthentication = async () => {
    const manager = managers[Object.keys(managers)[0]];

    console.log(manager.authenticated);
    const infomationResponse = await manager.lightInterface.infomation;
    console.log(infomationResponse);
    const powerStatusResponse = await manager.lightInterface.powerStatus;
    console.log(powerStatusResponse);
  };

  const turnOn = () => {
    const manager = managers[Object.keys(managers)[0]];
    manager.lightInterface.turnOn();
  };

  const turnOff = () => {
    const manager = managers[Object.keys(managers)[0]];
    manager.lightInterface.turnOff();
  };

  const streamControl = () => {
    const manager = managers[Object.keys(managers)[0]];
    manager.activateStreamControl();
  };

  const streamChange = () => {
    const manager = managers[Object.keys(managers)[0]];
    const panel1 = new NanoleafPanel('PANEL', 6, 255, 0, 255, 0, { transition: 1 });
    const panel2 = new NanoleafPanel('PANEL', 107, 255, 255, 0, 0, { transition: 1 });
    const panel3 = new NanoleafPanel('PANEL', 165, 0, 255, 255, 0, { transition: 1 });
    manager.lightInterface.updateThroughStreamControl([panel1, panel2, panel3]);
  };

  const testStreamControl = () => {
    const manager = managers[Object.keys(managers)[0]];
    console.log(manager.extStreamControlActive);
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
                findDevices();
              }}
              title="Find devices"
            />
            <Button
              onPress={() => {
                testAuthentication();
              }}
              title="Test Authentication"
            />
            <Button
              onPress={() => {
                turnOn();
              }}
              title="Turn on"
            />
            <Button
              onPress={() => {
                turnOff();
              }}
              title="Turn Off"
            />
            <Button
              onPress={() => {
                streamControl();
              }}
              title="Activate stream control"
            />
            <Button
              onPress={() => {
                streamChange();
              }}
              title="Change stream"
            />
            <Button
              onPress={() => {
                testStreamControl();
              }}
              title="Test stream control"
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
