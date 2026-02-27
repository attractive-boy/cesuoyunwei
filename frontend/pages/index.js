import Link from 'next/link';
import MainLayout from '../components/MainLayout';
import RecentSubmissions from '../components/RecentSubmissions';
import { Card, Row, Col, Button } from 'antd';

export default function Home() {
  return (
    <MainLayout selected="/">
      <Row gutter={16}>
        <Col span={16}>
          <Card title="快速操作" style={{ marginBottom: 16 }}>
            <Row gutter={8}>
              <Col>
                <Link href="/forms/new"><Button type="primary">填写评价表</Button></Link>
              </Col>
              <Col>
                <Link href="/forms"><Button>查看评价表</Button></Link>
              </Col>
              <Col>
                <Link href="/users"><Button>用户管理</Button></Link>
              </Col>
            </Row>
          </Card>
          <Card title="最近提交">
            <RecentSubmissions />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="系统信息">
            <div>数据库: 已配置</div>
            <div>存储: Azure Blob</div>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
}
