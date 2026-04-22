import { useEffect } from 'react';
import { useEMRStore } from '../store/emrStore';

export default function Toast() {
  const { toast, setToast } = useEMRStore();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast, setToast]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-5 py-2.5 rounded-lg shadow-xl z-50 animate-fade-in">
      {toast}
    </div>
  );
}
