import type { Metadata } from 'next'
import { ABeeZee, Noto_Serif_TC } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const abeeZee = ABeeZee({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-abeezee',
  display: 'swap',
})

const notoSerifTC = Noto_Serif_TC({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto-serif-tc',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  title: '煩惱盒子 | Pain points collection',
  description: '收集真實的日常不滿——也許有人懂你，也許有人能幫你解決。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" className={`${abeeZee.variable} ${notoSerifTC.variable}`}>
      <body>{children}<Analytics /></body>
    </html>
  )
}
