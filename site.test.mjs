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
  assert.match(html, /<h1>Conte Rush — コンテから、タイミング確認とラッシュ作成まで。<\/h1>/);
  assert.equal(html.includes("access-gate"), false);
  assert.equal(html.includes("runtime-config"), false);
  assert.equal(html.includes("devBypass"), false);
  assert.equal(html.includes("supabase"), false);
  assert.equal(html.includes("STRIPE_"), false);
});

function publicPages() {
  return [
    "index.html",
    "legal/index.html",
    "legal/terms.html",
    "legal/tokusho.html",
    "legal/cancel.html",
    "legal/privacy.html",
    "README.md",
  ].map((rel) => read(rel)).join("\n");
}

test("landing page states live dual prices, contact, and legal links", () => {
  const html = read("index.html");
  assert.match(html, /通常価格 月額500円（税込）/);
  assert.match(html, /ローンチ価格 月額100円（税込）・先着20名/);
  assert.match(html, /ローンチ価格での契約を継続している間は、月額100円（税込）/);
  assert.match(html, /その時点の新規契約価格が適用されます/);
  assert.match(html, /6,000円（税込）/);
  assert.match(html, /1,200円（税込）/);
  assert.match(html, /年払いではありません/);
  assert.match(html, /同じ利用契約で利用できます/);
  assert.match(html, /https:\/\/mook-hary\.github\.io\/conte-rush\/download\//);
  assert.match(html, /mailto:mook\.hary@gmail\.com/);
  assert.match(html, /legal\/terms\.html/);
  assert.match(html, /legal\/privacy\.html/);
  assert.match(html, /legal\/tokusho\.html/);
  assert.match(html, /https:\/\/mook-hary\.github\.io\/conte-rush\//);
  assert.match(html, />アプリを開く</);
  assert.match(html, /絵コンテPDF/);
  assert.match(html, /コマの切り出し・整理/);
  assert.match(html, /カット作成/);
  assert.match(html, /フレームタイミング/);
  assert.match(html, />Motion</);
  assert.match(html, /ラッシュ確認/);
  assert.match(html, /確認用MP4/);
  assert.match(html, /タイムシート \/ XDTS/);
  assert.match(html, /写真認識、タイムシートの直接編集、XDTS書き出し、タイムラインとの自動同期は行いません/);
});

test("public site pricing is not the old 100-yen-only offer", () => {
  const pages = publicPages();
  assert.match(pages, /月額\s*500\s*円（税込）|月額500円（税込）/);
  assert.match(pages, /月額\s*100\s*円（税込）|月額100円（税込）/);
  assert.match(pages, /先着\s*20\s*名|先着20名/);
  assert.match(pages, /継続している間/);
  assert.match(pages, /その時点の新規契約価格/);
  assert.doesNotMatch(pages, /一般ユーザーの利用料金は月額 100/);
  assert.doesNotMatch(pages, /月額100円で利用する/);
  assert.doesNotMatch(pages, /残り\s*19|残り人数|永久100|全員100|全員が月額100|期間限定100/);
  assert.doesNotMatch(pages, /price_[A-Za-z0-9]{10,}|STRIPE_/);
});

test("legal pages are present and keep existing public facts", () => {
  for (const name of ["index.html", "terms.html", "privacy.html", "tokusho.html", "cancel.html"]) {
    assert.equal(existsSync(join(ROOT, "legal", name)), true, name);
  }
  const terms = read("legal/terms.html");
  const privacy = read("legal/privacy.html");
  const tokusho = read("legal/tokusho.html");
  const cancel = read("legal/cancel.html");
  const guide = read("legal/index.html");
  assert.match(terms, /通常価格は月額 500 円（税込）/);
  assert.match(terms, /ローンチ価格は月額 100 円（税込）・先着 20 名/);
  assert.match(privacy, /mailto:mook\.hary@gmail\.com/);
  assert.match(tokusho, /通常価格は月額 500 円（税込）/);
  assert.match(tokusho, /ローンチ価格は月額 100 円（税込）・先着 20 名/);
  assert.match(tokusho, /請求があった場合、遅滞なく開示します/);
  assert.match(cancel, /その時点の新規契約価格が適用されます/);
  assert.match(guide, /同じ利用契約で利用できます/);
  assert.match(terms, /製品サイトへ戻る/);
  assert.equal(terms.includes("access-gate"), false);
});

test("landing page does not publish private or development material", () => {
  const html = read("index.html");
  assert.equal(html.includes("devBypass"), false);
  assert.equal(html.includes("DEBUG"), false);
  assert.equal(html.includes("TODO"), false);
  assert.equal(html.includes("service_role"), false);
  assert.equal(/sk_live|sk_test|pk_live|pk_test/.test(html), false);
  assert.equal(html.includes("IndexedDB"), false);
});

test("landing page includes a relative product image with a processing note", () => {
  const html = read("index.html");
  assert.match(html, /src="images\/conte-rush-product\.jpg"/);
  assert.match(html, /※画面は機能説明のため一部加工しています/);
  assert.equal(html.includes("/Users/"), false);
  assert.equal(existsSync(join(ROOT, "images", "conte-rush-product.jpg")), true);
  const productBlock = html.slice(
    html.indexOf('class="product-visual"'),
    html.indexOf('id="about"'),
  );
  assert.equal(productBlock.includes("実際の画面"), false);
  assert.equal(productBlock.includes("実画面"), false);
});

test("site assets do not boot the production app", () => {
  const css = read("css/site.css");
  assert.match(css, /@media \(max-width: 800px\)/);
  assert.equal(existsSync(join(ROOT, "css", "legal.css")), true);
  assert.equal(existsSync(join(ROOT, "js")), false);
});
