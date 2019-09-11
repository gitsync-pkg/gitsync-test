import * as fs from 'fs';
import {createRepo, removeRepos, logMessage, clearMessage} from '..';
import {Git} from "git-cli-wrapper";
import * as npmlog from "npmlog";

describe('Gitsync test package', () => {
  test('createRepo', async () => {
    const repo1 = await createRepo();
    const repo2 = await createRepo();

    expect(repo1).toBeInstanceOf(Git);
    expect(repo2).toBeInstanceOf(Git);

    expect(repo1).not.toEqual(repo2);

    await removeRepos();
  });

  test('removeRepos', async () => {
    const repo = await createRepo();
    expect(fs.existsSync(repo.dir)).toBeTruthy();

    await removeRepos();
    expect(fs.existsSync(repo.dir)).toBeFalsy();
  });

  test('clearMessage', async () => {
    npmlog.info('prefix', 'message');
    expect(logMessage()).toContain('message');

    clearMessage();
    expect(logMessage()).not.toContain('message');
  });
});
