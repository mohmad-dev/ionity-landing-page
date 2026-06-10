import { ReactNode } from 'react';
import './globals.css';

type Props = {
  children: ReactNode;
};

// Since we have a `[locale]` layout, the root layout only passes children through.
export default function RootLayout({ children }: Props) {
  return children;
}
