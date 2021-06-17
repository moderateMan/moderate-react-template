/**
 * 缓存操作类
 */
class Storage {
  static store =
    process.env.NODE_ENV === "development"
      ? window.localStorage
      : window.sessionStorage;

  /**
   * 获取key对应的缓存
   * @param key
   * @returns {string | null}
   */
  static getStorage(key) {
    let val = this.store.getItem(key);
    return this.deserialize(val);
  }

  /**
   * 设置缓存
   * @param key
   * @param value
   */
  static setStorage(key, value) {
    if (value === undefined) {
      return this.removeStorage(key);
    }
    this.store.setItem(key, this.serialize(value));
    return value;
  }

  /**
   * 设置多个缓存
   * @param args 数组类型，偶数项为key，奇数项为value
   */
  static setMoreStorage(args) {
    if (args.length > 0 && args.length % 2 === 0) {
      for (let i = 0, l = args.length; i < l; i++) {
        if (i % 2 === 0) {
          this.setStorage(args[i], args[i + 1]);
        }
      }
    } else {
      throw new Error("要设置的缓存数据错误");
    }
  }

  /**
   * 移除缓存
   * @param key
   */
  static removeStorage(key) {
    this.store.removeItem(key);
  }

  /**
   * 移除多个缓存
   * @param keys
   */
  static removeMoreStorage(...keys) {
    keys.map((item) => this.removeStorage(item));
  }

  /**
   * 移除所有缓存
   */
  static clear() {
    this.store.clear();
  }

  /**
   * 根据是否有缓存，来设置当前值
   * @param key
   * @param value
   * @returns {string}
   */
  static setValueByItem(key, value) {
    const val = this.getStorage(key);
    const stringVal = this.serialize(val);
    return stringVal ? val : value;
  }

  static existStorage(key) {
    return this.store.getItem(key) !== null;
  }

  //localStorage
  static localStore = window.localStorage;

  /**
   * 获取key对应的缓存
   * @param key
   * @returns {string | null}
   */
  static getLocalStorage(key) {
    let val = this.localStore.getItem(key);
    return this.deserialize(val);
  }

  /**
   * 设置缓存
   * @param key
   * @param value
   */
  static setLocalStorage(key, value) {
    if (value === undefined) {
      return this.removeLocalStorage(key);
    }
    this.localStore.setItem(key, this.serialize(value));
    return value;
  }

  /**
   * 设置多个缓存
   * @param args 数组类型，偶数项为key，奇数项为value
   */
  static setMoreLocalStorage(args) {
    if (args.length > 0 && args.length % 2 === 0) {
      for (let i = 0, l = args.length; i < l; i++) {
        if (i % 2 === 0) {
          this.setLocalStorage(args[i], args[i + 1]);
        }
      }
    } else {
      throw new Error("要设置的缓存数据错误");
    }
  }

  /**
   * 移除缓存
   * @param key
   */
  static removeLocalStorage(key) {
    this.localStore.removeItem(key);
  }

  /**
   * 移除多个缓存
   * @param keys
   */
  static removeMoreLocalStorage(...keys) {
    keys.map((item) => this.removeLocalStorage(item));
  }

  /**
   * 移除所有缓存
   */
  static clearLocal() {
    this.localStore.clear();
  }

  /**
   * 将传入的值序列化成string（对象转换为字节序列的过程）
   * @param val
   * @returns {string}
   */
  static serialize(val) {
    if (typeof val === "string") {
      return val;
    }
    return JSON.stringify(val);
  }

  /**
   * 将string值反序列化（字节序列恢复为对象的过程）
   * @param val
   * @returns {*}
   */
  /**
   * try...catch来进行异常处理
   * try里的代码如果出现问题
   * 会执行catch里的代码
   */

  static deserialize(val) {
    if (typeof val !== "string") {
      return undefined;
    }
    try {
      return JSON.parse(val);
    } catch (e) {
      return val;
    }
  }
}

export default Storage;
