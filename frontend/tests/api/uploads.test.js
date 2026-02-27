const { createRequest, createResponse } = require('node-mocks-http');

// Provide env values so handler doesn't return 500
process.env.AZURE_STORAGE_CONNECTION_STRING = 'UseMock';
process.env.AZURE_STORAGE_CONTAINER_NAME = 'images';

// Mock Azure Blob SDK
jest.mock('@azure/storage-blob', () => ({
  BlobServiceClient: {
    fromConnectionString: () => ({
      getContainerClient: () => ({
        createIfNotExists: async () => {},
        getBlockBlobClient: (name) => ({
          uploadData: jest.fn().mockResolvedValue({}),
          url: `https://fake.blob.core.windows.net/images/${name}`,
        }),
      }),
    }),
  },
}));

const handler = require('../../pages/api/uploads');

describe('POST /api/uploads', () => {
  it('accepts a small PNG data URL and returns URL and metadata', async () => {
    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
    const req = createRequest({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: { name: 'tiny.png', data: `data:image/png;base64,${pngBase64}` }
    });
    const res = createResponse({ eventEmitter: require('events').EventEmitter });

    await handler(req, res);

    const status = res._getStatusCode();
    const data = res._getJSONData();
    expect(status).toBe(200);
    expect(data).toHaveProperty('url');
    expect(data).toHaveProperty('mime', 'image/png');
  });

  it('rejects unsupported mime types', async () => {
    const req = createRequest({ method: 'POST', body: { name: 'file.exe', data: 'data:application/octet-stream;base64,AAAA' } });
    const res = createResponse();
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    const d = res._getJSONData();
    expect(d.error).toMatch(/file type not allowed/i);
  });
});
