import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, Heart } from 'lucide-react'

const Footer = () => {
  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Browse Notes', href: '/study' },
        { name: 'Community', href: '/community' },
        { name: 'Resources', href: '/resources' },
        { name: 'Colleges', href: '/colleges' }
      ]
    },
    {
      title: 'Features',
      links: [
        { name: 'AI-Powered Learning', href: '/features/ai' },
        { name: 'Offline Capability', href: '/features/offline' },
        { name: 'Responsive Design', href: '/features/responsive' },
        { name: 'Dark Mode', href: '/features/dark-mode' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' }
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
                      <Link
                        to={link.href}
                        className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
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
