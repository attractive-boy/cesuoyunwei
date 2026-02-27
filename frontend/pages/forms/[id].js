import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Form from '@rjsf/core';

export default function ViewForm() {
  const { query } = useRouter();
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (!query.id) return;
    fetch(`/api/forms/submissions?id=${query.id}`).then(r => r.json()).then(setItem);
  }, [query.id]);

  if (!item) return <div style={{ padding: 20 }}>加载中...</div>;
  return (
    <main style={{ padding: 20 }}>
      <h1>查看提交 #{item.id}</h1>
      <section style={{ marginTop: 16 }}>
        <h2>填报数据</h2>
        <Form schema={item.template?.schemaJson || {}} formData={item.dataJson} disabled />
      </section>
      <pre style={{ marginTop: 16 }}>{JSON.stringify(item, null, 2)}</pre>
    </main>
  );
}
