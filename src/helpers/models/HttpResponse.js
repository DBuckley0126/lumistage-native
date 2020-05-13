/**
 * Contains infomation regarding a HTTP response
 * @property {number} status Http status code
 * @property {string} message Http status text
 * @property {Object} data Response data
 */
class HttpResponse {
  /**
 * Creates a HttpResponse
 * @param {number} status Describes the HTTP status code of the response
 * @param {string} message Describes a message of the HTTP response
 * @param {Object} data The data received from the HTTP request
 */
  constructor(status, message, data) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  /**
 * Describes this object as a type of error
 * @returns {boolean} Returns false as this objects is not a type of error
 */
  // eslint-disable-next-line class-methods-use-this
  get typeOfError() { return false; }
}

export default HttpResponse;
