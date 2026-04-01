export class LocalStorageAdapter {
  getItem(key) { return window.localStorage.getItem(key); }
  setItem(key, value) { window.localStorage.setItem(key, value); }
  removeItem(key) { window.localStorage.removeItem(key); }
}
