import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));

function read(rel) {
  return readFileSync(join(ROOT, rel), "utf8");
}

test("public landing page has no authentication or app boot", () => {
  const html = read("index.html");
  assert.match(html, /<h1>Conte Rush<\/h1>/);
  assert.equal(html.includes("access-gate"), false);
  assert.equal(html.includes("runtime-config"), false);
  assert.equal(html.includes("devBypass"), false);
  assert.equal(html.includes("supabase"), false);
  assert.equal(html.includes("STRIPE_"), false);
});

test("landing page states price, contact, and legal links", () => {
  const html = read("index.html");
  assert.match(html, /月額 100円（税込）/);
  assert.match(html, /1,200円（税込）/);
  assert.match(html, /mailto:mook\.hary@gmail\.com/);
  assert.match(html, /legal\/terms\.html/);
  assert.match(html, /legal\/privacy\.html/);
  assert.match(html, /legal\/tokusho\.html/);
  assert.match(html, /https:\/\/mook-hary\.github\.io\/conte-rush\//);
});

test("legal pages are present and keep existing public facts", () => {
  for (const name of ["index.html", "terms.html", "privacy.html", "tokusho.html", "cancel.html"]) {
    assert.equal(existsSync(join(ROOT, "legal", name)), true, name);
  }
  const terms = read("legal/terms.html");
  const privacy = read("legal/privacy.html");
  const tokusho = read("legal/tokusho.html");
  assert.match(terms, /月額 100 円（税込）/);
  assert.match(privacy, /mailto:mook\.hary@gmail\.com/);
  assert.match(tokusho, /月額 100 円（税込）/);
  assert.match(tokusho, /請求があった場合、遅滞なく開示します/);
  assert.match(terms, /製品サイトへ戻る/);
  assert.equal(terms.includes("access-gate"), false);
});

test("site assets do not boot the production app", () => {
  const css = read("css/site.css");
  assert.match(css, /@media \(max-width: 800px\)/);
  assert.equal(existsSync(join(ROOT, "css", "legal.css")), true);
  assert.equal(existsSync(join(ROOT, "js")), false);
});
