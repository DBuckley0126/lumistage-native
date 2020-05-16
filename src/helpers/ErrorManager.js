import { HttpError } from './models/index';

/**
 * Handles all error processing
 *
 */
const ErrorManager = {
  /**
 * Handles all error processing
 *
 * @param {Object} error Axios error
 * @returns {Promise<HttpError>} Rejected promise containing HttpError object
 */
  axiosErrorHandler: (error) => {
    let httpError = null;
    if (error.code === 'ECONNABORTED') {
      httpError = new HttpError('Unknown', error.message, error);
      console.log(httpError);
      return Promise.reject(httpError);
    }
    const { response } = error;
    const status = response.status ? response.status : 'Unknown';
    switch (status) {
      case 400:
        httpError = new HttpError(status, 'Bad request', response);
        console.log(httpError);
        return Promise.reject(httpError);
      case 401:
        httpError = new HttpError(status, 'Request was not authorized', response);
        console.log(httpError);
        return Promise.reject(httpError);
      case 403:
        httpError = new HttpError(status, 'Request is forbidden', response);
        console.log(httpError);
        return Promise.reject(httpError);
      case 404:
        httpError = new HttpError(status, 'Resource not found', response);
        console.log(httpError);
        return Promise.reject(httpError);
      case 422:
        httpError = new HttpError(status, 'Unprocessable entity', response);
        console.log(httpError);
        return Promise.reject(httpError);
      case 500:
        httpError = new HttpError(status, 'Internal server error', response);
        console.log(httpError);
        return Promise.reject(httpError);
      default:
        httpError = new HttpError(status, 'Unknown Error', response);
        console.log(httpError);
        return Promise.reject(httpError);
    }
  },
};


export default ErrorManager;
