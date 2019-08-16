import * as express from 'express';
import bodyParser = require('body-parser');
import { initFeatureData } from './dataprovider';
import { router } from './router';
import Library from './models/library';
import Cart from './models/cart';

let libraryData = initFeatureData("movies")
let cartData = initFeatureData("cart")

const app = express()

app
  .set("port", 3000)
  .use(bodyParser.json())
  .use(router)

Promise.all([libraryData.isLoaded, cartData.isLoaded])
  .then(() => {
    console.log("CART DATA", cartData.database)
    app.set("library", new Library(libraryData.database))
    app.set("cart", new Cart(cartData.database))
    app.set("baseUrl", "http://localhost")
    app.listen(app.get("port"), () => {
      console.log(("  App is running at http://localhost:%d"), app.get("port"));
      console.log("  Press CTRL-C to stop\n");
    });
  })

export default app