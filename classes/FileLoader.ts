import * as fs from "fs";
import * as path from "path";
import { TinkoffAPI } from "./Tinkoff";

export class TradeFileLoader {
  getShaders() {
    const fragment = fs.readFileSync(
      path.join("shaders/fragment.glsl"),
      "utf8"
    );
    const vertex = fs.readFileSync(path.join("shaders/vertex.glsl"), "utf8");
    return {
      fragment,
      vertex,
    };
  }

  async getCachedFiles(dirs: string[] = []) {
    const files = await fs.promises.readdir(
      path.join(TinkoffAPI.cacheDir, "candles", ...dirs)
    );
    return files;
  }
}
