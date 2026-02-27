const path = require('path');
const prisma = require(path.join(process.cwd(), 'lib', 'prismaClient'));
const Ajv = require('ajv');

const ajv = new Ajv();

module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    const { templateId, dataJson, submitterId } = req.body;
    if (!templateId || !dataJson) return res.status(400).json({ error: 'templateId and dataJson required' });

    // Load template schema
    const template = await prisma.formTemplate.findUnique({ where: { id: Number(templateId) } });
    if (!template) return res.status(404).json({ error: 'Template not found' });

    // Validate against schema
    try {
      const validate = ajv.compile(template.schemaJson);
      const valid = validate(dataJson);
      if (!valid) return res.status(400).json({ error: 'Validation failed', details: validate.errors });
    } catch (err) {
      console.error('Schema validation error:', err);
      return res.status(500).json({ error: 'Schema validation error' });
    }

    const created = await prisma.formSubmission.create({
      data: { templateId: Number(templateId), dataJson, submitterId: submitterId ? Number(submitterId) : null }
    });
    return res.status(201).json(created);
  }

  if (req.method === 'GET') {
    const { id } = req.query;
    if (id) {
      const item = await prisma.formSubmission.findUnique({ where: { id: Number(id) }, include: { template: true, submitter: true } });
      if (!item) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(item);
    }
    const list = await prisma.formSubmission.findMany({ take: 50, orderBy: { createdAt: 'desc' } });
    return res.status(200).json(list);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
