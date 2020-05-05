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
import NanoleafApiManager from './helpers/NanoleafApiManager';
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
  if (ENVIRONMENT === 'development') {
    console.log('Envrionment: Development');
    console.log(global.HermesInternal == null ? 'Engine: Default' : 'Engine: Hermes');
  }

  const dispatch = useDispatch();

  const testFunction = async () => {

    const devices = await DeviceDiscoveryManager.discoverNanoleafs();
    console.log(devices);
    // const nanoleafApiManager = new NanoleafApiManager("192.168.0.2");
    // dispatch(testButtonGet());
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

          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;
