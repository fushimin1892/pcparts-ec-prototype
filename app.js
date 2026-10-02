const products = [
  { id: "gpu5070", name: "GeForce RTX 5070 White 12GB", shortName: "GeForce RTX 5070 White", maker: "ZOTAC", category: "GPU", price: 89800, stock: 8, type: "gpu", rating: 4.8, reviews: 34, description: "最新世代のGPUで、ARKの広大な世界もVALORANTの高フレームレートも快適に。ホワイトのファンカバーとARGBライティングを備えています。", specs: { "GPU": "GeForce RTX 5070", "メモリ": "12GB GDDR7", "出力端子": "HDMI / DisplayPort", "補助電源": "16ピン", "サイズ": "約300 mm" } },
  { id: "gpu4060", name: "GeForce RTX 4060 8GB", shortName: "GeForce RTX 4060 8GB", maker: "NVIDIA", category: "GPU", price: 54800, stock: 8, type: "gpu", rating: 4.7, reviews: 42, description: "人気タイトルをフルHDで楽しめる、扱いやすいグラフィックボードです。", specs: { "GPU": "GeForce RTX 4060", "メモリ": "8GB GDDR6", "出力端子": "HDMI / DisplayPort", "補助電源": "8ピン", "サイズ": "約240 mm" } },
  { id: "cpu7500f", name: "AMD Ryzen 5 7500F", shortName: "Ryzen 5 7500F", maker: "AMD", platform: "AMD", category: "CPU", price: 24980, stock: 12, type: "cpu", rating: 4.8, reviews: 27, description: "6コア12スレッドのAM5対応CPU。ゲーム向けPCのコストと性能のバランスに優れています。", specs: { "コア / スレッド": "6 / 12", "ソケット": "AM5", "最大クロック": "5.0 GHz", "TDP": "65 W" } },
  { id: "cpu7700", name: "AMD Ryzen 7 7700", shortName: "Ryzen 7 7700", maker: "AMD", platform: "AMD", category: "CPU", price: 44800, stock: 9, type: "cpu", rating: 4.9, reviews: 51, description: "ゲーム配信や制作作業も見据えた8コア16スレッドのCPUです。", specs: { "コア / スレッド": "8 / 16", "ソケット": "AM5", "最大クロック": "5.3 GHz", "TDP": "65 W" } },
  { id: "cooler240", name: "Frost Flow 240 White", shortName: "Frost Flow 240 White", maker: "Thermalright", category: "CPUクーラー", price: 9980, stock: 14, type: "cooler", rating: 4.6, reviews: 19, description: "白いラジエーターとARGBファンを採用した240 mm水冷CPUクーラー。", specs: { "タイプ": "簡易水冷", "ラジエーター": "240 mm", "対応ソケット": "AM5 / AM4 / LGA1851" } },
  { id: "ram32white", name: "VENGEANCE RGB DDR5 32GB White", shortName: "VENGEANCE RGB DDR5-5600", maker: "Corsair", category: "メモリ", price: 13980, stock: 16, type: "ram", rating: 4.8, reviews: 30, description: "白いヒートスプレッダーとRGBライティングが映えるDDR5メモリ。", specs: { "容量": "32GB (16GB × 2)", "規格": "DDR5-5600", "カラー": "ホワイト" } },
  { id: "ram32", name: "VENGEANCE DDR5 32GB", shortName: "Corsair 32GB DDR5-5600", maker: "Corsair", category: "メモリ", price: 12800, stock: 20, type: "ram", rating: 4.7, reviews: 26, description: "ゲーム用PCの標準的な容量を備えたDDR5メモリです。", specs: { "容量": "32GB (16GB × 2)", "規格": "DDR5-5600", "カラー": "ブラック" } },
  { id: "ssd2tb", name: "WD_BLACK SN770 NVMe SSD 2TB", shortName: "WD_BLACK SN770 2TB", maker: "Western Digital", category: "SSD", price: 14980, stock: 21, type: "ssd", rating: 4.8, reviews: 38, description: "大容量のゲームライブラリを保存できる、M.2 NVMe SSDです。", specs: { "容量": "2TB", "規格": "M.2 2280", "インターフェース": "PCIe Gen4 x4" } },
  { id: "boardb650", name: "B650M AORUS ELITE AX ICE", shortName: "B650M AORUS ELITE AX ICE", maker: "GIGABYTE", platform: "AMD", category: "マザーボード", price: 16800, stock: 10, type: "board", rating: 4.6, reviews: 17, description: "白いヒートシンクを採用したAM5対応マザーボードです。", specs: { "チップセット": "AMD B650", "ソケット": "AM5", "フォームファクタ": "Micro ATX", "無線": "Wi-Fi 6E" } },
  { id: "fan120rgb", name: "120mm ARGB ケースファン White", shortName: "120mm ARGB Fan White", maker: "PC PARTS SHOP", category: "ファン", price: 1980, stock: 20, type: "fan", rating: 0, reviews: 0, isDemoPrice: true, description: "ケース内のエアフローを整える、白色フレームの120mm ARGBファンです。", specs: { "サイズ": "120 × 120 × 25 mm", "回転数": "800–1800 rpm", "コネクター": "4-pin PWM / 3-pin ARGB", "カラー": "ホワイト" } },
  { id: "psu750", name: "750W 80PLUS Gold White", shortName: "750W Gold White", maker: "Cooler Master", category: "PC電源", price: 11980, stock: 11, type: "psu", rating: 4.7, reviews: 15, description: "安定した電力供給を支える750W電源。白いケースにも合わせやすいカラーです。", specs: { "出力": "750 W", "認証": "80PLUS Gold", "規格": "ATX 3.0" } },
  { id: "casewhite", name: "H5 Flow White RGB", shortName: "NZXT H5 Flow White", maker: "NZXT", category: "PCケース", price: 16980, stock: 7, type: "case", rating: 4.8, reviews: 23, description: "強化ガラスとRGBファンで、パーツが見える白いミドルタワーケースです。", specs: { "フォームファクタ": "ミドルタワー", "対応マザー": "ATX / Micro ATX / Mini-ITX", "カラー": "ホワイト", "側面": "強化ガラス" } },
  { id: "caseblack", name: "H5 Flow Black", shortName: "NZXT H5 Flow", maker: "NZXT", category: "PCケース", price: 14800, stock: 12, type: "case", rating: 4.6, reviews: 18, description: "エアフローを重視したシンプルなミドルタワーケースです。", specs: { "フォームファクタ": "ミドルタワー", "対応マザー": "ATX / Micro ATX / Mini-ITX", "カラー": "ブラック" } },
  { id: "monitor24", name: "24-inch Gaming Monitor 180Hz", shortName: "24インチ 180Hz ゲーミングモニター", maker: "PC PARTS SHOP", category: "その他", price: 18980, stock: 6, type: "monitor", rating: 4.6, reviews: 12, description: "VALORANTなどの対戦ゲームにも使いやすい、フルHD・高リフレッシュレートのモニターです。", specs: { "サイズ": "24インチ", "解像度": "1920 × 1080", "リフレッシュレート": "180 Hz", "入力端子": "HDMI / DisplayPort" } },
];

const categoryItems = [
  ["CPU", "▦"], ["GPU", "▣"], ["マザーボード", "▤"], ["SSD", "▱"], ["メモリ", "▰"], ["CPUクーラー", "❋"], ["ファン", "◉"], ["PCケース", "▥"], ["PC電源", "ϟ"], ["その他", "＋"],
];
const platformCategories = new Set(["CPU", "マザーボード"]);
const platformOptions = ["Intel", "AMD"];
const legacyCategories = { "グラフィックボード": "GPU", "ストレージ": "SSD", "冷却パーツ": "CPUクーラー", "電源": "PC電源", "モニター": "その他" };

const storage = {
  get(key, fallback) { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private browsing may disable storage */ } },
};
const API_BASE_URL = String(window.PC_PARTS_API_BASE_URL || "").replace(/\/+$/, "");
const apiConfigured = API_BASE_URL.length > 0;
let serverCatalogLoaded = false;
let adminStatusChecked = false;
let adminStatusChecking = false;
let adminAuthenticated = false;
let adminProducts = [];
let adminCatalogLoaded = false;
let adminCatalogLoading = false;
let adminCatalogError = "";
let serverAiProposal = null;
let serverAiError = "";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}/${path.replace(/^\/+/, "")}`, {
    credentials: "include",
    ...options,
    headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...(options.headers || {}) },
  });
  let result = {};
  try { result = await response.json(); } catch { /* report a readable API failure below */ }
  if (!response.ok) throw new Error(result.error || `APIエラー（${response.status}）`);
  return result;
}

function normalizeApiProduct(product) {
  return {
    id: String(product.id), name: String(product.name || ""), shortName: String(product.shortName || product.name || ""),
    maker: String(product.maker || ""), platform: String(product.platform || ""), category: String(product.category || "その他"), type: String(product.type || "other"),
    price: Number(product.price) || 0, stock: Number(product.stock) || 0, rating: Number(product.rating) || 0,
    reviews: Number(product.reviews) || 0, description: String(product.description || ""),
    specs: product.specs && typeof product.specs === "object" ? product.specs : {},
    manufacturerUrl: String(product.manufacturerUrl || ""), imageUrl: String(product.imageUrl || ""), productUrl: String(product.productUrl || ""),
    sourceName: String(product.sourceName || product.specs?.["取得元"] || ""), isDemoPrice: Boolean(product.isDemoPrice),
    isActive: product.isActive === undefined ? true : Boolean(product.isActive),
  };
}

function safeHttpUrl(value) {
  const url = httpUrl(value);
  return url ? safeText(url) : "";
}

function httpUrl(value) {
  try { const parsed = new URL(String(value || "")); return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : ""; }
  catch { return ""; }
}

function productImage(product, label = product.shortName || product.name, extraClass = "") {
  const imageUrl = safeHttpUrl(product.imageUrl);
  return imageUrl
    ? `<img class="catalog-product-image ${extraClass}" src="${imageUrl}" alt="${safeText(label)}" loading="lazy" referrerpolicy="no-referrer"><span class="product-image-fallback" hidden>${artFor(product.type, label)}</span>`
    : artFor(product.type, label);
}

document.addEventListener("error", (event) => {
  if (!event.target.matches?.(".catalog-product-image")) return;
  event.target.hidden = true;
  const fallback = event.target.parentElement?.querySelector(".product-image-fallback");
  if (fallback) fallback.hidden = false;
}, true);
document.addEventListener("load", (event) => {
  if (!event.target.matches?.(".catalog-product-image")) return;
  const fallback = event.target.parentElement?.querySelector(".product-image-fallback");
  if (fallback) fallback.hidden = true;
}, true);

async function refreshServerCatalog() {
  if (!apiConfigured) return;
  if (!serverCatalogLoaded) products.splice(0, products.length);
  try {
    const result = await apiRequest("products.php");
    products.splice(0, products.length, ...(Array.isArray(result.items) ? result.items.map(normalizeApiProduct) : []));
    serverCatalogLoaded = true;
    renderRoute();
  } catch (error) {
    products.splice(0, products.length);
    serverCatalogLoaded = false;
    renderRoute();
    showToast(`商品APIに接続できません: ${error.message}`);
  }
}

async function refreshAdminCatalog() {
  if (!apiConfigured || !adminAuthenticated || adminCatalogLoading) return;
  adminCatalogLoading = true;
  adminCatalogError = "";
  try {
    const result = await apiRequest("products.php?include_inactive=1");
    adminProducts = Array.isArray(result.items) ? result.items.map(normalizeApiProduct) : [];
    adminCatalogLoaded = true;
  } catch (error) {
    adminCatalogLoaded = false;
    adminCatalogError = error.message || "管理商品を読み込めませんでした";
  } finally {
    adminCatalogLoading = false;
    if (routeInfo().page === "admin") renderAdmin();
  }
}

async function refreshServerOrders() {
  if (!apiConfigured || serverOrdersLoading) return;
  serverOrdersLoading = true;
  serverOrdersError = "";
  try {
    const result = await apiRequest("demo-orders.php");
    orders = Array.isArray(result.orders) ? result.orders : [];
  } catch (error) {
    serverOrdersError = error.message || "デモ注文履歴を読み込めませんでした";
  } finally {
    serverOrdersLoaded = true;
    serverOrdersLoading = false;
    if (["account", "orders"].includes(routeInfo().page)) renderRoute();
  }
}

function cpuSeed({ id, name, price, cores, threads, boost, base, cache, tdp, socket, memory, graphics, cooler, generation, manufacturerUrl }) {
  return {
    id, name, shortName: name, maker: id.startsWith("intel-") ? "Intel" : "AMD", platform: id.startsWith("intel-") ? "Intel" : "AMD", category: "CPU", price,
    stock: 5, type: "cpu", rating: 0, reviews: 0, isDemoPrice: true,
    description: `${generation}のデスクトップCPUです。主要仕様はメーカー公表情報を登録しています。表示価格と在庫は試作用の仮設定です。`,
    specs: {
      "世代・アーキテクチャ": generation, "コア / スレッド": `${cores} / ${threads}`,
      "最大ブーストクロック": `最大 ${boost} GHz`, "ベースクロック": `${base} GHz`,
      "キャッシュ": cache, "ソケット": socket, "対応メモリ": memory,
      "内蔵グラフィックス": graphics, "電力": tdp, "付属クーラー": cooler,
      "価格区分": "試作用の仮価格（楽天API未接続）",
    },
    manufacturerUrl,
  };
}

const seededCpuProducts = [
  cpuSeed({ id: "amd-ryzen-5-5600", name: "AMD Ryzen 5 5600", price: 17800, cores: 6, threads: 12, boost: 4.4, base: 3.5, cache: "L3 32 MB + L2 3 MB", tdp: "65 W", socket: "AM4", memory: "DDR4", graphics: "なし", cooler: "Wraith Stealth", generation: "Ryzen 5000 / Zen 3", manufacturerUrl: "https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-5-5600.html" }),
  cpuSeed({ id: "amd-ryzen-5-5600x", name: "AMD Ryzen 5 5600X", price: 19800, cores: 6, threads: 12, boost: 4.6, base: 3.7, cache: "L3 32 MB + L2 3 MB", tdp: "65 W", socket: "AM4", memory: "DDR4", graphics: "なし", cooler: "Wraith Stealth", generation: "Ryzen 5000 / Zen 3", manufacturerUrl: "https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-5-5600x.html" }),
  cpuSeed({ id: "amd-ryzen-7-5700x", name: "AMD Ryzen 7 5700X", price: 25800, cores: 8, threads: 16, boost: 4.6, base: 3.4, cache: "L3 32 MB + L2 4 MB", tdp: "65 W", socket: "AM4", memory: "DDR4", graphics: "なし", cooler: "なし", generation: "Ryzen 5000 / Zen 3", manufacturerUrl: "https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-7-5700x.html" }),
  cpuSeed({ id: "amd-ryzen-7-5800x3d", name: "AMD Ryzen 7 5800X3D", price: 52800, cores: 8, threads: 16, boost: 4.5, base: 3.4, cache: "L3 96 MB + L2 4 MB", tdp: "105 W", socket: "AM4", memory: "DDR4", graphics: "なし", cooler: "なし", generation: "Ryzen 5000 / Zen 3 + 3D V-Cache", manufacturerUrl: "https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-7-5800x3d.html" }),
  cpuSeed({ id: "amd-ryzen-5-7600", name: "AMD Ryzen 5 7600", price: 31800, cores: 6, threads: 12, boost: 5.1, base: 3.8, cache: "L3 32 MB + L2 6 MB", tdp: "65 W", socket: "AM5", memory: "DDR5", graphics: "Radeon Graphics（2コア）", cooler: "Wraith Stealth", generation: "Ryzen 7000 / Zen 4", manufacturerUrl: "https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-5-7600.html" }),
  cpuSeed({ id: "amd-ryzen-5-7600x", name: "AMD Ryzen 5 7600X", price: 34800, cores: 6, threads: 12, boost: 5.3, base: 4.7, cache: "L3 32 MB + L2 6 MB", tdp: "105 W", socket: "AM5", memory: "DDR5", graphics: "Radeon Graphics（2コア）", cooler: "なし", generation: "Ryzen 7000 / Zen 4", manufacturerUrl: "https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-5-7600x.html" }),
  cpuSeed({ id: "amd-ryzen-7-7700x", name: "AMD Ryzen 7 7700X", price: 48800, cores: 8, threads: 16, boost: 5.4, base: 4.5, cache: "L3 32 MB + L2 8 MB", tdp: "105 W", socket: "AM5", memory: "DDR5", graphics: "Radeon Graphics（2コア）", cooler: "なし", generation: "Ryzen 7000 / Zen 4", manufacturerUrl: "https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-7-7700x.html" }),
  cpuSeed({ id: "amd-ryzen-7-7800x3d", name: "AMD Ryzen 7 7800X3D", price: 62800, cores: 8, threads: 16, boost: 5.0, base: 4.2, cache: "L3 96 MB + L2 8 MB", tdp: "120 W", socket: "AM5", memory: "DDR5", graphics: "Radeon Graphics（2コア）", cooler: "なし", generation: "Ryzen 7000 / Zen 4 + 3D V-Cache", manufacturerUrl: "https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-7-7800x3d.html" }),
  cpuSeed({ id: "amd-ryzen-9-7900", name: "AMD Ryzen 9 7900", price: 50800, cores: 12, threads: 24, boost: 5.4, base: 3.7, cache: "L3 64 MB + L2 12 MB", tdp: "65 W", socket: "AM5", memory: "DDR5", graphics: "Radeon Graphics（2コア）", cooler: "Wraith Prism", generation: "Ryzen 7000 / Zen 4", manufacturerUrl: "https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-9-7900.html" }),
  cpuSeed({ id: "amd-ryzen-5-9600x", name: "AMD Ryzen 5 9600X", price: 42800, cores: 6, threads: 12, boost: 5.4, base: 3.9, cache: "L3 32 MB + L2 6 MB", tdp: "65 W", socket: "AM5", memory: "DDR5", graphics: "Radeon Graphics（2コア）", cooler: "なし", generation: "Ryzen 9000 / Zen 5", manufacturerUrl: "https://www.amd.com/ja/products/processors/desktops/ryzen/9000-series/amd-ryzen-5-9600x.html" }),
  cpuSeed({ id: "amd-ryzen-7-9700x", name: "AMD Ryzen 7 9700X", price: 59800, cores: 8, threads: 16, boost: 5.5, base: 3.8, cache: "L3 32 MB + L2 8 MB", tdp: "65 W", socket: "AM5", memory: "DDR5", graphics: "Radeon Graphics（2コア）", cooler: "なし", generation: "Ryzen 9000 / Zen 5", manufacturerUrl: "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9700x.html" }),
  cpuSeed({ id: "amd-ryzen-7-9800x3d", name: "AMD Ryzen 7 9800X3D", price: 79800, cores: 8, threads: 16, boost: 5.2, base: 4.7, cache: "L3 96 MB + L2 8 MB", tdp: "120 W", socket: "AM5", memory: "DDR5", graphics: "Radeon Graphics（2コア）", cooler: "なし", generation: "Ryzen 9000 / Zen 5 + 3D V-Cache", manufacturerUrl: "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9800x3d.html" }),
  cpuSeed({ id: "amd-ryzen-7-9850x3d", name: "AMD Ryzen 7 9850X3D", price: 89800, cores: 8, threads: 16, boost: 5.6, base: 4.7, cache: "L3 96 MB + L2 8 MB", tdp: "120 W", socket: "AM5", memory: "DDR5", graphics: "Radeon Graphics（2コア）", cooler: "なし", generation: "Ryzen 9000 / Zen 5 + 3D V-Cache", manufacturerUrl: "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9850x3d.html" }),
  cpuSeed({ id: "amd-ryzen-9-9900x", name: "AMD Ryzen 9 9900X", price: 69800, cores: 12, threads: 24, boost: 5.6, base: 4.4, cache: "L3 64 MB + L2 12 MB", tdp: "120 W", socket: "AM5", memory: "DDR5", graphics: "Radeon Graphics（2コア）", cooler: "なし", generation: "Ryzen 9000 / Zen 5", manufacturerUrl: "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9900x.html" }),
  cpuSeed({ id: "amd-ryzen-9-9950x", name: "AMD Ryzen 9 9950X", price: 105800, cores: 16, threads: 32, boost: 5.7, base: 4.3, cache: "L3 64 MB + L2 16 MB", tdp: "170 W", socket: "AM5", memory: "DDR5", graphics: "Radeon Graphics（2コア）", cooler: "なし", generation: "Ryzen 9000 / Zen 5", manufacturerUrl: "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9950x.html" }),
  cpuSeed({ id: "amd-ryzen-9-9950x3d", name: "AMD Ryzen 9 9950X3D", price: 139800, cores: 16, threads: 32, boost: 5.7, base: 4.3, cache: "L3 128 MB + L2 16 MB", tdp: "170 W", socket: "AM5", memory: "DDR5", graphics: "Radeon Graphics（2コア）", cooler: "なし", generation: "Ryzen 9000 / Zen 5 + 3D V-Cache", manufacturerUrl: "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9950x3d.html" }),
  cpuSeed({ id: "intel-core-i5-14400f", name: "Intel Core i5-14400F", price: 22800, cores: "10（P6 + E4）", threads: 16, boost: 4.7, base: 2.5, cache: "L3 20 MB + L2 9.5 MB", tdp: "65 W / 最大 148 W", socket: "LGA1700", memory: "DDR4 / DDR5", graphics: "なし（Fモデル）", cooler: "Laminar RM1（BOX）", generation: "第14世代 Core / Raptor Lake Refresh", manufacturerUrl: "https://www.intel.com/content/www/us/en/products/sku/236777/intel-core-i5-processor-14400f-20m-cache-up-to-4-70-ghz/specifications.html" }),
  cpuSeed({ id: "intel-core-i5-14600k", name: "Intel Core i5-14600K", price: 39800, cores: "14（P6 + E8）", threads: 20, boost: 5.3, base: 3.5, cache: "L3 24 MB + L2 20 MB", tdp: "125 W / 最大 181 W", socket: "LGA1700", memory: "DDR4 / DDR5", graphics: "Intel UHD Graphics 770", cooler: "なし", generation: "第14世代 Core / Raptor Lake Refresh", manufacturerUrl: "https://www.intel.com/content/www/us/en/products/sku/236799/intel-core-i5-processor-14600k-24m-cache-up-to-5-30-ghz/specifications.html" }),
  cpuSeed({ id: "intel-core-i7-14700k", name: "Intel Core i7-14700K", price: 58800, cores: "20（P8 + E12）", threads: 28, boost: 5.6, base: 3.4, cache: "L3 33 MB + L2 28 MB", tdp: "125 W / 最大 253 W", socket: "LGA1700", memory: "DDR4 / DDR5", graphics: "Intel UHD Graphics 770", cooler: "なし", generation: "第14世代 Core / Raptor Lake Refresh", manufacturerUrl: "https://www.intel.com/content/www/us/en/products/sku/236783/intel-core-i7-processor-14700k-33m-cache-up-to-5-60-ghz/specifications.html" }),
  cpuSeed({ id: "intel-core-i9-14900k", name: "Intel Core i9-14900K", price: 79800, cores: "24（P8 + E16）", threads: 32, boost: 6.0, base: 3.2, cache: "L3 36 MB + L2 32 MB", tdp: "125 W / 最大 253 W", socket: "LGA1700", memory: "DDR4 / DDR5", graphics: "Intel UHD Graphics 770", cooler: "なし", generation: "第14世代 Core / Raptor Lake Refresh", manufacturerUrl: "https://www.intel.com/content/www/us/en/products/sku/236773/intel-core-i9-processor-14900k-36m-cache-up-to-6-00-ghz/specifications.html" }),
  cpuSeed({ id: "intel-core-ultra-5-225f", name: "Intel Core Ultra 5 225F", price: 32800, cores: "10（P6 + E4）", threads: 10, boost: 4.9, base: 3.3, cache: "L3 20 MB + L2 22 MB", tdp: "65 W / 最大 121 W", socket: "LGA1851", memory: "DDR5", graphics: "なし（Fモデル）", cooler: "Laminar RM2（BOX）", generation: "Core Ultra 200 / Arrow Lake", manufacturerUrl: "https://www.intel.com/content/www/us/en/products/sku/241057/intel-core-ultra-5-processor-225f-20m-cache-up-to-4-90-ghz/specifications.html" }),
  cpuSeed({ id: "intel-core-ultra-5-245k", name: "Intel Core Ultra 5 245K", price: 39800, cores: "14（P6 + E8）", threads: 14, boost: 5.2, base: 4.2, cache: "L3 24 MB + L2 26 MB", tdp: "125 W / 最大 159 W", socket: "LGA1851", memory: "DDR5", graphics: "Intel Graphics", cooler: "なし", generation: "Core Ultra 200 / Arrow Lake", manufacturerUrl: "https://www.intel.com/content/www/us/en/products/sku/241067/intel-core-ultra-5-processor-245k-24m-cache-up-to-5-20-ghz/specifications.html" }),
  cpuSeed({ id: "intel-core-ultra-5-250k-plus", name: "Intel Core Ultra 5 250K Plus", price: 44800, cores: "18（P6 + E12）", threads: 18, boost: 5.3, base: 3.5, cache: "L3 30 MB + L2 30 MB", tdp: "125 W / 最大 159 W", socket: "LGA1851", memory: "DDR5", graphics: "Intel Graphics", cooler: "なし", generation: "Core Ultra 200S Plus / Arrow Lake", manufacturerUrl: "https://www.intel.com/content/www/us/en/products/sku/245694/intel-core-ultra-5-processor-250k-plus-30m-cache-up-to-5-30-ghz/specifications.html" }),
  cpuSeed({ id: "intel-core-ultra-7-265k", name: "Intel Core Ultra 7 265K", price: 58800, cores: "20（P8 + E12）", threads: 20, boost: 5.5, base: 3.9, cache: "L3 30 MB + L2 36 MB", tdp: "125 W / 最大 250 W", socket: "LGA1851", memory: "DDR5", graphics: "Intel Graphics", cooler: "なし", generation: "Core Ultra 200 / Arrow Lake", manufacturerUrl: "https://www.intel.com/content/www/us/en/products/sku/241066/intel-core-ultra-7-processor-265k-30m-cache-up-to-5-50-ghz/specifications.html" }),
  cpuSeed({ id: "intel-core-ultra-7-270k-plus", name: "Intel Core Ultra 7 270K Plus", price: 64800, cores: "24（P8 + E16）", threads: 24, boost: 5.5, base: 3.7, cache: "L3 36 MB + L2 40 MB", tdp: "125 W / 最大 250 W", socket: "LGA1851", memory: "DDR5", graphics: "Intel Graphics", cooler: "なし", generation: "Core Ultra 200S Plus / Arrow Lake", manufacturerUrl: "https://www.intel.com/content/www/us/en/products/sku/245692/intel-core-ultra-7-processor-270k-plus-36m-cache-up-to-5-50-ghz/specifications.html" }),
  cpuSeed({ id: "intel-core-ultra-9-285k", name: "Intel Core Ultra 9 285K", price: 89800, cores: "24（P8 + E16）", threads: 24, boost: 5.7, base: 3.7, cache: "L3 36 MB + L2 40 MB", tdp: "125 W / 最大 250 W", socket: "LGA1851", memory: "DDR5", graphics: "Intel Graphics", cooler: "なし", generation: "Core Ultra 200 / Arrow Lake", manufacturerUrl: "https://www.intel.com/content/www/us/en/products/sku/241068/intel-core-ultra-9-processor-285k-36m-cache-up-to-5-70-ghz/specifications.html" }),
];

for (const cpu of seededCpuProducts) {
  if (!products.some((product) => product.id === cpu.id)) products.push(cpu);
}
const savedCatalog = storage.get("pcparts-products", null);
const catalogVersion = storage.get("pcparts-catalog-version", 0);
const fanSeedProduct = products.find((product) => product.id === "fan120rgb");
if (Array.isArray(savedCatalog)) {
  products.splice(0, products.length, ...savedCatalog);
  if (catalogVersion < 1) {
    const savedIds = new Set(products.map((product) => product.id));
    products.push(...seededCpuProducts.filter((product) => !savedIds.has(product.id)));
    storage.set("pcparts-products", products);
    storage.set("pcparts-catalog-version", 1);
  }
} else {
  storage.set("pcparts-products", products);
  storage.set("pcparts-catalog-version", 2);
}
let catalogNeedsPriceFlagSave = false;
if (Array.isArray(savedCatalog) && catalogVersion < 2 && fanSeedProduct && !products.some((product) => product.id === fanSeedProduct.id)) {
  products.push(fanSeedProduct);
  catalogNeedsPriceFlagSave = true;
}
for (const product of products) {
  if (typeof product.isDemoPrice !== "boolean") { product.isDemoPrice = true; catalogNeedsPriceFlagSave = true; }
  if (legacyCategories[product.category]) { product.category = legacyCategories[product.category]; catalogNeedsPriceFlagSave = true; }
  if (platformCategories.has(product.category)) {
    const specs = product.specs || {};
    const chipset = String(specs["チップセット"] || "");
    const socket = String(specs["ソケット"] || "");
    const detectedPlatform = /intel|lga/i.test(`${product.name} ${product.maker} ${chipset} ${socket}`) ? "Intel" : /amd|am[45]/i.test(`${product.name} ${chipset} ${socket}`) || product.maker === "AMD" ? "AMD" : "";
    if ((detectedPlatform && product.platform !== detectedPlatform) || (!platformOptions.includes(product.platform) && product.platform !== "")) { product.platform = detectedPlatform; catalogNeedsPriceFlagSave = true; }
  } else if (product.platform) { product.platform = ""; catalogNeedsPriceFlagSave = true; }
}
if (catalogNeedsPriceFlagSave) {
  storage.set("pcparts-products", products);
  storage.set("pcparts-catalog-version", 2);
} else if (Array.isArray(savedCatalog) && catalogVersion < 2) storage.set("pcparts-catalog-version", 2);

let cart = storage.get("pcparts-cart", {});
let favorites = storage.get("pcparts-favorites", []);
let currentUser = storage.get("pcparts-user", null);
let orders = storage.get("pcparts-orders", []);
if (apiConfigured) orders = [];
let serverOrdersLoaded = !apiConfigured;
let serverOrdersLoading = false;
let serverOrdersError = "";
let catalogFilter = { category: "すべて", query: "", min: "", max: "", sort: "おすすめ順" };
let catalogPage = 1;
let adminQuery = "";
let adminCategory = "すべて";
let adminPlatform = "すべて";
let adminListingStatus = "すべて";
let adminPage = 1;
let detailQuantity = 1;
let wizardStep = 0;
let wizardAnswers = { budget: "", use: "", games: "", style: "", equipment: "", conditions: "" };
let lastOrder = null;
let selectedPayment = "card";

const app = document.querySelector("#app");
const yen = (value) => `¥${Number(value).toLocaleString("ja-JP")}`;
const findProduct = (id) => products.find((product) => product.id === id);
const safeText = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

function parseBudget(value) {
  const normalized = String(value || "")
    .replace(/[０-９]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0xfee0))
    .replace(/[，,]/g, "")
    .replace(/\s/g, "");
  if (!normalized) return null;

  const compounds = [...normalized.matchAll(/(\d+(?:\.\d+)?)万\s*(\d+(?:\.\d+)?)(千)?(?:円)?/g)];
  if (compounds.length) {
    const [, man, remainder, thousand] = compounds[compounds.length - 1];
    return Math.round(Number(man) * 10000 + Number(remainder) * (thousand ? 1000 : 1));
  }

  const amounts = [...normalized.matchAll(/(\d+(?:\.\d+)?)\s*(億|万|千)(?:円)?/g)];
  if (amounts.length) {
    const [, amount, unit] = amounts[amounts.length - 1];
    return Math.round(Number(amount) * ({ 億: 100000000, 万: 10000, 千: 1000 }[unit]));
  }

  const numbers = [...normalized.matchAll(/\d+(?:\.\d+)?/g)];
  return numbers.length ? Math.round(Number(numbers[numbers.length - 1][0])) : null;
}

function monitorOwnership() {
  const answer = wizardAnswers.equipment || "";
  const hasMonitor = /(モニター|ディスプレイ|display|monitor)/i.test(answer);
  const negative = /(持っていない|持ってない|持ってません|持っていません|未所持|ありません|ないです|ない|なし|これから購入|購入したい)/;
  const positive = /(持っている|持ってる|持っています|持ってます|所持|所有|あります|ある)/;
  if (hasMonitor && negative.test(answer)) return false;
  if (hasMonitor && positive.test(answer)) return true;
  if (/^\s*持って(?:る|いる|ます|います)\s*[。.!！]?\s*$/.test(answer)) return true;
  if (/^\s*持って(?:ない|いない|ません|いません)\s*[。.!！]?\s*$/.test(answer)) return false;
  return null;
}

function shortAnswer(value, maxLength = 42) {
  const compact = String(value || "").replace(/\s+/g, " ").trim();
  return compact.length > maxLength ? `${compact.slice(0, maxLength)}…` : compact;
}

function artFor(type, label = "PCパーツ") {
  const shape = {
    gpu: `<g><path d="M54 45h270l23 14v91H64l-19-17V58z" fill="#1d2733" stroke="#5a6876" stroke-width="5"/><path d="M67 56h250v75H67z" fill="#253340"/><path d="M75 54h28v4H75zm198 77h53v12h-53z" fill="#7e8c9a"/><path d="M60 135h18v23H60zm276-5h15v25h-15z" fill="#bac4d0"/><circle cx="139" cy="94" r="33" fill="#111c29" stroke="#8596a9" stroke-width="5"/><circle cx="139" cy="94" r="5" fill="#54adff"/><circle cx="255" cy="94" r="33" fill="#111c29" stroke="#8596a9" stroke-width="5"/><circle cx="255" cy="94" r="5" fill="#54adff"/><path d="M139 66c8 8 11 17 8 27-9-4-16-11-18-21m128-6c8 8 11 17 8 27-9-4-16-11-18-21" fill="#47596b"/></g>`,
    cpu: `<g><path d="M115 42h150v150H115z" rx="15" fill="#c1c8d2" stroke="#8794a3" stroke-width="6"/><path d="M130 57h120v120H130z" fill="#202b37"/><path d="M150 76h80v82h-80z" fill="#d98f3a"/><path d="M159 84h62v65h-62z" fill="#273241"/><text x="190" y="122" fill="#f8c578" font-size="15" text-anchor="middle" font-family="Arial">RYZEN</text>${[0,1,2,3,4,5].map((i)=>`<path d="M${130+i*20} 43v-14m${130+i*20} 163v14M${115} ${60+i*22}h-14m164 ${60+i*22}h14" stroke="#9ba7b4" stroke-width="4"/>`).join("")}</g>`,
    ram: `<g><path d="M50 84h274v51H50z" rx="8" fill="#e8edf3" stroke="#a8b2bf" stroke-width="5"/><path d="M60 95h245v29H60z" fill="#2c3b4c"/><path d="M78 91h209" stroke="#9feaff" stroke-width="5"/><path d="M80 135v17m33-17v17m33-17v17m33-17v17m33-17v17m33-17v17m33-17v17" stroke="#c6a85f" stroke-width="4"/><path d="M90 108h31m20 0h31m20 0h31m20 0h31" stroke="#77889d" stroke-width="3"/></g>`,
    ssd: `<g><path d="M56 82h268v70H56z" rx="7" fill="#202b37" stroke="#758294" stroke-width="5"/><path d="M72 95h94v43H72z" fill="#2e3d4e"/><path d="M181 95h92v43h-92z" fill="#29394a"/><text x="118" y="121" fill="#c2d2e5" font-size="12" text-anchor="middle" font-family="Arial">NVMe</text><circle cx="304" cy="117" r="5" fill="#d9b35f"/><path d="M64 75v-9m250 9v-9" stroke="#8491a1" stroke-width="5"/></g>`,
    board: `<g><path d="m100 32 191 10 26 167-186 13-45-63z" fill="#e1e6ed" stroke="#aab6c4" stroke-width="5"/><path d="m139 57 61 4 3 52-60-4zm85 8 52 3 5 48-51-4zm-79 70 96 6 2 48-93-6z" fill="#344357" stroke="#8492a4" stroke-width="4"/><circle cx="122" cy="56" r="7" fill="#d3ae5c"/><circle cx="293" cy="174" r="7" fill="#d3ae5c"/><path d="M77 80h23m194 62h24M110 190h-18" stroke="#54a8ff" stroke-width="4"/></g>`,
    cooler: `<g><path d="M105 42h170v121H105z" fill="#e8edf3" stroke="#b8c1cd" stroke-width="5"/><path d="M120 52h140v101H120z" fill="#d2dbe5"/><circle cx="156" cy="101" r="35" fill="#f4f7fa" stroke="#91a0b0" stroke-width="6"/><circle cx="224" cy="101" r="35" fill="#f4f7fa" stroke="#91a0b0" stroke-width="6"/><circle cx="156" cy="101" r="5" fill="#83c5ff"/><circle cx="224" cy="101" r="5" fill="#c285ff"/><path d="M119 166c-30 17-42 17-53 6m209-6c30 17 42 17 53 6" stroke="#718196" stroke-width="7" fill="none"/></g>`,
    case: `<g><path d="M112 25h174v201H112z" rx="10" fill="#eef2f7" stroke="#9aa8b8" stroke-width="6"/><path d="M127 42h144v167H127z" fill="#dce5ef"/><path d="M137 52h124v147H137z" fill="#f9fbff" stroke="#c3cedb" stroke-width="3"/><circle cx="200" cy="87" r="25" fill="#e7e2fa" stroke="#8c79df" stroke-width="7"/><circle cx="200" cy="149" r="25" fill="#e5f2ff" stroke="#5b9dee" stroke-width="7"/><circle cx="200" cy="87" r="5" fill="#8c79df"/><circle cx="200" cy="149" r="5" fill="#5b9dee"/><path d="M115 215h172" stroke="#8494a6" stroke-width="8"/></g>`,
    psu: `<g><path d="M87 54h207v133H87z" rx="8" fill="#d9e0e8" stroke="#8997a6" stroke-width="5"/><path d="M99 66h181v109H99z" fill="#303d4c"/><circle cx="158" cy="120" r="38" fill="#172332" stroke="#77879a" stroke-width="5"/><circle cx="158" cy="120" r="6" fill="#d4dde7"/><path d="M213 91h49m-49 16h35m-35 16h49m-49 16h35" stroke="#9caaba" stroke-width="4"/><path d="M110 186v12m150-12v12" stroke="#8b99a9" stroke-width="5"/></g>`,
    monitor: `<g><path d="M73 38h234v143H73z" rx="10" fill="#202c3c" stroke="#8795a6" stroke-width="6"/><path d="M83 48h214v123H83z" fill="#b9ddff"/><path d="m84 153 56-68 49 51 37-40 71 64v12H84z" fill="#79aee2"/><path d="M179 181h23v35h-23zm-48 39h119v10H131z" fill="#8b99a9"/></g>`,
  }[type] || `<g><rect x="85" y="55" width="210" height="120" rx="8" fill="#253447" stroke="#8797a8" stroke-width="5"/><path d="M110 145 170 85l45 37 35-27" fill="none" stroke="#63aaff" stroke-width="7"/></g>`;
  return `<svg class="product-art" viewBox="0 0 380 240" role="img" aria-label="${safeText(label)}"><title>${safeText(label)}</title><ellipse cx="190" cy="205" rx="124" ry="14" fill="#ced7e2" opacity=".55"/>${shape}</svg>`;
}

function routeInfo() {
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  return { page: parts[0] || "home", id: parts[1] || "" };
}

function go(page, id = "") {
  const hash = `#/${page}${id ? `/${encodeURIComponent(id)}` : ""}`;
  if (location.hash === hash) renderRoute(); else location.hash = hash;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message) {
  const region = document.querySelector("#toast-region");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  region.append(toast);
  window.setTimeout(() => toast.remove(), 2800);
}

function cartEntries() {
  return Object.entries(cart).map(([id, quantity]) => ({ product: findProduct(id), quantity: Number(quantity) || 0 })).filter((entry) => entry.product && entry.quantity > 0);
}

function cartQuantity() { return cartEntries().reduce((sum, entry) => sum + entry.quantity, 0); }
function cartSubtotal() { return cartEntries().reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0); }
function persistCart() { storage.set("pcparts-cart", cart); syncHeader(); }
function syncHeader() { document.querySelector("#cart-count").textContent = cartQuantity(); }

function addToCart(id, quantity = 1) {
  const product = findProduct(id);
  if (!product) return;
  if (Number(product.stock) < (Number(cart[id]) || 0) + quantity) { showToast("管理画面で在庫を確認してからカートに追加してください"); return; }
  cart[id] = (Number(cart[id]) || 0) + quantity;
  persistCart();
  showToast(`${product.shortName} をカートに追加しました`);
}

function toggleFavorite(id) {
  favorites = favorites.includes(id) ? favorites.filter((favorite) => favorite !== id) : [...favorites, id];
  storage.set("pcparts-favorites", favorites);
  const route = routeInfo();
  if (route.page === "favorites") renderFavorites(); else if (route.page === "detail") renderDetail(route.id); else if (route.page === "ai-result") renderAiResult(); else renderHome();
}

function productCard(product, compact = false) {
  const favored = favorites.includes(product.id);
  const rating = product.reviews ? `★★★★★ <span>${safeText(product.rating)} (${safeText(product.reviews)})</span>` : `<span class="rating-empty">レビュー未登録</span>`;
  const priceBadge = Number(product.stock) < 1 ? `<span class="badge badge--warning">在庫未確認</span>` : product.isDemoPrice ? `<span class="badge badge--gray">参考価格</span>` : `<span class="badge">在庫あり</span>`;
  return `<article class="product-card ${compact ? "product-card--compact" : ""}">
    <button class="favorite-toggle ${favored ? "is-active" : ""}" data-action="favorite" data-id="${safeText(product.id)}" aria-label="お気に入り${favored ? "解除" : "追加"}">${favored ? "♥" : "♡"}</button>
    <div class="product-card__image" data-go="detail" data-id="${safeText(product.id)}">${productImage(product)}</div>
    <div class="product-card__body"><div class="product-meta"><span class="product-category">${safeText(product.category)} / ${safeText(product.maker)}</span>${priceBadge}</div>
      <h3><a href="#/detail/${encodeURIComponent(product.id)}">${safeText(product.name)}</a></h3><div class="product-rating">${rating}</div>
      <div class="product-card__bottom"><div class="price">${yen(product.price)}<small>${product.isDemoPrice ? "参考" : "税込"}</small></div>${Number(product.stock) > 0 ? `<button class="button" data-action="add-cart" data-id="${safeText(product.id)}">カートに追加</button>` : `<button class="button" disabled>在庫確認中</button>`}</div>
    </div>
  </article>`;
}

function getFilteredProducts() {
  let results = [...products];
  if (catalogFilter.category !== "すべて") results = results.filter((product) => product.category === catalogFilter.category);
  if (catalogFilter.query) {
    const q = catalogFilter.query.toLowerCase();
    results = results.filter((product) => `${product.name} ${product.maker} ${product.category}`.toLowerCase().includes(q));
  }
  if (catalogFilter.min) results = results.filter((product) => product.price >= Number(catalogFilter.min));
  if (catalogFilter.max) results = results.filter((product) => product.price <= Number(catalogFilter.max));
  if (catalogFilter.sort === "価格が安い順") results.sort((a, b) => a.price - b.price);
  if (catalogFilter.sort === "価格が高い順") results.sort((a, b) => b.price - a.price);
  if (catalogFilter.sort === "評価が高い順") results.sort((a, b) => b.rating - a.rating);
  return results;
}

function categoryCards() {
  return categoryItems.filter(([name]) => name !== "その他").map(([name, icon]) => `<button class="category-card ${catalogFilter.category === name ? "is-active" : ""}" data-category="${name}"><span class="category-card__icon">${icon}</span><span>${name}</span></button>`).join("");
}

function renderHome() {
  const filtered = getFilteredProducts();
  const pageSize = 24;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  catalogPage = Math.min(catalogPage, pageCount);
  const mainProducts = filtered.slice((catalogPage - 1) * pageSize, catalogPage * pageSize);
  app.innerHTML = `<section class="hero">
      <div class="hero__art"><div class="hero-glow"></div><div class="hero-machine"><div class="hero-machine__glass"><div class="hero-machine__fan-stack"><i class="fan"></i><i class="fan"></i><i class="fan"></i></div><div class="hero-machine__gpu"></div></div></div></div>
      <div class="hero__copy"><span class="hero__tag">PC PARTS, YOUR WAY</span><h1>自分だけの理想のPCを、<em>ここから。</em></h1><p>はじめてのパーツ選びも、AIと一緒なら迷わない。<br />予算と用途に合わせた構成を見つけよう。</p><div style="display:flex;gap:9px;flex-wrap:wrap"><button class="button" data-go="ai">✳ AIとPC構成を相談</button><button class="button button--outline" data-scroll="categories">商品を探す →</button></div></div>
      <div class="hero__index"><strong>01</strong> / BUILD YOUR PC</div>
    </section>
    <div class="service-strip"><div class="service-item"><span class="service-item__icon">♧</span><div><strong>パーツを一つずつ</strong><small>豊富なパーツを比較して選ぶ</small></div></div><div class="service-item"><span class="service-item__icon">✳</span><div><strong>自由入力で構成相談</strong><small>選択肢にない条件も入力できる</small></div></div><div class="service-item"><span class="service-item__icon">▣</span><div><strong>相性もサポート</strong><small>構成の組み合わせをチェック</small></div></div><div class="service-item"><span class="service-item__icon">↗</span><div><strong>安心のサポート</strong><small>購入前の疑問も気軽に相談</small></div></div></div>
    <div class="home-grid"><div>
      <section id="categories"><div class="section-heading"><div><span class="eyebrow">FIND YOUR PARTS</span><h2>カテゴリから探す</h2></div><button class="text-link" data-category="すべて">すべて見る →</button></div><div class="category-grid">${categoryCards()}</div></section>
      <section><div class="section-heading"><div><span class="eyebrow">CURATED FOR YOU</span><h2>${catalogFilter.category === "すべて" ? "おすすめパーツ" : catalogFilter.category}</h2><p>人気のPCパーツをピックアップしました。</p></div><button class="text-link" data-action="clear-filter">商品一覧を見る →</button></div>
        <div class="filter-panel panel"><div class="filter-panel__top"><strong>条件を指定して探す</strong><button class="text-link" data-action="clear-filter">クリア</button></div><form id="filter-form" class="filter-controls"><div class="filter-price"><input class="field" name="min" type="number" min="0" placeholder="下限なし" value="${safeText(catalogFilter.min)}" /><span>〜</span><input class="field" name="max" type="number" min="0" placeholder="上限なし" value="${safeText(catalogFilter.max)}" /></div><select class="select" name="category"><option ${catalogFilter.category === "すべて" ? "selected" : ""}>すべて</option>${categoryItems.map(([name]) => `<option ${catalogFilter.category === name ? "selected" : ""}>${name}</option>`).join("")}</select><input class="field" name="query" placeholder="キーワードで探す" value="${safeText(catalogFilter.query)}" /><button class="button" type="submit">絞り込む</button></form></div>
        <div class="product-toolbar"><div class="result-count">全 <strong>${filtered.length}</strong> 件中 ${filtered.length ? (catalogPage - 1) * pageSize + 1 : 0}〜${Math.min(catalogPage * pageSize, filtered.length)} 件</div><div class="toolbar-actions"><label for="sort-select">並び替え</label><select id="sort-select" class="select"><option>おすすめ順</option><option ${catalogFilter.sort === "価格が安い順" ? "selected" : ""}>価格が安い順</option><option ${catalogFilter.sort === "価格が高い順" ? "selected" : ""}>価格が高い順</option><option ${catalogFilter.sort === "評価が高い順" ? "selected" : ""}>評価が高い順</option></select><div class="view-toggle"><button class="is-active" aria-label="グリッド表示">▦</button><button aria-label="リスト表示">☰</button></div></div></div>
        <div class="product-grid">${mainProducts.length ? mainProducts.map((product) => productCard(product)).join("") : `<div class="empty-state"><div class="empty-state__icon">⌕</div><h2>商品が見つかりません</h2><p>検索条件を変えて、もう一度お試しください。</p><button class="button button--outline" data-action="clear-filter">条件をリセット</button></div>`}</div>
        ${pageCount > 1 ? `<nav class="catalog-pagination" aria-label="商品一覧のページ移動"><button class="button button--outline" data-action="catalog-page" data-page="${catalogPage - 1}" ${catalogPage === 1 ? "disabled" : ""}>← 前へ</button><span>${catalogPage} / ${pageCount} ページ</span><button class="button button--outline" data-action="catalog-page" data-page="${catalogPage + 1}" ${catalogPage === pageCount ? "disabled" : ""}>次へ →</button></nav>` : ""}
      </section>
    </div><aside class="home-sidebar"><section class="side-card"><div class="side-card__head"><strong>人気ランキング</strong><span class="eyebrow">TOP 3</span></div><div class="side-card__body">${[products[0], products[1], products[5]].map((product, index) => `<div class="ranking-item"><span class="ranking-item__number">0${index + 1}</span>${artFor(product.type, product.shortName)}<div class="ranking-item__copy"><strong>${product.shortName}</strong><span>${yen(product.price)}</span></div></div>`).join("")}</div></section><section class="promo-tile"><span class="eyebrow">BUILD WITH AI</span><strong>パーツ選びを、もっと楽しく。</strong><span>希望や条件を自由入力して相談</span><button class="text-link" style="padding:0;margin-top:16px;color:#fff" data-go="ai">AI相談をはじめる →</button></section></aside></div>`;
  syncHeader();
}

function breadcrumb(label, parent = "商品一覧") {
  return `<nav class="breadcrumb"><a href="#/home">ホーム</a><span>›</span>${parent ? `<a href="#/home">${parent}</a><span>›</span>` : ""}<span>${label}</span></nav>`;
}

function renderDetail(id) {
  const product = findProduct(id) || products[0];
  if (!product) { app.innerHTML = `<div class="panel empty-state"><h2>商品がありません</h2><button class="button" data-go="home">商品一覧へ</button></div>`; return; }
  detailQuantity = 1;
  const rating = product.reviews ? `★★★★★ <span>${safeText(product.rating)}（${safeText(product.reviews)}件のレビュー）</span>` : `<span class="rating-empty">レビュー未登録</span>`;
  const specs = Object.entries(product.specs || {}).map(([key, value]) => `<tr><th>${safeText(key)}</th><td>${safeText(value)}</td></tr>`).join("");
  const sourceLink = safeHttpUrl(product.productUrl);
  const stock = Number(product.stock) || 0;
  const purchaseButtons = stock > 0
    ? `<div class="quantity-row"><span style="font-size:11px">数量（在庫 ${stock} 点）</span><div class="quantity-stepper"><button data-action="detail-quantity" data-delta="-1">−</button><span id="detail-quantity">1</span><button data-action="detail-quantity" data-delta="1">＋</button></div></div><button class="button" data-action="add-detail" data-id="${safeText(product.id)}">カートに追加</button><button class="button button--dark" data-action="buy-now" data-id="${safeText(product.id)}">今すぐ購入</button>`
    : `<p class="stock-review-note">外部APIから取得した商品です。自社の在庫と販売価格を管理画面で確認するとカートに追加できます。</p><button class="button" disabled>在庫確認中</button>`;
  app.innerHTML = `${breadcrumb(safeText(product.name))}<div class="product-layout"><div class="product-gallery panel"><div class="product-gallery__main">${productImage(product, product.name)}</div></div><section class="product-info"><span class="badge badge--blue">${safeText(product.category)}</span><h1>${safeText(product.name)}</h1><div class="product-info__reviews">${rating}</div><div class="product-info__price"><strong class="price">${yen(product.price)}</strong><span class="tax-note">${product.isDemoPrice ? "API取得時点の参考価格" : "税込"}・自社在庫 ${stock} 点</span></div><p style="color:#6f7e92;font-size:12px;line-height:1.9">${safeText(product.description)}</p>${product.sourceName ? `<p class="source-caption">情報取得元：${safeText(product.sourceName)}</p>` : ""}${sourceLink ? `<a class="source-product-link" href="${sourceLink}" target="_blank" rel="noopener noreferrer">販売元の商品ページを確認 ↗</a>` : ""}<table class="spec-table"><tbody>${specs}</tbody></table><div class="product-info__actions"><button class="button button--outline" data-action="favorite" data-id="${safeText(product.id)}">${favorites.includes(product.id) ? "♥ お気に入り済み" : "♡ お気に入りに追加"}</button>${purchaseButtons}</div></section></div><section class="product-description"><h2>商品情報</h2><p>${safeText(product.description)}<br />外部API情報は取得時点の参考情報です。実際の販売価格・在庫と一致するとは限りません。</p></section>`;
  syncHeader();
}

function renderCart() {
  const entries = cartEntries();
  const subtotal = cartSubtotal();
  const shipping = subtotal === 0 || subtotal >= 11000 ? 0 : 660;
  app.innerHTML = `${breadcrumb("ショッピングカート", "")}<div class="page-heading"><div><span class="eyebrow">YOUR CART</span><h1>ショッピングカート</h1><p>カートに入れた商品を確認できます。</p></div><button class="text-link" data-go="home">← 買い物を続ける</button></div><div class="stepper"><div class="stepper__item is-active"><span class="stepper__number">1</span><span>カート</span></div><div class="stepper__item"><span class="stepper__number">2</span><span>確認</span></div><div class="stepper__item"><span class="stepper__number">3</span><span>完了</span></div></div>${entries.length ? `<div class="cart-layout"><section class="panel cart-list"><div class="panel-title" style="margin:0;padding:15px 0"><span>カートの商品</span><span class="badge badge--gray">${cartQuantity()} 点</span></div>${entries.map(({ product, quantity }) => `<article class="cart-row"><div class="cart-row__image">${artFor(product.type, product.shortName)}</div><div class="cart-row__info"><span class="product-category">${product.category}</span><strong><a href="#/detail/${product.id}">${product.name}</a></strong><span class="price">${yen(product.price)}</span></div><div class="cart-row__quantity"><div class="quantity-stepper"><button data-action="change-cart" data-id="${product.id}" data-delta="-1">−</button><span>${quantity}</span><button data-action="change-cart" data-id="${product.id}" data-delta="1">＋</button></div></div><button class="delete-button" data-action="remove-cart" data-id="${product.id}" aria-label="削除">×</button></article>`).join("")}</section><aside class="panel order-summary"><h2>ご注文金額</h2><div class="summary-line"><span>商品小計（${cartQuantity()}点）</span><strong>${yen(subtotal)}</strong></div><div class="summary-line"><span>送料</span><strong>${shipping ? yen(shipping) : "無料"}</strong></div><div class="summary-total"><span>合計（税込）</span><strong>${yen(subtotal + shipping)}</strong></div><button class="button button--wide" data-action="checkout">購入手続きに進む →</button><p class="delivery-banner">${subtotal < 11000 ? `あと ${yen(11000 - subtotal)} で送料無料です` : "送料無料対象のお買い物です"}</p><p class="summary-note">※ デモ画面のため、実際のお支払いは発生しません。</p></aside></div>` : `<div class="panel empty-state"><div class="empty-state__icon">▱</div><h2>カートは空です</h2><p>気になるパーツをカートに追加してみましょう。</p><button class="button" data-go="home">商品を探す</button></div>`}`;
  if (!entries.length && apiConfigured && serverCatalogLoaded && !products.length) {
    const heading = document.querySelector(".empty-state h2");
    const note = document.querySelector(".empty-state p");
    if (heading) heading.textContent = "現在公開中の商品はありません";
    if (note) note.textContent = "商品が公開された後にカートへ追加できます。";
  }
  syncHeader();
}

function renderStep(active) {
  const labels = ["カート", "確認", "完了"];
  return `<div class="stepper">${labels.map((label, index) => `<div class="stepper__item ${index === active ? "is-active" : index < active ? "is-done" : ""}"><span class="stepper__number">${index < active ? "✓" : index + 1}</span><span>${label}</span></div>`).join("")}</div>`;
}

function renderCheckout() {
  const entries = cartEntries();
  const subtotal = cartSubtotal();
  const shipping = subtotal >= 11000 ? 0 : 660;
  if (!entries.length) { go("cart"); return; }
  const paymentChoices = [
    ["card", "▰", "クレジット / デビットカード", "Visa・Mastercard・JCB（デモ）"],
    ["paypay", "P", "PayPay", "QR・電子マネー（デモ）"],
    ["rakutenpay", "R", "楽天ペイ", "QR・オンライン決済（デモ）"],
    ["transport", "Suica", "交通系電子マネー", "Suica・PASMO（デモ）"],
    ["konbini", "▦", "コンビニ払い", "注文後に払込番号を表示（デモ）"],
  ];
  const paymentDetails = selectedPayment === "card"
    ? `<div class="payment-detail"><p class="demo-payment-warning"><strong>決済デモです。</strong>実際のカード情報は入力しないでください。下記のテスト値だけ利用でき、入力値は保存・送信されません。</p><div class="form-grid checkout-payment-form"><label class="form-field form-field--full"><span>テスト用カード番号</span><input class="input" id="demo-card-number" inputmode="numeric" autocomplete="off" maxlength="19" placeholder="4242 4242 4242 4242" aria-describedby="demo-card-hint" /><small class="form-hint" id="demo-card-hint">デモ値：4242 4242 4242 4242</small></label><label class="form-field"><span>有効期限</span><input class="input" id="demo-card-expiry" inputmode="numeric" autocomplete="off" maxlength="5" placeholder="12/30" /></label><label class="form-field"><span>セキュリティコード</span><input class="input" id="demo-card-cvc" inputmode="numeric" autocomplete="off" maxlength="3" placeholder="123" /></label><p class="form-hint form-field--full">有効期限は 12/30、コードは 123 を入力してください。</p></div></div>`
    : selectedPayment === "konbini"
      ? `<div class="payment-detail"><label class="form-field"><span>お支払い先のコンビニ</span><select class="select" id="konbini-store"><option>セブン‐イレブン</option><option>ファミリーマート</option><option>ローソン</option><option>ミニストップ</option></select></label><p class="payment-detail-note">注文確定後、デモ用の払込番号と期限を表示します。店頭での支払いはできません。</p></div>`
      : `<div class="payment-detail"><p class="payment-detail-note"><strong>${paymentChoices.find(([value]) => value === selectedPayment)?.[2] || "電子マネー"}のデモ決済</strong><br />外部アプリやアカウントには接続せず、この画面上で決済完了をシミュレーションします。</p></div>`;
  app.innerHTML = `${breadcrumb("購入確認", "ショッピングカート")}<div class="page-heading"><div><span class="eyebrow">CHECKOUT · PAYMENT DEMO</span><h1>ご注文内容の確認</h1><p>お届け先とお支払い方法を選択してください。</p></div></div>${renderStep(1)}<div class="checkout-grid"><div><section class="panel checkout-panel"><h2 class="panel-title"><span><span class="panel-title__number">1</span>お届け先</span><button class="text-link" data-go="profile">変更する</button></h2><div class="address-choice"><input type="radio" checked aria-label="この住所へ配送" /><div><strong>${safeText(currentUser?.name || "テストユーザー")}</strong>${safeText(currentUser?.address || "〒810-0001 福岡県福岡市中央区天神1-2-3")}</div></div></section><section class="panel checkout-panel"><h2 class="panel-title"><span><span class="panel-title__number">2</span>お支払い方法</span><span class="badge badge--blue">すべてデモ</span></h2><div class="payment-method-grid">${paymentChoices.map(([value, icon, label, description]) => `<label class="payment-method ${selectedPayment === value ? "is-selected" : ""}"><input type="radio" name="payment" value="${value}" ${selectedPayment === value ? "checked" : ""} /><span class="payment-method__icon" aria-hidden="true">${icon}</span><span class="payment-method__copy"><strong>${label}</strong><small>${description}</small></span></label>`).join("")}</div>${paymentDetails}</section><section class="panel checkout-panel"><h2 class="panel-title"><span><span class="panel-title__number">3</span>注文商品（${cartQuantity()}点）</span></h2>${entries.map(({ product, quantity }) => `<div class="order-preview-item"><span>${safeText(product.name)} × ${quantity}</span><strong>${yen(product.price * quantity)}</strong></div>`).join("")}</section></div><aside class="panel order-summary"><h2>ご注文金額</h2><div class="summary-line"><span>商品小計</span><strong>${yen(subtotal)}</strong></div><div class="summary-line"><span>送料</span><strong>${shipping ? yen(shipping) : "無料"}</strong></div><div class="summary-total"><span>合計（税込）</span><strong>${yen(subtotal + shipping)}</strong></div><button class="button button--wide" data-action="place-order">デモ注文を確定する</button><p class="summary-note">実際の決済・請求・店舗での支払いは発生しません。</p></aside></div>`;
  if (apiConfigured) {
    const intro = document.querySelector(".page-heading p");
    if (intro) intro.textContent = "支払方法を選んでデモ注文を作成します。住所・カード情報はサーバーに送信しません。";
    const addressHeading = document.querySelector(".checkout-panel .panel-title span");
    if (addressHeading) addressHeading.lastChild.textContent = "配送先（デモ）";
    document.querySelector('.address-choice input[type="radio"]')?.remove();
    const address = document.querySelector(".address-choice > div");
    if (address) address.innerHTML = "<strong>デモ注文</strong>この注文で住所は送信されず、商品の発送も行われません。";
    document.querySelector(".checkout-panel .text-link")?.remove();
  }
}

function renderSuccess() {
  if (!lastOrder) { go("home"); return; }
  const isKonbini = lastOrder.paymentMethod === "konbini";
  const paymentSummary = isKonbini
    ? `<div class="payment-result"><div class="summary-line"><span>お支払い先</span><strong>${safeText(lastOrder.paymentStore)}</strong></div><div class="summary-line"><span>デモ払込番号</span><strong class="payment-code">${safeText(lastOrder.paymentCode)}</strong></div><p>お支払い期限（デモ）：${safeText(lastOrder.paymentDeadline)}<br />この番号は画面確認用です。実際のお支払いには使えません。</p></div>`
    : `<div class="payment-result"><div class="summary-line"><span>お支払い方法</span><strong>${safeText(lastOrder.paymentLabel)}</strong></div><p>デモ決済が完了しました。請求や外部サービスとの通信はありません。</p></div>`;
  app.innerHTML = `${breadcrumb("ご注文完了", "")}<div style="padding:28px 0">${renderStep(2)}<section class="panel success-card"><div class="success-mark">✓</div><span class="eyebrow">DEMO ORDER</span><h1>ご注文を受け付けました</h1><p>これは画面確認用のデモ注文です。実際の商品発送や決済は行われません。</p><div class="order-number"><span>注文番号</span><strong>${safeText(lastOrder.number)}</strong></div>${paymentSummary}<div class="success-actions"><button class="button button--wide" data-go="orders">購入履歴を見る</button><button class="button button--outline button--wide" data-go="home">トップページへ戻る</button></div></section></div>`;
}

function formField(label, name, placeholder = "", type = "text", value = "", hint = "") {
  return `<label class="form-field"><span>${label}</span><input class="input" name="${name}" type="${type}" placeholder="${placeholder}" value="${safeText(value)}" ${type === "email" ? "autocomplete=email" : ""} />${hint ? `<small class="form-hint">${hint}</small>` : ""}</label>`;
}

function renderAuth(mode = "login") {
  const admin = mode === "admin-login";
  const register = mode === "register";
  const heading = admin ? "管理者ログイン" : register ? "会員登録" : "おかえりなさい";
  app.innerHTML = `${breadcrumb(heading, "")}<section class="auth-layout"><aside class="auth-aside"><div class="auth-aside__content"><a class="brand brand--footer" href="#/home"><span class="brand__mark"><svg viewBox="0 0 42 42"><path d="M21 2 39 12v18L21 40 3 30V12L21 2Z"/><path d="M3 12 21 22l18-10M21 22v18"/></svg></span><span class="brand__wordmark">PC PARTS <span>SHOP</span><small>BUILD YOUR NEXT PC</small></span></a><h1>${register ? "理想のPCづくりを、ここから。" : "パーツ選びを、もっと楽しく。"}</h1><p>${register ? "アカウントを作成して、お気に入りや購入履歴をまとめて管理しましょう。" : "アカウントにログインして、お買い物を続けましょう。"}</p></div><div class="auth-aside__bottom">YOUR NEXT BUILD STARTS HERE</div></aside><div class="auth-form-wrap"><span class="eyebrow">${admin ? "SHOP ADMIN" : register ? "CREATE ACCOUNT" : "MY ACCOUNT"}</span><h2>${heading}</h2><p>${admin ? (apiConfigured ? "登録済みの管理者アカウントでログインしてください。" : "管理者画面のデモにログインしてください。") : register ? "必要な情報を入力してください。" : "アカウント情報を入力してください。"}</p><form id="auth-form" data-mode="${mode}">${register ? formField("ユーザー名", "name", "例）山田 太郎") : ""}${formField("メールアドレス", "email", "example@sample.com", "email")}${formField("パスワード", "password", "8文字以上", "password", "", admin && apiConfigured ? "管理者パスワードを入力してください。" : "デモ用に任意の値を入力してください。")}${register ? formField("パスワード（確認）", "passwordConfirm", "もう一度入力", "password") : ""}${register ? `<label style="display:flex;gap:7px;align-items:center;margin:2px 0 15px;color:#6b7b91;font-size:10px"><input type="checkbox" name="terms" required />利用規約に同意する</label>` : ""}<button class="button button--wide" type="submit">${admin ? "ログイン" : register ? "アカウントを作成" : "ログイン"}</button></form>${!register && !admin ? `<div class="form-footer"><a href="#/register">新規会員登録</a><a href="#/register">パスワードをお忘れの方</a></div>` : ""}<div class="form-separator">または</div><button class="button button--outline button--wide" data-go="${register ? "auth" : "register"}">${register ? "ログインはこちら" : "新規会員登録はこちら"}</button>${admin ? `<button class="text-link" style="justify-content:center;margin-top:13px" data-go="home">ショップへ戻る</button>` : ""}</div></section>`;
  if (admin && apiConfigured) {
    document.querySelector(".form-separator")?.remove();
    document.querySelector('.auth-form-wrap > button[data-go="register"]')?.remove();
  }
}

function getSampleOrders() {
  if (apiConfigured) return orders;
  return orders.length ? orders : [
    { number: "PC202609250001", date: "2026年9月25日", total: 72580, status: "発送準備中", items: [{ id: "gpu4060", quantity: 1 }, { id: "cpu7700", quantity: 1 }, { id: "ram32", quantity: 1 }] },
    { number: "PC202608120003", date: "2026年8月12日", total: 44800, status: "配送済み", items: [{ id: "cpu7700", quantity: 1 }] },
  ];
}

function orderCard(order) {
  const statusClass = order.status === "コンビニ支払い待ち（デモ）" ? "badge--warning" : order.status === "発送準備中" || order.status === "決済完了（デモ）" ? "badge--blue" : "";
  return `<article class="order-card"><div class="order-card__top"><div><strong>${safeText(order.date)}　注文番号：${safeText(order.number)}</strong><small>${order.paymentLabel ? `お支払い：${safeText(order.paymentLabel)}` : "ご注文内容を確認できます。"}</small></div><span class="badge ${statusClass}">${safeText(order.status)}</span></div><div class="order-card__products">${order.items.map((item) => { const product = findProduct(item.id); return product ? artFor(product.type, product.shortName) : `<span class="order-item-name">${safeText(item.name || item.id)}</span>`; }).join("")}</div><div class="order-card__bottom"><span>合計金額 <strong>${yen(order.total)}</strong></span><button class="text-link" data-action="order-detail" data-id="${safeText(order.number)}">詳細を見る →</button></div></article>`;
}

function accountSidebar(active = "account") {
  const options = [["account", "♙", "マイページ"], ["orders", "▣", "購入履歴"], ["favorites", "♡", "お気に入り"], ["profile", "⚙", "会員情報編集"], ["logout", "↪", "ログアウト"]];
  return `<aside class="panel account-sidebar"><div class="account-profile"><span class="avatar">♙</span><div><strong>${safeText(currentUser?.name || "テストユーザー")}</strong><small>${safeText(currentUser?.email || "user@example.com")}</small></div></div><nav class="account-menu">${options.map(([route, icon, label]) => `<button class="${route === active ? "is-active" : ""}" data-action="account-menu" data-id="${route}"><span class="account-menu__icon">${icon}</span>${label}</button>`).join("")}</nav></aside>`;
}

function renderAccount() {
  const recent = getSampleOrders().slice(0, 2);
  app.innerHTML = `${breadcrumb("マイページ", "")}<div class="page-heading"><div><span class="eyebrow">MY ACCOUNT</span><h1>マイページ</h1><p>会員情報やご注文状況を確認できます。</p></div></div><div class="account-layout">${accountSidebar()}<section class="panel account-content"><div class="account-hero"><span class="avatar">♙</span><div><strong>${safeText(currentUser?.name || "テストユーザー")} さん</strong><small>${safeText(currentUser?.email || "user@example.com")}</small></div></div><div class="account-shortcuts"><button class="shortcut-card" data-go="orders"><span class="shortcut-card__icon">▣</span><span><strong>購入履歴</strong><small>ご注文内容を確認</small></span></button><button class="shortcut-card" data-go="favorites"><span class="shortcut-card__icon">♡</span><span><strong>お気に入り</strong><small>${favorites.length} 点を保存中</small></span></button><button class="shortcut-card" data-go="profile"><span class="shortcut-card__icon">⚙</span><span><strong>会員情報編集</strong><small>住所・連絡先を変更</small></span></button></div><div class="account-section-head"><h3>最近の購入履歴</h3><button class="text-link" data-go="orders">すべて見る →</button></div>${recent.map(orderCard).join("")}</section></div>`;
}

function renderOrders() {
  app.innerHTML = `${breadcrumb("購入履歴", "マイページ")}<div class="page-heading"><div><span class="eyebrow">ORDER HISTORY</span><h1>購入履歴</h1><p>${apiConfigured ? "このブラウザで作成したデモ注文を確認できます。" : "過去のご注文内容を確認できます。"}</p></div></div><div class="account-layout">${accountSidebar("orders")}<section class="panel account-content"><h2>注文一覧</h2>${apiConfigured && !serverOrdersLoaded ? "<p>注文履歴を読み込み中です。</p>" : serverOrdersError ? `<p>${safeText(serverOrdersError)} <button class="text-link" data-action="orders-refresh">再読み込み</button></p>` : getSampleOrders().length ? getSampleOrders().map(orderCard).join("") : "<p>デモ注文はまだありません。</p>"}</section></div>`;
}

function renderProfile() {
  const user = currentUser || { name: "テストユーザー", email: "user@example.com", address: "〒810-0001 福岡県福岡市中央区天神1-2-3" };
  app.innerHTML = `${breadcrumb("会員情報編集", "マイページ")}<div class="page-heading"><div><span class="eyebrow">ACCOUNT SETTINGS</span><h1>会員情報編集</h1></div></div><div class="account-layout">${accountSidebar("profile")}<section class="panel account-content"><h2>会員情報</h2><form id="profile-form" class="form-grid">${formField("ユーザー名", "name", "", "text", user.name)}${formField("メールアドレス", "email", "", "email", user.email)}${formField("パスワード（変更する場合のみ）", "password", "変更しない場合は空欄", "password")}<label class="form-field form-field--full"><span>住所</span><textarea name="address">${safeText(user.address || "")}</textarea></label><div class="form-field form-field--full"><button class="button" type="submit">変更を保存する</button></div></form></section></div>`;
}

function renderFavorites() {
  const selected = favorites.map(findProduct).filter(Boolean);
  app.innerHTML = `${breadcrumb("お気に入り", "")}<div class="page-heading"><div><span class="eyebrow">SAVED PARTS</span><h1>お気に入り</h1><p>気になるパーツをまとめて比較できます。</p></div><button class="text-link" data-go="home">商品を探す →</button></div>${selected.length ? `<div class="favorites-grid">${selected.map((product) => productCard(product, true)).join("")}</div>` : `<div class="panel empty-state"><div class="empty-state__icon">♡</div><h2>お気に入りはまだありません</h2><p>商品ページのハートを押すと、ここに保存されます。</p><button class="button" data-go="home">商品を探す</button></div>`}`;
}

function adminFilteredProducts() {
  const source = apiConfigured ? adminProducts : products;
  const query = adminQuery.trim().toLowerCase();
  return source.filter((product) =>
    (adminCategory === "すべて" || product.category === adminCategory) &&
    (adminPlatform === "すべて" || product.platform === adminPlatform) &&
    (adminListingStatus === "すべて" || (adminListingStatus === "公開中") === (product.isActive !== false)) &&
    (!query || `${product.name} ${product.maker} ${product.platform || ""} ${product.category}`.toLowerCase().includes(query))
  );
}

function renderAdminContent() {
  if (apiConfigured && !adminStatusChecked) {
    app.innerHTML = `<div class="panel empty-state"><h2>管理者セッションを確認中</h2><p>しばらくお待ちください。</p></div>`;
    if (!adminStatusChecking) {
      adminStatusChecking = true;
      apiRequest("admin/status.php").then((result) => {
        adminStatusChecked = true; adminStatusChecking = false; adminAuthenticated = Boolean(result.authenticated);
        if (adminAuthenticated) renderAdmin(); else go("admin-login");
      }).catch(() => { adminStatusChecked = true; adminStatusChecking = false; adminAuthenticated = false; go("admin-login"); });
    }
    return;
  }
  if (apiConfigured && !adminAuthenticated) { go("admin-login"); return; }
  if (apiConfigured && !adminCatalogLoaded) {
    if (!adminCatalogLoading && !adminCatalogError) refreshAdminCatalog();
    app.innerHTML = adminCatalogError
      ? `<div class="panel empty-state"><h2>管理商品を読み込めませんでした</h2><p>${safeText(adminCatalogError)}</p><button class="button" data-action="admin-refresh">再読み込み</button></div>`
      : `<div class="panel empty-state"><h2>管理商品を読み込み中</h2><p>下書きと公開中の商品を確認しています。</p></div>`;
    return;
  }
  const allShown = adminFilteredProducts();
  const pageSize = 50; const pageCount = Math.max(1, Math.ceil(allShown.length / pageSize)); adminPage = Math.min(adminPage, pageCount);
  const shown = allShown.slice((adminPage - 1) * pageSize, adminPage * pageSize);
  app.innerHTML = `${breadcrumb("商品管理", "管理者ページ")}<div class="page-heading"><div><span class="eyebrow">SHOP MANAGEMENT</span><h1>商品管理</h1><p>登録した商品は商品一覧とカートに表示されます。</p></div></div><div class="admin-toolbar"><div class="admin-toolbar__copy"><strong>登録商品一覧</strong><small>${allShown.length} 件を表示（全 ${apiConfigured ? adminProducts.length : products.length} 件） / ${apiConfigured ? "MySQLカタログに保存" : "このブラウザに保存"}</small></div><div class="admin-toolbar-actions"><button class="button" data-action="admin-add">＋ 商品を登録</button><button class="button button--outline" data-action="admin-logout">ログアウト</button></div></div><form id="admin-filter-form" class="filter-controls admin-filter"><input class="field" name="query" type="search" placeholder="商品名・メーカーで検索" value="${safeText(adminQuery)}"><select class="select" name="category"><option ${adminCategory === "すべて" ? "selected" : ""}>すべて</option>${categoryItems.map(([name]) => `<option ${adminCategory === name ? "selected" : ""}>${safeText(name)}</option>`).join("")}</select><button class="button button--outline" type="submit">検索</button></form><div class="table-wrap"><table class="data-table"><thead><tr><th>商品情報</th><th>カテゴリ</th><th>価格</th><th>在庫数</th><th>操作</th></tr></thead><tbody>${shown.map((product) => `<tr><td><div class="table-product">${productImage(product)}<span><strong>${safeText(product.name)}</strong><small>${safeText(product.maker)}${product.isDemoPrice ? " ・仮価格" : ""}</small></span></div></td><td>${safeText(product.category)}</td><td>${yen(product.price)}</td><td>${Number(product.stock) || 0}</td><td><div class="table-actions"><button class="button button--outline" data-action="admin-edit" data-id="${safeText(product.id)}">編集</button><button class="button button--danger" data-action="admin-delete" data-id="${safeText(product.id)}">削除</button></div></td></tr>`).join("") || `<tr><td colspan="5">条件に合う商品がありません。</td></tr>`}</tbody></table></div>${pageCount > 1 ? `<nav class="catalog-pagination" aria-label="管理画面のページ移動"><button class="button button--outline" data-action="admin-page" data-page="${adminPage - 1}" ${adminPage === 1 ? "disabled" : ""}>← 前へ</button><span>${adminPage} / ${pageCount} ページ</span><button class="button button--outline" data-action="admin-page" data-page="${adminPage + 1}" ${adminPage === pageCount ? "disabled" : ""}>次へ →</button></nav>` : ""}`;
}

function enhanceAdminScreen() {
  const filter = document.querySelector("#admin-filter-form");
  const table = document.querySelector(".data-table");
  if (!filter || !table) return;
  const platformFilter = document.createElement("select");
  platformFilter.className = "select";
  platformFilter.name = "platform";
  platformFilter.setAttribute("aria-label", "CPU・マザーボードのプラットフォーム");
  platformFilter.innerHTML = `<option value="すべて">Intel / AMDすべて</option>${platformOptions.map((value) => `<option value="${value}">${value}</option>`).join("")}`;
  platformFilter.value = adminPlatform;
  filter.querySelector("button[type='submit']")?.before(platformFilter);

  if (apiConfigured) {
    const statusFilter = document.createElement("select");
    statusFilter.className = "select";
    statusFilter.name = "listingStatus";
    statusFilter.setAttribute("aria-label", "公開状態");
    statusFilter.innerHTML = '<option value="すべて">公開状態すべて</option><option value="下書き">下書き</option><option value="公開中">公開中</option>';
    statusFilter.value = adminListingStatus;
    filter.querySelector("button[type='submit']")?.before(statusFilter);
  }

  const header = table.tHead?.rows[0];
  if (header) {
    const platformHeader = document.createElement("th");
    platformHeader.textContent = "プラットフォーム";
    header.cells[1]?.after(platformHeader);
    const statusHeader = document.createElement("th");
    statusHeader.textContent = "公開状態";
    header.lastElementChild?.before(statusHeader);
  }
  const allShown = adminFilteredProducts();
  const shown = allShown.slice((adminPage - 1) * 50, adminPage * 50);
  const rows = table.tBodies[0]?.rows || [];
  if (shown.length) {
    shown.forEach((product, index) => {
      const platformCell = document.createElement("td");
      if (platformCategories.has(product.category)) {
        const socket = String(product.specs?.["ソケット"] || "");
        platformCell.textContent = `${product.platform || "未設定"}${socket ? ` · ${socket}` : ""}`;
      } else platformCell.textContent = "—";
      rows[index]?.cells[1]?.after(platformCell);
      const statusCell = document.createElement("td");
      statusCell.innerHTML = product.isActive === false
        ? '<span class="badge badge--warning">下書き</span>'
        : '<span class="badge badge--blue">公開中</span>';
      rows[index]?.lastElementChild?.before(statusCell);
      const editButton = rows[index]?.querySelector('[data-action="admin-edit"]');
      const deleteButton = rows[index]?.querySelector('[data-action="admin-delete"]');
      if (product.isActive === false) {
        if (editButton) editButton.textContent = "販売設定";
        if (deleteButton) deleteButton.textContent = "削除";
      } else if (deleteButton) deleteButton.textContent = "公開停止";
    });
  } else if (rows[0]?.cells[0]) rows[0].cells[0].colSpan = 7;
  const description = document.querySelector(".page-heading p");
  if (description) description.textContent = "下書きは商品一覧に表示されません。価格・在庫・画像を確認して公開してください。CPUとマザーボードはIntel / AMDとソケットを確認します。";
  const total = apiConfigured ? adminProducts.length : products.length;
  const active = (apiConfigured ? adminProducts : products).filter((product) => product.isActive !== false).length;
  const count = document.querySelector(".admin-toolbar__copy small");
  if (count) count.textContent = `${allShown.length} 件を表示（全 ${total} 件・公開中 ${active} 件・下書き ${total - active} 件） / ${apiConfigured ? "MySQLカタログ" : "このブラウザ"}に保存`;
}

function renderAdmin() {
  renderAdminContent();
  enhanceAdminScreen();
}

function persistCatalog() {
  storage.set("pcparts-products", products);
  storage.set("pcparts-catalog-version", 2);
}

function adminProductForm(product = null) {
  const editing = Boolean(product);
  const values = product || { name: "", shortName: "", maker: "", category: "CPU", price: "", stock: "", description: "", specs: {}, manufacturerUrl: "", imageUrl: "", productUrl: "", isDemoPrice: false };
  const specsText = Object.entries(values.specs || {}).map(([key, value]) => `${key}: ${value}`).join("\n");
  const options = categoryItems.map(([name]) => `<option value="${safeText(name)}" ${values.category === name ? "selected" : ""}>${safeText(name)}</option>`).join("");
  openModal(editing ? "商品情報を編集" : "商品を登録", `<form id="admin-product-form" class="admin-product-form" data-id="${safeText(values.id || "")}"><div class="form-grid">
    <label class="form-field form-field--full"><span>商品名 *</span><input class="input" name="name" required maxlength="120" value="${safeText(values.name)}" placeholder="例）AMD Ryzen 7 9800X3D"></label>
    <label class="form-field"><span>表示名</span><input class="input" name="shortName" maxlength="80" value="${safeText(values.shortName || "")}" placeholder="一覧に表示する短い名前"></label>
    <label class="form-field"><span>メーカー</span><input class="input" name="maker" maxlength="80" value="${safeText(values.maker || "")}" placeholder="例）AMD"></label>
    <label class="form-field"><span>カテゴリ *</span><select class="select" name="category" required>${options}<option value="その他" ${!categoryItems.some(([name]) => name === values.category) && values.category !== "CPU" ? "selected" : ""}>その他</option></select></label>
    <label class="form-field"><span>価格（円） *</span><input class="input" name="price" type="number" min="0" step="1" required value="${safeText(values.price)}"></label>
    <label class="form-field"><span>在庫数 *</span><input class="input" name="stock" type="number" min="0" step="1" required value="${safeText(values.stock)}"></label>
    <label class="form-field form-field--full"><span>商品画像URL</span><input class="input" name="imageUrl" type="url" maxlength="1000" value="${safeText(values.imageUrl || "")}" placeholder="https://... / API画像URLでも可"></label>
    <label class="form-field form-field--full"><span>販売元の商品ページURL</span><input class="input" name="productUrl" type="url" maxlength="1000" value="${safeText(values.productUrl || "")}" placeholder="https://..."></label>
    <label class="form-field form-field--full"><span>商品説明</span><textarea name="description" maxlength="1000" rows="3" placeholder="商品の特徴">${safeText(values.description || "")}</textarea></label>
    <label class="form-field form-field--full"><span>仕様（1行に「項目名: 値」）</span><textarea name="specs" maxlength="3000" rows="6" placeholder="コア / スレッド: 8 / 16\nソケット: AM5">${safeText(specsText)}</textarea></label>
    <label class="form-field"><span>情報取得元・ショップ名</span><input class="input" name="sourceName" maxlength="100" value="${safeText(values.sourceName || "")}" placeholder="例）ツクモ"></label>
    <label class="form-field"><span>メーカー公式情報URL</span><input class="input" name="manufacturerUrl" type="url" maxlength="1000" value="${safeText(values.manufacturerUrl || "")}" placeholder="https://"></label>
    <label class="form-check form-field--full"><input name="demoPrice" type="checkbox" ${values.isDemoPrice ? "checked" : ""}><span>試作用・外部API取得時点の仮価格として表示する</span></label>
    ${apiConfigured ? `<label class="form-check form-field--full"><input name="active" type="checkbox" ${values.isActive === true ? "checked" : ""}><span>購入可能な商品として公開する</span></label>` : ""}
    </div><p class="form-hint">${apiConfigured ? "下書きは商品一覧に表示されません。公開する前に、自社の販売価格・在庫・画像を確認し、仮価格のチェックを外してください。" : "登録内容はこのブラウザ内に保存されます。"}</p><div class="modal-form-actions"><button class="button button--outline" type="button" data-action="close-modal">キャンセル</button><button class="button" type="submit">${editing ? "変更を保存" : "商品を登録"}</button></div></form>`);
}

let pendingCatalogImport = [];
function adminImportForm() {
  pendingCatalogImport = [];
  openModal("外部商品候補を取り込む", `<div class="admin-import"><p>公式ショッピングAPIから出力したJSONファイルを選択します。最大1,000件。価格と在庫は取得時点の参考情報です。MySQLでは下書きとして取り込み、管理画面で販売条件を確認してから公開します。</p><label class="form-field"><span>カタログJSON</span><input id="catalog-import-file" class="input" type="file" accept=".json,application/json"></label><div id="catalog-import-preview" class="import-preview" aria-live="polite">JSONファイルを選ぶと候補を確認できます。</div><div class="modal-form-actions"><button class="button button--outline" type="button" data-action="close-modal">キャンセル</button><button id="catalog-import-confirm" class="button" type="button" data-action="admin-import-confirm" disabled>下書きとして取り込む</button></div></div>`);
}

function validateImportedCatalog(payload) {
  const items = Array.isArray(payload) ? payload : payload?.items;
  if (!Array.isArray(items) || !items.length) throw new Error("商品配列が見つかりません。API出力のJSONを選んでください。");
  if (items.length > 1000) throw new Error("一度に登録できるのは1,000件までです。");
  const ids = new Set();
  return items.map((raw, index) => {
    if (!raw || typeof raw !== "object" || raw.id == null) throw new Error(`${index + 1}件目の商品データを読み取れません。`);
    const product = normalizeApiProduct(raw);
    if (!/^[A-Za-z0-9._-]{1,100}$/.test(product.id)) throw new Error(`${index + 1}件目に有効な商品IDがありません。`);
    if (ids.has(product.id)) throw new Error(`商品ID「${product.id}」がファイル内で重複しています。`);
    ids.add(product.id);
    if (!product.name || !categoryItems.some(([category]) => category === product.category) && product.category !== "その他" || !Number.isSafeInteger(product.price) || product.price < 0 || !Number.isSafeInteger(product.stock) || product.stock < 0) throw new Error(`${index + 1}件目の名前・カテゴリ・価格・在庫数を確認してください。`);
    if (platformCategories.has(product.category) && !platformOptions.includes(product.platform)) throw new Error(`${index + 1}件目の${product.category}にIntel / AMDの指定が必要です。`);
    if (raw.imageUrl && !httpUrl(raw.imageUrl)) throw new Error(`${index + 1}件目の商品画像URLはhttpまたはhttpsを指定してください。`);
    if (raw.productUrl && !httpUrl(raw.productUrl)) throw new Error(`${index + 1}件目の販売ページURLはhttpまたはhttpsを指定してください。`);
    product.imageUrl = httpUrl(raw.imageUrl);
    product.productUrl = httpUrl(raw.productUrl);
    if (apiConfigured && (product.price <= 0 || !product.imageUrl || !product.productUrl)) throw new Error(`${index + 1}件目は取得価格・商品画像URL・販売ページURLが必要です。`);
    return product;
  });
}

async function importCatalog(items, onProgress = () => {}) {
  if (apiConfigured) {
    let imported = 0;
    for (let offset = 0; offset < items.length; offset += 50) {
      const result = await apiRequest("admin/products/bulk-import.php", { method: "POST", body: JSON.stringify({ items: items.slice(offset, offset + 50) }) });
      imported += Number(result.imported) || 0;
      onProgress(Math.min(offset + 50, items.length), items.length);
    }
    adminCatalogLoaded = false;
    await refreshAdminCatalog();
    return imported;
  }
  const byId = new Map(products.map((product) => [product.id, product]));
  for (const item of items) byId.set(item.id, item);
  products.splice(0, products.length, ...byId.values());
  persistCatalog();
  return items.length;
}

const wizardQuestions = [
  { key: "budget", prompt: "予算はどのくらいですか？", detail: "「20万円くらい」「15〜20万円」「できるだけ安く」など自由に入力してください。", label: "予算の目安", placeholder: "例）20万円くらい", required: true },
  { key: "use", prompt: "PCを何に使いたいですか？", detail: "ゲーム、配信、動画編集、仕事、学習、開発など、複数でも大丈夫です。", label: "用途", placeholder: "例）ゲームと配信、学校の課題にも使いたい", required: true },
  { key: "games", prompt: "使いたいゲームやアプリ、作業内容はありますか？", detail: "タイトルや、目標fps・画質・解像度なども書けます。", label: "ゲーム・アプリ・作業", placeholder: "例）ARKとVALORANTを144fpsで遊びたい", required: true },
  { key: "style", prompt: "性能や見た目の希望を教えてください。", detail: "色、光り方、静音性、サイズ、性能など何でも入力できます。", label: "デザイン・性能の希望", placeholder: "例）白くてキラキラ、配信中は静かなPCがいい", required: true },
  { key: "equipment", prompt: "持っている機材やパーツはありますか？", detail: "モニター、キーボード、マウス、流用したいパーツなどを教えてください。", label: "手持ちの機材", placeholder: "例）モニターは持ってる、キーボードはこれから買う", required: true },
  { key: "conditions", prompt: "ほかに気になることや条件はありますか？", detail: "特になければ空欄のまま進めます。あとから追加で相談できます。", label: "その他の希望（任意）", placeholder: "例）Wi-Fi必須、将来メモリを増やしたい", required: false },
];

function renderWizardAnswerControl(question) {
  const value = wizardAnswers[question.key] || "";
  return `<label class="form-field wizard-free-answer"><span>${question.label}</span><textarea class="input" name="answer" rows="3" maxlength="400" placeholder="${safeText(question.placeholder)}" ${question.required ? "required" : ""}>${safeText(value)}</textarea><small class="form-hint">自由入力・最大400文字${question.required ? "" : " / 空欄でも進めます"}</small></label>`;
}

function renderWizard() {
  const question = wizardQuestions[wizardStep];
  const previous = wizardQuestions.slice(0, wizardStep).map((item) => `<div class="chat-line chat-line--user"><span>${safeText(wizardAnswers[item.key] || "（入力なし）")}</span></div><div class="chat-line chat-line--bot"><span>${item.prompt.replace(/[？?]$/, "。")}</span></div>`).join("");
  app.innerHTML = `${breadcrumb("AI構成相談", "")}<div class="page-heading"><div><span class="eyebrow">PC BUILD ASSISTANT</span><h1>AIとPC構成を相談</h1><p>希望や条件を自由に入力すると、内容に合わせた構成案を提案します。</p></div><button class="text-link" data-go="home">← 商品一覧へ</button></div><div class="wizard-layout"><section class="panel wizard-panel"><div class="wizard-panel__head"><span class="wizard-bot-icon">✳</span><div><strong>PC構成AIアシスタント</strong><small>選択肢にない希望も、そのまま入力できます</small></div><span class="wizard-step-label">${wizardStep + 1} / ${wizardQuestions.length}</span></div><div class="wizard-progress"><span style="width:${((wizardStep + 1) / wizardQuestions.length) * 100}%"></span></div><div class="chat-history"><div class="chat-line chat-line--bot"><span>こんにちは！用途や条件に決まった選択肢はありません。思いつくことを自由に教えてください。</span></div>${previous}<div class="chat-line chat-line--bot"><span>${question.prompt}<small>${question.detail}</small></span></div></div><form id="wizard-form" class="wizard-answer">${renderWizardAnswerControl(question)}<div class="wizard-actions">${wizardStep > 0 ? `<button class="button button--quiet" type="button" data-action="wizard-back">← 前の質問</button>` : `<span class="wizard-note">回答はこのブラウザ内だけで保持されます</span>`}<button class="button" type="submit">${wizardStep === wizardQuestions.length - 1 ? "構成を提案してもらう →" : "次の質問へ →"}</button></div></form></section><aside class="wizard-aside panel"><span class="eyebrow">HOW IT WORKS</span><h2>あなたの希望を、<br />パーツ構成に。</h2><p>用途、ゲームやアプリ、見た目、手持ち機材などを自由入力できます。</p><ol>${wizardQuestions.map((item, index) => `<li class="${index <= wizardStep ? "is-active" : ""}"><span>${index + 1}</span>${item.label.replace(/（任意）/, "")}</li>`).join("")}</ol><div class="wizard-aside__tip">✦ 試作版では回答に応じたサンプル商品で構成します。</div></aside></div>`;
  if (apiConfigured) {
    const note = document.querySelector(".wizard-note");
    if (note) note.textContent = "回答は構成提案のためAI APIへ送信されます";
    const tip = document.querySelector(".wizard-aside__tip");
    if (tip) tip.textContent = "✦ 公開中の自社商品から構成を提案します。";
  }
}

function recommendationProducts() {
  if (apiConfigured) {
    if (!Array.isArray(serverAiProposal?.items)) return [];
    return serverAiProposal.items.map((item) => findProduct(item.id)).filter((product) => product && product.price > 0 && product.stock > 0);
  }
  if (serverAiProposal && Array.isArray(serverAiProposal.items)) {
    return serverAiProposal.items.map((item) => findProduct(item.id)).filter(Boolean);
  }
  const preferences = `${wizardAnswers.use} ${wizardAnswers.games} ${wizardAnswers.style} ${wizardAnswers.conditions}`;
  const dark = /(黒|ブラック|dark)/i.test(preferences);
  const quiet = /(光らない|光らなく|RGBなし|落ち着いた|シンプル|派手ではない|控えめ|静音|静かな|静かに|騒音)/i.test(preferences);
  const creatorUse = /(配信|動画編集|3D|Blender|CAD|AI|機械学習|開発|プログラミング|仮想環境|制作)/i.test(preferences);
  const chosen = [creatorUse ? "cpu7700" : "cpu7500f", "boardb650", "cooler240", dark || quiet ? "ram32" : "ram32white", "gpu5070", "ssd2tb", "psu750", dark ? "caseblack" : "casewhite"];
  if (monitorOwnership() === false) chosen.push("monitor24");
  let selection = chosen.map(findProduct).filter(Boolean);
  const budget = parseBudget(wizardAnswers.budget) || 200000;
  const total = selection.reduce((sum, product) => sum + product.price, 0);
  if (total > budget * 1.02 || /(できるだけ安く|なるべく安く|価格を抑え|予算を抑え)/.test(wizardAnswers.budget)) {
    selection = selection.map((product) => product.id === "gpu5070" ? findProduct("gpu4060") : product);
  }
  return selection;
}

function pcSceneSvg() {
  const design = `${wizardAnswers.style} ${wizardAnswers.conditions}`;
  const dark = /(黒|ブラック|dark)/i.test(design);
  const calm = /(光らない|光らなく|RGBなし|落ち着いた|シンプル|派手ではない|控えめ|静音|静かな|静かに|騒音)/i.test(design);
  const white = !dark;
  const shell = white ? "#f6f7fb" : "#202938";
  const side = white ? "#e3e8f0" : "#111b2b";
  const accent1 = calm ? "#879bb3" : dark ? "#46a4ff" : "#b878ff";
  return `<svg class="pc-scene" viewBox="0 0 860 500" role="img" aria-label="希望の条件をもとにしたPC構成イメージ"><defs><linearGradient id="room" x2="0" y2="1"><stop stop-color="#edf4ff"/><stop offset="1" stop-color="#dce6f5"/></linearGradient><linearGradient id="glass" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".72"/><stop offset="1" stop-color="#acd0ff" stop-opacity=".18"/></linearGradient><radialGradient id="glow"><stop stop-color="${accent1}" stop-opacity=".48"/><stop offset="1" stop-color="${accent1}" stop-opacity="0"/></radialGradient></defs><rect width="860" height="500" rx="17" fill="url(#room)"/><circle cx="485" cy="242" r="270" fill="url(#glow)"/><path d="M0 0h304v294H0z" fill="#f8fbff"/><path d="M32 35h238v174H32z" rx="8" fill="#183455"/><path d="M40 43h222v157H40z" fill="#bde2ff"/><path d="m48 177 53-76 43 47 45-60 67 80v22H48z" fill="#7caee2"/><circle cx="187" cy="77" r="21" fill="#fff2bc"/><path d="M19 209h266l-19 12H34z" fill="#7e91a9"/><path d="M71 221h162v74H71z" rx="7" fill="#1b2940"/><path d="M80 230h144v55H80z" fill="#234d77"/><path d="M142 295h19v28h-19zm-46 29h112v9H96z" fill="#8292a8"/><path d="M0 420h860" stroke="#becbda" stroke-width="4"/><rect x="316" y="96" width="382" height="325" rx="20" fill="${shell}" stroke="#b6c4d5" stroke-width="5"/><rect x="330" y="110" width="354" height="298" rx="12" fill="${side}"/><rect x="341" y="121" width="332" height="278" rx="10" fill="url(#glass)" stroke="#c9d5e2" stroke-width="2"/><rect x="348" y="127" width="112" height="264" rx="6" fill="#f8fbff" fill-opacity=".55"/><path d="M471 130v255" stroke="#d0dbea" stroke-width="4"/><rect x="486" y="148" width="163" height="32" rx="7" fill="#263549"/><path d="M503 164h130" stroke="#92a0b4" stroke-width="7"/><rect x="492" y="214" width="151" height="70" rx="9" fill="#e9edf5" stroke="#a8b7c9" stroke-width="5"/><path d="M504 226h126v46H504z" fill="#35465b"/><circle cx="539" cy="249" r="18" fill="#182539" stroke="${accent1}" stroke-width="5"/><circle cx="595" cy="249" r="18" fill="#182539" stroke="#6ba9ff" stroke-width="5"/><path d="M520 304h110v27h-110z" rx="5" fill="#3a4a60"/><path d="M533 317h80" stroke="#8fc6ff" stroke-width="5"/><g fill="#fff" stroke="#a6b5c6" stroke-width="4"><circle cx="404" cy="170" r="31"/><circle cx="404" cy="255" r="31"/><circle cx="404" cy="340" r="31"/></g><g fill="none" stroke-width="6"><circle cx="404" cy="170" r="22" stroke="${accent1}"/><circle cx="404" cy="255" r="22" stroke="#79bcff"/><circle cx="404" cy="340" r="22" stroke="#d4a7ff"/></g><g fill="#8495a9"><circle cx="404" cy="170" r="5"/><circle cx="404" cy="255" r="5"/><circle cx="404" cy="340" r="5"/></g><path d="M349 411h286" stroke="#adbaca" stroke-width="8"/><rect x="348" y="425" width="326" height="11" rx="5" fill="#8493a5"/><rect x="303" y="443" width="409" height="16" rx="8" fill="#aab8c8"/><path d="M317 449h380" stroke="#fff" stroke-opacity=".85" stroke-width="3"/><rect x="727" y="138" width="90" height="160" rx="9" fill="#dae4f0"/><rect x="735" y="147" width="74" height="132" rx="4" fill="#152d4b"/><rect x="741" y="153" width="62" height="120" rx="3" fill="#bcddff"/><path d="m741 253 22-28 15 17 12-20 13 24v27h-62z" fill="#80aee2"/><path d="M758 299h31v15h-31zm-11 18h53v8h-53z" fill="#8294a9"/><path d="M80 359h183l-10 47H90z" rx="6" fill="#dbe4ef" stroke="#aab8c9" stroke-width="3"/><path d="m103 371 136 0m-128 10h119m-113 9h107" stroke="#8d9daf" stroke-width="3"/><path d="M722 378c15-18 43-18 58 0l16 35h-90z" fill="#f6f8fb" stroke="#b4c2d2" stroke-width="4"/><path d="M18 468h820" stroke="#c1ccd9" stroke-width="3"/><text x="345" y="478" fill="#627691" font-size="12" font-family="sans-serif">IMAGE PREVIEW · YOUR CUSTOM BUILD</text></svg>`;
}

function renderAiResult() {
  const selection = recommendationProducts();
  if (apiConfigured && !selection.length) {
    const message = serverAiError
      ? `AI相談を利用できませんでした。${serverAiError}`
      : "現在の自社カタログに、条件に合う購入可能な商品がありません。商品が公開された後に再相談できます。";
    app.innerHTML = `${breadcrumb("AI構成相談", "")}<div class="page-heading"><div><span class="eyebrow">PC BUILD ASSISTANT</span><h1>構成を提案できませんでした</h1><p>入力した条件はこの画面で再入力できます。</p></div></div><section class="panel empty-state"><div class="wizard-bot-icon">✳</div><h2>購入可能な構成が見つかりません</h2><p>${safeText(message)}</p><div class="success-actions"><button class="button" data-action="restart-wizard">条件を変えて再相談</button><button class="button button--outline" data-go="home">販売中の商品を見る</button></div></section>`;
    return;
  }
  const total = selection.reduce((sum, product) => sum + product.price, 0);
  const budget = parseBudget(wizardAnswers.budget) || 200000;
  const budgetLabel = wizardAnswers.budget || "未指定（約20万円で試算）";
  const ownership = monitorOwnership();
  const monitorNote = ownership === false
    ? "モニターをお持ちでない回答だったため、サンプルのモニターも加えています。"
    : ownership === true
      ? "モニターをお持ちとの回答を反映し、PC本体のパーツを中心に選びました。"
      : "手持ち機材の回答からはモニターの有無を判断していません。必要なら条件を追加して再相談できます。";
  const isOverBudget = total > budget * 1.02;
  const requestChips = [
    ["用途", wizardAnswers.use], ["ゲーム・作業", wizardAnswers.games], ["希望", wizardAnswers.style],
    ["手持ち", wizardAnswers.equipment], ["その他", wizardAnswers.conditions],
  ].filter(([, value]) => value).map(([label, value]) => `<span title="${safeText(value)}">${label}：${safeText(shortAnswer(value))}</span>`).join("");
  const budgetNote = parseBudget(wizardAnswers.budget)
    ? `入力した目安は${yen(budget)}です。商品価格の合計と見比べてください。`
    : "予算の数字を読み取れなかったため、約20万円を仮の目安にしています。条件を変えて再相談できます。";
  app.innerHTML = `${breadcrumb("AIおすすめ構成", "AI構成相談")}<div class="page-heading"><div><span class="eyebrow">YOUR PERSONAL BUILD</span><h1>あなたにおすすめの構成</h1><p>${safeText(shortAnswer(wizardAnswers.use || "用途未指定"))}向けに、${serverAiProposal ? "AIが自社カタログの商品から構成を提案しました。" : "入力された条件を見ながらサンプル構成を作りました。"}</p></div><button class="text-link" data-action="restart-wizard">条件を変えて相談する ↗</button></div><section class="panel recommendation-overview"><div class="recommendation-summary"><div class="recommendation-summary__top"><span class="recommendation-spark">✳</span><span>${safeText(serverAiProposal?.summary || "いただいた希望をもとにした構成案です。")}</span></div><div class="recommendation-chips"><span>予算：${safeText(shortAnswer(budgetLabel))}</span>${requestChips}</div><div class="recommendation-summary__note">${safeText(monitorNote)}</div></div><div class="pc-scene-wrap"><div class="pc-scene-heading"><span class="badge badge--blue">PCイメージ（SVGプレビュー）</span><span class="recommendation-caption">入力したデザイン希望を反映</span></div>${pcSceneSvg()}</div></section><section class="recommendation-parts"><div class="section-heading"><div><span class="eyebrow">RECOMMENDED PARTS</span><h2>おすすめパーツ</h2><p>${serverAiProposal ? "AIが自社カタログから選んだ商品です。" : "入力内容から選んだデモ商品で構成しています。"}</p></div><span class="badge ${isOverBudget ? "badge--warning" : ""}">${isOverBudget ? "予算を超えています" : "予算の目安内"}</span></div><div class="recommendation-grid">${selection.map((product) => `<article class="recommendation-part"><div class="recommendation-part__visual">${artFor(product.type, product.shortName)}</div><span class="product-category">${safeText(product.category)}</span><strong>${safeText(product.name)}</strong><span class="recommendation-part__reason">${safeText(serverAiProposal?.items?.find((item) => item.id === product.id)?.reason || (product.id === "gpu5070" ? "ゲーム性能を重視" : product.id === "gpu4060" ? "価格を抑えたGPU" : product.id === "casewhite" ? "白いガラスケース" : product.id === "caseblack" ? "落ち着いた黒いケース" : product.id === "ram32white" ? "白いRGBメモリ" : product.id === "cooler240" ? "冷却パーツ" : product.id === "boardb650" ? "Wi-Fi対応マザーボード" : product.id === "monitor24" ? "モニター未所持の方向け" : product.id === "cpu7700" ? "制作・配信も見据えたCPU" : "構成バランスを重視"))}</span><div class="recommendation-part__bottom"><span class="price">${yen(product.price)}</span><button class="button button--outline button--small" data-go="detail" data-id="${safeText(product.id)}">商品を見る</button></div></article>`).join("")}</div><div class="recommendation-total panel"><div><span>おすすめ構成の合計目安</span><small>※${safeText(budgetNote)} 初期登録CPUなど一部は試作価格です。商品情報の互換性確認は未実装です。</small></div><strong>${yen(total)}<small>（税込）</small></strong></div><div class="recommendation-actions"><button class="button" data-action="add-build" data-ids="${selection.map((product) => safeText(product.id)).join(",")}">▱ この構成をカートに追加</button><button class="button button--outline" data-go="home">商品一覧を見る</button></div></section><div class="followup-strip"><span>✳ 条件を少し変えてみますか？</span><button data-action="adjust-budget">予算を少し抑えたい</button><button data-action="restart-wizard">別の条件で相談</button><button data-go="home">パーツを自分で選びたい</button></div>`;
  const compatibilityDisclosure = document.querySelector(".recommendation-total small");
  if (compatibilityDisclosure) {
    const currentNote = compatibilityDisclosure.textContent.replace("商品情報の互換性確認は未実装です。", "").trim();
    compatibilityDisclosure.textContent = `${currentNote} CPUとマザーボードのプラットフォーム・ソケットは照合します。その他パーツ間の完全な互換性保証はありません。`;
  }
  const references = serverAiProposal?.references || [];
  if (apiConfigured && serverAiProposal?.referenceNotice) {
    const notice = document.createElement("p");
    notice.className = "source-caption";
    notice.textContent = serverAiProposal.referenceNotice;
    document.querySelector(".recommendation-parts .section-heading")?.after(notice);
  }
  if (references.length) {
    const referenceSection = document.createElement("section");
    referenceSection.className = "rakuten-references panel";
    const heading = document.createElement("h2"); heading.textContent = "楽天市場の参考商品（購入対象外）"; referenceSection.append(heading);
    const note = document.createElement("p"); note.textContent = "楽天市場の商品は相談用の参考情報です。当店の商品一覧やカートには追加されません。"; referenceSection.append(note);
    const grid = document.createElement("div"); grid.className = "rakuten-reference-grid";
    for (const item of references) {
      const card = document.createElement("article"); card.className = "rakuten-reference";
      const imageUrl = safeHttpUrl(item.imageUrl); const productUrl = safeHttpUrl(item.productUrl);
      if (imageUrl) { const image = document.createElement("img"); image.src = imageUrl; image.alt = ""; image.loading = "lazy"; card.append(image); }
      const title = document.createElement("strong"); title.textContent = item.itemName || "楽天市場商品"; card.append(title);
      const fetchedAt = new Date(item.retrievedAt || "");
      const referencePrice = Number(item.price);
      if (Number.isFinite(referencePrice) && referencePrice > 0 && !Number.isNaN(fetchedAt.getTime())) {
        const price = document.createElement("span"); price.textContent = `楽天市場の参考価格 ${yen(referencePrice)}`; card.append(price);
        const priceNote = document.createElement("small");
        const fetchedTime = fetchedAt.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
        priceNote.textContent = `取得：${fetchedTime}。当店の販売価格ではありません。価格・在庫は変わる場合があり、購入時は楽天市場店舗に表示される価格が適用されます。`;
        card.append(priceNote);
      }
      const shop = document.createElement("small"); shop.textContent = item.shopName || "楽天市場"; card.append(shop);
      if (productUrl) { const link = document.createElement("a"); link.href = productUrl; link.target = "_blank"; link.rel = "noopener noreferrer"; link.textContent = "楽天市場で見る"; card.append(link); }
      grid.append(card);
    }
    referenceSection.append(grid);
    document.querySelector(".recommendation-total")?.before(referenceSection);
  }
}

function renderRoute() {
  const { page, id } = routeInfo();
  if (apiConfigured && ["account", "orders"].includes(page) && !serverOrdersLoaded && !serverOrdersLoading) refreshServerOrders();
  if (page === "home") renderHome();
  else if (page === "detail") renderDetail(decodeURIComponent(id));
  else if (page === "cart") renderCart();
  else if (page === "checkout") renderCheckout();
  else if (page === "success") renderSuccess();
  else if (page === "auth") renderAuth("login");
  else if (page === "register") renderAuth("register");
  else if (page === "admin-login") renderAuth("admin-login");
  else if (page === "account") renderAccount();
  else if (page === "orders") renderOrders();
  else if (page === "profile") renderProfile();
  else if (page === "favorites") renderFavorites();
  else if (page === "admin") renderAdmin();
  else if (page === "ai") renderWizard();
  else if (page === "ai-result") renderAiResult();
  else renderHome();
}

function openModal(title, body) {
  document.querySelector("#modal-root").innerHTML = `<div class="modal-backdrop" data-action="close-modal"><section class="modal" role="dialog" aria-modal="true" aria-label="${safeText(title)}"><div class="modal__head"><h2>${safeText(title)}</h2><button class="modal-close" data-action="close-modal" aria-label="閉じる">×</button></div><div class="modal__body">${body}</div></section></div>`;
  enhanceAdminProductForm();
}

function enhanceAdminProductForm() {
  const form = document.querySelector("#admin-product-form");
  const category = form?.elements.namedItem("category");
  const categoryLabel = category?.closest(".form-field");
  if (!form || !category || !categoryLabel) return;
  const makerLabel = form.elements.namedItem("maker")?.closest(".form-field");
  const specsLabel = form.elements.namedItem("specs")?.closest(".form-field");
  if (makerLabel?.querySelector("span")) makerLabel.querySelector("span").textContent = "メーカー（商品ブランド）";
  if (specsLabel?.querySelector("span")) specsLabel.querySelector("span").textContent = "仕様（ソケット名も記入）";
  [...category.options].filter((option) => option.value === "その他").slice(1).forEach((option) => option.remove());
  let field = form.querySelector("#product-platform-field");
  if (!field) {
    field = document.createElement("label");
    field.className = "form-field";
    field.id = "product-platform-field";
    field.innerHTML = `<span>プラットフォーム *</span><select class="select" name="platform"><option value="">選択してください</option>${platformOptions.map((value) => `<option value="${value}">${value}</option>`).join("")}</select><small class="form-hint">CPUソケット / マザーボードの対応メーカーを選びます。</small>`;
    categoryLabel.after(field);
    const savedProduct = (apiConfigured ? adminProducts : products).find((product) => product.id === form.dataset.id);
    if (savedProduct?.platform) field.querySelector("select").value = savedProduct.platform;
  }
  const platformSelect = field.querySelector("select");
  const update = () => {
    const required = platformCategories.has(category.value);
    field.hidden = !required;
    platformSelect.disabled = !required;
    platformSelect.required = required;
  };
  update();
}

function openDrawer() {
  document.querySelector("#mobile-menu-button").setAttribute("aria-expanded", "true");
  document.querySelector("#drawer-root").innerHTML = `<div class="drawer-backdrop" data-action="close-drawer"><aside class="drawer" aria-label="メニュー"><div class="drawer__head"><a class="brand" href="#/home"><span class="brand__mark"><svg viewBox="0 0 42 42"><path d="M21 2 39 12v18L21 40 3 30V12L21 2Z"/><path d="M3 12 21 22l18-10M21 22v18"/></svg></span><span class="brand__wordmark">PC PARTS <span>SHOP</span><small>BUILD YOUR NEXT PC</small></span></a><button class="drawer-close" data-action="close-drawer" aria-label="メニューを閉じる">×</button></div><div class="drawer__profile">${currentUser ? `<span class="avatar">♙</span><span><strong>${safeText(currentUser.name)} さん</strong><small>${safeText(currentUser.email)}</small></span>` : `<span class="avatar">♙</span><span><strong>ゲストユーザー</strong><small>ログインして購入履歴を管理</small></span>`}</div><nav class="drawer__links"><button data-go="home"><span>⌂</span>ホーム</button><button data-go="ai"><span>✳</span>AI構成相談</button><button data-go="account"><span>♙</span>マイページ</button><button data-go="orders"><span>▣</span>購入履歴</button><button data-go="favorites"><span>♡</span>お気に入り</button><button data-go="profile"><span>⚙</span>会員情報編集</button>${currentUser ? `<button data-action="account-menu" data-id="logout"><span>↪</span>ログアウト</button>` : `<button data-go="auth"><span>↪</span>ログイン</button>`}<button data-go="admin-login"><span>▤</span>管理者ログイン</button></nav><div class="drawer__categories"><strong>カテゴリから探す</strong>${categoryItems.map(([name]) => `<button data-category="${name}">${name}<span>›</span></button>`).join("")}</div></aside></div>`;
}

function closeDrawer() {
  document.querySelector("#drawer-root").innerHTML = "";
  document.querySelector("#mobile-menu-button").setAttribute("aria-expanded", "false");
}

function productFormValues(form) {
  const data = new FormData(form);
  const specs = {};
  for (const line of String(data.get("specs") || "").split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator > 0) { const key = line.slice(0, separator).trim(); const value = line.slice(separator + 1).trim(); if (key && value) specs[key] = value; }
  }
  const category = String(data.get("category") || "その他");
  const typeByCategory = { "CPU": "cpu", "GPU": "gpu", "マザーボード": "board", "SSD": "ssd", "メモリ": "ram", "CPUクーラー": "cooler", "ファン": "fan", "PCケース": "case", "PC電源": "psu", "その他": "other" };
  const name = String(data.get("name") || "").trim();
  const platform = String(data.get("platform") || "");
  const price = Number(data.get("price"));
  const stock = Number(data.get("stock"));
  if (!name || !Number.isSafeInteger(price) || price < 0 || !Number.isSafeInteger(stock) || stock < 0) throw new Error("商品名・価格・在庫数を確認してください");
  if (platformCategories.has(category) && !platformOptions.includes(platform)) throw new Error("CPUとマザーボードはIntel / AMDを選択してください");
  const manufacturerUrl = String(data.get("manufacturerUrl") || "").trim();
  const imageUrl = String(data.get("imageUrl") || "").trim();
  const productUrl = String(data.get("productUrl") || "").trim();
  const sourceName = String(data.get("sourceName") || "").trim();
  const existing = (apiConfigured ? adminProducts : products).find((item) => item.id === form.dataset.id);
  const isActive = apiConfigured ? data.has("active") : true;
  const isDemoPrice = data.has("demoPrice");
  for (const [label, url] of [["メーカー情報URL", manufacturerUrl], ["商品画像URL", imageUrl], ["販売元URL", productUrl]]) {
    if (url && !safeHttpUrl(url)) throw new Error(`${label}はhttpまたはhttpsのURLを入力してください`);
  }
  if (sourceName) specs["取得元"] = sourceName;
  if (apiConfigured && isActive && existing?.isActive !== true) {
    if (price <= 0 || stock <= 0 || isDemoPrice || !imageUrl) throw new Error("公開には自社の販売価格・在庫・商品画像が必要です。仮価格のチェックも外してください");
  }
  return {
    id: form.dataset.id || `catalog-${Date.now().toString(36)}`, name,
    shortName: String(data.get("shortName") || "").trim() || name,
    maker: String(data.get("maker") || "").trim() || "メーカー未設定", platform, category, type: category === "その他" ? (existing?.type || "other") : (typeByCategory[category] || "other"),
    price, stock, rating: 0, reviews: 0, description: String(data.get("description") || "").trim() || "商品説明は準備中です。",
    specs, manufacturerUrl, imageUrl, productUrl, sourceName, isDemoPrice, isActive,
  };
}

async function submitAdminProduct(form) {
  try {
    const product = productFormValues(form);
    const existing = (apiConfigured ? adminProducts : products).find((item) => item.id === product.id);
    if (apiConfigured) {
      const path = `products.php${existing ? `?id=${encodeURIComponent(product.id)}` : ""}`;
      const result = await apiRequest(path, { method: existing ? "PUT" : "POST", body: JSON.stringify(product) });
      Object.assign(product, normalizeApiProduct(result.item));
    }
    const target = apiConfigured ? adminProducts : products;
    const index = target.findIndex((item) => item.id === product.id);
    if (index >= 0) target[index] = product; else target.unshift(product);
    if (apiConfigured && !product.isActive) { delete cart[product.id]; persistCart(); }
    if (apiConfigured) await refreshServerCatalog(); else persistCatalog();
    document.querySelector("#modal-root").innerHTML = ""; renderAdmin(); showToast(product.isActive ? "公開商品を保存しました" : "下書きを保存しました");
  } catch (error) { showToast(error.message || "商品の保存に失敗しました"); }
}

async function deleteAdminProduct(id) {
  try {
    const result = apiConfigured ? await apiRequest(`products.php?id=${encodeURIComponent(id)}`, { method: "DELETE" }) : null;
    const target = apiConfigured ? adminProducts : products;
    const index = target.findIndex((product) => product.id === id);
    if (index < 0) return;
    const product = target[index];
    if (apiConfigured && result?.archived) product.isActive = false; else target.splice(index, 1);
    cart = Object.fromEntries(Object.entries(cart).filter(([productId]) => productId !== id));
    favorites = favorites.filter((productId) => productId !== id);
    if (apiConfigured) await refreshServerCatalog(); else persistCatalog();
    persistCart(); storage.set("pcparts-favorites", favorites);
    document.querySelector("#modal-root").innerHTML = ""; renderAdmin(); showToast(result?.archived ? `${product.name} を非公開にしました` : `${product.name} を削除しました`);
  } catch (error) { showToast(error.message || "商品の削除に失敗しました"); }
}

async function signInAdmin(form) {
  const data = new FormData(form);
  try {
    const result = await apiRequest("admin/login.php", { method: "POST", body: JSON.stringify({ email: data.get("email"), password: data.get("password") }) });
    adminAuthenticated = true; adminStatusChecked = true;
    await refreshServerCatalog();
    await refreshAdminCatalog();
    go("admin"); showToast(`${result.admin?.name || "管理者"} としてログインしました`);
  } catch (error) { showToast(error.message || "管理者ログインに失敗しました"); }
}

async function placeDemoOrder(button) {
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || "card";
  const paymentLabels = { card: "クレジット / デビットカード（デモ）", paypay: "PayPay（デモ）", rakutenpay: "楽天ペイ（デモ）", transport: "交通系電子マネー（デモ）", konbini: "コンビニ払い（デモ）" };
  if (paymentMethod === "card") {
    const number = (document.querySelector("#demo-card-number")?.value || "").replace(/\D/g, "");
    const expiry = document.querySelector("#demo-card-expiry")?.value.trim();
    const cvc = document.querySelector("#demo-card-cvc")?.value.trim();
    if (number !== "4242424242424242" || expiry !== "12/30" || cvc !== "123") {
      showToast("カード決済デモには表示されたテスト値だけを入力してください");
      document.querySelector("#demo-card-number")?.focus();
      return;
    }
  }
  const paymentStore = paymentMethod === "konbini" ? (document.querySelector("#konbini-store")?.value || "セブン‐イレブン") : "";
  const items = cartEntries().map(({ product, quantity }) => ({ id: product.id, quantity }));
  if (!items.length) { showToast("カートに商品がありません"); return; }
  button.disabled = true;
  button.textContent = "デモ注文を確認中…";
  try {
    if (apiConfigured) {
      const result = await apiRequest("demo-orders.php", { method: "POST", body: JSON.stringify({ items, paymentMethod, paymentStore }) });
      lastOrder = result.order;
      if (!lastOrder?.number) throw new Error("注文結果を読み取れませんでした");
      serverOrdersLoaded = true;
      serverOrdersError = "";
      orders = [lastOrder, ...orders.filter((order) => order.number !== lastOrder.number)];
    } else {
      const subtotal = cartSubtotal();
      const shipping = subtotal >= 11000 ? 0 : 660;
      const paymentDeadline = new Date(); paymentDeadline.setDate(paymentDeadline.getDate() + 3);
      lastOrder = {
        number: `PC${new Date().toISOString().slice(0, 10).replaceAll("-", "")}${String(Date.now()).slice(-5)}`,
        total: subtotal + shipping,
        date: new Date().toLocaleDateString("ja-JP"),
        status: paymentMethod === "konbini" ? "コンビニ支払い待ち（デモ）" : "決済完了（デモ）",
        paymentMethod, paymentLabel: paymentLabels[paymentMethod] || "デモ決済",
        paymentStore, paymentCode: paymentMethod === "konbini" ? String(Math.floor(100000 + Math.random() * 900000)) : "",
        paymentDeadline: paymentMethod === "konbini" ? paymentDeadline.toLocaleDateString("ja-JP") : "",
        items,
      };
      orders = [lastOrder, ...orders];
      storage.set("pcparts-orders", orders);
    }
    cart = {};
    persistCart();
    go("success");
  } catch (error) {
    showToast(error.message || "デモ注文の保存に失敗しました");
    button.disabled = false;
    button.textContent = "デモ注文を確定する";
  }
}

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-go]");
  if (nav) { event.preventDefault(); document.querySelector("#modal-root").innerHTML = ""; closeDrawer(); go(nav.dataset.go, nav.dataset.id || ""); return; }
  const category = event.target.closest("[data-category]");
  if (category) { closeDrawer(); catalogFilter.category = category.dataset.category; catalogFilter.query = ""; catalogFilter.min = ""; catalogFilter.max = ""; catalogPage = 1; renderHome(); document.querySelector("#categories")?.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
  const scroll = event.target.closest("[data-scroll]");
  if (scroll) { document.getElementById(scroll.dataset.scroll)?.scrollIntoView({ behavior: "smooth" }); return; }
  const action = event.target.closest("[data-action]");
  if (!action) return;
  const { action: kind, id } = action.dataset;
  if (kind === "add-cart") addToCart(id);
  if (kind === "favorite") toggleFavorite(id);
  if (kind === "add-detail") addToCart(id, detailQuantity);
  if (kind === "detail-quantity") { const product = findProduct(routeInfo().id); detailQuantity = Math.min(Math.max(1, Number(product?.stock) || 1), Math.max(1, detailQuantity + Number(action.dataset.delta))); document.querySelector("#detail-quantity").textContent = detailQuantity; }
  if (kind === "buy-now") { addToCart(id); go("cart"); }
  if (kind === "change-cart") { const next = Math.max(0, (Number(cart[id]) || 0) + Number(action.dataset.delta)); const product = findProduct(id); if (next > Number(product?.stock)) { showToast("管理画面で在庫を確認してから数量を変更してください"); return; } cart[id] = next; if (!cart[id]) delete cart[id]; persistCart(); renderCart(); }
  if (kind === "remove-cart") { delete cart[id]; persistCart(); renderCart(); showToast("カートから商品を削除しました"); }
  if (kind === "checkout") { if (!currentUser && !apiConfigured) go("auth"); else go("checkout"); }
  if (kind === "place-order") placeDemoOrder(action);
  if (kind === "clear-filter") { catalogFilter = { category: "すべて", query: "", min: "", max: "", sort: "おすすめ順" }; catalogPage = 1; renderHome(); }
  if (kind === "account-menu") { if (id === "logout") { currentUser = null; storage.set("pcparts-user", currentUser); showToast("ログアウトしました"); go("home"); } else go(id); }
  if (kind === "order-detail") {
    const order = getSampleOrders().find((item) => item.number === id);
    if (order) openModal("デモ注文内容", `${safeText(order.date)}のご注文（${safeText(order.number)}）<hr />${order.items.map((item) => {
      const product = findProduct(item.id);
      const name = item.name || product?.name || item.id;
      const unitPrice = Number(item.unitPrice ?? product?.price);
      return `<div class="summary-line"><span>${safeText(name)} × ${Number(item.quantity) || 0}</span><strong>${Number.isFinite(unitPrice) ? yen(unitPrice * Number(item.quantity)) : "—"}</strong></div>`;
    }).join("")}<div class="summary-total"><span>合計</span><strong>${yen(order.total)}</strong></div>${order.paymentLabel ? `<div class="summary-line"><span>支払い方法</span><strong>${safeText(order.paymentLabel)}</strong></div>` : ""}${order.paymentStore ? `<div class="summary-line"><span>お支払い先</span><strong>${safeText(order.paymentStore)}</strong></div>` : ""}${order.paymentCode ? `<div class="summary-line"><span>デモ払込番号</span><strong>${safeText(order.paymentCode)}</strong></div>` : ""}${order.paymentDeadline ? `<div class="summary-line"><span>期限（デモ）</span><strong>${safeText(order.paymentDeadline)}</strong></div>` : ""}<p class="summary-note">実際の決済・請求・発送は行われません。</p>`);
  }
  if (kind === "orders-refresh") { serverOrdersLoaded = false; refreshServerOrders(); renderOrders(); }
  if (kind === "wizard-back") { wizardStep = Math.max(0, wizardStep - 1); renderWizard(); }
  if (kind === "restart-wizard") { serverAiProposal = null; serverAiError = ""; wizardStep = 0; wizardAnswers = { budget: "", use: "", games: "", style: "", equipment: "", conditions: "" }; go("ai"); }
  if (kind === "add-build") { const ids = (action.dataset.ids || "").split(",").filter(Boolean); if (!ids.length) { showToast("カートに追加できる構成がありません"); return; } if (ids.some((productId) => !findProduct(productId)?.stock)) { showToast("在庫未確認の商品を含むため、管理画面で在庫確認が必要です"); return; } ids.forEach((productId) => { cart[productId] = (Number(cart[productId]) || 0) + 1; }); persistCart(); showToast("おすすめ構成をカートに追加しました"); go("cart"); }
  if (kind === "adjust-budget") { const currentBudget = parseBudget(wizardAnswers.budget) || 200000; wizardAnswers.budget = `${Math.max(100000, currentBudget - 20000).toLocaleString("ja-JP")}円`; renderAiResult(); showToast("予算を抑えた構成を再計算しました"); }
  if (kind === "admin-add") adminProductForm();
  if (kind === "catalog-page") { catalogPage = Math.max(1, Number(action.dataset.page) || 1); renderHome(); document.querySelector(".product-toolbar")?.scrollIntoView({ behavior: "smooth", block: "start" }); }
  if (kind === "admin-page") { adminPage = Math.max(1, Number(action.dataset.page) || 1); renderAdmin(); document.querySelector(".admin-toolbar")?.scrollIntoView({ behavior: "smooth", block: "start" }); }
  if (kind === "admin-import") adminImportForm();
  if (kind === "admin-import-confirm") {
    if (!pendingCatalogImport.length) return;
    action.disabled = true;
    importCatalog(pendingCatalogImport, (done, total) => { action.textContent = `取り込み中 ${done} / ${total} 件`; }).then((count) => {
      pendingCatalogImport = []; document.querySelector("#modal-root").innerHTML = ""; renderAdmin(); showToast(apiConfigured ? `${count} 件の商品候補を下書きに取り込みました` : `${count} 件の商品を登録しました`);
    }).catch((error) => { action.disabled = false; action.textContent = "下書きとして取り込む"; showToast(error.message || "商品候補の取り込みに失敗しました"); });
  }
  if (kind === "admin-edit") { const product = (apiConfigured ? adminProducts : products).find((item) => item.id === id); if (product) adminProductForm(product); }
  if (kind === "admin-delete") { const product = (apiConfigured ? adminProducts : products).find((item) => item.id === id); if (product) { const deactivate = apiConfigured && product.isActive !== false; openModal(deactivate ? "商品を非公開にする" : "商品を削除", `<p>「${safeText(product.name)}」を${deactivate ? "商品一覧から非公開に" : "管理画面から削除"}しますか？</p><div class="modal-form-actions"><button class="button button--outline" data-action="close-modal">戻る</button><button class="button button--danger" data-action="admin-confirm-delete" data-id="${safeText(product.id)}">${deactivate ? "非公開にする" : "削除する"}</button></div>`); } }
  if (kind === "admin-confirm-delete") {
    deleteAdminProduct(id);
  }
  if (kind === "admin-logout") {
    if (apiConfigured) apiRequest("admin/logout.php", { method: "POST", body: "{}" }).catch(() => {}).finally(() => { adminAuthenticated = false; adminStatusChecked = false; adminCatalogLoaded = false; adminProducts = []; go("admin-login"); });
    else go("home");
  }
  if (kind === "admin-refresh") { adminCatalogError = ""; refreshAdminCatalog(); }
  if (kind === "close-modal") { if (event.target.classList.contains("modal-backdrop") || event.target.closest(".modal-close") || event.target.closest("button[data-action='close-modal']")) document.querySelector("#modal-root").innerHTML = ""; }
  if (kind === "close-drawer") { if (event.target.classList.contains("drawer-backdrop") || event.target.closest(".drawer-close") || event.target.closest("button[data-action='close-drawer']")) closeDrawer(); }
});

document.addEventListener("change", (event) => {
  if (event.target.id === "sort-select") { catalogFilter.sort = event.target.value; catalogPage = 1; renderHome(); }
  if (event.target.id === "catalog-import-file") {
    const preview = document.querySelector("#catalog-import-preview");
    const confirm = document.querySelector("#catalog-import-confirm");
    pendingCatalogImport = [];
    confirm.disabled = true;
    const file = event.target.files?.[0];
    if (!file) { preview.textContent = "JSONファイルを選ぶと候補を確認できます。"; return; }
    file.text().then((text) => {
      const payload = JSON.parse(text);
      pendingCatalogImport = validateImportedCatalog(payload);
      const categories = Object.entries(Object.groupBy ? Object.groupBy(pendingCatalogImport, (item) => item.category) : pendingCatalogImport.reduce((groups, item) => ((groups[item.category] ||= []).push(item), groups), {})).map(([name, items]) => `${name} ${items.length}件`).join(" / ");
      const images = pendingCatalogImport.filter((item) => item.imageUrl).length;
      const links = pendingCatalogImport.filter((item) => item.productUrl).length;
      preview.textContent = `${pendingCatalogImport.length}件を${apiConfigured ? "下書きとして取り込みます" : "登録します"}。カテゴリ：${categories}。画像 ${images}件 / 販売ページ ${links}件。`;
      confirm.disabled = false;
    }).catch((error) => {
      preview.textContent = `読み込みできません：${error.message || "JSON形式を確認してください。"}`;
    });
  }
  if (event.target.closest("#admin-product-form") && event.target.name === "category") {
    const field = document.querySelector("#product-platform-field");
    const platform = field?.querySelector("select[name='platform']");
    const required = platformCategories.has(event.target.value);
    if (field && platform) { field.hidden = !required; platform.disabled = !required; platform.required = required; }
  }
});

document.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;
  if (form.id === "filter-form") {
    const data = new FormData(form); catalogFilter.min = data.get("min") || ""; catalogFilter.max = data.get("max") || ""; catalogFilter.category = data.get("category") || "すべて"; catalogFilter.query = data.get("query") || ""; catalogPage = 1; renderHome();
  }
  if (form.id === "admin-filter-form") {
    const data = new FormData(form); adminQuery = String(data.get("query") || ""); adminCategory = String(data.get("category") || "すべて"); adminPlatform = String(data.get("platform") || "すべて"); adminListingStatus = String(data.get("listingStatus") || "すべて"); adminPage = 1; renderAdmin();
  }
  if (form.id === "admin-product-form") {
    submitAdminProduct(form);
    return;
  }
  if (form.id === "header-search") {
    const input = document.querySelector("#header-query"); catalogFilter.query = input.value.trim(); catalogFilter.category = "すべて"; catalogPage = 1; go("home"); renderHome(); document.querySelector("#categories")?.scrollIntoView({ behavior: "smooth" });
  }
  if (form.id === "auth-form") {
    const data = new FormData(form); const mode = form.dataset.mode;
    if (mode === "admin-login" && apiConfigured) { signInAdmin(form); return; }
    if (mode === "register" && data.get("password") !== data.get("passwordConfirm")) { showToast("パスワードが一致しません"); return; }
    currentUser = { name: data.get("name") || "テストユーザー", email: data.get("email") || "user@example.com", address: "〒810-0001 福岡県福岡市中央区天神1-2-3" };
    storage.set("pcparts-user", currentUser); showToast(mode === "register" ? "アカウントを作成しました（デモ）" : "ログインしました（デモ）");
    if (mode === "admin-login") go("admin"); else if (cartQuantity()) go("checkout"); else go("account");
  }
  if (form.id === "profile-form") {
    const data = new FormData(form); currentUser = { ...(currentUser || {}), name: data.get("name"), email: data.get("email"), address: data.get("address") }; storage.set("pcparts-user", currentUser); showToast("会員情報を保存しました（デモ）"); renderProfile();
  }
  if (form.id === "wizard-form") {
    const question = wizardQuestions[wizardStep]; const data = new FormData(form); let answer = String(data.get("answer") || "").trim();
    if (!answer && question.required) { showToast("回答を入力してください"); return; }
    wizardAnswers[question.key] = answer;
    if (wizardStep < wizardQuestions.length - 1) { wizardStep += 1; renderWizard(); }
    else if (apiConfigured) {
      app.innerHTML = `<div class="panel empty-state"><div class="wizard-bot-icon">✳</div><h2>条件に合う構成を考えています</h2><p>当店の商品と、設定されている外部APIの参考情報を確認しています。</p></div>`;
      const consultation = {
        budgetText: wizardAnswers.budget, useCase: wizardAnswers.use, gamesAndTasks: wizardAnswers.games,
        designAndPerformance: wizardAnswers.style, ownedEquipment: wizardAnswers.equipment, otherConditions: wizardAnswers.conditions,
      };
      apiRequest("ai/consult.php", { method: "POST", body: JSON.stringify(consultation) })
        .then((proposal) => { serverAiError = ""; serverAiProposal = proposal; go("ai-result"); })
        .catch((error) => { serverAiProposal = null; serverAiError = error.message || "接続を確認してください。"; go("ai-result"); });
    } else go("ai-result");
  }
});

document.addEventListener("change", (event) => {
  if (event.target.matches(".choice-card input")) {
    event.target.closest(".choice-grid").querySelectorAll(".choice-card").forEach((card) => card.classList.remove("is-selected"));
    event.target.closest(".choice-card").classList.add("is-selected");
  }
  if (event.target.matches('input[name="payment"]')) {
    selectedPayment = event.target.value;
    renderCheckout();
  }
});

document.querySelector("#mobile-menu-button").addEventListener("click", () => {
  if (document.querySelector("#drawer-root").innerHTML) closeDrawer(); else openDrawer();
});
document.querySelector("#support-button").addEventListener("click", () => openModal("PC構成の相談", `<p>予算や遊びたいゲームが決まっていたら、AI相談からおすすめ構成を試せます。</p><button class='button button--wide' data-go='ai'>AI構成相談をはじめる</button>`));
window.addEventListener("hashchange", renderRoute);
if (apiConfigured) products.splice(0, products.length);
renderRoute();
if (apiConfigured) refreshServerCatalog();
