import express from "express";
import * as utils from "./core/utils.js";
import * as tiles from "./core/tiles.js";
import * as config from "./config.js";

// Globals ---------------------------------------------------------------------
const app = express();
const db = await tiles.NewDatabase(config.TILES_FILEPATH);

// Routes ----------------------------------------------------------------------
app.get("/tiles/:z/:x/:y.mvt", async (request, response) => {
  try {
    const { data, headers } = await tiles.getTile(
      db,
      request.params.x,
      request.params.y,
      request.params.z
    );
    response.set(headers);
    response.send(data);
  } catch (err) {
    if (err.toString() !== "Error: Tile does not exist") {
      console.error(err);
    }
    response.status(204);
    return response.end();
  }
});

app.get("", async (_, response) => {
  return response.send(
    (await utils.asyncReadFile(config.SERVER_INDEX_FILEPATH))
      .toString()
      .replace("$MAPBOX_API_TOKEN$", config.MAPBOX_API_TOKEN)
      .replace("$PORT$", config.PORT)
  );
});

// Main ------------------------------------------------------------------------
export const run = () => {
  app.listen(config.PORT, () => {
    console.log(`Server is listening at http://localhost:${config.PORT}`);
  });
};