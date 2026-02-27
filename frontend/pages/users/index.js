import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/users');
    const j = await res.json();
    setUsers(j || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function del(id) {
    if (!confirm('确认删除此用户？')) return;
    await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>用户管理</h1>
      <p><Link href="/users/new">创建新用户</Link></p>
      {loading ? <p>加载中...</p> : (
        <table border="1" cellPadding="6">
          <thead><tr><th>ID</th><th>Email</th><th>姓名</th><th>角色</th><th>操作</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>{u.name || '-'}</td>
                <td>{u.role}</td>
                <td>
                  <Link href={`/users/${u.id}`}>编辑</Link>
                  {' '}
                  <button onClick={() => del(u.id)} style={{ marginLeft: 8 }}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
