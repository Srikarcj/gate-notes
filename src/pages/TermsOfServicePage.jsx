import React from 'react';
import SupportPageTemplate from './support/SupportPageTemplate';
import { FileText } from 'lucide-react';

const TermsOfServicePage = () => {
  return (
    <SupportPageTemplate title="Terms of Service">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center mb-8">
          <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg mr-4">
            <FileText className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
            <p className="text-gray-600 dark:text-gray-300">Last updated: July 5, 2025</p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Welcome to GATE Revolution. By accessing or using our services, you agree to be bound by these Terms of Service.
            Please read them carefully before using our services.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. Use of Our Services</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You may use our services only if you can form a binding contract with GATE Revolution, and only in compliance with these Terms.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. User Accounts</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. Subscriptions and Payments</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Some features of our services require payment. You agree to pay all fees and charges associated with your account on a timely basis.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Content</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Our services allow you to post, link, store, share, and otherwise make available certain information, text, or other material.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">5. Intellectual Property</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Our services and all contents, features, and functionality are owned by GATE Revolution and are protected by copyright, trademark,
            and other intellectual property laws.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">6. Limitation of Liability</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            GATE Revolution shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your
            access to or use of, or inability to access or use, the services.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">7. Changes to Terms</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We reserve the right to modify these terms at any time. We will provide notice of any changes by updating the date at the top of
            these terms.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">8. Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-300">
            If you have any questions about these Terms, please contact us at:
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

export default TermsOfServicePage;
