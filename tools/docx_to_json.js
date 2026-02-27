// Minimal docx -> JSON schema extractor (prototype)
// Usage: node tools/docx_to_json.js path/to/form.docx > schema.json

const fs = require('fs');
const mammoth = require('mammoth');

async function extract(path) {
  const result = await mammoth.extractRawText({ path });
  const text = result.value;
  // NOTE: Full structural extraction requires manual mapping.
  // For now output a placeholder schema with raw text included for review.
  const schema = {
    title: 'Extracted form (raw text)',
    description: 'Auto-extracted raw text from docx; manual mapping required to build JSON Schema.',
    rawText: text,
    properties: {}
  };
  console.log(JSON.stringify(schema, null, 2));
}

const p = process.argv[2];
if (!p) {
  console.error('Usage: node tools/docx_to_json.js <path-to-docx>');
  process.exit(2);
}
extract(p).catch(err => { console.error(err); process.exit(1); });