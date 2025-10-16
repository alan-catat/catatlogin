// app/check-email/page.tsx
export default function CheckEmailPage() {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Check your email</h1>
          <p className="text-gray-600 dark:text-gray-300">
            We’ve sent you a confirmation link. Please check your inbox and click the link
            to verify your account before signing in.
          </p>
        </div>
      </div>
    );
  }
  