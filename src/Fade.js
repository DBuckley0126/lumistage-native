
import React, { useEffect, useState, useRef } from 'react';
import { useSpring, animated, interpolate } from 'react-spring';
import { WebView } from 'react-native-webview';

import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  findNodeHandle,
  NativeModules,
} from 'react-native';


const RCTUIManager = NativeModules.UIManager;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {},
  btn: {
    backgroundColor: '#FFF',
    color: 'black',
    width: 100,
    height: 80,
    padding: 3,
    justifyContent: 'center',
    borderRadius: 6,
  },
  text: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  item1: {
    backgroundColor: 'red',
    padding: 20,
    width: 100,
    margin: 10,
  },

  textBtn: {
    color: '#f4f4f4',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const Fade = () => {
  let componentRef = useRef();
  const [fade, setFade] = useState(true);
  // const fadeSpring = useSpring({
  //   backgroundColor: fade ? 'tomato' : 'green',
  //   transform: fade ? 'scale(1)' : 'scale(2)',
  //   width: 400,
  //   height: 200,
  // });


  const { xyz, backgroundColor } = useSpring({
    xyz: fade ? [10, 20, 5] : [0, 0, 0],
    backgroundColor: fade ? 'red' : 'blue',
  });


  // const { transform, opacity } = useSpring({
  //   opacity: flipped ? 1 : 0,
  //   transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
  //   config: { mass: 5, tension: 500, friction: 80 }
  // })

  useEffect(() => {
    console.log(componentRef);
    // RCTUIManager.measure(findNodeHandle(measureRef.current), (fx, fy, width, height, px, py) => {
    //   console.log(`Component width is: ${width}`);
    //   console.log(`Component height is: ${height}`);
    //   console.log(`X offset to frame: ${fx}`);
    //   console.log(`Y offset to frame: ${fy}`);
    //   console.log(`X offset to page: ${px}`);
    //   console.log(`Y offset to page: ${py}`);
    // });
  });

  const AnimatedView = animated(View);


  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setFade(!fade);
        }}
        style={styles.btn}
      >
        <Text>Change fade</Text>
      </TouchableOpacity>

      {/* <AnimatedView
        ref={measureRef}
        onLayout={(event) => {
          const { layout } = event.nativeEvent;
          console.log('height:', layout.height);
          console.log('width:', layout.width);
          console.log('x:', layout.x);
          console.log('y:', layout.y);
        }}
        style={{
          backgroundColor,
          height: 100,
          width: 100,
        }}
      >
        <Text>Hello</Text>
      </AnimatedView> */}
      <WebView source={{ uri: 'https://reactnative.dev/' }} />
    </>
  );
};

export default Fade;
