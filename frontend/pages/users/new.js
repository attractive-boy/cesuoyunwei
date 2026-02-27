import { useState } from 'react';
import { useRouter } from 'next/router';

export default function NewUser() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('viewer');
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, name, role }) });
    if (res.ok) router.push('/users'); else alert('创建失败');
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>创建用户</h1>
      <form onSubmit={submit}>
        <div><label>邮箱：<input value={email} onChange={e => setEmail(e.target.value)} required /></label></div>
        <div><label>姓名：<input value={name} onChange={e => setName(e.target.value)} /></label></div>
        <div>
          <label>角色：
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="viewer">viewer</option>
              <option value="editor">editor</option>
              <option value="admin">admin</option>
            </select>
          </label>
        </div>
        <div style={{ marginTop: 8 }}><button type="submit">创建</button></div>
      </form>
    </main>
  );
}
