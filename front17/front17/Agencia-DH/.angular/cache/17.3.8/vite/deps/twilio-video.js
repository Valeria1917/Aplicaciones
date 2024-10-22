import {
  __commonJS
} from "./chunk-4YI77D66.js";

// node_modules/twilio-video/es5/util/dynamicimport.js
var require_dynamicimport = __commonJS({
  "node_modules/twilio-video/es5/util/dynamicimport.js"(exports, module) {
    "use strict";
    module.exports = function(scope) {
      var location = scope.location, URL = scope.URL;
      if ([location, URL].some(function(api) {
        return !api;
      })) {
        return function dynamicImportNotSupported(module2) {
          return Promise.reject(new Error("Failed to import: " + module2 + ": dynamicImport is not supported"));
        };
      }
      scope.__twilioVideoImportedModules = {
        // Imported module map.
      };
      return function dynamicImport(module2) {
        if (module2 in scope.__twilioVideoImportedModules) {
          return Promise.resolve(scope.__twilioVideoImportedModules[module2]);
        }
        return new Function("scope", "return import('" + new URL(module2, location) + "').then(m => scope.__twilioVideoImportedModules['" + module2 + "'] = m);")(scope);
      };
    }(globalThis);
  }
});

// node_modules/twilio-video/es5/vendor/loglevel.js
var require_loglevel = __commonJS({
  "node_modules/twilio-video/es5/vendor/loglevel.js"(exports, module) {
    var noop = function() {
    };
    var undefinedType = "undefined";
    var isIE = typeof window !== undefinedType && typeof window.navigator !== undefinedType && /Trident\/|MSIE /.test(window.navigator.userAgent);
    var logMethods = [
      "trace",
      "debug",
      "info",
      "warn",
      "error"
    ];
    function bindMethod(obj, methodName) {
      var method = obj[methodName];
      if (typeof method.bind === "function") {
        return method.bind(obj);
      } else {
        try {
          return Function.prototype.bind.call(method, obj);
        } catch (e) {
          return function() {
            return Function.prototype.apply.apply(method, [obj, arguments]);
          };
        }
      }
    }
    function traceForIE() {
      if (console.log) {
        if (console.log.apply) {
          console.log.apply(console, arguments);
        } else {
          Function.prototype.apply.apply(console.log, [console, arguments]);
        }
      }
      if (console.trace)
        console.trace();
    }
    function realMethod(methodName) {
      if (methodName === "debug") {
        methodName = "log";
      }
      if (typeof console === undefinedType) {
        return false;
      } else if (methodName === "trace" && isIE) {
        return traceForIE;
      } else if (console[methodName] !== void 0) {
        return bindMethod(console, methodName);
      } else if (console.log !== void 0) {
        return bindMethod(console, "log");
      } else {
        return noop;
      }
    }
    function replaceLoggingMethods(level, loggerName) {
      for (var i = 0; i < logMethods.length; i++) {
        var methodName = logMethods[i];
        this[methodName] = i < level ? noop : this.methodFactory(methodName, level, loggerName);
      }
      this.log = this.debug;
    }
    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
      return function() {
        if (typeof console !== undefinedType) {
          replaceLoggingMethods.call(this, level, loggerName);
          this[methodName].apply(this, arguments);
        }
      };
    }
    function defaultMethodFactory(methodName, level, loggerName) {
      return realMethod(methodName) || enableLoggingWhenConsoleArrives.apply(this, arguments);
    }
    function Logger(name, defaultLevel, factory) {
      var self = this;
      var currentLevel;
      var storageKey = "loglevel";
      if (typeof name === "string") {
        storageKey += ":" + name;
      } else if (typeof name === "symbol") {
        storageKey = void 0;
      }
      function persistLevelIfPossible(levelNum) {
        var levelName = (logMethods[levelNum] || "silent").toUpperCase();
        if (typeof window === undefinedType || !storageKey)
          return;
        try {
          window.localStorage[storageKey] = levelName;
          return;
        } catch (ignore) {
        }
        try {
          window.document.cookie = encodeURIComponent(storageKey) + "=" + levelName + ";";
        } catch (ignore) {
        }
      }
      function getPersistedLevel() {
        var storedLevel;
        if (typeof window === undefinedType || !storageKey)
          return;
        try {
          storedLevel = window.localStorage[storageKey];
        } catch (ignore) {
        }
        if (typeof storedLevel === undefinedType) {
          try {
            var cookie = window.document.cookie;
            var location = cookie.indexOf(encodeURIComponent(storageKey) + "=");
            if (location !== -1) {
              storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
            }
          } catch (ignore) {
          }
        }
        if (self.levels[storedLevel] === void 0) {
          storedLevel = void 0;
        }
        return storedLevel;
      }
      self.name = name;
      self.levels = {
        "TRACE": 0,
        "DEBUG": 1,
        "INFO": 2,
        "WARN": 3,
        "ERROR": 4,
        "SILENT": 5
      };
      self.methodFactory = factory || defaultMethodFactory;
      self.getLevel = function() {
        return currentLevel;
      };
      self.setLevel = function(level, persist) {
        if (typeof level === "string" && self.levels[level.toUpperCase()] !== void 0) {
          level = self.levels[level.toUpperCase()];
        }
        if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
          currentLevel = level;
          if (persist !== false) {
            persistLevelIfPossible(level);
          }
          replaceLoggingMethods.call(self, level, name);
          if (typeof console === undefinedType && level < self.levels.SILENT) {
            return "No console available for logging";
          }
        } else {
          throw "log.setLevel() called with invalid level: " + level;
        }
      };
      self.setDefaultLevel = function(level) {
        if (!getPersistedLevel()) {
          self.setLevel(level, false);
        }
      };
      self.enableAll = function(persist) {
        self.setLevel(self.levels.TRACE, persist);
      };
      self.disableAll = function(persist) {
        self.setLevel(self.levels.SILENT, persist);
      };
      var initialLevel = getPersistedLevel();
      if (initialLevel == null) {
        initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
      }
      self.setLevel(initialLevel, false);
    }
    var defaultLogger = new Logger();
    var _loggersByName = {};
    defaultLogger.getLogger = function getLogger(name) {
      if (typeof name !== "symbol" && typeof name !== "string" || name === "") {
        throw new TypeError("You must supply a name when creating a logger.");
      }
      var logger = _loggersByName[name];
      if (!logger) {
        logger = _loggersByName[name] = new Logger(name, defaultLogger.getLevel(), defaultLogger.methodFactory);
      }
      return logger;
    };
    var _log = typeof window !== undefinedType ? window.log : void 0;
    defaultLogger.noConflict = function() {
      if (typeof window !== undefinedType && window.log === defaultLogger) {
        window.log = _log;
      }
      return defaultLogger;
    };
    defaultLogger.getLoggers = function getLoggers() {
      return _loggersByName;
    };
    defaultLogger["default"] = defaultLogger;
    module.exports = defaultLogger;
  }
});

// node_modules/twilio-video/package.json
var require_package = __commonJS({
  "node_modules/twilio-video/package.json"(exports, module) {
    module.exports = {
      name: "twilio-video",
      title: "Twilio Video",
      description: "Twilio Video JavaScript Library",
      version: "2.28.1",
      homepage: "https://twilio.com",
      author: "Mark Andrus Roberts <mroberts@twilio.com>",
      contributors: [
        "Ryan Rowland <rrowland@twilio.com>",
        "Manjesh Malavalli <mmalavalli@twilio.com>",
        "Makarand Patwardhan <mpatwardhan@twilio.com>"
      ],
      keywords: [
        "twilio",
        "webrtc",
        "library",
        "javascript",
        "video",
        "rooms"
      ],
      repository: {
        type: "git",
        url: "https://github.com/twilio/twilio-video.js.git"
      },
      devDependencies: {
        "@babel/core": "^7.14.2",
        "@babel/plugin-proposal-class-properties": "^7.18.6",
        "@babel/plugin-proposal-object-rest-spread": "^7.20.7",
        "@babel/preset-env": "^7.14.2",
        "@babel/preset-typescript": "^7.13.0",
        "@types/express": "^4.11.0",
        "@types/node": "^8.5.1",
        "@types/selenium-webdriver": "^3.0.8",
        "@types/ws": "^3.2.1",
        "@typescript-eslint/eslint-plugin": "^4.13.0",
        "@typescript-eslint/parser": "^4.0.0",
        "babel-cli": "^6.26.0",
        "babel-preset-es2015": "^6.24.1",
        browserify: "^17.0.0",
        cheerio: "^0.22.0",
        cors: "^2.8.5",
        electron: "^17.2.0",
        envify: "^4.0.0",
        eslint: "^6.2.1",
        "eslint-config-standard": "^14.0.0",
        "eslint-plugin-import": "^2.18.2",
        "eslint-plugin-node": "^9.1.0",
        "eslint-plugin-promise": "^4.2.1",
        "eslint-plugin-standard": "^4.0.1",
        express: "^4.16.2",
        glob: "^7.1.7",
        "ink-docstrap": "^1.3.2",
        inquirer: "^7.0.0",
        "is-docker": "^2.0.0",
        jsdoc: "^3.5.5",
        "jsdoc-babel": "^0.5.0",
        "json-loader": "^0.5.7",
        karma: "6.4.1",
        "karma-browserify": "^8.0.0",
        "karma-chrome-launcher": "^2.0.0",
        "karma-edgium-launcher": "^4.0.0-0",
        "karma-electron": "^6.1.0",
        "karma-firefox-launcher": "^1.3.0",
        "karma-htmlfile-reporter": "^0.3.8",
        "karma-junit-reporter": "^1.2.0",
        "karma-mocha": "^1.3.0",
        "karma-safari-launcher": "^1.0.0",
        "karma-spec-reporter": "0.0.32",
        "karma-typescript": "^5.5.1",
        "karma-typescript-es6-transform": "^5.5.1",
        mocha: "^3.2.0",
        "mock-require": "^3.0.3",
        ncp: "^2.0.0",
        "node-http-server": "^8.1.2",
        "npm-run-all": "^4.0.2",
        nyc: "^15.1.0",
        requirejs: "^2.3.3",
        rimraf: "^2.6.1",
        "simple-git": "^1.126.0",
        sinon: "^4.0.1",
        "ts-node": "4.0.1",
        tslint: "5.8.0",
        twilio: "^3.49.0",
        "twilio-release-tool": "^1.0.2",
        typescript: "4.2.2",
        "uglify-js": "^2.8.22",
        "vinyl-fs": "^2.4.4",
        "vinyl-source-stream": "^1.1.0",
        watchify: "^3.11.1",
        "webrtc-adapter": "^7.7.1"
      },
      engines: {
        node: ">=0.12"
      },
      license: "BSD-3-Clause",
      main: "./es5/index.js",
      types: "./tsdef/index.d.ts",
      scripts: {
        "lint:js": "eslint ./lib ./test/*.js ./docker/**/*.js ./test/framework/*.js ./test/lib/*.js ./test/integration/** ./test/unit/** ",
        "lint:ts": "eslint ./tsdef/*.ts ./lib/**/*.ts",
        lint: "npm-run-all lint:js lint:ts",
        printVersion: "node --version && npm --version",
        "test:unit": "npm-run-all printVersion build:es5 && nyc --report-dir=./coverage --include=lib/**/* --reporter=html --reporter=lcov --reporter=text mocha -r ts-node/register ./test/unit/*",
        "test:unit:quick": "nyc --report-dir=./coverage --include=lib/**/* --reporter=html --reporter=lcov mocha -r ts-node/register",
        "test:serversiderender": "mocha ./test/serversiderender/index.js",
        "test:integration:adapter": "node ./scripts/karma.js karma/integration.adapter.conf.js",
        "test:integration": "npm run build:es5 && node ./scripts/karma.js karma/integration.conf.js",
        "test:umd:install": "npm install puppeteer@19.2.2",
        "test:umd": "mocha ./test/umd/index.js",
        "test:crossbrowser:build:clean": "rimraf ./test/crossbrowser/lib ./test/crossbrowser/src/browser/index.js",
        "test:crossbrowser:build:lint": "cd ./test/crossbrowser && tslint --project tsconfig.json",
        "test:crossbrowser:build:tsc": "cd ./test/crossbrowser && tsc",
        "test:crossbrowser:build:browser": "cd ./test/crossbrowser && browserify lib/crossbrowser/src/browser/index.js > src/browser/index.js",
        "test:crossbrowser:build": "npm-run-all test:crossbrowser:build:*",
        "test:crossbrowser:test": "cd ./test/crossbrowser && mocha --compilers ts:ts-node/register test/integration/spec/**/*.ts",
        "test:crossbrowser": "npm-run-all test:crossbrowser:*",
        "test:sdkdriver:build:clean": "rimraf ./test/lib/sdkdriver/lib ./test/lib/sdkdriver/test/integration/browser/index.js",
        "test:sdkdriver:build:lint": "cd ./test/lib/sdkdriver && tslint --project tsconfig.json",
        "test:sdkdriver:build:tsc": "cd ./test/lib/sdkdriver && tsc --rootDir src",
        "test:sdkdriver:build": "npm-run-all test:sdkdriver:build:*",
        "test:sdkdriver:test:unit": "cd ./test/lib/sdkdriver && mocha --compilers ts:ts-node/register test/unit/spec/**/*.ts",
        "test:sdkdriver:test:integration:browser": "cd ./test/lib/sdkdriver/test/integration && browserify browser/browser.js > browser/index.js",
        "test:sdkdriver:test:integration:run": "cd ./test/lib/sdkdriver && mocha --compilers ts:ts-node/register test/integration/spec/**/*.ts",
        "test:sdkdriver:test:integration": "npm-run-all test:sdkdriver:test:integration:*",
        "test:sdkdriver:test": "npm-run-all test:sdkdriver:test:*",
        "test:sdkdriver": "npm-run-all test:sdkdriver:*",
        "test:framework:angular:install": "cd ./test/framework/twilio-video-angular && rimraf ./node_modules package-lock.json && npm install",
        "test:framework:angular:run": "mocha ./test/framework/twilio-video-angular.js",
        "test:framework:angular": "npm-run-all test:framework:angular:*",
        "test:framework:no-framework:run": "mocha ./test/framework/twilio-video-no-framework.js",
        "test:framework:no-framework": "npm-run-all test:framework:no-framework:*",
        "test:framework:react:install": "cd ./test/framework/twilio-video-react && rimraf ./node_modules package-lock.json && npm install",
        "test:framework:react:test": "node ./scripts/framework.js twilio-video-react",
        "test:framework:react:build": "cd ./test/framework/twilio-video-react && npm run build",
        "test:framework:react:run": "mocha ./test/framework/twilio-video-react.js",
        "test:framework:react": "npm-run-all test:framework:react:*",
        "test:framework:install": "npm install chromedriver && npm install selenium-webdriver && npm install geckodriver && npm install puppeteer",
        "test:framework": "npm-run-all test:framework:install test:framework:no-framework test:framework:react",
        test: "npm-run-all test:unit test:integration",
        "build:es5": "rimraf ./es5 && mkdir -p es5 && tsc tsdef/twilio-video-tests.ts --noEmit --lib es2018,dom && tsc",
        "build:js": "node ./scripts/build.js ./src/twilio-video.js ./LICENSE.md ./dist/twilio-video.js",
        "build:min.js": 'uglifyjs ./dist/twilio-video.js -o ./dist/twilio-video.min.js --comments "/^! twilio-video.js/" -b beautify=false,ascii_only=true',
        build: "npm-run-all clean lint docs test:unit test:integration build:es5 build:js build:min.js test:umd",
        "build:quick": "npm-run-all clean lint docs build:es5 build:js build:min.js",
        docs: "node ./scripts/docs.js ./dist/docs",
        watch: "tsc -w",
        clean: "rimraf ./coverage ./es5 ./dist"
      },
      dependencies: {
        events: "^3.3.0",
        util: "^0.12.4",
        ws: "^7.4.6",
        xmlhttprequest: "^1.8.0"
      },
      browser: {
        ws: "./src/ws.js",
        xmlhttprequest: "./src/xmlhttprequest.js"
      }
    };
  }
});

// node_modules/twilio-video/es5/util/constants.js
var require_constants = __commonJS({
  "node_modules/twilio-video/es5/util/constants.js"(exports, module) {
    "use strict";
    var packageInfo = require_package();
    module.exports.SDK_NAME = packageInfo.name + ".js";
    module.exports.SDK_VERSION = packageInfo.version;
    module.exports.SDP_FORMAT = "unified";
    module.exports.hardwareDevicePublisheriPad = {
      hwDeviceManufacturer: "Apple",
      hwDeviceModel: "iPad",
      hwDeviceType: "tablet",
      platformName: "iOS"
    };
    module.exports.hardwareDevicePublisheriPhone = {
      hwDeviceManufacturer: "Apple",
      hwDeviceModel: "iPhone",
      hwDeviceType: "mobile",
      platformName: "iOS"
    };
    module.exports.DEFAULT_ENVIRONMENT = "prod";
    module.exports.DEFAULT_REALM = "us1";
    module.exports.DEFAULT_REGION = "gll";
    module.exports.DEFAULT_LOG_LEVEL = "warn";
    module.exports.DEFAULT_LOGGER_NAME = "twilio-video";
    module.exports.WS_SERVER = function(environment, region) {
      region = region === "gll" ? "global" : encodeURIComponent(region);
      return environment === "prod" ? "wss://" + region + ".vss.twilio.com/signaling" : "wss://" + region + ".vss." + environment + ".twilio.com/signaling";
    };
    module.exports.PUBLISH_MAX_ATTEMPTS = 5;
    module.exports.PUBLISH_BACKOFF_JITTER = 10;
    module.exports.PUBLISH_BACKOFF_MS = 20;
    function article(word) {
      return ["a", "e", "i", "o", "u"].includes(word.toLowerCase()[0]) ? "an" : "a";
    }
    module.exports.typeErrors = {
      ILLEGAL_INVOKE: function(name, context) {
        return new TypeError("Illegal call to " + name + ": " + context);
      },
      INVALID_TYPE: function(name, type) {
        return new TypeError(name + " must be " + article(type) + " " + type);
      },
      INVALID_VALUE: function(name, values) {
        return new RangeError(name + " must be one of " + values.join(", "));
      },
      REQUIRED_ARGUMENT: function(name) {
        return new TypeError(name + " must be specified");
      }
    };
    module.exports.DEFAULT_FRAME_RATE = 24;
    module.exports.DEFAULT_VIDEO_PROCESSOR_STATS_INTERVAL_MS = 1e4;
    module.exports.DEFAULT_ICE_GATHERING_TIMEOUT_MS = 15e3;
    module.exports.DEFAULT_SESSION_TIMEOUT_SEC = 30;
    module.exports.DEFAULT_NQ_LEVEL_LOCAL = 1;
    module.exports.DEFAULT_NQ_LEVEL_REMOTE = 0;
    module.exports.MAX_NQ_LEVEL = 3;
    module.exports.ICE_ACTIVITY_CHECK_PERIOD_MS = 1e3;
    module.exports.ICE_INACTIVITY_THRESHOLD_MS = 3e3;
    module.exports.iceRestartBackoffConfig = {
      factor: 1.1,
      min: 1,
      max: module.exports.DEFAULT_SESSION_TIMEOUT_SEC * 1e3,
      jitter: 1
    };
    module.exports.reconnectBackoffConfig = {
      factor: 1.5,
      min: 80,
      jitter: 1
    };
    module.exports.subscriptionMode = {
      MODE_COLLABORATION: "collaboration",
      MODE_GRID: "grid",
      MODE_PRESENTATION: "presentation"
    };
    module.exports.trackSwitchOffMode = {
      MODE_DISABLED: "disabled",
      MODE_DETECTED: "detected",
      MODE_PREDICTED: "predicted"
    };
    module.exports.trackPriority = {
      PRIORITY_HIGH: "high",
      PRIORITY_LOW: "low",
      PRIORITY_STANDARD: "standard"
    };
    module.exports.clientTrackSwitchOffControl = {
      MODE_AUTO: "auto",
      MODE_MANUAL: "manual"
    };
    module.exports.videoContentPreferencesMode = {
      MODE_AUTO: "auto",
      MODE_MANUAL: "manual"
    };
  }
});

// node_modules/twilio-video/es5/util/log.js
var require_log = __commonJS({
  "node_modules/twilio-video/es5/util/log.js"(exports, module) {
    "use strict";
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var defaultGetLogger = require_loglevel().getLogger;
    var constants = require_constants();
    var DEFAULT_LOG_LEVEL = constants.DEFAULT_LOG_LEVEL;
    var DEFAULT_LOGGER_NAME = constants.DEFAULT_LOGGER_NAME;
    var E = require_constants().typeErrors;
    var deprecationWarningsByComponentConstructor;
    function getDeprecationWarnings(componentConstructor) {
      deprecationWarningsByComponentConstructor = deprecationWarningsByComponentConstructor || /* @__PURE__ */ new Map();
      if (deprecationWarningsByComponentConstructor.has(componentConstructor)) {
        return deprecationWarningsByComponentConstructor.get(componentConstructor);
      }
      var deprecationWarnings = /* @__PURE__ */ new Set();
      deprecationWarningsByComponentConstructor.set(componentConstructor, deprecationWarnings);
      return deprecationWarnings;
    }
    var Log = (
      /** @class */
      function() {
        function Log2(moduleName, component, logLevels, loggerName, getLogger) {
          if (typeof moduleName !== "string") {
            throw E.INVALID_TYPE("moduleName", "string");
          }
          if (!component) {
            throw E.REQUIRED_ARGUMENT("component");
          }
          if (typeof logLevels !== "object") {
            logLevels = {};
          }
          getLogger = getLogger || defaultGetLogger;
          validateLogLevels(logLevels);
          Object.defineProperties(this, {
            _component: {
              value: component
            },
            _logLevels: {
              value: logLevels
            },
            _warnings: {
              value: /* @__PURE__ */ new Set()
            },
            _loggerName: {
              get: function get() {
                var name = loggerName && typeof loggerName === "string" ? loggerName : DEFAULT_LOGGER_NAME;
                if (!this._logLevelsEqual) {
                  name = name + "-" + moduleName;
                }
                return name;
              }
            },
            _logger: {
              get: function get() {
                var logger = getLogger(this._loggerName);
                var level = this._logLevels[moduleName] || DEFAULT_LOG_LEVEL;
                level = level === "off" ? "silent" : level;
                logger.setDefaultLevel(level);
                return logger;
              }
            },
            _logLevelsEqual: {
              get: function get() {
                return new Set(Object.values(this._logLevels)).size === 1;
              }
            },
            logLevel: {
              get: function get() {
                return Log2.getLevelByName(logLevels[moduleName] || DEFAULT_LOG_LEVEL);
              }
            },
            name: { get: component.toString.bind(component) }
          });
        }
        Log2.getLevelByName = function(name) {
          if (!isNaN(name)) {
            return parseInt(name, 10);
          }
          name = name.toUpperCase();
          validateLogLevel(name);
          return Log2[name];
        };
        Log2.prototype.createLog = function(moduleName, component) {
          var name = this._loggerName;
          if (!this._logLevelsEqual) {
            name = name.substring(0, name.lastIndexOf("-"));
          }
          return new Log2(moduleName, component, this._logLevels, name);
        };
        Log2.prototype.setLevels = function(levels) {
          validateLogLevels(levels);
          Object.assign(this._logLevels, levels);
          return this;
        };
        Log2.prototype.log = function(logLevel, messages) {
          var name = Log2._levels[logLevel];
          if (!name) {
            throw E.INVALID_VALUE("logLevel", LOG_LEVEL_VALUES);
          }
          name = name.toLowerCase();
          var prefix = [(/* @__PURE__ */ new Date()).toISOString(), name, this.name];
          (this._logger[name] || function noop() {
          }).apply(void 0, __spreadArray([], __read(prefix.concat(messages))));
          return this;
        };
        Log2.prototype.debug = function() {
          return this.log(Log2.DEBUG, [].slice.call(arguments));
        };
        Log2.prototype.deprecated = function(deprecationWarning) {
          var deprecationWarnings = getDeprecationWarnings(this._component.constructor);
          if (deprecationWarnings.has(deprecationWarning)) {
            return this;
          }
          deprecationWarnings.add(deprecationWarning);
          return this.warn(deprecationWarning);
        };
        Log2.prototype.info = function() {
          return this.log(Log2.INFO, [].slice.call(arguments));
        };
        Log2.prototype.warn = function() {
          return this.log(Log2.WARN, [].slice.call(arguments));
        };
        Log2.prototype.warnOnce = function(warning) {
          if (this._warnings.has(warning)) {
            return this;
          }
          this._warnings.add(warning);
          return this.warn(warning);
        };
        Log2.prototype.error = function() {
          return this.log(Log2.ERROR, [].slice.call(arguments));
        };
        Log2.prototype.throw = function(error, customMessage) {
          if (error.clone) {
            error = error.clone(customMessage);
          }
          this.log(Log2.ERROR, error);
          throw error;
        };
        return Log2;
      }()
    );
    Object.defineProperties(Log, {
      DEBUG: { value: 0 },
      INFO: { value: 1 },
      WARN: { value: 2 },
      ERROR: { value: 3 },
      OFF: { value: 4 },
      _levels: {
        value: [
          "DEBUG",
          "INFO",
          "WARN",
          "ERROR",
          "OFF"
        ]
      }
    });
    var LOG_LEVELS_SET = {};
    var LOG_LEVEL_VALUES = [];
    var LOG_LEVEL_NAMES = Log._levels.map(function(level, i) {
      LOG_LEVELS_SET[level] = true;
      LOG_LEVEL_VALUES.push(i);
      return level;
    });
    function validateLogLevel(level) {
      if (!(level in LOG_LEVELS_SET)) {
        throw E.INVALID_VALUE("level", LOG_LEVEL_NAMES);
      }
    }
    function validateLogLevels(levels) {
      Object.keys(levels).forEach(function(moduleName) {
        validateLogLevel(levels[moduleName].toUpperCase());
      });
    }
    module.exports = Log;
  }
});

// node_modules/twilio-video/es5/noisecancellationadapter.js
var require_noisecancellationadapter = __commonJS({
  "node_modules/twilio-video/es5/noisecancellationadapter.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports && exports.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1)
          throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f)
          throw new TypeError("Generator is already executing.");
        while (_)
          try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
              return t;
            if (y = 0, t)
              op = [op[0] & 2, t.value];
            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;
              case 4:
                _.label++;
                return { value: op[1], done: false };
              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;
              case 7:
                op = _.ops.pop();
                _.trys.pop();
                continue;
              default:
                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                  _ = 0;
                  continue;
                }
                if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                  _.label = op[1];
                  break;
                }
                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1];
                  t = op;
                  break;
                }
                if (t && _.label < t[2]) {
                  _.label = t[2];
                  _.ops.push(op);
                  break;
                }
                if (t[2])
                  _.ops.pop();
                _.trys.pop();
                continue;
            }
            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
        if (op[0] & 5)
          throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createNoiseCancellationAudioProcessor = void 0;
    var dynamicImport = require_dynamicimport();
    var Log = require_log();
    var PLUGIN_CONFIG = {
      krisp: {
        supportedVersion: "1.0.0",
        pluginFile: "krispsdk.mjs"
      },
      rnnoise: {
        supportedVersion: "0.6.0",
        pluginFile: "rnnoise_sdk.mjs"
      }
    };
    var ensureVersionSupported = function(_a) {
      var supportedVersion = _a.supportedVersion, plugin = _a.plugin, log = _a.log;
      if (!plugin.getVersion || !plugin.isSupported) {
        throw new Error("Plugin does not export getVersion/isSupported api. Are you using old version of the plugin ?");
      }
      var pluginVersion = plugin.getVersion();
      log.debug("Plugin Version = " + pluginVersion);
      var supportedVersions = supportedVersion.split(".").map(function(version) {
        return Number(version);
      });
      var pluginVersions = pluginVersion.split(".").map(function(version) {
        return Number(version);
      });
      if (supportedVersions.length !== 3 || pluginVersions.length !== 3) {
        throw new Error("Unsupported Plugin version format: " + supportedVersion + ", " + pluginVersion);
      }
      if (supportedVersions[0] !== pluginVersions[0]) {
        throw new Error("Major version mismatch: [Plugin version " + pluginVersion + "],  [Supported Version " + supportedVersion + "]");
      }
      if (pluginVersions[1] < supportedVersions[1]) {
        throw new Error("Minor version mismatch: [Plugin version " + pluginVersion + "] < [Supported Version " + supportedVersion + "]");
      }
      var tempContext = new AudioContext();
      var isSupported = plugin.isSupported(tempContext);
      tempContext.close();
      if (!isSupported) {
        throw new Error("Noise Cancellation plugin is not supported on your browser");
      }
    };
    var audioProcessors = /* @__PURE__ */ new Map();
    function createNoiseCancellationAudioProcessor(noiseCancellationOptions, log) {
      return __awaiter(this, void 0, void 0, function() {
        var audioProcessor, pluginConfig, supportedVersion, pluginFile, rootDir, sdkFilePath, dynamicModule, plugin_1, er_1;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              audioProcessor = audioProcessors.get(noiseCancellationOptions.vendor);
              if (!!audioProcessor)
                return [3, 6];
              pluginConfig = PLUGIN_CONFIG[noiseCancellationOptions.vendor];
              if (!pluginConfig) {
                throw new Error("Unsupported NoiseCancellationOptions.vendor: " + noiseCancellationOptions.vendor);
              }
              supportedVersion = pluginConfig.supportedVersion, pluginFile = pluginConfig.pluginFile;
              rootDir = noiseCancellationOptions.sdkAssetsPath;
              sdkFilePath = rootDir + "/" + pluginFile;
              _a.label = 1;
            case 1:
              _a.trys.push([1, 5, , 6]);
              log.debug("loading noise cancellation sdk: ", sdkFilePath);
              return [4, dynamicImport(sdkFilePath)];
            case 2:
              dynamicModule = _a.sent();
              log.debug("Loaded noise cancellation sdk:", dynamicModule);
              plugin_1 = dynamicModule.default;
              ensureVersionSupported({
                supportedVersion,
                plugin: plugin_1,
                log
              });
              if (!!plugin_1.isInitialized())
                return [3, 4];
              log.debug("initializing noise cancellation sdk: ", rootDir);
              return [4, plugin_1.init({ rootDir })];
            case 3:
              _a.sent();
              log.debug("noise cancellation sdk initialized!");
              _a.label = 4;
            case 4:
              audioProcessor = {
                vendor: noiseCancellationOptions.vendor,
                isInitialized: function() {
                  return plugin_1.isInitialized();
                },
                isConnected: function() {
                  return plugin_1.isConnected();
                },
                isEnabled: function() {
                  return plugin_1.isEnabled();
                },
                disconnect: function() {
                  return plugin_1.disconnect();
                },
                enable: function() {
                  return plugin_1.enable();
                },
                disable: function() {
                  return plugin_1.disable();
                },
                destroy: function() {
                  return plugin_1.destroy();
                },
                setLogging: function(enable) {
                  return plugin_1.setLogging(enable);
                },
                connect: function(sourceTrack) {
                  log.debug("connect: ", sourceTrack.id);
                  if (plugin_1.isConnected()) {
                    plugin_1.disconnect();
                  }
                  var mediaStream = plugin_1.connect(new MediaStream([sourceTrack]));
                  if (!mediaStream) {
                    throw new Error("Error connecting with noise cancellation sdk");
                  }
                  var cleanTrack = mediaStream.getAudioTracks()[0];
                  if (!cleanTrack) {
                    throw new Error("Error getting clean track from noise cancellation sdk");
                  }
                  plugin_1.enable();
                  return cleanTrack;
                }
              };
              audioProcessors.set(noiseCancellationOptions.vendor, audioProcessor);
              return [3, 6];
            case 5:
              er_1 = _a.sent();
              log.error("Error loading noise cancellation sdk:" + sdkFilePath, er_1);
              throw er_1;
            case 6:
              return [2, audioProcessor];
          }
        });
      });
    }
    exports.createNoiseCancellationAudioProcessor = createNoiseCancellationAudioProcessor;
  }
});

// node_modules/twilio-video/es5/media/track/noisecancellationimpl.js
var require_noisecancellationimpl = __commonJS({
  "node_modules/twilio-video/es5/media/track/noisecancellationimpl.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports && exports.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1)
          throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f)
          throw new TypeError("Generator is already executing.");
        while (_)
          try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
              return t;
            if (y = 0, t)
              op = [op[0] & 2, t.value];
            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;
              case 4:
                _.label++;
                return { value: op[1], done: false };
              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;
              case 7:
                op = _.ops.pop();
                _.trys.pop();
                continue;
              default:
                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                  _ = 0;
                  continue;
                }
                if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                  _.label = op[1];
                  break;
                }
                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1];
                  t = op;
                  break;
                }
                if (t && _.label < t[2]) {
                  _.label = t[2];
                  _.ops.push(op);
                  break;
                }
                if (t[2])
                  _.ops.pop();
                _.trys.pop();
                continue;
            }
            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
        if (op[0] & 5)
          throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.applyNoiseCancellation = exports.NoiseCancellationImpl = void 0;
    var noisecancellationadapter_1 = require_noisecancellationadapter();
    var Log = require_log();
    var NoiseCancellationImpl = (
      /** @class */
      function() {
        function NoiseCancellationImpl2(processor, originalTrack) {
          this._processor = processor;
          this._sourceTrack = originalTrack;
          this._disabledPermanent = false;
        }
        Object.defineProperty(NoiseCancellationImpl2.prototype, "vendor", {
          /**
           * Name of the noise cancellation vendor.
           * @type {NoiseCancellationVendor}
           */
          get: function() {
            return this._processor.vendor;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(NoiseCancellationImpl2.prototype, "sourceTrack", {
          /**
           * The underlying MediaStreamTrack of the {@link LocalAudioTrack}.
           * @type {MediaStreamTrack}
           */
          get: function() {
            return this._sourceTrack;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(NoiseCancellationImpl2.prototype, "isEnabled", {
          /**
           * Whether noise cancellation is enabled.
           * @type {boolean}
           */
          get: function() {
            return this._processor.isEnabled();
          },
          enumerable: false,
          configurable: true
        });
        NoiseCancellationImpl2.prototype.enable = function() {
          if (this._disabledPermanent) {
            throw new Error(this.vendor + " noise cancellation is disabled permanently for this track");
          }
          this._processor.enable();
          return Promise.resolve();
        };
        NoiseCancellationImpl2.prototype.disable = function() {
          this._processor.disable();
          return Promise.resolve();
        };
        NoiseCancellationImpl2.prototype.reacquireTrack = function(reacquire) {
          return __awaiter(this, void 0, void 0, function() {
            var processorWasEnabled, track, processedTrack;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  processorWasEnabled = this._processor.isEnabled();
                  this._processor.disconnect();
                  return [4, reacquire()];
                case 1:
                  track = _a.sent();
                  this._sourceTrack = track;
                  return [4, this._processor.connect(track)];
                case 2:
                  processedTrack = _a.sent();
                  if (processorWasEnabled) {
                    this._processor.enable();
                  } else {
                    this._processor.disable();
                  }
                  return [2, processedTrack];
              }
            });
          });
        };
        NoiseCancellationImpl2.prototype.disablePermanently = function() {
          this._disabledPermanent = true;
          return this.disable();
        };
        NoiseCancellationImpl2.prototype.stop = function() {
          this._processor.disconnect();
          this._sourceTrack.stop();
        };
        return NoiseCancellationImpl2;
      }()
    );
    exports.NoiseCancellationImpl = NoiseCancellationImpl;
    function applyNoiseCancellation(mediaStreamTrack, noiseCancellationOptions, log) {
      return __awaiter(this, void 0, void 0, function() {
        var processor, cleanTrack, noiseCancellation, ex_1;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 2, , 3]);
              return [4, noisecancellationadapter_1.createNoiseCancellationAudioProcessor(noiseCancellationOptions, log)];
            case 1:
              processor = _a.sent();
              cleanTrack = processor.connect(mediaStreamTrack);
              noiseCancellation = new NoiseCancellationImpl(processor, mediaStreamTrack);
              return [2, { cleanTrack, noiseCancellation }];
            case 2:
              ex_1 = _a.sent();
              log.warn("Failed to create noise cancellation. Returning normal audio track: " + ex_1);
              return [2, { cleanTrack: mediaStreamTrack }];
            case 3:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }
    exports.applyNoiseCancellation = applyNoiseCancellation;
  }
});

// node_modules/twilio-video/es5/webrtc/util/index.js
var require_util = __commonJS({
  "node_modules/twilio-video/es5/webrtc/util/index.js"(exports) {
    "use strict";
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    function defer() {
      var deferred = {};
      deferred.promise = new Promise(function(resolve, reject) {
        deferred.resolve = resolve;
        deferred.reject = reject;
      });
      return deferred;
    }
    function delegateMethod(source, wrapper, target, methodName) {
      if (methodName in wrapper) {
        return;
      } else if (methodName.match(/^on[a-z]+$/)) {
        return;
      }
      var isProperty = false;
      try {
        var propDesc = Object.getOwnPropertyDescriptor(source, methodName);
        isProperty = propDesc && !!propDesc.get;
      } catch (error) {
      }
      if (isProperty) {
        return;
      }
      var type;
      try {
        type = typeof source[methodName];
      } catch (error) {
      }
      if (type !== "function") {
        return;
      }
      wrapper[methodName] = function() {
        return this[target][methodName].apply(this[target], arguments);
      };
    }
    function delegateMethods(source, wrapper, target) {
      for (var methodName in source) {
        delegateMethod(source, wrapper, target, methodName);
      }
    }
    function difference(list1, list2) {
      list1 = Array.isArray(list1) ? new Set(list1) : new Set(list1.values());
      list2 = Array.isArray(list2) ? new Set(list2) : new Set(list2.values());
      var difference2 = /* @__PURE__ */ new Set();
      list1.forEach(function(item) {
        if (!list2.has(item)) {
          difference2.add(item);
        }
      });
      return difference2;
    }
    function flatMap(list, mapFn) {
      var listArray = list instanceof Map || list instanceof Set ? Array.from(list.values()) : list;
      return listArray.reduce(function(flattened, item) {
        return flattened.concat(mapFn(item));
      }, []);
    }
    function getUserAgent() {
      return typeof navigator !== "undefined" && typeof navigator.userAgent === "string" ? navigator.userAgent : null;
    }
    function guessBrowser(userAgent) {
      if (typeof userAgent === "undefined") {
        userAgent = getUserAgent();
      }
      if (/Chrome|CriOS/.test(userAgent)) {
        return "chrome";
      }
      if (/Firefox|FxiOS/.test(userAgent)) {
        return "firefox";
      }
      if (/Safari|iPhone|iPad|iPod/.test(userAgent)) {
        return "safari";
      }
      return null;
    }
    function guessBrowserVersion(userAgent) {
      if (typeof userAgent === "undefined") {
        userAgent = getUserAgent();
      }
      var prefix = {
        chrome: "Chrome|CriOS",
        firefox: "Firefox|FxiOS",
        safari: "Version"
      }[guessBrowser(userAgent)];
      if (!prefix) {
        return null;
      }
      var regex = new RegExp("(" + prefix + ")/([^\\s]+)");
      var _a = __read(userAgent.match(regex) || [], 3), match = _a[2];
      if (!match) {
        return null;
      }
      var versions = match.split(".").map(Number);
      return {
        major: isNaN(versions[0]) ? null : versions[0],
        minor: isNaN(versions[1]) ? null : versions[1]
      };
    }
    function isIOSChrome(userAgent) {
      if (typeof userAgent === "undefined") {
        userAgent = getUserAgent();
      }
      return /Mobi/.test(userAgent) && guessBrowser() === "chrome" && /iPad|iPhone|iPod/.test(userAgent);
    }
    function interceptEvent(target, type) {
      var currentListener = null;
      Object.defineProperty(target, "on" + type, {
        get: function() {
          return currentListener;
        },
        set: function(newListener) {
          if (currentListener) {
            this.removeEventListener(type, currentListener);
          }
          if (typeof newListener === "function") {
            currentListener = newListener;
            this.addEventListener(type, currentListener);
          } else {
            currentListener = null;
          }
        }
      });
    }
    function legacyPromise(promise, onSuccess, onFailure) {
      return onSuccess ? promise.then(onSuccess, onFailure) : promise;
    }
    function makeUUID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0;
        var v = c === "x" ? r : r & 3 | 8;
        return v.toString(16);
      });
    }
    function proxyProperties(source, wrapper, target) {
      Object.getOwnPropertyNames(source).forEach(function(propertyName) {
        proxyProperty(source, wrapper, target, propertyName);
      });
    }
    function proxyProperty(source, wrapper, target, propertyName) {
      if (propertyName in wrapper) {
        return;
      } else if (propertyName.match(/^on[a-z]+$/)) {
        Object.defineProperty(wrapper, propertyName, {
          value: null,
          writable: true
        });
        target.addEventListener(propertyName.slice(2), function() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          return wrapper.dispatchEvent.apply(wrapper, __spreadArray([], __read(args)));
        });
        return;
      }
      Object.defineProperty(wrapper, propertyName, {
        enumerable: true,
        get: function() {
          return target[propertyName];
        }
      });
    }
    function support() {
      return typeof navigator === "object" && typeof navigator.mediaDevices === "object" && typeof navigator.mediaDevices.getUserMedia === "function" && typeof RTCPeerConnection === "function";
    }
    function createSupportedCodecsSet(kind) {
      if (typeof RTCRtpSender !== "undefined" && typeof RTCRtpSender.getCapabilities === "function") {
        return Promise.resolve(new Set(RTCRtpSender.getCapabilities(kind).codecs.map(function(_a) {
          var mimeType = _a.mimeType;
          return mimeType.split("/")[1].toLowerCase();
        })));
      }
      if (typeof RTCPeerConnection === "undefined" || typeof RTCPeerConnection.prototype === "undefined" || typeof RTCPeerConnection.prototype.addTransceiver !== "function" || typeof RTCPeerConnection.prototype.close !== "function" || typeof RTCPeerConnection.prototype.createOffer !== "function") {
        return Promise.resolve(/* @__PURE__ */ new Set());
      }
      var pc = new RTCPeerConnection();
      pc.addTransceiver(kind);
      return pc.createOffer().then(function(_a) {
        var sdp = _a.sdp;
        pc.close();
        return new Set((sdp.match(/^a=rtpmap:.+$/gm) || []).map(function(line) {
          return line.match(/^a=rtpmap:.+ ([^/]+)/)[1].toLowerCase();
        }));
      }, function() {
        pc.close();
        return /* @__PURE__ */ new Set();
      });
    }
    var supportedCodecs = /* @__PURE__ */ new Map();
    function isCodecSupported(codec, kind) {
      var codecs = supportedCodecs.get(kind);
      if (codecs) {
        return Promise.resolve(codecs.has(codec.toLowerCase()));
      }
      return createSupportedCodecsSet(kind).then(function(codecs2) {
        supportedCodecs.set(kind, codecs2);
        return codecs2.has(codec.toLowerCase());
      });
    }
    function clearCachedSupportedCodecs() {
      supportedCodecs.clear();
    }
    exports.clearCachedSupportedCodecs = clearCachedSupportedCodecs;
    exports.defer = defer;
    exports.delegateMethods = delegateMethods;
    exports.difference = difference;
    exports.flatMap = flatMap;
    exports.guessBrowser = guessBrowser;
    exports.guessBrowserVersion = guessBrowserVersion;
    exports.isCodecSupported = isCodecSupported;
    exports.isIOSChrome = isIOSChrome;
    exports.interceptEvent = interceptEvent;
    exports.legacyPromise = legacyPromise;
    exports.makeUUID = makeUUID;
    exports.proxyProperties = proxyProperties;
    exports.support = support;
  }
});

// node_modules/twilio-video/es5/util/sid.js
var require_sid = __commonJS({
  "node_modules/twilio-video/es5/util/sid.js"(exports) {
    var SID_CHARS = "1234567890abcdef";
    var SID_CHAR_LENGTH = 32;
    function createSID(prefix) {
      var result = "";
      for (var i = 0; i < SID_CHAR_LENGTH; i++) {
        result += SID_CHARS.charAt(Math.floor(Math.random() * SID_CHARS.length));
      }
      return "" + prefix + result;
    }
    exports.sessionSID = createSID("SS");
    exports.createSID = createSID;
  }
});

// node_modules/twilio-video/es5/util/twiliowarning.js
var require_twiliowarning = __commonJS({
  "node_modules/twilio-video/es5/util/twiliowarning.js"(exports, module) {
    "use strict";
    var TwilioWarning = {
      recordingMediaLost: "recording-media-lost"
    };
    module.exports = TwilioWarning;
  }
});

// node_modules/twilio-video/es5/util/index.js
var require_util2 = __commonJS({
  "node_modules/twilio-video/es5/util/index.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var constants = require_constants();
    var E = constants.typeErrors;
    var trackPriority = constants.trackPriority;
    var util = require_util();
    var sessionSID = require_sid().sessionSID;
    var TwilioWarning = require_twiliowarning();
    function asLocalTrack(track, options) {
      if (track instanceof options.LocalAudioTrack || track instanceof options.LocalVideoTrack || track instanceof options.LocalDataTrack) {
        return track;
      }
      if (track instanceof options.MediaStreamTrack) {
        return track.kind === "audio" ? new options.LocalAudioTrack(track, options) : new options.LocalVideoTrack(track, options);
      }
      throw E.INVALID_TYPE("track", "LocalAudioTrack, LocalVideoTrack, LocalDataTrack, or MediaStreamTrack");
    }
    function asLocalTrackPublication(track, signaling, unpublish, options) {
      var LocalTrackPublication = {
        audio: options.LocalAudioTrackPublication,
        video: options.LocalVideoTrackPublication,
        data: options.LocalDataTrackPublication
      }[track.kind];
      return new LocalTrackPublication(signaling, track, unpublish, options);
    }
    function capitalize(word) {
      return word[0].toUpperCase() + word.slice(1);
    }
    function deprecateEvents(name, emitter, events, log) {
      var warningsShown = /* @__PURE__ */ new Set();
      emitter.on("newListener", function newListener(event) {
        if (events.has(event) && !warningsShown.has(event)) {
          log.deprecated(name + "#" + event + " has been deprecated and scheduled for removal in twilio-video.js@2.0.0." + (events.get(event) ? " Use " + name + "#" + events.get(event) + " instead." : ""));
          warningsShown.add(event);
        }
        if (warningsShown.size >= events.size) {
          emitter.removeListener("newListener", newListener);
        }
      });
    }
    function difference(list1, list2) {
      list1 = Array.isArray(list1) ? new Set(list1) : new Set(list1.values());
      list2 = Array.isArray(list2) ? new Set(list2) : new Set(list2.values());
      var difference2 = /* @__PURE__ */ new Set();
      list1.forEach(function(item) {
        if (!list2.has(item)) {
          difference2.add(item);
        }
      });
      return difference2;
    }
    function filterObject(object, filterValue) {
      return Object.keys(object).reduce(function(filtered, key) {
        if (object[key] !== filterValue) {
          filtered[key] = object[key];
        }
        return filtered;
      }, {});
    }
    function flatMap(list, mapFn) {
      var listArray = list instanceof Map || list instanceof Set ? Array.from(list.values()) : list;
      mapFn = mapFn || function mapFn2(item) {
        return item;
      };
      return listArray.reduce(function(flattened, item) {
        var mapped = mapFn(item);
        return flattened.concat(mapped);
      }, []);
    }
    function getUserAgent() {
      return typeof navigator !== "undefined" && navigator.userAgent ? navigator.userAgent : "Unknown";
    }
    function getPlatform() {
      var userAgent = getUserAgent();
      var _a = __read(userAgent.match(/\(([^)]+)\)/) || [], 2), _b = _a[1], match = _b === void 0 ? "unknown" : _b;
      var _c = __read(match.split(";").map(function(entry) {
        return entry.trim();
      }), 1), platform = _c[0];
      return platform.toLowerCase();
    }
    function makeUUID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0;
        var v = c === "x" ? r : r & 3 | 8;
        return v.toString(16);
      });
    }
    function oncePerTick(fn) {
      var timeout = null;
      function nextTick() {
        timeout = null;
        fn();
      }
      return function scheduleNextTick() {
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(nextTick);
      };
    }
    function promiseFromEvents(operation, eventEmitter, successEvent, failureEvent) {
      return new Promise(function(resolve, reject) {
        function onSuccess() {
          var args = [].slice.call(arguments);
          if (failureEvent) {
            eventEmitter.removeListener(failureEvent, onFailure);
          }
          resolve.apply(void 0, __spreadArray([], __read(args)));
        }
        function onFailure() {
          var args = [].slice.call(arguments);
          eventEmitter.removeListener(successEvent, onSuccess);
          reject.apply(void 0, __spreadArray([], __read(args)));
        }
        eventEmitter.once(successEvent, onSuccess);
        if (failureEvent) {
          eventEmitter.once(failureEvent, onFailure);
        }
        operation();
      });
    }
    function getOrNull(obj, path) {
      return path.split(".").reduce(function(output, step) {
        if (!output) {
          return null;
        }
        return output[step];
      }, obj);
    }
    function defer() {
      var deferred = {};
      deferred.promise = new Promise(function(resolve, reject) {
        deferred.resolve = resolve;
        deferred.reject = reject;
      });
      return deferred;
    }
    function delegateMethod(source, wrapper, target, methodName) {
      if (methodName in wrapper) {
        return;
      } else if (methodName.match(/^on[a-z]+$/)) {
        return;
      }
      var type;
      try {
        type = typeof source[methodName];
      } catch (error) {
      }
      if (type !== "function") {
        return;
      }
      wrapper[methodName] = function() {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return (_a = this[target])[methodName].apply(_a, __spreadArray([], __read(args)));
      };
    }
    function delegateMethods(source, wrapper, target) {
      for (var methodName in source) {
        delegateMethod(source, wrapper, target, methodName);
      }
    }
    function isDeepEqual(val1, val2) {
      if (val1 === val2) {
        return true;
      }
      if (typeof val1 !== typeof val2) {
        return false;
      }
      if (val1 === null) {
        return val2 === null;
      }
      if (val2 === null) {
        return false;
      }
      if (Array.isArray(val1)) {
        return Array.isArray(val2) && val1.length === val2.length && val1.every(function(val, i) {
          return isDeepEqual(val, val2[i]);
        });
      }
      if (typeof val1 === "object") {
        var val1Keys = Object.keys(val1).sort();
        var val2Keys = Object.keys(val2).sort();
        return !Array.isArray(val2) && isDeepEqual(val1Keys, val2Keys) && val1Keys.every(function(key) {
          return isDeepEqual(val1[key], val2[key]);
        });
      }
      return false;
    }
    function isNonArrayObject(object) {
      return typeof object === "object" && !Array.isArray(object);
    }
    function proxyProperties(source, wrapper, target) {
      Object.getOwnPropertyNames(source).forEach(function(propertyName) {
        proxyProperty(source, wrapper, target, propertyName);
      });
    }
    function proxyProperty(source, wrapper, target, propertyName) {
      if (propertyName in wrapper) {
        return;
      } else if (propertyName.match(/^on[a-z]+$/)) {
        Object.defineProperty(wrapper, propertyName, {
          value: null,
          writable: true
        });
        target.addEventListener(propertyName.slice(2), function() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          wrapper.dispatchEvent.apply(wrapper, __spreadArray([], __read(args)));
        });
        return;
      }
      Object.defineProperty(wrapper, propertyName, {
        enumerable: true,
        get: function() {
          return target[propertyName];
        }
      });
    }
    function legacyPromise(promise, onSuccess, onFailure) {
      if (onSuccess) {
        return promise.then(function(result) {
          onSuccess(result);
        }, function(error) {
          onFailure(error);
        });
      }
      return promise;
    }
    function buildLogLevels(logLevel) {
      if (typeof logLevel === "string") {
        return {
          default: logLevel,
          media: logLevel,
          signaling: logLevel,
          webrtc: logLevel
        };
      }
      return logLevel;
    }
    function trackClass(track, local) {
      local = local ? "Local" : "";
      return local + (track.kind || "").replace(/\w{1}/, function(m) {
        return m.toUpperCase();
      }) + "Track";
    }
    function trackPublicationClass(publication, local) {
      local = local ? "Local" : "";
      return local + (publication.kind || "").replace(/\w{1}/, function(m) {
        return m.toUpperCase();
      }) + "TrackPublication";
    }
    function hidePrivateProperties(object) {
      Object.getOwnPropertyNames(object).forEach(function(name) {
        if (name.startsWith("_")) {
          hideProperty(object, name);
        }
      });
    }
    function hidePrivateAndCertainPublicPropertiesInClass(klass, props) {
      return (
        /** @class */
        function(_super) {
          __extends(class_1, _super);
          function class_1() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, __spreadArray([], __read(args))) || this;
            hidePrivateProperties(_this);
            hidePublicProperties(_this, props);
            return _this;
          }
          return class_1;
        }(klass)
      );
    }
    function hideProperty(object, name) {
      var descriptor = Object.getOwnPropertyDescriptor(object, name);
      descriptor.enumerable = false;
      Object.defineProperty(object, name, descriptor);
    }
    function hidePublicProperties(object, props) {
      if (props === void 0) {
        props = [];
      }
      props.forEach(function(name) {
        if (object.hasOwnProperty(name)) {
          hideProperty(object, name);
        }
      });
    }
    function arrayToJSON(array) {
      return array.map(valueToJSON);
    }
    function setToJSON(set) {
      return arrayToJSON(__spreadArray([], __read(set)));
    }
    function mapToJSON(map) {
      return __spreadArray([], __read(map.entries())).reduce(function(json, _a) {
        var _b;
        var _c = __read(_a, 2), key = _c[0], value = _c[1];
        return Object.assign((_b = {}, _b[key] = valueToJSON(value), _b), json);
      }, {});
    }
    function objectToJSON(object) {
      return Object.entries(object).reduce(function(json, _a) {
        var _b;
        var _c = __read(_a, 2), key = _c[0], value = _c[1];
        return Object.assign((_b = {}, _b[key] = valueToJSON(value), _b), json);
      }, {});
    }
    function valueToJSON(value) {
      if (Array.isArray(value)) {
        return arrayToJSON(value);
      } else if (value instanceof Set) {
        return setToJSON(value);
      } else if (value instanceof Map) {
        return mapToJSON(value);
      } else if (value && typeof value === "object") {
        return objectToJSON(value);
      }
      return value;
    }
    function createRoomConnectEventPayload(connectOptions) {
      function boolToString(val) {
        return val ? "true" : "false";
      }
      var payload = {
        sessionSID,
        // arrays props converted to lengths.
        iceServers: (connectOptions.iceServers || []).length,
        audioTracks: (connectOptions.tracks || []).filter(function(track) {
          return track.kind === "audio";
        }).length,
        videoTracks: (connectOptions.tracks || []).filter(function(track) {
          return track.kind === "video";
        }).length,
        dataTracks: (connectOptions.tracks || []).filter(function(track) {
          return track.kind === "data";
        }).length
      };
      [["audio"], ["automaticSubscription"], ["enableDscp"], ["eventListener"], ["preflight"], ["video"], ["dominantSpeaker", "enableDominantSpeaker"]].forEach(function(_a) {
        var _b = __read(_a, 2), prop = _b[0], eventProp = _b[1];
        eventProp = eventProp || prop;
        payload[eventProp] = boolToString(!!connectOptions[prop]);
      });
      [["maxVideoBitrate"], ["maxAudioBitrate"]].forEach(function(_a) {
        var _b = __read(_a, 2), prop = _b[0], eventProp = _b[1];
        eventProp = eventProp || prop;
        if (typeof connectOptions[prop] === "number") {
          payload[eventProp] = connectOptions[prop];
        } else if (!isNaN(Number(connectOptions[prop]))) {
          payload[eventProp] = Number(connectOptions[prop]);
        }
      });
      [["iceTransportPolicy"], ["region"], ["name", "roomName"]].forEach(function(_a) {
        var _b = __read(_a, 2), prop = _b[0], eventProp = _b[1];
        eventProp = eventProp || prop;
        if (typeof connectOptions[prop] === "string") {
          payload[eventProp] = connectOptions[prop];
        } else if (typeof connectOptions[prop] === "number" && prop === "name") {
          payload[eventProp] = connectOptions[prop].toString();
        }
      });
      ["preferredAudioCodecs", "preferredVideoCodecs"].forEach(function(prop) {
        if (prop in connectOptions) {
          payload[prop] = JSON.stringify(connectOptions[prop]);
        }
      });
      if ("networkQuality" in connectOptions) {
        payload.networkQualityConfiguration = {};
        if (isNonArrayObject(connectOptions.networkQuality)) {
          ["local", "remote"].forEach(function(prop) {
            if (typeof connectOptions.networkQuality[prop] === "number") {
              payload.networkQualityConfiguration[prop] = connectOptions.networkQuality[prop];
            }
          });
        } else {
          payload.networkQualityConfiguration.remote = 0;
          payload.networkQualityConfiguration.local = connectOptions.networkQuality ? 1 : 0;
        }
      }
      if (connectOptions.bandwidthProfile && connectOptions.bandwidthProfile.video) {
        var videoBPOptions_1 = connectOptions.bandwidthProfile.video || {};
        payload.bandwidthProfileOptions = {};
        ["mode", "maxTracks", "trackSwitchOffMode", "dominantSpeakerPriority", "maxSubscriptionBitrate", "renderDimensions", "contentPreferencesMode", "clientTrackSwitchOffControl"].forEach(function(prop) {
          if (typeof videoBPOptions_1[prop] === "number" || typeof videoBPOptions_1[prop] === "string") {
            payload.bandwidthProfileOptions[prop] = videoBPOptions_1[prop];
          } else if (typeof videoBPOptions_1[prop] === "boolean") {
            payload.bandwidthProfileOptions[prop] = boolToString(videoBPOptions_1[prop]);
          } else if (typeof videoBPOptions_1[prop] === "object") {
            payload.bandwidthProfileOptions[prop] = JSON.stringify(videoBPOptions_1[prop]);
          }
        });
      }
      return {
        group: "room",
        name: "connect",
        level: "info",
        payload
      };
    }
    function createBandwidthProfilePayload(bandwidthProfile) {
      return createRSPPayload(bandwidthProfile, [
        { prop: "video", type: "object", transform: createBandwidthProfileVideoPayload }
      ]);
    }
    function createBandwidthProfileVideoPayload(bandwidthProfileVideo) {
      return createRSPPayload(bandwidthProfileVideo, [
        { prop: "dominantSpeakerPriority", type: "string", payloadProp: "active_speaker_priority" },
        { prop: "maxSubscriptionBitrate", type: "number", payloadProp: "max_subscription_bandwidth" },
        { prop: "maxTracks", type: "number", payloadProp: "max_tracks" },
        { prop: "mode", type: "string" },
        { prop: "renderDimensions", type: "object", payloadProp: "render_dimensions", transform: createRenderDimensionsPayload },
        { prop: "trackSwitchOffMode", type: "string", payloadProp: "track_switch_off" }
      ]);
    }
    function createMediaSignalingPayload(dominantSpeaker, networkQuality, trackPriority2, trackSwitchOff, adaptiveSimulcast, renderHints) {
      var transports = { transports: [{ type: "data-channel" }] };
      return Object.assign(dominantSpeaker ? { active_speaker: transports } : {}, networkQuality ? { network_quality: transports } : {}, renderHints ? { render_hints: transports } : {}, adaptiveSimulcast ? { publisher_hints: transports } : {}, trackPriority2 ? { track_priority: transports } : {}, trackSwitchOff ? { track_switch_off: transports } : {});
    }
    function createDimensionsPayload(dimensions) {
      return createRSPPayload(dimensions, [
        { prop: "height", type: "number" },
        { prop: "width", type: "number" }
      ]);
    }
    function createRenderDimensionsPayload(renderDimensions) {
      var PRIORITY_HIGH = trackPriority.PRIORITY_HIGH, PRIORITY_LOW = trackPriority.PRIORITY_LOW, PRIORITY_STANDARD = trackPriority.PRIORITY_STANDARD;
      return createRSPPayload(renderDimensions, [
        { prop: PRIORITY_HIGH, type: "object", transform: createDimensionsPayload },
        { prop: PRIORITY_LOW, type: "object", transform: createDimensionsPayload },
        { prop: PRIORITY_STANDARD, type: "object", transform: createDimensionsPayload }
      ]);
    }
    function createRSPPayload(object, propConversions) {
      return propConversions.reduce(function(payload, _a) {
        var _b;
        var prop = _a.prop, type = _a.type, _c = _a.payloadProp, payloadProp = _c === void 0 ? prop : _c, _d = _a.transform, transform = _d === void 0 ? function(x) {
          return x;
        } : _d;
        return typeof object[prop] === type ? Object.assign((_b = {}, _b[payloadProp] = transform(object[prop]), _b), payload) : payload;
      }, {});
    }
    function createSubscribePayload(automaticSubscription) {
      return {
        rules: [{
          type: automaticSubscription ? "include" : "exclude",
          all: true
        }],
        revision: 1
      };
    }
    function createMediaWarningsPayload(notifyWarnings) {
      var _a;
      var mediaWarnings = (_a = {}, _a[TwilioWarning.recordingMediaLost] = "recordings", _a);
      return notifyWarnings.map(function(twilioWarningName) {
        return mediaWarnings[twilioWarningName];
      }).filter(function(name) {
        return !!name;
      });
    }
    function withJitter(value, jitter) {
      var rand = Math.random();
      return value - jitter + Math.floor(2 * jitter * rand + 0.5);
    }
    function inRange(num, min, max) {
      return min <= num && num <= max;
    }
    function isChromeScreenShareTrack(track) {
      return util.guessBrowser() === "chrome" && track.kind === "video" && "displaySurface" in track.getSettings();
    }
    function waitForSometime(timeoutMS) {
      if (timeoutMS === void 0) {
        timeoutMS = 10;
      }
      return new Promise(function(resolve) {
        return setTimeout(resolve, timeoutMS);
      });
    }
    function waitForEvent(eventTarget, event) {
      return new Promise(function(resolve) {
        eventTarget.addEventListener(event, function onevent(e) {
          eventTarget.removeEventListener(event, onevent);
          resolve(e);
        });
      });
    }
    exports.constants = constants;
    exports.createBandwidthProfilePayload = createBandwidthProfilePayload;
    exports.createMediaSignalingPayload = createMediaSignalingPayload;
    exports.createMediaWarningsPayload = createMediaWarningsPayload;
    exports.createRoomConnectEventPayload = createRoomConnectEventPayload;
    exports.createSubscribePayload = createSubscribePayload;
    exports.asLocalTrack = asLocalTrack;
    exports.asLocalTrackPublication = asLocalTrackPublication;
    exports.capitalize = capitalize;
    exports.deprecateEvents = deprecateEvents;
    exports.difference = difference;
    exports.filterObject = filterObject;
    exports.flatMap = flatMap;
    exports.getPlatform = getPlatform;
    exports.getUserAgent = getUserAgent;
    exports.hidePrivateProperties = hidePrivateProperties;
    exports.hidePrivateAndCertainPublicPropertiesInClass = hidePrivateAndCertainPublicPropertiesInClass;
    exports.isDeepEqual = isDeepEqual;
    exports.isNonArrayObject = isNonArrayObject;
    exports.inRange = inRange;
    exports.makeUUID = makeUUID;
    exports.oncePerTick = oncePerTick;
    exports.promiseFromEvents = promiseFromEvents;
    exports.getOrNull = getOrNull;
    exports.defer = defer;
    exports.delegateMethods = delegateMethods;
    exports.proxyProperties = proxyProperties;
    exports.legacyPromise = legacyPromise;
    exports.buildLogLevels = buildLogLevels;
    exports.trackClass = trackClass;
    exports.trackPublicationClass = trackPublicationClass;
    exports.valueToJSON = valueToJSON;
    exports.withJitter = withJitter;
    exports.isChromeScreenShareTrack = isChromeScreenShareTrack;
    exports.waitForSometime = waitForSometime;
    exports.waitForEvent = waitForEvent;
  }
});

// node_modules/twilio-video/es5/webrtc/util/sdp.js
var require_sdp = __commonJS({
  "node_modules/twilio-video/es5/webrtc/util/sdp.js"(exports) {
    "use strict";
    var _a = require_util();
    var flatMap = _a.flatMap;
    var guessBrowser = _a.guessBrowser;
    var isSdpSemanticsSupported = null;
    function checkIfSdpSemanticsIsSupported() {
      if (typeof isSdpSemanticsSupported === "boolean") {
        return isSdpSemanticsSupported;
      }
      if (typeof RTCPeerConnection === "undefined") {
        isSdpSemanticsSupported = false;
        return isSdpSemanticsSupported;
      }
      try {
        new RTCPeerConnection({ sdpSemantics: "foo" });
        isSdpSemanticsSupported = false;
      } catch (e) {
        isSdpSemanticsSupported = true;
      }
      return isSdpSemanticsSupported;
    }
    var chromeSdpFormat = null;
    function clearChromeCachedSdpFormat() {
      chromeSdpFormat = null;
    }
    function getChromeDefaultSdpFormat() {
      if (!chromeSdpFormat) {
        if (typeof RTCPeerConnection !== "undefined" && "addTransceiver" in RTCPeerConnection.prototype) {
          var pc = new RTCPeerConnection();
          try {
            pc.addTransceiver("audio");
            chromeSdpFormat = "unified";
          } catch (e) {
            chromeSdpFormat = "planb";
          }
          pc.close();
        } else {
          chromeSdpFormat = "planb";
        }
      }
      return chromeSdpFormat;
    }
    function getChromeSdpFormat(sdpSemantics) {
      if (!sdpSemantics || !checkIfSdpSemanticsIsSupported()) {
        return getChromeDefaultSdpFormat();
      }
      return {
        "plan-b": "planb",
        "unified-plan": "unified"
      }[sdpSemantics];
    }
    function getSafariSdpFormat() {
      return typeof RTCRtpTransceiver !== "undefined" && "currentDirection" in RTCRtpTransceiver.prototype ? "unified" : "planb";
    }
    function getSdpFormat(sdpSemantics) {
      return {
        chrome: getChromeSdpFormat(sdpSemantics),
        firefox: "unified",
        safari: getSafariSdpFormat()
      }[guessBrowser()] || null;
    }
    function getMatches(pattern, lines) {
      var matches = lines.match(new RegExp(pattern, "gm")) || [];
      return matches.reduce(function(results, line) {
        var match = line.match(new RegExp(pattern));
        return match ? results.add(match[1]) : results;
      }, /* @__PURE__ */ new Set());
    }
    function getTrackIds(pattern, sdp) {
      return getMatches(pattern, sdp);
    }
    function getPlanBTrackIds(sdp) {
      return getTrackIds("^a=ssrc:[0-9]+ +msid:.+ +(.+) *$", sdp);
    }
    function getUnifiedPlanTrackIds(sdp) {
      return getTrackIds("^a=msid:.+ +(.+) *$", sdp);
    }
    function getPlanBSSRCs(sdp, trackId) {
      var pattern = "^a=ssrc:([0-9]+) +msid:[^ ]+ +" + trackId + " *$";
      return getMatches(pattern, sdp);
    }
    function getMediaSections(sdp, kind, direction) {
      if (kind === void 0) {
        kind = ".*";
      }
      if (direction === void 0) {
        direction = ".*";
      }
      return sdp.split("\r\nm=").slice(1).map(function(mediaSection) {
        return "m=" + mediaSection;
      }).filter(function(mediaSection) {
        var kindPattern = new RegExp("m=" + kind, "gm");
        var directionPattern = new RegExp("a=" + direction, "gm");
        return kindPattern.test(mediaSection) && directionPattern.test(mediaSection);
      });
    }
    function getMediaSectionSSRCs(mediaSection) {
      return Array.from(getMatches("^a=ssrc:([0-9]+) +.*$", mediaSection));
    }
    function getUnifiedPlanSSRCs(sdp, trackId) {
      var mediaSections = getMediaSections(sdp);
      var msidAttrRegExp = new RegExp("^a=msid:[^ ]+ +" + trackId + " *$", "gm");
      var matchingMediaSections = mediaSections.filter(function(mediaSection) {
        return mediaSection.match(msidAttrRegExp);
      });
      return new Set(flatMap(matchingMediaSections, getMediaSectionSSRCs));
    }
    function getTrackIdsToSSRCs(getTrackIds2, getSSRCs, sdp) {
      return new Map(Array.from(getTrackIds2(sdp)).map(function(trackId) {
        return [trackId, getSSRCs(sdp, trackId)];
      }));
    }
    function getPlanBTrackIdsToSSRCs(sdp) {
      return getTrackIdsToSSRCs(getPlanBTrackIds, getPlanBSSRCs, sdp);
    }
    function getUnifiedPlanTrackIdsToSSRCs(sdp) {
      return getTrackIdsToSSRCs(getUnifiedPlanTrackIds, getUnifiedPlanSSRCs, sdp);
    }
    function updateTrackIdsToSSRCs(getTrackIdsToSSRCs2, trackIdsToSSRCs, sdp) {
      var newTrackIdsToSSRCs = getTrackIdsToSSRCs2(sdp);
      var newSSRCsToOldSSRCs = /* @__PURE__ */ new Map();
      newTrackIdsToSSRCs.forEach(function(ssrcs, trackId) {
        if (!trackIdsToSSRCs.has(trackId)) {
          trackIdsToSSRCs.set(trackId, ssrcs);
          return;
        }
        var oldSSRCs = Array.from(trackIdsToSSRCs.get(trackId));
        var newSSRCs = Array.from(ssrcs);
        oldSSRCs.forEach(function(oldSSRC, i) {
          var newSSRC = newSSRCs[i];
          newSSRCsToOldSSRCs.set(newSSRC, oldSSRC);
          var pattern2 = "^a=ssrc:" + newSSRC + " (.*)$";
          var replacement = "a=ssrc:" + oldSSRC + " $1";
          sdp = sdp.replace(new RegExp(pattern2, "gm"), replacement);
        });
      });
      var pattern = "^(a=ssrc-group:[^ ]+ +)(.*)$";
      var matches = sdp.match(new RegExp(pattern, "gm")) || [];
      matches.forEach(function(line) {
        var match = line.match(new RegExp(pattern));
        if (!match) {
          return;
        }
        var prefix = match[1];
        var newSSRCs = match[2];
        var oldSSRCs = newSSRCs.split(" ").map(function(newSSRC) {
          var oldSSRC = newSSRCsToOldSSRCs.get(newSSRC);
          return oldSSRC ? oldSSRC : newSSRC;
        }).join(" ");
        sdp = sdp.replace(match[0], prefix + oldSSRCs);
      });
      return sdp;
    }
    function updatePlanBTrackIdsToSSRCs(trackIdsToSSRCs, sdp) {
      return updateTrackIdsToSSRCs(getPlanBTrackIdsToSSRCs, trackIdsToSSRCs, sdp);
    }
    function updateUnifiedPlanTrackIdsToSSRCs(trackIdsToSSRCs, sdp) {
      return updateTrackIdsToSSRCs(getUnifiedPlanTrackIdsToSSRCs, trackIdsToSSRCs, sdp);
    }
    exports.clearChromeCachedSdpFormat = clearChromeCachedSdpFormat;
    exports.getSdpFormat = getSdpFormat;
    exports.getMediaSections = getMediaSections;
    exports.getPlanBTrackIds = getPlanBTrackIds;
    exports.getUnifiedPlanTrackIds = getUnifiedPlanTrackIds;
    exports.getPlanBSSRCs = getPlanBSSRCs;
    exports.getUnifiedPlanSSRCs = getUnifiedPlanSSRCs;
    exports.updatePlanBTrackIdsToSSRCs = updatePlanBTrackIdsToSSRCs;
    exports.updateUnifiedPlanTrackIdsToSSRCs = updateUnifiedPlanTrackIdsToSSRCs;
  }
});

// node_modules/twilio-video/es5/webrtc/getstats.js
var require_getstats = __commonJS({
  "node_modules/twilio-video/es5/webrtc/getstats.js"(exports, module) {
    "use strict";
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var _a = require_util();
    var flatMap = _a.flatMap;
    var guessBrowser = _a.guessBrowser;
    var guessBrowserVersion = _a.guessBrowserVersion;
    var getSdpFormat = require_sdp().getSdpFormat;
    var guess = guessBrowser();
    var guessVersion = guessBrowserVersion();
    var isChrome = guess === "chrome";
    var isFirefox = guess === "firefox";
    var isSafari = guess === "safari";
    var chromeMajorVersion = isChrome ? guessVersion.major : null;
    var CHROME_LEGACY_MAX_AUDIO_LEVEL = 32767;
    function getStats(peerConnection, options) {
      if (!(peerConnection && typeof peerConnection.getStats === "function")) {
        return Promise.reject(new Error("Given PeerConnection does not support getStats"));
      }
      return _getStats(peerConnection, options);
    }
    function _getStats(peerConnection, options) {
      var localAudioTracks = getTracks(peerConnection, "audio", "local");
      var localVideoTracks = getTracks(peerConnection, "video", "local");
      var remoteAudioTracks = getTracks(peerConnection, "audio");
      var remoteVideoTracks = getTracks(peerConnection, "video");
      var statsResponse = {
        activeIceCandidatePair: null,
        localAudioTrackStats: [],
        localVideoTrackStats: [],
        remoteAudioTrackStats: [],
        remoteVideoTrackStats: []
      };
      var trackStatsPromises = flatMap([
        [localAudioTracks, "localAudioTrackStats", false],
        [localVideoTracks, "localVideoTrackStats", false],
        [remoteAudioTracks, "remoteAudioTrackStats", true],
        [remoteVideoTracks, "remoteVideoTrackStats", true]
      ], function(_a2) {
        var _b = __read(_a2, 3), tracks = _b[0], statsArrayName = _b[1], isRemote = _b[2];
        return tracks.map(function(track) {
          return getTrackStats(peerConnection, track, Object.assign({ isRemote }, options)).then(function(trackStatsArray) {
            trackStatsArray.forEach(function(trackStats) {
              trackStats.trackId = track.id;
              statsResponse[statsArrayName].push(trackStats);
            });
          });
        });
      });
      return Promise.all(trackStatsPromises).then(function() {
        return getActiveIceCandidatePairStats(peerConnection, options);
      }).then(function(activeIceCandidatePairStatsReport) {
        statsResponse.activeIceCandidatePair = activeIceCandidatePairStatsReport;
        return statsResponse;
      });
    }
    function getActiveIceCandidatePairStats(peerConnection, options) {
      if (options === void 0) {
        options = {};
      }
      if (typeof options.testForChrome !== "undefined" || isChrome || typeof options.testForSafari !== "undefined" || isSafari) {
        return peerConnection.getStats().then(standardizeChromeOrSafariActiveIceCandidatePairStats);
      }
      if (typeof options.testForFirefox !== "undefined" || isFirefox) {
        return peerConnection.getStats().then(standardizeFirefoxActiveIceCandidatePairStats);
      }
      return Promise.reject(new Error("RTCPeerConnection#getStats() not supported"));
    }
    function standardizeChromeOrSafariActiveIceCandidatePairStats(stats) {
      var activeCandidatePairStats = Array.from(stats.values()).find(function(_a2) {
        var nominated = _a2.nominated, type = _a2.type;
        return type === "candidate-pair" && nominated;
      });
      if (!activeCandidatePairStats) {
        return null;
      }
      var activeLocalCandidateStats = stats.get(activeCandidatePairStats.localCandidateId);
      var activeRemoteCandidateStats = stats.get(activeCandidatePairStats.remoteCandidateId);
      var standardizedCandidateStatsKeys = [
        { key: "candidateType", type: "string" },
        { key: "ip", type: "string" },
        { key: "port", type: "number" },
        { key: "priority", type: "number" },
        { key: "protocol", type: "string" },
        { key: "url", type: "string" }
      ];
      var standardizedLocalCandidateStatsKeys = standardizedCandidateStatsKeys.concat([
        { key: "deleted", type: "boolean" },
        { key: "relayProtocol", type: "string" }
      ]);
      var standatdizedLocalCandidateStatsReport = activeLocalCandidateStats ? standardizedLocalCandidateStatsKeys.reduce(function(report, _a2) {
        var key = _a2.key, type = _a2.type;
        report[key] = typeof activeLocalCandidateStats[key] === type ? activeLocalCandidateStats[key] : key === "deleted" ? false : null;
        return report;
      }, {}) : null;
      var standardizedRemoteCandidateStatsReport = activeRemoteCandidateStats ? standardizedCandidateStatsKeys.reduce(function(report, _a2) {
        var key = _a2.key, type = _a2.type;
        report[key] = typeof activeRemoteCandidateStats[key] === type ? activeRemoteCandidateStats[key] : null;
        return report;
      }, {}) : null;
      return [
        { key: "availableIncomingBitrate", type: "number" },
        { key: "availableOutgoingBitrate", type: "number" },
        { key: "bytesReceived", type: "number" },
        { key: "bytesSent", type: "number" },
        { key: "consentRequestsSent", type: "number" },
        { key: "currentRoundTripTime", type: "number" },
        { key: "lastPacketReceivedTimestamp", type: "number" },
        { key: "lastPacketSentTimestamp", type: "number" },
        { key: "nominated", type: "boolean" },
        { key: "priority", type: "number" },
        { key: "readable", type: "boolean" },
        { key: "requestsReceived", type: "number" },
        { key: "requestsSent", type: "number" },
        { key: "responsesReceived", type: "number" },
        { key: "responsesSent", type: "number" },
        { key: "retransmissionsReceived", type: "number" },
        { key: "retransmissionsSent", type: "number" },
        { key: "state", type: "string", fixup: function(state) {
          return state === "inprogress" ? "in-progress" : state;
        } },
        { key: "totalRoundTripTime", type: "number" },
        { key: "transportId", type: "string" },
        { key: "writable", type: "boolean" }
      ].reduce(function(report, _a2) {
        var key = _a2.key, type = _a2.type, fixup = _a2.fixup;
        report[key] = typeof activeCandidatePairStats[key] === type ? fixup ? fixup(activeCandidatePairStats[key]) : activeCandidatePairStats[key] : null;
        return report;
      }, {
        localCandidate: standatdizedLocalCandidateStatsReport,
        remoteCandidate: standardizedRemoteCandidateStatsReport
      });
    }
    function standardizeFirefoxActiveIceCandidatePairStats(stats) {
      var activeCandidatePairStats = Array.from(stats.values()).find(function(_a2) {
        var nominated = _a2.nominated, type = _a2.type;
        return type === "candidate-pair" && nominated;
      });
      if (!activeCandidatePairStats) {
        return null;
      }
      var activeLocalCandidateStats = stats.get(activeCandidatePairStats.localCandidateId);
      var activeRemoteCandidateStats = stats.get(activeCandidatePairStats.remoteCandidateId);
      var standardizedCandidateStatsKeys = [
        { key: "candidateType", type: "string" },
        { key: "ip", ffKeys: ["address", "ipAddress"], type: "string" },
        { key: "port", ffKeys: ["portNumber"], type: "number" },
        { key: "priority", type: "number" },
        { key: "protocol", ffKeys: ["transport"], type: "string" },
        { key: "url", type: "string" }
      ];
      var standardizedLocalCandidateStatsKeys = standardizedCandidateStatsKeys.concat([
        { key: "deleted", type: "boolean" },
        { key: "relayProtocol", type: "string" }
      ]);
      var candidateTypes = {
        host: "host",
        peerreflexive: "prflx",
        relayed: "relay",
        serverreflexive: "srflx"
      };
      var standatdizedLocalCandidateStatsReport = activeLocalCandidateStats ? standardizedLocalCandidateStatsKeys.reduce(function(report, _a2) {
        var ffKeys = _a2.ffKeys, key = _a2.key, type = _a2.type;
        var localStatKey = ffKeys && ffKeys.find(function(key2) {
          return key2 in activeLocalCandidateStats;
        }) || key;
        report[key] = typeof activeLocalCandidateStats[localStatKey] === type ? localStatKey === "candidateType" ? candidateTypes[activeLocalCandidateStats[localStatKey]] || activeLocalCandidateStats[localStatKey] : activeLocalCandidateStats[localStatKey] : localStatKey === "deleted" ? false : null;
        return report;
      }, {}) : null;
      var standardizedRemoteCandidateStatsReport = activeRemoteCandidateStats ? standardizedCandidateStatsKeys.reduce(function(report, _a2) {
        var ffKeys = _a2.ffKeys, key = _a2.key, type = _a2.type;
        var remoteStatKey = ffKeys && ffKeys.find(function(key2) {
          return key2 in activeRemoteCandidateStats;
        }) || key;
        report[key] = typeof activeRemoteCandidateStats[remoteStatKey] === type ? remoteStatKey === "candidateType" ? candidateTypes[activeRemoteCandidateStats[remoteStatKey]] || activeRemoteCandidateStats[remoteStatKey] : activeRemoteCandidateStats[remoteStatKey] : null;
        return report;
      }, {}) : null;
      return [
        { key: "availableIncomingBitrate", type: "number" },
        { key: "availableOutgoingBitrate", type: "number" },
        { key: "bytesReceived", type: "number" },
        { key: "bytesSent", type: "number" },
        { key: "consentRequestsSent", type: "number" },
        { key: "currentRoundTripTime", type: "number" },
        { key: "lastPacketReceivedTimestamp", type: "number" },
        { key: "lastPacketSentTimestamp", type: "number" },
        { key: "nominated", type: "boolean" },
        { key: "priority", type: "number" },
        { key: "readable", type: "boolean" },
        { key: "requestsReceived", type: "number" },
        { key: "requestsSent", type: "number" },
        { key: "responsesReceived", type: "number" },
        { key: "responsesSent", type: "number" },
        { key: "retransmissionsReceived", type: "number" },
        { key: "retransmissionsSent", type: "number" },
        { key: "state", type: "string" },
        { key: "totalRoundTripTime", type: "number" },
        { key: "transportId", type: "string" },
        { key: "writable", type: "boolean" }
      ].reduce(function(report, _a2) {
        var key = _a2.key, type = _a2.type;
        report[key] = typeof activeCandidatePairStats[key] === type ? activeCandidatePairStats[key] : null;
        return report;
      }, {
        localCandidate: standatdizedLocalCandidateStatsReport,
        remoteCandidate: standardizedRemoteCandidateStatsReport
      });
    }
    function getTracks(peerConnection, kind, localOrRemote) {
      var getSendersOrReceivers = localOrRemote === "local" ? "getSenders" : "getReceivers";
      if (peerConnection[getSendersOrReceivers]) {
        return peerConnection[getSendersOrReceivers]().map(function(_a2) {
          var track = _a2.track;
          return track;
        }).filter(function(track) {
          return track && track.kind === kind;
        });
      }
      var getStreams = localOrRemote === "local" ? "getLocalStreams" : "getRemoteStreams";
      var getTracks2 = kind === "audio" ? "getAudioTracks" : "getVideoTracks";
      return flatMap(peerConnection[getStreams](), function(stream) {
        return stream[getTracks2]();
      });
    }
    function getTrackStats(peerConnection, track, options) {
      if (options === void 0) {
        options = {};
      }
      if (typeof options.testForChrome !== "undefined" || isChrome) {
        return chromeOrSafariGetTrackStats(peerConnection, track, options);
      }
      if (typeof options.testForFirefox !== "undefined" || isFirefox) {
        return firefoxGetTrackStats(peerConnection, track, options);
      }
      if (typeof options.testForSafari !== "undefined" || isSafari) {
        if (typeof options.testForSafari !== "undefined" || getSdpFormat() === "unified") {
          return chromeOrSafariGetTrackStats(peerConnection, track, options);
        }
        return Promise.reject(new Error([
          "getStats() is not supported on this version of Safari",
          "due to this bug: https://bugs.webkit.org/show_bug.cgi?id=192601"
        ].join(" ")));
      }
      return Promise.reject(new Error("RTCPeerConnection#getStats() not supported"));
    }
    function chromeOrSafariGetTrackStats(peerConnection, track, options) {
      if (chromeMajorVersion && chromeMajorVersion < 67) {
        return new Promise(function(resolve, reject) {
          peerConnection.getStats(function(response) {
            resolve([standardizeChromeLegacyStats(response, track)]);
          }, null, reject);
        });
      }
      return peerConnection.getStats(track).then(function(response) {
        return standardizeChromeOrSafariStats(response, options);
      });
    }
    function firefoxGetTrackStats(peerConnection, track, options) {
      return peerConnection.getStats(track).then(function(response) {
        return [standardizeFirefoxStats(response, options)];
      });
    }
    function standardizeChromeLegacyStats(response, track) {
      var ssrcReport = response.result().find(function(report) {
        return report.type === "ssrc" && report.stat("googTrackId") === track.id;
      });
      var standardizedStats = {};
      if (ssrcReport) {
        standardizedStats.timestamp = Math.round(Number(ssrcReport.timestamp));
        standardizedStats = ssrcReport.names().reduce(function(stats, name) {
          switch (name) {
            case "googCodecName":
              stats.codecName = ssrcReport.stat(name);
              break;
            case "googRtt":
              stats.roundTripTime = Number(ssrcReport.stat(name));
              break;
            case "googJitterReceived":
              stats.jitter = Number(ssrcReport.stat(name));
              break;
            case "googFrameWidthInput":
              stats.frameWidthInput = Number(ssrcReport.stat(name));
              break;
            case "googFrameHeightInput":
              stats.frameHeightInput = Number(ssrcReport.stat(name));
              break;
            case "googFrameWidthSent":
              stats.frameWidthSent = Number(ssrcReport.stat(name));
              break;
            case "googFrameHeightSent":
              stats.frameHeightSent = Number(ssrcReport.stat(name));
              break;
            case "googFrameWidthReceived":
              stats.frameWidthReceived = Number(ssrcReport.stat(name));
              break;
            case "googFrameHeightReceived":
              stats.frameHeightReceived = Number(ssrcReport.stat(name));
              break;
            case "googFrameRateInput":
              stats.frameRateInput = Number(ssrcReport.stat(name));
              break;
            case "googFrameRateSent":
              stats.frameRateSent = Number(ssrcReport.stat(name));
              break;
            case "googFrameRateReceived":
              stats.frameRateReceived = Number(ssrcReport.stat(name));
              break;
            case "ssrc":
              stats[name] = ssrcReport.stat(name);
              break;
            case "bytesReceived":
            case "bytesSent":
            case "packetsLost":
            case "packetsReceived":
            case "packetsSent":
            case "audioInputLevel":
            case "audioOutputLevel":
              stats[name] = Number(ssrcReport.stat(name));
              break;
          }
          return stats;
        }, standardizedStats);
      }
      return standardizedStats;
    }
    function standardizeChromeOrSafariStats(response, _a2) {
      var _b = _a2.simulateExceptionWhileStandardizingStats, simulateExceptionWhileStandardizingStats = _b === void 0 ? false : _b;
      if (simulateExceptionWhileStandardizingStats) {
        throw new Error("Error while gathering stats");
      }
      var inbound = null;
      var outbound = [];
      var remoteInbound = null;
      var remoteOutbound = null;
      var track = null;
      var codec = null;
      var localMedia = null;
      response.forEach(function(stat) {
        var type = stat.type;
        switch (type) {
          case "inbound-rtp":
            inbound = stat;
            break;
          case "outbound-rtp":
            outbound.push(stat);
            break;
          case "media-source":
            localMedia = stat;
            break;
          case "track":
            track = stat;
            break;
          case "codec":
            codec = stat;
            break;
          case "remote-inbound-rtp":
            remoteInbound = stat;
            break;
          case "remote-outbound-rtp":
            remoteOutbound = stat;
            break;
        }
      });
      var isRemote = track ? track.remoteSource : !localMedia;
      var mainSources = isRemote ? [inbound] : outbound;
      var stats = [];
      var remoteSource = isRemote ? remoteOutbound : remoteInbound;
      mainSources.forEach(function(source) {
        var standardizedStats = {};
        var statSources = [
          source,
          localMedia,
          track,
          codec,
          remoteSource && remoteSource.ssrc === source.ssrc ? remoteSource : null
          // remote rtp stats
        ];
        function getStatValue(name) {
          var sourceFound = statSources.find(function(statSource) {
            return statSource && typeof statSource[name] !== "undefined";
          }) || null;
          return sourceFound ? sourceFound[name] : null;
        }
        var ssrc = getStatValue("ssrc");
        if (typeof ssrc === "number") {
          standardizedStats.ssrc = String(ssrc);
        }
        var timestamp = getStatValue("timestamp");
        standardizedStats.timestamp = Math.round(timestamp);
        var mimeType = getStatValue("mimeType");
        if (typeof mimeType === "string") {
          mimeType = mimeType.split("/");
          standardizedStats.codecName = mimeType[mimeType.length - 1];
        }
        var roundTripTime = getStatValue("roundTripTime");
        if (typeof roundTripTime === "number") {
          standardizedStats.roundTripTime = Math.round(roundTripTime * 1e3);
        }
        var jitter = getStatValue("jitter");
        if (typeof jitter === "number") {
          standardizedStats.jitter = Math.round(jitter * 1e3);
        }
        var frameWidth = getStatValue("frameWidth");
        if (typeof frameWidth === "number") {
          if (isRemote) {
            standardizedStats.frameWidthReceived = frameWidth;
          } else {
            standardizedStats.frameWidthSent = frameWidth;
            standardizedStats.frameWidthInput = track ? track.frameWidth : localMedia.width;
          }
        }
        var frameHeight = getStatValue("frameHeight");
        if (typeof frameHeight === "number") {
          if (isRemote) {
            standardizedStats.frameHeightReceived = frameHeight;
          } else {
            standardizedStats.frameHeightSent = frameHeight;
            standardizedStats.frameHeightInput = track ? track.frameHeight : localMedia.height;
          }
        }
        var framesPerSecond = getStatValue("framesPerSecond");
        if (typeof framesPerSecond === "number") {
          standardizedStats[isRemote ? "frameRateReceived" : "frameRateSent"] = framesPerSecond;
        }
        var bytesReceived = getStatValue("bytesReceived");
        if (typeof bytesReceived === "number") {
          standardizedStats.bytesReceived = bytesReceived;
        }
        var bytesSent = getStatValue("bytesSent");
        if (typeof bytesSent === "number") {
          standardizedStats.bytesSent = bytesSent;
        }
        var packetsLost = getStatValue("packetsLost");
        if (typeof packetsLost === "number") {
          standardizedStats.packetsLost = packetsLost;
        }
        var packetsReceived = getStatValue("packetsReceived");
        if (typeof packetsReceived === "number") {
          standardizedStats.packetsReceived = packetsReceived;
        }
        var packetsSent = getStatValue("packetsSent");
        if (typeof packetsSent === "number") {
          standardizedStats.packetsSent = packetsSent;
        }
        var audioLevel = getStatValue("audioLevel");
        if (typeof audioLevel === "number") {
          audioLevel = Math.round(audioLevel * CHROME_LEGACY_MAX_AUDIO_LEVEL);
          if (isRemote) {
            standardizedStats.audioOutputLevel = audioLevel;
          } else {
            standardizedStats.audioInputLevel = audioLevel;
          }
        }
        var totalPacketSendDalay = getStatValue("totalPacketSendDelay");
        if (typeof totalPacketSendDalay === "number") {
          standardizedStats.totalPacketSendDelay = totalPacketSendDalay;
        }
        var totalEncodeTime = getStatValue("totalEncodeTime");
        if (typeof totalEncodeTime === "number") {
          standardizedStats.totalEncodeTime = totalEncodeTime;
        }
        var framesEncoded = getStatValue("framesEncoded");
        if (typeof framesEncoded === "number") {
          standardizedStats.framesEncoded = framesEncoded;
        }
        var estimatedPlayoutTimestamp = getStatValue("estimatedPlayoutTimestamp");
        if (typeof estimatedPlayoutTimestamp === "number") {
          standardizedStats.estimatedPlayoutTimestamp = estimatedPlayoutTimestamp;
        }
        var totalDecodeTime = getStatValue("totalDecodeTime");
        if (typeof totalDecodeTime === "number") {
          standardizedStats.totalDecodeTime = totalDecodeTime;
        }
        var framesDecoded = getStatValue("framesDecoded");
        if (typeof framesDecoded === "number") {
          standardizedStats.framesDecoded = framesDecoded;
        }
        var jitterBufferDelay = getStatValue("jitterBufferDelay");
        if (typeof jitterBufferDelay === "number") {
          standardizedStats.jitterBufferDelay = jitterBufferDelay;
        }
        var jitterBufferEmittedCount = getStatValue("jitterBufferEmittedCount");
        if (typeof jitterBufferEmittedCount === "number") {
          standardizedStats.jitterBufferEmittedCount = jitterBufferEmittedCount;
        }
        stats.push(standardizedStats);
      });
      return stats;
    }
    function standardizeFirefoxStats(response, _a2) {
      if (response === void 0) {
        response = /* @__PURE__ */ new Map();
      }
      var isRemote = _a2.isRemote, _b = _a2.simulateExceptionWhileStandardizingStats, simulateExceptionWhileStandardizingStats = _b === void 0 ? false : _b;
      if (simulateExceptionWhileStandardizingStats) {
        throw new Error("Error while gathering stats");
      }
      var inbound = null;
      var outbound = null;
      response.forEach(function(stat) {
        var isRemote2 = stat.isRemote, remoteId = stat.remoteId, type = stat.type;
        if (isRemote2) {
          return;
        }
        switch (type) {
          case "inbound-rtp":
            inbound = stat;
            outbound = response.get(remoteId);
            break;
          case "outbound-rtp":
            outbound = stat;
            inbound = response.get(remoteId);
            break;
        }
      });
      var first = isRemote ? inbound : outbound;
      var second = isRemote ? outbound : inbound;
      function getStatValue(name) {
        if (first && typeof first[name] !== "undefined") {
          return first[name];
        }
        if (second && typeof second[name] !== "undefined") {
          return second[name];
        }
        return null;
      }
      var standardizedStats = {};
      var timestamp = getStatValue("timestamp");
      standardizedStats.timestamp = Math.round(timestamp);
      var ssrc = getStatValue("ssrc");
      if (typeof ssrc === "number") {
        standardizedStats.ssrc = String(ssrc);
      }
      var bytesSent = getStatValue("bytesSent");
      if (typeof bytesSent === "number") {
        standardizedStats.bytesSent = bytesSent;
      }
      var packetsLost = getStatValue("packetsLost");
      if (typeof packetsLost === "number") {
        standardizedStats.packetsLost = packetsLost;
      }
      var packetsSent = getStatValue("packetsSent");
      if (typeof packetsSent === "number") {
        standardizedStats.packetsSent = packetsSent;
      }
      var roundTripTime = getStatValue("roundTripTime");
      if (typeof roundTripTime === "number") {
        standardizedStats.roundTripTime = Math.round(roundTripTime * 1e3);
      }
      var jitter = getStatValue("jitter");
      if (typeof jitter === "number") {
        standardizedStats.jitter = Math.round(jitter * 1e3);
      }
      var frameRateSent = getStatValue("framerateMean");
      if (typeof frameRateSent === "number") {
        standardizedStats.frameRateSent = Math.round(frameRateSent);
      }
      var bytesReceived = getStatValue("bytesReceived");
      if (typeof bytesReceived === "number") {
        standardizedStats.bytesReceived = bytesReceived;
      }
      var packetsReceived = getStatValue("packetsReceived");
      if (typeof packetsReceived === "number") {
        standardizedStats.packetsReceived = packetsReceived;
      }
      var frameRateReceived = getStatValue("framerateMean");
      if (typeof frameRateReceived === "number") {
        standardizedStats.frameRateReceived = Math.round(frameRateReceived);
      }
      var totalPacketSendDalay = getStatValue("totalPacketSendDelay");
      if (typeof totalPacketSendDalay === "number") {
        standardizedStats.totalPacketSendDelay = totalPacketSendDalay;
      }
      var totalEncodeTime = getStatValue("totalEncodeTime");
      if (typeof totalEncodeTime === "number") {
        standardizedStats.totalEncodeTime = totalEncodeTime;
      }
      var framesEncoded = getStatValue("framesEncoded");
      if (typeof framesEncoded === "number") {
        standardizedStats.framesEncoded = framesEncoded;
      }
      var estimatedPlayoutTimestamp = getStatValue("estimatedPlayoutTimestamp");
      if (typeof estimatedPlayoutTimestamp === "number") {
        standardizedStats.estimatedPlayoutTimestamp = estimatedPlayoutTimestamp;
      }
      var totalDecodeTime = getStatValue("totalDecodeTime");
      if (typeof totalDecodeTime === "number") {
        standardizedStats.totalDecodeTime = totalDecodeTime;
      }
      var framesDecoded = getStatValue("framesDecoded");
      if (typeof framesDecoded === "number") {
        standardizedStats.framesDecoded = framesDecoded;
      }
      var jitterBufferDelay = getStatValue("jitterBufferDelay");
      if (typeof jitterBufferDelay === "number") {
        standardizedStats.jitterBufferDelay = jitterBufferDelay;
      }
      var jitterBufferEmittedCount = getStatValue("jitterBufferEmittedCount");
      if (typeof jitterBufferEmittedCount === "number") {
        standardizedStats.jitterBufferEmittedCount = jitterBufferEmittedCount;
      }
      return standardizedStats;
    }
    module.exports = getStats;
  }
});

// node_modules/twilio-video/es5/webrtc/getusermedia.js
var require_getusermedia = __commonJS({
  "node_modules/twilio-video/es5/webrtc/getusermedia.js"(exports, module) {
    "use strict";
    function getUserMedia(constraints) {
      if (constraints === void 0) {
        constraints = { audio: true, video: true };
      }
      if (typeof navigator === "object" && typeof navigator.mediaDevices === "object" && typeof navigator.mediaDevices.getUserMedia === "function") {
        return navigator.mediaDevices.getUserMedia(constraints);
      }
      return Promise.reject(new Error("getUserMedia is not supported"));
    }
    module.exports = getUserMedia;
  }
});

// node_modules/twilio-video/es5/webrtc/mediastream.js
var require_mediastream = __commonJS({
  "node_modules/twilio-video/es5/webrtc/mediastream.js"(exports, module) {
    "use strict";
    if (typeof MediaStream === "function") {
      module.exports = MediaStream;
    } else {
      module.exports = function MediaStream2() {
        throw new Error("MediaStream is not supported");
      };
    }
  }
});

// node_modules/twilio-video/es5/webrtc/mediastreamtrack.js
var require_mediastreamtrack = __commonJS({
  "node_modules/twilio-video/es5/webrtc/mediastreamtrack.js"(exports, module) {
    "use strict";
    if (typeof MediaStreamTrack === "function") {
      module.exports = MediaStreamTrack;
    } else {
      module.exports = function MediaStreamTrack2() {
        throw new Error("MediaStreamTrack is not supported");
      };
    }
  }
});

// node_modules/twilio-video/es5/webrtc/rtcicecandidate.js
var require_rtcicecandidate = __commonJS({
  "node_modules/twilio-video/es5/webrtc/rtcicecandidate.js"(exports, module) {
    "use strict";
    if (typeof RTCIceCandidate === "function") {
      module.exports = RTCIceCandidate;
    } else {
      module.exports = function RTCIceCandidate2() {
        throw new Error("RTCIceCandidate is not supported");
      };
    }
  }
});

// node_modules/twilio-video/es5/webrtc/rtcsessiondescription/chrome.js
var require_chrome = __commonJS({
  "node_modules/twilio-video/es5/webrtc/rtcsessiondescription/chrome.js"(exports, module) {
    "use strict";
    var ChromeRTCSessionDescription = (
      /** @class */
      function() {
        function ChromeRTCSessionDescription2(descriptionInitDict) {
          this.descriptionInitDict = descriptionInitDict;
          var description = descriptionInitDict && descriptionInitDict.type === "rollback" ? null : new RTCSessionDescription(descriptionInitDict);
          Object.defineProperties(this, {
            _description: {
              get: function() {
                return description;
              }
            }
          });
        }
        Object.defineProperty(ChromeRTCSessionDescription2.prototype, "sdp", {
          get: function() {
            return this._description ? this._description.sdp : this.descriptionInitDict.sdp;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(ChromeRTCSessionDescription2.prototype, "type", {
          get: function() {
            return this._description ? this._description.type : this.descriptionInitDict.type;
          },
          enumerable: false,
          configurable: true
        });
        return ChromeRTCSessionDescription2;
      }()
    );
    module.exports = ChromeRTCSessionDescription;
  }
});

// node_modules/events/events.js
var require_events = __commonJS({
  "node_modules/events/events.js"(exports, module) {
    "use strict";
    var R = typeof Reflect === "object" ? Reflect : null;
    var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
      return Function.prototype.apply.call(target, receiver, args);
    };
    var ReflectOwnKeys;
    if (R && typeof R.ownKeys === "function") {
      ReflectOwnKeys = R.ownKeys;
    } else if (Object.getOwnPropertySymbols) {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
      };
    } else {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target);
      };
    }
    function ProcessEmitWarning(warning) {
      if (console && console.warn)
        console.warn(warning);
    }
    var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
      return value !== value;
    };
    function EventEmitter() {
      EventEmitter.init.call(this);
    }
    module.exports = EventEmitter;
    module.exports.once = once;
    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.prototype._events = void 0;
    EventEmitter.prototype._eventsCount = 0;
    EventEmitter.prototype._maxListeners = void 0;
    var defaultMaxListeners = 10;
    function checkListener(listener) {
      if (typeof listener !== "function") {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
    }
    Object.defineProperty(EventEmitter, "defaultMaxListeners", {
      enumerable: true,
      get: function() {
        return defaultMaxListeners;
      },
      set: function(arg) {
        if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
        }
        defaultMaxListeners = arg;
      }
    });
    EventEmitter.init = function() {
      if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
      }
      this._maxListeners = this._maxListeners || void 0;
    };
    EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
      if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
        throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
      }
      this._maxListeners = n;
      return this;
    };
    function _getMaxListeners(that) {
      if (that._maxListeners === void 0)
        return EventEmitter.defaultMaxListeners;
      return that._maxListeners;
    }
    EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
      return _getMaxListeners(this);
    };
    EventEmitter.prototype.emit = function emit(type) {
      var args = [];
      for (var i = 1; i < arguments.length; i++)
        args.push(arguments[i]);
      var doError = type === "error";
      var events = this._events;
      if (events !== void 0)
        doError = doError && events.error === void 0;
      else if (!doError)
        return false;
      if (doError) {
        var er;
        if (args.length > 0)
          er = args[0];
        if (er instanceof Error) {
          throw er;
        }
        var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
        err.context = er;
        throw err;
      }
      var handler = events[type];
      if (handler === void 0)
        return false;
      if (typeof handler === "function") {
        ReflectApply(handler, this, args);
      } else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          ReflectApply(listeners[i], this, args);
      }
      return true;
    };
    function _addListener(target, type, listener, prepend) {
      var m;
      var events;
      var existing;
      checkListener(listener);
      events = target._events;
      if (events === void 0) {
        events = target._events = /* @__PURE__ */ Object.create(null);
        target._eventsCount = 0;
      } else {
        if (events.newListener !== void 0) {
          target.emit(
            "newListener",
            type,
            listener.listener ? listener.listener : listener
          );
          events = target._events;
        }
        existing = events[type];
      }
      if (existing === void 0) {
        existing = events[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === "function") {
          existing = events[type] = prepend ? [listener, existing] : [existing, listener];
        } else if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
        m = _getMaxListeners(target);
        if (m > 0 && existing.length > m && !existing.warned) {
          existing.warned = true;
          var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
          w.name = "MaxListenersExceededWarning";
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          ProcessEmitWarning(w);
        }
      }
      return target;
    }
    EventEmitter.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.prependListener = function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };
    function onceWrapper() {
      if (!this.fired) {
        this.target.removeListener(this.type, this.wrapFn);
        this.fired = true;
        if (arguments.length === 0)
          return this.listener.call(this.target);
        return this.listener.apply(this.target, arguments);
      }
    }
    function _onceWrap(target, type, listener) {
      var state = { fired: false, wrapFn: void 0, target, type, listener };
      var wrapped = onceWrapper.bind(state);
      wrapped.listener = listener;
      state.wrapFn = wrapped;
      return wrapped;
    }
    EventEmitter.prototype.once = function once2(type, listener) {
      checkListener(listener);
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter.prototype.removeListener = function removeListener(type, listener) {
      var list, events, position, i, originalListener;
      checkListener(listener);
      events = this._events;
      if (events === void 0)
        return this;
      list = events[type];
      if (list === void 0)
        return this;
      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = /* @__PURE__ */ Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit("removeListener", type, list.listener || listener);
        }
      } else if (typeof list !== "function") {
        position = -1;
        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }
        if (position < 0)
          return this;
        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }
        if (list.length === 1)
          events[type] = list[0];
        if (events.removeListener !== void 0)
          this.emit("removeListener", type, originalListener || listener);
      }
      return this;
    };
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
      var listeners, events, i;
      events = this._events;
      if (events === void 0)
        return this;
      if (events.removeListener === void 0) {
        if (arguments.length === 0) {
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== void 0) {
          if (--this._eventsCount === 0)
            this._events = /* @__PURE__ */ Object.create(null);
          else
            delete events[type];
        }
        return this;
      }
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === "removeListener")
            continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
        return this;
      }
      listeners = events[type];
      if (typeof listeners === "function") {
        this.removeListener(type, listeners);
      } else if (listeners !== void 0) {
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }
      return this;
    };
    function _listeners(target, type, unwrap) {
      var events = target._events;
      if (events === void 0)
        return [];
      var evlistener = events[type];
      if (evlistener === void 0)
        return [];
      if (typeof evlistener === "function")
        return unwrap ? [evlistener.listener || evlistener] : [evlistener];
      return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
    }
    EventEmitter.prototype.listeners = function listeners(type) {
      return _listeners(this, type, true);
    };
    EventEmitter.prototype.rawListeners = function rawListeners(type) {
      return _listeners(this, type, false);
    };
    EventEmitter.listenerCount = function(emitter, type) {
      if (typeof emitter.listenerCount === "function") {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };
    EventEmitter.prototype.listenerCount = listenerCount;
    function listenerCount(type) {
      var events = this._events;
      if (events !== void 0) {
        var evlistener = events[type];
        if (typeof evlistener === "function") {
          return 1;
        } else if (evlistener !== void 0) {
          return evlistener.length;
        }
      }
      return 0;
    }
    EventEmitter.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
    };
    function arrayClone(arr, n) {
      var copy = new Array(n);
      for (var i = 0; i < n; ++i)
        copy[i] = arr[i];
      return copy;
    }
    function spliceOne(list, index) {
      for (; index + 1 < list.length; index++)
        list[index] = list[index + 1];
      list.pop();
    }
    function unwrapListeners(arr) {
      var ret = new Array(arr.length);
      for (var i = 0; i < ret.length; ++i) {
        ret[i] = arr[i].listener || arr[i];
      }
      return ret;
    }
    function once(emitter, name) {
      return new Promise(function(resolve, reject) {
        function errorListener(err) {
          emitter.removeListener(name, resolver);
          reject(err);
        }
        function resolver() {
          if (typeof emitter.removeListener === "function") {
            emitter.removeListener("error", errorListener);
          }
          resolve([].slice.call(arguments));
        }
        ;
        eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
        if (name !== "error") {
          addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
        }
      });
    }
    function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
      if (typeof emitter.on === "function") {
        eventTargetAgnosticAddListener(emitter, "error", handler, flags);
      }
    }
    function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
      if (typeof emitter.on === "function") {
        if (flags.once) {
          emitter.once(name, listener);
        } else {
          emitter.on(name, listener);
        }
      } else if (typeof emitter.addEventListener === "function") {
        emitter.addEventListener(name, function wrapListener(arg) {
          if (flags.once) {
            emitter.removeEventListener(name, wrapListener);
          }
          listener(arg);
        });
      } else {
        throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
      }
    }
  }
});

// node_modules/twilio-video/es5/eventtarget.js
var require_eventtarget = __commonJS({
  "node_modules/twilio-video/es5/eventtarget.js"(exports, module) {
    "use strict";
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var EventEmitter = require_events().EventEmitter;
    var EventTarget = (
      /** @class */
      function() {
        function EventTarget2() {
          Object.defineProperties(this, {
            _eventEmitter: {
              value: new EventEmitter()
            }
          });
        }
        EventTarget2.prototype.dispatchEvent = function(event) {
          return this._eventEmitter.emit(event.type, event);
        };
        EventTarget2.prototype.addEventListener = function() {
          var _a;
          return (_a = this._eventEmitter).addListener.apply(_a, __spreadArray([], __read(arguments)));
        };
        EventTarget2.prototype.removeEventListener = function() {
          var _a;
          return (_a = this._eventEmitter).removeListener.apply(_a, __spreadArray([], __read(arguments)));
        };
        return EventTarget2;
      }()
    );
    module.exports = EventTarget;
  }
});

// node_modules/twilio-video/es5/webrtc/util/latch.js
var require_latch = __commonJS({
  "node_modules/twilio-video/es5/webrtc/util/latch.js"(exports, module) {
    "use strict";
    var defer = require_util().defer;
    var states = {
      high: /* @__PURE__ */ new Set(["low"]),
      low: /* @__PURE__ */ new Set(["high"])
    };
    var Latch = (
      /** @class */
      function() {
        function Latch2(initialState) {
          if (initialState === void 0) {
            initialState = "low";
          }
          var state = initialState;
          Object.defineProperties(this, {
            _state: {
              set: function(_state) {
                var _this = this;
                if (state !== _state) {
                  state = _state;
                  var whenDeferreds = this._whenDeferreds.get(state);
                  whenDeferreds.forEach(function(deferred) {
                    return deferred.resolve(_this);
                  });
                  whenDeferreds.clear();
                }
              },
              get: function() {
                return state;
              }
            },
            _whenDeferreds: {
              value: /* @__PURE__ */ new Map([
                ["high", /* @__PURE__ */ new Set()],
                ["low", /* @__PURE__ */ new Set()]
              ])
            }
          });
        }
        Object.defineProperty(Latch2.prototype, "state", {
          get: function() {
            return this._state;
          },
          enumerable: false,
          configurable: true
        });
        Latch2.prototype.lower = function() {
          return this.transition("low");
        };
        Latch2.prototype.raise = function() {
          return this.transition("high");
        };
        Latch2.prototype.transition = function(newState) {
          if (!states[this.state].has(newState)) {
            throw createUnreachableStateError(this.state, newState);
          }
          this._state = newState;
          return this;
        };
        Latch2.prototype.when = function(state) {
          if (this.state === state) {
            return Promise.resolve(this);
          }
          if (!states[this.state].has(state)) {
            return Promise.reject(createUnreachableStateError(this.state, state));
          }
          var deferred = defer();
          this._whenDeferreds.get(state).add(deferred);
          return deferred.promise;
        };
        return Latch2;
      }()
    );
    function createUnreachableStateError(from, to) {
      return new Error('Cannot transition from "' + from + '" to "' + to + '"');
    }
    module.exports = Latch;
  }
});

// node_modules/twilio-video/es5/webrtc/rtcrtpsender.js
var require_rtcrtpsender = __commonJS({
  "node_modules/twilio-video/es5/webrtc/rtcrtpsender.js"(exports, module) {
    "use strict";
    var RTCRtpSenderShim = (
      /** @class */
      /* @__PURE__ */ function() {
        function RTCRtpSenderShim2(track) {
          Object.defineProperties(this, {
            track: {
              enumerable: true,
              value: track,
              writable: true
            }
          });
        }
        return RTCRtpSenderShim2;
      }()
    );
    module.exports = RTCRtpSenderShim;
  }
});

// node_modules/twilio-video/es5/webrtc/rtcpeerconnection/chrome.js
var require_chrome2 = __commonJS({
  "node_modules/twilio-video/es5/webrtc/rtcpeerconnection/chrome.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var ChromeRTCSessionDescription = require_chrome();
    var EventTarget = require_eventtarget();
    var Latch = require_latch();
    var MediaStream2 = require_mediastream();
    var RTCRtpSenderShim = require_rtcrtpsender();
    var _a = require_sdp();
    var getSdpFormat = _a.getSdpFormat;
    var updatePlanBTrackIdsToSSRCs = _a.updatePlanBTrackIdsToSSRCs;
    var updateUnifiedPlanTrackIdsToSSRCs = _a.updateUnifiedPlanTrackIdsToSSRCs;
    var _b = require_util();
    var delegateMethods = _b.delegateMethods;
    var interceptEvent = _b.interceptEvent;
    var isIOSChrome = _b.isIOSChrome;
    var legacyPromise = _b.legacyPromise;
    var proxyProperties = _b.proxyProperties;
    var isUnifiedPlan = getSdpFormat() === "unified";
    var ChromeRTCPeerConnection = (
      /** @class */
      function(_super) {
        __extends(ChromeRTCPeerConnection2, _super);
        function ChromeRTCPeerConnection2(configuration, constraints) {
          if (configuration === void 0) {
            configuration = {};
          }
          var _this = _super.call(this) || this;
          var newConfiguration = Object.assign(configuration.iceTransportPolicy ? { iceTransports: configuration.iceTransportPolicy } : {}, configuration);
          interceptEvent(_this, "datachannel");
          interceptEvent(_this, "signalingstatechange");
          var sdpFormat = getSdpFormat(newConfiguration.sdpSemantics);
          var peerConnection = new RTCPeerConnection(newConfiguration, constraints);
          Object.defineProperties(_this, {
            _appliedTracksToSSRCs: {
              value: /* @__PURE__ */ new Map(),
              writable: true
            },
            _localStream: {
              value: new MediaStream2()
            },
            _peerConnection: {
              value: peerConnection
            },
            _pendingLocalOffer: {
              value: null,
              writable: true
            },
            _pendingRemoteOffer: {
              value: null,
              writable: true
            },
            _rolledBackTracksToSSRCs: {
              value: /* @__PURE__ */ new Map(),
              writable: true
            },
            _sdpFormat: {
              value: sdpFormat
            },
            _senders: {
              value: /* @__PURE__ */ new Map()
            },
            _signalingStateLatch: {
              value: new Latch()
            },
            _tracksToSSRCs: {
              value: /* @__PURE__ */ new Map(),
              writable: true
            }
          });
          peerConnection.addEventListener("datachannel", function(event) {
            shimDataChannel(event.channel);
            _this.dispatchEvent(event);
          });
          peerConnection.addEventListener("signalingstatechange", function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            if (peerConnection.signalingState === "stable") {
              _this._appliedTracksToSSRCs = new Map(_this._tracksToSSRCs);
            }
            if (!_this._pendingLocalOffer && !_this._pendingRemoteOffer) {
              _this.dispatchEvent.apply(_this, __spreadArray([], __read(args)));
            }
          });
          peerConnection.ontrack = function() {
          };
          if (typeof peerConnection.addTrack !== "function") {
            peerConnection.addStream(_this._localStream);
          }
          proxyProperties(RTCPeerConnection.prototype, _this, peerConnection);
          return _this;
        }
        Object.defineProperty(ChromeRTCPeerConnection2.prototype, "localDescription", {
          get: function() {
            return this._pendingLocalOffer ? this._pendingLocalOffer : this._peerConnection.localDescription;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(ChromeRTCPeerConnection2.prototype, "remoteDescription", {
          get: function() {
            return this._pendingRemoteOffer ? this._pendingRemoteOffer : this._peerConnection.remoteDescription;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(ChromeRTCPeerConnection2.prototype, "signalingState", {
          get: function() {
            if (this._pendingLocalOffer) {
              return "have-local-offer";
            } else if (this._pendingRemoteOffer) {
              return "have-remote-offer";
            }
            return this._peerConnection.signalingState;
          },
          enumerable: false,
          configurable: true
        });
        ChromeRTCPeerConnection2.prototype.addTrack = function(track) {
          var _a2;
          var rest = [];
          for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
          }
          if (typeof this._peerConnection.addTrack === "function") {
            return (_a2 = this._peerConnection).addTrack.apply(_a2, __spreadArray([track], __read(rest)));
          }
          if (this._peerConnection.signalingState === "closed") {
            throw new Error("Cannot add MediaStreamTrack [" + track.id + ", \n        " + track.kind + "]: RTCPeerConnection is closed");
          }
          var sender = this._senders.get(track);
          if (sender && sender.track) {
            throw new Error("Cannot add MediaStreamTrack ['" + track.id + ", \n        " + track.kind + "]: RTCPeerConnection already has it");
          }
          this._peerConnection.removeStream(this._localStream);
          this._localStream.addTrack(track);
          this._peerConnection.addStream(this._localStream);
          sender = new RTCRtpSenderShim(track);
          this._senders.set(track, sender);
          return sender;
        };
        ChromeRTCPeerConnection2.prototype.removeTrack = function(sender) {
          if (this._peerConnection.signalingState === "closed") {
            throw new Error("Cannot remove MediaStreamTrack: RTCPeerConnection is closed");
          }
          if (typeof this._peerConnection.addTrack === "function") {
            try {
              return this._peerConnection.removeTrack(sender);
            } catch (e) {
            }
          } else {
            var track = sender.track;
            if (!track) {
              return;
            }
            sender = this._senders.get(track);
            if (sender && sender.track) {
              sender.track = null;
              this._peerConnection.removeStream(this._localStream);
              this._localStream.removeTrack(track);
              this._peerConnection.addStream(this._localStream);
            }
          }
        };
        ChromeRTCPeerConnection2.prototype.getSenders = function() {
          if (typeof this._peerConnection.addTrack === "function") {
            return this._peerConnection.getSenders();
          }
          return Array.from(this._senders.values());
        };
        ChromeRTCPeerConnection2.prototype.addIceCandidate = function(candidate) {
          var _this = this;
          var rest = [];
          for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
          }
          var promise;
          if (this.signalingState === "have-remote-offer") {
            promise = this._signalingStateLatch.when("low").then(function() {
              return _this._peerConnection.addIceCandidate(candidate);
            });
          } else {
            promise = this._peerConnection.addIceCandidate(candidate);
          }
          return rest.length > 0 ? legacyPromise.apply(void 0, __spreadArray([promise], __read(rest))) : promise;
        };
        ChromeRTCPeerConnection2.prototype.close = function() {
          if (this.signalingState !== "closed") {
            this._pendingLocalOffer = null;
            this._pendingRemoteOffer = null;
            this._peerConnection.close();
          }
        };
        ChromeRTCPeerConnection2.prototype.createAnswer = function() {
          var _this = this;
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          var promise;
          if (this._pendingRemoteOffer) {
            promise = this._peerConnection.setRemoteDescription(this._pendingRemoteOffer).then(function() {
              _this._signalingStateLatch.lower();
              return _this._peerConnection.createAnswer();
            }).then(function(answer) {
              _this._pendingRemoteOffer = null;
              _this._rolledBackTracksToSSRCs.clear();
              return new ChromeRTCSessionDescription({
                type: "answer",
                sdp: updateTrackIdsToSSRCs(_this._sdpFormat, _this._tracksToSSRCs, answer.sdp)
              });
            }, function(error) {
              _this._pendingRemoteOffer = null;
              throw error;
            });
          } else {
            promise = this._peerConnection.createAnswer().then(function(answer) {
              _this._rolledBackTracksToSSRCs.clear();
              return new ChromeRTCSessionDescription({
                type: "answer",
                sdp: updateTrackIdsToSSRCs(_this._sdpFormat, _this._tracksToSSRCs, answer.sdp)
              });
            });
          }
          return args.length > 1 ? legacyPromise.apply(void 0, __spreadArray([promise], __read(args))) : promise;
        };
        ChromeRTCPeerConnection2.prototype.createOffer = function() {
          var _this = this;
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          var _a2 = __read(args, 3), arg1 = _a2[0], arg2 = _a2[1], arg3 = _a2[2];
          var options = arg3 || arg1 || {};
          if (isIOSChrome()) {
            if (options.offerToReceiveVideo && !this._audioTransceiver && !(isUnifiedPlan && hasReceiversForTracksOfKind(this, "audio"))) {
              delete options.offerToReceiveAudio;
              try {
                this._audioTransceiver = isUnifiedPlan ? this.addTransceiver("audio", { direction: "recvonly" }) : this.addTransceiver("audio");
              } catch (e) {
                return Promise.reject(e);
              }
            }
            if (options.offerToReceiveVideo && !this._videoTransceiver && !(isUnifiedPlan && hasReceiversForTracksOfKind(this, "video"))) {
              delete options.offerToReceiveVideo;
              try {
                this._videoTransceiver = isUnifiedPlan ? this.addTransceiver("video", { direction: "recvonly" }) : this.addTransceiver("video");
              } catch (e) {
                return Promise.reject(e);
              }
            }
          }
          var promise = this._peerConnection.createOffer(options).then(function(offer) {
            _this._rolledBackTracksToSSRCs.clear();
            return new ChromeRTCSessionDescription({
              type: offer.type,
              sdp: updateTrackIdsToSSRCs(_this._sdpFormat, _this._tracksToSSRCs, offer.sdp)
            });
          });
          return args.length > 1 ? legacyPromise(promise, arg1, arg2) : promise;
        };
        ChromeRTCPeerConnection2.prototype.createDataChannel = function(label, dataChannelDict) {
          dataChannelDict = shimDataChannelInit(dataChannelDict);
          var dataChannel = this._peerConnection.createDataChannel(label, dataChannelDict);
          shimDataChannel(dataChannel);
          return dataChannel;
        };
        ChromeRTCPeerConnection2.prototype.setLocalDescription = function() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          var _a2 = __read(args, 3), description = _a2[0], arg1 = _a2[1], arg2 = _a2[2];
          if (this._rolledBackTracksToSSRCs.size > 0) {
            this._tracksToSSRCs = new Map(this._rolledBackTracksToSSRCs);
            this._rolledBackTracksToSSRCs.clear();
          }
          var promise = setDescription(this, true, description);
          return args.length > 1 ? legacyPromise(promise, arg1, arg2) : promise;
        };
        ChromeRTCPeerConnection2.prototype.setRemoteDescription = function() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          var _a2 = __read(args, 3), description = _a2[0], arg1 = _a2[1], arg2 = _a2[2];
          this._rolledBackTracksToSSRCs.clear();
          var promise = setDescription(this, false, description);
          return args.length > 1 ? legacyPromise(promise, arg1, arg2) : promise;
        };
        return ChromeRTCPeerConnection2;
      }(EventTarget)
    );
    delegateMethods(RTCPeerConnection.prototype, ChromeRTCPeerConnection.prototype, "_peerConnection");
    function setDescription(peerConnection, local, description) {
      function setPendingLocalOffer(offer) {
        if (local) {
          peerConnection._pendingLocalOffer = offer;
        } else {
          peerConnection._pendingRemoteOffer = offer;
        }
      }
      function clearPendingLocalOffer() {
        if (local) {
          peerConnection._pendingLocalOffer = null;
        } else {
          peerConnection._pendingRemoteOffer = null;
        }
      }
      var pendingLocalOffer = local ? peerConnection._pendingLocalOffer : peerConnection._pendingRemoteOffer;
      var pendingRemoteOffer = local ? peerConnection._pendingRemoteOffer : peerConnection._pendingLocalOffer;
      var intermediateState = local ? "have-local-offer" : "have-remote-offer";
      var setLocalDescription = local ? "setLocalDescription" : "setRemoteDescription";
      var promise;
      if (!local && pendingRemoteOffer && description.type === "answer") {
        promise = setRemoteAnswer(peerConnection, description);
      } else if (description.type === "offer") {
        if (peerConnection.signalingState !== intermediateState && peerConnection.signalingState !== "stable") {
          return Promise.reject(new Error("Cannot set " + (local ? "local" : "remote") + " offer in state " + peerConnection.signalingState));
        }
        if (!pendingLocalOffer && peerConnection._signalingStateLatch.state === "low") {
          peerConnection._signalingStateLatch.raise();
        }
        var previousSignalingState = peerConnection.signalingState;
        setPendingLocalOffer(unwrap(description));
        promise = Promise.resolve();
        if (peerConnection.signalingState !== previousSignalingState) {
          promise.then(function() {
            return peerConnection.dispatchEvent(new Event("signalingstatechange"));
          });
        }
      } else if (description.type === "rollback") {
        if (peerConnection.signalingState !== intermediateState) {
          promise = Promise.reject(new Error("Cannot rollback " + (local ? "local" : "remote") + " description in " + peerConnection.signalingState));
        } else {
          clearPendingLocalOffer();
          peerConnection._rolledBackTracksToSSRCs = new Map(peerConnection._tracksToSSRCs);
          peerConnection._tracksToSSRCs = new Map(peerConnection._appliedTracksToSSRCs);
          promise = Promise.resolve();
          promise.then(function() {
            return peerConnection.dispatchEvent(new Event("signalingstatechange"));
          });
        }
      }
      return promise || peerConnection._peerConnection[setLocalDescription](unwrap(description));
    }
    function setRemoteAnswer(peerConnection, answer) {
      var pendingLocalOffer = peerConnection._pendingLocalOffer;
      return peerConnection._peerConnection.setLocalDescription(pendingLocalOffer).then(function() {
        peerConnection._pendingLocalOffer = null;
        return peerConnection.setRemoteDescription(answer);
      }).then(function() {
        peerConnection._signalingStateLatch.lower();
      });
    }
    function hasReceiversForTracksOfKind(peerConnection, kind) {
      return !!peerConnection.getTransceivers().find(function(_a2) {
        var _b2 = _a2.receiver, receiver = _b2 === void 0 ? {} : _b2;
        var _c = receiver.track, track = _c === void 0 ? {} : _c;
        return track.kind === kind;
      });
    }
    function unwrap(description) {
      if (description instanceof ChromeRTCSessionDescription) {
        if (description._description) {
          return description._description;
        }
      }
      return new RTCSessionDescription(description);
    }
    function needsMaxPacketLifeTimeShim() {
      return "maxRetransmitTime" in RTCDataChannel.prototype && !("maxPacketLifeTime" in RTCDataChannel.prototype);
    }
    function shimDataChannelInit(dataChannelDict) {
      dataChannelDict = Object.assign({}, dataChannelDict);
      if (needsMaxPacketLifeTimeShim() && "maxPacketLifeTime" in dataChannelDict) {
        dataChannelDict.maxRetransmitTime = dataChannelDict.maxPacketLifeTime;
      }
      return dataChannelDict;
    }
    function shimDataChannel(dataChannel) {
      Object.defineProperty(dataChannel, "maxRetransmits", {
        value: dataChannel.maxRetransmits === 65535 ? null : dataChannel.maxRetransmits
      });
      if (needsMaxPacketLifeTimeShim()) {
        Object.defineProperty(dataChannel, "maxPacketLifeTime", {
          value: dataChannel.maxRetransmitTime === 65535 ? null : dataChannel.maxRetransmitTime
        });
      }
      return dataChannel;
    }
    function updateTrackIdsToSSRCs(sdpFormat, tracksToSSRCs, sdp) {
      return sdpFormat === "unified" ? updateUnifiedPlanTrackIdsToSSRCs(tracksToSSRCs, sdp) : updatePlanBTrackIdsToSSRCs(tracksToSSRCs, sdp);
    }
    module.exports = ChromeRTCPeerConnection;
  }
});

// node_modules/twilio-video/es5/webrtc/rtcsessiondescription/firefox.js
var require_firefox = __commonJS({
  "node_modules/twilio-video/es5/webrtc/rtcsessiondescription/firefox.js"(exports, module) {
    "use strict";
    module.exports = RTCSessionDescription;
  }
});

// node_modules/twilio-video/es5/webrtc/rtcpeerconnection/firefox.js
var require_firefox2 = __commonJS({
  "node_modules/twilio-video/es5/webrtc/rtcpeerconnection/firefox.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var EventTarget = require_eventtarget();
    var FirefoxRTCSessionDescription = require_firefox();
    var updateTracksToSSRCs = require_sdp().updateUnifiedPlanTrackIdsToSSRCs;
    var _a = require_util();
    var delegateMethods = _a.delegateMethods;
    var interceptEvent = _a.interceptEvent;
    var legacyPromise = _a.legacyPromise;
    var proxyProperties = _a.proxyProperties;
    var FirefoxRTCPeerConnection = (
      /** @class */
      function(_super) {
        __extends(FirefoxRTCPeerConnection2, _super);
        function FirefoxRTCPeerConnection2(configuration) {
          var _this = _super.call(this) || this;
          interceptEvent(_this, "signalingstatechange");
          var peerConnection = new RTCPeerConnection(configuration);
          Object.defineProperties(_this, {
            _initiallyNegotiatedDtlsRole: {
              value: null,
              writable: true
            },
            _isClosed: {
              value: false,
              writable: true
            },
            _peerConnection: {
              value: peerConnection
            },
            _rollingBack: {
              value: false,
              writable: true
            },
            _tracksToSSRCs: {
              value: /* @__PURE__ */ new Map()
            },
            // NOTE(mmalavalli): Firefox throws a TypeError when the PeerConnection's
            // prototype's "peerIdentity" property is accessed. In order to overcome
            // this, we ignore this property while delegating methods.
            // Reference: https://bugzilla.mozilla.org/show_bug.cgi?id=1363815
            peerIdentity: {
              enumerable: true,
              value: Promise.resolve({
                idp: "",
                name: ""
              })
            }
          });
          var previousSignalingState;
          peerConnection.addEventListener("signalingstatechange", function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            if (!_this._rollingBack && _this.signalingState !== previousSignalingState) {
              previousSignalingState = _this.signalingState;
              if (_this._isClosed) {
                setTimeout(function() {
                  return _this.dispatchEvent.apply(_this, __spreadArray([], __read(args)));
                });
              } else {
                _this.dispatchEvent.apply(_this, __spreadArray([], __read(args)));
              }
            }
          });
          proxyProperties(RTCPeerConnection.prototype, _this, peerConnection);
          return _this;
        }
        Object.defineProperty(FirefoxRTCPeerConnection2.prototype, "iceGatheringState", {
          get: function() {
            return this._isClosed ? "complete" : this._peerConnection.iceGatheringState;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(FirefoxRTCPeerConnection2.prototype, "localDescription", {
          get: function() {
            return overwriteWithInitiallyNegotiatedDtlsRole(this._peerConnection.localDescription, this._initiallyNegotiatedDtlsRole);
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(FirefoxRTCPeerConnection2.prototype, "signalingState", {
          get: function() {
            return this._isClosed ? "closed" : this._peerConnection.signalingState;
          },
          enumerable: false,
          configurable: true
        });
        FirefoxRTCPeerConnection2.prototype.createAnswer = function() {
          var _this = this;
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          var promise;
          promise = this._peerConnection.createAnswer().then(function(answer) {
            saveInitiallyNegotiatedDtlsRole(_this, answer);
            return overwriteWithInitiallyNegotiatedDtlsRole(answer, _this._initiallyNegotiatedDtlsRole);
          });
          return typeof args[0] === "function" ? legacyPromise.apply(void 0, __spreadArray([promise], __read(args))) : promise;
        };
        FirefoxRTCPeerConnection2.prototype.createOffer = function() {
          var _this = this;
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          var _a2 = __read(args, 3), arg1 = _a2[0], arg2 = _a2[1], arg3 = _a2[2];
          var options = arg3 || arg1 || {};
          var promise;
          if (this.signalingState === "have-local-offer" || this.signalingState === "have-remote-offer") {
            var local = this.signalingState === "have-local-offer";
            promise = rollback(this, local, function() {
              return _this.createOffer(options);
            });
          } else {
            promise = this._peerConnection.createOffer(options);
          }
          promise = promise.then(function(offer) {
            return new FirefoxRTCSessionDescription({
              type: offer.type,
              sdp: updateTracksToSSRCs(_this._tracksToSSRCs, offer.sdp)
            });
          });
          return args.length > 1 ? legacyPromise(promise, arg1, arg2) : promise;
        };
        FirefoxRTCPeerConnection2.prototype.setLocalDescription = function() {
          var _a2;
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          var _b = __read(args), description = _b[0], rest = _b.slice(1);
          var promise;
          if (description && description.type === "answer" && this.signalingState === "have-local-offer") {
            promise = Promise.reject(new Error("Cannot set local answer in state have-local-offer"));
          }
          if (promise) {
            return args.length > 1 ? legacyPromise.apply(void 0, __spreadArray([promise], __read(rest))) : promise;
          }
          return (_a2 = this._peerConnection).setLocalDescription.apply(_a2, __spreadArray([], __read(args)));
        };
        FirefoxRTCPeerConnection2.prototype.setRemoteDescription = function() {
          var _this = this;
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          var _a2 = __read(args), description = _a2[0], rest = _a2.slice(1);
          var promise;
          if (description && this.signalingState === "have-remote-offer") {
            if (description.type === "answer") {
              promise = Promise.reject(new Error("Cannot set remote answer in state have-remote-offer"));
            } else if (description.type === "offer") {
              promise = rollback(this, false, function() {
                return _this._peerConnection.setRemoteDescription(description);
              });
            }
          }
          if (!promise) {
            promise = this._peerConnection.setRemoteDescription(description);
          }
          promise = promise.then(function() {
            return saveInitiallyNegotiatedDtlsRole(_this, description, true);
          });
          return args.length > 1 ? legacyPromise.apply(void 0, __spreadArray([promise], __read(rest))) : promise;
        };
        FirefoxRTCPeerConnection2.prototype.close = function() {
          if (this.signalingState !== "closed") {
            this._isClosed = true;
            this._peerConnection.close();
          }
        };
        return FirefoxRTCPeerConnection2;
      }(EventTarget)
    );
    delegateMethods(RTCPeerConnection.prototype, FirefoxRTCPeerConnection.prototype, "_peerConnection");
    function rollback(peerConnection, local, onceRolledBack) {
      var setLocalDescription = local ? "setLocalDescription" : "setRemoteDescription";
      peerConnection._rollingBack = true;
      return peerConnection._peerConnection[setLocalDescription](new FirefoxRTCSessionDescription({
        type: "rollback"
      })).then(onceRolledBack).then(function(result) {
        peerConnection._rollingBack = false;
        return result;
      }, function(error) {
        peerConnection._rollingBack = false;
        throw error;
      });
    }
    function saveInitiallyNegotiatedDtlsRole(peerConnection, description, remote) {
      if (peerConnection._initiallyNegotiatedDtlsRole || description.type === "offer") {
        return;
      }
      var match = description.sdp.match(/a=setup:([a-z]+)/);
      if (!match) {
        return;
      }
      var dtlsRole = match[1];
      peerConnection._initiallyNegotiatedDtlsRole = remote ? {
        active: "passive",
        passive: "active"
      }[dtlsRole] : dtlsRole;
    }
    function overwriteWithInitiallyNegotiatedDtlsRole(description, dtlsRole) {
      if (description && description.type === "answer" && dtlsRole) {
        return new FirefoxRTCSessionDescription({
          type: description.type,
          sdp: description.sdp.replace(/a=setup:[a-z]+/g, "a=setup:" + dtlsRole)
        });
      }
      return description;
    }
    module.exports = FirefoxRTCPeerConnection;
  }
});

// node_modules/twilio-video/es5/webrtc/rtcpeerconnection/safari.js
var require_safari = __commonJS({
  "node_modules/twilio-video/es5/webrtc/rtcpeerconnection/safari.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var EventTarget = require_eventtarget();
    var Latch = require_latch();
    var _a = require_sdp();
    var getSdpFormat = _a.getSdpFormat;
    var updatePlanBTrackIdsToSSRCs = _a.updatePlanBTrackIdsToSSRCs;
    var updateUnifiedPlanTrackIdsToSSRCs = _a.updateUnifiedPlanTrackIdsToSSRCs;
    var _b = require_util();
    var delegateMethods = _b.delegateMethods;
    var interceptEvent = _b.interceptEvent;
    var proxyProperties = _b.proxyProperties;
    var isUnifiedPlan = getSdpFormat() === "unified";
    var updateTrackIdsToSSRCs = isUnifiedPlan ? updateUnifiedPlanTrackIdsToSSRCs : updatePlanBTrackIdsToSSRCs;
    var SafariRTCPeerConnection = (
      /** @class */
      function(_super) {
        __extends(SafariRTCPeerConnection2, _super);
        function SafariRTCPeerConnection2(configuration) {
          var _this = _super.call(this) || this;
          interceptEvent(_this, "datachannel");
          interceptEvent(_this, "iceconnectionstatechange");
          interceptEvent(_this, "signalingstatechange");
          interceptEvent(_this, "track");
          var peerConnection = new RTCPeerConnection(configuration);
          Object.defineProperties(_this, {
            _appliedTracksToSSRCs: {
              value: /* @__PURE__ */ new Map(),
              writable: true
            },
            _audioTransceiver: {
              value: null,
              writable: true
            },
            _isClosed: {
              value: false,
              writable: true
            },
            _peerConnection: {
              value: peerConnection
            },
            _pendingLocalOffer: {
              value: null,
              writable: true
            },
            _pendingRemoteOffer: {
              value: null,
              writable: true
            },
            _rolledBackTracksToSSRCs: {
              value: /* @__PURE__ */ new Map(),
              writable: true
            },
            _signalingStateLatch: {
              value: new Latch()
            },
            _tracksToSSRCs: {
              value: /* @__PURE__ */ new Map(),
              writable: true
            },
            _videoTransceiver: {
              value: null,
              writable: true
            }
          });
          peerConnection.addEventListener("datachannel", function(event) {
            shimDataChannel(event.channel);
            _this.dispatchEvent(event);
          });
          peerConnection.addEventListener("iceconnectionstatechange", function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            if (_this._isClosed) {
              return;
            }
            _this.dispatchEvent.apply(_this, __spreadArray([], __read(args)));
          });
          peerConnection.addEventListener("signalingstatechange", function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            if (_this._isClosed) {
              return;
            }
            if (peerConnection.signalingState === "stable") {
              _this._appliedTracksToSSRCs = new Map(_this._tracksToSSRCs);
            }
            if (!_this._pendingLocalOffer && !_this._pendingRemoteOffer) {
              _this.dispatchEvent.apply(_this, __spreadArray([], __read(args)));
            }
          });
          peerConnection.addEventListener("track", function(event) {
            _this._pendingRemoteOffer = null;
            _this.dispatchEvent(event);
          });
          proxyProperties(RTCPeerConnection.prototype, _this, peerConnection);
          return _this;
        }
        Object.defineProperty(SafariRTCPeerConnection2.prototype, "localDescription", {
          get: function() {
            return this._pendingLocalOffer || this._peerConnection.localDescription;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(SafariRTCPeerConnection2.prototype, "iceConnectionState", {
          get: function() {
            return this._isClosed ? "closed" : this._peerConnection.iceConnectionState;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(SafariRTCPeerConnection2.prototype, "iceGatheringState", {
          get: function() {
            return this._isClosed ? "complete" : this._peerConnection.iceGatheringState;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(SafariRTCPeerConnection2.prototype, "remoteDescription", {
          get: function() {
            return this._pendingRemoteOffer || this._peerConnection.remoteDescription;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(SafariRTCPeerConnection2.prototype, "signalingState", {
          get: function() {
            if (this._isClosed) {
              return "closed";
            } else if (this._pendingLocalOffer) {
              return "have-local-offer";
            } else if (this._pendingRemoteOffer) {
              return "have-remote-offer";
            }
            return this._peerConnection.signalingState;
          },
          enumerable: false,
          configurable: true
        });
        SafariRTCPeerConnection2.prototype.addIceCandidate = function(candidate) {
          var _this = this;
          if (this.signalingState === "have-remote-offer") {
            return this._signalingStateLatch.when("low").then(function() {
              return _this._peerConnection.addIceCandidate(candidate);
            });
          }
          return this._peerConnection.addIceCandidate(candidate);
        };
        SafariRTCPeerConnection2.prototype.createOffer = function(options) {
          var _this = this;
          options = Object.assign({}, options);
          if (options.offerToReceiveVideo && !this._audioTransceiver && !(isUnifiedPlan && hasReceiversForTracksOfKind(this, "audio"))) {
            delete options.offerToReceiveAudio;
            try {
              this._audioTransceiver = isUnifiedPlan ? this.addTransceiver("audio", { direction: "recvonly" }) : this.addTransceiver("audio");
            } catch (e) {
              return Promise.reject(e);
            }
          }
          if (options.offerToReceiveVideo && !this._videoTransceiver && !(isUnifiedPlan && hasReceiversForTracksOfKind(this, "video"))) {
            delete options.offerToReceiveVideo;
            try {
              this._videoTransceiver = isUnifiedPlan ? this.addTransceiver("video", { direction: "recvonly" }) : this.addTransceiver("video");
            } catch (e) {
              return Promise.reject(e);
            }
          }
          return this._peerConnection.createOffer(options).then(function(offer) {
            _this._rolledBackTracksToSSRCs.clear();
            return new RTCSessionDescription({
              type: offer.type,
              sdp: updateTrackIdsToSSRCs(_this._tracksToSSRCs, offer.sdp)
            });
          });
        };
        SafariRTCPeerConnection2.prototype.createAnswer = function(options) {
          var _this = this;
          if (this._pendingRemoteOffer) {
            return this._peerConnection.setRemoteDescription(this._pendingRemoteOffer).then(function() {
              _this._signalingStateLatch.lower();
              return _this._peerConnection.createAnswer();
            }).then(function(answer) {
              _this._pendingRemoteOffer = null;
              _this._rolledBackTracksToSSRCs.clear();
              return isUnifiedPlan ? new RTCSessionDescription({
                type: answer.type,
                sdp: updateTrackIdsToSSRCs(_this._tracksToSSRCs, answer.sdp)
              }) : answer;
            }, function(error) {
              _this._pendingRemoteOffer = null;
              throw error;
            });
          }
          return this._peerConnection.createAnswer(options).then(function(answer) {
            _this._rolledBackTracksToSSRCs.clear();
            return isUnifiedPlan ? new RTCSessionDescription({
              type: answer.type,
              sdp: updateTrackIdsToSSRCs(_this._tracksToSSRCs, answer.sdp)
            }) : answer;
          });
        };
        SafariRTCPeerConnection2.prototype.createDataChannel = function(label, dataChannelDict) {
          var dataChannel = this._peerConnection.createDataChannel(label, dataChannelDict);
          shimDataChannel(dataChannel);
          return dataChannel;
        };
        SafariRTCPeerConnection2.prototype.removeTrack = function(sender) {
          sender.replaceTrack(null);
          this._peerConnection.removeTrack(sender);
        };
        SafariRTCPeerConnection2.prototype.setLocalDescription = function(description) {
          if (this._rolledBackTracksToSSRCs.size > 0) {
            this._tracksToSSRCs = new Map(this._rolledBackTracksToSSRCs);
            this._rolledBackTracksToSSRCs.clear();
          }
          return setDescription(this, true, description);
        };
        SafariRTCPeerConnection2.prototype.setRemoteDescription = function(description) {
          this._rolledBackTracksToSSRCs.clear();
          return setDescription(this, false, description);
        };
        SafariRTCPeerConnection2.prototype.close = function() {
          var _this = this;
          if (this._isClosed) {
            return;
          }
          this._isClosed = true;
          this._peerConnection.close();
          setTimeout(function() {
            _this.dispatchEvent(new Event("iceconnectionstatechange"));
            _this.dispatchEvent(new Event("signalingstatechange"));
          });
        };
        return SafariRTCPeerConnection2;
      }(EventTarget)
    );
    delegateMethods(RTCPeerConnection.prototype, SafariRTCPeerConnection.prototype, "_peerConnection");
    function setDescription(peerConnection, local, description) {
      function setPendingLocalOffer(offer) {
        if (local) {
          peerConnection._pendingLocalOffer = offer;
        } else {
          peerConnection._pendingRemoteOffer = offer;
        }
      }
      function clearPendingLocalOffer() {
        if (local) {
          peerConnection._pendingLocalOffer = null;
        } else {
          peerConnection._pendingRemoteOffer = null;
        }
      }
      var pendingLocalOffer = local ? peerConnection._pendingLocalOffer : peerConnection._pendingRemoteOffer;
      var pendingRemoteOffer = local ? peerConnection._pendingRemoteOffer : peerConnection._pendingLocalOffer;
      var intermediateState = local ? "have-local-offer" : "have-remote-offer";
      var setLocalDescription = local ? "setLocalDescription" : "setRemoteDescription";
      if (!local && pendingRemoteOffer && description.type === "answer") {
        return setRemoteAnswer(peerConnection, description);
      } else if (description.type === "offer") {
        if (peerConnection.signalingState !== intermediateState && peerConnection.signalingState !== "stable") {
          return Promise.reject(new Error("Cannot set " + (local ? "local" : "remote") + "\n        offer in state " + peerConnection.signalingState));
        }
        if (!pendingLocalOffer && peerConnection._signalingStateLatch.state === "low") {
          peerConnection._signalingStateLatch.raise();
        }
        var previousSignalingState = peerConnection.signalingState;
        setPendingLocalOffer(description);
        if (peerConnection.signalingState !== previousSignalingState) {
          return Promise.resolve().then(function() {
            return peerConnection.dispatchEvent(new Event("signalingstatechange"));
          });
        }
        return Promise.resolve();
      } else if (description.type === "rollback") {
        if (peerConnection.signalingState !== intermediateState) {
          return Promise.reject(new Error("Cannot rollback \n        " + (local ? "local" : "remote") + " description in " + peerConnection.signalingState));
        }
        clearPendingLocalOffer();
        peerConnection._rolledBackTracksToSSRCs = new Map(peerConnection._tracksToSSRCs);
        peerConnection._tracksToSSRCs = new Map(peerConnection._appliedTracksToSSRCs);
        return Promise.resolve().then(function() {
          return peerConnection.dispatchEvent(new Event("signalingstatechange"));
        });
      }
      return peerConnection._peerConnection[setLocalDescription](description);
    }
    function setRemoteAnswer(peerConnection, answer) {
      var pendingLocalOffer = peerConnection._pendingLocalOffer;
      return peerConnection._peerConnection.setLocalDescription(pendingLocalOffer).then(function() {
        peerConnection._pendingLocalOffer = null;
        return peerConnection.setRemoteDescription(answer);
      }).then(function() {
        return peerConnection._signalingStateLatch.lower();
      });
    }
    function hasReceiversForTracksOfKind(peerConnection, kind) {
      return !!peerConnection.getTransceivers().find(function(_a2) {
        var _b2 = _a2.receiver, receiver = _b2 === void 0 ? {} : _b2;
        var _c = receiver.track, track = _c === void 0 ? {} : _c;
        return track.kind === kind;
      });
    }
    function shimDataChannel(dataChannel) {
      return Object.defineProperties(dataChannel, {
        maxPacketLifeTime: {
          value: dataChannel.maxPacketLifeTime === 65535 ? null : dataChannel.maxPacketLifeTime
        },
        maxRetransmits: {
          value: dataChannel.maxRetransmits === 65535 ? null : dataChannel.maxRetransmits
        }
      });
    }
    module.exports = SafariRTCPeerConnection;
  }
});

// node_modules/twilio-video/es5/webrtc/rtcpeerconnection/index.js
var require_rtcpeerconnection = __commonJS({
  "node_modules/twilio-video/es5/webrtc/rtcpeerconnection/index.js"(exports, module) {
    "use strict";
    if (typeof RTCPeerConnection === "function") {
      guessBrowser = require_util().guessBrowser;
      switch (guessBrowser()) {
        case "chrome":
          module.exports = require_chrome2();
          break;
        case "firefox":
          module.exports = require_firefox2();
          break;
        case "safari":
          module.exports = require_safari();
          break;
        default:
          module.exports = RTCPeerConnection;
          break;
      }
    } else {
      module.exports = function RTCPeerConnection2() {
        throw new Error("RTCPeerConnection is not supported");
      };
    }
    var guessBrowser;
  }
});

// node_modules/twilio-video/es5/webrtc/rtcsessiondescription/index.js
var require_rtcsessiondescription = __commonJS({
  "node_modules/twilio-video/es5/webrtc/rtcsessiondescription/index.js"(exports, module) {
    "use strict";
    if (typeof RTCSessionDescription === "function") {
      guessBrowser = require_util().guessBrowser;
      switch (guessBrowser()) {
        case "chrome":
          module.exports = require_chrome();
          break;
        case "firefox":
          module.exports = require_firefox();
          break;
        default:
          module.exports = RTCSessionDescription;
          break;
      }
    } else {
      module.exports = function RTCSessionDescription2() {
        throw new Error("RTCSessionDescription is not supported");
      };
    }
    var guessBrowser;
  }
});

// node_modules/twilio-video/es5/webrtc/index.js
var require_webrtc = __commonJS({
  "node_modules/twilio-video/es5/webrtc/index.js"(exports, module) {
    "use strict";
    var WebRTC = {};
    Object.defineProperties(WebRTC, {
      getStats: {
        enumerable: true,
        value: require_getstats()
      },
      getUserMedia: {
        enumerable: true,
        value: require_getusermedia()
      },
      MediaStream: {
        enumerable: true,
        value: require_mediastream()
      },
      MediaStreamTrack: {
        enumerable: true,
        value: require_mediastreamtrack()
      },
      RTCIceCandidate: {
        enumerable: true,
        value: require_rtcicecandidate()
      },
      RTCPeerConnection: {
        enumerable: true,
        value: require_rtcpeerconnection()
      },
      RTCSessionDescription: {
        enumerable: true,
        value: require_rtcsessiondescription()
      }
    });
    module.exports = WebRTC;
  }
});

// node_modules/twilio-video/es5/vendor/inherits.js
var require_inherits = __commonJS({
  "node_modules/twilio-video/es5/vendor/inherits.js"(exports, module) {
    module.exports = function inherits(ctor, superCtor) {
      if (ctor && superCtor) {
        ctor.super_ = superCtor;
        if (typeof Object.create === "function") {
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        } else {
          var TempCtor = (
            /** @class */
            /* @__PURE__ */ function() {
              function TempCtor2() {
              }
              return TempCtor2;
            }()
          );
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      }
    };
  }
});

// node_modules/twilio-video/es5/util/browserdetection.js
var require_browserdetection = __commonJS({
  "node_modules/twilio-video/es5/util/browserdetection.js"(exports, module) {
    "use strict";
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    function isAndroid() {
      return /Android/.test(navigator.userAgent);
    }
    function hasTouchScreen() {
      return !!(navigator && navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    }
    function isIpad() {
      return hasTouchScreen() && window.screen.width >= 744 && (/Macintosh/i.test(navigator.userAgent) || /iPad/.test(navigator.userAgent) || /iPad/.test(navigator.platform));
    }
    function isIphone() {
      return hasTouchScreen() && window.screen.width <= 476 && (/Macintosh/i.test(navigator.userAgent) || /iPhone/.test(navigator.userAgent) || /iPhone/.test(navigator.platform));
    }
    function isIOS() {
      return isIpad() || isIphone();
    }
    function isMobile() {
      return /Mobi/.test(navigator.userAgent);
    }
    function isNonChromiumEdge(browser) {
      return browser === "chrome" && /Edge/.test(navigator.userAgent) && (typeof chrome === "undefined" || typeof chrome.runtime === "undefined");
    }
    function rebrandedChromeBrowser(browser) {
      if (browser !== "chrome") {
        return null;
      }
      if ("brave" in navigator) {
        return "brave";
      }
      var parenthesizedSubstrings = getParenthesizedSubstrings(navigator.userAgent);
      var nameAndVersions = parenthesizedSubstrings.reduce(function(userAgent, substring) {
        return userAgent.replace(substring, "");
      }, navigator.userAgent);
      var matches = nameAndVersions.match(/[^\s]+/g) || [];
      var _a = __read(matches.map(function(nameAndVersion) {
        return nameAndVersion.split("/")[0].toLowerCase();
      })), browserNames = _a.slice(2);
      return browserNames.find(function(name) {
        return !["chrome", "mobile", "safari"].includes(name);
      }) || null;
    }
    function mobileWebKitBrowser(browser) {
      if (browser !== "safari") {
        return null;
      }
      if ("brave" in navigator) {
        return "brave";
      }
      return ["edge", "edg"].find(function(name) {
        return navigator.userAgent.toLowerCase().includes(name);
      }) || null;
    }
    function getParenthesizedSubstrings(string) {
      var openParenthesisPositions = [];
      var substrings = [];
      for (var i = 0; i < string.length; i++) {
        if (string[i] === "(") {
          openParenthesisPositions.push(i);
        } else if (string[i] === ")" && openParenthesisPositions.length > 0) {
          var openParenthesisPosition = openParenthesisPositions.pop();
          if (openParenthesisPositions.length === 0) {
            substrings.push(string.substring(openParenthesisPosition, i + 1));
          }
        }
      }
      return substrings;
    }
    module.exports = {
      isAndroid,
      isIOS,
      isIpad,
      isIphone,
      isMobile,
      isNonChromiumEdge,
      mobileWebKitBrowser,
      rebrandedChromeBrowser
    };
  }
});

// node_modules/twilio-video/es5/webaudio/detectsilence.js
var require_detectsilence = __commonJS({
  "node_modules/twilio-video/es5/webaudio/detectsilence.js"(exports, module) {
    "use strict";
    function delay(timeout) {
      timeout = typeof timeout === "number" ? timeout : 0;
      return new Promise(function(resolve) {
        return setTimeout(resolve, timeout);
      });
    }
    function detectSilence(audioContext, stream, timeout) {
      timeout = typeof timeout === "number" ? timeout : 250;
      var source = audioContext.createMediaStreamSource(stream);
      var analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      var samples = new Uint8Array(analyser.fftSize);
      var timeoutDidFire = false;
      setTimeout(function() {
        timeoutDidFire = true;
      }, timeout);
      function doDetectSilence() {
        if (timeoutDidFire) {
          return Promise.resolve(true);
        }
        analyser.getByteTimeDomainData(samples);
        return samples.some(function(sample) {
          return sample !== 128 && sample !== 0;
        }) ? Promise.resolve(false) : delay().then(doDetectSilence);
      }
      return doDetectSilence().then(function(isSilent) {
        source.disconnect();
        return isSilent;
      }, function(error) {
        source.disconnect();
        throw error;
      });
    }
    module.exports = detectSilence;
  }
});

// node_modules/twilio-video/es5/webaudio/audiocontext.js
var require_audiocontext = __commonJS({
  "node_modules/twilio-video/es5/webaudio/audiocontext.js"(exports, module) {
    "use strict";
    var NativeAudioContext = typeof AudioContext !== "undefined" ? AudioContext : typeof webkitAudioContext !== "undefined" ? webkitAudioContext : null;
    var AudioContextFactory = (
      /** @class */
      function() {
        function AudioContextFactory2(options) {
          options = Object.assign({
            AudioContext: NativeAudioContext
          }, options);
          Object.defineProperties(this, {
            _AudioContext: {
              value: options.AudioContext
            },
            _audioContext: {
              value: null,
              writable: true
            },
            _holders: {
              value: /* @__PURE__ */ new Set()
            },
            AudioContextFactory: {
              enumerable: true,
              value: AudioContextFactory2
            }
          });
        }
        AudioContextFactory2.prototype.getOrCreate = function(holder) {
          if (!this._holders.has(holder)) {
            this._holders.add(holder);
            if (this._AudioContext && !this._audioContext) {
              try {
                this._audioContext = new this._AudioContext();
              } catch (error) {
              }
            }
          }
          return this._audioContext;
        };
        AudioContextFactory2.prototype.release = function(holder) {
          if (this._holders.has(holder)) {
            this._holders.delete(holder);
            if (!this._holders.size && this._audioContext) {
              this._audioContext.close();
              this._audioContext = null;
            }
          }
        };
        return AudioContextFactory2;
      }()
    );
    module.exports = new AudioContextFactory();
  }
});

// node_modules/twilio-video/es5/util/detectsilentaudio.js
var require_detectsilentaudio = __commonJS({
  "node_modules/twilio-video/es5/util/detectsilentaudio.js"(exports, module) {
    "use strict";
    var detectSilence = require_detectsilence();
    var N_ATTEMPTS = 3;
    var ATTEMPT_DURATION_MS = 250;
    function detectSilentAudio(el) {
      var AudioContextFactory = require_audiocontext();
      var holder = {};
      var audioContext = AudioContextFactory.getOrCreate(holder);
      var attemptsLeft = N_ATTEMPTS;
      function doCheckSilence() {
        attemptsLeft--;
        return detectSilence(audioContext, el.srcObject, ATTEMPT_DURATION_MS).then(function(isSilent) {
          if (!isSilent) {
            return false;
          }
          if (attemptsLeft > 0) {
            return doCheckSilence();
          }
          return true;
        }).catch(function() {
          return true;
        });
      }
      return doCheckSilence().finally(function() {
        AudioContextFactory.release(holder);
      });
    }
    module.exports = detectSilentAudio;
  }
});

// node_modules/twilio-video/es5/util/localmediarestartdeferreds.js
var require_localmediarestartdeferreds = __commonJS({
  "node_modules/twilio-video/es5/util/localmediarestartdeferreds.js"(exports, module) {
    "use strict";
    var defer = require_util2().defer;
    var LocalMediaRestartDeferreds = (
      /** @class */
      function() {
        function LocalMediaRestartDeferreds2() {
          Object.defineProperties(this, {
            _audio: {
              value: defer(),
              writable: true
            },
            _video: {
              value: defer(),
              writable: true
            }
          });
          this._audio.resolve();
          this._video.resolve();
        }
        LocalMediaRestartDeferreds2.prototype.resolveDeferred = function(kind) {
          if (kind === "audio") {
            this._audio.resolve();
          } else {
            this._video.resolve();
          }
        };
        LocalMediaRestartDeferreds2.prototype.startDeferred = function(kind) {
          if (kind === "audio") {
            this._audio = defer();
          } else {
            this._video = defer();
          }
        };
        LocalMediaRestartDeferreds2.prototype.whenResolved = function(kind) {
          return kind === "audio" ? this._audio.promise : this._video.promise;
        };
        return LocalMediaRestartDeferreds2;
      }()
    );
    module.exports = new LocalMediaRestartDeferreds();
  }
});

// node_modules/twilio-video/es5/eventemitter.js
var require_eventemitter = __commonJS({
  "node_modules/twilio-video/es5/eventemitter.js"(exports, module) {
    "use strict";
    var EventEmitter = require_events().EventEmitter;
    var hidePrivateAndCertainPublicPropertiesInClass = require_util2().hidePrivateAndCertainPublicPropertiesInClass;
    module.exports = hidePrivateAndCertainPublicPropertiesInClass(EventEmitter, ["domain"]);
  }
});

// node_modules/twilio-video/es5/media/track/index.js
var require_track = __commonJS({
  "node_modules/twilio-video/es5/media/track/index.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var EventEmitter = require_eventemitter();
    var _a = require_util2();
    var buildLogLevels = _a.buildLogLevels;
    var valueToJSON = _a.valueToJSON;
    var DEFAULT_LOG_LEVEL = require_constants().DEFAULT_LOG_LEVEL;
    var Log = require_log();
    var nInstances = 0;
    var Track = (
      /** @class */
      function(_super) {
        __extends(Track2, _super);
        function Track2(id, kind, options) {
          var _this = this;
          options = Object.assign({
            name: id,
            log: null,
            logLevel: DEFAULT_LOG_LEVEL
          }, options);
          _this = _super.call(this) || this;
          var name = String(options.name);
          var logLevels = buildLogLevels(options.logLevel);
          var log = options.log ? options.log.createLog("media", _this) : new Log("media", _this, logLevels, options.loggerName);
          Object.defineProperties(_this, {
            _instanceId: {
              value: ++nInstances
            },
            _log: {
              value: log
            },
            kind: {
              enumerable: true,
              value: kind
            },
            name: {
              enumerable: true,
              value: name
            }
          });
          return _this;
        }
        Track2.prototype.toJSON = function() {
          return valueToJSON(this);
        };
        return Track2;
      }(EventEmitter)
    );
    module.exports = Track;
  }
});

// node_modules/twilio-video/es5/media/track/mediatrack.js
var require_mediatrack = __commonJS({
  "node_modules/twilio-video/es5/media/track/mediatrack.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var isIOS = require_browserdetection().isIOS;
    var MediaStream2 = require_webrtc().MediaStream;
    var _a = require_util2();
    var waitForEvent = _a.waitForEvent;
    var waitForSometime = _a.waitForSometime;
    var localMediaRestartDeferreds = require_localmediarestartdeferreds();
    var Track = require_track();
    var MediaTrack = (
      /** @class */
      function(_super) {
        __extends(MediaTrack2, _super);
        function MediaTrack2(mediaTrackTransceiver, options) {
          var _this = this;
          options = Object.assign({
            playPausedElementsIfNotBackgrounded: isIOS() && typeof document === "object" && typeof document.addEventListener === "function" && typeof document.visibilityState === "string"
          }, options);
          _this = _super.call(this, mediaTrackTransceiver.id, mediaTrackTransceiver.kind, options) || this;
          var isStarted = false;
          options = Object.assign({
            MediaStream: MediaStream2
          }, options);
          Object.defineProperties(_this, {
            _attachments: {
              value: /* @__PURE__ */ new Set()
            },
            _dummyEl: {
              value: null,
              writable: true
            },
            _elShims: {
              value: /* @__PURE__ */ new WeakMap()
            },
            _isStarted: {
              get: function() {
                return isStarted;
              },
              set: function(_isStarted) {
                isStarted = _isStarted;
              }
            },
            _playPausedElementsIfNotBackgrounded: {
              value: options.playPausedElementsIfNotBackgrounded
            },
            _shouldShimAttachedElements: {
              value: options.workaroundWebKitBug212780 || options.playPausedElementsIfNotBackgrounded
            },
            _unprocessedTrack: {
              value: null,
              writable: true
            },
            _MediaStream: {
              value: options.MediaStream
            },
            isStarted: {
              enumerable: true,
              get: function() {
                return isStarted;
              }
            },
            mediaStreamTrack: {
              enumerable: true,
              get: function() {
                return this._unprocessedTrack || mediaTrackTransceiver.track;
              }
            },
            processedTrack: {
              enumerable: true,
              value: null,
              writable: true
            }
          });
          _this._initialize();
          return _this;
        }
        MediaTrack2.prototype._start = function() {
          this._log.debug("Started");
          this._isStarted = true;
          if (this._dummyEl) {
            this._dummyEl.oncanplay = null;
          }
          this.emit("started", this);
        };
        MediaTrack2.prototype._initialize = function() {
          var self = this;
          this._log.debug("Initializing");
          this._dummyEl = this._createElement();
          this.mediaStreamTrack.addEventListener("ended", function onended() {
            self._end();
            self.mediaStreamTrack.removeEventListener("ended", onended);
          });
          if (this._dummyEl) {
            this._dummyEl.muted = true;
            this._dummyEl.oncanplay = this._start.bind(this, this._dummyEl);
            this._attach(this._dummyEl, this.mediaStreamTrack);
            this._attachments.delete(this._dummyEl);
          }
        };
        MediaTrack2.prototype._end = function() {
          this._log.debug("Ended");
          if (this._dummyEl) {
            this._dummyEl.remove();
            this._dummyEl.srcObject = null;
            this._dummyEl.oncanplay = null;
            this._dummyEl = null;
          }
        };
        MediaTrack2.prototype.attach = function(el) {
          var _this = this;
          if (typeof el === "string") {
            el = this._selectElement(el);
          } else if (!el) {
            el = this._createElement();
          }
          this._log.debug("Attempting to attach to element:", el);
          el = this._attach(el);
          if (this._shouldShimAttachedElements && !this._elShims.has(el)) {
            var onUnintentionallyPaused = this._playPausedElementsIfNotBackgrounded ? function() {
              return playIfPausedAndNotBackgrounded(el, _this._log);
            } : null;
            this._elShims.set(el, shimMediaElement(el, onUnintentionallyPaused));
          }
          return el;
        };
        MediaTrack2.prototype._attach = function(el, mediaStreamTrack) {
          if (mediaStreamTrack === void 0) {
            mediaStreamTrack = this.processedTrack || this.mediaStreamTrack;
          }
          var mediaStream = el.srcObject;
          if (!(mediaStream instanceof this._MediaStream)) {
            mediaStream = new this._MediaStream();
          }
          var getTracks = mediaStreamTrack.kind === "audio" ? "getAudioTracks" : "getVideoTracks";
          mediaStream[getTracks]().forEach(function(track) {
            mediaStream.removeTrack(track);
          });
          mediaStream.addTrack(mediaStreamTrack);
          el.srcObject = mediaStream;
          el.autoplay = true;
          el.playsInline = true;
          if (!this._attachments.has(el)) {
            this._attachments.add(el);
          }
          return el;
        };
        MediaTrack2.prototype._selectElement = function(selector) {
          var el = document.querySelector(selector);
          if (!el) {
            throw new Error("Selector matched no element: " + selector);
          }
          return el;
        };
        MediaTrack2.prototype._updateElementsMediaStreamTrack = function() {
          var _this = this;
          this._log.debug("Reattaching all elements to update mediaStreamTrack");
          this._getAllAttachedElements().forEach(function(el) {
            return _this._attach(el);
          });
        };
        MediaTrack2.prototype._createElement = function() {
          return typeof document !== "undefined" ? document.createElement(this.kind) : null;
        };
        MediaTrack2.prototype.detach = function(el) {
          var els;
          if (typeof el === "string") {
            els = [this._selectElement(el)];
          } else if (!el) {
            els = this._getAllAttachedElements();
          } else {
            els = [el];
          }
          this._log.debug("Attempting to detach from elements:", els);
          this._detachElements(els);
          return el ? els[0] : els;
        };
        MediaTrack2.prototype._detachElements = function(elements) {
          return elements.map(this._detachElement.bind(this));
        };
        MediaTrack2.prototype._detachElement = function(el) {
          if (!this._attachments.has(el)) {
            return el;
          }
          var mediaStream = el.srcObject;
          if (mediaStream instanceof this._MediaStream) {
            mediaStream.removeTrack(this.processedTrack || this.mediaStreamTrack);
          }
          this._attachments.delete(el);
          if (this._shouldShimAttachedElements && this._elShims.has(el)) {
            var shim = this._elShims.get(el);
            shim.unShim();
            this._elShims.delete(el);
          }
          return el;
        };
        MediaTrack2.prototype._getAllAttachedElements = function() {
          var els = [];
          this._attachments.forEach(function(el) {
            els.push(el);
          });
          return els;
        };
        return MediaTrack2;
      }(Track)
    );
    function playIfPausedAndNotBackgrounded(el, log) {
      var tag = el.tagName.toLowerCase();
      log.warn("Unintentionally paused:", el);
      Promise.race([
        waitForEvent(document, "visibilitychange"),
        waitForSometime(1e3)
      ]).then(function() {
        if (document.visibilityState === "visible") {
          localMediaRestartDeferreds.whenResolved("audio").then(function() {
            log.info("Playing unintentionally paused <" + tag + "> element");
            log.debug("Element:", el);
            return el.play();
          }).then(function() {
            log.info("Successfully played unintentionally paused <" + tag + "> element");
            log.debug("Element:", el);
          }).catch(function(error) {
            log.warn("Error while playing unintentionally paused <" + tag + "> element:", { error, el });
          });
        }
      });
    }
    function shimMediaElement(el, onUnintentionallyPaused) {
      if (onUnintentionallyPaused === void 0) {
        onUnintentionallyPaused = null;
      }
      var origPause = el.pause;
      var origPlay = el.play;
      var pausedIntentionally = false;
      el.pause = function() {
        pausedIntentionally = true;
        return origPause.call(el);
      };
      el.play = function() {
        pausedIntentionally = false;
        return origPlay.call(el);
      };
      var onPause = onUnintentionallyPaused ? function() {
        if (!pausedIntentionally) {
          onUnintentionallyPaused();
        }
      } : null;
      if (onPause) {
        el.addEventListener("pause", onPause);
      }
      return {
        pausedIntentionally: function() {
          return pausedIntentionally;
        },
        unShim: function() {
          el.pause = origPause;
          el.play = origPlay;
          if (onPause) {
            el.removeEventListener("pause", onPause);
          }
        }
      };
    }
    module.exports = MediaTrack;
  }
});

// node_modules/twilio-video/es5/media/track/audiotrack.js
var require_audiotrack = __commonJS({
  "node_modules/twilio-video/es5/media/track/audiotrack.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var MediaTrack = require_mediatrack();
    var AudioTrack = (
      /** @class */
      function(_super) {
        __extends(AudioTrack2, _super);
        function AudioTrack2(mediaTrackTransceiver, options) {
          return _super.call(this, mediaTrackTransceiver, options) || this;
        }
        AudioTrack2.prototype.attach = function() {
          return _super.prototype.attach.apply(this, arguments);
        };
        AudioTrack2.prototype.detach = function() {
          return _super.prototype.detach.apply(this, arguments);
        };
        return AudioTrack2;
      }(MediaTrack)
    );
    module.exports = AudioTrack;
  }
});

// node_modules/twilio-video/es5/util/detectsilentvideo.js
var require_detectsilentvideo = __commonJS({
  "node_modules/twilio-video/es5/util/detectsilentvideo.js"(exports, module) {
    "use strict";
    var canvas = null;
    var N_SAMPLES = 3;
    var SAMPLE_HEIGHT = 50;
    var SAMPLE_INTERVAL_MS = 250;
    var SAMPLE_WIDTH = 50;
    function checkSilence(el) {
      try {
        var context = canvas.getContext("2d");
        context.drawImage(el, 0, 0, SAMPLE_WIDTH, SAMPLE_HEIGHT);
        var frame = context.getImageData(0, 0, SAMPLE_WIDTH, SAMPLE_HEIGHT);
        var frameDataWithoutAlpha = frame.data.filter(function(item, i) {
          return (i + 1) % 4;
        });
        var max = Math.max.apply(Math, frameDataWithoutAlpha);
        return max === 0;
      } catch (ex) {
        console.log("Error checking silence: ", ex);
        return false;
      }
    }
    function detectSilentVideo(el) {
      canvas = canvas || document.createElement("canvas");
      return new Promise(function(resolve) {
        var samplesLeft = N_SAMPLES;
        setTimeout(function doCheckSilence() {
          samplesLeft--;
          if (!checkSilence(el)) {
            return resolve(false);
          }
          if (samplesLeft > 0) {
            return setTimeout(doCheckSilence, SAMPLE_INTERVAL_MS);
          }
          return resolve(true);
        }, SAMPLE_INTERVAL_MS);
      });
    }
    module.exports = detectSilentVideo;
  }
});

// node_modules/twilio-video/es5/util/documentvisibilitymonitor.js
var require_documentvisibilitymonitor = __commonJS({
  "node_modules/twilio-video/es5/util/documentvisibilitymonitor.js"(exports, module) {
    "use strict";
    var DocumentVisibilityMonitor = (
      /** @class */
      function() {
        function DocumentVisibilityMonitor2(nPhases) {
          var _this = this;
          if (nPhases === void 0) {
            nPhases = 1;
          }
          Object.defineProperties(this, {
            _listeners: {
              value: []
            },
            _onVisibilityChange: {
              value: function() {
                _this._emitVisible(document.visibilityState === "visible");
              }
            }
          });
          for (var i = 0; i < nPhases; i++) {
            this._listeners.push([]);
          }
        }
        DocumentVisibilityMonitor2.prototype.clear = function() {
          var nPhases = this._listeners.length;
          for (var i = 0; i < nPhases; i++) {
            this._listeners[i] = [];
          }
        };
        DocumentVisibilityMonitor2.prototype._listenerCount = function() {
          return this._listeners.reduce(function(count, phaseListeners) {
            return count + phaseListeners.length;
          }, 0);
        };
        DocumentVisibilityMonitor2.prototype._emitVisible = function(isVisible) {
          var _this = this;
          var promise = Promise.resolve();
          var _loop_1 = function(phase2) {
            promise = promise.then(function() {
              return _this._emitVisiblePhase(phase2, isVisible);
            });
          };
          for (var phase = 1; phase <= this._listeners.length; phase++) {
            _loop_1(phase);
          }
          return promise;
        };
        DocumentVisibilityMonitor2.prototype._emitVisiblePhase = function(phase, isVisible) {
          var phaseListeners = this._listeners[phase - 1];
          return Promise.all(phaseListeners.map(function(listener) {
            var ret = listener(isVisible);
            return ret instanceof Promise ? ret : Promise.resolve(ret);
          }));
        };
        DocumentVisibilityMonitor2.prototype._start = function() {
          document.addEventListener("visibilitychange", this._onVisibilityChange);
        };
        DocumentVisibilityMonitor2.prototype._stop = function() {
          document.removeEventListener("visibilitychange", this._onVisibilityChange);
        };
        DocumentVisibilityMonitor2.prototype.onVisibilityChange = function(phase, listener) {
          if (typeof phase !== "number" || phase <= 0 || phase > this._listeners.length) {
            throw new Error("invalid phase: ", phase);
          }
          var phaseListeners = this._listeners[phase - 1];
          phaseListeners.push(listener);
          if (this._listenerCount() === 1) {
            this._start();
          }
          return this;
        };
        DocumentVisibilityMonitor2.prototype.offVisibilityChange = function(phase, listener) {
          if (typeof phase !== "number" || phase <= 0 || phase > this._listeners.length) {
            throw new Error("invalid phase: ", phase);
          }
          var phaseListeners = this._listeners[phase - 1];
          var index = phaseListeners.indexOf(listener);
          if (index !== -1) {
            phaseListeners.splice(index, 1);
            if (this._listenerCount() === 0) {
              this._stop();
            }
          }
          return this;
        };
        return DocumentVisibilityMonitor2;
      }()
    );
    module.exports = new DocumentVisibilityMonitor(2);
  }
});

// node_modules/twilio-video/es5/webaudio/workaround180748.js
var require_workaround180748 = __commonJS({
  "node_modules/twilio-video/es5/webaudio/workaround180748.js"(exports, module) {
    "use strict";
    var detectSilence = require_detectsilence();
    function workaround(log, getUserMedia, constraints, n, timeout) {
      n = typeof n === "number" ? n : 3;
      var retry = 0;
      var AudioContextFactory = require_audiocontext();
      var holder = {};
      var audioContext = AudioContextFactory.getOrCreate(holder);
      function doWorkaround() {
        return getUserMedia(constraints).then(function(stream) {
          var isSilentPromise = constraints.audio ? detectSilence(audioContext, stream, timeout).catch(function(err) {
            log.warn("Encountered an error while detecting silence", err);
            return true;
          }) : Promise.resolve(false);
          return isSilentPromise.then(function(isSilent) {
            if (!isSilent) {
              log.info("Got a non-silent audio MediaStreamTrack; returning it.");
              return stream;
            } else if (n <= 0) {
              log.warn("Got a silent audio MediaStreamTrack. Normally we would try to get a new one, but we've run out of retries; returning it anyway.");
              return stream;
            }
            log.warn("Got a silent audio MediaStreamTrack. Stopping all MediaStreamTracks and calling getUserMedia again. This is retry #" + ++retry + ".");
            stream.getTracks().forEach(function(track) {
              return track.stop();
            });
            n--;
            return doWorkaround();
          });
        });
      }
      return doWorkaround().then(function(stream) {
        AudioContextFactory.release(holder);
        return stream;
      }, function(error) {
        AudioContextFactory.release(holder);
        throw error;
      });
    }
    module.exports = workaround;
  }
});

// node_modules/twilio-video/es5/queueingeventemitter.js
var require_queueingeventemitter = __commonJS({
  "node_modules/twilio-video/es5/queueingeventemitter.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var EventEmitter = require_events().EventEmitter;
    var QueueingEventEmitter = (
      /** @class */
      function(_super) {
        __extends(QueueingEventEmitter2, _super);
        function QueueingEventEmitter2() {
          var _this = _super.call(this) || this;
          Object.defineProperties(_this, {
            _queuedEvents: {
              value: /* @__PURE__ */ new Map()
            }
          });
          return _this;
        }
        QueueingEventEmitter2.prototype.dequeue = function(event) {
          var _this = this;
          var result = true;
          if (!event) {
            this._queuedEvents.forEach(function(_, queuedEvent) {
              result = this.dequeue(queuedEvent) && result;
            }, this);
            return result;
          }
          var queue = this._queuedEvents.get(event) || [];
          this._queuedEvents.delete(event);
          return queue.reduce(function(result2, args) {
            return _this.emit.apply(_this, __spreadArray([], __read([event].concat(args)))) && result2;
          }, result);
        };
        QueueingEventEmitter2.prototype.queue = function() {
          var args = [].slice.call(arguments);
          if (this.emit.apply(this, __spreadArray([], __read(args)))) {
            return true;
          }
          var event = args[0];
          if (!this._queuedEvents.has(event)) {
            this._queuedEvents.set(event, []);
          }
          this._queuedEvents.get(event).push(args.slice(1));
          return false;
        };
        return QueueingEventEmitter2;
      }(EventEmitter)
    );
    module.exports = QueueingEventEmitter;
  }
});

// node_modules/twilio-video/es5/transceiver.js
var require_transceiver = __commonJS({
  "node_modules/twilio-video/es5/transceiver.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var QueueingEventEmitter = require_queueingeventemitter();
    var TrackTransceiver = (
      /** @class */
      function(_super) {
        __extends(TrackTransceiver2, _super);
        function TrackTransceiver2(id, kind) {
          var _this = _super.call(this) || this;
          Object.defineProperties(_this, {
            id: {
              enumerable: true,
              value: id
            },
            kind: {
              enumerable: true,
              value: kind
            }
          });
          return _this;
        }
        TrackTransceiver2.prototype.stop = function() {
          this.emit("stopped");
        };
        return TrackTransceiver2;
      }(QueueingEventEmitter)
    );
    module.exports = TrackTransceiver;
  }
});

// node_modules/twilio-video/es5/media/track/transceiver.js
var require_transceiver2 = __commonJS({
  "node_modules/twilio-video/es5/media/track/transceiver.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var TrackTransceiver = require_transceiver();
    var MediaTrackTransceiver = (
      /** @class */
      function(_super) {
        __extends(MediaTrackTransceiver2, _super);
        function MediaTrackTransceiver2(id, mediaStreamTrack) {
          var _this = _super.call(this, id, mediaStreamTrack.kind) || this;
          Object.defineProperties(_this, {
            _track: {
              value: mediaStreamTrack,
              writable: true
            },
            enabled: {
              enumerable: true,
              get: function() {
                return this._track.enabled;
              }
            },
            readyState: {
              enumerable: true,
              get: function() {
                return this._track.readyState;
              }
            },
            track: {
              enumerable: true,
              get: function() {
                return this._track;
              }
            }
          });
          return _this;
        }
        MediaTrackTransceiver2.prototype.stop = function() {
          this.track.stop();
          _super.prototype.stop.call(this);
        };
        return MediaTrackTransceiver2;
      }(TrackTransceiver)
    );
    module.exports = MediaTrackTransceiver;
  }
});

// node_modules/twilio-video/es5/media/track/sender.js
var require_sender = __commonJS({
  "node_modules/twilio-video/es5/media/track/sender.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var MediaTrackTransceiver = require_transceiver2();
    var MediaTrackSender = (
      /** @class */
      function(_super) {
        __extends(MediaTrackSender2, _super);
        function MediaTrackSender2(mediaStreamTrack) {
          var _this = _super.call(this, mediaStreamTrack.id, mediaStreamTrack) || this;
          Object.defineProperties(_this, {
            _clones: {
              value: /* @__PURE__ */ new Set()
            },
            _eventsToReemitters: {
              value: /* @__PURE__ */ new Map([
                ["mute", function() {
                  return _this.queue("muted");
                }],
                ["unmute", function() {
                  return _this.queue("unmuted");
                }]
              ])
            },
            _senders: {
              value: /* @__PURE__ */ new Set()
            },
            _senderToPublisherHintCallbacks: {
              value: /* @__PURE__ */ new Map()
            },
            isPublishing: {
              enumerable: true,
              get: function() {
                return !!this._clones.size;
              }
            },
            muted: {
              enumerable: true,
              get: function() {
                return this._track.muted;
              }
            }
          });
          _this._reemitMediaStreamTrackEvents();
          return _this;
        }
        MediaTrackSender2.prototype._reemitMediaStreamTrackEvents = function(mediaStreamTrack) {
          if (mediaStreamTrack === void 0) {
            mediaStreamTrack = this._track;
          }
          var _a = this, eventsToReemitters = _a._eventsToReemitters, track = _a._track;
          eventsToReemitters.forEach(function(reemitter2, event) {
            return mediaStreamTrack.addEventListener(event, reemitter2);
          });
          if (track !== mediaStreamTrack) {
            eventsToReemitters.forEach(function(reemitter2, event) {
              return track.removeEventListener(event, reemitter2);
            });
            if (track.muted !== mediaStreamTrack.muted) {
              var reemitter = eventsToReemitters.get(mediaStreamTrack.muted ? "mute" : "unmute");
              reemitter();
            }
          }
        };
        MediaTrackSender2.prototype.clone = function() {
          var clone = new MediaTrackSender2(this.track.clone());
          this._clones.add(clone);
          return clone;
        };
        MediaTrackSender2.prototype.removeClone = function(clone) {
          this._clones.delete(clone);
        };
        MediaTrackSender2.prototype.setMediaStreamTrack = function(mediaStreamTrack) {
          var _this = this;
          var clones = Array.from(this._clones);
          var senders = Array.from(this._senders);
          return Promise.all(clones.map(function(clone) {
            return clone.setMediaStreamTrack(mediaStreamTrack.clone());
          }).concat(senders.map(function(sender) {
            return _this._replaceTrack(sender, mediaStreamTrack);
          }))).finally(function() {
            _this._reemitMediaStreamTrackEvents(mediaStreamTrack);
            _this._track = mediaStreamTrack;
          });
        };
        MediaTrackSender2.prototype.addSender = function(sender, publisherHintCallback) {
          this._senders.add(sender);
          if (publisherHintCallback) {
            this._senderToPublisherHintCallbacks.set(sender, publisherHintCallback);
          }
          return this;
        };
        MediaTrackSender2.prototype.removeSender = function(sender) {
          this._senders.delete(sender);
          this._senderToPublisherHintCallbacks.delete(sender);
          return this;
        };
        MediaTrackSender2.prototype.setPublisherHint = function(encodings) {
          var _a = __read(Array.from(this._senderToPublisherHintCallbacks.values()), 1), publisherHintCallback = _a[0];
          return publisherHintCallback ? publisherHintCallback(encodings) : Promise.resolve("COULD_NOT_APPLY_HINT");
        };
        MediaTrackSender2.prototype._replaceTrack = function(sender, mediaStreamTrack) {
          var _this = this;
          return sender.replaceTrack(mediaStreamTrack).then(function(replaceTrackResult) {
            _this.setPublisherHint(null).catch(function() {
            });
            _this.emit("replaced");
            return replaceTrackResult;
          });
        };
        return MediaTrackSender2;
      }(MediaTrackTransceiver)
    );
    module.exports = MediaTrackSender;
  }
});

// node_modules/twilio-video/es5/media/track/localmediatrack.js
var require_localmediatrack = __commonJS({
  "node_modules/twilio-video/es5/media/track/localmediatrack.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var getUserMedia = require_webrtc().getUserMedia;
    var isIOS = require_browserdetection().isIOS;
    var _a = require_util2();
    var capitalize = _a.capitalize;
    var defer = _a.defer;
    var waitForSometime = _a.waitForSometime;
    var waitForEvent = _a.waitForEvent;
    var ILLEGAL_INVOKE = require_constants().typeErrors.ILLEGAL_INVOKE;
    var detectSilentAudio = require_detectsilentaudio();
    var detectSilentVideo = require_detectsilentvideo();
    var documentVisibilityMonitor = require_documentvisibilitymonitor();
    var localMediaRestartDeferreds = require_localmediarestartdeferreds();
    var gUMSilentTrackWorkaround = require_workaround180748();
    var MediaTrackSender = require_sender();
    function mixinLocalMediaTrack(AudioOrVideoTrack) {
      return (
        /** @class */
        function(_super) {
          __extends(LocalMediaTrack, _super);
          function LocalMediaTrack(mediaStreamTrack, options) {
            var _this = this;
            var workaroundWebKitBug1208516 = isIOS() && typeof document === "object" && typeof document.addEventListener === "function" && typeof document.visibilityState === "string";
            options = Object.assign({
              getUserMedia,
              isCreatedByCreateLocalTracks: false,
              workaroundWebKitBug1208516,
              gUMSilentTrackWorkaround
            }, options);
            var mediaTrackSender = new MediaTrackSender(mediaStreamTrack);
            var kind = mediaTrackSender.kind;
            _this = _super.call(this, mediaTrackSender, options) || this;
            Object.defineProperties(_this, {
              _constraints: {
                value: typeof options[kind] === "object" ? options[kind] : {},
                writable: true
              },
              _getUserMedia: {
                value: options.getUserMedia
              },
              _gUMSilentTrackWorkaround: {
                value: options.gUMSilentTrackWorkaround
              },
              _eventsToReemitters: {
                value: /* @__PURE__ */ new Map([
                  ["muted", function() {
                    return _this.emit("muted", _this);
                  }],
                  ["unmuted", function() {
                    return _this.emit("unmuted", _this);
                  }]
                ])
              },
              _workaroundWebKitBug1208516: {
                value: options.workaroundWebKitBug1208516
              },
              _workaroundWebKitBug1208516Cleanup: {
                value: null,
                writable: true
              },
              _didCallEnd: {
                value: false,
                writable: true
              },
              _isCreatedByCreateLocalTracks: {
                value: options.isCreatedByCreateLocalTracks
              },
              _noiseCancellation: {
                value: options.noiseCancellation || null
              },
              _trackSender: {
                value: mediaTrackSender
              },
              id: {
                enumerable: true,
                value: mediaTrackSender.id
              },
              isEnabled: {
                enumerable: true,
                get: function() {
                  return mediaTrackSender.enabled;
                }
              },
              isMuted: {
                enumerable: true,
                get: function() {
                  return mediaTrackSender.muted;
                }
              },
              isStopped: {
                enumerable: true,
                get: function() {
                  return mediaTrackSender.readyState === "ended";
                }
              }
            });
            if (_this._workaroundWebKitBug1208516) {
              _this._workaroundWebKitBug1208516Cleanup = restartWhenInadvertentlyStopped(_this);
            }
            _this._reemitTrackSenderEvents();
            return _this;
          }
          LocalMediaTrack.prototype._end = function() {
            var _this = this;
            if (this._didCallEnd) {
              return;
            }
            _super.prototype._end.call(this);
            this._didCallEnd = true;
            this._eventsToReemitters.forEach(function(reemitter, event) {
              return _this._trackSender.removeListener(event, reemitter);
            });
            this.emit("stopped", this);
          };
          LocalMediaTrack.prototype._initialize = function() {
            if (this._didCallEnd) {
              this._didCallEnd = false;
            }
            if (this._eventsToReemitters) {
              this._reemitTrackSenderEvents();
            }
            _super.prototype._initialize.call(this);
          };
          LocalMediaTrack.prototype._reacquireTrack = function(constraints) {
            var _a2;
            var _b = this, getUserMedia2 = _b._getUserMedia, gUMSilentTrackWorkaround2 = _b._gUMSilentTrackWorkaround, log = _b._log, kind = _b.mediaStreamTrack.kind;
            log.info("Re-acquiring the MediaStreamTrack");
            log.debug("Constraints:", constraints);
            var gUMConstraints = Object.assign({
              audio: false,
              video: false
            }, (_a2 = {}, _a2[kind] = constraints, _a2));
            var gUMPromise = this._workaroundWebKitBug1208516Cleanup ? gUMSilentTrackWorkaround2(log, getUserMedia2, gUMConstraints) : getUserMedia2(gUMConstraints);
            return gUMPromise.then(function(mediaStream) {
              return mediaStream.getTracks()[0];
            });
          };
          LocalMediaTrack.prototype._reemitTrackSenderEvents = function() {
            var _this = this;
            this._eventsToReemitters.forEach(function(reemitter, event) {
              return _this._trackSender.on(event, reemitter);
            });
            this._trackSender.dequeue("muted");
            this._trackSender.dequeue("unmuted");
          };
          LocalMediaTrack.prototype._restart = function(constraints) {
            var _this = this;
            var log = this._log;
            constraints = constraints || this._constraints;
            this._stop();
            return this._reacquireTrack(constraints).catch(function(error) {
              log.error("Failed to re-acquire the MediaStreamTrack:", { error, constraints });
              throw error;
            }).then(function(newMediaStreamTrack) {
              log.info("Re-acquired the MediaStreamTrack");
              log.debug("MediaStreamTrack:", newMediaStreamTrack);
              _this._constraints = Object.assign({}, constraints);
              return _this._setMediaStreamTrack(newMediaStreamTrack);
            });
          };
          LocalMediaTrack.prototype._setMediaStreamTrack = function(mediaStreamTrack) {
            var _this = this;
            mediaStreamTrack.enabled = this.mediaStreamTrack.enabled;
            this._stop();
            return (this._unprocessedTrack ? Promise.resolve().then(function() {
              _this._unprocessedTrack = mediaStreamTrack;
            }) : this._trackSender.setMediaStreamTrack(mediaStreamTrack).catch(function(error) {
              _this._log.warn("setMediaStreamTrack failed:", { error, mediaStreamTrack });
            })).then(function() {
              _this._initialize();
              _this._getAllAttachedElements().forEach(function(el) {
                return _this._attach(el);
              });
            });
          };
          LocalMediaTrack.prototype._stop = function() {
            this.mediaStreamTrack.stop();
            this._end();
            return this;
          };
          LocalMediaTrack.prototype.enable = function(enabled) {
            enabled = typeof enabled === "boolean" ? enabled : true;
            if (enabled !== this.mediaStreamTrack.enabled) {
              this._log.info((enabled ? "En" : "Dis") + "abling");
              this.mediaStreamTrack.enabled = enabled;
              this.emit(enabled ? "enabled" : "disabled", this);
            }
            return this;
          };
          LocalMediaTrack.prototype.disable = function() {
            return this.enable(false);
          };
          LocalMediaTrack.prototype.restart = function(constraints) {
            var _this = this;
            var kind = this.kind;
            if (!this._isCreatedByCreateLocalTracks) {
              return Promise.reject(ILLEGAL_INVOKE("restart", "can only be called on a" + (" Local" + capitalize(kind) + "Track that is created using createLocalTracks") + (" or createLocal" + capitalize(kind) + "Track.")));
            }
            if (this._workaroundWebKitBug1208516Cleanup) {
              this._workaroundWebKitBug1208516Cleanup();
              this._workaroundWebKitBug1208516Cleanup = null;
            }
            var promise = this._restart(constraints);
            if (this._workaroundWebKitBug1208516) {
              promise = promise.finally(function() {
                _this._workaroundWebKitBug1208516Cleanup = restartWhenInadvertentlyStopped(_this);
              });
            }
            return promise;
          };
          LocalMediaTrack.prototype.stop = function() {
            this._log.info("Stopping");
            if (this._workaroundWebKitBug1208516Cleanup) {
              this._workaroundWebKitBug1208516Cleanup();
              this._workaroundWebKitBug1208516Cleanup = null;
            }
            return this._stop();
          };
          return LocalMediaTrack;
        }(AudioOrVideoTrack)
      );
    }
    function restartWhenInadvertentlyStopped(localMediaTrack) {
      var log = localMediaTrack._log, kind = localMediaTrack.kind, noiseCancellation = localMediaTrack._noiseCancellation;
      var detectSilence = {
        audio: detectSilentAudio,
        video: detectSilentVideo
      }[kind];
      var getSourceMediaStreamTrack = function() {
        return noiseCancellation ? noiseCancellation.sourceTrack : localMediaTrack.mediaStreamTrack;
      };
      var el = localMediaTrack._dummyEl;
      var mediaStreamTrack = getSourceMediaStreamTrack();
      var trackChangeInProgress = null;
      function checkSilence() {
        return el.play().then(function() {
          return detectSilence(el);
        }).then(function(isSilent) {
          if (isSilent) {
            log.warn("Silence detected");
          } else {
            log.info("Non-silence detected");
          }
          return isSilent;
        }).catch(function(error) {
          log.warn("Failed to detect silence:", error);
        }).finally(function() {
          if (!localMediaTrack.processedTrack) {
            el.pause();
          }
        });
      }
      function shouldReacquireTrack() {
        var _workaroundWebKitBug1208516Cleanup = localMediaTrack._workaroundWebKitBug1208516Cleanup, isStopped = localMediaTrack.isStopped;
        var isInadvertentlyStopped = isStopped && !!_workaroundWebKitBug1208516Cleanup;
        var muted = getSourceMediaStreamTrack().muted;
        return Promise.resolve().then(function() {
          return document.visibilityState === "visible" && !trackChangeInProgress && (muted || isInadvertentlyStopped || checkSilence());
        });
      }
      function maybeRestart() {
        return Promise.race([
          waitForEvent(mediaStreamTrack, "unmute"),
          waitForSometime(50)
        ]).then(function() {
          return shouldReacquireTrack();
        }).then(function(shouldReacquire) {
          if (shouldReacquire && !trackChangeInProgress) {
            trackChangeInProgress = defer();
            localMediaTrack._restart().finally(function() {
              el = localMediaTrack._dummyEl;
              removeMediaStreamTrackListeners();
              mediaStreamTrack = getSourceMediaStreamTrack();
              addMediaStreamTrackListeners();
              trackChangeInProgress.resolve();
              trackChangeInProgress = null;
            }).catch(function(error) {
              log.error("failed to restart track: ", error);
            });
          }
          var promise = trackChangeInProgress && trackChangeInProgress.promise || Promise.resolve();
          return promise.finally(function() {
            return localMediaRestartDeferreds.resolveDeferred(kind);
          });
        }).catch(function(ex) {
          log.error("error in maybeRestart: " + ex.message);
        });
      }
      function onMute() {
        var log2 = localMediaTrack._log, kind2 = localMediaTrack.kind;
        log2.info("Muted");
        log2.debug("LocalMediaTrack:", localMediaTrack);
        localMediaRestartDeferreds.startDeferred(kind2);
      }
      function addMediaStreamTrackListeners() {
        mediaStreamTrack.addEventListener("ended", maybeRestart);
        mediaStreamTrack.addEventListener("mute", onMute);
        mediaStreamTrack.addEventListener("unmute", maybeRestart);
      }
      function removeMediaStreamTrackListeners() {
        mediaStreamTrack.removeEventListener("ended", maybeRestart);
        mediaStreamTrack.removeEventListener("mute", onMute);
        mediaStreamTrack.removeEventListener("unmute", maybeRestart);
      }
      var onVisibilityChange = function(isVisible) {
        return isVisible ? maybeRestart() : false;
      };
      documentVisibilityMonitor.onVisibilityChange(1, onVisibilityChange);
      addMediaStreamTrackListeners();
      return function() {
        documentVisibilityMonitor.offVisibilityChange(1, onVisibilityChange);
        removeMediaStreamTrackListeners();
      };
    }
    module.exports = mixinLocalMediaTrack;
  }
});

// node_modules/twilio-video/es5/media/track/localaudiotrack.js
var require_localaudiotrack = __commonJS({
  "node_modules/twilio-video/es5/media/track/localaudiotrack.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var isIOS = require_browserdetection().isIOS;
    var detectSilentAudio = require_detectsilentaudio();
    var isIOSChrome = require_util().isIOSChrome;
    var AudioTrack = require_audiotrack();
    var mixinLocalMediaTrack = require_localmediatrack();
    var LocalMediaAudioTrack = mixinLocalMediaTrack(AudioTrack);
    var LocalAudioTrack = (
      /** @class */
      function(_super) {
        __extends(LocalAudioTrack2, _super);
        function LocalAudioTrack2(mediaStreamTrack, options) {
          var _this = this;
          var noiseCancellation = (options === null || options === void 0 ? void 0 : options.noiseCancellation) || null;
          _this = _super.call(this, mediaStreamTrack, options) || this;
          var log = _this._log;
          var _a = mediaStreamTrack.label, defaultDeviceLabel = _a === void 0 ? "" : _a;
          var _b = mediaStreamTrack.getSettings(), _c = _b.deviceId, defaultDeviceId = _c === void 0 ? "" : _c, _d = _b.groupId, defaultGroupId = _d === void 0 ? "" : _d;
          Object.defineProperties(_this, {
            _currentDefaultDeviceInfo: {
              value: { deviceId: defaultDeviceId, groupId: defaultGroupId, label: defaultDeviceLabel },
              writable: true
            },
            _defaultDeviceCaptureMode: {
              value: !isIOS() && _this._isCreatedByCreateLocalTracks && typeof navigator === "object" && typeof navigator.mediaDevices === "object" && typeof navigator.mediaDevices.addEventListener === "function" && typeof navigator.mediaDevices.enumerateDevices === "function" ? (options === null || options === void 0 ? void 0 : options.defaultDeviceCaptureMode) || "auto" : "manual"
            },
            _onDeviceChange: {
              value: function() {
                navigator.mediaDevices.enumerateDevices().then(function(deviceInfos) {
                  var defaultDeviceInfo = deviceInfos.find(function(_a2) {
                    var deviceId = _a2.deviceId, kind = _a2.kind;
                    return kind === "audioinput" && deviceId !== "default";
                  });
                  if (defaultDeviceInfo && ["deviceId", "groupId"].some(function(prop) {
                    return defaultDeviceInfo[prop] !== _this._currentDefaultDeviceInfo[prop];
                  })) {
                    log.info("Default device changed, restarting the LocalAudioTrack");
                    log.debug('Old default device: "' + _this._currentDefaultDeviceInfo.deviceId + '" => "' + _this._currentDefaultDeviceInfo.label + '"');
                    log.debug('New default device: "' + defaultDeviceInfo.deviceId + '" => "' + defaultDeviceInfo.label + '"');
                    _this._currentDefaultDeviceInfo = defaultDeviceInfo;
                    _this._restartDefaultDevice().catch(function(error) {
                      return log.warn("Failed to restart: " + error.message);
                    });
                  }
                }, function(error) {
                  log.warn("Failed to run enumerateDevices(): " + error.message);
                });
              }
            },
            _restartOnDefaultDeviceChangeCleanup: {
              value: null,
              writable: true
            },
            noiseCancellation: {
              enumerable: true,
              value: noiseCancellation,
              writable: false
            }
          });
          log.debug("defaultDeviceCaptureMode:", _this._defaultDeviceCaptureMode);
          _this._maybeRestartOnDefaultDeviceChange();
          return _this;
        }
        LocalAudioTrack2.prototype.toString = function() {
          return "[LocalAudioTrack #" + this._instanceId + ": " + this.id + "]";
        };
        LocalAudioTrack2.prototype.attach = function(el) {
          el = _super.prototype.attach.call(this, el);
          el.muted = true;
          return el;
        };
        LocalAudioTrack2.prototype._end = function() {
          return _super.prototype._end.apply(this, arguments);
        };
        LocalAudioTrack2.prototype._maybeRestartOnDefaultDeviceChange = function() {
          var _this = this;
          var _a = this, constraints = _a._constraints, defaultDeviceCaptureMode = _a._defaultDeviceCaptureMode, log = _a._log;
          var mediaStreamTrack = this.noiseCancellation ? this.noiseCancellation.sourceTrack : this.mediaStreamTrack;
          var deviceId = mediaStreamTrack.getSettings().deviceId;
          var isNotEqualToCapturedDeviceIdOrEqualToDefault = function(requestedDeviceId) {
            return requestedDeviceId !== deviceId || requestedDeviceId === "default";
          };
          var isCapturingFromDefaultDevice = function checkIfCapturingFromDefaultDevice(deviceIdConstraint) {
            if (deviceIdConstraint === void 0) {
              deviceIdConstraint = {};
            }
            if (typeof deviceIdConstraint === "string") {
              return isNotEqualToCapturedDeviceIdOrEqualToDefault(deviceIdConstraint);
            } else if (Array.isArray(deviceIdConstraint)) {
              return deviceIdConstraint.every(isNotEqualToCapturedDeviceIdOrEqualToDefault);
            } else if (deviceIdConstraint.exact) {
              return checkIfCapturingFromDefaultDevice(deviceIdConstraint.exact);
            } else if (deviceIdConstraint.ideal) {
              return checkIfCapturingFromDefaultDevice(deviceIdConstraint.ideal);
            }
            return true;
          }(constraints.deviceId);
          if (defaultDeviceCaptureMode === "auto" && isCapturingFromDefaultDevice) {
            if (!this._restartOnDefaultDeviceChangeCleanup) {
              log.info("LocalAudioTrack will be restarted if the default device changes");
              navigator.mediaDevices.addEventListener("devicechange", this._onDeviceChange);
              this._restartOnDefaultDeviceChangeCleanup = function() {
                log.info("Cleaning up the listener to restart the LocalAudioTrack if the default device changes");
                navigator.mediaDevices.removeEventListener("devicechange", _this._onDeviceChange);
                _this._restartOnDefaultDeviceChangeCleanup = null;
              };
            }
          } else {
            log.info("LocalAudioTrack will NOT be restarted if the default device changes");
            if (this._restartOnDefaultDeviceChangeCleanup) {
              this._restartOnDefaultDeviceChangeCleanup();
            }
          }
        };
        LocalAudioTrack2.prototype._reacquireTrack = function(constraints) {
          var _this = this;
          this._log.debug("_reacquireTrack: ", constraints);
          if (this.noiseCancellation) {
            return this.noiseCancellation.reacquireTrack(function() {
              return _super.prototype._reacquireTrack.call(_this, constraints);
            });
          }
          return _super.prototype._reacquireTrack.call(this, constraints);
        };
        LocalAudioTrack2.prototype._restartDefaultDevice = function() {
          var _this = this;
          var constraints = Object.assign({}, this._constraints);
          var restartConstraints = Object.assign({}, constraints, { deviceId: this._currentDefaultDeviceInfo.deviceId });
          return this.restart(restartConstraints).then(function() {
            _this._constraints = constraints;
            _this._maybeRestartOnDefaultDeviceChange();
          });
        };
        LocalAudioTrack2.prototype._setMediaStreamTrack = function(mediaStreamTrack) {
          var _this = this;
          var _a = this, log = _a._log, noiseCancellation = _a.noiseCancellation;
          var promise = _super.prototype._setMediaStreamTrack.call(this, mediaStreamTrack);
          if (isIOSChrome() && !!noiseCancellation) {
            log.debug("iOS Chrome detected, checking if the restarted Krisp audio is silent");
            promise = promise.then(function() {
              return detectSilentAudio(_this._dummyEl);
            }).then(function(isSilent) {
              log.debug("Krisp audio is " + (isSilent ? "silent, using source audio" : "not silent"));
              return isSilent && noiseCancellation.disablePermanently().then(function() {
                return _super.prototype._setMediaStreamTrack.call(_this, noiseCancellation.sourceTrack);
              });
            });
          }
          return promise;
        };
        LocalAudioTrack2.prototype.disable = function() {
          return _super.prototype.disable.apply(this, arguments);
        };
        LocalAudioTrack2.prototype.enable = function() {
          return _super.prototype.enable.apply(this, arguments);
        };
        LocalAudioTrack2.prototype.restart = function() {
          return _super.prototype.restart.apply(this, arguments);
        };
        LocalAudioTrack2.prototype.stop = function() {
          if (this.noiseCancellation) {
            this.noiseCancellation.stop();
          }
          if (this._restartOnDefaultDeviceChangeCleanup) {
            this._restartOnDefaultDeviceChangeCleanup();
          }
          return _super.prototype.stop.apply(this, arguments);
        };
        return LocalAudioTrack2;
      }(LocalMediaAudioTrack)
    );
    module.exports = LocalAudioTrack;
  }
});

// node_modules/twilio-video/es5/media/track/es5/localaudiotrack.js
var require_localaudiotrack2 = __commonJS({
  "node_modules/twilio-video/es5/media/track/es5/localaudiotrack.js"(exports, module) {
    "use strict";
    var inherits = require_inherits();
    var LocalAudioTrackClass = require_localaudiotrack();
    function LocalAudioTrack(mediaStreamTrack, options) {
      var track = new LocalAudioTrackClass(mediaStreamTrack, options);
      Object.setPrototypeOf(track, LocalAudioTrack.prototype);
      return track;
    }
    inherits(LocalAudioTrack, LocalAudioTrackClass);
    module.exports = LocalAudioTrack;
  }
});

// node_modules/twilio-video/es5/media/track/videoprocessoreventobserver.js
var require_videoprocessoreventobserver = __commonJS({
  "node_modules/twilio-video/es5/media/track/videoprocessoreventobserver.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var EventEmitter = require_events().EventEmitter;
    var DEFAULT_VIDEO_PROCESSOR_STATS_INTERVAL_MS = require_constants().DEFAULT_VIDEO_PROCESSOR_STATS_INTERVAL_MS;
    var VideoProcessorEventObserver = (
      /** @class */
      function(_super) {
        __extends(VideoProcessorEventObserver2, _super);
        function VideoProcessorEventObserver2(log) {
          var _this = _super.call(this) || this;
          Object.defineProperties(_this, {
            _lastStatsSaveTime: {
              value: null,
              writable: true
            },
            _lastStatsPublishTime: {
              value: null,
              writable: true
            },
            _log: {
              value: log
            },
            _processorInfo: {
              value: null,
              writable: true
            },
            _stats: {
              value: null,
              writable: true
            }
          });
          _this.on("add", function(info) {
            _this._lastStatsSaveTime = Date.now();
            _this._lastStatsPublishTime = Date.now();
            _this._processorInfo = info;
            _this._stats = [];
            _this._reemitEvent("add", _this._getEventData());
          });
          _this.on("remove", function() {
            var data = _this._getEventData();
            _this._lastStatsSaveTime = null;
            _this._lastStatsPublishTime = null;
            _this._processorInfo = null;
            _this._stats = null;
            _this._reemitEvent("remove", data);
          });
          _this.on("start", function() {
            _this._reemitEvent("start", _this._getEventData());
          });
          _this.on("stop", function(message) {
            _this._reemitEvent("stop", Object.assign({ message }, _this._getEventData()));
          });
          _this.on("stats", function() {
            return _this._maybeEmitStats();
          });
          return _this;
        }
        VideoProcessorEventObserver2.prototype._getEventData = function() {
          if (!this._processorInfo) {
            return {};
          }
          var _a = this._processorInfo, processor = _a.processor, captureHeight = _a.captureHeight, captureWidth = _a.captureWidth, inputFrameRate = _a.inputFrameRate, isRemoteVideoTrack = _a.isRemoteVideoTrack, inputFrameBufferType = _a.inputFrameBufferType, outputFrameBufferContextType = _a.outputFrameBufferContextType;
          var data = { captureHeight, captureWidth, inputFrameRate, isRemoteVideoTrack, inputFrameBufferType, outputFrameBufferContextType };
          data.name = processor._name || "VideoProcessor";
          ["assetsPath", "blurFilterRadius", "debounce", "fitType", "isSimdEnabled", "maskBlurRadius", "pipeline", "version"].forEach(function(prop) {
            var val = processor["_" + prop];
            if (typeof val !== "undefined") {
              data[prop] = val;
            }
          });
          Object.keys(data).forEach(function(prop) {
            var val = data[prop];
            if (typeof val === "boolean") {
              data[prop] = val ? "true" : "false";
            }
          });
          return data;
        };
        VideoProcessorEventObserver2.prototype._maybeEmitStats = function() {
          if (!this._stats || !this._processorInfo) {
            return;
          }
          var benchmark = this._processorInfo.processor._benchmark;
          if (!benchmark) {
            return;
          }
          var now = Date.now();
          if (now - this._lastStatsSaveTime < 1e3) {
            return;
          }
          var entry = { outputFrameRate: benchmark.getRate("totalProcessingDelay") };
          ["captureFrameDelay", "imageCompositionDelay", "inputImageResizeDelay", "processFrameDelay", "segmentationDelay"].forEach(function(name) {
            entry[name] = benchmark.getAverageDelay(name);
          });
          this._lastStatsSaveTime = now;
          this._stats.push(entry);
          if (now - this._lastStatsPublishTime < DEFAULT_VIDEO_PROCESSOR_STATS_INTERVAL_MS) {
            return;
          }
          this._lastStatsPublishTime = now;
          var stats = this._stats.splice(0);
          var averages = stats.reduce(function(averages2, current, n) {
            Object.keys(entry).forEach(function(name) {
              if (!averages2[name]) {
                averages2[name] = 0;
              }
              averages2[name] = (averages2[name] * n + current[name]) / (n + 1);
            });
            return averages2;
          }, {});
          Object.keys(averages).forEach(function(name) {
            averages[name] = parseFloat(averages[name].toFixed(2));
          });
          this._reemitEvent("stats", Object.assign({}, averages, this._getEventData()));
        };
        VideoProcessorEventObserver2.prototype._reemitEvent = function(name, data) {
          this._log.debug("VideoProcessor:" + name, data);
          this.emit("event", { name, data });
        };
        return VideoProcessorEventObserver2;
      }(EventEmitter)
    );
    module.exports = VideoProcessorEventObserver;
  }
});

// node_modules/twilio-video/es5/media/track/videotrack.js
var require_videotrack = __commonJS({
  "node_modules/twilio-video/es5/media/track/videotrack.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var MediaTrack = require_mediatrack();
    var VideoProcessorEventObserver = require_videoprocessoreventobserver();
    var DEFAULT_FRAME_RATE = require_constants().DEFAULT_FRAME_RATE;
    var VideoTrack = (
      /** @class */
      function(_super) {
        __extends(VideoTrack2, _super);
        function VideoTrack2(mediaTrackTransceiver, options) {
          var _this = _super.call(this, mediaTrackTransceiver, options) || this;
          Object.defineProperties(_this, {
            _captureTimeoutId: {
              value: null,
              writable: true
            },
            _isCapturing: {
              value: false,
              writable: true
            },
            _inputFrame: {
              value: null,
              writable: true
            },
            _outputFrame: {
              value: null,
              writable: true
            },
            _processorEventObserver: {
              value: null,
              writable: true
            },
            _processorOptions: {
              value: {},
              writable: true
            },
            _unmuteHandler: {
              value: null,
              writable: true
            },
            dimensions: {
              enumerable: true,
              value: {
                width: null,
                height: null
              }
            },
            processor: {
              enumerable: true,
              value: null,
              writable: true
            }
          });
          _this._processorEventObserver = new (options.VideoProcessorEventObserver || VideoProcessorEventObserver)(_this._log);
          return _this;
        }
        VideoTrack2.prototype._checkIfCanCaptureFrames = function(isPublishing) {
          if (isPublishing === void 0) {
            isPublishing = false;
          }
          var canCaptureFrames = true;
          var message = "";
          var _a = this.mediaStreamTrack, enabled = _a.enabled, readyState = _a.readyState;
          if (!enabled) {
            canCaptureFrames = false;
            message = "MediaStreamTrack is disabled";
          }
          if (readyState === "ended") {
            canCaptureFrames = false;
            message = "MediaStreamTrack is ended";
          }
          if (!this.processor) {
            canCaptureFrames = false;
            message = "VideoProcessor not detected.";
          }
          if (!this._attachments.size && !isPublishing) {
            canCaptureFrames = false;
            message = "VideoTrack is not publishing and there is no attached element.";
          }
          if (message) {
            this._log.debug(message);
          }
          return { canCaptureFrames, message };
        };
        VideoTrack2.prototype._captureFrames = function() {
          var _this = this;
          if (this._isCapturing) {
            this._log.debug("Ignoring captureFrames call. Capture is already in progress");
            return;
          }
          if (!this._checkIfCanCaptureFrames().canCaptureFrames) {
            this._isCapturing = false;
            this._log.debug("Cannot capture frames. Ignoring captureFrames call.");
            return;
          }
          this._isCapturing = true;
          this._processorEventObserver.emit("start");
          this._log.debug("Start capturing frames");
          var startTime = Date.now();
          var processFramePeriodMs;
          this._dummyEl.play().then(function() {
            var captureFrame = function(cb) {
              clearTimeout(_this._captureTimeoutId);
              var _a = _this.mediaStreamTrack.getSettings().frameRate, frameRate = _a === void 0 ? DEFAULT_FRAME_RATE : _a;
              var capturePeriodMs = Math.floor(1e3 / frameRate);
              var delay = capturePeriodMs - processFramePeriodMs;
              if (delay < 0 || typeof processFramePeriodMs !== "number") {
                delay = 0;
              }
              _this._captureTimeoutId = setTimeout(cb, delay);
            };
            var process = function() {
              var checkResult = _this._checkIfCanCaptureFrames();
              if (!checkResult.canCaptureFrames) {
                _this._isCapturing = false;
                _this._processorEventObserver.emit("stop", checkResult.message);
                _this._log.debug("Cannot capture frames. Stopping capturing frames.");
                return;
              }
              startTime = Date.now();
              var _a = _this.mediaStreamTrack.getSettings(), _b = _a.width, width = _b === void 0 ? 0 : _b, _c = _a.height, height = _c === void 0 ? 0 : _c;
              if (_this._outputFrame && _this._outputFrame.width !== width) {
                _this._outputFrame.width = width;
                _this._outputFrame.height = height;
              }
              if (_this._inputFrame) {
                if (_this._inputFrame.width !== width) {
                  _this._inputFrame.width = width;
                  _this._inputFrame.height = height;
                }
                _this._inputFrame.getContext("2d").drawImage(_this._dummyEl, 0, 0, width, height);
              }
              var result = null;
              try {
                var input = _this._processorOptions.inputFrameBufferType === "video" ? _this._dummyEl : _this._inputFrame;
                result = _this.processor.processFrame(input, _this._outputFrame);
              } catch (ex) {
                _this._log.debug("Exception detected after calling processFrame.", ex);
              }
              (result instanceof Promise ? result : Promise.resolve(result)).then(function() {
                if (_this._outputFrame) {
                  if (typeof _this.processedTrack.requestFrame === "function") {
                    _this.processedTrack.requestFrame();
                  }
                  _this._processorEventObserver.emit("stats");
                }
              }).finally(function() {
                processFramePeriodMs = Date.now() - startTime;
                captureFrame(process);
              });
            };
            captureFrame(process);
          }).catch(function(error) {
            return _this._log.error("Video element cannot be played", { error, track: _this });
          });
        };
        VideoTrack2.prototype._initialize = function() {
          var _this = this;
          _super.prototype._initialize.call(this);
          if (this._dummyEl) {
            this._dummyEl.onloadedmetadata = function() {
              if (dimensionsChanged(_this, _this._dummyEl)) {
                _this.dimensions.width = _this._dummyEl.videoWidth;
                _this.dimensions.height = _this._dummyEl.videoHeight;
              }
            };
            this._dummyEl.onresize = function() {
              if (dimensionsChanged(_this, _this._dummyEl)) {
                _this.dimensions.width = _this._dummyEl.videoWidth;
                _this.dimensions.height = _this._dummyEl.videoHeight;
                if (_this.isStarted) {
                  _this._log.debug("Dimensions changed:", _this.dimensions);
                  _this.emit(VideoTrack2.DIMENSIONS_CHANGED, _this);
                }
              }
            };
          }
        };
        VideoTrack2.prototype._restartProcessor = function() {
          var processor = this.processor;
          if (processor) {
            var processorOptions = Object.assign({}, this._processorOptions);
            this.removeProcessor(processor);
            this.addProcessor(processor, processorOptions);
          }
        };
        VideoTrack2.prototype._start = function(dummyEl) {
          this.dimensions.width = dummyEl.videoWidth;
          this.dimensions.height = dummyEl.videoHeight;
          this._log.debug("Dimensions:", this.dimensions);
          this.emit(VideoTrack2.DIMENSIONS_CHANGED, this);
          return _super.prototype._start.call(this, dummyEl);
        };
        VideoTrack2.prototype.addProcessor = function(processor, options) {
          var _this = this;
          if (!processor || typeof processor.processFrame !== "function") {
            throw new Error("Received an invalid VideoProcessor from addProcessor.");
          }
          if (this.processor) {
            throw new Error("A VideoProcessor has already been added.");
          }
          if (!this._dummyEl) {
            throw new Error("VideoTrack has not been initialized.");
          }
          this._log.debug("Adding VideoProcessor to the VideoTrack", processor);
          if (!this._unmuteHandler) {
            this._unmuteHandler = function() {
              _this._log.debug("mediaStreamTrack unmuted");
              if (_this.processedTrack.muted) {
                _this._log.debug("mediaStreamTrack is unmuted but processedTrack is muted. Restarting processor.");
                _this._restartProcessor();
              }
            };
            this.mediaStreamTrack.addEventListener("unmute", this._unmuteHandler);
          }
          this._processorOptions = options || {};
          var _a = this._processorOptions, inputFrameBufferType = _a.inputFrameBufferType, outputFrameBufferContextType = _a.outputFrameBufferContextType;
          if (typeof OffscreenCanvas === "undefined" && inputFrameBufferType === "offscreencanvas") {
            throw new Error("OffscreenCanvas is not supported by this browser.");
          }
          if (inputFrameBufferType && inputFrameBufferType !== "video" && inputFrameBufferType !== "canvas" && inputFrameBufferType !== "offscreencanvas") {
            throw new Error("Invalid inputFrameBufferType of " + inputFrameBufferType);
          }
          if (!inputFrameBufferType) {
            inputFrameBufferType = typeof OffscreenCanvas === "undefined" ? "canvas" : "offscreencanvas";
          }
          var _b = this.mediaStreamTrack.getSettings(), _c = _b.width, width = _c === void 0 ? 0 : _c, _d = _b.height, height = _d === void 0 ? 0 : _d, _e = _b.frameRate, frameRate = _e === void 0 ? DEFAULT_FRAME_RATE : _e;
          if (inputFrameBufferType === "offscreencanvas") {
            this._inputFrame = new OffscreenCanvas(width, height);
          }
          if (inputFrameBufferType === "canvas") {
            this._inputFrame = document.createElement("canvas");
          }
          if (this._inputFrame) {
            this._inputFrame.width = width;
            this._inputFrame.height = height;
          }
          this._outputFrame = document.createElement("canvas");
          this._outputFrame.width = width;
          this._outputFrame.height = height;
          outputFrameBufferContextType = outputFrameBufferContextType || "2d";
          var ctx = this._outputFrame.getContext(outputFrameBufferContextType);
          if (!ctx) {
            throw new Error("Cannot get outputFrameBufferContextType: " + outputFrameBufferContextType + ".");
          }
          var targetFps = typeof CanvasCaptureMediaStreamTrack !== "undefined" && CanvasCaptureMediaStreamTrack.prototype && // eslint-disable-next-line
          typeof CanvasCaptureMediaStreamTrack.prototype.requestFrame === "function" ? 0 : void 0;
          this.processedTrack = this._outputFrame.captureStream(targetFps).getTracks()[0];
          this.processedTrack.enabled = this.mediaStreamTrack.enabled;
          this.processor = processor;
          this._processorEventObserver.emit("add", {
            processor,
            captureHeight: height,
            captureWidth: width,
            inputFrameRate: frameRate,
            isRemoteVideoTrack: this.toString().includes("RemoteVideoTrack"),
            inputFrameBufferType,
            outputFrameBufferContextType
          });
          this._updateElementsMediaStreamTrack();
          this._captureFrames();
          return this;
        };
        VideoTrack2.prototype.attach = function() {
          var result = _super.prototype.attach.apply(this, arguments);
          if (this.processor) {
            this._captureFrames();
          }
          return result;
        };
        VideoTrack2.prototype.detach = function() {
          return _super.prototype.detach.apply(this, arguments);
        };
        VideoTrack2.prototype.removeProcessor = function(processor) {
          if (!processor) {
            throw new Error("Received an invalid VideoProcessor from removeProcessor.");
          }
          if (!this.processor) {
            throw new Error("No existing VideoProcessor detected.");
          }
          if (processor !== this.processor) {
            throw new Error("The provided VideoProcessor is different than the existing one.");
          }
          this._processorEventObserver.emit("remove");
          this._log.debug("Removing VideoProcessor from the VideoTrack", processor);
          clearTimeout(this._captureTimeoutId);
          this.mediaStreamTrack.removeEventListener("unmute", this._unmuteHandler);
          this._processorOptions = {};
          this._unmuteHandler = null;
          this._isCapturing = false;
          this.processor = null;
          this.processedTrack = null;
          this._inputFrame = null;
          this._outputFrame = null;
          this._updateElementsMediaStreamTrack();
          return this;
        };
        return VideoTrack2;
      }(MediaTrack)
    );
    VideoTrack.DIMENSIONS_CHANGED = "dimensionsChanged";
    function dimensionsChanged(track, elem) {
      return track.dimensions.width !== elem.videoWidth || track.dimensions.height !== elem.videoHeight;
    }
    module.exports = VideoTrack;
  }
});

// node_modules/twilio-video/es5/media/track/localvideotrack.js
var require_localvideotrack = __commonJS({
  "node_modules/twilio-video/es5/media/track/localvideotrack.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var isIOS = require_browserdetection().isIOS;
    var detectSilentVideo = require_detectsilentvideo();
    var mixinLocalMediaTrack = require_localmediatrack();
    var VideoTrack = require_videotrack();
    var LocalMediaVideoTrack = mixinLocalMediaTrack(VideoTrack);
    var LocalVideoTrack = (
      /** @class */
      function(_super) {
        __extends(LocalVideoTrack2, _super);
        function LocalVideoTrack2(mediaStreamTrack, options) {
          var _this = this;
          options = Object.assign({
            workaroundSilentLocalVideo: isIOS() && typeof document !== "undefined" && typeof document.createElement === "function"
          }, options);
          _this = _super.call(this, mediaStreamTrack, options) || this;
          Object.defineProperties(_this, {
            _workaroundSilentLocalVideo: {
              value: options.workaroundSilentLocalVideo ? workaroundSilentLocalVideo : null
            },
            _workaroundSilentLocalVideoCleanup: {
              value: null,
              writable: true
            }
          });
          if (_this._workaroundSilentLocalVideo) {
            _this._workaroundSilentLocalVideoCleanup = _this._workaroundSilentLocalVideo(_this, document);
          }
          return _this;
        }
        LocalVideoTrack2.prototype.toString = function() {
          return "[LocalVideoTrack #" + this._instanceId + ": " + this.id + "]";
        };
        LocalVideoTrack2.prototype._checkIfCanCaptureFrames = function() {
          return _super.prototype._checkIfCanCaptureFrames.call(this, this._trackSender.isPublishing);
        };
        LocalVideoTrack2.prototype._end = function() {
          return _super.prototype._end.apply(this, arguments);
        };
        LocalVideoTrack2.prototype._setSenderMediaStreamTrack = function(useProcessed) {
          var _this = this;
          var unprocessedTrack = this.mediaStreamTrack;
          var mediaStreamTrack = useProcessed ? this.processedTrack : unprocessedTrack;
          return this._trackSender.setMediaStreamTrack(mediaStreamTrack).catch(function(error) {
            return _this._log.warn("setMediaStreamTrack failed on LocalVideoTrack RTCRtpSender", { error, mediaStreamTrack });
          }).then(function() {
            _this._unprocessedTrack = useProcessed ? unprocessedTrack : null;
          });
        };
        LocalVideoTrack2.prototype.addProcessor = function() {
          this._log.debug("Adding VideoProcessor to the LocalVideoTrack");
          var result = _super.prototype.addProcessor.apply(this, arguments);
          if (!this.processedTrack) {
            return this._log.warn("Unable to add a VideoProcessor to the LocalVideoTrack");
          }
          this._log.debug("Updating LocalVideoTrack's MediaStreamTrack with the processed MediaStreamTrack", this.processedTrack);
          this._setSenderMediaStreamTrack(true);
          return result;
        };
        LocalVideoTrack2.prototype.removeProcessor = function() {
          var _this = this;
          this._log.debug("Removing VideoProcessor from the LocalVideoTrack");
          var result = _super.prototype.removeProcessor.apply(this, arguments);
          this._log.debug("Updating LocalVideoTrack's MediaStreamTrack with the original MediaStreamTrack");
          this._setSenderMediaStreamTrack().then(function() {
            return _this._updateElementsMediaStreamTrack();
          });
          return result;
        };
        LocalVideoTrack2.prototype.disable = function() {
          var result = _super.prototype.disable.apply(this, arguments);
          if (this.processedTrack) {
            this.processedTrack.enabled = false;
          }
          return result;
        };
        LocalVideoTrack2.prototype.enable = function(enabled) {
          if (enabled === void 0) {
            enabled = true;
          }
          var result = _super.prototype.enable.apply(this, arguments);
          if (this.processedTrack) {
            this.processedTrack.enabled = enabled;
            if (enabled) {
              this._captureFrames();
              this._log.debug("Updating LocalVideoTrack's MediaStreamTrack with the processed MediaStreamTrack", this.processedTrack);
              this._setSenderMediaStreamTrack(true);
            }
          }
          return result;
        };
        LocalVideoTrack2.prototype.restart = function() {
          var _this = this;
          if (this._workaroundSilentLocalVideoCleanup) {
            this._workaroundSilentLocalVideoCleanup();
            this._workaroundSilentLocalVideoCleanup = null;
          }
          var promise = _super.prototype.restart.apply(this, arguments);
          if (this.processor) {
            promise.then(function() {
              _this._restartProcessor();
            });
          }
          if (this._workaroundSilentLocalVideo) {
            promise.finally(function() {
              _this._workaroundSilentLocalVideoCleanup = _this._workaroundSilentLocalVideo(_this, document);
            });
          }
          return promise;
        };
        LocalVideoTrack2.prototype.stop = function() {
          if (this._workaroundSilentLocalVideoCleanup) {
            this._workaroundSilentLocalVideoCleanup();
            this._workaroundSilentLocalVideoCleanup = null;
          }
          return _super.prototype.stop.apply(this, arguments);
        };
        return LocalVideoTrack2;
      }(LocalMediaVideoTrack)
    );
    function workaroundSilentLocalVideo(localVideoTrack, doc) {
      var log = localVideoTrack._log;
      var el = localVideoTrack._dummyEl, mediaStreamTrack = localVideoTrack.mediaStreamTrack;
      function onUnmute() {
        if (!localVideoTrack.isEnabled) {
          return;
        }
        log.info("Unmuted, checking silence");
        el.play().then(function() {
          return detectSilentVideo(el, doc);
        }).then(function(isSilent) {
          if (!isSilent) {
            log.info("Non-silent frames detected, so no need to restart");
            return;
          }
          log.warn("Silence detected, restarting");
          localVideoTrack._stop();
          return localVideoTrack._restart();
        }).catch(function(error) {
          log.warn("Failed to detect silence and restart:", error);
        }).finally(function() {
          el = localVideoTrack._dummyEl;
          if (el && !el.paused && !localVideoTrack.processedTrack) {
            el.pause();
          }
          mediaStreamTrack.removeEventListener("unmute", onUnmute);
          mediaStreamTrack = localVideoTrack.mediaStreamTrack;
          mediaStreamTrack.addEventListener("unmute", onUnmute);
        });
      }
      mediaStreamTrack.addEventListener("unmute", onUnmute);
      return function() {
        mediaStreamTrack.removeEventListener("unmute", onUnmute);
      };
    }
    module.exports = LocalVideoTrack;
  }
});

// node_modules/twilio-video/es5/media/track/es5/localvideotrack.js
var require_localvideotrack2 = __commonJS({
  "node_modules/twilio-video/es5/media/track/es5/localvideotrack.js"(exports, module) {
    "use strict";
    var inherits = require_inherits();
    var LocalVideoTrackClass = require_localvideotrack();
    function LocalVideoTrack(mediaStreamTrack, options) {
      var track = new LocalVideoTrackClass(mediaStreamTrack, options);
      Object.setPrototypeOf(track, LocalVideoTrack.prototype);
      return track;
    }
    inherits(LocalVideoTrack, LocalVideoTrackClass);
    module.exports = LocalVideoTrack;
  }
});

// node_modules/twilio-video/es5/data/transceiver.js
var require_transceiver3 = __commonJS({
  "node_modules/twilio-video/es5/data/transceiver.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var TrackTransceiver = require_transceiver();
    var DataTrackTransceiver = (
      /** @class */
      function(_super) {
        __extends(DataTrackTransceiver2, _super);
        function DataTrackTransceiver2(id, maxPacketLifeTime, maxRetransmits, ordered) {
          var _this = _super.call(this, id, "data") || this;
          Object.defineProperties(_this, {
            maxPacketLifeTime: {
              enumerable: true,
              value: maxPacketLifeTime
            },
            maxRetransmits: {
              enumerable: true,
              value: maxRetransmits
            },
            ordered: {
              enumerable: true,
              value: ordered
            }
          });
          return _this;
        }
        return DataTrackTransceiver2;
      }(TrackTransceiver)
    );
    module.exports = DataTrackTransceiver;
  }
});

// node_modules/twilio-video/es5/data/sender.js
var require_sender2 = __commonJS({
  "node_modules/twilio-video/es5/data/sender.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var DataTrackTransceiver = require_transceiver3();
    var makeUUID = require_util2().makeUUID;
    var DataTrackSender = (
      /** @class */
      function(_super) {
        __extends(DataTrackSender2, _super);
        function DataTrackSender2(maxPacketLifeTime, maxRetransmtis, ordered) {
          var _this = _super.call(this, makeUUID(), maxPacketLifeTime, maxRetransmtis, ordered) || this;
          Object.defineProperties(_this, {
            _clones: {
              value: /* @__PURE__ */ new Set()
            },
            _dataChannels: {
              value: /* @__PURE__ */ new Set()
            }
          });
          return _this;
        }
        DataTrackSender2.prototype._addClone = function(clone) {
          this._clones.add(clone);
        };
        DataTrackSender2.prototype.removeClone = function(clone) {
          this._clones.delete(clone);
        };
        DataTrackSender2.prototype.addDataChannel = function(dataChannel) {
          this._dataChannels.add(dataChannel);
          return this;
        };
        DataTrackSender2.prototype.clone = function() {
          var _this = this;
          var clone = new DataTrackSender2(this.maxPacketLifeTime, this.maxRetransmits, this.ordered);
          this._addClone(clone);
          clone.once("stopped", function() {
            return _this.removeClone(clone);
          });
          return clone;
        };
        DataTrackSender2.prototype.removeDataChannel = function(dataChannel) {
          this._dataChannels.delete(dataChannel);
          return this;
        };
        DataTrackSender2.prototype.send = function(data) {
          this._dataChannels.forEach(function(dataChannel) {
            try {
              dataChannel.send(data);
            } catch (error) {
            }
          });
          this._clones.forEach(function(clone) {
            try {
              clone.send(data);
            } catch (error) {
            }
          });
          return this;
        };
        DataTrackSender2.prototype.stop = function() {
          this._dataChannels.forEach(function(dataChannel) {
            return dataChannel.close();
          });
          this._clones.forEach(function(clone) {
            return clone.stop();
          });
          _super.prototype.stop.call(this);
        };
        return DataTrackSender2;
      }(DataTrackTransceiver)
    );
    module.exports = DataTrackSender;
  }
});

// node_modules/twilio-video/es5/media/track/localdatatrack.js
var require_localdatatrack = __commonJS({
  "node_modules/twilio-video/es5/media/track/localdatatrack.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var Track = require_track();
    var DefaultDataTrackSender = require_sender2();
    var LocalDataTrack = (
      /** @class */
      function(_super) {
        __extends(LocalDataTrack2, _super);
        function LocalDataTrack2(options) {
          var _this = this;
          options = Object.assign({
            DataTrackSender: DefaultDataTrackSender,
            maxPacketLifeTime: null,
            maxRetransmits: null,
            ordered: true
          }, options);
          var DataTrackSender = options.DataTrackSender;
          var dataTrackSender = new DataTrackSender(options.maxPacketLifeTime, options.maxRetransmits, options.ordered);
          _this = _super.call(this, dataTrackSender.id, "data", options) || this;
          Object.defineProperties(_this, {
            _trackSender: {
              value: dataTrackSender
            },
            id: {
              enumerable: true,
              value: dataTrackSender.id
            },
            maxPacketLifeTime: {
              enumerable: true,
              value: options.maxPacketLifeTime
            },
            maxRetransmits: {
              enumerable: true,
              value: options.maxRetransmits
            },
            ordered: {
              enumerable: true,
              value: options.ordered
            },
            reliable: {
              enumerable: true,
              value: options.maxPacketLifeTime === null && options.maxRetransmits === null
            }
          });
          return _this;
        }
        LocalDataTrack2.prototype.send = function(data) {
          this._trackSender.send(data);
        };
        return LocalDataTrack2;
      }(Track)
    );
    module.exports = LocalDataTrack;
  }
});

// node_modules/twilio-video/es5/media/track/es5/localdatatrack.js
var require_localdatatrack2 = __commonJS({
  "node_modules/twilio-video/es5/media/track/es5/localdatatrack.js"(exports, module) {
    "use strict";
    var inherits = require_inherits();
    var LocalDataTrackClass = require_localdatatrack();
    function LocalDataTrack(options) {
      var track = new LocalDataTrackClass(options);
      Object.setPrototypeOf(track, LocalDataTrack.prototype);
      return track;
    }
    inherits(LocalDataTrack, LocalDataTrackClass);
    module.exports = LocalDataTrack;
  }
});

// node_modules/twilio-video/es5/media/track/es5/index.js
var require_es5 = __commonJS({
  "node_modules/twilio-video/es5/media/track/es5/index.js"(exports, module) {
    "use strict";
    module.exports = {
      LocalAudioTrack: require_localaudiotrack2(),
      LocalVideoTrack: require_localvideotrack2(),
      LocalDataTrack: require_localdatatrack2()
    };
  }
});

// node_modules/twilio-video/es5/createlocaltracks.js
var require_createlocaltracks = __commonJS({
  "node_modules/twilio-video/es5/createlocaltracks.js"(exports) {
    "use strict";
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports && exports.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1)
          throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f)
          throw new TypeError("Generator is already executing.");
        while (_)
          try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
              return t;
            if (y = 0, t)
              op = [op[0] & 2, t.value];
            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;
              case 4:
                _.label++;
                return { value: op[1], done: false };
              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;
              case 7:
                op = _.ops.pop();
                _.trys.pop();
                continue;
              default:
                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                  _ = 0;
                  continue;
                }
                if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                  _.label = op[1];
                  break;
                }
                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1];
                  t = op;
                  break;
                }
                if (t && _.label < t[2]) {
                  _.label = t[2];
                  _.ops.push(op);
                  break;
                }
                if (t[2])
                  _.ops.pop();
                _.trys.pop();
                continue;
            }
            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
        if (op[0] & 5)
          throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createLocalTracks = void 0;
    var noisecancellationimpl_1 = require_noisecancellationimpl();
    var buildLogLevels = require_util2().buildLogLevels;
    var _a = require_webrtc();
    var getUserMedia = _a.getUserMedia;
    var MediaStreamTrack2 = _a.MediaStreamTrack;
    var _b = require_es5();
    var LocalAudioTrack = _b.LocalAudioTrack;
    var LocalDataTrack = _b.LocalDataTrack;
    var LocalVideoTrack = _b.LocalVideoTrack;
    var Log = require_log();
    var _c = require_constants();
    var DEFAULT_LOG_LEVEL = _c.DEFAULT_LOG_LEVEL;
    var DEFAULT_LOGGER_NAME = _c.DEFAULT_LOGGER_NAME;
    var INVALID_VALUE = _c.typeErrors.INVALID_VALUE;
    var workaround180748 = require_workaround180748();
    var createLocalTrackCalls = 0;
    function createLocalTracks(options) {
      return __awaiter(this, void 0, void 0, function() {
        var isAudioVideoAbsent, fullOptions, logComponentName, logLevels, log, localTrackOptions, extraLocalTrackOptions, noiseCancellationOptions, mediaStreamConstraints, workaroundWebKitBug180748, mediaStream, mediaStreamTracks, error_1;
        var _this = this;
        return __generator(this, function(_a2) {
          switch (_a2.label) {
            case 0:
              isAudioVideoAbsent = !(options && ("audio" in options || "video" in options));
              fullOptions = __assign({
                audio: isAudioVideoAbsent,
                getUserMedia,
                loggerName: DEFAULT_LOGGER_NAME,
                logLevel: DEFAULT_LOG_LEVEL,
                LocalAudioTrack,
                LocalDataTrack,
                LocalVideoTrack,
                MediaStreamTrack: MediaStreamTrack2,
                Log,
                video: isAudioVideoAbsent
              }, options);
              logComponentName = "[createLocalTracks #" + ++createLocalTrackCalls + "]";
              logLevels = buildLogLevels(fullOptions.logLevel);
              log = new fullOptions.Log("default", logComponentName, logLevels, fullOptions.loggerName);
              localTrackOptions = Object.assign({ log }, fullOptions);
              delete localTrackOptions.name;
              if (fullOptions.audio === false && fullOptions.video === false) {
                log.info("Neither audio nor video requested, so returning empty LocalTracks");
                return [2, []];
              }
              if (fullOptions.tracks) {
                log.info("Adding user-provided LocalTracks");
                log.debug("LocalTracks:", fullOptions.tracks);
                return [2, fullOptions.tracks];
              }
              extraLocalTrackOptions = {
                audio: typeof fullOptions.audio === "object" && fullOptions.audio.name ? { name: fullOptions.audio.name } : { defaultDeviceCaptureMode: "auto" },
                video: typeof fullOptions.video === "object" && fullOptions.video.name ? { name: fullOptions.video.name } : {}
              };
              extraLocalTrackOptions.audio.isCreatedByCreateLocalTracks = true;
              extraLocalTrackOptions.video.isCreatedByCreateLocalTracks = true;
              if (typeof fullOptions.audio === "object") {
                if (typeof fullOptions.audio.workaroundWebKitBug1208516 === "boolean") {
                  extraLocalTrackOptions.audio.workaroundWebKitBug1208516 = fullOptions.audio.workaroundWebKitBug1208516;
                }
                if ("noiseCancellationOptions" in fullOptions.audio) {
                  noiseCancellationOptions = fullOptions.audio.noiseCancellationOptions;
                  delete fullOptions.audio.noiseCancellationOptions;
                }
                if (!("defaultDeviceCaptureMode" in fullOptions.audio)) {
                  extraLocalTrackOptions.audio.defaultDeviceCaptureMode = "auto";
                } else if (["auto", "manual"].every(function(mode) {
                  return mode !== fullOptions.audio.defaultDeviceCaptureMode;
                })) {
                  throw INVALID_VALUE("CreateLocalAudioTrackOptions.defaultDeviceCaptureMode", ["auto", "manual"]);
                } else {
                  extraLocalTrackOptions.audio.defaultDeviceCaptureMode = fullOptions.audio.defaultDeviceCaptureMode;
                }
              }
              if (typeof fullOptions.video === "object" && typeof fullOptions.video.workaroundWebKitBug1208516 === "boolean") {
                extraLocalTrackOptions.video.workaroundWebKitBug1208516 = fullOptions.video.workaroundWebKitBug1208516;
              }
              if (typeof fullOptions.audio === "object") {
                delete fullOptions.audio.name;
              }
              if (typeof fullOptions.video === "object") {
                delete fullOptions.video.name;
              }
              mediaStreamConstraints = {
                audio: fullOptions.audio,
                video: fullOptions.video
              };
              workaroundWebKitBug180748 = typeof fullOptions.audio === "object" && fullOptions.audio.workaroundWebKitBug180748;
              _a2.label = 1;
            case 1:
              _a2.trys.push([1, 4, , 5]);
              return [4, workaroundWebKitBug180748 ? workaround180748(log, fullOptions.getUserMedia, mediaStreamConstraints) : fullOptions.getUserMedia(mediaStreamConstraints)];
            case 2:
              mediaStream = _a2.sent();
              mediaStreamTracks = __spreadArray(__spreadArray([], __read(mediaStream.getAudioTracks())), __read(mediaStream.getVideoTracks()));
              log.info("Call to getUserMedia successful; got tracks:", mediaStreamTracks);
              return [4, Promise.all(mediaStreamTracks.map(function(mediaStreamTrack) {
                return __awaiter(_this, void 0, void 0, function() {
                  var _a3, cleanTrack, noiseCancellation;
                  return __generator(this, function(_b2) {
                    switch (_b2.label) {
                      case 0:
                        if (!(mediaStreamTrack.kind === "audio" && noiseCancellationOptions))
                          return [3, 2];
                        return [4, noisecancellationimpl_1.applyNoiseCancellation(mediaStreamTrack, noiseCancellationOptions, log)];
                      case 1:
                        _a3 = _b2.sent(), cleanTrack = _a3.cleanTrack, noiseCancellation = _a3.noiseCancellation;
                        return [2, new localTrackOptions.LocalAudioTrack(cleanTrack, __assign(__assign(__assign({}, extraLocalTrackOptions.audio), localTrackOptions), { noiseCancellation }))];
                      case 2:
                        if (mediaStreamTrack.kind === "audio") {
                          return [2, new localTrackOptions.LocalAudioTrack(mediaStreamTrack, __assign(__assign({}, extraLocalTrackOptions.audio), localTrackOptions))];
                        }
                        _b2.label = 3;
                      case 3:
                        return [2, new localTrackOptions.LocalVideoTrack(mediaStreamTrack, __assign(__assign({}, extraLocalTrackOptions.video), localTrackOptions))];
                    }
                  });
                });
              }))];
            case 3:
              return [2, _a2.sent()];
            case 4:
              error_1 = _a2.sent();
              log.warn("Call to getUserMedia failed:", error_1);
              throw error_1;
            case 5:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }
    exports.createLocalTracks = createLocalTracks;
  }
});

// node_modules/twilio-video/es5/preflight/timer.js
var require_timer = __commonJS({
  "node_modules/twilio-video/es5/preflight/timer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Timer = void 0;
    var Timer = (
      /** @class */
      function() {
        function Timer2() {
          this._end = void 0;
          this.start();
        }
        Timer2.prototype.start = function() {
          this._start = Date.now();
          return this;
        };
        Timer2.prototype.stop = function() {
          this._end = Date.now();
          return this;
        };
        Timer2.prototype.getTimeMeasurement = function() {
          return {
            start: this._start,
            end: this._end,
            // eslint-disable-next-line no-undefined
            duration: this._end === void 0 ? void 0 : this._end - this._start
          };
        };
        return Timer2;
      }()
    );
    exports.Timer = Timer;
  }
});

// node_modules/twilio-video/es5/preflight/mos.js
var require_mos = __commonJS({
  "node_modules/twilio-video/es5/preflight/mos.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mosToScore = exports.calculateMOS = void 0;
    var r0 = 94.768;
    function calculateMOS(rtt, jitter, fractionLost) {
      var effectiveLatency = rtt + jitter * 2 + 10;
      var rFactor = 0;
      switch (true) {
        case effectiveLatency < 160:
          rFactor = r0 - effectiveLatency / 40;
          break;
        case effectiveLatency < 1e3:
          rFactor = r0 - (effectiveLatency - 120) / 10;
          break;
      }
      switch (true) {
        case fractionLost <= rFactor / 2.5:
          rFactor = Math.max(rFactor - fractionLost * 2.5, 6.52);
          break;
        default:
          rFactor = 0;
          break;
      }
      var mos = 1 + 0.035 * rFactor + 7e-6 * rFactor * (rFactor - 60) * (100 - rFactor);
      return mos;
    }
    exports.calculateMOS = calculateMOS;
    function mosToScore(mosValue) {
      var score = 0;
      if (!mosValue) {
        score = 0;
      } else if (mosValue > 4.2) {
        score = 5;
      } else if (mosValue > 4) {
        score = 4;
      } else if (mosValue > 3.6) {
        score = 3;
      } else if (mosValue > 3) {
        score = 2;
      } else {
        score = 1;
      }
      return score;
    }
    exports.mosToScore = mosToScore;
  }
});

// node_modules/twilio-video/es5/preflight/getCombinedConnectionStats.js
var require_getCombinedConnectionStats = __commonJS({
  "node_modules/twilio-video/es5/preflight/getCombinedConnectionStats.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports && exports.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1)
          throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f)
          throw new TypeError("Generator is already executing.");
        while (_)
          try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
              return t;
            if (y = 0, t)
              op = [op[0] & 2, t.value];
            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;
              case 4:
                _.label++;
                return { value: op[1], done: false };
              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;
              case 7:
                op = _.ops.pop();
                _.trys.pop();
                continue;
              default:
                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                  _ = 0;
                  continue;
                }
                if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                  _.label = op[1];
                  break;
                }
                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1];
                  t = op;
                  break;
                }
                if (t && _.label < t[2]) {
                  _.label = t[2];
                  _.ops.push(op);
                  break;
                }
                if (t[2])
                  _.ops.pop();
                _.trys.pop();
                continue;
            }
            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
        if (op[0] & 5)
          throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getCombinedConnectionStats = void 0;
    function getStatValues(report, statName, kind, reportTypes) {
      var results = [];
      report.forEach(function(stat) {
        if ((reportTypes.length === 0 || reportTypes.includes(stat.type)) && (kind.length === 0 || kind.includes(stat.kind)) && typeof stat[statName] === "number") {
          results.push(stat[statName]);
        }
      });
      return results;
    }
    function getCombinedConnectionStats(_a) {
      var publisher = _a.publisher, subscriber = _a.subscriber;
      return __awaiter(this, void 0, void 0, function() {
        var _b, publisherStats, subscriberStats, timestamps, timestamp, jitter, packets, packetsLost, trackRoundTripTime, currentRoundTripTime, roundTripTime, bytesSent, bytesReceived, selectedIceCandidatePairStats, iceCandidateStats;
        return __generator(this, function(_c) {
          switch (_c.label) {
            case 0:
              return [4, Promise.all([publisher, subscriber].map(function(pc) {
                return pc.getStats();
              }))];
            case 1:
              _b = __read.apply(void 0, [_c.sent(), 2]), publisherStats = _b[0], subscriberStats = _b[1];
              timestamps = getStatValues(subscriberStats, "timestamp", ["audio"], ["inbound-rtp"]);
              timestamp = timestamps.length > 0 ? timestamps[0] : 0;
              jitter = getStatValues(subscriberStats, "jitter", ["audio"], ["inbound-rtp"]).reduce(function(a, b) {
                return Math.max(a, b);
              }, 0);
              packets = getStatValues(subscriberStats, "packetsReceived", ["audio", "video"], ["inbound-rtp"]).reduce(function(a, b) {
                return a + b;
              }, 0);
              packetsLost = getStatValues(subscriberStats, "packetsLost", ["audio", "video"], ["inbound-rtp"]).reduce(function(a, b) {
                return a + b;
              }, 0);
              trackRoundTripTime = getStatValues(publisherStats, "roundTripTime", ["audio", "video"], ["remote-inbound-rtp"]).reduce(function(a, b) {
                return Math.max(a, b);
              }, 0);
              currentRoundTripTime = getStatValues(subscriberStats, "currentRoundTripTime", [], ["candidate-pair"]).reduce(function(a, b) {
                return Math.max(a, b);
              }, 0);
              roundTripTime = (currentRoundTripTime || trackRoundTripTime) * 1e3;
              bytesSent = getStatValues(publisherStats, "bytesSent", [], ["candidate-pair"]).reduce(function(a, b) {
                return a + b;
              }, 0);
              bytesReceived = getStatValues(subscriberStats, "bytesReceived", [], ["candidate-pair"]).reduce(function(a, b) {
                return a + b;
              }, 0);
              selectedIceCandidatePairStats = extractSelectedActiveCandidatePair(subscriberStats);
              iceCandidateStats = [];
              subscriberStats.forEach(function(stat) {
                if (stat.type === "local-candidate" || stat.type === "remote-candidate") {
                  iceCandidateStats.push(makeStandardCandidateStats(stat));
                }
              });
              return [2, { timestamp, jitter, packets, packetsLost, roundTripTime, bytesSent, bytesReceived, selectedIceCandidatePairStats, iceCandidateStats }];
          }
        });
      });
    }
    exports.getCombinedConnectionStats = getCombinedConnectionStats;
    function makeStandardCandidateStats(input) {
      var standardizedCandidateStatsKeys = [
        { key: "transportId", type: "string" },
        { key: "candidateType", type: "string" },
        { key: "port", altKeys: ["portNumber"], type: "number" },
        { key: "address", altKeys: ["ip", "ipAddress"], type: "string" },
        { key: "priority", type: "number" },
        { key: "protocol", altKeys: ["transport"], type: "string" },
        { key: "url", type: "string" },
        { key: "relayProtocol", type: "string" }
      ];
      return standardizedCandidateStatsKeys.reduce(function(report, keyInfo) {
        var keysToLookFor = [keyInfo.key];
        if (keyInfo.altKeys) {
          keysToLookFor = keysToLookFor.concat(keyInfo.altKeys);
        }
        var key = keysToLookFor.find(function(key2) {
          return key2 in input;
        });
        if (key && typeof input[key] === keyInfo.type) {
          report[keyInfo.key] = input[key];
        }
        return report;
      }, {});
    }
    function extractSelectedActiveCandidatePair(stats) {
      var selectedCandidatePairId = null;
      var candidatePairs = [];
      stats.forEach(function(stat) {
        if (stat.type === "transport" && stat.selectedCandidatePairId) {
          selectedCandidatePairId = stat.selectedCandidatePairId;
        } else if (stat.type === "candidate-pair") {
          candidatePairs.push(stat);
        }
      });
      var activeCandidatePairStatsFound = candidatePairs.find(function(pair) {
        return pair.selected || // Spec-compliant way
        selectedCandidatePairId && pair.id === selectedCandidatePairId;
      });
      if (!activeCandidatePairStatsFound) {
        return null;
      }
      var activeCandidatePairStats = activeCandidatePairStatsFound;
      var activeLocalCandidateStats = stats.get(activeCandidatePairStats.localCandidateId);
      var activeRemoteCandidateStats = stats.get(activeCandidatePairStats.remoteCandidateId);
      if (!activeLocalCandidateStats || !activeRemoteCandidateStats) {
        return null;
      }
      return {
        localCandidate: makeStandardCandidateStats(activeLocalCandidateStats),
        remoteCandidate: makeStandardCandidateStats(activeRemoteCandidateStats)
      };
    }
  }
});

// node_modules/twilio-video/es5/statemachine.js
var require_statemachine = __commonJS({
  "node_modules/twilio-video/es5/statemachine.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var EventEmitter = require_events().EventEmitter;
    var util = require_util2();
    var StateMachine = (
      /** @class */
      function(_super) {
        __extends(StateMachine2, _super);
        function StateMachine2(initialState, states) {
          var _this = _super.call(this) || this;
          var lock = null;
          var state = initialState;
          states = transformStates(states);
          Object.defineProperties(_this, {
            _lock: {
              get: function() {
                return lock;
              },
              set: function(_lock) {
                lock = _lock;
              }
            },
            _reachableStates: {
              value: reachable(states)
            },
            _state: {
              get: function() {
                return state;
              },
              set: function(_state) {
                state = _state;
              }
            },
            _states: {
              value: states
            },
            _whenDeferreds: {
              value: /* @__PURE__ */ new Set()
            },
            isLocked: {
              enumerable: true,
              get: function() {
                return lock !== null;
              }
            },
            state: {
              enumerable: true,
              get: function() {
                return state;
              }
            }
          });
          _this.on("stateChanged", function(state2) {
            _this._whenDeferreds.forEach(function(deferred) {
              deferred.when(state2, deferred.resolve, deferred.reject);
            });
          });
          return _this;
        }
        StateMachine2.prototype._whenPromise = function(when) {
          var _this = this;
          if (typeof when !== "function") {
            return Promise.reject(new Error("when() executor must be a function"));
          }
          var deferred = util.defer();
          deferred.when = when;
          this._whenDeferreds.add(deferred);
          return deferred.promise.then(function(payload) {
            _this._whenDeferreds.delete(deferred);
            return payload;
          }, function(error) {
            _this._whenDeferreds.delete(deferred);
            throw error;
          });
        };
        StateMachine2.prototype.bracket = function(name, transitionFunction) {
          var key;
          var self = this;
          function releaseLock(error) {
            if (self.hasLock(key)) {
              self.releaseLockCompletely(key);
            }
            if (error) {
              throw error;
            }
          }
          return this.takeLock(name).then(function gotKey(_key) {
            key = _key;
            return transitionFunction(key);
          }).then(function success(result) {
            releaseLock();
            return result;
          }, releaseLock);
        };
        StateMachine2.prototype.hasLock = function(key) {
          return this._lock === key;
        };
        StateMachine2.prototype.preempt = function(newState, name, payload) {
          if (!isValidTransition(this._states, this.state, newState)) {
            throw new Error('Cannot transition from "' + this.state + '" to "' + newState + '"');
          }
          var oldLock;
          if (this.isLocked) {
            oldLock = this._lock;
            this._lock = null;
          }
          var key = null;
          if (name) {
            key = this.takeLockSync(name);
          }
          var preemptionKey = key ? null : this.takeLockSync("preemption");
          this.transition(newState, key || preemptionKey, payload);
          if (oldLock) {
            oldLock.resolve();
          }
          if (preemptionKey) {
            this.releaseLock(preemptionKey);
          }
          return key;
        };
        StateMachine2.prototype.releaseLock = function(key) {
          if (!this.isLocked) {
            throw new Error("Could not release the lock for " + key.name + " because the StateMachine is not locked");
          } else if (!this.hasLock(key)) {
            throw new Error("Could not release the lock for " + key.name + " because " + this._lock.name + " has the lock");
          }
          if (key.depth === 0) {
            this._lock = null;
            key.resolve();
          } else {
            key.depth--;
          }
        };
        StateMachine2.prototype.releaseLockCompletely = function(key) {
          if (!this.isLocked) {
            throw new Error("Could not release the lock for " + key.name + " because the StateMachine is not locked");
          } else if (!this.hasLock(key)) {
            throw new Error("Could not release the lock for " + key.name + " because " + this._lock.name + " has the lock");
          }
          key.depth = 0;
          this._lock = null;
          key.resolve();
        };
        StateMachine2.prototype.takeLock = function(nameOrKey) {
          var _this = this;
          if (typeof nameOrKey === "object") {
            var key_1 = nameOrKey;
            return new Promise(function(resolve) {
              resolve(_this.takeLockSync(key_1));
            });
          }
          var name = nameOrKey;
          if (this.isLocked) {
            var takeLock = this.takeLock.bind(this, name);
            return this._lock.promise.then(takeLock);
          }
          return Promise.resolve(this.takeLockSync(name));
        };
        StateMachine2.prototype.takeLockSync = function(nameOrKey) {
          var key = typeof nameOrKey === "string" ? null : nameOrKey;
          var name = key ? key.name : nameOrKey;
          if (key && !this.hasLock(key) || !key && this.isLocked) {
            throw new Error("Could not take the lock for " + name + " because the lock for " + this._lock.name + " was not released");
          }
          if (key) {
            key.depth++;
            return key;
          }
          var lock = makeLock(name);
          this._lock = lock;
          return lock;
        };
        StateMachine2.prototype.transition = function(newState, key, payload) {
          payload = payload || [];
          if (this.isLocked) {
            if (!key) {
              throw new Error("You must provide the key in order to transition");
            } else if (!this.hasLock(key)) {
              throw new Error("Could not transition using the key for " + key.name + " because " + this._lock.name + " has the lock");
            }
          } else if (key) {
            throw new Error("Key provided for " + key.name + ", but the StateMachine was not locked (possibly due to preemption)");
          }
          if (!isValidTransition(this._states, this.state, newState)) {
            throw new Error('Cannot transition from "' + this.state + '" to "' + newState + '"');
          }
          this._state = newState;
          this.emit.apply(this, __spreadArray([], __read(["stateChanged", newState].concat(payload))));
        };
        StateMachine2.prototype.tryTransition = function(newState, key, payload) {
          try {
            this.transition(newState, key, payload);
          } catch (error) {
            return false;
          }
          return true;
        };
        StateMachine2.prototype.when = function(state) {
          var _this = this;
          if (this.state === state) {
            return Promise.resolve(this);
          } else if (!isValidTransition(this._reachableStates, this.state, state)) {
            return Promise.reject(createUnreachableError(this.state, state));
          }
          return this._whenPromise(function(newState, resolve, reject) {
            if (newState === state) {
              resolve(_this);
            } else if (!isValidTransition(_this._reachableStates, newState, state)) {
              reject(createUnreachableError(newState, state));
            }
          });
        };
        return StateMachine2;
      }(EventEmitter)
    );
    function isValidTransition(graph, from, to) {
      return graph.get(from).has(to);
    }
    function makeLock(name) {
      var lock = util.defer();
      lock.name = name;
      lock.depth = 0;
      return lock;
    }
    function reachable(graph) {
      return Array.from(graph.keys()).reduce(function(newGraph, from) {
        return newGraph.set(from, reachableFrom(graph, from));
      }, /* @__PURE__ */ new Map());
    }
    function reachableFrom(graph, from, to) {
      to = to || /* @__PURE__ */ new Set();
      graph.get(from).forEach(function(node) {
        if (!to.has(node)) {
          to.add(node);
          reachableFrom(graph, node, to).forEach(to.add, to);
        }
      });
      return to;
    }
    function transformStates(states) {
      var newStates = /* @__PURE__ */ new Map();
      for (var key in states) {
        newStates.set(key, new Set(states[key]));
      }
      return newStates;
    }
    function createUnreachableError(here, there) {
      return new Error('"' + there + '" cannot be reached from "' + here + '"');
    }
    module.exports = StateMachine;
  }
});

// node_modules/twilio-video/es5/util/networkmonitor.js
var require_networkmonitor = __commonJS({
  "node_modules/twilio-video/es5/util/networkmonitor.js"(exports, module) {
    "use strict";
    var NetworkMonitor = (
      /** @class */
      function() {
        function NetworkMonitor2(onNetworkChanged, options) {
          var _this = this;
          options = Object.assign({
            navigator,
            window
          }, options);
          var nav = options.navigator;
          var connection = nav.connection || { type: null };
          var type = connection.type;
          var _a = connection.type ? {
            _events: {
              value: ["change", "typechange"]
            },
            _listener: {
              value: function() {
                var networkChanged = type !== _this.type && _this.isOnline;
                type = _this.type;
                if (networkChanged) {
                  onNetworkChanged();
                }
              }
            },
            _target: {
              value: connection
            }
          } : {
            _events: {
              value: ["online"]
            },
            _listener: {
              value: onNetworkChanged
            },
            _target: {
              value: options.window
            }
          }, _events = _a._events, _listener = _a._listener, _target = _a._target;
          Object.defineProperties(this, {
            isOnline: {
              enumerable: true,
              get: function() {
                return typeof nav.onLine === "boolean" ? nav.onLine : true;
              }
            },
            type: {
              enumerable: true,
              get: function() {
                return connection.type || null;
              }
            },
            _listener,
            _events,
            _target
          });
        }
        NetworkMonitor2.prototype.start = function() {
          var _this = this;
          this._events.forEach(function(event) {
            _this._target.addEventListener(event, _this._listener);
          });
        };
        NetworkMonitor2.prototype.stop = function() {
          var _this = this;
          this._events.forEach(function(event) {
            _this._target.removeEventListener(event, _this._listener);
          });
        };
        return NetworkMonitor2;
      }()
    );
    module.exports = NetworkMonitor;
  }
});

// node_modules/twilio-video/es5/util/timeout.js
var require_timeout = __commonJS({
  "node_modules/twilio-video/es5/util/timeout.js"(exports, module) {
    "use strict";
    var Timeout = (
      /** @class */
      function() {
        function Timeout2(fn, delay, autoStart) {
          if (autoStart === void 0) {
            autoStart = true;
          }
          Object.defineProperties(this, {
            _delay: {
              value: delay,
              writable: true
            },
            _fn: {
              value: fn
            },
            _timeout: {
              value: null,
              writable: true
            }
          });
          if (autoStart) {
            this.start();
          }
        }
        Object.defineProperty(Timeout2.prototype, "delay", {
          /**
           * The {@link Timeout} delay in milliseconds.
           * @property {number}
           */
          get: function() {
            return this._delay;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Timeout2.prototype, "isSet", {
          /**
           * Whether the {@link Timeout} is set.
           * @property {boolean}
           */
          get: function() {
            return !!this._timeout;
          },
          enumerable: false,
          configurable: true
        });
        Timeout2.prototype.setDelay = function(delay) {
          this._delay = delay;
        };
        Timeout2.prototype.start = function() {
          var _this = this;
          if (!this.isSet) {
            this._timeout = setTimeout(function() {
              var fn = _this._fn;
              _this.clear();
              fn();
            }, this._delay);
          }
        };
        Timeout2.prototype.clear = function() {
          clearTimeout(this._timeout);
          this._timeout = null;
        };
        Timeout2.prototype.reset = function() {
          this.clear();
          this.start();
        };
        return Timeout2;
      }()
    );
    module.exports = Timeout;
  }
});

// node_modules/twilio-video/src/ws.js
var require_ws = __commonJS({
  "node_modules/twilio-video/src/ws.js"(exports, module) {
    module.exports = WebSocket;
  }
});

// node_modules/twilio-video/es5/twilioconnection.js
var require_twilioconnection = __commonJS({
  "node_modules/twilio-video/es5/twilioconnection.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var StateMachine = require_statemachine();
    var _a = require_util2();
    var buildLogLevels = _a.buildLogLevels;
    var makeUUID = _a.makeUUID;
    var Log = require_log();
    var NetworkMonitor = require_networkmonitor();
    var Timeout = require_timeout();
    var nInstances = 0;
    var states = {
      closed: [],
      connecting: ["closed", "open", "waiting"],
      early: ["closed", "connecting"],
      open: ["closed"],
      waiting: ["closed", "connecting", "early", "open"]
    };
    var events = {
      closed: "close",
      open: "open",
      waiting: "waiting"
    };
    var TCMP_VERSION = 2;
    var DEFAULT_MAX_CONSECUTIVE_MISSED_HEARTBEATS = 3;
    var DEFAULT_MAX_CONSECUTIVE_FAILED_HELLOS = 3;
    var DEFAULT_MAX_REQUESTED_HEARTBEAT_TIMEOUT = 5e3;
    var DEFAULT_OPEN_TIMEOUT = 15e3;
    var DEFAULT_WELCOME_TIMEOUT = 5e3;
    var OUTGOING_HEARTBEAT_OFFSET = 200;
    var WS_CLOSE_NORMAL = 1e3;
    var WS_CLOSE_WELCOME_TIMEOUT = 3e3;
    var WS_CLOSE_HEARTBEATS_MISSED = 3001;
    var WS_CLOSE_HELLO_FAILED = 3002;
    var WS_CLOSE_SEND_FAILED = 3003;
    var WS_CLOSE_NETWORK_CHANGED = 3004;
    var WS_CLOSE_BUSY_WAIT = 3005;
    var WS_CLOSE_SERVER_BUSY = 3006;
    var WS_CLOSE_OPEN_TIMEOUT = 3007;
    var toplevel = globalThis;
    var WebSocket2 = toplevel.WebSocket ? toplevel.WebSocket : require_ws();
    var CloseReason = {
      BUSY: "busy",
      FAILED: "failed",
      LOCAL: "local",
      REMOTE: "remote",
      TIMEOUT: "timeout"
    };
    var wsCloseCodesToCloseReasons = /* @__PURE__ */ new Map([
      [WS_CLOSE_WELCOME_TIMEOUT, CloseReason.TIMEOUT],
      [WS_CLOSE_HEARTBEATS_MISSED, CloseReason.TIMEOUT],
      [WS_CLOSE_HELLO_FAILED, CloseReason.FAILED],
      [WS_CLOSE_SEND_FAILED, CloseReason.FAILED],
      [WS_CLOSE_NETWORK_CHANGED, CloseReason.TIMEOUT],
      [WS_CLOSE_SERVER_BUSY, CloseReason.BUSY],
      [WS_CLOSE_OPEN_TIMEOUT, CloseReason.TIMEOUT]
    ]);
    var TwilioConnection = (
      /** @class */
      function(_super) {
        __extends(TwilioConnection2, _super);
        function TwilioConnection2(serverUrl, options) {
          var _this = _super.call(this, "early", states) || this;
          options = Object.assign({
            helloBody: null,
            maxConsecutiveFailedHellos: DEFAULT_MAX_CONSECUTIVE_FAILED_HELLOS,
            maxConsecutiveMissedHeartbeats: DEFAULT_MAX_CONSECUTIVE_MISSED_HEARTBEATS,
            requestedHeartbeatTimeout: DEFAULT_MAX_REQUESTED_HEARTBEAT_TIMEOUT,
            openTimeout: DEFAULT_OPEN_TIMEOUT,
            welcomeTimeout: DEFAULT_WELCOME_TIMEOUT,
            Log,
            WebSocket: WebSocket2
          }, options);
          var logLevels = buildLogLevels(options.logLevel);
          var log = new options.Log("default", _this, logLevels, options.loggerName);
          var networkMonitor = options.networkMonitor ? new NetworkMonitor(function() {
            var type = networkMonitor.type;
            var reason = "Network changed" + (type ? " to " + type : "");
            log.debug(reason);
            _this._close({ code: WS_CLOSE_NETWORK_CHANGED, reason });
          }) : null;
          Object.defineProperties(_this, {
            _busyWaitTimeout: {
              value: null,
              writable: true
            },
            _consecutiveHeartbeatsMissed: {
              value: 0,
              writable: true
            },
            _cookie: {
              value: null,
              writable: true
            },
            _eventObserver: {
              value: options.eventObserver
            },
            _heartbeatTimeout: {
              value: null,
              writable: true
            },
            _hellosLeft: {
              value: options.maxConsecutiveFailedHellos,
              writable: true
            },
            _instanceId: {
              value: ++nInstances
            },
            _log: {
              value: log
            },
            _messageQueue: {
              value: []
            },
            _networkMonitor: {
              value: networkMonitor
            },
            _options: {
              value: options
            },
            _openTimeout: {
              value: null,
              writable: true
            },
            _sendHeartbeatTimeout: {
              value: null,
              writable: true
            },
            _serverUrl: {
              value: serverUrl
            },
            _welcomeTimeout: {
              value: null,
              writable: true
            },
            _ws: {
              value: null,
              writable: true
            }
          });
          var eventsToLevels = {
            connecting: "info",
            early: "info",
            open: "info",
            waiting: "warning",
            closed: "info"
          };
          _this.on("stateChanged", function(state) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
              args[_i - 1] = arguments[_i];
            }
            if (state in events) {
              _this.emit.apply(_this, __spreadArray([events[state]], __read(args)));
            }
            var event = { name: state, group: "signaling", level: eventsToLevels[_this.state] };
            if (state === "closed") {
              var _a2 = __read(args, 1), reason = _a2[0];
              event.payload = { reason };
              event.level = reason === CloseReason.LOCAL ? "info" : "error";
            }
            _this._eventObserver.emit("event", event);
          });
          _this._eventObserver.emit("event", { name: _this.state, group: "signaling", level: eventsToLevels[_this.state] });
          _this._connect();
          return _this;
        }
        TwilioConnection2.prototype.toString = function() {
          return "[TwilioConnection #" + this._instanceId + ": " + this._ws.url + "]";
        };
        TwilioConnection2.prototype._close = function(_a2) {
          var code = _a2.code, reason = _a2.reason;
          if (this.state === "closed") {
            return;
          }
          if (this._openTimeout) {
            this._openTimeout.clear();
          }
          if (this._welcomeTimeout) {
            this._welcomeTimeout.clear();
          }
          if (this._heartbeatTimeout) {
            this._heartbeatTimeout.clear();
          }
          if (this._sendHeartbeatTimeout) {
            this._sendHeartbeatTimeout.clear();
          }
          if (this._networkMonitor) {
            this._networkMonitor.stop();
          }
          if (this._busyWaitTimeout && code !== WS_CLOSE_BUSY_WAIT) {
            this._busyWaitTimeout.clear();
          }
          this._messageQueue.splice(0);
          var log = this._log;
          if (code === WS_CLOSE_NORMAL) {
            log.debug("Closed");
            this.transition("closed", null, [CloseReason.LOCAL]);
          } else {
            log.warn("Closed: " + code + " - " + reason);
            if (code !== WS_CLOSE_BUSY_WAIT) {
              this.transition("closed", null, [
                wsCloseCodesToCloseReasons.get(code) || CloseReason.REMOTE
              ]);
            }
          }
          var readyState = this._ws.readyState;
          var WebSocket3 = this._options.WebSocket;
          if (readyState !== WebSocket3.CLOSING && readyState !== WebSocket3.CLOSED) {
            this._ws.close(code, reason);
          }
        };
        TwilioConnection2.prototype._connect = function() {
          var _this = this;
          var log = this._log;
          if (this.state === "waiting") {
            this.transition("early");
          } else if (this.state !== "early") {
            log.warn('Unexpected state "' + this.state + '" for connecting to the TCMP server.');
            return;
          }
          this._ws = new this._options.WebSocket(this._serverUrl);
          var ws = this._ws;
          log.debug("Created a new WebSocket:", ws);
          ws.addEventListener("close", function(event) {
            return _this._close(event);
          });
          var openTimeout = this._options.openTimeout;
          this._openTimeout = new Timeout(function() {
            var reason = "Failed to open in " + openTimeout + " ms";
            _this._close({ code: WS_CLOSE_OPEN_TIMEOUT, reason });
          }, openTimeout);
          ws.addEventListener("open", function() {
            log.debug("WebSocket opened:", ws);
            _this._openTimeout.clear();
            _this._startHandshake();
            if (_this._networkMonitor) {
              _this._networkMonitor.start();
            }
          });
          ws.addEventListener("message", function(message) {
            log.debug("Incoming: " + message.data);
            try {
              message = JSON.parse(message.data);
            } catch (error) {
              _this.emit("error", error);
              return;
            }
            switch (message.type) {
              case "bad":
                _this._handleBad(message);
                break;
              case "busy":
                _this._handleBusy(message);
                break;
              case "bye":
                break;
              case "msg":
                _this._handleMessage(message);
              case "heartbeat":
                _this._handleHeartbeat();
                break;
              case "welcome":
                _this._handleWelcome(message);
                break;
              default:
                _this._log.debug("Unknown message type: " + message.type);
                _this.emit("error", new Error("Unknown message type: " + message.type));
                break;
            }
          });
        };
        TwilioConnection2.prototype._handleBad = function(_a2) {
          var reason = _a2.reason;
          var log = this._log;
          if (!["connecting", "open"].includes(this.state)) {
            log.warn('Unexpected state "' + this.state + '" for handling a "bad" message from the TCMP server.');
            return;
          }
          if (this.state === "connecting") {
            log.warn("Closing: " + WS_CLOSE_HELLO_FAILED + " - " + reason);
            this._close({ code: WS_CLOSE_HELLO_FAILED, reason });
            return;
          }
          log.debug("Error: " + reason);
          this.emit("error", new Error(reason));
        };
        TwilioConnection2.prototype._handleBusy = function(_a2) {
          var _this = this;
          var cookie = _a2.cookie, keepAlive = _a2.keepAlive, retryAfter = _a2.retryAfter;
          var log = this._log;
          if (!["connecting", "waiting"].includes(this.state)) {
            log.warn('Unexpected state "' + this.state + '" for handling a "busy" message from the TCMP server.');
            return;
          }
          if (this._busyWaitTimeout) {
            this._busyWaitTimeout.clear();
          }
          if (this._welcomeTimeout) {
            this._welcomeTimeout.clear();
          }
          var reason = retryAfter < 0 ? 'Received terminal "busy" message' : 'Received "busy" message, retrying after ' + retryAfter + " ms";
          if (retryAfter < 0) {
            log.warn("Closing: " + WS_CLOSE_SERVER_BUSY + " - " + reason);
            this._close({ code: WS_CLOSE_SERVER_BUSY, reason });
            return;
          }
          var maxConsecutiveFailedHellos = this._options.maxConsecutiveFailedHellos;
          this._hellosLeft = maxConsecutiveFailedHellos;
          this._cookie = cookie || null;
          if (keepAlive) {
            log.warn(reason);
            this._busyWaitTimeout = new Timeout(function() {
              return _this._startHandshake();
            }, retryAfter);
          } else {
            log.warn("Closing: " + WS_CLOSE_BUSY_WAIT + " - " + reason);
            this._close({ code: WS_CLOSE_BUSY_WAIT, reason });
            this._busyWaitTimeout = new Timeout(function() {
              return _this._connect();
            }, retryAfter);
          }
          this.transition("waiting", null, [keepAlive, retryAfter]);
        };
        TwilioConnection2.prototype._handleHeartbeat = function() {
          if (this.state !== "open") {
            this._log.warn('Unexpected state "' + this.state + '" for handling a "heartbeat" message from the TCMP server.');
            return;
          }
          this._heartbeatTimeout.reset();
        };
        TwilioConnection2.prototype._handleHeartbeatTimeout = function() {
          if (this.state !== "open") {
            return;
          }
          var log = this._log;
          var maxConsecutiveMissedHeartbeats = this._options.maxConsecutiveMissedHeartbeats;
          log.debug("Consecutive heartbeats missed: " + maxConsecutiveMissedHeartbeats);
          var reason = "Missed " + maxConsecutiveMissedHeartbeats + ' "heartbeat" messages';
          log.warn("Closing: " + WS_CLOSE_HEARTBEATS_MISSED + " - " + reason);
          this._close({ code: WS_CLOSE_HEARTBEATS_MISSED, reason });
        };
        TwilioConnection2.prototype._handleMessage = function(_a2) {
          var body = _a2.body;
          if (this.state !== "open") {
            this._log.warn('Unexpected state "' + this.state + '" for handling a "msg" message from the TCMP server.');
            return;
          }
          this.emit("message", body);
        };
        TwilioConnection2.prototype._handleWelcome = function(_a2) {
          var _this = this;
          var negotiatedTimeout = _a2.negotiatedTimeout;
          var log = this._log;
          if (!["connecting", "waiting"].includes(this.state)) {
            log.warn('Unexpected state "' + this.state + '" for handling a "welcome" message from the TCMP server.');
            return;
          }
          if (this.state === "waiting") {
            log.debug('Received "welcome" message, no need to retry connection.');
            this._busyWaitTimeout.clear();
          }
          var maxConsecutiveMissedHeartbeats = this._options.maxConsecutiveMissedHeartbeats;
          var heartbeatTimeout = negotiatedTimeout * maxConsecutiveMissedHeartbeats;
          var outgoingHeartbeatTimeout = negotiatedTimeout - OUTGOING_HEARTBEAT_OFFSET;
          this._welcomeTimeout.clear();
          this._heartbeatTimeout = new Timeout(function() {
            return _this._handleHeartbeatTimeout();
          }, heartbeatTimeout);
          this._messageQueue.splice(0).forEach(function(message) {
            return _this._send(message);
          });
          this._sendHeartbeatTimeout = new Timeout(function() {
            return _this._sendHeartbeat();
          }, outgoingHeartbeatTimeout);
          this.transition("open");
        };
        TwilioConnection2.prototype._handleWelcomeTimeout = function() {
          if (this.state !== "connecting") {
            return;
          }
          var log = this._log;
          if (this._hellosLeft <= 0) {
            var reason = "All handshake attempts failed";
            log.warn("Closing: " + WS_CLOSE_WELCOME_TIMEOUT + " - " + reason);
            this._close({ code: WS_CLOSE_WELCOME_TIMEOUT, reason });
            return;
          }
          var maxConsecutiveFailedHellos = this._options.maxConsecutiveFailedHellos;
          log.warn("Handshake attempt " + (maxConsecutiveFailedHellos - this._hellosLeft) + " failed");
          this._startHandshake();
        };
        TwilioConnection2.prototype._send = function(message) {
          var readyState = this._ws.readyState;
          var WebSocket3 = this._options.WebSocket;
          if (readyState === WebSocket3.OPEN) {
            var data = JSON.stringify(message);
            this._log.debug("Outgoing: " + data);
            try {
              this._ws.send(data);
              if (this._sendHeartbeatTimeout) {
                this._sendHeartbeatTimeout.reset();
              }
            } catch (error) {
              var reason = "Failed to send message";
              this._log.warn("Closing: " + WS_CLOSE_SEND_FAILED + " - " + reason);
              this._close({ code: WS_CLOSE_SEND_FAILED, reason });
            }
          }
        };
        TwilioConnection2.prototype._sendHeartbeat = function() {
          if (this.state === "closed") {
            return;
          }
          this._send({ type: "heartbeat" });
        };
        TwilioConnection2.prototype._sendHello = function() {
          var _a2 = this._options, helloBody = _a2.helloBody, timeout = _a2.requestedHeartbeatTimeout;
          var hello = {
            id: makeUUID(),
            timeout,
            type: "hello",
            version: TCMP_VERSION
          };
          if (this._cookie) {
            hello.cookie = this._cookie;
          }
          if (helloBody) {
            hello.body = helloBody;
          }
          this._send(hello);
        };
        TwilioConnection2.prototype._sendOrEnqueue = function(message) {
          var _this = this;
          if (this.state === "closed") {
            return;
          }
          var sendOrEnqueue = this.state === "open" ? function(message2) {
            return _this._send(message2);
          } : function(message2) {
            return _this._messageQueue.push(message2);
          };
          sendOrEnqueue(message);
        };
        TwilioConnection2.prototype._startHandshake = function() {
          var _this = this;
          if (["early", "waiting"].includes(this.state)) {
            this.transition("connecting");
          }
          if (this.state !== "connecting") {
            return;
          }
          this._hellosLeft--;
          this._sendHello();
          var welcomeTimeout = this._options.welcomeTimeout;
          this._welcomeTimeout = new Timeout(function() {
            return _this._handleWelcomeTimeout();
          }, welcomeTimeout);
        };
        TwilioConnection2.prototype.close = function() {
          if (this.state === "closed") {
            return;
          }
          this._sendOrEnqueue({ type: "bye" });
          this._close({ code: WS_CLOSE_NORMAL, reason: "Normal" });
        };
        TwilioConnection2.prototype.sendMessage = function(body) {
          this._sendOrEnqueue({ body, type: "msg" });
        };
        return TwilioConnection2;
      }(StateMachine)
    );
    TwilioConnection.CloseReason = CloseReason;
    module.exports = TwilioConnection;
  }
});

// node_modules/twilio-video/es5/util/twilioerror.js
var require_twilioerror = __commonJS({
  "node_modules/twilio-video/es5/util/twilioerror.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var TwilioError = (
      /** @class */
      function(_super) {
        __extends(TwilioError2, _super);
        function TwilioError2(code) {
          var _this = this;
          var args = [].slice.call(arguments, 1);
          _this = _super.apply(this, __spreadArray([], __read(args))) || this;
          Object.setPrototypeOf(_this, TwilioError2.prototype);
          var error = Error.apply(_this, args);
          error.name = "TwilioError";
          Object.defineProperty(_this, "code", {
            value: code,
            enumerable: true
          });
          Object.getOwnPropertyNames(error).forEach(function(prop) {
            Object.defineProperty(this, prop, {
              value: error[prop],
              enumerable: true
            });
          }, _this);
          return _this;
        }
        TwilioError2.prototype.toString = function() {
          var message = this.message ? ": " + this.message : "";
          return this.name + " " + this.code + message;
        };
        return TwilioError2;
      }(Error)
    );
    module.exports = TwilioError;
  }
});

// node_modules/twilio-video/es5/util/twilio-video-errors.js
var require_twilio_video_errors = __commonJS({
  "node_modules/twilio-video/es5/util/twilio-video-errors.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var TwilioError = require_twilioerror();
    var TwilioErrorByCode = {};
    exports.createTwilioError = function createTwilioError(code, message) {
      code = typeof code === "number" ? code : 0;
      message = typeof message === "string" && message ? message : "Unknown error";
      return TwilioErrorByCode[code] ? new TwilioErrorByCode[code]() : new TwilioError(code, message);
    };
    var AccessTokenInvalidError = (
      /** @class */
      function(_super) {
        __extends(AccessTokenInvalidError2, _super);
        function AccessTokenInvalidError2() {
          var _this = _super.call(this, 20101, "Invalid Access Token") || this;
          Object.setPrototypeOf(_this, AccessTokenInvalidError2.prototype);
          return _this;
        }
        return AccessTokenInvalidError2;
      }(TwilioError)
    );
    exports.AccessTokenInvalidError = AccessTokenInvalidError;
    Object.defineProperty(TwilioErrorByCode, 20101, { value: AccessTokenInvalidError });
    var AccessTokenHeaderInvalidError = (
      /** @class */
      function(_super) {
        __extends(AccessTokenHeaderInvalidError2, _super);
        function AccessTokenHeaderInvalidError2() {
          var _this = _super.call(this, 20102, "Invalid Access Token header") || this;
          Object.setPrototypeOf(_this, AccessTokenHeaderInvalidError2.prototype);
          return _this;
        }
        return AccessTokenHeaderInvalidError2;
      }(TwilioError)
    );
    exports.AccessTokenHeaderInvalidError = AccessTokenHeaderInvalidError;
    Object.defineProperty(TwilioErrorByCode, 20102, { value: AccessTokenHeaderInvalidError });
    var AccessTokenIssuerInvalidError = (
      /** @class */
      function(_super) {
        __extends(AccessTokenIssuerInvalidError2, _super);
        function AccessTokenIssuerInvalidError2() {
          var _this = _super.call(this, 20103, "Invalid Access Token issuer/subject") || this;
          Object.setPrototypeOf(_this, AccessTokenIssuerInvalidError2.prototype);
          return _this;
        }
        return AccessTokenIssuerInvalidError2;
      }(TwilioError)
    );
    exports.AccessTokenIssuerInvalidError = AccessTokenIssuerInvalidError;
    Object.defineProperty(TwilioErrorByCode, 20103, { value: AccessTokenIssuerInvalidError });
    var AccessTokenExpiredError = (
      /** @class */
      function(_super) {
        __extends(AccessTokenExpiredError2, _super);
        function AccessTokenExpiredError2() {
          var _this = _super.call(this, 20104, "Access Token expired or expiration date invalid") || this;
          Object.setPrototypeOf(_this, AccessTokenExpiredError2.prototype);
          return _this;
        }
        return AccessTokenExpiredError2;
      }(TwilioError)
    );
    exports.AccessTokenExpiredError = AccessTokenExpiredError;
    Object.defineProperty(TwilioErrorByCode, 20104, { value: AccessTokenExpiredError });
    var AccessTokenNotYetValidError = (
      /** @class */
      function(_super) {
        __extends(AccessTokenNotYetValidError2, _super);
        function AccessTokenNotYetValidError2() {
          var _this = _super.call(this, 20105, "Access Token not yet valid") || this;
          Object.setPrototypeOf(_this, AccessTokenNotYetValidError2.prototype);
          return _this;
        }
        return AccessTokenNotYetValidError2;
      }(TwilioError)
    );
    exports.AccessTokenNotYetValidError = AccessTokenNotYetValidError;
    Object.defineProperty(TwilioErrorByCode, 20105, { value: AccessTokenNotYetValidError });
    var AccessTokenGrantsInvalidError = (
      /** @class */
      function(_super) {
        __extends(AccessTokenGrantsInvalidError2, _super);
        function AccessTokenGrantsInvalidError2() {
          var _this = _super.call(this, 20106, "Invalid Access Token grants") || this;
          Object.setPrototypeOf(_this, AccessTokenGrantsInvalidError2.prototype);
          return _this;
        }
        return AccessTokenGrantsInvalidError2;
      }(TwilioError)
    );
    exports.AccessTokenGrantsInvalidError = AccessTokenGrantsInvalidError;
    Object.defineProperty(TwilioErrorByCode, 20106, { value: AccessTokenGrantsInvalidError });
    var AccessTokenSignatureInvalidError = (
      /** @class */
      function(_super) {
        __extends(AccessTokenSignatureInvalidError2, _super);
        function AccessTokenSignatureInvalidError2() {
          var _this = _super.call(this, 20107, "Invalid Access Token signature") || this;
          Object.setPrototypeOf(_this, AccessTokenSignatureInvalidError2.prototype);
          return _this;
        }
        return AccessTokenSignatureInvalidError2;
      }(TwilioError)
    );
    exports.AccessTokenSignatureInvalidError = AccessTokenSignatureInvalidError;
    Object.defineProperty(TwilioErrorByCode, 20107, { value: AccessTokenSignatureInvalidError });
    var SignalingConnectionError = (
      /** @class */
      function(_super) {
        __extends(SignalingConnectionError2, _super);
        function SignalingConnectionError2() {
          var _this = _super.call(this, 53e3, "Signaling connection error") || this;
          Object.setPrototypeOf(_this, SignalingConnectionError2.prototype);
          return _this;
        }
        return SignalingConnectionError2;
      }(TwilioError)
    );
    exports.SignalingConnectionError = SignalingConnectionError;
    Object.defineProperty(TwilioErrorByCode, 53e3, { value: SignalingConnectionError });
    var SignalingConnectionDisconnectedError = (
      /** @class */
      function(_super) {
        __extends(SignalingConnectionDisconnectedError2, _super);
        function SignalingConnectionDisconnectedError2() {
          var _this = _super.call(this, 53001, "Signaling connection disconnected") || this;
          Object.setPrototypeOf(_this, SignalingConnectionDisconnectedError2.prototype);
          return _this;
        }
        return SignalingConnectionDisconnectedError2;
      }(TwilioError)
    );
    exports.SignalingConnectionDisconnectedError = SignalingConnectionDisconnectedError;
    Object.defineProperty(TwilioErrorByCode, 53001, { value: SignalingConnectionDisconnectedError });
    var SignalingConnectionTimeoutError = (
      /** @class */
      function(_super) {
        __extends(SignalingConnectionTimeoutError2, _super);
        function SignalingConnectionTimeoutError2() {
          var _this = _super.call(this, 53002, "Signaling connection timed out") || this;
          Object.setPrototypeOf(_this, SignalingConnectionTimeoutError2.prototype);
          return _this;
        }
        return SignalingConnectionTimeoutError2;
      }(TwilioError)
    );
    exports.SignalingConnectionTimeoutError = SignalingConnectionTimeoutError;
    Object.defineProperty(TwilioErrorByCode, 53002, { value: SignalingConnectionTimeoutError });
    var SignalingIncomingMessageInvalidError = (
      /** @class */
      function(_super) {
        __extends(SignalingIncomingMessageInvalidError2, _super);
        function SignalingIncomingMessageInvalidError2() {
          var _this = _super.call(this, 53003, "Client received an invalid signaling message") || this;
          Object.setPrototypeOf(_this, SignalingIncomingMessageInvalidError2.prototype);
          return _this;
        }
        return SignalingIncomingMessageInvalidError2;
      }(TwilioError)
    );
    exports.SignalingIncomingMessageInvalidError = SignalingIncomingMessageInvalidError;
    Object.defineProperty(TwilioErrorByCode, 53003, { value: SignalingIncomingMessageInvalidError });
    var SignalingOutgoingMessageInvalidError = (
      /** @class */
      function(_super) {
        __extends(SignalingOutgoingMessageInvalidError2, _super);
        function SignalingOutgoingMessageInvalidError2() {
          var _this = _super.call(this, 53004, "Client sent an invalid signaling message") || this;
          Object.setPrototypeOf(_this, SignalingOutgoingMessageInvalidError2.prototype);
          return _this;
        }
        return SignalingOutgoingMessageInvalidError2;
      }(TwilioError)
    );
    exports.SignalingOutgoingMessageInvalidError = SignalingOutgoingMessageInvalidError;
    Object.defineProperty(TwilioErrorByCode, 53004, { value: SignalingOutgoingMessageInvalidError });
    var SignalingServerBusyError = (
      /** @class */
      function(_super) {
        __extends(SignalingServerBusyError2, _super);
        function SignalingServerBusyError2() {
          var _this = _super.call(this, 53006, "Video server is busy") || this;
          Object.setPrototypeOf(_this, SignalingServerBusyError2.prototype);
          return _this;
        }
        return SignalingServerBusyError2;
      }(TwilioError)
    );
    exports.SignalingServerBusyError = SignalingServerBusyError;
    Object.defineProperty(TwilioErrorByCode, 53006, { value: SignalingServerBusyError });
    var RoomNameInvalidError = (
      /** @class */
      function(_super) {
        __extends(RoomNameInvalidError2, _super);
        function RoomNameInvalidError2() {
          var _this = _super.call(this, 53100, "Room name is invalid") || this;
          Object.setPrototypeOf(_this, RoomNameInvalidError2.prototype);
          return _this;
        }
        return RoomNameInvalidError2;
      }(TwilioError)
    );
    exports.RoomNameInvalidError = RoomNameInvalidError;
    Object.defineProperty(TwilioErrorByCode, 53100, { value: RoomNameInvalidError });
    var RoomNameTooLongError = (
      /** @class */
      function(_super) {
        __extends(RoomNameTooLongError2, _super);
        function RoomNameTooLongError2() {
          var _this = _super.call(this, 53101, "Room name is too long") || this;
          Object.setPrototypeOf(_this, RoomNameTooLongError2.prototype);
          return _this;
        }
        return RoomNameTooLongError2;
      }(TwilioError)
    );
    exports.RoomNameTooLongError = RoomNameTooLongError;
    Object.defineProperty(TwilioErrorByCode, 53101, { value: RoomNameTooLongError });
    var RoomNameCharsInvalidError = (
      /** @class */
      function(_super) {
        __extends(RoomNameCharsInvalidError2, _super);
        function RoomNameCharsInvalidError2() {
          var _this = _super.call(this, 53102, "Room name contains invalid characters") || this;
          Object.setPrototypeOf(_this, RoomNameCharsInvalidError2.prototype);
          return _this;
        }
        return RoomNameCharsInvalidError2;
      }(TwilioError)
    );
    exports.RoomNameCharsInvalidError = RoomNameCharsInvalidError;
    Object.defineProperty(TwilioErrorByCode, 53102, { value: RoomNameCharsInvalidError });
    var RoomCreateFailedError = (
      /** @class */
      function(_super) {
        __extends(RoomCreateFailedError2, _super);
        function RoomCreateFailedError2() {
          var _this = _super.call(this, 53103, "Unable to create Room") || this;
          Object.setPrototypeOf(_this, RoomCreateFailedError2.prototype);
          return _this;
        }
        return RoomCreateFailedError2;
      }(TwilioError)
    );
    exports.RoomCreateFailedError = RoomCreateFailedError;
    Object.defineProperty(TwilioErrorByCode, 53103, { value: RoomCreateFailedError });
    var RoomConnectFailedError = (
      /** @class */
      function(_super) {
        __extends(RoomConnectFailedError2, _super);
        function RoomConnectFailedError2() {
          var _this = _super.call(this, 53104, "Unable to connect to Room") || this;
          Object.setPrototypeOf(_this, RoomConnectFailedError2.prototype);
          return _this;
        }
        return RoomConnectFailedError2;
      }(TwilioError)
    );
    exports.RoomConnectFailedError = RoomConnectFailedError;
    Object.defineProperty(TwilioErrorByCode, 53104, { value: RoomConnectFailedError });
    var RoomMaxParticipantsExceededError = (
      /** @class */
      function(_super) {
        __extends(RoomMaxParticipantsExceededError2, _super);
        function RoomMaxParticipantsExceededError2() {
          var _this = _super.call(this, 53105, "Room contains too many Participants") || this;
          Object.setPrototypeOf(_this, RoomMaxParticipantsExceededError2.prototype);
          return _this;
        }
        return RoomMaxParticipantsExceededError2;
      }(TwilioError)
    );
    exports.RoomMaxParticipantsExceededError = RoomMaxParticipantsExceededError;
    Object.defineProperty(TwilioErrorByCode, 53105, { value: RoomMaxParticipantsExceededError });
    var RoomNotFoundError = (
      /** @class */
      function(_super) {
        __extends(RoomNotFoundError2, _super);
        function RoomNotFoundError2() {
          var _this = _super.call(this, 53106, "Room not found") || this;
          Object.setPrototypeOf(_this, RoomNotFoundError2.prototype);
          return _this;
        }
        return RoomNotFoundError2;
      }(TwilioError)
    );
    exports.RoomNotFoundError = RoomNotFoundError;
    Object.defineProperty(TwilioErrorByCode, 53106, { value: RoomNotFoundError });
    var RoomMaxParticipantsOutOfRangeError = (
      /** @class */
      function(_super) {
        __extends(RoomMaxParticipantsOutOfRangeError2, _super);
        function RoomMaxParticipantsOutOfRangeError2() {
          var _this = _super.call(this, 53107, "MaxParticipants is out of range") || this;
          Object.setPrototypeOf(_this, RoomMaxParticipantsOutOfRangeError2.prototype);
          return _this;
        }
        return RoomMaxParticipantsOutOfRangeError2;
      }(TwilioError)
    );
    exports.RoomMaxParticipantsOutOfRangeError = RoomMaxParticipantsOutOfRangeError;
    Object.defineProperty(TwilioErrorByCode, 53107, { value: RoomMaxParticipantsOutOfRangeError });
    var RoomTypeInvalidError = (
      /** @class */
      function(_super) {
        __extends(RoomTypeInvalidError2, _super);
        function RoomTypeInvalidError2() {
          var _this = _super.call(this, 53108, "RoomType is not valid") || this;
          Object.setPrototypeOf(_this, RoomTypeInvalidError2.prototype);
          return _this;
        }
        return RoomTypeInvalidError2;
      }(TwilioError)
    );
    exports.RoomTypeInvalidError = RoomTypeInvalidError;
    Object.defineProperty(TwilioErrorByCode, 53108, { value: RoomTypeInvalidError });
    var RoomTimeoutOutOfRangeError = (
      /** @class */
      function(_super) {
        __extends(RoomTimeoutOutOfRangeError2, _super);
        function RoomTimeoutOutOfRangeError2() {
          var _this = _super.call(this, 53109, "Timeout is out of range") || this;
          Object.setPrototypeOf(_this, RoomTimeoutOutOfRangeError2.prototype);
          return _this;
        }
        return RoomTimeoutOutOfRangeError2;
      }(TwilioError)
    );
    exports.RoomTimeoutOutOfRangeError = RoomTimeoutOutOfRangeError;
    Object.defineProperty(TwilioErrorByCode, 53109, { value: RoomTimeoutOutOfRangeError });
    var RoomStatusCallbackMethodInvalidError = (
      /** @class */
      function(_super) {
        __extends(RoomStatusCallbackMethodInvalidError2, _super);
        function RoomStatusCallbackMethodInvalidError2() {
          var _this = _super.call(this, 53110, "StatusCallbackMethod is invalid") || this;
          Object.setPrototypeOf(_this, RoomStatusCallbackMethodInvalidError2.prototype);
          return _this;
        }
        return RoomStatusCallbackMethodInvalidError2;
      }(TwilioError)
    );
    exports.RoomStatusCallbackMethodInvalidError = RoomStatusCallbackMethodInvalidError;
    Object.defineProperty(TwilioErrorByCode, 53110, { value: RoomStatusCallbackMethodInvalidError });
    var RoomStatusCallbackInvalidError = (
      /** @class */
      function(_super) {
        __extends(RoomStatusCallbackInvalidError2, _super);
        function RoomStatusCallbackInvalidError2() {
          var _this = _super.call(this, 53111, "StatusCallback is invalid") || this;
          Object.setPrototypeOf(_this, RoomStatusCallbackInvalidError2.prototype);
          return _this;
        }
        return RoomStatusCallbackInvalidError2;
      }(TwilioError)
    );
    exports.RoomStatusCallbackInvalidError = RoomStatusCallbackInvalidError;
    Object.defineProperty(TwilioErrorByCode, 53111, { value: RoomStatusCallbackInvalidError });
    var RoomStatusInvalidError = (
      /** @class */
      function(_super) {
        __extends(RoomStatusInvalidError2, _super);
        function RoomStatusInvalidError2() {
          var _this = _super.call(this, 53112, "Status is invalid") || this;
          Object.setPrototypeOf(_this, RoomStatusInvalidError2.prototype);
          return _this;
        }
        return RoomStatusInvalidError2;
      }(TwilioError)
    );
    exports.RoomStatusInvalidError = RoomStatusInvalidError;
    Object.defineProperty(TwilioErrorByCode, 53112, { value: RoomStatusInvalidError });
    var RoomRoomExistsError = (
      /** @class */
      function(_super) {
        __extends(RoomRoomExistsError2, _super);
        function RoomRoomExistsError2() {
          var _this = _super.call(this, 53113, "Room exists") || this;
          Object.setPrototypeOf(_this, RoomRoomExistsError2.prototype);
          return _this;
        }
        return RoomRoomExistsError2;
      }(TwilioError)
    );
    exports.RoomRoomExistsError = RoomRoomExistsError;
    Object.defineProperty(TwilioErrorByCode, 53113, { value: RoomRoomExistsError });
    var RoomInvalidParametersError = (
      /** @class */
      function(_super) {
        __extends(RoomInvalidParametersError2, _super);
        function RoomInvalidParametersError2() {
          var _this = _super.call(this, 53114, "Room creation parameter(s) incompatible with the Room type") || this;
          Object.setPrototypeOf(_this, RoomInvalidParametersError2.prototype);
          return _this;
        }
        return RoomInvalidParametersError2;
      }(TwilioError)
    );
    exports.RoomInvalidParametersError = RoomInvalidParametersError;
    Object.defineProperty(TwilioErrorByCode, 53114, { value: RoomInvalidParametersError });
    var RoomMediaRegionInvalidError = (
      /** @class */
      function(_super) {
        __extends(RoomMediaRegionInvalidError2, _super);
        function RoomMediaRegionInvalidError2() {
          var _this = _super.call(this, 53115, "MediaRegion is invalid") || this;
          Object.setPrototypeOf(_this, RoomMediaRegionInvalidError2.prototype);
          return _this;
        }
        return RoomMediaRegionInvalidError2;
      }(TwilioError)
    );
    exports.RoomMediaRegionInvalidError = RoomMediaRegionInvalidError;
    Object.defineProperty(TwilioErrorByCode, 53115, { value: RoomMediaRegionInvalidError });
    var RoomMediaRegionUnavailableError = (
      /** @class */
      function(_super) {
        __extends(RoomMediaRegionUnavailableError2, _super);
        function RoomMediaRegionUnavailableError2() {
          var _this = _super.call(this, 53116, "There are no media servers available in the MediaRegion") || this;
          Object.setPrototypeOf(_this, RoomMediaRegionUnavailableError2.prototype);
          return _this;
        }
        return RoomMediaRegionUnavailableError2;
      }(TwilioError)
    );
    exports.RoomMediaRegionUnavailableError = RoomMediaRegionUnavailableError;
    Object.defineProperty(TwilioErrorByCode, 53116, { value: RoomMediaRegionUnavailableError });
    var RoomSubscriptionOperationNotSupportedError = (
      /** @class */
      function(_super) {
        __extends(RoomSubscriptionOperationNotSupportedError2, _super);
        function RoomSubscriptionOperationNotSupportedError2() {
          var _this = _super.call(this, 53117, "The subscription operation requested is not supported for the Room type") || this;
          Object.setPrototypeOf(_this, RoomSubscriptionOperationNotSupportedError2.prototype);
          return _this;
        }
        return RoomSubscriptionOperationNotSupportedError2;
      }(TwilioError)
    );
    exports.RoomSubscriptionOperationNotSupportedError = RoomSubscriptionOperationNotSupportedError;
    Object.defineProperty(TwilioErrorByCode, 53117, { value: RoomSubscriptionOperationNotSupportedError });
    var RoomCompletedError = (
      /** @class */
      function(_super) {
        __extends(RoomCompletedError2, _super);
        function RoomCompletedError2() {
          var _this = _super.call(this, 53118, "Room completed") || this;
          Object.setPrototypeOf(_this, RoomCompletedError2.prototype);
          return _this;
        }
        return RoomCompletedError2;
      }(TwilioError)
    );
    exports.RoomCompletedError = RoomCompletedError;
    Object.defineProperty(TwilioErrorByCode, 53118, { value: RoomCompletedError });
    var RoomAudioOnlyFlagNotSupportedError = (
      /** @class */
      function(_super) {
        __extends(RoomAudioOnlyFlagNotSupportedError2, _super);
        function RoomAudioOnlyFlagNotSupportedError2() {
          var _this = _super.call(this, 53124, "The AudioOnly flag is not supported for the Room type") || this;
          Object.setPrototypeOf(_this, RoomAudioOnlyFlagNotSupportedError2.prototype);
          return _this;
        }
        return RoomAudioOnlyFlagNotSupportedError2;
      }(TwilioError)
    );
    exports.RoomAudioOnlyFlagNotSupportedError = RoomAudioOnlyFlagNotSupportedError;
    Object.defineProperty(TwilioErrorByCode, 53124, { value: RoomAudioOnlyFlagNotSupportedError });
    var RoomTrackKindNotSupportedError = (
      /** @class */
      function(_super) {
        __extends(RoomTrackKindNotSupportedError2, _super);
        function RoomTrackKindNotSupportedError2() {
          var _this = _super.call(this, 53125, "The track kind is not supported by the Room") || this;
          Object.setPrototypeOf(_this, RoomTrackKindNotSupportedError2.prototype);
          return _this;
        }
        return RoomTrackKindNotSupportedError2;
      }(TwilioError)
    );
    exports.RoomTrackKindNotSupportedError = RoomTrackKindNotSupportedError;
    Object.defineProperty(TwilioErrorByCode, 53125, { value: RoomTrackKindNotSupportedError });
    var ParticipantIdentityInvalidError = (
      /** @class */
      function(_super) {
        __extends(ParticipantIdentityInvalidError2, _super);
        function ParticipantIdentityInvalidError2() {
          var _this = _super.call(this, 53200, "Participant identity is invalid") || this;
          Object.setPrototypeOf(_this, ParticipantIdentityInvalidError2.prototype);
          return _this;
        }
        return ParticipantIdentityInvalidError2;
      }(TwilioError)
    );
    exports.ParticipantIdentityInvalidError = ParticipantIdentityInvalidError;
    Object.defineProperty(TwilioErrorByCode, 53200, { value: ParticipantIdentityInvalidError });
    var ParticipantIdentityTooLongError = (
      /** @class */
      function(_super) {
        __extends(ParticipantIdentityTooLongError2, _super);
        function ParticipantIdentityTooLongError2() {
          var _this = _super.call(this, 53201, "Participant identity is too long") || this;
          Object.setPrototypeOf(_this, ParticipantIdentityTooLongError2.prototype);
          return _this;
        }
        return ParticipantIdentityTooLongError2;
      }(TwilioError)
    );
    exports.ParticipantIdentityTooLongError = ParticipantIdentityTooLongError;
    Object.defineProperty(TwilioErrorByCode, 53201, { value: ParticipantIdentityTooLongError });
    var ParticipantIdentityCharsInvalidError = (
      /** @class */
      function(_super) {
        __extends(ParticipantIdentityCharsInvalidError2, _super);
        function ParticipantIdentityCharsInvalidError2() {
          var _this = _super.call(this, 53202, "Participant identity contains invalid characters") || this;
          Object.setPrototypeOf(_this, ParticipantIdentityCharsInvalidError2.prototype);
          return _this;
        }
        return ParticipantIdentityCharsInvalidError2;
      }(TwilioError)
    );
    exports.ParticipantIdentityCharsInvalidError = ParticipantIdentityCharsInvalidError;
    Object.defineProperty(TwilioErrorByCode, 53202, { value: ParticipantIdentityCharsInvalidError });
    var ParticipantMaxTracksExceededError = (
      /** @class */
      function(_super) {
        __extends(ParticipantMaxTracksExceededError2, _super);
        function ParticipantMaxTracksExceededError2() {
          var _this = _super.call(this, 53203, "The maximum number of published tracks allowed in the Room at the same time has been reached") || this;
          Object.setPrototypeOf(_this, ParticipantMaxTracksExceededError2.prototype);
          return _this;
        }
        return ParticipantMaxTracksExceededError2;
      }(TwilioError)
    );
    exports.ParticipantMaxTracksExceededError = ParticipantMaxTracksExceededError;
    Object.defineProperty(TwilioErrorByCode, 53203, { value: ParticipantMaxTracksExceededError });
    var ParticipantNotFoundError = (
      /** @class */
      function(_super) {
        __extends(ParticipantNotFoundError2, _super);
        function ParticipantNotFoundError2() {
          var _this = _super.call(this, 53204, "Participant not found") || this;
          Object.setPrototypeOf(_this, ParticipantNotFoundError2.prototype);
          return _this;
        }
        return ParticipantNotFoundError2;
      }(TwilioError)
    );
    exports.ParticipantNotFoundError = ParticipantNotFoundError;
    Object.defineProperty(TwilioErrorByCode, 53204, { value: ParticipantNotFoundError });
    var ParticipantDuplicateIdentityError = (
      /** @class */
      function(_super) {
        __extends(ParticipantDuplicateIdentityError2, _super);
        function ParticipantDuplicateIdentityError2() {
          var _this = _super.call(this, 53205, "Participant disconnected because of duplicate identity") || this;
          Object.setPrototypeOf(_this, ParticipantDuplicateIdentityError2.prototype);
          return _this;
        }
        return ParticipantDuplicateIdentityError2;
      }(TwilioError)
    );
    exports.ParticipantDuplicateIdentityError = ParticipantDuplicateIdentityError;
    Object.defineProperty(TwilioErrorByCode, 53205, { value: ParticipantDuplicateIdentityError });
    var TrackInvalidError = (
      /** @class */
      function(_super) {
        __extends(TrackInvalidError2, _super);
        function TrackInvalidError2() {
          var _this = _super.call(this, 53300, "Track is invalid") || this;
          Object.setPrototypeOf(_this, TrackInvalidError2.prototype);
          return _this;
        }
        return TrackInvalidError2;
      }(TwilioError)
    );
    exports.TrackInvalidError = TrackInvalidError;
    Object.defineProperty(TwilioErrorByCode, 53300, { value: TrackInvalidError });
    var TrackNameInvalidError = (
      /** @class */
      function(_super) {
        __extends(TrackNameInvalidError2, _super);
        function TrackNameInvalidError2() {
          var _this = _super.call(this, 53301, "Track name is invalid") || this;
          Object.setPrototypeOf(_this, TrackNameInvalidError2.prototype);
          return _this;
        }
        return TrackNameInvalidError2;
      }(TwilioError)
    );
    exports.TrackNameInvalidError = TrackNameInvalidError;
    Object.defineProperty(TwilioErrorByCode, 53301, { value: TrackNameInvalidError });
    var TrackNameTooLongError = (
      /** @class */
      function(_super) {
        __extends(TrackNameTooLongError2, _super);
        function TrackNameTooLongError2() {
          var _this = _super.call(this, 53302, "Track name is too long") || this;
          Object.setPrototypeOf(_this, TrackNameTooLongError2.prototype);
          return _this;
        }
        return TrackNameTooLongError2;
      }(TwilioError)
    );
    exports.TrackNameTooLongError = TrackNameTooLongError;
    Object.defineProperty(TwilioErrorByCode, 53302, { value: TrackNameTooLongError });
    var TrackNameCharsInvalidError = (
      /** @class */
      function(_super) {
        __extends(TrackNameCharsInvalidError2, _super);
        function TrackNameCharsInvalidError2() {
          var _this = _super.call(this, 53303, "Track name contains invalid characters") || this;
          Object.setPrototypeOf(_this, TrackNameCharsInvalidError2.prototype);
          return _this;
        }
        return TrackNameCharsInvalidError2;
      }(TwilioError)
    );
    exports.TrackNameCharsInvalidError = TrackNameCharsInvalidError;
    Object.defineProperty(TwilioErrorByCode, 53303, { value: TrackNameCharsInvalidError });
    var TrackNameIsDuplicatedError = (
      /** @class */
      function(_super) {
        __extends(TrackNameIsDuplicatedError2, _super);
        function TrackNameIsDuplicatedError2() {
          var _this = _super.call(this, 53304, "Track name is duplicated") || this;
          Object.setPrototypeOf(_this, TrackNameIsDuplicatedError2.prototype);
          return _this;
        }
        return TrackNameIsDuplicatedError2;
      }(TwilioError)
    );
    exports.TrackNameIsDuplicatedError = TrackNameIsDuplicatedError;
    Object.defineProperty(TwilioErrorByCode, 53304, { value: TrackNameIsDuplicatedError });
    var TrackServerTrackCapacityReachedError = (
      /** @class */
      function(_super) {
        __extends(TrackServerTrackCapacityReachedError2, _super);
        function TrackServerTrackCapacityReachedError2() {
          var _this = _super.call(this, 53305, "The server has reached capacity and cannot fulfill this request") || this;
          Object.setPrototypeOf(_this, TrackServerTrackCapacityReachedError2.prototype);
          return _this;
        }
        return TrackServerTrackCapacityReachedError2;
      }(TwilioError)
    );
    exports.TrackServerTrackCapacityReachedError = TrackServerTrackCapacityReachedError;
    Object.defineProperty(TwilioErrorByCode, 53305, { value: TrackServerTrackCapacityReachedError });
    var MediaClientLocalDescFailedError = (
      /** @class */
      function(_super) {
        __extends(MediaClientLocalDescFailedError2, _super);
        function MediaClientLocalDescFailedError2() {
          var _this = _super.call(this, 53400, "Client is unable to create or apply a local media description") || this;
          Object.setPrototypeOf(_this, MediaClientLocalDescFailedError2.prototype);
          return _this;
        }
        return MediaClientLocalDescFailedError2;
      }(TwilioError)
    );
    exports.MediaClientLocalDescFailedError = MediaClientLocalDescFailedError;
    Object.defineProperty(TwilioErrorByCode, 53400, { value: MediaClientLocalDescFailedError });
    var MediaServerLocalDescFailedError = (
      /** @class */
      function(_super) {
        __extends(MediaServerLocalDescFailedError2, _super);
        function MediaServerLocalDescFailedError2() {
          var _this = _super.call(this, 53401, "Server is unable to create or apply a local media description") || this;
          Object.setPrototypeOf(_this, MediaServerLocalDescFailedError2.prototype);
          return _this;
        }
        return MediaServerLocalDescFailedError2;
      }(TwilioError)
    );
    exports.MediaServerLocalDescFailedError = MediaServerLocalDescFailedError;
    Object.defineProperty(TwilioErrorByCode, 53401, { value: MediaServerLocalDescFailedError });
    var MediaClientRemoteDescFailedError = (
      /** @class */
      function(_super) {
        __extends(MediaClientRemoteDescFailedError2, _super);
        function MediaClientRemoteDescFailedError2() {
          var _this = _super.call(this, 53402, "Client is unable to apply a remote media description") || this;
          Object.setPrototypeOf(_this, MediaClientRemoteDescFailedError2.prototype);
          return _this;
        }
        return MediaClientRemoteDescFailedError2;
      }(TwilioError)
    );
    exports.MediaClientRemoteDescFailedError = MediaClientRemoteDescFailedError;
    Object.defineProperty(TwilioErrorByCode, 53402, { value: MediaClientRemoteDescFailedError });
    var MediaServerRemoteDescFailedError = (
      /** @class */
      function(_super) {
        __extends(MediaServerRemoteDescFailedError2, _super);
        function MediaServerRemoteDescFailedError2() {
          var _this = _super.call(this, 53403, "Server is unable to apply a remote media description") || this;
          Object.setPrototypeOf(_this, MediaServerRemoteDescFailedError2.prototype);
          return _this;
        }
        return MediaServerRemoteDescFailedError2;
      }(TwilioError)
    );
    exports.MediaServerRemoteDescFailedError = MediaServerRemoteDescFailedError;
    Object.defineProperty(TwilioErrorByCode, 53403, { value: MediaServerRemoteDescFailedError });
    var MediaNoSupportedCodecError = (
      /** @class */
      function(_super) {
        __extends(MediaNoSupportedCodecError2, _super);
        function MediaNoSupportedCodecError2() {
          var _this = _super.call(this, 53404, "No supported codec") || this;
          Object.setPrototypeOf(_this, MediaNoSupportedCodecError2.prototype);
          return _this;
        }
        return MediaNoSupportedCodecError2;
      }(TwilioError)
    );
    exports.MediaNoSupportedCodecError = MediaNoSupportedCodecError;
    Object.defineProperty(TwilioErrorByCode, 53404, { value: MediaNoSupportedCodecError });
    var MediaConnectionError = (
      /** @class */
      function(_super) {
        __extends(MediaConnectionError2, _super);
        function MediaConnectionError2() {
          var _this = _super.call(this, 53405, "Media connection failed or Media activity ceased") || this;
          Object.setPrototypeOf(_this, MediaConnectionError2.prototype);
          return _this;
        }
        return MediaConnectionError2;
      }(TwilioError)
    );
    exports.MediaConnectionError = MediaConnectionError;
    Object.defineProperty(TwilioErrorByCode, 53405, { value: MediaConnectionError });
    var MediaDTLSTransportFailedError = (
      /** @class */
      function(_super) {
        __extends(MediaDTLSTransportFailedError2, _super);
        function MediaDTLSTransportFailedError2() {
          var _this = _super.call(this, 53407, "Media connection failed due to DTLS handshake failure") || this;
          Object.setPrototypeOf(_this, MediaDTLSTransportFailedError2.prototype);
          return _this;
        }
        return MediaDTLSTransportFailedError2;
      }(TwilioError)
    );
    exports.MediaDTLSTransportFailedError = MediaDTLSTransportFailedError;
    Object.defineProperty(TwilioErrorByCode, 53407, { value: MediaDTLSTransportFailedError });
    var ConfigurationAcquireFailedError = (
      /** @class */
      function(_super) {
        __extends(ConfigurationAcquireFailedError2, _super);
        function ConfigurationAcquireFailedError2() {
          var _this = _super.call(this, 53500, "Unable to acquire configuration") || this;
          Object.setPrototypeOf(_this, ConfigurationAcquireFailedError2.prototype);
          return _this;
        }
        return ConfigurationAcquireFailedError2;
      }(TwilioError)
    );
    exports.ConfigurationAcquireFailedError = ConfigurationAcquireFailedError;
    Object.defineProperty(TwilioErrorByCode, 53500, { value: ConfigurationAcquireFailedError });
    var ConfigurationAcquireTurnFailedError = (
      /** @class */
      function(_super) {
        __extends(ConfigurationAcquireTurnFailedError2, _super);
        function ConfigurationAcquireTurnFailedError2() {
          var _this = _super.call(this, 53501, "Unable to acquire TURN credentials") || this;
          Object.setPrototypeOf(_this, ConfigurationAcquireTurnFailedError2.prototype);
          return _this;
        }
        return ConfigurationAcquireTurnFailedError2;
      }(TwilioError)
    );
    exports.ConfigurationAcquireTurnFailedError = ConfigurationAcquireTurnFailedError;
    Object.defineProperty(TwilioErrorByCode, 53501, { value: ConfigurationAcquireTurnFailedError });
  }
});

// node_modules/twilio-video/es5/preflight/getturncredentials.js
var require_getturncredentials = __commonJS({
  "node_modules/twilio-video/es5/preflight/getturncredentials.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTurnCredentials = void 0;
    var TwilioConnection = require_twilioconnection();
    var ICE_VERSION = require_constants().ICE_VERSION;
    var _a = require_twilio_video_errors();
    var createTwilioError = _a.createTwilioError;
    var SignalingConnectionError = _a.SignalingConnectionError;
    var events_1 = require_events();
    function getTurnCredentials(token, wsServer) {
      return new Promise(function(resolve, reject) {
        var eventObserver = new events_1.EventEmitter();
        var connectionOptions = {
          networkMonitor: null,
          eventObserver,
          helloBody: {
            edge: "roaming",
            preflight: true,
            token,
            type: "ice",
            version: ICE_VERSION
          }
        };
        var twilioConnection = new TwilioConnection(wsServer, connectionOptions);
        var done = false;
        twilioConnection.once("close", function() {
          if (!done) {
            done = true;
            reject(new SignalingConnectionError());
          }
        });
        twilioConnection.on("message", function(messageData) {
          var code = messageData.code, message = messageData.message, ice_servers = messageData.ice_servers, type = messageData.type;
          if ((type === "iced" || type === "error") && !done) {
            done = true;
            if (type === "iced") {
              resolve(ice_servers);
            } else {
              reject(createTwilioError(code, message));
            }
            twilioConnection.close();
          }
        });
      });
    }
    exports.getTurnCredentials = getTurnCredentials;
  }
});

// node_modules/twilio-video/es5/preflight/makestat.js
var require_makestat = __commonJS({
  "node_modules/twilio-video/es5/preflight/makestat.js"(exports) {
    "use strict";
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeStat = void 0;
    function makeStat(values) {
      if (values && values.length) {
        var min = Math.min.apply(Math, __spreadArray([], __read(values)));
        var max = Math.max.apply(Math, __spreadArray([], __read(values)));
        var average = values.reduce(function(total, value) {
          return total + value;
        }, 0) / values.length;
        return { min, max, average };
      }
      return null;
    }
    exports.makeStat = makeStat;
  }
});

// node_modules/twilio-video/es5/preflight/syntheticaudio.js
var require_syntheticaudio = __commonJS({
  "node_modules/twilio-video/es5/preflight/syntheticaudio.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.syntheticAudio = void 0;
    function syntheticAudio() {
      var audioContextFactory = require_audiocontext();
      var holder = {};
      var audioContext = audioContextFactory.getOrCreate(holder);
      var oscillator = audioContext.createOscillator();
      var dst = oscillator.connect(audioContext.createMediaStreamDestination());
      oscillator.start();
      var track = dst.stream.getAudioTracks()[0];
      var originalStop = track.stop;
      track.stop = function() {
        originalStop.call(track);
        audioContextFactory.release(holder);
      };
      return track;
    }
    exports.syntheticAudio = syntheticAudio;
  }
});

// node_modules/twilio-video/es5/preflight/syntheticvideo.js
var require_syntheticvideo = __commonJS({
  "node_modules/twilio-video/es5/preflight/syntheticvideo.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.syntheticVideo = void 0;
    function syntheticVideo(_a) {
      var _b = _a === void 0 ? {} : _a, _c = _b.width, width = _c === void 0 ? 640 : _c, _d = _b.height, height = _d === void 0 ? 480 : _d;
      var canvas = Object.assign(document.createElement("canvas"), { width, height });
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "green";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      var stopped = false;
      requestAnimationFrame(function animate() {
        if (!stopped) {
          var r = Math.round(Math.random() * 255);
          var g = Math.round(Math.random() * 255);
          var b = Math.round(Math.random() * 255);
          var a = Math.round(Math.random() * 255);
          ctx.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
          ctx.fillRect(Math.random() * width, Math.random() * height, 50, 50);
          requestAnimationFrame(animate);
        }
      });
      var stream = canvas.captureStream(30);
      var track = stream.getTracks()[0];
      var originalStop = track.stop;
      track.stop = function() {
        stopped = true;
        originalStop.call(track);
      };
      return track;
    }
    exports.syntheticVideo = syntheticVideo;
  }
});

// node_modules/twilio-video/es5/util/movingaveragedelta.js
var require_movingaveragedelta = __commonJS({
  "node_modules/twilio-video/es5/util/movingaveragedelta.js"(exports, module) {
    "use strict";
    var MovingAverageDelta = (
      /** @class */
      function() {
        function MovingAverageDelta2() {
          Object.defineProperties(this, {
            _samples: {
              value: [
                { denominator: 0, numerator: 0 },
                { denominator: 0, numerator: 0 }
              ]
            }
          });
        }
        MovingAverageDelta2.prototype.get = function() {
          var samples = this._samples;
          var denominatorDelta = samples[1].denominator - samples[0].denominator || Infinity;
          var numeratorDelta = samples[1].numerator - samples[0].numerator;
          return numeratorDelta / denominatorDelta;
        };
        MovingAverageDelta2.prototype.putSample = function(numerator, denominator) {
          var samples = this._samples;
          samples.shift();
          samples.push({ denominator, numerator });
        };
        return MovingAverageDelta2;
      }()
    );
    module.exports = MovingAverageDelta;
  }
});

// node_modules/twilio-video/es5/util/eventobserver.js
var require_eventobserver = __commonJS({
  "node_modules/twilio-video/es5/util/eventobserver.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var EventEmitter = require_events().EventEmitter;
    var VALID_GROUPS = [
      "signaling",
      "room",
      "media",
      "quality",
      "video-processor",
      "preflight"
    ];
    var VALID_LEVELS = [
      "debug",
      "error",
      "info",
      "warning"
    ];
    var EventObserver = (
      /** @class */
      function(_super) {
        __extends(EventObserver2, _super);
        function EventObserver2(publisher, connectTimestamp, log, eventListener) {
          if (eventListener === void 0) {
            eventListener = null;
          }
          var _this = _super.call(this) || this;
          _this.on("event", function(_a) {
            var name = _a.name, group = _a.group, level = _a.level, payload = _a.payload;
            if (typeof name !== "string") {
              log.error("Unexpected name: ", name);
              throw new Error("Unexpected name: ", name);
            }
            if (!VALID_GROUPS.includes(group)) {
              log.error("Unexpected group: ", group);
              throw new Error("Unexpected group: ", group);
            }
            if (!VALID_LEVELS.includes(level)) {
              log.error("Unexpected level: ", level);
              throw new Error("Unexpected level: ", level);
            }
            var timestamp = Date.now();
            var elapsedTime = timestamp - connectTimestamp;
            var publisherPayload = Object.assign({ elapsedTime, level }, payload ? payload : {});
            publisher.publish(group, name, publisherPayload);
            var event = Object.assign({
              elapsedTime,
              group,
              level,
              name,
              timestamp
            }, payload ? { payload } : {});
            var logLevel = {
              debug: "debug",
              error: "error",
              info: "info",
              warning: "warn"
            }[level];
            log[logLevel]("event", event);
            if (eventListener && group === "signaling") {
              eventListener.emit("event", event);
            }
          });
          return _this;
        }
        return EventObserver2;
      }(EventEmitter)
    );
    module.exports = EventObserver;
  }
});

// node_modules/twilio-video/es5/util/insightspublisher/index.js
var require_insightspublisher = __commonJS({
  "node_modules/twilio-video/es5/util/insightspublisher/index.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var EventEmitter = require_events().EventEmitter;
    var getUserAgent = require_util2().getUserAgent;
    var MAX_RECONNECT_ATTEMPTS = 5;
    var RECONNECT_INTERVAL_MS = 50;
    var WS_CLOSE_NORMAL = 1e3;
    var toplevel = globalThis;
    var WebSocket2 = toplevel.WebSocket ? toplevel.WebSocket : require_ws();
    var _a = require_constants();
    var hardwareDevicePublisheriPad = _a.hardwareDevicePublisheriPad;
    var hardwareDevicePublisheriPhone = _a.hardwareDevicePublisheriPhone;
    var util = require_util2();
    var browserdetection = require_browserdetection();
    var InsightsPublisher = (
      /** @class */
      function(_super) {
        __extends(InsightsPublisher2, _super);
        function InsightsPublisher2(token, sdkName, sdkVersion, environment, realm, options) {
          var _this = _super.call(this) || this;
          options = Object.assign({
            gateway: createGateway(environment, realm) + "/v1/VideoEvents",
            maxReconnectAttempts: MAX_RECONNECT_ATTEMPTS,
            reconnectIntervalMs: RECONNECT_INTERVAL_MS,
            userAgent: getUserAgent(),
            WebSocket: WebSocket2
          }, options);
          Object.defineProperties(_this, {
            _connectTimestamp: {
              value: 0,
              writable: true
            },
            _eventQueue: {
              value: []
            },
            _readyToConnect: {
              value: util.defer()
            },
            _reconnectAttemptsLeft: {
              value: options.maxReconnectAttempts,
              writable: true
            },
            _ws: {
              value: null,
              writable: true
            },
            _WebSocket: {
              value: options.WebSocket
            }
          });
          _this._readyToConnect.promise.then(function(_a2) {
            var roomSid = _a2.roomSid, participantSid = _a2.participantSid;
            var self = _this;
            _this.on("disconnected", function maybeReconnect(error) {
              self._session = null;
              if (error && self._reconnectAttemptsLeft > 0) {
                self.emit("reconnecting");
                reconnect(self, token, sdkName, sdkVersion, roomSid, participantSid, options);
                return;
              }
              self.removeListener("disconnected", maybeReconnect);
            });
            connect(_this, token, sdkName, sdkVersion, roomSid, participantSid, options);
          }).catch(function() {
          });
          return _this;
        }
        InsightsPublisher2.prototype.connect = function(roomSid, participantSid) {
          this._readyToConnect.resolve({ roomSid, participantSid });
        };
        InsightsPublisher2.prototype._publish = function(event) {
          event.session = this._session;
          this._ws.send(JSON.stringify(event));
        };
        InsightsPublisher2.prototype.disconnect = function() {
          if (this._ws === null || this._ws.readyState === this._WebSocket.CLOSING || this._ws.readyState === this._WebSocket.CLOSED) {
            return false;
          }
          try {
            this._ws.close();
          } catch (error) {
          }
          this.emit("disconnected");
          return true;
        };
        InsightsPublisher2.prototype.publish = function(groupName, eventName, payload) {
          if (this._ws !== null && (this._ws.readyState === this._WebSocket.CLOSING || this._ws.readyState === this._WebSocket.CLOSED)) {
            return false;
          }
          var publishOrEnqueue = typeof this._session === "string" ? this._publish.bind(this) : this._eventQueue.push.bind(this._eventQueue);
          publishOrEnqueue({
            group: groupName,
            name: eventName,
            payload,
            timestamp: Date.now(),
            type: "event",
            version: 1
          });
          return true;
        };
        return InsightsPublisher2;
      }(EventEmitter)
    );
    function connect(publisher, token, sdkName, sdkVersion, roomSid, participantSid, options) {
      publisher._connectTimestamp = Date.now();
      publisher._reconnectAttemptsLeft--;
      publisher._ws = new options.WebSocket(options.gateway);
      var ws = publisher._ws;
      ws.addEventListener("close", function(event) {
        if (event.code === WS_CLOSE_NORMAL) {
          publisher.emit("disconnected");
          return;
        }
        publisher.emit("disconnected", new Error("WebSocket Error " + event.code + ": " + event.reason));
      });
      ws.addEventListener("message", function(message) {
        handleConnectResponse(publisher, JSON.parse(message.data), options);
      });
      ws.addEventListener("open", function() {
        var connectRequest = {
          type: "connect",
          token,
          version: 1
        };
        connectRequest.publisher = {
          name: sdkName,
          sdkVersion,
          userAgent: options.userAgent,
          participantSid,
          roomSid
        };
        if (browserdetection.isIpad()) {
          connectRequest.publisher = __assign(__assign({}, connectRequest.publisher), hardwareDevicePublisheriPad);
        } else if (browserdetection.isIphone()) {
          connectRequest.publisher = __assign(__assign({}, connectRequest.publisher), hardwareDevicePublisheriPhone);
        }
        ws.send(JSON.stringify(connectRequest));
      });
    }
    function createGateway(environment, realm) {
      return environment === "prod" ? "wss://sdkgw." + realm + ".twilio.com" : "wss://sdkgw." + environment + "-" + realm + ".twilio.com";
    }
    function handleConnectResponse(publisher, response, options) {
      switch (response.type) {
        case "connected":
          publisher._session = response.session;
          publisher._reconnectAttemptsLeft = options.maxReconnectAttempts;
          publisher._eventQueue.splice(0).forEach(publisher._publish, publisher);
          publisher.emit("connected");
          break;
        case "error":
          publisher._ws.close();
          publisher.emit("disconnected", new Error(response.message));
          break;
      }
    }
    function reconnect(publisher, token, sdkName, sdkVersion, roomSid, participantSid, options) {
      var connectInterval = Date.now() - publisher._connectTimestamp;
      var timeToWait = options.reconnectIntervalMs - connectInterval;
      if (timeToWait > 0) {
        setTimeout(function() {
          connect(publisher, token, sdkName, sdkVersion, roomSid, participantSid, options);
        }, timeToWait);
        return;
      }
      connect(publisher, token, sdkName, sdkVersion, roomSid, participantSid, options);
    }
    module.exports = InsightsPublisher;
  }
});

// node_modules/twilio-video/es5/preflight/preflighttest.js
var require_preflighttest = __commonJS({
  "node_modules/twilio-video/es5/preflight/preflighttest.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports && exports.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1)
          throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f)
          throw new TypeError("Generator is already executing.");
        while (_)
          try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
              return t;
            if (y = 0, t)
              op = [op[0] & 2, t.value];
            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;
              case 4:
                _.label++;
                return { value: op[1], done: false };
              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;
              case 7:
                op = _.ops.pop();
                _.trys.pop();
                continue;
              default:
                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                  _ = 0;
                  continue;
                }
                if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                  _.label = op[1];
                  break;
                }
                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1];
                  t = op;
                  break;
                }
                if (t && _.label < t[2]) {
                  _.label = t[2];
                  _.ops.push(op);
                  break;
                }
                if (t[2])
                  _.ops.pop();
                _.trys.pop();
                continue;
            }
            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
        if (op[0] & 5)
          throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.runPreflight = exports.PreflightTest = void 0;
    var constants_1 = require_constants();
    var timer_1 = require_timer();
    var mos_1 = require_mos();
    var getCombinedConnectionStats_1 = require_getCombinedConnectionStats();
    var getturncredentials_1 = require_getturncredentials();
    var makestat_1 = require_makestat();
    var syntheticaudio_1 = require_syntheticaudio();
    var syntheticvideo_1 = require_syntheticvideo();
    var index_1 = require_util2();
    var WS_SERVER = require_constants().WS_SERVER;
    var Log = require_log();
    var EventEmitter = require_eventemitter();
    var MovingAverageDelta = require_movingaveragedelta();
    var EventObserver = require_eventobserver();
    var InsightsPublisher = require_insightspublisher();
    var _a = require_sid();
    var createSID = _a.createSID;
    var sessionSID = _a.sessionSID;
    var _b = require_twilio_video_errors();
    var SignalingConnectionTimeoutError = _b.SignalingConnectionTimeoutError;
    var MediaConnectionError = _b.MediaConnectionError;
    var SECOND = 1e3;
    var DEFAULT_TEST_DURATION = 10 * SECOND;
    var PreflightProgress = {
      /**
       * {@link PreflightTest} has successfully generated synthetic tracks
       */
      mediaAcquired: "mediaAcquired",
      /**
       * {@link PreflightTest} has successfully connected to twilio server and obtained turn credentials
       */
      connected: "connected",
      /**
       * SubscriberParticipant successfully subscribed to media tracks.
       */
      mediaSubscribed: "mediaSubscribed",
      /**
       * Media flow was detected.
       */
      mediaStarted: "mediaStarted",
      /**
       * Established DTLS connection. This is measured from RTCDtlsTransport `connecting` to `connected` state.
       * On Safari, Support for measuring this is missing, this event will be not be emitted on Safari.
       */
      dtlsConnected: "dtlsConnected",
      /**
       * Established a PeerConnection, This is measured from PeerConnection `connecting` to `connected` state.
       * On Firefox, Support for measuring this is missing, this event will be not be emitted on Firefox.
       */
      peerConnectionConnected: "peerConnectionConnected",
      /**
       * Established ICE connection. This is measured from ICE connection `checking` to `connected` state.
       */
      iceConnected: "iceConnected"
    };
    function notEmpty(value) {
      return value !== null && typeof value !== "undefined";
    }
    var nInstances = 0;
    var PreflightTest = (
      /** @class */
      function(_super) {
        __extends(PreflightTest2, _super);
        function PreflightTest2(token, options) {
          var _this = _super.call(this) || this;
          _this._testTiming = new timer_1.Timer();
          _this._dtlsTiming = new timer_1.Timer();
          _this._iceTiming = new timer_1.Timer();
          _this._peerConnectionTiming = new timer_1.Timer();
          _this._mediaTiming = new timer_1.Timer();
          _this._connectTiming = new timer_1.Timer();
          _this._sentBytesMovingAverage = new MovingAverageDelta();
          _this._packetLossMovingAverage = new MovingAverageDelta();
          _this._progressEvents = [];
          _this._receivedBytesMovingAverage = new MovingAverageDelta();
          var internalOptions = options;
          var _a2 = internalOptions.environment, environment = _a2 === void 0 ? "prod" : _a2, _b2 = internalOptions.region, region = _b2 === void 0 ? "gll" : _b2, _c = internalOptions.duration, duration = _c === void 0 ? DEFAULT_TEST_DURATION : _c;
          var wsServer = internalOptions.wsServer || WS_SERVER(environment, region);
          _this._log = new Log("default", _this, constants_1.DEFAULT_LOG_LEVEL, constants_1.DEFAULT_LOGGER_NAME);
          _this._testDuration = duration;
          _this._instanceId = nInstances++;
          _this._testTiming.start();
          _this._runPreflightTest(token, environment, wsServer);
          return _this;
        }
        PreflightTest2.prototype.toString = function() {
          return "[Preflight #" + this._instanceId + "]";
        };
        PreflightTest2.prototype.stop = function() {
          this._stopped = true;
        };
        PreflightTest2.prototype._generatePreflightReport = function(collectedStats) {
          this._testTiming.stop();
          return {
            testTiming: this._testTiming.getTimeMeasurement(),
            networkTiming: {
              dtls: this._dtlsTiming.getTimeMeasurement(),
              ice: this._iceTiming.getTimeMeasurement(),
              peerConnection: this._peerConnectionTiming.getTimeMeasurement(),
              connect: this._connectTiming.getTimeMeasurement(),
              media: this._mediaTiming.getTimeMeasurement()
            },
            stats: {
              jitter: makestat_1.makeStat(collectedStats === null || collectedStats === void 0 ? void 0 : collectedStats.jitter),
              rtt: makestat_1.makeStat(collectedStats === null || collectedStats === void 0 ? void 0 : collectedStats.rtt),
              packetLoss: makestat_1.makeStat(collectedStats === null || collectedStats === void 0 ? void 0 : collectedStats.packetLoss)
            },
            selectedIceCandidatePairStats: collectedStats ? collectedStats.selectedIceCandidatePairStats : null,
            iceCandidateStats: collectedStats ? collectedStats.iceCandidateStats : [],
            progressEvents: this._progressEvents,
            // NOTE(mpatwardhan): internal properties.
            mos: makestat_1.makeStat(collectedStats === null || collectedStats === void 0 ? void 0 : collectedStats.mos)
          };
        };
        PreflightTest2.prototype._executePreflightStep = function(stepName, step, timeoutError) {
          return __awaiter(this, void 0, void 0, function() {
            var MAX_STEP_DURATION, stepPromise, timer, timeoutPromise, result;
            return __generator(this, function(_a2) {
              switch (_a2.label) {
                case 0:
                  this._log.debug("Executing step: ", stepName);
                  MAX_STEP_DURATION = this._testDuration + 10 * SECOND;
                  if (this._stopped) {
                    throw new Error("stopped");
                  }
                  stepPromise = Promise.resolve().then(step);
                  timer = null;
                  timeoutPromise = new Promise(function(_resolve, reject) {
                    timer = setTimeout(function() {
                      reject(timeoutError || new Error(stepName + " timeout."));
                    }, MAX_STEP_DURATION);
                  });
                  _a2.label = 1;
                case 1:
                  _a2.trys.push([1, , 3, 4]);
                  return [4, Promise.race([timeoutPromise, stepPromise])];
                case 2:
                  result = _a2.sent();
                  return [2, result];
                case 3:
                  if (timer !== null) {
                    clearTimeout(timer);
                  }
                  return [
                    7
                    /*endfinally*/
                  ];
                case 4:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        PreflightTest2.prototype._collectNetworkTimings = function(pc) {
          var _this = this;
          return new Promise(function(resolve) {
            var dtlsTransport;
            pc.addEventListener("iceconnectionstatechange", function() {
              if (pc.iceConnectionState === "checking") {
                _this._iceTiming.start();
              }
              if (pc.iceConnectionState === "connected") {
                _this._iceTiming.stop();
                _this._updateProgress(PreflightProgress.iceConnected);
                if (!dtlsTransport || dtlsTransport && dtlsTransport.state === "connected") {
                  resolve();
                }
              }
            });
            pc.addEventListener("connectionstatechange", function() {
              if (pc.connectionState === "connecting") {
                _this._peerConnectionTiming.start();
              }
              if (pc.connectionState === "connected") {
                _this._peerConnectionTiming.stop();
                _this._updateProgress(PreflightProgress.peerConnectionConnected);
              }
            });
            var senders = pc.getSenders();
            var transport = senders.map(function(sender) {
              return sender.transport;
            }).find(notEmpty);
            if (typeof transport !== "undefined") {
              dtlsTransport = transport;
              dtlsTransport.addEventListener("statechange", function() {
                if (dtlsTransport.state === "connecting") {
                  _this._dtlsTiming.start();
                }
                if (dtlsTransport.state === "connected") {
                  _this._dtlsTiming.stop();
                  _this._updateProgress(PreflightProgress.dtlsConnected);
                  if (pc.iceConnectionState === "connected") {
                    resolve();
                  }
                }
              });
            }
          });
        };
        PreflightTest2.prototype._setupInsights = function(_a2) {
          var token = _a2.token, _b2 = _a2.environment, environment = _b2 === void 0 ? constants_1.DEFAULT_ENVIRONMENT : _b2, _c = _a2.realm, realm = _c === void 0 ? constants_1.DEFAULT_REALM : _c;
          var eventPublisherOptions = {};
          var eventPublisher = new InsightsPublisher(token, constants_1.SDK_NAME, constants_1.SDK_VERSION, environment, realm, eventPublisherOptions);
          eventPublisher.connect("PREFLIGHT_ROOM_SID", "PREFLIGHT_PARTICIPANT");
          var eventObserver = new EventObserver(eventPublisher, Date.now(), this._log);
          var undefinedValue = void 0;
          return {
            reportToInsights: function(_a3) {
              var _b3, _c2;
              var report = _a3.report;
              var jitterStats = report.stats.jitter || undefinedValue;
              var rttStats = report.stats.rtt || undefinedValue;
              var packetLossStats = report.stats.packetLoss || undefinedValue;
              var mosStats = report.mos || undefinedValue;
              var candidateTypeToProtocols = /* @__PURE__ */ new Map();
              report.iceCandidateStats.forEach(function(candidateStats) {
                if (candidateStats.candidateType && candidateStats.protocol) {
                  var protocols = candidateTypeToProtocols.get(candidateStats.candidateType) || [];
                  if (protocols.indexOf(candidateStats.protocol) < 0) {
                    protocols.push(candidateStats.protocol);
                  }
                  candidateTypeToProtocols.set(candidateStats.candidateType, protocols);
                }
              });
              var iceCandidateStats = JSON.stringify(Object.fromEntries(candidateTypeToProtocols));
              var insightsReport = {
                name: "report",
                group: "preflight",
                level: report.error ? "error" : "info",
                payload: {
                  sessionSID,
                  preflightSID: createSID("PF"),
                  progressEvents: JSON.stringify(report.progressEvents),
                  testTiming: report.testTiming,
                  dtlsTiming: report.networkTiming.dtls,
                  iceTiming: report.networkTiming.ice,
                  peerConnectionTiming: report.networkTiming.peerConnection,
                  connectTiming: report.networkTiming.connect,
                  mediaTiming: report.networkTiming.media,
                  selectedLocalCandidate: (_b3 = report.selectedIceCandidatePairStats) === null || _b3 === void 0 ? void 0 : _b3.localCandidate,
                  selectedRemoteCandidate: (_c2 = report.selectedIceCandidatePairStats) === null || _c2 === void 0 ? void 0 : _c2.remoteCandidate,
                  iceCandidateStats,
                  jitterStats,
                  rttStats,
                  packetLossStats,
                  mosStats,
                  error: report.error
                }
              };
              eventObserver.emit("event", insightsReport);
              setTimeout(function() {
                return eventPublisher.disconnect();
              }, 2e3);
            }
          };
        };
        PreflightTest2.prototype._runPreflightTest = function(token, environment, wsServer) {
          return __awaiter(this, void 0, void 0, function() {
            var localTracks, pcs, reportToInsights, elements_1, iceServers, senderPC_1, receiverPC_1, remoteTracks_1, collectedStats_1, report, error_1, preflightReport;
            var _this = this;
            return __generator(this, function(_a2) {
              switch (_a2.label) {
                case 0:
                  localTracks = [];
                  pcs = [];
                  reportToInsights = this._setupInsights({ token, environment }).reportToInsights;
                  _a2.label = 1;
                case 1:
                  _a2.trys.push([1, 8, 9, 10]);
                  elements_1 = [];
                  return [4, this._executePreflightStep("Acquire media", function() {
                    return [syntheticaudio_1.syntheticAudio(), syntheticvideo_1.syntheticVideo({ width: 640, height: 480 })];
                  })];
                case 2:
                  localTracks = _a2.sent();
                  this._updateProgress(PreflightProgress.mediaAcquired);
                  this.emit("debug", { localTracks });
                  this._connectTiming.start();
                  return [4, this._executePreflightStep("Get turn credentials", function() {
                    return getturncredentials_1.getTurnCredentials(token, wsServer);
                  }, new SignalingConnectionTimeoutError())];
                case 3:
                  iceServers = _a2.sent();
                  this._connectTiming.stop();
                  this._updateProgress(PreflightProgress.connected);
                  senderPC_1 = new RTCPeerConnection({ iceServers, iceTransportPolicy: "relay", bundlePolicy: "max-bundle" });
                  receiverPC_1 = new RTCPeerConnection({ iceServers, bundlePolicy: "max-bundle" });
                  pcs.push(senderPC_1);
                  pcs.push(receiverPC_1);
                  this._mediaTiming.start();
                  return [4, this._executePreflightStep("Setup Peer Connections", function() {
                    return __awaiter(_this, void 0, void 0, function() {
                      var remoteTracksPromise, offer, updatedOffer, answer;
                      return __generator(this, function(_a3) {
                        switch (_a3.label) {
                          case 0:
                            senderPC_1.addEventListener("icecandidate", function(event) {
                              return event.candidate && receiverPC_1.addIceCandidate(event.candidate);
                            });
                            receiverPC_1.addEventListener("icecandidate", function(event) {
                              return event.candidate && senderPC_1.addIceCandidate(event.candidate);
                            });
                            localTracks.forEach(function(track) {
                              return senderPC_1.addTrack(track);
                            });
                            remoteTracksPromise = new Promise(function(resolve) {
                              var remoteTracks = [];
                              receiverPC_1.addEventListener("track", function(event) {
                                remoteTracks.push(event.track);
                                if (remoteTracks.length === localTracks.length) {
                                  resolve(remoteTracks);
                                }
                              });
                            });
                            return [4, senderPC_1.createOffer()];
                          case 1:
                            offer = _a3.sent();
                            updatedOffer = offer;
                            return [4, senderPC_1.setLocalDescription(updatedOffer)];
                          case 2:
                            _a3.sent();
                            return [4, receiverPC_1.setRemoteDescription(updatedOffer)];
                          case 3:
                            _a3.sent();
                            return [4, receiverPC_1.createAnswer()];
                          case 4:
                            answer = _a3.sent();
                            return [4, receiverPC_1.setLocalDescription(answer)];
                          case 5:
                            _a3.sent();
                            return [4, senderPC_1.setRemoteDescription(answer)];
                          case 6:
                            _a3.sent();
                            return [4, this._collectNetworkTimings(senderPC_1)];
                          case 7:
                            _a3.sent();
                            return [2, remoteTracksPromise];
                        }
                      });
                    });
                  }, new MediaConnectionError())];
                case 4:
                  remoteTracks_1 = _a2.sent();
                  this.emit("debug", { remoteTracks: remoteTracks_1 });
                  remoteTracks_1.forEach(function(track) {
                    track.addEventListener("ended", function() {
                      return _this._log.warn(track.kind + ":ended");
                    });
                    track.addEventListener("mute", function() {
                      return _this._log.warn(track.kind + ":muted");
                    });
                    track.addEventListener("unmute", function() {
                      return _this._log.warn(track.kind + ":unmuted");
                    });
                  });
                  this._updateProgress(PreflightProgress.mediaSubscribed);
                  return [4, this._executePreflightStep("Wait for tracks to start", function() {
                    return new Promise(function(resolve) {
                      var element = document.createElement("video");
                      element.autoplay = true;
                      element.playsInline = true;
                      element.muted = true;
                      element.srcObject = new MediaStream(remoteTracks_1);
                      elements_1.push(element);
                      _this.emit("debugElement", element);
                      element.oncanplay = resolve;
                    });
                  }, new MediaConnectionError())];
                case 5:
                  _a2.sent();
                  this._mediaTiming.stop();
                  this._updateProgress(PreflightProgress.mediaStarted);
                  return [4, this._executePreflightStep("Collect stats for duration", function() {
                    return _this._collectRTCStatsForDuration(_this._testDuration, initCollectedStats(), senderPC_1, receiverPC_1);
                  })];
                case 6:
                  collectedStats_1 = _a2.sent();
                  return [4, this._executePreflightStep("Generate report", function() {
                    return _this._generatePreflightReport(collectedStats_1);
                  })];
                case 7:
                  report = _a2.sent();
                  reportToInsights({ report });
                  this.emit("completed", report);
                  return [3, 10];
                case 8:
                  error_1 = _a2.sent();
                  preflightReport = this._generatePreflightReport();
                  reportToInsights({ report: __assign(__assign({}, preflightReport), { error: error_1 === null || error_1 === void 0 ? void 0 : error_1.toString() }) });
                  this.emit("failed", error_1, preflightReport);
                  return [3, 10];
                case 9:
                  pcs.forEach(function(pc) {
                    return pc.close();
                  });
                  localTracks.forEach(function(track) {
                    return track.stop();
                  });
                  return [
                    7
                    /*endfinally*/
                  ];
                case 10:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        PreflightTest2.prototype._collectRTCStats = function(collectedStats, senderPC, receiverPC) {
          return __awaiter(this, void 0, void 0, function() {
            var combinedStats, timestamp, bytesSent, bytesReceived, packets, packetsLost, roundTripTime, jitter, selectedIceCandidatePairStats, iceCandidateStats, hasLastData, fractionPacketLost, percentPacketsLost, score;
            return __generator(this, function(_a2) {
              switch (_a2.label) {
                case 0:
                  return [4, getCombinedConnectionStats_1.getCombinedConnectionStats({ publisher: senderPC, subscriber: receiverPC })];
                case 1:
                  combinedStats = _a2.sent();
                  timestamp = combinedStats.timestamp, bytesSent = combinedStats.bytesSent, bytesReceived = combinedStats.bytesReceived, packets = combinedStats.packets, packetsLost = combinedStats.packetsLost, roundTripTime = combinedStats.roundTripTime, jitter = combinedStats.jitter, selectedIceCandidatePairStats = combinedStats.selectedIceCandidatePairStats, iceCandidateStats = combinedStats.iceCandidateStats;
                  hasLastData = collectedStats.jitter.length > 0;
                  collectedStats.jitter.push(jitter);
                  collectedStats.rtt.push(roundTripTime);
                  this._sentBytesMovingAverage.putSample(bytesSent, timestamp);
                  this._receivedBytesMovingAverage.putSample(bytesReceived, timestamp);
                  this._packetLossMovingAverage.putSample(packetsLost, packets);
                  if (hasLastData) {
                    collectedStats.outgoingBitrate.push(this._sentBytesMovingAverage.get() * 1e3 * 8);
                    collectedStats.incomingBitrate.push(this._receivedBytesMovingAverage.get() * 1e3 * 8);
                    fractionPacketLost = this._packetLossMovingAverage.get();
                    percentPacketsLost = Math.min(100, fractionPacketLost * 100);
                    collectedStats.packetLoss.push(percentPacketsLost);
                    score = mos_1.calculateMOS(roundTripTime, jitter, fractionPacketLost);
                    collectedStats.mos.push(score);
                  }
                  if (!collectedStats.selectedIceCandidatePairStats) {
                    collectedStats.selectedIceCandidatePairStats = selectedIceCandidatePairStats;
                  }
                  if (collectedStats.iceCandidateStats.length === 0) {
                    collectedStats.iceCandidateStats = iceCandidateStats;
                  }
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        PreflightTest2.prototype._collectRTCStatsForDuration = function(duration, collectedStats, senderPC, receiverPC) {
          return __awaiter(this, void 0, void 0, function() {
            var startTime, STAT_INTERVAL, remainingDuration;
            return __generator(this, function(_a2) {
              switch (_a2.label) {
                case 0:
                  startTime = Date.now();
                  STAT_INTERVAL = Math.min(1e3, duration);
                  return [4, index_1.waitForSometime(STAT_INTERVAL)];
                case 1:
                  _a2.sent();
                  return [4, this._collectRTCStats(collectedStats, senderPC, receiverPC)];
                case 2:
                  _a2.sent();
                  remainingDuration = duration - (Date.now() - startTime);
                  if (!(remainingDuration > 0))
                    return [3, 4];
                  return [4, this._collectRTCStatsForDuration(remainingDuration, collectedStats, senderPC, receiverPC)];
                case 3:
                  collectedStats = _a2.sent();
                  _a2.label = 4;
                case 4:
                  return [2, collectedStats];
              }
            });
          });
        };
        PreflightTest2.prototype._updateProgress = function(name) {
          var duration = Date.now() - this._testTiming.getTimeMeasurement().start;
          this._progressEvents.push({ duration, name });
          this.emit("progress", name);
        };
        return PreflightTest2;
      }(EventEmitter)
    );
    exports.PreflightTest = PreflightTest;
    function initCollectedStats() {
      return {
        mos: [],
        jitter: [],
        rtt: [],
        outgoingBitrate: [],
        incomingBitrate: [],
        packetLoss: [],
        selectedIceCandidatePairStats: null,
        iceCandidateStats: []
      };
    }
    function runPreflight(token, options) {
      if (options === void 0) {
        options = {};
      }
      var preflight = new PreflightTest(token, options);
      return preflight;
    }
    exports.runPreflight = runPreflight;
  }
});

// node_modules/twilio-video/es5/util/cancelablepromise.js
var require_cancelablepromise = __commonJS({
  "node_modules/twilio-video/es5/util/cancelablepromise.js"(exports, module) {
    "use strict";
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var CancelablePromise = (
      /** @class */
      function() {
        function CancelablePromise2(onCreate, onCancel) {
          var _this = this;
          Object.defineProperties(this, {
            _isCancelable: {
              writable: true,
              value: true
            },
            _isCanceled: {
              writable: true,
              value: false
            },
            _onCancel: {
              value: onCancel
            }
          });
          Object.defineProperty(this, "_promise", {
            value: new Promise(function(resolve, reject) {
              onCreate(function(value) {
                _this._isCancelable = false;
                resolve(value);
              }, function(reason) {
                _this._isCancelable = false;
                reject(reason);
              }, function() {
                return _this._isCanceled;
              });
            })
          });
        }
        CancelablePromise2.reject = function(reason) {
          return new CancelablePromise2(function rejected(resolve, reject) {
            reject(reason);
          }, function onCancel() {
          });
        };
        CancelablePromise2.resolve = function(result) {
          return new CancelablePromise2(function resolved(resolve) {
            resolve(result);
          }, function onCancel() {
          });
        };
        CancelablePromise2.prototype.cancel = function() {
          if (this._isCancelable) {
            this._isCanceled = true;
            this._onCancel();
          }
          return this;
        };
        CancelablePromise2.prototype.catch = function() {
          var args = [].slice.call(arguments);
          var promise = this._promise;
          return new CancelablePromise2(function onCreate(resolve, reject) {
            promise.catch.apply(promise, __spreadArray([], __read(args))).then(resolve, reject);
          }, this._onCancel);
        };
        CancelablePromise2.prototype.then = function() {
          var args = [].slice.call(arguments);
          var promise = this._promise;
          return new CancelablePromise2(function onCreate(resolve, reject) {
            promise.then.apply(promise, __spreadArray([], __read(args))).then(resolve, reject);
          }, this._onCancel);
        };
        CancelablePromise2.prototype.finally = function() {
          var args = [].slice.call(arguments);
          var promise = this._promise;
          return new CancelablePromise2(function onCreate(resolve, reject) {
            promise.finally.apply(promise, __spreadArray([], __read(args))).then(resolve, reject);
          }, this._onCancel);
        };
        return CancelablePromise2;
      }()
    );
    module.exports = CancelablePromise;
  }
});

// node_modules/twilio-video/es5/cancelableroompromise.js
var require_cancelableroompromise = __commonJS({
  "node_modules/twilio-video/es5/cancelableroompromise.js"(exports, module) {
    "use strict";
    var CancelablePromise = require_cancelablepromise();
    function createCancelableRoomPromise(getLocalTracks, createLocalParticipant, createRoomSignaling, createRoom) {
      var cancelableRoomSignalingPromise;
      var cancellationError = new Error("Canceled");
      return new CancelablePromise(function onCreate(resolve, reject, isCanceled) {
        var localParticipant;
        getLocalTracks(function getLocalTracksSucceeded(localTracks) {
          if (isCanceled()) {
            return CancelablePromise.reject(cancellationError);
          }
          localParticipant = createLocalParticipant(localTracks);
          return createRoomSignaling(localParticipant).then(function createRoomSignalingSucceeded(getCancelableRoomSignalingPromise) {
            if (isCanceled()) {
              throw cancellationError;
            }
            cancelableRoomSignalingPromise = getCancelableRoomSignalingPromise();
            return cancelableRoomSignalingPromise;
          });
        }).then(function roomSignalingConnected(roomSignaling) {
          if (isCanceled()) {
            roomSignaling.disconnect();
            throw cancellationError;
          }
          resolve(createRoom(localParticipant, roomSignaling));
        }).catch(function onError(error) {
          reject(error);
        });
      }, function onCancel() {
        if (cancelableRoomSignalingPromise) {
          cancelableRoomSignalingPromise.cancel();
        }
      });
    }
    module.exports = createCancelableRoomPromise;
  }
});

// node_modules/twilio-video/es5/encodingparameters.js
var require_encodingparameters = __commonJS({
  "node_modules/twilio-video/es5/encodingparameters.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var EventEmitter = require_events().EventEmitter;
    var EncodingParametersImpl = (
      /** @class */
      function(_super) {
        __extends(EncodingParametersImpl2, _super);
        function EncodingParametersImpl2(encodingParameters, adaptiveSimulcast) {
          var _this = _super.call(this) || this;
          encodingParameters = Object.assign({
            maxAudioBitrate: null,
            maxVideoBitrate: null
          }, encodingParameters);
          Object.defineProperties(_this, {
            maxAudioBitrate: {
              value: encodingParameters.maxAudioBitrate,
              writable: true
            },
            maxVideoBitrate: {
              value: encodingParameters.maxVideoBitrate,
              writable: true
            },
            adaptiveSimulcast: {
              value: adaptiveSimulcast
            }
          });
          return _this;
        }
        EncodingParametersImpl2.prototype.toJSON = function() {
          return {
            maxAudioBitrate: this.maxAudioBitrate,
            maxVideoBitrate: this.maxVideoBitrate
          };
        };
        EncodingParametersImpl2.prototype.update = function(encodingParameters) {
          var _this = this;
          encodingParameters = Object.assign({
            maxAudioBitrate: this.maxAudioBitrate,
            maxVideoBitrate: this.maxVideoBitrate
          }, encodingParameters);
          var shouldEmitChanged = [
            "maxAudioBitrate",
            "maxVideoBitrate"
          ].reduce(function(shouldEmitChanged2, maxKindBitrate) {
            if (_this[maxKindBitrate] !== encodingParameters[maxKindBitrate]) {
              _this[maxKindBitrate] = encodingParameters[maxKindBitrate];
              shouldEmitChanged2 = true;
            }
            return shouldEmitChanged2;
          }, false);
          if (shouldEmitChanged) {
            this.emit("changed");
          }
        };
        return EncodingParametersImpl2;
      }(EventEmitter)
    );
    module.exports = EncodingParametersImpl;
  }
});

// node_modules/twilio-video/es5/util/validate.js
var require_validate = __commonJS({
  "node_modules/twilio-video/es5/util/validate.js"(exports) {
    "use strict";
    var isNonArrayObject = require_util2().isNonArrayObject;
    var _a = require_constants();
    var E = _a.typeErrors;
    var clientTrackSwitchOffControl = _a.clientTrackSwitchOffControl;
    var videoContentPreferencesMode = _a.videoContentPreferencesMode;
    var subscriptionMode = _a.subscriptionMode;
    var trackPriority = _a.trackPriority;
    var trackSwitchOffMode = _a.trackSwitchOffMode;
    function validateBandwidthProfile(bandwidthProfile) {
      var error = validateObject(bandwidthProfile, "options.bandwidthProfile");
      if (!bandwidthProfile || error) {
        return error;
      }
      error = validateObject(bandwidthProfile.video, "options.bandwidthProfile.video", [
        { prop: "contentPreferencesMode", values: Object.values(videoContentPreferencesMode) },
        { prop: "dominantSpeakerPriority", values: Object.values(trackPriority) },
        { prop: "maxSubscriptionBitrate", type: "number" },
        { prop: "maxTracks", type: "number" },
        { prop: "mode", values: Object.values(subscriptionMode) },
        { prop: "clientTrackSwitchOffControl", values: Object.values(clientTrackSwitchOffControl) },
        { prop: "trackSwitchOffMode", values: Object.values(trackSwitchOffMode) }
      ]);
      if (error) {
        return error;
      }
      if (bandwidthProfile.video) {
        if ("maxTracks" in bandwidthProfile.video && "clientTrackSwitchOffControl" in bandwidthProfile.video) {
          return new TypeError("options.bandwidthProfile.video.maxTracks is deprecated. Use options.bandwidthProfile.video.clientTrackSwitchOffControl instead.");
        }
        if ("renderDimensions" in bandwidthProfile.video && "contentPreferencesMode" in bandwidthProfile.video) {
          return new TypeError("options.bandwidthProfile.video.renderDimensions is deprecated. Use options.bandwidthProfile.video.contentPreferencesMode instead.");
        }
        return validateRenderDimensions(bandwidthProfile.video.renderDimensions);
      }
      return null;
    }
    function validateLocalTrack(track, options) {
      if (!(track instanceof options.LocalAudioTrack || track instanceof options.LocalDataTrack || track instanceof options.LocalVideoTrack || track instanceof options.MediaStreamTrack)) {
        throw E.INVALID_TYPE("track", "LocalAudioTrack, LocalVideoTrack, LocalDataTrack, or MediaStreamTrack");
      }
    }
    function validateObject(object, name, propChecks) {
      if (propChecks === void 0) {
        propChecks = [];
      }
      if (typeof object === "undefined") {
        return null;
      }
      if (object === null || !isNonArrayObject(object)) {
        return E.INVALID_TYPE(name, "object");
      }
      return propChecks.reduce(function(error, _a2) {
        var prop = _a2.prop, type = _a2.type, values = _a2.values;
        if (error || !(prop in object)) {
          return error;
        }
        var value = object[prop];
        if (type && typeof value !== type) {
          return E.INVALID_TYPE(name + "." + prop, type);
        }
        if (type === "number" && isNaN(value)) {
          return E.INVALID_TYPE(name + "." + prop, type);
        }
        if (Array.isArray(values) && !values.includes(value)) {
          return E.INVALID_VALUE(name + "." + prop, values);
        }
        return error;
      }, null);
    }
    function validateRenderDimensions(renderDimensions) {
      var name = "options.bandwidthProfile.video.renderDimensions";
      var error = validateObject(renderDimensions, name);
      return renderDimensions ? error || Object.values(trackPriority).reduce(function(error2, prop) {
        return error2 || validateObject(renderDimensions[prop], name + "." + prop, [
          { prop: "height", type: "number" },
          { prop: "width", type: "number" }
        ]);
      }, null) : error;
    }
    exports.validateBandwidthProfile = validateBandwidthProfile;
    exports.validateLocalTrack = validateLocalTrack;
    exports.validateObject = validateObject;
  }
});

// node_modules/twilio-video/es5/media/track/trackpublication.js
var require_trackpublication = __commonJS({
  "node_modules/twilio-video/es5/media/track/trackpublication.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var EventEmitter = require_eventemitter();
    var _a = require_util2();
    var buildLogLevels = _a.buildLogLevels;
    var valueToJSON = _a.valueToJSON;
    var DEFAULT_LOG_LEVEL = require_constants().DEFAULT_LOG_LEVEL;
    var Log = require_log();
    var nInstances = 0;
    var TrackPublication = (
      /** @class */
      function(_super) {
        __extends(TrackPublication2, _super);
        function TrackPublication2(trackName, trackSid, options) {
          var _this = _super.call(this) || this;
          options = Object.assign({
            logLevel: DEFAULT_LOG_LEVEL
          }, options);
          var logLevels = buildLogLevels(options.logLevel);
          Object.defineProperties(_this, {
            _instanceId: {
              value: nInstances++
            },
            _log: {
              value: options.log ? options.log.createLog("default", _this) : new Log("default", _this, logLevels, options.loggerName)
            },
            trackName: {
              enumerable: true,
              value: trackName
            },
            trackSid: {
              enumerable: true,
              value: trackSid
            }
          });
          return _this;
        }
        TrackPublication2.prototype.toJSON = function() {
          return valueToJSON(this);
        };
        TrackPublication2.prototype.toString = function() {
          return "[TrackPublication #" + this._instanceId + ": " + this.trackSid + "]";
        };
        return TrackPublication2;
      }(EventEmitter)
    );
    module.exports = TrackPublication;
  }
});

// node_modules/twilio-video/es5/media/track/localtrackpublication.js
var require_localtrackpublication = __commonJS({
  "node_modules/twilio-video/es5/media/track/localtrackpublication.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var TrackPublication = require_trackpublication();
    var _a = require_constants();
    var E = _a.typeErrors;
    var trackPriority = _a.trackPriority;
    var LocalTrackPublication = (
      /** @class */
      function(_super) {
        __extends(LocalTrackPublication2, _super);
        function LocalTrackPublication2(signaling, track, unpublish, options) {
          var _this = _super.call(this, track.name, signaling.sid, options) || this;
          Object.defineProperties(_this, {
            _reemitSignalingEvent: {
              value: function() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                  args[_i] = arguments[_i];
                }
                return _this.emit.apply(_this, __spreadArray([args && args.length ? "warning" : "warningsCleared"], __read(args)));
              }
            },
            _reemitTrackEvent: {
              value: function() {
                return _this.emit(_this.isTrackEnabled ? "trackEnabled" : "trackDisabled");
              }
            },
            _signaling: {
              value: signaling
            },
            _unpublish: {
              value: unpublish
            },
            isTrackEnabled: {
              enumerable: true,
              get: function() {
                return this.track.kind === "data" ? true : this.track.isEnabled;
              }
            },
            kind: {
              enumerable: true,
              value: track.kind
            },
            priority: {
              enumerable: true,
              get: function() {
                return signaling.updatedPriority;
              }
            },
            track: {
              enumerable: true,
              value: track
            }
          });
          ["disabled", "enabled"].forEach(function(name) {
            return track.on(name, _this._reemitTrackEvent);
          });
          ["warning", "warningsCleared"].forEach(function(name) {
            return signaling.on(name, _this._reemitSignalingEvent);
          });
          return _this;
        }
        LocalTrackPublication2.prototype.toString = function() {
          return "[LocalTrackPublication #" + this._instanceId + ": " + this.trackSid + "]";
        };
        LocalTrackPublication2.prototype.setPriority = function(priority) {
          var priorityValues = Object.values(trackPriority);
          if (!priorityValues.includes(priority)) {
            throw E.INVALID_VALUE("priority", priorityValues);
          }
          this._signaling.setPriority(priority);
          return this;
        };
        LocalTrackPublication2.prototype.unpublish = function() {
          var _this = this;
          ["disabled", "enabled"].forEach(function(name) {
            return _this.track.removeListener(name, _this._reemitTrackEvent);
          });
          ["warning", "warningsCleared"].forEach(function(name) {
            return _this._signaling.removeListener(name, _this._reemitSignalingEvent);
          });
          this._unpublish(this);
          return this;
        };
        return LocalTrackPublication2;
      }(TrackPublication)
    );
    module.exports = LocalTrackPublication;
  }
});

// node_modules/twilio-video/es5/media/track/localaudiotrackpublication.js
var require_localaudiotrackpublication = __commonJS({
  "node_modules/twilio-video/es5/media/track/localaudiotrackpublication.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var LocalTrackPublication = require_localtrackpublication();
    var LocalAudioTrackPublication = (
      /** @class */
      function(_super) {
        __extends(LocalAudioTrackPublication2, _super);
        function LocalAudioTrackPublication2(signaling, track, unpublish, options) {
          return _super.call(this, signaling, track, unpublish, options) || this;
        }
        LocalAudioTrackPublication2.prototype.toString = function() {
          return "[LocalAudioTrackPublication #" + this._instanceId + ": " + this.trackSid + "]";
        };
        return LocalAudioTrackPublication2;
      }(LocalTrackPublication)
    );
    module.exports = LocalAudioTrackPublication;
  }
});

// node_modules/twilio-video/es5/media/track/localdatatrackpublication.js
var require_localdatatrackpublication = __commonJS({
  "node_modules/twilio-video/es5/media/track/localdatatrackpublication.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var LocalTrackPublication = require_localtrackpublication();
    var LocalDataTrackPublication = (
      /** @class */
      function(_super) {
        __extends(LocalDataTrackPublication2, _super);
        function LocalDataTrackPublication2(signaling, track, unpublish, options) {
          return _super.call(this, signaling, track, unpublish, options) || this;
        }
        LocalDataTrackPublication2.prototype.toString = function() {
          return "[LocalDataTrackPublication #" + this._instanceId + ": " + this.trackSid + "]";
        };
        return LocalDataTrackPublication2;
      }(LocalTrackPublication)
    );
    module.exports = LocalDataTrackPublication;
  }
});

// node_modules/twilio-video/es5/media/track/localvideotrackpublication.js
var require_localvideotrackpublication = __commonJS({
  "node_modules/twilio-video/es5/media/track/localvideotrackpublication.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var LocalTrackPublication = require_localtrackpublication();
    var LocalVideoTrackPublication = (
      /** @class */
      function(_super) {
        __extends(LocalVideoTrackPublication2, _super);
        function LocalVideoTrackPublication2(signaling, track, unpublish, options) {
          return _super.call(this, signaling, track, unpublish, options) || this;
        }
        LocalVideoTrackPublication2.prototype.toString = function() {
          return "[LocalVideoTrackPublication #" + this._instanceId + ": " + this.trackSid + "]";
        };
        return LocalVideoTrackPublication2;
      }(LocalTrackPublication)
    );
    module.exports = LocalVideoTrackPublication;
  }
});

// node_modules/twilio-video/es5/media/track/remotemediatrack.js
var require_remotemediatrack = __commonJS({
  "node_modules/twilio-video/es5/media/track/remotemediatrack.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var _a = require_constants();
    var E = _a.typeErrors;
    var trackPriority = _a.trackPriority;
    var isIOS = require_browserdetection().isIOS;
    var documentVisibilityMonitor = require_documentvisibilitymonitor();
    function mixinRemoteMediaTrack(AudioOrVideoTrack) {
      return (
        /** @class */
        function(_super) {
          __extends(RemoteMediaTrack, _super);
          function RemoteMediaTrack(sid, mediaTrackReceiver, isEnabled, isSwitchedOff, setPriority, setRenderHint, options) {
            var _this = this;
            options = Object.assign({
              // NOTE(mpatwardhan): WebKit bug: 212780 sometimes causes the audio/video elements to stay paused when safari
              // regains foreground. To workaround it, when safari gains foreground - we will play any elements that were
              // playing before safari lost foreground.
              workaroundWebKitBug212780: isIOS() && typeof document === "object" && typeof document.addEventListener === "function" && typeof document.visibilityState === "string"
            }, options);
            _this = _super.call(this, mediaTrackReceiver, options) || this;
            Object.defineProperties(_this, {
              _isEnabled: {
                value: isEnabled,
                writable: true
              },
              _isSwitchedOff: {
                value: isSwitchedOff,
                writable: true
              },
              _priority: {
                value: null,
                writable: true
              },
              _setPriority: {
                value: setPriority
              },
              _setRenderHint: {
                value: function(renderHint) {
                  _this._log.debug("updating render hint:", renderHint);
                  setRenderHint(renderHint);
                }
              },
              isEnabled: {
                enumerable: true,
                get: function() {
                  return this._isEnabled;
                }
              },
              isSwitchedOff: {
                enumerable: true,
                get: function() {
                  return this._isSwitchedOff;
                }
              },
              priority: {
                enumerable: true,
                get: function() {
                  return this._priority;
                }
              },
              sid: {
                enumerable: true,
                value: sid
              },
              _workaroundWebKitBug212780: {
                value: options.workaroundWebKitBug212780
              },
              _workaroundWebKitBug212780Cleanup: {
                value: null,
                writable: true
              }
            });
            return _this;
          }
          RemoteMediaTrack.prototype.setPriority = function(priority) {
            var priorityValues = __spreadArray([null], __read(Object.values(trackPriority)));
            if (!priorityValues.includes(priority)) {
              throw E.INVALID_VALUE("priority", priorityValues);
            }
            if (this._priority !== priority) {
              this._priority = priority;
              this._setPriority(priority);
            }
            return this;
          };
          RemoteMediaTrack.prototype._setEnabled = function(isEnabled) {
            if (this._isEnabled !== isEnabled) {
              this._isEnabled = isEnabled;
              this.emit(this._isEnabled ? "enabled" : "disabled", this);
            }
          };
          RemoteMediaTrack.prototype._setSwitchedOff = function(isSwitchedOff) {
            if (this._isSwitchedOff !== isSwitchedOff) {
              this._isSwitchedOff = isSwitchedOff;
              this.emit(isSwitchedOff ? "switchedOff" : "switchedOn", this);
            }
          };
          RemoteMediaTrack.prototype.attach = function(el) {
            var result = _super.prototype.attach.call(this, el);
            if (this.mediaStreamTrack.enabled !== true) {
              this.mediaStreamTrack.enabled = true;
              if (this.processedTrack) {
                this.processedTrack.enabled = true;
              }
              if (this.processor) {
                this._captureFrames();
              }
            }
            if (this._workaroundWebKitBug212780) {
              this._workaroundWebKitBug212780Cleanup = this._workaroundWebKitBug212780Cleanup || playIfPausedWhileInBackground(this);
            }
            return result;
          };
          RemoteMediaTrack.prototype.detach = function(el) {
            var result = _super.prototype.detach.call(this, el);
            if (this._attachments.size === 0) {
              this.mediaStreamTrack.enabled = false;
              if (this.processedTrack) {
                this.processedTrack.enabled = false;
              }
              if (this._workaroundWebKitBug212780Cleanup) {
                this._workaroundWebKitBug212780Cleanup();
                this._workaroundWebKitBug212780Cleanup = null;
              }
            }
            return result;
          };
          return RemoteMediaTrack;
        }(AudioOrVideoTrack)
      );
    }
    function playIfPausedWhileInBackground(remoteMediaTrack) {
      var log = remoteMediaTrack._log, kind = remoteMediaTrack.kind;
      function onVisibilityChanged(isVisible) {
        if (!isVisible) {
          return;
        }
        remoteMediaTrack._attachments.forEach(function(el) {
          var shim = remoteMediaTrack._elShims.get(el);
          var isInadvertentlyPaused = el.paused && shim && !shim.pausedIntentionally();
          if (isInadvertentlyPaused) {
            log.info("Playing inadvertently paused <" + kind + "> element");
            log.debug("Element:", el);
            log.debug("RemoteMediaTrack:", remoteMediaTrack);
            el.play().then(function() {
              log.info("Successfully played inadvertently paused <" + kind + "> element");
              log.debug("Element:", el);
              log.debug("RemoteMediaTrack:", remoteMediaTrack);
            }).catch(function(err) {
              log.warn("Error while playing inadvertently paused <" + kind + "> element:", { err, el, remoteMediaTrack });
            });
          }
        });
      }
      documentVisibilityMonitor.onVisibilityChange(2, onVisibilityChanged);
      return function() {
        documentVisibilityMonitor.offVisibilityChange(2, onVisibilityChanged);
      };
    }
    module.exports = mixinRemoteMediaTrack;
  }
});

// node_modules/twilio-video/es5/media/track/remoteaudiotrack.js
var require_remoteaudiotrack = __commonJS({
  "node_modules/twilio-video/es5/media/track/remoteaudiotrack.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var AudioTrack = require_audiotrack();
    var mixinRemoteMediaTrack = require_remotemediatrack();
    var RemoteMediaAudioTrack = mixinRemoteMediaTrack(AudioTrack);
    var RemoteAudioTrack = (
      /** @class */
      function(_super) {
        __extends(RemoteAudioTrack2, _super);
        function RemoteAudioTrack2(sid, mediaTrackReceiver, isEnabled, isSwitchedOff, setPriority, setRenderHint, options) {
          return _super.call(this, sid, mediaTrackReceiver, isEnabled, isSwitchedOff, setPriority, setRenderHint, options) || this;
        }
        RemoteAudioTrack2.prototype.toString = function() {
          return "[RemoteAudioTrack #" + this._instanceId + ": " + this.sid + "]";
        };
        RemoteAudioTrack2.prototype._start = function() {
          _super.prototype._start.call(this);
          if (this._dummyEl) {
            this._dummyEl.srcObject = null;
            this._dummyEl = null;
          }
        };
        RemoteAudioTrack2.prototype.setPriority = function(priority) {
          return _super.prototype.setPriority.call(this, priority);
        };
        return RemoteAudioTrack2;
      }(RemoteMediaAudioTrack)
    );
    module.exports = RemoteAudioTrack;
  }
});

// node_modules/twilio-video/es5/media/track/remotetrackpublication.js
var require_remotetrackpublication = __commonJS({
  "node_modules/twilio-video/es5/media/track/remotetrackpublication.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var TrackPublication = require_trackpublication();
    var RemoteTrackPublication = (
      /** @class */
      function(_super) {
        __extends(RemoteTrackPublication2, _super);
        function RemoteTrackPublication2(signaling, options) {
          var _this = _super.call(this, signaling.name, signaling.sid, options) || this;
          Object.defineProperties(_this, {
            _signaling: {
              value: signaling
            },
            _track: {
              value: null,
              writable: true
            },
            isSubscribed: {
              enumerable: true,
              get: function() {
                return !!this._track;
              }
            },
            isTrackEnabled: {
              enumerable: true,
              get: function() {
                return signaling.isEnabled;
              }
            },
            kind: {
              enumerable: true,
              value: signaling.kind
            },
            publishPriority: {
              enumerable: true,
              get: function() {
                return signaling.priority;
              }
            },
            track: {
              enumerable: true,
              get: function() {
                return this._track;
              }
            }
          });
          var error = signaling.error, isEnabled = signaling.isEnabled, isSwitchedOff = signaling.isSwitchedOff, priority = signaling.priority;
          signaling.on("updated", function() {
            if (error !== signaling.error) {
              error = signaling.error;
              _this.emit("subscriptionFailed", signaling.error);
              return;
            }
            if (isEnabled !== signaling.isEnabled) {
              isEnabled = signaling.isEnabled;
              if (_this.track) {
                _this.track._setEnabled(signaling.isEnabled);
              }
              _this.emit(signaling.isEnabled ? "trackEnabled" : "trackDisabled");
            }
            if (isSwitchedOff !== signaling.isSwitchedOff) {
              _this._log.debug(_this.trackSid + ": " + (isSwitchedOff ? "OFF" : "ON") + " => " + (signaling.isSwitchedOff ? "OFF" : "ON"));
              isSwitchedOff = signaling.isSwitchedOff;
              if (_this.track) {
                _this.track._setSwitchedOff(signaling.isSwitchedOff);
                _this.emit(isSwitchedOff ? "trackSwitchedOff" : "trackSwitchedOn", _this.track);
              } else if (isSwitchedOff) {
                _this._log.warn("Track was not subscribed when switched Off.");
              }
            }
            if (priority !== signaling.priority) {
              priority = signaling.priority;
              _this.emit("publishPriorityChanged", priority);
            }
          });
          return _this;
        }
        RemoteTrackPublication2.prototype.toString = function() {
          return "[RemoteTrackPublication #" + this._instanceId + ": " + this.trackSid + "]";
        };
        RemoteTrackPublication2.prototype._subscribed = function(track) {
          if (!this._track && track) {
            this._track = track;
            this.emit("subscribed", track);
          }
        };
        RemoteTrackPublication2.prototype._unsubscribe = function() {
          if (this._track) {
            var track = this._track;
            this._track = null;
            this.emit("unsubscribed", track);
          }
        };
        return RemoteTrackPublication2;
      }(TrackPublication)
    );
    module.exports = RemoteTrackPublication;
  }
});

// node_modules/twilio-video/es5/media/track/remoteaudiotrackpublication.js
var require_remoteaudiotrackpublication = __commonJS({
  "node_modules/twilio-video/es5/media/track/remoteaudiotrackpublication.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var RemoteTrackPublication = require_remotetrackpublication();
    var RemoteAudioTrackPublication = (
      /** @class */
      function(_super) {
        __extends(RemoteAudioTrackPublication2, _super);
        function RemoteAudioTrackPublication2(signaling, options) {
          return _super.call(this, signaling, options) || this;
        }
        RemoteAudioTrackPublication2.prototype.toString = function() {
          return "[RemoteAudioTrackPublication #" + this._instanceId + ": " + this.trackSid + "]";
        };
        return RemoteAudioTrackPublication2;
      }(RemoteTrackPublication)
    );
    module.exports = RemoteAudioTrackPublication;
  }
});

// node_modules/twilio-video/es5/media/track/remotedatatrack.js
var require_remotedatatrack = __commonJS({
  "node_modules/twilio-video/es5/media/track/remotedatatrack.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var Track = require_track();
    var _a = require_constants();
    var E = _a.typeErrors;
    var trackPriority = _a.trackPriority;
    var RemoteDataTrack = (
      /** @class */
      function(_super) {
        __extends(RemoteDataTrack2, _super);
        function RemoteDataTrack2(sid, dataTrackReceiver, options) {
          var _this = _super.call(this, dataTrackReceiver.id, "data", options) || this;
          Object.defineProperties(_this, {
            _isSwitchedOff: {
              value: false,
              writable: true
            },
            _priority: {
              value: null,
              writable: true
            },
            isEnabled: {
              enumerable: true,
              value: true
            },
            isSwitchedOff: {
              enumerable: true,
              get: function() {
                return this._isSwitchedOff;
              }
            },
            maxPacketLifeTime: {
              enumerable: true,
              value: dataTrackReceiver.maxPacketLifeTime
            },
            maxRetransmits: {
              enumerable: true,
              value: dataTrackReceiver.maxRetransmits
            },
            ordered: {
              enumerable: true,
              value: dataTrackReceiver.ordered
            },
            priority: {
              enumerable: true,
              get: function() {
                return this._priority;
              }
            },
            reliable: {
              enumerable: true,
              value: dataTrackReceiver.maxPacketLifeTime === null && dataTrackReceiver.maxRetransmits === null
            },
            sid: {
              enumerable: true,
              value: sid
            }
          });
          dataTrackReceiver.on("message", function(data) {
            _this.emit("message", data, _this);
          });
          return _this;
        }
        RemoteDataTrack2.prototype.setPriority = function(priority) {
          var priorityValues = __spreadArray([null], __read(Object.values(trackPriority)));
          if (!priorityValues.includes(priority)) {
            throw E.INVALID_VALUE("priority", priorityValues);
          }
          this._priority = priority;
          return this;
        };
        RemoteDataTrack2.prototype._setEnabled = function() {
        };
        RemoteDataTrack2.prototype._setSwitchedOff = function(isSwitchedOff) {
          if (this._isSwitchedOff !== isSwitchedOff) {
            this._isSwitchedOff = isSwitchedOff;
            this.emit(isSwitchedOff ? "switchedOff" : "switchedOn", this);
          }
        };
        return RemoteDataTrack2;
      }(Track)
    );
    module.exports = RemoteDataTrack;
  }
});

// node_modules/twilio-video/es5/media/track/remotedatatrackpublication.js
var require_remotedatatrackpublication = __commonJS({
  "node_modules/twilio-video/es5/media/track/remotedatatrackpublication.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var RemoteTrackPublication = require_remotetrackpublication();
    var RemoteDataTrackPublication = (
      /** @class */
      function(_super) {
        __extends(RemoteDataTrackPublication2, _super);
        function RemoteDataTrackPublication2(signaling, options) {
          return _super.call(this, signaling, options) || this;
        }
        RemoteDataTrackPublication2.prototype.toString = function() {
          return "[RemoteDataTrackPublication #" + this._instanceId + ": " + this.trackSid + "]";
        };
        return RemoteDataTrackPublication2;
      }(RemoteTrackPublication)
    );
    module.exports = RemoteDataTrackPublication;
  }
});

// node_modules/twilio-video/es5/util/nullobserver.js
var require_nullobserver = __commonJS({
  "node_modules/twilio-video/es5/util/nullobserver.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var NullObserver = (
      /** @class */
      function() {
        function NullObserver2(callback) {
          Object.defineProperties(this, {
            _callback: {
              value: callback
            }
          });
        }
        NullObserver2.prototype.observe = function() {
        };
        NullObserver2.prototype.unobserve = function() {
        };
        NullObserver2.prototype.makeVisible = function(videoEl) {
          var visibleEntry = this._makeFakeEntry(videoEl, true);
          this._callback([visibleEntry]);
        };
        NullObserver2.prototype.makeInvisible = function(videoEl) {
          var invisibleEntry = this._makeFakeEntry(videoEl, false);
          this._callback([invisibleEntry]);
        };
        NullObserver2.prototype._makeFakeEntry = function(videoElement, isIntersecting) {
          return { target: videoElement, isIntersecting };
        };
        return NullObserver2;
      }()
    );
    var NullIntersectionObserver = (
      /** @class */
      function(_super) {
        __extends(NullIntersectionObserver2, _super);
        function NullIntersectionObserver2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        return NullIntersectionObserver2;
      }(NullObserver)
    );
    var NullResizeObserver = (
      /** @class */
      function(_super) {
        __extends(NullResizeObserver2, _super);
        function NullResizeObserver2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        NullResizeObserver2.prototype.resize = function(videoEl) {
          var entry = this._makeFakeEntry(videoEl, true);
          this._callback([entry]);
        };
        return NullResizeObserver2;
      }(NullObserver)
    );
    module.exports = { NullIntersectionObserver, NullResizeObserver, NullObserver };
  }
});

// node_modules/twilio-video/es5/media/track/remotevideotrack.js
var require_remotevideotrack = __commonJS({
  "node_modules/twilio-video/es5/media/track/remotevideotrack.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var mixinRemoteMediaTrack = require_remotemediatrack();
    var VideoTrack = require_videotrack();
    var documentVisibilityMonitor = require_documentvisibilitymonitor();
    var NullObserver = require_nullobserver().NullObserver;
    var Timeout = require_timeout();
    var RemoteMediaVideoTrack = mixinRemoteMediaTrack(VideoTrack);
    var TRACK_TURN_OF_DELAY_MS = 50;
    var RemoteVideoTrack = (
      /** @class */
      function(_super) {
        __extends(RemoteVideoTrack2, _super);
        function RemoteVideoTrack2(sid, mediaTrackReceiver, isEnabled, isSwitchedOff, setPriority, setRenderHint, options) {
          var _this = this;
          options = Object.assign({
            clientTrackSwitchOffControl: "auto",
            contentPreferencesMode: "auto",
            enableDocumentVisibilityTurnOff: true
          }, options);
          options = Object.assign({
            IntersectionObserver: typeof IntersectionObserver === "undefined" || options.clientTrackSwitchOffControl !== "auto" ? NullObserver : IntersectionObserver,
            ResizeObserver: typeof ResizeObserver === "undefined" || options.contentPreferencesMode !== "auto" ? NullObserver : ResizeObserver
          }, options);
          _this = _super.call(this, sid, mediaTrackReceiver, isEnabled, isSwitchedOff, setPriority, setRenderHint, options) || this;
          Object.defineProperties(_this, {
            _enableDocumentVisibilityTurnOff: {
              value: options.enableDocumentVisibilityTurnOff === true && options.clientTrackSwitchOffControl === "auto"
            },
            _documentVisibilityTurnOffCleanup: {
              value: null,
              writable: true
            },
            _clientTrackSwitchOffControl: {
              value: options.clientTrackSwitchOffControl
            },
            _contentPreferencesMode: {
              value: options.contentPreferencesMode
            },
            _invisibleElements: {
              value: /* @__PURE__ */ new WeakSet()
            },
            _elToPipCallbacks: {
              value: /* @__PURE__ */ new WeakMap()
            },
            _elToPipWindows: {
              value: /* @__PURE__ */ new WeakMap()
            },
            _turnOffTimer: {
              value: new Timeout(function() {
                _this._setRenderHint({ enabled: false });
              }, TRACK_TURN_OF_DELAY_MS, false)
            },
            _resizeObserver: {
              value: new options.ResizeObserver(function(entries) {
                var visibleElementResized = entries.find(function(entry) {
                  return !_this._invisibleElements.has(entry.target);
                });
                if (visibleElementResized) {
                  maybeUpdateDimensionHint(_this);
                }
              })
            },
            _intersectionObserver: {
              value: new options.IntersectionObserver(function(entries) {
                var shouldSetRenderHint = false;
                entries.forEach(function(entry) {
                  var wasVisible = !_this._invisibleElements.has(entry.target);
                  if (wasVisible !== entry.isIntersecting) {
                    if (entry.isIntersecting) {
                      _this._log.debug("intersectionObserver detected: Off => On");
                      _this._invisibleElements.delete(entry.target);
                    } else {
                      _this._log.debug("intersectionObserver detected: On => Off");
                      _this._invisibleElements.add(entry.target);
                    }
                    shouldSetRenderHint = true;
                  }
                });
                if (shouldSetRenderHint) {
                  maybeUpdateEnabledHint(_this);
                  maybeUpdateDimensionHint(_this);
                }
              }, { threshold: 0.25 })
            }
          });
          return _this;
        }
        RemoteVideoTrack2.prototype._start = function(dummyEl) {
          var result = _super.prototype._start.call(this, dummyEl);
          maybeUpdateEnabledHint(this);
          return result;
        };
        RemoteVideoTrack2.prototype.switchOn = function() {
          if (this._clientTrackSwitchOffControl !== "manual") {
            throw new Error('Invalid state. You can call switchOn only when bandwidthProfile.video.clientTrackSwitchOffControl is set to "manual"');
          }
          this._setRenderHint({ enabled: true });
          return this;
        };
        RemoteVideoTrack2.prototype.switchOff = function() {
          if (this._clientTrackSwitchOffControl !== "manual") {
            throw new Error('Invalid state. You can call switchOff only when bandwidthProfile.video.clientTrackSwitchOffControl is set to "manual"');
          }
          this._setRenderHint({ enabled: false });
          return this;
        };
        RemoteVideoTrack2.prototype.setContentPreferences = function(contentPreferences) {
          if (this._contentPreferencesMode !== "manual") {
            throw new Error('Invalid state. You can call switchOn only when bandwidthProfile.video.contentPreferencesMode is set to "manual"');
          }
          if (contentPreferences.renderDimensions) {
            this._setRenderHint({ renderDimensions: contentPreferences.renderDimensions });
          }
          return this;
        };
        RemoteVideoTrack2.prototype._unObservePip = function(el) {
          var pipCallbacks = this._elToPipCallbacks.get(el);
          if (pipCallbacks) {
            el.removeEventListener("enterpictureinpicture", pipCallbacks.onEnterPip);
            el.removeEventListener("leavepictureinpicture", pipCallbacks.onLeavePip);
            this._elToPipCallbacks.delete(el);
          }
        };
        RemoteVideoTrack2.prototype._observePip = function(el) {
          var _this = this;
          var pipCallbacks = this._elToPipCallbacks.get(el);
          if (!pipCallbacks) {
            var onEnterPip = function(event) {
              return _this._onEnterPip(event, el);
            };
            var onLeavePip = function(event) {
              return _this._onLeavePip(event, el);
            };
            var onResizePip = function(event) {
              return _this._onResizePip(event, el);
            };
            el.addEventListener("enterpictureinpicture", onEnterPip);
            el.addEventListener("leavepictureinpicture", onLeavePip);
            this._elToPipCallbacks.set(el, { onEnterPip, onLeavePip, onResizePip });
          }
        };
        RemoteVideoTrack2.prototype._onEnterPip = function(event, videoEl) {
          this._log.debug("onEnterPip");
          var pipWindow = event.pictureInPictureWindow;
          this._elToPipWindows.set(videoEl, pipWindow);
          var onResizePip = this._elToPipCallbacks.get(videoEl).onResizePip;
          pipWindow.addEventListener("resize", onResizePip);
          maybeUpdateEnabledHint(this);
        };
        RemoteVideoTrack2.prototype._onLeavePip = function(event, videoEl) {
          this._log.debug("onLeavePip");
          this._elToPipWindows.delete(videoEl);
          var onResizePip = this._elToPipCallbacks.get(videoEl).onResizePip;
          var pipWindow = event.pictureInPictureWindow;
          pipWindow.removeEventListener("resize", onResizePip);
          maybeUpdateEnabledHint(this);
        };
        RemoteVideoTrack2.prototype._onResizePip = function() {
          maybeUpdateDimensionHint(this);
        };
        RemoteVideoTrack2.prototype.attach = function(el) {
          var result = _super.prototype.attach.call(this, el);
          if (this._clientTrackSwitchOffControl === "auto") {
            this._invisibleElements.add(result);
          }
          this._intersectionObserver.observe(result);
          this._resizeObserver.observe(result);
          if (this._enableDocumentVisibilityTurnOff) {
            this._documentVisibilityTurnOffCleanup = this._documentVisibilityTurnOffCleanup || setupDocumentVisibilityTurnOff(this);
          }
          this._observePip(result);
          return result;
        };
        RemoteVideoTrack2.prototype.detach = function(el) {
          var _this = this;
          var result = _super.prototype.detach.call(this, el);
          var elements = Array.isArray(result) ? result : [result];
          elements.forEach(function(element) {
            _this._intersectionObserver.unobserve(element);
            _this._resizeObserver.unobserve(element);
            _this._invisibleElements.delete(element);
            _this._unObservePip(element);
          });
          if (this._attachments.size === 0) {
            if (this._documentVisibilityTurnOffCleanup) {
              this._documentVisibilityTurnOffCleanup();
              this._documentVisibilityTurnOffCleanup = null;
            }
          }
          maybeUpdateEnabledHint(this);
          maybeUpdateDimensionHint(this);
          return result;
        };
        RemoteVideoTrack2.prototype.addProcessor = function() {
          return _super.prototype.addProcessor.apply(this, arguments);
        };
        RemoteVideoTrack2.prototype.removeProcessor = function() {
          return _super.prototype.removeProcessor.apply(this, arguments);
        };
        RemoteVideoTrack2.prototype.toString = function() {
          return "[RemoteVideoTrack #" + this._instanceId + ": " + this.sid + "]";
        };
        RemoteVideoTrack2.prototype.setPriority = function(priority) {
          return _super.prototype.setPriority.call(this, priority);
        };
        return RemoteVideoTrack2;
      }(RemoteMediaVideoTrack)
    );
    function setupDocumentVisibilityTurnOff(removeVideoTrack) {
      function onVisibilityChanged() {
        maybeUpdateEnabledHint(removeVideoTrack);
      }
      documentVisibilityMonitor.onVisibilityChange(1, onVisibilityChanged);
      return function() {
        documentVisibilityMonitor.offVisibilityChange(1, onVisibilityChanged);
      };
    }
    function maybeUpdateEnabledHint(remoteVideoTrack) {
      if (remoteVideoTrack._clientTrackSwitchOffControl !== "auto") {
        return;
      }
      var visibleElements = remoteVideoTrack._getAllAttachedElements().filter(function(el) {
        return !remoteVideoTrack._invisibleElements.has(el);
      });
      var pipWindows = remoteVideoTrack._getAllAttachedElements().filter(function(el) {
        return remoteVideoTrack._elToPipWindows.has(el);
      });
      var enabled = pipWindows.length > 0 || document.visibilityState === "visible" && visibleElements.length > 0;
      if (enabled === true) {
        remoteVideoTrack._turnOffTimer.clear();
        remoteVideoTrack._setRenderHint({ enabled: true });
      } else if (!remoteVideoTrack._turnOffTimer.isSet) {
        remoteVideoTrack._turnOffTimer.start();
      }
    }
    function maybeUpdateDimensionHint(remoteVideoTrack) {
      if (remoteVideoTrack._contentPreferencesMode !== "auto") {
        return;
      }
      var visibleElements = remoteVideoTrack._getAllAttachedElements().filter(function(el) {
        return !remoteVideoTrack._invisibleElements.has(el);
      });
      var pipElements = remoteVideoTrack._getAllAttachedElements().map(function(el) {
        var pipWindow = remoteVideoTrack._elToPipWindows.get(el);
        return pipWindow ? { clientHeight: pipWindow.height, clientWidth: pipWindow.width } : { clientHeight: 0, clientWidth: 0 };
      });
      var totalElements = visibleElements.concat(pipElements);
      if (totalElements.length > 0) {
        var _a = __read(totalElements.sort(function(el1, el2) {
          return el2.clientHeight + el2.clientWidth - el1.clientHeight - el1.clientWidth - 1;
        }), 1), _b = _a[0], clientHeight = _b.clientHeight, clientWidth = _b.clientWidth;
        var renderDimensions = { height: clientHeight, width: clientWidth };
        remoteVideoTrack._setRenderHint({ renderDimensions });
      }
    }
    module.exports = RemoteVideoTrack;
  }
});

// node_modules/twilio-video/es5/media/track/remotevideotrackpublication.js
var require_remotevideotrackpublication = __commonJS({
  "node_modules/twilio-video/es5/media/track/remotevideotrackpublication.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var RemoteTrackPublication = require_remotetrackpublication();
    var RemoteVideoTrackPublication = (
      /** @class */
      function(_super) {
        __extends(RemoteVideoTrackPublication2, _super);
        function RemoteVideoTrackPublication2(signaling, options) {
          return _super.call(this, signaling, options) || this;
        }
        RemoteVideoTrackPublication2.prototype.toString = function() {
          return "[RemoteVideoTrackPublication #" + this._instanceId + ": " + this.trackSid + "]";
        };
        return RemoteVideoTrackPublication2;
      }(RemoteTrackPublication)
    );
    module.exports = RemoteVideoTrackPublication;
  }
});

// node_modules/twilio-video/es5/participant.js
var require_participant = __commonJS({
  "node_modules/twilio-video/es5/participant.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var EventEmitter = require_eventemitter();
    var RemoteAudioTrack = require_remoteaudiotrack();
    var RemoteAudioTrackPublication = require_remoteaudiotrackpublication();
    var RemoteDataTrack = require_remotedatatrack();
    var RemoteDataTrackPublication = require_remotedatatrackpublication();
    var RemoteVideoTrack = require_remotevideotrack();
    var RemoteVideoTrackPublication = require_remotevideotrackpublication();
    var util = require_util2();
    var nInstances = 0;
    var Participant = (
      /** @class */
      function(_super) {
        __extends(Participant2, _super);
        function Participant2(signaling, options) {
          var _this = _super.call(this) || this;
          options = Object.assign({
            RemoteAudioTrack,
            RemoteAudioTrackPublication,
            RemoteDataTrack,
            RemoteDataTrackPublication,
            RemoteVideoTrack,
            RemoteVideoTrackPublication,
            tracks: []
          }, options);
          var indexed = indexTracksById(options.tracks);
          var log = options.log.createLog("default", _this);
          var audioTracks = new Map(indexed.audioTracks);
          var dataTracks = new Map(indexed.dataTracks);
          var tracks = new Map(indexed.tracks);
          var videoTracks = new Map(indexed.videoTracks);
          Object.defineProperties(_this, {
            _RemoteAudioTrack: {
              value: options.RemoteAudioTrack
            },
            _RemoteAudioTrackPublication: {
              value: options.RemoteAudioTrackPublication
            },
            _RemoteDataTrack: {
              value: options.RemoteDataTrack
            },
            _RemoteDataTrackPublication: {
              value: options.RemoteDataTrackPublication
            },
            _RemoteVideoTrack: {
              value: options.RemoteVideoTrack
            },
            _RemoteVideoTrackPublication: {
              value: options.RemoteVideoTrackPublication
            },
            _audioTracks: {
              value: audioTracks
            },
            _dataTracks: {
              value: dataTracks
            },
            _instanceId: {
              value: ++nInstances
            },
            _clientTrackSwitchOffControl: {
              value: options.clientTrackSwitchOffControl
            },
            _contentPreferencesMode: {
              value: options.contentPreferencesMode
            },
            _log: {
              value: log
            },
            _signaling: {
              value: signaling
            },
            _tracks: {
              value: tracks
            },
            _trackEventReemitters: {
              value: /* @__PURE__ */ new Map()
            },
            _trackPublicationEventReemitters: {
              value: /* @__PURE__ */ new Map()
            },
            _trackSignalingUpdatedEventCallbacks: {
              value: /* @__PURE__ */ new Map()
            },
            _videoTracks: {
              value: videoTracks
            },
            audioTracks: {
              enumerable: true,
              value: /* @__PURE__ */ new Map()
            },
            dataTracks: {
              enumerable: true,
              value: /* @__PURE__ */ new Map()
            },
            identity: {
              enumerable: true,
              get: function() {
                return signaling.identity;
              }
            },
            networkQualityLevel: {
              enumerable: true,
              get: function() {
                return signaling.networkQualityLevel;
              }
            },
            networkQualityStats: {
              enumerable: true,
              get: function() {
                return signaling.networkQualityStats;
              }
            },
            sid: {
              enumerable: true,
              get: function() {
                return signaling.sid;
              }
            },
            state: {
              enumerable: true,
              get: function() {
                return signaling.state;
              }
            },
            tracks: {
              enumerable: true,
              value: /* @__PURE__ */ new Map()
            },
            videoTracks: {
              enumerable: true,
              value: /* @__PURE__ */ new Map()
            }
          });
          _this._tracks.forEach(reemitTrackEvents.bind(null, _this));
          signaling.on("networkQualityLevelChanged", function() {
            return _this.emit("networkQualityLevelChanged", _this.networkQualityLevel, _this.networkQualityStats && (_this.networkQualityStats.audio || _this.networkQualityStats.video) ? _this.networkQualityStats : null);
          });
          reemitSignalingStateChangedEvents(_this, signaling);
          log.info("Created a new Participant" + (_this.identity ? ": " + _this.identity : ""));
          return _this;
        }
        Participant2.prototype._getTrackEvents = function() {
          return [
            ["dimensionsChanged", "trackDimensionsChanged"],
            ["message", "trackMessage"],
            ["started", "trackStarted"]
          ];
        };
        Participant2.prototype._getTrackPublicationEvents = function() {
          return [];
        };
        Participant2.prototype.toString = function() {
          return "[Participant #" + this._instanceId + ": " + this.sid + "]";
        };
        Participant2.prototype._addTrack = function(track, id) {
          var log = this._log;
          if (this._tracks.has(id)) {
            return null;
          }
          this._tracks.set(id, track);
          var tracksByKind = {
            audio: this._audioTracks,
            video: this._videoTracks,
            data: this._dataTracks
          }[track.kind];
          tracksByKind.set(id, track);
          reemitTrackEvents(this, track, id);
          log.info("Added a new " + util.trackClass(track) + ":", id);
          log.debug(util.trackClass(track) + ":", track);
          return track;
        };
        Participant2.prototype._addTrackPublication = function(publication) {
          var log = this._log;
          if (this.tracks.has(publication.trackSid)) {
            return null;
          }
          this.tracks.set(publication.trackSid, publication);
          var trackPublicationsByKind = {
            audio: this.audioTracks,
            data: this.dataTracks,
            video: this.videoTracks
          }[publication.kind];
          trackPublicationsByKind.set(publication.trackSid, publication);
          reemitTrackPublicationEvents(this, publication);
          log.info("Added a new " + util.trackPublicationClass(publication) + ":", publication.trackSid);
          log.debug(util.trackPublicationClass(publication) + ":", publication);
          return publication;
        };
        Participant2.prototype._handleTrackSignalingEvents = function() {
          var _a = this, log = _a._log, clientTrackSwitchOffControl = _a._clientTrackSwitchOffControl, contentPreferencesMode = _a._contentPreferencesMode;
          var self = this;
          if (this.state === "disconnected") {
            return;
          }
          var RemoteAudioTrack2 = this._RemoteAudioTrack;
          var RemoteAudioTrackPublication2 = this._RemoteAudioTrackPublication;
          var RemoteVideoTrack2 = this._RemoteVideoTrack;
          var RemoteVideoTrackPublication2 = this._RemoteVideoTrackPublication;
          var RemoteDataTrack2 = this._RemoteDataTrack;
          var RemoteDataTrackPublication2 = this._RemoteDataTrackPublication;
          var participantSignaling = this._signaling;
          function trackSignalingAdded(signaling) {
            var RemoteTrackPublication = {
              audio: RemoteAudioTrackPublication2,
              data: RemoteDataTrackPublication2,
              video: RemoteVideoTrackPublication2
            }[signaling.kind];
            var publication = new RemoteTrackPublication(signaling, { log });
            self._addTrackPublication(publication);
            var isSubscribed = signaling.isSubscribed;
            if (isSubscribed) {
              trackSignalingSubscribed(signaling);
            }
            self._trackSignalingUpdatedEventCallbacks.set(signaling.sid, function() {
              if (isSubscribed !== signaling.isSubscribed) {
                isSubscribed = signaling.isSubscribed;
                if (isSubscribed) {
                  trackSignalingSubscribed(signaling);
                  return;
                }
                trackSignalingUnsubscribed(signaling);
              }
            });
            signaling.on("updated", self._trackSignalingUpdatedEventCallbacks.get(signaling.sid));
          }
          function trackSignalingRemoved(signaling) {
            if (signaling.isSubscribed) {
              signaling.setTrackTransceiver(null);
            }
            var updated = self._trackSignalingUpdatedEventCallbacks.get(signaling.sid);
            if (updated) {
              signaling.removeListener("updated", updated);
              self._trackSignalingUpdatedEventCallbacks.delete(signaling.sid);
            }
            var publication = self.tracks.get(signaling.sid);
            if (publication) {
              self._removeTrackPublication(publication);
            }
          }
          function trackSignalingSubscribed(signaling) {
            var isEnabled = signaling.isEnabled, name = signaling.name, kind = signaling.kind, sid = signaling.sid, trackTransceiver = signaling.trackTransceiver, isSwitchedOff = signaling.isSwitchedOff;
            var RemoteTrack = {
              audio: RemoteAudioTrack2,
              video: RemoteVideoTrack2,
              data: RemoteDataTrack2
            }[kind];
            var publication = self.tracks.get(sid);
            if (!RemoteTrack || kind !== trackTransceiver.kind) {
              return;
            }
            var options = { log, name, clientTrackSwitchOffControl, contentPreferencesMode };
            var setPriority = function(newPriority) {
              return participantSignaling.updateSubscriberTrackPriority(sid, newPriority);
            };
            var setRenderHint = function(renderHint) {
              if (signaling.isSubscribed) {
                participantSignaling.updateTrackRenderHint(sid, renderHint);
              }
            };
            var track = kind === "data" ? new RemoteTrack(sid, trackTransceiver, options) : new RemoteTrack(sid, trackTransceiver, isEnabled, isSwitchedOff, setPriority, setRenderHint, options);
            self._addTrack(track, publication, trackTransceiver.id);
          }
          function trackSignalingUnsubscribed(signaling) {
            var _a2 = __read(Array.from(self._tracks.entries()).find(function(_a3) {
              var _b = __read(_a3, 2), track2 = _b[1];
              return track2.sid === signaling.sid;
            }), 2), id = _a2[0], track = _a2[1];
            var publication = self.tracks.get(signaling.sid);
            if (track) {
              self._removeTrack(track, publication, id);
            }
          }
          participantSignaling.on("trackAdded", trackSignalingAdded);
          participantSignaling.on("trackRemoved", trackSignalingRemoved);
          participantSignaling.tracks.forEach(trackSignalingAdded);
          participantSignaling.on("stateChanged", function stateChanged(state) {
            if (state === "disconnected") {
              log.debug("Removing event listeners");
              participantSignaling.removeListener("stateChanged", stateChanged);
              participantSignaling.removeListener("trackAdded", trackSignalingAdded);
              participantSignaling.removeListener("trackRemoved", trackSignalingRemoved);
            } else if (state === "connected") {
              log.info("reconnected");
              setTimeout(function() {
                return self.emit("reconnected");
              }, 0);
            }
          });
        };
        Participant2.prototype._removeTrack = function(track, id) {
          if (!this._tracks.has(id)) {
            return null;
          }
          this._tracks.delete(id);
          var tracksByKind = {
            audio: this._audioTracks,
            video: this._videoTracks,
            data: this._dataTracks
          }[track.kind];
          tracksByKind.delete(id);
          var reemitters = this._trackEventReemitters.get(id) || /* @__PURE__ */ new Map();
          reemitters.forEach(function(reemitter, event) {
            track.removeListener(event, reemitter);
          });
          var log = this._log;
          log.info("Removed a " + util.trackClass(track) + ":", id);
          log.debug(util.trackClass(track) + ":", track);
          return track;
        };
        Participant2.prototype._removeTrackPublication = function(publication) {
          publication = this.tracks.get(publication.trackSid);
          if (!publication) {
            return null;
          }
          this.tracks.delete(publication.trackSid);
          var trackPublicationsByKind = {
            audio: this.audioTracks,
            data: this.dataTracks,
            video: this.videoTracks
          }[publication.kind];
          trackPublicationsByKind.delete(publication.trackSid);
          var reemitters = this._trackPublicationEventReemitters.get(publication.trackSid) || /* @__PURE__ */ new Map();
          reemitters.forEach(function(reemitter, event) {
            publication.removeListener(event, reemitter);
          });
          var log = this._log;
          log.info("Removed a " + util.trackPublicationClass(publication) + ":", publication.trackSid);
          log.debug(util.trackPublicationClass(publication) + ":", publication);
          return publication;
        };
        Participant2.prototype.toJSON = function() {
          return util.valueToJSON(this);
        };
        return Participant2;
      }(EventEmitter)
    );
    function indexTracksById(tracks) {
      var indexedTracks = tracks.map(function(track) {
        return [track.id, track];
      });
      var indexedAudioTracks = indexedTracks.filter(function(keyValue) {
        return keyValue[1].kind === "audio";
      });
      var indexedVideoTracks = indexedTracks.filter(function(keyValue) {
        return keyValue[1].kind === "video";
      });
      var indexedDataTracks = indexedTracks.filter(function(keyValue) {
        return keyValue[1].kind === "data";
      });
      return {
        audioTracks: indexedAudioTracks,
        dataTracks: indexedDataTracks,
        tracks: indexedTracks,
        videoTracks: indexedVideoTracks
      };
    }
    function reemitSignalingStateChangedEvents(participant, signaling) {
      var log = participant._log;
      if (participant.state === "disconnected") {
        return;
      }
      signaling.on("stateChanged", function stateChanged(state) {
        log.debug("Transitioned to state:", state);
        participant.emit(state, participant);
        if (state === "disconnected") {
          log.debug("Removing Track event reemitters");
          signaling.removeListener("stateChanged", stateChanged);
          participant._tracks.forEach(function(track) {
            var reemitters = participant._trackEventReemitters.get(track.id);
            if (track && reemitters) {
              reemitters.forEach(function(reemitter, event) {
                track.removeListener(event, reemitter);
              });
            }
          });
          signaling.tracks.forEach(function(trackSignaling) {
            var track = participant._tracks.get(trackSignaling.id);
            var reemitters = participant._trackEventReemitters.get(trackSignaling.id);
            if (track && reemitters) {
              reemitters.forEach(function(reemitter, event) {
                track.removeListener(event, reemitter);
              });
            }
          });
          participant._trackEventReemitters.clear();
          participant.tracks.forEach(function(publication) {
            participant._trackPublicationEventReemitters.get(publication.trackSid).forEach(function(reemitter, event) {
              publication.removeListener(event, reemitter);
            });
          });
          participant._trackPublicationEventReemitters.clear();
        }
      });
    }
    function reemitTrackEvents(participant, track, id) {
      var trackEventReemitters = /* @__PURE__ */ new Map();
      if (participant.state === "disconnected") {
        return;
      }
      participant._getTrackEvents().forEach(function(eventPair) {
        var trackEvent = eventPair[0];
        var participantEvent = eventPair[1];
        trackEventReemitters.set(trackEvent, function() {
          var args = [participantEvent].concat([].slice.call(arguments));
          return participant.emit.apply(participant, __spreadArray([], __read(args)));
        });
        track.on(trackEvent, trackEventReemitters.get(trackEvent));
      });
      participant._trackEventReemitters.set(id, trackEventReemitters);
    }
    function reemitTrackPublicationEvents(participant, publication) {
      var publicationEventReemitters = /* @__PURE__ */ new Map();
      if (participant.state === "disconnected") {
        return;
      }
      participant._getTrackPublicationEvents().forEach(function(_a) {
        var _b = __read(_a, 2), publicationEvent = _b[0], participantEvent = _b[1];
        publicationEventReemitters.set(publicationEvent, function() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          participant.emit.apply(participant, __spreadArray(__spreadArray([participantEvent], __read(args)), [publication]));
        });
        publication.on(publicationEvent, publicationEventReemitters.get(publicationEvent));
      });
      participant._trackPublicationEventReemitters.set(publication.trackSid, publicationEventReemitters);
    }
    module.exports = Participant;
  }
});

// node_modules/twilio-video/es5/localparticipant.js
var require_localparticipant = __commonJS({
  "node_modules/twilio-video/es5/localparticipant.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var MediaStreamTrack2 = require_webrtc().MediaStreamTrack;
    var _a = require_util2();
    var asLocalTrack = _a.asLocalTrack;
    var asLocalTrackPublication = _a.asLocalTrackPublication;
    var trackClass = _a.trackClass;
    var _b = require_constants();
    var E = _b.typeErrors;
    var trackPriority = _b.trackPriority;
    var validateLocalTrack = require_validate().validateLocalTrack;
    var _c = require_es5();
    var LocalAudioTrack = _c.LocalAudioTrack;
    var LocalDataTrack = _c.LocalDataTrack;
    var LocalVideoTrack = _c.LocalVideoTrack;
    var LocalAudioTrackPublication = require_localaudiotrackpublication();
    var LocalDataTrackPublication = require_localdatatrackpublication();
    var LocalVideoTrackPublication = require_localvideotrackpublication();
    var Participant = require_participant();
    var LocalParticipant = (
      /** @class */
      function(_super) {
        __extends(LocalParticipant2, _super);
        function LocalParticipant2(signaling, localTracks, options) {
          var _this = this;
          options = Object.assign({
            LocalAudioTrack,
            LocalVideoTrack,
            LocalDataTrack,
            MediaStreamTrack: MediaStreamTrack2,
            LocalAudioTrackPublication,
            LocalVideoTrackPublication,
            LocalDataTrackPublication,
            shouldStopLocalTracks: false,
            tracks: localTracks
          }, options);
          var tracksToStop = options.shouldStopLocalTracks ? new Set(localTracks.filter(function(localTrack) {
            return localTrack.kind !== "data";
          })) : /* @__PURE__ */ new Set();
          _this = _super.call(this, signaling, options) || this;
          Object.defineProperties(_this, {
            _eventObserver: {
              value: options.eventObserver
            },
            _LocalAudioTrack: {
              value: options.LocalAudioTrack
            },
            _LocalDataTrack: {
              value: options.LocalDataTrack
            },
            _LocalVideoTrack: {
              value: options.LocalVideoTrack
            },
            _MediaStreamTrack: {
              value: options.MediaStreamTrack
            },
            _LocalAudioTrackPublication: {
              value: options.LocalAudioTrackPublication
            },
            _LocalDataTrackPublication: {
              value: options.LocalDataTrackPublication
            },
            _LocalVideoTrackPublication: {
              value: options.LocalVideoTrackPublication
            },
            _tracksToStop: {
              value: tracksToStop
            },
            signalingRegion: {
              enumerable: true,
              get: function() {
                return signaling.signalingRegion;
              }
            }
          });
          _this._handleTrackSignalingEvents();
          return _this;
        }
        LocalParticipant2.prototype._addTrack = function(track, id, priority) {
          var addedTrack = _super.prototype._addTrack.call(this, track, id);
          if (addedTrack && this.state !== "disconnected") {
            this._addLocalTrack(track, priority);
          }
          return addedTrack;
        };
        LocalParticipant2.prototype._addLocalTrack = function(track, priority) {
          var _a2;
          var vendor = (_a2 = track.noiseCancellation) === null || _a2 === void 0 ? void 0 : _a2.vendor;
          this._signaling.addTrack(track._trackSender, track.name, priority, vendor);
          this._log.info("Added a new " + trackClass(track, true) + ":", track.id);
          this._log.debug(trackClass(track, true) + ":", track);
        };
        LocalParticipant2.prototype._removeTrack = function(track, id) {
          var removedTrack = _super.prototype._removeTrack.call(this, track, id);
          if (removedTrack && this.state !== "disconnected") {
            this._signaling.removeTrack(track._trackSender);
            this._log.info("Removed a " + trackClass(track, true) + ":", track.id);
            this._log.debug(trackClass(track, true) + ":", track);
          }
          return removedTrack;
        };
        LocalParticipant2.prototype._getTrackEvents = function() {
          return _super.prototype._getTrackEvents.call(this).concat([
            ["disabled", "trackDisabled"],
            ["enabled", "trackEnabled"],
            ["stopped", "trackStopped"]
          ]);
        };
        LocalParticipant2.prototype.toString = function() {
          return "[LocalParticipant #" + this._instanceId + (this.sid ? ": " + this.sid : "") + "]";
        };
        LocalParticipant2.prototype._handleTrackSignalingEvents = function() {
          var _this = this;
          var log = this._log;
          if (this.state === "disconnected") {
            return;
          }
          var localTrackDisabled = function(localTrack) {
            var trackSignaling = _this._signaling.getPublication(localTrack._trackSender);
            if (trackSignaling) {
              trackSignaling.disable();
              log.debug("Disabled the " + trackClass(localTrack, true) + ":", localTrack.id);
            }
          };
          var localTrackEnabled = function(localTrack) {
            var trackSignaling = _this._signaling.getPublication(localTrack._trackSender);
            if (trackSignaling) {
              trackSignaling.enable();
              log.debug("Enabled the " + trackClass(localTrack, true) + ":", localTrack.id);
            }
          };
          var localTrackStopped = function(localTrack) {
            var trackSignaling = _this._signaling.getPublication(localTrack._trackSender);
            if (trackSignaling) {
              trackSignaling.stop();
            }
            return trackSignaling;
          };
          var stateChanged = function(state) {
            log.debug("Transitioned to state:", state);
            if (state === "disconnected") {
              log.debug("Removing LocalTrack event listeners");
              _this._signaling.removeListener("stateChanged", stateChanged);
              _this.removeListener("trackDisabled", localTrackDisabled);
              _this.removeListener("trackEnabled", localTrackEnabled);
              _this.removeListener("trackStopped", localTrackStopped);
              _this._tracks.forEach(function(track) {
                var trackSignaling = localTrackStopped(track);
                if (trackSignaling) {
                  track._trackSender.removeClone(trackSignaling._trackTransceiver);
                }
              });
              log.info("LocalParticipant disconnected. Stopping " + _this._tracksToStop.size + " automatically-acquired LocalTracks");
              _this._tracksToStop.forEach(function(track) {
                track.stop();
              });
            } else if (state === "connected") {
              log.info("reconnected");
              setTimeout(function() {
                return _this.emit("reconnected");
              }, 0);
            }
          };
          this.on("trackDisabled", localTrackDisabled);
          this.on("trackEnabled", localTrackEnabled);
          this.on("trackStopped", localTrackStopped);
          this._signaling.on("stateChanged", stateChanged);
          this._tracks.forEach(function(track) {
            _this._addLocalTrack(track, trackPriority.PRIORITY_STANDARD);
            _this._getOrCreateLocalTrackPublication(track).catch(function(error) {
              log.warn("Failed to get or create LocalTrackPublication for " + track + ":", error);
            });
          });
        };
        LocalParticipant2.prototype._getOrCreateLocalTrackPublication = function(localTrack) {
          var localTrackPublication = getTrackPublication(this.tracks, localTrack);
          if (localTrackPublication) {
            return Promise.resolve(localTrackPublication);
          }
          var log = this._log;
          var self = this;
          var trackSignaling = this._signaling.getPublication(localTrack._trackSender);
          if (!trackSignaling) {
            return Promise.reject(new Error("Unexpected error: The " + localTrack + " cannot be published"));
          }
          return new Promise(function(resolve, reject) {
            function updated() {
              var error = trackSignaling.error;
              if (error) {
                trackSignaling.removeListener("updated", updated);
                log.warn("Failed to publish the " + trackClass(localTrack, true) + ": " + error.message);
                self._removeTrack(localTrack, localTrack.id);
                setTimeout(function() {
                  self.emit("trackPublicationFailed", error, localTrack);
                });
                reject(error);
                return;
              }
              if (!self._tracks.has(localTrack.id)) {
                trackSignaling.removeListener("updated", updated);
                reject(new Error("The " + localTrack + " was unpublished"));
                return;
              }
              var sid = trackSignaling.sid;
              if (!sid) {
                return;
              }
              trackSignaling.removeListener("updated", updated);
              var options = {
                log,
                LocalAudioTrackPublication: self._LocalAudioTrackPublication,
                LocalDataTrackPublication: self._LocalDataTrackPublication,
                LocalVideoTrackPublication: self._LocalVideoTrackPublication
              };
              localTrackPublication = getTrackPublication(self.tracks, localTrack);
              var warningHandler = function(twilioWarningName) {
                return self.emit("trackWarning", twilioWarningName, localTrackPublication);
              };
              var warningsClearedHandler = function() {
                return self.emit("trackWarningsCleared", localTrackPublication);
              };
              var unpublish = function(publication) {
                localTrackPublication.removeListener("trackWarning", warningHandler);
                localTrackPublication.removeListener("trackWarningsCleared", warningsClearedHandler);
                self.unpublishTrack(publication.track);
              };
              if (!localTrackPublication) {
                localTrackPublication = asLocalTrackPublication(localTrack, trackSignaling, unpublish, options);
                self._addTrackPublication(localTrackPublication);
              }
              localTrackPublication.on("warning", warningHandler);
              localTrackPublication.on("warningsCleared", warningsClearedHandler);
              var state = self._signaling.state;
              if (state === "connected" || state === "connecting") {
                if (localTrack._processorEventObserver) {
                  localTrack._processorEventObserver.on("event", function(event) {
                    self._eventObserver.emit("event", {
                      name: event.name,
                      payload: event.data,
                      group: "video-processor",
                      level: "info"
                    });
                  });
                }
                if (localTrack.processedTrack) {
                  localTrack._captureFrames();
                  localTrack._setSenderMediaStreamTrack(true);
                }
              }
              if (state === "connected") {
                setTimeout(function() {
                  self.emit("trackPublished", localTrackPublication);
                });
              }
              resolve(localTrackPublication);
            }
            trackSignaling.on("updated", updated);
          });
        };
        LocalParticipant2.prototype.publishTrack = function(localTrackOrMediaStreamTrack, options) {
          var trackPublication = getTrackPublication(this.tracks, localTrackOrMediaStreamTrack);
          if (trackPublication) {
            return Promise.resolve(trackPublication);
          }
          options = Object.assign({
            log: this._log,
            priority: trackPriority.PRIORITY_STANDARD,
            LocalAudioTrack: this._LocalAudioTrack,
            LocalDataTrack: this._LocalDataTrack,
            LocalVideoTrack: this._LocalVideoTrack,
            MediaStreamTrack: this._MediaStreamTrack
          }, options);
          var localTrack;
          try {
            localTrack = asLocalTrack(localTrackOrMediaStreamTrack, options);
          } catch (error) {
            return Promise.reject(error);
          }
          var noiseCancellation = localTrack.noiseCancellation;
          var allowedAudioProcessors = this._signaling.audioProcessors;
          if (noiseCancellation && !allowedAudioProcessors.includes(noiseCancellation.vendor)) {
            this._log.warn(noiseCancellation.vendor + " is not supported in this room. disabling it permanently");
            noiseCancellation.disablePermanently();
          }
          var priorityValues = Object.values(trackPriority);
          if (!priorityValues.includes(options.priority)) {
            return Promise.reject(E.INVALID_VALUE("LocalTrackPublishOptions.priority", priorityValues));
          }
          var addedLocalTrack = this._addTrack(localTrack, localTrack.id, options.priority) || this._tracks.get(localTrack.id);
          return this._getOrCreateLocalTrackPublication(addedLocalTrack);
        };
        LocalParticipant2.prototype.publishTracks = function(tracks) {
          if (!Array.isArray(tracks)) {
            throw E.INVALID_TYPE("tracks", "Array of LocalAudioTrack, LocalVideoTrack, LocalDataTrack, or MediaStreamTrack");
          }
          return Promise.all(tracks.map(this.publishTrack, this));
        };
        LocalParticipant2.prototype.setBandwidthProfile = function() {
          this._log.warn("setBandwidthProfile is not implemented yet and may be available in future versions of twilio-video.js");
        };
        LocalParticipant2.prototype.setNetworkQualityConfiguration = function(networkQualityConfiguration) {
          if (typeof networkQualityConfiguration !== "object" || networkQualityConfiguration === null) {
            throw E.INVALID_TYPE("networkQualityConfiguration", "NetworkQualityConfiguration");
          }
          ["local", "remote"].forEach(function(prop) {
            if (prop in networkQualityConfiguration && (typeof networkQualityConfiguration[prop] !== "number" || isNaN(networkQualityConfiguration[prop]))) {
              throw E.INVALID_TYPE("networkQualityConfiguration." + prop, "number");
            }
          });
          this._signaling.setNetworkQualityConfiguration(networkQualityConfiguration);
          return this;
        };
        LocalParticipant2.prototype.setParameters = function(encodingParameters) {
          if (typeof encodingParameters !== "undefined" && typeof encodingParameters !== "object") {
            throw E.INVALID_TYPE("encodingParameters", "EncodingParameters, null or undefined");
          }
          if (encodingParameters) {
            if (this._signaling.getParameters().adaptiveSimulcast && encodingParameters.maxVideoBitrate) {
              throw E.INVALID_TYPE("encodingParameters", 'encodingParameters.maxVideoBitrate is not compatible with "preferredVideoCodecs=auto"');
            }
            ["maxAudioBitrate", "maxVideoBitrate"].forEach(function(prop) {
              if (typeof encodingParameters[prop] !== "undefined" && typeof encodingParameters[prop] !== "number" && encodingParameters[prop] !== null) {
                throw E.INVALID_TYPE("encodingParameters." + prop, "number, null or undefined");
              }
            });
          } else if (encodingParameters === null) {
            encodingParameters = { maxAudioBitrate: null, maxVideoBitrate: null };
          }
          this._signaling.setParameters(encodingParameters);
          return this;
        };
        LocalParticipant2.prototype.unpublishTrack = function(track) {
          validateLocalTrack(track, {
            LocalAudioTrack: this._LocalAudioTrack,
            LocalDataTrack: this._LocalDataTrack,
            LocalVideoTrack: this._LocalVideoTrack,
            MediaStreamTrack: this._MediaStreamTrack
          });
          var localTrack = this._tracks.get(track.id);
          if (!localTrack) {
            return null;
          }
          var trackSignaling = this._signaling.getPublication(localTrack._trackSender);
          trackSignaling.publishFailed(new Error("The " + localTrack + " was unpublished"));
          localTrack = this._removeTrack(localTrack, localTrack.id);
          if (!localTrack) {
            return null;
          }
          var localTrackPublication = getTrackPublication(this.tracks, localTrack);
          if (localTrackPublication) {
            this._removeTrackPublication(localTrackPublication);
          }
          return localTrackPublication;
        };
        LocalParticipant2.prototype.unpublishTracks = function(tracks) {
          var _this = this;
          if (!Array.isArray(tracks)) {
            throw E.INVALID_TYPE("tracks", "Array of LocalAudioTrack, LocalVideoTrack, LocalDataTrack, or MediaStreamTrack");
          }
          return tracks.reduce(function(unpublishedTracks, track) {
            var unpublishedTrack = _this.unpublishTrack(track);
            return unpublishedTrack ? unpublishedTracks.concat(unpublishedTrack) : unpublishedTracks;
          }, []);
        };
        return LocalParticipant2;
      }(Participant)
    );
    function getTrackPublication(trackPublications, track) {
      return Array.from(trackPublications.values()).find(function(trackPublication) {
        return trackPublication.track === track || trackPublication.track.mediaStreamTrack === track;
      }) || null;
    }
    module.exports = LocalParticipant;
  }
});

// node_modules/twilio-video/es5/util/insightspublisher/null.js
var require_null = __commonJS({
  "node_modules/twilio-video/es5/util/insightspublisher/null.js"(exports, module) {
    "use strict";
    var InsightsPublisher = (
      /** @class */
      function() {
        function InsightsPublisher2() {
          Object.defineProperties(this, {
            _connected: {
              writable: true,
              value: true
            }
          });
        }
        InsightsPublisher2.prototype.connect = function() {
        };
        InsightsPublisher2.prototype.disconnect = function() {
          if (this._connected) {
            this._connected = false;
            return true;
          }
          return false;
        };
        InsightsPublisher2.prototype.publish = function() {
          return this._connected;
        };
        return InsightsPublisher2;
      }()
    );
    module.exports = InsightsPublisher;
  }
});

// node_modules/twilio-video/es5/networkqualityconfiguration.js
var require_networkqualityconfiguration = __commonJS({
  "node_modules/twilio-video/es5/networkqualityconfiguration.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var EventEmitter = require_events().EventEmitter;
    var _a = require_constants();
    var DEFAULT_NQ_LEVEL_LOCAL = _a.DEFAULT_NQ_LEVEL_LOCAL;
    var DEFAULT_NQ_LEVEL_REMOTE = _a.DEFAULT_NQ_LEVEL_REMOTE;
    var MAX_NQ_LEVEL = _a.MAX_NQ_LEVEL;
    var inRange = require_util2().inRange;
    var NetworkQualityConfigurationImpl = (
      /** @class */
      function(_super) {
        __extends(NetworkQualityConfigurationImpl2, _super);
        function NetworkQualityConfigurationImpl2(networkQualityConfiguration) {
          var _this = _super.call(this) || this;
          networkQualityConfiguration = Object.assign({
            local: DEFAULT_NQ_LEVEL_LOCAL,
            remote: DEFAULT_NQ_LEVEL_REMOTE
          }, networkQualityConfiguration);
          Object.defineProperties(_this, {
            local: {
              value: inRange(networkQualityConfiguration.local, DEFAULT_NQ_LEVEL_LOCAL, MAX_NQ_LEVEL) ? networkQualityConfiguration.local : DEFAULT_NQ_LEVEL_LOCAL,
              writable: true
            },
            remote: {
              value: inRange(networkQualityConfiguration.remote, DEFAULT_NQ_LEVEL_REMOTE, MAX_NQ_LEVEL) ? networkQualityConfiguration.remote : DEFAULT_NQ_LEVEL_REMOTE,
              writable: true
            }
          });
          return _this;
        }
        NetworkQualityConfigurationImpl2.prototype.update = function(networkQualityConfiguration) {
          var _this = this;
          networkQualityConfiguration = Object.assign({
            local: this.local,
            remote: this.remote
          }, networkQualityConfiguration);
          [
            ["local", DEFAULT_NQ_LEVEL_LOCAL, 3],
            ["remote", DEFAULT_NQ_LEVEL_REMOTE, 3]
          ].forEach(function(_a2) {
            var _b = __read(_a2, 3), localOrRemote = _b[0], min = _b[1], max = _b[2];
            _this[localOrRemote] = typeof networkQualityConfiguration[localOrRemote] === "number" && inRange(networkQualityConfiguration[localOrRemote], min, max) ? networkQualityConfiguration[localOrRemote] : min;
          });
        };
        return NetworkQualityConfigurationImpl2;
      }(EventEmitter)
    );
    module.exports = NetworkQualityConfigurationImpl;
  }
});

// node_modules/twilio-video/es5/remoteparticipant.js
var require_remoteparticipant = __commonJS({
  "node_modules/twilio-video/es5/remoteparticipant.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var Participant = require_participant();
    var RemoteParticipant = (
      /** @class */
      function(_super) {
        __extends(RemoteParticipant2, _super);
        function RemoteParticipant2(signaling, options) {
          var _this = _super.call(this, signaling, options) || this;
          _this._handleTrackSignalingEvents();
          _this.once("disconnected", _this._unsubscribeTracks.bind(_this));
          return _this;
        }
        RemoteParticipant2.prototype.toString = function() {
          return "[RemoteParticipant #" + this._instanceId + (this.sid ? ": " + this.sid : "") + "]";
        };
        RemoteParticipant2.prototype._addTrack = function(remoteTrack, publication, id) {
          if (!_super.prototype._addTrack.call(this, remoteTrack, id)) {
            return null;
          }
          publication._subscribed(remoteTrack);
          this.emit("trackSubscribed", remoteTrack, publication);
          return remoteTrack;
        };
        RemoteParticipant2.prototype._addTrackPublication = function(publication) {
          var addedPublication = _super.prototype._addTrackPublication.call(this, publication);
          if (!addedPublication) {
            return null;
          }
          this.emit("trackPublished", addedPublication);
          return addedPublication;
        };
        RemoteParticipant2.prototype._getTrackPublicationEvents = function() {
          return __spreadArray(__spreadArray([], __read(_super.prototype._getTrackPublicationEvents.call(this))), [
            ["subscriptionFailed", "trackSubscriptionFailed"],
            ["trackDisabled", "trackDisabled"],
            ["trackEnabled", "trackEnabled"],
            ["publishPriorityChanged", "trackPublishPriorityChanged"],
            ["trackSwitchedOff", "trackSwitchedOff"],
            ["trackSwitchedOn", "trackSwitchedOn"]
          ]);
        };
        RemoteParticipant2.prototype._unsubscribeTracks = function() {
          var _this = this;
          this.tracks.forEach(function(publication) {
            if (publication.isSubscribed) {
              var track = publication.track;
              publication._unsubscribe();
              _this.emit("trackUnsubscribed", track, publication);
            }
          });
        };
        RemoteParticipant2.prototype._removeTrack = function(remoteTrack, publication, id) {
          var unsubscribedTrack = this._tracks.get(id);
          if (!unsubscribedTrack) {
            return null;
          }
          _super.prototype._removeTrack.call(this, unsubscribedTrack, id);
          publication._unsubscribe();
          this.emit("trackUnsubscribed", unsubscribedTrack, publication);
          return unsubscribedTrack;
        };
        RemoteParticipant2.prototype._removeTrackPublication = function(publication) {
          this._signaling.clearTrackHint(publication.trackSid);
          var removedPublication = _super.prototype._removeTrackPublication.call(this, publication);
          if (!removedPublication) {
            return null;
          }
          this.emit("trackUnpublished", removedPublication);
          return removedPublication;
        };
        return RemoteParticipant2;
      }(Participant)
    );
    module.exports = RemoteParticipant;
  }
});

// node_modules/twilio-video/es5/stats/trackstats.js
var require_trackstats = __commonJS({
  "node_modules/twilio-video/es5/stats/trackstats.js"(exports, module) {
    "use strict";
    var TrackStats = (
      /** @class */
      /* @__PURE__ */ function() {
        function TrackStats2(trackId, statsReport) {
          if (typeof trackId !== "string") {
            throw new Error("Track id must be a string");
          }
          Object.defineProperties(this, {
            trackId: {
              value: trackId,
              enumerable: true
            },
            trackSid: {
              value: statsReport.trackSid,
              enumerable: true
            },
            timestamp: {
              value: statsReport.timestamp,
              enumerable: true
            },
            ssrc: {
              value: statsReport.ssrc,
              enumerable: true
            },
            packetsLost: {
              value: typeof statsReport.packetsLost === "number" ? statsReport.packetsLost : null,
              enumerable: true
            },
            codec: {
              value: typeof statsReport.codecName === "string" ? statsReport.codecName : null,
              enumerable: true
            }
          });
        }
        return TrackStats2;
      }()
    );
    module.exports = TrackStats;
  }
});

// node_modules/twilio-video/es5/stats/localtrackstats.js
var require_localtrackstats = __commonJS({
  "node_modules/twilio-video/es5/stats/localtrackstats.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var TrackStats = require_trackstats();
    var LocalTrackStats = (
      /** @class */
      function(_super) {
        __extends(LocalTrackStats2, _super);
        function LocalTrackStats2(trackId, statsReport, prepareForInsights) {
          var _this = _super.call(this, trackId, statsReport) || this;
          Object.defineProperties(_this, {
            bytesSent: {
              value: typeof statsReport.bytesSent === "number" ? statsReport.bytesSent : prepareForInsights ? 0 : null,
              enumerable: true
            },
            packetsSent: {
              value: typeof statsReport.packetsSent === "number" ? statsReport.packetsSent : prepareForInsights ? 0 : null,
              enumerable: true
            },
            roundTripTime: {
              value: typeof statsReport.roundTripTime === "number" ? statsReport.roundTripTime : prepareForInsights ? 0 : null,
              enumerable: true
            }
          });
          return _this;
        }
        return LocalTrackStats2;
      }(TrackStats)
    );
    module.exports = LocalTrackStats;
  }
});

// node_modules/twilio-video/es5/stats/localaudiotrackstats.js
var require_localaudiotrackstats = __commonJS({
  "node_modules/twilio-video/es5/stats/localaudiotrackstats.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var LocalTrackStats = require_localtrackstats();
    var LocalAudioTrackStats = (
      /** @class */
      function(_super) {
        __extends(LocalAudioTrackStats2, _super);
        function LocalAudioTrackStats2(trackId, statsReport, prepareForInsights) {
          var _this = _super.call(this, trackId, statsReport, prepareForInsights) || this;
          Object.defineProperties(_this, {
            audioLevel: {
              value: typeof statsReport.audioInputLevel === "number" ? statsReport.audioInputLevel : null,
              enumerable: true
            },
            jitter: {
              value: typeof statsReport.jitter === "number" ? statsReport.jitter : null,
              enumerable: true
            }
          });
          return _this;
        }
        return LocalAudioTrackStats2;
      }(LocalTrackStats)
    );
    module.exports = LocalAudioTrackStats;
  }
});

// node_modules/twilio-video/es5/stats/localvideotrackstats.js
var require_localvideotrackstats = __commonJS({
  "node_modules/twilio-video/es5/stats/localvideotrackstats.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var LocalTrackStats = require_localtrackstats();
    var LocalVideoTrackStats = (
      /** @class */
      function(_super) {
        __extends(LocalVideoTrackStats2, _super);
        function LocalVideoTrackStats2(trackId, statsReport, prepareForInsights) {
          var _this = _super.call(this, trackId, statsReport, prepareForInsights) || this;
          var captureDimensions = null;
          if (typeof statsReport.frameWidthInput === "number" && typeof statsReport.frameHeightInput === "number") {
            captureDimensions = {};
            Object.defineProperties(captureDimensions, {
              width: {
                value: statsReport.frameWidthInput,
                enumerable: true
              },
              height: {
                value: statsReport.frameHeightInput,
                enumerable: true
              }
            });
          }
          var dimensions = null;
          if (typeof statsReport.frameWidthSent === "number" && typeof statsReport.frameHeightSent === "number") {
            dimensions = {};
            Object.defineProperties(dimensions, {
              width: {
                value: statsReport.frameWidthSent,
                enumerable: true
              },
              height: {
                value: statsReport.frameHeightSent,
                enumerable: true
              }
            });
          }
          Object.defineProperties(_this, {
            captureDimensions: {
              value: captureDimensions,
              enumerable: true
            },
            dimensions: {
              value: dimensions,
              enumerable: true
            },
            captureFrameRate: {
              value: typeof statsReport.frameRateInput === "number" ? statsReport.frameRateInput : null,
              enumerable: true
            },
            frameRate: {
              value: typeof statsReport.frameRateSent === "number" ? statsReport.frameRateSent : null,
              enumerable: true
            }
          });
          return _this;
        }
        return LocalVideoTrackStats2;
      }(LocalTrackStats)
    );
    module.exports = LocalVideoTrackStats;
  }
});

// node_modules/twilio-video/es5/stats/remotetrackstats.js
var require_remotetrackstats = __commonJS({
  "node_modules/twilio-video/es5/stats/remotetrackstats.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var TrackStats = require_trackstats();
    var RemoteTrackStats = (
      /** @class */
      function(_super) {
        __extends(RemoteTrackStats2, _super);
        function RemoteTrackStats2(trackId, statsReport) {
          var _this = _super.call(this, trackId, statsReport) || this;
          Object.defineProperties(_this, {
            bytesReceived: {
              value: typeof statsReport.bytesReceived === "number" ? statsReport.bytesReceived : null,
              enumerable: true
            },
            packetsReceived: {
              value: typeof statsReport.packetsReceived === "number" ? statsReport.packetsReceived : null,
              enumerable: true
            }
          });
          return _this;
        }
        return RemoteTrackStats2;
      }(TrackStats)
    );
    module.exports = RemoteTrackStats;
  }
});

// node_modules/twilio-video/es5/stats/remoteaudiotrackstats.js
var require_remoteaudiotrackstats = __commonJS({
  "node_modules/twilio-video/es5/stats/remoteaudiotrackstats.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var RemoteTrackStats = require_remotetrackstats();
    var RemoteAudioTrackStats = (
      /** @class */
      function(_super) {
        __extends(RemoteAudioTrackStats2, _super);
        function RemoteAudioTrackStats2(trackId, statsReport) {
          var _this = _super.call(this, trackId, statsReport) || this;
          Object.defineProperties(_this, {
            audioLevel: {
              value: typeof statsReport.audioOutputLevel === "number" ? statsReport.audioOutputLevel : null,
              enumerable: true
            },
            jitter: {
              value: typeof statsReport.jitter === "number" ? statsReport.jitter : null,
              enumerable: true
            }
          });
          return _this;
        }
        return RemoteAudioTrackStats2;
      }(RemoteTrackStats)
    );
    module.exports = RemoteAudioTrackStats;
  }
});

// node_modules/twilio-video/es5/stats/remotevideotrackstats.js
var require_remotevideotrackstats = __commonJS({
  "node_modules/twilio-video/es5/stats/remotevideotrackstats.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var RemoteTrackStats = require_remotetrackstats();
    var RemoteVideoTrackStats = (
      /** @class */
      function(_super) {
        __extends(RemoteVideoTrackStats2, _super);
        function RemoteVideoTrackStats2(trackId, statsReport) {
          var _this = _super.call(this, trackId, statsReport) || this;
          var dimensions = null;
          if (typeof statsReport.frameWidthReceived === "number" && typeof statsReport.frameHeightReceived === "number") {
            dimensions = {};
            Object.defineProperties(dimensions, {
              width: {
                value: statsReport.frameWidthReceived,
                enumerable: true
              },
              height: {
                value: statsReport.frameHeightReceived,
                enumerable: true
              }
            });
          }
          Object.defineProperties(_this, {
            dimensions: {
              value: dimensions,
              enumerable: true
            },
            frameRate: {
              value: typeof statsReport.frameRateReceived === "number" ? statsReport.frameRateReceived : null,
              enumerable: true
            }
          });
          return _this;
        }
        return RemoteVideoTrackStats2;
      }(RemoteTrackStats)
    );
    module.exports = RemoteVideoTrackStats;
  }
});

// node_modules/twilio-video/es5/stats/statsreport.js
var require_statsreport = __commonJS({
  "node_modules/twilio-video/es5/stats/statsreport.js"(exports, module) {
    "use strict";
    var LocalAudioTrackStats = require_localaudiotrackstats();
    var LocalVideoTrackStats = require_localvideotrackstats();
    var RemoteAudioTrackStats = require_remoteaudiotrackstats();
    var RemoteVideoTrackStats = require_remotevideotrackstats();
    var StatsReport = (
      /** @class */
      /* @__PURE__ */ function() {
        function StatsReport2(peerConnectionId, statsResponse, prepareForInsights) {
          if (typeof peerConnectionId !== "string") {
            throw new Error("RTCPeerConnection id must be a string");
          }
          Object.defineProperties(this, {
            peerConnectionId: {
              value: peerConnectionId,
              enumerable: true
            },
            localAudioTrackStats: {
              value: statsResponse.localAudioTrackStats.map(function(report) {
                return new LocalAudioTrackStats(report.trackId, report, prepareForInsights);
              }),
              enumerable: true
            },
            localVideoTrackStats: {
              value: statsResponse.localVideoTrackStats.map(function(report) {
                return new LocalVideoTrackStats(report.trackId, report, prepareForInsights);
              }),
              enumerable: true
            },
            remoteAudioTrackStats: {
              value: statsResponse.remoteAudioTrackStats.map(function(report) {
                return new RemoteAudioTrackStats(report.trackId, report);
              }),
              enumerable: true
            },
            remoteVideoTrackStats: {
              value: statsResponse.remoteVideoTrackStats.map(function(report) {
                return new RemoteVideoTrackStats(report.trackId, report);
              }),
              enumerable: true
            }
          });
        }
        return StatsReport2;
      }()
    );
    module.exports = StatsReport;
  }
});

// node_modules/twilio-video/es5/room.js
var require_room = __commonJS({
  "node_modules/twilio-video/es5/room.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var EventEmitter = require_eventemitter();
    var RemoteParticipant = require_remoteparticipant();
    var StatsReport = require_statsreport();
    var _a = require_util2();
    var flatMap = _a.flatMap;
    var valueToJSON = _a.valueToJSON;
    var nInstances = 0;
    var Room = (
      /** @class */
      function(_super) {
        __extends(Room2, _super);
        function Room2(localParticipant, signaling, options) {
          var _this = _super.call(this) || this;
          var log = options.log.createLog("default", _this);
          var participants = /* @__PURE__ */ new Map();
          Object.defineProperties(_this, {
            _log: {
              value: log
            },
            _clientTrackSwitchOffControl: {
              value: options.clientTrackSwitchOffControl || "disabled"
            },
            _contentPreferencesMode: {
              value: options.contentPreferencesMode || "disabled"
            },
            _instanceId: {
              value: ++nInstances
            },
            _options: {
              value: options
            },
            _participants: {
              value: participants
            },
            _signaling: {
              value: signaling
            },
            dominantSpeaker: {
              enumerable: true,
              get: function() {
                return this.participants.get(signaling.dominantSpeakerSid) || null;
              }
            },
            isRecording: {
              enumerable: true,
              get: function() {
                return signaling.recording.isEnabled || false;
              }
            },
            localParticipant: {
              enumerable: true,
              value: localParticipant
            },
            name: {
              enumerable: true,
              value: signaling.name
            },
            participants: {
              enumerable: true,
              value: participants
            },
            sid: {
              enumerable: true,
              value: signaling.sid
            },
            state: {
              enumerable: true,
              get: function() {
                return signaling.state;
              }
            },
            mediaRegion: {
              enumerable: true,
              value: signaling.mediaRegion
            }
          });
          handleLocalParticipantEvents(_this, localParticipant);
          handleRecordingEvents(_this, signaling.recording);
          handleSignalingEvents(_this, signaling);
          verifyNoiseCancellation(_this);
          log.info("Created a new Room:", _this.name);
          log.debug("Initial RemoteParticipants:", Array.from(_this._participants.values()));
          return _this;
        }
        Room2.prototype.toString = function() {
          return "[Room #" + this._instanceId + ": " + this.sid + "]";
        };
        Room2.prototype.disconnect = function() {
          this._log.info("Disconnecting");
          this._signaling.disconnect();
          return this;
        };
        Room2.prototype.getStats = function() {
          var _this = this;
          return this._signaling.getStats().then(function(responses) {
            return Array.from(responses).map(function(_a2) {
              var _b = __read(_a2, 2), id = _b[0], response = _b[1];
              return new StatsReport(id, Object.assign({}, response, {
                localAudioTrackStats: rewriteLocalTrackIds(_this, response.localAudioTrackStats),
                localVideoTrackStats: rewriteLocalTrackIds(_this, response.localVideoTrackStats)
              }));
            });
          });
        };
        Room2.prototype.refreshInactiveMedia = function() {
          var localTrackPublications = this.localParticipant.tracks;
          var localMediaTracks = Array.from(localTrackPublications.values()).filter(function(_a2) {
            var kind = _a2.track.kind;
            return kind !== "data";
          }).map(function(_a2) {
            var track = _a2.track;
            return track;
          });
          var remoteMediaTracks = flatMap(this.participants, function(participants) {
            return Array.from(participants.tracks.values());
          }).filter(function(_a2) {
            var track = _a2.track;
            return track && track.kind !== "data";
          }).map(function(_a2) {
            var track = _a2.track;
            return track;
          });
          var mediaTracks = localMediaTracks.concat(remoteMediaTracks);
          var unmuteEvent = new Event("unmute");
          localMediaTracks.forEach(function(_a2) {
            var isMuted = _a2.isMuted, mediaStreamTrack = _a2.mediaStreamTrack;
            if (isMuted) {
              mediaStreamTrack.dispatchEvent(unmuteEvent);
            }
          });
          var pauseEvent = new Event("pause");
          mediaTracks.forEach(function(_a2) {
            var attachments = _a2._attachments, elShims = _a2._elShims;
            return attachments.forEach(function(el) {
              var shim = elShims.get(el);
              var isInadvertentlyPaused = el.paused && shim && !shim.pausedIntentionally();
              if (isInadvertentlyPaused) {
                el.dispatchEvent(pauseEvent);
              }
            });
          });
          return this;
        };
        Room2.prototype.toJSON = function() {
          return valueToJSON(this);
        };
        return Room2;
      }(EventEmitter)
    );
    function verifyNoiseCancellation(room) {
      var allowedAudioProcessors = room.localParticipant._signaling.audioProcessors;
      room.localParticipant.audioTracks.forEach(function(_a2) {
        var track = _a2.track;
        var noiseCancellation = track.noiseCancellation;
        if (noiseCancellation && !allowedAudioProcessors.includes(noiseCancellation.vendor)) {
          room._log.warn(noiseCancellation.vendor + " is not supported in this room. disabling it permanently");
          noiseCancellation.disablePermanently();
        }
      });
    }
    function rewriteLocalTrackIds(room, trackStats) {
      var localParticipantSignaling = room.localParticipant._signaling;
      return trackStats.reduce(function(trackStats2, trackStat) {
        var publication = localParticipantSignaling.tracks.get(trackStat.trackId);
        var trackSender = localParticipantSignaling.getSender(publication);
        return trackSender ? [Object.assign({}, trackStat, { trackId: trackSender.id })].concat(trackStats2) : trackStats2;
      }, []);
    }
    function connectParticipant(room, participantSignaling) {
      var log = room._log, clientTrackSwitchOffControl = room._clientTrackSwitchOffControl, contentPreferencesMode = room._contentPreferencesMode;
      var participant = new RemoteParticipant(participantSignaling, { log, clientTrackSwitchOffControl, contentPreferencesMode });
      log.info("A new RemoteParticipant connected:", participant);
      room._participants.set(participant.sid, participant);
      room.emit("participantConnected", participant);
      var eventListeners = [
        ["reconnected", "participantReconnected"],
        ["reconnecting", "participantReconnecting"],
        "trackDimensionsChanged",
        "trackDisabled",
        "trackEnabled",
        "trackMessage",
        "trackPublished",
        "trackPublishPriorityChanged",
        "trackStarted",
        "trackSubscribed",
        "trackSubscriptionFailed",
        "trackSwitchedOff",
        "trackSwitchedOn",
        "trackUnpublished",
        "trackUnsubscribed"
      ].map(function(eventOrPair) {
        var _a2 = __read(Array.isArray(eventOrPair) ? eventOrPair : [eventOrPair, eventOrPair], 2), event = _a2[0], participantEvent = _a2[1];
        function reemit() {
          var args = [].slice.call(arguments);
          args.unshift(participantEvent);
          args.push(participant);
          room.emit.apply(room, __spreadArray([], __read(args)));
        }
        participant.on(event, reemit);
        return [event, reemit];
      });
      participant.once("disconnected", function participantDisconnected() {
        var dominantSpeaker = room.dominantSpeaker;
        log.info("RemoteParticipant disconnected:", participant);
        room._participants.delete(participant.sid);
        eventListeners.forEach(function(args) {
          participant.removeListener(args[0], args[1]);
        });
        room.emit("participantDisconnected", participant);
        if (participant === dominantSpeaker) {
          room.emit("dominantSpeakerChanged", room.dominantSpeaker);
        }
      });
    }
    function handleLocalParticipantEvents(room, localParticipant) {
      var events = ["trackWarning", "trackWarningsCleared"].map(function(event) {
        return {
          eventName: event,
          handler: function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            return room.emit.apply(room, __spreadArray([event], __read(__spreadArray(__spreadArray([], __read(args)), [localParticipant]))));
          }
        };
      });
      events.forEach(function(_a2) {
        var eventName = _a2.eventName, handler = _a2.handler;
        return localParticipant.on(eventName, handler);
      });
      room.once("disconnected", function() {
        return events.forEach(function(_a2) {
          var eventName = _a2.eventName, handler = _a2.handler;
          return localParticipant.removeListener(eventName, handler);
        });
      });
    }
    function handleRecordingEvents(room, recording) {
      recording.on("updated", function updated() {
        var started = recording.isEnabled;
        room._log.info("Recording " + (started ? "started" : "stopped"));
        room.emit("recording" + (started ? "Started" : "Stopped"));
      });
    }
    function handleSignalingEvents(room, signaling) {
      var log = room._log;
      log.debug("Creating a new RemoteParticipant for each ParticipantSignaling in the RoomSignaling");
      signaling.participants.forEach(connectParticipant.bind(null, room));
      log.debug("Setting up RemoteParticipant creation for all subsequent ParticipantSignalings that connect to the RoomSignaling");
      signaling.on("participantConnected", connectParticipant.bind(null, room));
      signaling.on("dominantSpeakerChanged", function() {
        return room.emit("dominantSpeakerChanged", room.dominantSpeaker);
      });
      signaling.on("stateChanged", function stateChanged(state, error) {
        log.info("Transitioned to state:", state);
        switch (state) {
          case "disconnected":
            room.participants.forEach(function(participant) {
              participant._unsubscribeTracks();
            });
            room.emit(state, room, error);
            room.localParticipant.tracks.forEach(function(publication) {
              publication.unpublish();
            });
            signaling.removeListener("stateChanged", stateChanged);
            break;
          case "reconnecting":
            setTimeout(function() {
              return room.emit("reconnecting", error);
            }, 0);
            break;
          default:
            setTimeout(function() {
              return room.emit("reconnected");
            }, 0);
        }
      });
    }
    module.exports = Room;
  }
});

// node_modules/twilio-video/es5/util/backoff.js
var require_backoff = __commonJS({
  "node_modules/twilio-video/es5/util/backoff.js"(exports, module) {
    var Backoff = (
      /** @class */
      function() {
        function Backoff2(options) {
          Object.defineProperties(this, {
            _min: {
              value: options.min || 100
            },
            _max: {
              value: options.max || 1e4
            },
            _jitter: {
              value: options.jitter > 0 && options.jitter <= 1 ? options.jitter : 0
            },
            _factor: {
              value: options.factor || 2
            },
            _attempts: {
              value: 0,
              writable: true
            },
            _duration: {
              enumerable: false,
              get: function() {
                var ms = this._min * Math.pow(this._factor, this._attempts);
                if (this._jitter) {
                  var rand = Math.random();
                  var deviation = Math.floor(rand * this._jitter * ms);
                  ms = (Math.floor(rand * 10) & 1) === 0 ? ms - deviation : ms + deviation;
                }
                return Math.min(ms, this._max) | 0;
              }
            },
            _timeoutID: {
              value: null,
              writable: true
            }
          });
        }
        Backoff2.prototype.backoff = function(fn) {
          var _this = this;
          var duration = this._duration;
          if (this._timeoutID) {
            clearTimeout(this._timeoutID);
            this._timeoutID = null;
          }
          this._timeoutID = setTimeout(function() {
            _this._attempts++;
            fn();
          }, duration);
        };
        Backoff2.prototype.reset = function() {
          this._attempts = 0;
          if (this._timeoutID) {
            clearTimeout(this._timeoutID);
            this._timeoutID = null;
          }
        };
        return Backoff2;
      }()
    );
    module.exports = Backoff;
  }
});

// node_modules/twilio-video/es5/util/sdp/simulcast.js
var require_simulcast = __commonJS({
  "node_modules/twilio-video/es5/util/sdp/simulcast.js"(exports, module) {
    "use strict";
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var _a = require_util2();
    var difference = _a.difference;
    var flatMap = _a.flatMap;
    function createSSRC() {
      var ssrcMax = 4294967295;
      return String(Math.floor(Math.random() * ssrcMax));
    }
    var TrackAttributes = (
      /** @class */
      function() {
        function TrackAttributes2(trackId, streamId, cName) {
          Object.defineProperties(this, {
            cName: {
              enumerable: true,
              value: cName
            },
            isSimulcastEnabled: {
              enumerable: true,
              value: false,
              writable: true
            },
            primarySSRCs: {
              enumerable: true,
              value: /* @__PURE__ */ new Set()
            },
            rtxPairs: {
              enumerable: true,
              value: /* @__PURE__ */ new Map()
            },
            streamId: {
              enumerable: true,
              value: streamId
            },
            trackId: {
              enumerable: true,
              value: trackId
            }
          });
        }
        TrackAttributes2.prototype.addSimulcastSSRCs = function() {
          if (this.isSimulcastEnabled) {
            return;
          }
          var simulcastSSRCs = [createSSRC(), createSSRC()];
          simulcastSSRCs.forEach(function(ssrc) {
            this.primarySSRCs.add(ssrc);
          }, this);
          if (this.rtxPairs.size) {
            simulcastSSRCs.forEach(function(ssrc) {
              this.rtxPairs.set(createSSRC(), ssrc);
            }, this);
          }
        };
        TrackAttributes2.prototype.addSSRC = function(ssrc, primarySSRC, isSimSSRC) {
          if (primarySSRC) {
            this.rtxPairs.set(ssrc, primarySSRC);
          } else {
            this.primarySSRCs.add(ssrc);
          }
          this.isSimulcastEnabled = this.isSimulcastEnabled || isSimSSRC;
        };
        TrackAttributes2.prototype.toSdpLines = function(excludeRtx) {
          var _this = this;
          var rtxPairs = excludeRtx ? [] : Array.from(this.rtxPairs.entries()).map(function(rtxPair) {
            return rtxPair.reverse();
          });
          var simSSRCs = Array.from(this.primarySSRCs.values());
          var ssrcs = rtxPairs.length ? flatMap(rtxPairs) : simSSRCs;
          var attrLines = flatMap(ssrcs, function(ssrc) {
            return [
              "a=ssrc:" + ssrc + " cname:" + _this.cName,
              "a=ssrc:" + ssrc + " msid:" + _this.streamId + " " + _this.trackId
            ];
          });
          var rtxPairLines = rtxPairs.map(function(rtxPair) {
            return "a=ssrc-group:FID " + rtxPair.join(" ");
          });
          var simGroupLines = [
            "a=ssrc-group:SIM " + simSSRCs.join(" ")
          ];
          return rtxPairLines.concat(attrLines).concat(simGroupLines);
        };
        return TrackAttributes2;
      }()
    );
    function getMatches(section, pattern) {
      var matches = section.match(new RegExp(pattern, "gm")) || [];
      return matches.map(function(match) {
        var matches2 = match.match(new RegExp(pattern)) || [];
        return matches2.slice(1);
      });
    }
    function getSimulcastSSRCs(section) {
      var simGroupPattern = "^a=ssrc-group:SIM ([0-9]+) ([0-9]+) ([0-9]+)$";
      return new Set(flatMap(getMatches(section, simGroupPattern)));
    }
    function getSSRCAttribute(section, ssrc, attribute) {
      var pattern = "a=ssrc:" + ssrc + " " + attribute + ":(.+)";
      return section.match(new RegExp(pattern))[1];
    }
    function getSSRCRtxPairs(section) {
      var rtxPairPattern = "^a=ssrc-group:FID ([0-9]+) ([0-9]+)$";
      return new Map(getMatches(section, rtxPairPattern).map(function(pair) {
        return pair.reverse();
      }));
    }
    function createSSRCAttributeTuples(section) {
      var _a2 = __read(flatMap(getMatches(section, "^a=msid:(.+) (.+)$")), 2), streamId = _a2[0], trackId = _a2[1];
      var ssrcs = flatMap(getMatches(section, "^a=ssrc:(.+) cname:.+$"));
      return ssrcs.map(function(ssrc) {
        return [ssrc, streamId, trackId];
      });
    }
    function createTrackIdsToAttributes(section) {
      var simSSRCs = getSimulcastSSRCs(section);
      var rtxPairs = getSSRCRtxPairs(section);
      var ssrcAttrTuples = createSSRCAttributeTuples(section);
      return ssrcAttrTuples.reduce(function(trackIdsToSSRCs, tuple) {
        var ssrc = tuple[0];
        var streamId = tuple[1];
        var trackId = tuple[2];
        var trackAttributes = trackIdsToSSRCs.get(trackId) || new TrackAttributes(trackId, streamId, getSSRCAttribute(section, ssrc, "cname"));
        var primarySSRC = rtxPairs.get(ssrc) || null;
        trackAttributes.addSSRC(ssrc, primarySSRC, simSSRCs.has(ssrc));
        return trackIdsToSSRCs.set(trackId, trackAttributes);
      }, /* @__PURE__ */ new Map());
    }
    function setSimulcastInMediaSection(section, trackIdsToAttributes) {
      var newTrackIdsToAttributes = createTrackIdsToAttributes(section);
      var newTrackIds = Array.from(newTrackIdsToAttributes.keys());
      var trackIds = Array.from(trackIdsToAttributes.keys());
      var trackIdsToAdd = difference(newTrackIds, trackIds);
      var trackIdsToIgnore = difference(trackIds, newTrackIds);
      var trackAttributesToAdd = flatMap(trackIdsToAdd, function(trackId) {
        return newTrackIdsToAttributes.get(trackId);
      });
      trackAttributesToAdd.forEach(function(trackAttributes) {
        trackAttributes.addSimulcastSSRCs();
        trackIdsToAttributes.set(trackAttributes.trackId, trackAttributes);
      });
      trackIds = Array.from(trackIdsToAttributes.keys());
      var relevantTrackIds = difference(trackIds, trackIdsToIgnore);
      var relevantTrackAttributes = flatMap(relevantTrackIds, function(trackId) {
        return trackIdsToAttributes.get(trackId);
      });
      var excludeRtx = !section.match(/a=rtpmap:[0-9]+ rtx/);
      var relevantSdpLines = flatMap(relevantTrackAttributes, function(trackAttributes) {
        return trackAttributes.toSdpLines(excludeRtx);
      });
      var sectionLines = flatMap(new Set(section.split("\r\n").concat(relevantSdpLines)));
      var xGoogleFlagConference = "a=x-google-flag:conference";
      if (!section.match(xGoogleFlagConference)) {
        sectionLines.push(xGoogleFlagConference);
      }
      return sectionLines.join("\r\n");
    }
    module.exports = setSimulcastInMediaSection;
  }
});

// node_modules/twilio-video/es5/util/sdp/index.js
var require_sdp2 = __commonJS({
  "node_modules/twilio-video/es5/util/sdp/index.js"(exports) {
    "use strict";
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var _a = require_util2();
    var difference = _a.difference;
    var flatMap = _a.flatMap;
    var setSimulcastInMediaSection = require_simulcast();
    var ptToFixedBitrateAudioCodecName = {
      0: "PCMU",
      8: "PCMA"
    };
    function createCodecMapForMediaSection(section) {
      return Array.from(createPtToCodecName(section)).reduce(function(codecMap, pair) {
        var pt = pair[0];
        var codecName = pair[1];
        var pts = codecMap.get(codecName) || [];
        return codecMap.set(codecName, pts.concat(pt));
      }, /* @__PURE__ */ new Map());
    }
    function createMidToMediaSectionMap(sdp) {
      return getMediaSections(sdp).reduce(function(midsToMediaSections, mediaSection) {
        var mid = getMidForMediaSection(mediaSection);
        return mid ? midsToMediaSections.set(mid, mediaSection) : midsToMediaSections;
      }, /* @__PURE__ */ new Map());
    }
    function createPtToCodecName(mediaSection) {
      return getPayloadTypesInMediaSection(mediaSection).reduce(function(ptToCodecName, pt) {
        var rtpmapPattern = new RegExp("a=rtpmap:" + pt + " ([^/]+)");
        var matches = mediaSection.match(rtpmapPattern);
        var codecName = matches ? matches[1].toLowerCase() : ptToFixedBitrateAudioCodecName[pt] ? ptToFixedBitrateAudioCodecName[pt].toLowerCase() : "";
        return ptToCodecName.set(pt, codecName);
      }, /* @__PURE__ */ new Map());
    }
    function getFmtpAttributesForPt(pt, mediaSection) {
      var fmtpRegex = new RegExp("^a=fmtp:" + pt + " (.+)$", "m");
      var matches = mediaSection.match(fmtpRegex);
      return matches && matches[1].split(";").reduce(function(attrs, nvPair) {
        var _a2 = __read(nvPair.split("="), 2), name = _a2[0], value = _a2[1];
        attrs[name] = isNaN(value) ? value : parseInt(value, 10);
        return attrs;
      }, {});
    }
    function getMidForMediaSection(mediaSection) {
      var midMatches = mediaSection.match(/^a=mid:(.+)$/m);
      return midMatches && midMatches[1];
    }
    function getMediaSections(sdp, kind, direction) {
      return sdp.replace(/\r\n\r\n$/, "\r\n").split("\r\nm=").slice(1).map(function(mediaSection) {
        return "m=" + mediaSection;
      }).filter(function(mediaSection) {
        var kindPattern = new RegExp("m=" + (kind || ".*"), "gm");
        var directionPattern = new RegExp("a=" + (direction || ".*"), "gm");
        return kindPattern.test(mediaSection) && directionPattern.test(mediaSection);
      });
    }
    function getPayloadTypesInMediaSection(section) {
      var mLine = section.split("\r\n")[0];
      var matches = mLine.match(/([0-9]+)/g);
      if (!matches) {
        return [];
      }
      return matches.slice(1).map(function(match) {
        return parseInt(match, 10);
      });
    }
    function getReorderedPayloadTypes(codecMap, preferredCodecs) {
      preferredCodecs = preferredCodecs.map(function(_a2) {
        var codec = _a2.codec;
        return codec.toLowerCase();
      });
      var preferredPayloadTypes = flatMap(preferredCodecs, function(codecName) {
        return codecMap.get(codecName) || [];
      });
      var remainingCodecs = difference(Array.from(codecMap.keys()), preferredCodecs);
      var remainingPayloadTypes = flatMap(remainingCodecs, function(codecName) {
        return codecMap.get(codecName);
      });
      return preferredPayloadTypes.concat(remainingPayloadTypes);
    }
    function setPayloadTypesInMediaSection(payloadTypes, section) {
      var lines = section.split("\r\n");
      var mLine = lines[0];
      var otherLines = lines.slice(1);
      mLine = mLine.replace(/([0-9]+\s?)+$/, payloadTypes.join(" "));
      return [mLine].concat(otherLines).join("\r\n");
    }
    function setCodecPreferences(sdp, preferredAudioCodecs, preferredVideoCodecs) {
      var mediaSections = getMediaSections(sdp);
      var session = sdp.split("\r\nm=")[0];
      return [session].concat(mediaSections.map(function(section) {
        if (!/^m=(audio|video)/.test(section)) {
          return section;
        }
        var kind = section.match(/^m=(audio|video)/)[1];
        var codecMap = createCodecMapForMediaSection(section);
        var preferredCodecs = kind === "audio" ? preferredAudioCodecs : preferredVideoCodecs;
        var payloadTypes = getReorderedPayloadTypes(codecMap, preferredCodecs);
        var newSection = setPayloadTypesInMediaSection(payloadTypes, section);
        var pcmaPayloadTypes = codecMap.get("pcma") || [];
        var pcmuPayloadTypes = codecMap.get("pcmu") || [];
        var fixedBitratePayloadTypes = kind === "audio" ? new Set(pcmaPayloadTypes.concat(pcmuPayloadTypes)) : /* @__PURE__ */ new Set();
        return fixedBitratePayloadTypes.has(payloadTypes[0]) ? newSection.replace(/\r\nb=(AS|TIAS):([0-9]+)/g, "") : newSection;
      })).join("\r\n");
    }
    function setSimulcast(sdp, trackIdsToAttributes) {
      var mediaSections = getMediaSections(sdp);
      var session = sdp.split("\r\nm=")[0];
      return [session].concat(mediaSections.map(function(section) {
        section = section.replace(/\r\n$/, "");
        if (!/^m=video/.test(section)) {
          return section;
        }
        var codecMap = createCodecMapForMediaSection(section);
        var payloadTypes = getPayloadTypesInMediaSection(section);
        var vp8PayloadTypes = new Set(codecMap.get("vp8") || []);
        var hasVP8PayloadType = payloadTypes.some(function(payloadType) {
          return vp8PayloadTypes.has(payloadType);
        });
        return hasVP8PayloadType ? setSimulcastInMediaSection(section, trackIdsToAttributes) : section;
      })).concat("").join("\r\n");
    }
    function getMatchingPayloadTypes(peerCodec, peerPt, codecsToPts, section, peerSection) {
      var matchingPts = codecsToPts.get(peerCodec) || [];
      if (matchingPts.length <= 1) {
        return matchingPts;
      }
      var peerFmtpAttrs = getFmtpAttributesForPt(peerPt, peerSection);
      if (!peerFmtpAttrs) {
        return matchingPts;
      }
      var matchingPt = matchingPts.find(function(pt) {
        var fmtpAttrs = getFmtpAttributesForPt(pt, section);
        return fmtpAttrs && Object.keys(peerFmtpAttrs).every(function(attr) {
          return peerFmtpAttrs[attr] === fmtpAttrs[attr];
        });
      });
      return typeof matchingPt === "number" ? [matchingPt] : matchingPts;
    }
    function filterCodecsInMediaSection(section, peerMidsToMediaSections, codecsToRemove) {
      if (!/^m=(audio|video)/.test(section)) {
        return section;
      }
      var mid = getMidForMediaSection(section);
      var peerSection = mid && peerMidsToMediaSections.get(mid);
      if (!peerSection) {
        return section;
      }
      var peerPtToCodecs = createPtToCodecName(peerSection);
      var codecsToPts = createCodecMapForMediaSection(section);
      var pts = flatMap(Array.from(peerPtToCodecs), function(_a2) {
        var _b = __read(_a2, 2), peerPt = _b[0], peerCodec = _b[1];
        return peerCodec !== "rtx" && !codecsToRemove.includes(peerCodec) ? getMatchingPayloadTypes(peerCodec, peerPt, codecsToPts, section, peerSection) : [];
      });
      var rtxPts = codecsToPts.get("rtx") || [];
      pts = pts.concat(rtxPts.filter(function(rtxPt) {
        var fmtpAttrs = getFmtpAttributesForPt(rtxPt, section);
        return fmtpAttrs && pts.includes(fmtpAttrs.apt);
      }));
      var lines = section.split("\r\n").filter(function(line) {
        var ptMatches = line.match(/^a=(rtpmap|fmtp|rtcp-fb):(.+) .+$/);
        var pt = ptMatches && ptMatches[2];
        return !ptMatches || pt && pts.includes(parseInt(pt, 10));
      });
      var orderedPts = getPayloadTypesInMediaSection(section).filter(function(pt) {
        return pts.includes(pt);
      });
      return setPayloadTypesInMediaSection(orderedPts, lines.join("\r\n"));
    }
    function filterLocalCodecs(localSdp, remoteSdp) {
      var localMediaSections = getMediaSections(localSdp);
      var localSession = localSdp.split("\r\nm=")[0];
      var remoteMidsToMediaSections = createMidToMediaSectionMap(remoteSdp);
      return [localSession].concat(localMediaSections.map(function(localSection) {
        return filterCodecsInMediaSection(localSection, remoteMidsToMediaSections, []);
      })).join("\r\n");
    }
    function revertSimulcast(localSdp, localSdpWithoutSimulcast, remoteSdp, revertForAll) {
      if (revertForAll === void 0) {
        revertForAll = false;
      }
      var remoteMidToMediaSections = createMidToMediaSectionMap(remoteSdp);
      var localMidToMediaSectionsWithoutSimulcast = createMidToMediaSectionMap(localSdpWithoutSimulcast);
      var mediaSections = getMediaSections(localSdp);
      var session = localSdp.split("\r\nm=")[0];
      return [session].concat(mediaSections.map(function(section) {
        section = section.replace(/\r\n$/, "");
        if (!/^m=video/.test(section)) {
          return section;
        }
        var midMatches = section.match(/^a=mid:(.+)$/m);
        var mid = midMatches && midMatches[1];
        if (!mid) {
          return section;
        }
        var remoteSection = remoteMidToMediaSections.get(mid);
        var remotePtToCodecs = createPtToCodecName(remoteSection);
        var remotePayloadTypes = getPayloadTypesInMediaSection(remoteSection);
        var isVP8ThePreferredCodec = remotePayloadTypes.length && remotePtToCodecs.get(remotePayloadTypes[0]) === "vp8";
        var shouldRevertSimulcast = revertForAll || !isVP8ThePreferredCodec;
        return shouldRevertSimulcast ? localMidToMediaSectionsWithoutSimulcast.get(mid).replace(/\r\n$/, "") : section;
      })).concat("").join("\r\n");
    }
    function addOrRewriteNewTrackIds(sdp, activeMidsToTrackIds, trackIdsByKind) {
      var newMidsToTrackIds = Array.from(trackIdsByKind).reduce(function(midsToTrackIds, _a2) {
        var _b = __read(_a2, 2), kind = _b[0], trackIds = _b[1];
        var mediaSections = getMediaSections(sdp, kind, "send(only|recv)");
        var newMids = mediaSections.map(getMidForMediaSection).filter(function(mid) {
          return !activeMidsToTrackIds.has(mid);
        });
        newMids.forEach(function(mid, i) {
          return midsToTrackIds.set(mid, trackIds[i]);
        });
        return midsToTrackIds;
      }, /* @__PURE__ */ new Map());
      return addOrRewriteTrackIds(sdp, newMidsToTrackIds);
    }
    function addOrRewriteTrackIds(sdp, midsToTrackIds) {
      var mediaSections = getMediaSections(sdp);
      var session = sdp.split("\r\nm=")[0];
      return [session].concat(mediaSections.map(function(mediaSection) {
        if (!/^m=(audio|video)/.test(mediaSection)) {
          return mediaSection;
        }
        var mid = getMidForMediaSection(mediaSection);
        if (!mid) {
          return mediaSection;
        }
        var trackId = midsToTrackIds.get(mid);
        if (!trackId) {
          return mediaSection;
        }
        var attributes = (mediaSection.match(/^a=msid:(.+)$/m) || [])[1];
        if (!attributes) {
          return mediaSection;
        }
        var _a2 = __read(attributes.split(" "), 2), msid = _a2[0], trackIdToRewrite = _a2[1];
        var msidRegex = new RegExp("msid:" + msid + (trackIdToRewrite ? " " + trackIdToRewrite : "") + "$", "gm");
        return mediaSection.replace(msidRegex, "msid:" + msid + " " + trackId);
      })).join("\r\n");
    }
    function removeSSRCAttributes(sdp, ssrcAttributesToRemove) {
      return sdp.split("\r\n").filter(function(line) {
        return !ssrcAttributesToRemove.find(function(srcAttribute) {
          return new RegExp("a=ssrc:.*" + srcAttribute + ":", "g").test(line);
        });
      }).join("\r\n");
    }
    function disableRtx(sdp) {
      var mediaSections = getMediaSections(sdp);
      var session = sdp.split("\r\nm=")[0];
      return [session].concat(mediaSections.map(function(mediaSection) {
        if (!/^m=video/.test(mediaSection)) {
          return mediaSection;
        }
        var codecsToPts = createCodecMapForMediaSection(mediaSection);
        var rtxPts = codecsToPts.get("rtx");
        if (!rtxPts) {
          return mediaSection;
        }
        var pts = new Set(getPayloadTypesInMediaSection(mediaSection));
        rtxPts.forEach(function(rtxPt) {
          return pts.delete(rtxPt);
        });
        var rtxSSRCMatches = mediaSection.match(/a=ssrc-group:FID [0-9]+ ([0-9]+)/);
        var rtxSSRC = rtxSSRCMatches && rtxSSRCMatches[1];
        var filterRegexes = [
          /^a=fmtp:.+ apt=.+$/,
          /^a=rtpmap:.+ rtx\/.+$/,
          /^a=ssrc-group:.+$/
        ].concat(rtxSSRC ? [new RegExp("^a=ssrc:" + rtxSSRC + " .+$")] : []);
        mediaSection = mediaSection.split("\r\n").filter(function(line) {
          return filterRegexes.every(function(regex) {
            return !regex.test(line);
          });
        }).join("\r\n");
        return setPayloadTypesInMediaSection(Array.from(pts), mediaSection);
      })).join("\r\n");
    }
    function generateFmtpLineFromPtAndAttributes(pt, fmtpAttrs) {
      var serializedFmtpAttrs = Object.entries(fmtpAttrs).map(function(_a2) {
        var _b = __read(_a2, 2), name = _b[0], value = _b[1];
        return name + "=" + value;
      }).join(";");
      return "a=fmtp:" + pt + " " + serializedFmtpAttrs;
    }
    function enableDtxForOpus(sdp, mids) {
      var mediaSections = getMediaSections(sdp);
      var session = sdp.split("\r\nm=")[0];
      mids = mids || mediaSections.filter(function(section) {
        return /^m=audio/.test(section);
      }).map(getMidForMediaSection);
      return [session].concat(mediaSections.map(function(section) {
        if (!/^m=audio/.test(section)) {
          return section;
        }
        var codecsToPts = createCodecMapForMediaSection(section);
        var opusPt = codecsToPts.get("opus");
        if (!opusPt) {
          return section;
        }
        var opusFmtpAttrs = getFmtpAttributesForPt(opusPt, section);
        if (!opusFmtpAttrs) {
          return section;
        }
        var origOpusFmtpLine = generateFmtpLineFromPtAndAttributes(opusPt, opusFmtpAttrs);
        var origOpusFmtpRegex = new RegExp(origOpusFmtpLine);
        var mid = getMidForMediaSection(section);
        if (mids.includes(mid)) {
          opusFmtpAttrs.usedtx = 1;
        } else {
          delete opusFmtpAttrs.usedtx;
        }
        var opusFmtpLineWithDtx = generateFmtpLineFromPtAndAttributes(opusPt, opusFmtpAttrs);
        return section.replace(origOpusFmtpRegex, opusFmtpLineWithDtx);
      })).join("\r\n");
    }
    exports.addOrRewriteNewTrackIds = addOrRewriteNewTrackIds;
    exports.addOrRewriteTrackIds = addOrRewriteTrackIds;
    exports.createCodecMapForMediaSection = createCodecMapForMediaSection;
    exports.createPtToCodecName = createPtToCodecName;
    exports.disableRtx = disableRtx;
    exports.enableDtxForOpus = enableDtxForOpus;
    exports.filterLocalCodecs = filterLocalCodecs;
    exports.getMediaSections = getMediaSections;
    exports.removeSSRCAttributes = removeSSRCAttributes;
    exports.revertSimulcast = revertSimulcast;
    exports.setCodecPreferences = setCodecPreferences;
    exports.setSimulcast = setSimulcast;
  }
});

// node_modules/twilio-video/es5/util/filter.js
var require_filter = __commonJS({
  "node_modules/twilio-video/es5/util/filter.js"(exports, module) {
    "use strict";
    var Filter = (
      /** @class */
      function() {
        function Filter2(options) {
          options = Object.assign({
            getKey: function defaultGetKey(a) {
              return a;
            },
            getValue: function defaultGetValue(a) {
              return a;
            },
            isLessThanOrEqualTo: function defaultIsLessThanOrEqualTo(a, b) {
              return a <= b;
            }
          }, options);
          Object.defineProperties(this, {
            _getKey: {
              value: options.getKey
            },
            _getValue: {
              value: options.getValue
            },
            _isLessThanOrEqualTo: {
              value: options.isLessThanOrEqualTo
            },
            _map: {
              value: /* @__PURE__ */ new Map()
            }
          });
        }
        Filter2.prototype.toMap = function() {
          return new Map(this._map);
        };
        Filter2.prototype.updateAndFilter = function(entries) {
          return entries.filter(this.update, this);
        };
        Filter2.prototype.update = function(entry) {
          var key = this._getKey(entry);
          var value = this._getValue(entry);
          if (this._map.has(key) && this._isLessThanOrEqualTo(value, this._map.get(key))) {
            return false;
          }
          this._map.set(key, value);
          return true;
        };
        return Filter2;
      }()
    );
    module.exports = Filter;
  }
});

// node_modules/twilio-video/es5/signaling/v2/icebox.js
var require_icebox = __commonJS({
  "node_modules/twilio-video/es5/signaling/v2/icebox.js"(exports, module) {
    "use strict";
    var Filter = require_filter();
    var IceBox = (
      /** @class */
      function() {
        function IceBox2() {
          Object.defineProperties(this, {
            _filter: {
              value: new Filter({
                getKey: function getKey(iceState) {
                  return iceState.ufrag;
                },
                isLessThanOrEqualTo: function isLessThanOrEqualTo(a, b) {
                  return a.revision <= b.revision;
                }
              })
            },
            _ufrag: {
              writable: true,
              value: null
            },
            ufrag: {
              enumerable: true,
              get: function() {
                return this._ufrag;
              }
            }
          });
        }
        IceBox2.prototype.setUfrag = function(ufrag) {
          this._ufrag = ufrag;
          var ice = this._filter.toMap().get(ufrag);
          return ice ? ice.candidates : [];
        };
        IceBox2.prototype.update = function(iceState) {
          iceState.candidates = iceState.candidates || [];
          var oldIceState = this._filter.toMap().get(iceState.ufrag);
          var oldCandidates = oldIceState ? oldIceState.candidates : [];
          return this._filter.update(iceState) && this._ufrag === iceState.ufrag ? iceState.candidates.slice(oldCandidates.length) : [];
        };
        return IceBox2;
      }()
    );
    module.exports = IceBox;
  }
});

// node_modules/twilio-video/es5/signaling/v2/iceconnectionmonitor.js
var require_iceconnectionmonitor = __commonJS({
  "node_modules/twilio-video/es5/signaling/v2/iceconnectionmonitor.js"(exports, module) {
    "use strict";
    var _a = require_constants();
    var ICE_ACTIVITY_CHECK_PERIOD_MS = _a.ICE_ACTIVITY_CHECK_PERIOD_MS;
    var ICE_INACTIVITY_THRESHOLD_MS = _a.ICE_INACTIVITY_THRESHOLD_MS;
    var IceConnectionMonitor = (
      /** @class */
      function() {
        function IceConnectionMonitor2(peerConnection, options) {
          options = Object.assign({
            activityCheckPeriodMs: ICE_ACTIVITY_CHECK_PERIOD_MS,
            inactivityThresholdMs: ICE_INACTIVITY_THRESHOLD_MS
          }, options);
          Object.defineProperties(this, {
            _activityCheckPeriodMs: {
              value: options.activityCheckPeriodMs
            },
            _inactivityThresholdMs: {
              value: options.inactivityThresholdMs
            },
            _lastActivity: {
              value: null,
              writable: true
            },
            _peerConnection: {
              value: peerConnection
            },
            _timer: {
              value: null,
              writable: true
            },
            _onIceConnectionStateChanged: {
              value: null,
              writable: true
            }
          });
        }
        IceConnectionMonitor2.prototype._getActivePairStat = function(stats) {
          var statsArray = Array.from(stats.values());
          var activePairStats = statsArray.find(function(stat) {
            return stat.type === "candidate-pair" && stat.nominated;
          });
          return activePairStats || {
            bytesReceived: 0,
            timestamp: Math.round((/* @__PURE__ */ new Date()).getTime())
          };
        };
        IceConnectionMonitor2.prototype._getIceConnectionStats = function() {
          var _this = this;
          return this._peerConnection.getStats().then(function(stats) {
            return _this._getActivePairStat(stats);
          }).catch(function() {
            return null;
          });
        };
        IceConnectionMonitor2.prototype._scheduleInactivityCallback = function(callback) {
          var _this = this;
          if (callback && this._onIceConnectionStateChanged === null) {
            this._onIceConnectionStateChanged = function() {
              if (_this._peerConnection.iceConnectionState === "disconnected") {
                callback();
              }
            };
            this._peerConnection.addEventListener("iceconnectionstatechange", this._onIceConnectionStateChanged);
          } else if (!callback && this._onIceConnectionStateChanged) {
            this._peerConnection.removeEventListener("iceconnectionstatechange", this._onIceConnectionStateChanged);
            this._onIceConnectionStateChanged = null;
          }
        };
        IceConnectionMonitor2.prototype.start = function(onIceConnectionInactive) {
          var _this = this;
          this.stop();
          this._timer = setInterval(function() {
            _this._getIceConnectionStats().then(function(iceStats) {
              if (!iceStats) {
                return;
              }
              if (!_this._lastActivity || _this._lastActivity.bytesReceived !== iceStats.bytesReceived) {
                _this._lastActivity = iceStats;
                _this._scheduleInactivityCallback(null);
              }
              if (iceStats.timestamp - _this._lastActivity.timestamp >= _this._inactivityThresholdMs) {
                if (_this._peerConnection.iceConnectionState === "disconnected") {
                  onIceConnectionInactive();
                } else if (_this._onIceConnectionStateChanged === null) {
                  _this._scheduleInactivityCallback(onIceConnectionInactive);
                }
              }
            });
          }, this._activityCheckPeriodMs);
        };
        IceConnectionMonitor2.prototype.stop = function() {
          this._scheduleInactivityCallback(null);
          if (this._timer !== null) {
            clearInterval(this._timer);
            this._timer = null;
            this._lastActivity = null;
          }
        };
        return IceConnectionMonitor2;
      }()
    );
    module.exports = IceConnectionMonitor;
  }
});

// node_modules/twilio-video/es5/data/transport.js
var require_transport = __commonJS({
  "node_modules/twilio-video/es5/data/transport.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var EventEmitter = require_events().EventEmitter;
    var DataTransport = (
      /** @class */
      function(_super) {
        __extends(DataTransport2, _super);
        function DataTransport2(dataChannel) {
          var _this = _super.call(this) || this;
          Object.defineProperties(_this, {
            _dataChannel: {
              value: dataChannel
            },
            _messageQueue: {
              value: []
            }
          });
          dataChannel.addEventListener("open", function() {
            _this._messageQueue.splice(0).forEach(function(message) {
              return _this._publish(message);
            });
          });
          dataChannel.addEventListener("message", function(_a) {
            var data = _a.data;
            try {
              var message = JSON.parse(data);
              _this.emit("message", message);
            } catch (error) {
            }
          });
          _this.publish({ type: "ready" });
          return _this;
        }
        DataTransport2.prototype._publish = function(message) {
          var data = JSON.stringify(message);
          try {
            this._dataChannel.send(data);
          } catch (error) {
          }
        };
        DataTransport2.prototype.publish = function(message) {
          var dataChannel = this._dataChannel;
          if (dataChannel.readyState === "closing" || dataChannel.readyState === "closed") {
            return false;
          }
          if (dataChannel.readyState === "connecting") {
            this._messageQueue.push(message);
            return true;
          }
          this._publish(message);
          return true;
        };
        return DataTransport2;
      }(EventEmitter)
    );
    module.exports = DataTransport;
  }
});

// node_modules/twilio-video/es5/data/receiver.js
var require_receiver = __commonJS({
  "node_modules/twilio-video/es5/data/receiver.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var DataTrackTransceiver = require_transceiver3();
    var DataTransport = require_transport();
    var DataTrackReceiver = (
      /** @class */
      function(_super) {
        __extends(DataTrackReceiver2, _super);
        function DataTrackReceiver2(dataChannel) {
          var _this = _super.call(this, dataChannel.label, dataChannel.maxPacketLifeTime, dataChannel.maxRetransmits, dataChannel.ordered) || this;
          Object.defineProperties(_this, {
            _dataChannel: {
              value: dataChannel
            }
          });
          dataChannel.binaryType = "arraybuffer";
          dataChannel.addEventListener("message", function(event) {
            _this.emit("message", event.data);
          });
          dataChannel.addEventListener("close", function() {
            _this.emit("close");
          });
          return _this;
        }
        DataTrackReceiver2.prototype.stop = function() {
          this._dataChannel.close();
          _super.prototype.stop.call(this);
        };
        DataTrackReceiver2.prototype.toDataTransport = function() {
          return new DataTransport(this._dataChannel);
        };
        return DataTrackReceiver2;
      }(DataTrackTransceiver)
    );
    module.exports = DataTrackReceiver;
  }
});

// node_modules/twilio-video/es5/media/track/receiver.js
var require_receiver2 = __commonJS({
  "node_modules/twilio-video/es5/media/track/receiver.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var MediaTrackTransceiver = require_transceiver2();
    var MediaTrackReceiver = (
      /** @class */
      function(_super) {
        __extends(MediaTrackReceiver2, _super);
        function MediaTrackReceiver2(id, mediaStreamTrack) {
          return _super.call(this, id, mediaStreamTrack) || this;
        }
        return MediaTrackReceiver2;
      }(MediaTrackTransceiver)
    );
    module.exports = MediaTrackReceiver;
  }
});

// node_modules/twilio-video/es5/util/sdp/trackmatcher.js
var require_trackmatcher = __commonJS({
  "node_modules/twilio-video/es5/util/sdp/trackmatcher.js"(exports, module) {
    "use strict";
    var getMediaSections = require_sdp2().getMediaSections;
    var TrackMatcher = (
      /** @class */
      function() {
        function TrackMatcher2() {
          Object.defineProperties(this, {
            _midsToTrackIds: {
              value: /* @__PURE__ */ new Map(),
              writable: true
            }
          });
        }
        TrackMatcher2.prototype.match = function(event) {
          return this._midsToTrackIds.get(event.transceiver.mid) || null;
        };
        TrackMatcher2.prototype.update = function(sdp) {
          var sections = getMediaSections(sdp, "(audio|video)");
          this._midsToTrackIds = sections.reduce(function(midsToTrackIds, section) {
            var midMatches = section.match(/^a=mid:(.+)$/m) || [];
            var trackIdMatches = section.match(/^a=msid:.+ (.+)$/m) || [];
            var mid = midMatches[1];
            var trackId = trackIdMatches[1];
            return mid && trackId ? midsToTrackIds.set(mid, trackId) : midsToTrackIds;
          }, this._midsToTrackIds);
        };
        return TrackMatcher2;
      }()
    );
    module.exports = TrackMatcher;
  }
});

// node_modules/twilio-video/es5/util/sdp/issue8329.js
var require_issue8329 = __commonJS({
  "node_modules/twilio-video/es5/util/sdp/issue8329.js"(exports, module) {
    "use strict";
    var RTCSessionDescription2 = require_webrtc().RTCSessionDescription;
    var _a = require_sdp2();
    var createPtToCodecName = _a.createPtToCodecName;
    var getMediaSections = _a.getMediaSections;
    function workaround(description) {
      var descriptionInit = { type: description.type };
      if (description.type !== "rollback") {
        descriptionInit.sdp = sdpWorkaround(description.sdp);
      }
      return new RTCSessionDescription2(descriptionInit);
    }
    function sdpWorkaround(sdp) {
      var mediaSections = getMediaSections(sdp);
      var session = sdp.split("\r\nm=")[0];
      return [session].concat(mediaSections.map(mediaSectionWorkaround)).join("\r\n");
    }
    function mediaSectionWorkaround(mediaSection) {
      var ptToCodecName = createPtToCodecName(mediaSection);
      mediaSection = deleteDuplicateRtxPts(mediaSection, ptToCodecName);
      var codecNameToPts = createCodecNameToPts(ptToCodecName);
      var rtxPts = codecNameToPts.get("rtx") || /* @__PURE__ */ new Set();
      var invalidRtxPts = /* @__PURE__ */ new Set();
      var rtxPtToAssociatedPt = createRtxPtToAssociatedPt(mediaSection, ptToCodecName, rtxPts, invalidRtxPts);
      var associatedPtToRtxPt = createAssociatedPtToRtxPt(rtxPtToAssociatedPt, invalidRtxPts);
      var unassociatedRtxPts = Array.from(invalidRtxPts);
      var knownCodecNames = ["h264", "vp8", "vp9"];
      var unassociatedPts = knownCodecNames.reduce(function(unassociatedPts2, codecName) {
        var pts = codecNameToPts.get(codecName) || /* @__PURE__ */ new Set();
        return Array.from(pts).reduce(function(unassociatedPts3, pt) {
          return associatedPtToRtxPt.has(pt) ? unassociatedPts3 : unassociatedPts3.add(pt);
        }, unassociatedPts2);
      }, /* @__PURE__ */ new Set());
      unassociatedPts.forEach(function(pt) {
        if (unassociatedRtxPts.length) {
          var rtxPt = unassociatedRtxPts.shift();
          mediaSection = deleteFmtpAttributesForRtxPt(mediaSection, rtxPt);
          mediaSection = addFmtpAttributeForRtxPt(mediaSection, rtxPt, pt);
        }
      });
      unassociatedRtxPts.forEach(function(rtxPt) {
        mediaSection = deleteFmtpAttributesForRtxPt(mediaSection, rtxPt);
        mediaSection = deleteRtpmapAttributesForRtxPt(mediaSection, rtxPt);
      });
      return mediaSection;
    }
    function deleteDuplicateRtxPts(mediaSection, ptToCodecName) {
      return Array.from(ptToCodecName.keys()).reduce(function(section, pt) {
        var rtpmapRegex = new RegExp("^a=rtpmap:" + pt + " rtx.+$", "gm");
        return (section.match(rtpmapRegex) || []).slice(ptToCodecName.get(pt) === "rtx" ? 1 : 0).reduce(function(section2, rtpmap) {
          var rtpmapRegex2 = new RegExp("\r\n" + rtpmap);
          var fmtpmapRegex = new RegExp("\r\na=fmtp:" + pt + " apt=[0-9]+");
          return section2.replace(rtpmapRegex2, "").replace(fmtpmapRegex, "");
        }, section);
      }, mediaSection);
    }
    function createCodecNameToPts(ptToCodecName) {
      var codecNameToPts = /* @__PURE__ */ new Map();
      ptToCodecName.forEach(function(codecName, pt) {
        var pts = codecNameToPts.get(codecName) || /* @__PURE__ */ new Set();
        return codecNameToPts.set(codecName, pts.add(pt));
      });
      return codecNameToPts;
    }
    function createRtxPtToAssociatedPt(mediaSection, ptToCodecName, rtxPts, invalidRtxPts) {
      return Array.from(rtxPts).reduce(function(rtxPtToAssociatedPt, rtxPt) {
        var fmtpPattern = new RegExp("a=fmtp:" + rtxPt + " apt=(\\d+)");
        var matches = mediaSection.match(fmtpPattern);
        if (!matches) {
          invalidRtxPts.add(rtxPt);
          return rtxPtToAssociatedPt;
        }
        var pt = Number.parseInt(matches[1]);
        if (!ptToCodecName.has(pt)) {
          invalidRtxPts.add(rtxPt);
          return rtxPtToAssociatedPt;
        }
        var codecName = ptToCodecName.get(pt);
        if (codecName === "rtx") {
          invalidRtxPts.add(rtxPt);
          return rtxPtToAssociatedPt;
        }
        return rtxPtToAssociatedPt.set(rtxPt, pt);
      }, /* @__PURE__ */ new Map());
    }
    function createAssociatedPtToRtxPt(rtxPtToAssociatedPt, invalidRtxPts) {
      var associatedPtToRtxPts = Array.from(rtxPtToAssociatedPt).reduce(function(associatedPtToRtxPts2, pair) {
        var rtxPt = pair[0];
        var pt = pair[1];
        var rtxPts = associatedPtToRtxPts2.get(pt) || /* @__PURE__ */ new Set();
        return associatedPtToRtxPts2.set(pt, rtxPts.add(rtxPt));
      }, /* @__PURE__ */ new Map());
      return Array.from(associatedPtToRtxPts).reduce(function(associatedPtToRtxPt, pair) {
        var pt = pair[0];
        var rtxPts = Array.from(pair[1]);
        if (rtxPts.length > 1) {
          rtxPts.forEach(function(rtxPt) {
            invalidRtxPts.add(rtxPt);
          });
          return associatedPtToRtxPt;
        }
        return associatedPtToRtxPt.set(pt, rtxPts[0]);
      }, /* @__PURE__ */ new Map());
    }
    function deleteFmtpAttributesForRtxPt(mediaSection, rtxPt) {
      var pattern = new RegExp("a=fmtp:" + rtxPt + ".*\r\n", "gm");
      return mediaSection.replace(pattern, "");
    }
    function deleteRtpmapAttributesForRtxPt(mediaSection, rtxPt) {
      var pattern = new RegExp("a=rtpmap:" + rtxPt + ".*\r\n", "gm");
      return mediaSection.replace(pattern, "");
    }
    function addFmtpAttributeForRtxPt(mediaSection, rtxPt, pt) {
      return mediaSection.endsWith("\r\n") ? mediaSection + "a=fmtp:" + rtxPt + " apt=" + pt + "\r\n" : mediaSection + "\r\na=fmtp:" + rtxPt + " apt=" + pt;
    }
    module.exports = workaround;
  }
});

// node_modules/twilio-video/es5/signaling/v2/peerconnection.js
var require_peerconnection = __commonJS({
  "node_modules/twilio-video/es5/signaling/v2/peerconnection.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var DefaultBackoff = require_backoff();
    var _a = require_webrtc();
    var DefaultRTCIceCandidate = _a.RTCIceCandidate;
    var DefaultRTCPeerConnection = _a.RTCPeerConnection;
    var DefaultRTCSessionDescription = _a.RTCSessionDescription;
    var getStatistics = _a.getStats;
    var util = require_util();
    var _b = require_constants();
    var DEFAULT_ICE_GATHERING_TIMEOUT_MS = _b.DEFAULT_ICE_GATHERING_TIMEOUT_MS;
    var DEFAULT_LOG_LEVEL = _b.DEFAULT_LOG_LEVEL;
    var DEFAULT_SESSION_TIMEOUT_SEC = _b.DEFAULT_SESSION_TIMEOUT_SEC;
    var iceRestartBackoffConfig = _b.iceRestartBackoffConfig;
    var _c = require_sdp2();
    var addOrRewriteNewTrackIds = _c.addOrRewriteNewTrackIds;
    var addOrRewriteTrackIds = _c.addOrRewriteTrackIds;
    var createCodecMapForMediaSection = _c.createCodecMapForMediaSection;
    var disableRtx = _c.disableRtx;
    var enableDtxForOpus = _c.enableDtxForOpus;
    var filterLocalCodecs = _c.filterLocalCodecs;
    var getMediaSections = _c.getMediaSections;
    var removeSSRCAttributes = _c.removeSSRCAttributes;
    var revertSimulcast = _c.revertSimulcast;
    var setCodecPreferences = _c.setCodecPreferences;
    var setSimulcast = _c.setSimulcast;
    var DefaultTimeout = require_timeout();
    var _d = require_twilio_video_errors();
    var MediaClientLocalDescFailedError = _d.MediaClientLocalDescFailedError;
    var MediaClientRemoteDescFailedError = _d.MediaClientRemoteDescFailedError;
    var _e = require_util2();
    var buildLogLevels = _e.buildLogLevels;
    var getPlatform = _e.getPlatform;
    var isChromeScreenShareTrack = _e.isChromeScreenShareTrack;
    var oncePerTick = _e.oncePerTick;
    var defer = _e.defer;
    var IceBox = require_icebox();
    var DefaultIceConnectionMonitor = require_iceconnectionmonitor();
    var DataTrackReceiver = require_receiver();
    var MediaTrackReceiver = require_receiver2();
    var StateMachine = require_statemachine();
    var Log = require_log();
    var TrackMatcher = require_trackmatcher();
    var workaroundIssue8329 = require_issue8329();
    var guess = util.guessBrowser();
    var platform = getPlatform();
    var isAndroid = /android/.test(platform);
    var isChrome = guess === "chrome";
    var isFirefox = guess === "firefox";
    var isSafari = guess === "safari";
    var nInstances = 0;
    var states = {
      open: [
        "closed",
        "updating"
      ],
      updating: [
        "closed",
        "open"
      ],
      closed: []
    };
    var PeerConnectionV2 = (
      /** @class */
      function(_super) {
        __extends(PeerConnectionV22, _super);
        function PeerConnectionV22(id, encodingParameters, preferredCodecs, options) {
          var _this = _super.call(this, "open", states) || this;
          options = Object.assign({
            enableDscp: false,
            dummyAudioMediaStreamTrack: null,
            isChromeScreenShareTrack,
            iceServers: [],
            logLevel: DEFAULT_LOG_LEVEL,
            offerOptions: {},
            revertSimulcast,
            sessionTimeout: DEFAULT_SESSION_TIMEOUT_SEC * 1e3,
            setCodecPreferences,
            setSimulcast,
            Backoff: DefaultBackoff,
            IceConnectionMonitor: DefaultIceConnectionMonitor,
            RTCIceCandidate: DefaultRTCIceCandidate,
            RTCPeerConnection: DefaultRTCPeerConnection,
            RTCSessionDescription: DefaultRTCSessionDescription,
            Timeout: DefaultTimeout
          }, options);
          var configuration = getConfiguration(options);
          var logLevels = buildLogLevels(options.logLevel);
          var RTCPeerConnection2 = options.RTCPeerConnection;
          if (options.enableDscp === true) {
            options.chromeSpecificConstraints = options.chromeSpecificConstraints || {};
            options.chromeSpecificConstraints.optional = options.chromeSpecificConstraints.optional || [];
            options.chromeSpecificConstraints.optional.push({ googDscp: true });
          }
          var log = options.log ? options.log.createLog("webrtc", _this) : new Log("webrtc", _this, logLevels, options.loggerName);
          var peerConnection = new RTCPeerConnection2(configuration, options.chromeSpecificConstraints);
          if (options.dummyAudioMediaStreamTrack) {
            peerConnection.addTrack(options.dummyAudioMediaStreamTrack);
          }
          Object.defineProperties(_this, {
            _appliedTrackIdsToAttributes: {
              value: /* @__PURE__ */ new Map(),
              writable: true
            },
            _dataChannels: {
              value: /* @__PURE__ */ new Map()
            },
            _dataTrackReceivers: {
              value: /* @__PURE__ */ new Set()
            },
            _descriptionRevision: {
              writable: true,
              value: 0
            },
            _didGenerateLocalCandidates: {
              writable: true,
              value: false
            },
            _enableDscp: {
              value: options.enableDscp
            },
            _encodingParameters: {
              value: encodingParameters
            },
            _isChromeScreenShareTrack: {
              value: options.isChromeScreenShareTrack
            },
            _iceGatheringFailed: {
              value: false,
              writable: true
            },
            _iceGatheringTimeout: {
              value: new options.Timeout(function() {
                return _this._handleIceGatheringTimeout();
              }, DEFAULT_ICE_GATHERING_TIMEOUT_MS, false)
            },
            _iceRestartBackoff: {
              // eslint-disable-next-line new-cap
              value: new options.Backoff(iceRestartBackoffConfig)
            },
            _instanceId: {
              value: ++nInstances
            },
            _isIceConnectionInactive: {
              writable: true,
              value: false
            },
            _isIceLite: {
              writable: true,
              value: false
            },
            _isIceRestartBackoffInProgress: {
              writable: true,
              value: false
            },
            _isRestartingIce: {
              writable: true,
              value: false
            },
            _lastIceConnectionState: {
              writable: true,
              value: null
            },
            _lastStableDescriptionRevision: {
              writable: true,
              value: 0
            },
            _localCandidates: {
              writable: true,
              value: []
            },
            _localCodecs: {
              value: /* @__PURE__ */ new Set()
            },
            _localCandidatesRevision: {
              writable: true,
              value: 1
            },
            _localDescriptionWithoutSimulcast: {
              writable: true,
              value: null
            },
            _localDescription: {
              writable: true,
              value: null
            },
            _localUfrag: {
              writable: true,
              value: null
            },
            _log: {
              value: log
            },
            _eventObserver: {
              value: options.eventObserver
            },
            _remoteCodecMaps: {
              value: /* @__PURE__ */ new Map()
            },
            _rtpSenders: {
              value: /* @__PURE__ */ new Map()
            },
            _rtpNewSenders: {
              value: /* @__PURE__ */ new Set()
            },
            _iceConnectionMonitor: {
              value: new options.IceConnectionMonitor(peerConnection)
            },
            _mediaTrackReceivers: {
              value: /* @__PURE__ */ new Set()
            },
            _needsAnswer: {
              writable: true,
              value: false
            },
            _negotiationRole: {
              writable: true,
              value: null
            },
            _offerOptions: {
              writable: true,
              value: options.offerOptions
            },
            _onEncodingParametersChanged: {
              value: oncePerTick(function() {
                if (!_this._needsAnswer) {
                  updateEncodingParameters(_this);
                }
              })
            },
            _peerConnection: {
              value: peerConnection
            },
            _preferredAudioCodecs: {
              value: preferredCodecs.audio
            },
            _preferredVideoCodecs: {
              value: preferredCodecs.video
            },
            _shouldApplyDtx: {
              value: preferredCodecs.audio.every(function(_a2) {
                var codec = _a2.codec;
                return codec !== "opus";
              }) || preferredCodecs.audio.some(function(_a2) {
                var codec = _a2.codec, dtx = _a2.dtx;
                return codec === "opus" && dtx;
              })
            },
            _queuedDescription: {
              writable: true,
              value: null
            },
            _iceReconnectTimeout: {
              value: new options.Timeout(function() {
                log.debug("ICE reconnect timed out");
                _this.close();
              }, options.sessionTimeout, false)
            },
            _recycledTransceivers: {
              value: {
                audio: [],
                video: []
              }
            },
            _replaceTrackPromises: {
              value: /* @__PURE__ */ new Map()
            },
            _remoteCandidates: {
              writable: true,
              value: new IceBox()
            },
            _setCodecPreferences: {
              // NOTE(mmalavalli): Re-ordering payload types in order to make sure a non-H264
              // preferred codec is selected does not work on Android Firefox due to this behavior:
              // https://bugzilla.mozilla.org/show_bug.cgi?id=1683258. So, we work around this by
              // not applying any non-H264 preferred video codec.
              value: isFirefox && isAndroid && preferredCodecs.video[0] && preferredCodecs.video[0].codec.toLowerCase() !== "h264" ? function(sdp) {
                return sdp;
              } : options.setCodecPreferences
            },
            _setSimulcast: {
              value: options.setSimulcast
            },
            _revertSimulcast: {
              value: options.revertSimulcast
            },
            _RTCIceCandidate: {
              value: options.RTCIceCandidate
            },
            _RTCPeerConnection: {
              value: options.RTCPeerConnection
            },
            _RTCSessionDescription: {
              value: options.RTCSessionDescription
            },
            _shouldOffer: {
              writable: true,
              value: false
            },
            _shouldRestartIce: {
              writable: true,
              value: false
            },
            _trackIdsToAttributes: {
              value: /* @__PURE__ */ new Map(),
              writable: true
            },
            _trackMatcher: {
              writable: true,
              value: null
            },
            _mediaTrackSenderToPublisherHints: {
              value: /* @__PURE__ */ new Map()
            },
            id: {
              enumerable: true,
              value: id
            }
          });
          encodingParameters.on("changed", _this._onEncodingParametersChanged);
          peerConnection.addEventListener("connectionstatechange", _this._handleConnectionStateChange.bind(_this));
          peerConnection.addEventListener("datachannel", _this._handleDataChannelEvent.bind(_this));
          peerConnection.addEventListener("icecandidate", _this._handleIceCandidateEvent.bind(_this));
          peerConnection.addEventListener("iceconnectionstatechange", _this._handleIceConnectionStateChange.bind(_this));
          peerConnection.addEventListener("icegatheringstatechange", _this._handleIceGatheringStateChange.bind(_this));
          peerConnection.addEventListener("signalingstatechange", _this._handleSignalingStateChange.bind(_this));
          peerConnection.addEventListener("track", _this._handleTrackEvent.bind(_this));
          var self = _this;
          _this.on("stateChanged", function stateChanged(state) {
            if (state !== "closed") {
              return;
            }
            self.removeListener("stateChanged", stateChanged);
            self._dataChannels.forEach(function(dataChannel, dataTrackSender) {
              self.removeDataTrackSender(dataTrackSender);
            });
          });
          return _this;
        }
        PeerConnectionV22.prototype.toString = function() {
          return "[PeerConnectionV2 #" + this._instanceId + ": " + this.id + "]";
        };
        PeerConnectionV22.prototype.setEffectiveAdaptiveSimulcast = function(effectiveAdaptiveSimulcast) {
          this._log.debug("Setting setEffectiveAdaptiveSimulcast: ", effectiveAdaptiveSimulcast);
          this._preferredVideoCodecs.forEach(function(cs) {
            if ("adaptiveSimulcast" in cs) {
              cs.adaptiveSimulcast = effectiveAdaptiveSimulcast;
            }
          });
        };
        Object.defineProperty(PeerConnectionV22.prototype, "_shouldApplySimulcast", {
          get: function() {
            if (!isChrome && !isSafari) {
              return false;
            }
            var simulcast = this._preferredVideoCodecs.some(function(cs) {
              return cs.codec.toLowerCase() === "vp8" && cs.simulcast && cs.adaptiveSimulcast !== false;
            });
            return simulcast;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(PeerConnectionV22.prototype, "connectionState", {
          /**
           * The {@link PeerConnectionV2}'s underlying RTCPeerConnection's RTCPeerConnectionState
           * if supported by the browser, its RTCIceConnectionState otherwise.
           * @property {RTCPeerConnectionState}
           */
          get: function() {
            return this.iceConnectionState === "failed" ? "failed" : this._peerConnection.connectionState || this.iceConnectionState;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(PeerConnectionV22.prototype, "iceConnectionState", {
          /**
           * The {@link PeerConnectionV2}'s underlying RTCPeerConnection's
           * RTCIceConnectionState.
           * @property {RTCIceConnectionState}
           */
          get: function() {
            return this._isIceConnectionInactive && this._peerConnection.iceConnectionState === "disconnected" || this._iceGatheringFailed ? "failed" : this._peerConnection.iceConnectionState;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(PeerConnectionV22.prototype, "isApplicationSectionNegotiated", {
          /**
           * Whether the {@link PeerConnectionV2} has negotiated or is in the process
           * of negotiating the application m= section.
           * @returns {boolean}
           */
          get: function() {
            if (this._peerConnection.signalingState !== "closed") {
              return this._peerConnection.localDescription ? getMediaSections(this._peerConnection.localDescription.sdp, "application").length > 0 : false;
            }
            return true;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(PeerConnectionV22.prototype, "_isAdaptiveSimulcastEnabled", {
          /**
           * Whether adaptive simulcast is enabled.
           * @returns {boolean}
           */
          get: function() {
            var adaptiveSimulcastEntry = this._preferredVideoCodecs.find(function(cs) {
              return "adaptiveSimulcast" in cs;
            });
            return adaptiveSimulcastEntry && adaptiveSimulcastEntry.adaptiveSimulcast === true;
          },
          enumerable: false,
          configurable: true
        });
        PeerConnectionV22.prototype._maybeUpdateEncodings = function(track, encodings, trackReplaced) {
          if (trackReplaced === void 0) {
            trackReplaced = false;
          }
          if (track.kind !== "video" || track.readyState === "ended") {
            return false;
          }
          var _a2 = track.getSettings(), height = _a2.height, width = _a2.width;
          if (typeof height !== "number" || typeof width !== "number") {
            return false;
          }
          var browser = util.guessBrowser();
          if (browser === "safari" || browser === "chrome" && this._isAdaptiveSimulcastEnabled) {
            this._updateEncodings(track, encodings, trackReplaced);
            return true;
          }
          return false;
        };
        PeerConnectionV22.prototype._updateEncodings = function(track, encodings, trackReplaced) {
          if (this._isChromeScreenShareTrack(track)) {
            var screenShareActiveLayerConfig_1 = [
              { scaleResolutionDownBy: 1 },
              { scaleResolutionDownBy: 1 }
            ];
            encodings.forEach(function(encoding, i) {
              var activeLayerConfig = screenShareActiveLayerConfig_1[i];
              if (activeLayerConfig) {
                encoding.scaleResolutionDownBy = activeLayerConfig.scaleResolutionDownBy;
                if (trackReplaced) {
                  delete encoding.active;
                }
              } else {
                encoding.active = false;
                delete encoding.scaleResolutionDownBy;
              }
            });
          } else {
            var _a2 = track.getSettings(), width = _a2.width, height = _a2.height;
            var pixelsToMaxActiveLayers = [
              { pixels: 960 * 540, maxActiveLayers: 3 },
              { pixels: 480 * 270, maxActiveLayers: 2 },
              { pixels: 0, maxActiveLayers: 1 }
            ];
            var trackPixels_1 = width * height;
            var activeLayersInfo = pixelsToMaxActiveLayers.find(function(layer) {
              return trackPixels_1 >= layer.pixels;
            });
            var activeLayers_1 = Math.min(encodings.length, activeLayersInfo.maxActiveLayers);
            encodings.forEach(function(encoding, i) {
              var enabled = i < activeLayers_1;
              if (enabled) {
                encoding.scaleResolutionDownBy = 1 << activeLayers_1 - i - 1;
                if (trackReplaced) {
                  encoding.active = true;
                }
              } else {
                encoding.active = false;
                delete encoding.scaleResolutionDownBy;
              }
            });
          }
          this._log.debug("_updateEncodings:", encodings.map(function(_a3, i) {
            var active = _a3.active, scaleResolutionDownBy = _a3.scaleResolutionDownBy;
            return "[" + i + ": " + active + ", " + (scaleResolutionDownBy || 0) + "]";
          }).join(", "));
        };
        PeerConnectionV22.prototype._addIceCandidate = function(candidate) {
          var _this = this;
          return Promise.resolve().then(function() {
            candidate = new _this._RTCIceCandidate(candidate);
            return _this._peerConnection.addIceCandidate(candidate);
          }).catch(function(error) {
            _this._log.warn("Failed to add RTCIceCandidate " + (candidate ? '"' + candidate.candidate + '"' : "null") + ": " + error.message);
          });
        };
        PeerConnectionV22.prototype._addIceCandidates = function(candidates) {
          return Promise.all(candidates.map(this._addIceCandidate, this)).then(function() {
          });
        };
        PeerConnectionV22.prototype._addOrUpdateTransceiver = function(track) {
          var _this = this;
          var transceiver = takeRecycledTransceiver(this, track.kind);
          if (transceiver && transceiver.sender) {
            var oldTrackId = transceiver.sender.track ? transceiver.sender.track.id : null;
            if (oldTrackId) {
              this._log.warn("Reusing transceiver: " + transceiver.mid + "] " + oldTrackId + " => " + track.id);
            }
            this._replaceTrackPromises.set(transceiver, transceiver.sender.replaceTrack(track).then(function() {
              transceiver.direction = "sendrecv";
            }, function() {
            }).finally(function() {
              _this._replaceTrackPromises.delete(transceiver);
            }));
            return transceiver;
          }
          return this._peerConnection.addTransceiver(track);
        };
        PeerConnectionV22.prototype._checkIceBox = function(description) {
          var ufrag = getUfrag(description);
          if (!ufrag) {
            return Promise.resolve();
          }
          var candidates = this._remoteCandidates.setUfrag(ufrag);
          return this._addIceCandidates(candidates);
        };
        PeerConnectionV22.prototype._answer = function(offer) {
          var _this = this;
          return Promise.resolve().then(function() {
            if (!_this._negotiationRole) {
              _this._negotiationRole = "answerer";
            }
            return _this._setRemoteDescription(offer);
          }).catch(function() {
            throw new MediaClientRemoteDescFailedError();
          }).then(function() {
            return _this._peerConnection.createAnswer();
          }).then(function(answer) {
            if (isFirefox) {
              answer = new _this._RTCSessionDescription({
                sdp: disableRtx(answer.sdp),
                type: answer.type
              });
            } else {
              answer = workaroundIssue8329(answer);
            }
            var updatedSdp = removeSSRCAttributes(answer.sdp, ["mslabel", "label"]);
            if (_this._shouldApplySimulcast) {
              var sdpWithoutSimulcast = updatedSdp;
              updatedSdp = _this._setSimulcast(sdpWithoutSimulcast, _this._trackIdsToAttributes);
              updatedSdp = _this._revertSimulcast(updatedSdp, sdpWithoutSimulcast, offer.sdp);
            }
            updatedSdp = updatedSdp.replace(/42e015/g, "42e01f");
            return _this._setLocalDescription({
              type: answer.type,
              sdp: updatedSdp
            });
          }).then(function() {
            return _this._checkIceBox(offer);
          }).then(function() {
            return _this._queuedDescription && _this._updateDescription(_this._queuedDescription);
          }).then(function() {
            _this._queuedDescription = null;
            return _this._maybeReoffer(_this._peerConnection.localDescription);
          }).catch(function(error) {
            var errorToThrow = error instanceof MediaClientRemoteDescFailedError ? error : new MediaClientLocalDescFailedError();
            _this._publishMediaWarning({
              message: "Failed to _answer",
              code: errorToThrow.code,
              error
            });
            throw errorToThrow;
          });
        };
        PeerConnectionV22.prototype._close = function() {
          this._iceConnectionMonitor.stop();
          if (this._peerConnection.signalingState !== "closed") {
            this._peerConnection.close();
            this.preempt("closed");
            this._encodingParameters.removeListener("changed", this._onEncodingParametersChanged);
            return true;
          }
          return false;
        };
        PeerConnectionV22.prototype._handleConnectionStateChange = function() {
          this.emit("connectionStateChanged");
        };
        PeerConnectionV22.prototype._handleDataChannelEvent = function(event) {
          var _this = this;
          var dataChannel = event.channel;
          var dataTrackReceiver = new DataTrackReceiver(dataChannel);
          this._dataTrackReceivers.add(dataTrackReceiver);
          dataChannel.addEventListener("close", function() {
            _this._dataTrackReceivers.delete(dataTrackReceiver);
          });
          this.emit("trackAdded", dataTrackReceiver);
        };
        PeerConnectionV22.prototype._handleGlare = function(offer) {
          var _this = this;
          this._log.debug("Glare detected; rolling back");
          if (this._isRestartingIce) {
            this._log.debug("An ICE restart was in progress; we'll need to restart ICE again after rolling back");
            this._isRestartingIce = false;
            this._shouldRestartIce = true;
          }
          return Promise.resolve().then(function() {
            _this._trackIdsToAttributes = new Map(_this._appliedTrackIdsToAttributes);
            return _this._setLocalDescription({ type: "rollback" });
          }).then(function() {
            _this._needsAnswer = false;
            return _this._answer(offer);
          }).then(function(didReoffer) {
            return didReoffer ? Promise.resolve() : _this._offer();
          });
        };
        PeerConnectionV22.prototype._publishMediaWarning = function(_a2) {
          var message = _a2.message, code = _a2.code, error = _a2.error, sdp = _a2.sdp;
          this._eventObserver.emit("event", { level: "warning", name: "error", group: "media", payload: {
            message,
            code,
            context: JSON.stringify({ error: error.message, sdp })
          } });
        };
        PeerConnectionV22.prototype._handleIceCandidateEvent = function(event) {
          if (event.candidate) {
            this._log.debug("Clearing ICE gathering timeout");
            this._didGenerateLocalCandidates = true;
            this._iceGatheringTimeout.clear();
            this._localCandidates.push(event.candidate);
          }
          var peerConnectionState = {
            ice: {
              candidates: this._isIceLite ? [] : this._localCandidates.slice(),
              ufrag: this._localUfrag
            },
            id: this.id
          };
          if (!event.candidate) {
            peerConnectionState.ice.complete = true;
          }
          if (!(this._isIceLite && event.candidate)) {
            peerConnectionState.ice.revision = this._localCandidatesRevision++;
            this.emit("candidates", peerConnectionState);
          }
        };
        PeerConnectionV22.prototype._handleIceConnectionStateChange = function() {
          var _this = this;
          var iceConnectionState = this._peerConnection.iceConnectionState;
          var isIceConnectedOrComplete = ["connected", "completed"].includes(iceConnectionState);
          var log = this._log;
          log.debug('ICE connection state is "' + iceConnectionState + '"');
          if (isIceConnectedOrComplete) {
            this._iceReconnectTimeout.clear();
            this._iceRestartBackoff.reset();
          }
          if (this._lastIceConnectionState !== "failed" && iceConnectionState === "failed" && !this._shouldRestartIce && !this._isRestartingIce) {
            log.warn("ICE failed");
            this._initiateIceRestartBackoff();
          } else if (["disconnected", "failed"].includes(this._lastIceConnectionState) && isIceConnectedOrComplete) {
            log.debug("ICE reconnected");
          }
          if (iceConnectionState === "connected") {
            this._isIceConnectionInactive = false;
            this._iceConnectionMonitor.start(function() {
              _this._iceConnectionMonitor.stop();
              if (!_this._shouldRestartIce && !_this._isRestartingIce) {
                log.warn("ICE Connection Monitor detected inactivity");
                _this._isIceConnectionInactive = true;
                _this._initiateIceRestartBackoff();
                _this.emit("iceConnectionStateChanged");
                _this.emit("connectionStateChanged");
              }
            });
          } else if (!["disconnected", "completed"].includes(iceConnectionState)) {
            this._iceConnectionMonitor.stop();
            this._isIceConnectionInactive = false;
          }
          this._lastIceConnectionState = iceConnectionState;
          this.emit("iceConnectionStateChanged");
        };
        PeerConnectionV22.prototype._handleIceGatheringTimeout = function() {
          this._log.warn("ICE failed to gather any local candidates");
          this._iceGatheringFailed = true;
          this._initiateIceRestartBackoff();
          this.emit("iceConnectionStateChanged");
          this.emit("connectionStateChanged");
        };
        PeerConnectionV22.prototype._handleIceGatheringStateChange = function() {
          var iceGatheringState = this._peerConnection.iceGatheringState;
          var log = this._log;
          log.debug('ICE gathering state is "' + iceGatheringState + '"');
          var _a2 = this._iceGatheringTimeout, delay = _a2.delay, isSet = _a2.isSet;
          if (iceGatheringState === "gathering" && !this._didGenerateLocalCandidates && !isSet) {
            log.debug("Starting ICE gathering timeout: " + delay);
            this._iceGatheringFailed = false;
            this._iceGatheringTimeout.start();
          }
        };
        PeerConnectionV22.prototype._handleSignalingStateChange = function() {
          if (this._peerConnection.signalingState === "stable") {
            this._appliedTrackIdsToAttributes = new Map(this._trackIdsToAttributes);
          }
        };
        PeerConnectionV22.prototype._handleTrackEvent = function(event) {
          var _this = this;
          var sdp = this._peerConnection.remoteDescription ? this._peerConnection.remoteDescription.sdp : null;
          this._trackMatcher = this._trackMatcher || new TrackMatcher();
          this._trackMatcher.update(sdp);
          var mediaStreamTrack = event.track;
          var signaledTrackId = this._trackMatcher.match(event) || mediaStreamTrack.id;
          var mediaTrackReceiver = new MediaTrackReceiver(signaledTrackId, mediaStreamTrack);
          this._mediaTrackReceivers.forEach(function(trackReceiver) {
            if (trackReceiver.track.id === mediaTrackReceiver.track.id) {
              _this._mediaTrackReceivers.delete(trackReceiver);
            }
          });
          this._mediaTrackReceivers.add(mediaTrackReceiver);
          mediaStreamTrack.addEventListener("ended", function() {
            return _this._mediaTrackReceivers.delete(mediaTrackReceiver);
          });
          this.emit("trackAdded", mediaTrackReceiver);
        };
        PeerConnectionV22.prototype._initiateIceRestart = function() {
          if (this._peerConnection.signalingState === "closed") {
            return;
          }
          var log = this._log;
          log.warn("Attempting to restart ICE");
          this._didGenerateLocalCandidates = false;
          this._isIceRestartBackoffInProgress = false;
          this._shouldRestartIce = true;
          var _a2 = this._iceReconnectTimeout, delay = _a2.delay, isSet = _a2.isSet;
          if (!isSet) {
            log.debug("Starting ICE reconnect timeout: " + delay);
            this._iceReconnectTimeout.start();
          }
          this.offer().catch(function(ex) {
            log.error("offer failed in _initiateIceRestart with: " + ex.message);
          });
        };
        PeerConnectionV22.prototype._initiateIceRestartBackoff = function() {
          var _this = this;
          if (this._peerConnection.signalingState === "closed" || this._isIceRestartBackoffInProgress) {
            return;
          }
          this._log.warn("An ICE restart has been scheduled");
          this._isIceRestartBackoffInProgress = true;
          this._iceRestartBackoff.backoff(function() {
            return _this._initiateIceRestart();
          });
        };
        PeerConnectionV22.prototype._maybeReoffer = function(localDescription) {
          var shouldReoffer = this._shouldOffer;
          if (localDescription && localDescription.sdp) {
            var senders_1 = this._peerConnection.getSenders().filter(function(sender) {
              return sender.track;
            });
            shouldReoffer = ["audio", "video"].reduce(function(shouldOffer, kind) {
              var mediaSections = getMediaSections(localDescription.sdp, kind, "(sendrecv|sendonly)");
              var sendersOfKind = senders_1.filter(isSenderOfKind.bind(null, kind));
              return shouldOffer || mediaSections.length < sendersOfKind.length;
            }, shouldReoffer);
            var hasDataTrack = this._dataChannels.size > 0;
            var hasApplicationMediaSection = getMediaSections(localDescription.sdp, "application").length > 0;
            var needsApplicationMediaSection = hasDataTrack && !hasApplicationMediaSection;
            shouldReoffer = shouldReoffer || needsApplicationMediaSection;
          }
          var promise = shouldReoffer ? this._offer() : Promise.resolve();
          return promise.then(function() {
            return shouldReoffer;
          });
        };
        PeerConnectionV22.prototype._offer = function() {
          var _this = this;
          var offerOptions = Object.assign({}, this._offerOptions);
          this._needsAnswer = true;
          if (this._shouldRestartIce) {
            this._shouldRestartIce = false;
            this._isRestartingIce = true;
            offerOptions.iceRestart = true;
          }
          return Promise.all(this._replaceTrackPromises.values()).then(function() {
            return _this._peerConnection.createOffer(offerOptions);
          }).catch(function(error) {
            var errorToThrow = new MediaClientLocalDescFailedError();
            _this._publishMediaWarning({
              message: "Failed to create offer",
              code: errorToThrow.code,
              error
            });
            throw errorToThrow;
          }).then(function(offer) {
            if (isFirefox) {
              offer = new _this._RTCSessionDescription({
                sdp: disableRtx(offer.sdp),
                type: offer.type
              });
            } else {
              offer = workaroundIssue8329(offer);
            }
            var sdp = removeSSRCAttributes(offer.sdp, ["mslabel", "label"]);
            sdp = _this._peerConnection.remoteDescription ? filterLocalCodecs(sdp, _this._peerConnection.remoteDescription.sdp) : sdp;
            var updatedSdp = _this._setCodecPreferences(sdp, _this._preferredAudioCodecs, _this._preferredVideoCodecs);
            _this._shouldOffer = false;
            if (!_this._negotiationRole) {
              _this._negotiationRole = "offerer";
            }
            if (_this._shouldApplySimulcast) {
              _this._localDescriptionWithoutSimulcast = {
                type: "offer",
                sdp: updatedSdp
              };
              updatedSdp = _this._setSimulcast(updatedSdp, _this._trackIdsToAttributes);
            }
            return _this._setLocalDescription({
              type: "offer",
              sdp: updatedSdp
            });
          });
        };
        PeerConnectionV22.prototype._getMediaTrackSenderId = function(trackId) {
          var mediaTrackSender = Array.from(this._rtpSenders.keys()).find(function(_a2) {
            var id = _a2.track.id;
            return id === trackId;
          });
          return mediaTrackSender ? mediaTrackSender.id : trackId;
        };
        PeerConnectionV22.prototype._addOrRewriteLocalTrackIds = function(description) {
          var _this = this;
          var transceivers = this._peerConnection.getTransceivers();
          var activeTransceivers = transceivers.filter(function(_a2) {
            var sender = _a2.sender, stopped = _a2.stopped;
            return !stopped && sender && sender.track;
          });
          var assignedTransceivers = activeTransceivers.filter(function(_a2) {
            var mid = _a2.mid;
            return mid;
          });
          var midsToTrackIds = new Map(assignedTransceivers.map(function(_a2) {
            var mid = _a2.mid, sender = _a2.sender;
            return [mid, _this._getMediaTrackSenderId(sender.track.id)];
          }));
          var sdp1 = addOrRewriteTrackIds(description.sdp, midsToTrackIds);
          var unassignedTransceivers = activeTransceivers.filter(function(_a2) {
            var mid = _a2.mid;
            return !mid;
          });
          var newTrackIdsByKind = new Map(["audio", "video"].map(function(kind) {
            return [
              kind,
              unassignedTransceivers.filter(function(_a2) {
                var sender = _a2.sender;
                return sender.track.kind === kind;
              }).map(function(_a2) {
                var sender = _a2.sender;
                return _this._getMediaTrackSenderId(sender.track.id);
              })
            ];
          }));
          var sdp2 = addOrRewriteNewTrackIds(sdp1, midsToTrackIds, newTrackIdsByKind);
          return new this._RTCSessionDescription({
            sdp: sdp2,
            type: description.type
          });
        };
        PeerConnectionV22.prototype._rollbackAndApplyOffer = function(offer) {
          var _this = this;
          return this._setLocalDescription({ type: "rollback" }).then(function() {
            return _this._setLocalDescription(offer);
          });
        };
        PeerConnectionV22.prototype._setLocalDescription = function(description) {
          var _this = this;
          if (description.type !== "rollback" && this._shouldApplyDtx) {
            description = new this._RTCSessionDescription({
              sdp: enableDtxForOpus(description.sdp),
              type: description.type
            });
          }
          return this._peerConnection.setLocalDescription(description).catch(function(error) {
            _this._log.warn('Calling setLocalDescription with an RTCSessionDescription of type "' + description.type + '" failed with the error "' + error.message + '".', error);
            var errorToThrow = new MediaClientLocalDescFailedError();
            var publishWarning = {
              message: 'Calling setLocalDescription with an RTCSessionDescription of type "' + description.type + '" failed',
              code: errorToThrow.code,
              error
            };
            if (description.sdp) {
              _this._log.warn("The SDP was " + description.sdp);
              publishWarning.sdp = description.sdp;
            }
            _this._publishMediaWarning(publishWarning);
            throw errorToThrow;
          }).then(function() {
            if (description.type !== "rollback") {
              _this._localDescription = _this._addOrRewriteLocalTrackIds(description);
              if (_this._shouldApplyDtx) {
                _this._localDescription = new _this._RTCSessionDescription({
                  sdp: enableDtxForOpus(_this._localDescription.sdp, []),
                  type: _this._localDescription.type
                });
              }
              _this._localCandidates = [];
              if (description.type === "offer") {
                _this._descriptionRevision++;
              } else if (description.type === "answer") {
                _this._lastStableDescriptionRevision = _this._descriptionRevision;
                negotiationCompleted(_this);
              }
              _this._localUfrag = getUfrag(description);
              _this.emit("description", _this.getState());
            }
          });
        };
        PeerConnectionV22.prototype._setRemoteDescription = function(description) {
          var _this = this;
          if (description.sdp) {
            description.sdp = this._setCodecPreferences(description.sdp, this._preferredAudioCodecs, this._preferredVideoCodecs);
            if (this._shouldApplyDtx) {
              description.sdp = enableDtxForOpus(description.sdp);
            } else {
              description.sdp = enableDtxForOpus(description.sdp, []);
            }
            if (isFirefox) {
              description.sdp = filterOutMediaStreamIds(description.sdp);
            }
            if (!this._peerConnection.remoteDescription) {
              this._isIceLite = /a=ice-lite/.test(description.sdp);
            }
          }
          description = new this._RTCSessionDescription(description);
          return Promise.resolve().then(function() {
            if (description.type === "answer" && _this._localDescriptionWithoutSimulcast) {
              var adaptiveSimulcastEntry = _this._preferredVideoCodecs.find(function(cs) {
                return "adaptiveSimulcast" in cs;
              });
              var revertForAll = !!adaptiveSimulcastEntry && adaptiveSimulcastEntry.adaptiveSimulcast === false;
              var sdpWithoutSimulcastForNonVP8MediaSections = _this._revertSimulcast(_this._localDescription.sdp, _this._localDescriptionWithoutSimulcast.sdp, description.sdp, revertForAll);
              _this._localDescriptionWithoutSimulcast = null;
              if (sdpWithoutSimulcastForNonVP8MediaSections !== _this._localDescription.sdp) {
                return _this._rollbackAndApplyOffer({
                  type: _this._localDescription.type,
                  sdp: sdpWithoutSimulcastForNonVP8MediaSections
                });
              }
            }
          }).then(function() {
            return _this._peerConnection.setRemoteDescription(description);
          }).then(function() {
            if (description.type === "answer") {
              if (_this._isRestartingIce) {
                _this._log.debug("An ICE restart was in-progress and is now completed");
                _this._isRestartingIce = false;
              }
              negotiationCompleted(_this);
            }
          }, function(error) {
            _this._log.warn('Calling setRemoteDescription with an RTCSessionDescription of type "' + description.type + '" failed with the error "' + error.message + '".', error);
            if (description.sdp) {
              _this._log.warn("The SDP was " + description.sdp);
            }
            throw error;
          });
        };
        PeerConnectionV22.prototype._updateDescription = function(description) {
          var _this = this;
          switch (description.type) {
            case "answer":
            case "pranswer":
              if (description.revision !== this._descriptionRevision || this._peerConnection.signalingState !== "have-local-offer") {
                return Promise.resolve();
              }
              this._descriptionRevision = description.revision;
              break;
            case "close":
              return this._close();
            case "create-offer":
              if (description.revision <= this._lastStableDescriptionRevision) {
                return Promise.resolve();
              } else if (this._needsAnswer) {
                this._queuedDescription = description;
                return Promise.resolve();
              }
              this._descriptionRevision = description.revision;
              return this._offer();
            case "offer":
              if (description.revision <= this._lastStableDescriptionRevision || this._peerConnection.signalingState === "closed") {
                return Promise.resolve();
              }
              if (this._peerConnection.signalingState === "have-local-offer") {
                if (this._needsAnswer && this._lastStableDescriptionRevision === 0) {
                  this._queuedDescription = description;
                  return Promise.resolve();
                }
                this._descriptionRevision = description.revision;
                return this._handleGlare(description);
              }
              this._descriptionRevision = description.revision;
              return this._answer(description).then(function() {
              });
            default:
          }
          var revision = description.revision;
          return Promise.resolve().then(function() {
            return _this._setRemoteDescription(description);
          }).catch(function(error) {
            var errorToThrow = new MediaClientRemoteDescFailedError();
            _this._publishMediaWarning({
              message: 'Calling setRemoteDescription with an RTCSessionDescription of type "' + description.type + '" failed',
              code: errorToThrow.code,
              error,
              sdp: description.sdp
            });
            throw errorToThrow;
          }).then(function() {
            _this._lastStableDescriptionRevision = revision;
            _this._needsAnswer = false;
            return _this._checkIceBox(description);
          }).then(function() {
            return _this._queuedDescription && _this._updateDescription(_this._queuedDescription);
          }).then(function() {
            _this._queuedDescription = null;
            return _this._maybeReoffer(_this._peerConnection.localDescription).then(function() {
            });
          });
        };
        PeerConnectionV22.prototype._updateIce = function(iceState) {
          var candidates = this._remoteCandidates.update(iceState);
          return this._addIceCandidates(candidates);
        };
        PeerConnectionV22.prototype.addDataTrackSender = function(dataTrackSender) {
          if (this._dataChannels.has(dataTrackSender)) {
            return;
          }
          try {
            var dataChannelDict = {
              ordered: dataTrackSender.ordered
            };
            if (dataTrackSender.maxPacketLifeTime !== null) {
              dataChannelDict.maxPacketLifeTime = dataTrackSender.maxPacketLifeTime;
            }
            if (dataTrackSender.maxRetransmits !== null) {
              dataChannelDict.maxRetransmits = dataTrackSender.maxRetransmits;
            }
            var dataChannel = this._peerConnection.createDataChannel(dataTrackSender.id, dataChannelDict);
            dataTrackSender.addDataChannel(dataChannel);
            this._dataChannels.set(dataTrackSender, dataChannel);
          } catch (error) {
            this._log.warn('Error creating an RTCDataChannel for DataTrack "' + dataTrackSender.id + '": ' + error.message);
          }
        };
        PeerConnectionV22.prototype._handleQueuedPublisherHints = function() {
          var _this = this;
          if (this._peerConnection.signalingState === "stable") {
            this._mediaTrackSenderToPublisherHints.forEach(function(_a2, mediaTrackSender) {
              var deferred = _a2.deferred, encodings = _a2.encodings;
              _this._mediaTrackSenderToPublisherHints.delete(mediaTrackSender);
              _this._setPublisherHint(mediaTrackSender, encodings).then(function(result) {
                return deferred.resolve(result);
              }).catch(function(error) {
                return deferred.reject(error);
              });
            });
          }
        };
        PeerConnectionV22.prototype._setPublisherHint = function(mediaTrackSender, encodings) {
          var _this = this;
          if (isFirefox) {
            return Promise.resolve("COULD_NOT_APPLY_HINT");
          }
          if (this._mediaTrackSenderToPublisherHints.has(mediaTrackSender)) {
            var queuedHint = this._mediaTrackSenderToPublisherHints.get(mediaTrackSender);
            queuedHint.deferred.resolve("REQUEST_SKIPPED");
            this._mediaTrackSenderToPublisherHints.delete(mediaTrackSender);
          }
          var sender = this._rtpSenders.get(mediaTrackSender);
          if (!sender) {
            this._log.warn("Could not apply publisher hint because RTCRtpSender was not found");
            return Promise.resolve("UNKNOWN_TRACK");
          }
          if (this._peerConnection.signalingState === "closed") {
            this._log.warn('Could not apply publisher hint because signalingState was "closed"');
            return Promise.resolve("COULD_NOT_APPLY_HINT");
          }
          if (this._peerConnection.signalingState !== "stable") {
            this._log.debug("Queuing up publisher hint because signalingState:", this._peerConnection.signalingState);
            var deferred = defer();
            this._mediaTrackSenderToPublisherHints.set(mediaTrackSender, { deferred, encodings });
            return deferred.promise;
          }
          var parameters = sender.getParameters();
          if (encodings !== null) {
            encodings.forEach(function(_a2) {
              var enabled = _a2.enabled, layerIndex = _a2.layer_index;
              if (parameters.encodings.length > layerIndex) {
                _this._log.debug("layer:" + layerIndex + ", active:" + parameters.encodings[layerIndex].active + " => " + enabled);
                parameters.encodings[layerIndex].active = enabled;
              } else {
                _this._log.warn("invalid layer:" + layerIndex + ", active:" + enabled);
              }
            });
          }
          this._maybeUpdateEncodings(
            sender.track,
            parameters.encodings,
            encodings === null
            /* trackReplaced */
          );
          return sender.setParameters(parameters).then(function() {
            return "OK";
          }).catch(function(error) {
            _this._log.error("Failed to apply publisher hints:", error);
            return "COULD_NOT_APPLY_HINT";
          });
        };
        PeerConnectionV22.prototype.addMediaTrackSender = function(mediaTrackSender) {
          var _this = this;
          if (this._peerConnection.signalingState === "closed" || this._rtpSenders.has(mediaTrackSender)) {
            return;
          }
          var transceiver = this._addOrUpdateTransceiver(mediaTrackSender.track);
          var sender = transceiver.sender;
          mediaTrackSender.addSender(sender, function(encodings) {
            return _this._setPublisherHint(mediaTrackSender, encodings);
          });
          this._rtpNewSenders.add(sender);
          this._rtpSenders.set(mediaTrackSender, sender);
        };
        PeerConnectionV22.prototype.close = function() {
          if (this._close()) {
            this._descriptionRevision++;
            this._localDescription = { type: "close" };
            this.emit("description", this.getState());
          }
        };
        PeerConnectionV22.prototype.getTrackReceivers = function() {
          return Array.from(this._dataTrackReceivers).concat(Array.from(this._mediaTrackReceivers));
        };
        PeerConnectionV22.prototype.getState = function() {
          if (!this._localDescription) {
            return null;
          }
          var localDescriptionRevision = this._localDescription.type === "answer" ? this._lastStableDescriptionRevision : this._descriptionRevision;
          var localDescription = {
            type: this._localDescription.type,
            revision: localDescriptionRevision
          };
          if (this._localDescription.sdp) {
            localDescription.sdp = this._localDescription.sdp;
          }
          return {
            description: localDescription,
            id: this.id
          };
        };
        PeerConnectionV22.prototype.offer = function() {
          var _this = this;
          if (this._needsAnswer || this._isRestartingIce) {
            this._shouldOffer = true;
            return Promise.resolve();
          }
          return this.bracket("offering", function(key) {
            _this.transition("updating", key);
            var promise = _this._needsAnswer || _this._isRestartingIce ? Promise.resolve() : _this._offer();
            return promise.then(function() {
              _this.tryTransition("open", key);
            }, function(error) {
              _this.tryTransition("open", key);
              throw error;
            });
          });
        };
        PeerConnectionV22.prototype.removeDataTrackSender = function(dataTrackSender) {
          var dataChannel = this._dataChannels.get(dataTrackSender);
          if (dataChannel) {
            dataTrackSender.removeDataChannel(dataChannel);
            this._dataChannels.delete(dataTrackSender);
            dataChannel.close();
          }
        };
        PeerConnectionV22.prototype.removeMediaTrackSender = function(mediaTrackSender) {
          var sender = this._rtpSenders.get(mediaTrackSender);
          if (!sender) {
            return;
          }
          if (this._peerConnection.signalingState !== "closed") {
            this._peerConnection.removeTrack(sender);
          }
          mediaTrackSender.removeSender(sender);
          if (this._mediaTrackSenderToPublisherHints.has(mediaTrackSender)) {
            var queuedHint = this._mediaTrackSenderToPublisherHints.get(mediaTrackSender);
            queuedHint.deferred.resolve("UNKNOWN_TRACK");
            this._mediaTrackSenderToPublisherHints.delete(mediaTrackSender);
          }
          this._rtpNewSenders.delete(sender);
          this._rtpSenders.delete(mediaTrackSender);
        };
        PeerConnectionV22.prototype.setConfiguration = function(configuration) {
          if (typeof this._peerConnection.setConfiguration === "function") {
            this._peerConnection.setConfiguration(getConfiguration(configuration));
          }
        };
        PeerConnectionV22.prototype.setIceReconnectTimeout = function(period) {
          this._iceReconnectTimeout.setDelay(period);
          this._log.debug("Updated ICE reconnection timeout period:", this._iceReconnectTimeout.delay);
          return this;
        };
        PeerConnectionV22.prototype.update = function(peerConnectionState) {
          var _this = this;
          return this.bracket("updating", function(key) {
            if (_this.state === "closed") {
              return Promise.resolve();
            }
            _this.transition("updating", key);
            var updates = [];
            if (peerConnectionState.ice) {
              updates.push(_this._updateIce(peerConnectionState.ice));
            }
            if (peerConnectionState.description) {
              updates.push(_this._updateDescription(peerConnectionState.description));
            }
            return Promise.all(updates).then(function() {
              _this.tryTransition("open", key);
            }, function(error) {
              _this.tryTransition("open", key);
              throw error;
            });
          });
        };
        PeerConnectionV22.prototype.getStats = function() {
          var _this = this;
          return getStatistics(this._peerConnection).then(function(response) {
            return rewriteTrackIds(_this, response);
          });
        };
        return PeerConnectionV22;
      }(StateMachine)
    );
    function rewriteLocalTrackId(pcv2, stats) {
      var trackId = pcv2._getMediaTrackSenderId(stats.trackId);
      return Object.assign(stats, { trackId });
    }
    function rewriteTrackId(pcv2, stats) {
      var receiver = __spreadArray([], __read(pcv2._mediaTrackReceivers)).find(function(receiver2) {
        return receiver2.track.id === stats.trackId;
      });
      var trackId = receiver ? receiver.id : null;
      return Object.assign(stats, { trackId });
    }
    function rewriteTrackIds(pcv2, response) {
      return Object.assign(response, {
        remoteAudioTrackStats: response.remoteAudioTrackStats.map(function(stats) {
          return rewriteTrackId(pcv2, stats);
        }),
        remoteVideoTrackStats: response.remoteVideoTrackStats.map(function(stats) {
          return rewriteTrackId(pcv2, stats);
        }),
        localAudioTrackStats: response.localAudioTrackStats.map(function(stats) {
          return rewriteLocalTrackId(pcv2, stats);
        }),
        localVideoTrackStats: response.localVideoTrackStats.map(function(stats) {
          return rewriteLocalTrackId(pcv2, stats);
        })
      });
    }
    function getUfrag(description) {
      if (description.sdp) {
        var match = description.sdp.match(/^a=ice-ufrag:([a-zA-Z0-9+/]+)/m);
        if (match) {
          return match[1];
        }
      }
      return null;
    }
    function getConfiguration(configuration) {
      return Object.assign({
        bundlePolicy: "max-bundle",
        rtcpMuxPolicy: "require"
      }, configuration);
    }
    function isSenderOfKind(kind, sender) {
      var track = sender.track;
      return track && track.kind === kind && track.readyState !== "ended";
    }
    function filterOutMediaStreamIds(sdp) {
      return sdp.replace(/a=msid:[^ ]+ /g, "a=msid:- ");
    }
    function shouldRecycleTransceiver(transceiver, pcv2) {
      return !transceiver.stopped && !pcv2._replaceTrackPromises.has(transceiver) && ["inactive", "recvonly"].includes(transceiver.direction);
    }
    function takeRecycledTransceiver(pcv2, kind) {
      var preferredCodecs = {
        audio: pcv2._preferredAudioCodecs.map(function(_a2) {
          var codec = _a2.codec;
          return codec.toLowerCase();
        }),
        video: pcv2._preferredVideoCodecs.map(function(_a2) {
          var codec = _a2.codec;
          return codec.toLowerCase();
        })
      }[kind];
      var recycledTransceivers = pcv2._recycledTransceivers[kind];
      var localCodec = preferredCodecs.find(function(codec) {
        return pcv2._localCodecs.has(codec);
      });
      if (!localCodec) {
        return recycledTransceivers.shift();
      }
      var transceiver = recycledTransceivers.find(function(transceiver2) {
        var remoteCodecMap = pcv2._remoteCodecMaps.get(transceiver2.mid);
        return remoteCodecMap && remoteCodecMap.has(localCodec);
      });
      if (transceiver) {
        recycledTransceivers.splice(recycledTransceivers.indexOf(transceiver), 1);
      }
      return transceiver;
    }
    function updateLocalCodecs(pcv2) {
      var description = pcv2._peerConnection.localDescription;
      if (!description || !description.sdp) {
        return;
      }
      getMediaSections(description.sdp).forEach(function(section) {
        var codecMap = createCodecMapForMediaSection(section);
        codecMap.forEach(function(pts, codec) {
          return pcv2._localCodecs.add(codec);
        });
      });
    }
    function updateRemoteCodecMaps(pcv2) {
      var description = pcv2._peerConnection.remoteDescription;
      if (!description || !description.sdp) {
        return;
      }
      getMediaSections(description.sdp).forEach(function(section) {
        var matched = section.match(/^a=mid:(.+)$/m);
        if (!matched || !matched[1]) {
          return;
        }
        var mid = matched[1];
        var codecMap = createCodecMapForMediaSection(section);
        pcv2._remoteCodecMaps.set(mid, codecMap);
      });
    }
    function updateRecycledTransceivers(pcv2) {
      pcv2._recycledTransceivers.audio = [];
      pcv2._recycledTransceivers.video = [];
      pcv2._peerConnection.getTransceivers().forEach(function(transceiver) {
        if (shouldRecycleTransceiver(transceiver, pcv2)) {
          var track = transceiver.receiver.track;
          pcv2._recycledTransceivers[track.kind].push(transceiver);
        }
      });
    }
    function negotiationCompleted(pcv2) {
      updateRecycledTransceivers(pcv2);
      updateLocalCodecs(pcv2);
      updateRemoteCodecMaps(pcv2);
      updateEncodingParameters(pcv2).then(function() {
        pcv2._handleQueuedPublisherHints();
      });
    }
    function updateEncodingParameters(pcv2) {
      var _a2 = pcv2._encodingParameters, maxAudioBitrate = _a2.maxAudioBitrate, maxVideoBitrate = _a2.maxVideoBitrate;
      var maxBitrates = /* @__PURE__ */ new Map([
        ["audio", maxAudioBitrate],
        ["video", maxVideoBitrate]
      ]);
      var promises = [];
      pcv2._peerConnection.getSenders().filter(function(sender) {
        return sender.track;
      }).forEach(function(sender) {
        var maxBitrate = maxBitrates.get(sender.track.kind);
        var params = sender.getParameters();
        if (maxBitrate === null || maxBitrate === 0) {
          removeMaxBitrate(params);
        } else if (pcv2._isChromeScreenShareTrack(sender.track)) {
          pcv2._log.warn("Not setting maxBitrate for " + sender.track.kind + " Track " + sender.track.id + " because it appears to be screen share track: " + sender.track.label);
        } else {
          setMaxBitrate(params, maxBitrate);
        }
        if (!isFirefox && params.encodings.length > 0) {
          if (sender.track.kind === "audio") {
            params.encodings[0].priority = "high";
          } else if (pcv2._isChromeScreenShareTrack(sender.track)) {
            params.encodings[0].priority = "medium";
          }
          if (pcv2._enableDscp) {
            params.encodings[0].networkPriority = "high";
          }
        }
        var trackReplaced = pcv2._rtpNewSenders.has(sender);
        pcv2._maybeUpdateEncodings(sender.track, params.encodings, trackReplaced);
        pcv2._rtpNewSenders.delete(sender);
        var promise = sender.setParameters(params).catch(function(error) {
          pcv2._log.warn("Error while setting encodings parameters for " + sender.track.kind + " Track " + sender.track.id + ": " + (error.message || error.name));
        });
        promises.push(promise);
      });
      return Promise.all(promises);
    }
    function removeMaxBitrate(params) {
      if (Array.isArray(params.encodings)) {
        params.encodings.forEach(function(encoding) {
          return delete encoding.maxBitrate;
        });
      }
    }
    function setMaxBitrate(params, maxBitrate) {
      if (isFirefox) {
        params.encodings = [{ maxBitrate }];
      } else {
        params.encodings.forEach(function(encoding) {
          encoding.maxBitrate = maxBitrate;
        });
      }
    }
    module.exports = PeerConnectionV2;
  }
});

// node_modules/twilio-video/es5/signaling/v2/peerconnectionmanager.js
var require_peerconnectionmanager = __commonJS({
  "node_modules/twilio-video/es5/signaling/v2/peerconnectionmanager.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var guessBrowser = require_util().guessBrowser;
    var PeerConnectionV2 = require_peerconnection();
    var MediaTrackSender = require_sender();
    var QueueingEventEmitter = require_queueingeventemitter();
    var util = require_util2();
    var MediaConnectionError = require_twilio_video_errors().MediaConnectionError;
    var isFirefox = guessBrowser() === "firefox";
    var PeerConnectionManager = (
      /** @class */
      function(_super) {
        __extends(PeerConnectionManager2, _super);
        function PeerConnectionManager2(encodingParameters, preferredCodecs, options) {
          var _this = _super.call(this) || this;
          options = Object.assign({
            audioContextFactory: isFirefox ? require_audiocontext() : null,
            PeerConnectionV2
          }, options);
          var audioContext = options.audioContextFactory ? options.audioContextFactory.getOrCreate(_this) : null;
          var offerOptions = audioContext ? { offerToReceiveVideo: true } : { offerToReceiveAudio: true, offerToReceiveVideo: true };
          Object.defineProperties(_this, {
            _audioContextFactory: {
              value: options.audioContextFactory
            },
            _closedPeerConnectionIds: {
              value: /* @__PURE__ */ new Set()
            },
            _configuration: {
              writable: true,
              value: null
            },
            _configurationDeferred: {
              writable: true,
              value: util.defer()
            },
            _connectionState: {
              value: "new",
              writable: true
            },
            _dummyAudioTrackSender: {
              value: audioContext ? new MediaTrackSender(createDummyAudioMediaStreamTrack(audioContext)) : null
            },
            _encodingParameters: {
              value: encodingParameters
            },
            _iceConnectionState: {
              writable: true,
              value: "new"
            },
            _dataTrackSenders: {
              writable: true,
              value: /* @__PURE__ */ new Set()
            },
            _lastConnectionState: {
              value: "new",
              writable: true
            },
            _lastIceConnectionState: {
              writable: true,
              value: "new"
            },
            _mediaTrackSenders: {
              writable: true,
              value: /* @__PURE__ */ new Set()
            },
            _offerOptions: {
              value: offerOptions
            },
            _peerConnections: {
              value: /* @__PURE__ */ new Map()
            },
            _preferredCodecs: {
              value: preferredCodecs
            },
            _sessionTimeout: {
              value: null,
              writable: true
            },
            _PeerConnectionV2: {
              value: options.PeerConnectionV2
            }
          });
          return _this;
        }
        PeerConnectionManager2.prototype.setEffectiveAdaptiveSimulcast = function(effectiveAdaptiveSimulcast) {
          this._peerConnections.forEach(function(pc) {
            return pc.setEffectiveAdaptiveSimulcast(effectiveAdaptiveSimulcast);
          });
          this._preferredCodecs.video.forEach(function(cs) {
            if ("adaptiveSimulcast" in cs) {
              cs.adaptiveSimulcast = effectiveAdaptiveSimulcast;
            }
          });
        };
        Object.defineProperty(PeerConnectionManager2.prototype, "connectionState", {
          /**
           * A summarized RTCPeerConnectionState across all the
           * {@link PeerConnectionManager}'s underlying {@link PeerConnectionV2}s.
           * @property {RTCPeerConnectionState}
           */
          get: function() {
            return this._connectionState;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(PeerConnectionManager2.prototype, "iceConnectionState", {
          /**
           * A summarized RTCIceConnectionState across all the
           * {@link PeerConnectionManager}'s underlying {@link PeerConnectionV2}s.
           * @property {RTCIceConnectionState}
           */
          get: function() {
            return this._iceConnectionState;
          },
          enumerable: false,
          configurable: true
        });
        PeerConnectionManager2.prototype._closeAbsentPeerConnections = function(peerConnectionStates) {
          var peerConnectionIds = new Set(peerConnectionStates.map(function(peerConnectionState) {
            return peerConnectionState.id;
          }));
          this._peerConnections.forEach(function(peerConnection) {
            if (!peerConnectionIds.has(peerConnection.id)) {
              peerConnection._close();
            }
          });
          return this;
        };
        PeerConnectionManager2.prototype._getConfiguration = function() {
          return this._configurationDeferred.promise;
        };
        PeerConnectionManager2.prototype._getOrCreate = function(id, configuration) {
          var _this = this;
          var self = this;
          var peerConnection = this._peerConnections.get(id);
          if (!peerConnection) {
            var PeerConnectionV2_1 = this._PeerConnectionV2;
            var options = Object.assign({
              dummyAudioMediaStreamTrack: this._dummyAudioTrackSender ? this._dummyAudioTrackSender.track : null,
              offerOptions: this._offerOptions
            }, this._sessionTimeout ? {
              sessionTimeout: this._sessionTimeout
            } : {}, configuration);
            try {
              peerConnection = new PeerConnectionV2_1(id, this._encodingParameters, this._preferredCodecs, options);
            } catch (e) {
              throw new MediaConnectionError();
            }
            this._peerConnections.set(peerConnection.id, peerConnection);
            peerConnection.on("candidates", this.queue.bind(this, "candidates"));
            peerConnection.on("description", this.queue.bind(this, "description"));
            peerConnection.on("trackAdded", this.queue.bind(this, "trackAdded"));
            peerConnection.on("stateChanged", function stateChanged(state) {
              if (state === "closed") {
                peerConnection.removeListener("stateChanged", stateChanged);
                self._dataTrackSenders.forEach(function(sender) {
                  return peerConnection.removeDataTrackSender(sender);
                });
                self._mediaTrackSenders.forEach(function(sender) {
                  return peerConnection.removeMediaTrackSender(sender);
                });
                self._peerConnections.delete(peerConnection.id);
                self._closedPeerConnectionIds.add(peerConnection.id);
                updateConnectionState(self);
                updateIceConnectionState(self);
              }
            });
            peerConnection.on("connectionStateChanged", function() {
              return updateConnectionState(_this);
            });
            peerConnection.on("iceConnectionStateChanged", function() {
              return updateIceConnectionState(_this);
            });
            this._dataTrackSenders.forEach(peerConnection.addDataTrackSender, peerConnection);
            this._mediaTrackSenders.forEach(peerConnection.addMediaTrackSender, peerConnection);
            updateIceConnectionState(this);
          }
          return peerConnection;
        };
        PeerConnectionManager2.prototype.close = function() {
          this._peerConnections.forEach(function(peerConnection) {
            peerConnection.close();
          });
          if (this._dummyAudioTrackSender) {
            this._dummyAudioTrackSender.stop();
          }
          if (this._audioContextFactory) {
            this._audioContextFactory.release(this);
          }
          updateIceConnectionState(this);
          return this;
        };
        PeerConnectionManager2.prototype.createAndOffer = function() {
          var _this = this;
          return this._getConfiguration().then(function(configuration) {
            var id;
            do {
              id = util.makeUUID();
            } while (_this._peerConnections.has(id));
            return _this._getOrCreate(id, configuration);
          }).then(function(peerConnection) {
            return peerConnection.offer();
          }).then(function() {
            return _this;
          });
        };
        PeerConnectionManager2.prototype.getTrackReceivers = function() {
          return util.flatMap(this._peerConnections, function(peerConnection) {
            return peerConnection.getTrackReceivers();
          });
        };
        PeerConnectionManager2.prototype.getStates = function() {
          var peerConnectionStates = [];
          this._peerConnections.forEach(function(peerConnection) {
            var peerConnectionState = peerConnection.getState();
            if (peerConnectionState) {
              peerConnectionStates.push(peerConnectionState);
            }
          });
          return peerConnectionStates;
        };
        PeerConnectionManager2.prototype.setConfiguration = function(configuration) {
          if (this._configuration) {
            this._configurationDeferred = util.defer();
            this._peerConnections.forEach(function(peerConnection) {
              peerConnection.setConfiguration(configuration);
            });
          }
          this._configuration = configuration;
          this._configurationDeferred.resolve(configuration);
          return this;
        };
        PeerConnectionManager2.prototype.setIceReconnectTimeout = function(period) {
          if (this._sessionTimeout === null) {
            this._peerConnections.forEach(function(peerConnection) {
              peerConnection.setIceReconnectTimeout(period);
            });
            this._sessionTimeout = period;
          }
          return this;
        };
        PeerConnectionManager2.prototype.setTrackSenders = function(trackSenders) {
          var dataTrackSenders = new Set(trackSenders.filter(function(trackSender) {
            return trackSender.kind === "data";
          }));
          var mediaTrackSenders = new Set(trackSenders.filter(function(trackSender) {
            return trackSender && (trackSender.kind === "audio" || trackSender.kind === "video");
          }));
          var changes = getTrackSenderChanges(this, dataTrackSenders, mediaTrackSenders);
          this._dataTrackSenders = dataTrackSenders;
          this._mediaTrackSenders = mediaTrackSenders;
          applyTrackSenderChanges(this, changes);
          return this;
        };
        PeerConnectionManager2.prototype.update = function(peerConnectionStates, synced) {
          var _this = this;
          if (synced === void 0) {
            synced = false;
          }
          if (synced) {
            this._closeAbsentPeerConnections(peerConnectionStates);
          }
          return this._getConfiguration().then(function(configuration) {
            return Promise.all(peerConnectionStates.map(function(peerConnectionState) {
              if (_this._closedPeerConnectionIds.has(peerConnectionState.id)) {
                return null;
              }
              var peerConnection = _this._getOrCreate(peerConnectionState.id, configuration);
              return peerConnection.update(peerConnectionState);
            }));
          }).then(function() {
            return _this;
          });
        };
        PeerConnectionManager2.prototype.getStats = function() {
          var peerConnections = Array.from(this._peerConnections.values());
          return Promise.all(peerConnections.map(function(peerConnection) {
            return peerConnection.getStats().then(function(response) {
              return [
                peerConnection.id,
                response
              ];
            });
          })).then(function(responses) {
            return new Map(responses);
          });
        };
        return PeerConnectionManager2;
      }(QueueingEventEmitter)
    );
    function createDummyAudioMediaStreamTrack(audioContext) {
      var mediaStreamDestination = audioContext.createMediaStreamDestination();
      return mediaStreamDestination.stream.getAudioTracks()[0];
    }
    function applyTrackSenderChanges(peerConnectionManager, changes) {
      if (changes.data.add.size || changes.data.remove.size || changes.media.add.size || changes.media.remove.size) {
        peerConnectionManager._peerConnections.forEach(function(peerConnection) {
          changes.data.remove.forEach(peerConnection.removeDataTrackSender, peerConnection);
          changes.media.remove.forEach(peerConnection.removeMediaTrackSender, peerConnection);
          changes.data.add.forEach(peerConnection.addDataTrackSender, peerConnection);
          changes.media.add.forEach(peerConnection.addMediaTrackSender, peerConnection);
          if (changes.media.add.size || changes.media.remove.size || changes.data.add.size && !peerConnection.isApplicationSectionNegotiated) {
            peerConnection.offer();
          }
        });
      }
    }
    function getDataTrackSenderChanges(peerConnectionManager, dataTrackSenders) {
      var dataTrackSendersToAdd = util.difference(dataTrackSenders, peerConnectionManager._dataTrackSenders);
      var dataTrackSendersToRemove = util.difference(peerConnectionManager._dataTrackSenders, dataTrackSenders);
      return {
        add: dataTrackSendersToAdd,
        remove: dataTrackSendersToRemove
      };
    }
    function getTrackSenderChanges(peerConnectionManager, dataTrackSenders, mediaTrackSenders) {
      return {
        data: getDataTrackSenderChanges(peerConnectionManager, dataTrackSenders),
        media: getMediaTrackSenderChanges(peerConnectionManager, mediaTrackSenders)
      };
    }
    function getMediaTrackSenderChanges(peerConnectionManager, mediaTrackSenders) {
      var mediaTrackSendersToAdd = util.difference(mediaTrackSenders, peerConnectionManager._mediaTrackSenders);
      var mediaTrackSendersToRemove = util.difference(peerConnectionManager._mediaTrackSenders, mediaTrackSenders);
      return {
        add: mediaTrackSendersToAdd,
        remove: mediaTrackSendersToRemove
      };
    }
    var toRank = {
      new: 0,
      checking: 1,
      connecting: 2,
      connected: 3,
      completed: 4,
      disconnected: -1,
      failed: -2,
      closed: -3
    };
    var fromRank;
    function createFromRank() {
      return Object.keys(toRank).reduce(function(fromRank2, state) {
        var _a;
        return Object.assign(fromRank2, (_a = {}, _a[toRank[state]] = state, _a));
      }, {});
    }
    function summarizeIceOrPeerConnectionStates(states) {
      if (!states.length) {
        return "new";
      }
      fromRank = fromRank || createFromRank();
      return states.reduce(function(state1, state2) {
        return fromRank[Math.max(toRank[state1], toRank[state2])];
      });
    }
    function updateIceConnectionState(pcm) {
      pcm._lastIceConnectionState = pcm.iceConnectionState;
      pcm._iceConnectionState = summarizeIceOrPeerConnectionStates(__spreadArray([], __read(pcm._peerConnections.values())).map(function(pcv2) {
        return pcv2.iceConnectionState;
      }));
      if (pcm.iceConnectionState !== pcm._lastIceConnectionState) {
        pcm.emit("iceConnectionStateChanged");
      }
    }
    function updateConnectionState(pcm) {
      pcm._lastConnectionState = pcm.connectionState;
      pcm._connectionState = summarizeIceOrPeerConnectionStates(__spreadArray([], __read(pcm._peerConnections.values())).map(function(pcv2) {
        return pcv2.connectionState;
      }));
      if (pcm.connectionState !== pcm._lastConnectionState) {
        pcm.emit("connectionStateChanged");
      }
    }
    module.exports = PeerConnectionManager;
  }
});

// node_modules/twilio-video/es5/signaling/v2/mediasignaling.js
var require_mediasignaling = __commonJS({
  "node_modules/twilio-video/es5/signaling/v2/mediasignaling.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var EventEmitter = require_events();
    var nInstances = 0;
    var MediaSignaling = (
      /** @class */
      function(_super) {
        __extends(MediaSignaling2, _super);
        function MediaSignaling2(getReceiver, channel, options) {
          var _this = _super.call(this) || this;
          Object.defineProperties(_this, {
            _instanceId: {
              value: nInstances++
            },
            channel: {
              value: channel
            },
            _log: {
              value: options.log.createLog("default", _this)
            },
            _getReceiver: {
              value: getReceiver
            },
            _receiverPromise: {
              value: null,
              writable: true
            },
            _transport: {
              value: null,
              writable: true
            }
          });
          return _this;
        }
        Object.defineProperty(MediaSignaling2.prototype, "isSetup", {
          get: function() {
            return !!this._receiverPromise;
          },
          enumerable: false,
          configurable: true
        });
        MediaSignaling2.prototype.toString = function() {
          return "[MediaSignaling #" + this._instanceId + ":" + this.channel + "]";
        };
        MediaSignaling2.prototype.setup = function(id) {
          var _this = this;
          this._teardown();
          this._log.info("setting up msp transport for id:", id);
          var receiverPromise = this._getReceiver(id).then(function(receiver) {
            if (receiver.kind !== "data") {
              _this._log.error("Expected a DataTrackReceiver");
            }
            if (_this._receiverPromise !== receiverPromise) {
              return;
            }
            try {
              _this._transport = receiver.toDataTransport();
              _this.emit("ready", _this._transport);
            } catch (ex) {
              _this._log.error("Failed to toDataTransport: " + ex.message);
            }
            receiver.once("close", function() {
              return _this._teardown();
            });
          });
          this._receiverPromise = receiverPromise;
        };
        MediaSignaling2.prototype._teardown = function() {
          if (this._transport) {
            this._log.info("Tearing down");
            this._transport = null;
            this._receiverPromise = null;
            this.emit("teardown");
          }
        };
        return MediaSignaling2;
      }(EventEmitter)
    );
    module.exports = MediaSignaling;
  }
});

// node_modules/twilio-video/es5/signaling/v2/dominantspeakersignaling.js
var require_dominantspeakersignaling = __commonJS({
  "node_modules/twilio-video/es5/signaling/v2/dominantspeakersignaling.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var MediaSignaling = require_mediasignaling();
    var DominantSpeakerSignaling = (
      /** @class */
      function(_super) {
        __extends(DominantSpeakerSignaling2, _super);
        function DominantSpeakerSignaling2(getReceiver, options) {
          var _this = _super.call(this, getReceiver, "active_speaker", options) || this;
          Object.defineProperties(_this, {
            _loudestParticipantSid: {
              value: null,
              writable: true
            }
          });
          _this.on("ready", function(transport) {
            transport.on("message", function(message) {
              switch (message.type) {
                case "active_speaker":
                  _this._setLoudestParticipantSid(message.participant);
                  break;
                default:
                  break;
              }
            });
          });
          return _this;
        }
        Object.defineProperty(DominantSpeakerSignaling2.prototype, "loudestParticipantSid", {
          /**
           * Get the loudest {@link Track.SID}, if known.
           * @returns {?Track.SID}
           */
          get: function() {
            return this._loudestParticipantSid;
          },
          enumerable: false,
          configurable: true
        });
        DominantSpeakerSignaling2.prototype._setLoudestParticipantSid = function(loudestParticipantSid) {
          if (this.loudestParticipantSid === loudestParticipantSid) {
            return;
          }
          this._loudestParticipantSid = loudestParticipantSid;
          this.emit("updated");
        };
        return DominantSpeakerSignaling2;
      }(MediaSignaling)
    );
    module.exports = DominantSpeakerSignaling;
  }
});

// node_modules/twilio-video/es5/stats/icereport.js
var require_icereport = __commonJS({
  "node_modules/twilio-video/es5/stats/icereport.js"(exports, module) {
    "use strict";
    var IceReport = (
      /** @class */
      function() {
        function IceReport2(send, recv, availableSend, rtt) {
          Object.defineProperties(this, {
            availableSend: {
              enumerable: true,
              value: availableSend
            },
            recv: {
              enumerable: true,
              value: recv
            },
            rtt: {
              enumerable: true,
              value: rtt
            },
            send: {
              enumerable: true,
              value: send
            }
          });
        }
        IceReport2.of = function(olderStats, newerStats) {
          var secondsElapsed = (newerStats.timestamp - olderStats.timestamp) / 1e3;
          var deltaBytesSent = newerStats.bytesSent - olderStats.bytesSent;
          var deltaBytesReceived = newerStats.bytesReceived - olderStats.bytesReceived;
          var send = secondsElapsed > 0 ? deltaBytesSent / secondsElapsed * 8 : 0;
          var recv = secondsElapsed > 0 ? deltaBytesReceived / secondsElapsed * 8 : 0;
          var availableSend = newerStats.availableOutgoingBitrate, rtt = newerStats.currentRoundTripTime;
          return new IceReport2(send, recv, availableSend, rtt);
        };
        return IceReport2;
      }()
    );
    module.exports = IceReport;
  }
});

// node_modules/twilio-video/es5/stats/icereportfactory.js
var require_icereportfactory = __commonJS({
  "node_modules/twilio-video/es5/stats/icereportfactory.js"(exports, module) {
    "use strict";
    var IceReport = require_icereport();
    var IceReportFactory = (
      /** @class */
      function() {
        function IceReportFactory2() {
          Object.defineProperties(this, {
            lastReport: {
              enumerable: true,
              value: new IceReport(0, 0),
              writable: true
            },
            lastStats: {
              enumerable: true,
              value: null,
              writable: true
            }
          });
        }
        IceReportFactory2.prototype.next = function(newerStats) {
          var olderStats = this.lastStats;
          this.lastStats = newerStats;
          if (olderStats) {
            var report = olderStats.id === newerStats.id ? IceReport.of(olderStats, newerStats) : new IceReport(0, 0);
            this.lastReport = report;
          }
          return this.lastReport;
        };
        return IceReportFactory2;
      }()
    );
    module.exports = IceReportFactory;
  }
});

// node_modules/twilio-video/es5/stats/average.js
var require_average = __commonJS({
  "node_modules/twilio-video/es5/stats/average.js"(exports, module) {
    "use strict";
    function average(xs) {
      xs = xs.filter(function(x) {
        return typeof x === "number";
      });
      return xs.length < 1 ? void 0 : xs.reduce(function(y, x) {
        return x + y;
      }) / xs.length;
    }
    module.exports = average;
  }
});

// node_modules/twilio-video/es5/stats/senderorreceiverreport.js
var require_senderorreceiverreport = __commonJS({
  "node_modules/twilio-video/es5/stats/senderorreceiverreport.js"(exports, module) {
    "use strict";
    var SenderOrReceiverReport = (
      /** @class */
      /* @__PURE__ */ function() {
        function SenderOrReceiverReport2(id, trackId, bitrate) {
          Object.defineProperties(this, {
            id: {
              enumerable: true,
              value: id
            },
            trackId: {
              enumerable: true,
              value: trackId
            },
            bitrate: {
              enumerable: true,
              value: bitrate
            }
          });
        }
        return SenderOrReceiverReport2;
      }()
    );
    module.exports = SenderOrReceiverReport;
  }
});

// node_modules/twilio-video/es5/stats/sum.js
var require_sum = __commonJS({
  "node_modules/twilio-video/es5/stats/sum.js"(exports, module) {
    "use strict";
    function sum(xs) {
      return xs.reduce(function(y, x) {
        return typeof x === "number" ? x + y : y;
      }, 0);
    }
    module.exports = sum;
  }
});

// node_modules/twilio-video/es5/stats/receiverreport.js
var require_receiverreport = __commonJS({
  "node_modules/twilio-video/es5/stats/receiverreport.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var average = require_average();
    var SenderOrReceiverReport = require_senderorreceiverreport();
    var sum = require_sum();
    var ReceiverReport = (
      /** @class */
      function(_super) {
        __extends(ReceiverReport2, _super);
        function ReceiverReport2(id, trackId, bitrate, deltaPacketsLost, deltaPacketsReceived, fractionLost, jitter) {
          var _this = _super.call(this, id, trackId, bitrate) || this;
          var phonyFractionLost = deltaPacketsReceived > 0 ? deltaPacketsLost / deltaPacketsReceived : 0;
          Object.defineProperties(_this, {
            deltaPacketsLost: {
              enumerable: true,
              value: deltaPacketsLost
            },
            deltaPacketsReceived: {
              enumerable: true,
              value: deltaPacketsReceived
            },
            fractionLost: {
              enumerable: true,
              value: fractionLost
            },
            jitter: {
              enumerable: true,
              value: jitter
            },
            phonyFractionLost: {
              enumerable: true,
              value: phonyFractionLost
            }
          });
          return _this;
        }
        ReceiverReport2.of = function(trackId, olderStats, newerStats) {
          if (olderStats.id !== newerStats.id) {
            throw new Error("RTCStats IDs must match");
          }
          var secondsElapsed = (newerStats.timestamp - olderStats.timestamp) / 1e3;
          var deltaBytesReceived = newerStats.bytesReceived - olderStats.bytesReceived;
          var bitrate = secondsElapsed > 0 ? deltaBytesReceived / secondsElapsed * 8 : 0;
          var deltaPacketsLost = Math.max(newerStats.packetsLost - olderStats.packetsLost, 0);
          var deltaPacketsReceived = newerStats.packetsReceived - olderStats.packetsReceived;
          var fractionLost = newerStats.fractionLost, jitter = newerStats.jitter;
          return new ReceiverReport2(olderStats.id, trackId, bitrate, deltaPacketsLost, deltaPacketsReceived, fractionLost, jitter);
        };
        ReceiverReport2.summarize = function(reports) {
          var summaries = reports.map(function(report) {
            return report.summarize();
          });
          var bitrate = sum(summaries.map(function(summary) {
            return summary.bitrate;
          }));
          var fractionLost = average(summaries.map(function(summary) {
            return summary.fractionLost;
          }));
          var jitter = average(summaries.map(function(summary) {
            return summary.jitter;
          }));
          return {
            bitrate,
            fractionLost,
            jitter
          };
        };
        ReceiverReport2.prototype.summarize = function() {
          return {
            bitrate: this.bitrate,
            fractionLost: typeof this.fractionLost === "number" ? this.fractionLost : this.phonyFractionLost,
            jitter: this.jitter
          };
        };
        return ReceiverReport2;
      }(SenderOrReceiverReport)
    );
    module.exports = ReceiverReport;
  }
});

// node_modules/twilio-video/es5/stats/senderreport.js
var require_senderreport = __commonJS({
  "node_modules/twilio-video/es5/stats/senderreport.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var average = require_average();
    var SenderOrReceiverReport = require_senderorreceiverreport();
    var sum = require_sum();
    var SenderReport = (
      /** @class */
      function(_super) {
        __extends(SenderReport2, _super);
        function SenderReport2(id, trackId, bitrate, rtt) {
          var _this = _super.call(this, id, trackId, bitrate) || this;
          Object.defineProperties(_this, {
            rtt: {
              enumerable: true,
              value: rtt
            }
          });
          return _this;
        }
        SenderReport2.of = function(trackId, olderStats, newerStats, newerRemoteStats) {
          if (olderStats.id !== newerStats.id) {
            throw new Error("RTCStats IDs must match");
          }
          var secondsElapsed = (newerStats.timestamp - olderStats.timestamp) / 1e3;
          var deltaBytesSent = newerStats.bytesSent - olderStats.bytesSent;
          var bitrate = secondsElapsed > 0 ? deltaBytesSent / secondsElapsed * 8 : 0;
          var rtt = newerRemoteStats && typeof newerRemoteStats.roundTripTime === "number" ? newerRemoteStats.roundTripTime / 1e3 : void 0;
          return new SenderReport2(olderStats.id, trackId, bitrate, rtt);
        };
        SenderReport2.summarize = function(reports) {
          var bitrate = sum(reports.map(function(report) {
            return report.bitrate;
          }));
          var rtt = average(reports.map(function(report) {
            return report.rtt;
          }));
          return {
            bitrate,
            rtt
          };
        };
        return SenderReport2;
      }(SenderOrReceiverReport)
    );
    module.exports = SenderReport;
  }
});

// node_modules/twilio-video/es5/stats/peerconnectionreport.js
var require_peerconnectionreport = __commonJS({
  "node_modules/twilio-video/es5/stats/peerconnectionreport.js"(exports, module) {
    "use strict";
    var ReceiverReport = require_receiverreport();
    var SenderReport = require_senderreport();
    var PeerConnectionReport = (
      /** @class */
      function() {
        function PeerConnectionReport2(ice, audio, video) {
          Object.defineProperties(this, {
            ice: {
              enumerable: true,
              value: ice
            },
            audio: {
              enumerable: true,
              value: audio
            },
            video: {
              enumerable: true,
              value: video
            }
          });
        }
        PeerConnectionReport2.prototype.summarize = function() {
          var senderReports = this.audio.send.concat(this.video.send);
          var send = SenderReport.summarize(senderReports);
          var receiverReports = this.audio.recv.concat(this.video.recv);
          var recv = ReceiverReport.summarize(receiverReports);
          return {
            ice: this.ice,
            send,
            recv,
            audio: {
              send: SenderReport.summarize(this.audio.send),
              recv: ReceiverReport.summarize(this.audio.recv)
            },
            video: {
              send: SenderReport.summarize(this.video.send),
              recv: ReceiverReport.summarize(this.video.recv)
            }
          };
        };
        return PeerConnectionReport2;
      }()
    );
    module.exports = PeerConnectionReport;
  }
});

// node_modules/twilio-video/es5/stats/senderorreceiverreportfactory.js
var require_senderorreceiverreportfactory = __commonJS({
  "node_modules/twilio-video/es5/stats/senderorreceiverreportfactory.js"(exports, module) {
    "use strict";
    var SenderOrReceiverReportFactory = (
      /** @class */
      /* @__PURE__ */ function() {
        function SenderOrReceiverReportFactory2(id, trackId, initialStats) {
          Object.defineProperties(this, {
            id: {
              enumerable: true,
              value: id,
              writable: true
            },
            trackId: {
              enumerable: true,
              value: trackId,
              writable: true
            },
            lastStats: {
              enumerable: true,
              value: initialStats,
              writable: true
            }
          });
        }
        return SenderOrReceiverReportFactory2;
      }()
    );
    module.exports = SenderOrReceiverReportFactory;
  }
});

// node_modules/twilio-video/es5/stats/receiverreportfactory.js
var require_receiverreportfactory = __commonJS({
  "node_modules/twilio-video/es5/stats/receiverreportfactory.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var ReceiverReport = require_receiverreport();
    var SenderOrReceiverReportFactory = require_senderorreceiverreportfactory();
    var ReceiverReportFactory = (
      /** @class */
      function(_super) {
        __extends(ReceiverReportFactory2, _super);
        function ReceiverReportFactory2(trackId, initialStats) {
          var _this = _super.call(this, initialStats.id, trackId, initialStats) || this;
          Object.defineProperties(_this, {
            lastReport: {
              enumerable: true,
              value: null,
              writable: true
            }
          });
          return _this;
        }
        ReceiverReportFactory2.prototype.next = function(trackId, newerStats) {
          var olderStats = this.lastStats;
          this.lastStats = newerStats;
          this.trackId = trackId;
          var report = ReceiverReport.of(trackId, olderStats, newerStats);
          this.lastReport = report;
          return report;
        };
        return ReceiverReportFactory2;
      }(SenderOrReceiverReportFactory)
    );
    module.exports = ReceiverReportFactory;
  }
});

// node_modules/twilio-video/es5/stats/senderreportfactory.js
var require_senderreportfactory = __commonJS({
  "node_modules/twilio-video/es5/stats/senderreportfactory.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var SenderOrReceiverReportFactory = require_senderorreceiverreportfactory();
    var SenderReport = require_senderreport();
    var SenderReportFactory = (
      /** @class */
      function(_super) {
        __extends(SenderReportFactory2, _super);
        function SenderReportFactory2(trackId, initialStats) {
          var _this = _super.call(this, initialStats.id, trackId, initialStats) || this;
          Object.defineProperties(_this, {
            lastReport: {
              enumerable: true,
              value: null,
              writable: true
            }
          });
          return _this;
        }
        SenderReportFactory2.prototype.next = function(trackId, newerStats, newerRemoteStats) {
          var olderStats = this.lastStats;
          this.lastStats = newerStats;
          this.trackId = trackId;
          var report = SenderReport.of(trackId, olderStats, newerStats, newerRemoteStats);
          this.lastReport = report;
          return report;
        };
        return SenderReportFactory2;
      }(SenderOrReceiverReportFactory)
    );
    module.exports = SenderReportFactory;
  }
});

// node_modules/twilio-video/es5/stats/peerconnectionreportfactory.js
var require_peerconnectionreportfactory = __commonJS({
  "node_modules/twilio-video/es5/stats/peerconnectionreportfactory.js"(exports, module) {
    "use strict";
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var __values = exports && exports.__values || function(o) {
      var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
      if (m)
        return m.call(o);
      if (o && typeof o.length === "number")
        return {
          next: function() {
            if (o && i >= o.length)
              o = void 0;
            return { value: o && o[i++], done: !o };
          }
        };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    var guessBrowser = require_util().guessBrowser;
    var IceReportFactory = require_icereportfactory();
    var PeerConnectionReport = require_peerconnectionreport();
    var ReceiverReportFactory = require_receiverreportfactory();
    var SenderReportFactory = require_senderreportfactory();
    var PeerConnectionReportFactory = (
      /** @class */
      function() {
        function PeerConnectionReportFactory2(pc) {
          Object.defineProperties(this, {
            pc: {
              enumerable: true,
              value: pc
            },
            ice: {
              enumerable: true,
              value: new IceReportFactory()
            },
            audio: {
              enumerable: true,
              value: {
                send: /* @__PURE__ */ new Map(),
                recv: /* @__PURE__ */ new Map()
              }
            },
            video: {
              enumerable: true,
              value: {
                send: /* @__PURE__ */ new Map(),
                recv: /* @__PURE__ */ new Map()
              }
            },
            lastReport: {
              enumerable: true,
              value: null,
              writable: true
            }
          });
        }
        PeerConnectionReportFactory2.prototype.next = function() {
          var _this = this;
          var updatePromise = guessBrowser() === "firefox" ? updateFirefox(this) : updateChrome(this);
          return updatePromise.then(function() {
            var audioSenderReportFactories = __spreadArray([], __read(_this.audio.send.values()));
            var videoSenderReportFactories = __spreadArray([], __read(_this.video.send.values()));
            var audioReceiverReportFactories = __spreadArray([], __read(_this.audio.recv.values()));
            var videoReceiverReportFactories = __spreadArray([], __read(_this.video.recv.values()));
            var report = new PeerConnectionReport(_this.ice.lastReport, {
              send: audioSenderReportFactories.map(function(factory) {
                return factory.lastReport;
              }).filter(function(report2) {
                return report2;
              }),
              recv: audioReceiverReportFactories.map(function(factory) {
                return factory.lastReport;
              }).filter(function(report2) {
                return report2;
              })
            }, {
              send: videoSenderReportFactories.map(function(factory) {
                return factory.lastReport;
              }).filter(function(report2) {
                return report2;
              }),
              recv: videoReceiverReportFactories.map(function(factory) {
                return factory.lastReport;
              }).filter(function(report2) {
                return report2;
              })
            });
            _this.lastReport = report;
            return report;
          });
        };
        return PeerConnectionReportFactory2;
      }()
    );
    function getSenderOrReceiverReports(sendersOrReceivers) {
      return Promise.all(sendersOrReceivers.map(function(senderOrReceiver) {
        var trackId = senderOrReceiver.track.id;
        return senderOrReceiver.getStats().then(function(report) {
          var e_1, _a;
          try {
            for (var _b = __values(report.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
              var stats = _c.value;
              if (stats.type === "inbound-rtp") {
                stats.id = trackId + "-" + stats.id;
              }
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (_c && !_c.done && (_a = _b.return))
                _a.call(_b);
            } finally {
              if (e_1)
                throw e_1.error;
            }
          }
          return [trackId, report];
        });
      })).then(function(pairs) {
        return new Map(pairs);
      });
    }
    function getOrCreateSenderOrReceiverReportFactory(SenderOrReceiverReportFactory, sendersOrReceiversByMediaType, report, stats, trackId) {
      var sendersOrReceivers = sendersOrReceiversByMediaType[stats.mediaType];
      if (!trackId) {
        var trackStats = report.get(stats.trackId);
        if (trackStats) {
          trackId = trackStats.trackIdentifier;
        }
      }
      if (sendersOrReceivers && trackId) {
        if (sendersOrReceivers.has(stats.id)) {
          return sendersOrReceivers.get(stats.id);
        }
        var senderOrReceiverFactory = new SenderOrReceiverReportFactory(trackId, stats);
        sendersOrReceivers.set(stats.id, senderOrReceiverFactory);
      }
      return null;
    }
    function getSenderReportFactoriesByMediaType(factory) {
      return { audio: factory.audio.send, video: factory.video.send };
    }
    function getReceiverReportFactoriesByMediaType(factory) {
      return { audio: factory.audio.recv, video: factory.video.recv };
    }
    function getOrCreateSenderReportFactory(factory, report, stats, trackId) {
      return getOrCreateSenderOrReceiverReportFactory(SenderReportFactory, getSenderReportFactoriesByMediaType(factory), report, stats, trackId);
    }
    function getOrCreateReceiverReportFactory(factory, report, stats, trackId) {
      return getOrCreateSenderOrReceiverReportFactory(ReceiverReportFactory, getReceiverReportFactoriesByMediaType(factory), report, stats, trackId);
    }
    function getSenderReportFactoryIdsByMediaType(factory) {
      return {
        audio: new Set(factory.audio.send.keys()),
        video: new Set(factory.video.send.keys())
      };
    }
    function getReceiverReportFactoryIdsByMediaType(factory) {
      return {
        audio: new Set(factory.audio.recv.keys()),
        video: new Set(factory.video.recv.keys())
      };
    }
    function updateSenderReports(factory, report, senderReportFactoryIdsToDeleteByMediaType, trackId) {
      var e_2, _a;
      try {
        for (var _b = __values(report.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
          var stats = _c.value;
          if (stats.type === "outbound-rtp" && !stats.isRemote) {
            if (guessBrowser() !== "firefox" && !stats.trackId) {
              continue;
            }
            var senderReportFactoryIdsToDelete = senderReportFactoryIdsToDeleteByMediaType[stats.mediaType];
            if (senderReportFactoryIdsToDelete) {
              senderReportFactoryIdsToDelete.delete(stats.id);
            }
            var senderReportFactory = getOrCreateSenderReportFactory(factory, report, stats, trackId);
            if (senderReportFactory) {
              var remoteInboundStats = report.get(stats.remoteId);
              senderReportFactory.next(trackId || senderReportFactory.trackId, stats, remoteInboundStats);
            }
          }
        }
      } catch (e_2_1) {
        e_2 = { error: e_2_1 };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return))
            _a.call(_b);
        } finally {
          if (e_2)
            throw e_2.error;
        }
      }
    }
    function updateReceiverReports(factory, report, receiverReportFactoryIdsToDeleteByMediaType, trackId) {
      var e_3, _a;
      try {
        for (var _b = __values(report.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
          var stats = _c.value;
          if (stats.type === "inbound-rtp" && !stats.isRemote) {
            var receiverReportFactoryIdsToDelete = receiverReportFactoryIdsToDeleteByMediaType[stats.mediaType];
            if (receiverReportFactoryIdsToDelete) {
              receiverReportFactoryIdsToDelete.delete(stats.id);
            }
            var receiverReportFactory = getOrCreateReceiverReportFactory(factory, report, stats, trackId);
            if (receiverReportFactory) {
              receiverReportFactory.next(trackId || receiverReportFactory.trackId, stats);
            }
          }
        }
      } catch (e_3_1) {
        e_3 = { error: e_3_1 };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return))
            _a.call(_b);
        } finally {
          if (e_3)
            throw e_3.error;
        }
      }
    }
    function deleteSenderOrReceiverReportFactories(senderOrReceiverReportFactoriesByMediaType, senderOrReceiverReportFactoryIdsByMediaType) {
      var _loop_1 = function(mediaType2) {
        var senderOrReceiverReportFactories = senderOrReceiverReportFactoriesByMediaType[mediaType2];
        var senderOrReceiverReportFactoryIds = senderOrReceiverReportFactoryIdsByMediaType[mediaType2];
        senderOrReceiverReportFactoryIds.forEach(function(senderOrReceiverReportFactoryId) {
          return senderOrReceiverReportFactories.delete(senderOrReceiverReportFactoryId);
        });
      };
      for (var mediaType in senderOrReceiverReportFactoryIdsByMediaType) {
        _loop_1(mediaType);
      }
    }
    function updateIceReport(ice, report) {
      var e_4, _a, e_5, _b;
      var selectedCandidatePair;
      try {
        for (var _c = __values(report.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
          var stats = _d.value;
          if (stats.type === "transport") {
            selectedCandidatePair = report.get(stats.selectedCandidatePairId);
          }
        }
      } catch (e_4_1) {
        e_4 = { error: e_4_1 };
      } finally {
        try {
          if (_d && !_d.done && (_a = _c.return))
            _a.call(_c);
        } finally {
          if (e_4)
            throw e_4.error;
        }
      }
      if (selectedCandidatePair) {
        ice.next(selectedCandidatePair);
        return;
      }
      try {
        for (var _e = __values(report.values()), _f = _e.next(); !_f.done; _f = _e.next()) {
          var stats = _f.value;
          if (stats.type === "candidate-pair" && stats.nominated && ("selected" in stats ? stats.selected : true)) {
            ice.next(stats);
          }
        }
      } catch (e_5_1) {
        e_5 = { error: e_5_1 };
      } finally {
        try {
          if (_f && !_f.done && (_b = _e.return))
            _b.call(_e);
        } finally {
          if (e_5)
            throw e_5.error;
        }
      }
    }
    function updateFirefox(factory) {
      var senders = factory.pc.getTransceivers().filter(function(transceiver) {
        return transceiver.currentDirection && transceiver.currentDirection.match(/send/) && transceiver.sender.track;
      }).map(function(transceiver) {
        return transceiver.sender;
      });
      var receivers = factory.pc.getTransceivers().filter(function(transceiver) {
        return transceiver.currentDirection && transceiver.currentDirection.match(/recv/);
      }).map(function(transceiver) {
        return transceiver.receiver;
      });
      return Promise.all([
        getSenderOrReceiverReports(senders),
        getSenderOrReceiverReports(receivers),
        factory.pc.getStats()
      ]).then(function(_a) {
        var _b = __read(_a, 3), senderReports = _b[0], receiverReports = _b[1], pcReport = _b[2];
        var senderReportFactoriesByMediaType = getSenderReportFactoriesByMediaType(factory);
        var senderReportFactoryIdsToDeleteByMediaType = getSenderReportFactoryIdsByMediaType(factory);
        senderReports.forEach(function(report, trackId) {
          return updateSenderReports(factory, report, senderReportFactoryIdsToDeleteByMediaType, trackId);
        });
        deleteSenderOrReceiverReportFactories(senderReportFactoriesByMediaType, senderReportFactoryIdsToDeleteByMediaType);
        var receiverReportFactoriesByMediaType = getReceiverReportFactoriesByMediaType(factory);
        var receiverReportFactoryIdsToDeleteByMediaType = getReceiverReportFactoryIdsByMediaType(factory);
        receiverReports.forEach(function(report, trackId) {
          return updateReceiverReports(factory, report, receiverReportFactoryIdsToDeleteByMediaType, trackId);
        });
        deleteSenderOrReceiverReportFactories(receiverReportFactoriesByMediaType, receiverReportFactoryIdsToDeleteByMediaType);
        updateIceReport(factory.ice, pcReport);
      });
    }
    function updateChrome(factory) {
      return factory.pc.getStats().then(function(report) {
        var senderReportFactoriesByMediaType = getSenderReportFactoriesByMediaType(factory);
        var senderReportFactoryIdsToDeleteByMediaType = getSenderReportFactoryIdsByMediaType(factory);
        updateSenderReports(factory, report, senderReportFactoryIdsToDeleteByMediaType);
        deleteSenderOrReceiverReportFactories(senderReportFactoriesByMediaType, senderReportFactoryIdsToDeleteByMediaType);
        var receiverReportFactoriesByMediaType = getReceiverReportFactoriesByMediaType(factory);
        var receiverReportFactoryIdsToDeleteByMediaType = getReceiverReportFactoryIdsByMediaType(factory);
        updateReceiverReports(factory, report, receiverReportFactoryIdsToDeleteByMediaType);
        deleteSenderOrReceiverReportFactories(receiverReportFactoriesByMediaType, receiverReportFactoryIdsToDeleteByMediaType);
        updateIceReport(factory.ice, report);
      });
    }
    module.exports = PeerConnectionReportFactory;
  }
});

// node_modules/twilio-video/es5/signaling/v2/networkqualitymonitor.js
var require_networkqualitymonitor = __commonJS({
  "node_modules/twilio-video/es5/signaling/v2/networkqualitymonitor.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var EventEmitter = require_events();
    var PeerConnectionReportFactory = require_peerconnectionreportfactory();
    var NetworkQualityMonitor = (
      /** @class */
      function(_super) {
        __extends(NetworkQualityMonitor2, _super);
        function NetworkQualityMonitor2(manager, signaling) {
          var _this = _super.call(this) || this;
          Object.defineProperties(_this, {
            _factories: {
              value: /* @__PURE__ */ new WeakMap()
            },
            _manager: {
              value: manager
            },
            _signaling: {
              value: signaling
            }
          });
          signaling.on("updated", function() {
            return _this.emit("updated");
          });
          return _this;
        }
        Object.defineProperty(NetworkQualityMonitor2.prototype, "level", {
          /**
           * Get the current {@link NetworkQualityLevel}, if any.
           * @returns {?NetworkQualityLevel} level - initially null
           */
          get: function() {
            return this._signaling.level;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(NetworkQualityMonitor2.prototype, "levels", {
          /**
           * Get the current {@link NetworkQualityLevels}, if any.
           * @returns {?NetworkQualityLevels} levels - initially null
           */
          get: function() {
            return this._signaling.levels;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(NetworkQualityMonitor2.prototype, "remoteLevels", {
          /**
           * Get the current {@link NetworkQualityLevels} of remote participants, if any.
           * @returns {Map<String, NetworkQualityLevels>} remoteLevels
           */
          get: function() {
            return this._signaling.remoteLevels;
          },
          enumerable: false,
          configurable: true
        });
        NetworkQualityMonitor2.prototype.start = function() {
          var _this = this;
          this.stop();
          var timeout = setTimeout(function() {
            if (_this._timeout !== timeout) {
              return;
            }
            next(_this).then(function(reports) {
              if (_this._timeout !== timeout) {
                return;
              }
              if (reports.length) {
                var _a = __read(reports, 1), report = _a[0];
                _this._signaling.put(report);
              }
              _this.start();
            });
          }, 200);
          this._timeout = timeout;
        };
        NetworkQualityMonitor2.prototype.stop = function() {
          clearTimeout(this._timeout);
          this._timeout = null;
        };
        return NetworkQualityMonitor2;
      }(EventEmitter)
    );
    function next(monitor) {
      var pcv2s = monitor._manager._peerConnections ? Array.from(monitor._manager._peerConnections.values()) : [];
      var pcs = pcv2s.map(function(pcv2) {
        return pcv2._peerConnection;
      }).filter(function(pc) {
        return pc.signalingState !== "closed";
      });
      var factories = pcs.map(function(pc) {
        if (monitor._factories.has(pc)) {
          return monitor._factories.get(pc);
        }
        var factory = new PeerConnectionReportFactory(pc);
        monitor._factories.set(pc, factory);
        return factory;
      });
      var reportsOrNullPromises = factories.map(function(factory) {
        return factory.next().catch(function() {
          return null;
        });
      });
      return Promise.all(reportsOrNullPromises).then(function(reportsOrNull) {
        return reportsOrNull.filter(function(reportOrNull) {
          return reportOrNull;
        }).map(function(report) {
          return report.summarize();
        });
      });
    }
    module.exports = NetworkQualityMonitor;
  }
});

// node_modules/twilio-video/es5/util/asyncvar.js
var require_asyncvar = __commonJS({
  "node_modules/twilio-video/es5/util/asyncvar.js"(exports, module) {
    "use strict";
    var defer = require_util2().defer;
    var AsyncVar = (
      /** @class */
      function() {
        function AsyncVar2() {
          Object.defineProperties(this, {
            _deferreds: {
              value: []
            },
            _hasValue: {
              value: false,
              writable: true
            },
            _value: {
              value: null,
              writable: true
            }
          });
        }
        AsyncVar2.prototype.put = function(value) {
          this._hasValue = true;
          this._value = value;
          var deferred = this._deferreds.shift();
          if (deferred) {
            deferred.resolve(value);
          }
          return this;
        };
        AsyncVar2.prototype.take = function() {
          var _this = this;
          if (this._hasValue && !this._deferreds.length) {
            this._hasValue = false;
            return Promise.resolve(this._value);
          }
          var deferred = defer();
          this._deferreds.push(deferred);
          return deferred.promise.then(function(value) {
            _this._hasValue = false;
            return value;
          });
        };
        return AsyncVar2;
      }()
    );
    module.exports = AsyncVar;
  }
});

// node_modules/twilio-video/es5/signaling/v2/networkqualitysignaling.js
var require_networkqualitysignaling = __commonJS({
  "node_modules/twilio-video/es5/signaling/v2/networkqualitysignaling.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var MediaSignaling = require_mediasignaling();
    var AsyncVar = require_asyncvar();
    var Timeout = require_timeout();
    var NETWORK_QUALITY_RESPONSE_TIME_MS = 5e3;
    var NetworkQualitySignaling = (
      /** @class */
      function(_super) {
        __extends(NetworkQualitySignaling2, _super);
        function NetworkQualitySignaling2(getReceiver, networkQualityConfiguration, options) {
          var _this = _super.call(this, getReceiver, "network_quality", options) || this;
          Object.defineProperties(_this, {
            _level: {
              value: null,
              writable: true
            },
            _levels: {
              value: null,
              writable: true
            },
            _remoteLevels: {
              value: /* @__PURE__ */ new Map(),
              writable: true
            },
            _networkQualityInputs: {
              value: new AsyncVar()
            },
            _resendTimer: {
              value: new Timeout(function() {
                _this._resendTimer.setDelay(_this._resendTimer.delay * 1.5);
                _this._sendNetworkQualityInputs();
              }, NETWORK_QUALITY_RESPONSE_TIME_MS, false)
            },
            _networkQualityReportLevels: {
              get: function() {
                return {
                  reportLevel: networkQualityConfiguration.local,
                  remoteReportLevel: networkQualityConfiguration.remote
                };
              }
            }
          });
          _this.on("ready", function(transport) {
            transport.on("message", function(message) {
              _this._log.debug("Incoming: ", message);
              switch (message.type) {
                case "network_quality":
                  _this._handleNetworkQualityMessage(message);
                  break;
                default:
                  break;
              }
            });
          });
          _this._sendNetworkQualityInputs();
          return _this;
        }
        Object.defineProperty(NetworkQualitySignaling2.prototype, "level", {
          /**
           * Get the current {@link NetworkQualityLevel}, if any.
           * @returns {?NetworkQualityLevel} level - initially null
           */
          get: function() {
            return this._level;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(NetworkQualitySignaling2.prototype, "levels", {
          /**
           * Get the current {@link NetworkQualityLevels}, if any.
           * @returns {?NetworkQualityLevels} levels - initially null
           */
          get: function() {
            return this._levels;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(NetworkQualitySignaling2.prototype, "remoteLevels", {
          /**
           * Get the current {@link NetworkQualityLevels} of remote participants, if any.
           * @returns {Map<String, NetworkQualityLevels>} remoteLevels
           */
          get: function() {
            return this._remoteLevels;
          },
          enumerable: false,
          configurable: true
        });
        NetworkQualitySignaling2.prototype._handleNetworkQualityMessage = function(message) {
          var _this = this;
          var updated = false;
          var level = null;
          var local = message ? message.local : null;
          if (typeof local === "number") {
            level = local;
            this._levels = null;
          } else if (typeof local === "object" && local) {
            this._levels = local;
            level = typeof local.level === "number" ? local.level : Math.min(local.audio.send, local.audio.recv, local.video.send, local.video.recv);
          }
          if (level !== null && this.level !== level) {
            this._level = level;
            updated = true;
          }
          this._remoteLevels = message && message.remotes ? message.remotes.reduce(function(levels, obj) {
            var oldObj = _this._remoteLevels.get(obj.sid) || {};
            if (oldObj.level !== obj.level) {
              updated = true;
            }
            return levels.set(obj.sid, obj);
          }, /* @__PURE__ */ new Map()) : this._remoteLevels;
          if (updated) {
            this.emit("updated");
          }
          this._resendTimer.setDelay(NETWORK_QUALITY_RESPONSE_TIME_MS);
          if (this._resendTimer.isSet) {
            setTimeout(function() {
              return _this._sendNetworkQualityInputs();
            }, 1e3);
          }
        };
        NetworkQualitySignaling2.prototype._sendNetworkQualityInputs = function() {
          var _this = this;
          this._resendTimer.clear();
          return this._networkQualityInputs.take().then(function(networkQualityInputs) {
            if (_this._transport) {
              _this._transport.publish(createNetworkQualityInputsMessage(networkQualityInputs, _this._networkQualityReportLevels));
            }
          }).finally(function() {
            _this._resendTimer.start();
          });
        };
        NetworkQualitySignaling2.prototype.put = function(networkQualityInputs) {
          this._networkQualityInputs.put(networkQualityInputs);
        };
        return NetworkQualitySignaling2;
      }(MediaSignaling)
    );
    function createNetworkQualityInputsMessage(networkQualityInputs, networkQualityReportLevels) {
      return Object.assign({ type: "network_quality" }, networkQualityInputs, networkQualityReportLevels);
    }
    module.exports = NetworkQualitySignaling;
  }
});

// node_modules/twilio-video/es5/signaling/recording.js
var require_recording = __commonJS({
  "node_modules/twilio-video/es5/signaling/recording.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var EventEmitter = require_events().EventEmitter;
    var RecordingSignaling = (
      /** @class */
      function(_super) {
        __extends(RecordingSignaling2, _super);
        function RecordingSignaling2() {
          var _this = _super.call(this) || this;
          Object.defineProperties(_this, {
            _isEnabled: {
              value: null,
              writable: true
            },
            isEnabled: {
              enumerable: true,
              get: function() {
                return this._isEnabled;
              }
            }
          });
          return _this;
        }
        RecordingSignaling2.prototype.disable = function() {
          return this.enable(false);
        };
        RecordingSignaling2.prototype.enable = function(enabled) {
          enabled = typeof enabled === "boolean" ? enabled : true;
          if (this.isEnabled !== enabled) {
            this._isEnabled = enabled;
            this.emit("updated");
          }
          return this;
        };
        return RecordingSignaling2;
      }(EventEmitter)
    );
    module.exports = RecordingSignaling;
  }
});

// node_modules/twilio-video/es5/signaling/v2/recording.js
var require_recording2 = __commonJS({
  "node_modules/twilio-video/es5/signaling/v2/recording.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var RecordingSignaling = require_recording();
    var RecordingV2 = (
      /** @class */
      function(_super) {
        __extends(RecordingV22, _super);
        function RecordingV22() {
          var _this = _super.call(this) || this;
          Object.defineProperties(_this, {
            _revision: {
              value: 1,
              writable: true
            }
          });
          return _this;
        }
        RecordingV22.prototype.update = function(recording) {
          if (recording.revision < this._revision) {
            return this;
          }
          this._revision = recording.revision;
          return this.enable(recording.is_recording);
        };
        return RecordingV22;
      }(RecordingSignaling)
    );
    module.exports = RecordingV2;
  }
});

// node_modules/twilio-video/es5/signaling/room.js
var require_room2 = __commonJS({
  "node_modules/twilio-video/es5/signaling/room.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var DefaultRecordingSignaling = require_recording();
    var StateMachine = require_statemachine();
    var DefaultTimeout = require_timeout();
    var buildLogLevels = require_util2().buildLogLevels;
    var DEFAULT_LOG_LEVEL = require_constants().DEFAULT_LOG_LEVEL;
    var Log = require_log();
    var _a = require_twilio_video_errors();
    var MediaConnectionError = _a.MediaConnectionError;
    var MediaDTLSTransportFailedError = _a.MediaDTLSTransportFailedError;
    var SignalingConnectionDisconnectedError = _a.SignalingConnectionDisconnectedError;
    var nInstances = 0;
    var states = {
      connected: [
        "reconnecting",
        "disconnected"
      ],
      reconnecting: [
        "connected",
        "disconnected"
      ],
      disconnected: []
    };
    var RoomSignaling = (
      /** @class */
      function(_super) {
        __extends(RoomSignaling2, _super);
        function RoomSignaling2(localParticipant, sid, name, options) {
          var _this = this;
          options = Object.assign({
            logLevel: DEFAULT_LOG_LEVEL,
            RecordingSignaling: DefaultRecordingSignaling,
            Timeout: DefaultTimeout
          }, options);
          var logLevels = buildLogLevels(options.logLevel);
          _this = _super.call(this, "connected", states) || this;
          var RecordingSignaling = options.RecordingSignaling;
          var sessionTimeout = new options.Timeout(function() {
            _this._disconnect(_this._reconnectingError);
          }, options.sessionTimeout, false);
          Object.defineProperties(_this, {
            _instanceId: {
              value: nInstances++
            },
            _log: {
              value: options.log ? options.log.createLog("default", _this) : new Log("default", _this, logLevels, options.loggerName)
            },
            _mediaConnectionIsReconnecting: {
              writable: true,
              value: false
            },
            _options: {
              value: options
            },
            _reconnectingError: {
              value: null,
              writable: true
            },
            _sessionTimeout: {
              value: sessionTimeout
            },
            dominantSpeakerSid: {
              enumerable: true,
              value: null,
              writable: true
            },
            localParticipant: {
              enumerable: true,
              value: localParticipant
            },
            name: {
              enumerable: true,
              value: name
            },
            participants: {
              enumerable: true,
              value: /* @__PURE__ */ new Map()
            },
            recording: {
              enumerable: true,
              value: new RecordingSignaling()
            },
            sid: {
              enumerable: true,
              value: sid
            }
          });
          _this.on("connectionStateChanged", function() {
            if (_this.connectionState === "failed" && !["disconnected", "failed"].includes(_this.iceConnectionState)) {
              _this._disconnect(new MediaDTLSTransportFailedError());
            }
          });
          _this.on("iceConnectionStateChanged", function() {
            return maybeUpdateState(_this);
          });
          _this.on("signalingConnectionStateChanged", function() {
            return maybeUpdateState(_this);
          });
          setTimeout(function() {
            return maybeUpdateState(_this);
          });
          return _this;
        }
        RoomSignaling2.prototype._disconnect = function(error) {
          if (this.state !== "disconnected") {
            this.preempt("disconnected", null, [error]);
            return true;
          }
          return false;
        };
        RoomSignaling2.prototype.toString = function() {
          return "[RoomSignaling #" + this._instanceId + ": " + (this.localParticipant ? this.localParticipant.sid : "null") + "]";
        };
        RoomSignaling2.prototype.connectParticipant = function(participant) {
          var self = this;
          if (participant.state === "disconnected") {
            return false;
          }
          if (this.participants.has(participant.sid)) {
            return false;
          }
          this.participants.set(participant.sid, participant);
          participant.on("stateChanged", function stateChanged(state) {
            if (state === "disconnected") {
              participant.removeListener("stateChanged", stateChanged);
              self.participants.delete(participant.sid);
              self.emit("participantDisconnected", participant);
            }
          });
          this.emit("participantConnected", participant);
          return true;
        };
        RoomSignaling2.prototype.disconnect = function() {
          return this._disconnect();
        };
        RoomSignaling2.prototype.setDominantSpeaker = function(dominantSpeakerSid) {
          this.dominantSpeakerSid = dominantSpeakerSid;
          this.emit("dominantSpeakerChanged");
        };
        return RoomSignaling2;
      }(StateMachine)
    );
    function maybeUpdateState(roomSignaling) {
      if (roomSignaling.state === "disconnected" || roomSignaling.signalingConnectionState === "disconnected") {
        roomSignaling._sessionTimeout.clear();
        return;
      }
      var newState;
      if (roomSignaling.signalingConnectionState === "reconnecting") {
        newState = roomSignaling.signalingConnectionState;
      } else if (roomSignaling.iceConnectionState === "failed") {
        roomSignaling._mediaConnectionIsReconnecting = true;
        newState = "reconnecting";
      } else if (roomSignaling.iceConnectionState === "new" || roomSignaling.iceConnectionState === "checking") {
        newState = roomSignaling._mediaConnectionIsReconnecting ? "reconnecting" : "connected";
      } else {
        roomSignaling._mediaConnectionIsReconnecting = false;
        roomSignaling._reconnectingError = null;
        roomSignaling._sessionTimeout.clear();
        newState = "connected";
      }
      if (newState === roomSignaling.state) {
        return;
      }
      if (newState === "reconnecting") {
        roomSignaling._reconnectingError = roomSignaling.signalingConnectionState === "reconnecting" ? new SignalingConnectionDisconnectedError() : new MediaConnectionError();
        roomSignaling._sessionTimeout.start();
        roomSignaling.preempt(newState, null, [roomSignaling._reconnectingError]);
      } else {
        roomSignaling.preempt(newState);
      }
    }
    module.exports = RoomSignaling;
  }
});

// node_modules/twilio-video/es5/stats/networkqualitybandwidthstats.js
var require_networkqualitybandwidthstats = __commonJS({
  "node_modules/twilio-video/es5/stats/networkqualitybandwidthstats.js"(exports, module) {
    "use strict";
    var NetworkQualityBandwidthStats = (
      /** @class */
      /* @__PURE__ */ function() {
        function NetworkQualityBandwidthStats2(_a) {
          var _b = _a.actual, actual = _b === void 0 ? null : _b, _c = _a.available, available = _c === void 0 ? null : _c, _d = _a.level, level = _d === void 0 ? null : _d;
          Object.defineProperties(this, {
            actual: {
              value: actual,
              enumerable: true
            },
            available: {
              value: available,
              enumerable: true
            },
            level: {
              value: level,
              enumerable: true
            }
          });
        }
        return NetworkQualityBandwidthStats2;
      }()
    );
    module.exports = NetworkQualityBandwidthStats;
  }
});

// node_modules/twilio-video/es5/stats/networkqualityfractionloststats.js
var require_networkqualityfractionloststats = __commonJS({
  "node_modules/twilio-video/es5/stats/networkqualityfractionloststats.js"(exports, module) {
    "use strict";
    var NetworkQualityFractionLostStats = (
      /** @class */
      /* @__PURE__ */ function() {
        function NetworkQualityFractionLostStats2(_a) {
          var _b = _a.fractionLost, fractionLost = _b === void 0 ? null : _b, _c = _a.level, level = _c === void 0 ? null : _c;
          Object.defineProperties(this, {
            fractionLost: {
              value: fractionLost,
              enumerable: true
            },
            level: {
              value: level,
              enumerable: true
            }
          });
        }
        return NetworkQualityFractionLostStats2;
      }()
    );
    module.exports = NetworkQualityFractionLostStats;
  }
});

// node_modules/twilio-video/es5/stats/networkqualitylatencystats.js
var require_networkqualitylatencystats = __commonJS({
  "node_modules/twilio-video/es5/stats/networkqualitylatencystats.js"(exports, module) {
    "use strict";
    var NetworkQualityLatencyStats = (
      /** @class */
      /* @__PURE__ */ function() {
        function NetworkQualityLatencyStats2(_a) {
          var _b = _a.jitter, jitter = _b === void 0 ? null : _b, _c = _a.rtt, rtt = _c === void 0 ? null : _c, _d = _a.level, level = _d === void 0 ? null : _d;
          Object.defineProperties(this, {
            jitter: {
              value: jitter,
              enumerable: true
            },
            rtt: {
              value: rtt,
              enumerable: true
            },
            level: {
              value: level,
              enumerable: true
            }
          });
        }
        return NetworkQualityLatencyStats2;
      }()
    );
    module.exports = NetworkQualityLatencyStats;
  }
});

// node_modules/twilio-video/es5/stats/networkqualitysendorrecvstats.js
var require_networkqualitysendorrecvstats = __commonJS({
  "node_modules/twilio-video/es5/stats/networkqualitysendorrecvstats.js"(exports, module) {
    "use strict";
    var NetworkQualityBandwidthStats = require_networkqualitybandwidthstats();
    var NetworkQualityFractionLostStats = require_networkqualityfractionloststats();
    var NetworkQualityLatencyStats = require_networkqualitylatencystats();
    var NetworkQualitySendOrRecvStats = (
      /** @class */
      /* @__PURE__ */ function() {
        function NetworkQualitySendOrRecvStats2(_a) {
          var _b = _a.bandwidth, bandwidth = _b === void 0 ? null : _b, _c = _a.fractionLost, fractionLost = _c === void 0 ? null : _c, _d = _a.latency, latency = _d === void 0 ? null : _d;
          Object.defineProperties(this, {
            bandwidth: {
              value: bandwidth ? new NetworkQualityBandwidthStats(bandwidth) : null,
              enumerable: true
            },
            fractionLost: {
              value: fractionLost ? new NetworkQualityFractionLostStats(fractionLost) : null,
              enumerable: true
            },
            latency: {
              value: latency ? new NetworkQualityLatencyStats(latency) : null,
              enumerable: true
            }
          });
        }
        return NetworkQualitySendOrRecvStats2;
      }()
    );
    module.exports = NetworkQualitySendOrRecvStats;
  }
});

// node_modules/twilio-video/es5/stats/networkqualitysendstats.js
var require_networkqualitysendstats = __commonJS({
  "node_modules/twilio-video/es5/stats/networkqualitysendstats.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var NetworkQualitySendOrRecvStats = require_networkqualitysendorrecvstats();
    var NetworkQualitySendStats = (
      /** @class */
      function(_super) {
        __extends(NetworkQualitySendStats2, _super);
        function NetworkQualitySendStats2(sendOrRecvStats) {
          return _super.call(this, sendOrRecvStats) || this;
        }
        return NetworkQualitySendStats2;
      }(NetworkQualitySendOrRecvStats)
    );
    module.exports = NetworkQualitySendStats;
  }
});

// node_modules/twilio-video/es5/stats/networkqualityrecvstats.js
var require_networkqualityrecvstats = __commonJS({
  "node_modules/twilio-video/es5/stats/networkqualityrecvstats.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var NetworkQualitySendOrRecvStats = require_networkqualitysendorrecvstats();
    var NetworkQualityRecvStats = (
      /** @class */
      function(_super) {
        __extends(NetworkQualityRecvStats2, _super);
        function NetworkQualityRecvStats2(sendOrRecvStats) {
          return _super.call(this, sendOrRecvStats) || this;
        }
        return NetworkQualityRecvStats2;
      }(NetworkQualitySendOrRecvStats)
    );
    module.exports = NetworkQualityRecvStats;
  }
});

// node_modules/twilio-video/es5/stats/networkqualitymediastats.js
var require_networkqualitymediastats = __commonJS({
  "node_modules/twilio-video/es5/stats/networkqualitymediastats.js"(exports, module) {
    "use strict";
    var NetworkQualitySendStats = require_networkqualitysendstats();
    var NetworkQualityRecvStats = require_networkqualityrecvstats();
    var NetworkQualityMediaStats = (
      /** @class */
      /* @__PURE__ */ function() {
        function NetworkQualityMediaStats2(_a) {
          var send = _a.send, recv = _a.recv, _b = _a.sendStats, sendStats = _b === void 0 ? null : _b, _c = _a.recvStats, recvStats = _c === void 0 ? null : _c;
          Object.defineProperties(this, {
            send: {
              value: send,
              enumerable: true
            },
            recv: {
              value: recv,
              enumerable: true
            },
            sendStats: {
              value: sendStats ? new NetworkQualitySendStats(sendStats) : null,
              enumerable: true
            },
            recvStats: {
              value: recvStats ? new NetworkQualityRecvStats(recvStats) : null,
              enumerable: true
            }
          });
        }
        return NetworkQualityMediaStats2;
      }()
    );
    module.exports = NetworkQualityMediaStats;
  }
});

// node_modules/twilio-video/es5/stats/networkqualityaudiostats.js
var require_networkqualityaudiostats = __commonJS({
  "node_modules/twilio-video/es5/stats/networkqualityaudiostats.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var NetworkQualityMediaStats = require_networkqualitymediastats();
    var NetworkQualityAudioStats = (
      /** @class */
      function(_super) {
        __extends(NetworkQualityAudioStats2, _super);
        function NetworkQualityAudioStats2(mediaLevels) {
          return _super.call(this, mediaLevels) || this;
        }
        return NetworkQualityAudioStats2;
      }(NetworkQualityMediaStats)
    );
    module.exports = NetworkQualityAudioStats;
  }
});

// node_modules/twilio-video/es5/stats/networkqualityvideostats.js
var require_networkqualityvideostats = __commonJS({
  "node_modules/twilio-video/es5/stats/networkqualityvideostats.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var NetworkQualityMediaStats = require_networkqualitymediastats();
    var NetworkQualityVideoStats = (
      /** @class */
      function(_super) {
        __extends(NetworkQualityVideoStats2, _super);
        function NetworkQualityVideoStats2(mediaLevels) {
          return _super.call(this, mediaLevels) || this;
        }
        return NetworkQualityVideoStats2;
      }(NetworkQualityMediaStats)
    );
    module.exports = NetworkQualityVideoStats;
  }
});

// node_modules/twilio-video/es5/stats/networkqualitystats.js
var require_networkqualitystats = __commonJS({
  "node_modules/twilio-video/es5/stats/networkqualitystats.js"(exports, module) {
    "use strict";
    var NetworkQualityAudioStats = require_networkqualityaudiostats();
    var NetworkQualityVideoStats = require_networkqualityvideostats();
    var NetworkQualityStats = (
      /** @class */
      /* @__PURE__ */ function() {
        function NetworkQualityStats2(_a) {
          var level = _a.level, audio = _a.audio, video = _a.video;
          Object.defineProperties(this, {
            level: {
              value: level,
              enumerable: true
            },
            audio: {
              value: audio ? new NetworkQualityAudioStats(audio) : null,
              enumerable: true
            },
            video: {
              value: video ? new NetworkQualityVideoStats(video) : null,
              enumerable: true
            }
          });
        }
        return NetworkQualityStats2;
      }()
    );
    module.exports = NetworkQualityStats;
  }
});

// node_modules/twilio-video/es5/signaling/participant.js
var require_participant2 = __commonJS({
  "node_modules/twilio-video/es5/signaling/participant.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var StateMachine = require_statemachine();
    var NetworkQualityStats = require_networkqualitystats();
    var states = {
      connecting: [
        "connected"
      ],
      connected: [
        "disconnected",
        "reconnecting"
      ],
      reconnecting: [
        "connected",
        "disconnected"
      ],
      disconnected: []
    };
    var ParticipantSignaling = (
      /** @class */
      function(_super) {
        __extends(ParticipantSignaling2, _super);
        function ParticipantSignaling2() {
          var _this = _super.call(this, "connecting", states) || this;
          Object.defineProperties(_this, {
            _identity: {
              writable: true,
              value: null
            },
            _networkQualityLevel: {
              value: null,
              writable: true
            },
            _networkQualityStats: {
              value: null,
              writable: true
            },
            _sid: {
              writable: true,
              value: null
            },
            identity: {
              enumerable: true,
              get: function() {
                return this._identity;
              }
            },
            sid: {
              enumerable: true,
              get: function() {
                return this._sid;
              }
            },
            tracks: {
              enumerable: true,
              value: /* @__PURE__ */ new Map()
            }
          });
          return _this;
        }
        Object.defineProperty(ParticipantSignaling2.prototype, "networkQualityLevel", {
          /**
           * Get the current {@link NetworkQualityLevel}, if any.
           * @returns {?NetworkQualityLevel} networkQualityLevel - initially null
           */
          get: function() {
            return this._networkQualityLevel;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(ParticipantSignaling2.prototype, "networkQualityStats", {
          /**
           * Get the current {@link NetworkQualityStats}
           * @returns {?NetworkQualityStats} networkQualityStats - initially null
           */
          get: function() {
            return this._networkQualityStats;
          },
          enumerable: false,
          configurable: true
        });
        ParticipantSignaling2.prototype.addTrack = function(track) {
          this.tracks.set(track.id || track.sid, track);
          this.emit("trackAdded", track);
          return this;
        };
        ParticipantSignaling2.prototype.disconnect = function() {
          if (this.state !== "disconnected") {
            this.preempt("disconnected");
            return true;
          }
          return false;
        };
        ParticipantSignaling2.prototype.removeTrack = function(track) {
          var signaling = this.tracks.get(track.id || track.sid);
          this.tracks.delete(track.id || track.sid);
          if (signaling) {
            this.emit("trackRemoved", track);
          }
          return signaling || null;
        };
        ParticipantSignaling2.prototype.setNetworkQualityLevel = function(networkQualityLevel, networkQualityLevels) {
          if (this._networkQualityLevel !== networkQualityLevel) {
            this._networkQualityLevel = networkQualityLevel;
            this._networkQualityStats = networkQualityLevels && (networkQualityLevels.audio || networkQualityLevels.video) ? new NetworkQualityStats(networkQualityLevels) : null;
            this.emit("networkQualityLevelChanged");
          }
        };
        ParticipantSignaling2.prototype.connect = function(sid, identity) {
          if (this.state === "connecting" || this.state === "reconnecting") {
            if (!this._sid) {
              this._sid = sid;
            }
            if (!this._identity) {
              this._identity = identity;
            }
            this.preempt("connected");
            return true;
          }
          return false;
        };
        ParticipantSignaling2.prototype.reconnecting = function() {
          if (this.state === "connecting" || this.state === "connected") {
            this.preempt("reconnecting");
            return true;
          }
          return false;
        };
        return ParticipantSignaling2;
      }(StateMachine)
    );
    module.exports = ParticipantSignaling;
  }
});

// node_modules/twilio-video/es5/signaling/remoteparticipant.js
var require_remoteparticipant2 = __commonJS({
  "node_modules/twilio-video/es5/signaling/remoteparticipant.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var ParticipantSignaling = require_participant2();
    var RemoteParticipantSignaling = (
      /** @class */
      function(_super) {
        __extends(RemoteParticipantSignaling2, _super);
        function RemoteParticipantSignaling2(sid, identity) {
          var _this = _super.call(this) || this;
          _this.connect(sid, identity);
          return _this;
        }
        return RemoteParticipantSignaling2;
      }(ParticipantSignaling)
    );
    module.exports = RemoteParticipantSignaling;
  }
});

// node_modules/twilio-video/es5/signaling/track.js
var require_track2 = __commonJS({
  "node_modules/twilio-video/es5/signaling/track.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var EventEmitter = require_events().EventEmitter;
    var TrackSignaling = (
      /** @class */
      function(_super) {
        __extends(TrackSignaling2, _super);
        function TrackSignaling2(name, kind, isEnabled, priority) {
          var _this = _super.call(this) || this;
          var sid = null;
          Object.defineProperties(_this, {
            _error: {
              value: null,
              writable: true
            },
            _isEnabled: {
              value: isEnabled,
              writable: true
            },
            _priority: {
              value: priority,
              writable: true
            },
            _trackTransceiver: {
              value: null,
              writable: true
            },
            _sid: {
              get: function() {
                return sid;
              },
              set: function(_sid) {
                if (sid === null) {
                  sid = _sid;
                }
              }
            },
            kind: {
              enumerable: true,
              value: kind
            },
            name: {
              enumerable: true,
              value: name
            }
          });
          return _this;
        }
        Object.defineProperty(TrackSignaling2.prototype, "error", {
          /**
           * Non-null if publication or subscription failed.
           * @property {?Error} error
           */
          get: function() {
            return this._error;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(TrackSignaling2.prototype, "isEnabled", {
          /**
           * Whether the {@link TrackSignaling} is enabled.
           * @property {boolean}
           */
          get: function() {
            return this._isEnabled;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(TrackSignaling2.prototype, "priority", {
          /**
           * The {@link TrackSignaling}'s priority.
           * @property {Track.Priority}
           */
          get: function() {
            return this._priority;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(TrackSignaling2.prototype, "sid", {
          /**
           * The {@link TrackSignaling}'s {@link Track.SID}.
           * @property {Track.SID}
           */
          get: function() {
            return this._sid;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(TrackSignaling2.prototype, "trackTransceiver", {
          /**
           * The {@link TrackSignaling}'s {@link TrackTransceiver}.
           * @property {TrackTransceiver}
           */
          get: function() {
            return this._trackTransceiver;
          },
          enumerable: false,
          configurable: true
        });
        TrackSignaling2.prototype.disable = function() {
          return this.enable(false);
        };
        TrackSignaling2.prototype.enable = function(enabled) {
          enabled = typeof enabled === "boolean" ? enabled : true;
          if (this.isEnabled !== enabled) {
            this._isEnabled = enabled;
            this.emit("updated");
          }
          return this;
        };
        TrackSignaling2.prototype.setTrackTransceiver = function(trackTransceiver) {
          trackTransceiver = trackTransceiver || null;
          if (this.trackTransceiver !== trackTransceiver) {
            this._trackTransceiver = trackTransceiver;
            this.emit("updated");
          }
          return this;
        };
        TrackSignaling2.prototype.setSid = function(sid) {
          if (this.sid === null) {
            this._sid = sid;
            this.emit("updated");
          }
          return this;
        };
        return TrackSignaling2;
      }(EventEmitter)
    );
    module.exports = TrackSignaling;
  }
});

// node_modules/twilio-video/es5/signaling/remotetrackpublication.js
var require_remotetrackpublication2 = __commonJS({
  "node_modules/twilio-video/es5/signaling/remotetrackpublication.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var TrackSignaling = require_track2();
    var RemoteTrackPublicationSignaling = (
      /** @class */
      function(_super) {
        __extends(RemoteTrackPublicationSignaling2, _super);
        function RemoteTrackPublicationSignaling2(sid, name, kind, isEnabled, priority, isSwitchedOff) {
          var _this = _super.call(this, name, kind, isEnabled, priority) || this;
          Object.defineProperties(_this, {
            _isSwitchedOff: {
              value: isSwitchedOff,
              writable: true
            }
          });
          _this.setSid(sid);
          return _this;
        }
        Object.defineProperty(RemoteTrackPublicationSignaling2.prototype, "isSubscribed", {
          /**
           * Whether the {@link RemoteTrackPublicationSignaling} is subscribed to.
           * @property {boolean}
           */
          get: function() {
            return !!this.trackTransceiver;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(RemoteTrackPublicationSignaling2.prototype, "isSwitchedOff", {
          /**
           * Whether the {@link RemoteTrackPublicationSignaling} is switched off.
           * @property {boolean}
           */
          get: function() {
            return this._isSwitchedOff;
          },
          enumerable: false,
          configurable: true
        });
        RemoteTrackPublicationSignaling2.prototype.subscribeFailed = function(error) {
          if (!this.error) {
            this._error = error;
            this.emit("updated");
          }
          return this;
        };
        RemoteTrackPublicationSignaling2.prototype.setPriority = function(priority) {
          if (this._priority !== priority) {
            this._priority = priority;
            this.emit("updated");
          }
          return this;
        };
        RemoteTrackPublicationSignaling2.prototype.setSwitchedOff = function(isSwitchedOff) {
          if (this._isSwitchedOff !== isSwitchedOff) {
            this._isSwitchedOff = isSwitchedOff;
            this.emit("updated");
          }
          return this;
        };
        return RemoteTrackPublicationSignaling2;
      }(TrackSignaling)
    );
    module.exports = RemoteTrackPublicationSignaling;
  }
});

// node_modules/twilio-video/es5/signaling/v2/remotetrackpublication.js
var require_remotetrackpublication3 = __commonJS({
  "node_modules/twilio-video/es5/signaling/v2/remotetrackpublication.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var RemoteTrackPublicationSignaling = require_remotetrackpublication2();
    var RemoteTrackPublicationV2 = (
      /** @class */
      function(_super) {
        __extends(RemoteTrackPublicationV22, _super);
        function RemoteTrackPublicationV22(track, isSwitchedOff) {
          return _super.call(this, track.sid, track.name, track.kind, track.enabled, track.priority, isSwitchedOff) || this;
        }
        RemoteTrackPublicationV22.prototype.update = function(track) {
          this.enable(track.enabled);
          this.setPriority(track.priority);
          return this;
        };
        return RemoteTrackPublicationV22;
      }(RemoteTrackPublicationSignaling)
    );
    module.exports = RemoteTrackPublicationV2;
  }
});

// node_modules/twilio-video/es5/signaling/v2/remoteparticipant.js
var require_remoteparticipant3 = __commonJS({
  "node_modules/twilio-video/es5/signaling/v2/remoteparticipant.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var RemoteParticipantSignaling = require_remoteparticipant2();
    var RemoteTrackPublicationV2 = require_remotetrackpublication3();
    var RemoteParticipantV2 = (
      /** @class */
      function(_super) {
        __extends(RemoteParticipantV22, _super);
        function RemoteParticipantV22(participantState, getInitialTrackSwitchOffState, setPriority, setRenderHint, clearTrackHint, options) {
          var _this = _super.call(this, participantState.sid, participantState.identity) || this;
          options = Object.assign({
            RemoteTrackPublicationV2
          }, options);
          Object.defineProperties(_this, {
            _revision: {
              writable: true,
              value: null
            },
            _RemoteTrackPublicationV2: {
              value: options.RemoteTrackPublicationV2
            },
            _getInitialTrackSwitchOffState: {
              value: getInitialTrackSwitchOffState
            },
            updateSubscriberTrackPriority: {
              value: function(trackSid, priority) {
                return setPriority(trackSid, priority);
              }
            },
            updateTrackRenderHint: {
              value: function(trackSid, renderHint) {
                return setRenderHint(trackSid, renderHint);
              }
            },
            clearTrackHint: {
              value: function(trackSid) {
                return clearTrackHint(trackSid);
              }
            },
            revision: {
              enumerable: true,
              get: function() {
                return this._revision;
              }
            }
          });
          return _this.update(participantState);
        }
        RemoteParticipantV22.prototype._getOrCreateTrack = function(trackState) {
          var RemoteTrackPublicationV22 = this._RemoteTrackPublicationV2;
          var track = this.tracks.get(trackState.sid);
          if (!track) {
            var isSwitchedOff = this._getInitialTrackSwitchOffState(trackState.sid);
            track = new RemoteTrackPublicationV22(trackState, isSwitchedOff);
            this.addTrack(track);
          }
          return track;
        };
        RemoteParticipantV22.prototype.update = function(participantState) {
          var _this = this;
          if (this.revision !== null && participantState.revision <= this.revision) {
            return this;
          }
          this._revision = participantState.revision;
          var tracksToKeep = /* @__PURE__ */ new Set();
          participantState.tracks.forEach(function(trackState) {
            var track = _this._getOrCreateTrack(trackState);
            track.update(trackState);
            tracksToKeep.add(track);
          });
          this.tracks.forEach(function(track) {
            if (!tracksToKeep.has(track)) {
              _this.removeTrack(track);
            }
          });
          switch (participantState.state) {
            case "disconnected":
              this.disconnect();
              break;
            case "reconnecting":
              this.reconnecting();
              break;
            case "connected":
              this.connect(this.sid, this.identity);
              break;
          }
          return this;
        };
        return RemoteParticipantV22;
      }(RemoteParticipantSignaling)
    );
    module.exports = RemoteParticipantV2;
  }
});

// node_modules/twilio-video/es5/signaling/v2/trackprioritysignaling.js
var require_trackprioritysignaling = __commonJS({
  "node_modules/twilio-video/es5/signaling/v2/trackprioritysignaling.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var MediaSignaling = require_mediasignaling();
    var TrackPrioritySignaling = (
      /** @class */
      function(_super) {
        __extends(TrackPrioritySignaling2, _super);
        function TrackPrioritySignaling2(getReceiver, options) {
          var _this = _super.call(this, getReceiver, "track_priority", options) || this;
          Object.defineProperties(_this, {
            _enqueuedPriorityUpdates: {
              value: /* @__PURE__ */ new Map()
            }
          });
          _this.on("ready", function(transport) {
            Array.from(_this._enqueuedPriorityUpdates.keys()).forEach(function(trackSid) {
              transport.publish({
                type: "track_priority",
                track: trackSid,
                subscribe: _this._enqueuedPriorityUpdates.get(trackSid)
              });
            });
          });
          return _this;
        }
        TrackPrioritySignaling2.prototype.sendTrackPriorityUpdate = function(trackSid, publishOrSubscribe, priority) {
          if (publishOrSubscribe !== "subscribe") {
            throw new Error("only subscribe priorities are supported, found: " + publishOrSubscribe);
          }
          this._enqueuedPriorityUpdates.set(trackSid, priority);
          if (this._transport) {
            this._transport.publish({
              type: "track_priority",
              track: trackSid,
              subscribe: priority
            });
          }
        };
        return TrackPrioritySignaling2;
      }(MediaSignaling)
    );
    module.exports = TrackPrioritySignaling;
  }
});

// node_modules/twilio-video/es5/signaling/v2/trackswitchoffsignaling.js
var require_trackswitchoffsignaling = __commonJS({
  "node_modules/twilio-video/es5/signaling/v2/trackswitchoffsignaling.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var MediaSignaling = require_mediasignaling();
    var TrackSwitchOffSignaling = (
      /** @class */
      function(_super) {
        __extends(TrackSwitchOffSignaling2, _super);
        function TrackSwitchOffSignaling2(getReceiver, options) {
          var _this = _super.call(this, getReceiver, "track_switch_off", options) || this;
          _this.on("ready", function(transport) {
            transport.on("message", function(message) {
              switch (message.type) {
                case "track_switch_off":
                  _this._setTrackSwitchOffUpdates(message.off || [], message.on || []);
                  break;
                default:
                  break;
              }
            });
          });
          return _this;
        }
        TrackSwitchOffSignaling2.prototype._setTrackSwitchOffUpdates = function(tracksSwitchedOff, tracksSwitchedOn) {
          this.emit("updated", tracksSwitchedOff, tracksSwitchedOn);
        };
        return TrackSwitchOffSignaling2;
      }(MediaSignaling)
    );
    module.exports = TrackSwitchOffSignaling;
  }
});

// node_modules/twilio-video/es5/signaling/v2/renderhintssignaling.js
var require_renderhintssignaling = __commonJS({
  "node_modules/twilio-video/es5/signaling/v2/renderhintssignaling.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var MediaSignaling = require_mediasignaling();
    var Timeout = require_timeout();
    var isDeepEqual = require_util2().isDeepEqual;
    var RENDER_HINT_RESPONSE_TIME_MS = 2e3;
    var messageId = 1;
    var RenderHintsSignaling = (
      /** @class */
      function(_super) {
        __extends(RenderHintsSignaling2, _super);
        function RenderHintsSignaling2(getReceiver, options) {
          var _this = _super.call(this, getReceiver, "render_hints", options) || this;
          Object.defineProperties(_this, {
            _trackSidsToRenderHints: {
              value: /* @__PURE__ */ new Map()
            },
            _responseTimer: {
              value: new Timeout(function() {
                _this._sendAllHints();
                _this._responseTimer.setDelay(_this._responseTimer.delay * 2);
              }, RENDER_HINT_RESPONSE_TIME_MS, false)
            }
          });
          _this.on("ready", function(transport) {
            transport.on("message", function(message) {
              _this._log.debug("Incoming: ", message);
              switch (message.type) {
                case "render_hints":
                  _this._processHintResults(message && message.subscriber && message.subscriber.hints || []);
                  break;
                default:
                  _this._log.warn("Unknown message type: ", message.type);
                  break;
              }
            });
            _this._sendAllHints();
          });
          return _this;
        }
        RenderHintsSignaling2.prototype._sendAllHints = function() {
          var _this = this;
          Array.from(this._trackSidsToRenderHints.keys()).forEach(function(trackSid) {
            var trackState = _this._trackSidsToRenderHints.get(trackSid);
            if (trackState.renderDimensions) {
              trackState.isDimensionDirty = true;
            }
            if ("enabled" in trackState) {
              trackState.isEnabledDirty = true;
            }
          });
          this._sendHints();
        };
        RenderHintsSignaling2.prototype._processHintResults = function(hintResults) {
          var _this = this;
          this._responseTimer.clear();
          this._responseTimer.setDelay(RENDER_HINT_RESPONSE_TIME_MS);
          hintResults.forEach(function(hintResult) {
            if (hintResult.result !== "OK") {
              _this._log.debug("Server error processing hint:", hintResult);
            }
          });
          this._sendHints();
        };
        RenderHintsSignaling2.prototype._sendHints = function() {
          var _this = this;
          if (!this._transport || this._responseTimer.isSet) {
            return;
          }
          var hints = [];
          Array.from(this._trackSidsToRenderHints.keys()).forEach(function(trackSid) {
            var trackState = _this._trackSidsToRenderHints.get(trackSid);
            if (trackState.isEnabledDirty || trackState.isDimensionDirty) {
              var mspHint = {
                "track": trackSid
              };
              if (trackState.isEnabledDirty) {
                mspHint.enabled = trackState.enabled;
                trackState.isEnabledDirty = false;
              }
              if (trackState.isDimensionDirty) {
                mspHint.render_dimensions = trackState.renderDimensions;
                trackState.isDimensionDirty = false;
              }
              hints.push(mspHint);
            }
          });
          if (hints.length > 0) {
            var payLoad = {
              type: "render_hints",
              subscriber: {
                id: messageId++,
                hints
              }
            };
            this._log.debug("Outgoing: ", payLoad);
            this._transport.publish(payLoad);
            this._responseTimer.start();
          }
        };
        RenderHintsSignaling2.prototype.setTrackHint = function(trackSid, renderHint) {
          var trackState = this._trackSidsToRenderHints.get(trackSid) || { isEnabledDirty: false, isDimensionDirty: false };
          if ("enabled" in renderHint && trackState.enabled !== renderHint.enabled) {
            trackState.enabled = !!renderHint.enabled;
            trackState.isEnabledDirty = true;
          }
          if (renderHint.renderDimensions && !isDeepEqual(renderHint.renderDimensions, trackState.renderDimensions)) {
            trackState.renderDimensions = renderHint.renderDimensions;
            trackState.isDimensionDirty = true;
          }
          this._trackSidsToRenderHints.set(trackSid, trackState);
          this._sendHints();
        };
        RenderHintsSignaling2.prototype.clearTrackHint = function(trackSid) {
          this._trackSidsToRenderHints.delete(trackSid);
        };
        return RenderHintsSignaling2;
      }(MediaSignaling)
    );
    module.exports = RenderHintsSignaling;
  }
});

// node_modules/twilio-video/es5/signaling/v2/publisherhintsignaling.js
var require_publisherhintsignaling = __commonJS({
  "node_modules/twilio-video/es5/signaling/v2/publisherhintsignaling.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var MediaSignaling = require_mediasignaling();
    var messageId = 1;
    var PublisherHintsSignaling = (
      /** @class */
      function(_super) {
        __extends(PublisherHintsSignaling2, _super);
        function PublisherHintsSignaling2(getReceiver, options) {
          var _this = _super.call(this, getReceiver, "publisher_hints", options) || this;
          _this.on("ready", function(transport) {
            _this._log.debug("publisher_hints transport ready:", transport);
            transport.on("message", function(message) {
              _this._log.debug("Incoming: ", message);
              switch (message.type) {
                case "publisher_hints":
                  if (message.publisher && message.publisher.hints && message.publisher.id) {
                    _this._processPublisherHints(message.publisher.hints, message.publisher.id);
                  }
                  break;
                default:
                  _this._log.warn("Unknown message type: ", message.type);
                  break;
              }
            });
          });
          return _this;
        }
        PublisherHintsSignaling2.prototype.sendTrackReplaced = function(_a) {
          var trackSid = _a.trackSid;
          if (!this._transport) {
            return;
          }
          var payLoad = {
            type: "client_reset",
            track: trackSid,
            id: messageId++
          };
          this._log.debug("Outgoing: ", payLoad);
          this._transport.publish(payLoad);
        };
        PublisherHintsSignaling2.prototype.sendHintResponse = function(_a) {
          var id = _a.id, hints = _a.hints;
          if (!this._transport) {
            return;
          }
          var payLoad = {
            type: "publisher_hints",
            id,
            hints
          };
          this._log.debug("Outgoing: ", payLoad);
          this._transport.publish(payLoad);
        };
        PublisherHintsSignaling2.prototype._processPublisherHints = function(hints, id) {
          try {
            this.emit("updated", hints, id);
          } catch (ex) {
            this._log.error("error processing hints:", ex);
          }
        };
        return PublisherHintsSignaling2;
      }(MediaSignaling)
    );
    module.exports = PublisherHintsSignaling;
  }
});

// node_modules/twilio-video/es5/signaling/v2/room.js
var require_room3 = __commonJS({
  "node_modules/twilio-video/es5/signaling/v2/room.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var DominantSpeakerSignaling = require_dominantspeakersignaling();
    var NetworkQualityMonitor = require_networkqualitymonitor();
    var NetworkQualitySignaling = require_networkqualitysignaling();
    var RecordingV2 = require_recording2();
    var RoomSignaling = require_room2();
    var RemoteParticipantV2 = require_remoteparticipant3();
    var StatsReport = require_statsreport();
    var TrackPrioritySignaling = require_trackprioritysignaling();
    var TrackSwitchOffSignaling = require_trackswitchoffsignaling();
    var RenderHintsSignaling = require_renderhintssignaling();
    var PublisherHintsSignaling = require_publisherhintsignaling();
    var _a = require_util2();
    var DEFAULT_SESSION_TIMEOUT_SEC = _a.constants.DEFAULT_SESSION_TIMEOUT_SEC;
    var createBandwidthProfilePayload = _a.createBandwidthProfilePayload;
    var defer = _a.defer;
    var difference = _a.difference;
    var filterObject = _a.filterObject;
    var flatMap = _a.flatMap;
    var oncePerTick = _a.oncePerTick;
    var MovingAverageDelta = require_movingaveragedelta();
    var createTwilioError = require_twilio_video_errors().createTwilioError;
    var STATS_PUBLISH_INTERVAL_MS = 1e4;
    var RoomV2 = (
      /** @class */
      function(_super) {
        __extends(RoomV22, _super);
        function RoomV22(localParticipant, initialState, transport, peerConnectionManager, options) {
          var _this = this;
          initialState.options = Object.assign({
            session_timeout: DEFAULT_SESSION_TIMEOUT_SEC
          }, initialState.options);
          options = Object.assign({
            DominantSpeakerSignaling,
            NetworkQualityMonitor,
            NetworkQualitySignaling,
            RecordingSignaling: RecordingV2,
            RemoteParticipantV2,
            TrackPrioritySignaling,
            TrackSwitchOffSignaling,
            bandwidthProfile: null,
            sessionTimeout: initialState.options.session_timeout * 1e3,
            statsPublishIntervalMs: STATS_PUBLISH_INTERVAL_MS
          }, options);
          localParticipant.setBandwidthProfile(options.bandwidthProfile);
          var _a2 = initialState.options, signalingRegion = _a2.signaling_region, _b = _a2.audio_processors, audioProcessors = _b === void 0 ? [] : _b;
          localParticipant.setSignalingRegion(signalingRegion);
          if (audioProcessors.includes("krisp")) {
            audioProcessors.push("rnnoise");
          }
          localParticipant.setAudioProcessors(audioProcessors);
          peerConnectionManager.setIceReconnectTimeout(options.sessionTimeout);
          _this = _super.call(this, localParticipant, initialState.sid, initialState.name, options) || this;
          var getTrackReceiver = function(id) {
            return _this._getTrackReceiver(id);
          };
          var log = _this._log;
          Object.defineProperties(_this, {
            _disconnectedParticipantRevisions: {
              value: /* @__PURE__ */ new Map()
            },
            _NetworkQualityMonitor: {
              value: options.NetworkQualityMonitor
            },
            _lastBandwidthProfileRevision: {
              value: localParticipant.bandwidthProfileRevision,
              writable: true
            },
            _mediaStatesWarningsRevision: {
              value: 0,
              writable: true
            },
            _networkQualityMonitor: {
              value: null,
              writable: true
            },
            _networkQualityConfiguration: {
              value: localParticipant.networkQualityConfiguration
            },
            _peerConnectionManager: {
              value: peerConnectionManager
            },
            _published: {
              value: /* @__PURE__ */ new Map()
            },
            _publishedRevision: {
              value: 0,
              writable: true
            },
            _RemoteParticipantV2: {
              value: options.RemoteParticipantV2
            },
            _subscribed: {
              value: /* @__PURE__ */ new Map()
            },
            _subscribedRevision: {
              value: 0,
              writable: true
            },
            _subscriptionFailures: {
              value: /* @__PURE__ */ new Map()
            },
            _dominantSpeakerSignaling: {
              value: new options.DominantSpeakerSignaling(getTrackReceiver, { log })
            },
            _networkQualitySignaling: {
              value: new options.NetworkQualitySignaling(getTrackReceiver, localParticipant.networkQualityConfiguration, { log })
            },
            _renderHintsSignaling: {
              value: new RenderHintsSignaling(getTrackReceiver, { log })
            },
            _publisherHintsSignaling: {
              value: new PublisherHintsSignaling(getTrackReceiver, { log })
            },
            _trackPrioritySignaling: {
              value: new options.TrackPrioritySignaling(getTrackReceiver, { log })
            },
            _trackSwitchOffSignaling: {
              value: new options.TrackSwitchOffSignaling(getTrackReceiver, { log })
            },
            _pendingSwitchOffStates: {
              value: /* @__PURE__ */ new Map()
            },
            _transport: {
              value: transport
            },
            _trackReceiverDeferreds: {
              value: /* @__PURE__ */ new Map()
            },
            mediaRegion: {
              enumerable: true,
              value: initialState.options.media_region || null
            }
          });
          _this._initTrackSwitchOffSignaling();
          _this._initDominantSpeakerSignaling();
          _this._initNetworkQualityMonitorSignaling();
          _this._initPublisherHintSignaling();
          handleLocalParticipantEvents(_this, localParticipant);
          handlePeerConnectionEvents(_this, peerConnectionManager);
          handleTransportEvents(_this, transport);
          periodicallyPublishStats(_this, transport, options.statsPublishIntervalMs);
          _this._update(initialState);
          _this._peerConnectionManager.setEffectiveAdaptiveSimulcast(_this._publisherHintsSignaling.isSetup);
          return _this;
        }
        Object.defineProperty(RoomV22.prototype, "connectionState", {
          /**
           * The PeerConnection state.
           * @property {RTCPeerConnectionState}
           */
          get: function() {
            return this._peerConnectionManager.connectionState;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(RoomV22.prototype, "signalingConnectionState", {
          /**
           * The Signaling Connection State.
           * @property {string} - "connected", "reconnecting", "disconnected"
           */
          get: function() {
            return this._transport.state === "syncing" ? "reconnecting" : this._transport.state;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(RoomV22.prototype, "iceConnectionState", {
          /**
           * The Ice Connection State.
           * @property {RTCIceConnectionState}
           */
          get: function() {
            return this._peerConnectionManager.iceConnectionState;
          },
          enumerable: false,
          configurable: true
        });
        RoomV22.prototype._deleteTrackReceiverDeferred = function(id) {
          return this._trackReceiverDeferreds.delete(id);
        };
        RoomV22.prototype._getOrCreateTrackReceiverDeferred = function(id) {
          var deferred = this._trackReceiverDeferreds.get(id) || defer();
          var trackReceivers = this._peerConnectionManager.getTrackReceivers();
          var trackReceiver = trackReceivers.find(function(trackReceiver2) {
            return trackReceiver2.id === id && trackReceiver2.readyState !== "ended";
          });
          if (trackReceiver) {
            deferred.resolve(trackReceiver);
          } else {
            this._trackReceiverDeferreds.set(id, deferred);
          }
          return deferred;
        };
        RoomV22.prototype._addTrackReceiver = function(trackReceiver) {
          var deferred = this._getOrCreateTrackReceiverDeferred(trackReceiver.id);
          deferred.resolve(trackReceiver);
          return this;
        };
        RoomV22.prototype._disconnect = function(error) {
          var didDisconnect = _super.prototype._disconnect.call(this, error);
          if (didDisconnect) {
            this._teardownNetworkQualityMonitor();
            this._transport.disconnect();
            this._peerConnectionManager.close();
          }
          this.localParticipant.tracks.forEach(function(track) {
            track.publishFailed(error || new Error("LocalParticipant disconnected"));
          });
          return didDisconnect;
        };
        RoomV22.prototype._getTrackReceiver = function(id) {
          var _this = this;
          return this._getOrCreateTrackReceiverDeferred(id).promise.then(function(trackReceiver) {
            _this._deleteTrackReceiverDeferred(id);
            return trackReceiver;
          });
        };
        RoomV22.prototype._getInitialTrackSwitchOffState = function(trackSid) {
          var initiallySwitchedOff = this._pendingSwitchOffStates.get(trackSid) || false;
          this._pendingSwitchOffStates.delete(trackSid);
          if (initiallySwitchedOff) {
            this._log.warn("[" + trackSid + "] was initially switched off! ");
          }
          return initiallySwitchedOff;
        };
        RoomV22.prototype._getTrackSidsToTrackSignalings = function() {
          var trackSidsToTrackSignalings = flatMap(this.participants, function(participant) {
            return Array.from(participant.tracks);
          });
          return new Map(trackSidsToTrackSignalings);
        };
        RoomV22.prototype._getOrCreateRemoteParticipant = function(participantState) {
          var _this = this;
          var RemoteParticipantV22 = this._RemoteParticipantV2;
          var participant = this.participants.get(participantState.sid);
          var self = this;
          if (!participant) {
            participant = new RemoteParticipantV22(participantState, function(trackSid) {
              return _this._getInitialTrackSwitchOffState(trackSid);
            }, function(trackSid, priority) {
              return _this._trackPrioritySignaling.sendTrackPriorityUpdate(trackSid, "subscribe", priority);
            }, function(trackSid, hint) {
              return _this._renderHintsSignaling.setTrackHint(trackSid, hint);
            }, function(trackSid) {
              return _this._renderHintsSignaling.clearTrackHint(trackSid);
            });
            participant.on("stateChanged", function stateChanged(state) {
              if (state === "disconnected") {
                participant.removeListener("stateChanged", stateChanged);
                self.participants.delete(participant.sid);
                self._disconnectedParticipantRevisions.set(participant.sid, participant.revision);
              }
            });
            this.connectParticipant(participant);
          }
          return participant;
        };
        RoomV22.prototype._getState = function() {
          return {
            participant: this.localParticipant.getState()
          };
        };
        RoomV22.prototype._maybeAddBandwidthProfile = function(update) {
          var _a2 = this.localParticipant, bandwidthProfile = _a2.bandwidthProfile, bandwidthProfileRevision = _a2.bandwidthProfileRevision;
          if (bandwidthProfile && this._lastBandwidthProfileRevision < bandwidthProfileRevision) {
            this._lastBandwidthProfileRevision = bandwidthProfileRevision;
            return Object.assign({
              bandwidth_profile: createBandwidthProfilePayload(bandwidthProfile)
            }, update);
          }
          return update;
        };
        RoomV22.prototype._publishNewLocalParticipantState = function() {
          this._transport.publish(this._maybeAddBandwidthProfile(this._getState()));
        };
        RoomV22.prototype._publishPeerConnectionState = function(peerConnectionState) {
          this._transport.publish(Object.assign({
            peer_connections: [peerConnectionState]
          }, this._getState()));
        };
        RoomV22.prototype._update = function(roomState) {
          var _this = this;
          if (roomState.subscribed && roomState.subscribed.revision > this._subscribedRevision) {
            this._subscribedRevision = roomState.subscribed.revision;
            roomState.subscribed.tracks.forEach(function(trackState) {
              if (trackState.id) {
                _this._subscriptionFailures.delete(trackState.sid);
                _this._subscribed.set(trackState.sid, trackState.id);
              } else if (trackState.error && !_this._subscriptionFailures.has(trackState.sid)) {
                _this._subscriptionFailures.set(trackState.sid, trackState.error);
              }
            });
            var subscribedTrackSids_1 = new Set(roomState.subscribed.tracks.filter(function(trackState) {
              return !!trackState.id;
            }).map(function(trackState) {
              return trackState.sid;
            }));
            this._subscribed.forEach(function(trackId, trackSid) {
              if (!subscribedTrackSids_1.has(trackSid)) {
                _this._subscribed.delete(trackSid);
              }
            });
          }
          var participantsToKeep = /* @__PURE__ */ new Set();
          (roomState.participants || []).forEach(function(participantState) {
            if (participantState.sid === _this.localParticipant.sid) {
              return;
            }
            var disconnectedParticipantRevision = _this._disconnectedParticipantRevisions.get(participantState.sid);
            if (disconnectedParticipantRevision && participantState.revision <= disconnectedParticipantRevision) {
              return;
            }
            if (disconnectedParticipantRevision) {
              _this._disconnectedParticipantRevisions.delete(participantState.sid);
            }
            var participant = _this._getOrCreateRemoteParticipant(participantState);
            participant.update(participantState);
            participantsToKeep.add(participant);
          });
          if (roomState.type === "synced") {
            this.participants.forEach(function(participant) {
              if (!participantsToKeep.has(participant)) {
                participant.disconnect();
              }
            });
          }
          handleSubscriptions(this);
          if (roomState.peer_connections) {
            this._peerConnectionManager.update(roomState.peer_connections, roomState.type === "synced");
          }
          if (roomState.recording) {
            this.recording.update(roomState.recording);
          }
          if (roomState.published && roomState.published.revision > this._publishedRevision) {
            this._publishedRevision = roomState.published.revision;
            roomState.published.tracks.forEach(function(track) {
              if (track.sid) {
                _this._published.set(track.id, track.sid);
              }
            });
            this.localParticipant.update(roomState.published);
          }
          if (roomState.participant) {
            this.localParticipant.connect(roomState.participant.sid, roomState.participant.identity);
          }
          [
            this._dominantSpeakerSignaling,
            this._networkQualitySignaling,
            this._trackPrioritySignaling,
            this._trackSwitchOffSignaling,
            this._renderHintsSignaling,
            this._publisherHintsSignaling
          ].forEach(function(mediaSignaling) {
            var channel = mediaSignaling.channel;
            if (!mediaSignaling.isSetup && roomState.media_signaling && roomState.media_signaling[channel] && roomState.media_signaling[channel].transport && roomState.media_signaling[channel].transport.type === "data-channel") {
              mediaSignaling.setup(roomState.media_signaling[channel].transport.label);
            }
          });
          if (roomState.type === "warning" && roomState.states && roomState.states.revision > this._mediaStatesWarningsRevision) {
            this._mediaStatesWarningsRevision = roomState.states.revision;
            this.localParticipant.updateMediaStates(roomState.states);
          }
          return this;
        };
        RoomV22.prototype._initPublisherHintSignaling = function() {
          var _this = this;
          this._publisherHintsSignaling.on("updated", function(hints, id) {
            Promise.all(hints.map(function(hint) {
              return _this.localParticipant.setPublisherHint(hint.track, hint.encodings).then(function(result) {
                return { track: hint.track, result };
              });
            })).then(function(hintResponses) {
              _this._publisherHintsSignaling.sendHintResponse({ id, hints: hintResponses });
            });
          });
          var handleReplaced = function(track) {
            if (track.kind === "video") {
              track.trackTransceiver.on("replaced", function() {
                _this._publisherHintsSignaling.sendTrackReplaced({ trackSid: track.sid });
              });
            }
          };
          Array.from(this.localParticipant.tracks.values()).forEach(function(track) {
            return handleReplaced(track);
          });
          this.localParticipant.on("trackAdded", function(track) {
            return handleReplaced(track);
          });
        };
        RoomV22.prototype._initTrackSwitchOffSignaling = function() {
          var _this = this;
          this._trackSwitchOffSignaling.on("updated", function(tracksOff, tracksOn) {
            try {
              _this._log.debug("received trackSwitch: ", { tracksOn, tracksOff });
              var trackUpdates_1 = /* @__PURE__ */ new Map();
              tracksOn.forEach(function(trackSid) {
                return trackUpdates_1.set(trackSid, true);
              });
              tracksOff.forEach(function(trackSid) {
                if (trackUpdates_1.get(trackSid)) {
                  _this._log.warn(trackSid + " is DUPLICATED in both tracksOff and tracksOn list");
                }
                trackUpdates_1.set(trackSid, false);
              });
              _this.participants.forEach(function(participant) {
                participant.tracks.forEach(function(track) {
                  var isOn = trackUpdates_1.get(track.sid);
                  if (typeof isOn !== "undefined") {
                    track.setSwitchedOff(!isOn);
                    trackUpdates_1.delete(track.sid);
                  }
                });
              });
              trackUpdates_1.forEach(function(isOn, trackSid) {
                return _this._pendingSwitchOffStates.set(trackSid, !isOn);
              });
            } catch (ex) {
              _this._log.error("error processing track switch off:", ex);
            }
          });
        };
        RoomV22.prototype._initDominantSpeakerSignaling = function() {
          var _this = this;
          this._dominantSpeakerSignaling.on("updated", function() {
            return _this.setDominantSpeaker(_this._dominantSpeakerSignaling.loudestParticipantSid);
          });
        };
        RoomV22.prototype._initNetworkQualityMonitorSignaling = function() {
          var _this = this;
          this._networkQualitySignaling.on("ready", function() {
            var networkQualityMonitor = new _this._NetworkQualityMonitor(_this._peerConnectionManager, _this._networkQualitySignaling);
            _this._networkQualityMonitor = networkQualityMonitor;
            networkQualityMonitor.on("updated", function() {
              if (_this.iceConnectionState === "failed") {
                return;
              }
              _this.localParticipant.setNetworkQualityLevel(networkQualityMonitor.level, networkQualityMonitor.levels);
              _this.participants.forEach(function(participant) {
                var levels = networkQualityMonitor.remoteLevels.get(participant.sid);
                if (levels) {
                  participant.setNetworkQualityLevel(levels.level, levels);
                }
              });
            });
            networkQualityMonitor.start();
          });
          this._networkQualitySignaling.on("teardown", function() {
            return _this._teardownNetworkQualityMonitor();
          });
        };
        RoomV22.prototype._teardownNetworkQualityMonitor = function() {
          if (this._networkQualityMonitor) {
            this._networkQualityMonitor.stop();
            this._networkQualityMonitor = null;
          }
        };
        RoomV22.prototype.getStats = function() {
          var _this = this;
          return this._peerConnectionManager.getStats().then(function(responses) {
            return new Map(Array.from(responses).map(function(_a2) {
              var _b = __read(_a2, 2), id = _b[0], response = _b[1];
              return [id, Object.assign({}, response, {
                localAudioTrackStats: filterAndAddLocalTrackSids(_this, response.localAudioTrackStats),
                localVideoTrackStats: filterAndAddLocalTrackSids(_this, response.localVideoTrackStats),
                remoteAudioTrackStats: filterAndAddRemoteTrackSids(_this, response.remoteAudioTrackStats),
                remoteVideoTrackStats: filterAndAddRemoteTrackSids(_this, response.remoteVideoTrackStats)
              })];
            }));
          });
        };
        return RoomV22;
      }(RoomSignaling)
    );
    function filterAndAddTrackSids(idToSid, trackStats) {
      return trackStats.reduce(function(trackStats2, trackStat) {
        var trackSid = idToSid.get(trackStat.trackId);
        return trackSid ? [Object.assign({}, trackStat, { trackSid })].concat(trackStats2) : trackStats2;
      }, []);
    }
    function filterAndAddLocalTrackSids(roomV2, localTrackStats) {
      return filterAndAddTrackSids(roomV2._published, localTrackStats);
    }
    function filterAndAddRemoteTrackSids(roomV2, remoteTrackStats) {
      var idToSid = new Map(Array.from(roomV2._subscribed.entries()).map(function(_a2) {
        var _b = __read(_a2, 2), sid = _b[0], id = _b[1];
        return [id, sid];
      }));
      return filterAndAddTrackSids(idToSid, remoteTrackStats);
    }
    function handleLocalParticipantEvents(roomV2, localParticipant) {
      var localParticipantUpdated = oncePerTick(function() {
        roomV2._publishNewLocalParticipantState();
      });
      var renegotiate = oncePerTick(function() {
        var trackSenders = flatMap(localParticipant.tracks, function(trackV2) {
          return trackV2.trackTransceiver;
        });
        roomV2._peerConnectionManager.setTrackSenders(trackSenders);
      });
      localParticipant.on("trackAdded", renegotiate);
      localParticipant.on("trackRemoved", renegotiate);
      localParticipant.on("updated", localParticipantUpdated);
      roomV2.on("stateChanged", function stateChanged(state) {
        if (state === "disconnected") {
          localParticipant.removeListener("trackAdded", renegotiate);
          localParticipant.removeListener("trackRemoved", renegotiate);
          localParticipant.removeListener("updated", localParticipantUpdated);
          roomV2.removeListener("stateChanged", stateChanged);
          localParticipant.disconnect();
        }
      });
      roomV2.on("signalingConnectionStateChanged", function() {
        var localParticipant2 = roomV2.localParticipant, signalingConnectionState = roomV2.signalingConnectionState;
        var identity = localParticipant2.identity, sid = localParticipant2.sid;
        switch (signalingConnectionState) {
          case "connected":
            localParticipant2.connect(sid, identity);
            break;
          case "reconnecting":
            localParticipant2.reconnecting();
            break;
        }
      });
    }
    function handlePeerConnectionEvents(roomV2, peerConnectionManager) {
      peerConnectionManager.on("description", function onDescription(description) {
        roomV2._publishPeerConnectionState(description);
      });
      peerConnectionManager.dequeue("description");
      peerConnectionManager.on("candidates", function onCandidates(candidates) {
        roomV2._publishPeerConnectionState(candidates);
      });
      peerConnectionManager.dequeue("candidates");
      peerConnectionManager.on("trackAdded", roomV2._addTrackReceiver.bind(roomV2));
      peerConnectionManager.dequeue("trackAdded");
      peerConnectionManager.getTrackReceivers().forEach(roomV2._addTrackReceiver, roomV2);
      peerConnectionManager.on("connectionStateChanged", function() {
        roomV2.emit("connectionStateChanged");
      });
      peerConnectionManager.on("iceConnectionStateChanged", function() {
        roomV2.emit("iceConnectionStateChanged");
        if (roomV2.iceConnectionState === "failed") {
          if (roomV2.localParticipant.networkQualityLevel !== null) {
            roomV2.localParticipant.setNetworkQualityLevel(0);
          }
          roomV2.participants.forEach(function(participant) {
            if (participant.networkQualityLevel !== null) {
              participant.setNetworkQualityLevel(0);
            }
          });
        }
      });
    }
    function handleTransportEvents(roomV2, transport) {
      transport.on("message", roomV2._update.bind(roomV2));
      transport.on("stateChanged", function stateChanged(state, error) {
        if (state === "disconnected") {
          if (roomV2.state !== "disconnected") {
            roomV2._disconnect(error);
          }
          transport.removeListener("stateChanged", stateChanged);
        }
        roomV2.emit("signalingConnectionStateChanged");
      });
    }
    function periodicallyPublishStats(roomV2, transport, intervalMs) {
      var movingAverageDeltas = /* @__PURE__ */ new Map();
      var oddPublishCount = false;
      var interval = setInterval(function() {
        roomV2.getStats().then(function(stats) {
          oddPublishCount = !oddPublishCount;
          stats.forEach(function(response, id) {
            var report = new StatsReport(
              id,
              response,
              true
              /* prepareForInsights */
            );
            transport.publishEvent("quality", "stats-report", "info", {
              audioTrackStats: report.remoteAudioTrackStats.map(function(trackStat, i) {
                return addAVSyncMetricsToRemoteTrackStats(trackStat, response.remoteAudioTrackStats[i], movingAverageDeltas);
              }),
              localAudioTrackStats: report.localAudioTrackStats.map(function(trackStat, i) {
                return addAVSyncMetricsToLocalTrackStats(trackStat, response.localAudioTrackStats[i], movingAverageDeltas);
              }),
              localVideoTrackStats: report.localVideoTrackStats.map(function(trackStat, i) {
                return addAVSyncMetricsToLocalTrackStats(trackStat, response.localVideoTrackStats[i], movingAverageDeltas);
              }),
              peerConnectionId: report.peerConnectionId,
              videoTrackStats: report.remoteVideoTrackStats.map(function(trackStat, i) {
                return addAVSyncMetricsToRemoteTrackStats(trackStat, response.remoteVideoTrackStats[i], movingAverageDeltas);
              })
            });
            var keys = flatMap([
              "localAudioTrackStats",
              "localVideoTrackStats",
              "remoteAudioTrackStats",
              "remoteVideoTrackStats"
            ], function(prop) {
              return report[prop].map(function(_a2) {
                var ssrc = _a2.ssrc, trackSid = _a2.trackSid;
                return trackSid + "+" + ssrc;
              });
            });
            var movingAverageDeltaKeysToBeRemoved = difference(Array.from(movingAverageDeltas.keys()), keys);
            movingAverageDeltaKeysToBeRemoved.forEach(function(key) {
              return movingAverageDeltas.delete(key);
            });
            if (oddPublishCount) {
              var activeIceCandidatePair = replaceNullsWithDefaults(response.activeIceCandidatePair, report.peerConnectionId);
              transport.publishEvent("quality", "active-ice-candidate-pair", "info", activeIceCandidatePair);
            }
          });
        }, function() {
        });
      }, intervalMs);
      roomV2.on("stateChanged", function onStateChanged(state) {
        if (state === "disconnected") {
          clearInterval(interval);
          roomV2.removeListener("stateChanged", onStateChanged);
        }
      });
    }
    function handleSubscriptions(room) {
      var trackSidsToTrackSignalings = room._getTrackSidsToTrackSignalings();
      room._subscriptionFailures.forEach(function(error, trackSid) {
        var trackSignaling = trackSidsToTrackSignalings.get(trackSid);
        if (trackSignaling) {
          room._subscriptionFailures.delete(trackSid);
          trackSignaling.subscribeFailed(createTwilioError(error.code, error.message));
        }
      });
      trackSidsToTrackSignalings.forEach(function(trackSignaling) {
        var trackId = room._subscribed.get(trackSignaling.sid);
        if (!trackId || trackSignaling.isSubscribed && trackSignaling.trackTransceiver.id !== trackId) {
          trackSignaling.setTrackTransceiver(null);
        }
        if (trackId) {
          room._getTrackReceiver(trackId).then(function(trackReceiver) {
            return trackSignaling.setTrackTransceiver(trackReceiver);
          });
        }
      });
    }
    function addAVSyncMetricsToLocalTrackStats(trackStats, trackResponse, movingAverageDeltas) {
      var framesEncoded = trackResponse.framesEncoded, packetsSent = trackResponse.packetsSent, totalEncodeTime = trackResponse.totalEncodeTime, totalPacketSendDelay = trackResponse.totalPacketSendDelay;
      var augmentedTrackStats = Object.assign({}, trackStats);
      var key = trackStats.trackSid + "+" + trackStats.ssrc;
      var trackMovingAverageDeltas = movingAverageDeltas.get(key) || /* @__PURE__ */ new Map();
      if (typeof totalEncodeTime === "number" && typeof framesEncoded === "number") {
        var trackAvgEncodeDelayMovingAverageDelta = trackMovingAverageDeltas.get("avgEncodeDelay") || new MovingAverageDelta();
        trackAvgEncodeDelayMovingAverageDelta.putSample(totalEncodeTime * 1e3, framesEncoded);
        augmentedTrackStats.avgEncodeDelay = Math.round(trackAvgEncodeDelayMovingAverageDelta.get());
        trackMovingAverageDeltas.set("avgEncodeDelay", trackAvgEncodeDelayMovingAverageDelta);
      }
      if (typeof totalPacketSendDelay === "number" && typeof packetsSent === "number") {
        var trackAvgPacketSendDelayMovingAverageDelta = trackMovingAverageDeltas.get("avgPacketSendDelay") || new MovingAverageDelta();
        trackAvgPacketSendDelayMovingAverageDelta.putSample(totalPacketSendDelay * 1e3, packetsSent);
        augmentedTrackStats.avgPacketSendDelay = Math.round(trackAvgPacketSendDelayMovingAverageDelta.get());
        trackMovingAverageDeltas.set("avgPacketSendDelay", trackAvgPacketSendDelayMovingAverageDelta);
      }
      movingAverageDeltas.set(key, trackMovingAverageDeltas);
      return augmentedTrackStats;
    }
    function addAVSyncMetricsToRemoteTrackStats(trackStats, trackResponse, movingAverageDeltas) {
      var estimatedPlayoutTimestamp = trackResponse.estimatedPlayoutTimestamp, framesDecoded = trackResponse.framesDecoded, jitterBufferDelay = trackResponse.jitterBufferDelay, jitterBufferEmittedCount = trackResponse.jitterBufferEmittedCount, totalDecodeTime = trackResponse.totalDecodeTime;
      var augmentedTrackStats = Object.assign({}, trackStats);
      var key = trackStats.trackSid + "+" + trackStats.ssrc;
      var trackMovingAverageDeltas = movingAverageDeltas.get(key) || /* @__PURE__ */ new Map();
      if (typeof estimatedPlayoutTimestamp === "number") {
        augmentedTrackStats.estimatedPlayoutTimestamp = estimatedPlayoutTimestamp;
      }
      if (typeof framesDecoded === "number" && typeof totalDecodeTime === "number") {
        var trackAvgDecodeDelayMovingAverageDelta = trackMovingAverageDeltas.get("avgDecodeDelay") || new MovingAverageDelta();
        trackAvgDecodeDelayMovingAverageDelta.putSample(totalDecodeTime * 1e3, framesDecoded);
        augmentedTrackStats.avgDecodeDelay = Math.round(trackAvgDecodeDelayMovingAverageDelta.get());
        trackMovingAverageDeltas.set("avgDecodeDelay", trackAvgDecodeDelayMovingAverageDelta);
      }
      if (typeof jitterBufferDelay === "number" && typeof jitterBufferEmittedCount === "number") {
        var trackAvgJitterBufferDelayMovingAverageDelta = trackMovingAverageDeltas.get("avgJitterBufferDelay") || new MovingAverageDelta();
        trackAvgJitterBufferDelayMovingAverageDelta.putSample(jitterBufferDelay * 1e3, jitterBufferEmittedCount);
        augmentedTrackStats.avgJitterBufferDelay = Math.round(trackAvgJitterBufferDelayMovingAverageDelta.get());
        trackMovingAverageDeltas.set("avgJitterBufferDelay", trackAvgJitterBufferDelayMovingAverageDelta);
      }
      movingAverageDeltas.set(key, trackMovingAverageDeltas);
      return augmentedTrackStats;
    }
    function replaceNullsWithDefaults(activeIceCandidatePair, peerConnectionId) {
      activeIceCandidatePair = Object.assign({
        availableIncomingBitrate: 0,
        availableOutgoingBitrate: 0,
        bytesReceived: 0,
        bytesSent: 0,
        consentRequestsSent: 0,
        currentRoundTripTime: 0,
        lastPacketReceivedTimestamp: 0,
        lastPacketSentTimestamp: 0,
        nominated: false,
        peerConnectionId,
        priority: 0,
        readable: false,
        requestsReceived: 0,
        requestsSent: 0,
        responsesReceived: 0,
        responsesSent: 0,
        retransmissionsReceived: 0,
        retransmissionsSent: 0,
        state: "failed",
        totalRoundTripTime: 0,
        transportId: "",
        writable: false
      }, filterObject(activeIceCandidatePair || {}, null));
      activeIceCandidatePair.localCandidate = Object.assign({
        candidateType: "host",
        deleted: false,
        ip: "",
        port: 0,
        priority: 0,
        protocol: "udp",
        url: ""
      }, filterObject(activeIceCandidatePair.localCandidate || {}, null));
      activeIceCandidatePair.remoteCandidate = Object.assign({
        candidateType: "host",
        ip: "",
        port: 0,
        priority: 0,
        protocol: "udp",
        url: ""
      }, filterObject(activeIceCandidatePair.remoteCandidate || {}, null));
      return activeIceCandidatePair;
    }
    module.exports = RoomV2;
  }
});

// node_modules/twilio-video/es5/signaling/v2/twilioconnectiontransport.js
var require_twilioconnectiontransport = __commonJS({
  "node_modules/twilio-video/es5/signaling/v2/twilioconnectiontransport.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var StateMachine = require_statemachine();
    var TwilioConnection = require_twilioconnection();
    var DefaultBackoff = require_backoff();
    var reconnectBackoffConfig = require_constants().reconnectBackoffConfig;
    var Timeout = require_timeout();
    var _a = require_constants();
    var SDK_NAME = _a.SDK_NAME;
    var SDK_VERSION = _a.SDK_VERSION;
    var SDP_FORMAT = _a.SDP_FORMAT;
    var _b = require_util2();
    var createBandwidthProfilePayload = _b.createBandwidthProfilePayload;
    var createMediaSignalingPayload = _b.createMediaSignalingPayload;
    var createMediaWarningsPayload = _b.createMediaWarningsPayload;
    var createSubscribePayload = _b.createSubscribePayload;
    var getUserAgent = _b.getUserAgent;
    var isNonArrayObject = _b.isNonArrayObject;
    var _c = require_twilio_video_errors();
    var createTwilioError = _c.createTwilioError;
    var RoomCompletedError = _c.RoomCompletedError;
    var SignalingConnectionError = _c.SignalingConnectionError;
    var SignalingServerBusyError = _c.SignalingServerBusyError;
    var ICE_VERSION = 1;
    var RSP_VERSION = 2;
    var states = {
      connecting: [
        "connected",
        "disconnected"
      ],
      connected: [
        "disconnected",
        "syncing"
      ],
      syncing: [
        "connected",
        "disconnected"
      ],
      disconnected: []
    };
    var TwilioConnectionTransport = (
      /** @class */
      function(_super) {
        __extends(TwilioConnectionTransport2, _super);
        function TwilioConnectionTransport2(name, accessToken, localParticipant, peerConnectionManager, wsServer, options) {
          var _this = this;
          options = Object.assign({
            Backoff: DefaultBackoff,
            TwilioConnection,
            iceServers: null,
            trackPriority: true,
            trackSwitchOff: true,
            renderHints: true,
            userAgent: getUserAgent()
          }, options);
          _this = _super.call(this, "connecting", states) || this;
          Object.defineProperties(_this, {
            _accessToken: {
              value: accessToken
            },
            _automaticSubscription: {
              value: options.automaticSubscription
            },
            _bandwidthProfile: {
              value: options.bandwidthProfile
            },
            _dominantSpeaker: {
              value: options.dominantSpeaker
            },
            _adaptiveSimulcast: {
              value: options.adaptiveSimulcast
            },
            _eventObserver: {
              value: options.eventObserver,
              writable: false
            },
            _renderHints: {
              value: options.renderHints
            },
            _iceServersStatus: {
              value: Array.isArray(options.iceServers) ? "overrode" : "acquire"
            },
            _localParticipant: {
              value: localParticipant
            },
            _name: {
              value: name
            },
            _networkQuality: {
              value: isNonArrayObject(options.networkQuality) || options.networkQuality
            },
            _notifyWarnings: {
              value: options.notifyWarnings
            },
            _options: {
              value: options
            },
            _peerConnectionManager: {
              value: peerConnectionManager
            },
            _sessionTimer: {
              value: null,
              writable: true
            },
            _sessionTimeoutMS: {
              value: 0,
              writable: true
            },
            _reconnectBackoff: {
              value: new options.Backoff(reconnectBackoffConfig)
            },
            _session: {
              value: null,
              writable: true
            },
            _trackPriority: {
              value: options.trackPriority
            },
            _trackSwitchOff: {
              value: options.trackSwitchOff
            },
            _twilioConnection: {
              value: null,
              writable: true
            },
            _updatesReceived: {
              value: []
            },
            _updatesToSend: {
              value: []
            },
            _userAgent: {
              value: options.userAgent
            },
            _wsServer: {
              value: wsServer
            }
          });
          setupTransport(_this);
          return _this;
        }
        TwilioConnectionTransport2.prototype._createConnectOrSyncOrDisconnectMessage = function() {
          if (this.state === "connected") {
            return null;
          }
          if (this.state === "disconnected") {
            return {
              session: this._session,
              type: "disconnect",
              version: RSP_VERSION
            };
          }
          var type = {
            connecting: "connect",
            syncing: "sync"
          }[this.state];
          var message = {
            name: this._name,
            participant: this._localParticipant.getState(),
            peer_connections: this._peerConnectionManager.getStates(),
            type,
            version: RSP_VERSION
          };
          if (message.type === "connect") {
            message.ice_servers = this._iceServersStatus;
            message.publisher = {
              name: SDK_NAME,
              sdk_version: SDK_VERSION,
              user_agent: this._userAgent
            };
            if (this._bandwidthProfile) {
              message.bandwidth_profile = createBandwidthProfilePayload(this._bandwidthProfile);
            }
            if (this._notifyWarnings) {
              message.participant.media_warnings = createMediaWarningsPayload(this._notifyWarnings);
            }
            message.media_signaling = createMediaSignalingPayload(this._dominantSpeaker, this._networkQuality, this._trackPriority, this._trackSwitchOff, this._adaptiveSimulcast, this._renderHints);
            message.subscribe = createSubscribePayload(this._automaticSubscription);
            message.format = SDP_FORMAT;
            message.token = this._accessToken;
          } else if (message.type === "sync") {
            message.session = this._session;
            message.token = this._accessToken;
          } else if (message.type === "update") {
            message.session = this._session;
          }
          return message;
        };
        TwilioConnectionTransport2.prototype._createIceMessage = function() {
          return {
            edge: "roaming",
            token: this._accessToken,
            type: "ice",
            version: ICE_VERSION
          };
        };
        TwilioConnectionTransport2.prototype._sendConnectOrSyncOrDisconnectMessage = function() {
          var message = this._createConnectOrSyncOrDisconnectMessage();
          if (message) {
            this._twilioConnection.sendMessage(message);
          }
        };
        TwilioConnectionTransport2.prototype.disconnect = function(error) {
          if (this.state !== "disconnected") {
            this.preempt("disconnected", null, [error]);
            this._sendConnectOrSyncOrDisconnectMessage();
            this._twilioConnection.close();
            return true;
          }
          return false;
        };
        TwilioConnectionTransport2.prototype.publish = function(update) {
          switch (this.state) {
            case "connected":
              this._twilioConnection.sendMessage(Object.assign({
                session: this._session,
                type: "update",
                version: RSP_VERSION
              }, update));
              return true;
            case "connecting":
            case "syncing":
              this._updatesToSend.push(update);
              return true;
            case "disconnected":
            default:
              return false;
          }
        };
        TwilioConnectionTransport2.prototype.publishEvent = function(group, name, level, payload) {
          this._eventObserver.emit("event", { group, name, level, payload });
        };
        TwilioConnectionTransport2.prototype.sync = function() {
          if (this.state === "connected") {
            this.preempt("syncing");
            this._sendConnectOrSyncOrDisconnectMessage();
            return true;
          }
          return false;
        };
        TwilioConnectionTransport2.prototype._setSession = function(session, sessionTimeout) {
          this._session = session;
          this._sessionTimeoutMS = sessionTimeout * 1e3;
        };
        TwilioConnectionTransport2.prototype._getReconnectTimer = function() {
          var _this = this;
          if (this._sessionTimeoutMS === 0) {
            return null;
          }
          if (!this._sessionTimer) {
            this._sessionTimer = new Timeout(function() {
              if (_this._sessionTimer) {
                _this._sessionTimeoutMS = 0;
              }
            }, this._sessionTimeoutMS);
          }
          return new Promise(function(resolve) {
            _this._reconnectBackoff.backoff(resolve);
          });
        };
        TwilioConnectionTransport2.prototype._clearReconnectTimer = function() {
          this._reconnectBackoff.reset();
          if (this._sessionTimer) {
            this._sessionTimer.clear();
            this._sessionTimer = null;
          }
        };
        return TwilioConnectionTransport2;
      }(StateMachine)
    );
    function reducePeerConnections(peerConnections) {
      return Array.from(peerConnections.reduce(function(peerConnectionsById, update) {
        var reduced = peerConnectionsById.get(update.id) || update;
        if (!reduced.description && update.description) {
          reduced.description = update.description;
        } else if (reduced.description && update.description) {
          if (update.description.revision > reduced.description.revision) {
            reduced.description = update.description;
          }
        }
        if (!reduced.ice && update.ice) {
          reduced.ice = update.ice;
        } else if (reduced.ice && update.ice) {
          if (update.ice.revision > reduced.ice.revision) {
            reduced.ice = update.ice;
          }
        }
        peerConnectionsById.set(reduced.id, reduced);
        return peerConnectionsById;
      }, /* @__PURE__ */ new Map()).values());
    }
    function reduceUpdates(updates) {
      return updates.reduce(function(reduced, update) {
        if (!reduced.participant && update.participant) {
          reduced.participant = update.participant;
        } else if (reduced.participant && update.participant) {
          if (update.participant.revision > reduced.participant.revision) {
            reduced.participant = update.participant;
          }
        }
        if (!reduced.peer_connections && update.peer_connections) {
          reduced.peer_connections = reducePeerConnections(update.peer_connections);
        } else if (reduced.peer_connections && update.peer_connections) {
          reduced.peer_connections = reducePeerConnections(reduced.peer_connections.concat(update.peer_connections));
        }
        return reduced;
      }, {});
    }
    function setupTransport(transport) {
      function createOrResetTwilioConnection() {
        if (transport.state === "disconnected") {
          return;
        }
        if (transport._twilioConnection) {
          transport._twilioConnection.removeListener("message", handleMessage);
        }
        var _iceServersStatus2 = transport._iceServersStatus, _options2 = transport._options, _wsServer = transport._wsServer, state = transport.state;
        var TwilioConnection2 = _options2.TwilioConnection;
        var twilioConnection = new TwilioConnection2(_wsServer, Object.assign({
          helloBody: state === "connecting" && _iceServersStatus2 === "acquire" ? transport._createIceMessage() : transport._createConnectOrSyncOrDisconnectMessage()
        }, _options2));
        twilioConnection.once("close", function(reason) {
          if (reason === TwilioConnection2.CloseReason.LOCAL) {
            disconnect();
          } else {
            disconnect(new Error(reason));
          }
        });
        twilioConnection.on("message", handleMessage);
        transport._twilioConnection = twilioConnection;
      }
      function disconnect(error) {
        if (transport.state === "disconnected") {
          return;
        }
        if (!error) {
          transport.disconnect();
          return;
        }
        var reconnectTimer = transport._getReconnectTimer();
        if (!reconnectTimer) {
          var twilioError = error.message === TwilioConnection.CloseReason.BUSY ? new SignalingServerBusyError() : new SignalingConnectionError();
          transport.disconnect(twilioError);
          return;
        }
        if (transport.state === "connected") {
          transport.preempt("syncing");
        }
        reconnectTimer.then(createOrResetTwilioConnection);
      }
      function handleMessage(message) {
        if (transport.state === "disconnected") {
          return;
        }
        if (message.type === "error") {
          transport.disconnect(createTwilioError(message.code, message.message));
          return;
        }
        switch (transport.state) {
          case "connected":
            switch (message.type) {
              case "connected":
              case "synced":
              case "update":
              case "warning":
                transport.emit("message", message);
                return;
              case "disconnected":
                transport.disconnect(message.status === "completed" ? new RoomCompletedError() : null);
                return;
              default:
                return;
            }
          case "connecting":
            switch (message.type) {
              case "iced":
                transport._options.onIced(message.ice_servers).then(function() {
                  transport._sendConnectOrSyncOrDisconnectMessage();
                });
                return;
              case "connected":
                transport._setSession(message.session, message.options.session_timeout);
                transport.emit("connected", message);
                transport.preempt("connected");
                return;
              case "synced":
              case "update":
                transport._updatesReceived.push(message);
                return;
              case "disconnected":
                transport.disconnect(message.status === "completed" ? new RoomCompletedError() : null);
                return;
              default:
                return;
            }
          case "syncing":
            switch (message.type) {
              case "connected":
              case "update":
                transport._updatesReceived.push(message);
                return;
              case "synced":
                transport._clearReconnectTimer();
                transport.emit("message", message);
                transport.preempt("connected");
                return;
              case "disconnected":
                transport.disconnect(message.status === "completed" ? new RoomCompletedError() : null);
                return;
              default:
                return;
            }
          default:
            return;
        }
      }
      transport.on("stateChanged", function stateChanged(state) {
        switch (state) {
          case "connected": {
            var updates = transport._updatesToSend.splice(0);
            if (updates.length) {
              transport.publish(reduceUpdates(updates));
            }
            transport._updatesReceived.splice(0).forEach(function(update) {
              return transport.emit("message", update);
            });
            return;
          }
          case "disconnected":
            transport._twilioConnection.removeListener("message", handleMessage);
            transport.removeListener("stateChanged", stateChanged);
            return;
          case "syncing":
            return;
          default:
            return;
        }
      });
      var _options = transport._options, _iceServersStatus = transport._iceServersStatus;
      var iceServers = _options.iceServers, onIced = _options.onIced;
      if (_iceServersStatus === "overrode") {
        onIced(iceServers).then(createOrResetTwilioConnection);
      } else {
        createOrResetTwilioConnection();
      }
    }
    module.exports = TwilioConnectionTransport;
  }
});

// node_modules/twilio-video/es5/signaling/v2/cancelableroomsignalingpromise.js
var require_cancelableroomsignalingpromise = __commonJS({
  "node_modules/twilio-video/es5/signaling/v2/cancelableroomsignalingpromise.js"(exports, module) {
    "use strict";
    var CancelablePromise = require_cancelablepromise();
    var DefaultPeerConnectionManager = require_peerconnectionmanager();
    var DefaultRoomV2 = require_room3();
    var DefaultTransport = require_twilioconnectiontransport();
    var _a = require_twilio_video_errors();
    var SignalingConnectionDisconnectedError = _a.SignalingConnectionDisconnectedError;
    var SignalingIncomingMessageInvalidError = _a.SignalingIncomingMessageInvalidError;
    var _b = require_util2();
    var flatMap = _b.flatMap;
    var createRoomConnectEventPayload = _b.createRoomConnectEventPayload;
    function createCancelableRoomSignalingPromise(token, wsServer, localParticipant, encodingParameters, preferredCodecs, options) {
      options = Object.assign({
        PeerConnectionManager: DefaultPeerConnectionManager,
        RoomV2: DefaultRoomV2,
        Transport: DefaultTransport
      }, options);
      var adaptiveSimulcast = preferredCodecs.video[0] && preferredCodecs.video[0].adaptiveSimulcast === true;
      var PeerConnectionManager = options.PeerConnectionManager, RoomV2 = options.RoomV2, Transport = options.Transport, iceServers = options.iceServers, log = options.log;
      var peerConnectionManager = new PeerConnectionManager(encodingParameters, preferredCodecs, options);
      var trackSenders = flatMap(localParticipant.tracks, function(trackV2) {
        return [trackV2.trackTransceiver];
      });
      peerConnectionManager.setTrackSenders(trackSenders);
      var cancellationError = new Error("Canceled");
      var transport;
      var cancelablePromise = new CancelablePromise(function(resolve, reject, isCanceled) {
        var onIced = function(iceServers2) {
          if (isCanceled()) {
            reject(cancellationError);
            return Promise.reject(cancellationError);
          }
          log.debug("Got ICE servers:", iceServers2);
          options.iceServers = iceServers2;
          peerConnectionManager.setConfiguration(options);
          return peerConnectionManager.createAndOffer().then(function() {
            if (isCanceled()) {
              reject(cancellationError);
              throw cancellationError;
            }
            log.debug("createAndOffer() succeeded.");
            peerConnectionManager.dequeue("description");
          }).catch(function(error) {
            log.error("createAndOffer() failed:", error);
            reject(error);
            throw error;
          });
        };
        var automaticSubscription = options.automaticSubscription, bandwidthProfile = options.bandwidthProfile, dominantSpeaker = options.dominantSpeaker, environment = options.environment, eventObserver = options.eventObserver, loggerName = options.loggerName, logLevel = options.logLevel, name = options.name, networkMonitor = options.networkMonitor, networkQuality = options.networkQuality, notifyWarnings = options.notifyWarnings, realm = options.realm, sdpSemantics = options.sdpSemantics;
        var trackPriority = !!bandwidthProfile;
        var trackSwitchOff = !!bandwidthProfile;
        var renderHints = !!bandwidthProfile && (options.clientTrackSwitchOffControl !== "disabled" || options.contentPreferencesMode !== "disabled");
        var transportOptions = Object.assign({
          adaptiveSimulcast,
          automaticSubscription,
          dominantSpeaker,
          environment,
          eventObserver,
          loggerName,
          logLevel,
          networkMonitor,
          networkQuality,
          notifyWarnings,
          iceServers,
          onIced,
          realm,
          renderHints,
          sdpSemantics,
          trackPriority,
          trackSwitchOff
        }, bandwidthProfile ? {
          bandwidthProfile
        } : {});
        transport = new Transport(name, token, localParticipant, peerConnectionManager, wsServer, transportOptions);
        var connectEventPayload = createRoomConnectEventPayload(options);
        eventObserver.emit("event", connectEventPayload);
        transport.once("connected", function(initialState) {
          log.debug("Transport connected:", initialState);
          if (isCanceled()) {
            reject(cancellationError);
            return;
          }
          var localParticipantState = initialState.participant;
          if (!localParticipantState) {
            reject(new SignalingIncomingMessageInvalidError());
            return;
          }
          resolve(new RoomV2(localParticipant, initialState, transport, peerConnectionManager, options));
        });
        transport.once("stateChanged", function(state, error) {
          if (state === "disconnected") {
            transport = null;
            reject(error || new SignalingConnectionDisconnectedError());
          } else {
            log.debug("Transport state changed:", state);
          }
        });
      }, function() {
        if (transport) {
          transport.disconnect();
          transport = null;
        }
      });
      cancelablePromise.catch(function() {
        if (transport) {
          transport.disconnect();
          transport = null;
        }
        peerConnectionManager.close();
      });
      return cancelablePromise;
    }
    module.exports = createCancelableRoomSignalingPromise;
  }
});

// node_modules/twilio-video/es5/signaling/localparticipant.js
var require_localparticipant2 = __commonJS({
  "node_modules/twilio-video/es5/signaling/localparticipant.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var ParticipantSignaling = require_participant2();
    var LocalParticipantSignaling = (
      /** @class */
      function(_super) {
        __extends(LocalParticipantSignaling2, _super);
        function LocalParticipantSignaling2() {
          var _this = _super.call(this) || this;
          Object.defineProperties(_this, {
            _publicationsToTrackSenders: {
              value: /* @__PURE__ */ new Map()
            },
            _trackSendersToPublications: {
              value: /* @__PURE__ */ new Map()
            }
          });
          return _this;
        }
        LocalParticipantSignaling2.prototype.addTrack = function(trackSender, name, priority, noiseCancellationVendor) {
          if (noiseCancellationVendor === void 0) {
            noiseCancellationVendor = null;
          }
          var publication = this._createLocalTrackPublicationSignaling(trackSender, name, priority, noiseCancellationVendor);
          this._trackSendersToPublications.set(trackSender, publication);
          this._publicationsToTrackSenders.set(publication, trackSender);
          _super.prototype.addTrack.call(this, publication);
          return this;
        };
        LocalParticipantSignaling2.prototype.getPublication = function(trackSender) {
          return this._trackSendersToPublications.get(trackSender) || null;
        };
        LocalParticipantSignaling2.prototype.getSender = function(trackPublication) {
          return this._publicationsToTrackSenders.get(trackPublication) || null;
        };
        LocalParticipantSignaling2.prototype.removeTrack = function(trackSender) {
          var publication = this._trackSendersToPublications.get(trackSender);
          if (!publication) {
            return null;
          }
          this._trackSendersToPublications.delete(trackSender);
          this._publicationsToTrackSenders.delete(publication);
          var didDelete = _super.prototype.removeTrack.call(this, publication);
          if (didDelete) {
            publication.stop();
          }
          return publication;
        };
        return LocalParticipantSignaling2;
      }(ParticipantSignaling)
    );
    module.exports = LocalParticipantSignaling;
  }
});

// node_modules/twilio-video/es5/signaling/localtrackpublication.js
var require_localtrackpublication2 = __commonJS({
  "node_modules/twilio-video/es5/signaling/localtrackpublication.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var TrackSignaling = require_track2();
    var LocalTrackPublicationSignaling = (
      /** @class */
      function(_super) {
        __extends(LocalTrackPublicationSignaling2, _super);
        function LocalTrackPublicationSignaling2(trackSender, name, priority) {
          var _this = this;
          trackSender = trackSender.clone();
          var enabled = trackSender.kind === "data" ? true : trackSender.track.enabled;
          _this = _super.call(this, name, trackSender.kind, enabled, priority) || this;
          _this.setTrackTransceiver(trackSender);
          Object.defineProperties(_this, {
            _updatedPriority: {
              value: priority,
              writable: true
            },
            id: {
              enumerable: true,
              value: trackSender.id
            }
          });
          return _this;
        }
        Object.defineProperty(LocalTrackPublicationSignaling2.prototype, "updatedPriority", {
          /**
           * The updated {@link Track.Priority} of the {@link LocalTrack}.
           * @property {Track.priority}
           */
          get: function() {
            return this._updatedPriority;
          },
          enumerable: false,
          configurable: true
        });
        LocalTrackPublicationSignaling2.prototype.enable = function(enabled) {
          enabled = typeof enabled === "boolean" ? enabled : true;
          this.trackTransceiver.track.enabled = enabled;
          return _super.prototype.enable.call(this, enabled);
        };
        LocalTrackPublicationSignaling2.prototype.publishFailed = function(error) {
          if (setError(this, error)) {
            this.emit("updated");
          }
          return this;
        };
        LocalTrackPublicationSignaling2.prototype.setPriority = function(priority) {
          if (this._updatedPriority !== priority) {
            this._updatedPriority = priority;
            this.emit("updated");
          }
          return this;
        };
        LocalTrackPublicationSignaling2.prototype.setSid = function(sid) {
          if (this._error) {
            return this;
          }
          return _super.prototype.setSid.call(this, sid);
        };
        LocalTrackPublicationSignaling2.prototype.stop = function() {
          this.trackTransceiver.stop();
        };
        return LocalTrackPublicationSignaling2;
      }(TrackSignaling)
    );
    function setError(publication, error) {
      if (publication._sid !== null || publication._error) {
        return false;
      }
      publication._error = error;
      return true;
    }
    module.exports = LocalTrackPublicationSignaling;
  }
});

// node_modules/twilio-video/es5/signaling/v2/localtrackpublication.js
var require_localtrackpublication3 = __commonJS({
  "node_modules/twilio-video/es5/signaling/v2/localtrackpublication.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var LocalTrackPublicationSignaling = require_localtrackpublication2();
    var TwilioWarning = require_twiliowarning();
    var createTwilioError = require_twilio_video_errors().createTwilioError;
    var LocalTrackPublicationV2 = (
      /** @class */
      function(_super) {
        __extends(LocalTrackPublicationV22, _super);
        function LocalTrackPublicationV22(trackSender, name, priority, noiseCancellationVendor, options) {
          var _this = _super.call(this, trackSender, name, priority) || this;
          Object.defineProperties(_this, {
            _log: {
              value: options.log.createLog("default", _this)
            },
            _mediaStates: {
              value: { recordings: null },
              writable: true
            },
            _noiseCancellationVendor: {
              value: noiseCancellationVendor
            }
          });
          return _this;
        }
        LocalTrackPublicationV22.prototype.getState = function() {
          var state = {
            enabled: this.isEnabled,
            id: this.id,
            kind: this.kind,
            name: this.name,
            priority: this.updatedPriority
          };
          if (this._noiseCancellationVendor) {
            state.audio_processor = this._noiseCancellationVendor;
          }
          return state;
        };
        LocalTrackPublicationV22.prototype.toString = function() {
          return "[LocalTrackPublicationV2: " + this.sid + "]";
        };
        LocalTrackPublicationV22.prototype.update = function(track) {
          switch (track.state) {
            case "ready":
              this.setSid(track.sid);
              break;
            case "failed": {
              var error = track.error;
              this.publishFailed(createTwilioError(error.code, error.message));
              break;
            }
            default:
              break;
          }
          return this;
        };
        LocalTrackPublicationV22.prototype.updateMediaStates = function(mediaStates) {
          if (!mediaStates || !mediaStates.recordings || this._mediaStates.recordings === mediaStates.recordings) {
            return this;
          }
          this._mediaStates.recordings = mediaStates.recordings;
          switch (this._mediaStates.recordings) {
            case "OK":
              this._log.info("Warnings have cleared.");
              this.emit("warningsCleared");
              break;
            case "NO_MEDIA":
              this._log.warn("Recording media lost.");
              this.emit("warning", TwilioWarning.recordingMediaLost);
              break;
            default:
              this._log.warn("Unknown media state detected: " + this._mediaStates.recordings);
              break;
          }
          return this;
        };
        return LocalTrackPublicationV22;
      }(LocalTrackPublicationSignaling)
    );
    module.exports = LocalTrackPublicationV2;
  }
});

// node_modules/twilio-video/es5/signaling/v2/localparticipant.js
var require_localparticipant3 = __commonJS({
  "node_modules/twilio-video/es5/signaling/v2/localparticipant.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var LocalParticipantSignaling = require_localparticipant2();
    var LocalTrackPublicationV2 = require_localtrackpublication3();
    var DEFAULT_LOG_LEVEL = require_constants().DEFAULT_LOG_LEVEL;
    var Log = require_log();
    var _a = require_util2();
    var buildLogLevels = _a.buildLogLevels;
    var isDeepEqual = _a.isDeepEqual;
    var LocalParticipantV2 = (
      /** @class */
      function(_super) {
        __extends(LocalParticipantV22, _super);
        function LocalParticipantV22(encodingParameters, networkQualityConfiguration, options) {
          var _this = this;
          options = Object.assign({
            logLevel: DEFAULT_LOG_LEVEL,
            LocalTrackPublicationV2
          }, options);
          _this = _super.call(this) || this;
          var logLevels = buildLogLevels(options.logLevel);
          Object.defineProperties(_this, {
            _bandwidthProfile: {
              value: null,
              writable: true
            },
            _bandwidthProfileRevision: {
              value: 0,
              writable: true
            },
            _encodingParameters: {
              value: encodingParameters
            },
            _removeListeners: {
              value: /* @__PURE__ */ new Map()
            },
            _LocalTrackPublicationV2: {
              value: options.LocalTrackPublicationV2
            },
            _log: {
              value: options.log ? options.log.createLog("default", _this) : new Log("default", _this, logLevels, options.loggerName)
            },
            _publishedRevision: {
              writable: true,
              value: 0
            },
            _revision: {
              writable: true,
              value: 1
            },
            _signalingRegion: {
              value: null,
              writable: true
            },
            audioProcessors: {
              value: [],
              writable: true
            },
            bandwidthProfile: {
              enumerable: true,
              get: function() {
                return this._bandwidthProfile;
              }
            },
            bandwidthProfileRevision: {
              enumerable: true,
              get: function() {
                return this._bandwidthProfileRevision;
              }
            },
            networkQualityConfiguration: {
              enumerable: true,
              value: networkQualityConfiguration
            },
            revision: {
              enumerable: true,
              get: function() {
                return this._revision;
              }
            },
            signalingRegion: {
              enumerable: true,
              get: function() {
                return this._signalingRegion;
              }
            }
          });
          return _this;
        }
        LocalParticipantV22.prototype.toString = function() {
          return "[LocalParticipantSignaling: " + this.sid + "]";
        };
        LocalParticipantV22.prototype.setSignalingRegion = function(signalingRegion) {
          if (!this._signalingRegion) {
            this._signalingRegion = signalingRegion;
          }
        };
        LocalParticipantV22.prototype.setBandwidthProfile = function(bandwidthProfile) {
          if (!isDeepEqual(this._bandwidthProfile, bandwidthProfile)) {
            this._bandwidthProfile = JSON.parse(JSON.stringify(bandwidthProfile));
            this._bandwidthProfileRevision++;
            this.didUpdate();
          }
        };
        LocalParticipantV22.prototype.setAudioProcessors = function(audioProcessors) {
          this.audioProcessors = audioProcessors;
        };
        LocalParticipantV22.prototype.getParameters = function() {
          return this._encodingParameters;
        };
        LocalParticipantV22.prototype.setParameters = function(encodingParameters) {
          this._encodingParameters.update(encodingParameters);
          return this;
        };
        LocalParticipantV22.prototype.update = function(published) {
          if (this._publishedRevision >= published.revision) {
            return this;
          }
          this._publishedRevision = published.revision;
          published.tracks.forEach(function(publicationState) {
            var localTrackPublicationV2 = this.tracks.get(publicationState.id);
            if (localTrackPublicationV2) {
              localTrackPublicationV2.update(publicationState);
            }
          }, this);
          return this;
        };
        LocalParticipantV22.prototype.updateMediaStates = function(mediaStates) {
          if (!mediaStates || !mediaStates.tracks) {
            return this;
          }
          Array.from(this.tracks.values()).forEach(function(publication) {
            var states = mediaStates.tracks[publication.sid];
            if (states) {
              publication.updateMediaStates(states);
            }
          });
          return this;
        };
        LocalParticipantV22.prototype._createLocalTrackPublicationSignaling = function(trackSender, name, priority, noiseCancellationVendor) {
          return new this._LocalTrackPublicationV2(trackSender, name, priority, noiseCancellationVendor, { log: this._log });
        };
        LocalParticipantV22.prototype.addTrack = function(trackSender, name, priority, noiseCancellationVendor) {
          var _this = this;
          _super.prototype.addTrack.call(this, trackSender, name, priority, noiseCancellationVendor);
          var publication = this.getPublication(trackSender);
          var isEnabled = publication.isEnabled, updatedPriority = publication.updatedPriority;
          var updated = function() {
            if (isEnabled !== publication.isEnabled || updatedPriority !== publication.updatedPriority) {
              _this.didUpdate();
              isEnabled = publication.isEnabled;
              updatedPriority = publication.updatedPriority;
            }
          };
          publication.on("updated", updated);
          this._removeListener(publication);
          this._removeListeners.set(publication, function() {
            return publication.removeListener("updated", updated);
          });
          this.didUpdate();
          return this;
        };
        LocalParticipantV22.prototype._removeListener = function(publication) {
          var removeListener = this._removeListeners.get(publication);
          if (removeListener) {
            removeListener();
          }
        };
        LocalParticipantV22.prototype.getState = function() {
          return {
            revision: this.revision,
            tracks: Array.from(this.tracks.values()).map(function(track) {
              return track.getState();
            })
          };
        };
        LocalParticipantV22.prototype.didUpdate = function() {
          this._revision++;
          this.emit("updated");
        };
        LocalParticipantV22.prototype.removeTrack = function(trackSender) {
          var publication = _super.prototype.removeTrack.call(this, trackSender);
          if (publication) {
            trackSender.removeClone(publication.trackTransceiver);
            this._removeListener(publication);
            this.didUpdate();
          }
          return publication;
        };
        LocalParticipantV22.prototype.setNetworkQualityConfiguration = function(networkQualityConfiguration) {
          this.networkQualityConfiguration.update(networkQualityConfiguration);
        };
        LocalParticipantV22.prototype.setPublisherHint = function(trackSid, encodings) {
          var trackSignaling = Array.from(this.tracks.values()).find(function(trackPub) {
            return trackPub.sid === trackSid;
          });
          if (!trackSignaling) {
            this._log.warn("track:" + trackSid + " not found");
            return Promise.resolve("UNKNOWN_TRACK");
          }
          return trackSignaling.trackTransceiver.setPublisherHint(encodings);
        };
        return LocalParticipantV22;
      }(LocalParticipantSignaling)
    );
    module.exports = LocalParticipantV2;
  }
});

// node_modules/twilio-video/es5/signaling/index.js
var require_signaling = __commonJS({
  "node_modules/twilio-video/es5/signaling/index.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var ParticipantSignaling = require_participant2();
    var RoomSignaling = require_room2();
    var StateMachine = require_statemachine();
    var states = {
      closed: [
        "opening"
      ],
      opening: [
        "closed",
        "open"
      ],
      open: [
        "closed",
        "closing"
      ],
      closing: [
        "closed",
        "open"
      ]
    };
    var Signaling = (
      /** @class */
      function(_super) {
        __extends(Signaling2, _super);
        function Signaling2() {
          return _super.call(this, "closed", states) || this;
        }
        Signaling2.prototype._close = function(key) {
          this.transition("closing", key);
          this.transition("closed", key);
          return Promise.resolve(this);
        };
        Signaling2.prototype._connect = function(localParticipant, token, encodingParameters, preferredCodecs, options) {
          localParticipant.connect("PA00000000000000000000000000000000", "test");
          var sid = "RM00000000000000000000000000000000";
          var promise = Promise.resolve(new RoomSignaling(localParticipant, sid, options));
          promise.cancel = function cancel() {
          };
          return promise;
        };
        Signaling2.prototype._open = function(key) {
          this.transition("opening", key);
          this.transition("open", key);
          return Promise.resolve(this);
        };
        Signaling2.prototype.close = function() {
          var _this = this;
          return this.bracket("close", function(key) {
            switch (_this.state) {
              case "closed":
                return _this;
              case "open":
                return _this._close(key);
              default:
                throw new Error('Unexpected Signaling state "' + _this.state + '"');
            }
          });
        };
        Signaling2.prototype.connect = function(localParticipant, token, encodingParameters, preferredCodecs, options) {
          var self = this;
          return this.bracket("connect", function transition(key) {
            switch (self.state) {
              case "closed":
                return self._open(key).then(transition.bind(null, key));
              case "open":
                self.releaseLockCompletely(key);
                return self._connect(localParticipant, token, encodingParameters, preferredCodecs, options);
              default:
                throw new Error('Unexpected Signaling state "' + self.state + '"');
            }
          });
        };
        Signaling2.prototype.createLocalParticipantSignaling = function() {
          return new ParticipantSignaling();
        };
        Signaling2.prototype.open = function() {
          var _this = this;
          return this.bracket("open", function(key) {
            switch (_this.state) {
              case "closed":
                return _this._open(key);
              case "open":
                return _this;
              default:
                throw new Error('Unexpected Signaling state "' + _this.state + '"');
            }
          });
        };
        return Signaling2;
      }(StateMachine)
    );
    module.exports = Signaling;
  }
});

// node_modules/twilio-video/es5/signaling/v2/index.js
var require_v2 = __commonJS({
  "node_modules/twilio-video/es5/signaling/v2/index.js"(exports, module) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var defaultCreateCancelableRoomSignalingPromise = require_cancelableroomsignalingpromise();
    var LocalParticipantV2 = require_localparticipant3();
    var Signaling = require_signaling();
    var SignalingV2 = (
      /** @class */
      function(_super) {
        __extends(SignalingV22, _super);
        function SignalingV22(wsServer, options) {
          var _this = this;
          options = Object.assign({
            createCancelableRoomSignalingPromise: defaultCreateCancelableRoomSignalingPromise
          }, options);
          _this = _super.call(this) || this;
          Object.defineProperties(_this, {
            _createCancelableRoomSignalingPromise: {
              value: options.createCancelableRoomSignalingPromise
            },
            _options: {
              value: options
            },
            _wsServer: {
              value: wsServer
            }
          });
          return _this;
        }
        SignalingV22.prototype._connect = function(localParticipant, token, encodingParameters, preferredCodecs, options) {
          options = Object.assign({}, this._options, options);
          return this._createCancelableRoomSignalingPromise.bind(null, token, this._wsServer, localParticipant, encodingParameters, preferredCodecs, options);
        };
        SignalingV22.prototype.createLocalParticipantSignaling = function(encodingParameters, networkQualityConfiguration) {
          return new LocalParticipantV2(encodingParameters, networkQualityConfiguration);
        };
        return SignalingV22;
      }(Signaling)
    );
    module.exports = SignalingV2;
  }
});

// node_modules/twilio-video/es5/connect.js
var require_connect = __commonJS({
  "node_modules/twilio-video/es5/connect.js"(exports, module) {
    "use strict";
    var MediaStreamTrack2 = require_webrtc().MediaStreamTrack;
    var _a = require_util();
    var guessBrowser = _a.guessBrowser;
    var guessBrowserVersion = _a.guessBrowserVersion;
    var isCodecSupported = _a.isCodecSupported;
    var createCancelableRoomPromise = require_cancelableroompromise();
    var EncodingParametersImpl = require_encodingparameters();
    var LocalParticipant = require_localparticipant();
    var InsightsPublisher = require_insightspublisher();
    var NullInsightsPublisher = require_null();
    var _b = require_es5();
    var LocalAudioTrack = _b.LocalAudioTrack;
    var LocalDataTrack = _b.LocalDataTrack;
    var LocalVideoTrack = _b.LocalVideoTrack;
    var NetworkQualityConfigurationImpl = require_networkqualityconfiguration();
    var Room = require_room();
    var SignalingV2 = require_v2();
    var _c = require_util2();
    var asLocalTrack = _c.asLocalTrack;
    var buildLogLevels = _c.buildLogLevels;
    var filterObject = _c.filterObject;
    var isNonArrayObject = _c.isNonArrayObject;
    var _d = require_constants();
    var DEFAULT_ENVIRONMENT = _d.DEFAULT_ENVIRONMENT;
    var DEFAULT_LOG_LEVEL = _d.DEFAULT_LOG_LEVEL;
    var DEFAULT_LOGGER_NAME = _d.DEFAULT_LOGGER_NAME;
    var DEFAULT_REALM = _d.DEFAULT_REALM;
    var DEFAULT_REGION = _d.DEFAULT_REGION;
    var WS_SERVER = _d.WS_SERVER;
    var SDK_NAME = _d.SDK_NAME;
    var SDK_VERSION = _d.SDK_VERSION;
    var E = _d.typeErrors;
    var CancelablePromise = require_cancelablepromise();
    var EventObserver = require_eventobserver();
    var DefaultLog = require_log();
    var validateBandwidthProfile = require_validate().validateBandwidthProfile;
    var safariVersion = guessBrowser() === "safari" && guessBrowserVersion();
    var connectCalls = 0;
    var didPrintSafariWarning = false;
    var isSafariWithoutVP8Support = false;
    if (safariVersion) {
      safariMajorVersion = safariVersion.major, safariMinorVersion = safariVersion.minor;
      isSafariWithoutVP8Support = safariMajorVersion < 12 || safariMajorVersion === 12 && safariMinorVersion < 1;
    }
    var safariMajorVersion;
    var safariMinorVersion;
    var deprecatedConnectOptionsProps = /* @__PURE__ */ new Set([
      { didWarn: false, shouldDelete: true, name: "abortOnIceServersTimeout" },
      { didWarn: false, shouldDelete: true, name: "dscpTagging", newName: "enableDscp" },
      { didWarn: false, shouldDelete: true, name: "iceServersTimeout" },
      { didWarn: false, shouldDelete: false, name: "eventListener", newName: "Video.Logger" },
      { didWarn: false, shouldDelete: false, name: "logLevel", newName: "Video.Logger" }
    ]);
    var deprecatedBandwidthProfileOptions = /* @__PURE__ */ new Set([
      { didWarn: false, shouldDelete: false, name: "maxTracks", newName: "bandwidthProfile.video.clientTrackSwitchOffControl" },
      { didWarn: false, shouldDelete: false, name: "renderDimensions", newName: "bandwidthProfile.video.contentPreferencesMode" }
    ]);
    function connect(token, options) {
      if (typeof options === "undefined") {
        options = {};
      }
      if (!isNonArrayObject(options)) {
        return CancelablePromise.reject(E.INVALID_TYPE("options", "object"));
      }
      var Log = options.Log || DefaultLog;
      var loggerName = options.loggerName || DEFAULT_LOGGER_NAME;
      var logLevel = options.logLevel || DEFAULT_LOG_LEVEL;
      var logLevels = buildLogLevels(logLevel);
      var logComponentName = "[connect #" + ++connectCalls + "]";
      var log;
      try {
        log = new Log("default", logComponentName, logLevels, loggerName);
      } catch (error2) {
        return CancelablePromise.reject(error2);
      }
      deprecateOptions(options, log, deprecatedConnectOptionsProps);
      var adaptiveSimulcast = options.preferredVideoCodecs === "auto";
      if (adaptiveSimulcast) {
        options.preferredVideoCodecs = [{ codec: "VP8", simulcast: true, adaptiveSimulcast: true }];
      }
      if (options.maxVideoBitrate && adaptiveSimulcast) {
        log.error('ConnectOptions "maxVideoBitrate" is not compatible with "preferredVideoCodecs=auto"');
        return CancelablePromise.reject(E.ILLEGAL_INVOKE("connect", 'ConnectOptions "maxVideoBitrate" is not compatible with "preferredVideoCodecs=auto"'));
      }
      options = Object.assign({
        automaticSubscription: true,
        dominantSpeaker: false,
        enableDscp: false,
        environment: DEFAULT_ENVIRONMENT,
        eventListener: null,
        insights: true,
        LocalAudioTrack,
        LocalDataTrack,
        LocalParticipant,
        LocalVideoTrack,
        Log,
        MediaStreamTrack: MediaStreamTrack2,
        loggerName,
        logLevel,
        maxAudioBitrate: null,
        maxVideoBitrate: null,
        name: null,
        networkMonitor: true,
        networkQuality: false,
        preferredAudioCodecs: [],
        preferredVideoCodecs: [],
        realm: DEFAULT_REALM,
        region: DEFAULT_REGION,
        signaling: SignalingV2
      }, filterObject(options));
      var eventPublisherOptions = {};
      if (typeof options.wsServerInsights === "string") {
        eventPublisherOptions.gateway = options.wsServerInsights;
      }
      var EventPublisher = options.insights ? InsightsPublisher : NullInsightsPublisher;
      var eventPublisher = new EventPublisher(token, SDK_NAME, SDK_VERSION, options.environment, options.realm, eventPublisherOptions);
      var wsServer = WS_SERVER(options.environment, options.region);
      var eventObserver = new EventObserver(eventPublisher, Date.now(), log, options.eventListener);
      options = Object.assign({ eventObserver, wsServer }, options);
      options.log = log;
      if (isSafariWithoutVP8Support && !didPrintSafariWarning && (log.logLevel !== "error" && log.logLevel !== "off")) {
        didPrintSafariWarning = true;
        log.warn([
          "Support for Safari 12.0 and below is limited because it does not support VP8.",
          "This means you may experience codec issues in Group Rooms. You may also",
          "experience codec issues in Peer-to-Peer (P2P) Rooms containing Android- or",
          "iOS-based Participants who do not support H.264. However, P2P Rooms",
          "with browser-based Participants should work. For more information, please",
          "refer to this guide: https://www.twilio.com/docs/video/javascript-v2-developing-safari-11"
        ].join(" "));
      }
      if (typeof token !== "string") {
        return CancelablePromise.reject(E.INVALID_TYPE("token", "string"));
      }
      var localTrackOptions = Object.assign({}, options);
      delete localTrackOptions.name;
      if ("tracks" in options) {
        if (!Array.isArray(options.tracks)) {
          return CancelablePromise.reject(E.INVALID_TYPE("options.tracks", "Array of LocalAudioTrack, LocalVideoTrack or MediaStreamTrack"));
        }
        try {
          options.tracks = options.tracks.map(function(track) {
            return asLocalTrack(track, localTrackOptions);
          });
        } catch (error2) {
          return CancelablePromise.reject(error2);
        }
      }
      var error = validateBandwidthProfile(options.bandwidthProfile);
      if (error) {
        return CancelablePromise.reject(error);
      }
      options.clientTrackSwitchOffControl = "disabled";
      options.contentPreferencesMode = "disabled";
      if (options.bandwidthProfile) {
        options.clientTrackSwitchOffControl = "auto";
        options.contentPreferencesMode = "auto";
        if (options.bandwidthProfile.video) {
          deprecateOptions(options.bandwidthProfile.video, log, deprecatedBandwidthProfileOptions);
          if ("maxTracks" in options.bandwidthProfile.video) {
            options.clientTrackSwitchOffControl = "disabled";
          } else if (options.bandwidthProfile.video.clientTrackSwitchOffControl === "manual") {
            options.clientTrackSwitchOffControl = "manual";
          } else {
            options.clientTrackSwitchOffControl = "auto";
          }
          if ("renderDimensions" in options.bandwidthProfile.video) {
            options.contentPreferencesMode = "disabled";
          } else if (options.bandwidthProfile.video.contentPreferencesMode === "manual") {
            options.contentPreferencesMode = "manual";
          } else {
            options.contentPreferencesMode = "auto";
          }
        }
      }
      var Signaling = options.signaling;
      var signaling = new Signaling(options.wsServer, options);
      log.info("Connecting to a Room");
      log.debug("Options:", options);
      var encodingParameters = new EncodingParametersImpl({
        maxAudioBitrate: options.maxAudioBitrate,
        maxVideoBitrate: options.maxVideoBitrate
      }, adaptiveSimulcast);
      var preferredCodecs = {
        audio: options.preferredAudioCodecs.map(normalizeCodecSettings),
        video: options.preferredVideoCodecs.map(normalizeCodecSettings)
      };
      var networkQualityConfiguration = new NetworkQualityConfigurationImpl(isNonArrayObject(options.networkQuality) ? options.networkQuality : {});
      ["audio", "video"].forEach(function(kind) {
        return preferredCodecs[kind].forEach(function(_a2) {
          var codec = _a2.codec;
          return isCodecSupported(codec, kind).then(function(isSupported) {
            return !isSupported && log.warn("The preferred " + kind + ' codec "' + codec + '" will be ignored as it is not supported by the browser.');
          });
        });
      });
      var cancelableRoomPromise = createCancelableRoomPromise(getLocalTracks.bind(null, options), createLocalParticipant.bind(null, signaling, log, encodingParameters, networkQualityConfiguration, options), createRoomSignaling.bind(null, token, options, signaling, encodingParameters, preferredCodecs), createRoom.bind(null, options));
      cancelableRoomPromise.then(function(room) {
        eventPublisher.connect(room.sid, room.localParticipant.sid);
        log.info("Connected to Room:", room.toString());
        log.info("Room name:", room.name);
        log.debug("Room:", room);
        room.once("disconnected", function() {
          return eventPublisher.disconnect();
        });
        return room;
      }, function(error2) {
        eventPublisher.disconnect();
        if (cancelableRoomPromise._isCanceled) {
          log.info("Attempt to connect to a Room was canceled");
        } else {
          log.info("Error while connecting to a Room:", error2);
        }
      });
      return cancelableRoomPromise;
    }
    var VideoCodec = {
      H264: "H264",
      VP8: "VP8"
    };
    VideoCodec.VP9 = "VP9";
    function deprecateOptions(options, log, deprecationTable) {
      deprecationTable.forEach(function(prop) {
        var didWarn = prop.didWarn, name = prop.name, newName = prop.newName, shouldDelete = prop.shouldDelete;
        if (name in options && typeof options[name] !== "undefined") {
          if (newName && shouldDelete) {
            options[newName] = options[name];
          }
          if (shouldDelete) {
            delete options[name];
          }
          if (!didWarn && !["error", "off"].includes(log.level)) {
            log.warn('The ConnectOptions "' + name + '" is ' + (newName ? 'deprecated and scheduled for removal. Please use "' + newName + '" instead.' : "no longer applicable and will be ignored."));
            prop.didWarn = true;
          }
        }
      });
    }
    function createLocalParticipant(signaling, log, encodingParameters, networkQualityConfiguration, options, localTracks) {
      var localParticipantSignaling = signaling.createLocalParticipantSignaling(encodingParameters, networkQualityConfiguration);
      log.debug("Creating a new LocalParticipant:", localParticipantSignaling);
      return new options.LocalParticipant(localParticipantSignaling, localTracks, options);
    }
    function createRoom(options, localParticipant, roomSignaling) {
      var room = new Room(localParticipant, roomSignaling, options);
      var log = options.log;
      log.debug("Creating a new Room:", room);
      roomSignaling.on("stateChanged", function stateChanged(state) {
        if (state === "disconnected") {
          log.info("Disconnected from Room:", room.toString());
          roomSignaling.removeListener("stateChanged", stateChanged);
        }
      });
      return room;
    }
    function createRoomSignaling(token, options, signaling, encodingParameters, preferredCodecs, localParticipant) {
      options.log.debug("Creating a new RoomSignaling");
      return signaling.connect(localParticipant._signaling, token, encodingParameters, preferredCodecs, options);
    }
    function getLocalTracks(options, handleLocalTracks) {
      var log = options.log;
      options.shouldStopLocalTracks = !options.tracks;
      if (options.shouldStopLocalTracks) {
        log.info("LocalTracks were not provided, so they will be acquired automatically before connecting to the Room. LocalTracks will be released if connecting to the Room fails or if the Room is disconnected");
      } else {
        log.info("Getting LocalTracks");
        log.debug("Options:", options);
      }
      return options.createLocalTracks(options).then(function getLocalTracksSucceeded(localTracks) {
        var promise = handleLocalTracks(localTracks);
        promise.catch(function handleLocalTracksFailed() {
          if (options.shouldStopLocalTracks) {
            log.info("The automatically acquired LocalTracks will now be stopped");
            localTracks.forEach(function(track) {
              track.stop();
            });
          }
        });
        return promise;
      });
    }
    function normalizeCodecSettings(nameOrSettings) {
      var settings = typeof nameOrSettings === "string" ? { codec: nameOrSettings } : nameOrSettings;
      switch (settings.codec.toLowerCase()) {
        case "opus": {
          return Object.assign({ dtx: true }, settings);
        }
        case "vp8": {
          return Object.assign({ simulcast: false }, settings);
        }
        default: {
          return settings;
        }
      }
    }
    module.exports = connect;
  }
});

// node_modules/twilio-video/es5/createlocaltrack.js
var require_createlocaltrack = __commonJS({
  "node_modules/twilio-video/es5/createlocaltrack.js"(exports, module) {
    "use strict";
    var _a = require_constants();
    var DEFAULT_LOG_LEVEL = _a.DEFAULT_LOG_LEVEL;
    var DEFAULT_LOGGER_NAME = _a.DEFAULT_LOGGER_NAME;
    function createLocalTrack(kind, options) {
      options = Object.assign({
        loggerName: DEFAULT_LOGGER_NAME,
        logLevel: DEFAULT_LOG_LEVEL
      }, options);
      var createOptions = {};
      createOptions.loggerName = options.loggerName;
      createOptions.logLevel = options.logLevel;
      delete options.loggerName;
      delete options.logLevel;
      var createLocalTracks = options.createLocalTracks;
      delete options.createLocalTracks;
      createOptions[kind] = Object.keys(options).length > 0 ? options : true;
      return createLocalTracks(createOptions).then(function(localTracks) {
        return localTracks[0];
      });
    }
    function createLocalAudioTrack(options) {
      return createLocalTrack("audio", options);
    }
    function createLocalVideoTrack(options) {
      return createLocalTrack("video", options);
    }
    module.exports = {
      audio: createLocalAudioTrack,
      video: createLocalVideoTrack
    };
  }
});

// node_modules/twilio-video/es5/util/support.js
var require_support = __commonJS({
  "node_modules/twilio-video/es5/util/support.js"(exports, module) {
    "use strict";
    var _a = require_util();
    var guessBrowser = _a.guessBrowser;
    var isWebRTCSupported = _a.support;
    var getSdpFormat = require_sdp().getSdpFormat;
    var _b = require_browserdetection();
    var isAndroid = _b.isAndroid;
    var isMobile = _b.isMobile;
    var isNonChromiumEdge = _b.isNonChromiumEdge;
    var rebrandedChromeBrowser = _b.rebrandedChromeBrowser;
    var mobileWebKitBrowser = _b.mobileWebKitBrowser;
    var SUPPORTED_CHROME_BASED_BROWSERS = [
      "crios",
      "edg",
      "edge",
      "electron",
      "headlesschrome"
    ];
    var SUPPORTED_ANDROID_BROWSERS = [
      "chrome",
      "firefox"
    ];
    var SUPPORTED_IOS_BROWSERS = [
      "chrome",
      "safari"
    ];
    var SUPPORTED_MOBILE_WEBKIT_BASED_BROWSERS = [];
    function isSupported() {
      var browser = guessBrowser();
      if (!browser) {
        return false;
      }
      var rebrandedChrome = rebrandedChromeBrowser(browser);
      var mobileWebKit = mobileWebKitBrowser(browser);
      var supportedMobileBrowsers = isAndroid() ? SUPPORTED_ANDROID_BROWSERS : SUPPORTED_IOS_BROWSERS;
      return !!browser && isWebRTCSupported() && getSdpFormat() === "unified" && (!rebrandedChrome || SUPPORTED_CHROME_BASED_BROWSERS.includes(rebrandedChrome)) && !isNonChromiumEdge(browser) && (!mobileWebKit || SUPPORTED_MOBILE_WEBKIT_BASED_BROWSERS.includes(mobileWebKit)) && (!isMobile() || supportedMobileBrowsers.includes(browser));
    }
    module.exports = isSupported;
  }
});

// node_modules/twilio-video/es5/index.js
var require_es52 = __commonJS({
  "node_modules/twilio-video/es5/index.js"(exports, module) {
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var createlocaltracks_1 = require_createlocaltracks();
    var preflighttest_1 = require_preflighttest();
    var internals = {
      connect: require_connect(),
      createLocalAudioTrack: require_createlocaltrack().audio,
      createLocalVideoTrack: require_createlocaltrack().video,
      isSupported: require_support()(),
      version: require_package().version,
      Logger: require_loglevel(),
      LocalAudioTrack: require_es5().LocalAudioTrack,
      LocalDataTrack: require_es5().LocalDataTrack,
      LocalVideoTrack: require_es5().LocalVideoTrack
    };
    function connect(token, options) {
      var internalOptions = __assign({ createLocalTracks: createlocaltracks_1.createLocalTracks }, options);
      return internals.connect(token, internalOptions);
    }
    function createLocalAudioTrack(options) {
      var internalOptions = __assign({ createLocalTracks: createlocaltracks_1.createLocalTracks }, options);
      return internals.createLocalAudioTrack(internalOptions);
    }
    function createLocalVideoTrack(options) {
      var internalOptions = __assign({ createLocalTracks: createlocaltracks_1.createLocalTracks }, options);
      return internals.createLocalVideoTrack(internalOptions);
    }
    var isSupported = internals.isSupported;
    var version = internals.version;
    var Logger = internals.Logger;
    var LocalAudioTrack = internals.LocalAudioTrack;
    var LocalVideoTrack = internals.LocalVideoTrack;
    var LocalDataTrack = internals.LocalDataTrack;
    module.exports = {
      connect,
      createLocalAudioTrack,
      createLocalVideoTrack,
      createLocalTracks: createlocaltracks_1.createLocalTracks,
      runPreflight: preflighttest_1.runPreflight,
      isSupported,
      version,
      Logger,
      LocalAudioTrack,
      LocalVideoTrack,
      LocalDataTrack
    };
  }
});
export default require_es52();
//# sourceMappingURL=twilio-video.js.map
