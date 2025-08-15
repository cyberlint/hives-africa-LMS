import { OtpVerificationForm } from "./otp-confirmation-form"

export default function VerifyOtpPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col gap-6">
            <a href="#" className="flex items-center gap-2 self-center font-medium">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="m2 17 10 5 10-5" />
                  <path d="m2 12 10 5 10-5" />
                </svg>
              </div>
              Acme Inc
            </a>
            <div className="mx-auto w-full max-w-md">
              <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="p-6">
                  <OtpVerificationForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
