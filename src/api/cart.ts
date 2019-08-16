import Library from '../models/library';
import Cart from '../models/cart';
import { errorResponse, jsonType, UrlBuilder } from './utils';
import Resource from '../models/resource';
import Link from '../models/link';

import {
    NextFunction,
    Request,
    RequestHandler,
    Response
} from 'express';
import { json } from 'body-parser';

export const cartAddRequestHandler: RequestHandler =
    (req: Request, res: Response, next: NextFunction): void => {
        let app = req.app
        let library = <Library>app.get("library")
        let cart = <Cart>app.get("cart")
            
        let movieId = req.body["movieId"]
        if (!library.hasMovieById(movieId) || !library.inStock(movieId)) {
            errorResponse(res, 400)
            res.send()
        }
        cart.addToCart(movieId)
        cartGetRequestHandler(req, res, next)
    }

export const cartDeleteRequestHandler: RequestHandler =
    (req: Request, res: Response, next: NextFunction): void => {
        let app = req.app
        let cart = <Cart>app.get("cart")
        let movieId = req.body["movieId"]
        cart.removeFromCart(movieId)
        cartGetRequestHandler(req, res, next)
    }
export const cartGetRequestHandler: RequestHandler =
    (req: Request, res: Response, next: NextFunction): void => {
        let app = req.app
        let urlBuilder = new UrlBuilder(app)
        let library = <Library>app.get("library")
        let cart = <Cart>app.get("cart")
        let projection = cart.getCartItems()
            .map((movieId) => library.getMovieProjectionById(movieId))
        let cartResource = {
            count: projection.length,
            items: projection.map((movie) => {
                let resource = new Resource<{}>(movie, urlBuilder.build(`/movies/${movie.id}`), (new Map()).set("type", jsonType("movies")))
                
                let posterLink = new Link("poster", urlBuilder.build(`/poster/${movie.id}`))
                posterLink.addAttribute("type", "image/jpeg")
                resource.addLink(posterLink)

                let deleteLink = new Link("delete", urlBuilder.build(`/cart/${cart.id}`))
                deleteLink.addAttribute("method", "DELETE")
                deleteLink.addAttribute("type", jsonType("cart"))
                deleteLink.addAttribute("parameters", {
                    "movieId": movie.id
                })
                resource.addLink(deleteLink)
                return resource.json()
            })
        }
        let resource = new Resource(cartResource, urlBuilder.build((req.url)))
        let addLink = new Link("add", urlBuilder.build(`/cart/${cart.id}`))
        addLink.addAttribute("type", jsonType("cart"))
        addLink.addAttribute("method", "PUT")
        addLink.addAttribute("parameters", {
            "movieId": "{movieId}"
        })
        resource.addLink(addLink)
        res.json(resource.json())
    }
