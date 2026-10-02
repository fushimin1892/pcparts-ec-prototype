import { writeFile } from "node:fs/promises";

const categories = [
  { name: "CPU", type: "cpu", target: 130, terms: ["Ryzen CPU", "Intel Core CPU", "デスクトップ CPU"] },
  { name: "GPU", type: "gpu", target: 170, terms: ["グラフィックボード RTX", "GeForce RTX グラボ", "Radeon RX グラボ"] },
  { name: "マザーボード", type: "board", target: 120, terms: ["Intel マザーボード", "AMD マザーボード", "AM5 LGA マザーボード"] },
  { name: "SSD", type: "ssd", target: 120, terms: ["NVMe SSD M.2", "SATA SSD 2.5インチ", "PCIe SSD"] },
  { name: "メモリ", type: "ram", target: 100, terms: ["DDR5 メモリ", "DDR4 メモリ", "デスクトップ メモリ"] },
  { name: "CPUクーラー", type: "cooler", target: 80, terms: ["CPUクーラー 水冷", "CPUクーラー 空冷", "簡易水冷 クーラー"] },
  { name: "ファン", type: "fan", target: 70, terms: ["PCケース ファン 120mm", "PCファン 140mm ARGB", "ケースファン PWM"] },
  { name: "PCケース", type: "case", target: 110, terms: ["PCケース ATX", "PCケース ミドルタワー", "PCケース mini ITX"] },
  { name: "PC電源", type: "psu", target: 100, terms: ["PC電源 ATX 80PLUS", "電源ユニット 750W", "電源ユニット 850W"] },
];

const yahooAppId = process.env.YAHOO_APP_ID?.trim();
const rakutenAppId = process.env.RAKUTEN_APP_ID?.trim();
const rakutenAccessKey = process.env.RAKUTEN_ACCESS_KEY?.trim();
const amazonClientId = process.env.AMAZON_CREATORS_CLIENT_ID?.trim();
const amazonClientSecret = process.env.AMAZON_CREATORS_CLIENT_SECRET?.trim();
const amazonPartnerTag = process.env.AMAZON_PARTNER_TAG?.trim();
const useYahoo = Boolean(yahooAppId);
const useRakuten = Boolean(rakutenAppId && rakutenAccessKey);
const useAmazon = Boolean(amazonClientId && amazonClientSecret && amazonPartnerTag);
if (!useYahoo && !useRakuten && !useAmazon) {
  throw new Error("Yahoo / 楽天 / Amazon Creators APIのいずれかの認証情報を環境変数に設定してください。");
}
if ((rakutenAppId && !rakutenAccessKey) || (!rakutenAppId && rakutenAccessKey)) {
  throw new Error("楽天APIはRAKUTEN_APP_IDとRAKUTEN_ACCESS_KEYの両方が必要です。");
}
if ([amazonClientId, amazonClientSecret, amazonPartnerTag].some(Boolean) && !useAmazon) {
  throw new Error("AmazonはAMAZON_CREATORS_CLIENT_ID、AMAZON_CREATORS_CLIENT_SECRET、AMAZON_PARTNER_TAGをすべて設定してください。");
}

const wanted = Number(process.argv.find((arg) => arg.startsWith("--target="))?.split("=")[1] || 1000);
if (!Number.isInteger(wanted) || wanted < 1 || wanted > 1000) throw new Error("--targetは1〜1000の整数で指定してください。");
const output = process.argv.find((arg) => arg.startsWith("--output="))?.slice("--output=".length) || "marketplace-products.json";
const totalCategoryTarget = categories.reduce((sum, category) => sum + category.target, 0);
const proportionalTargets = categories.map((category) => ({ ...category, raw: wanted * category.target / totalCategoryTarget }));
const goals = proportionalTargets.map((category) => ({ ...category, goal: Math.floor(category.raw) }));
let remainingCategorySlots = wanted - goals.reduce((sum, category) => sum + category.goal, 0);
for (const category of [...goals].sort((left, right) => (right.raw - Math.floor(right.raw)) - (left.raw - Math.floor(left.raw))).slice(0, remainingCategorySlots)) category.goal += 1;

const results = new Map();
const cursors = new Map();
const stoppedProviders = new Set();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let lastYahooRequestAt = 0;
let lastRakutenRequestAt = 0;
let lastAmazonRequestAt = 0;
let amazonToken = "";
let amazonTokenExpiresAt = 0;

async function requestJson(url, headers = {}) {
  const response = await fetch(url, { headers: { Accept: "application/json", ...headers } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`APIがHTTP ${response.status}を返しました: ${JSON.stringify(payload).slice(0, 240)}`);
  return payload;
}

async function yahooSearch(keyword, start) {
  const wait = Math.max(0, 1000 - (Date.now() - lastYahooRequestAt));
  if (wait) await sleep(wait);
  const url = new URL("https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch");
  for (const [key, value] of Object.entries({ appid: yahooAppId, query: keyword, results: "50", start: String(start), image_size: "600", in_stock: "true", condition: "new", sort: "-score" })) url.searchParams.set(key, value);
  lastYahooRequestAt = Date.now();
  return requestJson(url);
}

async function rakutenSearch(keyword, page) {
  const wait = Math.max(0, 1000 - (Date.now() - lastRakutenRequestAt));
  if (wait) await sleep(wait);
  const url = new URL("https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701");
  for (const [key, value] of Object.entries({ applicationId: rakutenAppId, keyword, hits: "30", page: String(page), imageFlag: "1", availability: "1", formatVersion: "2", field: "1" })) url.searchParams.set(key, value);
  lastRakutenRequestAt = Date.now();
  return requestJson(url, { accessKey: rakutenAccessKey });
}

async function amazonSearch(keyword, page) {
  if (!amazonToken || Date.now() > amazonTokenExpiresAt) {
    const response = await fetch("https://api.amazon.co.jp/auth/o2/token", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grant_type: "client_credentials", client_id: amazonClientId, client_secret: amazonClientSecret, scope: "creatorsapi::default" }),
    });
    const tokenPayload = await response.json().catch(() => ({}));
    if (!response.ok || !tokenPayload.access_token) throw new Error(`Amazon認証に失敗しました（HTTP ${response.status}）。Creators APIの認証情報を確認してください。`);
    amazonToken = tokenPayload.access_token;
    amazonTokenExpiresAt = Date.now() + (Number(tokenPayload.expires_in) || 3600) * 1000 - 60_000;
  }
  const minimumGap = 1000 - (Date.now() - lastAmazonRequestAt);
  if (minimumGap > 0) await sleep(minimumGap);
  const catalog = await fetch("https://creatorsapi.amazon/catalog/v1/searchItems", {
    method: "POST",
    headers: { Authorization: `Bearer ${amazonToken}`, "Content-Type": "application/json", "x-marketplace": "www.amazon.co.jp" },
    body: JSON.stringify({
      keywords: keyword, partnerTag: amazonPartnerTag, marketplace: "www.amazon.co.jp", itemCount: 10, itemPage: page,
      condition: "New", availability: "Available",
      resources: ["images.primary.large", "images.primary.medium", "itemInfo.title", "itemInfo.byLineInfo", "itemInfo.features", "offersV2.listings.price", "offersV2.listings.availability", "offersV2.listings.merchantInfo"],
    }),
  });
  lastAmazonRequestAt = Date.now();
  const payload = await catalog.json().catch(() => ({}));
  if (!catalog.ok) throw new Error(`Amazon検索がHTTP ${catalog.status}を返しました: ${JSON.stringify(payload).slice(0, 240)}`);
  return payload;
}

function categoryMatches(category, name) {
  const text = String(name || "");
  if (/(中古|ジャンク|ノートPC|ノートパソコン|ゲーミングPC|完成品|自作PCセット|空箱|展示品)/i.test(text)) return false;
  const accessories = {
    CPU: /(CPUクーラー|クーラー|ファン|グリス|ヒートシンク|ブラケット|マザーボード|ソケット保護|CPUスタンド)/i,
    GPU: /(ウォーターブロック|グラボスタンド|GPUホルダー|グラボホルダー|GPUステー|グラボステー|バックプレート|グラボ用|マザーボード)/i,
    マザーボード: /(マザーボード用|マザーボードスタンド|ソケットカバー|バックプレート|延長ケーブル)/i,
    SSD: /(SSDケース|SSDエンクロージャ|SSD外付けケース|SSDヒートシンク|SSDスタンド|マザーボード|M\.2変換|M\.2アダプタ)/i,
    メモリ: /(ノート用|SO.?DIMM|メモリカード|USBメモリ|メモリクーラー|マザーボード|メモリ対応)/i,
    PCケース: /(PCケースファン|ケースファン|PCケース用|ケース用ファン|ケーススタンド)/i,
    PC電源: /(電源ケーブル|電源延長|電源変換|電源アダプタ|電源ユニット用)/i,
  };
  if (accessories[category]?.test(text)) return false;
  const patterns = {
    CPU: /(Ryzen|Core\s*(Ultra|i[3579])|Xeon|Threadripper|Athlon)/i,
    GPU: /(GeForce|RTX\s*\d|GTX\s*\d|Radeon\s*RX|グラフィックボード|グラボ)/i,
    マザーボード: /(マザーボード|motherboard|LGA\d{4}|AM[45]\b|B[468]\d{2}|X[3568]\d{2}|Z[78]\d{2})/i,
    SSD: /(SSD|NVMe|M\.2|ソリッドステート)/i,
    メモリ: /(DDR[345].*(メモリ|DIMM|RAM|\d+\s*GB)|(?:メモリ|DIMM|RAM).*DDR[345]|デスクトップ.*メモリ)/i,
    CPUクーラー: /(CPUクーラー|CPU cooler|簡易水冷|水冷クーラー|空冷クーラー)/i,
    ファン: /(ケースファン|PCファン|ケース.*ファン|120\s*mm.*ファン|140\s*mm.*ファン)/i,
    PCケース: /(PCケース|パソコンケース|ミドルタワー|フルタワー|mini.?ITXケース)/i,
    PC電源: /(電源ユニット|PC電源|ATX.*電源|80\s*PLUS.*(Gold|Platinum|Bronze)|\d{3,4}\s*W.*(Gold|Platinum|Bronze))/i,
  };
  return patterns[category]?.test(text) || false;
}

function guessMaker(name, fallback = "", category = "") {
  const boardMakers = ["ASUS", "MSI", "GIGABYTE", "ASRock", "ZOTAC", "Palit", "PNY", "SAPPHIRE", "玄人志向", "PowerColor", "XFX", "Inno3D", "Gainward"];
  const known = category === "CPU" ? ["AMD", "Intel"] : [
    ...boardMakers, "Corsair", "Kingston", "Crucial", "G.Skill", "Western Digital", "Samsung", "Seagate", "Solidigm", "KIOXIA", "NZXT", "Fractal Design", "Lian Li", "Thermalright", "Noctua", "DEEPCOOL", "Cooler Master", "Seasonic", "FSP", "Antec", "AMD", "Intel", "NVIDIA",
  ];
  return known.find((maker) => new RegExp(maker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(name)) || fallback || "メーカー未特定";
}

function platformFor(category, name, maker) {
  if (category !== "CPU" && category !== "マザーボード") return "";
  const value = `${maker} ${name}`;
  const intel = category === "CPU"
    ? /\bIntel\b|\bCore\s*(?:Ultra|i[3579])|\bXeon\b/i.test(value)
    : /\bIntel\b|\bLGA\s*\d{4}\b|\b(?:B360|B365|B460|B560|B660|B760|B860|H310|H370|H410|H470|H510|H570|H610|H670|H770|H810|H870|Z370|Z390|Z490|Z590|Z690|Z790|Z890|W680|W790)/i.test(value);
  const amd = category === "CPU"
    ? /\bAMD\b|\bRyzen\b|\bThreadripper\b|\bAthlon\b/i.test(value)
    : /\bAMD\b|\bAM[245]\b|\b(?:A320|A520|A620|B350|B450|B550|B650|B850|X370|X470|X570|X670|X870|TRX40|TRX50)/i.test(value);
  if (intel === amd) return "";
  if (intel) return "Intel";
  if (amd) return "AMD";
  return "";
}

function asProduct(category, hit, market) {
  const amazonListing = market === "Amazon.co.jp" ? hit.offersV2?.listings?.[0] : null;
  const name = String(hit.name || hit.itemName || hit.itemInfo?.title?.displayValue || "").trim().replace(/\s+/g, " ");
  if (!name || !categoryMatches(category.name, name)) return null;
  const rakutenImage = hit.mediumImageUrls?.[0] || hit.smallImageUrls?.[0] || "";
  const imageUrl = market === "Yahoo!ショッピング" ? hit.exImage?.url || hit.image?.medium || ""
    : market === "楽天市場" ? (typeof rakutenImage === "string" ? rakutenImage : rakutenImage?.imageUrl || "")
      : hit.images?.primary?.large?.url || hit.images?.primary?.medium?.url || "";
  const productUrl = hit.url || hit.itemUrl || hit.detailPageURL || "";
  const price = Number(hit.price ?? hit.itemPrice ?? amazonListing?.price?.money?.amount);
  if (!imageUrl.startsWith("https://") || !productUrl.startsWith("https://") || !Number.isSafeInteger(price) || price <= 0) return null;
  let maker = guessMaker(name, hit.brand?.name || hit.itemInfo?.byLineInfo?.brand?.displayValue || "", category.name);
  const store = market === "Yahoo!ショッピング" ? hit.seller?.name : market === "楽天市場" ? hit.shopName : amazonListing?.merchantInfo?.name || "Amazon.co.jp";
  const sku = hit.code || hit.itemCode || hit.asin || "";
  if (!sku) return null;
  const identifier = market === "Yahoo!ショッピング" ? `yahoo-${sku}` : market === "楽天市場" ? `rakuten-${sku}` : `amazon-${sku}`;
  const id = identifier.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").slice(0, 100);
  if (!id || results.has(id)) return null;
  const platform = platformFor(category.name, name, maker);
  if (["CPU", "マザーボード"].includes(category.name) && !platform) return null;
  if (category.name === "CPU" && maker === "メーカー未特定") maker = platform;
  const description = market === "Yahoo!ショッピング" ? hit.description || hit.headLine || "" : market === "楽天市場" ? hit.itemCaption || hit.catchcopy || "" : (hit.itemInfo?.features?.displayValues || []).join(" / ");
  const available = market === "Yahoo!ショッピング" ? Boolean(hit.inStock) : market === "楽天市場" ? Number(hit.availability) === 1 : amazonListing?.availability?.type === "IN_STOCK";
  return {
    id, name: name.slice(0, 255), shortName: name.slice(0, 120), maker, platform,
    category: category.name, type: category.type, price, stock: 0, rating: Number(market === "Yahoo!ショッピング" ? hit.review?.rate : hit.reviewAverage) || 0,
    reviews: Number(market === "Yahoo!ショッピング" ? hit.review?.count : hit.reviewCount) || 0,
    description: `${description.slice(0, 700)}${description ? "\n" : ""}外部ショップAPIから取得した参考情報です。取得時点の価格・在庫状況です。自社在庫と販売価格は管理画面で確認してください。`,
    specs: { "取得元": `${market}${store ? ` / ${store}` : ""}`, "販売元商品コード": sku, ...(hit.janCode ? { "JANコード": hit.janCode } : {}), "取得日時": new Date().toISOString(), "外部掲載在庫": available ? "API上で在庫あり" : "在庫なし" },
    sourceName: `${market}${store ? ` / ${store}` : ""}`, imageUrl, productUrl, manufacturerUrl: "", isDemoPrice: true, isActive: false,
  };
}

async function collectCategory(category, market, target) {
  let added = 0;
  const terms = category.terms;
  const pageSize = market === "Yahoo!ショッピング" ? 50 : market === "楽天市場" ? 30 : 10;
  const pagesPerTerm = market === "Amazon.co.jp" ? 10 : 19;
  const stateKey = `${category.name}|${market}`;
  const cursor = cursors.get(stateKey) || { term: 0, page: 0 };
  while (added < target && cursor.term < terms.length) {
    if (cursor.page >= pagesPerTerm) { cursor.term += 1; cursor.page = 0; continue; }
    const keyword = terms[cursor.term];
    const data = market === "Yahoo!ショッピング" ? await yahooSearch(keyword, cursor.page * pageSize + 1)
      : market === "楽天市場" ? await rakutenSearch(keyword, cursor.page + 1)
        : await amazonSearch(keyword, cursor.page + 1);
    cursor.page += 1;
    const hits = market === "Yahoo!ショッピング" ? data.hits || [] : market === "楽天市場" ? data.items || [] : data.searchResult?.items || [];
    if (!hits.length) { cursor.term += 1; cursor.page = 0; continue; }
    for (const hit of hits) {
      const product = asProduct(category, hit, market);
      if (!product) continue;
      results.set(product.id, product);
      added += 1;
      if (added >= target) break;
    }
    if (hits.length < pageSize) { cursor.term += 1; cursor.page = 0; }
  }
  cursors.set(stateKey, cursor);
  return added;
}

async function tryCollect(category, market, target) {
  if (target < 1 || stoppedProviders.has(market)) return 0;
  try {
    return await collectCategory(category, market, target);
  } catch (error) {
    stoppedProviders.add(market);
    console.error(`${market}の検索を停止しました: ${error.message}`);
    return 0;
  }
}

for (const category of goals) {
  const providers = [useYahoo && "Yahoo!ショッピング", useRakuten && "楽天市場", useAmazon && "Amazon.co.jp"].filter(Boolean);
  const perProvider = Math.floor(category.goal / providers.length);
  const extraSlots = category.goal % providers.length;
  const allocations = Object.fromEntries(providers.map((provider, index) => [provider, perProvider + (index < extraSlots ? 1 : 0)]));
  let yahooCount = 0; let rakutenCount = 0; let amazonCount = 0;
  if (useYahoo) yahooCount = await tryCollect(category, "Yahoo!ショッピング", allocations["Yahoo!ショッピング"]);
  if (useRakuten) rakutenCount = await tryCollect(category, "楽天市場", allocations["楽天市場"]);
  if (useAmazon) amazonCount = await tryCollect(category, "Amazon.co.jp", allocations["Amazon.co.jp"]);
  const remaining = category.goal - yahooCount - rakutenCount - amazonCount;
  let extra = 0;
  if (remaining > 0 && useYahoo) extra += await tryCollect(category, "Yahoo!ショッピング", remaining);
  if (category.goal - yahooCount - rakutenCount - amazonCount - extra > 0 && useRakuten) extra += await tryCollect(category, "楽天市場", category.goal - yahooCount - rakutenCount - amazonCount - extra);
  if (category.goal - yahooCount - rakutenCount - amazonCount - extra > 0 && useAmazon) extra += await tryCollect(category, "Amazon.co.jp", category.goal - yahooCount - rakutenCount - amazonCount - extra);
  console.log(`${category.name}: 目標 ${category.goal} 件 / 取得 ${yahooCount + rakutenCount + amazonCount + extra} 件`);
}

const items = [...results.values()];
await writeFile(output, `${JSON.stringify({ generatedAt: new Date().toISOString(), count: items.length, items }, null, 2)}\n`, "utf8");
console.log(`保存しました: ${output} (${items.length}件 / 目標 ${wanted}件)`);
console.log("価格はAPI取得時点の参考値、在庫は管理者確認前として0で登録してください。画像・商品ページURLは各APIの返却値を使用します。");
