const { BlobServiceClient } = require('@azure/storage-blob');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Expect JSON: { name: string, data: 'data:<mime>;base64,<payload>' }
  const { name, data } = req.body;
  if (!name || !data) return res.status(400).json({ error: 'name and data required' });

  const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'];
  const matches = String(data).match(/^data:(.+);base64,(.+)$/);
  if (!matches) return res.status(400).json({ error: 'invalid data format' });
  const mime = matches[1];
  const b64 = matches[2];
  if (!allowed.includes(mime)) return res.status(400).json({ error: 'file type not allowed' });

  const buffer = Buffer.from(b64, 'base64');
  const MAX_BYTES = 5 * 1024 * 1024;
  if (buffer.length > MAX_BYTES) return res.status(413).json({ error: 'file too large' });

  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'images';
  if (!connectionString) return res.status(500).json({ error: 'azure storage not configured' });

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    // create container if not exists
    await containerClient.createIfNotExists();

    const blobName = `${Date.now()}-${name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(buffer, { blobHTTPHeaders: { blobContentType: mime } });
    const url = blockBlobClient.url;
    return res.status(200).json({ url, name: blobName, size: buffer.length, mime });
  } catch (err) {
    console.error('azure upload error', err);
    return res.status(500).json({ error: 'upload error' });
  }
};
