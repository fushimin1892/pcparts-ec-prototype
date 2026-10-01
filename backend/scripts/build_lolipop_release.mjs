import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const backendRoot = path.join(projectRoot, 'backend');
const publicRoot = path.join(backendRoot, 'public');
const outputRoot = path.join(backendRoot, 'dist-lolipop');
const privateRoot = path.join(outputRoot, '_private');
const basePathArg = process.argv.find((value) => value.startsWith('--base-path='))?.slice('--base-path='.length) ?? '';
const basePath = basePathArg === '' || basePathArg === '/' ? '' : `/${basePathArg.replace(/^\/+|\/+$/g, '')}`;
if (basePath && (!/^\/[A-Za-z0-9/_-]+$/.test(basePath) || basePath.slice(1).split('/').some((part) => part === '.' || part === '..' || part === ''))) {
  throw new Error('Use a safe site path such as --base-path=/pcparts.');
}

if (path.dirname(outputRoot) !== backendRoot || path.basename(outputRoot) !== 'dist-lolipop') {
  throw new Error(`Refusing to clear an unexpected output directory: ${outputRoot}`);
}
await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });
await mkdir(path.join(outputRoot, 'api'), { recursive: true });
await mkdir(path.join(privateRoot, 'src'), { recursive: true });
await mkdir(path.join(privateRoot, 'scripts'), { recursive: true });

for (const file of ['index.html', 'styles.css', 'app.js']) {
  await cp(path.join(projectRoot, file), path.join(outputRoot, file));
}
await writeFile(path.join(outputRoot, 'config.js'), `window.PC_PARTS_API_BASE_URL = "${basePath}/api";\n`);
await cp(path.join(publicRoot, 'api'), path.join(outputRoot, 'api'), { recursive: true, force: true });
await cp(path.join(backendRoot, 'src'), path.join(privateRoot, 'src'), { recursive: true, force: true });
for (const script of ['create_admin.php', 'generate_admin_sql.php', 'seed_catalog.php']) {
  await cp(path.join(backendRoot, 'scripts', script), path.join(privateRoot, 'scripts', script));
}
await cp(path.join(projectRoot, 'database'), path.join(outputRoot, 'database'), { recursive: true, force: true });
await cp(path.join(backendRoot, 'config.production.php.example'), path.join(privateRoot, 'config.local.php.example'));

const schemaPath = path.join(outputRoot, 'database', 'schema.sql');
const schema = await readFile(schemaPath, 'utf8');
const schemaForExistingDb = schema.replace(/^CREATE DATABASE IF NOT EXISTS pc_parts_shop[\s\S]*?USE pc_parts_shop;\r?\n\r?\n/, '');
if (schemaForExistingDb === schema) throw new Error('Could not prepare the schema for the hosting provider database.');
await writeFile(schemaPath, `-- Import this file after selecting the database in phpMyAdmin.\n${schemaForExistingDb}`);

const apiRoot = path.join(outputRoot, 'api');
const normalize = (value) => value.split(path.sep).join('/');
async function rewritePhpIncludes(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await rewritePhpIncludes(filePath);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith('.php')) continue;
    const relative = path.relative(path.dirname(filePath), path.join(privateRoot, 'src', 'bootstrap.php'));
    const includePath = normalize(relative);
    const source = await readFile(filePath, 'utf8');
    const updated = source.replace(/require_once\s+__DIR__\s*\.\s*'[^']*src\/bootstrap\.php';/g, `require_once __DIR__ . '/${includePath}';`);
    await writeFile(filePath, updated);
  }
}
await rewritePhpIncludes(apiRoot);

await writeFile(path.join(privateRoot, '.htaccess'), `Options -Indexes\n<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n  Deny from all\n</IfModule>\n`);
await writeFile(path.join(outputRoot, '.htaccess'), `Options -Indexes\n`);
await writeFile(path.join(outputRoot, 'README-DEPLOY.txt'), `PC PARTS SHOP - Lolipop release\n\n1. Create a MySQL database in the Lolipop control panel.\n2. Copy _private/config.local.php.example to _private/config.local.php and enter the DB connection values. Keep SESSION_SECURE=true on HTTPS.\n3. Import database/schema.sql after selecting the created DB in phpMyAdmin.\n4. Upload every file and folder in this package to the configured path using FTPS.\n5. Check https://YOUR-DOMAIN${basePath}/api/health.php. It should report database=connected.\n6. With SSH, run _private/scripts/seed_catalog.php and create the admin using _private/scripts/create_admin.php. Without SSH, generate admin SQL on a trusted local XAMPP PHP install using the project README instructions, then execute it in phpMyAdmin.\n7. Sign in to the admin page and register real products.\n\nKeep _private/.htaccess in place. Do not put DB passwords or API keys in config.js.\nOnly deploy this package to a PHP-enabled hosting plan. XAMPP is for local development, not internet-facing production.\n`);

console.log(`Built Lolipop release package: ${outputRoot}`);
