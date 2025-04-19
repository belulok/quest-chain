import type { Metadata } from 'next';
import { Inter, VT323 } from 'next/font/google';
import './globals.css';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { ProvidersWrapper } from '@/providers/ProvidersWrapper';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel'
});

export const metadata: Metadata = {
  title: 'QuestChain Academy',
  description: 'Own Your Skill, Level-Up for Real',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="questchain">
      <body className={`${inter.variable} ${vt323.variable} font-sans`}>
        <ReactQueryProvider>
          <ProvidersWrapper>
            {children}
          </ProvidersWrapper>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
