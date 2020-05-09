/**
 * @property {number} status Http error status code
 * @property {number} message Http error description
 */
class HttpError {
  constructor(statusCode, message, info) {
    this.statusCode = statusCode;
    this.message = message;
    this.info = info;
  }

  // eslint-disable-next-line class-methods-use-this
  get typeOfError() { return true; }
}

export default HttpError;
