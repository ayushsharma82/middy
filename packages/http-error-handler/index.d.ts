import middy from '@middy/core'

interface Options {
  logger?: (error: any) => void
  fallbackMessage?: string,
  forceJSONResponse: boolean
}

declare function httpErrorHandler (options?: Options): middy.MiddlewareObj

export default httpErrorHandler
