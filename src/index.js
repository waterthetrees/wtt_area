import path from "path";
import * as download from "./stages/download.js";
import * as lint from "./stages/lint.js";
import * as convert from "./stages/convert.js";
import * as normalize from "./stages/normalize.js";
import * as concatenate from "./stages/concatenate.js";
import * as tile from "./stages/tile.js";
import * as upload from "./stages/upload.js";
import * as server from "./tile-server.js";
import * as utils from "./core/utils.js";
import * as config from "./config.js";
import sources from "./core/sources.js";

export const runDownload = async () => {
  await download.downloadSources(sources);
};

export const runLint = async () => {
  await lint.lintSources(sources);
};

export const runConvert = async () => {
  await convert.convertDownloadsToGeoJSON(sources);
};

export const runNormalize = async () => {
  await normalize.normalizeSources(sources);
};

export const runConcatenate = async () => {
  const filenames = await utils.asyncReadDir(config.NORMALIZED_DIRECTORY);
  const filepaths = filenames.map((f) =>
    path.join(config.NORMALIZED_DIRECTORY, f)
  );
  concatenate.concatenateFiles(filepaths);
};

export const runTile = async () => {
  await tile.createTiles();
};

export const runUpload = async () => {
  await upload.upload(config.TILES_FILEPATH);
};

export const runTileServer = () => {
  server.run();
};

export const runAll = async () => {
  await runDownload();
  await runLint();
  await runConvert();
  await runNormalize();
  await runConcatenate();
  await runTile();
  await runUpload();
};
