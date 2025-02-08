export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-customColor1 flex flex-col items-center justify-center p-8 mt-20">
      <h1 className="text-4xl font-bold text-customColor2 mb-4">Privacy Policy</h1>
      <div className="text-lg text-customColor2 max-w-4xl">
        <p>Last Updated: January 22, 2025</p>

        <h2 className="text-2xl font-semibold mt-6">1. Introduction</h2>
        <p>
          Welcome to Trade Sense AI ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our trading insights website and services.
        </p>

        <h2 className="text-2xl font-semibold mt-6">2. Information We Collect</h2>

        <h3 className="text-xl font-semibold mt-4">2.1 Information Provided Through Authentication Services</h3>
        <p>
          We use third-party authentication services (Google OAuth and Clerk) to manage user accounts. Through these services, we may collect:
        </p>
        <ul className="list-disc list-inside">
          <li>Email address</li>
          <li>Name</li>
          <li>Profile information from your Google account</li>
          <li>Authentication tokens</li>
        </ul>

        <h3 className="text-xl font-semibold mt-4">2.2 Usage Data</h3>
        <p>We collect data about how you interact with our website, including:</p>
        <ul className="list-disc list-inside">
          <li>Log data</li>
          <li>Device information</li>
          <li>IP address</li>
          <li>Browser type</li>
          <li>Pages visited</li>
        </ul>

        <h3 className="text-xl font-semibold mt-4">2.3 Firebase Data</h3>
        <p>We use Firebase to store:</p>
        <ul className="list-disc list-inside">
          <li>User preferences and Favorites</li>
          <li>Trading insights preferences</li>
          <li>Authentication information</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">3. How We Use Your Information</h2>
        <p>We use the collected information to:</p>
        <ul className="list-disc list-inside">
          <li>Provide and maintain our services</li>
          <li>Authenticate your identity</li>
          <li>Deliver trading insights and recommendations</li>
          <li>Improve our services</li>
          <li>Communicate with you about service updates</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">4. Data Storage and Security</h2>
        <p>
          Your data is stored using Firebase and protected according to industry standards. While we implement reasonable security measures, no method of electronic storage is 100% secure.
        </p>

        <h2 className="text-2xl font-semibold mt-6">5. Third-Party Services</h2>

        <h3 className="text-xl font-semibold mt-4">5.1 Authentication Providers</h3>
        <ul className="list-disc list-inside">
          <li>Google OAuth: Subject to Google's Privacy Policy</li>
          <li>Clerk: Subject to Clerk's Privacy Policy</li>
          <li>Firebase: Subject to Firebase's Privacy Policy</li>
        </ul>
        <p>
          Please review the privacy policies of these services for additional information about how they process your data.
        </p>

        <h2 className="text-2xl font-semibold mt-6">6. Disclaimer</h2>

        <h3 className="text-xl font-semibold mt-4">6.1 Trading Recommendations</h3>
        <p>
          The trading insights and recommendations provided through our service are for informational purposes only. We are not financial advisors, and we do not guarantee the accuracy, completeness, or usefulness of any information provided.
        </p>

        <h3 className="text-xl font-semibold mt-4">6.2 Limited Liability</h3>
        <p>We are not responsible for:</p>
        <ul className="list-disc list-inside">
          <li>Financial losses resulting from using our recommendations</li>
          <li>Data breaches or unauthorized access despite our security measures</li>
          <li>Accuracy of third-party data or recommendations</li>
          <li>Technical issues or service interruptions</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">7. Your Rights</h2>
        <p>Under Canadian privacy laws (PIPEDA), you have the right to:</p>
        <ul className="list-disc list-inside">
          <li>Access your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Withdraw consent for data collection</li>
          <li>Request data deletion</li>
          <li>Understand how your data is processed</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">8. Changes to Privacy Policy</h2>
        <p>
          We reserve the right to update this Privacy Policy at any time. We will notify users of any material changes via email or website notice.
        </p>

        <h2 className="text-2xl font-semibold mt-6">9. Contact Information</h2>
        <p>For privacy-related questions or concerns, contact us at:</p>
        <p>tradesenseai@googlegroups.com</p>

        <h2 className="text-2xl font-semibold mt-6">10. Governing Law</h2>
        <p>This Privacy Policy is governed by the laws of Canada, including PIPEDA.</p>
      </div>
    </div>
  );
}