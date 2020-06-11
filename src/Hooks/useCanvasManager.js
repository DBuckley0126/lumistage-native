import React, { useEffect, useState, useRef } from 'react';
import { useSpring, animated, interpolate } from 'react-spring';
import { useSelector } from 'react-redux';

const useCanvasManager = (pixelGridSize = { width: 25, height: 25 }) => {
  const [currentEffect, setCurrentEffect] = useState({ name: null, config: {} });
  const pixelGrid = [];
  const updatePixelGrid = () => {
    for (let rowInt = 0; rowInt < pixelGridSize.height; rowInt++) {
      for (let columnInt = 0; columnInt < pixelGridSize.width; columnInt++) {
        pixelGrid.push({})
      }
    }
  };
  useEffect(() => {
    updatePixelGrid();
  }, [currentEffect, updatePixelGrid]);

  return { pixelGrid, setCurrentEffect };
};

export default useCanvasManager;
