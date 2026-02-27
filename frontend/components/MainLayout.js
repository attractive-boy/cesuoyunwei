import React from 'react';
import Link from 'next/link';
import { Layout, Menu, Typography } from 'antd';
import {
  HomeOutlined,
  FormOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

export default function MainLayout({ children, selected = '/' }) {
  return (
    <Layout>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ padding: 16, color: 'white' }}>
          <Title level={4} style={{ color: 'white', margin: 0 }}>运维管理</Title>
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[selected]}>
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link href="/">首页</Link>
          </Menu.Item>
          <Menu.Item key="/forms/new" icon={<FormOutlined />}>
            <Link href="/forms/new">填写评价表</Link>
          </Menu.Item>
          <Menu.Item key="/forms" icon={<FormOutlined />}>
            <Link href="/forms">查看评价表</Link>
          </Menu.Item>
          <Menu.Item key="/users" icon={<UserOutlined />}>
            <Link href="/users">用户管理</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px' }}>
          <div style={{ float: 'left' }}>
            <Title level={4} style={{ margin: 0 }}>交通厕所运维评价系统</Title>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>运维评价系统 ©2026</Footer>
      </Layout>
    </Layout>
  );
}
