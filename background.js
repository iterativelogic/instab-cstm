const browser = chrome || browser;

let settings = {
  addUsername: false,
  separator: '_'
};

const setSettings = (result) => {
  const { instabSettings } = result || {};

  settings = instabSettings || settings;

  if (!instabSettings)
    browser.storage.sync.set({ instabSettings: settings });
};

const updateSettings = (result) => {
  const { instabSettings } = result || {};
  const { newValue } = instabSettings || {};
  settings = newValue || settings;
};

const getFilename = (url, username) => {
  const { addUsername, separator } = settings;
  if (!addUsername) return false;

  const urlObject = new URL(url);
  const originalFilename = urlObject.pathname.split('/').pop();
  const dpath = `${username}${separator}${originalFilename}`;
  console.info(dpath)
  return dpath;
};

const downloadMedia = ({ url, username }) => {
  const filename = getFilename(url, username);

  browser.downloads.download({
    url: url,
    ...(filename && { filename })
  });
};

browser.storage.sync.get('instabSettings', setSettings);
browser.storage.onChanged.addListener(updateSettings);

browser.runtime.onMessage.addListener(downloadMedia);
