const { jsonSafeParse, normalizeHttpResponse } = require('@middy/util')

const defaults = {
  logger: console.error,
  fallbackMessage: null,
  forceJSONResponse: false
}

const httpErrorHandlerMiddleware = (opts = {}) => {
  const options = { ...defaults, ...opts }

  const httpErrorHandlerMiddlewareOnError = async (request) => {
    if (typeof options.logger === 'function') {
      options.logger(request.error)
    }

    // Set default expose value, only passes in when there is an override
    if (request.error?.statusCode && request.error?.expose === undefined) {
      request.error.expose = request.error.statusCode < 500
    }

    // Non-http error OR expose set to false
    if (
      options.fallbackMessage &&
      (!request.error?.statusCode || !request.error?.expose)
    ) {
      request.error = {
        statusCode: 500,
        message: options.fallbackMessage,
        expose: true
      }
    }

    if (request.error?.expose) {
      request.response = normalizeHttpResponse(request.response)
      request.response.statusCode = request.error?.statusCode
      
      let body = '';
      if (forceJSONResponse) {
        request.response.body = typeof jsonSafeParse(request.error?.message) === 'string' ? JSON.stringify({ message: request.error?.message || "" }) : JSON.stringify(request.error?.message || {});
      } else {
        request.response.body = request.error?.message
      }
      request.response.headers['Content-Type'] =
        typeof jsonSafeParse(request.response.body) === 'string'
          ? 'text/plain'
          : 'application/json'

      return request.response
    }
  }

  return {
    onError: httpErrorHandlerMiddlewareOnError
  }
}
module.exports = httpErrorHandlerMiddleware
