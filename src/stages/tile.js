import { spawn } from "child_process";
import * as config from "../config.js";

// https://github.com/mapbox/tippecanoe
export const createTiles = async () => {
  return new Promise((resolve, _) => {
    const child = spawn(
      "tippecanoe",
      [
        "-zg",
        "--drop-densest-as-needed",
        "--extend-zooms-if-still-dropping",
        "--cluster-distance=10",
        "--accumulate-attribute=id:sum",
        "--name=waterthetrees-tiles",
        "--description=waterthetrees-tiles",
        "-l",
        "data",
        "-o",
        "--force",
        config.TILES_FILEPATH,
        config.CONCATENATED_FILEPATH,
      ],
      {
        stdio: ["ignore", process.stdout, process.stderr],
      }
    );
    child.on("exit", resolve);
  });
};
