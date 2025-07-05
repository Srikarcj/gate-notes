import React from 'react';
import SupportPageTemplate from './support/SupportPageTemplate';
import { Mail, MessageSquare, HelpCircle, BookOpen } from 'lucide-react';

const HelpCenterPage = () => {
  const faqs = [
    {
      question: 'How do I access study materials?',
      answer: 'Navigate to the Resources section and select Study Materials. You can browse by subject or use the search function to find specific content.'
    },
    {
      question: 'Is there a mobile app available?',
      answer: 'Currently, we offer a responsive web app that works on all devices. You can add it to your home screen for quick access.'
    },
    {
      question: 'How can I track my progress?',
      answer: 'Your progress is automatically tracked in your profile. You can view completed resources, test scores, and more in the Profile section.'
    },
    {
      question: 'How do I reset my password?',
      answer: 'Click on the "Forgot Password" link on the login page and follow the instructions sent to your registered email address.'
    }
  ];

  return (
    <SupportPageTemplate title="Help Center">
      <div className="space-y-8">
        <div className="bg-primary-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Need Help?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We're here to help you with any questions or issues you might have. Here are some quick links to get you started:
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <a 
              href="mailto:support@gaterevolution.com" 
              className="flex items-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Email Support</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get help via email</p>
              </div>
            </a>
            <a 
              href="#faq" 
              className="flex items-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <HelpCircle className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">FAQs</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Find answers to common questions</p>
              </div>
            </a>
          </div>
        </div>

        <section id="faq" className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{faq.question}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <div className="text-center">
            <BookOpen className="w-10 h-10 mx-auto text-primary-600 dark:text-primary-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Still need help?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Can't find what you're looking for? Our team is here to help.
            </p>
            <a 
              href="mailto:support@gaterevolution.com" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Contact Support
            </a>
          </div>
        </section>
      </div>
    </SupportPageTemplate>
  );
};

export default HelpCenterPage;
