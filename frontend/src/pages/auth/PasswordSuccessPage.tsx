import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function PasswordSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>

          {/* Header */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Password Updated Successfully
          </h1>
          <p className="text-gray-500 mb-8">
            Your new password has been created successfully. You can now log in using your new password.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Link to="/login" className="btn-primary w-full btn-lg inline-flex justify-center">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
