import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Family Tripxplo | EMI Based Family Trip Packages',
  description:
    'Plan your dream family vacation with easy EMI options. Book flights, hotels, and activities with flexible payment plans. Trusted by 50,000+ travelers.',
  keywords:
    'family trips, EMI packages, travel EMI, vacation packages, holiday EMI, family vacation, trip planning',
  authors: [{ name: 'Tripmilestone Tours Pvt. Ltd' }],
  openGraph: {
    title: 'Family Tripxplo | EMI Based Family Trip Packages',
    description: 'Plan your dream family vacation with easy EMI options.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#fff',
              borderRadius: '12px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: {
                primary: '#15ab8b',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
