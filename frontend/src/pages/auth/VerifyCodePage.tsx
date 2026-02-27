import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockVerificationCode } from '../../data/mockData';

export default function VerifyCodePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(59);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    const newCode = [...code];
    pastedData.split('').forEach((char, i) => {
      if (i < 4) newCode[i] = char;
    });
    setCode(newCode);
    inputRefs.current[Math.min(pastedData.length, 3)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');

    if (fullCode.length !== 4) {
      setError('Please enter the complete 4-digit code');
      return;
    }

    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoading(false);

    if (fullCode !== mockVerificationCode) {
      navigate('/verification-error');
      return;
    }

    navigate('/reset-password', { state: { email, code: fullCode } });
  };

  const handleResendCode = async () => {
    if (timeLeft > 0) return;

    // Simulate resend
    await new Promise(resolve => setTimeout(resolve, 500));
    setTimeLeft(59);
    setCode(['', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Enter the verification code</h1>
            <p className="text-gray-500">
              We sent a 4-digit code to your email for password recovery.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Code Input */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-14 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              ))}
            </div>

            {/* Timer and Resend */}
            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="text-gray-500">
                Code expires in: <span className="font-medium text-gray-700">{formatTime(timeLeft)}</span>
              </span>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={timeLeft > 0}
                className={`font-medium ${
                  timeLeft > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:text-primary-600'
                }`}
              >
                Resend code
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full btn-lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Verify'
              )}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center gap-6 text-sm text-gray-500">
          <a href="/privacy" className="hover:text-gray-700">Privacy Policy</a>
          <a href="/terms" className="hover:text-gray-700">Terms of Service</a>
          <a href="/consent" className="hover:text-gray-700">Consent Preferences</a>
        </div>
      </div>
    </div>
  );
}
