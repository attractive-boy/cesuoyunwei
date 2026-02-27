import Link from 'next/link';
import RecentSubmissions from '../components/RecentSubmissions';

export default function Home() {
  return (
    <main style={{ padding: 20 }}>
      <h1>交通厕所运维评价系统</h1>
      <nav>
        <ul>
          <li><Link href="/forms/new">填写评价表</Link></li>
          <li><Link href="/forms">查看评价表</Link></li>
          <li><Link href="/users">用户管理</Link></li>
        </ul>
      </nav>
      <section>
        <RecentSubmissions />
      </section>
    </main>
  );
}
