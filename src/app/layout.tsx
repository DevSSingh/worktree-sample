import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Folio — Personal Expense Tracker',
  description: 'A clearer picture of your finances. Track expenses, explore spending patterns, and stay in control.'
};
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <html lang="en"><body>{children}</body></html>;
}
