# PHP API接続仕様

フロントは`config.js`の`window.PC_PARTS_API_BASE_URL`を空にするとブラウザ内デモ、`/api`または別のPHP API URLにするとサーバー接続モードになります。サーバー接続時の商品一覧はMySQLの有効な自社登録商品だけです。

## `GET /api/health.php`

PHP APIとMySQLの接続状態を返します。

## `GET /api/products.php`

MySQLに登録された公開商品を返します。`keyword`、`category`、`platform=Intel|AMD`で絞り込めます。楽天市場APIの商品はこの一覧へ保存しません。管理者セッション中の`GET /api/products.php?include_inactive=1`では非公開の下書きも返します。

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
      "stock": 0,
      "imageUrl": "https://example.com/product-image.jpg",
      "productUrl": "https://example.com/product-page",
      "sourceName": "情報取得元ショップ名",
      "specs": { "コア / スレッド": "8 / 16", "ソケット": "AM5" },
      "isDemoPrice": true,
      "isActive": true
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

セッション中の管理者だけが実行できます。登録・編集できるフィールドは商品名、表示名、メーカー、カテゴリ、プラットフォーム、価格、在庫、商品画像URL、販売元商品ページURL、説明、仕様、メーカー情報URL、仮価格フラグ、公開状態`isActive`です。新規登録では`isActive`の初期値は`false`です。編集時に省略すると現在の公開状態を維持します。公開には、自社の販売価格が1円以上・自社在庫が1点以上・商品画像URLあり・`isDemoPrice=false`が必要です。CPUとマザーボードはプラットフォーム（Intel / AMD）が必須です。ソケットも仕様へ登録してください。削除は`is_active=FALSE`にする論理削除です。購入履歴の参照整合性を保ちます。

### `POST /api/admin/products/bulk-import.php`

管理者セッション中に最大1,000件をまとめて下書き登録・更新します。JSON本文は`{ "items": [商品データ...] }`です。取得価格・画像URL・取得元商品URLを必須とし、商品IDで既存の下書きを更新するため、同じ出力JSONを再取込しても重複しません。既に公開済み、在庫登録済み、または仮価格を解除した商品は上書きしません。取り込み時は送信された`stock`や`isActive`に関係なく、在庫0・仮価格・非公開にします。応答は`imported`、`inserted`、`updated`、`skipped`件数を返します。

管理者は取得元・商品名・カテゴリ・画像・価格を確認した後、自社の販売価格と在庫へ変更して公開します。公開前の下書きは商品一覧・カート・AIの購入候補に表示されません。GitHub Pagesだけの画面デモは現在のブラウザへ保存され、チーム共有にはPHP / MySQL API接続が必要です。

`node backend/scripts/import_marketplace_catalog.mjs --target=1000 --output=marketplace-products.json`を実行すると、Yahoo!ショッピング、楽天市場、および任意のAmazon.co.jp Creators APIから検索結果を取得し、管理画面へ読み込む候補JSONを作ります。Yahooと楽天のキーはこのスクリプトの実行環境だけへ設定してください。外部APIの価格・説明・在庫は取得時点の参考値であり、自社販売価格や在庫の証明ではありません。画像URLと商品ページURLは各APIの戻り値を保持します。Amazonはアソシエイト/Creators APIの認証設定があるときだけ検索します。

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
同じ接続元からの相談は1時間12回までです。利用回数はMySQLで管理し、接続元IPは秘密鍵でハッシュして保存します。CPUとマザーボードのソケットを照合できない場合は、互換性未確認のマザーボードを候補から外します。

相談時に`RAKUTEN_APP_ID`が設定されている場合、楽天市場の商品を最大5件、相場参考としてGeminiへ渡し、フロントにも`references`として返します。これは外部参照情報であり、自社商品IDではありません。画面でも「購入対象外」と表示し、カート追加データへ使いません。楽天APIが停止してもGeminiと自社商品カタログで相談できます。

## デモ注文 `GET/POST /api/demo-orders.php`

PHP接続モードの画面確認用注文はMySQLの`demo_orders`と`demo_order_items`へ保存します。注文はブラウザのPHPセッションごとに紐づき、`GET`ではそのセッションの直近50件を返します。ブラウザを閉じてセッションCookieが消えると、そのブラウザから過去のデモ注文を再取得できません。

`POST`は次のJSONを受け取ります。カード番号・有効期限・セキュリティコード、個人の住所を送信しないでください。

```json
{
  "items": [{ "id": "amd-ryzen-7-9800x3d", "quantity": 1 }],
  "paymentMethod": "konbini",
  "paymentStore": "ローソン"
}
```

支払い方法は`card`、`paypay`、`rakutenpay`、`transport`、`konbini`から選びます。サーバーが有効な自社商品と在庫を検証し、現在のMySQL価格で合計を再計算します。商品名と単価は注文時点の値を保存します。注文時に在庫は引き当てません。商品小計が11,000円未満の場合は送料660円を加算します。`POST`は`{ "order": {...} }`を返し、`GET`は`{ "orders": [...] }`を返します。どちらも注文番号、日付、デモ支払い表示、合計、商品名と単価のスナップショットを含みます。

これは決済・請求・払込・発送につながらないデモです。注文コードやコンビニ用番号も実際の支払いには使えません。1セッションにつき1時間10件までです。

サーバー環境変数：

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `GEMINI_API_KEY`, `GEMINI_MODEL`
- 任意：`RAKUTEN_APP_ID`, `RAKUTEN_ACCESS_KEY`
- CORS / Cookie：`APP_ALLOWED_ORIGINS`, `SESSION_SAMESITE`, `SESSION_SECURE`

APIキーやDBパスワードはPHPホストの環境変数または秘密情報ストアに置いてください。GitHub PagesのJavaScriptへ設定しないでください。

## この段階の対象外

会員情報とカートは画面確認用としてブラウザに保存されます。確定注文・在庫引当・実決済・配送・返品のPHP APIはまだありません。実販売を始める場合は認証済み会員、決済事業者との契約と連携、在庫引当、配送・返品の運用を別途実装してください。
