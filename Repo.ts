import {Git} from "git-cli-wrapper";
import * as fs from "fs";
import * as path from 'path';
import * as util from "util";

export default class Repo extends Git {
  async addFile(filePath: string, content: string = 'test') {
    const file = this.getFile(filePath);

    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) {
      await util.promisify(fs.mkdir)(dir);
    }

    await util.promisify(fs.writeFile)(file, content);
    return this.run(['add', file]);
  }

  async commitFile(path: string, content: string = null, message: string = null) {
    await this.addFile(path, content || path);
    if (!message) {
      const now = new Date();
      message = (fs.existsSync(path) ? 'update' : 'add') + ' ' + path + ' ' + (now.getTime() / 1000);
    }
    return await this.run(['commit', '-am', message])
  }

  getFile(file: string) {
    return this.dir + '/' + file;
  }
}
