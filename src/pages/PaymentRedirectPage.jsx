import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function PaymentRedirectPage() {
  const [searchParams] = useSearchParams();
  const machineId = searchParams.get('machineId');

  useEffect(() => {
    const redirectToPayment = async () => {
      if (!machineId) {
        window.location.href = '/login';
        return;
      }

      try {
        window.location.href = '/login';
      } catch (error) {
        console.error('Redirect error:', error);
        window.location.href = '/login';
      }
    };

    redirectToPayment();
  }, [machineId]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Mengalihkan ke halaman pembayaran...</h2>
        <p className="text-gray-600">Harap tunggu sebentar</p>
      </div>
    </div>
  );
}