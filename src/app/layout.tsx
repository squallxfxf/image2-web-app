import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image2 Studio MVP',
  description: 'AI 图片生成与提示词管理平台'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
