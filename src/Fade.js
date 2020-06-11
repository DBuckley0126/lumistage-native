
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
import Path from './custom_npm_modules/paths-js/src/path';

const inside = require('point-in-polygon');


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
  const componentRef = useRef();
  const [fade, setFade] = useState(true);
  // const fadeSpring = useSpring({
  //   backgroundColor: fade ? 'tomato' : 'green',
  //   transform: fade ? 'scale(1)' : 'scale(2)',
  //   width: 400,
  //   height: 200,
  // });

  const path = Path()
    .moveto(350, 350)
    .lineto(450, 350)
    .lineto(450, 250)
    .lineto(350, 250)
    .closepath();

    const inner = inside([3570, 300], path.points());

  // const transformedPath = path
  //   .translate(0, 100)
  //   .scale(1, 1.5);

  debugger;


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
    // RCTUIManager.measure(findNodeHandle(measureRef.current), (fx, fy, width, height, px, py) => {
    //   console.log(`Component width is: ${width}`);
    //   console.log(`Component height is: ${height}`);
    //   console.log(`X offset to frame: ${fx}`);
    //   console.log(`Y offset to frame: ${fy}`);
    //   console.log(`X offset to page: ${px}`);
    //   console.log(`Y offset to page: ${py}`);
    // });
  //   if (!fade) {
  //     componentRef.current.injectJavaScript(`
  //     color = color === 'red' ? 'green' : 'red'
  //     rad = rad === 20 ? 10 : 20;
  //     true;
  // `);
  //   }
    componentRef.current.injectJavaScript(runFirst);
  });

  const AnimatedView = animated(View);


  const runFirst = `
  const drawMeeee = () => {
   ctx.clearRect(0, 0, 400, 400);
   if (ball.x > canvas.width - rad || ball.x < rad) moveX = -moveX;
   if (ball.y > canvas.height - rad || ball.y < rad) moveY = -moveY;
   ball.x += moveX;
   ball.y += moveY;
   ctx.beginPath();
   ctx.fillStyle = color;
   ctx.arc(ball.x, ball.y, rad, 0, Math.PI * 2);
   ctx.fill();
   ctx.closePath();

   // var imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
   // window.ReactNativeWebView.postMessage(getPixelXY(imgData, 200, 200))
  }
  setInterval(drawMeeee, 16.66);
  true;
`;


  const html = '<canvas id="myCanvas" width="400" height="400" style="border:1px solid #400000;"></canvas>';

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
      <WebView
        ref={componentRef}
        originWhitelist={['*']}
        source={{ html }}
        injectedJavaScript={runFirst}
        onMessage={(event) => {
          console.log(event.nativeEvent.data);
        }}
        onError={(error) => {
          console.log(error);
        }}
      />
    </>
  );
};

export default Fade;
