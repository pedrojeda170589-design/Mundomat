// SOLO PARA PRUEBAS LOCALES: imita la API de Supabase (REST + login) para
// probar la app sin una cuenta real. Usa PostgREST (puerto 3001) y
// firma los JWT con el mismo secreto.
//   JWT_SECRET=... DATABASE_URL=... node supabase/tests/local-gateway.mjs
import http from "node:http";
import crypto from "node:crypto";
import pg from "pg";

const SECRET = process.env.JWT_SECRET;
const PORT = Number(process.env.GATEWAY_PORT || 54321);
const REST = process.env.POSTGREST_URL || "http://127.0.0.1:3001";
const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const b64 = (o) => Buffer.from(typeof o === "string" ? o : JSON.stringify(o)).toString("base64url");
export function sign(payload) {
  const h = b64({ alg: "HS256", typ: "JWT" });
  const p = b64(payload);
  const s = crypto.createHmac("sha256", SECRET).update(`${h}.${p}`).digest("base64url");
  return `${h}.${p}.${s}`;
}
function verify(token) {
  const [h, p, s] = (token || "").split(".");
  const ok = crypto.createHmac("sha256", SECRET).update(`${h}.${p}`).digest("base64url") === s;
  return ok ? JSON.parse(Buffer.from(p, "base64url").toString()) : null;
}
const hash = (pw) => crypto.createHash("sha256").update(`local:${pw}`).digest("hex");

function session(u) {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const user = {
    id: u.id, aud: "authenticated", role: "authenticated", email: u.email,
    app_metadata: { provider: "email" }, user_metadata: u.raw_user_meta_data || {}, created_at: u.created_at,
  };
  return {
    access_token: sign({ sub: u.id, role: "authenticated", aud: "authenticated", email: u.email, exp }),
    token_type: "bearer", expires_in: 3600, expires_at: exp,
    refresh_token: b64({ id: u.id, n: crypto.randomUUID() }), user,
  };
}
const send = (res, code, body) => {
  res.writeHead(code, { "content-type": "application/json", "access-control-allow-origin": "*",
    "access-control-allow-headers": "*", "access-control-allow-methods": "*" });
  res.end(body === undefined ? "" : JSON.stringify(body));
};
const readBody = (req) => new Promise((r) => { let d = ""; req.on("data", (c) => (d += c)); req.on("end", () => r(d)); });

http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204);
  const url = new URL(req.url, "http://x");
  try {
    if (url.pathname.startsWith("/rest/v1")) {
      const body = ["GET", "HEAD"].includes(req.method) ? undefined : await readBody(req);
      const headers = { ...req.headers };
      delete headers.host;
      delete headers["content-length"];
      const r = await fetch(REST + url.pathname.slice(8) + url.search, { method: req.method, headers, body });
      const out = Buffer.from(await r.arrayBuffer());
      const h = Object.fromEntries(r.headers);
      delete h["content-encoding"];
      delete h["transfer-encoding"];
      res.writeHead(r.status, { ...h, "access-control-allow-origin": "*", "access-control-expose-headers": "*" });
      return res.end(out);
    }
    if (url.pathname === "/auth/v1/signup") {
      const { email, password, data } = JSON.parse(await readBody(req));
      const u = (await db.query(
        "insert into auth.users (email, encrypted_password, raw_user_meta_data) values ($1,$2,$3) returning *",
        [email.toLowerCase(), hash(password), data || {}])).rows[0];
      return send(res, 200, session(u));
    }
    if (url.pathname === "/auth/v1/token") {
      const body = JSON.parse(await readBody(req));
      let u;
      if (url.searchParams.get("grant_type") === "refresh_token") {
        const id = JSON.parse(Buffer.from(body.refresh_token, "base64url").toString()).id;
        u = (await db.query("select * from auth.users where id = $1", [id])).rows[0];
      } else {
        u = (await db.query("select * from auth.users where lower(email) = lower($1) and encrypted_password = $2",
          [body.email, hash(body.password)])).rows[0];
      }
      if (!u) return send(res, 400, { error: "invalid_grant", error_description: "Invalid login credentials", msg: "Invalid login credentials" });
      return send(res, 200, session(u));
    }
    if (url.pathname === "/auth/v1/user") {
      const claims = verify((req.headers.authorization || "").replace("Bearer ", ""));
      if (!claims?.sub) return send(res, 401, { msg: "invalid" });
      const u = (await db.query("select * from auth.users where id = $1", [claims.sub])).rows[0];
      return send(res, 200, session(u).user);
    }
    if (url.pathname === "/auth/v1/logout") return send(res, 204);
    send(res, 404, { msg: "not found" });
  } catch (e) {
    send(res, 500, { msg: String(e.message || e) });
  }
}).listen(PORT, () => console.log(`gateway on ${PORT}`));

// Claves anon / service_role para configurar la app.
if (process.argv.includes("--print-keys")) {
  console.log("ANON=" + sign({ role: "anon", exp: 4102444800 }));
  console.log("SERVICE=" + sign({ role: "service_role", exp: 4102444800 }));
}
