import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Kids Diy Platform',
  description: 'The one center for the nextgen kids in tech.',
  metadataBase: new URL('https://creativechildf.org'),
};

import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body  className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
