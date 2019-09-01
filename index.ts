import * as path from "path";
import * as util from "util";
import * as fs from "fs";
import * as rimraf from "rimraf";
import * as log from 'npmlog';
import chalk from "chalk";
import Repo from "./Repo";
import {Git} from "ts-git";
import Sync from "@gitsync/sync";
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
  rimraf(baseDir, (err) => {
    if (err) {
      throw err;
    }
  });
}

export const sync = async (source: Repo, options: any, instance: Sync = null) => {
  changeDir(source);
  const sync = instance || new Sync();
  await sync.sync(Object.assign({
    // TODO
    $0: '',
    _: [],
  }, options));
  resetDir();
};

export async function runCommand(command: CommandModule, source: Repo, options: any) {
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
