import { NextFunction, Request, RequestHandler, Response } from 'express';
import Link from '../models/link';
import Resource from "../models/resource";
import { jsonType, UrlBuilder } from './utils';

export const libraryRequestHandler: RequestHandler =
  (req: Request, res: Response, next: NextFunction): void => {
    let urlBuilder = new UrlBuilder(req.app)
    let url = urlBuilder.build(req.url)

    let library = req.app.get('library')
    let movies = library.moviesProjection.map(movie => {
      let attributes = (new Map()).set("type", jsonType("movies"))
      let movieResource = new Resource<{}>(movie, urlBuilder.build(`/movies/${movie.id}`), attributes)
      if (movie.id != "R0S3B") {
        let posterLink = new Link("poster", urlBuilder.build(`/poster/${movie.id}`))
        posterLink.addAttribute("type", "image/jpeg")
        movieResource.addLink(posterLink)
      }
      return movieResource.json()
    })

    let libraryResource = new Resource({ count: library.count, movies: movies }, urlBuilder.build("/library"), (new Map()).set("type", jsonType("library")))
    res.json(libraryResource.json())
  }