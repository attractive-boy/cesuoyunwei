const { createRequest, createResponse } = require('node-mocks-http');
const prisma = require('../../lib/prismaClient');
// ensure mockable properties exist
prisma.formTemplate = prisma.formTemplate || {};
prisma.formSubmission = prisma.formSubmission || {};
const handler = require('../../pages/api/forms/submissions').default || require('../../pages/api/forms/submissions');

describe('POST /api/forms/submissions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    prisma.formTemplate.findUnique = jest.fn();
    prisma.formSubmission.create = jest.fn();
  });

  it('returns 400 if required fields missing', async () => {
    const req = createRequest({ method: 'POST', body: {} });
    const res = createResponse();
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  it('returns 400 when data fails schema validation', async () => {
    // template requires property 'a' to be present
    prisma.formTemplate.findUnique.mockResolvedValue({ schemaJson: { type: 'object', required: ['a'], properties: { a: { type: 'string' } } } });

    const req = createRequest({ method: 'POST', body: { templateId: 1, dataJson: { } } });
    const res = createResponse();
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    const data = res._getJSONData();
    expect(data).toHaveProperty('error', 'Validation failed');
  });

  it('creates submission when data is valid', async () => {
    prisma.formTemplate.findUnique.mockResolvedValue({ schemaJson: { type: 'object', properties: { a: { type: 'string' } } } });
    prisma.formSubmission.create.mockResolvedValue({ id: 123, templateId: 1, dataJson: { a: 'ok' } });

    const req = createRequest({ method: 'POST', body: { templateId: 1, dataJson: { a: 'ok' } } });
    const res = createResponse();
    await handler(req, res);
    expect(res._getStatusCode()).toBe(201);
    const data = res._getJSONData();
    expect(data).toHaveProperty('id', 123);
  });
});
