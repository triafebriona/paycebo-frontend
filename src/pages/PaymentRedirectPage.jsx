import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function PaymentRedirectPage() {
  const [searchParams] = useSearchParams();
  const machineId = searchParams.get('machineId');

  useEffect(() => {
    if (!machineId) {
      console.error('Machine ID not found');
      window.location.href = '/';
      return;
    }

    console.log(`Redirecting to the payment page for : ${machineId}`);

    window.location.href = `http://localhost:3003/pay?machineId=${machineId}`;

  }, [machineId]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Redirecting to the payment page...</h2>
        <p className="text-gray-600">Please wait a moment</p>
      </div>
    </div>
  );
}