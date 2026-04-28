import './globals.css';

export const metadata = {
  title: 'Image2 Studio MVP',
  description: 'AI 图片生成与提示词管理平台'
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
