# Conte Rush 製品サイト

Conte Rush の公開製品ページです。Stripe など外部から、商品内容・料金・連絡先・利用規約を確認するための静的サイトです。

制作アプリ本体は別リポジトリ `conte-rush` にあります。このサイトはログイン不要です。

## 公開URL

`https://mook-hary.github.io/conte-rush-site/`

canonical / Open Graph / robots.txt / sitemap.xml は、この project site URL を正とします。Search Console や analytics はまだ入れていません。

本体アプリ（現行）:

`https://mook-hary.github.io/conte-rush/`

## ローカル確認

```bash
python3 -m http.server 8090
```

`http://127.0.0.1:8090/` を開きます。

## GitHub Pages

1. このリポジトリを GitHub の公開リポジトリとして置く
2. Settings → Pages → Deploy from branch → `main` / `/ (root)`
3. Stripe の事業確認には、この Pages URL を渡す

本体アプリの認証戻り先や Checkout 戻り先は変更しません。

## 料金

通常価格は月額 500円（税込）。ローンチ価格は月額 100円（税込）・先着 20 名。出典は本体の特定商取引法表記および利用規約です。
