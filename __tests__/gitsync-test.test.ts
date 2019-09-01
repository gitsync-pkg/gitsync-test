import * as fs from 'fs';
import {createRepo, removeRepos} from '..';
import {Git} from "ts-git";

describe('Gitsync test package', () => {
  test('createRepo', async () => {
    const repo1 = await createRepo();
    const repo2 = await createRepo();

    expect(repo1).toBeInstanceOf(Git);
    expect(repo2).toBeInstanceOf(Git);

    expect(repo1).not.toEqual(repo2);

    removeRepos();
  });

  test('removeRepos', async () => {
    const repo = await createRepo();
    expect(fs.existsSync(repo.dir)).toBeTruthy();

    removeRepos();
    expect(fs.existsSync(repo.dir)).toBeFalsy();
  });
});
