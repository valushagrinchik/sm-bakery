export const compareVersions = (version: string, currentVersion: string) => {
  const versionArray = version.split('.').map((v) => parseInt(v));
  const currentVersionArray = currentVersion.split('.').map((v) => parseInt(v));
  const compareLength = Math.max(versionArray.length, currentVersionArray.length);
  for (let i = 0; i < compareLength; i++) {
    if (version[i] > currentVersion[i]) {
      return true;
    }
    if (version[i] < currentVersion[i]) {
      return false;
    }
  }
  return true;
};
