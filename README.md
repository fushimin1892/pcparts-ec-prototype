# PC PARTS SHOP

チーム開発用のPCパーツECプロトタイプです。GitHub Pagesで画面を公開でき、PHP / MySQLのAPIを設定すると商品カタログと管理者の商品登録を共有できます。

## 画面の確認

GitHub Pages版はHTML / CSS / JavaScriptだけで動く画面デモです。商品・カート・管理画面の変更は、そのブラウザの`localStorage`に保存されます。実際の注文・決済は行われません。

```sh
python -m http.server 8000
```

`http://localhost:8000`を開きます。初期カタログには40商品（CPU 28件）を登録しています。管理カテゴリはCPU、GPU、マザーボード、SSD、メモリ、CPUクーラー、ファン、PCケース、PC電源です。CPUとマザーボードはIntel / AMDとソケットを分けて記録します。初期CPU仕様はメーカー公表情報、価格と在庫は試作用の仮値です。管理画面ではカテゴリ・プラットフォームで絞り込み、商品を追加・検索・編集・削除できます。商品一覧は24件、管理画面は50件ずつ表示し、ページ移動できます。

### 外部ショップの参考商品

`#/references`は、出典・取得日時・外部の商品ページを付けて参考商品を表示する画面です。参考商品は自社の`products`テーブルやカートに入りません。表示には、商品情報と画像の掲載、短期保存を許可する提供元フィードが必要です。現時点でその許諾済みフィードやAPI資格情報は設定されていないため、参考商品の掲載件数は0件です。1,000件の実商品や現在価格を作り出して登録することはしません。

設定例は`backend/config.production.php.example`の`REFERENCE_FEED_SOURCES`にあります。取得元の許諾範囲、商品ページ・画像のホスト名、最大保持時間を確認し、公開サーバーの`_private/config.local.php`に設定します。許諾の確認が済むまで`enabled=false`と権利フラグを維持してください。管理者セッションで`POST /api/admin/reference-offers-sync.php`をページごとに呼ぶと、提供元フィードから最大100件ずつ読み込みます。`GET /api/reference-offers.php`は期限内の商品だけを返し、許諾を無効にした取得元の商品も非表示にします。詳細は[API接続仕様](backend/api-contract.md)を参照してください。

既存の`backend/scripts/import_marketplace_catalog.mjs`と管理画面の「JSON一括登録」は、外部参考商品の掲載経路ではありません。この機能は自社販売商品の下書きを作るためのもので、外部サイトの商品画像・価格・説明を自社商品へ転載する許可にはなりません。

## PHP / MySQLを起動

### XAMPPでローカル開発

XAMPP Control PanelでApacheとMySQLを起動し、Node.jsが使える状態でプロジェクトのルートから公開用パッケージを作ります。

```powershell
node backend/scripts/build_lolipop_release.mjs --base-path=/pcparts
```

`backend/dist-lolipop/_private/config.local.php.example`を`config.local.php`へコピーしてXAMPP用DB設定を入れ、同フォルダに置きます（初期状態のユーザーは`root`、パスワードは空欄です）。生成パッケージの中身を`C:\xampp\htdocs\pcparts`へコピーし、phpMyAdminで`pc_parts_shop`データベースを作成してから`database/schema.sql`をインポートします。40件の画面確認用商品は`database/seed_products.sql`をphpMyAdminからインポートするか、次のPHPスクリプトで登録します。両方実行しても商品IDで重複登録はされません。

```powershell
C:\xampp\php\php.exe C:\xampp\htdocs\pcparts\_private\scripts\seed_catalog.php
$env:ADMIN_PASSWORD = "12文字以上のローカル管理者パスワード"
C:\xampp\php\php.exe C:\xampp\htdocs\pcparts\_private\scripts\create_admin.php admin@example.com "ショップ管理者"
```

ブラウザで`http://localhost/pcparts/`を開きます。`backend/config.local.php`や`backend/dist-lolipop/_private/config.local.php`に設定したキーとパスワードはGitへ登録しないでください。XAMPPは開発用で、インターネットへ公開する本番サーバーには使いません。

初期40件の価格は仮値で、MySQL上の在庫は0です。商品一覧の表示確認には使えますが、購入可能な商品として公開するには管理画面で自社の価格・在庫・画像を確認して登録してください。

### ロリポップへ本番配置

ロリポップでPHPとMySQLが使えるプラン・ドメインを用意し、ユーザー専用ページに表示されるDB接続情報を使います。MySQLはライトプラン以上で利用でき、SSHはスタンダードプラン以上で利用できます。PHP 8.3〜8.5、MySQL 8.4の対応状況は[公式サーバー仕様](https://lolipop.jp/service/server-spec/)に掲載されています。

1. ロリポップのユーザー専用ページでMySQLデータベースを作成します。既存のサイトを置き換えないよう、公開ディレクトリ内の`pcparts`サブフォルダへ配置する例では`node backend/scripts/build_lolipop_release.mjs --base-path=/pcparts`を実行します。ドメイン直下に配置する場合は`node backend/scripts/build_lolipop_release.mjs`を実行します。
2. `backend/dist-lolipop/_private/config.local.php.example`を`config.local.php`へコピーし、ロリポップのDBホスト名・DB名・ユーザー名・パスワードを記入します。HTTPS公開なので`SESSION_SECURE`は`true`のままにします。必要ならGemini / 楽天のAPIキーもここへ入れます。
3. `backend/dist-lolipop`の中身を、FTPSで配置先へアップロードします。サブフォルダ配置なら公開ディレクトリ内に`pcparts`を作り、その中へ入れます。ロリポップ公式マニュアルはFTPSとFTPアップロードを案内しています。[FTPS設定](https://lolipop.jp/manual/hp/ftp-set/)、[アップロード方法](https://lolipop.jp/manual/user/ftp2-04/)。`_private/.htaccess`と`database/.htaccess`も必ず一緒にアップロードしてください。パッケージを再生成しても既存の`_private/config.local.php`は保持されます。
4. phpMyAdminで作成したDBを選択し、`database/schema.sql`をインポートします。既存DBへ参考商品テーブルだけを追加する場合は、`database/migrations/20261002_reference_offers.sql`をDB管理画面から一度だけ実行します。SQLを公開FTPに置かないでください。続いて40件の画面確認用商品を表示したい場合は`database/seed_products.sql`をインポートします。このSQLは仮価格・在庫0で登録し、画面上のデモ注文だけに利用できます。実販売には利用できません。SSHが使える場合は代わりに`_private/scripts/seed_catalog.php`でも登録できます。管理者はSSHから`ADMIN_PASSWORD`を設定して`_private/scripts/create_admin.php`を実行するか、ローカルXAMPPのPHPで`backend/scripts/generate_admin_sql.php`から管理者登録SQLを作り、phpMyAdminで実行します。管理者パスワードや生成したSQLをGitや公開フォルダへ置かないでください。
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

既存のMySQLデータベースへ更新を適用する場合は、該当する`database/migrations/`内のSQLを確認してから実行してください。カテゴリ・プラットフォーム変更、デモ注文・AI利用回数・外部参考商品テーブルの移行ファイルがあります。新規データベースには`database/schema.sql`を使うため、移行SQLは実行しません。

## 外部APIと購入商品の区別

- AI相談はPHPサーバーからGemini APIを呼び出します。`GEMINI_API_KEY`と`GEMINI_MODEL`をサーバー環境変数に設定してください。
- 相談時だけ楽天市場APIの商品を相場参考として取得します。楽天の商品は画面に参考情報として表示し、MySQLの商品カタログやカートへ登録しません。
- 外部参考商品一覧は別の`reference_offers`テーブルから取得します。提供元の表示・短期保存・画像掲載の許諾を確認し、専用フィードを非公開設定へ登録するまでは空欄です。楽天やYahoo!のAPIキーを設定するだけで、この一覧が自動的に埋まる実装ではありません。
- AIが購入候補として返せる商品IDはMySQLの有効な自社カタログに含まれるものだけです。
- 楽天市場の相談用参考商品を表示するには`RAKUTEN_APP_ID`と`RAKUTEN_ACCESS_KEY`の両方をサーバーへ設定します。2026-07-01版の商品検索APIでは両方が必須です。楽天の商品情報は楽天の商品ページへリンクする参考表示に限り、自社販売商品の画像・価格・説明として転用しません。[楽天の利用目的に関する公式ヘルプ](https://webservice.faq.rakuten.net/hc/ja/articles/900001974363-%E5%90%84API%E3%81%A7%E5%8F%96%E5%BE%97%E3%81%97%E3%81%9F%E6%83%85%E5%A0%B1%E3%81%AF%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AA%E7%9B%AE%E7%9A%84%E3%81%A7%E5%88%A9%E7%94%A8%E3%81%A7%E3%81%8D%E3%81%BE%E3%81%99%E3%81%8B)を参照してください。
- APIキーを`config.js`やブラウザ側のJavaScriptへ入れないでください。

GitHub Pages用`config.js`の`PC_PARTS_API_BASE_URL`は空欄のままです。PHPサーバーに配置するページは同一ドメインの`/api`を参照するため、別ドメインのCORS設定は不要です。

## GitHub Pagesと本番サーバー

`.github/workflows/deploy-pages.yml`は`main`へのpushで静的フロントをGitHub Pagesへ公開します。Pagesは静的ファイルの配信先で、PHPプロセスやMySQLは実行しません。Lolipop用パッケージは`node backend/scripts/build_lolipop_release.mjs`で作成します。XAMPPもローカル開発にのみ使います。[XAMPP公式FAQ](https://www.apachefriends.org/faq_windows)も、本番用ではなく開発環境用と説明しています。

今の注文確定はデモ処理です。PHP接続時のデモ注文はMySQLへ保存し、サーバーが登録商品の価格を再確認します。販売価格を設定した商品は在庫も確認します。画面確認用の仮価格商品は在庫0でもデモ注文を作れますが、在庫引当や実際の請求・発送はしません。実販売を始める前に、会員認証を伴う実注文API、在庫引当、決済サービス、配送・返品の運用を実装する必要があります。

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
