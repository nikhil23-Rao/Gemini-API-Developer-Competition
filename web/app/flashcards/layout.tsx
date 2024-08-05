export const metadata = {
  title: "Vertex",
  description: "Study Tool with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          http-equiv={`Content-Security-Policy" content="default-src 'self'
 data: gap: https://ssl.gstatic.com ${process.env.NEXT_PUBLIC_API_URL} 'unsafe-eval';
 style-src 'self' unsafe-inline'; media-src *`}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
