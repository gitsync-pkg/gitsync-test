import * as path from "path";
import * as util from "util";
import * as fs from "fs";
import * as rimraf from "rimraf";
import * as log from 'npmlog';
import chalk from "chalk";
import Repo from "./Repo";
import {Git} from "git-cli-wrapper";
import {CommandModule} from "yargs";

const baseDir = path.resolve('data');
let nameIndex = 1;
let cwd: string;

export function changeDir(repo: Git) {
  cwd = process.cwd();
  process.chdir(repo.dir);
}

export function resetDir() {
  process.chdir(cwd);
}

export function disableColor() {
  log.disableColor();
  chalk.enabled = false;
}

export async function createRepo(bare: boolean = false) {
  const repoDir = path.join(baseDir, (nameIndex++).toString());
  await util.promisify(fs.mkdir)(repoDir, {recursive: true});

  const repo = new Repo(repoDir);

  let init = ['init'];
  if (bare) {
    init.push('--bare');
  }

  await repo.run(init);

  return repo;
};

export function removeRepos() {
  return util.promisify(rimraf)(baseDir);
}

export async function runCommand(command: CommandModule, source: Repo, options: any = {}) {
  changeDir(source);
  await command.handler(Object.assign({
    $0: '',
    _: [],
  }, options));
  resetDir();
}

export function logMessage(): string {
  return log.record.reduce((message: string, record): string => {
    return message + "\n" + record.message;
  }, '');
}

export async function catchError(fn: Function) {
  let error;
  try {
    await fn();
  } catch (e) {
    error = e;
  }
  return error;
}
