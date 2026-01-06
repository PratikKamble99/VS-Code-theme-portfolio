import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pratik Kamble - Software Developer Portfolio',
  description: 'Interactive VS Code-themed developer portfolio. Explore my projects, skills, and experience through an interactive terminal interface.',
  keywords: ['developer', 'portfolio', 'full-stack', 'react', 'typescript', 'next.js', 'software developer'],
  authors: [{ name: 'Pratik Kamble' }],
  creator: 'Pratik Kamble',
  openGraph: {
    title: 'Pratik Kamble - Software Developer Portfolio',
    description: 'Interactive VS Code-themed developer portfolio with terminal interface',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-vscode-bg text-vscode-text font-mono">
        {children}
      </body>
    </html>
  )
}