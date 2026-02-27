import { useState, useEffect } from 'react';
import { Form as AntForm, Input, Button, Select, Switch, InputNumber, Space, notification } from 'antd';
import MainLayout from '../../components/MainLayout';
import { useRouter } from 'next/router';

const { TextArea } = Input;

export default function NewForm() {
  const [toilets, setToilets] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/toilets').then(r => r.json()).then(setToilets).catch(() => setToilets([]));
  }, []);

  async function handleUploadFiles(files) {
    const uploaded = [];
    setUploading(true);
    try {
      for (const f of files) {
        const reader = new FileReader();
        const data = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(f);
        });
        const r = await fetch(`${API_BASE}/api/uploads`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: f.name, data }) });
        const j = await r.json();
        if (j.url) uploaded.push(j.url);
      }
    } catch (err) {
      console.error(err);
      notification.error({ message: '上传失败' });
    } finally {
      setUploading(false);
      setAttachments(prev => prev.concat(uploaded));
    }
  }

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

  async function onFinish(values) {
    // append attachments to notes
    let notes = values.notes || '';
    if (attachments.length) notes += '\nAttachments:\n' + attachments.join('\n');
    const payload = {
      toiletId: values.toiletId,
      facilityIntact: values.facilityIntact,
      hygiene: values.hygiene,
      comfortScore: values.comfortScore,
      managementCompliance: values.managementCompliance,
      serviceExtension: values.serviceExtension,
      notes,
    };
    const res = await fetch(`${API_BASE}/api/maintenance`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      notification.success({ message: '提交成功' });
      router.push('/forms');
    } else {
      const err = await res.json().catch(() => ({}));
      notification.error({ message: '提交失败', description: err.error || res.statusText });
    }
  }

  return (
    <MainLayout selected="/forms/new">
      <h2>填写评价表</h2>
      <AntForm layout="vertical" onFinish={onFinish} initialValues={{ comfortScore: 3, openingHours: 14 }}>
        <AntForm.Item name="toiletId" label="选择厕所" rules={[{ required: true, message: '请选择厕所' }]}>
          <Select placeholder="请选择厕所">
            {toilets.map(t => <Select.Option key={t.id} value={t.id}>{t.name} — {t.location}</Select.Option>)}
          </Select>
        </AntForm.Item>

        <h3>基本信息</h3>
        <AntForm.Item name="evaluatingUnit" label="评定单位">
          <Input />
        </AntForm.Item>
        <AntForm.Item name="evaluationDate" label="评定时间">
          <Input type="date" />
        </AntForm.Item>
        <AntForm.Item name="evaluators" label="评定人员">
          <Input />
        </AntForm.Item>

        <h3>设施完好</h3>
        <AntForm.Item name="toiletType" label="厕所类别">
          <Select>
            <Select.Option value="I">I类</Select.Option>
            <Select.Option value="II">II类</Select.Option>
          </Select>
        </AntForm.Item>
        <AntForm.Item name="femaleStalls" label="女厕位数量">
          <InputNumber min={0} />
        </AntForm.Item>
        <AntForm.Item name="totalStalls" label="总厕位数量">
          <InputNumber min={0} />
        </AntForm.Item>
        <AntForm.Item name="hasPartitions" label="有隔断门板及挂钩">
          <Switch />
        </AntForm.Item>
        <AntForm.Item name="partitionHeightOk" label="隔板高度符合要求(>=1.4m)">
          <Switch />
        </AntForm.Item>
        <AntForm.Item name="fixturesIntact" label="便器/洁具等完好">
          <Switch />
        </AntForm.Item>
        <AntForm.Item name="waterOk" label="上下水设施正常">
          <Switch />
        </AntForm.Item>
        <AntForm.Item name="structureIntact" label="地面/墙体/顶棚/门窗完好">
          <Switch />
        </AntForm.Item>
        <AntForm.Item name="signage" label="设置文明用厕宣传标识">
          <Switch />
        </AntForm.Item>

        <h3>停车场与外部标识</h3>
        <AntForm.Item name="parkingCount" label="停车位数量">
          <InputNumber min={0} />
        </AntForm.Item>
        <AntForm.Item name="parkingLinesClear" label="停车标线清晰">
          <Switch />
        </AntForm.Item>
        <AntForm.Item name="externalSignCompliant" label="外部标识规范">
          <Switch />
        </AntForm.Item>

        <h3>干净卫生</h3>
        <AntForm.Item name="ventilationOk" label="排风/采光良好">
          <Switch />
        </AntForm.Item>
        <AntForm.Item name="hasOdor" label="有异味">
          <Switch />
        </AntForm.Item>
        <AntForm.Item name="fliesMany" label="蚊蝇多">
          <Switch />
        </AntForm.Item>
        <AntForm.Item name="noDust" label="设施无积尘/污物">
          <Switch />
        </AntForm.Item>
        <AntForm.Item name="binsBagged" label="垃圾纸篓统一套袋">
          <Switch />
        </AntForm.Item>
        <AntForm.Item name="parkingAreaClean" label="停车场干净无垃圾">
          <Switch />
        </AntForm.Item>
        <AntForm.Item name="garbageClassification" label="推行垃圾分类管理">
          <Switch />
        </AntForm.Item>

        <h3>舒适与人性化</h3>
        <AntForm.Item name="openingHours" label="每天对外开放小时数">
          <InputNumber min={0} max={24} />
        </AntForm.Item>
        <AntForm.Item name="accessiblePath" label="无障碍通道可行">
          <Switch />
        </AntForm.Item>
        <AntForm.Item name="accessibleStalls" label="设无障碍厕位">
          <Switch />
        </AntForm.Item>
        <AntForm.Item name="staffUniform" label="保洁人员着工装">
          <Switch />
        </AntForm.Item>
        <AntForm.Item name="staffGrooming" label="保洁人员仪容整洁">
          <Switch />
        </AntForm.Item>
        <AntForm.Item name="cleaningToolsComplete" label="保洁工具齐全">
          <Switch />
        </AntForm.Item>
        <AntForm.Item name="cleaningToolsNeat" label="保洁工具摆放整齐">
          <Switch />
        </AntForm.Item>

        <h3>管理规范</h3>
        <AntForm.Item name="managementPosted" label="管理责任公示">
          <Switch />
        </AntForm.Item>
        <AntForm.Item name="cleaningPolicyPosted" label="保洁制度公示">
          <Switch />
        </AntForm.Item>
        <AntForm.Item name="supervisionBoard" label="设立监督公示栏">
          <Switch />
        </AntForm.Item>
        <AntForm.Item name="suggestionBox" label="设意见簿/二维码">
          <Switch />
        </AntForm.Item>
        <AntForm.Item name="outdoorCctv" label="安装室外监控">
          <Switch />
        </AntForm.Item>

        <AntForm.Item name="serviceExtension" label="服务拓展/备注">
          <TextArea rows={3} />
        </AntForm.Item>

        <AntForm.Item label="附件上传">
          <input type="file" multiple onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length) handleUploadFiles(files);
          }} />
          <div style={{ marginTop: 8 }}>{uploading ? '上传中...' : null}</div>
          {attachments.length > 0 && (
            <ul>
              {attachments.map((a,i) => <li key={i}><a href={a} target="_blank" rel="noreferrer">{a}</a></li>)}
            </ul>
          )}
        </AntForm.Item>

        <AntForm.Item>
          <Space>
            <Button type="primary" htmlType="submit">提交</Button>
            <Button onClick={() => router.push('/forms')}>取消</Button>
          </Space>
        </AntForm.Item>
      </AntForm>
    </MainLayout>
  );
}
