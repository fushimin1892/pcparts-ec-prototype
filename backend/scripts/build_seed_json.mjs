import { readFile, writeFile } from "node:fs/promises";
import vm from "node:vm";

const appSource = await readFile(new URL("../../app.js", import.meta.url), "utf8");
const baseMatch = appSource.match(/^const products = (\[[\s\S]*?\n\]);/m);
const seedStart = appSource.indexOf("function cpuSeed(");
const seedEnd = appSource.indexOf("\nfor (const cpu of seededCpuProducts)", seedStart);
if (!baseMatch || seedStart < 0 || seedEnd < 0) throw new Error("Could not find product seed data in app.js");

const baseProducts = vm.runInNewContext(`(${baseMatch[1]})`);
const seedScope = {};
vm.runInNewContext(`${appSource.slice(seedStart, seedEnd)}\nglobalThis.output = seededCpuProducts;`, seedScope);
const allProducts = [...baseProducts.map((product) => ({ ...product, isDemoPrice: true })), ...seedScope.output];
await writeFile(new URL("../../database/seed_products.json", import.meta.url), `${JSON.stringify(allProducts, null, 2)}\n`);
console.log(`Wrote ${allProducts.length} catalog products (${allProducts.filter(({ category }) => category === "CPU").length} CPUs).`);
