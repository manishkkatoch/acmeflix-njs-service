import { Router } from 'express';
import { getRoot } from './api';
import { cartAddRequestHandler, cartDeleteRequestHandler, cartGetRequestHandler } from './api/cart';
import { libraryRequestHandler } from './api/library';
import { movieRatingRequestHandler, movieRequestHandler } from './api/movies';
import { posterRequestHandler } from './api/poster';

export const router = Router()
    .get("/", getRoot)
    .get("/library", libraryRequestHandler)

    .get("/movies/:id", movieRequestHandler)
    .put("/movies/:id", movieRatingRequestHandler)
    .get("/poster/:id", posterRequestHandler)

    .get("/cart/:id", cartGetRequestHandler)
    .put("/cart/:id", cartAddRequestHandler)
    .delete("/cart/:id", cartDeleteRequestHandler)
