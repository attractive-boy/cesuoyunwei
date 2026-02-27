import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function RecentSubmissions() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/forms/submissions').then(r => r.json()).then(setItems).catch(() => {});
  }, []);

  if (!items || items.length === 0) return <div>暂无最近提交</div>;

  return (
    <div>
      <h3>最近提交</h3>
      <ul>
        {items.slice(0,10).map(it => (
          <li key={it.id}>
            <Link href={`/forms/${it.id}`}>#{it.id}</Link> — {it.template?.name || '模板'} — {it.submitter?.name || it.submitterId || '匿名'} — {new Date(it.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
