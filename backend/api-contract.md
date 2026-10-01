# PHP API接続仕様

フロントは`config.js`の`window.PC_PARTS_API_BASE_URL`を空にするとブラウザ内デモ、`/api`または別のPHP API URLにするとサーバー接続モードになります。サーバー接続時の商品一覧はMySQLの有効な自社登録商品だけです。

## `GET /api/health.php`

PHP APIとMySQLの接続状態を返します。

## `GET /api/products.php`

MySQLに登録された有効商品を返します。`keyword`、`category`、`platform=Intel|AMD`で絞り込めます。楽天市場APIの商品はこの一覧へ保存しません。

管理カテゴリは`CPU`、`GPU`、`マザーボード`、`SSD`、`メモリ`、`CPUクーラー`、`ファン`、`PCケース`、`PC電源`です。モニターなどPCパーツ以外の商品は`その他`に入ります。

```json
{
  "items": [
    {
      "id": "amd-ryzen-7-9800x3d",
      "name": "AMD Ryzen 7 9800X3D",
      "shortName": "AMD Ryzen 7 9800X3D",
      "maker": "AMD",
      "platform": "AMD",
      "category": "CPU",
      "type": "cpu",
      "price": 79800,
      "stock": 5,
      "imageUrl": "https://example.com/product-image.jpg",
      "productUrl": "https://example.com/product-page",
      "sourceName": "情報取得元ショップ名",
      "specs": { "コア / スレッド": "8 / 16", "ソケット": "AM5" },
      "isDemoPrice": true
    }
  ]
}
```

## 管理者

### `POST /api/admin/login.php`

```json
{ "email": "admin@example.com", "password": "管理者パスワード" }
```

MySQLの`users`テーブルで`role='admin'`かつパスワードハッシュが一致した場合だけセッションを開始します。管理者は`php backend/scripts/create_admin.php ...`で作成します。初期パスワードは用意していません。

### `GET /api/admin/status.php`, `POST /api/admin/logout.php`

Cookieセッションを使う管理者ログイン状態の確認・終了です。

### `POST /api/products.php`, `PUT /api/products.php?id={catalog_key}`, `DELETE /api/products.php?id={catalog_key}`

セッション中の管理者だけが実行できます。登録・編集できるフィールドは商品名、表示名、メーカー、カテゴリ、プラットフォーム、価格、在庫、商品画像URL、販売元商品ページURL、説明、仕様、メーカー情報URL、仮価格フラグです。CPUとマザーボードはプラットフォーム（Intel / AMD）が必須です。ソケットも仕様へ登録してください。削除は`is_active=FALSE`にする論理削除です。購入履歴の参照整合性を保ちます。

### `POST /api/admin/products/bulk-import.php`

管理者セッション中に最大1,000件をまとめて登録・更新します。JSON本文は`{ "items": [商品データ...] }`です。商品IDで既存行を更新するため、同じ出力JSONを再取込しても商品は重複しません。カテゴリ・Intel/AMDの必須条件・URLを検証してからトランザクションで保存します。

管理画面の「JSON一括登録」では、登録前に件数・カテゴリ・画像URL・販売ページURLを確認できます。GitHub Pagesだけの画面デモは現在のブラウザへ保存され、チーム共有にはPHP / MySQL API接続が必要です。

`node backend/scripts/import_marketplace_catalog.mjs --target=1000 --output=marketplace-products.json`を実行すると、Yahoo!ショッピング、楽天市場、および任意のAmazon.co.jp Creators APIから検索結果を取得し、管理画面へ読み込むJSONを作ります。Yahooと楽天のキーはこのスクリプトの実行環境だけへ設定してください。外部APIの価格・説明・在庫は取得時点の参考値なので、出品前に管理画面で確認してください。画像URLと商品ページURLは各APIの戻り値を保持します。Amazonはアソシエイト/Creators APIの認証設定があるときだけ検索します。

## `POST /api/ai/consult.php`

```json
{
  "budgetText": "20万円くらい",
  "useCase": "ゲーム",
  "gamesAndTasks": "ARKとVALORANTを144fpsで遊びたい",
  "designAndPerformance": "白くてキラキラ",
  "ownedEquipment": "モニターは持ってる",
  "otherConditions": ""
}
```

回答をGemini APIへ送り、構成の要約・イメージ用プロンプト・購入候補商品を作ります。AIが返した商品IDはPHP側でMySQLの有効商品に照合し、登録済みのものだけ返します。合計額もMySQLの現在価格からPHP側で計算します。

相談時に`RAKUTEN_APP_ID`が設定されている場合、楽天市場の商品を最大5件、相場参考としてGeminiへ渡し、フロントにも`references`として返します。これは外部参照情報であり、自社商品IDではありません。画面でも「購入対象外」と表示し、カート追加データへ使いません。楽天APIが停止してもGeminiと自社商品カタログで相談できます。

サーバー環境変数：

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `GEMINI_API_KEY`, `GEMINI_MODEL`
- 任意：`RAKUTEN_APP_ID`, `RAKUTEN_ACCESS_KEY`
- CORS / Cookie：`APP_ALLOWED_ORIGINS`, `SESSION_SAMESITE`, `SESSION_SECURE`

APIキーやDBパスワードはPHPホストの環境変数または秘密情報ストアに置いてください。GitHub PagesのJavaScriptへ設定しないでください。

## この段階の対象外

カート・会員情報・注文履歴は画面確認用としてブラウザに保存されます。確定注文・在庫引当・決済のPHP APIはまだありません。登録商品を見て選ぶ体験と管理画面を共有するための商品APIは用意しましたが、一般公開して実販売する前に注文API・決済・配送・返品の運用を別途作る必要があります。
