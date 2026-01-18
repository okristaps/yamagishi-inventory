import dynamic from 'next/dynamic';

// Required for static export
export async function generateStaticParams() {
  return [
    { all: [''] },
    { all: ['inventory'] },
    { all: ['feed'] },
    { all: ['lists'] },
    { all: ['settings'] }
  ];
}

const AppShellClean = dynamic(() => import('../../components/AppShellClean'), {
  ssr: false,
});

export default function Page() {
  return <AppShellClean />;
}
