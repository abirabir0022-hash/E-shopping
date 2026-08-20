import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Welcome to E-Shopping Store</h1>
      <p>Your shop storefront is running successfully!</p>
      <div style={{ marginTop: '20px' }}>
        <Link href="/admin" style={{ marginRight: '15px', color: 'blue' }}>
          Go to Admin Panel
        </Link>
        <Link href="/checkout" style={{ color: 'blue' }}>
          Go to Checkout
        </Link>
      </div>
    </div>
  );
}
