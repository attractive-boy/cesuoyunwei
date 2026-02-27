const prisma = require('../../lib/prismaClient');

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
      return res.status(200).json(users);
    }

    if (req.method === 'POST') {
      const { email, name, role, azureId } = req.body;
      if (!email) return res.status(400).json({ error: 'email required' });
      const created = await prisma.user.create({ data: { email, name, role: role || 'viewer', azureId } });
      return res.status(201).json(created);
    }

    if (req.method === 'PUT') {
      const { id, email, name, role, azureId } = req.body;
      if (!id) return res.status(400).json({ error: 'id required' });
      const updated = await prisma.user.update({ where: { id: Number(id) }, data: { email, name, role, azureId } });
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'id required' });
      await prisma.user.delete({ where: { id: Number(id) } });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('users api error', err);
    return res.status(500).json({ error: 'internal' });
  }
}
