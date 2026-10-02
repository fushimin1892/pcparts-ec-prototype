# PC PARTS SHOP

チーム開発用のPCパーツECプロトタイプです。GitHub Pagesで画面を公開でき、PHP / MySQLのAPIを設定すると商品カタログと管理者の商品登録を共有できます。

## 画面の確認

GitHub Pages版はHTML / CSS / JavaScriptだけで動く画面デモです。商品・カート・管理画面の変更は、そのブラウザの`localStorage`に保存されます。実際の注文・決済は行われません。

```sh
python -m http.server 8000
```

`http://localhost:8000`を開きます。初期カタログには40商品（CPU 28件）を登録しています。管理カテゴリはCPU、GPU、マザーボード、SSD、メモリ、CPUクーラー、ファン、PCケース、PC電源です。CPUとマザーボードはIntel / AMDとソケットを分けて記録します。初期CPU仕様はメーカー公表情報、価格と在庫は試作用の仮値です。管理画面ではカテゴリ・プラットフォームで絞り込み、商品を追加・検索・編集・削除できます。商品一覧は24件、管理画面は50件ずつ表示し、ページ移動できます。

### APIから商品を集めて一括登録

外部マーケットの商品をスクレイピングせず公式APIから検索し、画像URL・商品ページURL・ショップ名・説明・取得時点の価格を含むJSONを作れます。Yahoo!ショッピングと楽天市場のキーをローカルPowerShellへ設定します（値はGitHubへ登録しないでください）。

```powershell
$env:YAHOO_APP_ID = "発行されたClient ID"
$env:RAKUTEN_APP_ID = "発行されたApplication ID"
$env:RAKUTEN_ACCESS_KEY = "発行されたAccess Key"
node backend/scripts/import_marketplace_catalog.mjs --target=1000 --output=marketplace-products.json
```

その後、管理者としてログインし「JSON一括登録」から生成ファイルを選び、件数・カテゴリ・画像・販売ページを確認して登録します。対応カテゴリは9種で、カテゴリごとに件数を配分します。検索結果が不足するカテゴリは目標より少なくなることがあります。Yahoo APIは1クエリー/秒で取得し、楽天APIは1回最大30件のページ検索を使います。[Yahoo公式API仕様](https://developer.yahoo.co.jp/webapi/shopping/v3/itemsearch.html)は画像の600px取得に対応し、楽天公式APIは画像あり商品の絞り込みと商品ページ・画像URLを返します。[楽天公式API仕様](https://webservice.rakuten.co.jp/index.php/documentation/ichiba-item-search)

商品説明、価格、在庫はAPIを取得した時点の情報です。取り込んだ商品は「参考価格」かつ在庫0で登録するため、管理者が説明・価格・自社在庫を確認して在庫数を設定するまではカートに入れられません。PC工房、ツクモ、Arkなどのショップ名はAPI応答に含まれる場合そのまま保存し、販売元リンクから個別の商品ページを確認できます。直接APIが提供されない店舗ページを大量巡回して価格や画像を集める処理はしません。

Amazon商品は任意でAmazon.co.jp Creators APIから検索できます。Amazonアソシエイト登録後にCreators APIを登録し、クライアントID / シークレット / Partner Tagを設定してください。SearchItems APIは1回最大10件を返します。API資格がない場合はAmazonを省略します。

```powershell
$env:AMAZON_CREATORS_CLIENT_ID = "発行されたClient ID"
$env:AMAZON_CREATORS_CLIENT_SECRET = "発行されたClient Secret"
$env:AMAZON_PARTNER_TAG = "発行されたPartner Tag"
```

Amazon公式の[Creators API利用条件](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/onboarding)と[商品検索仕様](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/api-reference/operations/search-items)を確認してください。GitHub PagesだけのデモではJSONは登録したブラウザ内に保存され、チーム共通の商品台帳にはなりません。共有するには後段のPHP/MySQL APIを公開して`config.js`に設定する必要があります。

## PHP / MySQLを起動

### XAMPPでローカル開発

XAMPP Control PanelでApacheとMySQLを起動し、Node.jsが使える状態でプロジェクトのルートから公開用パッケージを作ります。

```powershell
node backend/scripts/build_lolipop_release.mjs --base-path=/pcparts
```

`backend/dist-lolipop/_private/config.local.php.example`を`config.local.php`へコピーしてXAMPP用DB設定を入れ、同フォルダに置きます（初期状態のユーザーは`root`、パスワードは空欄です）。生成パッケージの中身を`C:\xampp\htdocs\pcparts`へコピーし、phpMyAdminで`pc_parts_shop`データベースを作成してから`database/schema.sql`をインポートします。管理者PowerShellで以下を実行します。

```powershell
C:\xampp\php\php.exe C:\xampp\htdocs\pcparts\_private\scripts\seed_catalog.php
$env:ADMIN_PASSWORD = "12文字以上のローカル管理者パスワード"
C:\xampp\php\php.exe C:\xampp\htdocs\pcparts\_private\scripts\create_admin.php admin@example.com "ショップ管理者"
```

ブラウザで`http://localhost/pcparts/`を開きます。`backend/config.local.php`や`backend/dist-lolipop/_private/config.local.php`に設定したキーとパスワードはGitへ登録しないでください。XAMPPは開発用で、インターネットへ公開する本番サーバーには使いません。

### ロリポップへ本番配置

ロリポップでPHPとMySQLが使えるプラン・ドメインを用意し、ユーザー専用ページに表示されるDB接続情報を使います。MySQLはライトプラン以上で利用でき、SSHはスタンダードプラン以上で利用できます。PHP 8.3〜8.5、MySQL 8.4の対応状況は[公式サーバー仕様](https://lolipop.jp/service/server-spec/)に掲載されています。

1. ロリポップのユーザー専用ページでMySQLデータベースを作成します。既存のサイトを置き換えないよう、公開ディレクトリ内の`pcparts`サブフォルダへ配置する例では`node backend/scripts/build_lolipop_release.mjs --base-path=/pcparts`を実行します。ドメイン直下に配置する場合は`node backend/scripts/build_lolipop_release.mjs`を実行します。
2. `backend/dist-lolipop/_private/config.local.php.example`を`config.local.php`へコピーし、ロリポップのDBホスト名・DB名・ユーザー名・パスワードを記入します。HTTPS公開なので`SESSION_SECURE`は`true`のままにします。必要ならGemini / 楽天のAPIキーもここへ入れます。
3. `backend/dist-lolipop`の中身を、FTPSで配置先へアップロードします。サブフォルダ配置なら公開ディレクトリ内に`pcparts`を作り、その中へ入れます。ロリポップ公式マニュアルはFTPSとFTPアップロードを案内しています。[FTPS設定](https://lolipop.jp/manual/hp/ftp-set/)、[アップロード方法](https://lolipop.jp/manual/user/ftp2-04/)。`_private/.htaccess`と`database/.htaccess`も必ず一緒にアップロードしてください。パッケージを再生成しても既存の`_private/config.local.php`は保持されます。
4. phpMyAdminで作成したDBを選択し、`database/schema.sql`をインポートします。SSHが使えるプランなら`_private/scripts/seed_catalog.php`で初期カタログを入れ、`ADMIN_PASSWORD`を設定して`_private/scripts/create_admin.php`を実行します。SSHがないプランではXAMPPのPHPで`backend/scripts/generate_admin_sql.php`から管理者登録SQLを生成して、phpMyAdminで実行できます。
5. `https://あなたのドメイン/pcparts/api/health.php`が`database: connected`を返すことを確認し、管理者画面へログインします。

DB接続情報やAPIキーは`_private/config.local.php`だけに置きます。公開画面の`config.js`へ書かないでください。ユーザー専用ページのFTP / DB情報はチャットへ貼らず、生成した`backend/dist-lolipop/_private/config.local.php`へ設定してください。

### Dockerで開発（任意）

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

GitHub Pages用`config.js`の`PC_PARTS_API_BASE_URL`は空欄のままです。PHPサーバーに配置するページは同一ドメインの`/api`を参照するため、別ドメインのCORS設定は不要です。

## GitHub Pagesと本番サーバー

`.github/workflows/deploy-pages.yml`は`main`へのpushで静的フロントをGitHub Pagesへ公開します。Pagesは静的ファイルの配信先で、PHPプロセスやMySQLは実行しません。Lolipop用パッケージは`node backend/scripts/build_lolipop_release.mjs`で作成します。XAMPPもローカル開発にのみ使います。[XAMPP公式FAQ](https://www.apachefriends.org/faq_windows)も、本番用ではなく開発環境用と説明しています。

今の注文確定はデモ処理です。注文・在庫引当・決済を本番利用する前に、PHP側の注文APIと決済サービスを実装し、DBトランザクションで在庫と金額を再確認してください。

チェックアウト画面ではクレジット / デビットカード、PayPay、楽天ペイ、交通系電子マネー、コンビニ払いの画面フローを試せます。外部決済サービスへの接続、請求、実店舗での支払いはありません。カード欄には画面に案内されたテスト値（番号`4242 4242 4242 4242`、期限`12/30`、コード`123`）だけを入力してください。カード情報は保存・送信しません。コンビニ払いを選ぶと、画面確認専用の払込番号と期限を表示します。

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
