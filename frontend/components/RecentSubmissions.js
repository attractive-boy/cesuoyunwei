import { useEffect, useState } from 'react';
import Link from 'next/link';
import { List, Typography } from 'antd';

const { Text } = Typography;

export default function RecentSubmissions() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/forms/submissions').then(r => r.json()).then(setItems).catch(() => {});
  }, []);

  if (!items || items.length === 0) return <div>暂无最近提交</div>;

  return (
    <List
      dataSource={items.slice(0, 10)}
      renderItem={it => (
        <List.Item key={it.id}>
          <List.Item.Meta
            title={<Link href={`/forms/${it.id}`}>#{it.id} — {it.template?.name || '模板'}</Link>}
            description={<Text type="secondary">{it.submitter?.name || it.submitterId || '匿名'} — {new Date(it.createdAt).toLocaleString()}</Text>}
          />
        </List.Item>
      )}
    />
  );
}
