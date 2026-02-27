import { useState, useEffect } from 'react';
import Form from '@rjsf/core';

export default function NewForm() {
  const [status, setStatus] = useState('');
  const [schema, setSchema] = useState(null);
  const [templateId, setTemplateId] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // load first template by default
    fetch('/api/forms/templates').then(r => r.json()).then(list => {
      if (Array.isArray(list) && list.length > 0) {
        const t = list[0];
        setTemplateId(t.id);
        setSchema(t.schemaJson);
      }
    }).catch(() => {});
  }, []);

  async function onSubmit({ formData }) {
    setStatus('提交中...');
    // merge attachments into submitted data
    const payload = { templateId, dataJson: { ...formData, attachments } };
    const res = await fetch('/api/forms/submissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) setStatus('提交成功');
    else {
      const err = await res.json().catch(() => ({}));
      setStatus('提交失败: ' + (err.error || res.statusText));
    }
  }

  if (!schema) return <div style={{ padding: 20 }}>加载表单模板中...</div>;

  return (
    <main style={{ padding: 20 }}>
      <h1>填写评价表</h1>
      <Form schema={schema} onSubmit={onSubmit} />
      <section style={{ marginTop: 16 }}>
        <h3>附件上传</h3>
        <input type="file" multiple onChange={async (e) => {
          const files = Array.from(e.target.files || []);
          if (files.length === 0) return;
          setUploading(true);
          try {
            for (const f of files) {
              const reader = new FileReader();
              const data = await new Promise((resolve, reject) => {
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(f);
              });
              const r = await fetch('/api/uploads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: f.name, data }) });
              const j = await r.json();
              if (j.url) setAttachments(prev => prev.concat(j.url));
            }
          } catch (err) {
            console.error('upload error', err);
          } finally { setUploading(false); }
        }} />
        <div>
          {uploading ? <em>上传中...</em> : null}
          {attachments.length > 0 && (
            <ul>
              {attachments.map((a,i) => <li key={i}><a href={a} target="_blank" rel="noreferrer">{a}</a></li>)}
            </ul>
          )}
        </div>
      </section>
      <p>{status}</p>
    </main>
  );
}
