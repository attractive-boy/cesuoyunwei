import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch('/api/users').then(r => r.json()).then(list => {
      const u = list.find(x => String(x.id) === String(id));
      setUser(u);
      setLoading(false);
    });
  }, [id]);

  async function save(e) {
    e.preventDefault();
    const res = await fetch('/api/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user) });
    if (res.ok) router.push('/users'); else alert('保存失败');
  }

  if (loading) return <div style={{ padding: 20 }}>加载中...</div>;
  if (!user) return <div style={{ padding: 20 }}>未找到用户</div>;

  return (
    <main style={{ padding: 20 }}>
      <h1>编辑用户 #{user.id}</h1>
      <form onSubmit={save}>
        <div><label>邮箱：<input value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} required /></label></div>
        <div><label>姓名：<input value={user.name || ''} onChange={e => setUser({ ...user, name: e.target.value })} /></label></div>
        <div>
          <label>角色：
            <select value={user.role} onChange={e => setUser({ ...user, role: e.target.value })}>
              <option value="viewer">viewer</option>
              <option value="editor">editor</option>
              <option value="admin">admin</option>
            </select>
          </label>
        </div>
        <div style={{ marginTop: 8 }}>
          <button type="submit">保存</button>
          <button type="button" style={{ marginLeft: 8 }} onClick={() => router.push('/users')}>取消</button>
        </div>
      </form>
    </main>
  );
}
