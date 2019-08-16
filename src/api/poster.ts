import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as fs from 'fs';

export const posterRequestHandler: RequestHandler =
    (req: Request, res: Response, next: NextFunction): void => {
        let id = req.params["id"]
        //if (id != "R0S3B") {
            var img = fs.readFileSync("./resources/movies/" + id + ".jpg")
            res.writeHead(200, { 'Content-Type': 'image/jpg' })
            res.end(img, 'binary');
       // }
    }