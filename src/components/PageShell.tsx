import type { ReactNode } from 'react';

const maxWidthClasses = {
  sm: 'max-w-lg',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-7xl',
  full: 'max-w-[1400px]',
} as const;

interface PageShellProps {
  children: ReactNode;
  className?: string;
  maxWidth?: keyof typeof maxWidthClasses;
  noPadding?: boolean;
}

export default function PageShell({
  children,
  className = '',
  maxWidth = '2xl',
  noPadding = false,
}: PageShellProps) {
  return (
    <div
      className={`mx-auto w-full ${maxWidthClasses[maxWidth]} ${
        noPadding ? '' : 'px-4 sm:px-6 py-8 pb-20'
      } min-h-[calc(100vh-4rem)] ${className}`}
    >
      {children}
    </div>
  );
}
