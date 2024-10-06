import './globals.css'

export const metadata = {
  title: 'RK Pins',
  description: '跳转链接集合',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}
