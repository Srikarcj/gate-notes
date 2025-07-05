import React from 'react';
import SupportPageTemplate from './support/SupportPageTemplate';
import { Shield } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <SupportPageTemplate title="Privacy Policy">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center mb-8">
          <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg mr-4">
            <Shield className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
            <p className="text-gray-600 dark:text-gray-300">Last updated: July 5, 2025</p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            At GATE Revolution, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
            disclose, and safeguard your information when you use our services.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-6">
            <li>Personal information (name, email, phone number)</li>
            <li>Account credentials</li>
            <li>Payment information (processed securely by our payment processor)</li>
            <li>Content you submit (questions, notes, etc.)</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-6">
            <li>Provide, maintain, and improve our services</li>
            <li>Personalize your learning experience</li>
            <li>Process transactions and send related information</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Send you technical notices, updates, and support messages</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. Information Sharing</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We do not sell your personal information. We may share information with:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-6">
            <li>Service providers who perform services on our behalf</li>
            <li>For legal reasons, if required by law or to protect our rights</li>
            <li>With your consent or at your direction</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Data Security</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We implement appropriate technical and organizational measures to protect your personal information against 
            unauthorized or unlawful processing, accidental loss, destruction, or damage.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">5. Your Choices</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You may update, correct, or delete your account information at any time by logging into your account. 
            You can also contact us to request access to, correction of, or deletion of your personal information.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">6. Changes to This Policy</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
            Privacy Policy on this page and updating the "Last updated" date.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">7. Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-300">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Email: hyd@gaterevolution.com<br />
            Address: 456 GATE Avenue, Hitech City, Hyderabad, TS 500081, India
          </p>
        </div>
      </div>
    </SupportPageTemplate>
  );
};

export default PrivacyPolicyPage;
