export default function PrivacyPolicy() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-reddish p-8">
      <h1 className="mb-8 text-4xl font-bold text-customColor2">
        Privacy Policy
      </h1>
      <div className="mb-10 max-w-4xl text-lg text-customColor2">
        <p>Last Updated: January 22, 2025</p>

        <h2 className="mt-6 text-2xl font-semibold">1. Introduction</h2>
        <p>
          Welcome to Reddish Trends ("we," "our," or "us"). This Privacy Policy
          explains how we collect, use, disclose, and safeguard your information
          when you use our trading insights website and services.
        </p>

        <h2 className="mt-6 text-2xl font-semibold">
          2. Information We Collect
        </h2>

        <h3 className="mt-4 text-xl font-semibold">
          2.1 Information Provided Through Authentication Services
        </h3>
        <p>
          We use third-party authentication services (Google OAuth and Clerk) to
          manage user accounts. Through these services, we may collect:
        </p>
        <ul className="list-inside list-disc">
          <li>Email address</li>
          <li>Name</li>
          <li>Profile information from your Google account</li>
          <li>Authentication tokens</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">2.2 Usage Data</h3>
        <p>
          We collect data about how you interact with our website, including:
        </p>
        <ul className="list-inside list-disc">
          <li>Log data</li>
          <li>Device information</li>
          <li>IP address</li>
          <li>Browser type</li>
          <li>Pages visited</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">2.3 Firebase Data</h3>
        <p>We use Firebase to store:</p>
        <ul className="list-inside list-disc">
          <li>User preferences and Favorites</li>
          <li>Trading insights preferences</li>
          <li>Authentication information</li>
        </ul>

        <h2 className="mt-6 text-2xl font-semibold">
          3. How We Use Your Information
        </h2>
        <p>We use the collected information to:</p>
        <ul className="list-inside list-disc">
          <li>Provide and maintain our services</li>
          <li>Authenticate your identity</li>
          <li>Deliver trading insights and recommendations</li>
          <li>Improve our services</li>
          <li>Communicate with you about service updates</li>
        </ul>

        <h2 className="mt-6 text-2xl font-semibold">
          4. Data Storage and Security
        </h2>
        <p>
          Your data is stored using Firebase and protected according to industry
          standards. While we implement reasonable security measures, no method
          of electronic storage is 100% secure.
        </p>

        <h2 className="mt-6 text-2xl font-semibold">5. Third-Party Services</h2>

        <h3 className="mt-4 text-xl font-semibold">
          5.1 Authentication Providers
        </h3>
        <ul className="list-inside list-disc">
          <li>Google OAuth: Subject to Google's Privacy Policy</li>
          <li>Clerk: Subject to Clerk's Privacy Policy</li>
          <li>Firebase: Subject to Firebase's Privacy Policy</li>
        </ul>
        <p>
          Please review the privacy policies of these services for additional
          information about how they process your data.
        </p>

        <h2 className="mt-6 text-2xl font-semibold">6. Disclaimer</h2>

        <h3 className="mt-4 text-xl font-semibold">
          6.1 Trading Recommendations
        </h3>
        <p>
          The trading insights and recommendations provided through our service
          are for informational purposes only. We are not financial advisors,
          and we do not guarantee the accuracy, completeness, or usefulness of
          any information provided.
        </p>

        <h3 className="mt-4 text-xl font-semibold">6.2 Limited Liability</h3>
        <p>We are not responsible for:</p>
        <ul className="list-inside list-disc">
          <li>Financial losses resulting from using our recommendations</li>
          <li>
            Data breaches or unauthorized access despite our security measures
          </li>
          <li>Accuracy of third-party data or recommendations</li>
          <li>Technical issues or service interruptions</li>
        </ul>

        <h2 className="mt-6 text-2xl font-semibold">7. Your Rights</h2>
        <p>Under Canadian privacy laws (PIPEDA), you have the right to:</p>
        <ul className="list-inside list-disc">
          <li>Access your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Withdraw consent for data collection</li>
          <li>Request data deletion</li>
          <li>Understand how your data is processed</li>
          <p>
            If you wish to exercise any of these rights, please contact us at
            the email address provided in Section 9 or by clicking the link
            provided on our website footer.
          </p>
        </ul>

        <h2 className="mt-6 text-2xl font-semibold">
          8. Changes to Privacy Policy
        </h2>
        <p>
          We reserve the right to update this Privacy Policy at any time. We
          will notify users of any material changes via email or website notice.
        </p>

        <h2 className="mt-6 text-2xl font-semibold">9. Contact Information</h2>
        <p>For privacy-related questions or concerns, contact us at:</p>
        <p>reddishtrends@googlegroups.com</p>

        <h2 className="mt-6 text-2xl font-semibold">10. Governing Law</h2>
        <p>
          This Privacy Policy is governed by the laws of Canada, including
          PIPEDA.
        </p>
      </div>
    </div>
  );
}
