# PC PARTS SHOP

チーム開発用のPCパーツECプロトタイプです。GitHub Pagesで画面を公開でき、PHP / MySQLのAPIを設定すると商品カタログと管理者の商品登録を共有できます。

## 画面の確認

GitHub Pages版はHTML / CSS / JavaScriptだけで動く画面デモです。商品・カート・管理画面の変更は、そのブラウザの`localStorage`に保存されます。実際の注文・決済は行われません。

```sh
python -m http.server 8000
```

`http://localhost:8000`を開きます。初期カタログには40商品（CPU 28件）を登録しています。管理カテゴリはCPU、GPU、マザーボード、SSD、メモリ、CPUクーラー、ファン、PCケース、PC電源です。CPUとマザーボードはIntel / AMDとソケットを分けて記録します。初期CPU仕様はメーカー公表情報、価格と在庫は試作用の仮値です。管理画面ではカテゴリ・プラットフォームで絞り込み、商品を追加・検索・編集・削除できます。

## PHP / MySQLを起動

Docker DesktopとDocker Composeを使う開発用構成です。

```sh
Copy-Item backend/.env.example backend/.env
```

`backend/.env`の`DB_PASSWORD`と`DB_ROOT_PASSWORD`を長いランダム値に変えたあと、次を実行します。

```sh
docker compose -f backend/docker-compose.yml up --build
```

`http://localhost:8080`でフロントと同じPHPサーバーが動きます。MySQLには初期カタログが入り、商品一覧はPHP APIから読み込みます。管理者を作るには別ターミナルから実行します。

```sh
docker compose -f backend/docker-compose.yml exec -e DB_HOST=db -e ADMIN_PASSWORD='12文字以上の管理者パスワード' web php /var/www/scripts/create_admin.php admin@example.com 'ショップ管理者'
```

作成後、画面下部の「管理者ログイン」から商品登録・編集・削除を行えます。DBの商品は管理者だけが変更できます。MySQLのデータは`pcparts-mysql`ボリュームに保持されます。

既存のMySQLデータベースへこの更新を適用する場合は、アプリを更新する前に`database/migrations/20261001_categories_platform.sql`を一度だけ実行してください。新規データベースには`database/schema.sql`を使うため、この移行SQLは実行しません。

## 外部APIと購入商品の区別

- AI相談はPHPサーバーからGemini APIを呼び出します。`GEMINI_API_KEY`と`GEMINI_MODEL`をサーバー環境変数に設定してください。
- 相談時だけ楽天市場APIの商品を相場参考として取得します。楽天の商品は画面に参考情報として表示し、MySQLの商品カタログやカートへ登録しません。
- AIが購入候補として返せる商品IDはMySQLの有効な自社カタログに含まれるものだけです。
- 楽天アプリIDを`RAKUTEN_APP_ID`に設定します。使う契約でアクセスキーが必要な場合は`RAKUTEN_ACCESS_KEY`もサーバーへ設定します。
- APIキーを`config.js`やブラウザ側のJavaScriptへ入れないでください。

`config.js`の`PC_PARTS_API_BASE_URL`はGitHub Pagesでは空欄のままです。PHPサーバーへ接続するときは、例のようにAPIのベースURLを設定してフロントを再デプロイします。

```js
window.PC_PARTS_API_BASE_URL = "https://api.example.com/api";
```

別ドメインのPHPサーバーを使う場合、`APP_ALLOWED_ORIGINS`にはパスを含まないOrigin（例：`https://fushimin1892.github.io`）を完全一致で追加し、HTTPS、`SESSION_SAMESITE=None`、`SESSION_SECURE=true`を設定してください。ブラウザのサードパーティCookie制限があるため、本番ではフロントとAPIを同じサイト（同一ドメイン配下）に置く構成を推奨します。

## GitHub Pagesと本番サーバー

`.github/workflows/deploy-pages.yml`は`main`へのpushで静的フロントをGitHub Pagesへ公開します。Pagesは静的ファイルの配信先で、PHPプロセスやMySQLは実行しません。PHP版はDocker対応またはPHPとMySQLに対応したホスティング先へ配置してください。ホスティング先が決まったらAPI URLと環境変数を設定します。

今の注文確定はデモ処理です。注文・在庫引当・決済を本番利用する前に、PHP側の注文APIと決済サービスを実装し、DBトランザクションで在庫と金額を再確認してください。

## チーム開発

- 画面：`index.html`、`styles.css`、`app.js`
- PHP API：`backend/public/api/`
- MySQL構成：`database/schema.sql`
- 初期カタログ：`database/seed_products.json`
- 接続仕様：[`backend/api-contract.md`](backend/api-contract.md)

商品の初期データJSONは次で再生成できます。

```sh
node backend/scripts/build_seed_json.mjs
```
