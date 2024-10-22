import {
  __async,
  __asyncGenerator,
  __await,
  __spreadProps,
  __spreadValues,
  __yieldStar
} from "./chunk-4YI77D66.js";

// node_modules/samba-bo-sdk/dist/index.js
function F(e) {
  return e ? `/auth/login/${e}` : "/auth/login";
}
var E = "/";
var K = (e, t) => (e.endsWith(E) && (e = e.slice(0, -1)), t.startsWith(E) || (t = E + t), e + t);
var C = (e, t, a) => {
  let r = e.pathname === E ? t : K(e.pathname, t), m = new globalThis.URL(r, e);
  if (a)
    for (let [p, n] of Object.entries(J(a)))
      if (n && typeof n == "object" && !Array.isArray(n))
        for (let [c, h] of Object.entries(n))
          m.searchParams.set(`${p}[${c}]`, String(h));
      else
        m.searchParams.set(p, n);
  return m;
};
function D(e) {
  return typeof e != "object" || !e ? false : "headers" in e && "ok" in e && "json" in e && typeof e.json == "function" && "text" in e && typeof e.json == "function";
}
function $(e) {
  return __async(this, null, function* () {
    if (!(typeof e != "object" || !e)) {
      if (D(e)) {
        let t = e.headers.get("Content-Type")?.toLowerCase();
        if (t?.startsWith("application/json") || t?.startsWith("application/health+json")) {
          let a = yield e.json();
          if (!e.ok)
            throw a;
          return "data" in a ? a.data : a;
        }
        if (t?.startsWith("text/html") || t?.startsWith("text/plain")) {
          let a = yield e.text();
          if (!e.ok)
            throw a;
          return a;
        }
        return e;
      }
      return "data" in e ? e.data : e;
    }
  });
}
var R = (_0, _1, ..._2) => __async(void 0, [_0, _1, ..._2], function* (e, t, a = globalThis.fetch) {
  return t.headers = typeof t.headers == "object" && !Array.isArray(t.headers) ? t.headers : {}, a(e, t).then((r) => $(r).catch((m) => {
    let p = typeof m == "object" && "errors" in m ? m.errors : m;
    return Promise.reject({ errors: p, response: r });
  }));
});
var k = () => {
  let e = null;
  return { get: () => __async(void 0, null, function* () {
    return e;
  }), set: (t) => __async(void 0, null, function* () {
    e = t;
  }) };
};
var W = { msRefreshBeforeExpires: 3e4, autoRefresh: true };
var L = 2 ** 31 - 1;
var ie = (e = "cookie", t = {}) => (a) => {
  let r = __spreadValues(__spreadValues({}, W), t), m = null, p = null, n = r.storage ?? k(), c = () => __async(void 0, null, function* () {
    return n.set({ access_token: null, refresh_token: null, expires: null, expires_at: null });
  }), h = () => __async(void 0, null, function* () {
    try {
      yield m;
    } finally {
      m = null;
    }
  }), f = () => __async(void 0, null, function* () {
    let y = yield n.get();
    return m || !y?.expires_at || y.expires_at < (/* @__PURE__ */ new Date()).getTime() + r.msRefreshBeforeExpires && I().catch((l) => {
    }), h();
  }), g = (y) => __async(void 0, null, function* () {
    let l = y.expires ?? 0;
    y.expires_at = (/* @__PURE__ */ new Date()).getTime() + l, yield n.set(y), r.autoRefresh && l > r.msRefreshBeforeExpires && l < L && (p && clearTimeout(p), p = setTimeout(() => {
      p = null, I().catch((b) => {
      });
    }, l - r.msRefreshBeforeExpires));
  }), I = () => __async(void 0, null, function* () {
    return m = (() => __async(void 0, null, function* () {
      let l = yield n.get();
      yield c();
      let b = { method: "POST", headers: { "Content-Type": "application/json" } };
      "credentials" in r && (b.credentials = r.credentials);
      let x = { mode: e };
      e === "json" && l?.refresh_token && (x.refresh_token = l.refresh_token), b.body = JSON.stringify(x);
      let s = C(a.url, "/auth/refresh");
      return R(s.toString(), b, a.globals.fetch).then((i) => g(i).then(() => i));
    }))(), m;
  });
  return { refresh: I, login(_0, _1) {
    return __async(this, arguments, function* (y, l, b = {}) {
      yield c();
      let x = { email: y, password: l };
      "otp" in b && (x.otp = b.otp), x.mode = b.mode ?? e;
      let s = F(b.provider), i = C(a.url, s), S = { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(x) };
      "credentials" in r && (S.credentials = r.credentials);
      let d = yield R(i.toString(), S, a.globals.fetch);
      return yield g(d), d;
    });
  }, logout() {
    return __async(this, null, function* () {
      let y = yield n.get(), l = { method: "POST", headers: { "Content-Type": "application/json" } };
      "credentials" in r && (l.credentials = r.credentials);
      let b = { mode: e };
      e === "json" && y?.refresh_token && (b.refresh_token = y.refresh_token), l.body = JSON.stringify(b);
      let x = C(a.url, "/auth/logout");
      yield R(x.toString(), l, a.globals.fetch), this.stopRefreshing(), yield c();
    });
  }, stopRefreshing() {
    p && clearTimeout(p);
  }, getToken() {
    return __async(this, null, function* () {
      return yield f().catch(() => {
      }), (yield n.get())?.access_token ?? null;
    });
  }, setToken(y) {
    return __async(this, null, function* () {
      return n.set({ access_token: y, refresh_token: null, expires: null, expires_at: null });
    });
  } };
};
var ce = (e) => (t) => {
  let a = e ?? null;
  return { getToken() {
    return __async(this, null, function* () {
      return a;
    });
  }, setToken(r) {
    return __async(this, null, function* () {
      a = r;
    });
  } };
};
var _ = { fetch: globalThis.fetch, WebSocket: globalThis.WebSocket, URL: globalThis.URL, logger: globalThis.console };
var le = (e, t = {}) => {
  let a = t.globals ? __spreadValues(__spreadValues({}, _), t.globals) : _;
  return { globals: a, url: new a.URL(e), with(r) {
    return __spreadValues(__spreadValues({}, this), r(this));
  } };
};
var H = {};
var Qe = (e = {}) => (t) => {
  let a = __spreadValues(__spreadValues({}, H), e);
  return { query(r, m, p = "items") {
    return __async(this, null, function* () {
      let n = { method: "POST", body: JSON.stringify({ query: r, variables: m }) };
      "credentials" in a && (n.credentials = a.credentials);
      let c = {};
      if ("getToken" in this) {
        let g = yield this.getToken();
        g && (c.Authorization = `Bearer ${g}`);
      }
      "Content-Type" in c || (c["Content-Type"] = "application/json"), n.headers = c;
      let h = p === "items" ? "/graphql" : "/graphql/system", f = C(t.url, h);
      return yield R(f.toString(), n, t.globals.fetch);
    });
  } };
};
function N(e) {
  return JSON.stringify(__spreadProps(__spreadValues({}, e), { type: "auth" }));
}
var G = () => JSON.stringify({ type: "pong" });
function* v() {
  let e = 1;
  for (; ; )
    yield String(e), e++;
}
var w = (e, t = 1e3) => new Promise((a, r) => {
  let m = (h) => {
    try {
      let f = JSON.parse(h.data);
      typeof f == "object" && !Array.isArray(f) && f !== null ? (n(), a(f)) : (n(), p());
    } catch {
      n(), a(h);
    }
  }, p = () => r(), n = () => {
    clearTimeout(c), e.removeEventListener("message", m), e.removeEventListener("error", p), e.removeEventListener("close", p);
  };
  e.addEventListener("message", m), e.addEventListener("error", p), e.addEventListener("close", p);
  let c = setTimeout(() => {
    n(), a(void 0);
  }, t);
});
var V = { authMode: "handshake", heartbeat: true, debug: false, reconnect: { delay: 1e3, retries: 10 } };
function ve(e = {}) {
  return (t) => {
    e = __spreadValues(__spreadValues({}, V), e);
    let a = v(), r = { code: "closed" }, m = { attempts: 0, active: false }, p = false, n = /* @__PURE__ */ new Set(), c = (s) => "getToken" in s, h = (s, ...i) => e.debug && t.globals.logger[s]("[SambaBO SDK]", ...i), f = (s, i) => __async(this, null, function* () {
      let S = new t.globals.URL(s);
      if (e.authMode === "strict" && c(i)) {
        let d = yield i.getToken();
        d && S.searchParams.set("access_token", d);
      }
      return S.toString();
    }), g = (s) => __async(this, null, function* () {
      if ("url" in e)
        return yield f(e.url, s);
      if (["ws:", "wss:"].includes(t.url.protocol))
        return yield f(t.url, s);
      let i = new t.globals.URL(t.url.toString());
      return i.protocol = t.url.protocol === "https:" ? "wss:" : "ws:", i.pathname = "/websocket", yield f(i, s);
    }), I = (s) => {
      let i = new Promise((S, d) => {
        if (!e.reconnect || p)
          return d();
        if (h("info", `reconnect #${m.attempts} ` + (m.attempts >= e.reconnect.retries ? "maximum retries reached" : `trying again in ${Math.max(100, e.reconnect.delay)}ms`)), m.active)
          return m.active;
        if (m.attempts >= e.reconnect.retries)
          return d();
        setTimeout(() => s.connect().then((B) => (n.forEach((u) => {
          s.sendMessage(u);
        }), B)).then(S).catch(d), Math.max(100, e.reconnect.delay));
      });
      m.attempts += 1, m.active = i.catch(() => {
      }).finally(() => {
        m.active = false;
      });
    }, y = { open: /* @__PURE__ */ new Set([]), error: /* @__PURE__ */ new Set([]), close: /* @__PURE__ */ new Set([]), message: /* @__PURE__ */ new Set([]) };
    function l(s) {
      return "type" in s && "status" in s && "error" in s && "code" in s.error && "message" in s.error && s.type === "auth" && s.status === "error";
    }
    function b(s, i) {
      return __async(this, null, function* () {
        if (r.code === "open") {
          if (s.error.code === "TOKEN_EXPIRED" && (h("warn", "Authentication token expired!"), c(i))) {
            let S = yield i.getToken();
            if (!S)
              throw Error("No token for re-authenticating the websocket");
            r.connection.send(N({ access_token: S }));
          }
          if (s.error.code === "AUTH_TIMEOUT")
            return r.firstMessage && e.authMode === "public" ? (h("warn", 'Authentication failed! Currently the "authMode" is "public" try using "handshake" instead'), e.reconnect = false) : h("warn", "Authentication timed out!"), r.connection.close();
          if (s.error.code === "AUTH_FAILED") {
            if (r.firstMessage && e.authMode === "public")
              return h("warn", 'Authentication failed! Currently the "authMode" is "public" try using "handshake" instead'), e.reconnect = false, r.connection.close();
            h("warn", "Authentication failed!");
          }
        }
      });
    }
    let x = (s) => __async(this, null, function* () {
      for (; r.code === "open"; ) {
        let i = yield w(r.connection).catch(() => {
        });
        if (i) {
          if (l(i)) {
            yield b(i, s), r.firstMessage = false;
            continue;
          }
          if (e.heartbeat && i.type === "ping") {
            r.connection.send(G()), r.firstMessage = false;
            continue;
          }
          y.message.forEach((S) => {
            r.code === "open" && S.call(r.connection, i);
          }), r.firstMessage = false;
        }
      }
    });
    return { connect() {
      return __async(this, null, function* () {
        if (p = false, r.code === "connecting")
          return yield r.connection;
        if (r.code !== "closed")
          throw new Error(`Cannot connect when state is "${r.code}"`);
        let s = this, i = yield g(s);
        h("info", `Connecting to ${i}...`);
        let S = new Promise((d, B) => {
          let u = false, Q = new t.globals.WebSocket(i);
          Q.addEventListener("open", (P) => __async(this, null, function* () {
            if (h("info", "Connection open."), r = { code: "open", connection: Q, firstMessage: true }, m.attempts = 0, m.active = false, x(s), e.authMode === "handshake" && c(s)) {
              let T = yield s.getToken();
              if (!T)
                throw Error("No token for authenticating the websocket. Make sure to provide one or call the login() function beforehand.");
              Q.send(N({ access_token: T }));
              let A = yield w(Q);
              if (A && "type" in A && "status" in A && A.type === "auth" && A.status === "ok")
                h("info", "Authentication successful!");
              else
                return B("Authentication failed while opening websocket connection");
            }
            y.open.forEach((T) => T.call(Q, P)), u = true, d(Q);
          })), Q.addEventListener("error", (P) => {
            h("warn", "Connection errored."), y.error.forEach((T) => T.call(Q, P)), Q.close(), r = { code: "error" }, u || B(P);
          }), Q.addEventListener("close", (P) => {
            h("info", "Connection closed."), y.close.forEach((T) => T.call(Q, P)), a = v(), r = { code: "closed" }, I(this), u || B(P);
          });
        });
        return r = { code: "connecting", connection: S }, S;
      });
    }, disconnect() {
      p = true, r.code === "open" && r.connection.close();
    }, onWebSocket(s, i) {
      if (s === "message") {
        let S = function(d) {
          if (typeof d.data != "string")
            return i.call(this, d);
          try {
            return i.call(this, JSON.parse(d.data));
          } catch {
            return i.call(this, d);
          }
        };
        return y[s].add(S), () => y[s].delete(S);
      }
      return y[s].add(i), () => y[s].delete(i);
    }, sendMessage(s) {
      if (r.code !== "open")
        throw new Error('Cannot send messages without an open connection. Make sure you are calling "await client.connect()".');
      if (typeof s == "string")
        return r.connection.send(s);
      "uid" in s || (s.uid = a.next().value), r.connection.send(JSON.stringify(s));
    }, subscribe(_0) {
      return __async(this, arguments, function* (s, i = {}) {
        "uid" in i || (i.uid = a.next().value), n.add(__spreadProps(__spreadValues({}, i), { collection: s, type: "subscribe" })), r.code !== "open" && (h("info", "No connection available for subscribing!"), yield this.connect()), this.sendMessage(__spreadProps(__spreadValues({}, i), { collection: s, type: "subscribe" }));
        let S = true;
        function d() {
          return __asyncGenerator(this, null, function* () {
            for (; S && r.code === "open"; ) {
              let u = yield new __await(w(r.connection).catch(() => {
              }));
              if (u) {
                if ("type" in u && "status" in u && u.type === "subscribe" && u.status === "error")
                  throw u;
                "type" in u && "uid" in u && u.type === "subscription" && u.uid === i.uid && (yield u);
              }
            }
            e.reconnect && m.active && (yield new __await(m.active), r.code === "open" && (r.connection.send(JSON.stringify(__spreadProps(__spreadValues({}, i), { collection: s, type: "subscribe" }))), yield* __yieldStar(d())));
          });
        }
        let B = () => {
          n.delete(__spreadProps(__spreadValues({}, i), { collection: s, type: "subscribe" })), this.sendMessage({ uid: i.uid, type: "unsubscribe" }), S = false;
        };
        return { subscription: d(), unsubscribe: B };
      });
    } };
  };
}
var Je = (e) => new Promise((t) => setTimeout(() => t(), e));
var qe = (e, t, a = {}) => () => {
  let r = F(a.provider), m = { email: e, password: t };
  return "otp" in a && (m.otp = a.otp), m.mode = a.mode ?? "cookie", { path: r, method: "POST", body: JSON.stringify(m) };
};
var Xe = (e, t = "cookie") => () => ({ path: "/auth/logout", method: "POST", body: JSON.stringify(e ? { refresh_token: e, mode: t } : { mode: t }) });
var Ze = (e, t) => () => ({ path: "/auth/password/request", method: "POST", body: JSON.stringify(__spreadValues({ email: e }, t ? { reset_url: t } : {})) });
var tt = (e, t) => () => ({ path: "/auth/password/reset", method: "POST", body: JSON.stringify({ token: e, password: t }) });
var ot = (e = false) => () => ({ path: e ? "/auth?sessionOnly" : "/auth", method: "GET" });
var mt = (e = "cookie", t) => () => ({ path: "/auth/refresh", method: "POST", body: JSON.stringify(e === "json" ? { refresh_token: t, mode: e } : { mode: e }) });
var dt = (e, t) => () => ({ path: "/activity/comment", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var lt = (e, t) => () => ({ path: "/collections", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var bt = (e, t) => () => ({ path: "/dashboards", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var Ot = (e, t) => () => ({ path: "/dashboards", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var xt = (e, t, a) => () => ({ path: `/fields/${e}`, params: a ?? {}, body: JSON.stringify(t), method: "POST" });
var Ct = (e, t) => () => ({ path: "/files", method: "POST", body: e, params: t ?? {}, headers: { "Content-Type": "multipart/form-data" } });
var Rt = (e, t = {}, a) => () => ({ path: "/files/import", method: "POST", body: JSON.stringify({ url: e, data: t }), params: a ?? {} });
var Bt = (e, t) => () => ({ path: "/flows", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var Pt = (e, t) => () => ({ path: "/flows", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var It = (e, t) => () => ({ path: "/folders", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var At = (e, t) => () => ({ path: "/folders", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
function j(e) {
  return ["samba_bo_access", "samba_bo_activity", "samba_bo_collections", "samba_bo_fields", "samba_bo_files", "samba_bo_folders", "samba_bo_migrations", "samba_bo_permissions", "samba_bo_policies", "samba_bo_presets", "samba_bo_relations", "samba_bo_revisions", "samba_bo_roles", "samba_bo_sessions", "samba_bo_settings", "samba_bo_users", "samba_bo_webhooks", "samba_bo_dashboards", "samba_bo_panels", "samba_bo_notifications", "samba_bo_shares", "samba_bo_flows", "samba_bo_operations", "samba_bo_translations", "samba_bo_versions", "samba_bo_extensions"].includes(e);
}
var Nt = (e, t, a) => () => {
  let r = String(e);
  if (j(r))
    throw new Error("Cannot use createItems for core collections");
  return { path: `/items/${r}`, params: a ?? {}, body: JSON.stringify(t), method: "POST" };
};
var vt = (e, t, a) => () => {
  let r = String(e);
  if (j(r))
    throw new Error("Cannot use createItem for core collections");
  return { path: `/items/${r}`, params: a ?? {}, body: JSON.stringify(t), method: "POST" };
};
var Jt = (e, t) => () => ({ path: "/notifications", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var Dt = (e, t) => () => ({ path: "/notifications", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var kt = (e, t) => () => ({ path: "/operations", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var _t = (e, t) => () => ({ path: "/operations", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var Kt = (e, t) => () => ({ path: "/panels", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var Wt = (e, t) => () => ({ path: "/panels", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var Ht = (e, t) => () => ({ path: "/permissions", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var Vt = (e, t) => () => ({ path: "/permissions", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var qt = (e, t) => () => ({ path: "/policies", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var zt = (e, t) => () => ({ path: "/policies", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var Yt = (e, t) => () => ({ path: "/presets", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var Zt = (e, t) => () => ({ path: "/presets", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var ta = (e) => () => ({ path: "/relations", body: JSON.stringify(e), method: "POST" });
var oa = (e, t) => () => ({ path: "/roles", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var ra = (e, t) => () => ({ path: "/roles", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var sa = (e, t) => () => ({ path: "/shares", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var na = (e, t) => () => ({ path: "/shares", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var pa = (e, t) => () => ({ path: "/translations", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var ca = (e, t) => () => ({ path: "/translations", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var ya = (e, t) => () => ({ path: "/users", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var Sa = (e, t) => () => ({ path: "/users", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var ua = (e, t) => () => ({ path: "/versions", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var la = (e, t) => () => ({ path: "/versions", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var ba = (e, t) => () => ({ path: "/webhooks", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var Oa = (e, t) => () => ({ path: "/webhooks", params: t ?? {}, body: JSON.stringify(e), method: "POST" });
var Ka = (e) => () => ({ path: `/activity/comment/${e}`, method: "DELETE" });
var La = (e) => () => ({ path: `/collections/${e}`, method: "DELETE" });
var U = (e) => {
  let t = (a, r = []) => {
    if (typeof a == "object") {
      let m = [];
      for (let p in a) {
        let n = a[p] ?? [];
        if (Array.isArray(n))
          for (let c of n)
            m.push(t(c, [...r, p]));
        else if (typeof n == "object")
          for (let c of Object.keys(n)) {
            let h = n[c];
            for (let f of h)
              m.push(t(f, [...r, `${p}:${c}`]));
          }
      }
      return m.flatMap((p) => p);
    }
    return [...r, String(a)].join(".");
  };
  return e.flatMap((a) => t(a));
};
var J = (e) => {
  let t = {};
  Array.isArray(e.fields) && e.fields.length > 0 && (t.fields = U(e.fields).join(",")), e.filter && Object.keys(e.filter).length > 0 && (t.filter = JSON.stringify(e.filter)), e.search && (t.search = e.search), "sort" in e && e.sort && (t.sort = typeof e.sort == "string" ? e.sort : e.sort.join(",")), typeof e.limit == "number" && e.limit >= -1 && (t.limit = String(e.limit)), typeof e.offset == "number" && e.offset >= 0 && (t.offset = String(e.offset)), typeof e.page == "number" && e.page >= 1 && (t.page = String(e.page)), e.deep && Object.keys(e.deep).length > 0 && (t.deep = JSON.stringify(e.deep)), e.alias && Object.keys(e.alias).length > 0 && (t.alias = JSON.stringify(e.alias)), e.aggregate && Object.keys(e.aggregate).length > 0 && (t.aggregate = JSON.stringify(e.aggregate)), e.groupBy && e.groupBy.length > 0 && (t.groupBy = e.groupBy.join(","));
  for (let [a, r] of Object.entries(e))
    a in t || (typeof r == "string" || typeof r == "number" || typeof r == "boolean" ? t[a] = String(r) : t[a] = JSON.stringify(r));
  return t;
};
var o = (e, t) => {
  if (e.length === 0)
    throw new Error(t);
};
var O = (e, t) => {
  if (j(String(e)))
    throw new Error(t);
};
var oo = (e) => () => (o(e, "Keys cannot be empty"), { path: "/dashboards", body: JSON.stringify(e), method: "DELETE" });
var ro = (e) => () => (o(e, "Key cannot be empty"), { path: `/dashboards/${e}`, method: "DELETE" });
var no = (e, t) => () => (o(e, "Collection cannot be empty"), o(t, "Field cannot be empty"), { path: `/fields/${e}/${t}`, method: "DELETE" });
var co = (e) => () => (o(e, "Keys cannot be empty"), { path: "/files", body: JSON.stringify(e), method: "DELETE" });
var ho = (e) => () => (o(e, "Key cannot be empty"), { path: `/files/${e}`, method: "DELETE" });
var uo = (e) => () => (o(e, "Keys cannot be empty"), { path: "/flows", body: JSON.stringify(e), method: "DELETE" });
var lo = (e) => () => (o(e, "Key cannot be empty"), { path: `/flows/${e}`, method: "DELETE" });
var Oo = (e) => () => (o(e, "Keys cannot be empty"), { path: "/folders", body: JSON.stringify(e), method: "DELETE" });
var Qo = (e) => () => (o(e, "Key cannot be empty"), { path: `/folders/${e}`, method: "DELETE" });
var Co = (e, t) => () => {
  let a = {};
  return o(String(e), "Collection cannot be empty"), O(e, "Cannot use deleteItems for core collections"), Array.isArray(t) ? (o(t, "keysOrQuery cannot be empty"), a = { keys: t }) : (o(Object.keys(t), "keysOrQuery cannot be empty"), a = { query: t }), { path: `/items/${e}`, body: JSON.stringify(a), method: "DELETE" };
};
var Ro = (e, t) => () => (o(String(e), "Collection cannot be empty"), O(e, "Cannot use deleteItem for core collections"), o(String(t), "Key cannot be empty"), { path: `/items/${e}/${t}`, method: "DELETE" });
var Po = (e) => () => (o(e, "Keys cannot be empty"), { path: "/notifications", body: JSON.stringify(e), method: "DELETE" });
var jo = (e) => () => (o(e, "Key cannot be empty"), { path: `/notifications/${e}`, method: "DELETE" });
var Fo = (e) => () => (o(e, "Keys cannot be empty"), { path: "/operations", body: JSON.stringify(e), method: "DELETE" });
var Eo = (e) => () => (o(e, "Key cannot be empty"), { path: `/operations/${e}`, method: "DELETE" });
var vo = (e) => () => (o(e, "Keys cannot be empty"), { path: "/panels", body: JSON.stringify(e), method: "DELETE" });
var Uo = (e) => () => (o(e, "Key cannot be empty"), { path: `/panels/${e}`, method: "DELETE" });
var $o = (e) => () => (o(e, "Keys cannot be empty"), { path: "/permissions", body: JSON.stringify(e), method: "DELETE" });
var ko = (e) => () => (o(String(e), "Key cannot be empty"), { path: `/permissions/${e}`, method: "DELETE" });
var Ko = (e) => () => (o(e, "Keys cannot be empty"), { path: "/policies", body: JSON.stringify(e), method: "DELETE" });
var Wo = (e) => () => (o(String(e), "Key cannot be empty"), { path: `/policies/${e}`, method: "DELETE" });
var Vo = (e) => () => (o(e, "Keys cannot be empty"), { path: "/presets", body: JSON.stringify(e), method: "DELETE" });
var Mo = (e) => () => (o(String(e), "Key cannot be empty"), { path: `/presets/${e}`, method: "DELETE" });
var Xo = (e, t) => () => (o(e, "Collection cannot be empty"), o(t, "Field cannot be empty"), { path: `/relations/${e}/${t}`, method: "DELETE" });
var er = (e) => () => (o(e, "Keys cannot be empty"), { path: "/roles", body: JSON.stringify(e), method: "DELETE" });
var tr = (e) => () => (o(String(e), "Key cannot be empty"), { path: `/roles/${e}`, method: "DELETE" });
var rr = (e) => () => (o(e, "Keys cannot be empty"), { path: "/shares", body: JSON.stringify(e), method: "DELETE" });
var mr = (e) => () => (o(String(e), "Key cannot be empty"), { path: `/shares/${e}`, method: "DELETE" });
var ir = (e) => () => (o(e, "Keys cannot be empty"), { path: "/translations", body: JSON.stringify(e), method: "DELETE" });
var pr = (e) => () => (o(String(e), "Key cannot be empty"), { path: `/translations/${e}`, method: "DELETE" });
var yr = (e) => () => (o(e, "Keys cannot be empty"), { path: "/users", body: JSON.stringify(e), method: "DELETE" });
var Sr = (e) => () => (o(String(e), "Key cannot be empty"), { path: `/users/${e}`, method: "DELETE" });
var lr = (e) => () => (o(e, "Keys cannot be empty"), { path: "/versions", body: JSON.stringify(e), method: "DELETE" });
var fr = (e) => () => (o(e, "Key cannot be empty"), { path: `/versions/${e}`, method: "DELETE" });
var Qr = (e) => () => (o(e, "Keys cannot be empty"), { path: "/webhooks", body: JSON.stringify(e), method: "DELETE" });
var xr = (e) => () => (o(String(e), "Key cannot be empty"), { path: `/webhooks/${e}`, method: "DELETE" });
var Hr = (e) => () => ({ path: "/activity", params: e ?? {}, method: "GET" });
var Vr = (e, t) => () => (o(String(e), "Key cannot be empty"), { path: `/activity/${e}`, params: t ?? {}, method: "GET" });
var Yr = (e, t) => () => {
  let a = String(e);
  return o(a, "Collection cannot be empty"), { path: j(a) ? `/${a.substring(9)}` : `/items/${a}`, method: "GET", params: __spreadProps(__spreadValues(__spreadValues({}, t.query ?? {}), t.groupBy ? { groupBy: t.groupBy } : {}), { aggregate: t.aggregate }) };
};
var tm = (e, t) => () => (o(String(e), "Key cannot be empty"), { path: `/assets/${e}`, params: t ?? {}, method: "GET", onResponse: (a) => a.body });
var am = (e, t) => () => (o(String(e), "Key cannot be empty"), { path: `/assets/${e}`, params: t ?? {}, method: "GET", onResponse: (a) => a.blob() });
var om = (e, t) => () => (o(String(e), "Key cannot be empty"), { path: `/assets/${e}`, params: t ?? {}, method: "GET", onResponse: (a) => a.arrayBuffer() });
var sm = () => () => ({ path: "/collections", method: "GET" });
var nm = (e) => () => (o(e, "Collection cannot be empty"), { path: `/collections/${e}`, method: "GET" });
var cm = (e) => () => ({ path: "/dashboards", params: e ?? {}, method: "GET" });
var hm = (e, t) => () => (o(String(e), "Key cannot be empty"), { path: `/dashboards/${e}`, params: t ?? {}, method: "GET" });
var Sm = () => () => ({ path: "/extensions/", method: "GET" });
var lm = () => () => ({ path: "/fields", method: "GET" });
var fm = (e) => () => (o(e, "Collection cannot be empty"), { path: `/fields/${e}`, method: "GET" });
var bm = (e, t) => () => (o(e, "Collection cannot be empty"), o(t, "Field cannot be empty"), { path: `/fields/${e}/${t}`, method: "GET" });
var xm = (e) => () => ({ path: "/files", params: e ?? {}, method: "GET" });
var Tm = (e, t) => () => (o(String(e), "Key cannot be empty"), { path: `/files/${e}`, params: t ?? {}, method: "GET" });
var gm = (e) => () => ({ path: "/flows", params: e ?? {}, method: "GET" });
var Bm = (e, t) => () => (o(String(e), "Key cannot be empty"), { path: `/flows/${e}`, params: t ?? {}, method: "GET" });
var Im = (e) => () => ({ path: "/folders", params: e ?? {}, method: "GET" });
var Am = (e, t) => () => (o(String(e), "Key cannot be empty"), { path: `/folders/${e}`, params: t ?? {}, method: "GET" });
var wm = (e, t) => () => (o(String(e), "Collection cannot be empty"), O(e, "Cannot use readItems for core collections"), { path: `/items/${e}`, params: t ?? {}, method: "GET" });
var Nm = (e, t, a) => () => (o(String(e), "Collection cannot be empty"), O(e, "Cannot use readItem for core collections"), o(String(t), "Key cannot be empty"), { path: `/items/${e}/${t}`, params: a ?? {}, method: "GET" });
var Jm = (e) => () => ({ path: "/notifications", params: e ?? {}, method: "GET" });
var Dm = (e, t) => () => (o(String(e), "Key cannot be empty"), { path: `/notifications/${e}`, params: t ?? {}, method: "GET" });
var _m = (e) => () => ({ path: "/operations", params: e ?? {}, method: "GET" });
var Gm = (e, t) => () => (o(String(e), "Key cannot be empty"), { path: `/operations/${e}`, params: t ?? {}, method: "GET" });
var Lm = (e) => () => ({ path: "/panels", params: e ?? {}, method: "GET" });
var Hm = (e, t) => () => (o(String(e), "Key cannot be empty"), { path: `/panels/${e}`, params: t ?? {}, method: "GET" });
var qm = (e) => () => ({ path: "/permissions", params: e ?? {}, method: "GET" });
var zm = (e, t) => () => (o(String(e), "Key cannot be empty"), { path: `/permissions/${e}`, params: t ?? {}, method: "GET" });
var Xm = (e, t) => () => (o(String(e), "Collection cannot be empty"), { path: `/permissions/me/${t ? `${e}/${t}` : `${e}`}`, method: "GET" });
var Ym = () => () => ({ path: "/permissions/me", method: "GET" });
var ts = (e) => () => ({ path: "/policies", params: e ?? {}, method: "GET" });
var as = (e, t) => () => (o(String(e), "Key cannot be empty"), { path: `/policies/${e}`, params: t ?? {}, method: "GET" });
var os = () => () => ({ path: "/policies/me/globals", method: "GET" });
var ss = (e) => () => ({ path: "/presets", params: e ?? {}, method: "GET" });
var ns = (e, t) => () => (o(String(e), "Key cannot be empty"), { path: `/presets/${e}`, params: t ?? {}, method: "GET" });
var cs = () => () => ({ path: "/relations", method: "GET" });
var hs = (e) => () => ({ path: `/relations/${e}`, method: "GET" });
var ys = (e, t) => () => (o(e, "Collection cannot be empty"), o(t, "Field cannot be empty"), { path: `/relations/${e}/${t}`, method: "GET" });
var us = (e) => () => ({ path: "/revisions", params: e ?? {}, method: "GET" });
var ls = (e, t) => () => (o(String(e), "Key cannot be empty"), { path: `/revisions/${e}`, params: t ?? {}, method: "GET" });
var Os = (e) => () => ({ path: "/roles", params: e ?? {}, method: "GET" });
var Qs = (e, t) => () => (o(String(e), "Key cannot be empty"), { path: `/roles/${e}`, params: t ?? {}, method: "GET" });
var xs = (e) => () => ({ path: "/roles/me", params: e ?? {}, method: "GET" });
var Cs = (e) => () => ({ path: "/settings", params: e ?? {}, method: "GET" });
var Bs = (e) => () => ({ path: "/shares", params: e ?? {}, method: "GET" });
var Ps = (e, t) => () => (o(String(e), "Key cannot be empty"), { path: `/shares/${e}`, params: t ?? {}, method: "GET" });
var As = (e, t) => () => (o(String(e), "Collection cannot be empty"), O(e, "Cannot use readSingleton for core collections"), { path: `/items/${e}`, params: t ?? {}, method: "GET" });
var ws = (e) => () => ({ path: "/translations", params: e ?? {}, method: "GET" });
var Ns = (e, t) => () => (o(String(e), "Key cannot be empty"), { path: `/translations/${e}`, params: t ?? {}, method: "GET" });
var Js = (e) => () => ({ path: "/users", params: e ?? {}, method: "GET" });
var Ds = (e, t) => () => (o(String(e), "Key cannot be empty"), { path: `/users/${e}`, params: t ?? {}, method: "GET" });
var $s = (e) => () => ({ path: "/users/me", params: e ?? {}, method: "GET" });
var Gs = (e) => () => ({ path: "/versions", params: e ?? {}, method: "GET" });
var Ks = (e, t) => () => (o(String(e), "Key cannot be empty"), { path: `/versions/${e}`, params: t ?? {}, method: "GET" });
var Hs = (e) => () => ({ path: "/webhooks", params: e ?? {}, method: "GET" });
var Vs = (e, t) => () => (o(String(e), "Key cannot be empty"), { path: `/webhooks/${e}`, params: t ?? {}, method: "GET" });
var Rn = (e) => () => ({ method: "POST", path: "/schema/apply", body: JSON.stringify(e) });
var Bn = (e, t = false) => () => ({ method: "POST", path: "/schema/diff", params: t ? { force: t } : {}, body: JSON.stringify(e) });
var jn = () => () => ({ method: "GET", path: "/schema/snapshot" });
var Nn = (e = "item") => () => ({ method: "GET", path: e === "item" ? "/server/specs/graphql" : "/server/specs/graphql/system" });
var Un = () => () => ({ method: "GET", path: "/server/health" });
var Dn = () => () => ({ method: "GET", path: "/server/info" });
var kn = () => () => ({ method: "GET", path: "/server/specs/oas" });
var Gn = () => () => ({ method: "GET", path: "/server/ping" });
var Xn = (e, t, a) => () => (o(String(e), "Key cannot be empty"), { path: `/activity/comment/${e}`, params: a ?? {}, body: JSON.stringify(t), method: "PATCH" });
var ei = (e, t, a) => () => (o(e, "Collection cannot be empty"), { path: `/collections/${e}`, params: a ?? {}, body: JSON.stringify(t), method: "PATCH" });
var ti = (e, t) => () => ({ path: "/collections", params: t ?? {}, body: JSON.stringify(e), method: "PATCH" });
var ri = (e, t, a) => () => (o(e, "Keys cannot be empty"), { path: "/dashboards", params: a ?? {}, body: JSON.stringify({ keys: e, data: t }), method: "PATCH" });
var mi = (e, t) => () => ({ path: "/dashboards", params: t ?? {}, body: JSON.stringify(e), method: "PATCH" });
var si = (e, t, a) => () => (o(e, "Key cannot be empty"), { path: `/dashboards/${e}`, params: a ?? {}, body: JSON.stringify(t), method: "PATCH" });
var pi = (e, t, a) => () => (e !== null && o(e, "Bundle cannot be an empty string"), o(t, "Name cannot be empty"), { path: e ? `/extensions/${e}/${t}` : `/extensions/${t}`, params: {}, body: JSON.stringify(a), method: "PATCH" });
var yi = (e, t, a, r) => () => (o(e, "Keys cannot be empty"), o(t, "Field cannot be empty"), { path: `/fields/${e}/${t}`, params: r ?? {}, body: JSON.stringify(a), method: "PATCH" });
var ui = (e, t, a) => () => (o(e, "Keys cannot be empty"), { path: "/files", params: a ?? {}, body: JSON.stringify({ keys: e, data: t }), method: "PATCH" });
var li = (e, t) => () => ({ path: "/files", params: t ?? {}, body: JSON.stringify(e), method: "PATCH" });
var fi = (e, t, a) => () => (o(e, "Key cannot be empty"), t instanceof FormData ? { path: `/files/${e}`, params: a ?? {}, body: t, method: "PATCH", headers: { "Content-Type": "multipart/form-data" } } : { path: `/files/${e}`, params: a ?? {}, body: JSON.stringify(t), method: "PATCH" });
var Qi = (e, t, a) => () => (o(e, "Keys cannot be empty"), { path: "/flows", params: a ?? {}, body: JSON.stringify({ keys: e, data: t }), method: "PATCH" });
var xi = (e, t) => () => ({ path: "/flows", params: t ?? {}, body: JSON.stringify(e), method: "PATCH" });
var Ti = (e, t, a) => () => (o(e, "Key cannot be empty"), { path: `/flows/${e}`, params: a ?? {}, body: JSON.stringify(t), method: "PATCH" });
var gi = (e, t, a) => () => (o(e, "Keys cannot be empty"), { path: "/folders", params: a ?? {}, body: JSON.stringify({ keys: e, data: t }), method: "PATCH" });
var Bi = (e, t) => () => ({ path: "/folders", params: t ?? {}, body: JSON.stringify(e), method: "PATCH" });
var Pi = (e, t, a) => () => (o(e, "Key cannot be empty"), { path: `/folders/${e}`, params: a ?? {}, body: JSON.stringify(t), method: "PATCH" });
var Ai = (e, t, a, r) => () => {
  let m = {};
  return o(String(e), "Collection cannot be empty"), O(e, "Cannot use updateItems for core collections"), Array.isArray(t) ? (o(t, "keysOrQuery cannot be empty"), m = { keys: t }) : (o(Object.keys(t), "keysOrQuery cannot be empty"), m = { query: t }), m.data = a, { path: `/items/${e}`, params: r ?? {}, body: JSON.stringify(m), method: "PATCH" };
};
var Fi = (e, t, a) => () => (o(String(e), "Collection cannot be empty"), O(e, "Cannot use updateItems for core collections"), { path: `/items/${e}`, params: a ?? {}, body: JSON.stringify(t), method: "PATCH" });
var Ei = (e, t, a, r) => () => (o(String(t), "Key cannot be empty"), o(String(e), "Collection cannot be empty"), O(e, "Cannot use updateItem for core collections"), { path: `/items/${e}/${t}`, params: r ?? {}, body: JSON.stringify(a), method: "PATCH" });
var vi = (e, t, a) => () => (o(e, "Keys cannot be empty"), { path: "/notifications", params: a ?? {}, body: JSON.stringify({ keys: e, data: t }), method: "PATCH" });
var Ui = (e, t) => () => ({ path: "/notifications", params: t ?? {}, body: JSON.stringify(e), method: "PATCH" });
var Ji = (e, t, a) => () => (o(e, "Key cannot be empty"), { path: `/notifications/${e}`, params: a ?? {}, body: JSON.stringify(t), method: "PATCH" });
var ki = (e, t, a) => () => (o(e, "Keys cannot be empty"), { path: "/operations", params: a ?? {}, body: JSON.stringify({ keys: e, data: t }), method: "PATCH" });
var _i = (e, t) => () => ({ path: "/operations", params: t ?? {}, body: JSON.stringify(e), method: "PATCH" });
var Gi = (e, t, a) => () => (o(e, "Key cannot be empty"), { path: `/operations/${e}`, params: a ?? {}, body: JSON.stringify(t), method: "PATCH" });
var Li = (e, t, a) => () => (o(e, "Keys cannot be empty"), { path: "/panels", params: a ?? {}, body: JSON.stringify({ keys: e, data: t }), method: "PATCH" });
var Hi = (e, t) => () => ({ path: "/panels", params: t ?? {}, body: JSON.stringify(e), method: "PATCH" });
var Vi = (e, t, a) => () => (o(e, "Key cannot be empty"), { path: `/panels/${e}`, params: a ?? {}, body: JSON.stringify(t), method: "PATCH" });
var zi = (e, t, a) => () => (o(e, "Keys cannot be empty"), { path: "/permissions", params: a ?? {}, body: JSON.stringify({ keys: e, data: t }), method: "PATCH" });
var Xi = (e, t) => () => ({ path: "/permissions", params: t ?? {}, body: JSON.stringify(e), method: "PATCH" });
var Yi = (e, t, a) => () => (o(String(e), "Key cannot be empty"), { path: `/permissions/${e}`, params: a ?? {}, body: JSON.stringify(t), method: "PATCH" });
var tp = (e, t, a) => () => (o(e, "Keys cannot be empty"), { path: "/policies", params: a ?? {}, body: JSON.stringify({ keys: e, data: t }), method: "PATCH" });
var ap = (e, t) => () => ({ path: "/policies", params: t ?? {}, body: JSON.stringify(e), method: "PATCH" });
var op = (e, t, a) => () => (o(String(e), "Key cannot be empty"), { path: `/policies/${e}`, params: a ?? {}, body: JSON.stringify(t), method: "PATCH" });
var sp = (e, t, a) => () => (o(e, "Keys cannot be empty"), { path: "/presets", params: a ?? {}, body: JSON.stringify({ keys: e, data: t }), method: "PATCH" });
var np = (e, t) => () => ({ path: "/presets", params: t ?? {}, body: JSON.stringify(e), method: "PATCH" });
var ip = (e, t, a) => () => (o(String(e), "Key cannot be empty"), { path: `/presets/${e}`, params: a ?? {}, body: JSON.stringify(t), method: "PATCH" });
var hp = (e, t, a, r) => () => (o(e, "Collection cannot be empty"), o(t, "Field cannot be empty"), { path: `/relations/${e}/${t}`, params: r ?? {}, body: JSON.stringify(a), method: "PATCH" });
var dp = (e, t, a) => () => (o(e, "Keys cannot be empty"), { path: "/roles", params: a ?? {}, body: JSON.stringify({ keys: e, data: t }), method: "PATCH" });
var up = (e, t) => () => ({ path: "/roles", params: t ?? {}, body: JSON.stringify(e), method: "PATCH" });
var lp = (e, t, a) => () => (o(e, "Key cannot be empty"), { path: `/roles/${e}`, params: a ?? {}, body: JSON.stringify(t), method: "PATCH" });
var bp = (e, t) => () => ({ path: "/settings", params: t ?? {}, body: JSON.stringify(e), method: "PATCH" });
var xp = (e, t, a) => () => (o(e, "Keys cannot be empty"), { path: "/shares", params: a ?? {}, body: JSON.stringify({ keys: e, data: t }), method: "PATCH" });
var Tp = (e, t) => () => ({ path: "/shares", params: t ?? {}, body: JSON.stringify(e), method: "PATCH" });
var Cp = (e, t, a) => () => (o(e, "Key cannot be empty"), { path: `/shares/${e}`, params: a ?? {}, body: JSON.stringify(t), method: "PATCH" });
var Bp = (e, t, a) => () => (o(String(e), "Collection cannot be empty"), O(e, "Cannot use updateSingleton for core collections"), { path: `/items/${e}`, params: a ?? {}, body: JSON.stringify(t), method: "PATCH" });
var Ip = (e, t, a) => () => (o(e, "Keys cannot be empty"), { path: "/translations", params: a ?? {}, body: JSON.stringify({ keys: e, data: t }), method: "PATCH" });
var Ap = (e, t) => () => ({ path: "/translations", params: t ?? {}, body: JSON.stringify(e), method: "PATCH" });
var Fp = (e, t, a) => () => (o(String(e), "Key cannot be empty"), { path: `/translations/${e}`, params: a ?? {}, body: JSON.stringify(t), method: "PATCH" });
var Np = (e, t, a) => () => (o(e, "Keys cannot be empty"), { path: "/users", params: a ?? {}, body: JSON.stringify({ keys: e, data: t }), method: "PATCH" });
var vp = (e, t) => () => ({ path: "/users", params: t ?? {}, body: JSON.stringify(e), method: "PATCH" });
var Up = (e, t, a) => () => (o(e, "Key cannot be empty"), { path: `/users/${e}`, params: a ?? {}, body: JSON.stringify(t), method: "PATCH" });
var Jp = (e, t) => () => ({ path: "/users/me", params: t ?? {}, body: JSON.stringify(e), method: "PATCH" });
var kp = (e, t, a) => () => (o(e, "Keys cannot be empty"), { path: "/versions", params: a ?? {}, body: JSON.stringify({ keys: e, data: t }), method: "PATCH" });
var _p = (e, t) => () => ({ path: "/versions", params: t ?? {}, body: JSON.stringify(e), method: "PATCH" });
var Gp = (e, t, a) => () => (o(e, "Key cannot be empty"), { path: `/versions/${e}`, params: a ?? {}, body: JSON.stringify(t), method: "PATCH" });
var Lp = (e, t, a) => () => (o(e, "Keys cannot be empty"), { path: "/webhooks", params: a ?? {}, body: JSON.stringify({ keys: e, data: t }), method: "PATCH" });
var Hp = (e, t, a) => () => (o(String(e), "Key cannot be empty"), { path: `/webhooks/${e}`, params: a ?? {}, body: JSON.stringify(t), method: "PATCH" });
var Oc = () => () => ({ method: "POST", path: "/utils/cache/clear" });
var xc = (e, t, a, r) => () => ({ method: "POST", path: `/utils/export/${e}`, body: JSON.stringify({ format: t, query: a, file: r }) });
var Cc = (e, t, a) => () => e === "GET" ? { path: `/flows/trigger/${t}`, params: a ?? {}, method: "GET" } : { path: `/flows/trigger/${t}`, body: JSON.stringify(a ?? {}), method: "POST" };
var gc = (e) => () => ({ method: "POST", path: "/utils/hash/generate", body: JSON.stringify({ string: e }) });
var Bc = (e, t) => () => ({ method: "POST", path: "/utils/hash/verify", body: JSON.stringify({ string: e, hash: t }) });
var jc = (e, t) => () => ({ path: `/utils/import/${e}`, method: "POST", body: t, headers: { "Content-Type": "multipart/form-data" } });
var Ac = (e, t) => () => ({ path: `/operations/trigger/${e}`, body: JSON.stringify(t ?? {}), method: "POST" });
var Ec = (e, t, a = "cookie") => () => ({ path: "/shares/auth", method: "POST", body: JSON.stringify({ share: e, password: t, mode: a }) });
var wc = (e, t) => () => ({ path: "/shares/invite", method: "POST", body: JSON.stringify({ share: e, emails: t }) });
var Nc = (e) => () => ({ path: `/shares/info/${e}`, method: "GET" });
var Uc = (e, t, a) => () => ({ method: "POST", path: `/utils/sort/${e}`, body: JSON.stringify({ item: t, to: a }) });
var Dc = (e, t, a) => () => ({ path: "/users/invite", method: "POST", body: JSON.stringify(__spreadValues({ email: e, role: t }, a ? { invite_url: a } : {})) });
var $c = (e, t) => () => ({ path: "/users/invite/accept", method: "POST", body: JSON.stringify({ token: e, password: t }) });
var kc = (e, t, a = {}) => () => ({ path: "/users/register", method: "POST", body: JSON.stringify(__spreadValues({ email: e, password: t }, a)) });
var _c = (e) => () => ({ path: "/users/register/verify-email", params: { token: e }, method: "GET" });
var Gc = (e) => () => ({ path: "/users/me/tfa/generate", method: "POST", body: JSON.stringify({ password: e }) });
var Kc = (e, t) => () => ({ path: "/users/me/tfa/enable", method: "POST", body: JSON.stringify({ secret: e, otp: t }) });
var Wc = (e) => () => ({ path: "/users/me/tfa/disable", method: "POST", body: JSON.stringify({ otp: e }) });
var Vc = (e, t) => () => (o(e, "ID cannot be empty"), { path: `/versions/${e}/save`, method: "POST", body: JSON.stringify(t) });
var Mc = (e) => () => (o(e, "ID cannot be empty"), { path: `/versions/${e}/compare`, method: "GET" });
var qc = (e, t, a) => () => (o(e, "ID cannot be empty"), { path: `/versions/${e}/promote`, method: "POST", body: JSON.stringify(a ? { mainHash: t, fields: a } : { mainHash: t }) });
var Xc = (e) => () => ({ method: "GET", path: "/utils/random/string", params: e !== void 0 ? { length: e } : {} });
var M = {};
var Th = (e = {}) => (t) => {
  let a = __spreadValues(__spreadValues({}, M), e);
  return { request(r) {
    return __async(this, null, function* () {
      let m = r();
      if (m.headers || (m.headers = {}), "Content-Type" in m.headers ? m.headers["Content-Type"] === "multipart/form-data" && delete m.headers["Content-Type"] : m.headers["Content-Type"] = "application/json", "getToken" in this) {
        let h = yield this.getToken();
        h && (m.headers || (m.headers = {}), m.headers.Authorization = `Bearer ${h}`);
      }
      let p = C(t.url, m.path, m.params), n = { method: m.method ?? "GET", headers: m.headers ?? {} };
      "credentials" in a && (n.credentials = a.credentials), m.body && (n.body = m.body), m.onRequest && (n = yield m.onRequest(n)), a.onRequest && (n = yield a.onRequest(n));
      let c = yield R(p.toString(), n, t.globals.fetch);
      return "onResponse" in m && (c = yield m.onResponse(c, n)), "onResponse" in e && (c = yield e.onResponse(c, n)), c;
    });
  } };
};
function Rh(e, t) {
  return () => {
    let a = e();
    return typeof t == "function" ? a.onRequest = t : a.onRequest = (r) => __spreadValues(__spreadValues({}, r), t), a;
  };
}
function Ph(e) {
  return () => {
    let t = e();
    return t.method === "GET" && t.params && (t.method = "SEARCH", t.body = JSON.stringify({ query: __spreadProps(__spreadValues({}, t.params), { fields: U(t.params.fields ?? []) }) }), delete t.params), t;
  };
}
function Ih(e, t) {
  return () => {
    let a = t();
    return e && (a.headers || (a.headers = {}), a.headers.Authorization = `Bearer ${e}`), a;
  };
}
function Fh(e) {
  return () => e;
}
export {
  $c as acceptUserInvite,
  Yr as aggregate,
  N as auth,
  Ec as authenticateShare,
  ie as authentication,
  Oc as clearCache,
  Mc as compareContentVersion,
  lt as createCollection,
  dt as createComment,
  la as createContentVersion,
  ua as createContentVersions,
  Ot as createDashboard,
  bt as createDashboards,
  xt as createField,
  Pt as createFlow,
  Bt as createFlows,
  At as createFolder,
  It as createFolders,
  vt as createItem,
  Nt as createItems,
  Dt as createNotification,
  Jt as createNotifications,
  _t as createOperation,
  kt as createOperations,
  Wt as createPanel,
  Kt as createPanels,
  Vt as createPermission,
  Ht as createPermissions,
  qt as createPolicies,
  zt as createPolicy,
  Zt as createPreset,
  Yt as createPresets,
  ta as createRelation,
  ra as createRole,
  oa as createRoles,
  le as createSambaBO,
  na as createShare,
  sa as createShares,
  ca as createTranslation,
  pa as createTranslations,
  Sa as createUser,
  ya as createUsers,
  Oa as createWebhook,
  ba as createWebhooks,
  Fh as customEndpoint,
  La as deleteCollection,
  Ka as deleteComment,
  fr as deleteContentVersion,
  lr as deleteContentVersions,
  ro as deleteDashboard,
  oo as deleteDashboards,
  no as deleteField,
  ho as deleteFile,
  co as deleteFiles,
  lo as deleteFlow,
  uo as deleteFlows,
  Qo as deleteFolder,
  Oo as deleteFolders,
  Ro as deleteItem,
  Co as deleteItems,
  jo as deleteNotification,
  Po as deleteNotifications,
  Eo as deleteOperation,
  Fo as deleteOperations,
  Uo as deletePanel,
  vo as deletePanels,
  ko as deletePermission,
  $o as deletePermissions,
  Ko as deletePolicies,
  Wo as deletePolicy,
  Mo as deletePreset,
  Vo as deletePresets,
  Xo as deleteRelation,
  tr as deleteRole,
  er as deleteRoles,
  mr as deleteShare,
  rr as deleteShares,
  pr as deleteTranslation,
  ir as deleteTranslations,
  Sr as deleteUser,
  yr as deleteUsers,
  xr as deleteWebhook,
  Qr as deleteWebhooks,
  Wc as disableTwoFactor,
  Kc as enableTwoFactor,
  U as formatFields,
  gc as generateHash,
  Gc as generateTwoFactorSecret,
  v as generateUid,
  F as getAuthEndpoint,
  Qe as graphql,
  Rt as importFile,
  wc as inviteShare,
  Dc as inviteUser,
  qe as login,
  Xe as logout,
  k as memoryStorage,
  w as messageCallback,
  Ze as passwordRequest,
  tt as passwordReset,
  G as pong,
  qc as promoteContentVersion,
  J as queryToParams,
  Xc as randomString,
  Hr as readActivities,
  Vr as readActivity,
  om as readAssetArrayBuffer,
  am as readAssetBlob,
  tm as readAssetRaw,
  nm as readCollection,
  sm as readCollections,
  Ks as readContentVersion,
  Gs as readContentVersions,
  hm as readDashboard,
  cm as readDashboards,
  Sm as readExtensions,
  bm as readField,
  lm as readFields,
  fm as readFieldsByCollection,
  Tm as readFile,
  xm as readFiles,
  Bm as readFlow,
  gm as readFlows,
  Am as readFolder,
  Im as readFolders,
  Nn as readGraphqlSdl,
  Nm as readItem,
  Xm as readItemPermissions,
  wm as readItems,
  $s as readMe,
  Dm as readNotification,
  Jm as readNotifications,
  kn as readOpenApiSpec,
  Gm as readOperation,
  _m as readOperations,
  Hm as readPanel,
  Lm as readPanels,
  zm as readPermission,
  qm as readPermissions,
  ts as readPolicies,
  as as readPolicy,
  os as readPolicyGlobals,
  ns as readPreset,
  ss as readPresets,
  ot as readProviders,
  ys as readRelation,
  hs as readRelationByCollection,
  cs as readRelations,
  ls as readRevision,
  us as readRevisions,
  Qs as readRole,
  Os as readRoles,
  xs as readRolesMe,
  Cs as readSettings,
  Ps as readShare,
  Nc as readShareInfo,
  Bs as readShares,
  As as readSingleton,
  Ns as readTranslation,
  ws as readTranslations,
  Ds as readUser,
  Ym as readUserPermissions,
  Js as readUsers,
  Vs as readWebhook,
  Hs as readWebhooks,
  ve as realtime,
  mt as refresh,
  kc as registerUser,
  _c as registerUserVerify,
  Th as rest,
  Vc as saveToContentVersion,
  Rn as schemaApply,
  Bn as schemaDiff,
  jn as schemaSnapshot,
  Un as serverHealth,
  Dn as serverInfo,
  Gn as serverPing,
  Je as sleep,
  ce as staticToken,
  O as throwIfCoreCollection,
  o as throwIfEmpty,
  Cc as triggerFlow,
  Ac as triggerOperation,
  ei as updateCollection,
  ti as updateCollectionsBatch,
  Xn as updateComment,
  Gp as updateContentVersion,
  kp as updateContentVersions,
  _p as updateContentVersionsBatch,
  si as updateDashboard,
  ri as updateDashboards,
  mi as updateDashboardsBatch,
  pi as updateExtension,
  yi as updateField,
  fi as updateFile,
  ui as updateFiles,
  li as updateFilesBatch,
  Ti as updateFlow,
  Qi as updateFlows,
  xi as updateFlowsBatch,
  Pi as updateFolder,
  gi as updateFolders,
  Bi as updateFoldersBatch,
  Ei as updateItem,
  Ai as updateItems,
  Fi as updateItemsBatch,
  Jp as updateMe,
  Ji as updateNotification,
  vi as updateNotifications,
  Ui as updateNotificationsBatch,
  Gi as updateOperation,
  ki as updateOperations,
  _i as updateOperationsBatch,
  Vi as updatePanel,
  Li as updatePanels,
  Hi as updatePanelsBatch,
  Yi as updatePermission,
  zi as updatePermissions,
  Xi as updatePermissionsBatch,
  tp as updatePolicies,
  ap as updatePoliciesBatch,
  op as updatePolicy,
  ip as updatePreset,
  sp as updatePresets,
  np as updatePresetsBatch,
  hp as updateRelation,
  lp as updateRole,
  dp as updateRoles,
  up as updateRolesBatch,
  bp as updateSettings,
  Cp as updateShare,
  xp as updateShares,
  Tp as updateSharesBatch,
  Bp as updateSingleton,
  Fp as updateTranslation,
  Ip as updateTranslations,
  Ap as updateTranslationsBatch,
  Up as updateUser,
  Np as updateUsers,
  vp as updateUsersBatch,
  Hp as updateWebhook,
  Lp as updateWebhooks,
  Ct as uploadFiles,
  Uc as utilitySort,
  xc as utilsExport,
  jc as utilsImport,
  Bc as verifyHash,
  Rh as withOptions,
  Ph as withSearch,
  Ih as withToken
};
//# sourceMappingURL=samba-bo-sdk.js.map
