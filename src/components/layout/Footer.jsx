import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, Heart } from 'lucide-react'

const Footer = () => {
  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Study Materials', href: '/resources/study-materials' },
        { name: 'Community', href: '/community' },
        { name: 'Resources', href: '/resources' },
        { name: 'Colleges', href: 'https://gate-ready-with-ai-colleges.netlify.app/', external: true },
        { name: 'Toppers', href: '/toppers' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Previous Papers', href: '/resources/previous-papers' },
        { name: 'Interactive Videos', href: '/resources/interactive-videos' },
        { name: 'Study Materials', href: '/resources/study-materials' },
        { name: 'All Resources', href: '/resources' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Help Center', href: '/help-center' },
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Terms of Service', href: '/terms-of-service' }
      ]
    }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <motion.div
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="p-2 bg-primary-600 rounded-lg">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold">GATE Revolution</span>
              </motion.div>
              <motion.p
                className="text-gray-300 mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Your comprehensive GATE preparation companion powered by AI. 
                Learn faster, practice smarter, and achieve your dream rank.
              </motion.p>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + (sectionIndex * 0.1) }}
                viewport={{ once: true }}
              >
                <h4 className="text-lg font-semibold mb-6">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center gap-1"
                        >
                          {link.name}
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <motion.div
          className="border-t border-gray-800 py-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 flex items-center justify-center gap-2">
            © 2025 GATE Revolution. Built with 
            <Heart className="w-4 h-4 text-red-500" />
            for GATE aspirants, by GATE aspirants.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
