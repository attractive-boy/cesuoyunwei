import { signIn } from 'next-auth/react';

export default function Login() {
  return (
    <div style={{ padding: 20 }}>
      <h1>登录</h1>
      <button onClick={() => signIn('azure-ad')}>使用 Azure 登录</button>
      <p>或联系管理员获取本地账号。</p>
    </div>
  );
}
