// Run with: node --test
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// content.js is a plain content script, so load it into a sandbox with just
// enough browser stubs for it to start up.
function loadContentScript() {
  const sandbox = {
    URL,
    document: { body: {}, querySelectorAll: () => [] },
    MutationObserver: class {
      observe() {}
    },
  };
  const source = fs.readFileSync(path.join(__dirname, "..", "content.js"), "utf8");
  vm.runInNewContext(source, sandbox);
  return sandbox;
}

const { parseHttpUrl } = loadContentScript();

test("a bare link is treated as a link", () => {
  assert.strictEqual(
    parseHttpUrl("https://maps.app.goo.gl/WsQBN96swxzgx19t8?g_st=ic"),
    "https://maps.app.goo.gl/WsQBN96swxzgx19t8?g_st=ic"
  );
  assert.strictEqual(parseHttpUrl("http://example.com/a"), "http://example.com/a");
});

test("surrounding whitespace is ignored", () => {
  assert.strictEqual(parseHttpUrl("  https://example.com/a \n"), "https://example.com/a");
});

test("plain addresses are not links", () => {
  assert.strictEqual(parseHttpUrl("1600 Amphitheatre Pkwy, Mountain View, CA"), null);
  assert.strictEqual(parseHttpUrl("example.com"), null);
  assert.strictEqual(parseHttpUrl(""), null);
});

test("text that only contains a link is not a link", () => {
  assert.strictEqual(parseHttpUrl("Joe's Pizza https://maps.app.goo.gl/abc"), null);
  assert.strictEqual(parseHttpUrl("https://a.example https://b.example"), null);
});

test("non-http schemes are not links", () => {
  assert.strictEqual(parseHttpUrl("javascript:alert(1)"), null);
  assert.strictEqual(parseHttpUrl("ftp://example.com/file"), null);
});

test("malformed urls are not links", () => {
  assert.strictEqual(parseHttpUrl("https://"), null);
  assert.strictEqual(parseHttpUrl("http://[bad"), null);
});
