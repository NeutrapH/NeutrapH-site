const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
test('Treatment guide and diagram describe the same complete journey in the same order', () => {
 const script = fs.readFileSync(path.join(root,'assets/js/purification-flow.js'),'utf8');
 const html = fs.readFileSync(path.join(root,'water-purification.html'),'utf8');
 const stages = Array.from(vm.runInNewContext(script.match(/const stages=(\[[\s\S]*?\n \]);/)[1]), stage => stage[0]);
 const strip = html.match(/<ol class="journey-strip"[\s\S]*?<\/ol>/)[0];
 const guide = html.match(/<div class="learn-grid">[\s\S]*?<\/article><\/div>/)[0];
 assert.deepEqual([...strip.matchAll(/<li><span>\d+<\/span>([^<]+)<\/li>/g)].map(m => m[1]),stages);
 assert.deepEqual([...guide.matchAll(/<h3>([^<]+)<\/h3>/g)].map(m => m[1]),stages);
 assert.ok(stages.indexOf('Activated carbon') < stages.indexOf('Water softener'));
 assert.ok(stages.indexOf('Water softener') < stages.indexOf('Pressure pump'));
 assert.equal((html.match(/class="flow-stage"/g)||[]).length,stages.length);
});
