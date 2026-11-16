const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

function load(relative, backend = {}, admin = false, cache = new Map()) {
  const filename = path.resolve(__dirname, '..', relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = { exports: {} };
  cache.set(filename, module);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const localRequire = (name) => {
    if (name.endsWith('/supabase')) return backend;
    if (name.endsWith('/AuthContext')) return { useAuth: () => ({ isAdmin: admin }) };
    if (name.endsWith('/PortfolioDataContext')) return { usePortfolioData: () => ({ data: backend.portfolioData }) };
    if (!name.startsWith('.')) return require(name);
    const base = path.resolve(path.dirname(filename), name);
    const resolved = ['.tsx', '.ts', '.js'].map((extension) => base + extension).find(fs.existsSync);
    return load(path.relative(path.resolve(__dirname, '..'), resolved), backend, admin, cache);
  };
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`, { filename })(localRequire, module, module.exports);
  return module.exports;
}

test('enforces image and PDF file types and size limits', () => {
  const { validateUploadFile: validate } = load('src/lib/storage.ts');
  for (const type of ['image/jpeg','image/png','image/webp','image/svg+xml']) {
    assert.equal(validate({ type, size: 5 * 1024 * 1024 }, 'image').valid, true);
    assert.equal(validate({ type, size: 5 * 1024 * 1024 + 1 }, 'image').valid, false);
  }
  assert.equal(validate({ type: 'application/pdf', size: 10 * 1024 * 1024 }, 'document').valid, true);
  assert.equal(validate({ type: 'application/pdf', size: 10 * 1024 * 1024 + 1 }, 'document').valid, false);
  assert.equal(validate({ type: 'text/html', size: 1 }, 'image').valid, false);
  assert.equal(validate({ type: 'image/png', size: 1 }, 'document').valid, false);
});

test('wrong-bucket uploads fail and PDF names are unique without public URLs', async () => {
  const paths = [];
  const { uploadStorageFile: upload } = load('src/lib/storage.ts', { isSupabaseConfigured: true,
    supabase: { storage: { from: (bucket) => ({ upload: async (path) => { paths.push([bucket,path]); return { error: null }; },
      getPublicUrl: (path) => ({ data: { publicUrl: 'https://assets.example/' + path } }) }) } } });
  const file = new File(['pdf'], 'Certificate.pdf', { type: 'application/pdf' });
  assert.equal((await upload(file, 'portfolio-media')).success, false);
  assert.equal(paths.length, 0);
  const first = await upload(file, 'portfolio-documents', 'attachments');
  const second = await upload(file, 'portfolio-documents', 'attachments');
  assert.equal(first.success, true);
  assert.notEqual(first.path, second.path);
  assert.equal(first.publicUrl, undefined);
});

test('cloud upload rejection is reported as failure', async () => {
  const { uploadStorageFile: upload } = load('src/lib/storage.ts', { isSupabaseConfigured: true,
    supabase: { storage: { from: () => ({ upload: async () => ({ error: { message: 'Permission denied' } }) }) } } });
  const result = await upload(new File(['png'], 'a.png', { type: 'image/png' }), 'portfolio-media');
  assert.equal(result.success, false);
  assert.equal(result.error, 'Permission denied');
});

test('lists nested upload folders and paginates beyond 100 files', async () => {
  const children = Array.from({ length: 102 }, (_, i) => ({ id: String(i), name: `image-${i}.png` }));
  const { listStorageFiles: list } = load('src/lib/storage.ts', { isSupabaseConfigured: true,
    supabase: { storage: { from: () => ({ list: async (prefix, options) => ({ data:
      (prefix ? children : [{ id: null, name: 'projects' }]).slice(options.offset, options.offset + options.limit), error: null }),
      getPublicUrl: (path) => ({ data: { publicUrl: 'https://assets.example/' + path } }) }) } } });
  const result = await list('portfolio-media');
  assert.equal(result.success, true);
  assert.equal(result.files.length, 102);
  assert.equal(result.files[0].path, 'projects/image-0.png');
});

test('optional uploader is visible before any blocks exist', () => {
  const { ContentBlocksEditor } = load('src/components/admin/ContentBlocksEditor.tsx');
  const html = renderToStaticMarkup(React.createElement(ContentBlocksEditor, { blocks: [], onChange() {} }));
  for (const text of ['Optional', 'Choose files', 'type="file"', 'application/pdf', 'Choose existing PDF']) assert.ok(html.includes(text), text);
});

test('private PDF preview actions are restricted to the administrator', () => {
  const block = { id: 'pdf', type: 'document_preview', documentTitle: 'Certificate', documentType: 'pdf', documentUrl: 'attachments/private.pdf', allowDownload: false };
  const Public = load('src/components/blocks/DocumentPreview.tsx').DocumentPreview;
  const publicHtml = renderToStaticMarkup(React.createElement(Public, { block }));
  assert.match(publicHtml, /Admin preview only/);
  assert.doesNotMatch(publicHtml, /<button|<iframe|href=/);
  const Admin = load('src/components/blocks/DocumentPreview.tsx', {}, true).DocumentPreview;
  assert.match(renderToStaticMarkup(React.createElement(Admin, { block })), /Preview document/);
});

test('public project detail renders uploaded attachments and no setup-plan copy', () => {
  const project = { id: 'p', slug: 'project', title: 'Project', subtitle: '', category: 'Web', stageLabel: 'Live', projectStage: 'live', updatedAt: '2026', description: 'A real project', techStack: ['React'], keyHighlights: [], challenges: [], coverImage: 'https://assets.example/cover.png', contentBlocks: [
    { id: 'image', type: 'single_image', url: 'https://assets.example/screenshot.png', altText: 'Project screenshot' },
  ] };
  const { ProjectDetailPage } = load('src/pages/ProjectDetailPage.tsx', { portfolioData: { projects: [project] } });
  const { MemoryRouter, Routes, Route } = require('react-router-dom');
  const html = renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: ['/projects/project'] },
    React.createElement(Routes, null, React.createElement(Route, { path: '/projects/:slug', element: React.createElement(ProjectDetailPage) }))));
  assert.match(html, /https:\/\/assets\.example\/screenshot\.png/);
  assert.match(html, /https:\/\/assets\.example\/cover\.png/);
  assert.doesNotMatch(html, /Phase 2|Schema Mapping|CMS Readiness/);
});
