import { HttpError } from './models/index';

const ErrorManager = {
  axiosErrorHandler: (response) => {
    let httpError = null;
    switch (response.status) {
      case 400:
        httpError = HttpError(response.status, 'Bad request', response);
        console.log(httpError);
        return Promise.reject(httpError);
      case 401:
        httpError = HttpError(response.status, 'Request was not authorized', response);
        console.log(httpError);
        return Promise.reject(httpError);
      case 403:
        httpError = HttpError(response.status, 'Request is forbidden', response);
        console.log(httpError);
        return Promise.reject(httpError);
      case 404:
        httpError = HttpError(response.status, 'Resource not found', response);
        console.log(httpError);
        return Promise.reject(httpError);
      case 422:
        httpError = HttpError(response.status, 'Unprocessable entity', response);
        console.log(httpError);
        return Promise.reject(httpError);
      case 500:
        httpError = HttpError(response.status, 'Internal server error', response);
        console.log(httpError);
        return Promise.reject(httpError);
      default:
        httpError = HttpError(response.status, 'Unknown Error', response);
        console.log(httpError);
        return Promise.reject(httpError);
    }
  },
};


export default ErrorManager;
