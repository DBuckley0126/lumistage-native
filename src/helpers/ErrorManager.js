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
    const { response } = error;
    let httpError = null;

    switch (response.status) {
      case 400:
        httpError = new HttpError(response.status, 'Bad request', response);
        console.log(httpError);
        return Promise.reject(httpError);
      case 401:
        httpError = new HttpError(response.status, 'Request was not authorized', response);
        console.log(httpError);
        return Promise.reject(httpError);
      case 403:
        httpError = new HttpError(response.status, 'Request is forbidden', response);
        console.log(httpError);
        return Promise.reject(httpError);
      case 404:
        httpError = new HttpError(response.status, 'Resource not found', response);
        console.log(httpError);
        return Promise.reject(httpError);
      case 422:
        httpError = new HttpError(response.status, 'Unprocessable entity', response);
        console.log(httpError);
        return Promise.reject(httpError);
      case 500:
        httpError = new HttpError(response.status, 'Internal server error', response);
        console.log(httpError);
        return Promise.reject(httpError);
      default:
        httpError = new HttpError(response.status, 'Unknown Error', response);
        console.log(httpError);
        return Promise.reject(httpError);
    }
  },
};


export default ErrorManager;
