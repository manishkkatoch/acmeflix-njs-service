import {
  NextFunction,
  Request,
  RequestHandler,
  Response
} from 'express';
import Library from '../models/library';
import { errorResponse, UrlBuilder, jsonType } from './utils';
import Link from '../models/link';
import Resource from '../models/resource';
import Cart from '../models/cart';

export const movieRequestHandler: RequestHandler =
  (req: Request, res: Response, next: NextFunction): void => {
    let app = req.app
    let urlBuilder = new UrlBuilder(app)
    let id = req.params["id"]
    let library = <Library>app.get("library")
    let cart = <Cart>app.get("cart")
    let movie = library.getMovieById(id)

    if (movie === null) {
      errorResponse(res, 404)
      return
    }

    let url = urlBuilder.build(req.url)
    let link = new Link("self", url)
    link.addAttribute("type", jsonType("movie"))
    let resource = new Resource(movie, url).addLink(link)

    if (movie.stock > 0) {
      let rentingEnabled = new Link("rent", urlBuilder.build(`/cart/${cart.id}`))
      rentingEnabled.addAttribute("type", jsonType("cart"))
      rentingEnabled.addAttribute("method", "PUT")
      rentingEnabled.addAttribute("parameters", {
        "movieId": id
      })
      resource.addLink(rentingEnabled)
    }

    if (movie.ratingEnabled) {
      let ratingEnabled = new Link("rate", urlBuilder.build(`/movies/${id}`))
      ratingEnabled.addAttribute("type", jsonType("movie"))
      ratingEnabled.addAttribute("method", "PUT")
      ratingEnabled.addAttribute("parameters", {
        "rating": "{rating}"
      })
      resource.addLink(ratingEnabled)
    }

    let posterLink = new Link("poster", urlBuilder.build(`/poster/${id}`))
    posterLink.addAttribute("type", "image/jpg")
    if (movie.id != "R0S3B") {
      resource.addLink(posterLink)
    }
    res.json(resource.json())
  }

export const movieRatingRequestHandler: RequestHandler =
  (req: Request, res: Response, next: NextFunction): void => {
    console.log("update movie rating request", req.body)
    let app = req.app
    let urlBuilder = new UrlBuilder(app)
    let id = req.params["id"]
    let library = <Library>app.get("library")
    let newRating = req.body["rating"]
    let movie = library.getMovieById(id)
    if (movie && movie.ratingEnabled) {
      library.updateMovieRating(id, newRating)
      res.status(204)
    } else {
      errorResponse(res, 404)
    }
    res.send()
  }    