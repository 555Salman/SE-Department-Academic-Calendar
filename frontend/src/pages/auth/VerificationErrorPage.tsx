import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function VerificationErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>

          {/* Header */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Verification Error!
          </h1>
          <p className="text-gray-500 mb-4">
            Your account verification has failed. Please contact the administrator for assistance or to resolve this issue.
          </p>

          {/* Admin Email */}
          <a
            href="mailto:admin@example.com"
            className="text-primary hover:text-primary-600 font-medium"
          >
            admin@example.com
          </a>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <a
              href="mailto:admin@example.com"
              className="btn-primary w-full btn-lg inline-flex justify-center"
            >
              Contact Admin
            </a>
            <Link to="/" className="btn-outline w-full inline-flex justify-center">
              Go to Homepage
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center gap-6 text-sm text-gray-500">
          <a href="/privacy" className="hover:text-gray-700" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
          <a href="/terms" className="hover:text-gray-700" onClick={(e) => e.preventDefault()}>Terms of Service</a>
          <a href="/consent" className="hover:text-gray-700" onClick={(e) => e.preventDefault()}>Consent Preferences</a>
        </div>
      </div>
    </div>
  );
}
