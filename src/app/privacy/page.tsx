/* eslint-disable react/no-unescaped-entities */
export default function PrivacyPolicy() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

            <div className="prose dark:prose-invert max-w-none space-y-6">
                <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                    <p>
                        Welcome to GCSEmigo ("we," "our," or "us"). We are committed to protecting your personal data and respecting your privacy.
                        This policy explains how we collect, use, and safeguard your information when you use our AI tutoring service.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">2. Data We Collect</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Account Information:</strong> When you sign up, we collect your email address and name via Supabase Auth.</li>
                        <li><strong>Usage Data:</strong> We track your learning progress, streaks, and subject interactions to improve the tutoring experience.</li>
                        <li><strong>Chat History:</strong> Your conversations with the AI tutor are stored to provide context for future sessions.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Data</h2>
                    <p>We use your data strictly to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Provide and personalize the AI tutoring service.</li>
                        <li>Track your academic progress and streaks.</li>
                        <li>Authenticate your account and ensure security.</li>
                    </ul>
                    <p className="mt-4">
                        We do <strong>not</strong> sell your personal data to third parties. We use Google Gemini API for the chat functionality, but we do not use your data to train their public models.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">4. Your Rights (GDPR)</h2>
                    <p>Under the UK General Data Protection Regulation (UK GDPR), you have the right to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                        <li><strong>Rectification:</strong> Correct any inaccurate data.</li>
                        <li><strong>Erasure ("Right to be Forgotten"):</strong> Request that we delete your data.</li>
                        <li><strong>Restriction:</strong> Request that we restrict the processing of your data.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">5. Contact & Data Deletion</h2>
                    <p>
                        If you wish to exercise any of your rights or request account deletion, please visit our <a href="/data-deletion" className="text-primary hover:underline">Data Deletion</a> page or contact us at privacy@gcsemigo.com.
                    </p>
                </section>
            </div>
        </div>
    )
}
