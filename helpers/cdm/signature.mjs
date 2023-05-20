"use strict";

import url from 'url';
import querystring from 'querystring';
import crypto from 'crypto-js';
const sha256 = crypto.SHA256;
const hmacSHA256 = crypto.HmacSHA256;

function hmac(key, string, encoding) {
  return hmacSHA256(string, key).toString();
}

function hash(string, encoding) {
  return sha256(string).toString();
}

// This function assumes the string has already been percent encoded
function encodeRfc3986(urlEncodedString) {
  return urlEncodedString.replace(/[!'()*]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  });
}

function encodeRfc3986Full(str) {
  return str;
  // return encodeRfc3986(encodeURIComponent(str));
}

const HEADERS_TO_IGNORE = {
  'authorization': true,
  'connection': true,
  'x-amzn-trace-id': true,
  'user-agent': true,
  'expect': true,
  'presigned-expires': true,
  'range': true,
};

const HEADERS_TO_INCLUDE = ["x\-ccl\-.*", "host"];

// request: { path | body, [host], [method], [headers], [service], [region] }
class RequestSigner {
  constructor(request) {
    if (typeof request === 'string') {
      request = url.parse(request);
    }

    let headers = request.headers = (request.headers || {});
    this.request = request;

    if (!request.method && request.body) {
      request.method = 'POST';
    }

    if (!headers.Host && !headers.host) {
      headers.Host = request.hostname || request.host;

      // If a port is specified explicitly, use it as is
      if (request.port) {
        headers.Host += ':' + request.port;
      }
    }
    if (!request.hostname && !request.host) {
      request.hostname = headers.Host || headers.host;
    }
  }

  prepareRequest() {
    this.parsePath();

    let request = this.request;
    let headers = request.headers;
    let query;

    if (request.signQuery) {

      this.parsedPath.query = query = this.parsedPath.query || {};

      if (query['x-ccl-param']) {
        this.datetime = query['x-ccl-param'];
      } else {
        query['x-ccl-param'] = this.getDateTime();
      }
    } else {

      if (!request.doNotModifyHeaders) {
        if (request.body && !headers['Content-Type'] && !headers['content-type']) {
          headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
        }

        if (request.body && !headers['Content-Length'] && !headers['content-length']) {
          headers['Content-Length'] = Buffer.byteLength(request.body);
        }

        if (headers['x-ccl-param']) {
          this.datetime = headers['x-ccl-param'] || headers['x-ccl-param'];
        } else {
          headers['x-ccl-param'] = this.getDateTime();
        }
      }

      delete headers["x-ccl-signature"];
      delete headers["x-ccl-Signature"];
    }
  }

  sign() {
    if (!this.parsedPath) {
      this.prepareRequest();
    }
    if (this.request.signQuery) {
      this.parsedPath.query['x-ccl-signature'] = this.signature();
    } else {
      this.request.headers['x-ccl-signature'] = this.signature();
    }

    this.request.path = this.formatPath();
    return this.request;
  }

  getDateTime() {
    if (!this.datetime) {
      let headers = this.request.headers;
      let date = new Date(headers.Date || headers.date || new Date());

      this.datetime = date.toISOString().replace(/[:\-]|\.\d{3}/g, '');
    }
    return this.datetime;
  }

  getDate() {
    return this.getDateTime().substr(0, 8);
  }

  signature() {
    let kCredentials = "1234567";
    let strTosign = this.stringToSign();
    // console.log(strTosign);
    return `v1:${hmac(kCredentials, strTosign, 'hex')}`;
  }

  stringToSign() {
    return [
      this.getDateTime(),
      hash(this.canonicalString(), 'hex'),
    ].join('\n');
  }

  canonicalString() {
    if (!this.parsedPath) {
      this.prepareRequest();
    }

    let pathStr = this.parsedPath.path;
    let query = this.parsedPath.query;
    let headers = this.request.headers;
    let queryStr = '';
    let normalizePath = true;
    let decodePath = this.request.doNotEncodePath;
    let decodeSlashesInPath = false;
    let firstValOnly = false;
    let bodyHash = hash(this.request.body || '', 'hex');

    if (query) {
      let reducedQuery = Object.keys(query).reduce(function (obj, key) {
        if (!key) {
          return obj;
        }
        obj[encodeRfc3986Full(key)] = !Array.isArray(query[key]) ? query[key] :
          (firstValOnly ? query[key][0] : query[key]);
        return obj;
      }, {});
      let encodedQueryPieces = [];
      Object.keys(reducedQuery).sort().forEach(function (key) {
        if (!Array.isArray(reducedQuery[key])) {
          encodedQueryPieces.push(key + '=' + encodeRfc3986Full(reducedQuery[key]));
        } else {
          reducedQuery[key].map(encodeRfc3986Full).sort()
            .forEach(function (val) {
              encodedQueryPieces.push(key + '=' + val);
            });
        }
      });
      queryStr = encodedQueryPieces.join('&');
    }
    if (pathStr !== '/') {
      if (normalizePath) {
        pathStr = pathStr.replace(/\/{2,}/g, '/');
      }
      pathStr = pathStr.split('/').reduce(function (path, piece) {
        if (normalizePath && piece === '..') {
          path.pop();
        } else if (!normalizePath || piece !== '.') {
          if (decodePath) piece = decodeURIComponent(piece.replace(/\+/g, ' '))
          path.push(encodeRfc3986Full(piece));
        }
        return path;
      }, []).join('/');
      if (pathStr[0] !== '/') pathStr = '/' + pathStr;
      if (decodeSlashesInPath) pathStr = pathStr.replace(/%2F/g, '/');
    }

    let canonicalReq = [
      this.request.method || 'GET',
      pathStr,
      queryStr,
      this.canonicalHeaders() + '\n',
      this.signedHeaders(),
      bodyHash,
    ].join('\n');
    return canonicalReq;
  }

  canonicalHeaders() {
    let headers = this.request.headers;

    function trimAll(header) {
      return header.toString().trim().replace(/\s+/g, ' ');
    }
    return Object.keys(headers)
      .filter(function (key) {
        let notInIgnoreHeader = HEADERS_TO_IGNORE[key.toLowerCase()] == null;
        if (notInIgnoreHeader) {
          let foundMatch = false;
          for (let t in HEADERS_TO_INCLUDE) {
            foundMatch = foundMatch || new RegExp(HEADERS_TO_INCLUDE[t], "ig").test(key);
          }
          return foundMatch;
        } else {
          return false;
        }
      })
      .sort(function (a, b) {
        return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
      })
      .map(function (key) {
        return key.toLowerCase() + ':' + trimAll(headers[key]);
      })
      .join('\n');
  }

  signedHeaders() {
    return Object.keys(this.request.headers)
      .map(function (key) {
        return key.toLowerCase();
      })
      .filter(function (key) {

        let notInIgnoreHeader = HEADERS_TO_IGNORE[key.toLowerCase()] == null;
        if (notInIgnoreHeader) {
          let foundMatch = false;
          for (let t in HEADERS_TO_INCLUDE) {
            foundMatch = foundMatch || new RegExp(HEADERS_TO_INCLUDE[t], "ig").test(key);
          }
          return foundMatch;
        } else {
          return false;
        }
      })
      .sort()
      .join(';');
  }

  parsePath() {
    let path = this.request.path || '/';

    // So if there are non-reserved chars (and it's not already all % encoded), just encode them all
    if (/[^0-9A-Za-z;,/?:@&=+$\-_.!~*'()#%]/.test(path)) {
      path = encodeURI(decodeURI(path))
    }

    let queryIx = path.indexOf('?');
    let query = null;

    if (queryIx >= 0) {
      query = querystring.parse(path.slice(queryIx + 1));
      path = path.slice(0, queryIx);
    }

    this.parsedPath = {
      path: path,
      query: query,
    };
  }

  formatPath() {
    let path = this.parsedPath.path;
    let query = this.parsedPath.query;

    if (!query) {
      return path;
    }

    // Services don't support empty query string keys
    if (query[''] != null) {
      delete query[''];
    }

    return path + '?' + encodeRfc3986(querystring.stringify(query));
  }
}

export function getSignedRequestHeaders(method, host, path, body, headers) {
  let signingOptions = {
    method: method.toUpperCase(),
    host: host,
    path: path,
    body: body,
    headers: headers
  }
  let updatedReqData = new RequestSigner(signingOptions).sign();
  return updatedReqData;
}