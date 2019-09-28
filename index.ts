import * as log from 'npmlog';
import {CommandModule} from "yargs";
import {Git} from "git-cli-wrapper";
import Repo from "./Repo";
import stripAnsi from 'strip-ansi';
import * as tmp from 'tmp-promise'

let cwd: string;

export function changeDir(repo: Git) {
  cwd = process.cwd();
  process.chdir(repo.dir);
}

export function resetDir() {
  process.chdir(cwd);
}

export async function createRepo(bare: boolean = false) {
  const dir = await tmp.dir();
  const repo = new Repo(dir.path);

  let init = ['init'];
  if (bare) {
    init.push('--bare');
  }

  await repo.run(init);

  return repo;
}

export async function runCommand(command: CommandModule, source: Repo, options: any = {}) {
  changeDir(source);
  await command.handler(options);
  resetDir();
}

export function logMessage(): string {
  return stripAnsi(log.record.reduce((message: string, record): string => {
    return message + "\n" + record.message;
  }, ''));
}

export function clearMessage() {
  // @ts-ignore
  log.record = [];
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

export function catchErrorSync(fn: Function) {
  let error;
  try {
    fn();
  } catch (e) {
    error = e;
  }
  return error;
}
