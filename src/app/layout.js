import './globals.css'

export const metadata = {
  title: 'RKPins',
  description: '独特的网站收藏项目',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}
