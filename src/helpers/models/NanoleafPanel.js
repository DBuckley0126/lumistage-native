/**
 * NanoleafPanel containing infomation indivial panel infomation
 * @property {string} type - Type of nanoleaf device ['PANEL', 'CANVAS', 'SHAPE']
 * @property {number} id - Panel ID
 * @property {number} red - RGB red color value [0 - 255]
 * @property {number} green - RGB green color value [0 - 255]
 * @property {number} blue - RGB blue color value [0 - 255]
 * @property {number} white - RGB white color value, leave at 0
 * @property {Object} config - Nanoleaf panel configuration object
 * @property {number} config.transition - Transition time*100ms (1T = 100ms)
 * @property {number} config.orientation - Orientation of the panel
 * @property {number} config.xCoordinate - X coordinate of the centroid of the panel
 * @property {number} config.yCoordinate - Y coordinate of the centroid of the panel
 */
class NanoleafPanel {
  /**
 * Creates NanoleafPanel
 * @param {number} shapeTypeNumber - Number indicating the shape type
 * @param {number} id - Panel ID
 * @param {number} red - RGB red color value [0 - 255]
 * @param {number} green - RGB green color value [0 - 255]
 * @param {number} blue - RGB blue color value [0 - 255]
 * @param {number} [white = 0] - RGB white color value, leave at 0
 * @param {Object} [config = { transition: 0 }] - Nanoleaf panel configuration object
 * @param {number} [config.transition = 1] - Transition time*100ms (1T = 100ms)
 * @param {number} [config.orientation = undefined] - Orientation of the panel
 * @param {number} [config.xCoordinate = undefined] - X coordinate of the centroid of the panel
 * @param {number} [config.yCoordinate = undefined] - Y coordinate of the centroid of the panel
 *
 */
  constructor(shapeTypeNumber, id, red, green, blue, white = 0, config = {
    transition: 1, orientation: undefined, xCoordinate: undefined, yCoordinate: undefined,
  }) {
    this.shapeTypeNumber = shapeTypeNumber;
    this.id = id;
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.white = white;
    this.config = config;
  }

  /**
 * Get stream control version for panel type
 *
 * @return {string} stream control version
 *
 */
  get streamControlVersion() {
    if (this.shapeTypeNumber === 2 || this.shapeTypeNumber === 3 || this.shapeTypeNumber === 4) {
      return 'v2';
    }
    return 'v1';
  }

  /**
 * Get position of panel within layout
 *
 * @return {Object} {orientation: <number>, xCoordinate: <number>, yCoordinate: <number>}
 *
 */
  get position() {
    return {
      orientation: this.config.orientation,
      xCoordinate: this.config.xCoordinate,
      yCoordinate: this.config.yCoordinate,
    };
  }

  /**
 * Get type of panel in reference to shape type number
 *
 * @return {string} Type of panel
 *
 */
  get type() {
    switch (this.shapeTypeNumber) {
      case 0:
        return 'TRIANGLE';
      case 1:
        return 'RHYTHM_MODULE';
      case 2:
        return 'SQUARE';
      case 3:
        return 'CONTROL_SQUARE_PRIMARY';
      case 4:
        return 'CONTROL_SQUARE_PASSIVE';
      case 5:
        return 'POWER_SUPPLY';
      default:
        return undefined;
    }
  }
}

export default NanoleafPanel;
