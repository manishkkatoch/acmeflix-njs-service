import { Response, Application } from "express";

export class UrlBuilder {
  private app: Application;
  constructor(application: Application) { this.app = application }
  build(uri: string): string {
    return `${this.app.get('baseUrl')}:${this.app.get('port')}${uri}`
  }
}
export const makeUrl = (app: Application, uri: string) => `${app.get('baseUrl')}:${app.get('port')}${uri}`

export const jsonType = (type: string) => `vnd.acmeflix.api.${type}+json`

export const errorResponse = (res: Response, code: number) => {
  res.statusCode = code
  res.end()
}