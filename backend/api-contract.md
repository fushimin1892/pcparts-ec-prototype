# PHP API接続仕様

フロントは`config.js`の`window.PC_PARTS_API_BASE_URL`を空にするとブラウザ内デモ、`/api`または別のPHP API URLにするとサーバー接続モードになります。サーバー接続時の商品一覧はMySQLの有効な自社登録商品だけです。

## `GET /api/health.php`

PHP APIとMySQLの接続状態を返します。

## `GET /api/products.php`

MySQLに登録された有効商品を返します。`keyword`と`category`で絞り込めます。楽天市場APIの商品はこの一覧へ保存しません。

```json
{
  "items": [
    {
      "id": "amd-ryzen-7-9800x3d",
      "name": "AMD Ryzen 7 9800X3D",
      "shortName": "AMD Ryzen 7 9800X3D",
      "maker": "AMD",
      "category": "CPU",
      "type": "cpu",
      "price": 79800,
      "stock": 5,
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

セッション中の管理者だけが実行できます。登録・編集できるフィールドは商品名、表示名、メーカー、カテゴリ、価格、在庫、説明、仕様、メーカー情報URL、仮価格フラグです。削除は`is_active=FALSE`にする論理削除です。購入履歴の参照整合性を保ちます。

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
