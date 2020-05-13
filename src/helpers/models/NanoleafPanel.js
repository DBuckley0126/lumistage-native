/**
 * NanoleafPanel containing infomation indivial panel infomation
 * @property {string} type - Type of nanoleaf device ['PANEL', 'CANVAS', 'SHAPE']
 * @property {number} id - Panel ID
 * @property {number} red - RGB red color value [0 - 255]
 * @property {number} green - RGB green color value [0 - 255]
 * @property {number} blue - RGB blue color value [0 - 255]
 * @property {number} [white = 0] - RGB white color value, leave at 0
 * @property {Object} [config = { transition: 0 }] - Nanoleaf panel configuration object
 * @property {number} [config.transition = 0] - Transition time*100ms (1T = 100ms)
 */
class NanoleafPanel {
  /**
 * Creates NanoleafPanel
 * @param {string} type - Type of nanoleaf device ['PANEL', 'CANVAS', 'SHAPE']
 * @param {number} id - Panel ID
 * @param {number} red - RGB red color value [0 - 255]
 * @param {number} green - RGB green color value [0 - 255]
 * @param {number} blue - RGB blue color value [0 - 255]
 * @param {number} [white = 0] - RGB white color value, leave at 0
 * @param {Object} [config = { transition: 0 }] - Nanoleaf panel configuration object
 * @param {number} [config.transition = 0] - Transition time*100ms (1T = 100ms)
 */
  constructor(type, id, red, green, blue, white = 0, config = { transition: 0 }) {
    this.type = type;
    this.id = id;
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.white = white;
    this.config = config;
  }
}

export default NanoleafPanel;
