// Simple middleware placeholder to check session and role. Integrate with NextAuth on server side.
import { getSession } from 'next-auth/react';

export async function requireRole(req, res, role) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  const userRole = session.user?.role || 'viewer';
  if (role === 'admin' && userRole !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  return { ok: true, session };
}
