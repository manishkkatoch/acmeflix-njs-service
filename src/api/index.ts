import Resource from "../models/resource";

import { jsonType, UrlBuilder } from './utils';
import Link from '../models/link';
import Cart from '../models/cart';
import {
  NextFunction,
  Request,
  RequestHandler,
  Response
} from 'express';

export const getRoot: RequestHandler =
  (req: Request, res: Response, next: NextFunction): void => {
    let cart = <Cart>req.app.get("cart")
    let urlBuilder = new UrlBuilder(req.app)
    let resource = new Resource({}, urlBuilder.build("/"))
    
    let libraryLink = new Link("library", urlBuilder.build("/library"))
    libraryLink.addAttribute("type", jsonType("library"))
    resource.addLink(libraryLink)
    console.log(cart, cart.getCartItems(), cart.isEmpty())
    if (!cart.isEmpty()) {
      let cartLink = new Link("cart", urlBuilder.build(`/cart/${cart.id}`))
      cartLink.addAttribute("type", jsonType("cart"))
      resource.addLink(cartLink)
    }
    console.log(resource.json())
    res.json(resource.json())
  }