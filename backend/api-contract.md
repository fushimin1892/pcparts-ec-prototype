# PHP API接続仕様

フロントは`config.js`の`window.PC_PARTS_API_BASE_URL`を空にするとブラウザ内デモ、`/api`または別のPHP API URLにするとサーバー接続モードになります。サーバー接続時の商品一覧はMySQLの有効な自社登録商品だけです。

## `GET /api/health.php`

PHP APIとMySQLの接続状態を返します。

## `GET /api/products.php`

MySQLに登録された公開済みの自社商品を返します。`keyword`、`category`、`platform=Intel|AMD`で絞り込めます。外部ショップの参考商品はこの一覧へ保存しません。管理者セッション中の`GET /api/products.php?include_inactive=1`では非公開の下書きも返します。

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
      "imageUrl": "https://your-shop.example.com/images/product-image.jpg",
      "productUrl": "",
      "sourceName": "",
      "specs": { "コア / スレッド": "8 / 16", "ソケット": "AM5" },
      "isDemoPrice": true,
      "isActive": true
    }
  ]
}
```

## 外部参考商品 `GET /api/reference-offers.php`

`reference_offers`テーブルにある、取得期限内かつ提供元が有効な商品だけを返します。自社の`products`、AIの購入候補、カート、デモ注文とは分離しています。`keyword`、`category`、`source`、`page`、`per_page`で絞り込めます。`per_page`は1〜100、初期値24です。提供元未設定時は空の一覧を返します。

```json
{
  "items": [
    {
      "id": "ref-…",
      "name": "提供元が返した商品名",
      "category": "CPU",
      "platform": "AMD",
      "price": 45000,
      "imageUrl": "https://images.example.com/item.jpg",
      "productUrl": "https://shop.example.com/item",
      "sourceName": "許諾済みの提供元",
      "sellerName": "販売店名",
      "retrievedAt": "2026-10-02T00:00:00+00:00",
      "description": "提供元の説明",
      "referenceOnly": true
    }
  ],
  "total": 1,
  "page": 1,
  "perPage": 24,
  "hasMore": false
}
```

`price`は取得時点の提供元の円価格です。購入操作は外部の商品ページへ移動し、当サイトでは決済できません。画像も提供元に掲載許諾がある場合に限って使います。取得日時と販売元を画面に示し、価格・在庫の最新状態は外部ページで確認します。

### `POST /api/admin/reference-offers-sync.php`

管理者セッションが必要です。`{"source":"your_supplier","page":1}`を送ると、非公開設定の`REFERENCE_FEED_SOURCES`に登録された1ページを取得して更新します。応答は`source`、`page`、`fetched`、`inserted`、`updated`、`rejected`、`hasMore`、`nextPage`です。1回最大100件で、`hasMore`に従って管理者側から次ページを呼びます。`source`が未登録・無効、または表示・短期保存・画像掲載の許諾フラグが揃わないと取り込みません。Yahoo!、楽天、Amazon向けのアダプターはありません。

設定例は`backend/config.production.php.example`を参照してください。必要な項目は`name`、`permissionReference`、`rights`（`display`、`cache`、`images`）、HTTPSの`feedUrl`、許可された`productHosts`・`imageHosts`、`maxAgeHours`（1〜168）です。フィードは`page`と`per_page=100`を受け取り、次の形式を返します。

```json
{
  "items": [
    {
      "id": "provider-unique-id",
      "name": "商品名",
      "category": "CPU",
      "platform": "AMD",
      "price": 45000,
      "imageUrl": "https://images.example.com/item.jpg",
      "productUrl": "https://shop.example.com/item",
      "description": "商品説明"
    }
  ],
  "hasMore": false
}
```

`maxAgeHours=24`の設定例なら取得から24時間、最大でも168時間で参考商品は表示期限を迎えます。これは実装上の期限であり、各提供元の規約上の更新義務を代替しません。許諾を無効にすると、DBに行が残っていても公開APIからは即座に非表示になります。フィード内容や画像の利用許諾、保存期間、更新頻度は提供元ごとに確認してください。現在、許諾済みフィードは設定されていないため0件です。

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

管理者セッション中に最大1,000件をまとめて自社販売商品の下書きへ登録・更新する既存機能です。JSON本文は`{ "items": [商品データ...] }`です。商品IDで既存の下書きを更新するため、同じJSONを再取込しても重複しません。既に公開済み、在庫登録済み、または仮価格を解除した商品は上書きしません。取り込み時は送信された`stock`や`isActive`に関係なく、在庫0・仮価格・非公開にします。応答は`imported`、`inserted`、`updated`、`skipped`件数を返します。

管理者は商品名・カテゴリ・画像・価格を確認した後、自社の販売価格と在庫へ変更して公開します。公開前の下書きは商品一覧・カート・AIの購入候補に表示されません。GitHub Pagesだけの画面デモは現在のブラウザへ保存され、チーム共有にはPHP / MySQL API接続が必要です。

旧試作用スクリプト`backend/scripts/import_marketplace_catalog.mjs`は外部APIの検索結果JSONを生成しますが、参考商品一覧には接続していません。外部サイトの価格・説明・画像を自社商品として公開する根拠にはなりません。外部参考商品の表示には専用の`reference_offers`経路と、提供元による表示・短期保存・画像掲載の許諾を使います。

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

相談時に`RAKUTEN_APP_ID`と`RAKUTEN_ACCESS_KEY`が両方設定されている場合、[楽天市場商品検索API（2026-07-01版）](https://webservice.rakuten.co.jp/index.php/documentation/ichiba-item-search)から最大5件を取得します。APIレスポンスの`items`を読み、画像URL・楽天の商品ページ・取得日時`retrievedAt`を`references`へ返します。これは楽天市場へリンクする外部参考商品であり、自社商品ID・在庫・カートには変換しません。`referenceStatus`は`ok`、`not_configured`、`no_results`、`unavailable`のいずれかです。設定不足や取得失敗時は`referenceNotice`も返し、AIの構成提案は自社カタログだけで続けます。

楽天の[公式ヘルプ](https://webservice.faq.rakuten.net/hc/ja/articles/900001974363-%E5%90%84API%E3%81%A7%E5%8F%96%E5%BE%97%E3%81%97%E3%81%9F%E6%83%85%E5%A0%B1%E3%81%AF%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AA%E7%9B%AE%E7%9A%84%E3%81%A7%E5%88%A9%E7%94%A8%E3%81%A7%E3%81%8D%E3%81%BE%E3%81%99%E3%81%8B)は、APIで取得した商品情報の利用目的を楽天商品の紹介と商品ページへのリンクに限定しています。楽天から得た画像・説明・価格を当店販売商品のデータとして複製しないでください。価格・在庫情報を表示する場合の更新頻度と取得日時の表示要件も[公式ヘルプ](https://webservice.faq.rakuten.net/hc/ja/articles/900001974343-%E5%90%84API%E3%81%8B%E3%82%89%E5%8F%96%E5%BE%97%E3%81%97%E3%81%9F%E3%83%87%E3%83%BC%E3%82%BF%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B%E5%A0%B4%E5%90%88-%E3%81%A9%E3%81%AE%E3%81%8F%E3%82%89%E3%81%84%E3%81%AE%E9%A0%BB%E5%BA%A6%E3%81%A7%E6%9B%B4%E6%96%B0%E3%81%99%E3%82%8B%E5%BF%85%E8%A6%81%E3%81%8C%E3%81%82%E3%82%8A%E3%81%BE%E3%81%99%E3%81%8B)で確認してください。

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
