import {logMessage, clearMessage, createRepo} from '..';
import {Git} from "git-cli-wrapper";
import * as npmlog from "npmlog";
import * as fs from "fs";

describe('Gitsync test package', () => {
  test('createRepo', async () => {
    const repo1 = await createRepo();
    const repo2 = await createRepo();

    expect(repo1).toBeInstanceOf(Git);
    expect(repo2).toBeInstanceOf(Git);

    expect(repo1).not.toEqual(repo2);
  });

  test('clearMessage', async () => {
    npmlog.info('prefix', 'message');
    expect(logMessage()).toContain('message');

    clearMessage();
    expect(logMessage()).not.toContain('message');
  });

  test('commitFile', async () => {
    const repo = await createRepo();
    await repo.commitFile('test.txt');

    expect(fs.existsSync(repo.getFile('test.txt'))).toBeTruthy();

    expect(await repo.run(['log', '-n', '1'])).toContain('add test.txt');
  });
});
