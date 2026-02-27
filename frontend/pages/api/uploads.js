import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ensure upload dir exists
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (err) {
    console.error('mkdir failed', err);
  }

  const form = formidable({ multiples: true, uploadDir, keepExtensions: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('form parse error', err);
      return res.status(500).json({ error: 'Upload error' });
    }
    // normalize files
    const uploaded = [];
    const fileObjs = Array.isArray(files.file) ? files.file : (files.file ? [files.file] : []);
    for (const f of fileObjs) {
      const filename = path.basename(f.filepath || f.path || f.newFilename || f.originalFilename);
      const url = `/uploads/${filename}`;
      uploaded.push({ url, name: filename, size: f.size });
    }
    return res.status(200).json({ files: uploaded });
  });
}
