window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  1: [ function(require, module, exports) {
    "use strict";
    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = "undefined" !== typeof Uint8Array ? Uint8Array : Array;
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (var i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b64) {
      var len = b64.length;
      if (len % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
      var validLen = b64.indexOf("=");
      -1 === validLen && (validLen = len);
      var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
      return [ validLen, placeHoldersLen ];
    }
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return 3 * (validLen + placeHoldersLen) / 4 - placeHoldersLen;
    }
    function _byteLength(b64, validLen, placeHoldersLen) {
      return 3 * (validLen + placeHoldersLen) / 4 - placeHoldersLen;
    }
    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0;
      var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
      var i;
      for (i = 0; i < len; i += 4) {
        tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = 255 & tmp;
      }
      if (2 === placeHoldersLen) {
        tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
        arr[curByte++] = 255 & tmp;
      }
      if (1 === placeHoldersLen) {
        tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = 255 & tmp;
      }
      return arr;
    }
    function tripletToBase64(num) {
      return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[63 & num];
    }
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i = start; i < end; i += 3) {
        tmp = (uint8[i] << 16 & 16711680) + (uint8[i + 1] << 8 & 65280) + (255 & uint8[i + 2]);
        output.push(tripletToBase64(tmp));
      }
      return output.join("");
    }
    function fromByteArray(uint8) {
      var tmp;
      var len = uint8.length;
      var extraBytes = len % 3;
      var parts = [];
      var maxChunkLength = 16383;
      for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
      if (1 === extraBytes) {
        tmp = uint8[len - 1];
        parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "==");
      } else if (2 === extraBytes) {
        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
        parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "=");
      }
      return parts.join("");
    }
  }, {} ],
  2: [ function(require, module, exports) {}, {} ],
  3: [ function(require, module, exports) {
    (function(global) {
      "use strict";
      var base64 = require("base64-js");
      var ieee754 = require("ieee754");
      var isArray = require("isarray");
      exports.Buffer = Buffer;
      exports.SlowBuffer = SlowBuffer;
      exports.INSPECT_MAX_BYTES = 50;
      Buffer.TYPED_ARRAY_SUPPORT = void 0 !== global.TYPED_ARRAY_SUPPORT ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();
      exports.kMaxLength = kMaxLength();
      function typedArraySupport() {
        try {
          var arr = new Uint8Array(1);
          arr.__proto__ = {
            __proto__: Uint8Array.prototype,
            foo: function() {
              return 42;
            }
          };
          return 42 === arr.foo() && "function" === typeof arr.subarray && 0 === arr.subarray(1, 1).byteLength;
        } catch (e) {
          return false;
        }
      }
      function kMaxLength() {
        return Buffer.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
      }
      function createBuffer(that, length) {
        if (kMaxLength() < length) throw new RangeError("Invalid typed array length");
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          that = new Uint8Array(length);
          that.__proto__ = Buffer.prototype;
        } else {
          null === that && (that = new Buffer(length));
          that.length = length;
        }
        return that;
      }
      function Buffer(arg, encodingOrOffset, length) {
        if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) return new Buffer(arg, encodingOrOffset, length);
        if ("number" === typeof arg) {
          if ("string" === typeof encodingOrOffset) throw new Error("If encoding is specified then the first argument must be a string");
          return allocUnsafe(this, arg);
        }
        return from(this, arg, encodingOrOffset, length);
      }
      Buffer.poolSize = 8192;
      Buffer._augment = function(arr) {
        arr.__proto__ = Buffer.prototype;
        return arr;
      };
      function from(that, value, encodingOrOffset, length) {
        if ("number" === typeof value) throw new TypeError('"value" argument must not be a number');
        if ("undefined" !== typeof ArrayBuffer && value instanceof ArrayBuffer) return fromArrayBuffer(that, value, encodingOrOffset, length);
        if ("string" === typeof value) return fromString(that, value, encodingOrOffset);
        return fromObject(that, value);
      }
      Buffer.from = function(value, encodingOrOffset, length) {
        return from(null, value, encodingOrOffset, length);
      };
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        Buffer.prototype.__proto__ = Uint8Array.prototype;
        Buffer.__proto__ = Uint8Array;
        "undefined" !== typeof Symbol && Symbol.species && Buffer[Symbol.species] === Buffer && Object.defineProperty(Buffer, Symbol.species, {
          value: null,
          configurable: true
        });
      }
      function assertSize(size) {
        if ("number" !== typeof size) throw new TypeError('"size" argument must be a number');
        if (size < 0) throw new RangeError('"size" argument must not be negative');
      }
      function alloc(that, size, fill, encoding) {
        assertSize(size);
        if (size <= 0) return createBuffer(that, size);
        if (void 0 !== fill) return "string" === typeof encoding ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
        return createBuffer(that, size);
      }
      Buffer.alloc = function(size, fill, encoding) {
        return alloc(null, size, fill, encoding);
      };
      function allocUnsafe(that, size) {
        assertSize(size);
        that = createBuffer(that, size < 0 ? 0 : 0 | checked(size));
        if (!Buffer.TYPED_ARRAY_SUPPORT) for (var i = 0; i < size; ++i) that[i] = 0;
        return that;
      }
      Buffer.allocUnsafe = function(size) {
        return allocUnsafe(null, size);
      };
      Buffer.allocUnsafeSlow = function(size) {
        return allocUnsafe(null, size);
      };
      function fromString(that, string, encoding) {
        "string" === typeof encoding && "" !== encoding || (encoding = "utf8");
        if (!Buffer.isEncoding(encoding)) throw new TypeError('"encoding" must be a valid string encoding');
        var length = 0 | byteLength(string, encoding);
        that = createBuffer(that, length);
        var actual = that.write(string, encoding);
        actual !== length && (that = that.slice(0, actual));
        return that;
      }
      function fromArrayLike(that, array) {
        var length = array.length < 0 ? 0 : 0 | checked(array.length);
        that = createBuffer(that, length);
        for (var i = 0; i < length; i += 1) that[i] = 255 & array[i];
        return that;
      }
      function fromArrayBuffer(that, array, byteOffset, length) {
        array.byteLength;
        if (byteOffset < 0 || array.byteLength < byteOffset) throw new RangeError("'offset' is out of bounds");
        if (array.byteLength < byteOffset + (length || 0)) throw new RangeError("'length' is out of bounds");
        array = void 0 === byteOffset && void 0 === length ? new Uint8Array(array) : void 0 === length ? new Uint8Array(array, byteOffset) : new Uint8Array(array, byteOffset, length);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          that = array;
          that.__proto__ = Buffer.prototype;
        } else that = fromArrayLike(that, array);
        return that;
      }
      function fromObject(that, obj) {
        if (Buffer.isBuffer(obj)) {
          var len = 0 | checked(obj.length);
          that = createBuffer(that, len);
          if (0 === that.length) return that;
          obj.copy(that, 0, 0, len);
          return that;
        }
        if (obj) {
          if ("undefined" !== typeof ArrayBuffer && obj.buffer instanceof ArrayBuffer || "length" in obj) {
            if ("number" !== typeof obj.length || isnan(obj.length)) return createBuffer(that, 0);
            return fromArrayLike(that, obj);
          }
          if ("Buffer" === obj.type && isArray(obj.data)) return fromArrayLike(that, obj.data);
        }
        throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
      }
      function checked(length) {
        if (length >= kMaxLength()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + kMaxLength().toString(16) + " bytes");
        return 0 | length;
      }
      function SlowBuffer(length) {
        +length != length && (length = 0);
        return Buffer.alloc(+length);
      }
      Buffer.isBuffer = function isBuffer(b) {
        return !!(null != b && b._isBuffer);
      };
      Buffer.compare = function compare(a, b) {
        if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) throw new TypeError("Arguments must be Buffers");
        if (a === b) return 0;
        var x = a.length;
        var y = b.length;
        for (var i = 0, len = Math.min(x, y); i < len; ++i) if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      Buffer.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
         case "hex":
         case "utf8":
         case "utf-8":
         case "ascii":
         case "latin1":
         case "binary":
         case "base64":
         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return true;

         default:
          return false;
        }
      };
      Buffer.concat = function concat(list, length) {
        if (!isArray(list)) throw new TypeError('"list" argument must be an Array of Buffers');
        if (0 === list.length) return Buffer.alloc(0);
        var i;
        if (void 0 === length) {
          length = 0;
          for (i = 0; i < list.length; ++i) length += list[i].length;
        }
        var buffer = Buffer.allocUnsafe(length);
        var pos = 0;
        for (i = 0; i < list.length; ++i) {
          var buf = list[i];
          if (!Buffer.isBuffer(buf)) throw new TypeError('"list" argument must be an Array of Buffers');
          buf.copy(buffer, pos);
          pos += buf.length;
        }
        return buffer;
      };
      function byteLength(string, encoding) {
        if (Buffer.isBuffer(string)) return string.length;
        if ("undefined" !== typeof ArrayBuffer && "function" === typeof ArrayBuffer.isView && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) return string.byteLength;
        "string" !== typeof string && (string = "" + string);
        var len = string.length;
        if (0 === len) return 0;
        var loweredCase = false;
        for (;;) switch (encoding) {
         case "ascii":
         case "latin1":
         case "binary":
          return len;

         case "utf8":
         case "utf-8":
         case void 0:
          return utf8ToBytes(string).length;

         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return 2 * len;

         case "hex":
          return len >>> 1;

         case "base64":
          return base64ToBytes(string).length;

         default:
          if (loweredCase) return utf8ToBytes(string).length;
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
        }
      }
      Buffer.byteLength = byteLength;
      function slowToString(encoding, start, end) {
        var loweredCase = false;
        (void 0 === start || start < 0) && (start = 0);
        if (start > this.length) return "";
        (void 0 === end || end > this.length) && (end = this.length);
        if (end <= 0) return "";
        end >>>= 0;
        start >>>= 0;
        if (end <= start) return "";
        encoding || (encoding = "utf8");
        while (true) switch (encoding) {
         case "hex":
          return hexSlice(this, start, end);

         case "utf8":
         case "utf-8":
          return utf8Slice(this, start, end);

         case "ascii":
          return asciiSlice(this, start, end);

         case "latin1":
         case "binary":
          return latin1Slice(this, start, end);

         case "base64":
          return base64Slice(this, start, end);

         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return utf16leSlice(this, start, end);

         default:
          if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
          encoding = (encoding + "").toLowerCase();
          loweredCase = true;
        }
      }
      Buffer.prototype._isBuffer = true;
      function swap(b, n, m) {
        var i = b[n];
        b[n] = b[m];
        b[m] = i;
      }
      Buffer.prototype.swap16 = function swap16() {
        var len = this.length;
        if (len % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
        for (var i = 0; i < len; i += 2) swap(this, i, i + 1);
        return this;
      };
      Buffer.prototype.swap32 = function swap32() {
        var len = this.length;
        if (len % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
        for (var i = 0; i < len; i += 4) {
          swap(this, i, i + 3);
          swap(this, i + 1, i + 2);
        }
        return this;
      };
      Buffer.prototype.swap64 = function swap64() {
        var len = this.length;
        if (len % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
        for (var i = 0; i < len; i += 8) {
          swap(this, i, i + 7);
          swap(this, i + 1, i + 6);
          swap(this, i + 2, i + 5);
          swap(this, i + 3, i + 4);
        }
        return this;
      };
      Buffer.prototype.toString = function toString() {
        var length = 0 | this.length;
        if (0 === length) return "";
        if (0 === arguments.length) return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      };
      Buffer.prototype.equals = function equals(b) {
        if (!Buffer.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
        if (this === b) return true;
        return 0 === Buffer.compare(this, b);
      };
      Buffer.prototype.inspect = function inspect() {
        var str = "";
        var max = exports.INSPECT_MAX_BYTES;
        if (this.length > 0) {
          str = this.toString("hex", 0, max).match(/.{2}/g).join(" ");
          this.length > max && (str += " ... ");
        }
        return "<Buffer " + str + ">";
      };
      Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (!Buffer.isBuffer(target)) throw new TypeError("Argument must be a Buffer");
        void 0 === start && (start = 0);
        void 0 === end && (end = target ? target.length : 0);
        void 0 === thisStart && (thisStart = 0);
        void 0 === thisEnd && (thisEnd = this.length);
        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) throw new RangeError("out of range index");
        if (thisStart >= thisEnd && start >= end) return 0;
        if (thisStart >= thisEnd) return -1;
        if (start >= end) return 1;
        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target) return 0;
        var x = thisEnd - thisStart;
        var y = end - start;
        var len = Math.min(x, y);
        var thisCopy = this.slice(thisStart, thisEnd);
        var targetCopy = target.slice(start, end);
        for (var i = 0; i < len; ++i) if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break;
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        if (0 === buffer.length) return -1;
        if ("string" === typeof byteOffset) {
          encoding = byteOffset;
          byteOffset = 0;
        } else byteOffset > 2147483647 ? byteOffset = 2147483647 : byteOffset < -2147483648 && (byteOffset = -2147483648);
        byteOffset = +byteOffset;
        isNaN(byteOffset) && (byteOffset = dir ? 0 : buffer.length - 1);
        byteOffset < 0 && (byteOffset = buffer.length + byteOffset);
        if (byteOffset >= buffer.length) {
          if (dir) return -1;
          byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (!dir) return -1;
          byteOffset = 0;
        }
        "string" === typeof val && (val = Buffer.from(val, encoding));
        if (Buffer.isBuffer(val)) {
          if (0 === val.length) return -1;
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        }
        if ("number" === typeof val) {
          val &= 255;
          if (Buffer.TYPED_ARRAY_SUPPORT && "function" === typeof Uint8Array.prototype.indexOf) return dir ? Uint8Array.prototype.indexOf.call(buffer, val, byteOffset) : Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
          return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir);
        }
        throw new TypeError("val must be string, number or Buffer");
      }
      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        var indexSize = 1;
        var arrLength = arr.length;
        var valLength = val.length;
        if (void 0 !== encoding) {
          encoding = String(encoding).toLowerCase();
          if ("ucs2" === encoding || "ucs-2" === encoding || "utf16le" === encoding || "utf-16le" === encoding) {
            if (arr.length < 2 || val.length < 2) return -1;
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }
        function read(buf, i) {
          return 1 === indexSize ? buf[i] : buf.readUInt16BE(i * indexSize);
        }
        var i;
        if (dir) {
          var foundIndex = -1;
          for (i = byteOffset; i < arrLength; i++) if (read(arr, i) === read(val, -1 === foundIndex ? 0 : i - foundIndex)) {
            -1 === foundIndex && (foundIndex = i);
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
          } else {
            -1 !== foundIndex && (i -= i - foundIndex);
            foundIndex = -1;
          }
        } else {
          byteOffset + valLength > arrLength && (byteOffset = arrLength - valLength);
          for (i = byteOffset; i >= 0; i--) {
            var found = true;
            for (var j = 0; j < valLength; j++) if (read(arr, i + j) !== read(val, j)) {
              found = false;
              break;
            }
            if (found) return i;
          }
        }
        return -1;
      }
      Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
        return -1 !== this.indexOf(val, byteOffset, encoding);
      };
      Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      };
      Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      };
      function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0;
        var remaining = buf.length - offset;
        if (length) {
          length = Number(length);
          length > remaining && (length = remaining);
        } else length = remaining;
        var strLen = string.length;
        if (strLen % 2 !== 0) throw new TypeError("Invalid hex string");
        length > strLen / 2 && (length = strLen / 2);
        for (var i = 0; i < length; ++i) {
          var parsed = parseInt(string.substr(2 * i, 2), 16);
          if (isNaN(parsed)) return i;
          buf[offset + i] = parsed;
        }
        return i;
      }
      function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
      }
      function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length);
      }
      function latin1Write(buf, string, offset, length) {
        return asciiWrite(buf, string, offset, length);
      }
      function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length);
      }
      function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
      }
      Buffer.prototype.write = function write(string, offset, length, encoding) {
        if (void 0 === offset) {
          encoding = "utf8";
          length = this.length;
          offset = 0;
        } else if (void 0 === length && "string" === typeof offset) {
          encoding = offset;
          length = this.length;
          offset = 0;
        } else {
          if (!isFinite(offset)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
          offset |= 0;
          if (isFinite(length)) {
            length |= 0;
            void 0 === encoding && (encoding = "utf8");
          } else {
            encoding = length;
            length = void 0;
          }
        }
        var remaining = this.length - offset;
        (void 0 === length || length > remaining) && (length = remaining);
        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) throw new RangeError("Attempt to write outside buffer bounds");
        encoding || (encoding = "utf8");
        var loweredCase = false;
        for (;;) switch (encoding) {
         case "hex":
          return hexWrite(this, string, offset, length);

         case "utf8":
         case "utf-8":
          return utf8Write(this, string, offset, length);

         case "ascii":
          return asciiWrite(this, string, offset, length);

         case "latin1":
         case "binary":
          return latin1Write(this, string, offset, length);

         case "base64":
          return base64Write(this, string, offset, length);

         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return ucs2Write(this, string, offset, length);

         default:
          if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
        }
      };
      Buffer.prototype.toJSON = function toJSON() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function base64Slice(buf, start, end) {
        return 0 === start && end === buf.length ? base64.fromByteArray(buf) : base64.fromByteArray(buf.slice(start, end));
      }
      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end);
        var res = [];
        var i = start;
        while (i < end) {
          var firstByte = buf[i];
          var codePoint = null;
          var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
          if (i + bytesPerSequence <= end) {
            var secondByte, thirdByte, fourthByte, tempCodePoint;
            switch (bytesPerSequence) {
             case 1:
              firstByte < 128 && (codePoint = firstByte);
              break;

             case 2:
              secondByte = buf[i + 1];
              if (128 === (192 & secondByte)) {
                tempCodePoint = (31 & firstByte) << 6 | 63 & secondByte;
                tempCodePoint > 127 && (codePoint = tempCodePoint);
              }
              break;

             case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if (128 === (192 & secondByte) && 128 === (192 & thirdByte)) {
                tempCodePoint = (15 & firstByte) << 12 | (63 & secondByte) << 6 | 63 & thirdByte;
                tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343) && (codePoint = tempCodePoint);
              }
              break;

             case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
              if (128 === (192 & secondByte) && 128 === (192 & thirdByte) && 128 === (192 & fourthByte)) {
                tempCodePoint = (15 & firstByte) << 18 | (63 & secondByte) << 12 | (63 & thirdByte) << 6 | 63 & fourthByte;
                tempCodePoint > 65535 && tempCodePoint < 1114112 && (codePoint = tempCodePoint);
              }
            }
          }
          if (null === codePoint) {
            codePoint = 65533;
            bytesPerSequence = 1;
          } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | 1023 & codePoint;
          }
          res.push(codePoint);
          i += bytesPerSequence;
        }
        return decodeCodePointsArray(res);
      }
      var MAX_ARGUMENTS_LENGTH = 4096;
      function decodeCodePointsArray(codePoints) {
        var len = codePoints.length;
        if (len <= MAX_ARGUMENTS_LENGTH) return String.fromCharCode.apply(String, codePoints);
        var res = "";
        var i = 0;
        while (i < len) res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
        return res;
      }
      function asciiSlice(buf, start, end) {
        var ret = "";
        end = Math.min(buf.length, end);
        for (var i = start; i < end; ++i) ret += String.fromCharCode(127 & buf[i]);
        return ret;
      }
      function latin1Slice(buf, start, end) {
        var ret = "";
        end = Math.min(buf.length, end);
        for (var i = start; i < end; ++i) ret += String.fromCharCode(buf[i]);
        return ret;
      }
      function hexSlice(buf, start, end) {
        var len = buf.length;
        (!start || start < 0) && (start = 0);
        (!end || end < 0 || end > len) && (end = len);
        var out = "";
        for (var i = start; i < end; ++i) out += toHex(buf[i]);
        return out;
      }
      function utf16leSlice(buf, start, end) {
        var bytes = buf.slice(start, end);
        var res = "";
        for (var i = 0; i < bytes.length; i += 2) res += String.fromCharCode(bytes[i] + 256 * bytes[i + 1]);
        return res;
      }
      Buffer.prototype.slice = function slice(start, end) {
        var len = this.length;
        start = ~~start;
        end = void 0 === end ? len : ~~end;
        if (start < 0) {
          start += len;
          start < 0 && (start = 0);
        } else start > len && (start = len);
        if (end < 0) {
          end += len;
          end < 0 && (end = 0);
        } else end > len && (end = len);
        end < start && (end = start);
        var newBuf;
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          newBuf = this.subarray(start, end);
          newBuf.__proto__ = Buffer.prototype;
        } else {
          var sliceLen = end - start;
          newBuf = new Buffer(sliceLen, void 0);
          for (var i = 0; i < sliceLen; ++i) newBuf[i] = this[i + start];
        }
        return newBuf;
      };
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
        if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
      }
      Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var val = this[offset];
        var mul = 1;
        var i = 0;
        while (++i < byteLength && (mul *= 256)) val += this[offset + i] * mul;
        return val;
      };
      Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var val = this[offset + --byteLength];
        var mul = 1;
        while (byteLength > 0 && (mul *= 256)) val += this[offset + --byteLength] * mul;
        return val;
      };
      Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        noAssert || checkOffset(offset, 1, this.length);
        return this[offset];
      };
      Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      };
      Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      };
      Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + 16777216 * this[offset + 3];
      };
      Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return 16777216 * this[offset] + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      };
      Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var val = this[offset];
        var mul = 1;
        var i = 0;
        while (++i < byteLength && (mul *= 256)) val += this[offset + i] * mul;
        mul *= 128;
        val >= mul && (val -= Math.pow(2, 8 * byteLength));
        return val;
      };
      Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var i = byteLength;
        var mul = 1;
        var val = this[offset + --i];
        while (i > 0 && (mul *= 256)) val += this[offset + --i] * mul;
        mul *= 128;
        val >= mul && (val -= Math.pow(2, 8 * byteLength));
        return val;
      };
      Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
        noAssert || checkOffset(offset, 1, this.length);
        if (!(128 & this[offset])) return this[offset];
        return -1 * (255 - this[offset] + 1);
      };
      Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        var val = this[offset] | this[offset + 1] << 8;
        return 32768 & val ? 4294901760 | val : val;
      };
      Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        var val = this[offset + 1] | this[offset] << 8;
        return 32768 & val ? 4294901760 | val : val;
      };
      Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      };
      Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      };
      Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      };
      Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      };
      Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        noAssert || checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      };
      Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        noAssert || checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      };
      function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
      }
      Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        byteLength |= 0;
        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength) - 1;
          checkInt(this, value, offset, byteLength, maxBytes, 0);
        }
        var mul = 1;
        var i = 0;
        this[offset] = 255 & value;
        while (++i < byteLength && (mul *= 256)) this[offset + i] = value / mul & 255;
        return offset + byteLength;
      };
      Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        byteLength |= 0;
        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength) - 1;
          checkInt(this, value, offset, byteLength, maxBytes, 0);
        }
        var i = byteLength - 1;
        var mul = 1;
        this[offset + i] = 255 & value;
        while (--i >= 0 && (mul *= 256)) this[offset + i] = value / mul & 255;
        return offset + byteLength;
      };
      Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 1, 255, 0);
        Buffer.TYPED_ARRAY_SUPPORT || (value = Math.floor(value));
        this[offset] = 255 & value;
        return offset + 1;
      };
      function objectWriteUInt16(buf, value, offset, littleEndian) {
        value < 0 && (value = 65535 + value + 1);
        for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) buf[offset + i] = (value & 255 << 8 * (littleEndian ? i : 1 - i)) >>> 8 * (littleEndian ? i : 1 - i);
      }
      Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 65535, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = 255 & value;
          this[offset + 1] = value >>> 8;
        } else objectWriteUInt16(this, value, offset, true);
        return offset + 2;
      };
      Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 65535, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 8;
          this[offset + 1] = 255 & value;
        } else objectWriteUInt16(this, value, offset, false);
        return offset + 2;
      };
      function objectWriteUInt32(buf, value, offset, littleEndian) {
        value < 0 && (value = 4294967295 + value + 1);
        for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) buf[offset + i] = value >>> 8 * (littleEndian ? i : 3 - i) & 255;
      }
      Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 4294967295, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset + 3] = value >>> 24;
          this[offset + 2] = value >>> 16;
          this[offset + 1] = value >>> 8;
          this[offset] = 255 & value;
        } else objectWriteUInt32(this, value, offset, true);
        return offset + 4;
      };
      Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 4294967295, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 24;
          this[offset + 1] = value >>> 16;
          this[offset + 2] = value >>> 8;
          this[offset + 3] = 255 & value;
        } else objectWriteUInt32(this, value, offset, false);
        return offset + 4;
      };
      Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength - 1);
          checkInt(this, value, offset, byteLength, limit - 1, -limit);
        }
        var i = 0;
        var mul = 1;
        var sub = 0;
        this[offset] = 255 & value;
        while (++i < byteLength && (mul *= 256)) {
          value < 0 && 0 === sub && 0 !== this[offset + i - 1] && (sub = 1);
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength;
      };
      Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength - 1);
          checkInt(this, value, offset, byteLength, limit - 1, -limit);
        }
        var i = byteLength - 1;
        var mul = 1;
        var sub = 0;
        this[offset + i] = 255 & value;
        while (--i >= 0 && (mul *= 256)) {
          value < 0 && 0 === sub && 0 !== this[offset + i + 1] && (sub = 1);
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength;
      };
      Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 1, 127, -128);
        Buffer.TYPED_ARRAY_SUPPORT || (value = Math.floor(value));
        value < 0 && (value = 255 + value + 1);
        this[offset] = 255 & value;
        return offset + 1;
      };
      Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 32767, -32768);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = 255 & value;
          this[offset + 1] = value >>> 8;
        } else objectWriteUInt16(this, value, offset, true);
        return offset + 2;
      };
      Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 32767, -32768);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 8;
          this[offset + 1] = 255 & value;
        } else objectWriteUInt16(this, value, offset, false);
        return offset + 2;
      };
      Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 2147483647, -2147483648);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = 255 & value;
          this[offset + 1] = value >>> 8;
          this[offset + 2] = value >>> 16;
          this[offset + 3] = value >>> 24;
        } else objectWriteUInt32(this, value, offset, true);
        return offset + 4;
      };
      Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 2147483647, -2147483648);
        value < 0 && (value = 4294967295 + value + 1);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 24;
          this[offset + 1] = value >>> 16;
          this[offset + 2] = value >>> 8;
          this[offset + 3] = 255 & value;
        } else objectWriteUInt32(this, value, offset, false);
        return offset + 4;
      };
      function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
        if (offset < 0) throw new RangeError("Index out of range");
      }
      function writeFloat(buf, value, offset, littleEndian, noAssert) {
        noAssert || checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
        ieee754.write(buf, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }
      Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      };
      Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      };
      function writeDouble(buf, value, offset, littleEndian, noAssert) {
        noAssert || checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
        ieee754.write(buf, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }
      Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      };
      Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      };
      Buffer.prototype.copy = function copy(target, targetStart, start, end) {
        start || (start = 0);
        end || 0 === end || (end = this.length);
        targetStart >= target.length && (targetStart = target.length);
        targetStart || (targetStart = 0);
        end > 0 && end < start && (end = start);
        if (end === start) return 0;
        if (0 === target.length || 0 === this.length) return 0;
        if (targetStart < 0) throw new RangeError("targetStart out of bounds");
        if (start < 0 || start >= this.length) throw new RangeError("sourceStart out of bounds");
        if (end < 0) throw new RangeError("sourceEnd out of bounds");
        end > this.length && (end = this.length);
        target.length - targetStart < end - start && (end = target.length - targetStart + start);
        var len = end - start;
        var i;
        if (this === target && start < targetStart && targetStart < end) for (i = len - 1; i >= 0; --i) target[i + targetStart] = this[i + start]; else if (len < 1e3 || !Buffer.TYPED_ARRAY_SUPPORT) for (i = 0; i < len; ++i) target[i + targetStart] = this[i + start]; else Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
        return len;
      };
      Buffer.prototype.fill = function fill(val, start, end, encoding) {
        if ("string" === typeof val) {
          if ("string" === typeof start) {
            encoding = start;
            start = 0;
            end = this.length;
          } else if ("string" === typeof end) {
            encoding = end;
            end = this.length;
          }
          if (1 === val.length) {
            var code = val.charCodeAt(0);
            code < 256 && (val = code);
          }
          if (void 0 !== encoding && "string" !== typeof encoding) throw new TypeError("encoding must be a string");
          if ("string" === typeof encoding && !Buffer.isEncoding(encoding)) throw new TypeError("Unknown encoding: " + encoding);
        } else "number" === typeof val && (val &= 255);
        if (start < 0 || this.length < start || this.length < end) throw new RangeError("Out of range index");
        if (end <= start) return this;
        start >>>= 0;
        end = void 0 === end ? this.length : end >>> 0;
        val || (val = 0);
        var i;
        if ("number" === typeof val) for (i = start; i < end; ++i) this[i] = val; else {
          var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
          var len = bytes.length;
          for (i = 0; i < end - start; ++i) this[i + start] = bytes[i % len];
        }
        return this;
      };
      var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
      function base64clean(str) {
        str = stringtrim(str).replace(INVALID_BASE64_RE, "");
        if (str.length < 2) return "";
        while (str.length % 4 !== 0) str += "=";
        return str;
      }
      function stringtrim(str) {
        if (str.trim) return str.trim();
        return str.replace(/^\s+|\s+$/g, "");
      }
      function toHex(n) {
        if (n < 16) return "0" + n.toString(16);
        return n.toString(16);
      }
      function utf8ToBytes(string, units) {
        units = units || Infinity;
        var codePoint;
        var length = string.length;
        var leadSurrogate = null;
        var bytes = [];
        for (var i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i);
          if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
              if (codePoint > 56319) {
                (units -= 3) > -1 && bytes.push(239, 191, 189);
                continue;
              }
              if (i + 1 === length) {
                (units -= 3) > -1 && bytes.push(239, 191, 189);
                continue;
              }
              leadSurrogate = codePoint;
              continue;
            }
            if (codePoint < 56320) {
              (units -= 3) > -1 && bytes.push(239, 191, 189);
              leadSurrogate = codePoint;
              continue;
            }
            codePoint = 65536 + (leadSurrogate - 55296 << 10 | codePoint - 56320);
          } else leadSurrogate && (units -= 3) > -1 && bytes.push(239, 191, 189);
          leadSurrogate = null;
          if (codePoint < 128) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
          } else if (codePoint < 2048) {
            if ((units -= 2) < 0) break;
            bytes.push(codePoint >> 6 | 192, 63 & codePoint | 128);
          } else if (codePoint < 65536) {
            if ((units -= 3) < 0) break;
            bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, 63 & codePoint | 128);
          } else {
            if (!(codePoint < 1114112)) throw new Error("Invalid code point");
            if ((units -= 4) < 0) break;
            bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, 63 & codePoint | 128);
          }
        }
        return bytes;
      }
      function asciiToBytes(str) {
        var byteArray = [];
        for (var i = 0; i < str.length; ++i) byteArray.push(255 & str.charCodeAt(i));
        return byteArray;
      }
      function utf16leToBytes(str, units) {
        var c, hi, lo;
        var byteArray = [];
        for (var i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0) break;
          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }
        return byteArray;
      }
      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
      }
      function blitBuffer(src, dst, offset, length) {
        for (var i = 0; i < length; ++i) {
          if (i + offset >= dst.length || i >= src.length) break;
          dst[i + offset] = src[i];
        }
        return i;
      }
      function isnan(val) {
        return val !== val;
      }
    }).call(this, "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {
    "base64-js": 1,
    ieee754: 7,
    isarray: 4
  } ],
  4: [ function(require, module, exports) {
    var toString = {}.toString;
    module.exports = Array.isArray || function(arr) {
      return "[object Array]" == toString.call(arr);
    };
  }, {} ],
  5: [ function(require, module, exports) {
    (function(Buffer) {
      function isArray(arg) {
        if (Array.isArray) return Array.isArray(arg);
        return "[object Array]" === objectToString(arg);
      }
      exports.isArray = isArray;
      function isBoolean(arg) {
        return "boolean" === typeof arg;
      }
      exports.isBoolean = isBoolean;
      function isNull(arg) {
        return null === arg;
      }
      exports.isNull = isNull;
      function isNullOrUndefined(arg) {
        return null == arg;
      }
      exports.isNullOrUndefined = isNullOrUndefined;
      function isNumber(arg) {
        return "number" === typeof arg;
      }
      exports.isNumber = isNumber;
      function isString(arg) {
        return "string" === typeof arg;
      }
      exports.isString = isString;
      function isSymbol(arg) {
        return "symbol" === typeof arg;
      }
      exports.isSymbol = isSymbol;
      function isUndefined(arg) {
        return void 0 === arg;
      }
      exports.isUndefined = isUndefined;
      function isRegExp(re) {
        return "[object RegExp]" === objectToString(re);
      }
      exports.isRegExp = isRegExp;
      function isObject(arg) {
        return "object" === typeof arg && null !== arg;
      }
      exports.isObject = isObject;
      function isDate(d) {
        return "[object Date]" === objectToString(d);
      }
      exports.isDate = isDate;
      function isError(e) {
        return "[object Error]" === objectToString(e) || e instanceof Error;
      }
      exports.isError = isError;
      function isFunction(arg) {
        return "function" === typeof arg;
      }
      exports.isFunction = isFunction;
      function isPrimitive(arg) {
        return null === arg || "boolean" === typeof arg || "number" === typeof arg || "string" === typeof arg || "symbol" === typeof arg || "undefined" === typeof arg;
      }
      exports.isPrimitive = isPrimitive;
      exports.isBuffer = Buffer.isBuffer;
      function objectToString(o) {
        return Object.prototype.toString.call(o);
      }
    }).call(this, {
      isBuffer: require("../../is-buffer/index.js")
    });
  }, {
    "../../is-buffer/index.js": 9
  } ],
  6: [ function(require, module, exports) {
    function EventEmitter() {
      this._events = this._events || {};
      this._maxListeners = this._maxListeners || void 0;
    }
    module.exports = EventEmitter;
    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.prototype._events = void 0;
    EventEmitter.prototype._maxListeners = void 0;
    EventEmitter.defaultMaxListeners = 10;
    EventEmitter.prototype.setMaxListeners = function(n) {
      if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError("n must be a positive number");
      this._maxListeners = n;
      return this;
    };
    EventEmitter.prototype.emit = function(type) {
      var er, handler, len, args, i, listeners;
      this._events || (this._events = {});
      if ("error" === type && (!this._events.error || isObject(this._events.error) && !this._events.error.length)) {
        er = arguments[1];
        if (er instanceof Error) throw er;
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ")");
        err.context = er;
        throw err;
      }
      handler = this._events[type];
      if (isUndefined(handler)) return false;
      if (isFunction(handler)) switch (arguments.length) {
       case 1:
        handler.call(this);
        break;

       case 2:
        handler.call(this, arguments[1]);
        break;

       case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;

       default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
      } else if (isObject(handler)) {
        args = Array.prototype.slice.call(arguments, 1);
        listeners = handler.slice();
        len = listeners.length;
        for (i = 0; i < len; i++) listeners[i].apply(this, args);
      }
      return true;
    };
    EventEmitter.prototype.addListener = function(type, listener) {
      var m;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      this._events || (this._events = {});
      this._events.newListener && this.emit("newListener", type, isFunction(listener.listener) ? listener.listener : listener);
      this._events[type] ? isObject(this._events[type]) ? this._events[type].push(listener) : this._events[type] = [ this._events[type], listener ] : this._events[type] = listener;
      if (isObject(this._events[type]) && !this._events[type].warned) {
        m = isUndefined(this._maxListeners) ? EventEmitter.defaultMaxListeners : this._maxListeners;
        if (m && m > 0 && this._events[type].length > m) {
          this._events[type].warned = true;
          console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[type].length);
          "function" === typeof console.trace && console.trace();
        }
      }
      return this;
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.once = function(type, listener) {
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      var fired = false;
      function g() {
        this.removeListener(type, g);
        if (!fired) {
          fired = true;
          listener.apply(this, arguments);
        }
      }
      g.listener = listener;
      this.on(type, g);
      return this;
    };
    EventEmitter.prototype.removeListener = function(type, listener) {
      var list, position, length, i;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      if (!this._events || !this._events[type]) return this;
      list = this._events[type];
      length = list.length;
      position = -1;
      if (list === listener || isFunction(list.listener) && list.listener === listener) {
        delete this._events[type];
        this._events.removeListener && this.emit("removeListener", type, listener);
      } else if (isObject(list)) {
        for (i = length; i-- > 0; ) if (list[i] === listener || list[i].listener && list[i].listener === listener) {
          position = i;
          break;
        }
        if (position < 0) return this;
        if (1 === list.length) {
          list.length = 0;
          delete this._events[type];
        } else list.splice(position, 1);
        this._events.removeListener && this.emit("removeListener", type, listener);
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function(type) {
      var key, listeners;
      if (!this._events) return this;
      if (!this._events.removeListener) {
        0 === arguments.length ? this._events = {} : this._events[type] && delete this._events[type];
        return this;
      }
      if (0 === arguments.length) {
        for (key in this._events) {
          if ("removeListener" === key) continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = {};
        return this;
      }
      listeners = this._events[type];
      if (isFunction(listeners)) this.removeListener(type, listeners); else if (listeners) while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
      delete this._events[type];
      return this;
    };
    EventEmitter.prototype.listeners = function(type) {
      var ret;
      ret = this._events && this._events[type] ? isFunction(this._events[type]) ? [ this._events[type] ] : this._events[type].slice() : [];
      return ret;
    };
    EventEmitter.prototype.listenerCount = function(type) {
      if (this._events) {
        var evlistener = this._events[type];
        if (isFunction(evlistener)) return 1;
        if (evlistener) return evlistener.length;
      }
      return 0;
    };
    EventEmitter.listenerCount = function(emitter, type) {
      return emitter.listenerCount(type);
    };
    function isFunction(arg) {
      return "function" === typeof arg;
    }
    function isNumber(arg) {
      return "number" === typeof arg;
    }
    function isObject(arg) {
      return "object" === typeof arg && null !== arg;
    }
    function isUndefined(arg) {
      return void 0 === arg;
    }
  }, {} ],
  7: [ function(require, module, exports) {
    exports.read = function(buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = 8 * nBytes - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (;nBits > 0; e = 256 * e + buffer[offset + i], i += d, nBits -= 8) ;
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (;nBits > 0; m = 256 * m + buffer[offset + i], i += d, nBits -= 8) ;
      if (0 === e) e = 1 - eBias; else {
        if (e === eMax) return m ? NaN : Infinity * (s ? -1 : 1);
        m += Math.pow(2, mLen);
        e -= eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = 8 * nBytes - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = 23 === mLen ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || 0 === value && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || Infinity === value) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        value += e + eBias >= 1 ? rt / c : rt * Math.pow(2, 1 - eBias);
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e += eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (;mLen >= 8; buffer[offset + i] = 255 & m, i += d, m /= 256, mLen -= 8) ;
      e = e << mLen | m;
      eLen += mLen;
      for (;eLen > 0; buffer[offset + i] = 255 & e, i += d, e /= 256, eLen -= 8) ;
      buffer[offset + i - d] |= 128 * s;
    };
  }, {} ],
  8: [ function(require, module, exports) {
    "function" === typeof Object.create ? module.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      }
    } : module.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function() {};
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      }
    };
  }, {} ],
  9: [ function(require, module, exports) {
    module.exports = function(obj) {
      return null != obj && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
    };
    function isBuffer(obj) {
      return !!obj.constructor && "function" === typeof obj.constructor.isBuffer && obj.constructor.isBuffer(obj);
    }
    function isSlowBuffer(obj) {
      return "function" === typeof obj.readFloatLE && "function" === typeof obj.slice && isBuffer(obj.slice(0, 0));
    }
  }, {} ],
  10: [ function(require, module, exports) {
    (function(process) {
      "use strict";
      "undefined" === typeof process || !process.version || 0 === process.version.indexOf("v0.") || 0 === process.version.indexOf("v1.") && 0 !== process.version.indexOf("v1.8.") ? module.exports = {
        nextTick: nextTick
      } : module.exports = process;
      function nextTick(fn, arg1, arg2, arg3) {
        if ("function" !== typeof fn) throw new TypeError('"callback" argument must be a function');
        var len = arguments.length;
        var args, i;
        switch (len) {
         case 0:
         case 1:
          return process.nextTick(fn);

         case 2:
          return process.nextTick(function afterTickOne() {
            fn.call(null, arg1);
          });

         case 3:
          return process.nextTick(function afterTickTwo() {
            fn.call(null, arg1, arg2);
          });

         case 4:
          return process.nextTick(function afterTickThree() {
            fn.call(null, arg1, arg2, arg3);
          });

         default:
          args = new Array(len - 1);
          i = 0;
          while (i < args.length) args[i++] = arguments[i];
          return process.nextTick(function afterTick() {
            fn.apply(null, args);
          });
        }
      }
    }).call(this, require("_process"));
  }, {
    _process: 11
  } ],
  11: [ function(require, module, exports) {
    var process = module.exports = {};
    var cachedSetTimeout;
    var cachedClearTimeout;
    function defaultSetTimout() {
      throw new Error("setTimeout has not been defined");
    }
    function defaultClearTimeout() {
      throw new Error("clearTimeout has not been defined");
    }
    (function() {
      try {
        cachedSetTimeout = "function" === typeof setTimeout ? setTimeout : defaultSetTimout;
      } catch (e) {
        cachedSetTimeout = defaultSetTimout;
      }
      try {
        cachedClearTimeout = "function" === typeof clearTimeout ? clearTimeout : defaultClearTimeout;
      } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
      }
    })();
    function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) return setTimeout(fun, 0);
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
      }
      try {
        return cachedSetTimeout(fun, 0);
      } catch (e) {
        try {
          return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
          return cachedSetTimeout.call(this, fun, 0);
        }
      }
    }
    function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) return clearTimeout(marker);
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
      }
      try {
        return cachedClearTimeout(marker);
      } catch (e) {
        try {
          return cachedClearTimeout.call(null, marker);
        } catch (e) {
          return cachedClearTimeout.call(this, marker);
        }
      }
    }
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;
    function cleanUpNextTick() {
      if (!draining || !currentQueue) return;
      draining = false;
      currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1;
      queue.length && drainQueue();
    }
    function drainQueue() {
      if (draining) return;
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;
      var len = queue.length;
      while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) currentQueue && currentQueue[queueIndex].run();
        queueIndex = -1;
        len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
    }
    process.nextTick = function(fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
      queue.push(new Item(fun, args));
      1 !== queue.length || draining || runTimeout(drainQueue);
    };
    function Item(fun, array) {
      this.fun = fun;
      this.array = array;
    }
    Item.prototype.run = function() {
      this.fun.apply(null, this.array);
    };
    process.title = "browser";
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = "";
    process.versions = {};
    function noop() {}
    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.prependListener = noop;
    process.prependOnceListener = noop;
    process.listeners = function(name) {
      return [];
    };
    process.binding = function(name) {
      throw new Error("process.binding is not supported");
    };
    process.cwd = function() {
      return "/";
    };
    process.chdir = function(dir) {
      throw new Error("process.chdir is not supported");
    };
    process.umask = function() {
      return 0;
    };
  }, {} ],
  12: [ function(require, module, exports) {
    module.exports = require("./lib/_stream_duplex.js");
  }, {
    "./lib/_stream_duplex.js": 13
  } ],
  13: [ function(require, module, exports) {
    "use strict";
    var pna = require("process-nextick-args");
    var objectKeys = Object.keys || function(obj) {
      var keys = [];
      for (var key in obj) keys.push(key);
      return keys;
    };
    module.exports = Duplex;
    var util = Object.create(require("core-util-is"));
    util.inherits = require("inherits");
    var Readable = require("./_stream_readable");
    var Writable = require("./_stream_writable");
    util.inherits(Duplex, Readable);
    var keys = objectKeys(Writable.prototype);
    for (var v = 0; v < keys.length; v++) {
      var method = keys[v];
      Duplex.prototype[method] || (Duplex.prototype[method] = Writable.prototype[method]);
    }
    function Duplex(options) {
      if (!(this instanceof Duplex)) return new Duplex(options);
      Readable.call(this, options);
      Writable.call(this, options);
      options && false === options.readable && (this.readable = false);
      options && false === options.writable && (this.writable = false);
      this.allowHalfOpen = true;
      options && false === options.allowHalfOpen && (this.allowHalfOpen = false);
      this.once("end", onend);
    }
    Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
      enumerable: false,
      get: function() {
        return this._writableState.highWaterMark;
      }
    });
    function onend() {
      if (this.allowHalfOpen || this._writableState.ended) return;
      pna.nextTick(onEndNT, this);
    }
    function onEndNT(self) {
      self.end();
    }
    Object.defineProperty(Duplex.prototype, "destroyed", {
      get: function() {
        if (void 0 === this._readableState || void 0 === this._writableState) return false;
        return this._readableState.destroyed && this._writableState.destroyed;
      },
      set: function(value) {
        if (void 0 === this._readableState || void 0 === this._writableState) return;
        this._readableState.destroyed = value;
        this._writableState.destroyed = value;
      }
    });
    Duplex.prototype._destroy = function(err, cb) {
      this.push(null);
      this.end();
      pna.nextTick(cb, err);
    };
  }, {
    "./_stream_readable": 15,
    "./_stream_writable": 17,
    "core-util-is": 5,
    inherits: 8,
    "process-nextick-args": 10
  } ],
  14: [ function(require, module, exports) {
    "use strict";
    module.exports = PassThrough;
    var Transform = require("./_stream_transform");
    var util = Object.create(require("core-util-is"));
    util.inherits = require("inherits");
    util.inherits(PassThrough, Transform);
    function PassThrough(options) {
      if (!(this instanceof PassThrough)) return new PassThrough(options);
      Transform.call(this, options);
    }
    PassThrough.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  }, {
    "./_stream_transform": 16,
    "core-util-is": 5,
    inherits: 8
  } ],
  15: [ function(require, module, exports) {
    (function(process, global) {
      "use strict";
      var pna = require("process-nextick-args");
      module.exports = Readable;
      var isArray = require("isarray");
      var Duplex;
      Readable.ReadableState = ReadableState;
      var EE = require("events").EventEmitter;
      var EElistenerCount = function(emitter, type) {
        return emitter.listeners(type).length;
      };
      var Stream = require("./internal/streams/stream");
      var Buffer = require("safe-buffer").Buffer;
      var OurUint8Array = global.Uint8Array || function() {};
      function _uint8ArrayToBuffer(chunk) {
        return Buffer.from(chunk);
      }
      function _isUint8Array(obj) {
        return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
      }
      var util = Object.create(require("core-util-is"));
      util.inherits = require("inherits");
      var debugUtil = require("util");
      var debug = void 0;
      debug = debugUtil && debugUtil.debuglog ? debugUtil.debuglog("stream") : function() {};
      var BufferList = require("./internal/streams/BufferList");
      var destroyImpl = require("./internal/streams/destroy");
      var StringDecoder;
      util.inherits(Readable, Stream);
      var kProxyEvents = [ "error", "close", "destroy", "pause", "resume" ];
      function prependListener(emitter, event, fn) {
        if ("function" === typeof emitter.prependListener) return emitter.prependListener(event, fn);
        emitter._events && emitter._events[event] ? isArray(emitter._events[event]) ? emitter._events[event].unshift(fn) : emitter._events[event] = [ fn, emitter._events[event] ] : emitter.on(event, fn);
      }
      function ReadableState(options, stream) {
        Duplex = Duplex || require("./_stream_duplex");
        options = options || {};
        var isDuplex = stream instanceof Duplex;
        this.objectMode = !!options.objectMode;
        isDuplex && (this.objectMode = this.objectMode || !!options.readableObjectMode);
        var hwm = options.highWaterMark;
        var readableHwm = options.readableHighWaterMark;
        var defaultHwm = this.objectMode ? 16 : 16384;
        this.highWaterMark = hwm || 0 === hwm ? hwm : isDuplex && (readableHwm || 0 === readableHwm) ? readableHwm : defaultHwm;
        this.highWaterMark = Math.floor(this.highWaterMark);
        this.buffer = new BufferList();
        this.length = 0;
        this.pipes = null;
        this.pipesCount = 0;
        this.flowing = null;
        this.ended = false;
        this.endEmitted = false;
        this.reading = false;
        this.sync = true;
        this.needReadable = false;
        this.emittedReadable = false;
        this.readableListening = false;
        this.resumeScheduled = false;
        this.destroyed = false;
        this.defaultEncoding = options.defaultEncoding || "utf8";
        this.awaitDrain = 0;
        this.readingMore = false;
        this.decoder = null;
        this.encoding = null;
        if (options.encoding) {
          StringDecoder || (StringDecoder = require("string_decoder/").StringDecoder);
          this.decoder = new StringDecoder(options.encoding);
          this.encoding = options.encoding;
        }
      }
      function Readable(options) {
        Duplex = Duplex || require("./_stream_duplex");
        if (!(this instanceof Readable)) return new Readable(options);
        this._readableState = new ReadableState(options, this);
        this.readable = true;
        if (options) {
          "function" === typeof options.read && (this._read = options.read);
          "function" === typeof options.destroy && (this._destroy = options.destroy);
        }
        Stream.call(this);
      }
      Object.defineProperty(Readable.prototype, "destroyed", {
        get: function() {
          if (void 0 === this._readableState) return false;
          return this._readableState.destroyed;
        },
        set: function(value) {
          if (!this._readableState) return;
          this._readableState.destroyed = value;
        }
      });
      Readable.prototype.destroy = destroyImpl.destroy;
      Readable.prototype._undestroy = destroyImpl.undestroy;
      Readable.prototype._destroy = function(err, cb) {
        this.push(null);
        cb(err);
      };
      Readable.prototype.push = function(chunk, encoding) {
        var state = this._readableState;
        var skipChunkCheck;
        if (state.objectMode) skipChunkCheck = true; else if ("string" === typeof chunk) {
          encoding = encoding || state.defaultEncoding;
          if (encoding !== state.encoding) {
            chunk = Buffer.from(chunk, encoding);
            encoding = "";
          }
          skipChunkCheck = true;
        }
        return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
      };
      Readable.prototype.unshift = function(chunk) {
        return readableAddChunk(this, chunk, null, true, false);
      };
      function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
        var state = stream._readableState;
        if (null === chunk) {
          state.reading = false;
          onEofChunk(stream, state);
        } else {
          var er;
          skipChunkCheck || (er = chunkInvalid(state, chunk));
          if (er) stream.emit("error", er); else if (state.objectMode || chunk && chunk.length > 0) {
            "string" === typeof chunk || state.objectMode || Object.getPrototypeOf(chunk) === Buffer.prototype || (chunk = _uint8ArrayToBuffer(chunk));
            if (addToFront) state.endEmitted ? stream.emit("error", new Error("stream.unshift() after end event")) : addChunk(stream, state, chunk, true); else if (state.ended) stream.emit("error", new Error("stream.push() after EOF")); else {
              state.reading = false;
              if (state.decoder && !encoding) {
                chunk = state.decoder.write(chunk);
                state.objectMode || 0 !== chunk.length ? addChunk(stream, state, chunk, false) : maybeReadMore(stream, state);
              } else addChunk(stream, state, chunk, false);
            }
          } else addToFront || (state.reading = false);
        }
        return needMoreData(state);
      }
      function addChunk(stream, state, chunk, addToFront) {
        if (state.flowing && 0 === state.length && !state.sync) {
          stream.emit("data", chunk);
          stream.read(0);
        } else {
          state.length += state.objectMode ? 1 : chunk.length;
          addToFront ? state.buffer.unshift(chunk) : state.buffer.push(chunk);
          state.needReadable && emitReadable(stream);
        }
        maybeReadMore(stream, state);
      }
      function chunkInvalid(state, chunk) {
        var er;
        _isUint8Array(chunk) || "string" === typeof chunk || void 0 === chunk || state.objectMode || (er = new TypeError("Invalid non-string/buffer chunk"));
        return er;
      }
      function needMoreData(state) {
        return !state.ended && (state.needReadable || state.length < state.highWaterMark || 0 === state.length);
      }
      Readable.prototype.isPaused = function() {
        return false === this._readableState.flowing;
      };
      Readable.prototype.setEncoding = function(enc) {
        StringDecoder || (StringDecoder = require("string_decoder/").StringDecoder);
        this._readableState.decoder = new StringDecoder(enc);
        this._readableState.encoding = enc;
        return this;
      };
      var MAX_HWM = 8388608;
      function computeNewHighWaterMark(n) {
        if (n >= MAX_HWM) n = MAX_HWM; else {
          n--;
          n |= n >>> 1;
          n |= n >>> 2;
          n |= n >>> 4;
          n |= n >>> 8;
          n |= n >>> 16;
          n++;
        }
        return n;
      }
      function howMuchToRead(n, state) {
        if (n <= 0 || 0 === state.length && state.ended) return 0;
        if (state.objectMode) return 1;
        if (n !== n) return state.flowing && state.length ? state.buffer.head.data.length : state.length;
        n > state.highWaterMark && (state.highWaterMark = computeNewHighWaterMark(n));
        if (n <= state.length) return n;
        if (!state.ended) {
          state.needReadable = true;
          return 0;
        }
        return state.length;
      }
      Readable.prototype.read = function(n) {
        debug("read", n);
        n = parseInt(n, 10);
        var state = this._readableState;
        var nOrig = n;
        0 !== n && (state.emittedReadable = false);
        if (0 === n && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
          debug("read: emitReadable", state.length, state.ended);
          0 === state.length && state.ended ? endReadable(this) : emitReadable(this);
          return null;
        }
        n = howMuchToRead(n, state);
        if (0 === n && state.ended) {
          0 === state.length && endReadable(this);
          return null;
        }
        var doRead = state.needReadable;
        debug("need readable", doRead);
        if (0 === state.length || state.length - n < state.highWaterMark) {
          doRead = true;
          debug("length less than watermark", doRead);
        }
        if (state.ended || state.reading) {
          doRead = false;
          debug("reading or ended", doRead);
        } else if (doRead) {
          debug("do read");
          state.reading = true;
          state.sync = true;
          0 === state.length && (state.needReadable = true);
          this._read(state.highWaterMark);
          state.sync = false;
          state.reading || (n = howMuchToRead(nOrig, state));
        }
        var ret;
        ret = n > 0 ? fromList(n, state) : null;
        if (null === ret) {
          state.needReadable = true;
          n = 0;
        } else state.length -= n;
        if (0 === state.length) {
          state.ended || (state.needReadable = true);
          nOrig !== n && state.ended && endReadable(this);
        }
        null !== ret && this.emit("data", ret);
        return ret;
      };
      function onEofChunk(stream, state) {
        if (state.ended) return;
        if (state.decoder) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length) {
            state.buffer.push(chunk);
            state.length += state.objectMode ? 1 : chunk.length;
          }
        }
        state.ended = true;
        emitReadable(stream);
      }
      function emitReadable(stream) {
        var state = stream._readableState;
        state.needReadable = false;
        if (!state.emittedReadable) {
          debug("emitReadable", state.flowing);
          state.emittedReadable = true;
          state.sync ? pna.nextTick(emitReadable_, stream) : emitReadable_(stream);
        }
      }
      function emitReadable_(stream) {
        debug("emit readable");
        stream.emit("readable");
        flow(stream);
      }
      function maybeReadMore(stream, state) {
        if (!state.readingMore) {
          state.readingMore = true;
          pna.nextTick(maybeReadMore_, stream, state);
        }
      }
      function maybeReadMore_(stream, state) {
        var len = state.length;
        while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
          debug("maybeReadMore read 0");
          stream.read(0);
          if (len === state.length) break;
          len = state.length;
        }
        state.readingMore = false;
      }
      Readable.prototype._read = function(n) {
        this.emit("error", new Error("_read() is not implemented"));
      };
      Readable.prototype.pipe = function(dest, pipeOpts) {
        var src = this;
        var state = this._readableState;
        switch (state.pipesCount) {
         case 0:
          state.pipes = dest;
          break;

         case 1:
          state.pipes = [ state.pipes, dest ];
          break;

         default:
          state.pipes.push(dest);
        }
        state.pipesCount += 1;
        debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
        var doEnd = (!pipeOpts || false !== pipeOpts.end) && dest !== process.stdout && dest !== process.stderr;
        var endFn = doEnd ? onend : unpipe;
        state.endEmitted ? pna.nextTick(endFn) : src.once("end", endFn);
        dest.on("unpipe", onunpipe);
        function onunpipe(readable, unpipeInfo) {
          debug("onunpipe");
          if (readable === src && unpipeInfo && false === unpipeInfo.hasUnpiped) {
            unpipeInfo.hasUnpiped = true;
            cleanup();
          }
        }
        function onend() {
          debug("onend");
          dest.end();
        }
        var ondrain = pipeOnDrain(src);
        dest.on("drain", ondrain);
        var cleanedUp = false;
        function cleanup() {
          debug("cleanup");
          dest.removeListener("close", onclose);
          dest.removeListener("finish", onfinish);
          dest.removeListener("drain", ondrain);
          dest.removeListener("error", onerror);
          dest.removeListener("unpipe", onunpipe);
          src.removeListener("end", onend);
          src.removeListener("end", unpipe);
          src.removeListener("data", ondata);
          cleanedUp = true;
          !state.awaitDrain || dest._writableState && !dest._writableState.needDrain || ondrain();
        }
        var increasedAwaitDrain = false;
        src.on("data", ondata);
        function ondata(chunk) {
          debug("ondata");
          increasedAwaitDrain = false;
          var ret = dest.write(chunk);
          if (false === ret && !increasedAwaitDrain) {
            if ((1 === state.pipesCount && state.pipes === dest || state.pipesCount > 1 && -1 !== indexOf(state.pipes, dest)) && !cleanedUp) {
              debug("false write response, pause", src._readableState.awaitDrain);
              src._readableState.awaitDrain++;
              increasedAwaitDrain = true;
            }
            src.pause();
          }
        }
        function onerror(er) {
          debug("onerror", er);
          unpipe();
          dest.removeListener("error", onerror);
          0 === EElistenerCount(dest, "error") && dest.emit("error", er);
        }
        prependListener(dest, "error", onerror);
        function onclose() {
          dest.removeListener("finish", onfinish);
          unpipe();
        }
        dest.once("close", onclose);
        function onfinish() {
          debug("onfinish");
          dest.removeListener("close", onclose);
          unpipe();
        }
        dest.once("finish", onfinish);
        function unpipe() {
          debug("unpipe");
          src.unpipe(dest);
        }
        dest.emit("pipe", src);
        if (!state.flowing) {
          debug("pipe resume");
          src.resume();
        }
        return dest;
      };
      function pipeOnDrain(src) {
        return function() {
          var state = src._readableState;
          debug("pipeOnDrain", state.awaitDrain);
          state.awaitDrain && state.awaitDrain--;
          if (0 === state.awaitDrain && EElistenerCount(src, "data")) {
            state.flowing = true;
            flow(src);
          }
        };
      }
      Readable.prototype.unpipe = function(dest) {
        var state = this._readableState;
        var unpipeInfo = {
          hasUnpiped: false
        };
        if (0 === state.pipesCount) return this;
        if (1 === state.pipesCount) {
          if (dest && dest !== state.pipes) return this;
          dest || (dest = state.pipes);
          state.pipes = null;
          state.pipesCount = 0;
          state.flowing = false;
          dest && dest.emit("unpipe", this, unpipeInfo);
          return this;
        }
        if (!dest) {
          var dests = state.pipes;
          var len = state.pipesCount;
          state.pipes = null;
          state.pipesCount = 0;
          state.flowing = false;
          for (var i = 0; i < len; i++) dests[i].emit("unpipe", this, unpipeInfo);
          return this;
        }
        var index = indexOf(state.pipes, dest);
        if (-1 === index) return this;
        state.pipes.splice(index, 1);
        state.pipesCount -= 1;
        1 === state.pipesCount && (state.pipes = state.pipes[0]);
        dest.emit("unpipe", this, unpipeInfo);
        return this;
      };
      Readable.prototype.on = function(ev, fn) {
        var res = Stream.prototype.on.call(this, ev, fn);
        if ("data" === ev) false !== this._readableState.flowing && this.resume(); else if ("readable" === ev) {
          var state = this._readableState;
          if (!state.endEmitted && !state.readableListening) {
            state.readableListening = state.needReadable = true;
            state.emittedReadable = false;
            state.reading ? state.length && emitReadable(this) : pna.nextTick(nReadingNextTick, this);
          }
        }
        return res;
      };
      Readable.prototype.addListener = Readable.prototype.on;
      function nReadingNextTick(self) {
        debug("readable nexttick read 0");
        self.read(0);
      }
      Readable.prototype.resume = function() {
        var state = this._readableState;
        if (!state.flowing) {
          debug("resume");
          state.flowing = true;
          resume(this, state);
        }
        return this;
      };
      function resume(stream, state) {
        if (!state.resumeScheduled) {
          state.resumeScheduled = true;
          pna.nextTick(resume_, stream, state);
        }
      }
      function resume_(stream, state) {
        if (!state.reading) {
          debug("resume read 0");
          stream.read(0);
        }
        state.resumeScheduled = false;
        state.awaitDrain = 0;
        stream.emit("resume");
        flow(stream);
        state.flowing && !state.reading && stream.read(0);
      }
      Readable.prototype.pause = function() {
        debug("call pause flowing=%j", this._readableState.flowing);
        if (false !== this._readableState.flowing) {
          debug("pause");
          this._readableState.flowing = false;
          this.emit("pause");
        }
        return this;
      };
      function flow(stream) {
        var state = stream._readableState;
        debug("flow", state.flowing);
        while (state.flowing && null !== stream.read()) ;
      }
      Readable.prototype.wrap = function(stream) {
        var _this = this;
        var state = this._readableState;
        var paused = false;
        stream.on("end", function() {
          debug("wrapped end");
          if (state.decoder && !state.ended) {
            var chunk = state.decoder.end();
            chunk && chunk.length && _this.push(chunk);
          }
          _this.push(null);
        });
        stream.on("data", function(chunk) {
          debug("wrapped data");
          state.decoder && (chunk = state.decoder.write(chunk));
          if (state.objectMode && (null === chunk || void 0 === chunk)) return;
          if (!state.objectMode && (!chunk || !chunk.length)) return;
          var ret = _this.push(chunk);
          if (!ret) {
            paused = true;
            stream.pause();
          }
        });
        for (var i in stream) void 0 === this[i] && "function" === typeof stream[i] && (this[i] = function(method) {
          return function() {
            return stream[method].apply(stream, arguments);
          };
        }(i));
        for (var n = 0; n < kProxyEvents.length; n++) stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
        this._read = function(n) {
          debug("wrapped _read", n);
          if (paused) {
            paused = false;
            stream.resume();
          }
        };
        return this;
      };
      Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
        enumerable: false,
        get: function() {
          return this._readableState.highWaterMark;
        }
      });
      Readable._fromList = fromList;
      function fromList(n, state) {
        if (0 === state.length) return null;
        var ret;
        if (state.objectMode) ret = state.buffer.shift(); else if (!n || n >= state.length) {
          ret = state.decoder ? state.buffer.join("") : 1 === state.buffer.length ? state.buffer.head.data : state.buffer.concat(state.length);
          state.buffer.clear();
        } else ret = fromListPartial(n, state.buffer, state.decoder);
        return ret;
      }
      function fromListPartial(n, list, hasStrings) {
        var ret;
        if (n < list.head.data.length) {
          ret = list.head.data.slice(0, n);
          list.head.data = list.head.data.slice(n);
        } else ret = n === list.head.data.length ? list.shift() : hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
        return ret;
      }
      function copyFromBufferString(n, list) {
        var p = list.head;
        var c = 1;
        var ret = p.data;
        n -= ret.length;
        while (p = p.next) {
          var str = p.data;
          var nb = n > str.length ? str.length : n;
          nb === str.length ? ret += str : ret += str.slice(0, n);
          n -= nb;
          if (0 === n) {
            if (nb === str.length) {
              ++c;
              p.next ? list.head = p.next : list.head = list.tail = null;
            } else {
              list.head = p;
              p.data = str.slice(nb);
            }
            break;
          }
          ++c;
        }
        list.length -= c;
        return ret;
      }
      function copyFromBuffer(n, list) {
        var ret = Buffer.allocUnsafe(n);
        var p = list.head;
        var c = 1;
        p.data.copy(ret);
        n -= p.data.length;
        while (p = p.next) {
          var buf = p.data;
          var nb = n > buf.length ? buf.length : n;
          buf.copy(ret, ret.length - n, 0, nb);
          n -= nb;
          if (0 === n) {
            if (nb === buf.length) {
              ++c;
              p.next ? list.head = p.next : list.head = list.tail = null;
            } else {
              list.head = p;
              p.data = buf.slice(nb);
            }
            break;
          }
          ++c;
        }
        list.length -= c;
        return ret;
      }
      function endReadable(stream) {
        var state = stream._readableState;
        if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');
        if (!state.endEmitted) {
          state.ended = true;
          pna.nextTick(endReadableNT, state, stream);
        }
      }
      function endReadableNT(state, stream) {
        if (!state.endEmitted && 0 === state.length) {
          state.endEmitted = true;
          stream.readable = false;
          stream.emit("end");
        }
      }
      function indexOf(xs, x) {
        for (var i = 0, l = xs.length; i < l; i++) if (xs[i] === x) return i;
        return -1;
      }
    }).call(this, require("_process"), "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {
    "./_stream_duplex": 13,
    "./internal/streams/BufferList": 18,
    "./internal/streams/destroy": 19,
    "./internal/streams/stream": 20,
    _process: 11,
    "core-util-is": 5,
    events: 6,
    inherits: 8,
    isarray: 21,
    "process-nextick-args": 10,
    "safe-buffer": 27,
    "string_decoder/": 22,
    util: 2
  } ],
  16: [ function(require, module, exports) {
    "use strict";
    module.exports = Transform;
    var Duplex = require("./_stream_duplex");
    var util = Object.create(require("core-util-is"));
    util.inherits = require("inherits");
    util.inherits(Transform, Duplex);
    function afterTransform(er, data) {
      var ts = this._transformState;
      ts.transforming = false;
      var cb = ts.writecb;
      if (!cb) return this.emit("error", new Error("write callback called multiple times"));
      ts.writechunk = null;
      ts.writecb = null;
      null != data && this.push(data);
      cb(er);
      var rs = this._readableState;
      rs.reading = false;
      (rs.needReadable || rs.length < rs.highWaterMark) && this._read(rs.highWaterMark);
    }
    function Transform(options) {
      if (!(this instanceof Transform)) return new Transform(options);
      Duplex.call(this, options);
      this._transformState = {
        afterTransform: afterTransform.bind(this),
        needTransform: false,
        transforming: false,
        writecb: null,
        writechunk: null,
        writeencoding: null
      };
      this._readableState.needReadable = true;
      this._readableState.sync = false;
      if (options) {
        "function" === typeof options.transform && (this._transform = options.transform);
        "function" === typeof options.flush && (this._flush = options.flush);
      }
      this.on("prefinish", prefinish);
    }
    function prefinish() {
      var _this = this;
      "function" === typeof this._flush ? this._flush(function(er, data) {
        done(_this, er, data);
      }) : done(this, null, null);
    }
    Transform.prototype.push = function(chunk, encoding) {
      this._transformState.needTransform = false;
      return Duplex.prototype.push.call(this, chunk, encoding);
    };
    Transform.prototype._transform = function(chunk, encoding, cb) {
      throw new Error("_transform() is not implemented");
    };
    Transform.prototype._write = function(chunk, encoding, cb) {
      var ts = this._transformState;
      ts.writecb = cb;
      ts.writechunk = chunk;
      ts.writeencoding = encoding;
      if (!ts.transforming) {
        var rs = this._readableState;
        (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) && this._read(rs.highWaterMark);
      }
    };
    Transform.prototype._read = function(n) {
      var ts = this._transformState;
      if (null !== ts.writechunk && ts.writecb && !ts.transforming) {
        ts.transforming = true;
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
      } else ts.needTransform = true;
    };
    Transform.prototype._destroy = function(err, cb) {
      var _this2 = this;
      Duplex.prototype._destroy.call(this, err, function(err2) {
        cb(err2);
        _this2.emit("close");
      });
    };
    function done(stream, er, data) {
      if (er) return stream.emit("error", er);
      null != data && stream.push(data);
      if (stream._writableState.length) throw new Error("Calling transform done when ws.length != 0");
      if (stream._transformState.transforming) throw new Error("Calling transform done when still transforming");
      return stream.push(null);
    }
  }, {
    "./_stream_duplex": 13,
    "core-util-is": 5,
    inherits: 8
  } ],
  17: [ function(require, module, exports) {
    (function(process, global) {
      "use strict";
      var pna = require("process-nextick-args");
      module.exports = Writable;
      function WriteReq(chunk, encoding, cb) {
        this.chunk = chunk;
        this.encoding = encoding;
        this.callback = cb;
        this.next = null;
      }
      function CorkedRequest(state) {
        var _this = this;
        this.next = null;
        this.entry = null;
        this.finish = function() {
          onCorkedFinish(_this, state);
        };
      }
      var asyncWrite = !process.browser && [ "v0.10", "v0.9." ].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
      var Duplex;
      Writable.WritableState = WritableState;
      var util = Object.create(require("core-util-is"));
      util.inherits = require("inherits");
      var internalUtil = {
        deprecate: require("util-deprecate")
      };
      var Stream = require("./internal/streams/stream");
      var Buffer = require("safe-buffer").Buffer;
      var OurUint8Array = global.Uint8Array || function() {};
      function _uint8ArrayToBuffer(chunk) {
        return Buffer.from(chunk);
      }
      function _isUint8Array(obj) {
        return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
      }
      var destroyImpl = require("./internal/streams/destroy");
      util.inherits(Writable, Stream);
      function nop() {}
      function WritableState(options, stream) {
        Duplex = Duplex || require("./_stream_duplex");
        options = options || {};
        var isDuplex = stream instanceof Duplex;
        this.objectMode = !!options.objectMode;
        isDuplex && (this.objectMode = this.objectMode || !!options.writableObjectMode);
        var hwm = options.highWaterMark;
        var writableHwm = options.writableHighWaterMark;
        var defaultHwm = this.objectMode ? 16 : 16384;
        this.highWaterMark = hwm || 0 === hwm ? hwm : isDuplex && (writableHwm || 0 === writableHwm) ? writableHwm : defaultHwm;
        this.highWaterMark = Math.floor(this.highWaterMark);
        this.finalCalled = false;
        this.needDrain = false;
        this.ending = false;
        this.ended = false;
        this.finished = false;
        this.destroyed = false;
        var noDecode = false === options.decodeStrings;
        this.decodeStrings = !noDecode;
        this.defaultEncoding = options.defaultEncoding || "utf8";
        this.length = 0;
        this.writing = false;
        this.corked = 0;
        this.sync = true;
        this.bufferProcessing = false;
        this.onwrite = function(er) {
          onwrite(stream, er);
        };
        this.writecb = null;
        this.writelen = 0;
        this.bufferedRequest = null;
        this.lastBufferedRequest = null;
        this.pendingcb = 0;
        this.prefinished = false;
        this.errorEmitted = false;
        this.bufferedRequestCount = 0;
        this.corkedRequestsFree = new CorkedRequest(this);
      }
      WritableState.prototype.getBuffer = function getBuffer() {
        var current = this.bufferedRequest;
        var out = [];
        while (current) {
          out.push(current);
          current = current.next;
        }
        return out;
      };
      (function() {
        try {
          Object.defineProperty(WritableState.prototype, "buffer", {
            get: internalUtil.deprecate(function() {
              return this.getBuffer();
            }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
          });
        } catch (_) {}
      })();
      var realHasInstance;
      if ("function" === typeof Symbol && Symbol.hasInstance && "function" === typeof Function.prototype[Symbol.hasInstance]) {
        realHasInstance = Function.prototype[Symbol.hasInstance];
        Object.defineProperty(Writable, Symbol.hasInstance, {
          value: function(object) {
            if (realHasInstance.call(this, object)) return true;
            if (this !== Writable) return false;
            return object && object._writableState instanceof WritableState;
          }
        });
      } else realHasInstance = function(object) {
        return object instanceof this;
      };
      function Writable(options) {
        Duplex = Duplex || require("./_stream_duplex");
        if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) return new Writable(options);
        this._writableState = new WritableState(options, this);
        this.writable = true;
        if (options) {
          "function" === typeof options.write && (this._write = options.write);
          "function" === typeof options.writev && (this._writev = options.writev);
          "function" === typeof options.destroy && (this._destroy = options.destroy);
          "function" === typeof options.final && (this._final = options.final);
        }
        Stream.call(this);
      }
      Writable.prototype.pipe = function() {
        this.emit("error", new Error("Cannot pipe, not readable"));
      };
      function writeAfterEnd(stream, cb) {
        var er = new Error("write after end");
        stream.emit("error", er);
        pna.nextTick(cb, er);
      }
      function validChunk(stream, state, chunk, cb) {
        var valid = true;
        var er = false;
        null === chunk ? er = new TypeError("May not write null values to stream") : "string" === typeof chunk || void 0 === chunk || state.objectMode || (er = new TypeError("Invalid non-string/buffer chunk"));
        if (er) {
          stream.emit("error", er);
          pna.nextTick(cb, er);
          valid = false;
        }
        return valid;
      }
      Writable.prototype.write = function(chunk, encoding, cb) {
        var state = this._writableState;
        var ret = false;
        var isBuf = !state.objectMode && _isUint8Array(chunk);
        isBuf && !Buffer.isBuffer(chunk) && (chunk = _uint8ArrayToBuffer(chunk));
        if ("function" === typeof encoding) {
          cb = encoding;
          encoding = null;
        }
        isBuf ? encoding = "buffer" : encoding || (encoding = state.defaultEncoding);
        "function" !== typeof cb && (cb = nop);
        if (state.ended) writeAfterEnd(this, cb); else if (isBuf || validChunk(this, state, chunk, cb)) {
          state.pendingcb++;
          ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
        }
        return ret;
      };
      Writable.prototype.cork = function() {
        var state = this._writableState;
        state.corked++;
      };
      Writable.prototype.uncork = function() {
        var state = this._writableState;
        if (state.corked) {
          state.corked--;
          state.writing || state.corked || state.finished || state.bufferProcessing || !state.bufferedRequest || clearBuffer(this, state);
        }
      };
      Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
        "string" === typeof encoding && (encoding = encoding.toLowerCase());
        if (!([ "hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw" ].indexOf((encoding + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + encoding);
        this._writableState.defaultEncoding = encoding;
        return this;
      };
      function decodeChunk(state, chunk, encoding) {
        state.objectMode || false === state.decodeStrings || "string" !== typeof chunk || (chunk = Buffer.from(chunk, encoding));
        return chunk;
      }
      Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
        enumerable: false,
        get: function() {
          return this._writableState.highWaterMark;
        }
      });
      function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
        if (!isBuf) {
          var newChunk = decodeChunk(state, chunk, encoding);
          if (chunk !== newChunk) {
            isBuf = true;
            encoding = "buffer";
            chunk = newChunk;
          }
        }
        var len = state.objectMode ? 1 : chunk.length;
        state.length += len;
        var ret = state.length < state.highWaterMark;
        ret || (state.needDrain = true);
        if (state.writing || state.corked) {
          var last = state.lastBufferedRequest;
          state.lastBufferedRequest = {
            chunk: chunk,
            encoding: encoding,
            isBuf: isBuf,
            callback: cb,
            next: null
          };
          last ? last.next = state.lastBufferedRequest : state.bufferedRequest = state.lastBufferedRequest;
          state.bufferedRequestCount += 1;
        } else doWrite(stream, state, false, len, chunk, encoding, cb);
        return ret;
      }
      function doWrite(stream, state, writev, len, chunk, encoding, cb) {
        state.writelen = len;
        state.writecb = cb;
        state.writing = true;
        state.sync = true;
        writev ? stream._writev(chunk, state.onwrite) : stream._write(chunk, encoding, state.onwrite);
        state.sync = false;
      }
      function onwriteError(stream, state, sync, er, cb) {
        --state.pendingcb;
        if (sync) {
          pna.nextTick(cb, er);
          pna.nextTick(finishMaybe, stream, state);
          stream._writableState.errorEmitted = true;
          stream.emit("error", er);
        } else {
          cb(er);
          stream._writableState.errorEmitted = true;
          stream.emit("error", er);
          finishMaybe(stream, state);
        }
      }
      function onwriteStateUpdate(state) {
        state.writing = false;
        state.writecb = null;
        state.length -= state.writelen;
        state.writelen = 0;
      }
      function onwrite(stream, er) {
        var state = stream._writableState;
        var sync = state.sync;
        var cb = state.writecb;
        onwriteStateUpdate(state);
        if (er) onwriteError(stream, state, sync, er, cb); else {
          var finished = needFinish(state);
          finished || state.corked || state.bufferProcessing || !state.bufferedRequest || clearBuffer(stream, state);
          sync ? asyncWrite(afterWrite, stream, state, finished, cb) : afterWrite(stream, state, finished, cb);
        }
      }
      function afterWrite(stream, state, finished, cb) {
        finished || onwriteDrain(stream, state);
        state.pendingcb--;
        cb();
        finishMaybe(stream, state);
      }
      function onwriteDrain(stream, state) {
        if (0 === state.length && state.needDrain) {
          state.needDrain = false;
          stream.emit("drain");
        }
      }
      function clearBuffer(stream, state) {
        state.bufferProcessing = true;
        var entry = state.bufferedRequest;
        if (stream._writev && entry && entry.next) {
          var l = state.bufferedRequestCount;
          var buffer = new Array(l);
          var holder = state.corkedRequestsFree;
          holder.entry = entry;
          var count = 0;
          var allBuffers = true;
          while (entry) {
            buffer[count] = entry;
            entry.isBuf || (allBuffers = false);
            entry = entry.next;
            count += 1;
          }
          buffer.allBuffers = allBuffers;
          doWrite(stream, state, true, state.length, buffer, "", holder.finish);
          state.pendingcb++;
          state.lastBufferedRequest = null;
          if (holder.next) {
            state.corkedRequestsFree = holder.next;
            holder.next = null;
          } else state.corkedRequestsFree = new CorkedRequest(state);
          state.bufferedRequestCount = 0;
        } else {
          while (entry) {
            var chunk = entry.chunk;
            var encoding = entry.encoding;
            var cb = entry.callback;
            var len = state.objectMode ? 1 : chunk.length;
            doWrite(stream, state, false, len, chunk, encoding, cb);
            entry = entry.next;
            state.bufferedRequestCount--;
            if (state.writing) break;
          }
          null === entry && (state.lastBufferedRequest = null);
        }
        state.bufferedRequest = entry;
        state.bufferProcessing = false;
      }
      Writable.prototype._write = function(chunk, encoding, cb) {
        cb(new Error("_write() is not implemented"));
      };
      Writable.prototype._writev = null;
      Writable.prototype.end = function(chunk, encoding, cb) {
        var state = this._writableState;
        if ("function" === typeof chunk) {
          cb = chunk;
          chunk = null;
          encoding = null;
        } else if ("function" === typeof encoding) {
          cb = encoding;
          encoding = null;
        }
        null !== chunk && void 0 !== chunk && this.write(chunk, encoding);
        if (state.corked) {
          state.corked = 1;
          this.uncork();
        }
        state.ending || state.finished || endWritable(this, state, cb);
      };
      function needFinish(state) {
        return state.ending && 0 === state.length && null === state.bufferedRequest && !state.finished && !state.writing;
      }
      function callFinal(stream, state) {
        stream._final(function(err) {
          state.pendingcb--;
          err && stream.emit("error", err);
          state.prefinished = true;
          stream.emit("prefinish");
          finishMaybe(stream, state);
        });
      }
      function prefinish(stream, state) {
        if (!state.prefinished && !state.finalCalled) if ("function" === typeof stream._final) {
          state.pendingcb++;
          state.finalCalled = true;
          pna.nextTick(callFinal, stream, state);
        } else {
          state.prefinished = true;
          stream.emit("prefinish");
        }
      }
      function finishMaybe(stream, state) {
        var need = needFinish(state);
        if (need) {
          prefinish(stream, state);
          if (0 === state.pendingcb) {
            state.finished = true;
            stream.emit("finish");
          }
        }
        return need;
      }
      function endWritable(stream, state, cb) {
        state.ending = true;
        finishMaybe(stream, state);
        cb && (state.finished ? pna.nextTick(cb) : stream.once("finish", cb));
        state.ended = true;
        stream.writable = false;
      }
      function onCorkedFinish(corkReq, state, err) {
        var entry = corkReq.entry;
        corkReq.entry = null;
        while (entry) {
          var cb = entry.callback;
          state.pendingcb--;
          cb(err);
          entry = entry.next;
        }
        state.corkedRequestsFree ? state.corkedRequestsFree.next = corkReq : state.corkedRequestsFree = corkReq;
      }
      Object.defineProperty(Writable.prototype, "destroyed", {
        get: function() {
          if (void 0 === this._writableState) return false;
          return this._writableState.destroyed;
        },
        set: function(value) {
          if (!this._writableState) return;
          this._writableState.destroyed = value;
        }
      });
      Writable.prototype.destroy = destroyImpl.destroy;
      Writable.prototype._undestroy = destroyImpl.undestroy;
      Writable.prototype._destroy = function(err, cb) {
        this.end();
        cb(err);
      };
    }).call(this, require("_process"), "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {
    "./_stream_duplex": 13,
    "./internal/streams/destroy": 19,
    "./internal/streams/stream": 20,
    _process: 11,
    "core-util-is": 5,
    inherits: 8,
    "process-nextick-args": 10,
    "safe-buffer": 27,
    "util-deprecate": 29
  } ],
  18: [ function(require, module, exports) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    var Buffer = require("safe-buffer").Buffer;
    var util = require("util");
    function copyBuffer(src, target, offset) {
      src.copy(target, offset);
    }
    module.exports = function() {
      function BufferList() {
        _classCallCheck(this, BufferList);
        this.head = null;
        this.tail = null;
        this.length = 0;
      }
      BufferList.prototype.push = function push(v) {
        var entry = {
          data: v,
          next: null
        };
        this.length > 0 ? this.tail.next = entry : this.head = entry;
        this.tail = entry;
        ++this.length;
      };
      BufferList.prototype.unshift = function unshift(v) {
        var entry = {
          data: v,
          next: this.head
        };
        0 === this.length && (this.tail = entry);
        this.head = entry;
        ++this.length;
      };
      BufferList.prototype.shift = function shift() {
        if (0 === this.length) return;
        var ret = this.head.data;
        1 === this.length ? this.head = this.tail = null : this.head = this.head.next;
        --this.length;
        return ret;
      };
      BufferList.prototype.clear = function clear() {
        this.head = this.tail = null;
        this.length = 0;
      };
      BufferList.prototype.join = function join(s) {
        if (0 === this.length) return "";
        var p = this.head;
        var ret = "" + p.data;
        while (p = p.next) ret += s + p.data;
        return ret;
      };
      BufferList.prototype.concat = function concat(n) {
        if (0 === this.length) return Buffer.alloc(0);
        if (1 === this.length) return this.head.data;
        var ret = Buffer.allocUnsafe(n >>> 0);
        var p = this.head;
        var i = 0;
        while (p) {
          copyBuffer(p.data, ret, i);
          i += p.data.length;
          p = p.next;
        }
        return ret;
      };
      return BufferList;
    }();
    util && util.inspect && util.inspect.custom && (module.exports.prototype[util.inspect.custom] = function() {
      var obj = util.inspect({
        length: this.length
      });
      return this.constructor.name + " " + obj;
    });
  }, {
    "safe-buffer": 27,
    util: 2
  } ],
  19: [ function(require, module, exports) {
    "use strict";
    var pna = require("process-nextick-args");
    function destroy(err, cb) {
      var _this = this;
      var readableDestroyed = this._readableState && this._readableState.destroyed;
      var writableDestroyed = this._writableState && this._writableState.destroyed;
      if (readableDestroyed || writableDestroyed) {
        cb ? cb(err) : !err || this._writableState && this._writableState.errorEmitted || pna.nextTick(emitErrorNT, this, err);
        return this;
      }
      this._readableState && (this._readableState.destroyed = true);
      this._writableState && (this._writableState.destroyed = true);
      this._destroy(err || null, function(err) {
        if (!cb && err) {
          pna.nextTick(emitErrorNT, _this, err);
          _this._writableState && (_this._writableState.errorEmitted = true);
        } else cb && cb(err);
      });
      return this;
    }
    function undestroy() {
      if (this._readableState) {
        this._readableState.destroyed = false;
        this._readableState.reading = false;
        this._readableState.ended = false;
        this._readableState.endEmitted = false;
      }
      if (this._writableState) {
        this._writableState.destroyed = false;
        this._writableState.ended = false;
        this._writableState.ending = false;
        this._writableState.finished = false;
        this._writableState.errorEmitted = false;
      }
    }
    function emitErrorNT(self, err) {
      self.emit("error", err);
    }
    module.exports = {
      destroy: destroy,
      undestroy: undestroy
    };
  }, {
    "process-nextick-args": 10
  } ],
  20: [ function(require, module, exports) {
    module.exports = require("events").EventEmitter;
  }, {
    events: 6
  } ],
  21: [ function(require, module, exports) {
    arguments[4][4][0].apply(exports, arguments);
  }, {
    dup: 4
  } ],
  22: [ function(require, module, exports) {
    "use strict";
    var Buffer = require("safe-buffer").Buffer;
    var isEncoding = Buffer.isEncoding || function(encoding) {
      encoding = "" + encoding;
      switch (encoding && encoding.toLowerCase()) {
       case "hex":
       case "utf8":
       case "utf-8":
       case "ascii":
       case "binary":
       case "base64":
       case "ucs2":
       case "ucs-2":
       case "utf16le":
       case "utf-16le":
       case "raw":
        return true;

       default:
        return false;
      }
    };
    function _normalizeEncoding(enc) {
      if (!enc) return "utf8";
      var retried;
      while (true) switch (enc) {
       case "utf8":
       case "utf-8":
        return "utf8";

       case "ucs2":
       case "ucs-2":
       case "utf16le":
       case "utf-16le":
        return "utf16le";

       case "latin1":
       case "binary":
        return "latin1";

       case "base64":
       case "ascii":
       case "hex":
        return enc;

       default:
        if (retried) return;
        enc = ("" + enc).toLowerCase();
        retried = true;
      }
    }
    function normalizeEncoding(enc) {
      var nenc = _normalizeEncoding(enc);
      if ("string" !== typeof nenc && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error("Unknown encoding: " + enc);
      return nenc || enc;
    }
    exports.StringDecoder = StringDecoder;
    function StringDecoder(encoding) {
      this.encoding = normalizeEncoding(encoding);
      var nb;
      switch (this.encoding) {
       case "utf16le":
        this.text = utf16Text;
        this.end = utf16End;
        nb = 4;
        break;

       case "utf8":
        this.fillLast = utf8FillLast;
        nb = 4;
        break;

       case "base64":
        this.text = base64Text;
        this.end = base64End;
        nb = 3;
        break;

       default:
        this.write = simpleWrite;
        this.end = simpleEnd;
        return;
      }
      this.lastNeed = 0;
      this.lastTotal = 0;
      this.lastChar = Buffer.allocUnsafe(nb);
    }
    StringDecoder.prototype.write = function(buf) {
      if (0 === buf.length) return "";
      var r;
      var i;
      if (this.lastNeed) {
        r = this.fillLast(buf);
        if (void 0 === r) return "";
        i = this.lastNeed;
        this.lastNeed = 0;
      } else i = 0;
      if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
      return r || "";
    };
    StringDecoder.prototype.end = utf8End;
    StringDecoder.prototype.text = utf8Text;
    StringDecoder.prototype.fillLast = function(buf) {
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
      this.lastNeed -= buf.length;
    };
    function utf8CheckByte(byte) {
      if (byte <= 127) return 0;
      if (byte >> 5 === 6) return 2;
      if (byte >> 4 === 14) return 3;
      if (byte >> 3 === 30) return 4;
      return byte >> 6 === 2 ? -1 : -2;
    }
    function utf8CheckIncomplete(self, buf, i) {
      var j = buf.length - 1;
      if (j < i) return 0;
      var nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        nb > 0 && (self.lastNeed = nb - 1);
        return nb;
      }
      if (--j < i || -2 === nb) return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        nb > 0 && (self.lastNeed = nb - 2);
        return nb;
      }
      if (--j < i || -2 === nb) return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        nb > 0 && (2 === nb ? nb = 0 : self.lastNeed = nb - 3);
        return nb;
      }
      return 0;
    }
    function utf8CheckExtraBytes(self, buf, p) {
      if (128 !== (192 & buf[0])) {
        self.lastNeed = 0;
        return "\ufffd";
      }
      if (self.lastNeed > 1 && buf.length > 1) {
        if (128 !== (192 & buf[1])) {
          self.lastNeed = 1;
          return "\ufffd";
        }
        if (self.lastNeed > 2 && buf.length > 2 && 128 !== (192 & buf[2])) {
          self.lastNeed = 2;
          return "\ufffd";
        }
      }
    }
    function utf8FillLast(buf) {
      var p = this.lastTotal - this.lastNeed;
      var r = utf8CheckExtraBytes(this, buf, p);
      if (void 0 !== r) return r;
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, p, 0, buf.length);
      this.lastNeed -= buf.length;
    }
    function utf8Text(buf, i) {
      var total = utf8CheckIncomplete(this, buf, i);
      if (!this.lastNeed) return buf.toString("utf8", i);
      this.lastTotal = total;
      var end = buf.length - (total - this.lastNeed);
      buf.copy(this.lastChar, 0, end);
      return buf.toString("utf8", i, end);
    }
    function utf8End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) return r + "\ufffd";
      return r;
    }
    function utf16Text(buf, i) {
      if ((buf.length - i) % 2 === 0) {
        var r = buf.toString("utf16le", i);
        if (r) {
          var c = r.charCodeAt(r.length - 1);
          if (c >= 55296 && c <= 56319) {
            this.lastNeed = 2;
            this.lastTotal = 4;
            this.lastChar[0] = buf[buf.length - 2];
            this.lastChar[1] = buf[buf.length - 1];
            return r.slice(0, -1);
          }
        }
        return r;
      }
      this.lastNeed = 1;
      this.lastTotal = 2;
      this.lastChar[0] = buf[buf.length - 1];
      return buf.toString("utf16le", i, buf.length - 1);
    }
    function utf16End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) {
        var end = this.lastTotal - this.lastNeed;
        return r + this.lastChar.toString("utf16le", 0, end);
      }
      return r;
    }
    function base64Text(buf, i) {
      var n = (buf.length - i) % 3;
      if (0 === n) return buf.toString("base64", i);
      this.lastNeed = 3 - n;
      this.lastTotal = 3;
      if (1 === n) this.lastChar[0] = buf[buf.length - 1]; else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
      }
      return buf.toString("base64", i, buf.length - n);
    }
    function base64End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
      return r;
    }
    function simpleWrite(buf) {
      return buf.toString(this.encoding);
    }
    function simpleEnd(buf) {
      return buf && buf.length ? this.write(buf) : "";
    }
  }, {
    "safe-buffer": 27
  } ],
  23: [ function(require, module, exports) {
    module.exports = require("./readable").PassThrough;
  }, {
    "./readable": 24
  } ],
  24: [ function(require, module, exports) {
    exports = module.exports = require("./lib/_stream_readable.js");
    exports.Stream = exports;
    exports.Readable = exports;
    exports.Writable = require("./lib/_stream_writable.js");
    exports.Duplex = require("./lib/_stream_duplex.js");
    exports.Transform = require("./lib/_stream_transform.js");
    exports.PassThrough = require("./lib/_stream_passthrough.js");
  }, {
    "./lib/_stream_duplex.js": 13,
    "./lib/_stream_passthrough.js": 14,
    "./lib/_stream_readable.js": 15,
    "./lib/_stream_transform.js": 16,
    "./lib/_stream_writable.js": 17
  } ],
  25: [ function(require, module, exports) {
    module.exports = require("./readable").Transform;
  }, {
    "./readable": 24
  } ],
  26: [ function(require, module, exports) {
    module.exports = require("./lib/_stream_writable.js");
  }, {
    "./lib/_stream_writable.js": 17
  } ],
  27: [ function(require, module, exports) {
    var buffer = require("buffer");
    var Buffer = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) dst[key] = src[key];
    }
    if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) module.exports = buffer; else {
      copyProps(buffer, exports);
      exports.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer(arg, encodingOrOffset, length);
    }
    copyProps(Buffer, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if ("number" === typeof arg) throw new TypeError("Argument must not be a number");
      return Buffer(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if ("number" !== typeof size) throw new TypeError("Argument must be a number");
      var buf = Buffer(size);
      void 0 !== fill ? "string" === typeof encoding ? buf.fill(fill, encoding) : buf.fill(fill) : buf.fill(0);
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if ("number" !== typeof size) throw new TypeError("Argument must be a number");
      return Buffer(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if ("number" !== typeof size) throw new TypeError("Argument must be a number");
      return buffer.SlowBuffer(size);
    };
  }, {
    buffer: 3
  } ],
  28: [ function(require, module, exports) {
    module.exports = Stream;
    var EE = require("events").EventEmitter;
    var inherits = require("inherits");
    inherits(Stream, EE);
    Stream.Readable = require("readable-stream/readable.js");
    Stream.Writable = require("readable-stream/writable.js");
    Stream.Duplex = require("readable-stream/duplex.js");
    Stream.Transform = require("readable-stream/transform.js");
    Stream.PassThrough = require("readable-stream/passthrough.js");
    Stream.Stream = Stream;
    function Stream() {
      EE.call(this);
    }
    Stream.prototype.pipe = function(dest, options) {
      var source = this;
      function ondata(chunk) {
        dest.writable && false === dest.write(chunk) && source.pause && source.pause();
      }
      source.on("data", ondata);
      function ondrain() {
        source.readable && source.resume && source.resume();
      }
      dest.on("drain", ondrain);
      if (!dest._isStdio && (!options || false !== options.end)) {
        source.on("end", onend);
        source.on("close", onclose);
      }
      var didOnEnd = false;
      function onend() {
        if (didOnEnd) return;
        didOnEnd = true;
        dest.end();
      }
      function onclose() {
        if (didOnEnd) return;
        didOnEnd = true;
        "function" === typeof dest.destroy && dest.destroy();
      }
      function onerror(er) {
        cleanup();
        if (0 === EE.listenerCount(this, "error")) throw er;
      }
      source.on("error", onerror);
      dest.on("error", onerror);
      function cleanup() {
        source.removeListener("data", ondata);
        dest.removeListener("drain", ondrain);
        source.removeListener("end", onend);
        source.removeListener("close", onclose);
        source.removeListener("error", onerror);
        dest.removeListener("error", onerror);
        source.removeListener("end", cleanup);
        source.removeListener("close", cleanup);
        dest.removeListener("close", cleanup);
      }
      source.on("end", cleanup);
      source.on("close", cleanup);
      dest.on("close", cleanup);
      dest.emit("pipe", source);
      return dest;
    };
  }, {
    events: 6,
    inherits: 8,
    "readable-stream/duplex.js": 12,
    "readable-stream/passthrough.js": 23,
    "readable-stream/readable.js": 24,
    "readable-stream/transform.js": 25,
    "readable-stream/writable.js": 26
  } ],
  29: [ function(require, module, exports) {
    (function(global) {
      module.exports = deprecate;
      function deprecate(fn, msg) {
        if (config("noDeprecation")) return fn;
        var warned = false;
        function deprecated() {
          if (!warned) {
            if (config("throwDeprecation")) throw new Error(msg);
            config("traceDeprecation") ? console.trace(msg) : console.warn(msg);
            warned = true;
          }
          return fn.apply(this, arguments);
        }
        return deprecated;
      }
      function config(name) {
        try {
          if (!global.localStorage) return false;
        } catch (_) {
          return false;
        }
        var val = global.localStorage[name];
        if (null == val) return false;
        return "true" === String(val).toLowerCase();
      }
    }).call(this, "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {} ],
  30: [ function(require, module, exports) {
    "function" === typeof Object.create ? module.exports = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    } : module.exports = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function() {};
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    };
  }, {} ],
  31: [ function(require, module, exports) {
    module.exports = function isBuffer(arg) {
      return arg && "object" === typeof arg && "function" === typeof arg.copy && "function" === typeof arg.fill && "function" === typeof arg.readUInt8;
    };
  }, {} ],
  32: [ function(require, module, exports) {
    (function(process, global) {
      var formatRegExp = /%[sdj%]/g;
      exports.format = function(f) {
        if (!isString(f)) {
          var objects = [];
          for (var i = 0; i < arguments.length; i++) objects.push(inspect(arguments[i]));
          return objects.join(" ");
        }
        var i = 1;
        var args = arguments;
        var len = args.length;
        var str = String(f).replace(formatRegExp, function(x) {
          if ("%%" === x) return "%";
          if (i >= len) return x;
          switch (x) {
           case "%s":
            return String(args[i++]);

           case "%d":
            return Number(args[i++]);

           case "%j":
            try {
              return JSON.stringify(args[i++]);
            } catch (_) {
              return "[Circular]";
            }

           default:
            return x;
          }
        });
        for (var x = args[i]; i < len; x = args[++i]) isNull(x) || !isObject(x) ? str += " " + x : str += " " + inspect(x);
        return str;
      };
      exports.deprecate = function(fn, msg) {
        if (isUndefined(global.process)) return function() {
          return exports.deprecate(fn, msg).apply(this, arguments);
        };
        if (true === process.noDeprecation) return fn;
        var warned = false;
        function deprecated() {
          if (!warned) {
            if (process.throwDeprecation) throw new Error(msg);
            process.traceDeprecation ? console.trace(msg) : console.error(msg);
            warned = true;
          }
          return fn.apply(this, arguments);
        }
        return deprecated;
      };
      var debugs = {};
      var debugEnviron;
      exports.debuglog = function(set) {
        isUndefined(debugEnviron) && (debugEnviron = process.env.NODE_DEBUG || "");
        set = set.toUpperCase();
        if (!debugs[set]) if (new RegExp("\\b" + set + "\\b", "i").test(debugEnviron)) {
          var pid = process.pid;
          debugs[set] = function() {
            var msg = exports.format.apply(exports, arguments);
            console.error("%s %d: %s", set, pid, msg);
          };
        } else debugs[set] = function() {};
        return debugs[set];
      };
      function inspect(obj, opts) {
        var ctx = {
          seen: [],
          stylize: stylizeNoColor
        };
        arguments.length >= 3 && (ctx.depth = arguments[2]);
        arguments.length >= 4 && (ctx.colors = arguments[3]);
        isBoolean(opts) ? ctx.showHidden = opts : opts && exports._extend(ctx, opts);
        isUndefined(ctx.showHidden) && (ctx.showHidden = false);
        isUndefined(ctx.depth) && (ctx.depth = 2);
        isUndefined(ctx.colors) && (ctx.colors = false);
        isUndefined(ctx.customInspect) && (ctx.customInspect = true);
        ctx.colors && (ctx.stylize = stylizeWithColor);
        return formatValue(ctx, obj, ctx.depth);
      }
      exports.inspect = inspect;
      inspect.colors = {
        bold: [ 1, 22 ],
        italic: [ 3, 23 ],
        underline: [ 4, 24 ],
        inverse: [ 7, 27 ],
        white: [ 37, 39 ],
        grey: [ 90, 39 ],
        black: [ 30, 39 ],
        blue: [ 34, 39 ],
        cyan: [ 36, 39 ],
        green: [ 32, 39 ],
        magenta: [ 35, 39 ],
        red: [ 31, 39 ],
        yellow: [ 33, 39 ]
      };
      inspect.styles = {
        special: "cyan",
        number: "yellow",
        boolean: "yellow",
        undefined: "grey",
        null: "bold",
        string: "green",
        date: "magenta",
        regexp: "red"
      };
      function stylizeWithColor(str, styleType) {
        var style = inspect.styles[styleType];
        return style ? "\x1b[" + inspect.colors[style][0] + "m" + str + "\x1b[" + inspect.colors[style][1] + "m" : str;
      }
      function stylizeNoColor(str, styleType) {
        return str;
      }
      function arrayToHash(array) {
        var hash = {};
        array.forEach(function(val, idx) {
          hash[val] = true;
        });
        return hash;
      }
      function formatValue(ctx, value, recurseTimes) {
        if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== exports.inspect && !(value.constructor && value.constructor.prototype === value)) {
          var ret = value.inspect(recurseTimes, ctx);
          isString(ret) || (ret = formatValue(ctx, ret, recurseTimes));
          return ret;
        }
        var primitive = formatPrimitive(ctx, value);
        if (primitive) return primitive;
        var keys = Object.keys(value);
        var visibleKeys = arrayToHash(keys);
        ctx.showHidden && (keys = Object.getOwnPropertyNames(value));
        if (isError(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) return formatError(value);
        if (0 === keys.length) {
          if (isFunction(value)) {
            var name = value.name ? ": " + value.name : "";
            return ctx.stylize("[Function" + name + "]", "special");
          }
          if (isRegExp(value)) return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
          if (isDate(value)) return ctx.stylize(Date.prototype.toString.call(value), "date");
          if (isError(value)) return formatError(value);
        }
        var base = "", array = false, braces = [ "{", "}" ];
        if (isArray(value)) {
          array = true;
          braces = [ "[", "]" ];
        }
        if (isFunction(value)) {
          var n = value.name ? ": " + value.name : "";
          base = " [Function" + n + "]";
        }
        isRegExp(value) && (base = " " + RegExp.prototype.toString.call(value));
        isDate(value) && (base = " " + Date.prototype.toUTCString.call(value));
        isError(value) && (base = " " + formatError(value));
        if (0 === keys.length && (!array || 0 == value.length)) return braces[0] + base + braces[1];
        if (recurseTimes < 0) return isRegExp(value) ? ctx.stylize(RegExp.prototype.toString.call(value), "regexp") : ctx.stylize("[Object]", "special");
        ctx.seen.push(value);
        var output;
        output = array ? formatArray(ctx, value, recurseTimes, visibleKeys, keys) : keys.map(function(key) {
          return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
        });
        ctx.seen.pop();
        return reduceToSingleString(output, base, braces);
      }
      function formatPrimitive(ctx, value) {
        if (isUndefined(value)) return ctx.stylize("undefined", "undefined");
        if (isString(value)) {
          var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
          return ctx.stylize(simple, "string");
        }
        if (isNumber(value)) return ctx.stylize("" + value, "number");
        if (isBoolean(value)) return ctx.stylize("" + value, "boolean");
        if (isNull(value)) return ctx.stylize("null", "null");
      }
      function formatError(value) {
        return "[" + Error.prototype.toString.call(value) + "]";
      }
      function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
        var output = [];
        for (var i = 0, l = value.length; i < l; ++i) hasOwnProperty(value, String(i)) ? output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true)) : output.push("");
        keys.forEach(function(key) {
          key.match(/^\d+$/) || output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
        });
        return output;
      }
      function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
        var name, str, desc;
        desc = Object.getOwnPropertyDescriptor(value, key) || {
          value: value[key]
        };
        desc.get ? str = desc.set ? ctx.stylize("[Getter/Setter]", "special") : ctx.stylize("[Getter]", "special") : desc.set && (str = ctx.stylize("[Setter]", "special"));
        hasOwnProperty(visibleKeys, key) || (name = "[" + key + "]");
        if (!str) if (ctx.seen.indexOf(desc.value) < 0) {
          str = isNull(recurseTimes) ? formatValue(ctx, desc.value, null) : formatValue(ctx, desc.value, recurseTimes - 1);
          str.indexOf("\n") > -1 && (str = array ? str.split("\n").map(function(line) {
            return "  " + line;
          }).join("\n").substr(2) : "\n" + str.split("\n").map(function(line) {
            return "   " + line;
          }).join("\n"));
        } else str = ctx.stylize("[Circular]", "special");
        if (isUndefined(name)) {
          if (array && key.match(/^\d+$/)) return str;
          name = JSON.stringify("" + key);
          if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
            name = name.substr(1, name.length - 2);
            name = ctx.stylize(name, "name");
          } else {
            name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
            name = ctx.stylize(name, "string");
          }
        }
        return name + ": " + str;
      }
      function reduceToSingleString(output, base, braces) {
        var numLinesEst = 0;
        var length = output.reduce(function(prev, cur) {
          numLinesEst++;
          cur.indexOf("\n") >= 0 && numLinesEst++;
          return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
        }, 0);
        if (length > 60) return braces[0] + ("" === base ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
        return braces[0] + base + " " + output.join(", ") + " " + braces[1];
      }
      function isArray(ar) {
        return Array.isArray(ar);
      }
      exports.isArray = isArray;
      function isBoolean(arg) {
        return "boolean" === typeof arg;
      }
      exports.isBoolean = isBoolean;
      function isNull(arg) {
        return null === arg;
      }
      exports.isNull = isNull;
      function isNullOrUndefined(arg) {
        return null == arg;
      }
      exports.isNullOrUndefined = isNullOrUndefined;
      function isNumber(arg) {
        return "number" === typeof arg;
      }
      exports.isNumber = isNumber;
      function isString(arg) {
        return "string" === typeof arg;
      }
      exports.isString = isString;
      function isSymbol(arg) {
        return "symbol" === typeof arg;
      }
      exports.isSymbol = isSymbol;
      function isUndefined(arg) {
        return void 0 === arg;
      }
      exports.isUndefined = isUndefined;
      function isRegExp(re) {
        return isObject(re) && "[object RegExp]" === objectToString(re);
      }
      exports.isRegExp = isRegExp;
      function isObject(arg) {
        return "object" === typeof arg && null !== arg;
      }
      exports.isObject = isObject;
      function isDate(d) {
        return isObject(d) && "[object Date]" === objectToString(d);
      }
      exports.isDate = isDate;
      function isError(e) {
        return isObject(e) && ("[object Error]" === objectToString(e) || e instanceof Error);
      }
      exports.isError = isError;
      function isFunction(arg) {
        return "function" === typeof arg;
      }
      exports.isFunction = isFunction;
      function isPrimitive(arg) {
        return null === arg || "boolean" === typeof arg || "number" === typeof arg || "string" === typeof arg || "symbol" === typeof arg || "undefined" === typeof arg;
      }
      exports.isPrimitive = isPrimitive;
      exports.isBuffer = require("./support/isBuffer");
      function objectToString(o) {
        return Object.prototype.toString.call(o);
      }
      function pad(n) {
        return n < 10 ? "0" + n.toString(10) : n.toString(10);
      }
      var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
      function timestamp() {
        var d = new Date();
        var time = [ pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds()) ].join(":");
        return [ d.getDate(), months[d.getMonth()], time ].join(" ");
      }
      exports.log = function() {
        console.log("%s - %s", timestamp(), exports.format.apply(exports, arguments));
      };
      exports.inherits = require("inherits");
      exports._extend = function(origin, add) {
        if (!add || !isObject(add)) return origin;
        var keys = Object.keys(add);
        var i = keys.length;
        while (i--) origin[keys[i]] = add[keys[i]];
        return origin;
      };
      function hasOwnProperty(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
      }
    }).call(this, require("_process"), "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {
    "./support/isBuffer": 31,
    _process: 11,
    inherits: 30
  } ],
  33: [ function(require, module, exports) {
    exports = module.exports = require("./lib/cheerio");
    exports.version = require("./package").version;
  }, {
    "./lib/cheerio": 39,
    "./package": 95
  } ],
  34: [ function(require, module, exports) {
    var _ = require("lodash"), $ = require("../static"), utils = require("../utils"), isTag = utils.isTag, domEach = utils.domEach, hasOwn = Object.prototype.hasOwnProperty, camelCase = utils.camelCase, cssCase = utils.cssCase, rspace = /\s+/, dataAttrPrefix = "data-", primitives = {
      null: null,
      true: true,
      false: false
    }, rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;
    var getAttr = function(elem, name) {
      if (!elem || !isTag(elem)) return;
      elem.attribs || (elem.attribs = {});
      if (!name) return elem.attribs;
      if (hasOwn.call(elem.attribs, name)) return rboolean.test(name) ? name : elem.attribs[name];
      if ("option" === elem.name && "value" === name) return $.text(elem.children);
    };
    var setAttr = function(el, name, value) {
      null === value ? removeAttribute(el, name) : el.attribs[name] = value + "";
    };
    exports.attr = function(name, value) {
      if ("object" === typeof name || void 0 !== value) {
        if ("function" === typeof value) return domEach(this, function(i, el) {
          setAttr(el, name, value.call(el, i, el.attribs[name]));
        });
        return domEach(this, function(i, el) {
          if (!isTag(el)) return;
          "object" === typeof name ? _.each(name, function(value, name) {
            setAttr(el, name, value);
          }) : setAttr(el, name, value);
        });
      }
      return getAttr(this[0], name);
    };
    var getProp = function(el, name) {
      return el.hasOwnProperty(name) ? el[name] : rboolean.test(name) ? void 0 !== getAttr(el, name) : getAttr(el, name);
    };
    var setProp = function(el, name, value) {
      el[name] = rboolean.test(name) ? !!value : value;
    };
    exports.prop = function(name, value) {
      var i = 0, property;
      if ("string" === typeof name && void 0 === value) {
        switch (name) {
         case "style":
          property = this.css();
          _.each(property, function(v, p) {
            property[i++] = p;
          });
          property.length = i;
          break;

         case "tagName":
         case "nodeName":
          property = this[0].name.toUpperCase();
          break;

         default:
          property = getProp(this[0], name);
        }
        return property;
      }
      if ("object" === typeof name || void 0 !== value) {
        if ("function" === typeof value) return domEach(this, function(i, el) {
          setProp(el, name, value.call(el, i, getProp(el, name)));
        });
        return domEach(this, function(i, el) {
          if (!isTag(el)) return;
          "object" === typeof name ? _.each(name, function(val, name) {
            setProp(el, name, val);
          }) : setProp(el, name, value);
        });
      }
    };
    var setData = function(el, name, value) {
      el.data || (el.data = {});
      if ("object" === typeof name) return _.extend(el.data, name);
      "string" === typeof name && void 0 !== value ? el.data[name] = value : "object" === typeof name && _.exend(el.data, name);
    };
    var readData = function(el, name) {
      var readAll = 1 === arguments.length;
      var domNames, domName, jsNames, jsName, value, idx, length;
      if (readAll) {
        domNames = Object.keys(el.attribs).filter(function(attrName) {
          return attrName.slice(0, dataAttrPrefix.length) === dataAttrPrefix;
        });
        jsNames = domNames.map(function(domName) {
          return camelCase(domName.slice(dataAttrPrefix.length));
        });
      } else {
        domNames = [ dataAttrPrefix + cssCase(name) ];
        jsNames = [ name ];
      }
      for (idx = 0, length = domNames.length; idx < length; ++idx) {
        domName = domNames[idx];
        jsName = jsNames[idx];
        if (hasOwn.call(el.attribs, domName)) {
          value = el.attribs[domName];
          if (hasOwn.call(primitives, value)) value = primitives[value]; else if (value === String(Number(value))) value = Number(value); else if (rbrace.test(value)) try {
            value = JSON.parse(value);
          } catch (e) {}
          el.data[jsName] = value;
        }
      }
      return readAll ? el.data : value;
    };
    exports.data = function(name, value) {
      var elem = this[0];
      if (!elem || !isTag(elem)) return;
      elem.data || (elem.data = {});
      if (!name) return readData(elem);
      if ("object" === typeof name || void 0 !== value) {
        domEach(this, function(i, el) {
          setData(el, name, value);
        });
        return this;
      }
      if (hasOwn.call(elem.data, name)) return elem.data[name];
      return readData(elem, name);
    };
    exports.val = function(value) {
      var querying = 0 === arguments.length, element = this[0];
      if (!element) return;
      switch (element.name) {
       case "textarea":
        return this.text(value);

       case "input":
        switch (this.attr("type")) {
         case "radio":
          if (querying) return this.attr("value");
          this.attr("value", value);
          return this;

         default:
          return this.attr("value", value);
        }
        return;

       case "select":
        var option = this.find("option:selected"), returnValue;
        if (void 0 === option) return;
        if (!querying) {
          if (!this.attr().hasOwnProperty("multiple") && "object" == typeof value) return this;
          "object" != typeof value && (value = [ value ]);
          this.find("option").removeAttr("selected");
          for (var i = 0; i < value.length; i++) this.find('option[value="' + value[i] + '"]').attr("selected", "");
          return this;
        }
        returnValue = option.attr("value");
        if (this.attr().hasOwnProperty("multiple")) {
          returnValue = [];
          domEach(option, function(i, el) {
            returnValue.push(getAttr(el, "value"));
          });
        }
        return returnValue;

       case "option":
        if (!querying) {
          this.attr("value", value);
          return this;
        }
        return this.attr("value");
      }
    };
    var removeAttribute = function(elem, name) {
      if (!elem.attribs || !hasOwn.call(elem.attribs, name)) return;
      delete elem.attribs[name];
    };
    exports.removeAttr = function(name) {
      domEach(this, function(i, elem) {
        removeAttribute(elem, name);
      });
      return this;
    };
    exports.hasClass = function(className) {
      return _.some(this, function(elem) {
        var attrs = elem.attribs, clazz = attrs && attrs["class"], idx = -1, end;
        if (clazz) while ((idx = clazz.indexOf(className, idx + 1)) > -1) {
          end = idx + className.length;
          if ((0 === idx || rspace.test(clazz[idx - 1])) && (end === clazz.length || rspace.test(clazz[end]))) return true;
        }
      });
    };
    exports.addClass = function(value) {
      if ("function" === typeof value) return domEach(this, function(i, el) {
        var className = el.attribs["class"] || "";
        exports.addClass.call([ el ], value.call(el, i, className));
      });
      if (!value || "string" !== typeof value) return this;
      var classNames = value.split(rspace), numElements = this.length;
      for (var i = 0; i < numElements; i++) {
        if (!isTag(this[i])) continue;
        var className = getAttr(this[i], "class"), numClasses, setClass;
        if (className) {
          setClass = " " + className + " ";
          numClasses = classNames.length;
          for (var j = 0; j < numClasses; j++) {
            var appendClass = classNames[j] + " ";
            setClass.indexOf(" " + appendClass) < 0 && (setClass += appendClass);
          }
          setAttr(this[i], "class", setClass.trim());
        } else setAttr(this[i], "class", classNames.join(" ").trim());
      }
      return this;
    };
    var splitClass = function(className) {
      return className ? className.trim().split(rspace) : [];
    };
    exports.removeClass = function(value) {
      var classes, numClasses, removeAll;
      if ("function" === typeof value) return domEach(this, function(i, el) {
        exports.removeClass.call([ el ], value.call(el, i, el.attribs["class"] || ""));
      });
      classes = splitClass(value);
      numClasses = classes.length;
      removeAll = 0 === arguments.length;
      return domEach(this, function(i, el) {
        if (!isTag(el)) return;
        if (removeAll) el.attribs.class = ""; else {
          var elClasses = splitClass(el.attribs.class), index, changed;
          for (var j = 0; j < numClasses; j++) {
            index = elClasses.indexOf(classes[j]);
            if (index >= 0) {
              elClasses.splice(index, 1);
              changed = true;
              j--;
            }
          }
          changed && (el.attribs.class = elClasses.join(" "));
        }
      });
    };
    exports.toggleClass = function(value, stateVal) {
      if ("function" === typeof value) return domEach(this, function(i, el) {
        exports.toggleClass.call([ el ], value.call(el, i, el.attribs["class"] || "", stateVal), stateVal);
      });
      if (!value || "string" !== typeof value) return this;
      var classNames = value.split(rspace), numClasses = classNames.length, state = "boolean" === typeof stateVal ? stateVal ? 1 : -1 : 0, numElements = this.length, elementClasses, index;
      for (var i = 0; i < numElements; i++) {
        if (!isTag(this[i])) continue;
        elementClasses = splitClass(this[i].attribs.class);
        for (var j = 0; j < numClasses; j++) {
          index = elementClasses.indexOf(classNames[j]);
          state >= 0 && index < 0 ? elementClasses.push(classNames[j]) : state <= 0 && index >= 0 && elementClasses.splice(index, 1);
        }
        this[i].attribs.class = elementClasses.join(" ");
      }
      return this;
    };
    exports.is = function(selector) {
      if (selector) return this.filter(selector).length > 0;
      return false;
    };
  }, {
    "../static": 41,
    "../utils": 42,
    lodash: 94
  } ],
  35: [ function(require, module, exports) {
    var _ = require("lodash"), domEach = require("../utils").domEach;
    var toString = Object.prototype.toString;
    exports.css = function(prop, val) {
      return 2 === arguments.length || "[object Object]" === toString.call(prop) ? domEach(this, function(idx, el) {
        setCss(el, prop, val, idx);
      }) : getCss(this[0], prop);
    };
    function setCss(el, prop, val, idx) {
      if ("string" == typeof prop) {
        var styles = getCss(el);
        "function" === typeof val && (val = val.call(el, idx, styles[prop]));
        "" === val ? delete styles[prop] : null != val && (styles[prop] = val);
        el.attribs.style = stringify(styles);
      } else "object" == typeof prop && Object.keys(prop).forEach(function(k) {
        setCss(el, k, prop[k]);
      });
    }
    function getCss(el, prop) {
      var styles = parse(el.attribs.style);
      return "string" === typeof prop ? styles[prop] : Array.isArray(prop) ? _.pick(styles, prop) : styles;
    }
    function stringify(obj) {
      return Object.keys(obj || {}).reduce(function(str, prop) {
        return str + (str ? " " : "") + prop + ": " + obj[prop] + ";";
      }, "");
    }
    function parse(styles) {
      styles = (styles || "").trim();
      if (!styles) return {};
      return styles.split(";").reduce(function(obj, str) {
        var n = str.indexOf(":");
        if (n < 1 || n === str.length - 1) return obj;
        obj[str.slice(0, n).trim()] = str.slice(n + 1).trim();
        return obj;
      }, {});
    }
  }, {
    "../utils": 42,
    lodash: 94
  } ],
  36: [ function(require, module, exports) {
    var _ = require("lodash"), submittableSelector = "input,select,textarea,keygen", rCRLF = /\r?\n/g;
    exports.serializeArray = function() {
      var Cheerio = this.constructor;
      return this.map(function() {
        var elem = this;
        var $elem = Cheerio(elem);
        return "form" === elem.name ? $elem.find(submittableSelector).toArray() : $elem.filter(submittableSelector).toArray();
      }).filter('[name!=""]:not(:disabled):not(:submit, :button, :image, :reset, :file):matches([checked], :not(:checkbox, :radio))').map(function(i, elem) {
        var $elem = Cheerio(elem);
        var name = $elem.attr("name");
        var val = $elem.val();
        return null == val ? null : Array.isArray(val) ? _.map(val, function(val) {
          return {
            name: name,
            value: val.replace(rCRLF, "\r\n")
          };
        }) : {
          name: name,
          value: val.replace(rCRLF, "\r\n")
        };
      }).get();
    };
  }, {
    lodash: 94
  } ],
  37: [ function(require, module, exports) {
    var _ = require("lodash"), parse = require("../parse"), $ = require("../static"), updateDOM = parse.update, evaluate = parse.evaluate, utils = require("../utils"), domEach = utils.domEach, cloneDom = utils.cloneDom, isHtml = utils.isHtml, slice = Array.prototype.slice;
    exports._makeDomArray = function makeDomArray(elem, clone) {
      return null == elem ? [] : elem.cheerio ? clone ? cloneDom(elem.get(), elem.options) : elem.get() : Array.isArray(elem) ? _.flatten(elem.map(function(el) {
        return this._makeDomArray(el, clone);
      }, this)) : "string" === typeof elem ? evaluate(elem, this.options) : clone ? cloneDom([ elem ]) : [ elem ];
    };
    var _insert = function(concatenator) {
      return function() {
        var elems = slice.call(arguments), lastIdx = this.length - 1;
        return domEach(this, function(i, el) {
          var dom, domSrc;
          domSrc = "function" === typeof elems[0] ? elems[0].call(el, i, $.html(el.children)) : elems;
          dom = this._makeDomArray(domSrc, i < lastIdx);
          concatenator(dom, el.children, el);
        });
      };
    };
    var uniqueSplice = function(array, spliceIdx, spliceCount, newElems, parent) {
      var spliceArgs = [ spliceIdx, spliceCount ].concat(newElems), prev = array[spliceIdx - 1] || null, next = array[spliceIdx] || null;
      var idx, len, prevIdx, node, oldParent;
      for (idx = 0, len = newElems.length; idx < len; ++idx) {
        node = newElems[idx];
        oldParent = node.parent || node.root;
        prevIdx = oldParent && oldParent.children.indexOf(newElems[idx]);
        if (oldParent && prevIdx > -1) {
          oldParent.children.splice(prevIdx, 1);
          parent === oldParent && spliceIdx > prevIdx && spliceArgs[0]--;
        }
        node.root = null;
        node.parent = parent;
        node.prev && (node.prev.next = node.next || null);
        node.next && (node.next.prev = node.prev || null);
        node.prev = newElems[idx - 1] || prev;
        node.next = newElems[idx + 1] || next;
      }
      prev && (prev.next = newElems[0]);
      next && (next.prev = newElems[newElems.length - 1]);
      return array.splice.apply(array, spliceArgs);
    };
    exports.appendTo = function(target) {
      target.cheerio || (target = this.constructor.call(this.constructor, target, null, this._originalRoot));
      target.append(this);
      return this;
    };
    exports.prependTo = function(target) {
      target.cheerio || (target = this.constructor.call(this.constructor, target, null, this._originalRoot));
      target.prepend(this);
      return this;
    };
    exports.append = _insert(function(dom, children, parent) {
      uniqueSplice(children, children.length, 0, dom, parent);
    });
    exports.prepend = _insert(function(dom, children, parent) {
      uniqueSplice(children, 0, 0, dom, parent);
    });
    exports.wrap = function(wrapper) {
      var wrapperFn = "function" === typeof wrapper && wrapper, lastIdx = this.length - 1;
      _.forEach(this, _.bind(function(el, i) {
        var parent = el.parent || el.root, siblings = parent.children, dom, index;
        if (!parent) return;
        wrapperFn && (wrapper = wrapperFn.call(el, i));
        "string" !== typeof wrapper || isHtml(wrapper) || (wrapper = this.parents().last().find(wrapper).clone());
        dom = this._makeDomArray(wrapper, i < lastIdx).slice(0, 1);
        index = siblings.indexOf(el);
        updateDOM([ el ], dom[0]);
        uniqueSplice(siblings, index, 0, dom, parent);
      }, this));
      return this;
    };
    exports.after = function() {
      var elems = slice.call(arguments), lastIdx = this.length - 1;
      domEach(this, function(i, el) {
        var parent = el.parent || el.root;
        if (!parent) return;
        var siblings = parent.children, index = siblings.indexOf(el), domSrc, dom;
        if (index < 0) return;
        domSrc = "function" === typeof elems[0] ? elems[0].call(el, i, $.html(el.children)) : elems;
        dom = this._makeDomArray(domSrc, i < lastIdx);
        uniqueSplice(siblings, index + 1, 0, dom, parent);
      });
      return this;
    };
    exports.insertAfter = function(target) {
      var clones = [], self = this;
      "string" === typeof target && (target = this.constructor.call(this.constructor, target, null, this._originalRoot));
      target = this._makeDomArray(target);
      self.remove();
      domEach(target, function(i, el) {
        var clonedSelf = self._makeDomArray(self.clone());
        var parent = el.parent || el.root;
        if (!parent) return;
        var siblings = parent.children, index = siblings.indexOf(el);
        if (index < 0) return;
        uniqueSplice(siblings, index + 1, 0, clonedSelf, parent);
        clones.push(clonedSelf);
      });
      return this.constructor.call(this.constructor, this._makeDomArray(clones));
    };
    exports.before = function() {
      var elems = slice.call(arguments), lastIdx = this.length - 1;
      domEach(this, function(i, el) {
        var parent = el.parent || el.root;
        if (!parent) return;
        var siblings = parent.children, index = siblings.indexOf(el), domSrc, dom;
        if (index < 0) return;
        domSrc = "function" === typeof elems[0] ? elems[0].call(el, i, $.html(el.children)) : elems;
        dom = this._makeDomArray(domSrc, i < lastIdx);
        uniqueSplice(siblings, index, 0, dom, parent);
      });
      return this;
    };
    exports.insertBefore = function(target) {
      var clones = [], self = this;
      "string" === typeof target && (target = this.constructor.call(this.constructor, target, null, this._originalRoot));
      target = this._makeDomArray(target);
      self.remove();
      domEach(target, function(i, el) {
        var clonedSelf = self._makeDomArray(self.clone());
        var parent = el.parent || el.root;
        if (!parent) return;
        var siblings = parent.children, index = siblings.indexOf(el);
        if (index < 0) return;
        uniqueSplice(siblings, index, 0, clonedSelf, parent);
        clones.push(clonedSelf);
      });
      return this.constructor.call(this.constructor, this._makeDomArray(clones));
    };
    exports.remove = function(selector) {
      var elems = this;
      selector && (elems = elems.filter(selector));
      domEach(elems, function(i, el) {
        var parent = el.parent || el.root;
        if (!parent) return;
        var siblings = parent.children, index = siblings.indexOf(el);
        if (index < 0) return;
        siblings.splice(index, 1);
        el.prev && (el.prev.next = el.next);
        el.next && (el.next.prev = el.prev);
        el.prev = el.next = el.parent = el.root = null;
      });
      return this;
    };
    exports.replaceWith = function(content) {
      var self = this;
      domEach(this, function(i, el) {
        var parent = el.parent || el.root;
        if (!parent) return;
        var siblings = parent.children, dom = self._makeDomArray("function" === typeof content ? content.call(el, i, el) : content), index;
        updateDOM(dom, null);
        index = siblings.indexOf(el);
        uniqueSplice(siblings, index, 1, dom, parent);
        el.parent = el.prev = el.next = el.root = null;
      });
      return this;
    };
    exports.empty = function() {
      domEach(this, function(i, el) {
        _.each(el.children, function(el) {
          el.next = el.prev = el.parent = null;
        });
        el.children.length = 0;
      });
      return this;
    };
    exports.html = function(str) {
      if (void 0 === str) {
        if (!this[0] || !this[0].children) return null;
        return $.html(this[0].children, this.options);
      }
      var opts = this.options;
      domEach(this, function(i, el) {
        _.each(el.children, function(el) {
          el.next = el.prev = el.parent = null;
        });
        var content = str.cheerio ? str.clone().get() : evaluate("" + str, opts);
        updateDOM(content, el);
      });
      return this;
    };
    exports.toString = function() {
      return $.html(this, this.options);
    };
    exports.text = function(str) {
      if (void 0 === str) return $.text(this);
      if ("function" === typeof str) return domEach(this, function(i, el) {
        var $el = [ el ];
        return exports.text.call($el, str.call(el, i, $.text($el)));
      });
      domEach(this, function(i, el) {
        _.each(el.children, function(el) {
          el.next = el.prev = el.parent = null;
        });
        var elem = {
          data: "" + str,
          type: "text",
          parent: el,
          prev: null,
          next: null,
          children: []
        };
        updateDOM(elem, el);
      });
      return this;
    };
    exports.clone = function() {
      return this._make(cloneDom(this.get(), this.options));
    };
  }, {
    "../parse": 40,
    "../static": 41,
    "../utils": 42,
    lodash: 94
  } ],
  38: [ function(require, module, exports) {
    var _ = require("lodash"), select = require("css-select"), utils = require("../utils"), domEach = utils.domEach, uniqueSort = require("htmlparser2").DomUtils.uniqueSort, isTag = utils.isTag;
    exports.find = function(selectorOrHaystack) {
      var elems = _.reduce(this, function(memo, elem) {
        return memo.concat(_.filter(elem.children, isTag));
      }, []);
      var contains = this.constructor.contains;
      var haystack;
      if (selectorOrHaystack && "string" !== typeof selectorOrHaystack) {
        haystack = selectorOrHaystack.cheerio ? selectorOrHaystack.get() : [ selectorOrHaystack ];
        return this._make(haystack.filter(function(elem) {
          var idx, len;
          for (idx = 0, len = this.length; idx < len; ++idx) if (contains(this[idx], elem)) return true;
        }, this));
      }
      var options = {
        __proto__: this.options,
        context: this.toArray()
      };
      return this._make(select(selectorOrHaystack, elems, options));
    };
    exports.parent = function(selector) {
      var set = [];
      domEach(this, function(idx, elem) {
        var parentElem = elem.parent;
        parentElem && set.indexOf(parentElem) < 0 && set.push(parentElem);
      });
      arguments.length && (set = exports.filter.call(set, selector, this));
      return this._make(set);
    };
    exports.parents = function(selector) {
      var parentNodes = [];
      this.get().reverse().forEach(function(elem) {
        traverseParents(this, elem.parent, selector, Infinity).forEach(function(node) {
          -1 === parentNodes.indexOf(node) && parentNodes.push(node);
        });
      }, this);
      return this._make(parentNodes);
    };
    exports.parentsUntil = function(selector, filter) {
      var parentNodes = [], untilNode, untilNodes;
      "string" === typeof selector ? untilNode = select(selector, this.parents().toArray(), this.options)[0] : selector && selector.cheerio ? untilNodes = selector.toArray() : selector && (untilNode = selector);
      this.toArray().reverse().forEach(function(elem) {
        while (elem = elem.parent) {
          if (!(untilNode && elem !== untilNode || untilNodes && -1 === untilNodes.indexOf(elem) || !untilNode && !untilNodes)) break;
          isTag(elem) && -1 === parentNodes.indexOf(elem) && parentNodes.push(elem);
        }
      }, this);
      return this._make(filter ? select(filter, parentNodes, this.options) : parentNodes);
    };
    exports.closest = function(selector) {
      var set = [];
      if (!selector) return this._make(set);
      domEach(this, function(idx, elem) {
        var closestElem = traverseParents(this, elem, selector, 1)[0];
        closestElem && set.indexOf(closestElem) < 0 && set.push(closestElem);
      }.bind(this));
      return this._make(set);
    };
    exports.next = function(selector) {
      if (!this[0]) return this;
      var elems = [];
      _.forEach(this, function(elem) {
        while (elem = elem.next) if (isTag(elem)) {
          elems.push(elem);
          return;
        }
      });
      return selector ? exports.filter.call(elems, selector, this) : this._make(elems);
    };
    exports.nextAll = function(selector) {
      if (!this[0]) return this;
      var elems = [];
      _.forEach(this, function(elem) {
        while (elem = elem.next) isTag(elem) && -1 === elems.indexOf(elem) && elems.push(elem);
      });
      return selector ? exports.filter.call(elems, selector, this) : this._make(elems);
    };
    exports.nextUntil = function(selector, filterSelector) {
      if (!this[0]) return this;
      var elems = [], untilNode, untilNodes;
      "string" === typeof selector ? untilNode = select(selector, this.nextAll().get(), this.options)[0] : selector && selector.cheerio ? untilNodes = selector.get() : selector && (untilNode = selector);
      _.forEach(this, function(elem) {
        while (elem = elem.next) {
          if (!(untilNode && elem !== untilNode || untilNodes && -1 === untilNodes.indexOf(elem) || !untilNode && !untilNodes)) break;
          isTag(elem) && -1 === elems.indexOf(elem) && elems.push(elem);
        }
      });
      return filterSelector ? exports.filter.call(elems, filterSelector, this) : this._make(elems);
    };
    exports.prev = function(selector) {
      if (!this[0]) return this;
      var elems = [];
      _.forEach(this, function(elem) {
        while (elem = elem.prev) if (isTag(elem)) {
          elems.push(elem);
          return;
        }
      });
      return selector ? exports.filter.call(elems, selector, this) : this._make(elems);
    };
    exports.prevAll = function(selector) {
      if (!this[0]) return this;
      var elems = [];
      _.forEach(this, function(elem) {
        while (elem = elem.prev) isTag(elem) && -1 === elems.indexOf(elem) && elems.push(elem);
      });
      return selector ? exports.filter.call(elems, selector, this) : this._make(elems);
    };
    exports.prevUntil = function(selector, filterSelector) {
      if (!this[0]) return this;
      var elems = [], untilNode, untilNodes;
      "string" === typeof selector ? untilNode = select(selector, this.prevAll().get(), this.options)[0] : selector && selector.cheerio ? untilNodes = selector.get() : selector && (untilNode = selector);
      _.forEach(this, function(elem) {
        while (elem = elem.prev) {
          if (!(untilNode && elem !== untilNode || untilNodes && -1 === untilNodes.indexOf(elem) || !untilNode && !untilNodes)) break;
          isTag(elem) && -1 === elems.indexOf(elem) && elems.push(elem);
        }
      });
      return filterSelector ? exports.filter.call(elems, filterSelector, this) : this._make(elems);
    };
    exports.siblings = function(selector) {
      var parent = this.parent();
      var elems = _.filter(parent ? parent.children() : this.siblingsAndMe(), _.bind(function(elem) {
        return isTag(elem) && !this.is(elem);
      }, this));
      return void 0 !== selector ? exports.filter.call(elems, selector, this) : this._make(elems);
    };
    exports.children = function(selector) {
      var elems = _.reduce(this, function(memo, elem) {
        return memo.concat(_.filter(elem.children, isTag));
      }, []);
      if (void 0 === selector) return this._make(elems);
      return exports.filter.call(elems, selector, this);
    };
    exports.contents = function() {
      return this._make(_.reduce(this, function(all, elem) {
        all.push.apply(all, elem.children);
        return all;
      }, []));
    };
    exports.each = function(fn) {
      var i = 0, len = this.length;
      while (i < len && false !== fn.call(this[i], i, this[i])) ++i;
      return this;
    };
    exports.map = function(fn) {
      return this._make(_.reduce(this, function(memo, el, i) {
        var val = fn.call(el, i, el);
        return null == val ? memo : memo.concat(val);
      }, []));
    };
    var makeFilterMethod = function(filterFn) {
      return function(match, container) {
        var testFn;
        container = container || this;
        testFn = "string" === typeof match ? select.compile(match, container.options) : "function" === typeof match ? function(el, i) {
          return match.call(el, i, el);
        } : match.cheerio ? match.is.bind(match) : function(el) {
          return match === el;
        };
        return container._make(filterFn(this, testFn));
      };
    };
    exports.filter = makeFilterMethod(_.filter);
    exports.not = makeFilterMethod(_.reject);
    exports.has = function(selectorOrHaystack) {
      var that = this;
      return exports.filter.call(this, function() {
        return that._make(this).find(selectorOrHaystack).length > 0;
      });
    };
    exports.first = function() {
      return this.length > 1 ? this._make(this[0]) : this;
    };
    exports.last = function() {
      return this.length > 1 ? this._make(this[this.length - 1]) : this;
    };
    exports.eq = function(i) {
      i = +i;
      if (0 === i && this.length <= 1) return this;
      i < 0 && (i = this.length + i);
      return this[i] ? this._make(this[i]) : this._make([]);
    };
    exports.get = function(i) {
      return null == i ? Array.prototype.slice.call(this) : this[i < 0 ? this.length + i : i];
    };
    exports.index = function(selectorOrNeedle) {
      var $haystack, needle;
      if (0 === arguments.length) {
        $haystack = this.parent().children();
        needle = this[0];
      } else if ("string" === typeof selectorOrNeedle) {
        $haystack = this._make(selectorOrNeedle);
        needle = this[0];
      } else {
        $haystack = this;
        needle = selectorOrNeedle.cheerio ? selectorOrNeedle[0] : selectorOrNeedle;
      }
      return $haystack.get().indexOf(needle);
    };
    exports.slice = function() {
      return this._make([].slice.apply(this, arguments));
    };
    function traverseParents(self, elem, selector, limit) {
      var elems = [];
      while (elem && elems.length < limit) {
        selector && !exports.filter.call([ elem ], selector, self).length || elems.push(elem);
        elem = elem.parent;
      }
      return elems;
    }
    exports.end = function() {
      return this.prevObject || this._make([]);
    };
    exports.add = function(other, context) {
      var selection = this._make(other, context);
      var contents = uniqueSort(selection.get().concat(this.get()));
      for (var i = 0; i < contents.length; ++i) selection[i] = contents[i];
      selection.length = contents.length;
      return selection;
    };
    exports.addBack = function(selector) {
      return this.add(arguments.length ? this.prevObject.filter(selector) : this.prevObject);
    };
  }, {
    "../utils": 42,
    "css-select": 43,
    htmlparser2: 80,
    lodash: 94
  } ],
  39: [ function(require, module, exports) {
    var parse = require("./parse"), isHtml = require("./utils").isHtml, _ = require("lodash");
    var api = [ require("./api/attributes"), require("./api/traversing"), require("./api/manipulation"), require("./api/css"), require("./api/forms") ];
    var Cheerio = module.exports = function(selector, context, root, options) {
      if (!(this instanceof Cheerio)) return new Cheerio(selector, context, root, options);
      this.options = _.defaults(options || {}, this.options);
      if (!selector) return this;
      if (root) {
        "string" === typeof root && (root = parse(root, this.options));
        this._root = Cheerio.call(this, root);
      }
      if (selector.cheerio) return selector;
      isNode(selector) && (selector = [ selector ]);
      if (Array.isArray(selector)) {
        _.forEach(selector, _.bind(function(elem, idx) {
          this[idx] = elem;
        }, this));
        this.length = selector.length;
        return this;
      }
      if ("string" === typeof selector && isHtml(selector)) return Cheerio.call(this, parse(selector, this.options).children);
      if (context) if ("string" === typeof context) if (isHtml(context)) {
        context = parse(context, this.options);
        context = Cheerio.call(this, context);
      } else {
        selector = [ context, selector ].join(" ");
        context = this._root;
      } else context.cheerio || (context = Cheerio.call(this, context)); else context = this._root;
      if (!context) return this;
      return context.find(selector);
    };
    _.extend(Cheerio, require("./static"));
    Cheerio.prototype.cheerio = "[cheerio object]";
    Cheerio.prototype.options = {
      withDomLvl1: true,
      normalizeWhitespace: false,
      xmlMode: false,
      decodeEntities: true
    };
    Cheerio.prototype.length = 0;
    Cheerio.prototype.splice = Array.prototype.splice;
    Cheerio.prototype._make = function(dom, context) {
      var cheerio = new this.constructor(dom, context, this._root, this.options);
      cheerio.prevObject = this;
      return cheerio;
    };
    Cheerio.prototype.toArray = function() {
      return this.get();
    };
    api.forEach(function(mod) {
      _.extend(Cheerio.prototype, mod);
    });
    var isNode = function(obj) {
      return obj.name || "text" === obj.type || "comment" === obj.type;
    };
  }, {
    "./api/attributes": 34,
    "./api/css": 35,
    "./api/forms": 36,
    "./api/manipulation": 37,
    "./api/traversing": 38,
    "./parse": 40,
    "./static": 41,
    "./utils": 42,
    lodash: 94
  } ],
  40: [ function(require, module, exports) {
    (function(Buffer) {
      var htmlparser = require("htmlparser2");
      exports = module.exports = function(content, options) {
        var dom = exports.evaluate(content, options), root = exports.evaluate("<root></root>", options)[0];
        root.type = "root";
        exports.update(dom, root);
        return root;
      };
      exports.evaluate = function(content, options) {
        var dom;
        dom = "string" === typeof content || Buffer.isBuffer(content) ? htmlparser.parseDOM(content, options) : content;
        return dom;
      };
      exports.update = function(arr, parent) {
        Array.isArray(arr) || (arr = [ arr ]);
        parent ? parent.children = arr : parent = null;
        for (var i = 0; i < arr.length; i++) {
          var node = arr[i];
          var oldParent = node.parent || node.root, oldSiblings = oldParent && oldParent.children;
          if (oldSiblings && oldSiblings !== arr) {
            oldSiblings.splice(oldSiblings.indexOf(node), 1);
            node.prev && (node.prev.next = node.next);
            node.next && (node.next.prev = node.prev);
          }
          if (parent) {
            node.prev = arr[i - 1] || null;
            node.next = arr[i + 1] || null;
          } else node.prev = node.next = null;
          if (parent && "root" === parent.type) {
            node.root = parent;
            node.parent = null;
          } else {
            node.root = null;
            node.parent = parent;
          }
        }
        return parent;
      };
    }).call(this, {
      isBuffer: require("../../../../../../../Applications/CocosCreator/Creator/2.4.4/CocosCreator.app/Contents/Resources/app.asar/node_modules/is-buffer/index.js")
    });
  }, {
    "../../../../../../../Applications/CocosCreator/Creator/2.4.4/CocosCreator.app/Contents/Resources/app.asar/node_modules/is-buffer/index.js": 9,
    htmlparser2: 80
  } ],
  41: [ function(require, module, exports) {
    var select = require("css-select"), parse = require("./parse"), serialize = require("dom-serializer"), _ = require("lodash");
    exports.load = function(content, options) {
      var Cheerio = require("./cheerio");
      options = _.defaults(options || {}, Cheerio.prototype.options);
      var root = parse(content, options);
      var initialize = function(selector, context, r, opts) {
        if (!(this instanceof initialize)) return new initialize(selector, context, r, opts);
        opts = _.defaults(opts || {}, options);
        return Cheerio.call(this, selector, context, r || root, opts);
      };
      initialize.prototype = Object.create(Cheerio.prototype);
      initialize.prototype.constructor = initialize;
      initialize.fn = initialize.prototype;
      initialize.prototype._originalRoot = root;
      _.merge(initialize, exports);
      initialize._root = root;
      initialize._options = options;
      return initialize;
    };
    function render(that, dom, options) {
      if (dom) "string" === typeof dom && (dom = select(dom, that._root, options)); else {
        if (!that._root || !that._root.children) return "";
        dom = that._root.children;
      }
      return serialize(dom, options);
    }
    exports.html = function(dom, options) {
      var Cheerio = require("./cheerio");
      if ("[object Object]" === Object.prototype.toString.call(dom) && !options && !("length" in dom) && !("type" in dom)) {
        options = dom;
        dom = void 0;
      }
      options = _.defaults(options || {}, this._options, Cheerio.prototype.options);
      return render(this, dom, options);
    };
    exports.xml = function(dom) {
      var options = _.defaults({
        xmlMode: true
      }, this._options);
      return render(this, dom, options);
    };
    exports.text = function(elems) {
      if (!elems) return "";
      var ret = "", len = elems.length, elem;
      for (var i = 0; i < len; i++) {
        elem = elems[i];
        "text" === elem.type ? ret += elem.data : elem.children && "comment" !== elem.type && (ret += exports.text(elem.children));
      }
      return ret;
    };
    exports.parseHTML = function(data, context, keepScripts) {
      var parsed;
      if (!data || "string" !== typeof data) return null;
      "boolean" === typeof context && (keepScripts = context);
      parsed = this.load(data);
      keepScripts || parsed("script").remove();
      return parsed.root()[0].children.slice();
    };
    exports.root = function() {
      return this(this._root);
    };
    exports.contains = function(container, contained) {
      if (contained === container) return false;
      while (contained && contained !== contained.parent) {
        contained = contained.parent;
        if (contained === container) return true;
      }
      return false;
    };
  }, {
    "./cheerio": 39,
    "./parse": 40,
    "css-select": 43,
    "dom-serializer": 63,
    lodash: 94
  } ],
  42: [ function(require, module, exports) {
    var parse = require("./parse"), render = require("dom-serializer");
    var tags = {
      tag: true,
      script: true,
      style: true
    };
    exports.isTag = function(type) {
      type.type && (type = type.type);
      return tags[type] || false;
    };
    exports.camelCase = function(str) {
      return str.replace(/[_.-](\w|$)/g, function(_, x) {
        return x.toUpperCase();
      });
    };
    exports.cssCase = function(str) {
      return str.replace(/[A-Z]/g, "-$&").toLowerCase();
    };
    exports.domEach = function(cheerio, fn) {
      var i = 0, len = cheerio.length;
      while (i < len && false !== fn.call(cheerio, i, cheerio[i])) ++i;
      return cheerio;
    };
    exports.cloneDom = function(dom, options) {
      return parse(render(dom, options), options).children;
    };
    var quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/;
    exports.isHtml = function(str) {
      if ("<" === str.charAt(0) && ">" === str.charAt(str.length - 1) && str.length >= 3) return true;
      var match = quickExpr.exec(str);
      return !!(match && match[1]);
    };
  }, {
    "./parse": 40,
    "dom-serializer": 63
  } ],
  43: [ function(require, module, exports) {
    "use strict";
    module.exports = CSSselect;
    var Pseudos = require("./lib/pseudos.js"), DomUtils = require("domutils"), findOne = DomUtils.findOne, findAll = DomUtils.findAll, getChildren = DomUtils.getChildren, removeSubsets = DomUtils.removeSubsets, falseFunc = require("boolbase").falseFunc, compile = require("./lib/compile.js"), compileUnsafe = compile.compileUnsafe, compileToken = compile.compileToken;
    function getSelectorFunc(searchFunc) {
      return function select(query, elems, options) {
        "function" !== typeof query && (query = compileUnsafe(query, options, elems));
        elems = Array.isArray(elems) ? removeSubsets(elems) : getChildren(elems);
        return searchFunc(query, elems);
      };
    }
    var selectAll = getSelectorFunc(function selectAll(query, elems) {
      return query !== falseFunc && elems && 0 !== elems.length ? findAll(query, elems) : [];
    });
    var selectOne = getSelectorFunc(function selectOne(query, elems) {
      return query !== falseFunc && elems && 0 !== elems.length ? findOne(query, elems) : null;
    });
    function is(elem, query, options) {
      return ("function" === typeof query ? query : compile(query, options))(elem);
    }
    function CSSselect(query, elems, options) {
      return selectAll(query, elems, options);
    }
    CSSselect.compile = compile;
    CSSselect.filters = Pseudos.filters;
    CSSselect.pseudos = Pseudos.pseudos;
    CSSselect.selectAll = selectAll;
    CSSselect.selectOne = selectOne;
    CSSselect.is = is;
    CSSselect.parse = compile;
    CSSselect.iterate = selectAll;
    CSSselect._compileUnsafe = compileUnsafe;
    CSSselect._compileToken = compileToken;
  }, {
    "./lib/compile.js": 45,
    "./lib/pseudos.js": 48,
    boolbase: 50,
    domutils: 52
  } ],
  44: [ function(require, module, exports) {
    var DomUtils = require("domutils"), hasAttrib = DomUtils.hasAttrib, getAttributeValue = DomUtils.getAttributeValue, falseFunc = require("boolbase").falseFunc;
    var reChars = /[-[\]{}()*+?.,\\^$|#\s]/g;
    var attributeRules = {
      __proto__: null,
      equals: function(next, data) {
        var name = data.name, value = data.value;
        if (data.ignoreCase) {
          value = value.toLowerCase();
          return function equalsIC(elem) {
            var attr = getAttributeValue(elem, name);
            return null != attr && attr.toLowerCase() === value && next(elem);
          };
        }
        return function equals(elem) {
          return getAttributeValue(elem, name) === value && next(elem);
        };
      },
      hyphen: function(next, data) {
        var name = data.name, value = data.value, len = value.length;
        if (data.ignoreCase) {
          value = value.toLowerCase();
          return function hyphenIC(elem) {
            var attr = getAttributeValue(elem, name);
            return null != attr && (attr.length === len || "-" === attr.charAt(len)) && attr.substr(0, len).toLowerCase() === value && next(elem);
          };
        }
        return function hyphen(elem) {
          var attr = getAttributeValue(elem, name);
          return null != attr && attr.substr(0, len) === value && (attr.length === len || "-" === attr.charAt(len)) && next(elem);
        };
      },
      element: function(next, data) {
        var name = data.name, value = data.value;
        if (/\s/.test(value)) return falseFunc;
        value = value.replace(reChars, "\\$&");
        var pattern = "(?:^|\\s)" + value + "(?:$|\\s)", flags = data.ignoreCase ? "i" : "", regex = new RegExp(pattern, flags);
        return function element(elem) {
          var attr = getAttributeValue(elem, name);
          return null != attr && regex.test(attr) && next(elem);
        };
      },
      exists: function(next, data) {
        var name = data.name;
        return function exists(elem) {
          return hasAttrib(elem, name) && next(elem);
        };
      },
      start: function(next, data) {
        var name = data.name, value = data.value, len = value.length;
        if (0 === len) return falseFunc;
        if (data.ignoreCase) {
          value = value.toLowerCase();
          return function startIC(elem) {
            var attr = getAttributeValue(elem, name);
            return null != attr && attr.substr(0, len).toLowerCase() === value && next(elem);
          };
        }
        return function start(elem) {
          var attr = getAttributeValue(elem, name);
          return null != attr && attr.substr(0, len) === value && next(elem);
        };
      },
      end: function(next, data) {
        var name = data.name, value = data.value, len = -value.length;
        if (0 === len) return falseFunc;
        if (data.ignoreCase) {
          value = value.toLowerCase();
          return function endIC(elem) {
            var attr = getAttributeValue(elem, name);
            return null != attr && attr.substr(len).toLowerCase() === value && next(elem);
          };
        }
        return function end(elem) {
          var attr = getAttributeValue(elem, name);
          return null != attr && attr.substr(len) === value && next(elem);
        };
      },
      any: function(next, data) {
        var name = data.name, value = data.value;
        if ("" === value) return falseFunc;
        if (data.ignoreCase) {
          var regex = new RegExp(value.replace(reChars, "\\$&"), "i");
          return function anyIC(elem) {
            var attr = getAttributeValue(elem, name);
            return null != attr && regex.test(attr) && next(elem);
          };
        }
        return function any(elem) {
          var attr = getAttributeValue(elem, name);
          return null != attr && attr.indexOf(value) >= 0 && next(elem);
        };
      },
      not: function(next, data) {
        var name = data.name, value = data.value;
        if ("" === value) return function notEmpty(elem) {
          return !!getAttributeValue(elem, name) && next(elem);
        };
        if (data.ignoreCase) {
          value = value.toLowerCase();
          return function notIC(elem) {
            var attr = getAttributeValue(elem, name);
            return null != attr && attr.toLowerCase() !== value && next(elem);
          };
        }
        return function not(elem) {
          return getAttributeValue(elem, name) !== value && next(elem);
        };
      }
    };
    module.exports = {
      compile: function(next, data, options) {
        if (options && options.strict && (data.ignoreCase || "not" === data.action)) throw SyntaxError("Unsupported attribute selector");
        return attributeRules[data.action](next, data);
      },
      rules: attributeRules
    };
  }, {
    boolbase: 50,
    domutils: 52
  } ],
  45: [ function(require, module, exports) {
    module.exports = compile;
    module.exports.compileUnsafe = compileUnsafe;
    module.exports.compileToken = compileToken;
    var parse = require("css-what"), DomUtils = require("domutils"), isTag = DomUtils.isTag, Rules = require("./general.js"), sortRules = require("./sort.js"), BaseFuncs = require("boolbase"), trueFunc = BaseFuncs.trueFunc, falseFunc = BaseFuncs.falseFunc, procedure = require("./procedure.json");
    function compile(selector, options, context) {
      var next = compileUnsafe(selector, options, context);
      return wrap(next);
    }
    function wrap(next) {
      return function base(elem) {
        return isTag(elem) && next(elem);
      };
    }
    function compileUnsafe(selector, options, context) {
      var token = parse(selector, options);
      return compileToken(token, options, context);
    }
    function includesScopePseudo(t) {
      return "pseudo" === t.type && ("scope" === t.name || Array.isArray(t.data) && t.data.some(function(data) {
        return data.some(includesScopePseudo);
      }));
    }
    var DESCENDANT_TOKEN = {
      type: "descendant"
    }, SCOPE_TOKEN = {
      type: "pseudo",
      name: "scope"
    }, PLACEHOLDER_ELEMENT = {}, getParent = DomUtils.getParent;
    function absolutize(token, context) {
      var hasContext = !!context && !!context.length && context.every(function(e) {
        return e === PLACEHOLDER_ELEMENT || !!getParent(e);
      });
      token.forEach(function(t) {
        if (t.length > 0 && isTraversal(t[0]) && "descendant" !== t[0].type) ; else {
          if (!hasContext || includesScopePseudo(t)) return;
          t.unshift(DESCENDANT_TOKEN);
        }
        t.unshift(SCOPE_TOKEN);
      });
    }
    function compileToken(token, options, context) {
      token = token.filter(function(t) {
        return t.length > 0;
      });
      token.forEach(sortRules);
      var isArrayContext = Array.isArray(context);
      context = options && options.context || context;
      context && !isArrayContext && (context = [ context ]);
      absolutize(token, context);
      return token.map(function(rules) {
        return compileRules(rules, options, context, isArrayContext);
      }).reduce(reduceRules, falseFunc);
    }
    function isTraversal(t) {
      return procedure[t.type] < 0;
    }
    function compileRules(rules, options, context, isArrayContext) {
      var acceptSelf = isArrayContext && "scope" === rules[0].name && "descendant" === rules[1].type;
      return rules.reduce(function(func, rule, index) {
        if (func === falseFunc) return func;
        return Rules[rule.type](func, rule, options, context, acceptSelf && 1 === index);
      }, options && options.rootFunc || trueFunc);
    }
    function reduceRules(a, b) {
      if (b === falseFunc || a === trueFunc) return a;
      if (a === falseFunc || b === trueFunc) return b;
      return function combine(elem) {
        return a(elem) || b(elem);
      };
    }
    var Pseudos = require("./pseudos.js"), filters = Pseudos.filters, existsOne = DomUtils.existsOne, isTag = DomUtils.isTag, getChildren = DomUtils.getChildren;
    function containsTraversal(t) {
      return t.some(isTraversal);
    }
    filters.not = function(next, token, options, context) {
      var opts = {
        xmlMode: !!(options && options.xmlMode),
        strict: !!(options && options.strict)
      };
      if (opts.strict && (token.length > 1 || token.some(containsTraversal))) throw new SyntaxError("complex selectors in :not aren't allowed in strict mode");
      var func = compileToken(token, opts, context);
      if (func === falseFunc) return next;
      if (func === trueFunc) return falseFunc;
      return function(elem) {
        return !func(elem) && next(elem);
      };
    };
    filters.has = function(next, token, options) {
      var opts = {
        xmlMode: !!(options && options.xmlMode),
        strict: !!(options && options.strict)
      };
      var context = token.some(containsTraversal) ? [ PLACEHOLDER_ELEMENT ] : null;
      var func = compileToken(token, opts, context);
      if (func === falseFunc) return falseFunc;
      if (func === trueFunc) return function(elem) {
        return getChildren(elem).some(isTag) && next(elem);
      };
      func = wrap(func);
      if (context) return function has(elem) {
        return next(elem) && (context[0] = elem, existsOne(func, getChildren(elem)));
      };
      return function has(elem) {
        return next(elem) && existsOne(func, getChildren(elem));
      };
    };
    filters.matches = function(next, token, options, context) {
      var opts = {
        xmlMode: !!(options && options.xmlMode),
        strict: !!(options && options.strict),
        rootFunc: next
      };
      return compileToken(token, opts, context);
    };
  }, {
    "./general.js": 46,
    "./procedure.json": 47,
    "./pseudos.js": 48,
    "./sort.js": 49,
    boolbase: 50,
    "css-what": 51,
    domutils: 52
  } ],
  46: [ function(require, module, exports) {
    var DomUtils = require("domutils"), isTag = DomUtils.isTag, getParent = DomUtils.getParent, getChildren = DomUtils.getChildren, getSiblings = DomUtils.getSiblings, getName = DomUtils.getName;
    module.exports = {
      __proto__: null,
      attribute: require("./attributes.js").compile,
      pseudo: require("./pseudos.js").compile,
      tag: function(next, data) {
        var name = data.name;
        return function tag(elem) {
          return getName(elem) === name && next(elem);
        };
      },
      descendant: function(next, rule, options, context, acceptSelf) {
        return function descendant(elem) {
          if (acceptSelf && next(elem)) return true;
          var found = false;
          while (!found && (elem = getParent(elem))) found = next(elem);
          return found;
        };
      },
      parent: function(next, data, options) {
        if (options && options.strict) throw SyntaxError("Parent selector isn't part of CSS3");
        return function parent(elem) {
          return getChildren(elem).some(test);
        };
        function test(elem) {
          return isTag(elem) && next(elem);
        }
      },
      child: function(next) {
        return function child(elem) {
          var parent = getParent(elem);
          return !!parent && next(parent);
        };
      },
      sibling: function(next) {
        return function sibling(elem) {
          var siblings = getSiblings(elem);
          for (var i = 0; i < siblings.length; i++) if (isTag(siblings[i])) {
            if (siblings[i] === elem) break;
            if (next(siblings[i])) return true;
          }
          return false;
        };
      },
      adjacent: function(next) {
        return function adjacent(elem) {
          var siblings = getSiblings(elem), lastElement;
          for (var i = 0; i < siblings.length; i++) if (isTag(siblings[i])) {
            if (siblings[i] === elem) break;
            lastElement = siblings[i];
          }
          return !!lastElement && next(lastElement);
        };
      },
      universal: function(next) {
        return next;
      }
    };
  }, {
    "./attributes.js": 44,
    "./pseudos.js": 48,
    domutils: 52
  } ],
  47: [ function(require, module, exports) {
    module.exports = {
      universal: 50,
      tag: 30,
      attribute: 1,
      pseudo: 0,
      descendant: -1,
      child: -1,
      parent: -1,
      sibling: -1,
      adjacent: -1
    };
  }, {} ],
  48: [ function(require, module, exports) {
    var DomUtils = require("domutils"), isTag = DomUtils.isTag, getText = DomUtils.getText, getParent = DomUtils.getParent, getChildren = DomUtils.getChildren, getSiblings = DomUtils.getSiblings, hasAttrib = DomUtils.hasAttrib, getName = DomUtils.getName, getAttribute = DomUtils.getAttributeValue, getNCheck = require("nth-check"), checkAttrib = require("./attributes.js").rules.equals, BaseFuncs = require("boolbase"), trueFunc = BaseFuncs.trueFunc, falseFunc = BaseFuncs.falseFunc;
    function getFirstElement(elems) {
      for (var i = 0; elems && i < elems.length; i++) if (isTag(elems[i])) return elems[i];
    }
    function getAttribFunc(name, value) {
      var data = {
        name: name,
        value: value
      };
      return function attribFunc(next) {
        return checkAttrib(next, data);
      };
    }
    function getChildFunc(next) {
      return function(elem) {
        return !!getParent(elem) && next(elem);
      };
    }
    var filters = {
      contains: function(next, text) {
        return function contains(elem) {
          return next(elem) && getText(elem).indexOf(text) >= 0;
        };
      },
      icontains: function(next, text) {
        var itext = text.toLowerCase();
        return function icontains(elem) {
          return next(elem) && getText(elem).toLowerCase().indexOf(itext) >= 0;
        };
      },
      "nth-child": function(next, rule) {
        var func = getNCheck(rule);
        if (func === falseFunc) return func;
        if (func === trueFunc) return getChildFunc(next);
        return function nthChild(elem) {
          var siblings = getSiblings(elem);
          for (var i = 0, pos = 0; i < siblings.length; i++) if (isTag(siblings[i])) {
            if (siblings[i] === elem) break;
            pos++;
          }
          return func(pos) && next(elem);
        };
      },
      "nth-last-child": function(next, rule) {
        var func = getNCheck(rule);
        if (func === falseFunc) return func;
        if (func === trueFunc) return getChildFunc(next);
        return function nthLastChild(elem) {
          var siblings = getSiblings(elem);
          for (var pos = 0, i = siblings.length - 1; i >= 0; i--) if (isTag(siblings[i])) {
            if (siblings[i] === elem) break;
            pos++;
          }
          return func(pos) && next(elem);
        };
      },
      "nth-of-type": function(next, rule) {
        var func = getNCheck(rule);
        if (func === falseFunc) return func;
        if (func === trueFunc) return getChildFunc(next);
        return function nthOfType(elem) {
          var siblings = getSiblings(elem);
          for (var pos = 0, i = 0; i < siblings.length; i++) if (isTag(siblings[i])) {
            if (siblings[i] === elem) break;
            getName(siblings[i]) === getName(elem) && pos++;
          }
          return func(pos) && next(elem);
        };
      },
      "nth-last-of-type": function(next, rule) {
        var func = getNCheck(rule);
        if (func === falseFunc) return func;
        if (func === trueFunc) return getChildFunc(next);
        return function nthLastOfType(elem) {
          var siblings = getSiblings(elem);
          for (var pos = 0, i = siblings.length - 1; i >= 0; i--) if (isTag(siblings[i])) {
            if (siblings[i] === elem) break;
            getName(siblings[i]) === getName(elem) && pos++;
          }
          return func(pos) && next(elem);
        };
      },
      root: function(next) {
        return function(elem) {
          return !getParent(elem) && next(elem);
        };
      },
      scope: function(next, rule, options, context) {
        if (!context || 0 === context.length) return filters.root(next);
        if (1 === context.length) return function(elem) {
          return context[0] === elem && next(elem);
        };
        return function(elem) {
          return context.indexOf(elem) >= 0 && next(elem);
        };
      },
      checkbox: getAttribFunc("type", "checkbox"),
      file: getAttribFunc("type", "file"),
      password: getAttribFunc("type", "password"),
      radio: getAttribFunc("type", "radio"),
      reset: getAttribFunc("type", "reset"),
      image: getAttribFunc("type", "image"),
      submit: getAttribFunc("type", "submit")
    };
    var pseudos = {
      empty: function(elem) {
        return !getChildren(elem).some(function(elem) {
          return isTag(elem) || "text" === elem.type;
        });
      },
      "first-child": function(elem) {
        return getFirstElement(getSiblings(elem)) === elem;
      },
      "last-child": function(elem) {
        var siblings = getSiblings(elem);
        for (var i = siblings.length - 1; i >= 0; i--) {
          if (siblings[i] === elem) return true;
          if (isTag(siblings[i])) break;
        }
        return false;
      },
      "first-of-type": function(elem) {
        var siblings = getSiblings(elem);
        for (var i = 0; i < siblings.length; i++) if (isTag(siblings[i])) {
          if (siblings[i] === elem) return true;
          if (getName(siblings[i]) === getName(elem)) break;
        }
        return false;
      },
      "last-of-type": function(elem) {
        var siblings = getSiblings(elem);
        for (var i = siblings.length - 1; i >= 0; i--) if (isTag(siblings[i])) {
          if (siblings[i] === elem) return true;
          if (getName(siblings[i]) === getName(elem)) break;
        }
        return false;
      },
      "only-of-type": function(elem) {
        var siblings = getSiblings(elem);
        for (var i = 0, j = siblings.length; i < j; i++) if (isTag(siblings[i])) {
          if (siblings[i] === elem) continue;
          if (getName(siblings[i]) === getName(elem)) return false;
        }
        return true;
      },
      "only-child": function(elem) {
        var siblings = getSiblings(elem);
        for (var i = 0; i < siblings.length; i++) if (isTag(siblings[i]) && siblings[i] !== elem) return false;
        return true;
      },
      link: function(elem) {
        return hasAttrib(elem, "href");
      },
      visited: falseFunc,
      selected: function(elem) {
        if (hasAttrib(elem, "selected")) return true;
        if ("option" !== getName(elem)) return false;
        var parent = getParent(elem);
        if (!parent || "select" !== getName(parent) || hasAttrib(parent, "multiple")) return false;
        var siblings = getChildren(parent), sawElem = false;
        for (var i = 0; i < siblings.length; i++) if (isTag(siblings[i])) if (siblings[i] === elem) sawElem = true; else {
          if (!sawElem) return false;
          if (hasAttrib(siblings[i], "selected")) return false;
        }
        return sawElem;
      },
      disabled: function(elem) {
        return hasAttrib(elem, "disabled");
      },
      enabled: function(elem) {
        return !hasAttrib(elem, "disabled");
      },
      checked: function(elem) {
        return hasAttrib(elem, "checked") || pseudos.selected(elem);
      },
      required: function(elem) {
        return hasAttrib(elem, "required");
      },
      optional: function(elem) {
        return !hasAttrib(elem, "required");
      },
      parent: function(elem) {
        return !pseudos.empty(elem);
      },
      header: function(elem) {
        var name = getName(elem);
        return "h1" === name || "h2" === name || "h3" === name || "h4" === name || "h5" === name || "h6" === name;
      },
      button: function(elem) {
        var name = getName(elem);
        return "button" === name || "input" === name && "button" === getAttribute(elem, "type");
      },
      input: function(elem) {
        var name = getName(elem);
        return "input" === name || "textarea" === name || "select" === name || "button" === name;
      },
      text: function(elem) {
        var attr;
        return "input" === getName(elem) && (!(attr = getAttribute(elem, "type")) || "text" === attr.toLowerCase());
      }
    };
    function verifyArgs(func, name, subselect) {
      if (null === subselect) {
        if (func.length > 1 && "scope" !== name) throw new SyntaxError("pseudo-selector :" + name + " requires an argument");
      } else if (1 === func.length) throw new SyntaxError("pseudo-selector :" + name + " doesn't have any arguments");
    }
    var re_CSS3 = /^(?:(?:nth|last|first|only)-(?:child|of-type)|root|empty|(?:en|dis)abled|checked|not)$/;
    module.exports = {
      compile: function(next, data, options, context) {
        var name = data.name, subselect = data.data;
        if (options && options.strict && !re_CSS3.test(name)) throw SyntaxError(":" + name + " isn't part of CSS3");
        if ("function" === typeof filters[name]) {
          verifyArgs(filters[name], name, subselect);
          return filters[name](next, subselect, options, context);
        }
        if ("function" === typeof pseudos[name]) {
          var func = pseudos[name];
          verifyArgs(func, name, subselect);
          if (next === trueFunc) return func;
          return function pseudoArgs(elem) {
            return func(elem, subselect) && next(elem);
          };
        }
        throw new SyntaxError("unmatched pseudo-class :" + name);
      },
      filters: filters,
      pseudos: pseudos
    };
  }, {
    "./attributes.js": 44,
    boolbase: 50,
    domutils: 52,
    "nth-check": 61
  } ],
  49: [ function(require, module, exports) {
    module.exports = sortByProcedure;
    var procedure = require("./procedure.json");
    var attributes = {
      __proto__: null,
      exists: 10,
      equals: 8,
      not: 7,
      start: 6,
      end: 6,
      any: 5,
      hyphen: 4,
      element: 4
    };
    function sortByProcedure(arr) {
      var procs = arr.map(getProcedure);
      for (var i = 1; i < arr.length; i++) {
        var procNew = procs[i];
        if (procNew < 0) continue;
        for (var j = i - 1; j >= 0 && procNew < procs[j]; j--) {
          var token = arr[j + 1];
          arr[j + 1] = arr[j];
          arr[j] = token;
          procs[j + 1] = procs[j];
          procs[j] = procNew;
        }
      }
    }
    function getProcedure(token) {
      var proc = procedure[token.type];
      if (proc === procedure.attribute) {
        proc = attributes[token.action];
        proc === attributes.equals && "id" === token.name && (proc = 9);
        token.ignoreCase && (proc >>= 1);
      } else if (proc === procedure.pseudo) if (token.data) if ("has" === token.name || "contains" === token.name) proc = 0; else if ("matches" === token.name || "not" === token.name) {
        proc = 0;
        for (var i = 0; i < token.data.length; i++) {
          if (1 !== token.data[i].length) continue;
          var cur = getProcedure(token.data[i][0]);
          if (0 === cur) {
            proc = 0;
            break;
          }
          cur > proc && (proc = cur);
        }
        token.data.length > 1 && proc > 0 && (proc -= 1);
      } else proc = 1; else proc = 3;
      return proc;
    }
  }, {
    "./procedure.json": 47
  } ],
  50: [ function(require, module, exports) {
    module.exports = {
      trueFunc: function trueFunc() {
        return true;
      },
      falseFunc: function falseFunc() {
        return false;
      }
    };
  }, {} ],
  51: [ function(require, module, exports) {
    "use strict";
    module.exports = parse;
    var re_name = /^(?:\\.|[\w\-\u00c0-\uFFFF])+/, re_escape = /\\([\da-f]{1,6}\s?|(\s)|.)/gi, re_attr = /^\s*((?:\\.|[\w\u00c0-\uFFFF\-])+)\s*(?:(\S?)=\s*(?:(['"])(.*?)\3|(#?(?:\\.|[\w\u00c0-\uFFFF\-])*)|)|)\s*(i)?\]/;
    var actionTypes = {
      __proto__: null,
      undefined: "exists",
      "": "equals",
      "~": "element",
      "^": "start",
      $: "end",
      "*": "any",
      "!": "not",
      "|": "hyphen"
    };
    var simpleSelectors = {
      __proto__: null,
      ">": "child",
      "<": "parent",
      "~": "sibling",
      "+": "adjacent"
    };
    var attribSelectors = {
      __proto__: null,
      "#": [ "id", "equals" ],
      ".": [ "class", "element" ]
    };
    var unpackPseudos = {
      __proto__: null,
      has: true,
      not: true,
      matches: true
    };
    var stripQuotesFromPseudos = {
      __proto__: null,
      contains: true,
      icontains: true
    };
    var quotes = {
      __proto__: null,
      '"': true,
      "'": true
    };
    function funescape(_, escaped, escapedWhitespace) {
      var high = "0x" + escaped - 65536;
      return high !== high || escapedWhitespace ? escaped : high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, 1023 & high | 56320);
    }
    function unescapeCSS(str) {
      return str.replace(re_escape, funescape);
    }
    function isWhitespace(c) {
      return " " === c || "\n" === c || "\t" === c || "\f" === c || "\r" === c;
    }
    function parse(selector, options) {
      var subselects = [];
      selector = parseSelector(subselects, selector + "", options);
      if ("" !== selector) throw new SyntaxError("Unmatched selector: " + selector);
      return subselects;
    }
    function parseSelector(subselects, selector, options) {
      var tokens = [], sawWS = false, data, firstChar, name, quot;
      function getName() {
        var sub = selector.match(re_name)[0];
        selector = selector.substr(sub.length);
        return unescapeCSS(sub);
      }
      function stripWhitespace(start) {
        while (isWhitespace(selector.charAt(start))) start++;
        selector = selector.substr(start);
      }
      stripWhitespace(0);
      while ("" !== selector) {
        firstChar = selector.charAt(0);
        if (isWhitespace(firstChar)) {
          sawWS = true;
          stripWhitespace(1);
        } else if (firstChar in simpleSelectors) {
          tokens.push({
            type: simpleSelectors[firstChar]
          });
          sawWS = false;
          stripWhitespace(1);
        } else if ("," === firstChar) {
          if (0 === tokens.length) throw new SyntaxError("empty sub-selector");
          subselects.push(tokens);
          tokens = [];
          sawWS = false;
          stripWhitespace(1);
        } else {
          if (sawWS) {
            tokens.length > 0 && tokens.push({
              type: "descendant"
            });
            sawWS = false;
          }
          if ("*" === firstChar) {
            selector = selector.substr(1);
            tokens.push({
              type: "universal"
            });
          } else if (firstChar in attribSelectors) {
            selector = selector.substr(1);
            tokens.push({
              type: "attribute",
              name: attribSelectors[firstChar][0],
              action: attribSelectors[firstChar][1],
              value: getName(),
              ignoreCase: false
            });
          } else if ("[" === firstChar) {
            selector = selector.substr(1);
            data = selector.match(re_attr);
            if (!data) throw new SyntaxError("Malformed attribute selector: " + selector);
            selector = selector.substr(data[0].length);
            name = unescapeCSS(data[1]);
            options && ("lowerCaseAttributeNames" in options ? !options.lowerCaseAttributeNames : options.xmlMode) || (name = name.toLowerCase());
            tokens.push({
              type: "attribute",
              name: name,
              action: actionTypes[data[2]],
              value: unescapeCSS(data[4] || data[5] || ""),
              ignoreCase: !!data[6]
            });
          } else if (":" === firstChar) {
            if (":" === selector.charAt(1)) {
              selector = selector.substr(2);
              tokens.push({
                type: "pseudo-element",
                name: getName().toLowerCase()
              });
              continue;
            }
            selector = selector.substr(1);
            name = getName().toLowerCase();
            data = null;
            if ("(" === selector.charAt(0)) if (name in unpackPseudos) {
              quot = selector.charAt(1);
              var quoted = quot in quotes;
              selector = selector.substr(quoted + 1);
              data = [];
              selector = parseSelector(data, selector, options);
              if (quoted) {
                if (selector.charAt(0) !== quot) throw new SyntaxError("unmatched quotes in :" + name);
                selector = selector.substr(1);
              }
              if (")" !== selector.charAt(0)) throw new SyntaxError("missing closing parenthesis in :" + name + " " + selector);
              selector = selector.substr(1);
            } else {
              var pos = 1, counter = 1;
              for (;counter > 0 && pos < selector.length; pos++) "(" === selector.charAt(pos) ? counter++ : ")" === selector.charAt(pos) && counter--;
              if (counter) throw new SyntaxError("parenthesis not matched");
              data = selector.substr(1, pos - 2);
              selector = selector.substr(pos);
              if (name in stripQuotesFromPseudos) {
                quot = data.charAt(0);
                quot === data.slice(-1) && quot in quotes && (data = data.slice(1, -1));
                data = unescapeCSS(data);
              }
            }
            tokens.push({
              type: "pseudo",
              name: name,
              data: data
            });
          } else {
            if (!re_name.test(selector)) {
              tokens.length && "descendant" === tokens[tokens.length - 1].type && tokens.pop();
              addToken(subselects, tokens);
              return selector;
            }
            name = getName();
            options && ("lowerCaseTags" in options ? !options.lowerCaseTags : options.xmlMode) || (name = name.toLowerCase());
            tokens.push({
              type: "tag",
              name: name
            });
          }
        }
      }
      addToken(subselects, tokens);
      return selector;
    }
    function addToken(subselects, tokens) {
      if (subselects.length > 0 && 0 === tokens.length) throw new SyntaxError("empty sub-selector");
      subselects.push(tokens);
    }
  }, {} ],
  52: [ function(require, module, exports) {
    var DomUtils = module.exports;
    [ require("./lib/stringify"), require("./lib/traversal"), require("./lib/manipulation"), require("./lib/querying"), require("./lib/legacy"), require("./lib/helpers") ].forEach(function(ext) {
      Object.keys(ext).forEach(function(key) {
        DomUtils[key] = ext[key].bind(DomUtils);
      });
    });
  }, {
    "./lib/helpers": 53,
    "./lib/legacy": 54,
    "./lib/manipulation": 55,
    "./lib/querying": 56,
    "./lib/stringify": 57,
    "./lib/traversal": 58
  } ],
  53: [ function(require, module, exports) {
    exports.removeSubsets = function(nodes) {
      var idx = nodes.length, node, ancestor, replace;
      while (--idx > -1) {
        node = ancestor = nodes[idx];
        nodes[idx] = null;
        replace = true;
        while (ancestor) {
          if (nodes.indexOf(ancestor) > -1) {
            replace = false;
            nodes.splice(idx, 1);
            break;
          }
          ancestor = ancestor.parent;
        }
        replace && (nodes[idx] = node);
      }
      return nodes;
    };
    var POSITION = {
      DISCONNECTED: 1,
      PRECEDING: 2,
      FOLLOWING: 4,
      CONTAINS: 8,
      CONTAINED_BY: 16
    };
    var comparePos = exports.compareDocumentPosition = function(nodeA, nodeB) {
      var aParents = [];
      var bParents = [];
      var current, sharedParent, siblings, aSibling, bSibling, idx;
      if (nodeA === nodeB) return 0;
      current = nodeA;
      while (current) {
        aParents.unshift(current);
        current = current.parent;
      }
      current = nodeB;
      while (current) {
        bParents.unshift(current);
        current = current.parent;
      }
      idx = 0;
      while (aParents[idx] === bParents[idx]) idx++;
      if (0 === idx) return POSITION.DISCONNECTED;
      sharedParent = aParents[idx - 1];
      siblings = sharedParent.children;
      aSibling = aParents[idx];
      bSibling = bParents[idx];
      if (siblings.indexOf(aSibling) > siblings.indexOf(bSibling)) {
        if (sharedParent === nodeB) return POSITION.FOLLOWING | POSITION.CONTAINED_BY;
        return POSITION.FOLLOWING;
      }
      if (sharedParent === nodeA) return POSITION.PRECEDING | POSITION.CONTAINS;
      return POSITION.PRECEDING;
    };
    exports.uniqueSort = function(nodes) {
      var idx = nodes.length, node, position;
      nodes = nodes.slice();
      while (--idx > -1) {
        node = nodes[idx];
        position = nodes.indexOf(node);
        position > -1 && position < idx && nodes.splice(idx, 1);
      }
      nodes.sort(function(a, b) {
        var relative = comparePos(a, b);
        if (relative & POSITION.PRECEDING) return -1;
        if (relative & POSITION.FOLLOWING) return 1;
        return 0;
      });
      return nodes;
    };
  }, {} ],
  54: [ function(require, module, exports) {
    var ElementType = require("domelementtype");
    var isTag = exports.isTag = ElementType.isTag;
    exports.testElement = function(options, element) {
      for (var key in options) if (options.hasOwnProperty(key)) {
        if ("tag_name" === key) {
          if (!isTag(element) || !options.tag_name(element.name)) return false;
        } else if ("tag_type" === key) {
          if (!options.tag_type(element.type)) return false;
        } else if ("tag_contains" === key) {
          if (isTag(element) || !options.tag_contains(element.data)) return false;
        } else if (!element.attribs || !options[key](element.attribs[key])) return false;
      } else ;
      return true;
    };
    var Checks = {
      tag_name: function(name) {
        return "function" === typeof name ? function(elem) {
          return isTag(elem) && name(elem.name);
        } : "*" === name ? isTag : function(elem) {
          return isTag(elem) && elem.name === name;
        };
      },
      tag_type: function(type) {
        return "function" === typeof type ? function(elem) {
          return type(elem.type);
        } : function(elem) {
          return elem.type === type;
        };
      },
      tag_contains: function(data) {
        return "function" === typeof data ? function(elem) {
          return !isTag(elem) && data(elem.data);
        } : function(elem) {
          return !isTag(elem) && elem.data === data;
        };
      }
    };
    function getAttribCheck(attrib, value) {
      return "function" === typeof value ? function(elem) {
        return elem.attribs && value(elem.attribs[attrib]);
      } : function(elem) {
        return elem.attribs && elem.attribs[attrib] === value;
      };
    }
    function combineFuncs(a, b) {
      return function(elem) {
        return a(elem) || b(elem);
      };
    }
    exports.getElements = function(options, element, recurse, limit) {
      var funcs = Object.keys(options).map(function(key) {
        var value = options[key];
        return key in Checks ? Checks[key](value) : getAttribCheck(key, value);
      });
      return 0 === funcs.length ? [] : this.filter(funcs.reduce(combineFuncs), element, recurse, limit);
    };
    exports.getElementById = function(id, element, recurse) {
      Array.isArray(element) || (element = [ element ]);
      return this.findOne(getAttribCheck("id", id), element, false !== recurse);
    };
    exports.getElementsByTagName = function(name, element, recurse, limit) {
      return this.filter(Checks.tag_name(name), element, recurse, limit);
    };
    exports.getElementsByTagType = function(type, element, recurse, limit) {
      return this.filter(Checks.tag_type(type), element, recurse, limit);
    };
  }, {
    domelementtype: 59
  } ],
  55: [ function(require, module, exports) {
    exports.removeElement = function(elem) {
      elem.prev && (elem.prev.next = elem.next);
      elem.next && (elem.next.prev = elem.prev);
      if (elem.parent) {
        var childs = elem.parent.children;
        childs.splice(childs.lastIndexOf(elem), 1);
      }
    };
    exports.replaceElement = function(elem, replacement) {
      var prev = replacement.prev = elem.prev;
      prev && (prev.next = replacement);
      var next = replacement.next = elem.next;
      next && (next.prev = replacement);
      var parent = replacement.parent = elem.parent;
      if (parent) {
        var childs = parent.children;
        childs[childs.lastIndexOf(elem)] = replacement;
      }
    };
    exports.appendChild = function(elem, child) {
      child.parent = elem;
      if (1 !== elem.children.push(child)) {
        var sibling = elem.children[elem.children.length - 2];
        sibling.next = child;
        child.prev = sibling;
        child.next = null;
      }
    };
    exports.append = function(elem, next) {
      var parent = elem.parent, currNext = elem.next;
      next.next = currNext;
      next.prev = elem;
      elem.next = next;
      next.parent = parent;
      if (currNext) {
        currNext.prev = next;
        if (parent) {
          var childs = parent.children;
          childs.splice(childs.lastIndexOf(currNext), 0, next);
        }
      } else parent && parent.children.push(next);
    };
    exports.prepend = function(elem, prev) {
      var parent = elem.parent;
      if (parent) {
        var childs = parent.children;
        childs.splice(childs.lastIndexOf(elem), 0, prev);
      }
      elem.prev && (elem.prev.next = prev);
      prev.parent = parent;
      prev.prev = elem.prev;
      prev.next = elem;
      elem.prev = prev;
    };
  }, {} ],
  56: [ function(require, module, exports) {
    var isTag = require("domelementtype").isTag;
    module.exports = {
      filter: filter,
      find: find,
      findOneChild: findOneChild,
      findOne: findOne,
      existsOne: existsOne,
      findAll: findAll
    };
    function filter(test, element, recurse, limit) {
      Array.isArray(element) || (element = [ element ]);
      "number" === typeof limit && isFinite(limit) || (limit = Infinity);
      return find(test, element, false !== recurse, limit);
    }
    function find(test, elems, recurse, limit) {
      var result = [], childs;
      for (var i = 0, j = elems.length; i < j; i++) {
        if (test(elems[i])) {
          result.push(elems[i]);
          if (--limit <= 0) break;
        }
        childs = elems[i].children;
        if (recurse && childs && childs.length > 0) {
          childs = find(test, childs, recurse, limit);
          result = result.concat(childs);
          limit -= childs.length;
          if (limit <= 0) break;
        }
      }
      return result;
    }
    function findOneChild(test, elems) {
      for (var i = 0, l = elems.length; i < l; i++) if (test(elems[i])) return elems[i];
      return null;
    }
    function findOne(test, elems) {
      var elem = null;
      for (var i = 0, l = elems.length; i < l && !elem; i++) {
        if (!isTag(elems[i])) continue;
        test(elems[i]) ? elem = elems[i] : elems[i].children.length > 0 && (elem = findOne(test, elems[i].children));
      }
      return elem;
    }
    function existsOne(test, elems) {
      for (var i = 0, l = elems.length; i < l; i++) if (isTag(elems[i]) && (test(elems[i]) || elems[i].children.length > 0 && existsOne(test, elems[i].children))) return true;
      return false;
    }
    function findAll(test, elems) {
      var result = [];
      for (var i = 0, j = elems.length; i < j; i++) {
        if (!isTag(elems[i])) continue;
        test(elems[i]) && result.push(elems[i]);
        elems[i].children.length > 0 && (result = result.concat(findAll(test, elems[i].children)));
      }
      return result;
    }
  }, {
    domelementtype: 59
  } ],
  57: [ function(require, module, exports) {
    var ElementType = require("domelementtype"), getOuterHTML = require("dom-serializer"), isTag = ElementType.isTag;
    module.exports = {
      getInnerHTML: getInnerHTML,
      getOuterHTML: getOuterHTML,
      getText: getText
    };
    function getInnerHTML(elem, opts) {
      return elem.children ? elem.children.map(function(elem) {
        return getOuterHTML(elem, opts);
      }).join("") : "";
    }
    function getText(elem) {
      if (Array.isArray(elem)) return elem.map(getText).join("");
      if (isTag(elem) || elem.type === ElementType.CDATA) return getText(elem.children);
      if (elem.type === ElementType.Text) return elem.data;
      return "";
    }
  }, {
    "dom-serializer": 63,
    domelementtype: 59
  } ],
  58: [ function(require, module, exports) {
    var getChildren = exports.getChildren = function(elem) {
      return elem.children;
    };
    var getParent = exports.getParent = function(elem) {
      return elem.parent;
    };
    exports.getSiblings = function(elem) {
      var parent = getParent(elem);
      return parent ? getChildren(parent) : [ elem ];
    };
    exports.getAttributeValue = function(elem, name) {
      return elem.attribs && elem.attribs[name];
    };
    exports.hasAttrib = function(elem, name) {
      return !!elem.attribs && hasOwnProperty.call(elem.attribs, name);
    };
    exports.getName = function(elem) {
      return elem.name;
    };
  }, {} ],
  59: [ function(require, module, exports) {
    module.exports = {
      Text: "text",
      Directive: "directive",
      Comment: "comment",
      Script: "script",
      Style: "style",
      Tag: "tag",
      CDATA: "cdata",
      Doctype: "doctype",
      isTag: function(elem) {
        return "tag" === elem.type || "script" === elem.type || "style" === elem.type;
      }
    };
  }, {} ],
  60: [ function(require, module, exports) {
    module.exports = compile;
    var BaseFuncs = require("boolbase"), trueFunc = BaseFuncs.trueFunc, falseFunc = BaseFuncs.falseFunc;
    function compile(parsed) {
      var a = parsed[0], b = parsed[1] - 1;
      if (b < 0 && a <= 0) return falseFunc;
      if (-1 === a) return function(pos) {
        return pos <= b;
      };
      if (0 === a) return function(pos) {
        return pos === b;
      };
      if (1 === a) return b < 0 ? trueFunc : function(pos) {
        return pos >= b;
      };
      var bMod = b % a;
      bMod < 0 && (bMod += a);
      if (a > 1) return function(pos) {
        return pos >= b && pos % a === bMod;
      };
      a *= -1;
      return function(pos) {
        return pos <= b && pos % a === bMod;
      };
    }
  }, {
    boolbase: 50
  } ],
  61: [ function(require, module, exports) {
    var parse = require("./parse.js"), compile = require("./compile.js");
    module.exports = function nthCheck(formula) {
      return compile(parse(formula));
    };
    module.exports.parse = parse;
    module.exports.compile = compile;
  }, {
    "./compile.js": 60,
    "./parse.js": 62
  } ],
  62: [ function(require, module, exports) {
    module.exports = parse;
    var re_nthElement = /^([+\-]?\d*n)?\s*(?:([+\-]?)\s*(\d+))?$/;
    function parse(formula) {
      formula = formula.trim().toLowerCase();
      if ("even" === formula) return [ 2, 0 ];
      if ("odd" === formula) return [ 2, 1 ];
      var parsed = formula.match(re_nthElement);
      if (!parsed) throw new SyntaxError("n-th rule couldn't be parsed ('" + formula + "')");
      var a;
      if (parsed[1]) {
        a = parseInt(parsed[1], 10);
        isNaN(a) && (a = "-" === parsed[1].charAt(0) ? -1 : 1);
      } else a = 0;
      return [ a, parsed[3] ? parseInt((parsed[2] || "") + parsed[3], 10) : 0 ];
    }
  }, {} ],
  63: [ function(require, module, exports) {
    var ElementType = require("domelementtype");
    var entities = require("entities");
    var booleanAttributes = {
      __proto__: null,
      allowfullscreen: true,
      async: true,
      autofocus: true,
      autoplay: true,
      checked: true,
      controls: true,
      default: true,
      defer: true,
      disabled: true,
      hidden: true,
      ismap: true,
      loop: true,
      multiple: true,
      muted: true,
      open: true,
      readonly: true,
      required: true,
      reversed: true,
      scoped: true,
      seamless: true,
      selected: true,
      typemustmatch: true
    };
    var unencodedElements = {
      __proto__: null,
      style: true,
      script: true,
      xmp: true,
      iframe: true,
      noembed: true,
      noframes: true,
      plaintext: true,
      noscript: true
    };
    function formatAttrs(attributes, opts) {
      if (!attributes) return;
      var output = "", value;
      for (var key in attributes) {
        value = attributes[key];
        output && (output += " ");
        !value && booleanAttributes[key] ? output += key : output += key + '="' + (opts.decodeEntities ? entities.encodeXML(value) : value) + '"';
      }
      return output;
    }
    var singleTag = {
      __proto__: null,
      area: true,
      base: true,
      basefont: true,
      br: true,
      col: true,
      command: true,
      embed: true,
      frame: true,
      hr: true,
      img: true,
      input: true,
      isindex: true,
      keygen: true,
      link: true,
      meta: true,
      param: true,
      source: true,
      track: true,
      wbr: true
    };
    var render = module.exports = function(dom, opts) {
      Array.isArray(dom) || dom.cheerio || (dom = [ dom ]);
      opts = opts || {};
      var output = "";
      for (var i = 0; i < dom.length; i++) {
        var elem = dom[i];
        "root" === elem.type ? output += render(elem.children, opts) : ElementType.isTag(elem) ? output += renderTag(elem, opts) : elem.type === ElementType.Directive ? output += renderDirective(elem) : elem.type === ElementType.Comment ? output += renderComment(elem) : elem.type === ElementType.CDATA ? output += renderCdata(elem) : output += renderText(elem, opts);
      }
      return output;
    };
    function renderTag(elem, opts) {
      "svg" === elem.name && (opts = {
        decodeEntities: opts.decodeEntities,
        xmlMode: true
      });
      var tag = "<" + elem.name, attribs = formatAttrs(elem.attribs, opts);
      attribs && (tag += " " + attribs);
      if (!opts.xmlMode || elem.children && 0 !== elem.children.length) {
        tag += ">";
        elem.children && (tag += render(elem.children, opts));
        singleTag[elem.name] && !opts.xmlMode || (tag += "</" + elem.name + ">");
      } else tag += "/>";
      return tag;
    }
    function renderDirective(elem) {
      return "<" + elem.data + ">";
    }
    function renderText(elem, opts) {
      var data = elem.data || "";
      !opts.decodeEntities || elem.parent && elem.parent.name in unencodedElements || (data = entities.encodeXML(data));
      return data;
    }
    function renderCdata(elem) {
      return "<![CDATA[" + elem.children[0].data + "]]>";
    }
    function renderComment(elem) {
      return "\x3c!--" + elem.data + "--\x3e";
    }
  }, {
    domelementtype: 64,
    entities: 65
  } ],
  64: [ function(require, module, exports) {
    module.exports = {
      Text: "text",
      Directive: "directive",
      Comment: "comment",
      Script: "script",
      Style: "style",
      Tag: "tag",
      CDATA: "cdata",
      isTag: function(elem) {
        return "tag" === elem.type || "script" === elem.type || "style" === elem.type;
      }
    };
  }, {} ],
  65: [ function(require, module, exports) {
    var encode = require("./lib/encode.js"), decode = require("./lib/decode.js");
    exports.decode = function(data, level) {
      return (!level || level <= 0 ? decode.XML : decode.HTML)(data);
    };
    exports.decodeStrict = function(data, level) {
      return (!level || level <= 0 ? decode.XML : decode.HTMLStrict)(data);
    };
    exports.encode = function(data, level) {
      return (!level || level <= 0 ? encode.XML : encode.HTML)(data);
    };
    exports.encodeXML = encode.XML;
    exports.encodeHTML4 = exports.encodeHTML5 = exports.encodeHTML = encode.HTML;
    exports.decodeXML = exports.decodeXMLStrict = decode.XML;
    exports.decodeHTML4 = exports.decodeHTML5 = exports.decodeHTML = decode.HTML;
    exports.decodeHTML4Strict = exports.decodeHTML5Strict = exports.decodeHTMLStrict = decode.HTMLStrict;
    exports.escape = encode.escape;
  }, {
    "./lib/decode.js": 66,
    "./lib/encode.js": 68
  } ],
  66: [ function(require, module, exports) {
    var entityMap = require("../maps/entities.json"), legacyMap = require("../maps/legacy.json"), xmlMap = require("../maps/xml.json"), decodeCodePoint = require("./decode_codepoint.js");
    var decodeXMLStrict = getStrictDecoder(xmlMap), decodeHTMLStrict = getStrictDecoder(entityMap);
    function getStrictDecoder(map) {
      var keys = Object.keys(map).join("|"), replace = getReplacer(map);
      keys += "|#[xX][\\da-fA-F]+|#\\d+";
      var re = new RegExp("&(?:" + keys + ");", "g");
      return function(str) {
        return String(str).replace(re, replace);
      };
    }
    var decodeHTML = function() {
      var legacy = Object.keys(legacyMap).sort(sorter);
      var keys = Object.keys(entityMap).sort(sorter);
      for (var i = 0, j = 0; i < keys.length; i++) if (legacy[j] === keys[i]) {
        keys[i] += ";?";
        j++;
      } else keys[i] += ";";
      var re = new RegExp("&(?:" + keys.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)", "g"), replace = getReplacer(entityMap);
      function replacer(str) {
        ";" !== str.substr(-1) && (str += ";");
        return replace(str);
      }
      return function(str) {
        return String(str).replace(re, replacer);
      };
    }();
    function sorter(a, b) {
      return a < b ? 1 : -1;
    }
    function getReplacer(map) {
      return function replace(str) {
        if ("#" === str.charAt(1)) {
          if ("X" === str.charAt(2) || "x" === str.charAt(2)) return decodeCodePoint(parseInt(str.substr(3), 16));
          return decodeCodePoint(parseInt(str.substr(2), 10));
        }
        return map[str.slice(1, -1)];
      };
    }
    module.exports = {
      XML: decodeXMLStrict,
      HTML: decodeHTML,
      HTMLStrict: decodeHTMLStrict
    };
  }, {
    "../maps/entities.json": 70,
    "../maps/legacy.json": 71,
    "../maps/xml.json": 72,
    "./decode_codepoint.js": 67
  } ],
  67: [ function(require, module, exports) {
    var decodeMap = require("../maps/decode.json");
    module.exports = decodeCodePoint;
    function decodeCodePoint(codePoint) {
      if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) return "\ufffd";
      codePoint in decodeMap && (codePoint = decodeMap[codePoint]);
      var output = "";
      if (codePoint > 65535) {
        codePoint -= 65536;
        output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
        codePoint = 56320 | 1023 & codePoint;
      }
      output += String.fromCharCode(codePoint);
      return output;
    }
  }, {
    "../maps/decode.json": 69
  } ],
  68: [ function(require, module, exports) {
    var inverseXML = getInverseObj(require("../maps/xml.json")), xmlReplacer = getInverseReplacer(inverseXML);
    exports.XML = getInverse(inverseXML, xmlReplacer);
    var inverseHTML = getInverseObj(require("../maps/entities.json")), htmlReplacer = getInverseReplacer(inverseHTML);
    exports.HTML = getInverse(inverseHTML, htmlReplacer);
    function getInverseObj(obj) {
      return Object.keys(obj).sort().reduce(function(inverse, name) {
        inverse[obj[name]] = "&" + name + ";";
        return inverse;
      }, {});
    }
    function getInverseReplacer(inverse) {
      var single = [], multiple = [];
      Object.keys(inverse).forEach(function(k) {
        1 === k.length ? single.push("\\" + k) : multiple.push(k);
      });
      multiple.unshift("[" + single.join("") + "]");
      return new RegExp(multiple.join("|"), "g");
    }
    var re_nonASCII = /[^\0-\x7F]/g, re_astralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    function singleCharReplacer(c) {
      return "&#x" + c.charCodeAt(0).toString(16).toUpperCase() + ";";
    }
    function astralReplacer(c) {
      var high = c.charCodeAt(0);
      var low = c.charCodeAt(1);
      var codePoint = 1024 * (high - 55296) + low - 56320 + 65536;
      return "&#x" + codePoint.toString(16).toUpperCase() + ";";
    }
    function getInverse(inverse, re) {
      function func(name) {
        return inverse[name];
      }
      return function(data) {
        return data.replace(re, func).replace(re_astralSymbols, astralReplacer).replace(re_nonASCII, singleCharReplacer);
      };
    }
    var re_xmlChars = getInverseReplacer(inverseXML);
    function escapeXML(data) {
      return data.replace(re_xmlChars, singleCharReplacer).replace(re_astralSymbols, astralReplacer).replace(re_nonASCII, singleCharReplacer);
    }
    exports.escape = escapeXML;
  }, {
    "../maps/entities.json": 70,
    "../maps/xml.json": 72
  } ],
  69: [ function(require, module, exports) {
    module.exports = {
      0: 65533,
      128: 8364,
      130: 8218,
      131: 402,
      132: 8222,
      133: 8230,
      134: 8224,
      135: 8225,
      136: 710,
      137: 8240,
      138: 352,
      139: 8249,
      140: 338,
      142: 381,
      145: 8216,
      146: 8217,
      147: 8220,
      148: 8221,
      149: 8226,
      150: 8211,
      151: 8212,
      152: 732,
      153: 8482,
      154: 353,
      155: 8250,
      156: 339,
      158: 382,
      159: 376
    };
  }, {} ],
  70: [ function(require, module, exports) {
    module.exports = {
      Aacute: "\xc1",
      aacute: "\xe1",
      Abreve: "\u0102",
      abreve: "\u0103",
      ac: "\u223e",
      acd: "\u223f",
      acE: "\u223e\u0333",
      Acirc: "\xc2",
      acirc: "\xe2",
      acute: "\xb4",
      Acy: "\u0410",
      acy: "\u0430",
      AElig: "\xc6",
      aelig: "\xe6",
      af: "\u2061",
      Afr: "\ud835\udd04",
      afr: "\ud835\udd1e",
      Agrave: "\xc0",
      agrave: "\xe0",
      alefsym: "\u2135",
      aleph: "\u2135",
      Alpha: "\u0391",
      alpha: "\u03b1",
      Amacr: "\u0100",
      amacr: "\u0101",
      amalg: "\u2a3f",
      amp: "&",
      AMP: "&",
      andand: "\u2a55",
      And: "\u2a53",
      and: "\u2227",
      andd: "\u2a5c",
      andslope: "\u2a58",
      andv: "\u2a5a",
      ang: "\u2220",
      ange: "\u29a4",
      angle: "\u2220",
      angmsdaa: "\u29a8",
      angmsdab: "\u29a9",
      angmsdac: "\u29aa",
      angmsdad: "\u29ab",
      angmsdae: "\u29ac",
      angmsdaf: "\u29ad",
      angmsdag: "\u29ae",
      angmsdah: "\u29af",
      angmsd: "\u2221",
      angrt: "\u221f",
      angrtvb: "\u22be",
      angrtvbd: "\u299d",
      angsph: "\u2222",
      angst: "\xc5",
      angzarr: "\u237c",
      Aogon: "\u0104",
      aogon: "\u0105",
      Aopf: "\ud835\udd38",
      aopf: "\ud835\udd52",
      apacir: "\u2a6f",
      ap: "\u2248",
      apE: "\u2a70",
      ape: "\u224a",
      apid: "\u224b",
      apos: "'",
      ApplyFunction: "\u2061",
      approx: "\u2248",
      approxeq: "\u224a",
      Aring: "\xc5",
      aring: "\xe5",
      Ascr: "\ud835\udc9c",
      ascr: "\ud835\udcb6",
      Assign: "\u2254",
      ast: "*",
      asymp: "\u2248",
      asympeq: "\u224d",
      Atilde: "\xc3",
      atilde: "\xe3",
      Auml: "\xc4",
      auml: "\xe4",
      awconint: "\u2233",
      awint: "\u2a11",
      backcong: "\u224c",
      backepsilon: "\u03f6",
      backprime: "\u2035",
      backsim: "\u223d",
      backsimeq: "\u22cd",
      Backslash: "\u2216",
      Barv: "\u2ae7",
      barvee: "\u22bd",
      barwed: "\u2305",
      Barwed: "\u2306",
      barwedge: "\u2305",
      bbrk: "\u23b5",
      bbrktbrk: "\u23b6",
      bcong: "\u224c",
      Bcy: "\u0411",
      bcy: "\u0431",
      bdquo: "\u201e",
      becaus: "\u2235",
      because: "\u2235",
      Because: "\u2235",
      bemptyv: "\u29b0",
      bepsi: "\u03f6",
      bernou: "\u212c",
      Bernoullis: "\u212c",
      Beta: "\u0392",
      beta: "\u03b2",
      beth: "\u2136",
      between: "\u226c",
      Bfr: "\ud835\udd05",
      bfr: "\ud835\udd1f",
      bigcap: "\u22c2",
      bigcirc: "\u25ef",
      bigcup: "\u22c3",
      bigodot: "\u2a00",
      bigoplus: "\u2a01",
      bigotimes: "\u2a02",
      bigsqcup: "\u2a06",
      bigstar: "\u2605",
      bigtriangledown: "\u25bd",
      bigtriangleup: "\u25b3",
      biguplus: "\u2a04",
      bigvee: "\u22c1",
      bigwedge: "\u22c0",
      bkarow: "\u290d",
      blacklozenge: "\u29eb",
      blacksquare: "\u25aa",
      blacktriangle: "\u25b4",
      blacktriangledown: "\u25be",
      blacktriangleleft: "\u25c2",
      blacktriangleright: "\u25b8",
      blank: "\u2423",
      blk12: "\u2592",
      blk14: "\u2591",
      blk34: "\u2593",
      block: "\u2588",
      bne: "=\u20e5",
      bnequiv: "\u2261\u20e5",
      bNot: "\u2aed",
      bnot: "\u2310",
      Bopf: "\ud835\udd39",
      bopf: "\ud835\udd53",
      bot: "\u22a5",
      bottom: "\u22a5",
      bowtie: "\u22c8",
      boxbox: "\u29c9",
      boxdl: "\u2510",
      boxdL: "\u2555",
      boxDl: "\u2556",
      boxDL: "\u2557",
      boxdr: "\u250c",
      boxdR: "\u2552",
      boxDr: "\u2553",
      boxDR: "\u2554",
      boxh: "\u2500",
      boxH: "\u2550",
      boxhd: "\u252c",
      boxHd: "\u2564",
      boxhD: "\u2565",
      boxHD: "\u2566",
      boxhu: "\u2534",
      boxHu: "\u2567",
      boxhU: "\u2568",
      boxHU: "\u2569",
      boxminus: "\u229f",
      boxplus: "\u229e",
      boxtimes: "\u22a0",
      boxul: "\u2518",
      boxuL: "\u255b",
      boxUl: "\u255c",
      boxUL: "\u255d",
      boxur: "\u2514",
      boxuR: "\u2558",
      boxUr: "\u2559",
      boxUR: "\u255a",
      boxv: "\u2502",
      boxV: "\u2551",
      boxvh: "\u253c",
      boxvH: "\u256a",
      boxVh: "\u256b",
      boxVH: "\u256c",
      boxvl: "\u2524",
      boxvL: "\u2561",
      boxVl: "\u2562",
      boxVL: "\u2563",
      boxvr: "\u251c",
      boxvR: "\u255e",
      boxVr: "\u255f",
      boxVR: "\u2560",
      bprime: "\u2035",
      breve: "\u02d8",
      Breve: "\u02d8",
      brvbar: "\xa6",
      bscr: "\ud835\udcb7",
      Bscr: "\u212c",
      bsemi: "\u204f",
      bsim: "\u223d",
      bsime: "\u22cd",
      bsolb: "\u29c5",
      bsol: "\\",
      bsolhsub: "\u27c8",
      bull: "\u2022",
      bullet: "\u2022",
      bump: "\u224e",
      bumpE: "\u2aae",
      bumpe: "\u224f",
      Bumpeq: "\u224e",
      bumpeq: "\u224f",
      Cacute: "\u0106",
      cacute: "\u0107",
      capand: "\u2a44",
      capbrcup: "\u2a49",
      capcap: "\u2a4b",
      cap: "\u2229",
      Cap: "\u22d2",
      capcup: "\u2a47",
      capdot: "\u2a40",
      CapitalDifferentialD: "\u2145",
      caps: "\u2229\ufe00",
      caret: "\u2041",
      caron: "\u02c7",
      Cayleys: "\u212d",
      ccaps: "\u2a4d",
      Ccaron: "\u010c",
      ccaron: "\u010d",
      Ccedil: "\xc7",
      ccedil: "\xe7",
      Ccirc: "\u0108",
      ccirc: "\u0109",
      Cconint: "\u2230",
      ccups: "\u2a4c",
      ccupssm: "\u2a50",
      Cdot: "\u010a",
      cdot: "\u010b",
      cedil: "\xb8",
      Cedilla: "\xb8",
      cemptyv: "\u29b2",
      cent: "\xa2",
      centerdot: "\xb7",
      CenterDot: "\xb7",
      cfr: "\ud835\udd20",
      Cfr: "\u212d",
      CHcy: "\u0427",
      chcy: "\u0447",
      check: "\u2713",
      checkmark: "\u2713",
      Chi: "\u03a7",
      chi: "\u03c7",
      circ: "\u02c6",
      circeq: "\u2257",
      circlearrowleft: "\u21ba",
      circlearrowright: "\u21bb",
      circledast: "\u229b",
      circledcirc: "\u229a",
      circleddash: "\u229d",
      CircleDot: "\u2299",
      circledR: "\xae",
      circledS: "\u24c8",
      CircleMinus: "\u2296",
      CirclePlus: "\u2295",
      CircleTimes: "\u2297",
      cir: "\u25cb",
      cirE: "\u29c3",
      cire: "\u2257",
      cirfnint: "\u2a10",
      cirmid: "\u2aef",
      cirscir: "\u29c2",
      ClockwiseContourIntegral: "\u2232",
      CloseCurlyDoubleQuote: "\u201d",
      CloseCurlyQuote: "\u2019",
      clubs: "\u2663",
      clubsuit: "\u2663",
      colon: ":",
      Colon: "\u2237",
      Colone: "\u2a74",
      colone: "\u2254",
      coloneq: "\u2254",
      comma: ",",
      commat: "@",
      comp: "\u2201",
      compfn: "\u2218",
      complement: "\u2201",
      complexes: "\u2102",
      cong: "\u2245",
      congdot: "\u2a6d",
      Congruent: "\u2261",
      conint: "\u222e",
      Conint: "\u222f",
      ContourIntegral: "\u222e",
      copf: "\ud835\udd54",
      Copf: "\u2102",
      coprod: "\u2210",
      Coproduct: "\u2210",
      copy: "\xa9",
      COPY: "\xa9",
      copysr: "\u2117",
      CounterClockwiseContourIntegral: "\u2233",
      crarr: "\u21b5",
      cross: "\u2717",
      Cross: "\u2a2f",
      Cscr: "\ud835\udc9e",
      cscr: "\ud835\udcb8",
      csub: "\u2acf",
      csube: "\u2ad1",
      csup: "\u2ad0",
      csupe: "\u2ad2",
      ctdot: "\u22ef",
      cudarrl: "\u2938",
      cudarrr: "\u2935",
      cuepr: "\u22de",
      cuesc: "\u22df",
      cularr: "\u21b6",
      cularrp: "\u293d",
      cupbrcap: "\u2a48",
      cupcap: "\u2a46",
      CupCap: "\u224d",
      cup: "\u222a",
      Cup: "\u22d3",
      cupcup: "\u2a4a",
      cupdot: "\u228d",
      cupor: "\u2a45",
      cups: "\u222a\ufe00",
      curarr: "\u21b7",
      curarrm: "\u293c",
      curlyeqprec: "\u22de",
      curlyeqsucc: "\u22df",
      curlyvee: "\u22ce",
      curlywedge: "\u22cf",
      curren: "\xa4",
      curvearrowleft: "\u21b6",
      curvearrowright: "\u21b7",
      cuvee: "\u22ce",
      cuwed: "\u22cf",
      cwconint: "\u2232",
      cwint: "\u2231",
      cylcty: "\u232d",
      dagger: "\u2020",
      Dagger: "\u2021",
      daleth: "\u2138",
      darr: "\u2193",
      Darr: "\u21a1",
      dArr: "\u21d3",
      dash: "\u2010",
      Dashv: "\u2ae4",
      dashv: "\u22a3",
      dbkarow: "\u290f",
      dblac: "\u02dd",
      Dcaron: "\u010e",
      dcaron: "\u010f",
      Dcy: "\u0414",
      dcy: "\u0434",
      ddagger: "\u2021",
      ddarr: "\u21ca",
      DD: "\u2145",
      dd: "\u2146",
      DDotrahd: "\u2911",
      ddotseq: "\u2a77",
      deg: "\xb0",
      Del: "\u2207",
      Delta: "\u0394",
      delta: "\u03b4",
      demptyv: "\u29b1",
      dfisht: "\u297f",
      Dfr: "\ud835\udd07",
      dfr: "\ud835\udd21",
      dHar: "\u2965",
      dharl: "\u21c3",
      dharr: "\u21c2",
      DiacriticalAcute: "\xb4",
      DiacriticalDot: "\u02d9",
      DiacriticalDoubleAcute: "\u02dd",
      DiacriticalGrave: "`",
      DiacriticalTilde: "\u02dc",
      diam: "\u22c4",
      diamond: "\u22c4",
      Diamond: "\u22c4",
      diamondsuit: "\u2666",
      diams: "\u2666",
      die: "\xa8",
      DifferentialD: "\u2146",
      digamma: "\u03dd",
      disin: "\u22f2",
      div: "\xf7",
      divide: "\xf7",
      divideontimes: "\u22c7",
      divonx: "\u22c7",
      DJcy: "\u0402",
      djcy: "\u0452",
      dlcorn: "\u231e",
      dlcrop: "\u230d",
      dollar: "$",
      Dopf: "\ud835\udd3b",
      dopf: "\ud835\udd55",
      Dot: "\xa8",
      dot: "\u02d9",
      DotDot: "\u20dc",
      doteq: "\u2250",
      doteqdot: "\u2251",
      DotEqual: "\u2250",
      dotminus: "\u2238",
      dotplus: "\u2214",
      dotsquare: "\u22a1",
      doublebarwedge: "\u2306",
      DoubleContourIntegral: "\u222f",
      DoubleDot: "\xa8",
      DoubleDownArrow: "\u21d3",
      DoubleLeftArrow: "\u21d0",
      DoubleLeftRightArrow: "\u21d4",
      DoubleLeftTee: "\u2ae4",
      DoubleLongLeftArrow: "\u27f8",
      DoubleLongLeftRightArrow: "\u27fa",
      DoubleLongRightArrow: "\u27f9",
      DoubleRightArrow: "\u21d2",
      DoubleRightTee: "\u22a8",
      DoubleUpArrow: "\u21d1",
      DoubleUpDownArrow: "\u21d5",
      DoubleVerticalBar: "\u2225",
      DownArrowBar: "\u2913",
      downarrow: "\u2193",
      DownArrow: "\u2193",
      Downarrow: "\u21d3",
      DownArrowUpArrow: "\u21f5",
      DownBreve: "\u0311",
      downdownarrows: "\u21ca",
      downharpoonleft: "\u21c3",
      downharpoonright: "\u21c2",
      DownLeftRightVector: "\u2950",
      DownLeftTeeVector: "\u295e",
      DownLeftVectorBar: "\u2956",
      DownLeftVector: "\u21bd",
      DownRightTeeVector: "\u295f",
      DownRightVectorBar: "\u2957",
      DownRightVector: "\u21c1",
      DownTeeArrow: "\u21a7",
      DownTee: "\u22a4",
      drbkarow: "\u2910",
      drcorn: "\u231f",
      drcrop: "\u230c",
      Dscr: "\ud835\udc9f",
      dscr: "\ud835\udcb9",
      DScy: "\u0405",
      dscy: "\u0455",
      dsol: "\u29f6",
      Dstrok: "\u0110",
      dstrok: "\u0111",
      dtdot: "\u22f1",
      dtri: "\u25bf",
      dtrif: "\u25be",
      duarr: "\u21f5",
      duhar: "\u296f",
      dwangle: "\u29a6",
      DZcy: "\u040f",
      dzcy: "\u045f",
      dzigrarr: "\u27ff",
      Eacute: "\xc9",
      eacute: "\xe9",
      easter: "\u2a6e",
      Ecaron: "\u011a",
      ecaron: "\u011b",
      Ecirc: "\xca",
      ecirc: "\xea",
      ecir: "\u2256",
      ecolon: "\u2255",
      Ecy: "\u042d",
      ecy: "\u044d",
      eDDot: "\u2a77",
      Edot: "\u0116",
      edot: "\u0117",
      eDot: "\u2251",
      ee: "\u2147",
      efDot: "\u2252",
      Efr: "\ud835\udd08",
      efr: "\ud835\udd22",
      eg: "\u2a9a",
      Egrave: "\xc8",
      egrave: "\xe8",
      egs: "\u2a96",
      egsdot: "\u2a98",
      el: "\u2a99",
      Element: "\u2208",
      elinters: "\u23e7",
      ell: "\u2113",
      els: "\u2a95",
      elsdot: "\u2a97",
      Emacr: "\u0112",
      emacr: "\u0113",
      empty: "\u2205",
      emptyset: "\u2205",
      EmptySmallSquare: "\u25fb",
      emptyv: "\u2205",
      EmptyVerySmallSquare: "\u25ab",
      emsp13: "\u2004",
      emsp14: "\u2005",
      emsp: "\u2003",
      ENG: "\u014a",
      eng: "\u014b",
      ensp: "\u2002",
      Eogon: "\u0118",
      eogon: "\u0119",
      Eopf: "\ud835\udd3c",
      eopf: "\ud835\udd56",
      epar: "\u22d5",
      eparsl: "\u29e3",
      eplus: "\u2a71",
      epsi: "\u03b5",
      Epsilon: "\u0395",
      epsilon: "\u03b5",
      epsiv: "\u03f5",
      eqcirc: "\u2256",
      eqcolon: "\u2255",
      eqsim: "\u2242",
      eqslantgtr: "\u2a96",
      eqslantless: "\u2a95",
      Equal: "\u2a75",
      equals: "=",
      EqualTilde: "\u2242",
      equest: "\u225f",
      Equilibrium: "\u21cc",
      equiv: "\u2261",
      equivDD: "\u2a78",
      eqvparsl: "\u29e5",
      erarr: "\u2971",
      erDot: "\u2253",
      escr: "\u212f",
      Escr: "\u2130",
      esdot: "\u2250",
      Esim: "\u2a73",
      esim: "\u2242",
      Eta: "\u0397",
      eta: "\u03b7",
      ETH: "\xd0",
      eth: "\xf0",
      Euml: "\xcb",
      euml: "\xeb",
      euro: "\u20ac",
      excl: "!",
      exist: "\u2203",
      Exists: "\u2203",
      expectation: "\u2130",
      exponentiale: "\u2147",
      ExponentialE: "\u2147",
      fallingdotseq: "\u2252",
      Fcy: "\u0424",
      fcy: "\u0444",
      female: "\u2640",
      ffilig: "\ufb03",
      fflig: "\ufb00",
      ffllig: "\ufb04",
      Ffr: "\ud835\udd09",
      ffr: "\ud835\udd23",
      filig: "\ufb01",
      FilledSmallSquare: "\u25fc",
      FilledVerySmallSquare: "\u25aa",
      fjlig: "fj",
      flat: "\u266d",
      fllig: "\ufb02",
      fltns: "\u25b1",
      fnof: "\u0192",
      Fopf: "\ud835\udd3d",
      fopf: "\ud835\udd57",
      forall: "\u2200",
      ForAll: "\u2200",
      fork: "\u22d4",
      forkv: "\u2ad9",
      Fouriertrf: "\u2131",
      fpartint: "\u2a0d",
      frac12: "\xbd",
      frac13: "\u2153",
      frac14: "\xbc",
      frac15: "\u2155",
      frac16: "\u2159",
      frac18: "\u215b",
      frac23: "\u2154",
      frac25: "\u2156",
      frac34: "\xbe",
      frac35: "\u2157",
      frac38: "\u215c",
      frac45: "\u2158",
      frac56: "\u215a",
      frac58: "\u215d",
      frac78: "\u215e",
      frasl: "\u2044",
      frown: "\u2322",
      fscr: "\ud835\udcbb",
      Fscr: "\u2131",
      gacute: "\u01f5",
      Gamma: "\u0393",
      gamma: "\u03b3",
      Gammad: "\u03dc",
      gammad: "\u03dd",
      gap: "\u2a86",
      Gbreve: "\u011e",
      gbreve: "\u011f",
      Gcedil: "\u0122",
      Gcirc: "\u011c",
      gcirc: "\u011d",
      Gcy: "\u0413",
      gcy: "\u0433",
      Gdot: "\u0120",
      gdot: "\u0121",
      ge: "\u2265",
      gE: "\u2267",
      gEl: "\u2a8c",
      gel: "\u22db",
      geq: "\u2265",
      geqq: "\u2267",
      geqslant: "\u2a7e",
      gescc: "\u2aa9",
      ges: "\u2a7e",
      gesdot: "\u2a80",
      gesdoto: "\u2a82",
      gesdotol: "\u2a84",
      gesl: "\u22db\ufe00",
      gesles: "\u2a94",
      Gfr: "\ud835\udd0a",
      gfr: "\ud835\udd24",
      gg: "\u226b",
      Gg: "\u22d9",
      ggg: "\u22d9",
      gimel: "\u2137",
      GJcy: "\u0403",
      gjcy: "\u0453",
      gla: "\u2aa5",
      gl: "\u2277",
      glE: "\u2a92",
      glj: "\u2aa4",
      gnap: "\u2a8a",
      gnapprox: "\u2a8a",
      gne: "\u2a88",
      gnE: "\u2269",
      gneq: "\u2a88",
      gneqq: "\u2269",
      gnsim: "\u22e7",
      Gopf: "\ud835\udd3e",
      gopf: "\ud835\udd58",
      grave: "`",
      GreaterEqual: "\u2265",
      GreaterEqualLess: "\u22db",
      GreaterFullEqual: "\u2267",
      GreaterGreater: "\u2aa2",
      GreaterLess: "\u2277",
      GreaterSlantEqual: "\u2a7e",
      GreaterTilde: "\u2273",
      Gscr: "\ud835\udca2",
      gscr: "\u210a",
      gsim: "\u2273",
      gsime: "\u2a8e",
      gsiml: "\u2a90",
      gtcc: "\u2aa7",
      gtcir: "\u2a7a",
      gt: ">",
      GT: ">",
      Gt: "\u226b",
      gtdot: "\u22d7",
      gtlPar: "\u2995",
      gtquest: "\u2a7c",
      gtrapprox: "\u2a86",
      gtrarr: "\u2978",
      gtrdot: "\u22d7",
      gtreqless: "\u22db",
      gtreqqless: "\u2a8c",
      gtrless: "\u2277",
      gtrsim: "\u2273",
      gvertneqq: "\u2269\ufe00",
      gvnE: "\u2269\ufe00",
      Hacek: "\u02c7",
      hairsp: "\u200a",
      half: "\xbd",
      hamilt: "\u210b",
      HARDcy: "\u042a",
      hardcy: "\u044a",
      harrcir: "\u2948",
      harr: "\u2194",
      hArr: "\u21d4",
      harrw: "\u21ad",
      Hat: "^",
      hbar: "\u210f",
      Hcirc: "\u0124",
      hcirc: "\u0125",
      hearts: "\u2665",
      heartsuit: "\u2665",
      hellip: "\u2026",
      hercon: "\u22b9",
      hfr: "\ud835\udd25",
      Hfr: "\u210c",
      HilbertSpace: "\u210b",
      hksearow: "\u2925",
      hkswarow: "\u2926",
      hoarr: "\u21ff",
      homtht: "\u223b",
      hookleftarrow: "\u21a9",
      hookrightarrow: "\u21aa",
      hopf: "\ud835\udd59",
      Hopf: "\u210d",
      horbar: "\u2015",
      HorizontalLine: "\u2500",
      hscr: "\ud835\udcbd",
      Hscr: "\u210b",
      hslash: "\u210f",
      Hstrok: "\u0126",
      hstrok: "\u0127",
      HumpDownHump: "\u224e",
      HumpEqual: "\u224f",
      hybull: "\u2043",
      hyphen: "\u2010",
      Iacute: "\xcd",
      iacute: "\xed",
      ic: "\u2063",
      Icirc: "\xce",
      icirc: "\xee",
      Icy: "\u0418",
      icy: "\u0438",
      Idot: "\u0130",
      IEcy: "\u0415",
      iecy: "\u0435",
      iexcl: "\xa1",
      iff: "\u21d4",
      ifr: "\ud835\udd26",
      Ifr: "\u2111",
      Igrave: "\xcc",
      igrave: "\xec",
      ii: "\u2148",
      iiiint: "\u2a0c",
      iiint: "\u222d",
      iinfin: "\u29dc",
      iiota: "\u2129",
      IJlig: "\u0132",
      ijlig: "\u0133",
      Imacr: "\u012a",
      imacr: "\u012b",
      image: "\u2111",
      ImaginaryI: "\u2148",
      imagline: "\u2110",
      imagpart: "\u2111",
      imath: "\u0131",
      Im: "\u2111",
      imof: "\u22b7",
      imped: "\u01b5",
      Implies: "\u21d2",
      incare: "\u2105",
      in: "\u2208",
      infin: "\u221e",
      infintie: "\u29dd",
      inodot: "\u0131",
      intcal: "\u22ba",
      int: "\u222b",
      Int: "\u222c",
      integers: "\u2124",
      Integral: "\u222b",
      intercal: "\u22ba",
      Intersection: "\u22c2",
      intlarhk: "\u2a17",
      intprod: "\u2a3c",
      InvisibleComma: "\u2063",
      InvisibleTimes: "\u2062",
      IOcy: "\u0401",
      iocy: "\u0451",
      Iogon: "\u012e",
      iogon: "\u012f",
      Iopf: "\ud835\udd40",
      iopf: "\ud835\udd5a",
      Iota: "\u0399",
      iota: "\u03b9",
      iprod: "\u2a3c",
      iquest: "\xbf",
      iscr: "\ud835\udcbe",
      Iscr: "\u2110",
      isin: "\u2208",
      isindot: "\u22f5",
      isinE: "\u22f9",
      isins: "\u22f4",
      isinsv: "\u22f3",
      isinv: "\u2208",
      it: "\u2062",
      Itilde: "\u0128",
      itilde: "\u0129",
      Iukcy: "\u0406",
      iukcy: "\u0456",
      Iuml: "\xcf",
      iuml: "\xef",
      Jcirc: "\u0134",
      jcirc: "\u0135",
      Jcy: "\u0419",
      jcy: "\u0439",
      Jfr: "\ud835\udd0d",
      jfr: "\ud835\udd27",
      jmath: "\u0237",
      Jopf: "\ud835\udd41",
      jopf: "\ud835\udd5b",
      Jscr: "\ud835\udca5",
      jscr: "\ud835\udcbf",
      Jsercy: "\u0408",
      jsercy: "\u0458",
      Jukcy: "\u0404",
      jukcy: "\u0454",
      Kappa: "\u039a",
      kappa: "\u03ba",
      kappav: "\u03f0",
      Kcedil: "\u0136",
      kcedil: "\u0137",
      Kcy: "\u041a",
      kcy: "\u043a",
      Kfr: "\ud835\udd0e",
      kfr: "\ud835\udd28",
      kgreen: "\u0138",
      KHcy: "\u0425",
      khcy: "\u0445",
      KJcy: "\u040c",
      kjcy: "\u045c",
      Kopf: "\ud835\udd42",
      kopf: "\ud835\udd5c",
      Kscr: "\ud835\udca6",
      kscr: "\ud835\udcc0",
      lAarr: "\u21da",
      Lacute: "\u0139",
      lacute: "\u013a",
      laemptyv: "\u29b4",
      lagran: "\u2112",
      Lambda: "\u039b",
      lambda: "\u03bb",
      lang: "\u27e8",
      Lang: "\u27ea",
      langd: "\u2991",
      langle: "\u27e8",
      lap: "\u2a85",
      Laplacetrf: "\u2112",
      laquo: "\xab",
      larrb: "\u21e4",
      larrbfs: "\u291f",
      larr: "\u2190",
      Larr: "\u219e",
      lArr: "\u21d0",
      larrfs: "\u291d",
      larrhk: "\u21a9",
      larrlp: "\u21ab",
      larrpl: "\u2939",
      larrsim: "\u2973",
      larrtl: "\u21a2",
      latail: "\u2919",
      lAtail: "\u291b",
      lat: "\u2aab",
      late: "\u2aad",
      lates: "\u2aad\ufe00",
      lbarr: "\u290c",
      lBarr: "\u290e",
      lbbrk: "\u2772",
      lbrace: "{",
      lbrack: "[",
      lbrke: "\u298b",
      lbrksld: "\u298f",
      lbrkslu: "\u298d",
      Lcaron: "\u013d",
      lcaron: "\u013e",
      Lcedil: "\u013b",
      lcedil: "\u013c",
      lceil: "\u2308",
      lcub: "{",
      Lcy: "\u041b",
      lcy: "\u043b",
      ldca: "\u2936",
      ldquo: "\u201c",
      ldquor: "\u201e",
      ldrdhar: "\u2967",
      ldrushar: "\u294b",
      ldsh: "\u21b2",
      le: "\u2264",
      lE: "\u2266",
      LeftAngleBracket: "\u27e8",
      LeftArrowBar: "\u21e4",
      leftarrow: "\u2190",
      LeftArrow: "\u2190",
      Leftarrow: "\u21d0",
      LeftArrowRightArrow: "\u21c6",
      leftarrowtail: "\u21a2",
      LeftCeiling: "\u2308",
      LeftDoubleBracket: "\u27e6",
      LeftDownTeeVector: "\u2961",
      LeftDownVectorBar: "\u2959",
      LeftDownVector: "\u21c3",
      LeftFloor: "\u230a",
      leftharpoondown: "\u21bd",
      leftharpoonup: "\u21bc",
      leftleftarrows: "\u21c7",
      leftrightarrow: "\u2194",
      LeftRightArrow: "\u2194",
      Leftrightarrow: "\u21d4",
      leftrightarrows: "\u21c6",
      leftrightharpoons: "\u21cb",
      leftrightsquigarrow: "\u21ad",
      LeftRightVector: "\u294e",
      LeftTeeArrow: "\u21a4",
      LeftTee: "\u22a3",
      LeftTeeVector: "\u295a",
      leftthreetimes: "\u22cb",
      LeftTriangleBar: "\u29cf",
      LeftTriangle: "\u22b2",
      LeftTriangleEqual: "\u22b4",
      LeftUpDownVector: "\u2951",
      LeftUpTeeVector: "\u2960",
      LeftUpVectorBar: "\u2958",
      LeftUpVector: "\u21bf",
      LeftVectorBar: "\u2952",
      LeftVector: "\u21bc",
      lEg: "\u2a8b",
      leg: "\u22da",
      leq: "\u2264",
      leqq: "\u2266",
      leqslant: "\u2a7d",
      lescc: "\u2aa8",
      les: "\u2a7d",
      lesdot: "\u2a7f",
      lesdoto: "\u2a81",
      lesdotor: "\u2a83",
      lesg: "\u22da\ufe00",
      lesges: "\u2a93",
      lessapprox: "\u2a85",
      lessdot: "\u22d6",
      lesseqgtr: "\u22da",
      lesseqqgtr: "\u2a8b",
      LessEqualGreater: "\u22da",
      LessFullEqual: "\u2266",
      LessGreater: "\u2276",
      lessgtr: "\u2276",
      LessLess: "\u2aa1",
      lesssim: "\u2272",
      LessSlantEqual: "\u2a7d",
      LessTilde: "\u2272",
      lfisht: "\u297c",
      lfloor: "\u230a",
      Lfr: "\ud835\udd0f",
      lfr: "\ud835\udd29",
      lg: "\u2276",
      lgE: "\u2a91",
      lHar: "\u2962",
      lhard: "\u21bd",
      lharu: "\u21bc",
      lharul: "\u296a",
      lhblk: "\u2584",
      LJcy: "\u0409",
      ljcy: "\u0459",
      llarr: "\u21c7",
      ll: "\u226a",
      Ll: "\u22d8",
      llcorner: "\u231e",
      Lleftarrow: "\u21da",
      llhard: "\u296b",
      lltri: "\u25fa",
      Lmidot: "\u013f",
      lmidot: "\u0140",
      lmoustache: "\u23b0",
      lmoust: "\u23b0",
      lnap: "\u2a89",
      lnapprox: "\u2a89",
      lne: "\u2a87",
      lnE: "\u2268",
      lneq: "\u2a87",
      lneqq: "\u2268",
      lnsim: "\u22e6",
      loang: "\u27ec",
      loarr: "\u21fd",
      lobrk: "\u27e6",
      longleftarrow: "\u27f5",
      LongLeftArrow: "\u27f5",
      Longleftarrow: "\u27f8",
      longleftrightarrow: "\u27f7",
      LongLeftRightArrow: "\u27f7",
      Longleftrightarrow: "\u27fa",
      longmapsto: "\u27fc",
      longrightarrow: "\u27f6",
      LongRightArrow: "\u27f6",
      Longrightarrow: "\u27f9",
      looparrowleft: "\u21ab",
      looparrowright: "\u21ac",
      lopar: "\u2985",
      Lopf: "\ud835\udd43",
      lopf: "\ud835\udd5d",
      loplus: "\u2a2d",
      lotimes: "\u2a34",
      lowast: "\u2217",
      lowbar: "_",
      LowerLeftArrow: "\u2199",
      LowerRightArrow: "\u2198",
      loz: "\u25ca",
      lozenge: "\u25ca",
      lozf: "\u29eb",
      lpar: "(",
      lparlt: "\u2993",
      lrarr: "\u21c6",
      lrcorner: "\u231f",
      lrhar: "\u21cb",
      lrhard: "\u296d",
      lrm: "\u200e",
      lrtri: "\u22bf",
      lsaquo: "\u2039",
      lscr: "\ud835\udcc1",
      Lscr: "\u2112",
      lsh: "\u21b0",
      Lsh: "\u21b0",
      lsim: "\u2272",
      lsime: "\u2a8d",
      lsimg: "\u2a8f",
      lsqb: "[",
      lsquo: "\u2018",
      lsquor: "\u201a",
      Lstrok: "\u0141",
      lstrok: "\u0142",
      ltcc: "\u2aa6",
      ltcir: "\u2a79",
      lt: "<",
      LT: "<",
      Lt: "\u226a",
      ltdot: "\u22d6",
      lthree: "\u22cb",
      ltimes: "\u22c9",
      ltlarr: "\u2976",
      ltquest: "\u2a7b",
      ltri: "\u25c3",
      ltrie: "\u22b4",
      ltrif: "\u25c2",
      ltrPar: "\u2996",
      lurdshar: "\u294a",
      luruhar: "\u2966",
      lvertneqq: "\u2268\ufe00",
      lvnE: "\u2268\ufe00",
      macr: "\xaf",
      male: "\u2642",
      malt: "\u2720",
      maltese: "\u2720",
      Map: "\u2905",
      map: "\u21a6",
      mapsto: "\u21a6",
      mapstodown: "\u21a7",
      mapstoleft: "\u21a4",
      mapstoup: "\u21a5",
      marker: "\u25ae",
      mcomma: "\u2a29",
      Mcy: "\u041c",
      mcy: "\u043c",
      mdash: "\u2014",
      mDDot: "\u223a",
      measuredangle: "\u2221",
      MediumSpace: "\u205f",
      Mellintrf: "\u2133",
      Mfr: "\ud835\udd10",
      mfr: "\ud835\udd2a",
      mho: "\u2127",
      micro: "\xb5",
      midast: "*",
      midcir: "\u2af0",
      mid: "\u2223",
      middot: "\xb7",
      minusb: "\u229f",
      minus: "\u2212",
      minusd: "\u2238",
      minusdu: "\u2a2a",
      MinusPlus: "\u2213",
      mlcp: "\u2adb",
      mldr: "\u2026",
      mnplus: "\u2213",
      models: "\u22a7",
      Mopf: "\ud835\udd44",
      mopf: "\ud835\udd5e",
      mp: "\u2213",
      mscr: "\ud835\udcc2",
      Mscr: "\u2133",
      mstpos: "\u223e",
      Mu: "\u039c",
      mu: "\u03bc",
      multimap: "\u22b8",
      mumap: "\u22b8",
      nabla: "\u2207",
      Nacute: "\u0143",
      nacute: "\u0144",
      nang: "\u2220\u20d2",
      nap: "\u2249",
      napE: "\u2a70\u0338",
      napid: "\u224b\u0338",
      napos: "\u0149",
      napprox: "\u2249",
      natural: "\u266e",
      naturals: "\u2115",
      natur: "\u266e",
      nbsp: "\xa0",
      nbump: "\u224e\u0338",
      nbumpe: "\u224f\u0338",
      ncap: "\u2a43",
      Ncaron: "\u0147",
      ncaron: "\u0148",
      Ncedil: "\u0145",
      ncedil: "\u0146",
      ncong: "\u2247",
      ncongdot: "\u2a6d\u0338",
      ncup: "\u2a42",
      Ncy: "\u041d",
      ncy: "\u043d",
      ndash: "\u2013",
      nearhk: "\u2924",
      nearr: "\u2197",
      neArr: "\u21d7",
      nearrow: "\u2197",
      ne: "\u2260",
      nedot: "\u2250\u0338",
      NegativeMediumSpace: "\u200b",
      NegativeThickSpace: "\u200b",
      NegativeThinSpace: "\u200b",
      NegativeVeryThinSpace: "\u200b",
      nequiv: "\u2262",
      nesear: "\u2928",
      nesim: "\u2242\u0338",
      NestedGreaterGreater: "\u226b",
      NestedLessLess: "\u226a",
      NewLine: "\n",
      nexist: "\u2204",
      nexists: "\u2204",
      Nfr: "\ud835\udd11",
      nfr: "\ud835\udd2b",
      ngE: "\u2267\u0338",
      nge: "\u2271",
      ngeq: "\u2271",
      ngeqq: "\u2267\u0338",
      ngeqslant: "\u2a7e\u0338",
      nges: "\u2a7e\u0338",
      nGg: "\u22d9\u0338",
      ngsim: "\u2275",
      nGt: "\u226b\u20d2",
      ngt: "\u226f",
      ngtr: "\u226f",
      nGtv: "\u226b\u0338",
      nharr: "\u21ae",
      nhArr: "\u21ce",
      nhpar: "\u2af2",
      ni: "\u220b",
      nis: "\u22fc",
      nisd: "\u22fa",
      niv: "\u220b",
      NJcy: "\u040a",
      njcy: "\u045a",
      nlarr: "\u219a",
      nlArr: "\u21cd",
      nldr: "\u2025",
      nlE: "\u2266\u0338",
      nle: "\u2270",
      nleftarrow: "\u219a",
      nLeftarrow: "\u21cd",
      nleftrightarrow: "\u21ae",
      nLeftrightarrow: "\u21ce",
      nleq: "\u2270",
      nleqq: "\u2266\u0338",
      nleqslant: "\u2a7d\u0338",
      nles: "\u2a7d\u0338",
      nless: "\u226e",
      nLl: "\u22d8\u0338",
      nlsim: "\u2274",
      nLt: "\u226a\u20d2",
      nlt: "\u226e",
      nltri: "\u22ea",
      nltrie: "\u22ec",
      nLtv: "\u226a\u0338",
      nmid: "\u2224",
      NoBreak: "\u2060",
      NonBreakingSpace: "\xa0",
      nopf: "\ud835\udd5f",
      Nopf: "\u2115",
      Not: "\u2aec",
      not: "\xac",
      NotCongruent: "\u2262",
      NotCupCap: "\u226d",
      NotDoubleVerticalBar: "\u2226",
      NotElement: "\u2209",
      NotEqual: "\u2260",
      NotEqualTilde: "\u2242\u0338",
      NotExists: "\u2204",
      NotGreater: "\u226f",
      NotGreaterEqual: "\u2271",
      NotGreaterFullEqual: "\u2267\u0338",
      NotGreaterGreater: "\u226b\u0338",
      NotGreaterLess: "\u2279",
      NotGreaterSlantEqual: "\u2a7e\u0338",
      NotGreaterTilde: "\u2275",
      NotHumpDownHump: "\u224e\u0338",
      NotHumpEqual: "\u224f\u0338",
      notin: "\u2209",
      notindot: "\u22f5\u0338",
      notinE: "\u22f9\u0338",
      notinva: "\u2209",
      notinvb: "\u22f7",
      notinvc: "\u22f6",
      NotLeftTriangleBar: "\u29cf\u0338",
      NotLeftTriangle: "\u22ea",
      NotLeftTriangleEqual: "\u22ec",
      NotLess: "\u226e",
      NotLessEqual: "\u2270",
      NotLessGreater: "\u2278",
      NotLessLess: "\u226a\u0338",
      NotLessSlantEqual: "\u2a7d\u0338",
      NotLessTilde: "\u2274",
      NotNestedGreaterGreater: "\u2aa2\u0338",
      NotNestedLessLess: "\u2aa1\u0338",
      notni: "\u220c",
      notniva: "\u220c",
      notnivb: "\u22fe",
      notnivc: "\u22fd",
      NotPrecedes: "\u2280",
      NotPrecedesEqual: "\u2aaf\u0338",
      NotPrecedesSlantEqual: "\u22e0",
      NotReverseElement: "\u220c",
      NotRightTriangleBar: "\u29d0\u0338",
      NotRightTriangle: "\u22eb",
      NotRightTriangleEqual: "\u22ed",
      NotSquareSubset: "\u228f\u0338",
      NotSquareSubsetEqual: "\u22e2",
      NotSquareSuperset: "\u2290\u0338",
      NotSquareSupersetEqual: "\u22e3",
      NotSubset: "\u2282\u20d2",
      NotSubsetEqual: "\u2288",
      NotSucceeds: "\u2281",
      NotSucceedsEqual: "\u2ab0\u0338",
      NotSucceedsSlantEqual: "\u22e1",
      NotSucceedsTilde: "\u227f\u0338",
      NotSuperset: "\u2283\u20d2",
      NotSupersetEqual: "\u2289",
      NotTilde: "\u2241",
      NotTildeEqual: "\u2244",
      NotTildeFullEqual: "\u2247",
      NotTildeTilde: "\u2249",
      NotVerticalBar: "\u2224",
      nparallel: "\u2226",
      npar: "\u2226",
      nparsl: "\u2afd\u20e5",
      npart: "\u2202\u0338",
      npolint: "\u2a14",
      npr: "\u2280",
      nprcue: "\u22e0",
      nprec: "\u2280",
      npreceq: "\u2aaf\u0338",
      npre: "\u2aaf\u0338",
      nrarrc: "\u2933\u0338",
      nrarr: "\u219b",
      nrArr: "\u21cf",
      nrarrw: "\u219d\u0338",
      nrightarrow: "\u219b",
      nRightarrow: "\u21cf",
      nrtri: "\u22eb",
      nrtrie: "\u22ed",
      nsc: "\u2281",
      nsccue: "\u22e1",
      nsce: "\u2ab0\u0338",
      Nscr: "\ud835\udca9",
      nscr: "\ud835\udcc3",
      nshortmid: "\u2224",
      nshortparallel: "\u2226",
      nsim: "\u2241",
      nsime: "\u2244",
      nsimeq: "\u2244",
      nsmid: "\u2224",
      nspar: "\u2226",
      nsqsube: "\u22e2",
      nsqsupe: "\u22e3",
      nsub: "\u2284",
      nsubE: "\u2ac5\u0338",
      nsube: "\u2288",
      nsubset: "\u2282\u20d2",
      nsubseteq: "\u2288",
      nsubseteqq: "\u2ac5\u0338",
      nsucc: "\u2281",
      nsucceq: "\u2ab0\u0338",
      nsup: "\u2285",
      nsupE: "\u2ac6\u0338",
      nsupe: "\u2289",
      nsupset: "\u2283\u20d2",
      nsupseteq: "\u2289",
      nsupseteqq: "\u2ac6\u0338",
      ntgl: "\u2279",
      Ntilde: "\xd1",
      ntilde: "\xf1",
      ntlg: "\u2278",
      ntriangleleft: "\u22ea",
      ntrianglelefteq: "\u22ec",
      ntriangleright: "\u22eb",
      ntrianglerighteq: "\u22ed",
      Nu: "\u039d",
      nu: "\u03bd",
      num: "#",
      numero: "\u2116",
      numsp: "\u2007",
      nvap: "\u224d\u20d2",
      nvdash: "\u22ac",
      nvDash: "\u22ad",
      nVdash: "\u22ae",
      nVDash: "\u22af",
      nvge: "\u2265\u20d2",
      nvgt: ">\u20d2",
      nvHarr: "\u2904",
      nvinfin: "\u29de",
      nvlArr: "\u2902",
      nvle: "\u2264\u20d2",
      nvlt: "<\u20d2",
      nvltrie: "\u22b4\u20d2",
      nvrArr: "\u2903",
      nvrtrie: "\u22b5\u20d2",
      nvsim: "\u223c\u20d2",
      nwarhk: "\u2923",
      nwarr: "\u2196",
      nwArr: "\u21d6",
      nwarrow: "\u2196",
      nwnear: "\u2927",
      Oacute: "\xd3",
      oacute: "\xf3",
      oast: "\u229b",
      Ocirc: "\xd4",
      ocirc: "\xf4",
      ocir: "\u229a",
      Ocy: "\u041e",
      ocy: "\u043e",
      odash: "\u229d",
      Odblac: "\u0150",
      odblac: "\u0151",
      odiv: "\u2a38",
      odot: "\u2299",
      odsold: "\u29bc",
      OElig: "\u0152",
      oelig: "\u0153",
      ofcir: "\u29bf",
      Ofr: "\ud835\udd12",
      ofr: "\ud835\udd2c",
      ogon: "\u02db",
      Ograve: "\xd2",
      ograve: "\xf2",
      ogt: "\u29c1",
      ohbar: "\u29b5",
      ohm: "\u03a9",
      oint: "\u222e",
      olarr: "\u21ba",
      olcir: "\u29be",
      olcross: "\u29bb",
      oline: "\u203e",
      olt: "\u29c0",
      Omacr: "\u014c",
      omacr: "\u014d",
      Omega: "\u03a9",
      omega: "\u03c9",
      Omicron: "\u039f",
      omicron: "\u03bf",
      omid: "\u29b6",
      ominus: "\u2296",
      Oopf: "\ud835\udd46",
      oopf: "\ud835\udd60",
      opar: "\u29b7",
      OpenCurlyDoubleQuote: "\u201c",
      OpenCurlyQuote: "\u2018",
      operp: "\u29b9",
      oplus: "\u2295",
      orarr: "\u21bb",
      Or: "\u2a54",
      or: "\u2228",
      ord: "\u2a5d",
      order: "\u2134",
      orderof: "\u2134",
      ordf: "\xaa",
      ordm: "\xba",
      origof: "\u22b6",
      oror: "\u2a56",
      orslope: "\u2a57",
      orv: "\u2a5b",
      oS: "\u24c8",
      Oscr: "\ud835\udcaa",
      oscr: "\u2134",
      Oslash: "\xd8",
      oslash: "\xf8",
      osol: "\u2298",
      Otilde: "\xd5",
      otilde: "\xf5",
      otimesas: "\u2a36",
      Otimes: "\u2a37",
      otimes: "\u2297",
      Ouml: "\xd6",
      ouml: "\xf6",
      ovbar: "\u233d",
      OverBar: "\u203e",
      OverBrace: "\u23de",
      OverBracket: "\u23b4",
      OverParenthesis: "\u23dc",
      para: "\xb6",
      parallel: "\u2225",
      par: "\u2225",
      parsim: "\u2af3",
      parsl: "\u2afd",
      part: "\u2202",
      PartialD: "\u2202",
      Pcy: "\u041f",
      pcy: "\u043f",
      percnt: "%",
      period: ".",
      permil: "\u2030",
      perp: "\u22a5",
      pertenk: "\u2031",
      Pfr: "\ud835\udd13",
      pfr: "\ud835\udd2d",
      Phi: "\u03a6",
      phi: "\u03c6",
      phiv: "\u03d5",
      phmmat: "\u2133",
      phone: "\u260e",
      Pi: "\u03a0",
      pi: "\u03c0",
      pitchfork: "\u22d4",
      piv: "\u03d6",
      planck: "\u210f",
      planckh: "\u210e",
      plankv: "\u210f",
      plusacir: "\u2a23",
      plusb: "\u229e",
      pluscir: "\u2a22",
      plus: "+",
      plusdo: "\u2214",
      plusdu: "\u2a25",
      pluse: "\u2a72",
      PlusMinus: "\xb1",
      plusmn: "\xb1",
      plussim: "\u2a26",
      plustwo: "\u2a27",
      pm: "\xb1",
      Poincareplane: "\u210c",
      pointint: "\u2a15",
      popf: "\ud835\udd61",
      Popf: "\u2119",
      pound: "\xa3",
      prap: "\u2ab7",
      Pr: "\u2abb",
      pr: "\u227a",
      prcue: "\u227c",
      precapprox: "\u2ab7",
      prec: "\u227a",
      preccurlyeq: "\u227c",
      Precedes: "\u227a",
      PrecedesEqual: "\u2aaf",
      PrecedesSlantEqual: "\u227c",
      PrecedesTilde: "\u227e",
      preceq: "\u2aaf",
      precnapprox: "\u2ab9",
      precneqq: "\u2ab5",
      precnsim: "\u22e8",
      pre: "\u2aaf",
      prE: "\u2ab3",
      precsim: "\u227e",
      prime: "\u2032",
      Prime: "\u2033",
      primes: "\u2119",
      prnap: "\u2ab9",
      prnE: "\u2ab5",
      prnsim: "\u22e8",
      prod: "\u220f",
      Product: "\u220f",
      profalar: "\u232e",
      profline: "\u2312",
      profsurf: "\u2313",
      prop: "\u221d",
      Proportional: "\u221d",
      Proportion: "\u2237",
      propto: "\u221d",
      prsim: "\u227e",
      prurel: "\u22b0",
      Pscr: "\ud835\udcab",
      pscr: "\ud835\udcc5",
      Psi: "\u03a8",
      psi: "\u03c8",
      puncsp: "\u2008",
      Qfr: "\ud835\udd14",
      qfr: "\ud835\udd2e",
      qint: "\u2a0c",
      qopf: "\ud835\udd62",
      Qopf: "\u211a",
      qprime: "\u2057",
      Qscr: "\ud835\udcac",
      qscr: "\ud835\udcc6",
      quaternions: "\u210d",
      quatint: "\u2a16",
      quest: "?",
      questeq: "\u225f",
      quot: '"',
      QUOT: '"',
      rAarr: "\u21db",
      race: "\u223d\u0331",
      Racute: "\u0154",
      racute: "\u0155",
      radic: "\u221a",
      raemptyv: "\u29b3",
      rang: "\u27e9",
      Rang: "\u27eb",
      rangd: "\u2992",
      range: "\u29a5",
      rangle: "\u27e9",
      raquo: "\xbb",
      rarrap: "\u2975",
      rarrb: "\u21e5",
      rarrbfs: "\u2920",
      rarrc: "\u2933",
      rarr: "\u2192",
      Rarr: "\u21a0",
      rArr: "\u21d2",
      rarrfs: "\u291e",
      rarrhk: "\u21aa",
      rarrlp: "\u21ac",
      rarrpl: "\u2945",
      rarrsim: "\u2974",
      Rarrtl: "\u2916",
      rarrtl: "\u21a3",
      rarrw: "\u219d",
      ratail: "\u291a",
      rAtail: "\u291c",
      ratio: "\u2236",
      rationals: "\u211a",
      rbarr: "\u290d",
      rBarr: "\u290f",
      RBarr: "\u2910",
      rbbrk: "\u2773",
      rbrace: "}",
      rbrack: "]",
      rbrke: "\u298c",
      rbrksld: "\u298e",
      rbrkslu: "\u2990",
      Rcaron: "\u0158",
      rcaron: "\u0159",
      Rcedil: "\u0156",
      rcedil: "\u0157",
      rceil: "\u2309",
      rcub: "}",
      Rcy: "\u0420",
      rcy: "\u0440",
      rdca: "\u2937",
      rdldhar: "\u2969",
      rdquo: "\u201d",
      rdquor: "\u201d",
      rdsh: "\u21b3",
      real: "\u211c",
      realine: "\u211b",
      realpart: "\u211c",
      reals: "\u211d",
      Re: "\u211c",
      rect: "\u25ad",
      reg: "\xae",
      REG: "\xae",
      ReverseElement: "\u220b",
      ReverseEquilibrium: "\u21cb",
      ReverseUpEquilibrium: "\u296f",
      rfisht: "\u297d",
      rfloor: "\u230b",
      rfr: "\ud835\udd2f",
      Rfr: "\u211c",
      rHar: "\u2964",
      rhard: "\u21c1",
      rharu: "\u21c0",
      rharul: "\u296c",
      Rho: "\u03a1",
      rho: "\u03c1",
      rhov: "\u03f1",
      RightAngleBracket: "\u27e9",
      RightArrowBar: "\u21e5",
      rightarrow: "\u2192",
      RightArrow: "\u2192",
      Rightarrow: "\u21d2",
      RightArrowLeftArrow: "\u21c4",
      rightarrowtail: "\u21a3",
      RightCeiling: "\u2309",
      RightDoubleBracket: "\u27e7",
      RightDownTeeVector: "\u295d",
      RightDownVectorBar: "\u2955",
      RightDownVector: "\u21c2",
      RightFloor: "\u230b",
      rightharpoondown: "\u21c1",
      rightharpoonup: "\u21c0",
      rightleftarrows: "\u21c4",
      rightleftharpoons: "\u21cc",
      rightrightarrows: "\u21c9",
      rightsquigarrow: "\u219d",
      RightTeeArrow: "\u21a6",
      RightTee: "\u22a2",
      RightTeeVector: "\u295b",
      rightthreetimes: "\u22cc",
      RightTriangleBar: "\u29d0",
      RightTriangle: "\u22b3",
      RightTriangleEqual: "\u22b5",
      RightUpDownVector: "\u294f",
      RightUpTeeVector: "\u295c",
      RightUpVectorBar: "\u2954",
      RightUpVector: "\u21be",
      RightVectorBar: "\u2953",
      RightVector: "\u21c0",
      ring: "\u02da",
      risingdotseq: "\u2253",
      rlarr: "\u21c4",
      rlhar: "\u21cc",
      rlm: "\u200f",
      rmoustache: "\u23b1",
      rmoust: "\u23b1",
      rnmid: "\u2aee",
      roang: "\u27ed",
      roarr: "\u21fe",
      robrk: "\u27e7",
      ropar: "\u2986",
      ropf: "\ud835\udd63",
      Ropf: "\u211d",
      roplus: "\u2a2e",
      rotimes: "\u2a35",
      RoundImplies: "\u2970",
      rpar: ")",
      rpargt: "\u2994",
      rppolint: "\u2a12",
      rrarr: "\u21c9",
      Rrightarrow: "\u21db",
      rsaquo: "\u203a",
      rscr: "\ud835\udcc7",
      Rscr: "\u211b",
      rsh: "\u21b1",
      Rsh: "\u21b1",
      rsqb: "]",
      rsquo: "\u2019",
      rsquor: "\u2019",
      rthree: "\u22cc",
      rtimes: "\u22ca",
      rtri: "\u25b9",
      rtrie: "\u22b5",
      rtrif: "\u25b8",
      rtriltri: "\u29ce",
      RuleDelayed: "\u29f4",
      ruluhar: "\u2968",
      rx: "\u211e",
      Sacute: "\u015a",
      sacute: "\u015b",
      sbquo: "\u201a",
      scap: "\u2ab8",
      Scaron: "\u0160",
      scaron: "\u0161",
      Sc: "\u2abc",
      sc: "\u227b",
      sccue: "\u227d",
      sce: "\u2ab0",
      scE: "\u2ab4",
      Scedil: "\u015e",
      scedil: "\u015f",
      Scirc: "\u015c",
      scirc: "\u015d",
      scnap: "\u2aba",
      scnE: "\u2ab6",
      scnsim: "\u22e9",
      scpolint: "\u2a13",
      scsim: "\u227f",
      Scy: "\u0421",
      scy: "\u0441",
      sdotb: "\u22a1",
      sdot: "\u22c5",
      sdote: "\u2a66",
      searhk: "\u2925",
      searr: "\u2198",
      seArr: "\u21d8",
      searrow: "\u2198",
      sect: "\xa7",
      semi: ";",
      seswar: "\u2929",
      setminus: "\u2216",
      setmn: "\u2216",
      sext: "\u2736",
      Sfr: "\ud835\udd16",
      sfr: "\ud835\udd30",
      sfrown: "\u2322",
      sharp: "\u266f",
      SHCHcy: "\u0429",
      shchcy: "\u0449",
      SHcy: "\u0428",
      shcy: "\u0448",
      ShortDownArrow: "\u2193",
      ShortLeftArrow: "\u2190",
      shortmid: "\u2223",
      shortparallel: "\u2225",
      ShortRightArrow: "\u2192",
      ShortUpArrow: "\u2191",
      shy: "\xad",
      Sigma: "\u03a3",
      sigma: "\u03c3",
      sigmaf: "\u03c2",
      sigmav: "\u03c2",
      sim: "\u223c",
      simdot: "\u2a6a",
      sime: "\u2243",
      simeq: "\u2243",
      simg: "\u2a9e",
      simgE: "\u2aa0",
      siml: "\u2a9d",
      simlE: "\u2a9f",
      simne: "\u2246",
      simplus: "\u2a24",
      simrarr: "\u2972",
      slarr: "\u2190",
      SmallCircle: "\u2218",
      smallsetminus: "\u2216",
      smashp: "\u2a33",
      smeparsl: "\u29e4",
      smid: "\u2223",
      smile: "\u2323",
      smt: "\u2aaa",
      smte: "\u2aac",
      smtes: "\u2aac\ufe00",
      SOFTcy: "\u042c",
      softcy: "\u044c",
      solbar: "\u233f",
      solb: "\u29c4",
      sol: "/",
      Sopf: "\ud835\udd4a",
      sopf: "\ud835\udd64",
      spades: "\u2660",
      spadesuit: "\u2660",
      spar: "\u2225",
      sqcap: "\u2293",
      sqcaps: "\u2293\ufe00",
      sqcup: "\u2294",
      sqcups: "\u2294\ufe00",
      Sqrt: "\u221a",
      sqsub: "\u228f",
      sqsube: "\u2291",
      sqsubset: "\u228f",
      sqsubseteq: "\u2291",
      sqsup: "\u2290",
      sqsupe: "\u2292",
      sqsupset: "\u2290",
      sqsupseteq: "\u2292",
      square: "\u25a1",
      Square: "\u25a1",
      SquareIntersection: "\u2293",
      SquareSubset: "\u228f",
      SquareSubsetEqual: "\u2291",
      SquareSuperset: "\u2290",
      SquareSupersetEqual: "\u2292",
      SquareUnion: "\u2294",
      squarf: "\u25aa",
      squ: "\u25a1",
      squf: "\u25aa",
      srarr: "\u2192",
      Sscr: "\ud835\udcae",
      sscr: "\ud835\udcc8",
      ssetmn: "\u2216",
      ssmile: "\u2323",
      sstarf: "\u22c6",
      Star: "\u22c6",
      star: "\u2606",
      starf: "\u2605",
      straightepsilon: "\u03f5",
      straightphi: "\u03d5",
      strns: "\xaf",
      sub: "\u2282",
      Sub: "\u22d0",
      subdot: "\u2abd",
      subE: "\u2ac5",
      sube: "\u2286",
      subedot: "\u2ac3",
      submult: "\u2ac1",
      subnE: "\u2acb",
      subne: "\u228a",
      subplus: "\u2abf",
      subrarr: "\u2979",
      subset: "\u2282",
      Subset: "\u22d0",
      subseteq: "\u2286",
      subseteqq: "\u2ac5",
      SubsetEqual: "\u2286",
      subsetneq: "\u228a",
      subsetneqq: "\u2acb",
      subsim: "\u2ac7",
      subsub: "\u2ad5",
      subsup: "\u2ad3",
      succapprox: "\u2ab8",
      succ: "\u227b",
      succcurlyeq: "\u227d",
      Succeeds: "\u227b",
      SucceedsEqual: "\u2ab0",
      SucceedsSlantEqual: "\u227d",
      SucceedsTilde: "\u227f",
      succeq: "\u2ab0",
      succnapprox: "\u2aba",
      succneqq: "\u2ab6",
      succnsim: "\u22e9",
      succsim: "\u227f",
      SuchThat: "\u220b",
      sum: "\u2211",
      Sum: "\u2211",
      sung: "\u266a",
      sup1: "\xb9",
      sup2: "\xb2",
      sup3: "\xb3",
      sup: "\u2283",
      Sup: "\u22d1",
      supdot: "\u2abe",
      supdsub: "\u2ad8",
      supE: "\u2ac6",
      supe: "\u2287",
      supedot: "\u2ac4",
      Superset: "\u2283",
      SupersetEqual: "\u2287",
      suphsol: "\u27c9",
      suphsub: "\u2ad7",
      suplarr: "\u297b",
      supmult: "\u2ac2",
      supnE: "\u2acc",
      supne: "\u228b",
      supplus: "\u2ac0",
      supset: "\u2283",
      Supset: "\u22d1",
      supseteq: "\u2287",
      supseteqq: "\u2ac6",
      supsetneq: "\u228b",
      supsetneqq: "\u2acc",
      supsim: "\u2ac8",
      supsub: "\u2ad4",
      supsup: "\u2ad6",
      swarhk: "\u2926",
      swarr: "\u2199",
      swArr: "\u21d9",
      swarrow: "\u2199",
      swnwar: "\u292a",
      szlig: "\xdf",
      Tab: "\t",
      target: "\u2316",
      Tau: "\u03a4",
      tau: "\u03c4",
      tbrk: "\u23b4",
      Tcaron: "\u0164",
      tcaron: "\u0165",
      Tcedil: "\u0162",
      tcedil: "\u0163",
      Tcy: "\u0422",
      tcy: "\u0442",
      tdot: "\u20db",
      telrec: "\u2315",
      Tfr: "\ud835\udd17",
      tfr: "\ud835\udd31",
      there4: "\u2234",
      therefore: "\u2234",
      Therefore: "\u2234",
      Theta: "\u0398",
      theta: "\u03b8",
      thetasym: "\u03d1",
      thetav: "\u03d1",
      thickapprox: "\u2248",
      thicksim: "\u223c",
      ThickSpace: "\u205f\u200a",
      ThinSpace: "\u2009",
      thinsp: "\u2009",
      thkap: "\u2248",
      thksim: "\u223c",
      THORN: "\xde",
      thorn: "\xfe",
      tilde: "\u02dc",
      Tilde: "\u223c",
      TildeEqual: "\u2243",
      TildeFullEqual: "\u2245",
      TildeTilde: "\u2248",
      timesbar: "\u2a31",
      timesb: "\u22a0",
      times: "\xd7",
      timesd: "\u2a30",
      tint: "\u222d",
      toea: "\u2928",
      topbot: "\u2336",
      topcir: "\u2af1",
      top: "\u22a4",
      Topf: "\ud835\udd4b",
      topf: "\ud835\udd65",
      topfork: "\u2ada",
      tosa: "\u2929",
      tprime: "\u2034",
      trade: "\u2122",
      TRADE: "\u2122",
      triangle: "\u25b5",
      triangledown: "\u25bf",
      triangleleft: "\u25c3",
      trianglelefteq: "\u22b4",
      triangleq: "\u225c",
      triangleright: "\u25b9",
      trianglerighteq: "\u22b5",
      tridot: "\u25ec",
      trie: "\u225c",
      triminus: "\u2a3a",
      TripleDot: "\u20db",
      triplus: "\u2a39",
      trisb: "\u29cd",
      tritime: "\u2a3b",
      trpezium: "\u23e2",
      Tscr: "\ud835\udcaf",
      tscr: "\ud835\udcc9",
      TScy: "\u0426",
      tscy: "\u0446",
      TSHcy: "\u040b",
      tshcy: "\u045b",
      Tstrok: "\u0166",
      tstrok: "\u0167",
      twixt: "\u226c",
      twoheadleftarrow: "\u219e",
      twoheadrightarrow: "\u21a0",
      Uacute: "\xda",
      uacute: "\xfa",
      uarr: "\u2191",
      Uarr: "\u219f",
      uArr: "\u21d1",
      Uarrocir: "\u2949",
      Ubrcy: "\u040e",
      ubrcy: "\u045e",
      Ubreve: "\u016c",
      ubreve: "\u016d",
      Ucirc: "\xdb",
      ucirc: "\xfb",
      Ucy: "\u0423",
      ucy: "\u0443",
      udarr: "\u21c5",
      Udblac: "\u0170",
      udblac: "\u0171",
      udhar: "\u296e",
      ufisht: "\u297e",
      Ufr: "\ud835\udd18",
      ufr: "\ud835\udd32",
      Ugrave: "\xd9",
      ugrave: "\xf9",
      uHar: "\u2963",
      uharl: "\u21bf",
      uharr: "\u21be",
      uhblk: "\u2580",
      ulcorn: "\u231c",
      ulcorner: "\u231c",
      ulcrop: "\u230f",
      ultri: "\u25f8",
      Umacr: "\u016a",
      umacr: "\u016b",
      uml: "\xa8",
      UnderBar: "_",
      UnderBrace: "\u23df",
      UnderBracket: "\u23b5",
      UnderParenthesis: "\u23dd",
      Union: "\u22c3",
      UnionPlus: "\u228e",
      Uogon: "\u0172",
      uogon: "\u0173",
      Uopf: "\ud835\udd4c",
      uopf: "\ud835\udd66",
      UpArrowBar: "\u2912",
      uparrow: "\u2191",
      UpArrow: "\u2191",
      Uparrow: "\u21d1",
      UpArrowDownArrow: "\u21c5",
      updownarrow: "\u2195",
      UpDownArrow: "\u2195",
      Updownarrow: "\u21d5",
      UpEquilibrium: "\u296e",
      upharpoonleft: "\u21bf",
      upharpoonright: "\u21be",
      uplus: "\u228e",
      UpperLeftArrow: "\u2196",
      UpperRightArrow: "\u2197",
      upsi: "\u03c5",
      Upsi: "\u03d2",
      upsih: "\u03d2",
      Upsilon: "\u03a5",
      upsilon: "\u03c5",
      UpTeeArrow: "\u21a5",
      UpTee: "\u22a5",
      upuparrows: "\u21c8",
      urcorn: "\u231d",
      urcorner: "\u231d",
      urcrop: "\u230e",
      Uring: "\u016e",
      uring: "\u016f",
      urtri: "\u25f9",
      Uscr: "\ud835\udcb0",
      uscr: "\ud835\udcca",
      utdot: "\u22f0",
      Utilde: "\u0168",
      utilde: "\u0169",
      utri: "\u25b5",
      utrif: "\u25b4",
      uuarr: "\u21c8",
      Uuml: "\xdc",
      uuml: "\xfc",
      uwangle: "\u29a7",
      vangrt: "\u299c",
      varepsilon: "\u03f5",
      varkappa: "\u03f0",
      varnothing: "\u2205",
      varphi: "\u03d5",
      varpi: "\u03d6",
      varpropto: "\u221d",
      varr: "\u2195",
      vArr: "\u21d5",
      varrho: "\u03f1",
      varsigma: "\u03c2",
      varsubsetneq: "\u228a\ufe00",
      varsubsetneqq: "\u2acb\ufe00",
      varsupsetneq: "\u228b\ufe00",
      varsupsetneqq: "\u2acc\ufe00",
      vartheta: "\u03d1",
      vartriangleleft: "\u22b2",
      vartriangleright: "\u22b3",
      vBar: "\u2ae8",
      Vbar: "\u2aeb",
      vBarv: "\u2ae9",
      Vcy: "\u0412",
      vcy: "\u0432",
      vdash: "\u22a2",
      vDash: "\u22a8",
      Vdash: "\u22a9",
      VDash: "\u22ab",
      Vdashl: "\u2ae6",
      veebar: "\u22bb",
      vee: "\u2228",
      Vee: "\u22c1",
      veeeq: "\u225a",
      vellip: "\u22ee",
      verbar: "|",
      Verbar: "\u2016",
      vert: "|",
      Vert: "\u2016",
      VerticalBar: "\u2223",
      VerticalLine: "|",
      VerticalSeparator: "\u2758",
      VerticalTilde: "\u2240",
      VeryThinSpace: "\u200a",
      Vfr: "\ud835\udd19",
      vfr: "\ud835\udd33",
      vltri: "\u22b2",
      vnsub: "\u2282\u20d2",
      vnsup: "\u2283\u20d2",
      Vopf: "\ud835\udd4d",
      vopf: "\ud835\udd67",
      vprop: "\u221d",
      vrtri: "\u22b3",
      Vscr: "\ud835\udcb1",
      vscr: "\ud835\udccb",
      vsubnE: "\u2acb\ufe00",
      vsubne: "\u228a\ufe00",
      vsupnE: "\u2acc\ufe00",
      vsupne: "\u228b\ufe00",
      Vvdash: "\u22aa",
      vzigzag: "\u299a",
      Wcirc: "\u0174",
      wcirc: "\u0175",
      wedbar: "\u2a5f",
      wedge: "\u2227",
      Wedge: "\u22c0",
      wedgeq: "\u2259",
      weierp: "\u2118",
      Wfr: "\ud835\udd1a",
      wfr: "\ud835\udd34",
      Wopf: "\ud835\udd4e",
      wopf: "\ud835\udd68",
      wp: "\u2118",
      wr: "\u2240",
      wreath: "\u2240",
      Wscr: "\ud835\udcb2",
      wscr: "\ud835\udccc",
      xcap: "\u22c2",
      xcirc: "\u25ef",
      xcup: "\u22c3",
      xdtri: "\u25bd",
      Xfr: "\ud835\udd1b",
      xfr: "\ud835\udd35",
      xharr: "\u27f7",
      xhArr: "\u27fa",
      Xi: "\u039e",
      xi: "\u03be",
      xlarr: "\u27f5",
      xlArr: "\u27f8",
      xmap: "\u27fc",
      xnis: "\u22fb",
      xodot: "\u2a00",
      Xopf: "\ud835\udd4f",
      xopf: "\ud835\udd69",
      xoplus: "\u2a01",
      xotime: "\u2a02",
      xrarr: "\u27f6",
      xrArr: "\u27f9",
      Xscr: "\ud835\udcb3",
      xscr: "\ud835\udccd",
      xsqcup: "\u2a06",
      xuplus: "\u2a04",
      xutri: "\u25b3",
      xvee: "\u22c1",
      xwedge: "\u22c0",
      Yacute: "\xdd",
      yacute: "\xfd",
      YAcy: "\u042f",
      yacy: "\u044f",
      Ycirc: "\u0176",
      ycirc: "\u0177",
      Ycy: "\u042b",
      ycy: "\u044b",
      yen: "\xa5",
      Yfr: "\ud835\udd1c",
      yfr: "\ud835\udd36",
      YIcy: "\u0407",
      yicy: "\u0457",
      Yopf: "\ud835\udd50",
      yopf: "\ud835\udd6a",
      Yscr: "\ud835\udcb4",
      yscr: "\ud835\udcce",
      YUcy: "\u042e",
      yucy: "\u044e",
      yuml: "\xff",
      Yuml: "\u0178",
      Zacute: "\u0179",
      zacute: "\u017a",
      Zcaron: "\u017d",
      zcaron: "\u017e",
      Zcy: "\u0417",
      zcy: "\u0437",
      Zdot: "\u017b",
      zdot: "\u017c",
      zeetrf: "\u2128",
      ZeroWidthSpace: "\u200b",
      Zeta: "\u0396",
      zeta: "\u03b6",
      zfr: "\ud835\udd37",
      Zfr: "\u2128",
      ZHcy: "\u0416",
      zhcy: "\u0436",
      zigrarr: "\u21dd",
      zopf: "\ud835\udd6b",
      Zopf: "\u2124",
      Zscr: "\ud835\udcb5",
      zscr: "\ud835\udccf",
      zwj: "\u200d",
      zwnj: "\u200c"
    };
  }, {} ],
  71: [ function(require, module, exports) {
    module.exports = {
      Aacute: "\xc1",
      aacute: "\xe1",
      Acirc: "\xc2",
      acirc: "\xe2",
      acute: "\xb4",
      AElig: "\xc6",
      aelig: "\xe6",
      Agrave: "\xc0",
      agrave: "\xe0",
      amp: "&",
      AMP: "&",
      Aring: "\xc5",
      aring: "\xe5",
      Atilde: "\xc3",
      atilde: "\xe3",
      Auml: "\xc4",
      auml: "\xe4",
      brvbar: "\xa6",
      Ccedil: "\xc7",
      ccedil: "\xe7",
      cedil: "\xb8",
      cent: "\xa2",
      copy: "\xa9",
      COPY: "\xa9",
      curren: "\xa4",
      deg: "\xb0",
      divide: "\xf7",
      Eacute: "\xc9",
      eacute: "\xe9",
      Ecirc: "\xca",
      ecirc: "\xea",
      Egrave: "\xc8",
      egrave: "\xe8",
      ETH: "\xd0",
      eth: "\xf0",
      Euml: "\xcb",
      euml: "\xeb",
      frac12: "\xbd",
      frac14: "\xbc",
      frac34: "\xbe",
      gt: ">",
      GT: ">",
      Iacute: "\xcd",
      iacute: "\xed",
      Icirc: "\xce",
      icirc: "\xee",
      iexcl: "\xa1",
      Igrave: "\xcc",
      igrave: "\xec",
      iquest: "\xbf",
      Iuml: "\xcf",
      iuml: "\xef",
      laquo: "\xab",
      lt: "<",
      LT: "<",
      macr: "\xaf",
      micro: "\xb5",
      middot: "\xb7",
      nbsp: "\xa0",
      not: "\xac",
      Ntilde: "\xd1",
      ntilde: "\xf1",
      Oacute: "\xd3",
      oacute: "\xf3",
      Ocirc: "\xd4",
      ocirc: "\xf4",
      Ograve: "\xd2",
      ograve: "\xf2",
      ordf: "\xaa",
      ordm: "\xba",
      Oslash: "\xd8",
      oslash: "\xf8",
      Otilde: "\xd5",
      otilde: "\xf5",
      Ouml: "\xd6",
      ouml: "\xf6",
      para: "\xb6",
      plusmn: "\xb1",
      pound: "\xa3",
      quot: '"',
      QUOT: '"',
      raquo: "\xbb",
      reg: "\xae",
      REG: "\xae",
      sect: "\xa7",
      shy: "\xad",
      sup1: "\xb9",
      sup2: "\xb2",
      sup3: "\xb3",
      szlig: "\xdf",
      THORN: "\xde",
      thorn: "\xfe",
      times: "\xd7",
      Uacute: "\xda",
      uacute: "\xfa",
      Ucirc: "\xdb",
      ucirc: "\xfb",
      Ugrave: "\xd9",
      ugrave: "\xf9",
      uml: "\xa8",
      Uuml: "\xdc",
      uuml: "\xfc",
      Yacute: "\xdd",
      yacute: "\xfd",
      yen: "\xa5",
      yuml: "\xff"
    };
  }, {} ],
  72: [ function(require, module, exports) {
    module.exports = {
      amp: "&",
      apos: "'",
      gt: ">",
      lt: "<",
      quot: '"'
    };
  }, {} ],
  73: [ function(require, module, exports) {
    module.exports = CollectingHandler;
    function CollectingHandler(cbs) {
      this._cbs = cbs || {};
      this.events = [];
    }
    var EVENTS = require("./").EVENTS;
    Object.keys(EVENTS).forEach(function(name) {
      if (0 === EVENTS[name]) {
        name = "on" + name;
        CollectingHandler.prototype[name] = function() {
          this.events.push([ name ]);
          this._cbs[name] && this._cbs[name]();
        };
      } else if (1 === EVENTS[name]) {
        name = "on" + name;
        CollectingHandler.prototype[name] = function(a) {
          this.events.push([ name, a ]);
          this._cbs[name] && this._cbs[name](a);
        };
      } else {
        if (2 !== EVENTS[name]) throw Error("wrong number of arguments");
        name = "on" + name;
        CollectingHandler.prototype[name] = function(a, b) {
          this.events.push([ name, a, b ]);
          this._cbs[name] && this._cbs[name](a, b);
        };
      }
    });
    CollectingHandler.prototype.onreset = function() {
      this.events = [];
      this._cbs.onreset && this._cbs.onreset();
    };
    CollectingHandler.prototype.restart = function() {
      this._cbs.onreset && this._cbs.onreset();
      for (var i = 0, len = this.events.length; i < len; i++) if (this._cbs[this.events[i][0]]) {
        var num = this.events[i].length;
        1 === num ? this._cbs[this.events[i][0]]() : 2 === num ? this._cbs[this.events[i][0]](this.events[i][1]) : this._cbs[this.events[i][0]](this.events[i][1], this.events[i][2]);
      }
    };
  }, {
    "./": 80
  } ],
  74: [ function(require, module, exports) {
    var index = require("./index.js"), DomHandler = index.DomHandler, DomUtils = index.DomUtils;
    function FeedHandler(callback, options) {
      this.init(callback, options);
    }
    require("util").inherits(FeedHandler, DomHandler);
    FeedHandler.prototype.init = DomHandler;
    function getElements(what, where) {
      return DomUtils.getElementsByTagName(what, where, true);
    }
    function getOneElement(what, where) {
      return DomUtils.getElementsByTagName(what, where, true, 1)[0];
    }
    function fetch(what, where, recurse) {
      return DomUtils.getText(DomUtils.getElementsByTagName(what, where, recurse, 1)).trim();
    }
    function addConditionally(obj, prop, what, where, recurse) {
      var tmp = fetch(what, where, recurse);
      tmp && (obj[prop] = tmp);
    }
    var isValidFeed = function(value) {
      return "rss" === value || "feed" === value || "rdf:RDF" === value;
    };
    FeedHandler.prototype.onend = function() {
      var feed = {}, feedRoot = getOneElement(isValidFeed, this.dom), tmp, childs;
      if (feedRoot) if ("feed" === feedRoot.name) {
        childs = feedRoot.children;
        feed.type = "atom";
        addConditionally(feed, "id", "id", childs);
        addConditionally(feed, "title", "title", childs);
        (tmp = getOneElement("link", childs)) && (tmp = tmp.attribs) && (tmp = tmp.href) && (feed.link = tmp);
        addConditionally(feed, "description", "subtitle", childs);
        (tmp = fetch("updated", childs)) && (feed.updated = new Date(tmp));
        addConditionally(feed, "author", "email", childs, true);
        feed.items = getElements("entry", childs).map(function(item) {
          var entry = {}, tmp;
          item = item.children;
          addConditionally(entry, "id", "id", item);
          addConditionally(entry, "title", "title", item);
          (tmp = getOneElement("link", item)) && (tmp = tmp.attribs) && (tmp = tmp.href) && (entry.link = tmp);
          (tmp = fetch("summary", item) || fetch("content", item)) && (entry.description = tmp);
          (tmp = fetch("updated", item)) && (entry.pubDate = new Date(tmp));
          return entry;
        });
      } else {
        childs = getOneElement("channel", feedRoot.children).children;
        feed.type = feedRoot.name.substr(0, 3);
        feed.id = "";
        addConditionally(feed, "title", "title", childs);
        addConditionally(feed, "link", "link", childs);
        addConditionally(feed, "description", "description", childs);
        (tmp = fetch("lastBuildDate", childs)) && (feed.updated = new Date(tmp));
        addConditionally(feed, "author", "managingEditor", childs, true);
        feed.items = getElements("item", feedRoot.children).map(function(item) {
          var entry = {}, tmp;
          item = item.children;
          addConditionally(entry, "id", "guid", item);
          addConditionally(entry, "title", "title", item);
          addConditionally(entry, "link", "link", item);
          addConditionally(entry, "description", "description", item);
          (tmp = fetch("pubDate", item)) && (entry.pubDate = new Date(tmp));
          return entry;
        });
      }
      this.dom = feed;
      DomHandler.prototype._handleCallback.call(this, feedRoot ? null : Error("couldn't find root of feed"));
    };
    module.exports = FeedHandler;
  }, {
    "./index.js": 80,
    util: 32
  } ],
  75: [ function(require, module, exports) {
    var Tokenizer = require("./Tokenizer.js");
    var formTags = {
      input: true,
      option: true,
      optgroup: true,
      select: true,
      button: true,
      datalist: true,
      textarea: true
    };
    var openImpliesClose = {
      tr: {
        tr: true,
        th: true,
        td: true
      },
      th: {
        th: true
      },
      td: {
        thead: true,
        th: true,
        td: true
      },
      body: {
        head: true,
        link: true,
        script: true
      },
      li: {
        li: true
      },
      p: {
        p: true
      },
      h1: {
        p: true
      },
      h2: {
        p: true
      },
      h3: {
        p: true
      },
      h4: {
        p: true
      },
      h5: {
        p: true
      },
      h6: {
        p: true
      },
      select: formTags,
      input: formTags,
      output: formTags,
      button: formTags,
      datalist: formTags,
      textarea: formTags,
      option: {
        option: true
      },
      optgroup: {
        optgroup: true
      }
    };
    var voidElements = {
      __proto__: null,
      area: true,
      base: true,
      basefont: true,
      br: true,
      col: true,
      command: true,
      embed: true,
      frame: true,
      hr: true,
      img: true,
      input: true,
      isindex: true,
      keygen: true,
      link: true,
      meta: true,
      param: true,
      source: true,
      track: true,
      wbr: true,
      path: true,
      circle: true,
      ellipse: true,
      line: true,
      rect: true,
      use: true,
      stop: true,
      polyline: true,
      polygon: true
    };
    var re_nameEnd = /\s|\//;
    function Parser(cbs, options) {
      this._options = options || {};
      this._cbs = cbs || {};
      this._tagname = "";
      this._attribname = "";
      this._attribvalue = "";
      this._attribs = null;
      this._stack = [];
      this.startIndex = 0;
      this.endIndex = null;
      this._lowerCaseTagNames = "lowerCaseTags" in this._options ? !!this._options.lowerCaseTags : !this._options.xmlMode;
      this._lowerCaseAttributeNames = "lowerCaseAttributeNames" in this._options ? !!this._options.lowerCaseAttributeNames : !this._options.xmlMode;
      this._tokenizer = new Tokenizer(this._options, this);
      this._cbs.onparserinit && this._cbs.onparserinit(this);
    }
    require("util").inherits(Parser, require("events").EventEmitter);
    Parser.prototype._updatePosition = function(initialOffset) {
      null === this.endIndex ? this._tokenizer._sectionStart <= initialOffset ? this.startIndex = 0 : this.startIndex = this._tokenizer._sectionStart - initialOffset : this.startIndex = this.endIndex + 1;
      this.endIndex = this._tokenizer.getAbsoluteIndex();
    };
    Parser.prototype.ontext = function(data) {
      this._updatePosition(1);
      this.endIndex--;
      this._cbs.ontext && this._cbs.ontext(data);
    };
    Parser.prototype.onopentagname = function(name) {
      this._lowerCaseTagNames && (name = name.toLowerCase());
      this._tagname = name;
      if (!this._options.xmlMode && name in openImpliesClose) for (var el; (el = this._stack[this._stack.length - 1]) in openImpliesClose[name]; this.onclosetag(el)) ;
      !this._options.xmlMode && name in voidElements || this._stack.push(name);
      this._cbs.onopentagname && this._cbs.onopentagname(name);
      this._cbs.onopentag && (this._attribs = {});
    };
    Parser.prototype.onopentagend = function() {
      this._updatePosition(1);
      if (this._attribs) {
        this._cbs.onopentag && this._cbs.onopentag(this._tagname, this._attribs);
        this._attribs = null;
      }
      !this._options.xmlMode && this._cbs.onclosetag && this._tagname in voidElements && this._cbs.onclosetag(this._tagname);
      this._tagname = "";
    };
    Parser.prototype.onclosetag = function(name) {
      this._updatePosition(1);
      this._lowerCaseTagNames && (name = name.toLowerCase());
      if (!this._stack.length || name in voidElements && !this._options.xmlMode) {
        if (!this._options.xmlMode && ("br" === name || "p" === name)) {
          this.onopentagname(name);
          this._closeCurrentTag();
        }
      } else {
        var pos = this._stack.lastIndexOf(name);
        if (-1 !== pos) if (this._cbs.onclosetag) {
          pos = this._stack.length - pos;
          while (pos--) this._cbs.onclosetag(this._stack.pop());
        } else this._stack.length = pos; else if ("p" === name && !this._options.xmlMode) {
          this.onopentagname(name);
          this._closeCurrentTag();
        }
      }
    };
    Parser.prototype.onselfclosingtag = function() {
      this._options.xmlMode || this._options.recognizeSelfClosing ? this._closeCurrentTag() : this.onopentagend();
    };
    Parser.prototype._closeCurrentTag = function() {
      var name = this._tagname;
      this.onopentagend();
      if (this._stack[this._stack.length - 1] === name) {
        this._cbs.onclosetag && this._cbs.onclosetag(name);
        this._stack.pop();
      }
    };
    Parser.prototype.onattribname = function(name) {
      this._lowerCaseAttributeNames && (name = name.toLowerCase());
      this._attribname = name;
    };
    Parser.prototype.onattribdata = function(value) {
      this._attribvalue += value;
    };
    Parser.prototype.onattribend = function() {
      this._cbs.onattribute && this._cbs.onattribute(this._attribname, this._attribvalue);
      this._attribs && !Object.prototype.hasOwnProperty.call(this._attribs, this._attribname) && (this._attribs[this._attribname] = this._attribvalue);
      this._attribname = "";
      this._attribvalue = "";
    };
    Parser.prototype._getInstructionName = function(value) {
      var idx = value.search(re_nameEnd), name = idx < 0 ? value : value.substr(0, idx);
      this._lowerCaseTagNames && (name = name.toLowerCase());
      return name;
    };
    Parser.prototype.ondeclaration = function(value) {
      if (this._cbs.onprocessinginstruction) {
        var name = this._getInstructionName(value);
        this._cbs.onprocessinginstruction("!" + name, "!" + value);
      }
    };
    Parser.prototype.onprocessinginstruction = function(value) {
      if (this._cbs.onprocessinginstruction) {
        var name = this._getInstructionName(value);
        this._cbs.onprocessinginstruction("?" + name, "?" + value);
      }
    };
    Parser.prototype.oncomment = function(value) {
      this._updatePosition(4);
      this._cbs.oncomment && this._cbs.oncomment(value);
      this._cbs.oncommentend && this._cbs.oncommentend();
    };
    Parser.prototype.oncdata = function(value) {
      this._updatePosition(1);
      if (this._options.xmlMode || this._options.recognizeCDATA) {
        this._cbs.oncdatastart && this._cbs.oncdatastart();
        this._cbs.ontext && this._cbs.ontext(value);
        this._cbs.oncdataend && this._cbs.oncdataend();
      } else this.oncomment("[CDATA[" + value + "]]");
    };
    Parser.prototype.onerror = function(err) {
      this._cbs.onerror && this._cbs.onerror(err);
    };
    Parser.prototype.onend = function() {
      if (this._cbs.onclosetag) for (var i = this._stack.length; i > 0; this._cbs.onclosetag(this._stack[--i])) ;
      this._cbs.onend && this._cbs.onend();
    };
    Parser.prototype.reset = function() {
      this._cbs.onreset && this._cbs.onreset();
      this._tokenizer.reset();
      this._tagname = "";
      this._attribname = "";
      this._attribs = null;
      this._stack = [];
      this._cbs.onparserinit && this._cbs.onparserinit(this);
    };
    Parser.prototype.parseComplete = function(data) {
      this.reset();
      this.end(data);
    };
    Parser.prototype.write = function(chunk) {
      this._tokenizer.write(chunk);
    };
    Parser.prototype.end = function(chunk) {
      this._tokenizer.end(chunk);
    };
    Parser.prototype.pause = function() {
      this._tokenizer.pause();
    };
    Parser.prototype.resume = function() {
      this._tokenizer.resume();
    };
    Parser.prototype.parseChunk = Parser.prototype.write;
    Parser.prototype.done = Parser.prototype.end;
    module.exports = Parser;
  }, {
    "./Tokenizer.js": 78,
    events: 6,
    util: 32
  } ],
  76: [ function(require, module, exports) {
    module.exports = ProxyHandler;
    function ProxyHandler(cbs) {
      this._cbs = cbs || {};
    }
    var EVENTS = require("./").EVENTS;
    Object.keys(EVENTS).forEach(function(name) {
      if (0 === EVENTS[name]) {
        name = "on" + name;
        ProxyHandler.prototype[name] = function() {
          this._cbs[name] && this._cbs[name]();
        };
      } else if (1 === EVENTS[name]) {
        name = "on" + name;
        ProxyHandler.prototype[name] = function(a) {
          this._cbs[name] && this._cbs[name](a);
        };
      } else {
        if (2 !== EVENTS[name]) throw Error("wrong number of arguments");
        name = "on" + name;
        ProxyHandler.prototype[name] = function(a, b) {
          this._cbs[name] && this._cbs[name](a, b);
        };
      }
    });
  }, {
    "./": 80
  } ],
  77: [ function(require, module, exports) {
    module.exports = Stream;
    var Parser = require("./WritableStream.js");
    function Stream(options) {
      Parser.call(this, new Cbs(this), options);
    }
    require("util").inherits(Stream, Parser);
    Stream.prototype.readable = true;
    function Cbs(scope) {
      this.scope = scope;
    }
    var EVENTS = require("../").EVENTS;
    Object.keys(EVENTS).forEach(function(name) {
      if (0 === EVENTS[name]) Cbs.prototype["on" + name] = function() {
        this.scope.emit(name);
      }; else if (1 === EVENTS[name]) Cbs.prototype["on" + name] = function(a) {
        this.scope.emit(name, a);
      }; else {
        if (2 !== EVENTS[name]) throw Error("wrong number of arguments!");
        Cbs.prototype["on" + name] = function(a, b) {
          this.scope.emit(name, a, b);
        };
      }
    });
  }, {
    "../": 80,
    "./WritableStream.js": 79,
    util: 32
  } ],
  78: [ function(require, module, exports) {
    module.exports = Tokenizer;
    var decodeCodePoint = require("entities/lib/decode_codepoint.js"), entityMap = require("entities/maps/entities.json"), legacyMap = require("entities/maps/legacy.json"), xmlMap = require("entities/maps/xml.json"), i = 0, TEXT = i++, BEFORE_TAG_NAME = i++, IN_TAG_NAME = i++, IN_SELF_CLOSING_TAG = i++, BEFORE_CLOSING_TAG_NAME = i++, IN_CLOSING_TAG_NAME = i++, AFTER_CLOSING_TAG_NAME = i++, BEFORE_ATTRIBUTE_NAME = i++, IN_ATTRIBUTE_NAME = i++, AFTER_ATTRIBUTE_NAME = i++, BEFORE_ATTRIBUTE_VALUE = i++, IN_ATTRIBUTE_VALUE_DQ = i++, IN_ATTRIBUTE_VALUE_SQ = i++, IN_ATTRIBUTE_VALUE_NQ = i++, BEFORE_DECLARATION = i++, IN_DECLARATION = i++, IN_PROCESSING_INSTRUCTION = i++, BEFORE_COMMENT = i++, IN_COMMENT = i++, AFTER_COMMENT_1 = i++, AFTER_COMMENT_2 = i++, BEFORE_CDATA_1 = i++, BEFORE_CDATA_2 = i++, BEFORE_CDATA_3 = i++, BEFORE_CDATA_4 = i++, BEFORE_CDATA_5 = i++, BEFORE_CDATA_6 = i++, IN_CDATA = i++, AFTER_CDATA_1 = i++, AFTER_CDATA_2 = i++, BEFORE_SPECIAL = i++, BEFORE_SPECIAL_END = i++, BEFORE_SCRIPT_1 = i++, BEFORE_SCRIPT_2 = i++, BEFORE_SCRIPT_3 = i++, BEFORE_SCRIPT_4 = i++, BEFORE_SCRIPT_5 = i++, AFTER_SCRIPT_1 = i++, AFTER_SCRIPT_2 = i++, AFTER_SCRIPT_3 = i++, AFTER_SCRIPT_4 = i++, AFTER_SCRIPT_5 = i++, BEFORE_STYLE_1 = i++, BEFORE_STYLE_2 = i++, BEFORE_STYLE_3 = i++, BEFORE_STYLE_4 = i++, AFTER_STYLE_1 = i++, AFTER_STYLE_2 = i++, AFTER_STYLE_3 = i++, AFTER_STYLE_4 = i++, BEFORE_ENTITY = i++, BEFORE_NUMERIC_ENTITY = i++, IN_NAMED_ENTITY = i++, IN_NUMERIC_ENTITY = i++, IN_HEX_ENTITY = i++, j = 0, SPECIAL_NONE = j++, SPECIAL_SCRIPT = j++, SPECIAL_STYLE = j++;
    function whitespace(c) {
      return " " === c || "\n" === c || "\t" === c || "\f" === c || "\r" === c;
    }
    function characterState(char, SUCCESS) {
      return function(c) {
        c === char && (this._state = SUCCESS);
      };
    }
    function ifElseState(upper, SUCCESS, FAILURE) {
      var lower = upper.toLowerCase();
      return upper === lower ? function(c) {
        if (c === lower) this._state = SUCCESS; else {
          this._state = FAILURE;
          this._index--;
        }
      } : function(c) {
        if (c === lower || c === upper) this._state = SUCCESS; else {
          this._state = FAILURE;
          this._index--;
        }
      };
    }
    function consumeSpecialNameChar(upper, NEXT_STATE) {
      var lower = upper.toLowerCase();
      return function(c) {
        if (c === lower || c === upper) this._state = NEXT_STATE; else {
          this._state = IN_TAG_NAME;
          this._index--;
        }
      };
    }
    function Tokenizer(options, cbs) {
      this._state = TEXT;
      this._buffer = "";
      this._sectionStart = 0;
      this._index = 0;
      this._bufferOffset = 0;
      this._baseState = TEXT;
      this._special = SPECIAL_NONE;
      this._cbs = cbs;
      this._running = true;
      this._ended = false;
      this._xmlMode = !!(options && options.xmlMode);
      this._decodeEntities = !!(options && options.decodeEntities);
    }
    Tokenizer.prototype._stateText = function(c) {
      if ("<" === c) {
        this._index > this._sectionStart && this._cbs.ontext(this._getSection());
        this._state = BEFORE_TAG_NAME;
        this._sectionStart = this._index;
      } else if (this._decodeEntities && this._special === SPECIAL_NONE && "&" === c) {
        this._index > this._sectionStart && this._cbs.ontext(this._getSection());
        this._baseState = TEXT;
        this._state = BEFORE_ENTITY;
        this._sectionStart = this._index;
      }
    };
    Tokenizer.prototype._stateBeforeTagName = function(c) {
      if ("/" === c) this._state = BEFORE_CLOSING_TAG_NAME; else if (">" === c || this._special !== SPECIAL_NONE || whitespace(c)) this._state = TEXT; else if ("!" === c) {
        this._state = BEFORE_DECLARATION;
        this._sectionStart = this._index + 1;
      } else if ("?" === c) {
        this._state = IN_PROCESSING_INSTRUCTION;
        this._sectionStart = this._index + 1;
      } else if ("<" === c) {
        this._cbs.ontext(this._getSection());
        this._sectionStart = this._index;
      } else {
        this._state = this._xmlMode || "s" !== c && "S" !== c ? IN_TAG_NAME : BEFORE_SPECIAL;
        this._sectionStart = this._index;
      }
    };
    Tokenizer.prototype._stateInTagName = function(c) {
      if ("/" === c || ">" === c || whitespace(c)) {
        this._emitToken("onopentagname");
        this._state = BEFORE_ATTRIBUTE_NAME;
        this._index--;
      }
    };
    Tokenizer.prototype._stateBeforeCloseingTagName = function(c) {
      if (whitespace(c)) ; else if (">" === c) this._state = TEXT; else if (this._special !== SPECIAL_NONE) if ("s" === c || "S" === c) this._state = BEFORE_SPECIAL_END; else {
        this._state = TEXT;
        this._index--;
      } else {
        this._state = IN_CLOSING_TAG_NAME;
        this._sectionStart = this._index;
      }
    };
    Tokenizer.prototype._stateInCloseingTagName = function(c) {
      if (">" === c || whitespace(c)) {
        this._emitToken("onclosetag");
        this._state = AFTER_CLOSING_TAG_NAME;
        this._index--;
      }
    };
    Tokenizer.prototype._stateAfterCloseingTagName = function(c) {
      if (">" === c) {
        this._state = TEXT;
        this._sectionStart = this._index + 1;
      }
    };
    Tokenizer.prototype._stateBeforeAttributeName = function(c) {
      if (">" === c) {
        this._cbs.onopentagend();
        this._state = TEXT;
        this._sectionStart = this._index + 1;
      } else if ("/" === c) this._state = IN_SELF_CLOSING_TAG; else if (!whitespace(c)) {
        this._state = IN_ATTRIBUTE_NAME;
        this._sectionStart = this._index;
      }
    };
    Tokenizer.prototype._stateInSelfClosingTag = function(c) {
      if (">" === c) {
        this._cbs.onselfclosingtag();
        this._state = TEXT;
        this._sectionStart = this._index + 1;
      } else if (!whitespace(c)) {
        this._state = BEFORE_ATTRIBUTE_NAME;
        this._index--;
      }
    };
    Tokenizer.prototype._stateInAttributeName = function(c) {
      if ("=" === c || "/" === c || ">" === c || whitespace(c)) {
        this._cbs.onattribname(this._getSection());
        this._sectionStart = -1;
        this._state = AFTER_ATTRIBUTE_NAME;
        this._index--;
      }
    };
    Tokenizer.prototype._stateAfterAttributeName = function(c) {
      if ("=" === c) this._state = BEFORE_ATTRIBUTE_VALUE; else if ("/" === c || ">" === c) {
        this._cbs.onattribend();
        this._state = BEFORE_ATTRIBUTE_NAME;
        this._index--;
      } else if (!whitespace(c)) {
        this._cbs.onattribend();
        this._state = IN_ATTRIBUTE_NAME;
        this._sectionStart = this._index;
      }
    };
    Tokenizer.prototype._stateBeforeAttributeValue = function(c) {
      if ('"' === c) {
        this._state = IN_ATTRIBUTE_VALUE_DQ;
        this._sectionStart = this._index + 1;
      } else if ("'" === c) {
        this._state = IN_ATTRIBUTE_VALUE_SQ;
        this._sectionStart = this._index + 1;
      } else if (!whitespace(c)) {
        this._state = IN_ATTRIBUTE_VALUE_NQ;
        this._sectionStart = this._index;
        this._index--;
      }
    };
    Tokenizer.prototype._stateInAttributeValueDoubleQuotes = function(c) {
      if ('"' === c) {
        this._emitToken("onattribdata");
        this._cbs.onattribend();
        this._state = BEFORE_ATTRIBUTE_NAME;
      } else if (this._decodeEntities && "&" === c) {
        this._emitToken("onattribdata");
        this._baseState = this._state;
        this._state = BEFORE_ENTITY;
        this._sectionStart = this._index;
      }
    };
    Tokenizer.prototype._stateInAttributeValueSingleQuotes = function(c) {
      if ("'" === c) {
        this._emitToken("onattribdata");
        this._cbs.onattribend();
        this._state = BEFORE_ATTRIBUTE_NAME;
      } else if (this._decodeEntities && "&" === c) {
        this._emitToken("onattribdata");
        this._baseState = this._state;
        this._state = BEFORE_ENTITY;
        this._sectionStart = this._index;
      }
    };
    Tokenizer.prototype._stateInAttributeValueNoQuotes = function(c) {
      if (whitespace(c) || ">" === c) {
        this._emitToken("onattribdata");
        this._cbs.onattribend();
        this._state = BEFORE_ATTRIBUTE_NAME;
        this._index--;
      } else if (this._decodeEntities && "&" === c) {
        this._emitToken("onattribdata");
        this._baseState = this._state;
        this._state = BEFORE_ENTITY;
        this._sectionStart = this._index;
      }
    };
    Tokenizer.prototype._stateBeforeDeclaration = function(c) {
      this._state = "[" === c ? BEFORE_CDATA_1 : "-" === c ? BEFORE_COMMENT : IN_DECLARATION;
    };
    Tokenizer.prototype._stateInDeclaration = function(c) {
      if (">" === c) {
        this._cbs.ondeclaration(this._getSection());
        this._state = TEXT;
        this._sectionStart = this._index + 1;
      }
    };
    Tokenizer.prototype._stateInProcessingInstruction = function(c) {
      if (">" === c) {
        this._cbs.onprocessinginstruction(this._getSection());
        this._state = TEXT;
        this._sectionStart = this._index + 1;
      }
    };
    Tokenizer.prototype._stateBeforeComment = function(c) {
      if ("-" === c) {
        this._state = IN_COMMENT;
        this._sectionStart = this._index + 1;
      } else this._state = IN_DECLARATION;
    };
    Tokenizer.prototype._stateInComment = function(c) {
      "-" === c && (this._state = AFTER_COMMENT_1);
    };
    Tokenizer.prototype._stateAfterComment1 = function(c) {
      this._state = "-" === c ? AFTER_COMMENT_2 : IN_COMMENT;
    };
    Tokenizer.prototype._stateAfterComment2 = function(c) {
      if (">" === c) {
        this._cbs.oncomment(this._buffer.substring(this._sectionStart, this._index - 2));
        this._state = TEXT;
        this._sectionStart = this._index + 1;
      } else "-" !== c && (this._state = IN_COMMENT);
    };
    Tokenizer.prototype._stateBeforeCdata1 = ifElseState("C", BEFORE_CDATA_2, IN_DECLARATION);
    Tokenizer.prototype._stateBeforeCdata2 = ifElseState("D", BEFORE_CDATA_3, IN_DECLARATION);
    Tokenizer.prototype._stateBeforeCdata3 = ifElseState("A", BEFORE_CDATA_4, IN_DECLARATION);
    Tokenizer.prototype._stateBeforeCdata4 = ifElseState("T", BEFORE_CDATA_5, IN_DECLARATION);
    Tokenizer.prototype._stateBeforeCdata5 = ifElseState("A", BEFORE_CDATA_6, IN_DECLARATION);
    Tokenizer.prototype._stateBeforeCdata6 = function(c) {
      if ("[" === c) {
        this._state = IN_CDATA;
        this._sectionStart = this._index + 1;
      } else {
        this._state = IN_DECLARATION;
        this._index--;
      }
    };
    Tokenizer.prototype._stateInCdata = function(c) {
      "]" === c && (this._state = AFTER_CDATA_1);
    };
    Tokenizer.prototype._stateAfterCdata1 = characterState("]", AFTER_CDATA_2);
    Tokenizer.prototype._stateAfterCdata2 = function(c) {
      if (">" === c) {
        this._cbs.oncdata(this._buffer.substring(this._sectionStart, this._index - 2));
        this._state = TEXT;
        this._sectionStart = this._index + 1;
      } else "]" !== c && (this._state = IN_CDATA);
    };
    Tokenizer.prototype._stateBeforeSpecial = function(c) {
      if ("c" === c || "C" === c) this._state = BEFORE_SCRIPT_1; else if ("t" === c || "T" === c) this._state = BEFORE_STYLE_1; else {
        this._state = IN_TAG_NAME;
        this._index--;
      }
    };
    Tokenizer.prototype._stateBeforeSpecialEnd = function(c) {
      this._special !== SPECIAL_SCRIPT || "c" !== c && "C" !== c ? this._special !== SPECIAL_STYLE || "t" !== c && "T" !== c ? this._state = TEXT : this._state = AFTER_STYLE_1 : this._state = AFTER_SCRIPT_1;
    };
    Tokenizer.prototype._stateBeforeScript1 = consumeSpecialNameChar("R", BEFORE_SCRIPT_2);
    Tokenizer.prototype._stateBeforeScript2 = consumeSpecialNameChar("I", BEFORE_SCRIPT_3);
    Tokenizer.prototype._stateBeforeScript3 = consumeSpecialNameChar("P", BEFORE_SCRIPT_4);
    Tokenizer.prototype._stateBeforeScript4 = consumeSpecialNameChar("T", BEFORE_SCRIPT_5);
    Tokenizer.prototype._stateBeforeScript5 = function(c) {
      ("/" === c || ">" === c || whitespace(c)) && (this._special = SPECIAL_SCRIPT);
      this._state = IN_TAG_NAME;
      this._index--;
    };
    Tokenizer.prototype._stateAfterScript1 = ifElseState("R", AFTER_SCRIPT_2, TEXT);
    Tokenizer.prototype._stateAfterScript2 = ifElseState("I", AFTER_SCRIPT_3, TEXT);
    Tokenizer.prototype._stateAfterScript3 = ifElseState("P", AFTER_SCRIPT_4, TEXT);
    Tokenizer.prototype._stateAfterScript4 = ifElseState("T", AFTER_SCRIPT_5, TEXT);
    Tokenizer.prototype._stateAfterScript5 = function(c) {
      if (">" === c || whitespace(c)) {
        this._special = SPECIAL_NONE;
        this._state = IN_CLOSING_TAG_NAME;
        this._sectionStart = this._index - 6;
        this._index--;
      } else this._state = TEXT;
    };
    Tokenizer.prototype._stateBeforeStyle1 = consumeSpecialNameChar("Y", BEFORE_STYLE_2);
    Tokenizer.prototype._stateBeforeStyle2 = consumeSpecialNameChar("L", BEFORE_STYLE_3);
    Tokenizer.prototype._stateBeforeStyle3 = consumeSpecialNameChar("E", BEFORE_STYLE_4);
    Tokenizer.prototype._stateBeforeStyle4 = function(c) {
      ("/" === c || ">" === c || whitespace(c)) && (this._special = SPECIAL_STYLE);
      this._state = IN_TAG_NAME;
      this._index--;
    };
    Tokenizer.prototype._stateAfterStyle1 = ifElseState("Y", AFTER_STYLE_2, TEXT);
    Tokenizer.prototype._stateAfterStyle2 = ifElseState("L", AFTER_STYLE_3, TEXT);
    Tokenizer.prototype._stateAfterStyle3 = ifElseState("E", AFTER_STYLE_4, TEXT);
    Tokenizer.prototype._stateAfterStyle4 = function(c) {
      if (">" === c || whitespace(c)) {
        this._special = SPECIAL_NONE;
        this._state = IN_CLOSING_TAG_NAME;
        this._sectionStart = this._index - 5;
        this._index--;
      } else this._state = TEXT;
    };
    Tokenizer.prototype._stateBeforeEntity = ifElseState("#", BEFORE_NUMERIC_ENTITY, IN_NAMED_ENTITY);
    Tokenizer.prototype._stateBeforeNumericEntity = ifElseState("X", IN_HEX_ENTITY, IN_NUMERIC_ENTITY);
    Tokenizer.prototype._parseNamedEntityStrict = function() {
      if (this._sectionStart + 1 < this._index) {
        var entity = this._buffer.substring(this._sectionStart + 1, this._index), map = this._xmlMode ? xmlMap : entityMap;
        if (map.hasOwnProperty(entity)) {
          this._emitPartial(map[entity]);
          this._sectionStart = this._index + 1;
        }
      }
    };
    Tokenizer.prototype._parseLegacyEntity = function() {
      var start = this._sectionStart + 1, limit = this._index - start;
      limit > 6 && (limit = 6);
      while (limit >= 2) {
        var entity = this._buffer.substr(start, limit);
        if (legacyMap.hasOwnProperty(entity)) {
          this._emitPartial(legacyMap[entity]);
          this._sectionStart += limit + 1;
          return;
        }
        limit--;
      }
    };
    Tokenizer.prototype._stateInNamedEntity = function(c) {
      if (";" === c) {
        this._parseNamedEntityStrict();
        this._sectionStart + 1 < this._index && !this._xmlMode && this._parseLegacyEntity();
        this._state = this._baseState;
      } else if ((c < "a" || c > "z") && (c < "A" || c > "Z") && (c < "0" || c > "9")) {
        this._xmlMode || this._sectionStart + 1 === this._index || (this._baseState !== TEXT ? "=" !== c && this._parseNamedEntityStrict() : this._parseLegacyEntity());
        this._state = this._baseState;
        this._index--;
      }
    };
    Tokenizer.prototype._decodeNumericEntity = function(offset, base) {
      var sectionStart = this._sectionStart + offset;
      if (sectionStart !== this._index) {
        var entity = this._buffer.substring(sectionStart, this._index);
        var parsed = parseInt(entity, base);
        this._emitPartial(decodeCodePoint(parsed));
        this._sectionStart = this._index;
      } else this._sectionStart--;
      this._state = this._baseState;
    };
    Tokenizer.prototype._stateInNumericEntity = function(c) {
      if (";" === c) {
        this._decodeNumericEntity(2, 10);
        this._sectionStart++;
      } else if (c < "0" || c > "9") {
        this._xmlMode ? this._state = this._baseState : this._decodeNumericEntity(2, 10);
        this._index--;
      }
    };
    Tokenizer.prototype._stateInHexEntity = function(c) {
      if (";" === c) {
        this._decodeNumericEntity(3, 16);
        this._sectionStart++;
      } else if ((c < "a" || c > "f") && (c < "A" || c > "F") && (c < "0" || c > "9")) {
        this._xmlMode ? this._state = this._baseState : this._decodeNumericEntity(3, 16);
        this._index--;
      }
    };
    Tokenizer.prototype._cleanup = function() {
      if (this._sectionStart < 0) {
        this._buffer = "";
        this._index = 0;
        this._bufferOffset += this._index;
      } else if (this._running) {
        if (this._state === TEXT) {
          this._sectionStart !== this._index && this._cbs.ontext(this._buffer.substr(this._sectionStart));
          this._buffer = "";
          this._index = 0;
          this._bufferOffset += this._index;
        } else if (this._sectionStart === this._index) {
          this._buffer = "";
          this._index = 0;
          this._bufferOffset += this._index;
        } else {
          this._buffer = this._buffer.substr(this._sectionStart);
          this._index -= this._sectionStart;
          this._bufferOffset += this._sectionStart;
        }
        this._sectionStart = 0;
      }
    };
    Tokenizer.prototype.write = function(chunk) {
      this._ended && this._cbs.onerror(Error(".write() after done!"));
      this._buffer += chunk;
      this._parse();
    };
    Tokenizer.prototype._parse = function() {
      while (this._index < this._buffer.length && this._running) {
        var c = this._buffer.charAt(this._index);
        this._state === TEXT ? this._stateText(c) : this._state === BEFORE_TAG_NAME ? this._stateBeforeTagName(c) : this._state === IN_TAG_NAME ? this._stateInTagName(c) : this._state === BEFORE_CLOSING_TAG_NAME ? this._stateBeforeCloseingTagName(c) : this._state === IN_CLOSING_TAG_NAME ? this._stateInCloseingTagName(c) : this._state === AFTER_CLOSING_TAG_NAME ? this._stateAfterCloseingTagName(c) : this._state === IN_SELF_CLOSING_TAG ? this._stateInSelfClosingTag(c) : this._state === BEFORE_ATTRIBUTE_NAME ? this._stateBeforeAttributeName(c) : this._state === IN_ATTRIBUTE_NAME ? this._stateInAttributeName(c) : this._state === AFTER_ATTRIBUTE_NAME ? this._stateAfterAttributeName(c) : this._state === BEFORE_ATTRIBUTE_VALUE ? this._stateBeforeAttributeValue(c) : this._state === IN_ATTRIBUTE_VALUE_DQ ? this._stateInAttributeValueDoubleQuotes(c) : this._state === IN_ATTRIBUTE_VALUE_SQ ? this._stateInAttributeValueSingleQuotes(c) : this._state === IN_ATTRIBUTE_VALUE_NQ ? this._stateInAttributeValueNoQuotes(c) : this._state === BEFORE_DECLARATION ? this._stateBeforeDeclaration(c) : this._state === IN_DECLARATION ? this._stateInDeclaration(c) : this._state === IN_PROCESSING_INSTRUCTION ? this._stateInProcessingInstruction(c) : this._state === BEFORE_COMMENT ? this._stateBeforeComment(c) : this._state === IN_COMMENT ? this._stateInComment(c) : this._state === AFTER_COMMENT_1 ? this._stateAfterComment1(c) : this._state === AFTER_COMMENT_2 ? this._stateAfterComment2(c) : this._state === BEFORE_CDATA_1 ? this._stateBeforeCdata1(c) : this._state === BEFORE_CDATA_2 ? this._stateBeforeCdata2(c) : this._state === BEFORE_CDATA_3 ? this._stateBeforeCdata3(c) : this._state === BEFORE_CDATA_4 ? this._stateBeforeCdata4(c) : this._state === BEFORE_CDATA_5 ? this._stateBeforeCdata5(c) : this._state === BEFORE_CDATA_6 ? this._stateBeforeCdata6(c) : this._state === IN_CDATA ? this._stateInCdata(c) : this._state === AFTER_CDATA_1 ? this._stateAfterCdata1(c) : this._state === AFTER_CDATA_2 ? this._stateAfterCdata2(c) : this._state === BEFORE_SPECIAL ? this._stateBeforeSpecial(c) : this._state === BEFORE_SPECIAL_END ? this._stateBeforeSpecialEnd(c) : this._state === BEFORE_SCRIPT_1 ? this._stateBeforeScript1(c) : this._state === BEFORE_SCRIPT_2 ? this._stateBeforeScript2(c) : this._state === BEFORE_SCRIPT_3 ? this._stateBeforeScript3(c) : this._state === BEFORE_SCRIPT_4 ? this._stateBeforeScript4(c) : this._state === BEFORE_SCRIPT_5 ? this._stateBeforeScript5(c) : this._state === AFTER_SCRIPT_1 ? this._stateAfterScript1(c) : this._state === AFTER_SCRIPT_2 ? this._stateAfterScript2(c) : this._state === AFTER_SCRIPT_3 ? this._stateAfterScript3(c) : this._state === AFTER_SCRIPT_4 ? this._stateAfterScript4(c) : this._state === AFTER_SCRIPT_5 ? this._stateAfterScript5(c) : this._state === BEFORE_STYLE_1 ? this._stateBeforeStyle1(c) : this._state === BEFORE_STYLE_2 ? this._stateBeforeStyle2(c) : this._state === BEFORE_STYLE_3 ? this._stateBeforeStyle3(c) : this._state === BEFORE_STYLE_4 ? this._stateBeforeStyle4(c) : this._state === AFTER_STYLE_1 ? this._stateAfterStyle1(c) : this._state === AFTER_STYLE_2 ? this._stateAfterStyle2(c) : this._state === AFTER_STYLE_3 ? this._stateAfterStyle3(c) : this._state === AFTER_STYLE_4 ? this._stateAfterStyle4(c) : this._state === BEFORE_ENTITY ? this._stateBeforeEntity(c) : this._state === BEFORE_NUMERIC_ENTITY ? this._stateBeforeNumericEntity(c) : this._state === IN_NAMED_ENTITY ? this._stateInNamedEntity(c) : this._state === IN_NUMERIC_ENTITY ? this._stateInNumericEntity(c) : this._state === IN_HEX_ENTITY ? this._stateInHexEntity(c) : this._cbs.onerror(Error("unknown _state"), this._state);
        this._index++;
      }
      this._cleanup();
    };
    Tokenizer.prototype.pause = function() {
      this._running = false;
    };
    Tokenizer.prototype.resume = function() {
      this._running = true;
      this._index < this._buffer.length && this._parse();
      this._ended && this._finish();
    };
    Tokenizer.prototype.end = function(chunk) {
      this._ended && this._cbs.onerror(Error(".end() after done!"));
      chunk && this.write(chunk);
      this._ended = true;
      this._running && this._finish();
    };
    Tokenizer.prototype._finish = function() {
      this._sectionStart < this._index && this._handleTrailingData();
      this._cbs.onend();
    };
    Tokenizer.prototype._handleTrailingData = function() {
      var data = this._buffer.substr(this._sectionStart);
      if (this._state === IN_CDATA || this._state === AFTER_CDATA_1 || this._state === AFTER_CDATA_2) this._cbs.oncdata(data); else if (this._state === IN_COMMENT || this._state === AFTER_COMMENT_1 || this._state === AFTER_COMMENT_2) this._cbs.oncomment(data); else if (this._state !== IN_NAMED_ENTITY || this._xmlMode) if (this._state !== IN_NUMERIC_ENTITY || this._xmlMode) if (this._state !== IN_HEX_ENTITY || this._xmlMode) this._state !== IN_TAG_NAME && this._state !== BEFORE_ATTRIBUTE_NAME && this._state !== BEFORE_ATTRIBUTE_VALUE && this._state !== AFTER_ATTRIBUTE_NAME && this._state !== IN_ATTRIBUTE_NAME && this._state !== IN_ATTRIBUTE_VALUE_SQ && this._state !== IN_ATTRIBUTE_VALUE_DQ && this._state !== IN_ATTRIBUTE_VALUE_NQ && this._state !== IN_CLOSING_TAG_NAME && this._cbs.ontext(data); else {
        this._decodeNumericEntity(3, 16);
        if (this._sectionStart < this._index) {
          this._state = this._baseState;
          this._handleTrailingData();
        }
      } else {
        this._decodeNumericEntity(2, 10);
        if (this._sectionStart < this._index) {
          this._state = this._baseState;
          this._handleTrailingData();
        }
      } else {
        this._parseLegacyEntity();
        if (this._sectionStart < this._index) {
          this._state = this._baseState;
          this._handleTrailingData();
        }
      }
    };
    Tokenizer.prototype.reset = function() {
      Tokenizer.call(this, {
        xmlMode: this._xmlMode,
        decodeEntities: this._decodeEntities
      }, this._cbs);
    };
    Tokenizer.prototype.getAbsoluteIndex = function() {
      return this._bufferOffset + this._index;
    };
    Tokenizer.prototype._getSection = function() {
      return this._buffer.substring(this._sectionStart, this._index);
    };
    Tokenizer.prototype._emitToken = function(name) {
      this._cbs[name](this._getSection());
      this._sectionStart = -1;
    };
    Tokenizer.prototype._emitPartial = function(value) {
      this._baseState !== TEXT ? this._cbs.onattribdata(value) : this._cbs.ontext(value);
    };
  }, {
    "entities/lib/decode_codepoint.js": 89,
    "entities/maps/entities.json": 91,
    "entities/maps/legacy.json": 92,
    "entities/maps/xml.json": 93
  } ],
  79: [ function(require, module, exports) {
    module.exports = Stream;
    var Parser = require("./Parser.js"), WritableStream = require("stream").Writable || require("readable-stream").Writable;
    function Stream(cbs, options) {
      var parser = this._parser = new Parser(cbs, options);
      WritableStream.call(this, {
        decodeStrings: false
      });
      this.once("finish", function() {
        parser.end();
      });
    }
    require("util").inherits(Stream, WritableStream);
    WritableStream.prototype._write = function(chunk, encoding, cb) {
      this._parser.write(chunk);
      cb();
    };
  }, {
    "./Parser.js": 75,
    "readable-stream": 2,
    stream: 28,
    util: 32
  } ],
  80: [ function(require, module, exports) {
    var Parser = require("./Parser.js"), DomHandler = require("domhandler");
    function defineProp(name, value) {
      delete module.exports[name];
      module.exports[name] = value;
      return value;
    }
    module.exports = {
      Parser: Parser,
      Tokenizer: require("./Tokenizer.js"),
      ElementType: require("domelementtype"),
      DomHandler: DomHandler,
      get FeedHandler() {
        return defineProp("FeedHandler", require("./FeedHandler.js"));
      },
      get Stream() {
        return defineProp("Stream", require("./Stream.js"));
      },
      get WritableStream() {
        return defineProp("WritableStream", require("./WritableStream.js"));
      },
      get ProxyHandler() {
        return defineProp("ProxyHandler", require("./ProxyHandler.js"));
      },
      get DomUtils() {
        return defineProp("DomUtils", require("domutils"));
      },
      get CollectingHandler() {
        return defineProp("CollectingHandler", require("./CollectingHandler.js"));
      },
      DefaultHandler: DomHandler,
      get RssHandler() {
        return defineProp("RssHandler", this.FeedHandler);
      },
      parseDOM: function(data, options) {
        var handler = new DomHandler(options);
        new Parser(handler, options).end(data);
        return handler.dom;
      },
      parseFeed: function(feed, options) {
        var handler = new module.exports.FeedHandler(options);
        new Parser(handler, options).end(feed);
        return handler.dom;
      },
      createDomStream: function(cb, options, elementCb) {
        var handler = new DomHandler(cb, options, elementCb);
        return new Parser(handler, options);
      },
      EVENTS: {
        attribute: 2,
        cdatastart: 0,
        cdataend: 0,
        text: 1,
        processinginstruction: 2,
        comment: 1,
        commentend: 0,
        closetag: 1,
        opentag: 2,
        opentagname: 1,
        error: 1,
        end: 0
      }
    };
  }, {
    "./CollectingHandler.js": 73,
    "./FeedHandler.js": 74,
    "./Parser.js": 75,
    "./ProxyHandler.js": 76,
    "./Stream.js": 77,
    "./Tokenizer.js": 78,
    "./WritableStream.js": 79,
    domelementtype: 81,
    domhandler: 96,
    domutils: 82
  } ],
  81: [ function(require, module, exports) {
    arguments[4][59][0].apply(exports, arguments);
  }, {
    dup: 59
  } ],
  82: [ function(require, module, exports) {
    arguments[4][52][0].apply(exports, arguments);
  }, {
    "./lib/helpers": 83,
    "./lib/legacy": 84,
    "./lib/manipulation": 85,
    "./lib/querying": 86,
    "./lib/stringify": 87,
    "./lib/traversal": 88,
    dup: 52
  } ],
  83: [ function(require, module, exports) {
    arguments[4][53][0].apply(exports, arguments);
  }, {
    dup: 53
  } ],
  84: [ function(require, module, exports) {
    arguments[4][54][0].apply(exports, arguments);
  }, {
    domelementtype: 81,
    dup: 54
  } ],
  85: [ function(require, module, exports) {
    arguments[4][55][0].apply(exports, arguments);
  }, {
    dup: 55
  } ],
  86: [ function(require, module, exports) {
    arguments[4][56][0].apply(exports, arguments);
  }, {
    domelementtype: 81,
    dup: 56
  } ],
  87: [ function(require, module, exports) {
    arguments[4][57][0].apply(exports, arguments);
  }, {
    "dom-serializer": 63,
    domelementtype: 81,
    dup: 57
  } ],
  88: [ function(require, module, exports) {
    arguments[4][58][0].apply(exports, arguments);
  }, {
    dup: 58
  } ],
  89: [ function(require, module, exports) {
    arguments[4][67][0].apply(exports, arguments);
  }, {
    "../maps/decode.json": 90,
    dup: 67
  } ],
  90: [ function(require, module, exports) {
    arguments[4][69][0].apply(exports, arguments);
  }, {
    dup: 69
  } ],
  91: [ function(require, module, exports) {
    arguments[4][70][0].apply(exports, arguments);
  }, {
    dup: 70
  } ],
  92: [ function(require, module, exports) {
    arguments[4][71][0].apply(exports, arguments);
  }, {
    dup: 71
  } ],
  93: [ function(require, module, exports) {
    arguments[4][72][0].apply(exports, arguments);
  }, {
    dup: 72
  } ],
  94: [ function(require, module, exports) {
    (function(global) {
      (function() {
        var undefined;
        var VERSION = "4.17.2";
        var LARGE_ARRAY_SIZE = 200;
        var CORE_ERROR_TEXT = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", FUNC_ERROR_TEXT = "Expected a function";
        var HASH_UNDEFINED = "__lodash_hash_undefined__";
        var MAX_MEMOIZE_SIZE = 500;
        var PLACEHOLDER = "__lodash_placeholder__";
        var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
        var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
        var WRAP_BIND_FLAG = 1, WRAP_BIND_KEY_FLAG = 2, WRAP_CURRY_BOUND_FLAG = 4, WRAP_CURRY_FLAG = 8, WRAP_CURRY_RIGHT_FLAG = 16, WRAP_PARTIAL_FLAG = 32, WRAP_PARTIAL_RIGHT_FLAG = 64, WRAP_ARY_FLAG = 128, WRAP_REARG_FLAG = 256, WRAP_FLIP_FLAG = 512;
        var DEFAULT_TRUNC_LENGTH = 30, DEFAULT_TRUNC_OMISSION = "...";
        var HOT_COUNT = 800, HOT_SPAN = 16;
        var LAZY_FILTER_FLAG = 1, LAZY_MAP_FLAG = 2, LAZY_WHILE_FLAG = 3;
        var INFINITY = 1 / 0, MAX_SAFE_INTEGER = 9007199254740991, MAX_INTEGER = 17976931348623157e292, NAN = NaN;
        var MAX_ARRAY_LENGTH = 4294967295, MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1, HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
        var wrapFlags = [ [ "ary", WRAP_ARY_FLAG ], [ "bind", WRAP_BIND_FLAG ], [ "bindKey", WRAP_BIND_KEY_FLAG ], [ "curry", WRAP_CURRY_FLAG ], [ "curryRight", WRAP_CURRY_RIGHT_FLAG ], [ "flip", WRAP_FLIP_FLAG ], [ "partial", WRAP_PARTIAL_FLAG ], [ "partialRight", WRAP_PARTIAL_RIGHT_FLAG ], [ "rearg", WRAP_REARG_FLAG ] ];
        var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", domExcTag = "[object DOMException]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]", objectTag = "[object Object]", promiseTag = "[object Promise]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]", weakSetTag = "[object WeakSet]";
        var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
        var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
        var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g, reUnescapedHtml = /[&<>"']/g, reHasEscapedHtml = RegExp(reEscapedHtml.source), reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
        var reEscape = /<%-([\s\S]+?)%>/g, reEvaluate = /<%([\s\S]+?)%>/g, reInterpolate = /<%=([\s\S]+?)%>/g;
        var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/, reLeadingDot = /^\./, rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
        var reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reHasRegExpChar = RegExp(reRegExpChar.source);
        var reTrim = /^\s+|\s+$/g, reTrimStart = /^\s+/, reTrimEnd = /\s+$/;
        var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/, reSplitDetails = /,? & /;
        var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
        var reEscapeChar = /\\(\\)?/g;
        var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
        var reFlags = /\w*$/;
        var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
        var reIsBinary = /^0b[01]+$/i;
        var reIsHostCtor = /^\[object .+?Constructor\]$/;
        var reIsOctal = /^0o[0-7]+$/i;
        var reIsUint = /^(?:0|[1-9]\d*)$/;
        var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
        var reNoMatch = /($^)/;
        var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
        var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, rsDingbatRange = "\\u2700-\\u27bf", rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff", rsMathOpRange = "\\xac\\xb1\\xd7\\xf7", rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", rsPunctuationRange = "\\u2000-\\u206f", rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde", rsVarRange = "\\ufe0e\\ufe0f", rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
        var rsApos = "['\u2019]", rsAstral = "[" + rsAstralRange + "]", rsBreak = "[" + rsBreakRange + "]", rsCombo = "[" + rsComboRange + "]", rsDigits = "\\d+", rsDingbat = "[" + rsDingbatRange + "]", rsLower = "[" + rsLowerRange + "]", rsMisc = "[^" + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsUpper = "[" + rsUpperRange + "]", rsZWJ = "\\u200d";
        var rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")", rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")", rsOptContrLower = "(?:" + rsApos + "(?:d|ll|m|re|s|t|ve))?", rsOptContrUpper = "(?:" + rsApos + "(?:D|LL|M|RE|S|T|VE))?", reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [ rsNonAstral, rsRegional, rsSurrPair ].join("|") + ")" + rsOptVar + reOptMod + ")*", rsOrdLower = "\\d*(?:(?:1st|2nd|3rd|(?![123])\\dth)\\b)", rsOrdUpper = "\\d*(?:(?:1ST|2ND|3RD|(?![123])\\dTH)\\b)", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsEmoji = "(?:" + [ rsDingbat, rsRegional, rsSurrPair ].join("|") + ")" + rsSeq, rsSymbol = "(?:" + [ rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral ].join("|") + ")";
        var reApos = RegExp(rsApos, "g");
        var reComboMark = RegExp(rsCombo, "g");
        var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
        var reUnicodeWord = RegExp([ rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [ rsBreak, rsUpper, "$" ].join("|") + ")", rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [ rsBreak, rsUpper + rsMiscLower, "$" ].join("|") + ")", rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower, rsUpper + "+" + rsOptContrUpper, rsOrdUpper, rsOrdLower, rsDigits, rsEmoji ].join("|"), "g");
        var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + "]");
        var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
        var contextProps = [ "Array", "Buffer", "DataView", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Map", "Math", "Object", "Promise", "RegExp", "Set", "String", "Symbol", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap", "_", "clearTimeout", "isFinite", "parseInt", "setTimeout" ];
        var templateCounter = -1;
        var typedArrayTags = {};
        typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
        typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
        var cloneableTags = {};
        cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
        cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
        var deburredLetters = {
          "\xc0": "A",
          "\xc1": "A",
          "\xc2": "A",
          "\xc3": "A",
          "\xc4": "A",
          "\xc5": "A",
          "\xe0": "a",
          "\xe1": "a",
          "\xe2": "a",
          "\xe3": "a",
          "\xe4": "a",
          "\xe5": "a",
          "\xc7": "C",
          "\xe7": "c",
          "\xd0": "D",
          "\xf0": "d",
          "\xc8": "E",
          "\xc9": "E",
          "\xca": "E",
          "\xcb": "E",
          "\xe8": "e",
          "\xe9": "e",
          "\xea": "e",
          "\xeb": "e",
          "\xcc": "I",
          "\xcd": "I",
          "\xce": "I",
          "\xcf": "I",
          "\xec": "i",
          "\xed": "i",
          "\xee": "i",
          "\xef": "i",
          "\xd1": "N",
          "\xf1": "n",
          "\xd2": "O",
          "\xd3": "O",
          "\xd4": "O",
          "\xd5": "O",
          "\xd6": "O",
          "\xd8": "O",
          "\xf2": "o",
          "\xf3": "o",
          "\xf4": "o",
          "\xf5": "o",
          "\xf6": "o",
          "\xf8": "o",
          "\xd9": "U",
          "\xda": "U",
          "\xdb": "U",
          "\xdc": "U",
          "\xf9": "u",
          "\xfa": "u",
          "\xfb": "u",
          "\xfc": "u",
          "\xdd": "Y",
          "\xfd": "y",
          "\xff": "y",
          "\xc6": "Ae",
          "\xe6": "ae",
          "\xde": "Th",
          "\xfe": "th",
          "\xdf": "ss",
          "\u0100": "A",
          "\u0102": "A",
          "\u0104": "A",
          "\u0101": "a",
          "\u0103": "a",
          "\u0105": "a",
          "\u0106": "C",
          "\u0108": "C",
          "\u010a": "C",
          "\u010c": "C",
          "\u0107": "c",
          "\u0109": "c",
          "\u010b": "c",
          "\u010d": "c",
          "\u010e": "D",
          "\u0110": "D",
          "\u010f": "d",
          "\u0111": "d",
          "\u0112": "E",
          "\u0114": "E",
          "\u0116": "E",
          "\u0118": "E",
          "\u011a": "E",
          "\u0113": "e",
          "\u0115": "e",
          "\u0117": "e",
          "\u0119": "e",
          "\u011b": "e",
          "\u011c": "G",
          "\u011e": "G",
          "\u0120": "G",
          "\u0122": "G",
          "\u011d": "g",
          "\u011f": "g",
          "\u0121": "g",
          "\u0123": "g",
          "\u0124": "H",
          "\u0126": "H",
          "\u0125": "h",
          "\u0127": "h",
          "\u0128": "I",
          "\u012a": "I",
          "\u012c": "I",
          "\u012e": "I",
          "\u0130": "I",
          "\u0129": "i",
          "\u012b": "i",
          "\u012d": "i",
          "\u012f": "i",
          "\u0131": "i",
          "\u0134": "J",
          "\u0135": "j",
          "\u0136": "K",
          "\u0137": "k",
          "\u0138": "k",
          "\u0139": "L",
          "\u013b": "L",
          "\u013d": "L",
          "\u013f": "L",
          "\u0141": "L",
          "\u013a": "l",
          "\u013c": "l",
          "\u013e": "l",
          "\u0140": "l",
          "\u0142": "l",
          "\u0143": "N",
          "\u0145": "N",
          "\u0147": "N",
          "\u014a": "N",
          "\u0144": "n",
          "\u0146": "n",
          "\u0148": "n",
          "\u014b": "n",
          "\u014c": "O",
          "\u014e": "O",
          "\u0150": "O",
          "\u014d": "o",
          "\u014f": "o",
          "\u0151": "o",
          "\u0154": "R",
          "\u0156": "R",
          "\u0158": "R",
          "\u0155": "r",
          "\u0157": "r",
          "\u0159": "r",
          "\u015a": "S",
          "\u015c": "S",
          "\u015e": "S",
          "\u0160": "S",
          "\u015b": "s",
          "\u015d": "s",
          "\u015f": "s",
          "\u0161": "s",
          "\u0162": "T",
          "\u0164": "T",
          "\u0166": "T",
          "\u0163": "t",
          "\u0165": "t",
          "\u0167": "t",
          "\u0168": "U",
          "\u016a": "U",
          "\u016c": "U",
          "\u016e": "U",
          "\u0170": "U",
          "\u0172": "U",
          "\u0169": "u",
          "\u016b": "u",
          "\u016d": "u",
          "\u016f": "u",
          "\u0171": "u",
          "\u0173": "u",
          "\u0174": "W",
          "\u0175": "w",
          "\u0176": "Y",
          "\u0177": "y",
          "\u0178": "Y",
          "\u0179": "Z",
          "\u017b": "Z",
          "\u017d": "Z",
          "\u017a": "z",
          "\u017c": "z",
          "\u017e": "z",
          "\u0132": "IJ",
          "\u0133": "ij",
          "\u0152": "Oe",
          "\u0153": "oe",
          "\u0149": "'n",
          "\u017f": "s"
        };
        var htmlEscapes = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        };
        var htmlUnescapes = {
          "&amp;": "&",
          "&lt;": "<",
          "&gt;": ">",
          "&quot;": '"',
          "&#39;": "'"
        };
        var stringEscapes = {
          "\\": "\\",
          "'": "'",
          "\n": "n",
          "\r": "r",
          "\u2028": "u2028",
          "\u2029": "u2029"
        };
        var freeParseFloat = parseFloat, freeParseInt = parseInt;
        var freeGlobal = "object" == typeof global && global && global.Object === Object && global;
        var freeSelf = "object" == typeof self && self && self.Object === Object && self;
        var root = freeGlobal || freeSelf || Function("return this")();
        var freeExports = "object" == typeof exports && exports && !exports.nodeType && exports;
        var freeModule = freeExports && "object" == typeof module && module && !module.nodeType && module;
        var moduleExports = freeModule && freeModule.exports === freeExports;
        var freeProcess = moduleExports && freeGlobal.process;
        var nodeUtil = function() {
          try {
            return freeProcess && freeProcess.binding && freeProcess.binding("util");
          } catch (e) {}
        }();
        var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer, nodeIsDate = nodeUtil && nodeUtil.isDate, nodeIsMap = nodeUtil && nodeUtil.isMap, nodeIsRegExp = nodeUtil && nodeUtil.isRegExp, nodeIsSet = nodeUtil && nodeUtil.isSet, nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
        function addMapEntry(map, pair) {
          map.set(pair[0], pair[1]);
          return map;
        }
        function addSetEntry(set, value) {
          set.add(value);
          return set;
        }
        function apply(func, thisArg, args) {
          switch (args.length) {
           case 0:
            return func.call(thisArg);

           case 1:
            return func.call(thisArg, args[0]);

           case 2:
            return func.call(thisArg, args[0], args[1]);

           case 3:
            return func.call(thisArg, args[0], args[1], args[2]);
          }
          return func.apply(thisArg, args);
        }
        function arrayAggregator(array, setter, iteratee, accumulator) {
          var index = -1, length = null == array ? 0 : array.length;
          while (++index < length) {
            var value = array[index];
            setter(accumulator, value, iteratee(value), array);
          }
          return accumulator;
        }
        function arrayEach(array, iteratee) {
          var index = -1, length = null == array ? 0 : array.length;
          while (++index < length) if (false === iteratee(array[index], index, array)) break;
          return array;
        }
        function arrayEachRight(array, iteratee) {
          var length = null == array ? 0 : array.length;
          while (length--) if (false === iteratee(array[length], length, array)) break;
          return array;
        }
        function arrayEvery(array, predicate) {
          var index = -1, length = null == array ? 0 : array.length;
          while (++index < length) if (!predicate(array[index], index, array)) return false;
          return true;
        }
        function arrayFilter(array, predicate) {
          var index = -1, length = null == array ? 0 : array.length, resIndex = 0, result = [];
          while (++index < length) {
            var value = array[index];
            predicate(value, index, array) && (result[resIndex++] = value);
          }
          return result;
        }
        function arrayIncludes(array, value) {
          var length = null == array ? 0 : array.length;
          return !!length && baseIndexOf(array, value, 0) > -1;
        }
        function arrayIncludesWith(array, value, comparator) {
          var index = -1, length = null == array ? 0 : array.length;
          while (++index < length) if (comparator(value, array[index])) return true;
          return false;
        }
        function arrayMap(array, iteratee) {
          var index = -1, length = null == array ? 0 : array.length, result = Array(length);
          while (++index < length) result[index] = iteratee(array[index], index, array);
          return result;
        }
        function arrayPush(array, values) {
          var index = -1, length = values.length, offset = array.length;
          while (++index < length) array[offset + index] = values[index];
          return array;
        }
        function arrayReduce(array, iteratee, accumulator, initAccum) {
          var index = -1, length = null == array ? 0 : array.length;
          initAccum && length && (accumulator = array[++index]);
          while (++index < length) accumulator = iteratee(accumulator, array[index], index, array);
          return accumulator;
        }
        function arrayReduceRight(array, iteratee, accumulator, initAccum) {
          var length = null == array ? 0 : array.length;
          initAccum && length && (accumulator = array[--length]);
          while (length--) accumulator = iteratee(accumulator, array[length], length, array);
          return accumulator;
        }
        function arraySome(array, predicate) {
          var index = -1, length = null == array ? 0 : array.length;
          while (++index < length) if (predicate(array[index], index, array)) return true;
          return false;
        }
        var asciiSize = baseProperty("length");
        function asciiToArray(string) {
          return string.split("");
        }
        function asciiWords(string) {
          return string.match(reAsciiWord) || [];
        }
        function baseFindKey(collection, predicate, eachFunc) {
          var result;
          eachFunc(collection, function(value, key, collection) {
            if (predicate(value, key, collection)) {
              result = key;
              return false;
            }
          });
          return result;
        }
        function baseFindIndex(array, predicate, fromIndex, fromRight) {
          var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
          while (fromRight ? index-- : ++index < length) if (predicate(array[index], index, array)) return index;
          return -1;
        }
        function baseIndexOf(array, value, fromIndex) {
          return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
        }
        function baseIndexOfWith(array, value, fromIndex, comparator) {
          var index = fromIndex - 1, length = array.length;
          while (++index < length) if (comparator(array[index], value)) return index;
          return -1;
        }
        function baseIsNaN(value) {
          return value !== value;
        }
        function baseMean(array, iteratee) {
          var length = null == array ? 0 : array.length;
          return length ? baseSum(array, iteratee) / length : NAN;
        }
        function baseProperty(key) {
          return function(object) {
            return null == object ? undefined : object[key];
          };
        }
        function basePropertyOf(object) {
          return function(key) {
            return null == object ? undefined : object[key];
          };
        }
        function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
          eachFunc(collection, function(value, index, collection) {
            accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection);
          });
          return accumulator;
        }
        function baseSortBy(array, comparer) {
          var length = array.length;
          array.sort(comparer);
          while (length--) array[length] = array[length].value;
          return array;
        }
        function baseSum(array, iteratee) {
          var result, index = -1, length = array.length;
          while (++index < length) {
            var current = iteratee(array[index]);
            current !== undefined && (result = result === undefined ? current : result + current);
          }
          return result;
        }
        function baseTimes(n, iteratee) {
          var index = -1, result = Array(n);
          while (++index < n) result[index] = iteratee(index);
          return result;
        }
        function baseToPairs(object, props) {
          return arrayMap(props, function(key) {
            return [ key, object[key] ];
          });
        }
        function baseUnary(func) {
          return function(value) {
            return func(value);
          };
        }
        function baseValues(object, props) {
          return arrayMap(props, function(key) {
            return object[key];
          });
        }
        function cacheHas(cache, key) {
          return cache.has(key);
        }
        function charsStartIndex(strSymbols, chrSymbols) {
          var index = -1, length = strSymbols.length;
          while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) ;
          return index;
        }
        function charsEndIndex(strSymbols, chrSymbols) {
          var index = strSymbols.length;
          while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) ;
          return index;
        }
        function countHolders(array, placeholder) {
          var length = array.length, result = 0;
          while (length--) array[length] === placeholder && ++result;
          return result;
        }
        var deburrLetter = basePropertyOf(deburredLetters);
        var escapeHtmlChar = basePropertyOf(htmlEscapes);
        function escapeStringChar(chr) {
          return "\\" + stringEscapes[chr];
        }
        function getValue(object, key) {
          return null == object ? undefined : object[key];
        }
        function hasUnicode(string) {
          return reHasUnicode.test(string);
        }
        function hasUnicodeWord(string) {
          return reHasUnicodeWord.test(string);
        }
        function iteratorToArray(iterator) {
          var data, result = [];
          while (!(data = iterator.next()).done) result.push(data.value);
          return result;
        }
        function mapToArray(map) {
          var index = -1, result = Array(map.size);
          map.forEach(function(value, key) {
            result[++index] = [ key, value ];
          });
          return result;
        }
        function overArg(func, transform) {
          return function(arg) {
            return func(transform(arg));
          };
        }
        function replaceHolders(array, placeholder) {
          var index = -1, length = array.length, resIndex = 0, result = [];
          while (++index < length) {
            var value = array[index];
            if (value === placeholder || value === PLACEHOLDER) {
              array[index] = PLACEHOLDER;
              result[resIndex++] = index;
            }
          }
          return result;
        }
        function setToArray(set) {
          var index = -1, result = Array(set.size);
          set.forEach(function(value) {
            result[++index] = value;
          });
          return result;
        }
        function setToPairs(set) {
          var index = -1, result = Array(set.size);
          set.forEach(function(value) {
            result[++index] = [ value, value ];
          });
          return result;
        }
        function strictIndexOf(array, value, fromIndex) {
          var index = fromIndex - 1, length = array.length;
          while (++index < length) if (array[index] === value) return index;
          return -1;
        }
        function strictLastIndexOf(array, value, fromIndex) {
          var index = fromIndex + 1;
          while (index--) if (array[index] === value) return index;
          return index;
        }
        function stringSize(string) {
          return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
        }
        function stringToArray(string) {
          return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
        }
        var unescapeHtmlChar = basePropertyOf(htmlUnescapes);
        function unicodeSize(string) {
          var result = reUnicode.lastIndex = 0;
          while (reUnicode.test(string)) ++result;
          return result;
        }
        function unicodeToArray(string) {
          return string.match(reUnicode) || [];
        }
        function unicodeWords(string) {
          return string.match(reUnicodeWord) || [];
        }
        var runInContext = function runInContext(context) {
          context = null == context ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));
          var Array = context.Array, Date = context.Date, Error = context.Error, Function = context.Function, Math = context.Math, Object = context.Object, RegExp = context.RegExp, String = context.String, TypeError = context.TypeError;
          var arrayProto = Array.prototype, funcProto = Function.prototype, objectProto = Object.prototype;
          var coreJsData = context["__core-js_shared__"];
          var funcToString = funcProto.toString;
          var hasOwnProperty = objectProto.hasOwnProperty;
          var idCounter = 0;
          var maskSrcKey = function() {
            var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
            return uid ? "Symbol(src)_1." + uid : "";
          }();
          var nativeObjectToString = objectProto.toString;
          var objectCtorString = funcToString.call(Object);
          var oldDash = root._;
          var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
          var Buffer = moduleExports ? context.Buffer : undefined, Symbol = context.Symbol, Uint8Array = context.Uint8Array, allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined, getPrototype = overArg(Object.getPrototypeOf, Object), objectCreate = Object.create, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice, spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined, symIterator = Symbol ? Symbol.iterator : undefined, symToStringTag = Symbol ? Symbol.toStringTag : undefined;
          var defineProperty = function() {
            try {
              var func = getNative(Object, "defineProperty");
              func({}, "", {});
              return func;
            } catch (e) {}
          }();
          var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout, ctxNow = Date && Date.now !== root.Date.now && Date.now, ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;
          var nativeCeil = Math.ceil, nativeFloor = Math.floor, nativeGetSymbols = Object.getOwnPropertySymbols, nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined, nativeIsFinite = context.isFinite, nativeJoin = arrayProto.join, nativeKeys = overArg(Object.keys, Object), nativeMax = Math.max, nativeMin = Math.min, nativeNow = Date.now, nativeParseInt = context.parseInt, nativeRandom = Math.random, nativeReverse = arrayProto.reverse;
          var DataView = getNative(context, "DataView"), Map = getNative(context, "Map"), Promise = getNative(context, "Promise"), Set = getNative(context, "Set"), WeakMap = getNative(context, "WeakMap"), nativeCreate = getNative(Object, "create");
          var metaMap = WeakMap && new WeakMap();
          var realNames = {};
          var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map), promiseCtorString = toSource(Promise), setCtorString = toSource(Set), weakMapCtorString = toSource(WeakMap);
          var symbolProto = Symbol ? Symbol.prototype : undefined, symbolValueOf = symbolProto ? symbolProto.valueOf : undefined, symbolToString = symbolProto ? symbolProto.toString : undefined;
          function lodash(value) {
            if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
              if (value instanceof LodashWrapper) return value;
              if (hasOwnProperty.call(value, "__wrapped__")) return wrapperClone(value);
            }
            return new LodashWrapper(value);
          }
          var baseCreate = function() {
            function object() {}
            return function(proto) {
              if (!isObject(proto)) return {};
              if (objectCreate) return objectCreate(proto);
              object.prototype = proto;
              var result = new object();
              object.prototype = undefined;
              return result;
            };
          }();
          function baseLodash() {}
          function LodashWrapper(value, chainAll) {
            this.__wrapped__ = value;
            this.__actions__ = [];
            this.__chain__ = !!chainAll;
            this.__index__ = 0;
            this.__values__ = undefined;
          }
          lodash.templateSettings = {
            escape: reEscape,
            evaluate: reEvaluate,
            interpolate: reInterpolate,
            variable: "",
            imports: {
              _: lodash
            }
          };
          lodash.prototype = baseLodash.prototype;
          lodash.prototype.constructor = lodash;
          LodashWrapper.prototype = baseCreate(baseLodash.prototype);
          LodashWrapper.prototype.constructor = LodashWrapper;
          function LazyWrapper(value) {
            this.__wrapped__ = value;
            this.__actions__ = [];
            this.__dir__ = 1;
            this.__filtered__ = false;
            this.__iteratees__ = [];
            this.__takeCount__ = MAX_ARRAY_LENGTH;
            this.__views__ = [];
          }
          function lazyClone() {
            var result = new LazyWrapper(this.__wrapped__);
            result.__actions__ = copyArray(this.__actions__);
            result.__dir__ = this.__dir__;
            result.__filtered__ = this.__filtered__;
            result.__iteratees__ = copyArray(this.__iteratees__);
            result.__takeCount__ = this.__takeCount__;
            result.__views__ = copyArray(this.__views__);
            return result;
          }
          function lazyReverse() {
            if (this.__filtered__) {
              var result = new LazyWrapper(this);
              result.__dir__ = -1;
              result.__filtered__ = true;
            } else {
              result = this.clone();
              result.__dir__ *= -1;
            }
            return result;
          }
          function lazyValue() {
            var array = this.__wrapped__.value(), dir = this.__dir__, isArr = isArray(array), isRight = dir < 0, arrLength = isArr ? array.length : 0, view = getView(0, arrLength, this.__views__), start = view.start, end = view.end, length = end - start, index = isRight ? end : start - 1, iteratees = this.__iteratees__, iterLength = iteratees.length, resIndex = 0, takeCount = nativeMin(length, this.__takeCount__);
            if (!isArr || arrLength < LARGE_ARRAY_SIZE || arrLength == length && takeCount == length) return baseWrapperValue(array, this.__actions__);
            var result = [];
            outer: while (length-- && resIndex < takeCount) {
              index += dir;
              var iterIndex = -1, value = array[index];
              while (++iterIndex < iterLength) {
                var data = iteratees[iterIndex], iteratee = data.iteratee, type = data.type, computed = iteratee(value);
                if (type == LAZY_MAP_FLAG) value = computed; else if (!computed) {
                  if (type == LAZY_FILTER_FLAG) continue outer;
                  break outer;
                }
              }
              result[resIndex++] = value;
            }
            return result;
          }
          LazyWrapper.prototype = baseCreate(baseLodash.prototype);
          LazyWrapper.prototype.constructor = LazyWrapper;
          function Hash(entries) {
            var index = -1, length = null == entries ? 0 : entries.length;
            this.clear();
            while (++index < length) {
              var entry = entries[index];
              this.set(entry[0], entry[1]);
            }
          }
          function hashClear() {
            this.__data__ = nativeCreate ? nativeCreate(null) : {};
            this.size = 0;
          }
          function hashDelete(key) {
            var result = this.has(key) && delete this.__data__[key];
            this.size -= result ? 1 : 0;
            return result;
          }
          function hashGet(key) {
            var data = this.__data__;
            if (nativeCreate) {
              var result = data[key];
              return result === HASH_UNDEFINED ? undefined : result;
            }
            return hasOwnProperty.call(data, key) ? data[key] : undefined;
          }
          function hashHas(key) {
            var data = this.__data__;
            return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
          }
          function hashSet(key, value) {
            var data = this.__data__;
            this.size += this.has(key) ? 0 : 1;
            data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
            return this;
          }
          Hash.prototype.clear = hashClear;
          Hash.prototype["delete"] = hashDelete;
          Hash.prototype.get = hashGet;
          Hash.prototype.has = hashHas;
          Hash.prototype.set = hashSet;
          function ListCache(entries) {
            var index = -1, length = null == entries ? 0 : entries.length;
            this.clear();
            while (++index < length) {
              var entry = entries[index];
              this.set(entry[0], entry[1]);
            }
          }
          function listCacheClear() {
            this.__data__ = [];
            this.size = 0;
          }
          function listCacheDelete(key) {
            var data = this.__data__, index = assocIndexOf(data, key);
            if (index < 0) return false;
            var lastIndex = data.length - 1;
            index == lastIndex ? data.pop() : splice.call(data, index, 1);
            --this.size;
            return true;
          }
          function listCacheGet(key) {
            var data = this.__data__, index = assocIndexOf(data, key);
            return index < 0 ? undefined : data[index][1];
          }
          function listCacheHas(key) {
            return assocIndexOf(this.__data__, key) > -1;
          }
          function listCacheSet(key, value) {
            var data = this.__data__, index = assocIndexOf(data, key);
            if (index < 0) {
              ++this.size;
              data.push([ key, value ]);
            } else data[index][1] = value;
            return this;
          }
          ListCache.prototype.clear = listCacheClear;
          ListCache.prototype["delete"] = listCacheDelete;
          ListCache.prototype.get = listCacheGet;
          ListCache.prototype.has = listCacheHas;
          ListCache.prototype.set = listCacheSet;
          function MapCache(entries) {
            var index = -1, length = null == entries ? 0 : entries.length;
            this.clear();
            while (++index < length) {
              var entry = entries[index];
              this.set(entry[0], entry[1]);
            }
          }
          function mapCacheClear() {
            this.size = 0;
            this.__data__ = {
              hash: new Hash(),
              map: new (Map || ListCache)(),
              string: new Hash()
            };
          }
          function mapCacheDelete(key) {
            var result = getMapData(this, key)["delete"](key);
            this.size -= result ? 1 : 0;
            return result;
          }
          function mapCacheGet(key) {
            return getMapData(this, key).get(key);
          }
          function mapCacheHas(key) {
            return getMapData(this, key).has(key);
          }
          function mapCacheSet(key, value) {
            var data = getMapData(this, key), size = data.size;
            data.set(key, value);
            this.size += data.size == size ? 0 : 1;
            return this;
          }
          MapCache.prototype.clear = mapCacheClear;
          MapCache.prototype["delete"] = mapCacheDelete;
          MapCache.prototype.get = mapCacheGet;
          MapCache.prototype.has = mapCacheHas;
          MapCache.prototype.set = mapCacheSet;
          function SetCache(values) {
            var index = -1, length = null == values ? 0 : values.length;
            this.__data__ = new MapCache();
            while (++index < length) this.add(values[index]);
          }
          function setCacheAdd(value) {
            this.__data__.set(value, HASH_UNDEFINED);
            return this;
          }
          function setCacheHas(value) {
            return this.__data__.has(value);
          }
          SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
          SetCache.prototype.has = setCacheHas;
          function Stack(entries) {
            var data = this.__data__ = new ListCache(entries);
            this.size = data.size;
          }
          function stackClear() {
            this.__data__ = new ListCache();
            this.size = 0;
          }
          function stackDelete(key) {
            var data = this.__data__, result = data["delete"](key);
            this.size = data.size;
            return result;
          }
          function stackGet(key) {
            return this.__data__.get(key);
          }
          function stackHas(key) {
            return this.__data__.has(key);
          }
          function stackSet(key, value) {
            var data = this.__data__;
            if (data instanceof ListCache) {
              var pairs = data.__data__;
              if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
                pairs.push([ key, value ]);
                this.size = ++data.size;
                return this;
              }
              data = this.__data__ = new MapCache(pairs);
            }
            data.set(key, value);
            this.size = data.size;
            return this;
          }
          Stack.prototype.clear = stackClear;
          Stack.prototype["delete"] = stackDelete;
          Stack.prototype.get = stackGet;
          Stack.prototype.has = stackHas;
          Stack.prototype.set = stackSet;
          function arrayLikeKeys(value, inherited) {
            var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
            for (var key in value) !inherited && !hasOwnProperty.call(value, key) || skipIndexes && ("length" == key || isBuff && ("offset" == key || "parent" == key) || isType && ("buffer" == key || "byteLength" == key || "byteOffset" == key) || isIndex(key, length)) || result.push(key);
            return result;
          }
          function arraySample(array) {
            var length = array.length;
            return length ? array[baseRandom(0, length - 1)] : undefined;
          }
          function arraySampleSize(array, n) {
            return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
          }
          function arrayShuffle(array) {
            return shuffleSelf(copyArray(array));
          }
          function assignInDefaults(objValue, srcValue, key, object) {
            if (objValue === undefined || eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key)) return srcValue;
            return objValue;
          }
          function assignMergeValue(object, key, value) {
            (value === undefined || eq(object[key], value)) && (value !== undefined || key in object) || baseAssignValue(object, key, value);
          }
          function assignValue(object, key, value) {
            var objValue = object[key];
            hasOwnProperty.call(object, key) && eq(objValue, value) && (value !== undefined || key in object) || baseAssignValue(object, key, value);
          }
          function assocIndexOf(array, key) {
            var length = array.length;
            while (length--) if (eq(array[length][0], key)) return length;
            return -1;
          }
          function baseAggregator(collection, setter, iteratee, accumulator) {
            baseEach(collection, function(value, key, collection) {
              setter(accumulator, value, iteratee(value), collection);
            });
            return accumulator;
          }
          function baseAssign(object, source) {
            return object && copyObject(source, keys(source), object);
          }
          function baseAssignIn(object, source) {
            return object && copyObject(source, keysIn(source), object);
          }
          function baseAssignValue(object, key, value) {
            "__proto__" == key && defineProperty ? defineProperty(object, key, {
              configurable: true,
              enumerable: true,
              value: value,
              writable: true
            }) : object[key] = value;
          }
          function baseAt(object, paths) {
            var index = -1, length = paths.length, result = Array(length), skip = null == object;
            while (++index < length) result[index] = skip ? undefined : get(object, paths[index]);
            return result;
          }
          function baseClamp(number, lower, upper) {
            if (number === number) {
              upper !== undefined && (number = number <= upper ? number : upper);
              lower !== undefined && (number = number >= lower ? number : lower);
            }
            return number;
          }
          function baseClone(value, bitmask, customizer, key, object, stack) {
            var result, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
            customizer && (result = object ? customizer(value, key, object, stack) : customizer(value));
            if (result !== undefined) return result;
            if (!isObject(value)) return value;
            var isArr = isArray(value);
            if (isArr) {
              result = initCloneArray(value);
              if (!isDeep) return copyArray(value, result);
            } else {
              var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
              if (isBuffer(value)) return cloneBuffer(value, isDeep);
              if (tag == objectTag || tag == argsTag || isFunc && !object) {
                result = isFlat || isFunc ? {} : initCloneObject(value);
                if (!isDeep) return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
              } else {
                if (!cloneableTags[tag]) return object ? value : {};
                result = initCloneByTag(value, tag, baseClone, isDeep);
              }
            }
            stack || (stack = new Stack());
            var stacked = stack.get(value);
            if (stacked) return stacked;
            stack.set(value, result);
            var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
            var props = isArr ? undefined : keysFunc(value);
            arrayEach(props || value, function(subValue, key) {
              if (props) {
                key = subValue;
                subValue = value[key];
              }
              assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
            });
            return result;
          }
          function baseConforms(source) {
            var props = keys(source);
            return function(object) {
              return baseConformsTo(object, source, props);
            };
          }
          function baseConformsTo(object, source, props) {
            var length = props.length;
            if (null == object) return !length;
            object = Object(object);
            while (length--) {
              var key = props[length], predicate = source[key], value = object[key];
              if (value === undefined && !(key in object) || !predicate(value)) return false;
            }
            return true;
          }
          function baseDelay(func, wait, args) {
            if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
            return setTimeout(function() {
              func.apply(undefined, args);
            }, wait);
          }
          function baseDifference(array, values, iteratee, comparator) {
            var index = -1, includes = arrayIncludes, isCommon = true, length = array.length, result = [], valuesLength = values.length;
            if (!length) return result;
            iteratee && (values = arrayMap(values, baseUnary(iteratee)));
            if (comparator) {
              includes = arrayIncludesWith;
              isCommon = false;
            } else if (values.length >= LARGE_ARRAY_SIZE) {
              includes = cacheHas;
              isCommon = false;
              values = new SetCache(values);
            }
            outer: while (++index < length) {
              var value = array[index], computed = null == iteratee ? value : iteratee(value);
              value = comparator || 0 !== value ? value : 0;
              if (isCommon && computed === computed) {
                var valuesIndex = valuesLength;
                while (valuesIndex--) if (values[valuesIndex] === computed) continue outer;
                result.push(value);
              } else includes(values, computed, comparator) || result.push(value);
            }
            return result;
          }
          var baseEach = createBaseEach(baseForOwn);
          var baseEachRight = createBaseEach(baseForOwnRight, true);
          function baseEvery(collection, predicate) {
            var result = true;
            baseEach(collection, function(value, index, collection) {
              result = !!predicate(value, index, collection);
              return result;
            });
            return result;
          }
          function baseExtremum(array, iteratee, comparator) {
            var index = -1, length = array.length;
            while (++index < length) {
              var value = array[index], current = iteratee(value);
              if (null != current && (computed === undefined ? current === current && !isSymbol(current) : comparator(current, computed))) var computed = current, result = value;
            }
            return result;
          }
          function baseFill(array, value, start, end) {
            var length = array.length;
            start = toInteger(start);
            start < 0 && (start = -start > length ? 0 : length + start);
            end = end === undefined || end > length ? length : toInteger(end);
            end < 0 && (end += length);
            end = start > end ? 0 : toLength(end);
            while (start < end) array[start++] = value;
            return array;
          }
          function baseFilter(collection, predicate) {
            var result = [];
            baseEach(collection, function(value, index, collection) {
              predicate(value, index, collection) && result.push(value);
            });
            return result;
          }
          function baseFlatten(array, depth, predicate, isStrict, result) {
            var index = -1, length = array.length;
            predicate || (predicate = isFlattenable);
            result || (result = []);
            while (++index < length) {
              var value = array[index];
              depth > 0 && predicate(value) ? depth > 1 ? baseFlatten(value, depth - 1, predicate, isStrict, result) : arrayPush(result, value) : isStrict || (result[result.length] = value);
            }
            return result;
          }
          var baseFor = createBaseFor();
          var baseForRight = createBaseFor(true);
          function baseForOwn(object, iteratee) {
            return object && baseFor(object, iteratee, keys);
          }
          function baseForOwnRight(object, iteratee) {
            return object && baseForRight(object, iteratee, keys);
          }
          function baseFunctions(object, props) {
            return arrayFilter(props, function(key) {
              return isFunction(object[key]);
            });
          }
          function baseGet(object, path) {
            path = castPath(path, object);
            var index = 0, length = path.length;
            while (null != object && index < length) object = object[toKey(path[index++])];
            return index && index == length ? object : undefined;
          }
          function baseGetAllKeys(object, keysFunc, symbolsFunc) {
            var result = keysFunc(object);
            return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
          }
          function baseGetTag(value) {
            if (null == value) return value === undefined ? undefinedTag : nullTag;
            value = Object(value);
            return symToStringTag && symToStringTag in value ? getRawTag(value) : objectToString(value);
          }
          function baseGt(value, other) {
            return value > other;
          }
          function baseHas(object, key) {
            return null != object && hasOwnProperty.call(object, key);
          }
          function baseHasIn(object, key) {
            return null != object && key in Object(object);
          }
          function baseInRange(number, start, end) {
            return number >= nativeMin(start, end) && number < nativeMax(start, end);
          }
          function baseIntersection(arrays, iteratee, comparator) {
            var includes = comparator ? arrayIncludesWith : arrayIncludes, length = arrays[0].length, othLength = arrays.length, othIndex = othLength, caches = Array(othLength), maxLength = Infinity, result = [];
            while (othIndex--) {
              var array = arrays[othIndex];
              othIndex && iteratee && (array = arrayMap(array, baseUnary(iteratee)));
              maxLength = nativeMin(array.length, maxLength);
              caches[othIndex] = !comparator && (iteratee || length >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : undefined;
            }
            array = arrays[0];
            var index = -1, seen = caches[0];
            outer: while (++index < length && result.length < maxLength) {
              var value = array[index], computed = iteratee ? iteratee(value) : value;
              value = comparator || 0 !== value ? value : 0;
              if (!(seen ? cacheHas(seen, computed) : includes(result, computed, comparator))) {
                othIndex = othLength;
                while (--othIndex) {
                  var cache = caches[othIndex];
                  if (!(cache ? cacheHas(cache, computed) : includes(arrays[othIndex], computed, comparator))) continue outer;
                }
                seen && seen.push(computed);
                result.push(value);
              }
            }
            return result;
          }
          function baseInverter(object, setter, iteratee, accumulator) {
            baseForOwn(object, function(value, key, object) {
              setter(accumulator, iteratee(value), key, object);
            });
            return accumulator;
          }
          function baseInvoke(object, path, args) {
            path = castPath(path, object);
            object = parent(object, path);
            var func = null == object ? object : object[toKey(last(path))];
            return null == func ? undefined : apply(func, object, args);
          }
          function baseIsArguments(value) {
            return isObjectLike(value) && baseGetTag(value) == argsTag;
          }
          function baseIsArrayBuffer(value) {
            return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
          }
          function baseIsDate(value) {
            return isObjectLike(value) && baseGetTag(value) == dateTag;
          }
          function baseIsEqual(value, other, bitmask, customizer, stack) {
            if (value === other) return true;
            if (null == value || null == other || !isObject(value) && !isObjectLike(other)) return value !== value && other !== other;
            return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
          }
          function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
            var objIsArr = isArray(object), othIsArr = isArray(other), objTag = arrayTag, othTag = arrayTag;
            if (!objIsArr) {
              objTag = getTag(object);
              objTag = objTag == argsTag ? objectTag : objTag;
            }
            if (!othIsArr) {
              othTag = getTag(other);
              othTag = othTag == argsTag ? objectTag : othTag;
            }
            var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
            if (isSameTag && isBuffer(object)) {
              if (!isBuffer(other)) return false;
              objIsArr = true;
              objIsObj = false;
            }
            if (isSameTag && !objIsObj) {
              stack || (stack = new Stack());
              return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
            }
            if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
              var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
              if (objIsWrapped || othIsWrapped) {
                var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
                stack || (stack = new Stack());
                return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
              }
            }
            if (!isSameTag) return false;
            stack || (stack = new Stack());
            return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
          }
          function baseIsMap(value) {
            return isObjectLike(value) && getTag(value) == mapTag;
          }
          function baseIsMatch(object, source, matchData, customizer) {
            var index = matchData.length, length = index, noCustomizer = !customizer;
            if (null == object) return !length;
            object = Object(object);
            while (index--) {
              var data = matchData[index];
              if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) return false;
            }
            while (++index < length) {
              data = matchData[index];
              var key = data[0], objValue = object[key], srcValue = data[1];
              if (noCustomizer && data[2]) {
                if (objValue === undefined && !(key in object)) return false;
              } else {
                var stack = new Stack();
                if (customizer) var result = customizer(objValue, srcValue, key, object, source, stack);
                if (!(result === undefined ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result)) return false;
              }
            }
            return true;
          }
          function baseIsNative(value) {
            if (!isObject(value) || isMasked(value)) return false;
            var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
            return pattern.test(toSource(value));
          }
          function baseIsRegExp(value) {
            return isObjectLike(value) && baseGetTag(value) == regexpTag;
          }
          function baseIsSet(value) {
            return isObjectLike(value) && getTag(value) == setTag;
          }
          function baseIsTypedArray(value) {
            return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
          }
          function baseIteratee(value) {
            if ("function" == typeof value) return value;
            if (null == value) return identity;
            if ("object" == typeof value) return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
            return property(value);
          }
          function baseKeys(object) {
            if (!isPrototype(object)) return nativeKeys(object);
            var result = [];
            for (var key in Object(object)) hasOwnProperty.call(object, key) && "constructor" != key && result.push(key);
            return result;
          }
          function baseKeysIn(object) {
            if (!isObject(object)) return nativeKeysIn(object);
            var isProto = isPrototype(object), result = [];
            for (var key in object) "constructor" == key && (isProto || !hasOwnProperty.call(object, key)) || result.push(key);
            return result;
          }
          function baseLt(value, other) {
            return value < other;
          }
          function baseMap(collection, iteratee) {
            var index = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
            baseEach(collection, function(value, key, collection) {
              result[++index] = iteratee(value, key, collection);
            });
            return result;
          }
          function baseMatches(source) {
            var matchData = getMatchData(source);
            if (1 == matchData.length && matchData[0][2]) return matchesStrictComparable(matchData[0][0], matchData[0][1]);
            return function(object) {
              return object === source || baseIsMatch(object, source, matchData);
            };
          }
          function baseMatchesProperty(path, srcValue) {
            if (isKey(path) && isStrictComparable(srcValue)) return matchesStrictComparable(toKey(path), srcValue);
            return function(object) {
              var objValue = get(object, path);
              return objValue === undefined && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
            };
          }
          function baseMerge(object, source, srcIndex, customizer, stack) {
            if (object === source) return;
            baseFor(source, function(srcValue, key) {
              if (isObject(srcValue)) {
                stack || (stack = new Stack());
                baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
              } else {
                var newValue = customizer ? customizer(object[key], srcValue, key + "", object, source, stack) : undefined;
                newValue === undefined && (newValue = srcValue);
                assignMergeValue(object, key, newValue);
              }
            }, keysIn);
          }
          function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
            var objValue = object[key], srcValue = source[key], stacked = stack.get(srcValue);
            if (stacked) {
              assignMergeValue(object, key, stacked);
              return;
            }
            var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : undefined;
            var isCommon = newValue === undefined;
            if (isCommon) {
              var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
              newValue = srcValue;
              if (isArr || isBuff || isTyped) if (isArray(objValue)) newValue = objValue; else if (isArrayLikeObject(objValue)) newValue = copyArray(objValue); else if (isBuff) {
                isCommon = false;
                newValue = cloneBuffer(srcValue, true);
              } else if (isTyped) {
                isCommon = false;
                newValue = cloneTypedArray(srcValue, true);
              } else newValue = []; else if (isPlainObject(srcValue) || isArguments(srcValue)) {
                newValue = objValue;
                isArguments(objValue) ? newValue = toPlainObject(objValue) : (!isObject(objValue) || srcIndex && isFunction(objValue)) && (newValue = initCloneObject(srcValue));
              } else isCommon = false;
            }
            if (isCommon) {
              stack.set(srcValue, newValue);
              mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
              stack["delete"](srcValue);
            }
            assignMergeValue(object, key, newValue);
          }
          function baseNth(array, n) {
            var length = array.length;
            if (!length) return;
            n += n < 0 ? length : 0;
            return isIndex(n, length) ? array[n] : undefined;
          }
          function baseOrderBy(collection, iteratees, orders) {
            var index = -1;
            iteratees = arrayMap(iteratees.length ? iteratees : [ identity ], baseUnary(getIteratee()));
            var result = baseMap(collection, function(value, key, collection) {
              var criteria = arrayMap(iteratees, function(iteratee) {
                return iteratee(value);
              });
              return {
                criteria: criteria,
                index: ++index,
                value: value
              };
            });
            return baseSortBy(result, function(object, other) {
              return compareMultiple(object, other, orders);
            });
          }
          function basePick(object, paths) {
            object = Object(object);
            return basePickBy(object, paths, function(value, path) {
              return hasIn(object, path);
            });
          }
          function basePickBy(object, paths, predicate) {
            var index = -1, length = paths.length, result = {};
            while (++index < length) {
              var path = paths[index], value = baseGet(object, path);
              predicate(value, path) && baseSet(result, castPath(path, object), value);
            }
            return result;
          }
          function basePropertyDeep(path) {
            return function(object) {
              return baseGet(object, path);
            };
          }
          function basePullAll(array, values, iteratee, comparator) {
            var indexOf = comparator ? baseIndexOfWith : baseIndexOf, index = -1, length = values.length, seen = array;
            array === values && (values = copyArray(values));
            iteratee && (seen = arrayMap(array, baseUnary(iteratee)));
            while (++index < length) {
              var fromIndex = 0, value = values[index], computed = iteratee ? iteratee(value) : value;
              while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
                seen !== array && splice.call(seen, fromIndex, 1);
                splice.call(array, fromIndex, 1);
              }
            }
            return array;
          }
          function basePullAt(array, indexes) {
            var length = array ? indexes.length : 0, lastIndex = length - 1;
            while (length--) {
              var index = indexes[length];
              if (length == lastIndex || index !== previous) {
                var previous = index;
                isIndex(index) ? splice.call(array, index, 1) : baseUnset(array, index);
              }
            }
            return array;
          }
          function baseRandom(lower, upper) {
            return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
          }
          function baseRange(start, end, step, fromRight) {
            var index = -1, length = nativeMax(nativeCeil((end - start) / (step || 1)), 0), result = Array(length);
            while (length--) {
              result[fromRight ? length : ++index] = start;
              start += step;
            }
            return result;
          }
          function baseRepeat(string, n) {
            var result = "";
            if (!string || n < 1 || n > MAX_SAFE_INTEGER) return result;
            do {
              n % 2 && (result += string);
              n = nativeFloor(n / 2);
              n && (string += string);
            } while (n);
            return result;
          }
          function baseRest(func, start) {
            return setToString(overRest(func, start, identity), func + "");
          }
          function baseSample(collection) {
            return arraySample(values(collection));
          }
          function baseSampleSize(collection, n) {
            var array = values(collection);
            return shuffleSelf(array, baseClamp(n, 0, array.length));
          }
          function baseSet(object, path, value, customizer) {
            if (!isObject(object)) return object;
            path = castPath(path, object);
            var index = -1, length = path.length, lastIndex = length - 1, nested = object;
            while (null != nested && ++index < length) {
              var key = toKey(path[index]), newValue = value;
              if (index != lastIndex) {
                var objValue = nested[key];
                newValue = customizer ? customizer(objValue, key, nested) : undefined;
                newValue === undefined && (newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {});
              }
              assignValue(nested, key, newValue);
              nested = nested[key];
            }
            return object;
          }
          var baseSetData = metaMap ? function(func, data) {
            metaMap.set(func, data);
            return func;
          } : identity;
          var baseSetToString = defineProperty ? function(func, string) {
            return defineProperty(func, "toString", {
              configurable: true,
              enumerable: false,
              value: constant(string),
              writable: true
            });
          } : identity;
          function baseShuffle(collection) {
            return shuffleSelf(values(collection));
          }
          function baseSlice(array, start, end) {
            var index = -1, length = array.length;
            start < 0 && (start = -start > length ? 0 : length + start);
            end = end > length ? length : end;
            end < 0 && (end += length);
            length = start > end ? 0 : end - start >>> 0;
            start >>>= 0;
            var result = Array(length);
            while (++index < length) result[index] = array[index + start];
            return result;
          }
          function baseSome(collection, predicate) {
            var result;
            baseEach(collection, function(value, index, collection) {
              result = predicate(value, index, collection);
              return !result;
            });
            return !!result;
          }
          function baseSortedIndex(array, value, retHighest) {
            var low = 0, high = null == array ? low : array.length;
            if ("number" == typeof value && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
              while (low < high) {
                var mid = low + high >>> 1, computed = array[mid];
                null !== computed && !isSymbol(computed) && (retHighest ? computed <= value : computed < value) ? low = mid + 1 : high = mid;
              }
              return high;
            }
            return baseSortedIndexBy(array, value, identity, retHighest);
          }
          function baseSortedIndexBy(array, value, iteratee, retHighest) {
            value = iteratee(value);
            var low = 0, high = null == array ? 0 : array.length, valIsNaN = value !== value, valIsNull = null === value, valIsSymbol = isSymbol(value), valIsUndefined = value === undefined;
            while (low < high) {
              var mid = nativeFloor((low + high) / 2), computed = iteratee(array[mid]), othIsDefined = computed !== undefined, othIsNull = null === computed, othIsReflexive = computed === computed, othIsSymbol = isSymbol(computed);
              if (valIsNaN) var setLow = retHighest || othIsReflexive; else setLow = valIsUndefined ? othIsReflexive && (retHighest || othIsDefined) : valIsNull ? othIsReflexive && othIsDefined && (retHighest || !othIsNull) : valIsSymbol ? othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol) : !othIsNull && !othIsSymbol && (retHighest ? computed <= value : computed < value);
              setLow ? low = mid + 1 : high = mid;
            }
            return nativeMin(high, MAX_ARRAY_INDEX);
          }
          function baseSortedUniq(array, iteratee) {
            var index = -1, length = array.length, resIndex = 0, result = [];
            while (++index < length) {
              var value = array[index], computed = iteratee ? iteratee(value) : value;
              if (!index || !eq(computed, seen)) {
                var seen = computed;
                result[resIndex++] = 0 === value ? 0 : value;
              }
            }
            return result;
          }
          function baseToNumber(value) {
            if ("number" == typeof value) return value;
            if (isSymbol(value)) return NAN;
            return +value;
          }
          function baseToString(value) {
            if ("string" == typeof value) return value;
            if (isArray(value)) return arrayMap(value, baseToString) + "";
            if (isSymbol(value)) return symbolToString ? symbolToString.call(value) : "";
            var result = value + "";
            return "0" == result && 1 / value == -INFINITY ? "-0" : result;
          }
          function baseUniq(array, iteratee, comparator) {
            var index = -1, includes = arrayIncludes, length = array.length, isCommon = true, result = [], seen = result;
            if (comparator) {
              isCommon = false;
              includes = arrayIncludesWith;
            } else if (length >= LARGE_ARRAY_SIZE) {
              var set = iteratee ? null : createSet(array);
              if (set) return setToArray(set);
              isCommon = false;
              includes = cacheHas;
              seen = new SetCache();
            } else seen = iteratee ? [] : result;
            outer: while (++index < length) {
              var value = array[index], computed = iteratee ? iteratee(value) : value;
              value = comparator || 0 !== value ? value : 0;
              if (isCommon && computed === computed) {
                var seenIndex = seen.length;
                while (seenIndex--) if (seen[seenIndex] === computed) continue outer;
                iteratee && seen.push(computed);
                result.push(value);
              } else if (!includes(seen, computed, comparator)) {
                seen !== result && seen.push(computed);
                result.push(value);
              }
            }
            return result;
          }
          function baseUnset(object, path) {
            path = castPath(path, object);
            object = parent(object, path);
            return null == object || delete object[toKey(last(path))];
          }
          function baseUpdate(object, path, updater, customizer) {
            return baseSet(object, path, updater(baseGet(object, path)), customizer);
          }
          function baseWhile(array, predicate, isDrop, fromRight) {
            var length = array.length, index = fromRight ? length : -1;
            while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) ;
            return isDrop ? baseSlice(array, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array, fromRight ? index + 1 : 0, fromRight ? length : index);
          }
          function baseWrapperValue(value, actions) {
            var result = value;
            result instanceof LazyWrapper && (result = result.value());
            return arrayReduce(actions, function(result, action) {
              return action.func.apply(action.thisArg, arrayPush([ result ], action.args));
            }, result);
          }
          function baseXor(arrays, iteratee, comparator) {
            var length = arrays.length;
            if (length < 2) return length ? baseUniq(arrays[0]) : [];
            var index = -1, result = Array(length);
            while (++index < length) {
              var array = arrays[index], othIndex = -1;
              while (++othIndex < length) othIndex != index && (result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator));
            }
            return baseUniq(baseFlatten(result, 1), iteratee, comparator);
          }
          function baseZipObject(props, values, assignFunc) {
            var index = -1, length = props.length, valsLength = values.length, result = {};
            while (++index < length) {
              var value = index < valsLength ? values[index] : undefined;
              assignFunc(result, props[index], value);
            }
            return result;
          }
          function castArrayLikeObject(value) {
            return isArrayLikeObject(value) ? value : [];
          }
          function castFunction(value) {
            return "function" == typeof value ? value : identity;
          }
          function castPath(value, object) {
            if (isArray(value)) return value;
            return isKey(value, object) ? [ value ] : stringToPath(toString(value));
          }
          var castRest = baseRest;
          function castSlice(array, start, end) {
            var length = array.length;
            end = end === undefined ? length : end;
            return !start && end >= length ? array : baseSlice(array, start, end);
          }
          var clearTimeout = ctxClearTimeout || function(id) {
            return root.clearTimeout(id);
          };
          function cloneBuffer(buffer, isDeep) {
            if (isDeep) return buffer.slice();
            var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
            buffer.copy(result);
            return result;
          }
          function cloneArrayBuffer(arrayBuffer) {
            var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
            new Uint8Array(result).set(new Uint8Array(arrayBuffer));
            return result;
          }
          function cloneDataView(dataView, isDeep) {
            var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
            return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
          }
          function cloneMap(map, isDeep, cloneFunc) {
            var array = isDeep ? cloneFunc(mapToArray(map), CLONE_DEEP_FLAG) : mapToArray(map);
            return arrayReduce(array, addMapEntry, new map.constructor());
          }
          function cloneRegExp(regexp) {
            var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
            result.lastIndex = regexp.lastIndex;
            return result;
          }
          function cloneSet(set, isDeep, cloneFunc) {
            var array = isDeep ? cloneFunc(setToArray(set), CLONE_DEEP_FLAG) : setToArray(set);
            return arrayReduce(array, addSetEntry, new set.constructor());
          }
          function cloneSymbol(symbol) {
            return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
          }
          function cloneTypedArray(typedArray, isDeep) {
            var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
            return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
          }
          function compareAscending(value, other) {
            if (value !== other) {
              var valIsDefined = value !== undefined, valIsNull = null === value, valIsReflexive = value === value, valIsSymbol = isSymbol(value);
              var othIsDefined = other !== undefined, othIsNull = null === other, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
              if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) return 1;
              if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) return -1;
            }
            return 0;
          }
          function compareMultiple(object, other, orders) {
            var index = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
            while (++index < length) {
              var result = compareAscending(objCriteria[index], othCriteria[index]);
              if (result) {
                if (index >= ordersLength) return result;
                var order = orders[index];
                return result * ("desc" == order ? -1 : 1);
              }
            }
            return object.index - other.index;
          }
          function composeArgs(args, partials, holders, isCurried) {
            var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result = Array(leftLength + rangeLength), isUncurried = !isCurried;
            while (++leftIndex < leftLength) result[leftIndex] = partials[leftIndex];
            while (++argsIndex < holdersLength) (isUncurried || argsIndex < argsLength) && (result[holders[argsIndex]] = args[argsIndex]);
            while (rangeLength--) result[leftIndex++] = args[argsIndex++];
            return result;
          }
          function composeArgsRight(args, partials, holders, isCurried) {
            var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result = Array(rangeLength + rightLength), isUncurried = !isCurried;
            while (++argsIndex < rangeLength) result[argsIndex] = args[argsIndex];
            var offset = argsIndex;
            while (++rightIndex < rightLength) result[offset + rightIndex] = partials[rightIndex];
            while (++holdersIndex < holdersLength) (isUncurried || argsIndex < argsLength) && (result[offset + holders[holdersIndex]] = args[argsIndex++]);
            return result;
          }
          function copyArray(source, array) {
            var index = -1, length = source.length;
            array || (array = Array(length));
            while (++index < length) array[index] = source[index];
            return array;
          }
          function copyObject(source, props, object, customizer) {
            var isNew = !object;
            object || (object = {});
            var index = -1, length = props.length;
            while (++index < length) {
              var key = props[index];
              var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;
              newValue === undefined && (newValue = source[key]);
              isNew ? baseAssignValue(object, key, newValue) : assignValue(object, key, newValue);
            }
            return object;
          }
          function copySymbols(source, object) {
            return copyObject(source, getSymbols(source), object);
          }
          function copySymbolsIn(source, object) {
            return copyObject(source, getSymbolsIn(source), object);
          }
          function createAggregator(setter, initializer) {
            return function(collection, iteratee) {
              var func = isArray(collection) ? arrayAggregator : baseAggregator, accumulator = initializer ? initializer() : {};
              return func(collection, setter, getIteratee(iteratee, 2), accumulator);
            };
          }
          function createAssigner(assigner) {
            return baseRest(function(object, sources) {
              var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : undefined, guard = length > 2 ? sources[2] : undefined;
              customizer = assigner.length > 3 && "function" == typeof customizer ? (length--, 
              customizer) : undefined;
              if (guard && isIterateeCall(sources[0], sources[1], guard)) {
                customizer = length < 3 ? undefined : customizer;
                length = 1;
              }
              object = Object(object);
              while (++index < length) {
                var source = sources[index];
                source && assigner(object, source, index, customizer);
              }
              return object;
            });
          }
          function createBaseEach(eachFunc, fromRight) {
            return function(collection, iteratee) {
              if (null == collection) return collection;
              if (!isArrayLike(collection)) return eachFunc(collection, iteratee);
              var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
              while (fromRight ? index-- : ++index < length) if (false === iteratee(iterable[index], index, iterable)) break;
              return collection;
            };
          }
          function createBaseFor(fromRight) {
            return function(object, iteratee, keysFunc) {
              var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
              while (length--) {
                var key = props[fromRight ? length : ++index];
                if (false === iteratee(iterable[key], key, iterable)) break;
              }
              return object;
            };
          }
          function createBind(func, bitmask, thisArg) {
            var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
            function wrapper() {
              var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
              return fn.apply(isBind ? thisArg : this, arguments);
            }
            return wrapper;
          }
          function createCaseFirst(methodName) {
            return function(string) {
              string = toString(string);
              var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined;
              var chr = strSymbols ? strSymbols[0] : string.charAt(0);
              var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
              return chr[methodName]() + trailing;
            };
          }
          function createCompounder(callback) {
            return function(string) {
              return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
            };
          }
          function createCtor(Ctor) {
            return function() {
              var args = arguments;
              switch (args.length) {
               case 0:
                return new Ctor();

               case 1:
                return new Ctor(args[0]);

               case 2:
                return new Ctor(args[0], args[1]);

               case 3:
                return new Ctor(args[0], args[1], args[2]);

               case 4:
                return new Ctor(args[0], args[1], args[2], args[3]);

               case 5:
                return new Ctor(args[0], args[1], args[2], args[3], args[4]);

               case 6:
                return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);

               case 7:
                return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
              }
              var thisBinding = baseCreate(Ctor.prototype), result = Ctor.apply(thisBinding, args);
              return isObject(result) ? result : thisBinding;
            };
          }
          function createCurry(func, bitmask, arity) {
            var Ctor = createCtor(func);
            function wrapper() {
              var length = arguments.length, args = Array(length), index = length, placeholder = getHolder(wrapper);
              while (index--) args[index] = arguments[index];
              var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
              length -= holders.length;
              if (length < arity) return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, undefined, args, holders, undefined, undefined, arity - length);
              var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
              return apply(fn, this, args);
            }
            return wrapper;
          }
          function createFind(findIndexFunc) {
            return function(collection, predicate, fromIndex) {
              var iterable = Object(collection);
              if (!isArrayLike(collection)) {
                var iteratee = getIteratee(predicate, 3);
                collection = keys(collection);
                predicate = function(key) {
                  return iteratee(iterable[key], key, iterable);
                };
              }
              var index = findIndexFunc(collection, predicate, fromIndex);
              return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
            };
          }
          function createFlow(fromRight) {
            return flatRest(function(funcs) {
              var length = funcs.length, index = length, prereq = LodashWrapper.prototype.thru;
              fromRight && funcs.reverse();
              while (index--) {
                var func = funcs[index];
                if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
                if (prereq && !wrapper && "wrapper" == getFuncName(func)) var wrapper = new LodashWrapper([], true);
              }
              index = wrapper ? index : length;
              while (++index < length) {
                func = funcs[index];
                var funcName = getFuncName(func), data = "wrapper" == funcName ? getData(func) : undefined;
                wrapper = data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) && !data[4].length && 1 == data[9] ? wrapper[getFuncName(data[0])].apply(wrapper, data[3]) : 1 == func.length && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
              }
              return function() {
                var args = arguments, value = args[0];
                if (wrapper && 1 == args.length && isArray(value) && value.length >= LARGE_ARRAY_SIZE) return wrapper.plant(value).value();
                var index = 0, result = length ? funcs[index].apply(this, args) : value;
                while (++index < length) result = funcs[index].call(this, result);
                return result;
              };
            });
          }
          function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
            var isAry = bitmask & WRAP_ARY_FLAG, isBind = bitmask & WRAP_BIND_FLAG, isBindKey = bitmask & WRAP_BIND_KEY_FLAG, isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG), isFlip = bitmask & WRAP_FLIP_FLAG, Ctor = isBindKey ? undefined : createCtor(func);
            function wrapper() {
              var length = arguments.length, args = Array(length), index = length;
              while (index--) args[index] = arguments[index];
              if (isCurried) var placeholder = getHolder(wrapper), holdersCount = countHolders(args, placeholder);
              partials && (args = composeArgs(args, partials, holders, isCurried));
              partialsRight && (args = composeArgsRight(args, partialsRight, holdersRight, isCurried));
              length -= holdersCount;
              if (isCurried && length < arity) {
                var newHolders = replaceHolders(args, placeholder);
                return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, thisArg, args, newHolders, argPos, ary, arity - length);
              }
              var thisBinding = isBind ? thisArg : this, fn = isBindKey ? thisBinding[func] : func;
              length = args.length;
              argPos ? args = reorder(args, argPos) : isFlip && length > 1 && args.reverse();
              isAry && ary < length && (args.length = ary);
              this && this !== root && this instanceof wrapper && (fn = Ctor || createCtor(fn));
              return fn.apply(thisBinding, args);
            }
            return wrapper;
          }
          function createInverter(setter, toIteratee) {
            return function(object, iteratee) {
              return baseInverter(object, setter, toIteratee(iteratee), {});
            };
          }
          function createMathOperation(operator, defaultValue) {
            return function(value, other) {
              var result;
              if (value === undefined && other === undefined) return defaultValue;
              value !== undefined && (result = value);
              if (other !== undefined) {
                if (result === undefined) return other;
                if ("string" == typeof value || "string" == typeof other) {
                  value = baseToString(value);
                  other = baseToString(other);
                } else {
                  value = baseToNumber(value);
                  other = baseToNumber(other);
                }
                result = operator(value, other);
              }
              return result;
            };
          }
          function createOver(arrayFunc) {
            return flatRest(function(iteratees) {
              iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
              return baseRest(function(args) {
                var thisArg = this;
                return arrayFunc(iteratees, function(iteratee) {
                  return apply(iteratee, thisArg, args);
                });
              });
            });
          }
          function createPadding(length, chars) {
            chars = chars === undefined ? " " : baseToString(chars);
            var charsLength = chars.length;
            if (charsLength < 2) return charsLength ? baseRepeat(chars, length) : chars;
            var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
            return hasUnicode(chars) ? castSlice(stringToArray(result), 0, length).join("") : result.slice(0, length);
          }
          function createPartial(func, bitmask, thisArg, partials) {
            var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
            function wrapper() {
              var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array(leftLength + argsLength), fn = this && this !== root && this instanceof wrapper ? Ctor : func;
              while (++leftIndex < leftLength) args[leftIndex] = partials[leftIndex];
              while (argsLength--) args[leftIndex++] = arguments[++argsIndex];
              return apply(fn, isBind ? thisArg : this, args);
            }
            return wrapper;
          }
          function createRange(fromRight) {
            return function(start, end, step) {
              step && "number" != typeof step && isIterateeCall(start, end, step) && (end = step = undefined);
              start = toFinite(start);
              if (end === undefined) {
                end = start;
                start = 0;
              } else end = toFinite(end);
              step = step === undefined ? start < end ? 1 : -1 : toFinite(step);
              return baseRange(start, end, step, fromRight);
            };
          }
          function createRelationalOperation(operator) {
            return function(value, other) {
              if (!("string" == typeof value && "string" == typeof other)) {
                value = toNumber(value);
                other = toNumber(other);
              }
              return operator(value, other);
            };
          }
          function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
            var isCurry = bitmask & WRAP_CURRY_FLAG, newHolders = isCurry ? holders : undefined, newHoldersRight = isCurry ? undefined : holders, newPartials = isCurry ? partials : undefined, newPartialsRight = isCurry ? undefined : partials;
            bitmask |= isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG;
            bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);
            bitmask & WRAP_CURRY_BOUND_FLAG || (bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG));
            var newData = [ func, bitmask, thisArg, newPartials, newHolders, newPartialsRight, newHoldersRight, argPos, ary, arity ];
            var result = wrapFunc.apply(undefined, newData);
            isLaziable(func) && setData(result, newData);
            result.placeholder = placeholder;
            return setWrapToString(result, func, bitmask);
          }
          function createRound(methodName) {
            var func = Math[methodName];
            return function(number, precision) {
              number = toNumber(number);
              precision = nativeMin(toInteger(precision), 292);
              if (precision) {
                var pair = (toString(number) + "e").split("e"), value = func(pair[0] + "e" + (+pair[1] + precision));
                pair = (toString(value) + "e").split("e");
                return +(pair[0] + "e" + (+pair[1] - precision));
              }
              return func(number);
            };
          }
          var createSet = Set && 1 / setToArray(new Set([ , -0 ]))[1] == INFINITY ? function(values) {
            return new Set(values);
          } : noop;
          function createToPairs(keysFunc) {
            return function(object) {
              var tag = getTag(object);
              if (tag == mapTag) return mapToArray(object);
              if (tag == setTag) return setToPairs(object);
              return baseToPairs(object, keysFunc(object));
            };
          }
          function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
            var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
            if (!isBindKey && "function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
            var length = partials ? partials.length : 0;
            if (!length) {
              bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
              partials = holders = undefined;
            }
            ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
            arity = arity === undefined ? arity : toInteger(arity);
            length -= holders ? holders.length : 0;
            if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
              var partialsRight = partials, holdersRight = holders;
              partials = holders = undefined;
            }
            var data = isBindKey ? undefined : getData(func);
            var newData = [ func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity ];
            data && mergeData(newData, data);
            func = newData[0];
            bitmask = newData[1];
            thisArg = newData[2];
            partials = newData[3];
            holders = newData[4];
            arity = newData[9] = null == newData[9] ? isBindKey ? 0 : func.length : nativeMax(newData[9] - length, 0);
            !arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG) && (bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG));
            if (bitmask && bitmask != WRAP_BIND_FLAG) result = bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG ? createCurry(func, bitmask, arity) : bitmask != WRAP_PARTIAL_FLAG && bitmask != (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG) || holders.length ? createHybrid.apply(undefined, newData) : createPartial(func, bitmask, thisArg, partials); else var result = createBind(func, bitmask, thisArg);
            var setter = data ? baseSetData : setData;
            return setWrapToString(setter(result, newData), func, bitmask);
          }
          function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
            if (arrLength != othLength && !(isPartial && othLength > arrLength)) return false;
            var stacked = stack.get(array);
            if (stacked && stack.get(other)) return stacked == other;
            var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined;
            stack.set(array, other);
            stack.set(other, array);
            while (++index < arrLength) {
              var arrValue = array[index], othValue = other[index];
              if (customizer) var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
              if (compared !== undefined) {
                if (compared) continue;
                result = false;
                break;
              }
              if (seen) {
                if (!arraySome(other, function(othValue, othIndex) {
                  if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) return seen.push(othIndex);
                })) {
                  result = false;
                  break;
                }
              } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                result = false;
                break;
              }
            }
            stack["delete"](array);
            stack["delete"](other);
            return result;
          }
          function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
            switch (tag) {
             case dataViewTag:
              if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) return false;
              object = object.buffer;
              other = other.buffer;

             case arrayBufferTag:
              if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) return false;
              return true;

             case boolTag:
             case dateTag:
             case numberTag:
              return eq(+object, +other);

             case errorTag:
              return object.name == other.name && object.message == other.message;

             case regexpTag:
             case stringTag:
              return object == other + "";

             case mapTag:
              var convert = mapToArray;

             case setTag:
              var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
              convert || (convert = setToArray);
              if (object.size != other.size && !isPartial) return false;
              var stacked = stack.get(object);
              if (stacked) return stacked == other;
              bitmask |= COMPARE_UNORDERED_FLAG;
              stack.set(object, other);
              var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
              stack["delete"](object);
              return result;

             case symbolTag:
              if (symbolValueOf) return symbolValueOf.call(object) == symbolValueOf.call(other);
            }
            return false;
          }
          function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = keys(object), objLength = objProps.length, othProps = keys(other), othLength = othProps.length;
            if (objLength != othLength && !isPartial) return false;
            var index = objLength;
            while (index--) {
              var key = objProps[index];
              if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) return false;
            }
            var stacked = stack.get(object);
            if (stacked && stack.get(other)) return stacked == other;
            var result = true;
            stack.set(object, other);
            stack.set(other, object);
            var skipCtor = isPartial;
            while (++index < objLength) {
              key = objProps[index];
              var objValue = object[key], othValue = other[key];
              if (customizer) var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
              if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
                result = false;
                break;
              }
              skipCtor || (skipCtor = "constructor" == key);
            }
            if (result && !skipCtor) {
              var objCtor = object.constructor, othCtor = other.constructor;
              objCtor != othCtor && "constructor" in object && "constructor" in other && !("function" == typeof objCtor && objCtor instanceof objCtor && "function" == typeof othCtor && othCtor instanceof othCtor) && (result = false);
            }
            stack["delete"](object);
            stack["delete"](other);
            return result;
          }
          function flatRest(func) {
            return setToString(overRest(func, undefined, flatten), func + "");
          }
          function getAllKeys(object) {
            return baseGetAllKeys(object, keys, getSymbols);
          }
          function getAllKeysIn(object) {
            return baseGetAllKeys(object, keysIn, getSymbolsIn);
          }
          var getData = metaMap ? function(func) {
            return metaMap.get(func);
          } : noop;
          function getFuncName(func) {
            var result = func.name + "", array = realNames[result], length = hasOwnProperty.call(realNames, result) ? array.length : 0;
            while (length--) {
              var data = array[length], otherFunc = data.func;
              if (null == otherFunc || otherFunc == func) return data.name;
            }
            return result;
          }
          function getHolder(func) {
            var object = hasOwnProperty.call(lodash, "placeholder") ? lodash : func;
            return object.placeholder;
          }
          function getIteratee() {
            var result = lodash.iteratee || iteratee;
            result = result === iteratee ? baseIteratee : result;
            return arguments.length ? result(arguments[0], arguments[1]) : result;
          }
          function getMapData(map, key) {
            var data = map.__data__;
            return isKeyable(key) ? data["string" == typeof key ? "string" : "hash"] : data.map;
          }
          function getMatchData(object) {
            var result = keys(object), length = result.length;
            while (length--) {
              var key = result[length], value = object[key];
              result[length] = [ key, value, isStrictComparable(value) ];
            }
            return result;
          }
          function getNative(object, key) {
            var value = getValue(object, key);
            return baseIsNative(value) ? value : undefined;
          }
          function getRawTag(value) {
            var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
            try {
              value[symToStringTag] = undefined;
              var unmasked = true;
            } catch (e) {}
            var result = nativeObjectToString.call(value);
            unmasked && (isOwn ? value[symToStringTag] = tag : delete value[symToStringTag]);
            return result;
          }
          var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;
          var getSymbolsIn = nativeGetSymbols ? function(object) {
            var result = [];
            while (object) {
              arrayPush(result, getSymbols(object));
              object = getPrototype(object);
            }
            return result;
          } : stubArray;
          var getTag = baseGetTag;
          (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) && (getTag = function(value) {
            var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : undefined, ctorString = Ctor ? toSource(Ctor) : "";
            if (ctorString) switch (ctorString) {
             case dataViewCtorString:
              return dataViewTag;

             case mapCtorString:
              return mapTag;

             case promiseCtorString:
              return promiseTag;

             case setCtorString:
              return setTag;

             case weakMapCtorString:
              return weakMapTag;
            }
            return result;
          });
          function getView(start, end, transforms) {
            var index = -1, length = transforms.length;
            while (++index < length) {
              var data = transforms[index], size = data.size;
              switch (data.type) {
               case "drop":
                start += size;
                break;

               case "dropRight":
                end -= size;
                break;

               case "take":
                end = nativeMin(end, start + size);
                break;

               case "takeRight":
                start = nativeMax(start, end - size);
              }
            }
            return {
              start: start,
              end: end
            };
          }
          function getWrapDetails(source) {
            var match = source.match(reWrapDetails);
            return match ? match[1].split(reSplitDetails) : [];
          }
          function hasPath(object, path, hasFunc) {
            path = castPath(path, object);
            var index = -1, length = path.length, result = false;
            while (++index < length) {
              var key = toKey(path[index]);
              if (!(result = null != object && hasFunc(object, key))) break;
              object = object[key];
            }
            if (result || ++index != length) return result;
            length = null == object ? 0 : object.length;
            return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
          }
          function initCloneArray(array) {
            var length = array.length, result = array.constructor(length);
            if (length && "string" == typeof array[0] && hasOwnProperty.call(array, "index")) {
              result.index = array.index;
              result.input = array.input;
            }
            return result;
          }
          function initCloneObject(object) {
            return "function" != typeof object.constructor || isPrototype(object) ? {} : baseCreate(getPrototype(object));
          }
          function initCloneByTag(object, tag, cloneFunc, isDeep) {
            var Ctor = object.constructor;
            switch (tag) {
             case arrayBufferTag:
              return cloneArrayBuffer(object);

             case boolTag:
             case dateTag:
              return new Ctor(+object);

             case dataViewTag:
              return cloneDataView(object, isDeep);

             case float32Tag:
             case float64Tag:
             case int8Tag:
             case int16Tag:
             case int32Tag:
             case uint8Tag:
             case uint8ClampedTag:
             case uint16Tag:
             case uint32Tag:
              return cloneTypedArray(object, isDeep);

             case mapTag:
              return cloneMap(object, isDeep, cloneFunc);

             case numberTag:
             case stringTag:
              return new Ctor(object);

             case regexpTag:
              return cloneRegExp(object);

             case setTag:
              return cloneSet(object, isDeep, cloneFunc);

             case symbolTag:
              return cloneSymbol(object);
            }
          }
          function insertWrapDetails(source, details) {
            var length = details.length;
            if (!length) return source;
            var lastIndex = length - 1;
            details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex];
            details = details.join(length > 2 ? ", " : " ");
            return source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n");
          }
          function isFlattenable(value) {
            return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
          }
          function isIndex(value, length) {
            length = null == length ? MAX_SAFE_INTEGER : length;
            return !!length && ("number" == typeof value || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
          }
          function isIterateeCall(value, index, object) {
            if (!isObject(object)) return false;
            var type = typeof index;
            if ("number" == type ? isArrayLike(object) && isIndex(index, object.length) : "string" == type && index in object) return eq(object[index], value);
            return false;
          }
          function isKey(value, object) {
            if (isArray(value)) return false;
            var type = typeof value;
            if ("number" == type || "symbol" == type || "boolean" == type || null == value || isSymbol(value)) return true;
            return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || null != object && value in Object(object);
          }
          function isKeyable(value) {
            var type = typeof value;
            return "string" == type || "number" == type || "symbol" == type || "boolean" == type ? "__proto__" !== value : null === value;
          }
          function isLaziable(func) {
            var funcName = getFuncName(func), other = lodash[funcName];
            if ("function" != typeof other || !(funcName in LazyWrapper.prototype)) return false;
            if (func === other) return true;
            var data = getData(other);
            return !!data && func === data[0];
          }
          function isMasked(func) {
            return !!maskSrcKey && maskSrcKey in func;
          }
          var isMaskable = coreJsData ? isFunction : stubFalse;
          function isPrototype(value) {
            var Ctor = value && value.constructor, proto = "function" == typeof Ctor && Ctor.prototype || objectProto;
            return value === proto;
          }
          function isStrictComparable(value) {
            return value === value && !isObject(value);
          }
          function matchesStrictComparable(key, srcValue) {
            return function(object) {
              if (null == object) return false;
              return object[key] === srcValue && (srcValue !== undefined || key in Object(object));
            };
          }
          function memoizeCapped(func) {
            var result = memoize(func, function(key) {
              cache.size === MAX_MEMOIZE_SIZE && cache.clear();
              return key;
            });
            var cache = result.cache;
            return result;
          }
          function mergeData(data, source) {
            var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);
            var isCombo = srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_CURRY_FLAG || srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_REARG_FLAG && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG;
            if (!(isCommon || isCombo)) return data;
            if (srcBitmask & WRAP_BIND_FLAG) {
              data[2] = source[2];
              newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
            }
            var value = source[3];
            if (value) {
              var partials = data[3];
              data[3] = partials ? composeArgs(partials, value, source[4]) : value;
              data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
            }
            value = source[5];
            if (value) {
              partials = data[5];
              data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
              data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
            }
            value = source[7];
            value && (data[7] = value);
            srcBitmask & WRAP_ARY_FLAG && (data[8] = null == data[8] ? source[8] : nativeMin(data[8], source[8]));
            null == data[9] && (data[9] = source[9]);
            data[0] = source[0];
            data[1] = newBitmask;
            return data;
          }
          function mergeDefaults(objValue, srcValue, key, object, source, stack) {
            if (isObject(objValue) && isObject(srcValue)) {
              stack.set(srcValue, objValue);
              baseMerge(objValue, srcValue, undefined, mergeDefaults, stack);
              stack["delete"](srcValue);
            }
            return objValue;
          }
          function nativeKeysIn(object) {
            var result = [];
            if (null != object) for (var key in Object(object)) result.push(key);
            return result;
          }
          function objectToString(value) {
            return nativeObjectToString.call(value);
          }
          function overRest(func, start, transform) {
            start = nativeMax(start === undefined ? func.length - 1 : start, 0);
            return function() {
              var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
              while (++index < length) array[index] = args[start + index];
              index = -1;
              var otherArgs = Array(start + 1);
              while (++index < start) otherArgs[index] = args[index];
              otherArgs[start] = transform(array);
              return apply(func, this, otherArgs);
            };
          }
          function parent(object, path) {
            return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
          }
          function reorder(array, indexes) {
            var arrLength = array.length, length = nativeMin(indexes.length, arrLength), oldArray = copyArray(array);
            while (length--) {
              var index = indexes[length];
              array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
            }
            return array;
          }
          var setData = shortOut(baseSetData);
          var setTimeout = ctxSetTimeout || function(func, wait) {
            return root.setTimeout(func, wait);
          };
          var setToString = shortOut(baseSetToString);
          function setWrapToString(wrapper, reference, bitmask) {
            var source = reference + "";
            return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
          }
          function shortOut(func) {
            var count = 0, lastCalled = 0;
            return function() {
              var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
              lastCalled = stamp;
              if (remaining > 0) {
                if (++count >= HOT_COUNT) return arguments[0];
              } else count = 0;
              return func.apply(undefined, arguments);
            };
          }
          function shuffleSelf(array, size) {
            var index = -1, length = array.length, lastIndex = length - 1;
            size = size === undefined ? length : size;
            while (++index < size) {
              var rand = baseRandom(index, lastIndex), value = array[rand];
              array[rand] = array[index];
              array[index] = value;
            }
            array.length = size;
            return array;
          }
          var stringToPath = memoizeCapped(function(string) {
            var result = [];
            reLeadingDot.test(string) && result.push("");
            string.replace(rePropName, function(match, number, quote, string) {
              result.push(quote ? string.replace(reEscapeChar, "$1") : number || match);
            });
            return result;
          });
          function toKey(value) {
            if ("string" == typeof value || isSymbol(value)) return value;
            var result = value + "";
            return "0" == result && 1 / value == -INFINITY ? "-0" : result;
          }
          function toSource(func) {
            if (null != func) {
              try {
                return funcToString.call(func);
              } catch (e) {}
              try {
                return func + "";
              } catch (e) {}
            }
            return "";
          }
          function updateWrapDetails(details, bitmask) {
            arrayEach(wrapFlags, function(pair) {
              var value = "_." + pair[0];
              bitmask & pair[1] && !arrayIncludes(details, value) && details.push(value);
            });
            return details.sort();
          }
          function wrapperClone(wrapper) {
            if (wrapper instanceof LazyWrapper) return wrapper.clone();
            var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
            result.__actions__ = copyArray(wrapper.__actions__);
            result.__index__ = wrapper.__index__;
            result.__values__ = wrapper.__values__;
            return result;
          }
          function chunk(array, size, guard) {
            size = (guard ? isIterateeCall(array, size, guard) : size === undefined) ? 1 : nativeMax(toInteger(size), 0);
            var length = null == array ? 0 : array.length;
            if (!length || size < 1) return [];
            var index = 0, resIndex = 0, result = Array(nativeCeil(length / size));
            while (index < length) result[resIndex++] = baseSlice(array, index, index += size);
            return result;
          }
          function compact(array) {
            var index = -1, length = null == array ? 0 : array.length, resIndex = 0, result = [];
            while (++index < length) {
              var value = array[index];
              value && (result[resIndex++] = value);
            }
            return result;
          }
          function concat() {
            var length = arguments.length;
            if (!length) return [];
            var args = Array(length - 1), array = arguments[0], index = length;
            while (index--) args[index - 1] = arguments[index];
            return arrayPush(isArray(array) ? copyArray(array) : [ array ], baseFlatten(args, 1));
          }
          var difference = baseRest(function(array, values) {
            return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true)) : [];
          });
          var differenceBy = baseRest(function(array, values) {
            var iteratee = last(values);
            isArrayLikeObject(iteratee) && (iteratee = undefined);
            return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), getIteratee(iteratee, 2)) : [];
          });
          var differenceWith = baseRest(function(array, values) {
            var comparator = last(values);
            isArrayLikeObject(comparator) && (comparator = undefined);
            return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined, comparator) : [];
          });
          function drop(array, n, guard) {
            var length = null == array ? 0 : array.length;
            if (!length) return [];
            n = guard || n === undefined ? 1 : toInteger(n);
            return baseSlice(array, n < 0 ? 0 : n, length);
          }
          function dropRight(array, n, guard) {
            var length = null == array ? 0 : array.length;
            if (!length) return [];
            n = guard || n === undefined ? 1 : toInteger(n);
            n = length - n;
            return baseSlice(array, 0, n < 0 ? 0 : n);
          }
          function dropRightWhile(array, predicate) {
            return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true, true) : [];
          }
          function dropWhile(array, predicate) {
            return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true) : [];
          }
          function fill(array, value, start, end) {
            var length = null == array ? 0 : array.length;
            if (!length) return [];
            if (start && "number" != typeof start && isIterateeCall(array, value, start)) {
              start = 0;
              end = length;
            }
            return baseFill(array, value, start, end);
          }
          function findIndex(array, predicate, fromIndex) {
            var length = null == array ? 0 : array.length;
            if (!length) return -1;
            var index = null == fromIndex ? 0 : toInteger(fromIndex);
            index < 0 && (index = nativeMax(length + index, 0));
            return baseFindIndex(array, getIteratee(predicate, 3), index);
          }
          function findLastIndex(array, predicate, fromIndex) {
            var length = null == array ? 0 : array.length;
            if (!length) return -1;
            var index = length - 1;
            if (fromIndex !== undefined) {
              index = toInteger(fromIndex);
              index = fromIndex < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
            }
            return baseFindIndex(array, getIteratee(predicate, 3), index, true);
          }
          function flatten(array) {
            var length = null == array ? 0 : array.length;
            return length ? baseFlatten(array, 1) : [];
          }
          function flattenDeep(array) {
            var length = null == array ? 0 : array.length;
            return length ? baseFlatten(array, INFINITY) : [];
          }
          function flattenDepth(array, depth) {
            var length = null == array ? 0 : array.length;
            if (!length) return [];
            depth = depth === undefined ? 1 : toInteger(depth);
            return baseFlatten(array, depth);
          }
          function fromPairs(pairs) {
            var index = -1, length = null == pairs ? 0 : pairs.length, result = {};
            while (++index < length) {
              var pair = pairs[index];
              result[pair[0]] = pair[1];
            }
            return result;
          }
          function head(array) {
            return array && array.length ? array[0] : undefined;
          }
          function indexOf(array, value, fromIndex) {
            var length = null == array ? 0 : array.length;
            if (!length) return -1;
            var index = null == fromIndex ? 0 : toInteger(fromIndex);
            index < 0 && (index = nativeMax(length + index, 0));
            return baseIndexOf(array, value, index);
          }
          function initial(array) {
            var length = null == array ? 0 : array.length;
            return length ? baseSlice(array, 0, -1) : [];
          }
          var intersection = baseRest(function(arrays) {
            var mapped = arrayMap(arrays, castArrayLikeObject);
            return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
          });
          var intersectionBy = baseRest(function(arrays) {
            var iteratee = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
            iteratee === last(mapped) ? iteratee = undefined : mapped.pop();
            return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, getIteratee(iteratee, 2)) : [];
          });
          var intersectionWith = baseRest(function(arrays) {
            var comparator = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
            comparator = "function" == typeof comparator ? comparator : undefined;
            comparator && mapped.pop();
            return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined, comparator) : [];
          });
          function join(array, separator) {
            return null == array ? "" : nativeJoin.call(array, separator);
          }
          function last(array) {
            var length = null == array ? 0 : array.length;
            return length ? array[length - 1] : undefined;
          }
          function lastIndexOf(array, value, fromIndex) {
            var length = null == array ? 0 : array.length;
            if (!length) return -1;
            var index = length;
            if (fromIndex !== undefined) {
              index = toInteger(fromIndex);
              index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
            }
            return value === value ? strictLastIndexOf(array, value, index) : baseFindIndex(array, baseIsNaN, index, true);
          }
          function nth(array, n) {
            return array && array.length ? baseNth(array, toInteger(n)) : undefined;
          }
          var pull = baseRest(pullAll);
          function pullAll(array, values) {
            return array && array.length && values && values.length ? basePullAll(array, values) : array;
          }
          function pullAllBy(array, values, iteratee) {
            return array && array.length && values && values.length ? basePullAll(array, values, getIteratee(iteratee, 2)) : array;
          }
          function pullAllWith(array, values, comparator) {
            return array && array.length && values && values.length ? basePullAll(array, values, undefined, comparator) : array;
          }
          var pullAt = flatRest(function(array, indexes) {
            var length = null == array ? 0 : array.length, result = baseAt(array, indexes);
            basePullAt(array, arrayMap(indexes, function(index) {
              return isIndex(index, length) ? +index : index;
            }).sort(compareAscending));
            return result;
          });
          function remove(array, predicate) {
            var result = [];
            if (!(array && array.length)) return result;
            var index = -1, indexes = [], length = array.length;
            predicate = getIteratee(predicate, 3);
            while (++index < length) {
              var value = array[index];
              if (predicate(value, index, array)) {
                result.push(value);
                indexes.push(index);
              }
            }
            basePullAt(array, indexes);
            return result;
          }
          function reverse(array) {
            return null == array ? array : nativeReverse.call(array);
          }
          function slice(array, start, end) {
            var length = null == array ? 0 : array.length;
            if (!length) return [];
            if (end && "number" != typeof end && isIterateeCall(array, start, end)) {
              start = 0;
              end = length;
            } else {
              start = null == start ? 0 : toInteger(start);
              end = end === undefined ? length : toInteger(end);
            }
            return baseSlice(array, start, end);
          }
          function sortedIndex(array, value) {
            return baseSortedIndex(array, value);
          }
          function sortedIndexBy(array, value, iteratee) {
            return baseSortedIndexBy(array, value, getIteratee(iteratee, 2));
          }
          function sortedIndexOf(array, value) {
            var length = null == array ? 0 : array.length;
            if (length) {
              var index = baseSortedIndex(array, value);
              if (index < length && eq(array[index], value)) return index;
            }
            return -1;
          }
          function sortedLastIndex(array, value) {
            return baseSortedIndex(array, value, true);
          }
          function sortedLastIndexBy(array, value, iteratee) {
            return baseSortedIndexBy(array, value, getIteratee(iteratee, 2), true);
          }
          function sortedLastIndexOf(array, value) {
            var length = null == array ? 0 : array.length;
            if (length) {
              var index = baseSortedIndex(array, value, true) - 1;
              if (eq(array[index], value)) return index;
            }
            return -1;
          }
          function sortedUniq(array) {
            return array && array.length ? baseSortedUniq(array) : [];
          }
          function sortedUniqBy(array, iteratee) {
            return array && array.length ? baseSortedUniq(array, getIteratee(iteratee, 2)) : [];
          }
          function tail(array) {
            var length = null == array ? 0 : array.length;
            return length ? baseSlice(array, 1, length) : [];
          }
          function take(array, n, guard) {
            if (!(array && array.length)) return [];
            n = guard || n === undefined ? 1 : toInteger(n);
            return baseSlice(array, 0, n < 0 ? 0 : n);
          }
          function takeRight(array, n, guard) {
            var length = null == array ? 0 : array.length;
            if (!length) return [];
            n = guard || n === undefined ? 1 : toInteger(n);
            n = length - n;
            return baseSlice(array, n < 0 ? 0 : n, length);
          }
          function takeRightWhile(array, predicate) {
            return array && array.length ? baseWhile(array, getIteratee(predicate, 3), false, true) : [];
          }
          function takeWhile(array, predicate) {
            return array && array.length ? baseWhile(array, getIteratee(predicate, 3)) : [];
          }
          var union = baseRest(function(arrays) {
            return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
          });
          var unionBy = baseRest(function(arrays) {
            var iteratee = last(arrays);
            isArrayLikeObject(iteratee) && (iteratee = undefined);
            return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee, 2));
          });
          var unionWith = baseRest(function(arrays) {
            var comparator = last(arrays);
            comparator = "function" == typeof comparator ? comparator : undefined;
            return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined, comparator);
          });
          function uniq(array) {
            return array && array.length ? baseUniq(array) : [];
          }
          function uniqBy(array, iteratee) {
            return array && array.length ? baseUniq(array, getIteratee(iteratee, 2)) : [];
          }
          function uniqWith(array, comparator) {
            comparator = "function" == typeof comparator ? comparator : undefined;
            return array && array.length ? baseUniq(array, undefined, comparator) : [];
          }
          function unzip(array) {
            if (!(array && array.length)) return [];
            var length = 0;
            array = arrayFilter(array, function(group) {
              if (isArrayLikeObject(group)) {
                length = nativeMax(group.length, length);
                return true;
              }
            });
            return baseTimes(length, function(index) {
              return arrayMap(array, baseProperty(index));
            });
          }
          function unzipWith(array, iteratee) {
            if (!(array && array.length)) return [];
            var result = unzip(array);
            if (null == iteratee) return result;
            return arrayMap(result, function(group) {
              return apply(iteratee, undefined, group);
            });
          }
          var without = baseRest(function(array, values) {
            return isArrayLikeObject(array) ? baseDifference(array, values) : [];
          });
          var xor = baseRest(function(arrays) {
            return baseXor(arrayFilter(arrays, isArrayLikeObject));
          });
          var xorBy = baseRest(function(arrays) {
            var iteratee = last(arrays);
            isArrayLikeObject(iteratee) && (iteratee = undefined);
            return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee, 2));
          });
          var xorWith = baseRest(function(arrays) {
            var comparator = last(arrays);
            comparator = "function" == typeof comparator ? comparator : undefined;
            return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
          });
          var zip = baseRest(unzip);
          function zipObject(props, values) {
            return baseZipObject(props || [], values || [], assignValue);
          }
          function zipObjectDeep(props, values) {
            return baseZipObject(props || [], values || [], baseSet);
          }
          var zipWith = baseRest(function(arrays) {
            var length = arrays.length, iteratee = length > 1 ? arrays[length - 1] : undefined;
            iteratee = "function" == typeof iteratee ? (arrays.pop(), iteratee) : undefined;
            return unzipWith(arrays, iteratee);
          });
          function chain(value) {
            var result = lodash(value);
            result.__chain__ = true;
            return result;
          }
          function tap(value, interceptor) {
            interceptor(value);
            return value;
          }
          function thru(value, interceptor) {
            return interceptor(value);
          }
          var wrapperAt = flatRest(function(paths) {
            var length = paths.length, start = length ? paths[0] : 0, value = this.__wrapped__, interceptor = function(object) {
              return baseAt(object, paths);
            };
            if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) return this.thru(interceptor);
            value = value.slice(start, +start + (length ? 1 : 0));
            value.__actions__.push({
              func: thru,
              args: [ interceptor ],
              thisArg: undefined
            });
            return new LodashWrapper(value, this.__chain__).thru(function(array) {
              length && !array.length && array.push(undefined);
              return array;
            });
          });
          function wrapperChain() {
            return chain(this);
          }
          function wrapperCommit() {
            return new LodashWrapper(this.value(), this.__chain__);
          }
          function wrapperNext() {
            this.__values__ === undefined && (this.__values__ = toArray(this.value()));
            var done = this.__index__ >= this.__values__.length, value = done ? undefined : this.__values__[this.__index__++];
            return {
              done: done,
              value: value
            };
          }
          function wrapperToIterator() {
            return this;
          }
          function wrapperPlant(value) {
            var result, parent = this;
            while (parent instanceof baseLodash) {
              var clone = wrapperClone(parent);
              clone.__index__ = 0;
              clone.__values__ = undefined;
              result ? previous.__wrapped__ = clone : result = clone;
              var previous = clone;
              parent = parent.__wrapped__;
            }
            previous.__wrapped__ = value;
            return result;
          }
          function wrapperReverse() {
            var value = this.__wrapped__;
            if (value instanceof LazyWrapper) {
              var wrapped = value;
              this.__actions__.length && (wrapped = new LazyWrapper(this));
              wrapped = wrapped.reverse();
              wrapped.__actions__.push({
                func: thru,
                args: [ reverse ],
                thisArg: undefined
              });
              return new LodashWrapper(wrapped, this.__chain__);
            }
            return this.thru(reverse);
          }
          function wrapperValue() {
            return baseWrapperValue(this.__wrapped__, this.__actions__);
          }
          var countBy = createAggregator(function(result, value, key) {
            hasOwnProperty.call(result, key) ? ++result[key] : baseAssignValue(result, key, 1);
          });
          function every(collection, predicate, guard) {
            var func = isArray(collection) ? arrayEvery : baseEvery;
            guard && isIterateeCall(collection, predicate, guard) && (predicate = undefined);
            return func(collection, getIteratee(predicate, 3));
          }
          function filter(collection, predicate) {
            var func = isArray(collection) ? arrayFilter : baseFilter;
            return func(collection, getIteratee(predicate, 3));
          }
          var find = createFind(findIndex);
          var findLast = createFind(findLastIndex);
          function flatMap(collection, iteratee) {
            return baseFlatten(map(collection, iteratee), 1);
          }
          function flatMapDeep(collection, iteratee) {
            return baseFlatten(map(collection, iteratee), INFINITY);
          }
          function flatMapDepth(collection, iteratee, depth) {
            depth = depth === undefined ? 1 : toInteger(depth);
            return baseFlatten(map(collection, iteratee), depth);
          }
          function forEach(collection, iteratee) {
            var func = isArray(collection) ? arrayEach : baseEach;
            return func(collection, getIteratee(iteratee, 3));
          }
          function forEachRight(collection, iteratee) {
            var func = isArray(collection) ? arrayEachRight : baseEachRight;
            return func(collection, getIteratee(iteratee, 3));
          }
          var groupBy = createAggregator(function(result, value, key) {
            hasOwnProperty.call(result, key) ? result[key].push(value) : baseAssignValue(result, key, [ value ]);
          });
          function includes(collection, value, fromIndex, guard) {
            collection = isArrayLike(collection) ? collection : values(collection);
            fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
            var length = collection.length;
            fromIndex < 0 && (fromIndex = nativeMax(length + fromIndex, 0));
            return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
          }
          var invokeMap = baseRest(function(collection, path, args) {
            var index = -1, isFunc = "function" == typeof path, result = isArrayLike(collection) ? Array(collection.length) : [];
            baseEach(collection, function(value) {
              result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
            });
            return result;
          });
          var keyBy = createAggregator(function(result, value, key) {
            baseAssignValue(result, key, value);
          });
          function map(collection, iteratee) {
            var func = isArray(collection) ? arrayMap : baseMap;
            return func(collection, getIteratee(iteratee, 3));
          }
          function orderBy(collection, iteratees, orders, guard) {
            if (null == collection) return [];
            isArray(iteratees) || (iteratees = null == iteratees ? [] : [ iteratees ]);
            orders = guard ? undefined : orders;
            isArray(orders) || (orders = null == orders ? [] : [ orders ]);
            return baseOrderBy(collection, iteratees, orders);
          }
          var partition = createAggregator(function(result, value, key) {
            result[key ? 0 : 1].push(value);
          }, function() {
            return [ [], [] ];
          });
          function reduce(collection, iteratee, accumulator) {
            var func = isArray(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
            return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
          }
          function reduceRight(collection, iteratee, accumulator) {
            var func = isArray(collection) ? arrayReduceRight : baseReduce, initAccum = arguments.length < 3;
            return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
          }
          function reject(collection, predicate) {
            var func = isArray(collection) ? arrayFilter : baseFilter;
            return func(collection, negate(getIteratee(predicate, 3)));
          }
          function sample(collection) {
            var func = isArray(collection) ? arraySample : baseSample;
            return func(collection);
          }
          function sampleSize(collection, n, guard) {
            n = (guard ? isIterateeCall(collection, n, guard) : n === undefined) ? 1 : toInteger(n);
            var func = isArray(collection) ? arraySampleSize : baseSampleSize;
            return func(collection, n);
          }
          function shuffle(collection) {
            var func = isArray(collection) ? arrayShuffle : baseShuffle;
            return func(collection);
          }
          function size(collection) {
            if (null == collection) return 0;
            if (isArrayLike(collection)) return isString(collection) ? stringSize(collection) : collection.length;
            var tag = getTag(collection);
            if (tag == mapTag || tag == setTag) return collection.size;
            return baseKeys(collection).length;
          }
          function some(collection, predicate, guard) {
            var func = isArray(collection) ? arraySome : baseSome;
            guard && isIterateeCall(collection, predicate, guard) && (predicate = undefined);
            return func(collection, getIteratee(predicate, 3));
          }
          var sortBy = baseRest(function(collection, iteratees) {
            if (null == collection) return [];
            var length = iteratees.length;
            length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1]) ? iteratees = [] : length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2]) && (iteratees = [ iteratees[0] ]);
            return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
          });
          var now = ctxNow || function() {
            return root.Date.now();
          };
          function after(n, func) {
            if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
            n = toInteger(n);
            return function() {
              if (--n < 1) return func.apply(this, arguments);
            };
          }
          function ary(func, n, guard) {
            n = guard ? undefined : n;
            n = func && null == n ? func.length : n;
            return createWrap(func, WRAP_ARY_FLAG, undefined, undefined, undefined, undefined, n);
          }
          function before(n, func) {
            var result;
            if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
            n = toInteger(n);
            return function() {
              --n > 0 && (result = func.apply(this, arguments));
              n <= 1 && (func = undefined);
              return result;
            };
          }
          var bind = baseRest(function(func, thisArg, partials) {
            var bitmask = WRAP_BIND_FLAG;
            if (partials.length) {
              var holders = replaceHolders(partials, getHolder(bind));
              bitmask |= WRAP_PARTIAL_FLAG;
            }
            return createWrap(func, bitmask, thisArg, partials, holders);
          });
          var bindKey = baseRest(function(object, key, partials) {
            var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
            if (partials.length) {
              var holders = replaceHolders(partials, getHolder(bindKey));
              bitmask |= WRAP_PARTIAL_FLAG;
            }
            return createWrap(key, bitmask, object, partials, holders);
          });
          function curry(func, arity, guard) {
            arity = guard ? undefined : arity;
            var result = createWrap(func, WRAP_CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
            result.placeholder = curry.placeholder;
            return result;
          }
          function curryRight(func, arity, guard) {
            arity = guard ? undefined : arity;
            var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
            result.placeholder = curryRight.placeholder;
            return result;
          }
          function debounce(func, wait, options) {
            var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
            if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
            wait = toNumber(wait) || 0;
            if (isObject(options)) {
              leading = !!options.leading;
              maxing = "maxWait" in options;
              maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
              trailing = "trailing" in options ? !!options.trailing : trailing;
            }
            function invokeFunc(time) {
              var args = lastArgs, thisArg = lastThis;
              lastArgs = lastThis = undefined;
              lastInvokeTime = time;
              result = func.apply(thisArg, args);
              return result;
            }
            function leadingEdge(time) {
              lastInvokeTime = time;
              timerId = setTimeout(timerExpired, wait);
              return leading ? invokeFunc(time) : result;
            }
            function remainingWait(time) {
              var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, result = wait - timeSinceLastCall;
              return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
            }
            function shouldInvoke(time) {
              var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
              return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
            }
            function timerExpired() {
              var time = now();
              if (shouldInvoke(time)) return trailingEdge(time);
              timerId = setTimeout(timerExpired, remainingWait(time));
            }
            function trailingEdge(time) {
              timerId = undefined;
              if (trailing && lastArgs) return invokeFunc(time);
              lastArgs = lastThis = undefined;
              return result;
            }
            function cancel() {
              timerId !== undefined && clearTimeout(timerId);
              lastInvokeTime = 0;
              lastArgs = lastCallTime = lastThis = timerId = undefined;
            }
            function flush() {
              return timerId === undefined ? result : trailingEdge(now());
            }
            function debounced() {
              var time = now(), isInvoking = shouldInvoke(time);
              lastArgs = arguments;
              lastThis = this;
              lastCallTime = time;
              if (isInvoking) {
                if (timerId === undefined) return leadingEdge(lastCallTime);
                if (maxing) {
                  timerId = setTimeout(timerExpired, wait);
                  return invokeFunc(lastCallTime);
                }
              }
              timerId === undefined && (timerId = setTimeout(timerExpired, wait));
              return result;
            }
            debounced.cancel = cancel;
            debounced.flush = flush;
            return debounced;
          }
          var defer = baseRest(function(func, args) {
            return baseDelay(func, 1, args);
          });
          var delay = baseRest(function(func, wait, args) {
            return baseDelay(func, toNumber(wait) || 0, args);
          });
          function flip(func) {
            return createWrap(func, WRAP_FLIP_FLAG);
          }
          function memoize(func, resolver) {
            if ("function" != typeof func || null != resolver && "function" != typeof resolver) throw new TypeError(FUNC_ERROR_TEXT);
            var memoized = function() {
              var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
              if (cache.has(key)) return cache.get(key);
              var result = func.apply(this, args);
              memoized.cache = cache.set(key, result) || cache;
              return result;
            };
            memoized.cache = new (memoize.Cache || MapCache)();
            return memoized;
          }
          memoize.Cache = MapCache;
          function negate(predicate) {
            if ("function" != typeof predicate) throw new TypeError(FUNC_ERROR_TEXT);
            return function() {
              var args = arguments;
              switch (args.length) {
               case 0:
                return !predicate.call(this);

               case 1:
                return !predicate.call(this, args[0]);

               case 2:
                return !predicate.call(this, args[0], args[1]);

               case 3:
                return !predicate.call(this, args[0], args[1], args[2]);
              }
              return !predicate.apply(this, args);
            };
          }
          function once(func) {
            return before(2, func);
          }
          var overArgs = castRest(function(func, transforms) {
            transforms = 1 == transforms.length && isArray(transforms[0]) ? arrayMap(transforms[0], baseUnary(getIteratee())) : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));
            var funcsLength = transforms.length;
            return baseRest(function(args) {
              var index = -1, length = nativeMin(args.length, funcsLength);
              while (++index < length) args[index] = transforms[index].call(this, args[index]);
              return apply(func, this, args);
            });
          });
          var partial = baseRest(function(func, partials) {
            var holders = replaceHolders(partials, getHolder(partial));
            return createWrap(func, WRAP_PARTIAL_FLAG, undefined, partials, holders);
          });
          var partialRight = baseRest(function(func, partials) {
            var holders = replaceHolders(partials, getHolder(partialRight));
            return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined, partials, holders);
          });
          var rearg = flatRest(function(func, indexes) {
            return createWrap(func, WRAP_REARG_FLAG, undefined, undefined, undefined, indexes);
          });
          function rest(func, start) {
            if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
            start = start === undefined ? start : toInteger(start);
            return baseRest(func, start);
          }
          function spread(func, start) {
            if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
            start = start === undefined ? 0 : nativeMax(toInteger(start), 0);
            return baseRest(function(args) {
              var array = args[start], otherArgs = castSlice(args, 0, start);
              array && arrayPush(otherArgs, array);
              return apply(func, this, otherArgs);
            });
          }
          function throttle(func, wait, options) {
            var leading = true, trailing = true;
            if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
            if (isObject(options)) {
              leading = "leading" in options ? !!options.leading : leading;
              trailing = "trailing" in options ? !!options.trailing : trailing;
            }
            return debounce(func, wait, {
              leading: leading,
              maxWait: wait,
              trailing: trailing
            });
          }
          function unary(func) {
            return ary(func, 1);
          }
          function wrap(value, wrapper) {
            return partial(castFunction(wrapper), value);
          }
          function castArray() {
            if (!arguments.length) return [];
            var value = arguments[0];
            return isArray(value) ? value : [ value ];
          }
          function clone(value) {
            return baseClone(value, CLONE_SYMBOLS_FLAG);
          }
          function cloneWith(value, customizer) {
            customizer = "function" == typeof customizer ? customizer : undefined;
            return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
          }
          function cloneDeep(value) {
            return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
          }
          function cloneDeepWith(value, customizer) {
            customizer = "function" == typeof customizer ? customizer : undefined;
            return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
          }
          function conformsTo(object, source) {
            return null == source || baseConformsTo(object, source, keys(source));
          }
          function eq(value, other) {
            return value === other || value !== value && other !== other;
          }
          var gt = createRelationalOperation(baseGt);
          var gte = createRelationalOperation(function(value, other) {
            return value >= other;
          });
          var isArguments = baseIsArguments(function() {
            return arguments;
          }()) ? baseIsArguments : function(value) {
            return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
          };
          var isArray = Array.isArray;
          var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;
          function isArrayLike(value) {
            return null != value && isLength(value.length) && !isFunction(value);
          }
          function isArrayLikeObject(value) {
            return isObjectLike(value) && isArrayLike(value);
          }
          function isBoolean(value) {
            return true === value || false === value || isObjectLike(value) && baseGetTag(value) == boolTag;
          }
          var isBuffer = nativeIsBuffer || stubFalse;
          var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
          function isElement(value) {
            return isObjectLike(value) && 1 === value.nodeType && !isPlainObject(value);
          }
          function isEmpty(value) {
            if (null == value) return true;
            if (isArrayLike(value) && (isArray(value) || "string" == typeof value || "function" == typeof value.splice || isBuffer(value) || isTypedArray(value) || isArguments(value))) return !value.length;
            var tag = getTag(value);
            if (tag == mapTag || tag == setTag) return !value.size;
            if (isPrototype(value)) return !baseKeys(value).length;
            for (var key in value) if (hasOwnProperty.call(value, key)) return false;
            return true;
          }
          function isEqual(value, other) {
            return baseIsEqual(value, other);
          }
          function isEqualWith(value, other, customizer) {
            customizer = "function" == typeof customizer ? customizer : undefined;
            var result = customizer ? customizer(value, other) : undefined;
            return result === undefined ? baseIsEqual(value, other, undefined, customizer) : !!result;
          }
          function isError(value) {
            if (!isObjectLike(value)) return false;
            var tag = baseGetTag(value);
            return tag == errorTag || tag == domExcTag || "string" == typeof value.message && "string" == typeof value.name && !isPlainObject(value);
          }
          function isFinite(value) {
            return "number" == typeof value && nativeIsFinite(value);
          }
          function isFunction(value) {
            if (!isObject(value)) return false;
            var tag = baseGetTag(value);
            return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
          }
          function isInteger(value) {
            return "number" == typeof value && value == toInteger(value);
          }
          function isLength(value) {
            return "number" == typeof value && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
          }
          function isObject(value) {
            var type = typeof value;
            return null != value && ("object" == type || "function" == type);
          }
          function isObjectLike(value) {
            return null != value && "object" == typeof value;
          }
          var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
          function isMatch(object, source) {
            return object === source || baseIsMatch(object, source, getMatchData(source));
          }
          function isMatchWith(object, source, customizer) {
            customizer = "function" == typeof customizer ? customizer : undefined;
            return baseIsMatch(object, source, getMatchData(source), customizer);
          }
          function isNaN(value) {
            return isNumber(value) && value != +value;
          }
          function isNative(value) {
            if (isMaskable(value)) throw new Error(CORE_ERROR_TEXT);
            return baseIsNative(value);
          }
          function isNull(value) {
            return null === value;
          }
          function isNil(value) {
            return null == value;
          }
          function isNumber(value) {
            return "number" == typeof value || isObjectLike(value) && baseGetTag(value) == numberTag;
          }
          function isPlainObject(value) {
            if (!isObjectLike(value) || baseGetTag(value) != objectTag) return false;
            var proto = getPrototype(value);
            if (null === proto) return true;
            var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
            return "function" == typeof Ctor && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
          }
          var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
          function isSafeInteger(value) {
            return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
          }
          var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
          function isString(value) {
            return "string" == typeof value || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
          }
          function isSymbol(value) {
            return "symbol" == typeof value || isObjectLike(value) && baseGetTag(value) == symbolTag;
          }
          var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
          function isUndefined(value) {
            return value === undefined;
          }
          function isWeakMap(value) {
            return isObjectLike(value) && getTag(value) == weakMapTag;
          }
          function isWeakSet(value) {
            return isObjectLike(value) && baseGetTag(value) == weakSetTag;
          }
          var lt = createRelationalOperation(baseLt);
          var lte = createRelationalOperation(function(value, other) {
            return value <= other;
          });
          function toArray(value) {
            if (!value) return [];
            if (isArrayLike(value)) return isString(value) ? stringToArray(value) : copyArray(value);
            if (symIterator && value[symIterator]) return iteratorToArray(value[symIterator]());
            var tag = getTag(value), func = tag == mapTag ? mapToArray : tag == setTag ? setToArray : values;
            return func(value);
          }
          function toFinite(value) {
            if (!value) return 0 === value ? value : 0;
            value = toNumber(value);
            if (value === INFINITY || value === -INFINITY) {
              var sign = value < 0 ? -1 : 1;
              return sign * MAX_INTEGER;
            }
            return value === value ? value : 0;
          }
          function toInteger(value) {
            var result = toFinite(value), remainder = result % 1;
            return result === result ? remainder ? result - remainder : result : 0;
          }
          function toLength(value) {
            return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
          }
          function toNumber(value) {
            if ("number" == typeof value) return value;
            if (isSymbol(value)) return NAN;
            if (isObject(value)) {
              var other = "function" == typeof value.valueOf ? value.valueOf() : value;
              value = isObject(other) ? other + "" : other;
            }
            if ("string" != typeof value) return 0 === value ? value : +value;
            value = value.replace(reTrim, "");
            var isBinary = reIsBinary.test(value);
            return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
          }
          function toPlainObject(value) {
            return copyObject(value, keysIn(value));
          }
          function toSafeInteger(value) {
            return baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
          }
          function toString(value) {
            return null == value ? "" : baseToString(value);
          }
          var assign = createAssigner(function(object, source) {
            if (isPrototype(source) || isArrayLike(source)) {
              copyObject(source, keys(source), object);
              return;
            }
            for (var key in source) hasOwnProperty.call(source, key) && assignValue(object, key, source[key]);
          });
          var assignIn = createAssigner(function(object, source) {
            copyObject(source, keysIn(source), object);
          });
          var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
            copyObject(source, keysIn(source), object, customizer);
          });
          var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
            copyObject(source, keys(source), object, customizer);
          });
          var at = flatRest(baseAt);
          function create(prototype, properties) {
            var result = baseCreate(prototype);
            return null == properties ? result : baseAssign(result, properties);
          }
          var defaults = baseRest(function(args) {
            args.push(undefined, assignInDefaults);
            return apply(assignInWith, undefined, args);
          });
          var defaultsDeep = baseRest(function(args) {
            args.push(undefined, mergeDefaults);
            return apply(mergeWith, undefined, args);
          });
          function findKey(object, predicate) {
            return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
          }
          function findLastKey(object, predicate) {
            return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
          }
          function forIn(object, iteratee) {
            return null == object ? object : baseFor(object, getIteratee(iteratee, 3), keysIn);
          }
          function forInRight(object, iteratee) {
            return null == object ? object : baseForRight(object, getIteratee(iteratee, 3), keysIn);
          }
          function forOwn(object, iteratee) {
            return object && baseForOwn(object, getIteratee(iteratee, 3));
          }
          function forOwnRight(object, iteratee) {
            return object && baseForOwnRight(object, getIteratee(iteratee, 3));
          }
          function functions(object) {
            return null == object ? [] : baseFunctions(object, keys(object));
          }
          function functionsIn(object) {
            return null == object ? [] : baseFunctions(object, keysIn(object));
          }
          function get(object, path, defaultValue) {
            var result = null == object ? undefined : baseGet(object, path);
            return result === undefined ? defaultValue : result;
          }
          function has(object, path) {
            return null != object && hasPath(object, path, baseHas);
          }
          function hasIn(object, path) {
            return null != object && hasPath(object, path, baseHasIn);
          }
          var invert = createInverter(function(result, value, key) {
            result[value] = key;
          }, constant(identity));
          var invertBy = createInverter(function(result, value, key) {
            hasOwnProperty.call(result, value) ? result[value].push(key) : result[value] = [ key ];
          }, getIteratee);
          var invoke = baseRest(baseInvoke);
          function keys(object) {
            return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
          }
          function keysIn(object) {
            return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
          }
          function mapKeys(object, iteratee) {
            var result = {};
            iteratee = getIteratee(iteratee, 3);
            baseForOwn(object, function(value, key, object) {
              baseAssignValue(result, iteratee(value, key, object), value);
            });
            return result;
          }
          function mapValues(object, iteratee) {
            var result = {};
            iteratee = getIteratee(iteratee, 3);
            baseForOwn(object, function(value, key, object) {
              baseAssignValue(result, key, iteratee(value, key, object));
            });
            return result;
          }
          var merge = createAssigner(function(object, source, srcIndex) {
            baseMerge(object, source, srcIndex);
          });
          var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
            baseMerge(object, source, srcIndex, customizer);
          });
          var omit = flatRest(function(object, paths) {
            var result = {};
            if (null == object) return result;
            var isDeep = false;
            paths = arrayMap(paths, function(path) {
              path = castPath(path, object);
              isDeep || (isDeep = path.length > 1);
              return path;
            });
            copyObject(object, getAllKeysIn(object), result);
            isDeep && (result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG));
            var length = paths.length;
            while (length--) baseUnset(result, paths[length]);
            return result;
          });
          function omitBy(object, predicate) {
            return pickBy(object, negate(getIteratee(predicate)));
          }
          var pick = flatRest(function(object, paths) {
            return null == object ? {} : basePick(object, paths);
          });
          function pickBy(object, predicate) {
            if (null == object) return {};
            var props = arrayMap(getAllKeysIn(object), function(prop) {
              return [ prop ];
            });
            predicate = getIteratee(predicate);
            return basePickBy(object, props, function(value, path) {
              return predicate(value, path[0]);
            });
          }
          function result(object, path, defaultValue) {
            path = castPath(path, object);
            var index = -1, length = path.length;
            if (!length) {
              length = 1;
              object = undefined;
            }
            while (++index < length) {
              var value = null == object ? undefined : object[toKey(path[index])];
              if (value === undefined) {
                index = length;
                value = defaultValue;
              }
              object = isFunction(value) ? value.call(object) : value;
            }
            return object;
          }
          function set(object, path, value) {
            return null == object ? object : baseSet(object, path, value);
          }
          function setWith(object, path, value, customizer) {
            customizer = "function" == typeof customizer ? customizer : undefined;
            return null == object ? object : baseSet(object, path, value, customizer);
          }
          var toPairs = createToPairs(keys);
          var toPairsIn = createToPairs(keysIn);
          function transform(object, iteratee, accumulator) {
            var isArr = isArray(object), isArrLike = isArr || isBuffer(object) || isTypedArray(object);
            iteratee = getIteratee(iteratee, 4);
            if (null == accumulator) {
              var Ctor = object && object.constructor;
              accumulator = isArrLike ? isArr ? new Ctor() : [] : isObject(object) && isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
            }
            (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
              return iteratee(accumulator, value, index, object);
            });
            return accumulator;
          }
          function unset(object, path) {
            return null == object || baseUnset(object, path);
          }
          function update(object, path, updater) {
            return null == object ? object : baseUpdate(object, path, castFunction(updater));
          }
          function updateWith(object, path, updater, customizer) {
            customizer = "function" == typeof customizer ? customizer : undefined;
            return null == object ? object : baseUpdate(object, path, castFunction(updater), customizer);
          }
          function values(object) {
            return null == object ? [] : baseValues(object, keys(object));
          }
          function valuesIn(object) {
            return null == object ? [] : baseValues(object, keysIn(object));
          }
          function clamp(number, lower, upper) {
            if (upper === undefined) {
              upper = lower;
              lower = undefined;
            }
            if (upper !== undefined) {
              upper = toNumber(upper);
              upper = upper === upper ? upper : 0;
            }
            if (lower !== undefined) {
              lower = toNumber(lower);
              lower = lower === lower ? lower : 0;
            }
            return baseClamp(toNumber(number), lower, upper);
          }
          function inRange(number, start, end) {
            start = toFinite(start);
            if (end === undefined) {
              end = start;
              start = 0;
            } else end = toFinite(end);
            number = toNumber(number);
            return baseInRange(number, start, end);
          }
          function random(lower, upper, floating) {
            floating && "boolean" != typeof floating && isIterateeCall(lower, upper, floating) && (upper = floating = undefined);
            if (floating === undefined) if ("boolean" == typeof upper) {
              floating = upper;
              upper = undefined;
            } else if ("boolean" == typeof lower) {
              floating = lower;
              lower = undefined;
            }
            if (lower === undefined && upper === undefined) {
              lower = 0;
              upper = 1;
            } else {
              lower = toFinite(lower);
              if (upper === undefined) {
                upper = lower;
                lower = 0;
              } else upper = toFinite(upper);
            }
            if (lower > upper) {
              var temp = lower;
              lower = upper;
              upper = temp;
            }
            if (floating || lower % 1 || upper % 1) {
              var rand = nativeRandom();
              return nativeMin(lower + rand * (upper - lower + freeParseFloat("1e-" + ((rand + "").length - 1))), upper);
            }
            return baseRandom(lower, upper);
          }
          var camelCase = createCompounder(function(result, word, index) {
            word = word.toLowerCase();
            return result + (index ? capitalize(word) : word);
          });
          function capitalize(string) {
            return upperFirst(toString(string).toLowerCase());
          }
          function deburr(string) {
            string = toString(string);
            return string && string.replace(reLatin, deburrLetter).replace(reComboMark, "");
          }
          function endsWith(string, target, position) {
            string = toString(string);
            target = baseToString(target);
            var length = string.length;
            position = position === undefined ? length : baseClamp(toInteger(position), 0, length);
            var end = position;
            position -= target.length;
            return position >= 0 && string.slice(position, end) == target;
          }
          function escape(string) {
            string = toString(string);
            return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
          }
          function escapeRegExp(string) {
            string = toString(string);
            return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string;
          }
          var kebabCase = createCompounder(function(result, word, index) {
            return result + (index ? "-" : "") + word.toLowerCase();
          });
          var lowerCase = createCompounder(function(result, word, index) {
            return result + (index ? " " : "") + word.toLowerCase();
          });
          var lowerFirst = createCaseFirst("toLowerCase");
          function pad(string, length, chars) {
            string = toString(string);
            length = toInteger(length);
            var strLength = length ? stringSize(string) : 0;
            if (!length || strLength >= length) return string;
            var mid = (length - strLength) / 2;
            return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars);
          }
          function padEnd(string, length, chars) {
            string = toString(string);
            length = toInteger(length);
            var strLength = length ? stringSize(string) : 0;
            return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
          }
          function padStart(string, length, chars) {
            string = toString(string);
            length = toInteger(length);
            var strLength = length ? stringSize(string) : 0;
            return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
          }
          function parseInt(string, radix, guard) {
            guard || null == radix ? radix = 0 : radix && (radix = +radix);
            return nativeParseInt(toString(string).replace(reTrimStart, ""), radix || 0);
          }
          function repeat(string, n, guard) {
            n = (guard ? isIterateeCall(string, n, guard) : n === undefined) ? 1 : toInteger(n);
            return baseRepeat(toString(string), n);
          }
          function replace() {
            var args = arguments, string = toString(args[0]);
            return args.length < 3 ? string : string.replace(args[1], args[2]);
          }
          var snakeCase = createCompounder(function(result, word, index) {
            return result + (index ? "_" : "") + word.toLowerCase();
          });
          function split(string, separator, limit) {
            limit && "number" != typeof limit && isIterateeCall(string, separator, limit) && (separator = limit = undefined);
            limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0;
            if (!limit) return [];
            string = toString(string);
            if (string && ("string" == typeof separator || null != separator && !isRegExp(separator))) {
              separator = baseToString(separator);
              if (!separator && hasUnicode(string)) return castSlice(stringToArray(string), 0, limit);
            }
            return string.split(separator, limit);
          }
          var startCase = createCompounder(function(result, word, index) {
            return result + (index ? " " : "") + upperFirst(word);
          });
          function startsWith(string, target, position) {
            string = toString(string);
            position = baseClamp(toInteger(position), 0, string.length);
            target = baseToString(target);
            return string.slice(position, position + target.length) == target;
          }
          function template(string, options, guard) {
            var settings = lodash.templateSettings;
            guard && isIterateeCall(string, options, guard) && (options = undefined);
            string = toString(string);
            options = assignInWith({}, options, settings, assignInDefaults);
            var imports = assignInWith({}, options.imports, settings.imports, assignInDefaults), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
            var isEscaping, isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
            var reDelimiters = RegExp((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g");
            var sourceURL = "//# sourceURL=" + ("sourceURL" in options ? options.sourceURL : "lodash.templateSources[" + ++templateCounter + "]") + "\n";
            string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
              interpolateValue || (interpolateValue = esTemplateValue);
              source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
              if (escapeValue) {
                isEscaping = true;
                source += "' +\n__e(" + escapeValue + ") +\n'";
              }
              if (evaluateValue) {
                isEvaluating = true;
                source += "';\n" + evaluateValue + ";\n__p += '";
              }
              interpolateValue && (source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'");
              index = offset + match.length;
              return match;
            });
            source += "';\n";
            var variable = options.variable;
            variable || (source = "with (obj) {\n" + source + "\n}\n");
            source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
            source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
            var result = attempt(function() {
              return Function(importsKeys, sourceURL + "return " + source).apply(undefined, importsValues);
            });
            result.source = source;
            if (isError(result)) throw result;
            return result;
          }
          function toLower(value) {
            return toString(value).toLowerCase();
          }
          function toUpper(value) {
            return toString(value).toUpperCase();
          }
          function trim(string, chars, guard) {
            string = toString(string);
            if (string && (guard || chars === undefined)) return string.replace(reTrim, "");
            if (!string || !(chars = baseToString(chars))) return string;
            var strSymbols = stringToArray(string), chrSymbols = stringToArray(chars), start = charsStartIndex(strSymbols, chrSymbols), end = charsEndIndex(strSymbols, chrSymbols) + 1;
            return castSlice(strSymbols, start, end).join("");
          }
          function trimEnd(string, chars, guard) {
            string = toString(string);
            if (string && (guard || chars === undefined)) return string.replace(reTrimEnd, "");
            if (!string || !(chars = baseToString(chars))) return string;
            var strSymbols = stringToArray(string), end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
            return castSlice(strSymbols, 0, end).join("");
          }
          function trimStart(string, chars, guard) {
            string = toString(string);
            if (string && (guard || chars === undefined)) return string.replace(reTrimStart, "");
            if (!string || !(chars = baseToString(chars))) return string;
            var strSymbols = stringToArray(string), start = charsStartIndex(strSymbols, stringToArray(chars));
            return castSlice(strSymbols, start).join("");
          }
          function truncate(string, options) {
            var length = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_TRUNC_OMISSION;
            if (isObject(options)) {
              var separator = "separator" in options ? options.separator : separator;
              length = "length" in options ? toInteger(options.length) : length;
              omission = "omission" in options ? baseToString(options.omission) : omission;
            }
            string = toString(string);
            var strLength = string.length;
            if (hasUnicode(string)) {
              var strSymbols = stringToArray(string);
              strLength = strSymbols.length;
            }
            if (length >= strLength) return string;
            var end = length - stringSize(omission);
            if (end < 1) return omission;
            var result = strSymbols ? castSlice(strSymbols, 0, end).join("") : string.slice(0, end);
            if (separator === undefined) return result + omission;
            strSymbols && (end += result.length - end);
            if (isRegExp(separator)) {
              if (string.slice(end).search(separator)) {
                var match, substring = result;
                separator.global || (separator = RegExp(separator.source, toString(reFlags.exec(separator)) + "g"));
                separator.lastIndex = 0;
                while (match = separator.exec(substring)) var newEnd = match.index;
                result = result.slice(0, newEnd === undefined ? end : newEnd);
              }
            } else if (string.indexOf(baseToString(separator), end) != end) {
              var index = result.lastIndexOf(separator);
              index > -1 && (result = result.slice(0, index));
            }
            return result + omission;
          }
          function unescape(string) {
            string = toString(string);
            return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
          }
          var upperCase = createCompounder(function(result, word, index) {
            return result + (index ? " " : "") + word.toUpperCase();
          });
          var upperFirst = createCaseFirst("toUpperCase");
          function words(string, pattern, guard) {
            string = toString(string);
            pattern = guard ? undefined : pattern;
            if (pattern === undefined) return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
            return string.match(pattern) || [];
          }
          var attempt = baseRest(function(func, args) {
            try {
              return apply(func, undefined, args);
            } catch (e) {
              return isError(e) ? e : new Error(e);
            }
          });
          var bindAll = flatRest(function(object, methodNames) {
            arrayEach(methodNames, function(key) {
              key = toKey(key);
              baseAssignValue(object, key, bind(object[key], object));
            });
            return object;
          });
          function cond(pairs) {
            var length = null == pairs ? 0 : pairs.length, toIteratee = getIteratee();
            pairs = length ? arrayMap(pairs, function(pair) {
              if ("function" != typeof pair[1]) throw new TypeError(FUNC_ERROR_TEXT);
              return [ toIteratee(pair[0]), pair[1] ];
            }) : [];
            return baseRest(function(args) {
              var index = -1;
              while (++index < length) {
                var pair = pairs[index];
                if (apply(pair[0], this, args)) return apply(pair[1], this, args);
              }
            });
          }
          function conforms(source) {
            return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
          }
          function constant(value) {
            return function() {
              return value;
            };
          }
          function defaultTo(value, defaultValue) {
            return null == value || value !== value ? defaultValue : value;
          }
          var flow = createFlow();
          var flowRight = createFlow(true);
          function identity(value) {
            return value;
          }
          function iteratee(func) {
            return baseIteratee("function" == typeof func ? func : baseClone(func, CLONE_DEEP_FLAG));
          }
          function matches(source) {
            return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
          }
          function matchesProperty(path, srcValue) {
            return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
          }
          var method = baseRest(function(path, args) {
            return function(object) {
              return baseInvoke(object, path, args);
            };
          });
          var methodOf = baseRest(function(object, args) {
            return function(path) {
              return baseInvoke(object, path, args);
            };
          });
          function mixin(object, source, options) {
            var props = keys(source), methodNames = baseFunctions(source, props);
            if (null == options && !(isObject(source) && (methodNames.length || !props.length))) {
              options = source;
              source = object;
              object = this;
              methodNames = baseFunctions(source, keys(source));
            }
            var chain = !(isObject(options) && "chain" in options) || !!options.chain, isFunc = isFunction(object);
            arrayEach(methodNames, function(methodName) {
              var func = source[methodName];
              object[methodName] = func;
              isFunc && (object.prototype[methodName] = function() {
                var chainAll = this.__chain__;
                if (chain || chainAll) {
                  var result = object(this.__wrapped__), actions = result.__actions__ = copyArray(this.__actions__);
                  actions.push({
                    func: func,
                    args: arguments,
                    thisArg: object
                  });
                  result.__chain__ = chainAll;
                  return result;
                }
                return func.apply(object, arrayPush([ this.value() ], arguments));
              });
            });
            return object;
          }
          function noConflict() {
            root._ === this && (root._ = oldDash);
            return this;
          }
          function noop() {}
          function nthArg(n) {
            n = toInteger(n);
            return baseRest(function(args) {
              return baseNth(args, n);
            });
          }
          var over = createOver(arrayMap);
          var overEvery = createOver(arrayEvery);
          var overSome = createOver(arraySome);
          function property(path) {
            return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
          }
          function propertyOf(object) {
            return function(path) {
              return null == object ? undefined : baseGet(object, path);
            };
          }
          var range = createRange();
          var rangeRight = createRange(true);
          function stubArray() {
            return [];
          }
          function stubFalse() {
            return false;
          }
          function stubObject() {
            return {};
          }
          function stubString() {
            return "";
          }
          function stubTrue() {
            return true;
          }
          function times(n, iteratee) {
            n = toInteger(n);
            if (n < 1 || n > MAX_SAFE_INTEGER) return [];
            var index = MAX_ARRAY_LENGTH, length = nativeMin(n, MAX_ARRAY_LENGTH);
            iteratee = getIteratee(iteratee);
            n -= MAX_ARRAY_LENGTH;
            var result = baseTimes(length, iteratee);
            while (++index < n) iteratee(index);
            return result;
          }
          function toPath(value) {
            if (isArray(value)) return arrayMap(value, toKey);
            return isSymbol(value) ? [ value ] : copyArray(stringToPath(toString(value)));
          }
          function uniqueId(prefix) {
            var id = ++idCounter;
            return toString(prefix) + id;
          }
          var add = createMathOperation(function(augend, addend) {
            return augend + addend;
          }, 0);
          var ceil = createRound("ceil");
          var divide = createMathOperation(function(dividend, divisor) {
            return dividend / divisor;
          }, 1);
          var floor = createRound("floor");
          function max(array) {
            return array && array.length ? baseExtremum(array, identity, baseGt) : undefined;
          }
          function maxBy(array, iteratee) {
            return array && array.length ? baseExtremum(array, getIteratee(iteratee, 2), baseGt) : undefined;
          }
          function mean(array) {
            return baseMean(array, identity);
          }
          function meanBy(array, iteratee) {
            return baseMean(array, getIteratee(iteratee, 2));
          }
          function min(array) {
            return array && array.length ? baseExtremum(array, identity, baseLt) : undefined;
          }
          function minBy(array, iteratee) {
            return array && array.length ? baseExtremum(array, getIteratee(iteratee, 2), baseLt) : undefined;
          }
          var multiply = createMathOperation(function(multiplier, multiplicand) {
            return multiplier * multiplicand;
          }, 1);
          var round = createRound("round");
          var subtract = createMathOperation(function(minuend, subtrahend) {
            return minuend - subtrahend;
          }, 0);
          function sum(array) {
            return array && array.length ? baseSum(array, identity) : 0;
          }
          function sumBy(array, iteratee) {
            return array && array.length ? baseSum(array, getIteratee(iteratee, 2)) : 0;
          }
          lodash.after = after;
          lodash.ary = ary;
          lodash.assign = assign;
          lodash.assignIn = assignIn;
          lodash.assignInWith = assignInWith;
          lodash.assignWith = assignWith;
          lodash.at = at;
          lodash.before = before;
          lodash.bind = bind;
          lodash.bindAll = bindAll;
          lodash.bindKey = bindKey;
          lodash.castArray = castArray;
          lodash.chain = chain;
          lodash.chunk = chunk;
          lodash.compact = compact;
          lodash.concat = concat;
          lodash.cond = cond;
          lodash.conforms = conforms;
          lodash.constant = constant;
          lodash.countBy = countBy;
          lodash.create = create;
          lodash.curry = curry;
          lodash.curryRight = curryRight;
          lodash.debounce = debounce;
          lodash.defaults = defaults;
          lodash.defaultsDeep = defaultsDeep;
          lodash.defer = defer;
          lodash.delay = delay;
          lodash.difference = difference;
          lodash.differenceBy = differenceBy;
          lodash.differenceWith = differenceWith;
          lodash.drop = drop;
          lodash.dropRight = dropRight;
          lodash.dropRightWhile = dropRightWhile;
          lodash.dropWhile = dropWhile;
          lodash.fill = fill;
          lodash.filter = filter;
          lodash.flatMap = flatMap;
          lodash.flatMapDeep = flatMapDeep;
          lodash.flatMapDepth = flatMapDepth;
          lodash.flatten = flatten;
          lodash.flattenDeep = flattenDeep;
          lodash.flattenDepth = flattenDepth;
          lodash.flip = flip;
          lodash.flow = flow;
          lodash.flowRight = flowRight;
          lodash.fromPairs = fromPairs;
          lodash.functions = functions;
          lodash.functionsIn = functionsIn;
          lodash.groupBy = groupBy;
          lodash.initial = initial;
          lodash.intersection = intersection;
          lodash.intersectionBy = intersectionBy;
          lodash.intersectionWith = intersectionWith;
          lodash.invert = invert;
          lodash.invertBy = invertBy;
          lodash.invokeMap = invokeMap;
          lodash.iteratee = iteratee;
          lodash.keyBy = keyBy;
          lodash.keys = keys;
          lodash.keysIn = keysIn;
          lodash.map = map;
          lodash.mapKeys = mapKeys;
          lodash.mapValues = mapValues;
          lodash.matches = matches;
          lodash.matchesProperty = matchesProperty;
          lodash.memoize = memoize;
          lodash.merge = merge;
          lodash.mergeWith = mergeWith;
          lodash.method = method;
          lodash.methodOf = methodOf;
          lodash.mixin = mixin;
          lodash.negate = negate;
          lodash.nthArg = nthArg;
          lodash.omit = omit;
          lodash.omitBy = omitBy;
          lodash.once = once;
          lodash.orderBy = orderBy;
          lodash.over = over;
          lodash.overArgs = overArgs;
          lodash.overEvery = overEvery;
          lodash.overSome = overSome;
          lodash.partial = partial;
          lodash.partialRight = partialRight;
          lodash.partition = partition;
          lodash.pick = pick;
          lodash.pickBy = pickBy;
          lodash.property = property;
          lodash.propertyOf = propertyOf;
          lodash.pull = pull;
          lodash.pullAll = pullAll;
          lodash.pullAllBy = pullAllBy;
          lodash.pullAllWith = pullAllWith;
          lodash.pullAt = pullAt;
          lodash.range = range;
          lodash.rangeRight = rangeRight;
          lodash.rearg = rearg;
          lodash.reject = reject;
          lodash.remove = remove;
          lodash.rest = rest;
          lodash.reverse = reverse;
          lodash.sampleSize = sampleSize;
          lodash.set = set;
          lodash.setWith = setWith;
          lodash.shuffle = shuffle;
          lodash.slice = slice;
          lodash.sortBy = sortBy;
          lodash.sortedUniq = sortedUniq;
          lodash.sortedUniqBy = sortedUniqBy;
          lodash.split = split;
          lodash.spread = spread;
          lodash.tail = tail;
          lodash.take = take;
          lodash.takeRight = takeRight;
          lodash.takeRightWhile = takeRightWhile;
          lodash.takeWhile = takeWhile;
          lodash.tap = tap;
          lodash.throttle = throttle;
          lodash.thru = thru;
          lodash.toArray = toArray;
          lodash.toPairs = toPairs;
          lodash.toPairsIn = toPairsIn;
          lodash.toPath = toPath;
          lodash.toPlainObject = toPlainObject;
          lodash.transform = transform;
          lodash.unary = unary;
          lodash.union = union;
          lodash.unionBy = unionBy;
          lodash.unionWith = unionWith;
          lodash.uniq = uniq;
          lodash.uniqBy = uniqBy;
          lodash.uniqWith = uniqWith;
          lodash.unset = unset;
          lodash.unzip = unzip;
          lodash.unzipWith = unzipWith;
          lodash.update = update;
          lodash.updateWith = updateWith;
          lodash.values = values;
          lodash.valuesIn = valuesIn;
          lodash.without = without;
          lodash.words = words;
          lodash.wrap = wrap;
          lodash.xor = xor;
          lodash.xorBy = xorBy;
          lodash.xorWith = xorWith;
          lodash.zip = zip;
          lodash.zipObject = zipObject;
          lodash.zipObjectDeep = zipObjectDeep;
          lodash.zipWith = zipWith;
          lodash.entries = toPairs;
          lodash.entriesIn = toPairsIn;
          lodash.extend = assignIn;
          lodash.extendWith = assignInWith;
          mixin(lodash, lodash);
          lodash.add = add;
          lodash.attempt = attempt;
          lodash.camelCase = camelCase;
          lodash.capitalize = capitalize;
          lodash.ceil = ceil;
          lodash.clamp = clamp;
          lodash.clone = clone;
          lodash.cloneDeep = cloneDeep;
          lodash.cloneDeepWith = cloneDeepWith;
          lodash.cloneWith = cloneWith;
          lodash.conformsTo = conformsTo;
          lodash.deburr = deburr;
          lodash.defaultTo = defaultTo;
          lodash.divide = divide;
          lodash.endsWith = endsWith;
          lodash.eq = eq;
          lodash.escape = escape;
          lodash.escapeRegExp = escapeRegExp;
          lodash.every = every;
          lodash.find = find;
          lodash.findIndex = findIndex;
          lodash.findKey = findKey;
          lodash.findLast = findLast;
          lodash.findLastIndex = findLastIndex;
          lodash.findLastKey = findLastKey;
          lodash.floor = floor;
          lodash.forEach = forEach;
          lodash.forEachRight = forEachRight;
          lodash.forIn = forIn;
          lodash.forInRight = forInRight;
          lodash.forOwn = forOwn;
          lodash.forOwnRight = forOwnRight;
          lodash.get = get;
          lodash.gt = gt;
          lodash.gte = gte;
          lodash.has = has;
          lodash.hasIn = hasIn;
          lodash.head = head;
          lodash.identity = identity;
          lodash.includes = includes;
          lodash.indexOf = indexOf;
          lodash.inRange = inRange;
          lodash.invoke = invoke;
          lodash.isArguments = isArguments;
          lodash.isArray = isArray;
          lodash.isArrayBuffer = isArrayBuffer;
          lodash.isArrayLike = isArrayLike;
          lodash.isArrayLikeObject = isArrayLikeObject;
          lodash.isBoolean = isBoolean;
          lodash.isBuffer = isBuffer;
          lodash.isDate = isDate;
          lodash.isElement = isElement;
          lodash.isEmpty = isEmpty;
          lodash.isEqual = isEqual;
          lodash.isEqualWith = isEqualWith;
          lodash.isError = isError;
          lodash.isFinite = isFinite;
          lodash.isFunction = isFunction;
          lodash.isInteger = isInteger;
          lodash.isLength = isLength;
          lodash.isMap = isMap;
          lodash.isMatch = isMatch;
          lodash.isMatchWith = isMatchWith;
          lodash.isNaN = isNaN;
          lodash.isNative = isNative;
          lodash.isNil = isNil;
          lodash.isNull = isNull;
          lodash.isNumber = isNumber;
          lodash.isObject = isObject;
          lodash.isObjectLike = isObjectLike;
          lodash.isPlainObject = isPlainObject;
          lodash.isRegExp = isRegExp;
          lodash.isSafeInteger = isSafeInteger;
          lodash.isSet = isSet;
          lodash.isString = isString;
          lodash.isSymbol = isSymbol;
          lodash.isTypedArray = isTypedArray;
          lodash.isUndefined = isUndefined;
          lodash.isWeakMap = isWeakMap;
          lodash.isWeakSet = isWeakSet;
          lodash.join = join;
          lodash.kebabCase = kebabCase;
          lodash.last = last;
          lodash.lastIndexOf = lastIndexOf;
          lodash.lowerCase = lowerCase;
          lodash.lowerFirst = lowerFirst;
          lodash.lt = lt;
          lodash.lte = lte;
          lodash.max = max;
          lodash.maxBy = maxBy;
          lodash.mean = mean;
          lodash.meanBy = meanBy;
          lodash.min = min;
          lodash.minBy = minBy;
          lodash.stubArray = stubArray;
          lodash.stubFalse = stubFalse;
          lodash.stubObject = stubObject;
          lodash.stubString = stubString;
          lodash.stubTrue = stubTrue;
          lodash.multiply = multiply;
          lodash.nth = nth;
          lodash.noConflict = noConflict;
          lodash.noop = noop;
          lodash.now = now;
          lodash.pad = pad;
          lodash.padEnd = padEnd;
          lodash.padStart = padStart;
          lodash.parseInt = parseInt;
          lodash.random = random;
          lodash.reduce = reduce;
          lodash.reduceRight = reduceRight;
          lodash.repeat = repeat;
          lodash.replace = replace;
          lodash.result = result;
          lodash.round = round;
          lodash.runInContext = runInContext;
          lodash.sample = sample;
          lodash.size = size;
          lodash.snakeCase = snakeCase;
          lodash.some = some;
          lodash.sortedIndex = sortedIndex;
          lodash.sortedIndexBy = sortedIndexBy;
          lodash.sortedIndexOf = sortedIndexOf;
          lodash.sortedLastIndex = sortedLastIndex;
          lodash.sortedLastIndexBy = sortedLastIndexBy;
          lodash.sortedLastIndexOf = sortedLastIndexOf;
          lodash.startCase = startCase;
          lodash.startsWith = startsWith;
          lodash.subtract = subtract;
          lodash.sum = sum;
          lodash.sumBy = sumBy;
          lodash.template = template;
          lodash.times = times;
          lodash.toFinite = toFinite;
          lodash.toInteger = toInteger;
          lodash.toLength = toLength;
          lodash.toLower = toLower;
          lodash.toNumber = toNumber;
          lodash.toSafeInteger = toSafeInteger;
          lodash.toString = toString;
          lodash.toUpper = toUpper;
          lodash.trim = trim;
          lodash.trimEnd = trimEnd;
          lodash.trimStart = trimStart;
          lodash.truncate = truncate;
          lodash.unescape = unescape;
          lodash.uniqueId = uniqueId;
          lodash.upperCase = upperCase;
          lodash.upperFirst = upperFirst;
          lodash.each = forEach;
          lodash.eachRight = forEachRight;
          lodash.first = head;
          mixin(lodash, function() {
            var source = {};
            baseForOwn(lodash, function(func, methodName) {
              hasOwnProperty.call(lodash.prototype, methodName) || (source[methodName] = func);
            });
            return source;
          }(), {
            chain: false
          });
          lodash.VERSION = VERSION;
          arrayEach([ "bind", "bindKey", "curry", "curryRight", "partial", "partialRight" ], function(methodName) {
            lodash[methodName].placeholder = lodash;
          });
          arrayEach([ "drop", "take" ], function(methodName, index) {
            LazyWrapper.prototype[methodName] = function(n) {
              var filtered = this.__filtered__;
              if (filtered && !index) return new LazyWrapper(this);
              n = n === undefined ? 1 : nativeMax(toInteger(n), 0);
              var result = this.clone();
              filtered ? result.__takeCount__ = nativeMin(n, result.__takeCount__) : result.__views__.push({
                size: nativeMin(n, MAX_ARRAY_LENGTH),
                type: methodName + (result.__dir__ < 0 ? "Right" : "")
              });
              return result;
            };
            LazyWrapper.prototype[methodName + "Right"] = function(n) {
              return this.reverse()[methodName](n).reverse();
            };
          });
          arrayEach([ "filter", "map", "takeWhile" ], function(methodName, index) {
            var type = index + 1, isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
            LazyWrapper.prototype[methodName] = function(iteratee) {
              var result = this.clone();
              result.__iteratees__.push({
                iteratee: getIteratee(iteratee, 3),
                type: type
              });
              result.__filtered__ = result.__filtered__ || isFilter;
              return result;
            };
          });
          arrayEach([ "head", "last" ], function(methodName, index) {
            var takeName = "take" + (index ? "Right" : "");
            LazyWrapper.prototype[methodName] = function() {
              return this[takeName](1).value()[0];
            };
          });
          arrayEach([ "initial", "tail" ], function(methodName, index) {
            var dropName = "drop" + (index ? "" : "Right");
            LazyWrapper.prototype[methodName] = function() {
              return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
            };
          });
          LazyWrapper.prototype.compact = function() {
            return this.filter(identity);
          };
          LazyWrapper.prototype.find = function(predicate) {
            return this.filter(predicate).head();
          };
          LazyWrapper.prototype.findLast = function(predicate) {
            return this.reverse().find(predicate);
          };
          LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
            if ("function" == typeof path) return new LazyWrapper(this);
            return this.map(function(value) {
              return baseInvoke(value, path, args);
            });
          });
          LazyWrapper.prototype.reject = function(predicate) {
            return this.filter(negate(getIteratee(predicate)));
          };
          LazyWrapper.prototype.slice = function(start, end) {
            start = toInteger(start);
            var result = this;
            if (result.__filtered__ && (start > 0 || end < 0)) return new LazyWrapper(result);
            start < 0 ? result = result.takeRight(-start) : start && (result = result.drop(start));
            if (end !== undefined) {
              end = toInteger(end);
              result = end < 0 ? result.dropRight(-end) : result.take(end - start);
            }
            return result;
          };
          LazyWrapper.prototype.takeRightWhile = function(predicate) {
            return this.reverse().takeWhile(predicate).reverse();
          };
          LazyWrapper.prototype.toArray = function() {
            return this.take(MAX_ARRAY_LENGTH);
          };
          baseForOwn(LazyWrapper.prototype, function(func, methodName) {
            var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName), isTaker = /^(?:head|last)$/.test(methodName), lodashFunc = lodash[isTaker ? "take" + ("last" == methodName ? "Right" : "") : methodName], retUnwrapped = isTaker || /^find/.test(methodName);
            if (!lodashFunc) return;
            lodash.prototype[methodName] = function() {
              var value = this.__wrapped__, args = isTaker ? [ 1 ] : arguments, isLazy = value instanceof LazyWrapper, iteratee = args[0], useLazy = isLazy || isArray(value);
              var interceptor = function(value) {
                var result = lodashFunc.apply(lodash, arrayPush([ value ], args));
                return isTaker && chainAll ? result[0] : result;
              };
              useLazy && checkIteratee && "function" == typeof iteratee && 1 != iteratee.length && (isLazy = useLazy = false);
              var chainAll = this.__chain__, isHybrid = !!this.__actions__.length, isUnwrapped = retUnwrapped && !chainAll, onlyLazy = isLazy && !isHybrid;
              if (!retUnwrapped && useLazy) {
                value = onlyLazy ? value : new LazyWrapper(this);
                var result = func.apply(value, args);
                result.__actions__.push({
                  func: thru,
                  args: [ interceptor ],
                  thisArg: undefined
                });
                return new LodashWrapper(result, chainAll);
              }
              if (isUnwrapped && onlyLazy) return func.apply(this, args);
              result = this.thru(interceptor);
              return isUnwrapped ? isTaker ? result.value()[0] : result.value() : result;
            };
          });
          arrayEach([ "pop", "push", "shift", "sort", "splice", "unshift" ], function(methodName) {
            var func = arrayProto[methodName], chainName = /^(?:push|sort|unshift)$/.test(methodName) ? "tap" : "thru", retUnwrapped = /^(?:pop|shift)$/.test(methodName);
            lodash.prototype[methodName] = function() {
              var args = arguments;
              if (retUnwrapped && !this.__chain__) {
                var value = this.value();
                return func.apply(isArray(value) ? value : [], args);
              }
              return this[chainName](function(value) {
                return func.apply(isArray(value) ? value : [], args);
              });
            };
          });
          baseForOwn(LazyWrapper.prototype, function(func, methodName) {
            var lodashFunc = lodash[methodName];
            if (lodashFunc) {
              var key = lodashFunc.name + "", names = realNames[key] || (realNames[key] = []);
              names.push({
                name: methodName,
                func: lodashFunc
              });
            }
          });
          realNames[createHybrid(undefined, WRAP_BIND_KEY_FLAG).name] = [ {
            name: "wrapper",
            func: undefined
          } ];
          LazyWrapper.prototype.clone = lazyClone;
          LazyWrapper.prototype.reverse = lazyReverse;
          LazyWrapper.prototype.value = lazyValue;
          lodash.prototype.at = wrapperAt;
          lodash.prototype.chain = wrapperChain;
          lodash.prototype.commit = wrapperCommit;
          lodash.prototype.next = wrapperNext;
          lodash.prototype.plant = wrapperPlant;
          lodash.prototype.reverse = wrapperReverse;
          lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;
          lodash.prototype.first = lodash.prototype.head;
          symIterator && (lodash.prototype[symIterator] = wrapperToIterator);
          return lodash;
        };
        var _ = runInContext();
        if ("function" == typeof define && "object" == typeof define.amd && define.amd) {
          root._ = _;
          define(function() {
            return _;
          });
        } else if (freeModule) {
          (freeModule.exports = _)._ = _;
          freeExports._ = _;
        } else root._ = _;
      }).call(this);
    }).call(this, "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {} ],
  95: [ function(require, module, exports) {
    module.exports = {
      name: "cheerio",
      version: "0.20.0",
      description: "Tiny, fast, and elegant implementation of core jQuery designed specifically for the server",
      author: {
        name: "Matt Mueller",
        email: "mattmuelle@gmail.com",
        url: "mat.io"
      },
      license: "MIT",
      keywords: [ "htmlparser", "jquery", "selector", "scraper", "parser", "html" ],
      repository: {
        type: "git",
        url: "git://github.com/cheeriojs/cheerio.git"
      },
      main: "./index.js",
      files: [ "index.js", "lib" ],
      engines: {
        node: ">= 0.6"
      },
      dependencies: {
        "css-select": "~1.2.0",
        entities: "~1.1.1",
        htmlparser2: "~3.8.1",
        "dom-serializer": "~0.1.0",
        lodash: "^4.1.0",
        jsdom: "^7.0.2"
      },
      devDependencies: {
        benchmark: "~1.0.0",
        coveralls: "~2.10",
        "expect.js": "~0.3.1",
        istanbul: "~0.2",
        jshint: "~2.5.1",
        mocha: "*",
        xyz: "~0.5.0"
      },
      scripts: {
        test: "make test"
      },
      optionalDependencies: {
        jsdom: "^7.0.2"
      },
      gitHead: "c3ec1cd7bff41da0033bdc45375d77844f0f81c0",
      bugs: {
        url: "https://github.com/cheeriojs/cheerio/issues"
      },
      homepage: "https://github.com/cheeriojs/cheerio#readme",
      _id: "cheerio@0.20.0",
      _shasum: "5c710f2bab95653272842ba01c6ea61b3545ec35",
      _from: "cheerio@0.20.0",
      _npmVersion: "3.6.0",
      _nodeVersion: "5.5.0",
      _npmUser: {
        name: "feedic",
        email: "me@feedic.com"
      },
      dist: {
        shasum: "5c710f2bab95653272842ba01c6ea61b3545ec35",
        size: 29008,
        noattachment: false,
        tarball: "http://registry.npm.taobao.org/cheerio/download/cheerio-0.20.0.tgz"
      },
      maintainers: [ {
        name: "davidchambers",
        email: "dc@davidchambers.me"
      }, {
        name: "feedic",
        email: "me@feedic.com"
      }, {
        name: "jugglinmike",
        email: "mike@mikepennisi.com"
      }, {
        name: "mattmueller",
        email: "mattmuelle@gmail.com"
      } ],
      directories: {},
      publish_time: 1454324797919,
      _cnpm_publish_time: 1454324797919,
      _resolved: "http://registry.npm.taobao.org/cheerio/download/cheerio-0.20.0.tgz"
    };
  }, {} ],
  96: [ function(require, module, exports) {
    var ElementType = require("domelementtype");
    var re_whitespace = /\s+/g;
    var NodePrototype = require("./lib/node");
    var ElementPrototype = require("./lib/element");
    function DomHandler(callback, options, elementCB) {
      if ("object" === typeof callback) {
        elementCB = options;
        options = callback;
        callback = null;
      } else if ("function" === typeof options) {
        elementCB = options;
        options = defaultOpts;
      }
      this._callback = callback;
      this._options = options || defaultOpts;
      this._elementCB = elementCB;
      this.dom = [];
      this._done = false;
      this._tagStack = [];
      this._parser = this._parser || null;
    }
    var defaultOpts = {
      normalizeWhitespace: false,
      withStartIndices: false
    };
    DomHandler.prototype.onparserinit = function(parser) {
      this._parser = parser;
    };
    DomHandler.prototype.onreset = function() {
      DomHandler.call(this, this._callback, this._options, this._elementCB);
    };
    DomHandler.prototype.onend = function() {
      if (this._done) return;
      this._done = true;
      this._parser = null;
      this._handleCallback(null);
    };
    DomHandler.prototype._handleCallback = DomHandler.prototype.onerror = function(error) {
      if ("function" === typeof this._callback) this._callback(error, this.dom); else if (error) throw error;
    };
    DomHandler.prototype.onclosetag = function() {
      var elem = this._tagStack.pop();
      this._elementCB && this._elementCB(elem);
    };
    DomHandler.prototype._addDomElement = function(element) {
      var parent = this._tagStack[this._tagStack.length - 1];
      var siblings = parent ? parent.children : this.dom;
      var previousSibling = siblings[siblings.length - 1];
      element.next = null;
      this._options.withStartIndices && (element.startIndex = this._parser.startIndex);
      this._options.withDomLvl1 && (element.__proto__ = "tag" === element.type ? ElementPrototype : NodePrototype);
      if (previousSibling) {
        element.prev = previousSibling;
        previousSibling.next = element;
      } else element.prev = null;
      siblings.push(element);
      element.parent = parent || null;
    };
    DomHandler.prototype.onopentag = function(name, attribs) {
      var element = {
        type: "script" === name ? ElementType.Script : "style" === name ? ElementType.Style : ElementType.Tag,
        name: name,
        attribs: attribs,
        children: []
      };
      this._addDomElement(element);
      this._tagStack.push(element);
    };
    DomHandler.prototype.ontext = function(data) {
      var normalize = this._options.normalizeWhitespace || this._options.ignoreWhitespace;
      var lastTag;
      if (!this._tagStack.length && this.dom.length && (lastTag = this.dom[this.dom.length - 1]).type === ElementType.Text) normalize ? lastTag.data = (lastTag.data + data).replace(re_whitespace, " ") : lastTag.data += data; else if (this._tagStack.length && (lastTag = this._tagStack[this._tagStack.length - 1]) && (lastTag = lastTag.children[lastTag.children.length - 1]) && lastTag.type === ElementType.Text) normalize ? lastTag.data = (lastTag.data + data).replace(re_whitespace, " ") : lastTag.data += data; else {
        normalize && (data = data.replace(re_whitespace, " "));
        this._addDomElement({
          data: data,
          type: ElementType.Text
        });
      }
    };
    DomHandler.prototype.oncomment = function(data) {
      var lastTag = this._tagStack[this._tagStack.length - 1];
      if (lastTag && lastTag.type === ElementType.Comment) {
        lastTag.data += data;
        return;
      }
      var element = {
        data: data,
        type: ElementType.Comment
      };
      this._addDomElement(element);
      this._tagStack.push(element);
    };
    DomHandler.prototype.oncdatastart = function() {
      var element = {
        children: [ {
          data: "",
          type: ElementType.Text
        } ],
        type: ElementType.CDATA
      };
      this._addDomElement(element);
      this._tagStack.push(element);
    };
    DomHandler.prototype.oncommentend = DomHandler.prototype.oncdataend = function() {
      this._tagStack.pop();
    };
    DomHandler.prototype.onprocessinginstruction = function(name, data) {
      this._addDomElement({
        name: name,
        data: data,
        type: ElementType.Directive
      });
    };
    module.exports = DomHandler;
  }, {
    "./lib/element": 97,
    "./lib/node": 98,
    domelementtype: 99
  } ],
  97: [ function(require, module, exports) {
    var NodePrototype = require("./node");
    var ElementPrototype = module.exports = Object.create(NodePrototype);
    var domLvl1 = {
      tagName: "name"
    };
    Object.keys(domLvl1).forEach(function(key) {
      var shorthand = domLvl1[key];
      Object.defineProperty(ElementPrototype, key, {
        get: function() {
          return this[shorthand] || null;
        },
        set: function(val) {
          this[shorthand] = val;
          return val;
        }
      });
    });
  }, {
    "./node": 98
  } ],
  98: [ function(require, module, exports) {
    var NodePrototype = module.exports = {
      get firstChild() {
        var children = this.children;
        return children && children[0] || null;
      },
      get lastChild() {
        var children = this.children;
        return children && children[children.length - 1] || null;
      },
      get nodeType() {
        return nodeTypes[this.type] || nodeTypes.element;
      }
    };
    var domLvl1 = {
      tagName: "name",
      childNodes: "children",
      parentNode: "parent",
      previousSibling: "prev",
      nextSibling: "next",
      nodeValue: "data"
    };
    var nodeTypes = {
      element: 1,
      text: 3,
      cdata: 4,
      comment: 8
    };
    Object.keys(domLvl1).forEach(function(key) {
      var shorthand = domLvl1[key];
      Object.defineProperty(NodePrototype, key, {
        get: function() {
          return this[shorthand] || null;
        },
        set: function(val) {
          this[shorthand] = val;
          return val;
        }
      });
    });
  }, {} ],
  99: [ function(require, module, exports) {
    arguments[4][59][0].apply(exports, arguments);
  }, {
    dup: 59
  } ],
  Notification: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "02039ZP/URBDqOEAyLdcYUn", "Notification");
    "use strict";
    window.GameEvent = {
      GOAL_BULLET: "GOAL_BULLET"
    };
    window.Notification = {
      _eventMap: [],
      on: function on(type, callback, target) {
        void 0 === this._eventMap[type] && (this._eventMap[type] = []);
        this._eventMap[type].push({
          callback: callback,
          target: target,
          isonce: false
        });
      },
      once: function once(type, callback, target) {
        void 0 === this._eventMap[type] && (this._eventMap[type] = []);
        this._eventMap[type].push({
          callback: callback,
          target: target,
          isonce: true
        });
      },
      emit: function emit(type, parameter) {
        var array = this._eventMap[type];
        if (void 0 === array) return;
        for (var i = 0; i < array.length; i++) {
          var element = array[i];
          if (element) {
            element.callback.call(element.target, parameter);
            element.isonce && this.off(type, element.callback);
          }
        }
      },
      off: function off(type, callback) {
        var array = this._eventMap[type];
        if (void 0 === array) return;
        for (var i = 0; i < array.length; i++) {
          var element = array[i];
          if (element && element.callback === callback) {
            array[i] = void 0;
            break;
          }
        }
      },
      offType: function offType(type) {
        this._eventMap[type] = void 0;
      }
    };
    cc._RF.pop();
  }, {} ],
  "R.animate": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ef10cR18+9HoozN9zn604ev", "R.animate");
    "use strict";
    module.exports = {
      animate: function animate(pathString, pathString2, duration, animating) {
        var pathes = R.utils.path2curve(pathString, pathString2), fromPath = pathes[0], toPath = pathes[1];
        var diff = [];
        for (var i = 0, ii = fromPath.length; i < ii; i++) {
          diff[i] = [ 0 ];
          for (var j = 1, jj = fromPath[i].length; j < jj; j++) diff[i][j] = (toPath[i][j] - fromPath[i][j]) / duration;
        }
        this._time = 0;
        this._duration = duration;
        this._animateDiff = diff;
        this._animating = "undefined" === typeof animating || animating;
        this._fromPath = fromPath;
        this._toPath = toPath;
        return diff;
      },
      _stepAnimate: function _stepAnimate(time) {
        var diff = this._animateDiff;
        var duration = this._duration;
        var fromPath = this._fromPath;
        var pos = time / duration;
        pos > 1 && (pos = 1);
        var now = [];
        for (var i = 0, ii = fromPath.length; i < ii; i++) {
          now[i] = [ fromPath[i][0] ];
          for (var j = 1, jj = fromPath[i].length; j < jj; j++) now[i][j] = +fromPath[i][j] + pos * duration * diff[i][j];
        }
        this._dirty = true;
        this._commands = now;
        if (pos >= 1) {
          this._animating = false;
          this._fromPath = null;
          this._toPath = null;
        }
      },
      _updateAnimate: function _updateAnimate(dt) {
        if (this._animating) {
          this._time += dt;
          this._stepAnimate(this._time);
        }
      }
    };
    cc._RF.pop();
  }, {} ],
  "R.curve": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3fbadXGNktLUK9UR599v4aj", "R.curve");
    "use strict";
    var pathCommand = /([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi;
    var pathValues = /(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/gi;
    var concat = "concat";
    var apply = "apply";
    var split = "split";
    var has = "hasOwnProperty";
    var toFloat = parseFloat;
    var mmax = Math.max;
    var mmin = Math.min;
    var PI = Math.PI;
    var abs = Math.abs;
    var math = Math;
    var pow = Math.pow;
    var upperCase = String.prototype.toUpperCase;
    var cache = {
      string2curve: {},
      string2path: {}
    };
    function clone(obj) {
      if ("function" === typeof obj || Object(obj) !== obj) return obj;
      var res = new obj.constructor();
      for (var key in obj) obj[has](key) && (res[key] = clone(obj[key]));
      return res;
    }
    var a2c = function a2c(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
      var _120 = 120 * PI / 180, rad = PI / 180 * (+angle || 0), res = [], xy, rotate = function rotate(x, y, rad) {
        var X = x * math.cos(rad) - y * math.sin(rad), Y = x * math.sin(rad) + y * math.cos(rad);
        return {
          x: X,
          y: Y
        };
      };
      if (recursive) {
        f1 = recursive[0];
        f2 = recursive[1];
        cx = recursive[2];
        cy = recursive[3];
      } else {
        xy = rotate(x1, y1, -rad);
        x1 = xy.x;
        y1 = xy.y;
        xy = rotate(x2, y2, -rad);
        x2 = xy.x;
        y2 = xy.y;
        var cos = math.cos(PI / 180 * angle), sin = math.sin(PI / 180 * angle), x = (x1 - x2) / 2, y = (y1 - y2) / 2;
        var h = x * x / (rx * rx) + y * y / (ry * ry);
        if (h > 1) {
          h = math.sqrt(h);
          rx *= h;
          ry *= h;
        }
        var rx2 = rx * rx, ry2 = ry * ry, k = (large_arc_flag === sweep_flag ? -1 : 1) * math.sqrt(abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))), cx = k * rx * y / ry + (x1 + x2) / 2, cy = k * -ry * x / rx + (y1 + y2) / 2, f1 = math.asin(((y1 - cy) / ry).toFixed(9)), f2 = math.asin(((y2 - cy) / ry).toFixed(9));
        f1 = x1 < cx ? PI - f1 : f1;
        f2 = x2 < cx ? PI - f2 : f2;
        f1 < 0 && (f1 = 2 * PI + f1);
        f2 < 0 && (f2 = 2 * PI + f2);
        sweep_flag && f1 > f2 && (f1 -= 2 * PI);
        !sweep_flag && f2 > f1 && (f2 -= 2 * PI);
      }
      var df = f2 - f1;
      if (abs(df) > _120) {
        var f2old = f2, x2old = x2, y2old = y2;
        f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
        x2 = cx + rx * math.cos(f2);
        y2 = cy + ry * math.sin(f2);
        res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [ f2, f2old, cx, cy ]);
      }
      df = f2 - f1;
      var c1 = math.cos(f1), s1 = math.sin(f1), c2 = math.cos(f2), s2 = math.sin(f2), t = math.tan(df / 4), hx = 4 / 3 * rx * t, hy = 4 / 3 * ry * t, m1 = [ x1, y1 ], m2 = [ x1 + hx * s1, y1 - hy * c1 ], m3 = [ x2 + hx * s2, y2 - hy * c2 ], m4 = [ x2, y2 ];
      m2[0] = 2 * m1[0] - m2[0];
      m2[1] = 2 * m1[1] - m2[1];
      if (recursive) return [ m2, m3, m4 ][concat](res);
      res = [ m2, m3, m4 ][concat](res).join()[split](",");
      var newres = [];
      for (var i = 0, ii = res.length; i < ii; i++) newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
      return newres;
    };
    var l2c = function l2c(x1, y1, x2, y2) {
      return [ x1, y1, x2, y2, x2, y2 ];
    };
    var q2c = function q2c(x1, y1, ax, ay, x2, y2) {
      var _13 = 1 / 3, _23 = 2 / 3;
      return [ _13 * x1 + _23 * ax, _13 * y1 + _23 * ay, _13 * x2 + _23 * ax, _13 * y2 + _23 * ay, x2, y2 ];
    };
    var parsePathString = function parsePathString(pathString) {
      if (!pathString) return null;
      if ("string" !== typeof pathString) return pathString;
      if (cache.string2path[pathString]) return clone(cache.string2path[pathString]);
      var paramCounts = {
        a: 7,
        c: 6,
        h: 1,
        l: 2,
        m: 2,
        r: 4,
        q: 4,
        s: 4,
        t: 2,
        v: 1,
        z: 0
      }, data = [];
      String(pathString).replace(pathCommand, function(a, b, c) {
        var params = [], name = b.toLowerCase();
        c.replace(pathValues, function(a, b) {
          b && params.push(+b);
        });
        if ("m" === name && params.length > 2) {
          data.push([ b ][concat](params.splice(0, 2)));
          name = "l";
          b = "m" === b ? "l" : "L";
        }
        if ("r" === name) data.push([ b ][concat](params)); else while (params.length >= paramCounts[name]) {
          data.push([ b ][concat](params.splice(0, paramCounts[name])));
          if (!paramCounts[name]) break;
        }
      });
      return data;
    };
    var path2absolute = function path2absolute(pathString) {
      var pathArray = parsePathString(pathString);
      var res = [], x = 0, y = 0, mx = 0, my = 0, start = 0;
      if ("M" == pathArray[0][0]) {
        x = +pathArray[0][1];
        y = +pathArray[0][2];
        mx = x;
        my = y;
        start++;
        res[0] = [ "M", x, y ];
      }
      var crz = 3 == pathArray.length && "M" == pathArray[0][0] && "R" == pathArray[1][0].toUpperCase() && "Z" == pathArray[2][0].toUpperCase();
      for (var r, pa, i = start, ii = pathArray.length; i < ii; i++) {
        res.push(r = []);
        pa = pathArray[i];
        if (pa[0] != upperCase.call(pa[0])) {
          r[0] = upperCase.call(pa[0]);
          switch (r[0]) {
           case "A":
            r[1] = pa[1];
            r[2] = pa[2];
            r[3] = pa[3];
            r[4] = pa[4];
            r[5] = pa[5];
            r[6] = +(pa[6] + x);
            r[7] = +(pa[7] + y);
            break;

           case "V":
            r[1] = +pa[1] + y;
            break;

           case "H":
            r[1] = +pa[1] + x;
            break;

           case "R":
            var dots = [ x, y ][concat](pa.slice(1));
            for (var j = 2, jj = dots.length; j < jj; j++) {
              dots[j] = +dots[j] + x;
              dots[++j] = +dots[j] + y;
            }
            res.pop();
            res = res[concat](catmullRom2bezier(dots, crz));
            break;

           case "M":
            mx = +pa[1] + x;
            my = +pa[2] + y;

           default:
            for (j = 1, jj = pa.length; j < jj; j++) r[j] = +pa[j] + (j % 2 ? x : y);
          }
        } else if ("R" == pa[0]) {
          dots = [ x, y ][concat](pa.slice(1));
          res.pop();
          res = res[concat](catmullRom2bezier(dots, crz));
          r = [ "R" ][concat](pa.slice(-2));
        } else for (var k = 0, kk = pa.length; k < kk; k++) r[k] = pa[k];
        switch (r[0]) {
         case "Z":
          x = mx;
          y = my;
          break;

         case "H":
          x = r[1];
          break;

         case "V":
          y = r[1];
          break;

         case "M":
          mx = r[r.length - 2];
          my = r[r.length - 1];

         default:
          x = r[r.length - 2];
          y = r[r.length - 1];
        }
      }
      return res;
    };
    var path2curve = function path2curve(pathString, pathString2) {
      if ("string" === typeof pathString && !pathString2 && cache.string2curve[pathString]) return clone(cache.string2curve[pathString]);
      var p = path2absolute(pathString), p2 = pathString2 && path2absolute(pathString2), attrs = {
        x: 0,
        y: 0,
        bx: 0,
        by: 0,
        X: 0,
        Y: 0,
        qx: null,
        qy: null
      }, attrs2 = {
        x: 0,
        y: 0,
        bx: 0,
        by: 0,
        X: 0,
        Y: 0,
        qx: null,
        qy: null
      }, processPath = function processPath(path, d, pcom) {
        var nx, ny, tq = {
          T: 1,
          Q: 1
        };
        if (!path) return [ "C", d.x, d.y, d.x, d.y, d.x, d.y ];
        !(path[0] in tq) && (d.qx = d.qy = null);
        switch (path[0]) {
         case "M":
          d.X = path[1];
          d.Y = path[2];
          break;

         case "A":
          path = [ "C" ][concat](a2c[apply](0, [ d.x, d.y ][concat](path.slice(1))));
          break;

         case "S":
          if ("C" == pcom || "S" == pcom) {
            nx = 2 * d.x - d.bx;
            ny = 2 * d.y - d.by;
          } else {
            nx = d.x;
            ny = d.y;
          }
          path = [ "C", nx, ny ][concat](path.slice(1));
          break;

         case "T":
          if ("Q" == pcom || "T" == pcom) {
            d.qx = 2 * d.x - d.qx;
            d.qy = 2 * d.y - d.qy;
          } else {
            d.qx = d.x;
            d.qy = d.y;
          }
          path = [ "C" ][concat](q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
          break;

         case "Q":
          d.qx = path[1];
          d.qy = path[2];
          path = [ "C" ][concat](q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
          break;

         case "L":
          path = [ "C" ][concat](l2c(d.x, d.y, path[1], path[2]));
          break;

         case "H":
          path = [ "C" ][concat](l2c(d.x, d.y, path[1], d.y));
          break;

         case "V":
          path = [ "C" ][concat](l2c(d.x, d.y, d.x, path[1]));
          break;

         case "Z":
          path = [ "C" ][concat](l2c(d.x, d.y, d.X, d.Y));
        }
        return path;
      }, fixArc = function fixArc(pp, i) {
        if (pp[i].length > 7) {
          pp[i].shift();
          var pi = pp[i];
          while (pi.length) {
            pcoms1[i] = "A";
            p2 && (pcoms2[i] = "A");
            pp.splice(i++, 0, [ "C" ][concat](pi.splice(0, 6)));
          }
          pp.splice(i, 1);
          ii = mmax(p.length, p2 && p2.length || 0);
        }
      }, fixM = function fixM(path1, path2, a1, a2, i) {
        if (path1 && path2 && "M" == path1[i][0] && "M" != path2[i][0]) {
          path2.splice(i, 0, [ "M", a2.x, a2.y ]);
          a1.bx = 0;
          a1.by = 0;
          a1.x = path1[i][1];
          a1.y = path1[i][2];
          ii = mmax(p.length, p2 && p2.length || 0);
        }
      }, pcoms1 = [], pcoms2 = [], pfirst = "", pcom = "";
      for (var i = 0, ii = mmax(p.length, p2 && p2.length || 0); i < ii; i++) {
        p[i] && (pfirst = p[i][0]);
        if ("C" != pfirst) {
          pcoms1[i] = pfirst;
          i && (pcom = pcoms1[i - 1]);
        }
        p[i] = processPath(p[i], attrs, pcom);
        "A" != pcoms1[i] && "C" == pfirst && (pcoms1[i] = "C");
        fixArc(p, i);
        if (p2) {
          p2[i] && (pfirst = p2[i][0]);
          if ("C" != pfirst) {
            pcoms2[i] = pfirst;
            i && (pcom = pcoms2[i - 1]);
          }
          p2[i] = processPath(p2[i], attrs2, pcom);
          "A" != pcoms2[i] && "C" == pfirst && (pcoms2[i] = "C");
          fixArc(p2, i);
        }
        fixM(p, p2, attrs, attrs2, i);
        fixM(p2, p, attrs2, attrs, i);
        var seg = p[i], seg2 = p2 && p2[i], seglen = seg.length, seg2len = p2 && seg2.length;
        attrs.x = seg[seglen - 2];
        attrs.y = seg[seglen - 1];
        attrs.bx = toFloat(seg[seglen - 4]) || attrs.x;
        attrs.by = toFloat(seg[seglen - 3]) || attrs.y;
        attrs2.bx = p2 && (toFloat(seg2[seg2len - 4]) || attrs2.x);
        attrs2.by = p2 && (toFloat(seg2[seg2len - 3]) || attrs2.y);
        attrs2.x = p2 && seg2[seg2len - 2];
        attrs2.y = p2 && seg2[seg2len - 1];
      }
      "string" !== typeof pathString || pathString2 || (cache.string2curve[pathString] = clone(p));
      return p2 ? [ p, p2 ] : p;
    };
    module.exports = {
      path2absolute: path2absolute,
      path2curve: path2curve
    };
    cc._RF.pop();
  }, {} ],
  "R.dash": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3ed44ZCT2ZJloFqEaSDKWFw", "R.dash");
    "use strict";
    var sqrt = Math.sqrt;
    function drawDashPoints(points, ctx, dashArray, dashOffset, transform) {
      var lastx = points[0], lasty = points[1];
      var dx, dy;
      var totalLength = 0;
      var length = 0;
      var dashLength = dashArray.length;
      var dashIndex = 0;
      var from = dashOffset;
      var drawLength = dashArray[dashIndex];
      var to = dashOffset + drawLength;
      var x1, y1;
      var x, y;
      for (var i = 0, l = points.length / 2; i < l; i++) {
        x = points[2 * i];
        y = points[2 * i + 1];
        if (0 !== i) {
          dx = x - lastx;
          dy = y - lasty;
          length = sqrt(dx * dx + dy * dy);
          x1 || (x1 = lastx);
          y1 || (y1 = lasty);
          while (length > 0) {
            if (totalLength + length < from) {
              totalLength += length;
              length = 0;
              x1 = x;
              y1 = y;
              continue;
            }
            if (totalLength <= from) {
              var difLength = from - totalLength;
              var p = difLength / length;
              x1 += p * (x - x1);
              y1 += p * (y - y1);
              if (transform) {
                var p = cc.AffineTransform.transformVec2(cc.v2(0, 0), x1, y1, transform);
                ctx.moveTo(p.x, p.y);
              } else ctx.moveTo(x1, y1);
              length -= difLength;
              totalLength += difLength;
            }
            if (totalLength + length < to) {
              x1 = x;
              y1 = y;
              if (transform) {
                var p = cc.AffineTransform.transformVec2(cc.v2(0, 0), x1, y1, transform);
                ctx.lineTo(p.x, p.y);
              } else ctx.lineTo(x1, y1);
              totalLength += length;
              length = 0;
            } else if (totalLength + length >= to) {
              var difLength = to - totalLength;
              var p = difLength / length;
              x1 += p * (x - x1);
              y1 += p * (y - y1);
              if (transform) {
                var p = cc.AffineTransform.transformVec2(cc.v2(0, 0), x1, y1, transform);
                ctx.lineTo(p.x, p.y);
              } else ctx.lineTo(x1, y1);
              length -= difLength;
              totalLength += difLength;
              from = to + dashArray[++dashIndex % dashLength];
              to = from + dashArray[++dashIndex % dashLength];
            }
          }
        }
        lastx = x;
        lasty = y;
      }
    }
    module.exports = {
      drawDashPoints: drawDashPoints
    };
    cc._RF.pop();
  }, {} ],
  "R.find": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cc7c13/te5C24/Hcap2xKXJ", "R.find");
    "use strict";
    var PI = Math.PI;
    var math = Math;
    var pow = Math.pow;
    function findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
      var t1 = 1 - t;
      return {
        x: pow(t1, 3) * p1x + 3 * pow(t1, 2) * t * c1x + 3 * t1 * t * t * c2x + pow(t, 3) * p2x,
        y: pow(t1, 3) * p1y + 3 * pow(t1, 2) * t * c1y + 3 * t1 * t * t * c2y + pow(t, 3) * p2y
      };
    }
    function findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
      var t1 = 1 - t, t13 = pow(t1, 3), t12 = pow(t1, 2), t2 = t * t, t3 = t2 * t, x = t13 * p1x + 3 * t12 * t * c1x + 3 * t1 * t * t * c2x + t3 * p2x, y = t13 * p1y + 3 * t12 * t * c1y + 3 * t1 * t * t * c2y + t3 * p2y, mx = p1x + 2 * t * (c1x - p1x) + t2 * (c2x - 2 * c1x + p1x), my = p1y + 2 * t * (c1y - p1y) + t2 * (c2y - 2 * c1y + p1y), nx = c1x + 2 * t * (c2x - c1x) + t2 * (p2x - 2 * c2x + c1x), ny = c1y + 2 * t * (c2y - c1y) + t2 * (p2y - 2 * c2y + c1y), ax = t1 * p1x + t * c1x, ay = t1 * p1y + t * c1y, cx = t1 * c2x + t * p2x, cy = t1 * c2y + t * p2y, alpha = 90 - 180 * math.atan2(mx - nx, my - ny) / PI;
      (mx > nx || my < ny) && (alpha += 180);
      return {
        x: x,
        y: y,
        m: {
          x: mx,
          y: my
        },
        n: {
          x: nx,
          y: ny
        },
        start: {
          x: ax,
          y: ay
        },
        end: {
          x: cx,
          y: cy
        },
        alpha: alpha
      };
    }
    module.exports = {
      findDotAtSegment: findDotAtSegment,
      findDotsAtSegment: findDotsAtSegment
    };
    cc._RF.pop();
  }, {} ],
  "R.group": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e75c2SchnFFxaBCrVazFOQf", "R.group");
    "use strict";
    var Path = require("./R.path");
    var trasform = require("./component/R.transform");
    var style = require("./component/R.style");
    var utils = require("./utils/R.utils");
    var svg = require("./component/optional/R.svg");
    var GroupDefine = {
      extends: cc.Component,
      properties: {
        selected: {
          default: false,
          notify: function notify() {
            var children = this.children;
            var selected = this.selected;
            for (var i = 0, ii = children.length; i < ii; i++) children[i].selected = selected;
          }
        },
        _dirty: {
          default: true,
          serializable: false
        }
      },
      onLoad: function onLoad() {
        this.init();
        if (!this.ctx) {
          var _gNode = new cc.Node();
          this.ctx = _gNode.addComponent(cc.Graphics);
          this.node.addChild(_gNode);
        }
      },
      init: function init(parent) {
        this.children = [];
        if (parent) {
          this.parent = parent;
          this.ctx = parent.ctx;
        }
        this.showBoundingBox = false;
      },
      addPath: function addPath() {
        var path = new Path();
        path.init(this);
        this.children.push(path);
        this._dirty = true;
        return path;
      },
      addGroup: function addGroup() {
        var group = new Group();
        group.init(this);
        this.children.push(group);
        this._dirty = true;
        return group;
      },
      getWorldBbox: function getWorldBbox() {
        var rect;
        var children = this.children;
        for (var i = 0, ii = children.length; i < ii; i++) {
          var bbox = children[i].getWorldBbox();
          0 !== bbox.width && 0 !== bbox.height && (rect = rect ? cc.rectUnion(rect, children[i].getWorldBbox()) : children[i].getWorldBbox());
        }
        return rect || cc.rect();
      },
      update: function update(dt) {
        if (!this._dirty) return;
        this.parent || this.ctx.clear();
        var children = this.children;
        for (var i = 0, ii = children.length; i < ii; i++) {
          var child = children[i];
          child._dirty = true;
          child.update(dt);
        }
        if (this.showBoundingBox) {
          var bbox = this.getWorldBbox();
          this.ctx.rect(bbox.x, bbox.y, bbox.width, bbox.height);
          this.ctx.stroke();
        }
        this._dirty = false;
      }
    };
    var Group = cc.Class(utils.defineClass(GroupDefine, trasform, style, svg));
    cc._RF.pop();
  }, {
    "./R.path": "R.path",
    "./component/R.style": "R.style",
    "./component/R.transform": "R.transform",
    "./component/optional/R.svg": "R.svg",
    "./utils/R.utils": "R.utils"
  } ],
  "R.length": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "aac33vPmPhCYZOAMOcu8Dkj", "R.length");
    "use strict";
    var path2curve = require("./R.curve").path2curve;
    var findDotsAtSegment = require("./R.find").findDotsAtSegment;
    function base3(t, p1, p2, p3, p4) {
      var t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4, t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
      return t * t2 - 3 * p1 + 3 * p2;
    }
    function bezlen(x1, y1, x2, y2, x3, y3, x4, y4, z) {
      null == z && (z = 1);
      z = z > 1 ? 1 : z < 0 ? 0 : z;
      var z2 = z / 2, n = 12, Tvalues = [ -.1252, .1252, -.3678, .3678, -.5873, .5873, -.7699, .7699, -.9041, .9041, -.9816, .9816 ], Cvalues = [ .2491, .2491, .2335, .2335, .2032, .2032, .1601, .1601, .1069, .1069, .0472, .0472 ], sum = 0;
      for (var i = 0; i < n; i++) {
        var ct = z2 * Tvalues[i] + z2, xbase = base3(ct, x1, x2, x3, x4), ybase = base3(ct, y1, y2, y3, y4), comb = xbase * xbase + ybase * ybase;
        sum += Cvalues[i] * Math.sqrt(comb);
      }
      return z2 * sum;
    }
    function getTatLen(x1, y1, x2, y2, x3, y3, x4, y4, ll) {
      if (ll < 0 || bezlen(x1, y1, x2, y2, x3, y3, x4, y4) < ll) return;
      var t = 1, step = t / 2, t2 = t - step, l, e = .01;
      l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
      while (Math.abs(l - ll) > e) {
        step /= 2;
        t2 += (l < ll ? 1 : -1) * step;
        l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
      }
      return t2;
    }
    function getPointAtSegmentLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length) {
      return length ? findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, getTatLen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length)) : bezlen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y);
    }
    function getLengthFactory(istotal, subpath) {
      return function(path, length, onlystart) {
        path = path2curve(path);
        var x, y, p, l, sp = "", subpaths = {}, point, len = 0;
        for (var i = 0, ii = path.length; i < ii; i++) {
          p = path[i];
          if ("M" === p[0]) {
            x = +p[1];
            y = +p[2];
          } else {
            l = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
            if (len + l > length) {
              if (subpath && !subpaths.start) {
                point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                sp += [ "C" + point.start.x, point.start.y, point.m.x, point.m.y, point.x, point.y ];
                if (onlystart) return sp;
                subpaths.start = sp;
                sp = [ "M" + point.x, point.y + "C" + point.n.x, point.n.y, point.end.x, point.end.y, p[5], p[6] ].join();
                len += l;
                x = +p[5];
                y = +p[6];
                continue;
              }
              if (!istotal && !subpath) {
                point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                return {
                  x: point.x,
                  y: point.y,
                  alpha: point.alpha
                };
              }
            }
            len += l;
            x = +p[5];
            y = +p[6];
          }
          sp += p.shift() + p;
        }
        subpaths.end = sp;
        point = istotal ? len : subpath ? subpaths : findDotsAtSegment(x, y, p[0], p[1], p[2], p[3], p[4], p[5], 1);
        point.alpha && (point = {
          x: point.x,
          y: point.y,
          alpha: point.alpha
        });
        return point;
      };
    }
    var getTotalLength = getLengthFactory(1);
    var getPointAtLength = getLengthFactory();
    var getSubpathsAtLength = getLengthFactory(0, 1);
    function getSubpath(path, from, to) {
      if (this.getTotalLength(path) - to < 1e-6) return getSubpathsAtLength(path, from).end;
      var a = getSubpathsAtLength(path, to, 1);
      return from ? getSubpathsAtLength(a, from).end : a;
    }
    module.exports = {
      getTatLen: getTatLen,
      bezlen: bezlen,
      getTotalLength: getTotalLength,
      getPointAtLength: getPointAtLength,
      getSubpathsAtLength: getSubpathsAtLength,
      getSubpath: getSubpath
    };
    cc._RF.pop();
  }, {
    "./R.curve": "R.curve",
    "./R.find": "R.find"
  } ],
  "R.path": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7e039m0wZhNaIqogYMr6uCY", "R.path");
    "use strict";
    var trasform = require("./component/R.transform");
    var style = require("./component/R.style");
    var utils = require("./utils/R.utils");
    var smooth = require("./component/optional/R.smooth");
    var simplify = require("./component/optional/R.simplify");
    var animate = require("./component/optional/R.animate");
    var drawer = {
      M: "moveTo",
      L: "lineTo",
      C: "bezierCurveTo",
      Z: "close"
    };
    var sqrt = Math.sqrt;
    var max = Math.max;
    var abs = Math.abs;
    var selectedColor = cc.color(0, 157, 236);
    var PathDefine = {
      extends: cc.Component,
      properties: {
        _dirty: {
          default: true,
          serializable: false,
          notify: function notify() {
            if (this.parent && this._dirty) {
              this.parent._dirty = true;
              this._commands && (this._commands.points = void 0);
            }
          }
        }
      },
      init: function init(parent) {
        if (parent) {
          this.parent = parent;
          this.ctx = parent.ctx;
        }
        this._commands = [];
        this._dirty = true;
        this.showHandles = false;
        this.showBoundingBox = false;
      },
      onLoad: function onLoad() {
        this.init();
        if (!this.ctx) {
          var _gNode = new cc.Node();
          this.ctx = _gNode.addComponent(cc.Graphics);
          this.node.addChild(_gNode);
          this._applyStyle();
        }
      },
      ellipse: function ellipse(cx, cy, rx, ry) {
        ry || (ry = rx);
        var cmds = this._commands;
        cmds.push([ "M", cx, cy ]);
        cmds.push([ "m", 0, -ry ]);
        cmds.push([ "a", rx, ry, 0, 1, 1, 0, 2 * ry ]);
        cmds.push([ "a", rx, ry, 0, 1, 1, 0, -2 * ry ]);
      },
      circle: function circle(cx, cy, r) {
        this.ellipse(cx, cy, r);
      },
      rect: function rect(x, y, w, h, r) {
        var cmds = this._commands;
        if (r) {
          cmds.push([ "M", x + r, y ]);
          cmds.push([ "l", w - 2 * r, 0 ]);
          cmds.push([ "a", r, r, 0, 0, 1, r, r ]);
          cmds.push([ "l", 0, h - 2 * r ]);
          cmds.push([ "a", r, r, 0, 0, 1, -r, r ]);
          cmds.push([ "l", 2 * r - w, 0 ]);
          cmds.push([ "a", r, r, 0, 0, 1, -r, -r ]);
          cmds.push([ "l", 0, 2 * r - h ]);
          cmds.push([ "a", r, r, 0, 0, 1, r, -r ]);
        } else {
          cmds.push([ "M", x, y ]);
          cmds.push([ "l", w, 0 ]);
          cmds.push([ "l", 0, h ]);
          cmds.push([ "l", -w, 0 ]);
        }
        cmds.push([ "z" ]);
      },
      close: function close() {
        this._commands.push([ "Z" ]);
      },
      points: function points(_points, closed) {
        if (_points.length <= 1) return;
        this.clear();
        var lastPoint = _points[0];
        this.M(lastPoint.x, lastPoint.y);
        for (var i = 1, ii = _points.length; i < ii; i++) {
          var point = _points[i];
          this.C(lastPoint.x, lastPoint.y, point.x, point.y, point.x, point.y);
          lastPoint = point;
        }
        closed && this.C(lastPoint.x, lastPoint.y, _points[0].x, _points[0].y, _points[0].x, _points[0].y);
        this.makePath();
      },
      makePath: function makePath() {
        this._commands = R.utils.path2curve(this._commands);
        this._dirty = true;
      },
      path: function path(_path) {
        this._commands = R.utils.path2curve(_path);
        this._dirty = true;
      },
      clear: function clear() {
        this._commands.length = 0;
      },
      getPathString: function getPathString() {
        var commands = this._commands;
        var string = [];
        for (var i = 0, ii = commands.length; i < ii; i++) string[i] = commands[i].join(" ");
        string = string.join(" ");
        return string;
      },
      getTotalLength: function getTotalLength() {
        void 0 === this._commands.totalLength && this._analysis();
        return this._commands.totalLength;
      },
      getBbox: function getBbox() {
        void 0 === this._commands.bbox && this._analysis();
        return this._commands.bbox;
      },
      getWorldBbox: function getWorldBbox() {
        (void 0 === this._commands.worldBbox || this._transformDirty) && this._analysis();
        return this._commands.worldBbox;
      },
      center: function center(x, y) {
        x = x || 0;
        y = y || 0;
        var bbox = this.getBbox();
        this.position = this.position.add(cc.v2(-bbox.width / 2 - bbox.x + x, -bbox.height / 2 - bbox.y + y));
      },
      _curves: function _curves() {
        var cmds = this._commands;
        if (cmds.curves) return cmds.curves;
        var curves = [];
        var subCurves;
        var x, y;
        for (var i = 0, ii = cmds.length; i < ii; i++) {
          var cmd = cmds[i];
          var c = cmd[0];
          if ("M" === c) {
            subCurves = [];
            curves.push(subCurves);
            x = cmd[1];
            y = cmd[2];
          } else if ("C" === c && void 0 !== x && void 0 !== y) {
            subCurves.push([ x, y, cmd[1], cmd[2], cmd[3], cmd[4], cmd[5], cmd[6] ]);
            x = cmd[5];
            y = cmd[6];
          }
        }
        cmds.curves = curves;
        return curves;
      },
      _analysis: function _analysis() {
        var cmds = this._commands;
        if (cmds.points) return;
        var curves = this._curves();
        var points = [];
        var x, y;
        var subPoints;
        var tessTolSclae = 1 / max(abs(this.scale.x), abs(this.scale.y));
        for (var i = 0, ii = curves.length; i < ii; i++) {
          var subCurves = curves[i];
          subPoints = [];
          points.push(subPoints);
          for (var j = 0, jj = subCurves.length; j < jj; j++) {
            var curve = subCurves[j];
            R.utils.tesselateBezier(curve[0], curve[1], curve[2], curve[3], curve[4], curve[5], curve[6], curve[7], 0, subPoints, tessTolSclae);
          }
        }
        cmds.points = points;
        var totalLength = 0;
        var lastx, lasty;
        var dx, dy;
        var minx = 1e8, miny = 1e8, maxx = -1e8, maxy = -1e8;
        for (var i = 0, ii = points.length; i < ii; i++) {
          subPoints = points[i];
          for (var j = 0, jj = subPoints.length / 2; j < jj; j++) {
            x = subPoints[2 * j];
            y = subPoints[2 * j + 1];
            x < minx && (minx = x);
            x > maxx && (maxx = x);
            y < miny && (miny = y);
            y > maxy && (maxy = y);
            if (0 === j) {
              lastx = x;
              lasty = y;
            }
            dx = x - lastx;
            dy = y - lasty;
            totalLength += sqrt(dx * dx + dy * dy);
            lastx = x;
            lasty = y;
          }
        }
        cmds.totalLength = totalLength;
        if (0 === totalLength) cmds.bbox = cmds.worldBbox = cc.rect(); else {
          var rect = cc.rect(minx, miny, maxx - minx, maxy - miny);
          cmds.bbox = cc.AffineTransform.transformRect(cc.AffineTransform.identity, rect, this.getTransform());
          cmds.worldBbox = cc.AffineTransform.transformRect(cc.AffineTransform.identity, rect, this.getWorldTransform());
        }
      },
      _drawCommands: function _drawCommands() {
        var commands = this._commands;
        var ctx = this.ctx;
        var t = this.getWorldTransform();
        for (var i = 0, ii = commands.length; i < ii; i++) {
          var cmd = commands[i];
          var c = cmd[0];
          cmd = this._transformCommand(cmd, t);
          var func = ctx[drawer[c]];
          func && func.apply(ctx, cmd);
        }
      },
      _drawHandles: function _drawHandles() {
        var ctx = this.ctx;
        var commands = this._commands;
        var prev;
        var size = 5;
        var half = size / 2;
        var originLineWidth = ctx.lineWidth;
        var originStrokeColor = ctx.strokeColor;
        var originFillColor = ctx.fillColor;
        ctx.lineWidth = 1;
        ctx.strokeColor = selectedColor;
        ctx.fillColor = selectedColor;
        var t = this.getWorldTransform();
        function drawHandle(x1, y1, x2, y2) {
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.circle(x2, y2, half);
          ctx.fill();
        }
        for (var i = 0, ii = commands.length; i < ii; i++) {
          var cmd = commands[i];
          var c = cmd[0];
          cmd = this._transformCommand(cmd, t);
          if ("M" === c) prev = cmd; else if ("C" === c) {
            drawHandle(prev[0], prev[1], cmd[0], cmd[1]);
            drawHandle(cmd[4], cmd[5], cmd[2], cmd[3]);
            prev = [ cmd[4], cmd[5] ];
          }
          prev && ctx.fillRect(prev[0] - half, prev[1] - half, size, size);
        }
        ctx.lineWidth = originLineWidth;
        ctx.strokeColor = originStrokeColor;
        ctx.fillColor = originFillColor;
      },
      _drawDashPath: function _drawDashPath() {
        var cmds = this._commands;
        var ctx = this.ctx;
        var dashArray = this.dashArray;
        var dashOffset = this.dashOffset;
        var points;
        cmds.points || this._analysis();
        points = cmds.points;
        var t = this.getWorldTransform();
        for (var i = 0, ii = points.length; i < ii; i++) {
          var subPoints = points[i];
          R.utils.drawDashPoints(subPoints, ctx, dashArray, dashOffset, t);
        }
      },
      update: function update(dt) {
        this._updateAnimate && this._updateAnimate(dt);
        if (0 === this._commands.length || !this._dirty || this.parent && !this.parent._dirty) return;
        this._applyStyle();
        this.parent || this.ctx.clear();
        if (this.dashArray.length > 0) {
          if (this.getStyledColor("fillColor")) {
            this._drawCommands();
            this.ctx.fill();
          }
          if (this.getStyledColor("strokeColor")) {
            this._drawDashPath();
            this.ctx.stroke();
          }
        } else {
          this._drawCommands();
          this.getStyledColor("fillColor") && this.ctx.fill();
          this.getStyledColor("strokeColor") && this.ctx.stroke();
        }
        if (this.showBoundingBox) {
          var bbox = this.getWorldBbox();
          this.ctx.rect(bbox.x, bbox.y, bbox.width, bbox.height);
          this.ctx.stroke();
        }
        this.showHandles && this._drawHandles();
        this._dirty = false;
      }
    };
    var Path = cc.Class(utils.defineClass(PathDefine, trasform, style, smooth, simplify, animate));
    [ "M", "m", "L", "l", "H", "h", "V", "v", "C", "c", "S", "s", "Q", "q", "T", "t", "A", "a", "Z", "z" ].forEach(function(cmd) {
      Path.prototype[cmd] = function() {
        var cmds = [ cmd ];
        for (var i = 0, l = arguments.length; i < l; i++) cmds[i + 1] = arguments[i];
        this._commands.push(cmds);
      };
    });
    cc._RF.pop();
  }, {
    "./component/R.style": "R.style",
    "./component/R.transform": "R.transform",
    "./component/optional/R.animate": "R.animate",
    "./component/optional/R.simplify": "R.simplify",
    "./component/optional/R.smooth": "R.smooth",
    "./utils/R.utils": "R.utils"
  } ],
  "R.simplify": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "618f7EABMxA0aL8yRPUN3ks", "R.simplify");
    "use strict";
    var EPSILON = 1e-12;
    var TOLERANCE = 1e-6;
    var Fitter = {
      fit: function fit(path, error) {
        this.commands = [];
        this.error = error || 10;
        var points = this.points = [];
        path._commands.forEach(function(cmd) {
          var c = cmd[0];
          "M" === c ? points.push(cc.v2(cmd[1], cmd[2])) : "C" === c && points.push(cc.v2(cmd[5], cmd[6]));
        });
        var length = points.length;
        length > 1 && this.fitCubic(0, length - 1, points[1].sub(points[0]).normalize(), points[length - 2].sub(points[length - 1]).normalize());
        return this.commands;
      },
      fitCubic: function fitCubic(first, last, tan1, tan2) {
        if (last - first === 1) {
          var pt1 = this.points[first], pt2 = this.points[last], dist = pt1.sub(pt2).mag() / 3;
          this.addCurve([ pt1, pt1.add(tan1.normalize().mulSelf(dist)), pt2.add(tan2.normalize().mulSelf(dist)), pt2 ]);
          return;
        }
        var uPrime = this.chordLengthParameterize(first, last), maxError = Math.max(this.error, this.error * this.error), split, parametersInOrder = true;
        for (var i = 0; i <= 4; i++) {
          var curve = this.generateBezier(first, last, uPrime, tan1, tan2);
          var max = this.findMaxError(first, last, curve, uPrime);
          if (max.error < this.error && parametersInOrder) {
            this.addCurve(curve);
            return;
          }
          split = max.index;
          if (max.error >= maxError) break;
          parametersInOrder = this.reparameterize(first, last, uPrime, curve);
          maxError = max.error;
        }
        var V1 = this.points[split - 1].sub(this.points[split]), V2 = this.points[split].sub(this.points[split + 1]), tanCenter = V1.add(V2).div(2).normalize();
        this.fitCubic(first, split, tan1, tanCenter);
        this.fitCubic(split, last, tanCenter.mul(-1), tan2);
      },
      addCurve: function addCurve(curve) {
        if (0 === this.commands.length) this.commands.push([ "M", curve[0].x, curve[0].y ]); else {
          var cmd = this.commands[this.commands.length - 1];
          cmd[5] = curve[0].x;
          cmd[6] = curve[0].y;
        }
        this.commands.push([ "C", curve[1].x, curve[1].y, curve[2].x, curve[2].y, curve[3].x, curve[3].y ]);
      },
      generateBezier: function generateBezier(first, last, uPrime, tan1, tan2) {
        var epsilon = EPSILON, pt1 = this.points[first], pt2 = this.points[last], C = [ [ 0, 0 ], [ 0, 0 ] ], X = [ 0, 0 ];
        for (var i = 0, l = last - first + 1; i < l; i++) {
          var u = uPrime[i], t = 1 - u, b = 3 * u * t, b0 = t * t * t, b1 = b * t, b2 = b * u, b3 = u * u * u, a1 = tan1.normalize().mulSelf(b1), a2 = tan2.normalize().mulSelf(b2), tmp = this.points[first + i].sub(pt1.mul(b0 + b1)).sub(pt2.mul(b2 + b3));
          C[0][0] += a1.dot(a1);
          C[0][1] += a1.dot(a2);
          C[1][0] = C[0][1];
          C[1][1] += a2.dot(a2);
          X[0] += a1.dot(tmp);
          X[1] += a2.dot(tmp);
        }
        var detC0C1 = C[0][0] * C[1][1] - C[1][0] * C[0][1], alpha1, alpha2;
        if (Math.abs(detC0C1) > epsilon) {
          var detC0X = C[0][0] * X[1] - C[1][0] * X[0], detXC1 = X[0] * C[1][1] - X[1] * C[0][1];
          alpha1 = detXC1 / detC0C1;
          alpha2 = detC0X / detC0C1;
        } else {
          var c0 = C[0][0] + C[0][1], c1 = C[1][0] + C[1][1];
          alpha1 = alpha2 = Math.abs(c0) > epsilon ? X[0] / c0 : Math.abs(c1) > epsilon ? X[1] / c1 : 0;
        }
        var segLength = pt2.sub(pt1).mag(), eps = epsilon * segLength, handle1, handle2;
        if (alpha1 < eps || alpha2 < eps) alpha1 = alpha2 = segLength / 3; else {
          var line = pt2.sub(pt1);
          handle1 = tan1.normalize().mulSelf(alpha1);
          handle2 = tan2.normalize().mulSelf(alpha2);
          if (handle1.dot(line) - handle2.dot(line) > segLength * segLength) {
            alpha1 = alpha2 = segLength / 3;
            handle1 = handle2 = null;
          }
        }
        return [ pt1, pt1.add(handle1 || tan1.normalize().mulSelf(alpha1)), pt2.add(handle2 || tan2.normalize().mulSelf(alpha2)), pt2 ];
      },
      reparameterize: function reparameterize(first, last, u, curve) {
        for (var i = first; i <= last; i++) u[i - first] = this.findRoot(curve, this.points[i], u[i - first]);
        for (var i = 1, l = u.length; i < l; i++) if (u[i] <= u[i - 1]) return false;
        return true;
      },
      findRoot: function findRoot(curve, point, u) {
        var curve1 = [], curve2 = [];
        for (var i = 0; i <= 2; i++) curve1[i] = curve[i + 1].sub(curve[i]).mul(3);
        for (var i = 0; i <= 1; i++) curve2[i] = curve1[i + 1].sub(curve1[i]).mul(2);
        var pt = this.evaluate(3, curve, u), pt1 = this.evaluate(2, curve1, u), pt2 = this.evaluate(1, curve2, u), diff = pt.sub(point), df = pt1.dot(pt1) + diff.dot(pt2);
        if (Math.abs(df) < TOLERANCE) return u;
        return u - diff.dot(pt1) / df;
      },
      evaluate: function evaluate(degree, curve, t) {
        var tmp = curve.slice();
        for (var i = 1; i <= degree; i++) for (var j = 0; j <= degree - i; j++) tmp[j] = tmp[j].mul(1 - t).add(tmp[j + 1].mul(t));
        return tmp[0];
      },
      chordLengthParameterize: function chordLengthParameterize(first, last) {
        var u = [ 0 ];
        for (var i = first + 1; i <= last; i++) u[i - first] = u[i - first - 1] + this.points[i].sub(this.points[i - 1]).mag();
        for (var i = 1, m = last - first; i <= m; i++) u[i] /= u[m];
        return u;
      },
      findMaxError: function findMaxError(first, last, curve, u) {
        var index = Math.floor((last - first + 1) / 2), maxDist = 0;
        for (var i = first + 1; i < last; i++) {
          var P = this.evaluate(3, curve, u[i - first]);
          var v = P.sub(this.points[i]);
          var dist = v.x * v.x + v.y * v.y;
          if (dist >= maxDist) {
            maxDist = dist;
            index = i;
          }
        }
        return {
          error: maxDist,
          index: index
        };
      }
    };
    module.exports = {
      simplify: function simplify() {
        this._commands = Fitter.fit(this);
      }
    };
    cc._RF.pop();
  }, {} ],
  "R.smooth": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "26db3HfX+dJtZ5xs7MZRAHf", "R.smooth");
    "use strict";
    function getFirstControlPoints(rhs) {
      var n = rhs.length, x = [], tmp = [], b = 2, i;
      x[0] = rhs[0] / b;
      for (i = 1; i < n; i++) {
        tmp[i] = 1 / b;
        b = (i < n - 1 ? 4 : 2) - tmp[i];
        x[i] = (rhs[i] - x[i - 1]) / b;
      }
      for (i = 1; i < n; i++) x[n - i - 1] -= tmp[n - i] * x[n - i];
      return x;
    }
    function getCubicBezierCurvePoints(points, firstControlPoints, secondControlPoints) {
      var size = points.length, closed = points[size - 1].x === points[0].x && points[size - 1].y === points[0].y, n = size, overlap = 0;
      closed && (size = n = size - 1);
      if (size <= 2) return;
      if (closed) {
        overlap = Math.min(size, 4);
        n += 2 * Math.min(size, overlap);
      }
      var knots = [];
      for (var i = 0; i < size; i++) knots[i + overlap] = points[i];
      if (closed) for (var i = 0; i < overlap; i++) {
        knots[i] = points[i + size - overlap];
        knots[i + size + overlap] = points[i];
      } else n--;
      var rhs = [];
      for (var i = 1; i < n - 1; i++) rhs[i] = 4 * knots[i].x + 2 * knots[i + 1].x;
      rhs[0] = knots[0].x + 2 * knots[1].x;
      rhs[n - 1] = 3 * knots[n - 1].x;
      var x = getFirstControlPoints(rhs);
      for (var i = 1; i < n - 1; i++) rhs[i] = 4 * knots[i].y + 2 * knots[i + 1].y;
      rhs[0] = knots[0].y + 2 * knots[1].y;
      rhs[n - 1] = 3 * knots[n - 1].y;
      var y = getFirstControlPoints(rhs);
      if (closed) {
        for (var i = 0, j = size; i < overlap; i++, j++) {
          var f1 = i / overlap, f2 = 1 - f1, ie = i + overlap, je = j + overlap;
          x[j] = x[i] * f1 + x[j] * f2;
          y[j] = y[i] * f1 + y[j] * f2;
          x[je] = x[ie] * f2 + x[je] * f1;
          y[je] = y[ie] * f2 + y[je] * f1;
        }
        n--;
      }
      for (var i = overlap; i <= n - overlap; i++) {
        firstControlPoints[i - overlap] = {
          x: x[i],
          y: y[i]
        };
        secondControlPoints[i - overlap] = i < n - 1 ? {
          x: 2 * knots[i + 1].x - x[i + 1],
          y: 2 * knots[i + 1].y - y[i + 1]
        } : {
          x: (knots[n].x + x[n - 1]) / 2,
          y: (knots[n].y + y[n - 1]) / 2
        };
      }
    }
    function getCubicBezierCurvePath(knots) {
      var firstControlPoints = [], secondControlPoints = [];
      getCubicBezierCurvePoints(knots, firstControlPoints, secondControlPoints);
      return [ firstControlPoints, secondControlPoints ];
    }
    module.exports = {
      smooth: function smooth() {
        var knots = [];
        this._commands.forEach(function(cmd) {
          var c = cmd[0];
          "M" === c ? knots.push(cc.v2(cmd[1], cmd[2])) : "C" === c && knots.push(cc.v2(cmd[5], cmd[6]));
        });
        var results = getCubicBezierCurvePath(knots);
        var firstControlPoints = results[0];
        var secondControlPoints = results[1];
        var commands = [];
        for (var i = 0, len = knots.length; i < len; i++) if (0 === i) commands.push([ "M", knots[i].x, knots[i].y ]); else {
          var firstControlPoint = firstControlPoints[i - 1], secondControlPoint = secondControlPoints[i - 1];
          commands.push([ "C", firstControlPoint.x, firstControlPoint.y, secondControlPoint.x, secondControlPoint.y, knots[i].x, knots[i].y ]);
        }
        this._commands = commands;
        this._dirty = true;
      }
    };
    cc._RF.pop();
  }, {} ],
  "R.style": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "82a22w03zRH9KMyM6p0S4ni", "R.style");
    "use strict";
    var LineJoin = cc.Graphics.LineJoin;
    var LineCap = cc.Graphics.LineCap;
    var Style = {
      properties: {
        _lineWidth: void 0,
        _strokeColor: void 0,
        _fillColor: void 0,
        _lineJoin: void 0,
        _lineCap: void 0,
        _miterLimit: void 0,
        _dashOffset: void 0,
        _dashArray: void 0,
        lineWidth: {
          get: function get() {
            return this._lineWidth || 1;
          },
          set: function set(value) {
            this._lineWidth = value;
            this._dirty = true;
          }
        },
        lineJoin: {
          get: function get() {
            return this._lineJoin || LineJoin.MITER;
          },
          set: function set(value) {
            this._lineJoin = value;
            this._dirty = true;
          },
          type: LineJoin
        },
        lineCap: {
          get: function get() {
            return this._lineCap || LineCap.BUTT;
          },
          set: function set(value) {
            this._lineCap = value;
            this._dirty = true;
          },
          type: LineCap
        },
        strokeColor: {
          get: function get() {
            return this._strokeColor || cc.Color.BLACK;
          },
          set: function set(value) {
            this._strokeColor = value;
            this._dirty = true;
          }
        },
        fillColor: {
          get: function get() {
            return this._fillColor || cc.Color.WHITE;
          },
          set: function set(value) {
            this._fillColor = value;
            this._dirty = true;
          }
        },
        miterLimit: {
          get: function get() {
            return this._miterLimit || 10;
          },
          set: function set(value) {
            this._miterLimit = value;
            this._dirty = true;
          }
        },
        dashOffset: {
          get: function get() {
            return this._dashOffset || 0;
          },
          set: function set(value) {
            if (this._dashOffset === value) return;
            this._dashOffset = value;
            this._dirty = true;
          }
        },
        dashArray: {
          get: function get() {
            return this._dashArray || [];
          },
          set: function set(value) {
            if (!Array.isArray(value)) return;
            this._dashArray = value;
            this._dirty = true;
          }
        }
      },
      getStyled: function getStyled(type) {
        var value = this["_" + type];
        "inherit" !== value && void 0 !== value || (value = this.parent ? this.parent.getStyled(type) : this[type]);
        return value;
      },
      getStyledColor: function getStyledColor(type) {
        var value = this.getStyled(type);
        "none" !== value && value ? "string" === typeof value && (value = new cc.Color().fromHEX(value)) : value = null;
        return value;
      },
      _applyStyle: function _applyStyle() {
        var ctx = this.ctx;
        ctx.lineWidth = this.getStyled("lineWidth");
        ctx.lineJoin = this.getStyled("lineJoin");
        ctx.lineCap = this.getStyled("lineCap");
        var strokeColor = this.getStyledColor("strokeColor");
        var fillColor = this.getStyledColor("fillColor");
        strokeColor && (ctx.strokeColor = strokeColor);
        fillColor && (ctx.fillColor = fillColor);
      }
    };
    module.exports = Style;
    cc._RF.pop();
  }, {} ],
  "R.svg": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "12637AIttxM0IyCfKuQc+qV", "R.svg");
    "use strict";
    var cheerio = require("cheerio");
    function trim(s) {
      return s.replace(/^\s+|\s+$/g, "");
    }
    function compressSpaces(s) {
      return s.replace(/[\s\r\t\n]+/gm, " ");
    }
    function toNumberArray(s) {
      var a = trim(compressSpaces((s || "").replace(/,/g, " "))).split(" ");
      for (var i = 0; i < a.length; i++) a[i] = parseFloat(a[i]);
      return a;
    }
    function parseStyle(current, name, value) {
      "fill" === name ? current.fillColor = "none" === value ? null : new cc.Color().fromHEX(value) : "stroke" === name ? current.strokeColor = "none" === value ? null : new cc.Color().fromHEX(value) : "stroke-width" === name ? current.lineWidth = parseFloat(value) : "stroke-linejoin" === name ? current.lineJoin = cc.Graphics.LineJoin[value.toUpperCase()] : "stroke-linecap" === name ? current.lineCap = cc.Graphics.LineCap[value.toUpperCase()] : "stroke-dasharray" === name ? current.dashArray = toNumberArray[value] : "stroke-dashoffset" === name && (current.dashOffset = parseFloat(value));
    }
    function parseNode(node, parent) {
      var current;
      var tagName = node.tagName;
      if ("g" === tagName) current = parent.addGroup(); else if ("path" === tagName) {
        current = parent.addPath();
        current.path(node.attribs.d);
      }
      if (current && node.attribs) {
        var transform = node.attribs.transform;
        if (transform) {
          var data = trim(compressSpaces(transform)).replace(/\)([a-zA-Z])/g, ") $1").replace(/\)(\s?,\s?)/g, ") ").split(/\s(?=[a-z])/);
          for (var i = 0; i < data.length; i++) {
            var type = trim(data[i].split("(")[0]);
            var s = data[i].split("(")[1].replace(")", "");
            var a = toNumberArray(s);
            "translate" === type ? current.position = cc.v2(a[0], a[1]) : "rotate" === type ? current.rotation = a[0] : "scale" === type && (current.scale = cc.v2(a[0], a[1]));
          }
        }
        var styles = node.attribs.style;
        if (styles) {
          styles = styles.split(";");
          for (var i = 0; i < styles.length; i++) if ("" !== trim(styles[i])) {
            var style = styles[i].split(":");
            var name = trim(style[0]);
            var value = trim(style[1]);
            parseStyle(current, name, value);
          }
        }
        for (var property in node.attribs) node.attribs.hasOwnProperty(property) && parseStyle(current, property, node.attribs[property]);
      }
      var children = node.children;
      if (children) for (var i = 0, ii = children.length; i < ii; i++) {
        var child = children[i];
        parseNode(child, current || parent);
      }
    }
    var Svg = {
      loadSvg: function loadSvg(string) {
        if ("string" !== typeof string.text) return;
        var $;
        try {
          $ = cheerio.load(string.text);
        } catch (err) {
          cc.error(err.toString());
          return;
        }
        var svg = $("svg")[0];
        parseNode(svg, this);
        this.flipY = true;
      }
    };
    var DomHandler = require("domhandler");
    var NodePrototype = require("domhandler/lib/node");
    var ElementPrototype = require("domhandler/lib/element");
    DomHandler.prototype._addDomElement = function(element) {
      var parent = this._tagStack[this._tagStack.length - 1];
      var siblings = parent ? parent.children : this.dom;
      var previousSibling = siblings[siblings.length - 1];
      element.next = null;
      this._options.withStartIndices && (element.startIndex = this._parser.startIndex);
      if (this._options.withDomLvl1) {
        var originElement = element;
        element = Object.create("tag" === element.type ? ElementPrototype : NodePrototype);
        for (var k in originElement) element[k] = originElement[k];
      }
      if (previousSibling) {
        element.prev = previousSibling;
        previousSibling.next = element;
      } else element.prev = null;
      siblings.push(element);
      element.parent = parent || null;
    };
    module.exports = Svg;
    cc._RF.pop();
  }, {
    cheerio: 33,
    domhandler: 96,
    "domhandler/lib/element": 97,
    "domhandler/lib/node": 98
  } ],
  "R.tesselateBezier": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "27740ufNRNKgLTomyF81tTe", "R.tesselateBezier");
    "use strict";
    var tessTol = .25;
    var abs = Math.abs;
    function tesselateBezier(x1, y1, x2, y2, x3, y3, x4, y4, level, points, tessTolSclae) {
      tessTolSclae = tessTolSclae || 1;
      var x12, y12, x23, y23, x34, y34, x123, y123, x234, y234, x1234, y1234;
      var dx, dy, d2, d3;
      if (level > 10) return;
      x12 = .5 * (x1 + x2);
      y12 = .5 * (y1 + y2);
      x23 = .5 * (x2 + x3);
      y23 = .5 * (y2 + y3);
      x34 = .5 * (x3 + x4);
      y34 = .5 * (y3 + y4);
      x123 = .5 * (x12 + x23);
      y123 = .5 * (y12 + y23);
      dx = x4 - x1;
      dy = y4 - y1;
      d2 = abs((x2 - x4) * dy - (y2 - y4) * dx);
      d3 = abs((x3 - x4) * dy - (y3 - y4) * dx);
      if ((d2 + d3) * (d2 + d3) < tessTol * tessTolSclae * (dx * dx + dy * dy)) {
        points.push(x4);
        points.push(y4);
        return;
      }
      x234 = .5 * (x23 + x34);
      y234 = .5 * (y23 + y34);
      x1234 = .5 * (x123 + x234);
      y1234 = .5 * (y123 + y234);
      tesselateBezier(x1, y1, x12, y12, x123, y123, x1234, y1234, level + 1, points, tessTolSclae);
      tesselateBezier(x1234, y1234, x234, y234, x34, y34, x4, y4, level + 1, points, tessTolSclae);
    }
    module.exports = tesselateBezier;
    cc._RF.pop();
  }, {} ],
  "R.transform": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "09cfahPgi5LcL3L+meIkVYY", "R.transform");
    "use strict";
    var Transform = {
      properties: {
        _scale: {
          default: cc.v2(1, 1),
          type: cc.Vec2
        },
        _position: {
          default: cc.v2(0, 0),
          type: cc.Vec2
        },
        _rotation: 0,
        _flipX: false,
        _flipY: false,
        _transform: {
          default: function _default() {
            return {
              a: 1,
              b: 0,
              c: 0,
              d: 1,
              tx: 0,
              ty: 0
            };
          },
          serializable: false
        },
        _worldTransform: {
          default: function _default() {
            return {
              a: 1,
              b: 0,
              c: 0,
              d: 1,
              tx: 0,
              ty: 0
            };
          },
          serializable: false
        },
        _transformDirty: {
          default: true,
          serializable: false,
          notify: function notify() {
            if (this._transformDirty) {
              this.parent && (this.parent._transformDirty = true);
              this._dirty = true;
            }
          }
        },
        scale: {
          get: function get() {
            return this._scale;
          },
          set: function set(value) {
            if (this._scale.equals(value)) return;
            this._scale = value;
            this._transformDirty = true;
          }
        },
        position: {
          get: function get() {
            return this._position;
          },
          set: function set(value) {
            if (this._position.equals(value)) return;
            this._position = value;
            this._transformDirty = true;
          }
        },
        rotation: {
          get: function get() {
            return this._rotation;
          },
          set: function set(value) {
            if (this._rotation === value) return;
            this._rotation = value;
            this._transformDirty = true;
          }
        },
        flipX: {
          get: function get() {
            return this._flipX;
          },
          set: function set(value) {
            if (this._flipX === value) return;
            this._flipX = value;
            this._transformDirty = true;
          }
        },
        flipY: {
          get: function get() {
            return this._flipY;
          },
          set: function set(value) {
            if (this._flipY === value) return;
            this._flipY = value;
            this._transformDirty = true;
          }
        }
      },
      _transformCommand: function _transformCommand(cmd, t) {
        if (cmd.length <= 1) return cmd;
        cmd = cmd.slice(1, cmd.length);
        if (1 === t.a && 1 === t.d && 0 === t.b && 0 === t.c && 0 === t.tx && 0 === t.ty) return cmd;
        var tempPoint = cc.v2();
        for (var i = 0, ii = cmd.length / 2; i < ii; i++) {
          var j = 2 * i;
          tempPoint.x = cmd[j];
          tempPoint.y = cmd[j + 1];
          tempPoint = cc.AffineTransform.transformVec2(cc.v2(0, 0), tempPoint, t);
          cmd[j] = tempPoint.x;
          cmd[j + 1] = tempPoint.y;
        }
        return cmd;
      },
      getTransform: function getTransform() {
        if (this._transformDirty) {
          var scaleX = this.flipX ? -this._scale.x : this._scale.x;
          var scaleY = this.flipY ? -this._scale.y : this._scale.y;
          var positionX = this._position.x;
          var positionY = this._position.y;
          var rotation = this._rotation;
          var t = this._transform;
          t.tx = positionX;
          t.ty = positionY;
          t.a = t.d = 1;
          t.b = t.c = 0;
          if (rotation) {
            var rotationRadians = .017453292519943295 * rotation;
            t.c = Math.sin(rotationRadians);
            t.d = Math.cos(rotationRadians);
            t.a = t.d;
            t.b = -t.c;
          }
          var sx = scaleX < 1e-6 && scaleX > -1e-6 ? 1e-6 : scaleX, sy = scaleY < 1e-6 && scaleY > -1e-6 ? 1e-6 : scaleY;
          if (1 !== scaleX || 1 !== scaleY) {
            t.a *= sx;
            t.b *= sx;
            t.c *= sy;
            t.d *= sy;
          }
          this._transformDirty = false;
        }
        return this._transform;
      },
      getWorldTransform: function getWorldTransform() {
        if (this.parent) return cc.AffineTransform.concat(cc.AffineTransform.identity, this.parent.getWorldTransform(), this.getTransform());
        return this.getTransform();
      },
      updateTransform: function updateTransform(parentTransformDirty) {
        if (this._transformDirty || parentTransformDirty) {
          var scaleX = this.flipX ? -this._scale.x : this._scale.x;
          var scaleY = this.flipY ? -this._scale.y : this._scale.y;
          var positionX = this._position.x;
          var positionY = this._position.y;
          var rotation = this._rotation;
          var t = this._transform;
          t.tx = positionX;
          t.ty = positionY;
          t.a = t.d = 1;
          t.b = t.c = 0;
          if (rotation) {
            var rotationRadians = .017453292519943295 * rotation;
            t.c = Math.sin(rotationRadians);
            t.d = Math.cos(rotationRadians);
            t.a = t.d;
            t.b = -t.c;
          }
          var sx = scaleX < 1e-6 && scaleX > -1e-6 ? 1e-6 : scaleX, sy = scaleY < 1e-6 && scaleY > -1e-6 ? 1e-6 : scaleY;
          if (1 !== scaleX || 1 !== scaleY) {
            t.a *= sx;
            t.b *= sx;
            t.c *= sy;
            t.d *= sy;
          }
        }
        this.parent ? this._worldTransform = cc.AffineTransform.concat(cc.AffineTransform.identity, this.parent._worldTransform, this._transform) : this._worldTransform = this._transform;
        var children = this.children;
        if (children) for (var i = 0, ii = children.length; i < ii; i++) {
          var child = children[i];
          child.updateTransform(parentTransformDirty || this._transformDirty);
        }
        this._transformDirty = false;
      }
    };
    module.exports = Transform;
    cc._RF.pop();
  }, {} ],
  "R.utils": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "588929pZCZIpIto22fDnVAb", "R.utils");
    "use strict";
    function mixin(dst, src, addon) {
      for (var key in src) if (!addon || addon && !dst[key]) if ("object" === typeof src[key]) {
        dst[key] = {};
        for (var subKey in src[key]) dst[key][subKey] = src[key][subKey];
      } else dst[key] = src[key];
    }
    module.exports = {
      defineClass: function defineClass() {
        var defines = {
          properties: {},
          statics: {}
        };
        for (var i = 0, ii = arguments.length; i < ii; i++) {
          var d = arguments[i];
          mixin(defines.properties, d.properties);
          mixin(defines.statics, d.statics);
          mixin(defines, d, true);
        }
        return defines;
      },
      tesselateBezier: require("./R.tesselateBezier"),
      path2curve: require("R.curve").path2curve,
      drawDashPoints: require("R.dash").drawDashPoints
    };
    cc._RF.pop();
  }, {
    "./R.tesselateBezier": "R.tesselateBezier",
    "R.curve": "R.curve",
    "R.dash": "R.dash"
  } ],
  WxSDKAPI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "626f7o9XLJDiqOlE6hzMVSP", "WxSDKAPI");
    "use strict";
    var _this4 = void 0;
    var WxSDKAPI = cc.Class({
      ctor: function ctor() {
        this._videoCall = null;
        this._video = null;
        this.btnNode = null;
        this._bannerAd = null;
      },
      cloudInit: function cloudInit() {
        wx.cloud.init();
      },
      init: function init(btnNode, startCallF) {
        var _this = this;
        this.btnNode = btnNode;
        wx.loadSubpackage({
          name: "subRes",
          success: function success(res) {
            g_Log("yse!!!");
            window.boot();
          },
          fail: function fail(res) {}
        });
        wx.showShareMenu({
          withShareTicket: true
        });
        wx.updateShareMenu({
          withShareTicket: true
        });
        wx.onShareAppMessage(function() {
          var shareVo = {
            imgType: 1,
            text: "\u6709\u4eba@\u6211 \u70b9\u6211\u5c31\u80fd\u559c\u63d0\u540e\u5bab\u4f73\u4e3d\u4e09\u5343\u4eba\uff01",
            imgName: "https://minigame-cdn.binglue.com/gameHGRYZ/1.jpg"
          };
          return {
            title: shareVo.text,
            imageUrl: shareVo.imgURL
          };
        });
        this.onAppOpen();
        wx.getSystemInfo({
          success: function success(res) {
            g_Log("\u521b\u5efa\u767b\u9646\u6309\u94ae");
            _this.createAuthorizeBtn(startCallF);
          }
        });
      },
      onAppOpen: function onAppOpen() {
        wx.onShow(function(res) {
          g_Log("onshow data" + res.query);
        });
        wx.onHide(function() {});
      },
      updateApp: function updateApp() {
        var updateManager = wx.getUpdateManager();
        updateManager.onCheckForUpdate(function(res) {
          g_Log("\u8bf7\u6c42\u5b8c\u65b0\u7248\u672c\u4fe1\u606f\u7684\u56de\u8c03", res.hasUpdate);
        });
        updateManager.onUpdateReady(function() {
          wx.showModal({
            title: "\u66f4\u65b0\u63d0\u793a",
            content: "\u65b0\u7248\u672c\u5df2\u7ecf\u51c6\u5907\u597d\uff0c\u662f\u5426\u91cd\u542f\u5e94\u7528\uff1f",
            success: function success(res) {
              res.confirm && updateManager.applyUpdate();
            }
          });
        });
        updateManager.onUpdateFailed(function() {
          g_Log("\u65b0\u7684\u7248\u672c\u4e0b\u8f7d\u5931\u8d25");
        });
      },
      createAuthorizeBtn: function createAuthorizeBtn(callFunc) {
        void 0 === callFunc && (callFunc = function callFunc() {
          g_Log("\u672a\u914d\u7f6e\u56de\u8c03");
        });
        var btnSize = cc.size(this.btnNode.width + 10, this.btnNode.height + 10);
        var frameSize = cc.view.getFrameSize();
        var winSize = cc.director.getWinSize();
        var left = (.5 * winSize.width + this.btnNode.x - .5 * btnSize.width) / winSize.width * frameSize.width;
        var top = (.5 * winSize.height - this.btnNode.y - .5 * btnSize.height) / winSize.height * frameSize.height;
        var width = btnSize.width / winSize.width * frameSize.width;
        var height = btnSize.height / winSize.height * frameSize.height;
        g_Log("left" + left);
        var self = this;
        self.btnAuthorize = wx.createUserInfoButton({
          type: "text",
          text: "",
          style: {
            left: left,
            top: top,
            width: width,
            height: height,
            lineHeight: 0,
            textAlign: "center",
            fontSize: 16,
            borderRadius: 4
          }
        });
        self.btnAuthorize.onTap(function(uinfo) {
          self.btnAuthorize.hide();
          self.btnAuthorize.destroy();
          self.reLogin(callFunc);
        });
      },
      reLogin: function reLogin(callFunc) {
        g_Log("\u7528\u6237\u767b\u5f55");
        this.getOpenId();
        wx.getSetting({
          success: function success(res) {
            var authSetting = res.authSetting;
            if (true === authSetting["scope.userInfo"]) {
              g_Log("\u5df2\u7ecf\u6388\u6743");
              callFunc();
            } else {
              g_Log("\u62d2\u7edd\u6388\u6743");
              self.createAuthorizeBtn(callFunc);
            }
          }
        });
      },
      getUserInfo: function getUserInfo(callBack) {
        void 0 === callBack && (callBack = function callBack(res) {
          g_Log("\u6ca1\u8bbe\u7f6e\u56de\u8c03\u51fd\u6570");
        });
        wx.getUserInfo({
          success: function success(res) {
            Object.assign(g_UserData, res.userInfo);
            callBack(res);
          }
        });
      },
      login: function login(code) {
        if (DEBUG) {
          window.g_openId = Date.now();
          g_GAME.serverMgr.send_login({
            code: code,
            testID: g_openId
          });
        } else g_GAME.serverMgr.send_login({
          code: code
        });
      },
      getOpenId: function getOpenId() {
        var _this2 = this;
        DEBUG ? this.login("debug") : wx.login({
          success: function success(res) {
            if (res.code) {
              g_Log("res.code!" + res.code);
              _this2.login(res.code);
            }
          }
        });
      },
      showBannerAdvertisement: function showBannerAdvertisement(id, width, callBack) {
        if ("" == id) return;
        this._bannerAd = wx.createBannerAd({
          adUnitId: id,
          style: {
            left: 0,
            top: 0,
            width: width,
            height: 0
          }
        });
        this._bannerAd.onError(function(err) {
          g_Log("banner \u5e7f\u544a\u52a0\u8f7d\u5931\u8d25", err);
        });
        this._bannerAd.onLoad(function() {});
        this._bannerAd.show();
        return this._bannerAd;
      },
      closeBannerAdvertisement: function closeBannerAdvertisement() {
        if (this._bannerAd) {
          this._bannerAd.destory();
          this._bannerAd = null;
        }
      },
      share: function share(shareVo) {
        wx.shareAppMessage({
          title: shareVo.text,
          imageUrl: shareVo.imgURL,
          query: shareVo.query
        });
      },
      showVideoAdvertisement: function showVideoAdvertisement(id, callBack) {
        var _this3 = this;
        if (this._video && this._videoCall) {
          g_Log("remove pre video!!!");
          this._video.offLoad(this.onVideoLoad);
          this._video.offError(this.onVideoError);
          this._video.offClose(this.onVideoClose);
          this._videoCall = null;
          this._video = null;
        }
        this._videoCall = callBack;
        this._video = wx.createRewardedVideoAd({
          adUnitId: id
        });
        this._video.onLoad(this.onVideoLoad);
        this._video.onError(this.onVideoError);
        this._video.onClose(this.onVideoClose);
        this._video.show()["catch"](function(err) {
          g_Log("\u6fc0\u52b1\u89c6\u9891\u5f02\u5e38~~~", err);
          _this3._video.load().then(function() {
            return _this3._video.show();
          });
        });
      },
      onVideoLoad: function onVideoLoad() {},
      onVideoError: function onVideoError() {
        g_Log("\u6fc0\u52b1\u89c6\u9891\u51fa\u73b0\u95ee\u9898");
        _this4._videoCall(false, "error");
      },
      onVideoClose: function onVideoClose(res) {
        var isEnd = false;
        isEnd = !!(res && res.isEnded || void 0 === res);
        _this4._videoCall(isEnd, "normal");
      },
      inviteFriend: function inviteFriend(data) {
        var roomId = data.roomId;
        g_Log("\u9080\u8bf7\u73a9\u5bb6\u8fdb\u5165roomId" + roomId);
        wx.shareAppMessage({
          title: "\u6d4b\u8bd5\u623f\u95f4\u5206\u4eab",
          query: "roomId=" + roomId + "&avatarUrl" + g_UserData.avatarUrl
        });
      },
      setUserIcon: function setUserIcon(avatar, imgSp) {
        var image = wx.createImage();
        image.onload = function() {
          var texture = new cc.Texture2D();
          texture.width = 40;
          texture.height = 40;
          texture.initWithElement(image);
          texture.handleLoadedTexture();
          imgSp.spriteFrame = new cc.SpriteFrame(texture);
        };
        image.src = avatar;
      },
      getLaunchOptionsSync: function getLaunchOptionsSync() {
        return wx.getLaunchOptionsSync();
      }
    });
    module.exports = WxSDKAPI;
    cc._RF.pop();
  }, {} ],
  ballLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "048dfh37HpHfLZZHBxQfcvu", "ballLayer");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        m_Ball: cc.Node,
        m_UseBtn: cc.Node,
        m_BtnArr: {
          default: [],
          type: cc.Node
        }
      },
      ctor: function ctor() {
        this.m_tarBallId = 0;
      },
      onLoad: function onLoad() {
        this.m_Ball = this.m_Ball.getComponent("ball");
        this.m_Ball.setCtr(this);
      },
      onEnable: function onEnable() {
        cc.director.getPhysicsManager().gravity = cc.v2(0, -500);
      },
      start: function start() {
        this.updateLayer();
      },
      updateLayer: function updateLayer() {
        this.m_BtnArr.forEach(function(item, key) {
          item.getChildByName("name").getComponent(cc.Label).string = BALL.name[key];
        });
      },
      onBtnClick: function onBtnClick(event, data) {
        data == this.m_tarBallId ? this.m_UseBtn.active = false : this.m_UseBtn.active = true;
        this.m_Ball.switchBall(data);
      },
      onBtnUseBall: function onBtnUseBall() {
        var _this = this;
        this.m_tarBallId = this.m_Ball.m_BallId;
        GAME_DATA.ballId = this.m_tarBallId;
        this.m_BtnArr.forEach(function(item, key) {
          var labelNode = item.getChildByName("label");
          key == _this.m_tarBallId ? labelNode.active = true : labelNode.active = false;
        });
        this.m_UseBtn.active = false;
      }
    });
    cc._RF.pop();
  }, {} ],
  ball_bullet: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f3a80n0E2NFyrvNyKNUhWD2", "ball_bullet");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        m_test: cc.Node
      },
      start: function start() {},
      onBeginContact: function onBeginContact(contact, self, other) {
        if ("bottom" == other.node.name) {
          var body = self.node.getComponent(cc.RigidBody);
          var worldCenter = body.getWorldCenter();
          body.applyLinearImpulse(cc.v2(-1e3, 0), worldCenter);
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  ball: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a47cc0J1VFKFLtLoZoGNPJs", "ball");
    "use strict";
    var _cc$Class;
    cc.Class((_cc$Class = {
      extends: cc.Component,
      properties: {
        m_FireShow: cc.Node,
        m_BallArr: {
          type: cc.Node,
          default: []
        },
        m_BallId: {
          get: function get() {
            return this._BallId;
          },
          set: function set(value) {
            this._BallId = value;
          }
        }
      },
      ctor: function ctor() {
        this.m_BallId = 0;
        this.m_Status = null;
      },
      switchBall: function switchBall(ballId) {
        this.m_BallId = ballId;
        this.m_BallArr.forEach(function(item, id) {
          item.active = id == ballId;
        });
      },
      start: function start() {},
      setCtr: function setCtr(ctr) {
        this.m_Ctr = ctr;
      },
      setFire: function setFire(bShow) {
        this.m_Status = bShow ? "fire" : "";
        this.m_FireShow.active = bShow;
      },
      getStatus: function getStatus() {
        return this.m_Status;
      },
      onBeginContact: function onBeginContact(contact, selfCollider, otherCollider) {
        "player" == otherCollider.node.name && (this.m_moveType = false);
      }
    }, _cc$Class["onBeginContact"] = function onBeginContact(contact, self, other) {
      if ("bottom" == other.node.name) {
        var body = self.node.getComponent(cc.RigidBody);
        var worldCenter = body.getWorldCenter();
        body.applyLinearImpulse(cc.v2(0, -1e3), worldCenter);
      }
    }, _cc$Class));
    cc._RF.pop();
  }, {} ],
  bk_check: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e45d5bmRvdHUpde+7Ry2OHf", "bk_check");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        m_target: cc.Node
      },
      ctor: function ctor() {
        this.m_check = false;
      },
      onCollisionEnter: function onCollisionEnter(other, self) {
        g_Log("\u649e\u4e0a\u4e86");
        other.node.getPosition().y > self.node.getPosition().y + 20 ? this.m_check = true : this.m_check = false;
      },
      onCollisionExit: function onCollisionExit(other, self) {
        if (this.m_check) {
          this.m_check = false;
          if (other.node.getPosition().y < self.node.getPosition().y - 10) {
            g_Log("defen");
            g_gameLayer2.goal();
          }
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  bottom_img: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6590bOSs4BAOKzs4LSYVSEf", "bottom_img");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {},
      onLoad: function onLoad() {
        this._super();
        var self = this;
        self.node.opacity = 0;
        this.recationArr = [ {
          start: .4,
          end: .6,
          action: function action(data) {
            var progress = data.progress;
            self.node.setContentSize(cc.size(self.node.getContentSize().width, 1500 * progress));
            self.node.opacity = 255 * progress;
          }
        } ];
      },
      end: function end() {
        this._super();
        this.node.opacity = 255;
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  bottom: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dca91l4wYZJjqD8HuIv3+jm", "bottom");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {},
      onLoad: function onLoad() {
        this._super();
        var self = this;
        self.node.opacity = 0;
        this.recationArr = [ {
          start: 0,
          end: .3,
          action: function action(data) {
            var progress = data.progress;
            self.node.setContentSize(cc.size(self.node.getContentSize().width, 1500 * progress));
            self.node.opacity = 255 * progress;
          }
        } ];
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  btn: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b29d0HEnNpOrrZQXuk99f2e", "btn");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {
        var self = this;
      }
    });
    cc._RF.pop();
  }, {} ],
  charactorLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8371fSQlAdJG4xrNrP/qrry", "charactorLayer");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        m_ChaArr: {
          default: [],
          type: cc.Node
        },
        m_UseBtn: cc.Node,
        m_BtnArr: {
          default: [],
          type: cc.Node
        }
      },
      ctor: function ctor() {
        this.m_tarBallId = 0;
      },
      onLoad: function onLoad() {},
      start: function start() {
        this.updateLayer();
      },
      updateLayer: function updateLayer() {
        this.m_BtnArr.forEach(function(item, key) {
          item.getChildByName("name").getComponent(cc.Label).string = CHARACTER.name[key];
        });
      },
      onBtnClick: function onBtnClick(event, data) {
        data == this.m_tarBallId ? this.m_UseBtn.active = false : this.m_UseBtn.active = true;
        this.switchCha(data);
      },
      switchCha: function switchCha(data) {
        this.m_tarBallId = data;
        this.m_ChaArr.forEach(function(item, key) {
          item.active = data == key;
        });
      },
      onBtnUseBall: function onBtnUseBall() {
        var _this = this;
        GAME_DATA.characterId = this.m_tarBallId;
        this.m_BtnArr.forEach(function(item, key) {
          var labelNode = item.getChildByName("label");
          key == _this.m_tarBallId ? labelNode.active = true : labelNode.active = false;
        });
        this.m_UseBtn.active = false;
      }
    });
    cc._RF.pop();
  }, {} ],
  clound: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d374dC9Oy9JboLOPSJ1hHmM", "clound");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        speed: cc.Integer
      },
      ctor: function ctor() {},
      start: function start() {},
      update: function update() {
        this.node.x = this.node.x + this.speed;
        this.node.x > 2200 && (this.node.x = -300);
      }
    });
    cc._RF.pop();
  }, {} ],
  "code-5": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3765d/nYYdBfaimZOgrhsZO", "code-5");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {},
      onLoad: function onLoad() {
        this._super();
        var self = this;
        this.recationArr = [ {
          start: 0,
          end: .2,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data = data, progress = _data.progress;
            self.node.opacity = 255 * progress;
          }
        }, {
          start: .8,
          end: 1,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data2 = data, progress = _data2.progress;
            self.node.opacity = 255 - 255 * progress;
          }
        } ];
      },
      live: function live() {
        this._super();
        self.node.opacity = 0;
      },
      end: function end() {
        this._super();
        self.node.opacity = 0;
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  "code1-1": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "be8beO6caBOqargZJK/XYgM", "code1-1");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {
        endPos: cc.Vec2
      },
      onLoad: function onLoad() {
        var _this = this;
        this._super();
        var self = this;
        this.recationArr = [ {
          start: 0,
          end: .3,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data = data, progress = _data.progress;
            _this.node.opacity = 255 * progress;
          }
        }, {
          start: .7,
          end: .9,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data2 = data, progress = _data2.progress;
            _this.node.position = cc.v2(_this.startPosition.x + (self.endPos.x - _this.startPosition.x) * progress, _this.startPosition.y + (self.endPos.y - _this.startPosition.y) * progress);
          }
        } ];
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  code1: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1ebd3uakNdN0ryQiUMESv+w", "code1");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {},
      onLoad: function onLoad() {
        var _this = this;
        this._super();
        var self = this;
        this.recationArr = [ {
          start: 0,
          end: .3,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data = data, progress = _data.progress;
            _this.node.opacity = 255 * progress;
          }
        }, {
          start: .6,
          end: .7,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data2 = data, progress = _data2.progress;
            _this.node.opacity = 255 - 255 * progress;
          }
        } ];
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  code2_1: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "784ad+m4MtI+bY3a0Uj7TrX", "code2_1");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {
        endPos: cc.Vec2,
        code: cc.String,
        curr: cc.Node,
        offset: cc.Vec2,
        customStart: cc.Float
      },
      onLoad: function onLoad() {
        var _this = this;
        this.shakeFlag = false;
        this._super();
        this.codeArr = this.code.split("");
        var self = this;
        this.recationArr = [ {
          start: (.4 + this.customStart) / 2,
          end: (.4 + this.customStart + .1) / 2,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data = data, progress = _data.progress;
            var richText = self.getComponent(cc.RichText);
            var endId = parseInt(progress * _this.codeArr.length);
            var tempArr = _this.codeArr.slice(0, endId);
            self.curr.setContentSize(cc.size(6, .7 * richText.node.getContentSize().height));
            tempArr = tempArr.map(function(item) {
              if (self.code.includes("methods") && "methods".indexOf(item) > -1) return "<color=#1e88df>" + item + "</color>";
              if (self.code.includes("return") && "return".indexOf(item) > -1) return "<color=#AD582E>" + item + "</color>";
              if (self.code.includes("data") && "data".indexOf(item) > -1) return "<color=#5ab23c>" + item + "</color>";
              return item;
            });
            richText.string = tempArr.join("");
            self.curr.x = self.node.x + richText.node.width;
            self.curr.y = richText.node.y - 2;
          }
        }, {
          start: .7,
          end: .8,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data2 = data, progress = _data2.progress;
            var height = self.node.getContentSize().height;
            _this.node.y = self.startPosition.y - height * _this.offset.y * progress;
          }
        } ];
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  code2_2: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ddd84XH4MhJ+YLHLmN+lW+4", "code2_2");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var DRAW_TYPE = cc.Enum({
      TYPE_DEFAULT: 1,
      TYPE_CIRCLE: 2
    });
    var strokeColor = new cc.Color(255, 235, 4);
    cc.Class({
      extends: _entity["default"],
      properties: {
        endPos: cc.Vec2,
        code: cc.String,
        ctx1: cc.Graphics,
        ctx2: cc.Graphics,
        ctx3: cc.Graphics,
        ctx4: cc.Graphics,
        targetNode: cc.Node,
        targetNodeEnd: cc.Node,
        targetNode2: cc.Node
      },
      getPointFromCodeNode: function getPointFromCodeNode(node, letterIndex, unit, customOffsetX) {
        void 0 === customOffsetX && (customOffsetX = 0);
        var condeStr = node.getComponent(cc.RichText);
        var codeLen = condeStr.string.length;
        var width = node.width;
        var height = node.height;
        var nodeY = node.y;
        var nodeX = node.x;
        var unitX = unit || width / codeLen;
        var unitY = height / 2;
        var pointArr = [];
        var centerPoint = {
          x: nodeX + letterIndex * unitX - unitX / 2,
          y: nodeY
        };
        var offsetCommon = {
          oX: 5,
          oY: -5
        };
        var offsetArr = [ {
          oX: -unitX / 2,
          oY: -unitY
        }, {
          oX: -unitX / 2,
          oY: unitY
        }, {
          oX: unitX / 2,
          oY: unitY
        }, {
          oX: unitX / 2,
          oY: -unitY
        } ];
        for (var i = 0; i < 4; i++) {
          var offset = offsetArr[i];
          var pointTemp = cc.v2(centerPoint.x + offset.oX + offsetCommon.oX + customOffsetX, centerPoint.y + offset.oY + offsetCommon.oY);
          pointArr.push(pointTemp);
        }
        return pointArr;
      },
      handleDrawLine: function handleDrawLine(data) {
        var _this = this;
        var ctx = data.ctx, pointArr = data.pointArr, progress = data.progress, _data$drawType = data.drawType, drawType = void 0 === _data$drawType ? DRAW_TYPE.TYPE_DEFAULT : _data$drawType, _data$isLoop = data.isLoop, isLoop = void 0 === _data$isLoop || _data$isLoop;
        ctx.clear();
        var vlineArr = [];
        var pointArrLen = pointArr.length;
        pointArr.forEach(function(item, index) {
          var start = item;
          var end;
          end = index === pointArrLen - 1 ? pointArr[0] : pointArr[index + 1];
          vlineArr.push(end.sub(start));
        });
        isLoop || (vlineArr = vlineArr.slice(0, vlineArr.length - 1));
        var vlineMagArr = vlineArr.map(function(item) {
          return item.mag();
        });
        var totalMag = vlineMagArr.reduce(function(total, current) {
          return total + current;
        }, 0);
        var basePoint = [ pointArr[0] ];
        var targetLength = 0;
        vlineMagArr.forEach(function(itemMag, index) {
          targetLength += itemMag;
          targetLength / totalMag < progress && basePoint.push(pointArr[index + 1]);
        });
        var processBaseLine = function processBaseLine(params) {
          var type = params.type, point = params.point, index = params.index;
          type === DRAW_TYPE.TYPE_CIRCLE ? _this.drawPointLine(_extends({}, data, {
            start: basePoint[index - 1],
            end: point,
            progress: 1,
            isAdd: true
          })) : drawType === DRAW_TYPE.TYPE_DEFAULT && ctx.lineTo(point.x, point.y);
        };
        var processDrawLine = function processDrawLine(params) {
          var type = params.type;
          type === DRAW_TYPE.TYPE_CIRCLE ? _this.drawPointLine(_extends({}, data, targetPoint, {
            progress: progressTemp
          })) : drawType === DRAW_TYPE.TYPE_DEFAULT && _this.drawLine(_extends({}, data, targetPoint, {
            progress: progressTemp
          }));
        };
        basePoint.forEach(function(point, index) {
          0 === index ? ctx.moveTo(point.x, point.y) : processBaseLine({
            type: drawType,
            point: point,
            index: index
          });
        });
        var targetPointIndex = basePoint.length;
        var targetPoint;
        targetPoint = targetPointIndex < pointArr.length ? {
          start: pointArr[targetPointIndex - 1],
          end: pointArr[targetPointIndex]
        } : {
          start: pointArr[targetPointIndex - 1],
          end: pointArr[0]
        };
        var progressTemp = (progress * totalMag - vlineMagArr.slice(0, targetPointIndex - 1).reduce(function(total, current) {
          return total + current;
        }, 0)) / vlineMagArr[targetPointIndex - 1];
        processDrawLine(_extends({}, data, targetPoint, {
          progress: progressTemp,
          type: drawType
        }));
      },
      drawPointLine: function drawPointLine(_ref) {
        var ctx = _ref.ctx, start = _ref.start, end = _ref.end, progress = _ref.progress, space = _ref.space, radius = _ref.radius, isAdd = _ref.isAdd, fillColor = _ref.fillColor;
        var unit = 2 * radius + space;
        var vline = end.sub(start);
        var vlineLen = vline.mag();
        var sumPart = parseInt(vlineLen / unit);
        var drawCount = parseInt(sumPart * progress);
        for (var i = 1; i < drawCount; i++) {
          var c = vline.mul(i / sumPart);
          ctx.circle(c.x + start.x, c.y + start.y, radius);
          ctx.fillColor = fillColor;
          ctx.fill();
        }
        if (1 == progress && isAdd) {
          ctx.circle(end.x, end.y, radius);
          ctx.fillColor = fillColor;
          ctx.fill();
        }
      },
      drawLine: function drawLine(_ref2) {
        var ctx = _ref2.ctx, start = _ref2.start, end = _ref2.end, progress = _ref2.progress, space = _ref2.space, radius = _ref2.radius, isAdd = _ref2.isAdd, strokeColor = _ref2.strokeColor;
        ctx.strokeColor = strokeColor;
        ctx.lineWidth = 5;
        var unit = space;
        var vline = end.sub(start);
        var vlineLen = vline.mag();
        var sumPart = parseInt(vlineLen / unit);
        var drawCount = parseInt(sumPart * progress);
        for (var i = 1; i < drawCount; i++) {
          var c = vline.mul(i / sumPart);
          ctx.lineTo(c.x + start.x, c.y + start.y);
        }
        1 == progress && isAdd && ctx.lineTo(end.x, end.y);
        ctx.stroke();
      },
      onLoad: function onLoad() {
        var _this2 = this;
        this._super();
        var pointArr = this.getPointFromCodeNode(this.targetNode, 16);
        var pointArr2 = [ pointArr[0], cc.v2(this.targetNode.x, pointArr[0].y), cc.v2(this.targetNode.x, this.targetNodeEnd.y + 15) ];
        var pointArr3 = this.getPointFromCodeNode(this.targetNodeEnd, 1, 21, -8);
        pointArr3 = [ pointArr3[1], pointArr3[0], pointArr3[3], pointArr3[2] ];
        var pointArr4 = [ cc.v2(this.targetNode2.x + .6 * this.targetNode2.width, this.targetNode2.y), cc.v2(this.targetNode2.x + 1.5 * this.targetNode2.width, this.targetNode2.y), cc.v2(this.targetNode2.x + 1.5 * this.targetNode2.width, this.targetNodeEnd.y - 100), cc.v2(this.targetNode2.x + 30, this.targetNodeEnd.y - 100), cc.v2(this.targetNode2.x + 30, this.targetNode2.y) ];
        this.codeArr = this.code.split(" ");
        var self = this;
        this.recationArr = [ {
          start: 0,
          end: .04,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data = data, progress = _data.progress;
            _this2.handleDrawLine({
              ctx: _this2.ctx1,
              pointArr: pointArr,
              progress: progress,
              space: 3,
              radius: 2,
              isAdd: true,
              strokeColor: strokeColor
            });
          }
        }, {
          start: .04,
          end: .12,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data2 = data, progress = _data2.progress;
            _this2.handleDrawLine({
              ctx: _this2.ctx2,
              pointArr: pointArr2,
              progress: progress,
              space: 4,
              radius: 3,
              isAdd: true,
              strokeColor: strokeColor,
              drawType: 2,
              isLoop: false,
              fillColor: new cc.Color(255, 235, 4)
            });
          }
        }, {
          start: .12,
          end: .16,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data3 = data, progress = _data3.progress;
            _this2.handleDrawLine({
              ctx: _this2.ctx3,
              pointArr: pointArr3,
              progress: progress,
              space: 3,
              radius: 2,
              isAdd: true,
              strokeColor: strokeColor
            });
          }
        }, {
          start: .16,
          end: .2,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data4 = data, progress = _data4.progress;
            _this2.handleDrawLine({
              ctx: _this2.ctx1,
              pointArr: pointArr,
              progress: 1,
              space: 3,
              radius: 2,
              isAdd: true,
              strokeColor: new cc.Color(255, 235, 4, 255 - 255 * progress)
            });
            _this2.handleDrawLine({
              ctx: _this2.ctx2,
              pointArr: pointArr2,
              progress: 1,
              space: 4,
              radius: 3,
              isAdd: true,
              strokeColor: strokeColor,
              drawType: 2,
              isLoop: false,
              fillColor: new cc.Color(255, 235, 4, 255 - 255 * progress)
            });
            _this2.handleDrawLine({
              ctx: _this2.ctx3,
              pointArr: pointArr3,
              progress: 1,
              space: 3,
              radius: 2,
              isAdd: true,
              strokeColor: new cc.Color(255, 235, 4, 255 - 255 * progress)
            });
          }
        }, {
          start: .9,
          end: 1,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data5 = data, progress = _data5.progress;
            _this2.handleDrawLine({
              ctx: _this2.ctx4,
              pointArr: pointArr4,
              progress: progress,
              space: 3,
              radius: 2,
              isAdd: true,
              isLoop: false,
              strokeColor: new cc.Color(255, 235, 255)
            });
          }
        } ];
      },
      live: function live() {
        this._super();
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  code2: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d9e0dKHLVtBoJi34AurNQN2", "code2");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {
        endPos: cc.Vec2
      },
      onLoad: function onLoad() {
        var _this = this;
        this._super();
        var self = this;
        this.recationArr = [ {
          start: 0,
          end: .3,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data = data, progress = _data.progress;
            _this.node.position = cc.v2(self.startPosition.x + 112 * progress, self.startPosition.y - 47 * progress);
            1 === progress && (_this.startPosition = _this.node.position);
          }
        }, {
          start: .7,
          end: .9,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data2 = data, progress = _data2.progress;
            _this.node.position = cc.v2(_this.startPosition.x + (self.endPos.x - _this.startPosition.x) * progress, _this.startPosition.y + (self.endPos.y - _this.startPosition.y) * progress);
          }
        } ];
      },
      live: function live() {
        this.isLive = true;
        this.node.active = true;
      },
      end: function end() {
        this.isLive = false;
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  code3: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "62287ojpKVLUIkOibw+5qRZ", "code3");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {},
      onLoad: function onLoad() {
        var _this = this;
        this._super();
        var self = this;
        this.recationArr = [ {
          start: 0,
          end: 1,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data = data, progress = _data.progress;
            _this.node.position = cc.v2(self.startPosition.x, self.startPosition.y - 130 * progress);
          }
        } ];
      },
      live: function live() {
        this.isLive = true;
        this.node.active = true;
      },
      end: function end() {
        this.isLive = false;
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  code6: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "63bafu+S4VGzqszc4kX9QDG", "code6");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {},
      onLoad: function onLoad() {
        var _this = this;
        this._super();
        var self = this;
        this.recationArr = [ {
          start: 0,
          end: .7,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data = data, progress = _data.progress;
            _this.node.opacity = 255 * progress;
          }
        } ];
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  config: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "53981bWnZNMhblpI6xX6VI3", "config");
    "use strict";
    window.GAME_DATA = {
      ballId: 0,
      characterId: 0
    };
    window.g_UserData = {
      id: -1,
      openId: null
    };
    cc._RF.pop();
  }, {} ],
  define: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c847bDtYm9HEbEt394yb4Bf", "define");
    "use strict";
    window.g_bMove = false;
    window.bJumping = [];
    window.playerBody = [];
    window.MaxHitDis = 230;
    window.MaxHitimpulse = 5e3;
    window.PACKET_PER_SEC = 60;
    window.SPEED = 7.5;
    window.Player = [];
    window.Door = [];
    window.flag = [ false, false ];
    window.DEBUG = true;
    window.g_openId = null;
    window.WXSDK = null;
    window.g_Server = null;
    window.g_GAME = null;
    window.g_gameLayer2 = null;
    window.MATCH_DATA = null;
    window.ROOM_FRIEND = 1;
    window.LAYER = cc.Enum({
      matchL: -1,
      characterL: -1,
      ballL: -1,
      bulletL: -1,
      lobbyL: -1,
      achieventL: -1,
      endL: -1
    });
    window.BALL = {
      name: {
        0: "\u8db3\u74031",
        1: "\u7bee\u74031",
        2: "\u6392\u7403",
        3: "\u9ed1\u516b",
        4: "\u6a44\u6984",
        5: "\u4e94\u661f\u9f99\u73e0",
        6: "\u98de\u706b\u6d41\u661f",
        7: "\u5730\u7206\u5929\u661f"
      }
    };
    window.CHARACTER = {
      name: {
        0: "\u5c0f\u9f99\u4eba",
        1: "\u6447\u6eda\u54e5",
        2: "\u5c0f\u50bb\u72d7",
        3: "\u5f85\u5b9a"
      }
    };
    window.g_Log = function(data) {};
    cc._RF.pop();
  }, {} ],
  doodle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c9ac6LBR+ZCepBC2pAEy+8p", "doodle");
    "use strict";
    cc.Class({
      extends: cc.Component,
      ctor: function ctor() {
        this.isClick = false;
      },
      properties: {
        reactivity: .5,
        debug: false
      },
      onEnable: function onEnable() {
        this.graphics = this.getComponent(cc.Graphics);
        this.nodes = [];
        this.nodesTemp = [];
        this.ripples = [];
        this.mouse = {
          x: 0,
          y: 0
        };
        this.color = {
          r: 0,
          g: 0,
          b: 0,
          a: 255
        };
        this.cycle = 90;
        this.createBezierNodes();
        var canvas = cc.find("Canvas");
        canvas.on(cc.Node.EventType.TOUCH_START, function(touch, event) {
          this.mouse = touch.getLocation();
          var v = this.mouse.sub(cc.v2(.5 * cc.winSize.width, .5 * cc.winSize.height));
          var test = v.mag();
          if (test > 600) {
            this.isClick = true;
            var event = new CustomEvent("completeFromGame", {
              detail: {
                status: 1
              }
            });
            document.dispatchEvent(event);
          } else {
            this.isClick = false;
            var event = new CustomEvent("completeFromGame", {
              detail:{status: 2}
            });
            document.dispatchEvent(event);
          }
          this.addRipple();
        }, this);
        canvas.on(cc.Node.EventType.TOUCH_END, function() {
          this.input = false;
        }, this);
      },
      createBezierNodes: function createBezierNodes() {
        this.updateColorCycle();
        for (var quantity = 0, len = 6; quantity < len; quantity++) {
          var theta = 2 * Math.PI * quantity / len;
          var x = .5 * cc.winSize.width + 0 * Math.cos(theta);
          var y = .5 * cc.winSize.height + 0 * Math.sin(theta);
          this.nodes.push({
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            lastX: x,
            lastY: y,
            min: 550,
            max: 650,
            disturb: 50,
            orbit: 20,
            angle: Math.random() * Math.PI * 2,
            speed: .01 + .01 * Math.random(),
            theta: theta
          });
          this.nodesTemp = [].concat(this.nodes);
        }
      },
      addRipple: function addRipple() {
        this.input = true;
        if (0 === this.ripples.length) {
          this.updateColorCycle();
          this.ripples.push({
            x: this.mouse.x,
            y: this.mouse.y,
            reactivity: 0,
            fade: 1
          });
        }
      },
      updateColorCycle: function updateColorCycle() {
        this.cycle = 100 !== Math.min(this.cycle + this.reactivity + .3, 100) ? this.cycle += this.reactivity + .3 : 0;
        var color = this.color;
        color.r = ~~(127 * Math.sin(.3 * this.cycle + 0) + 128);
        color.g = ~~(127 * Math.sin(.3 * this.cycle + 2) + 128);
        color.b = ~~(127 * Math.sin(.3 * this.cycle + 4) + 128);
      },
      update: function update(dt) {
        var _this = this;
        var nodes = this.nodesTemp;
        var ripples = this.ripples;
        var ease = .01, friction = .98;
        for (var index = 0; index < ripples.length; index++) {
          var ripple = ripples[index];
          ripple.reactivity += 5;
          ripple.fade -= .05;
          ripple.fade <= 0 && ripples.splice(index, 1);
        }
        [].forEach.call(nodes, function(node, index) {
          node.lastX += .08 * (.5 * cc.winSize.width + node.disturb * Math.cos(node.theta) - node.lastX);
          node.lastY += .08 * (.5 * cc.winSize.height + node.disturb * Math.sin(node.theta) - node.lastY);
          node.x += .08 * (node.lastX + Math.cos(node.angle) * node.orbit - node.x);
          node.y += .08 * (node.lastY + Math.sin(node.angle) * node.orbit - node.y);
          _this.isClick ? node.vx += (node.min / 5 - node.disturb) * ease : node.vx += (node.min - node.disturb) * ease;
          node.vx *= friction;
          node.disturb += node.vx;
          _this.input && (_this.isClick ? node.disturb += (node.max / 5 - node.disturb) * _this.reactivity : node.disturb += (node.max - node.disturb) * _this.reactivity);
          node.angle += node.speed;
        });
        this.render();
      },
      render: function render() {
        var _this2 = this;
        var nodes = this.nodesTemp;
        var ripples = this.ripples;
        var graphics = this.graphics;
        var color = this.color;
        var currentIndex, nextIndex, xc, yc;
        color.a = this.debug ? 255 : 127.5;
        graphics.clear();
        [].forEach.call(nodes, function(node, index) {
          currentIndex = nodes[nodes.length - 1];
          nextIndex = nodes[0];
          xc = currentIndex.x + .5 * (nextIndex.x - currentIndex.x);
          yc = currentIndex.y + .5 * (nextIndex.y - currentIndex.y);
          var strokeColor = cc.color().fromHEX(_this2.debug ? "#a9a9a9" : "#e5e5e5");
          strokeColor.a = _this2.debug ? 255 : 127.5;
          graphics.strokeColor = strokeColor;
          graphics.fillColor = color;
          graphics.lineWidth = _this2.debug ? 1 : 5;
          graphics.moveTo(xc, yc);
          for (var N = 0; N < nodes.length; N++) {
            currentIndex = nodes[N];
            nextIndex = N + 1 > nodes.length - 1 ? nodes[N - nodes.length + 1] : nodes[N + 1];
            xc = currentIndex.x + .5 * (nextIndex.x - currentIndex.x);
            yc = currentIndex.y + .5 * (nextIndex.y - currentIndex.y);
            _this2.isClick ? graphics.quadraticCurveTo(currentIndex.x, currentIndex.y, xc, yc) : graphics.lineTo(currentIndex.x, currentIndex.y, xc, yc);
          }
          if (!_this2.isClick) {
            var startPoint = nodes[nodes.length - 1];
            var endPoint = nodes[0];
            graphics.lineTo(endPoint.x, endPoint.y, startPoint.x, startPoint.y);
          }
          _this2.debug ? null : graphics.fill();
          graphics.stroke();
          graphics.lineWidth = 1;
          graphics.lineCap = cc.Graphics.LineCap.ROUND;
          graphics.lineJoin = cc.Graphics.LineJoin.ROUND;
          graphics.strokeColor.fromHEX("#a9a9a9");
          graphics.fillColor.fromHEX("#a9a9a9");
        });
        for (var index = 0; index < ripples.length; index++) {
          var ripple = ripples[index];
          var fillColor = cc.color().fromHEX("#ffffff");
          fillColor.a = 255 * ripple.fade;
          graphics.fillColor = fillColor;
          graphics.circle(ripple.x, ripple.y, ripple.reactivity);
          graphics.fill();
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  door: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5e98cTv4zRG64bGjKUelCuO", "door");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        m_Ani: cc.Animation
      },
      ctor: function ctor() {},
      start: function start() {},
      setCtr: function setCtr(ctr) {
        this.m_Ctr = ctr;
      },
      setDoorId: function setDoorId(id) {
        this.m_Id = id;
      },
      onCollisionEnter: function onCollisionEnter(other, self) {
        Door[this.m_Id].m_Ani.play();
        this.m_Ctr.schedule(this.m_Ctr.shake, 1 / 60, 60);
        this.m_Ctr.scheduleOnce(function() {
          this.m_Camera.setPosition(0, 0);
          this.unschedule(self.shake);
          var event = new CustomEvent("completeFromGame", {
            detail: {
              status: 1
            }
          });
          document.dispatchEvent(event);
        }, 1);
      }
    });
    cc._RF.pop();
  }, {} ],
  entity0: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "735fb2WtkBA9qjSkHeOC95T", "entity0");
    "use strict";
    var _entity = _interopRequireDefault(require("../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {},
      ctor: function ctor() {},
      onLoad: function onLoad() {
        this._super();
      },
      live: function live() {
        this._super();
        this.node.active = true;
      }
    });
    cc._RF.pop();
  }, {
    "../base/entity": "entity"
  } ],
  entity1: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f3625eawbVJyZoPlI0NH8hE", "entity1");
    "use strict";
    var _entity = _interopRequireDefault(require("../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      onLoad: function onLoad() {
        this._super();
        var self = this;
        self.startPosition = self.node.position;
        this.recationArr = [];
      },
      ctor: function ctor() {},
      end: function end() {
        this._super();
        this.node.opacity = 0;
      },
      live: function live() {
        this._super();
        this.node.opacity = 255;
      }
    });
    cc._RF.pop();
  }, {
    "../base/entity": "entity"
  } ],
  entity2: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "afac0nrvKFK97qLCSINMt7t", "entity2");
    "use strict";
    var _entity = _interopRequireDefault(require("../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {
        curr: cc.Node,
        fadeNode: cc.Node
      },
      onLoad: function onLoad() {
        var _this = this;
        this._super();
        this.shakeFlag = false;
        this.isStop = false;
        var self = this;
        self.startPosition = self.node.position;
        this.recationArr = [ {
          start: 0,
          end: .7,
          action: function action(data) {
            void 0 === data && (data = {});
            _this.isStop = false;
            _this.curr.active = true;
          }
        }, {
          start: .7,
          end: 1,
          action: function action(data) {
            void 0 === data && (data = {});
            _this.isStop = true;
            _this.curr.active = false;
          }
        } ];
      },
      update: function update() {
        this._super();
        if (this.isStop) this.curr.active = false; else if (this.shakeFlag) {
          var now = Date.now();
          if (now - this.shakeFlag > 500) {
            this.shakeFlag = now;
            this.curr.active = !this.curr.active;
          }
        } else this.shakeFlag = Date.now();
      },
      process: function process(props) {
        if (0 === this._super(props)) return;
        if (this.isStop) this.curr.active = false; else {
          this.shakeFlag = 0;
          this.curr.active = true;
        }
      }
    });
    cc._RF.pop();
  }, {
    "../base/entity": "entity"
  } ],
  entityEnd: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "135a5G4tcBOQ7npcyXrN2o5", "entityEnd");
    "use strict";
    var _entity = _interopRequireDefault(require("../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {
        lenPercent: cc.Float
      },
      onLoad: function onLoad() {
        var _this = this;
        this._super();
        var self = this;
        self.node.opacity = 0;
        this.recationArr = [ {
          start: 0,
          end: .05,
          action: function action(data) {
            _this.node.opacity = 255 * Math.min(self.progressValue / data.actionLen, 1);
          }
        } ];
      },
      end: function end() {
        this._super();
        this.node.opacity = 0;
      },
      live: function live() {
        this._super();
        this.node.active = true;
      }
    });
    cc._RF.pop();
  }, {
    "../base/entity": "entity"
  } ],
  entity: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3822b7+9N1E07OWxGAZpNd5", "entity");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var _default = cc.Class({
      extends: cc.Component,
      properties: {
        lenPercent: cc.Float,
        startPercent: cc.Float,
        isAutoStart: cc.Boolean,
        entityArr: {
          default: [],
          type: cc.Node
        }
      },
      ctor: function ctor() {
        this.isLive = false;
        this.startTime = void 0;
        this.endTime = void 0;
        this.internalDuration = 0;
        this.externalDuration = 0;
        this.progressValue = 0;
        this.entryData = [];
        this.recationArr = [];
        this.startPosition = cc.v2();
        this.entityArrEx = [];
      },
      start: function start() {
        this.startPosition = this.node.position;
      },
      onLoad: function onLoad() {
        this.node.comName = this.__classname__;
        this.internalDuration = this.node.getContentSize().height;
        this.lenPercent + this.startPercent > 1 && (this.lenPercent = 1 - this.startPercent);
        this.isAutoStart && (this.startPercent += Math.abs(this.node.position.y / this.node.parent.getContentSize().height));
      },
      onEnable: function onEnable() {
        var _this = this;
        var self = this;
        this.entityArr.length && (this.entityArrEx = this.entityArr.map(function(item, index) {
          var entity = item.getComponent(item._name);
          entity.isAutoStart;
          _this.entryData.push(entity.initData({
            startTime: _this.getStarTime(entity.startPercent),
            totaTime: self.internalDuration
          }));
          return entity;
        }));
      },
      getStarTime: function getStarTime(value) {
        return value <= 1 ? value * this.internalDuration : value;
      },
      initData: function initData(_ref) {
        var totaTime = _ref.totaTime, startTime = _ref.startTime;
        this.startTime = startTime;
        this.externalDuration = this.lenPercent <= 1 ? totaTime * this.lenPercent : this.lenPercent;
        this.endTime = Math.min(totaTime, this.startTime + this.externalDuration);
        return {
          startTime: this.startTime,
          internalDuration: this.internalDuration,
          endTime: this.endTime
        };
      },
      getCurrentTime: function getCurrentTime(percent) {
        return this.startTime + (percent <= 1 ? this.externalDuration * percent : percent);
      },
      live: function live() {
        this.isLive = true;
      },
      calcProgress: function calcProgress() {
        this.progressValue = (this.timeLine - this.startTime) / this.externalDuration;
      },
      calcReactionProgress: function calcReactionProgress(_ref2) {
        var start = _ref2.start, end = _ref2.end;
        start = start <= 1 ? this.internalDuration * start : start;
        end = end <= 1 ? this.internalDuration * end : end;
        return Math.min((this.progressValue * this.internalDuration - start) / (end - start), 1);
      },
      process: function process(_ref3) {
        var _this2 = this;
        var timeLine = _ref3.timeLine;
        if (this.timeLine === timeLine) return 0;
        this.timeLine = timeLine;
        this.calcProgress();
        this.internalTimeLine = this.progressValue * this.internalDuration;
        var actionArr = this.recationArr.filter(function(item) {
          if (item) {
            var isOk = timeLine > _this2.getCurrentTime(item.start) && timeLine <= _this2.getCurrentTime(item.end) || !item.start && !item.end;
            if (isOk) item.isAction = true; else {
              item.isAction && item.action(_this2.calcActionData(item, true));
              item.isAction = false;
            }
            return isOk;
          }
        });
        actionArr.forEach(function(item) {
          item.action(_this2.calcActionData(item));
        });
      },
      update: function update() {
        var self = this;
        this.actionEntityArr = this.entityArrEx.filter(function(entity) {
          if (self.internalTimeLine > entity.startTime && self.internalTimeLine <= entity.endTime) {
            entity.isLive || entity.live();
            entity.process({
              timeLine: self.progressValue * self.internalDuration
            });
            return true;
          }
          entity.isLive && entity.end();
          return false;
        });
      },
      calcActionData: function calcActionData(item, isEnd) {
        var params = {};
        var actionLen = item.end - item.start || 1;
        var progress;
        progress = Math.min((this.progressValue - item.start) / actionLen, 1);
        if (isEnd) {
          var isEndForce = window.GLOBAL.dir > 0;
          var isEndForceStart = window.GLOBAL.dir < 0;
          isEndForce ? progress = 1 : isEndForceStart && (progress = 0);
          params = {
            isEndForce: isEndForce,
            isEndForceStart: isEndForceStart
          };
        }
        params = _extends({
          actionLen: actionLen,
          progress: progress
        }, params, item);
        return params;
      },
      end: function end() {
        var _this3 = this;
        this.isLive = false;
        this.recationArr.forEach(function(item) {
          if (item.isAction) {
            item.isAction = false;
            item.action(_this3.calcActionData(item, true));
          }
        });
      }
    });
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ],
  "event-names": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b2886HkOVNLk7RQK4+q+aZ6", "event-names");
    "use strict";
    exports.__esModule = true;
    exports.C_JUMP = exports.C_HIT = exports.C_RIGHT_UP = exports.C_RIGHT_DOWN = exports.C_LEFT_UP = exports.C_LEFT_DOWN = exports.C_JOIN_ROOM = exports.C_CREATE_ROOM = exports.C_LOIN = exports.S_CREATE_ROOM_OK = exports.S_SET_SCORE = exports.S_NEW_ROUND = exports.S_BALL_POS = exports.S_RIGHT_END = exports.S_RIGHT_START = exports.S_LEFT_END = exports.S_LEFT_START = exports.S_PLAYER_JUMP = exports.S_LOGIN_SUCCESS = exports.S_PLAYER_FIRE = exports.S_GAME_END = exports.S_GAME_START = void 0;
    var S_GAME_START = "gameStart";
    exports.S_GAME_START = S_GAME_START;
    var S_GAME_END = "gameEnd";
    exports.S_GAME_END = S_GAME_END;
    var S_PLAYER_FIRE = "fire";
    exports.S_PLAYER_FIRE = S_PLAYER_FIRE;
    var S_LOGIN_SUCCESS = "loginSucess";
    exports.S_LOGIN_SUCCESS = S_LOGIN_SUCCESS;
    var S_PLAYER_JUMP = "jump";
    exports.S_PLAYER_JUMP = S_PLAYER_JUMP;
    var S_LEFT_START = "left_start";
    exports.S_LEFT_START = S_LEFT_START;
    var S_LEFT_END = "left_end";
    exports.S_LEFT_END = S_LEFT_END;
    var S_RIGHT_START = "right_start";
    exports.S_RIGHT_START = S_RIGHT_START;
    var S_RIGHT_END = "right_end";
    exports.S_RIGHT_END = S_RIGHT_END;
    var S_BALL_POS = "pos";
    exports.S_BALL_POS = S_BALL_POS;
    var S_NEW_ROUND = "new_round";
    exports.S_NEW_ROUND = S_NEW_ROUND;
    var S_SET_SCORE = "set_score";
    exports.S_SET_SCORE = S_SET_SCORE;
    var S_CREATE_ROOM_OK = "create_room_ok";
    exports.S_CREATE_ROOM_OK = S_CREATE_ROOM_OK;
    var C_LOIN = "login";
    exports.C_LOIN = C_LOIN;
    var C_CREATE_ROOM = "create_room";
    exports.C_CREATE_ROOM = C_CREATE_ROOM;
    var C_JOIN_ROOM = "join_room";
    exports.C_JOIN_ROOM = C_JOIN_ROOM;
    var C_LEFT_DOWN = "left_down";
    exports.C_LEFT_DOWN = C_LEFT_DOWN;
    var C_LEFT_UP = "left_up";
    exports.C_LEFT_UP = C_LEFT_UP;
    var C_RIGHT_DOWN = "right_down";
    exports.C_RIGHT_DOWN = C_RIGHT_DOWN;
    var C_RIGHT_UP = "right_up";
    exports.C_RIGHT_UP = C_RIGHT_UP;
    var C_HIT = "hit";
    exports.C_HIT = C_HIT;
    var C_JUMP = "jump";
    exports.C_JUMP = C_JUMP;
    cc._RF.pop();
  }, {} ],
  fight: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "77c57M06+1JJbKPOYI1Ers+", "fight");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      ctor: function ctor() {
        this.m_HitFlag = false;
      },
      start: function start() {},
      setCtr: function setCtr(ctr) {
        this.m_ctr = ctr;
      },
      onCollisionEnter: function onCollisionEnter(other, self) {
        g_Log("\u649e\u4e0a\u4e86");
        this.hit(self.node.getPosition(), other.node);
      },
      hit: function hit(targetPos, ball) {
        var _this = this;
        if (this.m_HitFlag) return;
        this.m_ctr.reduceBullet();
        var ballPos = ball.getPosition();
        var body = ball.getComponent(cc.RigidBody);
        body.linearVelocity = cc.v2(0, 0);
        var vec = ballPos.sub(targetPos);
        var num = 22e3;
        var angle = vec.angle(cc.v2(1, 0));
        var impulse = {
          x: -num * Math.sin(angle),
          y: num * Math.cos(angle) / 3
        };
        var worldCenter = body.getWorldCenter();
        body.applyLinearImpulse(impulse, worldCenter);
        new Promise(function(res, rej) {
          _this.m_HitFlag = false;
          var scaleBy = cc.scaleTo(.3, .8);
          var callfunc = cc.callFunc(function() {
            _this.node.active = false;
            res();
          });
          var seq = cc.sequence(scaleBy, callfunc);
          _this.node.runAction(seq);
        }).then(function() {
          _this.scheduleOnce(function() {
            _this.m_HitFlag = false;
            _this.node.setScale(1.3);
            _this.node.active = true;
          }, .2);
        });
      }
    });
    cc._RF.pop();
  }, {} ],
  gameEngine_s: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fa442PfmSNKc5cogVcW/Mow", "gameEngine_s");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        m_Basket: cc.Node,
        m_Basket2: cc.Node,
        m_Edge1: cc.Node,
        m_Edge2: cc.Node,
        M_Chain: cc.Node,
        m_ChainArr: {
          type: cc.Node,
          default: []
        },
        m_BulletArr: {
          type: cc.Node,
          default: []
        },
        m_Fight: cc.Node
      },
      ctor: function ctor() {
        this.m_BulletSum = 14;
        this.m_Status = null;
      },
      start: function start() {
        this.m_Fight.getComponent("fight").setCtr(this);
        g_gameLayer2 = this;
      },
      onEnable: function onEnable() {
        cc.director.getPhysicsManager().gravity = cc.v2(500, 0);
      },
      goal: function goal() {
        this.m_BulletSum = 14;
        this.refreshBulletShow();
        var x = 700 * Math.random() - 365;
        var y = 560 * Math.random() - 280;
        var d_x = x - this.m_Basket2.x;
        var d_y = y - this.m_Basket2.y;
        this.m_ChainArr.forEach(function(item) {
          return item.setPosition(item.x + d_x, item.y + d_y);
        });
        this.m_Basket2.x = x;
        this.m_Basket2.y = y;
        this.m_Basket.x = this.m_Basket2.x;
        this.m_Basket.y = this.m_Basket2.y - 135;
        this.m_Edge1.x = this.m_Basket2.x - 80;
        this.m_Edge1.y = this.m_Basket2.y - 110;
        this.m_Edge2.x = this.m_Basket2.x + 80;
        this.m_Edge2.y = this.m_Basket2.y - 110;
      },
      gameEnd: function gameEnd() {
        this.m_BulletSum = 14;
        this.refreshBulletShow();
      },
      resetPosition: function resetPosition() {},
      refreshBulletShow: function refreshBulletShow() {
        var _this = this;
        this.m_BulletArr.forEach(function(item, key) {
          item.active = !(key > _this.m_BulletSum - 1);
        });
      },
      reduceBullet: function reduceBullet() {
        this.m_BulletSum--;
        0 == this.m_BulletSum ? this.gameEnd() : this.refreshBulletShow();
      }
    });
    cc._RF.pop();
  }, {} ],
  gameEngine: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e5c251d5dZP7rBN/tnNeOKL", "gameEngine");
    "use strict";
    var FIRCONNECT = 0;
    var RECONNECT = 1;
    cc.Class({
      extends: cc.Component,
      properties: {
        m_Camera: cc.Node,
        m_LanuchLayer: cc.Node,
        m_Ball: cc.Node,
        m_Player: cc.Node,
        m_Player2: cc.Node,
        m_Door1: cc.Node,
        m_Door2: cc.Node,
        m_Score1: cc.Label,
        m_Score2: cc.Label,
        m_Hit: cc.Node,
        m_Hit2: cc.Node,
        m_BtnLeft: cc.Node,
        m_BtnRight: cc.Node,
        m_FeetSmoke: cc.Prefab,
        m_LandArr: {
          type: cc.Node,
          default: []
        },
        m_No: cc.Node,
        m_ShowGoal: cc.Node,
        m_UI: cc.Node,
        m_lobby: cc.Node,
        m_lobbyLayer: cc.Node,
        m_gameLayer_bullet: cc.Node,
        m_gameLayer_match: cc.Node,
        m_ballLayer: cc.Node,
        m_achieventLayer: cc.Node,
        m_endLayer: cc.Node,
        m_matchLayer: cc.Node,
        m_characterLayer: cc.Node
      },
      ctor: function ctor() {
        this.m_checkTime = null;
        this.m_LayerArr = [];
        this.m_JumpTime = 0;
      },
      switchLayerShow: function switchLayerShow(id) {
        g_Log("\u5207\u6362\u754c\u9762" + id);
        this.m_LayerArr.forEach(function(element, key) {
          element.active = key == id;
        });
      },
      onLoad: function onLoad() {
        cc.debug.setDisplayStats(false);
        this.m_Playerctr = this.m_Player.getComponent("player");
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        var self = this;
        this.m_LayerArr[LAYER.bulletL] = this.m_gameLayer_bullet;
        this.m_LayerArr[LAYER.lobbyL] = this.m_lobbyLayer;
        this.m_LayerArr[LAYER.characterL] = this.m_characterLayer;
        this.m_LayerArr[LAYER.ballL] = this.m_ballLayer;
        this.m_LayerArr[LAYER.achieventL] = this.m_achieventLayer;
        this.m_LayerArr[LAYER.endL] = this.m_endLayer;
        this.m_LayerArr[LAYER.matchL] = this.m_matchLayer;
        this.m_BallCtr = this.m_Ball.getComponent("ball");
        Player[0] = this.m_Player.getComponent("player");
        Player[1] = this.m_Player2.getComponent("player");
        Player[0].setCtr(this, 0);
        Player[1].setCtr(this, 1);
        Door[0] = this.m_Door1.getComponent("door");
        Door[1] = this.m_Door2.getComponent("door");
        Door[0].setCtr(this);
        Door[1].setCtr(this);
        Door[0].setDoorId(0);
        Door[1].setDoorId(1);
        playerBody[0] = this.m_Player.getComponent(cc.RigidBody);
        playerBody[1] = this.m_Player2.getComponent(cc.RigidBody);
        g_GAME = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      },
      onDestroy: function onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
      },
      onKeyDown: function onKeyDown(event) {
        var self = this;
        switch (event.keyCode) {
         case cc.macro.KEY.right:
          self.onBtnClick_right();
          break;

         case cc.macro.KEY.left:
          self.onBtnClick_left();
          break;

         case cc.macro.KEY.space:
          self.jump();
          break;

         case cc.macro.KEY.a:
          self.hit();
        }
      },
      onKeyUp: function onKeyUp(event) {
        var self = this;
        switch (event.keyCode) {
         case cc.macro.KEY.right:
          self.onBtnClick_rightEnd();
          break;

         case cc.macro.KEY.left:
          self.onBtnClick_leftEnd();
          break;

         case cc.macro.KEY.space:
          self.jump();
          break;

         case cc.macro.KEY.a:
          self.hit();
        }
      },
      start: function start() {},
      onBtnClick_left: function onBtnClick_left() {
        var player = Player[0];
        player.setMoveType(1);
      },
      onBtnClick_right: function onBtnClick_right() {
        var player = Player[0];
        player.setMoveType(2);
      },
      onBtnClick_rightEnd: function onBtnClick_rightEnd() {
        var player = Player[0];
        player.setMoveType(0);
        g_bMove = false;
        player.resetAni();
      },
      onBtnClick_leftEnd: function onBtnClick_leftEnd() {
        var player = Player[0];
        player.setMoveType(0);
        g_bMove = false;
        player.resetAni();
      },
      update: function update() {},
      hit: function hit() {
        if (this.m_checkTime) {
          if (!(Date.now() - this.m_checkTime > 300)) return;
          this.m_checkTime = Date.now();
        } else this.m_checkTime = Date.now();
        if (!this.m_Ball.active) return;
        this.m_Playerctr.setAni("hit");
        var ballPos = this.m_Ball.getPosition();
        var playerPos = this.m_Playerctr.node.getPosition();
        playerPos.y -= 50;
        var vec = ballPos.sub(playerPos);
        if (false == this.m_Playerctr.m_bFlip && vec.x < 0) return;
        if (this.m_Playerctr.m_bFlip && vec.x > 0) return;
        var dis = vec.mag();
        if (dis > MaxHitDis) return;
        var percent = 1 - dis / MaxHitDis;
        var num = MaxHitimpulse * percent;
        var angle = vec.angle(cc.v2(1, 0));
        angle * (180 / 3.14);
        var impulse = {
          y: -1 * num * Math.sin(angle),
          x: num * Math.cos(angle)
        };
        flag[g_UserData.id] = true;
        setTimeout(function() {
          flag[g_UserData.id] = false;
        }, 600);
        var touchLoc = cc.v2(845, -905);
        var ani = "hit1";
        var status = "";
        if (vec.y > 80) ani = "hit1"; else if (vec.y <= 130 && vec.y > 20) {
          ani = "hit2";
          status = "fire";
        } else ani = "hit3";
        var body = this.m_Ball.getComponent(cc.RigidBody);
        this.m_Playerctr.setAni(ani, vec);
        var worldCenter = body.getWorldCenter();
        body.applyLinearImpulse(cc.v2(impulse.x, impulse.y), worldCenter);
      },
      jump: function jump() {
        var self = this;
        if (this.m_JumpTime && !(Date.now() - this.m_JumpTime > 1e3)) return;
        this.m_JumpTime = Date.now();
        g_Log("jump");
        var body = playerBody[0];
        g_Log("body.linearVelocity.y", body.linearVelocity.y);
        if (body.node.y < -710 || 0 == body.linearVelocity.y) {
          var worldCenter = body.getWorldCenter();
          var script = body.node.getComponent("player");
          script.setAni("jump");
          var pos = script.node.getPosition();
          pos.y -= 80;
          self.buildSmoke(pos, script.m_bFlip);
          body.applyLinearImpulse(cc.v2(0, 3e3), worldCenter);
        }
      },
      buildSmoke: function buildSmoke(pos, bFlip) {
        var smoke = cc.instantiate(this.m_FeetSmoke);
        if (this.m_Playerctr && this.m_Playerctr.node) {
          smoke.parent = this.m_Playerctr.node.parent;
          smoke.setPosition(pos);
          var animation = smoke.getComponent(cc.Animation);
          animation.on("finished", this.onFinished, smoke);
          var flipXAction = cc.flipX(bFlip);
          smoke.runAction(flipXAction);
        }
      },
      onFinished: function onFinished() {
        this.destroy();
      },
      shake: function shake() {
        var min = -20;
        var max = 20;
        var randomX = min + 40 * Math.random();
        var randomY = min + 40 * Math.random();
        this.m_Camera.x = randomX;
        this.m_Camera.y = randomY;
      }
    });
    window.translate = function(pos) {
      pos = {
        x: pos.x / 30,
        y: -1 * pos.y / 30
      };
      return pos;
    };
    window.translate2 = function(pos) {
      pos.x *= 30;
      pos.y *= -30;
      return pos;
    };
    cc._RF.pop();
  }, {} ],
  gameMain: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b75bdwwJb9DypoW1WR7I178", "gameMain");
    "use strict";
    window.GLOBAL = {
      width: cc.view.getFrameSize().width,
      height: cc.view.getFrameSize().height
    };
    cc.Class({
      extends: cc.Component,
      properties: {
        ball: cc.Node,
        entityArr: {
          type: cc.Node,
          default: []
        },
        totalLength: cc.Number,
        helloPage: cc.Node,
        titleNode: cc.Node,
        musicBtnOn: cc.Node,
        musicBtnOff: cc.Node,
        audioSource: {
          type: cc.AudioSource,
          default: null
        },
        test: cc.AudioClip
      },
      ctor: function ctor() {
        this.dir = 0;
        this.currentTemp = 0;
        this.actionEntityArr = [];
        this.entryData = [];
        this.isMusicOn = true;
      },
      start: function start() {
        setTimeout(function() {
          cc.director.loadScene("login");
        }, 5e3);
      },
      onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStartCallback, this, true);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveCallback, this, true);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEndCallback, this, true);
      },
      onEnable: function onEnable() {
        var _this = this;
        var self = this;
        this.entityArr.length && (this.entityArr = this.entityArr.map(function(item, index) {
          var entity = item.getComponent(item._name);
          entity.isAutoStart;
          _this.entryData.push(entity.initData({
            startTime: _this.getStarTime(entity.startPercent),
            totaTime: _this.totalLength
          }));
          return entity;
        }));
      },
      getStarTime: function getStarTime(value) {
        return value <= 1 ? value * this.totalLength : value;
      },
      onTouchStartCallback: function onTouchStartCallback() {
        if (this.helloPage.active) return;
        this.dir = 0;
        this.ball.stopAllActions();
      },
      onTouchMoveCallback: function onTouchMoveCallback(e) {
        if (this.helloPage.active) return;
        this.ball.position = this.ball.position.add(cc.v2(0, e.getDelta().y));
        Math.abs(e.getDelta().y) < 5 ? this.dir = 0 : this.dir = e.getDelta().y;
        window.GLOBAL.dir = this.dir;
      },
      onTouchEndCallback: function onTouchEndCallback() {
        if (this.helloPage.active) return;
        cc.tween(this.ball).to(1, {
          position: {
            value: this.ball.position.add(cc.v2(0, this.dir > 0 ? Math.max(15 * this.dir, this.dir / Math.abs(this.dir) * 200) : Math.min(15 * this.dir, this.dir / Math.abs(this.dir) * 200))),
            progress: function progress(start, end, current, t) {
              var a = start.lerp(end, 1 - Math.pow(1 - t, 2), current);
              return a;
            }
          }
        }).start();
      },
      update: function update() {
        var _this2 = this;
        if (this.ball.position.y <= 0) {
          this.ball.position = cc.v2(0, 0);
          this.ball.stopAllActions();
        } else if (this.ball.position.y > this.totalLength) {
          this.ball.position = cc.v2(0, this.totalLength);
          this.ball.stopAllActions();
        }
        this.time = Math.min(Math.max(this.ball.position.y, 0), this.totalLength);
        var self = this;
        this.actionEntityArr = this.entityArr.filter(function(entity) {
          if (self.time >= entity.startTime && self.time <= entity.endTime) {
            if (!entity.isLive) {
              _this2.titleNode.getComponent("titleNode").showInfoById(entity.node._name);
              entity.live();
            }
            entity.process({
              timeLine: self.time
            });
            return true;
          }
          entity.isLive && entity.end();
          return false;
        });
      },
      handleClick: function handleClick() {
        this.helloPage.active = false;
      },
      handleMusicClick: function handleMusicClick() {
        this.musicBtnOn.active = this.isMusicOn;
        this.musicBtnOff.active = !this.isMusicOn;
        if (this.isMusicOn) {
          this.isMusicOn = false;
          var audioID = cc.audioEngine.play(this.test, false, .5);
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  gameServer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "36c3aOHvfpHV4GA5N8dcegH", "gameServer");
    "use strict";
    var EVENT = _interopRequireWildcard(require("./event-names.js"));
    function _getRequireWildcardCache() {
      if ("function" !== typeof WeakMap) return null;
      var cache = new WeakMap();
      _getRequireWildcardCache = function _getRequireWildcardCache() {
        return cache;
      };
      return cache;
    }
    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) return obj;
      if (null === obj || "object" !== typeof obj && "function" !== typeof obj) return {
        default: obj
      };
      var cache = _getRequireWildcardCache();
      if (cache && cache.has(obj)) return cache.get(obj);
      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
        desc && (desc.get || desc.set) ? Object.defineProperty(newObj, key, desc) : newObj[key] = obj[key];
      }
      newObj["default"] = obj;
      cache && cache.set(obj, newObj);
      return newObj;
    }
    var Server = function() {
      function Server() {
        var _this = this;
        SOCKET.on("connection", function() {
          g_Log("connection ok!!!");
          _this.sendMsg("connected", {
            openId: g_UserData.openId
          });
        });
        this.addMsgListion();
      }
      var _proto = Server.prototype;
      _proto.addMsgListion = function addMsgListion() {
        var _this2 = this;
        var self = g_GAME;
        window.SOCKET.on(EVENT.S_GAME_START, function(msg) {
          g_Log("gameStart");
          self.m_LanuchLayer.active = false;
          self.m_gameLayer_match.active = true;
          g_UserData.id = msg.playerId;
          g_Log("g_UserData.id" + g_UserData.id);
          0 == g_UserData.id ? self.m_Playerctr = self.m_Player.getComponent("player") : self.m_Playerctr = self.m_Player2.getComponent("player");
          self.m_PlayerBody = self.m_Playerctr.node.getComponent(cc.RigidBody);
          g_Log("g_UserData.id" + g_UserData.id);
          self.m_No.active = false;
        });
        window.SOCKET.on(EVENT.S_PLAYER_FIRE, function(msg) {
          self.m_BallCtr.setFire(msg.bShow);
        });
        window.SOCKET.on(EVENT.S_LOGIN_SUCCESS, function(msg) {
          g_UserData.openId = msg.openId;
          window.g_openId = g_UserData.openId;
          if (!DEBUG) {
            var data = WXSDK.getLaunchOptionsSync();
            g_Log("loginSucess" + JSON.stringify(data.query));
            if ("{}" != JSON.stringify(data.query)) {
              g_Log("\u63a5\u53d7\u6311\u6218\u5411\u670d\u52a1\u5668\u53d1\u8bf7\u6c42," + data.query);
              _this2.send_joinRoom({
                type: 1,
                openid: g_openId,
                matchData: data.query
              });
              g_GAME.switchLayerShow(LAYER.matchL);
            }
          }
        });
        window.SOCKET.on(EVENT.S_PLAYER_JUMP, function(msg) {
          if (_this2.m_JumpTime && !(Date.now() - _this2.m_JumpTime > 1e3)) return;
          _this2.m_JumpTime = Date.now();
          g_Log("jump");
          var body = playerBody[msg.id];
          g_Log("body.linearVelocity.y", body.linearVelocity.y);
          if (body.node.y < -710 || 0 == body.linearVelocity.y) {
            var worldCenter = body.getWorldCenter();
            var script = body.node.getComponent("player");
            script.setAni("jump");
            var pos = script.node.getPosition();
            pos.y -= 80;
            self.buildSmoke(pos, script.m_bFlip);
            body.applyLinearImpulse(cc.v2(0, 3e3), worldCenter);
          }
        });
        window.SOCKET.on(EVENT.S_LEFT_START, function(msg) {
          g_Log("left_start");
          Player[msg.id].setMoveType(1);
          Player[msg.id].node.x = msg.pos.x;
          Player[msg.id].node.y = msg.pos.y;
        });
        window.SOCKET.on(EVENT.S_LEFT_END, function(msg) {
          Player[msg.id].setMoveType(0);
          g_bMove = false;
          Player[msg.id].resetAni();
          Player[msg.id].node.x = msg.pos.x - 21;
          Player[msg.id].node.y = msg.pos.y;
        });
        window.SOCKET.on(EVENT.S_RIGHT_START, function(msg) {
          Player[msg.id].setMoveType(2);
          Player[msg.id].node.x = msg.pos.x;
          Player[msg.id].node.y = msg.pos.y;
        });
        window.SOCKET.on(EVENT.S_RIGHT_END, function(msg) {
          Player[msg.id].setMoveType(0);
          Player[msg.id].resetAni();
          Player[msg.id].node.x = msg.pos.x + 21;
          Player[msg.id].node.y = msg.pos.y;
        });
        window.SOCKET.on(EVENT.S_BALL_POS, function(msg) {
          self.m_Ball.x = msg.pos_ball.x;
          self.m_Ball.y = msg.pos_ball.y;
          g_Log("msg.pos_ball.angle" + msg.pos_ball.angle);
          self.m_Ball.rotation = msg.pos_ball.angle * (180 / 3.14);
        });
        window.SOCKET.on(EVENT.S_NEW_ROUND, function(msg) {
          self.m_Ball.active = true;
        });
        window.SOCKET.on(EVENT.S_SET_SCORE, function(msg) {
          var goalData = msg.goalData;
          self.m_Ball.active = false;
          var id = msg.id;
          1 * goalData[0] > 1 * self.m_Score1.string && Door[1].m_Ani.play();
          1 * goalData[1] > 1 * self.m_Score2.string && Door[0].m_Ani.play();
          self.m_Score1.string = goalData[0];
          self.m_Score2.string = goalData[1];
          self.schedule(self.shake, 1 / 60, 60);
          self.scheduleOnce(function() {
            self.m_Camera.setPosition(0, 0);
            self.unschedule(self.shake);
          }, 1);
        });
        window.SOCKET.on(EVENT.S_SET_SCORE, function(msg) {
          g_Log("gameEnd");
          self.m_LanuchLayer.active = true;
        });
        window.SOCKET.on(EVENT.S_CREATE_ROOM_OK, function(msg) {
          g_Log("create_room_ok\uff0c\u5207\u6362\u6bd4\u8d5b\u754c\u9762");
          g_GAME.switchLayerShow(LAYER.matchL);
          DEBUG || WXSDK.inviteFriend(msg);
        });
      };
      _proto.sendMsg = function sendMsg(key, data) {
        void 0 === data && (data = "0");
        window.SOCKET.emit(key, data);
      };
      _proto.send_login = function send_login(data) {
        g_Log("\u53d1\u9001 login");
        data.msgId = EVENT.C_LOIN;
        this.sendMsg("GAME_MSG", data);
      };
      _proto.send_match = function send_match(data) {
        data.msgId = EVENT.C_CREATE_ROOM;
        this.sendMsg("GAME_MSG", data);
      };
      _proto.send_joinRoom = function send_joinRoom(data) {
        g_Log("\u53d1\u9001 join_room");
        data.msgId = EVENT.C_JOIN_ROOM;
        this.sendMsg("GAME_MSG", data);
      };
      _proto.send_leftDown = function send_leftDown(data) {
        g_Log("\u53d1\u9001 left_down");
        data.msgId = EVENT.C_LEFT_DOWN;
        this.sendMsg("GAME_MSG", data);
      };
      _proto.send_leftUp = function send_leftUp(data) {
        g_Log("\u53d1\u9001 left_up");
        data.msgId = EVENT.C_LEFT_UP;
        this.sendMsg("GAME_MSG", data);
      };
      _proto.send_rightDown = function send_rightDown(data) {
        g_Log("\u53d1\u9001 right_down");
        data.msgId = EVENT.C_RIGHT_DOWN;
        this.sendMsg("GAME_MSG", data);
      };
      _proto.send_rightUp = function send_rightUp(data) {
        g_Log("\u53d1\u9001 right_up");
        data.msgId = EVENT.C_RIGHT_UP;
        this.sendMsg("GAME_MSG", data);
      };
      _proto.send_hit = function send_hit(data) {
        g_Log("\u53d1\u9001 hit");
        data.msgId = EVENT.C_HIT;
        this.sendMsg("GAME_MSG", data);
      };
      _proto.send_jump = function send_jump(data) {
        g_Log("\u53d1\u9001 jump");
        data.msgId = EVENT.C_JUMP;
        this.sendMsg("GAME_MSG", data);
      };
      return Server;
    }();
    module.exports = Server;
    cc._RF.pop();
  }, {
    "./event-names.js": "event-names"
  } ],
  info1: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d84e97q6+BPjZsG0r+Vhc4m", "info1");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {},
      onLoad: function onLoad() {
        this._super();
        var self = this;
        self.node.opacity = 0;
        this.recationArr = [ {
          start: .1,
          end: .3,
          action: function action(data) {
            var progress = data.isEndForce ? 1 : Math.min((self.progressValue - data.start) / data.actionLen, 1);
            self.node.opacity = 255 * progress;
          }
        }, {
          start: .45,
          end: 1,
          isAction: false,
          action: function action(data) {
            var progress = data.isEndForce ? 1 : Math.min((self.progressValue - data.start) / data.actionLen, 1);
            self.node.opacity = 255 - 255 * progress;
          }
        } ];
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  info2: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "01677CmX/BBIZg/WZKvVJaX", "info2");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {
        titleNode: cc.Node
      },
      onLoad: function onLoad() {
        this._super();
        var self = this;
        self.node.opacity = 0;
        this.recationArr = [ {
          start: 0,
          end: .5,
          action: function action(data) {
            var progress = data.progress;
            self.node.opacity = 255 * progress;
          }
        } ];
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  infoCell: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5b114RBOVNMRoA4/pxoSfdI", "infoCell");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {
        endPos: cc.Vec2,
        customStart: cc.Float,
        isMove: cc.Boolean
      },
      onLoad: function onLoad() {
        var _this = this;
        this._super();
        var self = this;
        this.isMove ? this.recationArr = [ {
          start: this.customStart,
          end: this.customStart + .05,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data = data, progress = _data.progress;
            _this.node.position = cc.v2(_this.startPosition.x + (self.endPos.x - _this.startPosition.x) * progress, _this.node.y);
          }
        }, {
          start: .7,
          end: .8,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data2 = data, progress = _data2.progress;
            var height = self.node.getContentSize().height;
            _this.node.y = self.startPosition.y - height * progress;
          }
        } ] : this.recationArr = [ {
          start: this.customStart,
          end: this.customStart + .05,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data3 = data, progress = _data3.progress;
            _this.node.position = cc.v2(_this.startPosition.x + (self.endPos.x - _this.startPosition.x) * progress, _this.startPosition.y + (self.endPos.y - _this.startPosition.y) * progress);
          }
        } ];
      },
      live: function live() {
        this.isLive = true;
        this.node.active = true;
      },
      end: function end() {
        this.isLive = false;
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  info: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "743fbo2P75OiIfMpN5MrijI", "info");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {},
      onLoad: function onLoad() {
        this._super();
        var self = this;
        this.recationArr = [ {
          start: 0,
          end: .6,
          action: function action(data) {
            var progress = data.progress;
            self.node.opacity = 255 * progress;
          }
        } ];
      },
      start: function start() {},
      live: function live() {
        this.isLive = true;
        this.node.active = true;
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  jelly: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "04ff5H0b39GeaOcG0RdNTXo", "jelly");
    "use strict";
    var Tentacle = require("./tentacle");
    var colours = [ {
      s: "#1C4347",
      f: "#49ACBB"
    }, {
      s: "#1b3b3a",
      f: "#61cac8"
    }, {
      s: "#2d393f",
      f: "#88a5b3"
    }, {
      s: "#422b3a",
      f: "#b0809e"
    }, {
      s: "#5b263a",
      f: "#d85c8a"
    }, {
      s: "#580c23",
      f: "#ff3775"
    }, {
      s: "#681635",
      f: "#EB1962"
    } ];
    cc.Class({
      extends: cc.Component,
      properties: {
        pathSides: 14
      },
      onLoad: function onLoad() {},
      init: function init(group, id) {
        this.group = group;
        this.path = group.addPath();
        this.pathRadius = 10 * Math.random() + 40;
        this.pathPoints = [ this.pathSides ];
        this.pathPointsNormals = [ this.pathSides ];
        this.location = cc.v2(cc.winSize.width / 2, cc.winSize.height / 2);
        this.velocity = cc.v2(0, 0);
        this.acceleration = cc.v2(0, 0);
        this.maxSpeed = .1 * Math.random() + .15;
        this.maxTravelSpeed = 3.5 * this.maxSpeed;
        this.maxForce = .2;
        this.wanderTheta = 0;
        this.numTentacles = 0;
        this.startTentacles = -1;
        var theta = 2 * Math.PI / this.pathSides;
        for (var i = 0; i < this.pathSides; i++) {
          var angle = theta * i;
          var x = Math.cos(angle) * this.pathRadius * .7;
          var y = Math.sin(angle) * this.pathRadius;
          if (angle > Math.PI && angle < 2 * Math.PI) {
            y -= Math.sin(angle) * (.6 * this.pathRadius);
            -1 === this.startTentacles && (this.startTentacles = i);
            this.numTentacles++;
          }
          var point = cc.v2(x, y);
          this.pathPoints[i] = point;
          this.pathPointsNormals[i] = point.normalize();
        }
        this.originalPoints = this.pathPoints.map(function(point) {
          return point.clone();
        });
        this.path.points(this.pathPoints, true);
        this.path.smooth();
        this.path.lineWidth = 5;
        this.path.lineColor = new cc.Color().fromHEX(colours[id].s);
        this.path.fillColor = new cc.Color().fromHEX(colours[id].f);
        this.tentacles = [];
        for (var t = 0; t < this.numTentacles; t++) {
          this.tentacles[t] = new Tentacle();
          this.tentacles[t].init(group, 7, 4);
          this.tentacles[t].path.lineColor = this.path.lineColor;
          this.tentacles[t].path.lineWidth = this.path.lineWidth;
        }
      },
      update: function update(time, count) {
        this.lastLocation = this.location.clone();
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
        var sep = this.velocity.mag() / this.maxTravelSpeed;
        if (sep > 1) {
          this.velocity.x /= sep;
          this.velocity.y /= sep;
        }
        this.location.x += this.velocity.x;
        this.location.y += this.velocity.y;
        this.acceleration.x = this.acceleration.y = 0;
        this.path.position = this.location.clone();
        var orientation = -(Math.atan2(this.velocity.y, this.velocity.x) - Math.PI / 2);
        this.path.rotation = cc.misc.radiansToDegrees(orientation);
        for (var i = 0; i < this.pathSides; i++) {
          var segmentPoint = this.pathPoints[i];
          var sineSeed = -(count * this.maxSpeed + .0375 * this.originalPoints[i].y);
          var normalRotatedPoint = this.pathPointsNormals[i];
          segmentPoint.x += normalRotatedPoint.x * Math.sin(sineSeed);
          segmentPoint.y += normalRotatedPoint.y * Math.sin(sineSeed);
        }
        this.path.points(this.pathPoints, true);
        this.path.smooth();
        this.wander();
        this.checkBounds();
        for (var t = 0; t < this.numTentacles; t++) {
          this.tentacles[t].anchor.x = this.pathPoints[this.startTentacles + t].x;
          this.tentacles[t].anchor.y = this.pathPoints[this.startTentacles + t].y;
          this.tentacles[t].path.position = this.path.position;
          this.tentacles[t].path.rotation = this.path.rotation;
          this.tentacles[t].update();
        }
      },
      steer: function steer(target, slowdown) {
        var steer;
        var desired = cc.v2(target.x - this.location.x, target.y - this.location.y);
        var dist = desired.mag();
        if (dist > 0) {
          if (slowdown && dist < 100) desired.divSelf(this.maxTravelSpeed * (dist / 100) / dist); else {
            desired.length = this.maxTravelSpeed;
            desired.divSelf(this.maxTravelSpeed / dist);
          }
          steer = cc.v2(desired.x - this.velocity.x, desired.y - this.velocity.y);
          steer.length = Math.min(this.maxForce, steer.length);
        } else steer = cc.v2(0, 0);
        return steer;
      },
      seek: function seek(target) {
        var steer = this.steer(target, false);
        this.acceleration.x += steer.x;
        this.acceleration.y += steer.y;
      },
      wander: function wander() {
        var wanderR = 5;
        var wanderD = 100;
        var change = .05;
        this.wanderTheta += Math.random() * (2 * change) - change;
        var circleLocation = this.velocity.clone();
        0 !== circleLocation.x && 0 !== circleLocation.y && (circleLocation = circleLocation.normalize());
        circleLocation.x *= wanderD;
        circleLocation.y *= wanderD;
        circleLocation.x += this.location.x;
        circleLocation.y += this.location.y;
        var circleOffset = cc.v2(wanderR * Math.cos(this.wanderTheta), wanderR * Math.sin(this.wanderTheta));
        var target = cc.v2(circleLocation.x + circleOffset.x, circleLocation.y + circleOffset.y);
        this.seek(target);
      },
      checkBounds: function checkBounds() {
        var offset = 60;
        this.location.x < -offset && (this.location.x = cc.winSize.width + offset);
        this.location.x > cc.winSize.width + offset && (this.location.x = -offset);
        this.location.y < -offset && (this.location.y = cc.winSize.height + offset);
        this.location.y > cc.winSize.height + offset && (this.location.y = -offset);
      }
    });
    cc._RF.pop();
  }, {
    "./tentacle": "tentacle"
  } ],
  lanuchLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0954f3Id5dD8IB3um3rzM4D", "lanuchLayer");
    "use strict";
    var WxSDKAPI = require("WxSDKAPI");
    cc.Class({
      extends: cc.Component,
      properties: {
        m_StartBtn: cc.Node
      },
      onLoad: function onLoad() {
        if (DEBUG) this.startGame(); else {
          WXSDK = new WxSDKAPI();
          WXSDK.init(this.m_StartBtn, this.startGame.bind(this));
        }
      },
      startGame: function startGame() {
        g_Log("\u8fdb\u5165\u5927\u5385");
        this.node.active = false;
        g_GAME.m_lobby.active = true;
        g_GAME.switchLayerShow(LAYER.lobbyL);
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    WxSDKAPI: "WxSDKAPI"
  } ],
  lobbyLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "996c90Cw05JBYoVUwPP1m0/", "lobbyLayer");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        m_Ball: cc.Node,
        m_ChaArr: {
          default: [],
          type: cc.Node
        }
      },
      ctor: function ctor() {
        this.m_tarBallId = 0;
      },
      onLoad: function onLoad() {
        this.m_Ball = this.m_Ball.getComponent("ball");
        this.m_Ball.setCtr(this);
      },
      onEnable: function onEnable() {
        this.m_Ball.switchBall(GAME_DATA.ballId);
        this.m_ChaArr.forEach(function(item, key) {
          GAME_DATA.characterId == key ? item.active = true : item.active = false;
        });
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  lobby: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b6a0cBXlWVBiKs2k/yTAg8X", "lobby");
    "use strict";
    var WxSDKAPI = require("WxSDKAPI");
    window.wxSdk = null;
    cc.Class({
      extends: cc.Component,
      properties: {
        m_StartBtn: cc.Node,
        m_HeadImg: cc.Sprite
      },
      ctor: function ctor() {
        this.m_btnCallFMgr = {
          0: this.CallF_battle,
          1: this.CallF_myChracter,
          2: this.CallF_myBall,
          3: this.CallF_bullet,
          4: this.CallF_lobby,
          5: this.CallF_achievent,
          6: this.CallF_end
        };
        this.m_Ctr = null;
        this.m_smokeTime = 0;
        this.m_bFlip = false;
        this._armatureDisPlay = null;
        this.m_bDowning = false;
      },
      onEnable: function onEnable() {
        g_Log("\u83b7\u53d6\u7528\u6237\u7684\u4fe1\u606f");
        DEBUG || WXSDK.getUserInfo(this.updateLayer.bind(this));
      },
      updateLayer: function updateLayer() {
        g_Log("\u83b7\u53d6\u73a9\u5bb6\u7528\u6237\u4fe1\u606f\u56de\u8c03\u51fd\u6570\uff0c\u8bbe\u7f6e\u73a9\u5bb6\u5934\u50cf");
        WXSDK.setUserIcon(g_UserData.avatarUrl, this.m_HeadImg);
      },
      start: function start() {
        this._armatureDisPlay = this.m_Ani;
        var self = this;
        this.m_Body = this.node.getComponent(cc.RigidBody);
      },
      setGameEngine: function setGameEngine(engine) {
        g_GAME = engine;
      },
      onBtnClick: function onBtnClick(event, data) {
        g_GAME.switchLayerShow(data);
        data in this.m_btnCallFMgr ? this.m_btnCallFMgr[data].call(this, data) : g_Log("\u8be5\u6309\u94ae\u672a\u914d\u7f6e\u51fd\u6570");
      },
      CallF_battle: function CallF_battle(data) {
        g_Log("\u73a9\u5bb6\u5bf9\u6218");
        g_GAME.serverMgr.send_match({
          type: 1,
          openid: g_openId || Date.now()
        });
      },
      CallF_bullet: function CallF_bullet() {
        g_Log("\u5b50\u5f39\u6a21\u5f0f");
      },
      CallF_myBall: function CallF_myBall() {
        g_Log("\u6211\u7684\u7403");
      },
      CallF_myChracter: function CallF_myChracter() {
        g_Log("\u6211\u7684\u89d2\u8272");
      },
      CallF_achievent: function CallF_achievent() {},
      CallF_end: function CallF_end() {},
      CallF_lobby: function CallF_lobby() {}
    });
    cc._RF.pop();
  }, {
    WxSDKAPI: "WxSDKAPI"
  } ],
  logo: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7f758eTFKZBLJmE/XHc4ukQ", "logo");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {},
      onLoad: function onLoad() {
        this._super();
        var self = this;
        this.node.opacity = 0;
        var action = cc.fadeIn(1);
        this.node.runAction(action);
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  man: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9d429EznJ1GUIlXfAlYX3lo", "man");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {},
      onLoad: function onLoad() {
        this._super();
        var self = this;
        this.recationArr = [ {
          start: 0,
          end: .5,
          action: function action(data) {
            var progress = data.progress;
            self.node.scale = 1.1 * progress;
          }
        }, {
          start: 0,
          end: .4,
          action: function action(data) {
            var progress = data.progress;
            self.node.opacity = 255 * progress;
          }
        } ];
      },
      initData: function initData(_ref) {
        var totaTime = _ref.totaTime, startTime = _ref.startTime;
        this.startTime = startTime;
        this.externalDuration = totaTime * this.lenPercent;
        this.endTime = this.startTime + this.externalDuration;
        return {
          startTime: this.startTime,
          internalDuration: this.internalDuration,
          endTime: this.endTime
        };
      },
      start: function start() {},
      live: function live() {
        this.isLive = true;
        this.node.active = true;
      },
      end: function end() {
        this.isLive = false;
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  matchLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "15c6bTcLwZF7rneXrTK+6kG", "matchLayer");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        m_HeadImg1: cc.Sprite,
        m_HeadImg2: cc.Sprite
      },
      ctor: function ctor() {},
      onLoad: function onLoad() {},
      onEnable: function onEnable() {},
      start: function start() {},
      renderLayer: function renderLayer(data) {
        WXSDK.setUserIcon(data.avatarUrl, this.m_HeadImg1);
        WXSDK.setUserIcon(g_UserData.avatarUrl, this.m_HeadImg2);
      }
    });
    cc._RF.pop();
  }, {} ],
  name: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6d040qxlFJD9o9Mth6A4Jat", "name");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {},
      onLoad: function onLoad() {
        this._super();
        var self = this;
        self.node.opacity = 0;
        this.recationArr = [];
        var action = cc.fadeIn(1);
        this.node.runAction(action);
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  nardove: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "85d55J9j8lKe5TeLh4YqRwK", "nardove");
    "use strict";
    var Jelly = require("./jelly");
    cc.Class({
      extends: cc.Component,
      properties: {
        addJellyTimer: 5,
        jellyCounter: 0,
        numJellies: 7
      },
      onLoad: function onLoad() {
        this.jellies = [];
        this.time = this.addJellyTimer;
        this.count = 0;
        this.group = this.addComponent("R.group");
      },
      update: function update(dt) {
        this.time += dt;
        this.count++;
        if (this.time >= this.addJellyTimer && this.jellyCounter < this.numJellies) {
          var jelly = new Jelly();
          jelly.init(this.group, this.jellyCounter);
          this.jellies.push(jelly);
          this.jellyCounter++;
          this.time = 0;
        }
        for (var i = 0, ii = this.jellies.length; i < ii; i++) {
          var jelly = this.jellies[i];
          jelly.update(this.time, this.count);
        }
      }
    });
    cc._RF.pop();
  }, {
    "./jelly": "jelly"
  } ],
  par: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cc7221q+1VL6YcEkK3o2mBc", "par");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      ctor: function ctor() {},
      onEnable: function onEnable() {
        var rand = Math.random();
        this.scheduleOnce(function() {
          this.getComponent(cc.ParticleSystem).resetSystem();
        }, rand);
      }
    });
    cc._RF.pop();
  }, {} ],
  "physics-bound": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "46d5eCJoHxE7bKT/5dgkYN/", "physics-bound");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        size: cc.size(0, 0),
        mouseJoint: true,
        test: cc.Node
      },
      onLoad: function onLoad() {
        var width = this.size.width || this.node.width;
        var height = this.size.height || this.node.height;
        var node = new cc.Node();
        var body = node.addComponent(cc.RigidBody);
        body.type = cc.RigidBodyType.Static;
        if (this.mouseJoint) {
          var joint = node.addComponent(cc.MouseJoint);
          joint.mouseRegion = this.node;
        }
        this._addBound(node, 0, height / 2 - 100, width, 20);
        this._addBound(node, 0, -height / 2 + 100, width, 20);
        this._addBound(node, -width / 2, 0, 20, height);
        this._addBound(node, width / 2, 0, 20, height);
        node.parent = this.node;
      },
      _addBound: function _addBound(node, x, y, width, height) {
        var collider = node.addComponent(cc.PhysicsBoxCollider);
        collider.offset.x = x;
        collider.offset.y = y;
        collider.size.width = width;
        collider.size.height = height;
      },
      testbtn: function testbtn() {
        var body = this.test.getComponent(cc.RigidBody);
        var worldCenter = body.getWorldCenter();
        body.applyLinearImpulse(cc.v2(0, 3e9), worldCenter);
      }
    });
    cc._RF.pop();
  }, {} ],
  plane0_1: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b159f4I7hZHPoPNaoYrDc7i", "plane0_1");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {
        plane: cc.Node
      },
      onLoad: function onLoad() {
        this._super();
        var self = this;
        var action = cc.moveBy(1, cc.v2(this.node.getContentSize().width + 500, 500));
        var action2 = cc.spawn(action, cc.scaleTo(1, 2));
        this.node.runAction(cc.sequence(cc.delayTime(2), action2, cc.callFunc(function() {
          self.node.active = false;
          self.node.parent.active = false;
          self.plane.runAction(cc.moveTo(1, cc.v2(0, 0)));
        })));
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  plane0_2: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b8d39CY2EpOt7UlJYxZhPZb", "plane0_2");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {},
      onLoad: function onLoad() {
        this._super();
        var self = this;
        var action = cc.moveBy(1.5, cc.v2(this.node.getContentSize().width + 100, 200));
        this.node.runAction(action);
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  plane1_2: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "39eee3X9KpBLYDUsupcIrYr", "plane1_2");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {},
      onLoad: function onLoad() {
        this._super();
        var self = this;
        this.recationArr = [ {
          start: 0,
          end: 1,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data = data, _data$isEndForce = _data.isEndForce, isEndForce = void 0 !== _data$isEndForce && _data$isEndForce;
            var reactionProgress = isEndForce ? 1 : self.calcReactionProgress({
              start: 0,
              end: 1
            });
            var scale = reactionProgress;
            self.node.scale = scale;
          }
        } ];
      },
      start: function start() {},
      live: function live() {
        this.isLive = true;
        this.node.active = true;
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  planeEnd: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f672dRaPOlKwLr84DEYiCc3", "planeEnd");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {},
      onLoad: function onLoad() {
        this._super();
        var self = this;
        this.recationArr = [ {
          start: 0,
          end: .4,
          action: function action(data) {
            var progress = data.isEndForce ? 1 : Math.min((self.progressValue - data.start) / data.actionLen, 1);
            self.node.position = cc.v2(self.startPosition.x + progress * self.node.getContentSize().width * 2.2, self.startPosition.y + progress * self.node.getContentSize().height * 2.2);
          }
        }, {
          start: .2,
          end: .4,
          isAction: false,
          action: function action(data) {
            var progress = data.isEndForce ? 1 : Math.min((self.progressValue - data.start) / data.actionLen, 1);
            self.node.scale = 1 + 2 * progress;
            self.node.opacity = 255 - 255 * progress;
          }
        } ];
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  plane: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3f698IjYcBJ7oULHdLpl+YU", "plane");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {
        show1: cc.Node,
        show2: cc.Node
      },
      onLoad: function onLoad() {
        var _this = this;
        this._super();
        var self = this;
        this.recationArr = [ {
          start: 0,
          end: 1,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data = data, progress = _data.progress;
            _this.node.position = cc.v2(self.startPosition.x - progress * self.node.parent.getContentSize().width * .5, self.startPosition.y + progress * self.node.parent.getContentSize().height * .03);
          }
        }, {
          start: 0,
          end: .5,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data2 = data, progress = _data2.progress;
            _this.show2.scale = 1.5 * progress;
          }
        }, {
          start: .5,
          end: 1,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data3 = data, progress = _data3.progress;
            _this.show2.scale = 1.5 - progress;
          }
        } ];
      },
      update: function update() {
        this.show1.active = this.progressValue > .7;
        this.show2.active = this.progressValue <= .7;
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  player: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "588cdzd0VRCe74JdVLDcoOO", "player");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        m_Ani: dragonBones.ArmatureDisplay,
        m_Hit: cc.Animation
      },
      ctor: function ctor() {
        this.m_moveType = null;
        this.bMoving = false;
        this.m_Ctr = null;
        this.m_smokeTime = 0;
        this.m_bFlip = false;
        this._armatureDisPlay = null;
        this.m_bDowning = false;
      },
      setFlip: function setFlip(bFlip) {
        this.m_bFlip = bFlip;
      },
      start: function start() {
        this._armatureDisPlay = this.m_Ani;
        var self = this;
        this.m_Body = this.node.getComponent(cc.RigidBody);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(event) {
          self.OnTouchMove(event);
        }, this);
      },
      setCtr: function setCtr(ctr, id) {
        this.m_id = id;
        this.m_Ctr = ctr;
      },
      sendPos: function sendPos(dt) {
        if (this.m_moveType) if (2 == this.m_moveType) if (0 != this.m_Body.linearVelocity.y) this.node.x += SPEED; else {
          this.node.x += SPEED;
          this.m_smokeTime += dt;
          if (this.m_smokeTime > 1) {
            var pos = this.node.getPosition();
            pos.y -= 80;
            this.m_Ctr.buildSmoke(pos, this.m_bFlip);
            this.m_smokeTime = 0;
          }
        } else if (0 != this.m_Body.linearVelocity.y) this.node.x -= SPEED; else {
          this.node.x -= SPEED;
          this.m_smokeTime += dt;
          if (this.m_smokeTime > 1) {
            var pos = this.node.getPosition();
            pos.y -= 80;
            this.m_Ctr.buildSmoke(pos, this.m_bFlip);
            this.m_smokeTime = 0;
          }
        }
      },
      OnTouchMove: function OnTouchMove(event) {
        this.node.x += event.getDelta().x;
        this.node.y += event.getDelta().y;
        var pos = {};
        pos.x = this.node.x;
        pos.y = this.node.y;
      },
      setMoveType: function setMoveType(type) {
        var self = this;
        this.UpdateInst || (this.UpdateInst = setInterval(function() {
          self.sendPos.call(self, 1 / 60);
        }, 1e3 / PACKET_PER_SEC));
        this.m_moveType = type;
        this.resetAni();
        if (1 == this.m_moveType) {
          this.m_bFlip = true;
          var flipXAction = cc.flipX(this.m_bFlip);
          this.m_Ani.node.runAction(flipXAction);
        } else if (2 == this.m_moveType) {
          this.m_bFlip = false;
          var flipXAction = cc.flipX(this.m_bFlip);
          this.m_Ani.node.runAction(flipXAction);
        }
      },
      hit: function hit(ball) {
        if (!this.m_Ctr.m_Ball.active) return;
        if (this.m_id == g_UserData.id && flag[g_UserData.id]) return;
        var ballPos = ball.getPosition();
        var playerPos = this.node.getPosition();
        var vec = ballPos.sub(playerPos);
        if (!this.m_moveType && false == this.m_bFlip && vec.x < 0) {
          this.m_bFlip = !this.m_bFlip;
          var flipXAction = cc.flipX(this.m_bFlip);
          this.m_Ani.node.runAction(flipXAction);
        }
        if (!this.m_moveType && this.m_bFlip && vec.x > 0) {
          this.m_bFlip = !this.m_bFlip;
          var flipXAction = cc.flipX(this.m_bFlip);
          this.m_Ani.node.runAction(flipXAction);
        }
        var num = 180;
        var angle = vec.angle(cc.v2(1, 0));
        var impulse = {
          y: -1 * num * Math.sin(angle) / 2,
          x: num * Math.cos(angle) / 2
        };
        "fire" == ball.getComponent("ball").getStatus() ? this.setAni("fire", vec) : this.setAni("hit2", vec);
        if (this.m_id != g_UserData.id) return;
        g_GAME.serverMgr.send_hit({
          impulse: impulse,
          type: "body"
        });
      },
      onBeginContact: function onBeginContact(contact, selfCollider, otherCollider) {
        if ("ball" == otherCollider.node.name) {
          var ballPos = selfCollider.node.getPosition();
          var playerPos = otherCollider.node.getPosition();
          var vec = ballPos.sub(playerPos);
          var angle = vec.angle(cc.v2(1, 0));
          var num = 2e3;
          var impulse = {
            y: num * Math.sin(angle),
            x: -1 * num * Math.cos(angle) / 2
          };
          var body = otherCollider.node.getComponent(cc.RigidBody);
          var worldCenter = body.getWorldCenter();
          body.linearVelocity = cc.v2(0, 0);
          body.applyLinearImpulse(cc.v2(impulse.x, impulse.y), worldCenter);
        }
      },
      onCollisionEnter: function onCollisionEnter(other, self) {
        "ball" == other.node.name && this.hit(other.node);
      },
      setAni: function setAni(ani, hitPos) {
        if (hitPos) {
          this.m_Hit.node.setPosition(hitPos);
          this.m_Hit.play();
        }
        this._armatureDisPlay.playAnimation(ani, 1);
        this._armatureDisPlay.addEventListener(dragonBones.EventObject.COMPLETE, this.resetAni, this);
      },
      resetAni: function resetAni() {
        this.m_bDowning ? this._armatureDisPlay.playAnimation("down", -1) : this.m_moveType ? "walk" !== this._armatureDisPlay.animationName && this._armatureDisPlay.playAnimation("walk", -1) : this._armatureDisPlay.playAnimation("stand", -1);
      },
      update: function update() {
        if (this.m_Body.linearVelocity.y < -1500) {
          this.m_Body.node.x = this.m_Ctr.m_Ball.x;
          this.m_Body.node.y = this.m_Ctr.m_Ball.y;
        }
        if (this.m_Body.linearVelocity.y < 0) {
          if (!this.m_bDowning) {
            this.m_bDowning = true;
            this._armatureDisPlay.playAnimation("down", -1);
          }
          this.m_bDowning && "stand" == this._armatureDisPlay.animationName && this._armatureDisPlay.playAnimation("down", -1);
        }
        if (0 == this.m_Body.linearVelocity.y && this.m_bDowning) {
          this.m_bDowning = false;
          var pos = this.node.getPosition();
          pos.y -= 80;
          this.m_Ctr.buildSmoke(pos, this.m_bFlip);
          this.resetAni();
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  raphael: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1127doa6dNG/4FYRF3+zUZI", "raphael");
    "use strict";
    window.R = window.R || {};
    R.utils = require("./utils/R.utils");
    R.group = require("./R.group");
    R.path = require("./R.path");
    cc._RF.pop();
  }, {
    "./R.group": "R.group",
    "./R.path": "R.path",
    "./utils/R.utils": "R.utils"
  } ],
  showFade: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2f2e0wZjLFMeZSgP6+fF8QX", "showFade");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {
        refreshBtn: cc.Button
      },
      onLoad: function onLoad() {
        var _this = this;
        this.time = 0;
        this._super();
        this.recationArr = [ {
          start: .8,
          end: 1,
          action: function action(data) {
            void 0 === data && (data = {});
            var _data = data, progress = _data.progress;
            _this.meterial.effect.setProperty("time", 1.2 * progress);
          }
        } ];
      },
      start: function start() {
        var labelC = this.node.getComponent(cc.Sprite);
        this.meterial = labelC.getMaterial(0);
        var a = 1;
      },
      refreshOnce: function refreshOnce() {
        this.refreshBtn.interactable = false;
        this.schedule(this.myUpdate, 0, cc.macro.REPEAT_FOREVER, 0);
      },
      myUpdate: function myUpdate() {
        this.time += .01;
        this.meterial.effect.setProperty("time", this.time);
        if (this.time > 1.2) {
          this.unschedule(this.myUpdate);
          this.refreshBtn.interactable = true;
          this.time = 0;
          this.meterial.effect.setProperty("time", this.time);
        }
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  "socket.io": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b81a3G9wUBHdpawr2N3Ak59", "socket.io");
    "use strict";
    cc._RF.pop();
  }, {} ],
  sun: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cf6da1EYDtGP6ON21dW/LNc", "sun");
    "use strict";
    var _entity = _interopRequireDefault(require("../../base/entity"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: _entity["default"],
      properties: {},
      onLoad: function onLoad() {
        this._super();
        var self = this;
        self.node.opacity = 0;
        this.recationArr = [ {
          start: .2,
          end: .3,
          action: function action(data) {
            var progress = data.isEndForce ? 1 : Math.min((self.progressValue - data.start) / data.actionLen, 1);
            self.node.opacity = 255 * progress;
          }
        }, {
          start: 0,
          end: 1,
          action: function action(data) {
            var progress = data.isEndForce ? 1 : Math.min((self.progressValue - data.start) / data.actionLen, 1);
            self.node.position = cc.v2(self.startPosition.x, self.startPosition.y + 300 * progress);
          }
        } ];
      }
    });
    cc._RF.pop();
  }, {
    "../../base/entity": "entity"
  } ],
  target: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "354a5AwpIdFcqAGTLw6dc5o", "target");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        m_target: cc.Node
      },
      ctor: function ctor() {},
      start: function start() {
        var _this = this;
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(event) {
          _this.touchMove(event);
        }, this);
      },
      touchMove: function touchMove(event) {
        var pos = this.node.convertToNodeSpaceAR(event.getLocation());
        this.m_target.setPosition(pos);
      }
    });
    cc._RF.pop();
  }, {} ],
  tentacle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "06e140gewhG9pluryJqSGEy", "tentacle");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {},
      init: function init(group, numSegments, length) {
        this.path = group.addPath();
        this.path.fillColor = "none";
        this.numSegments = numSegments;
        this.segmentLength = 1 * Math.random() + length - 1;
        this.points = [];
        for (var i = 0; i < this.numSegments; i++) this.points.push(cc.v2(0, i * this.segmentLength));
        this.path.lineCap = cc.Graphics.LineCap.ROUND;
        this.anchor = this.points[0];
      },
      update: function update() {
        this.points[1].x = this.anchor.x;
        this.points[1].y = this.anchor.y - 1;
        for (var i = 2; i < this.numSegments; i++) {
          var px = this.points[i].x - this.points[i - 2].x;
          var py = this.points[i].y - this.points[i - 2].y;
          var pt = cc.v2(px, py);
          var len = pt.mag();
          if (len > 0) {
            this.points[i].x = this.points[i - 1].x + pt.x * this.segmentLength / len;
            this.points[i].y = this.points[i - 1].y + pt.y * this.segmentLength / len;
          }
        }
        this.path.points(this.points);
      }
    });
    cc._RF.pop();
  }, {} ],
  test: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8981eSu2JZFoJ1uTP/ieNLf", "test");
    "use strict";
    cc._RF.pop();
  }, {} ],
  titleNode: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2d2c2zjV4JAPKU2BIamtqpU", "titleNode");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        infoArr: {
          default: [],
          type: cc.Node
        }
      },
      ctor: function ctor() {
        this.register = {
          entity2: 0,
          entity3: 1,
          entity8: 2,
          entity16: 3,
          entity5: 4
        };
      },
      showInfoById: function showInfoById(entityId) {
        var _this = this;
        this.infoArr.forEach(function(item, index) {
          item.active = index == _this.register[entityId];
        });
      }
    });
    cc._RF.pop();
  }, {} ],
  "use_v2.0.x_cc.Toggle_event": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "605e43g6HFO65F9iSkmeGUy", "use_v2.0.x_cc.Toggle_event");
    "use strict";
    cc.Toggle && (cc.Toggle._triggerEventInScript_check = true);
    cc._RF.pop();
  }, {} ]
}, {}, [ "jelly", "nardove", "tentacle", "R.group", "R.path", "R.style", "R.transform", "R.animate", "R.simplify", "R.smooth", "R.svg", "raphael", "R.curve", "R.dash", "R.find", "R.length", "R.tesselateBezier", "R.utils", "use_v2.0.x_cc.Toggle_event", "ball_bullet", "bk_check", "fight", "gameEngine_s", "target", "entity", "Notification", "ball", "btn", "doodle", "par", "physics-bound", "socket.io", "test", "titleNode", "gameMain", "config", "define", "ballLayer", "charactorLayer", "lanuchLayer", "lobby", "lobbyLayer", "matchLayer", "event-names", "gameServer", "clound", "door", "gameEngine", "player", "logo", "name", "plane0_1", "plane0_2", "entity0", "code-5", "code1-1", "code1", "code2", "code3", "code6", "info", "man", "plane", "plane1_2", "entity1", "code2_1", "code2_2", "infoCell", "showFade", "entity2", "bottom", "bottom_img", "info1", "info2", "planeEnd", "sun", "entityEnd", "WxSDKAPI" ]);