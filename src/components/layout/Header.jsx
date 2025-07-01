import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap,
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
  Home,
  School,
  Library,
  BookOpen,
  Trophy,
  Cpu,
  Globe,
  Microscope,
  Calculator,
  Atom,
  Building,
  Brain,
  Zap,
  Target,
  User
} from 'lucide-react'
import { useThemeStore } from '../../store/themeStore'
import { cn } from '../../utils/cn'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, toggleTheme } = useThemeStore()
  const location = useLocation()

  const navigation = [
    {
      name: 'Home',
      href: 'https://gate-ready-with-ai.netlify.app/',
      icon: Home,
      hasDropdown: false,
      external: true
    },
    {
      name: 'Go to Main Page',
      href: '/',
      icon: Building,
      hasDropdown: false
    },
    {
      name: 'Colleges',
      href: 'https://gate-ready-with-ai-colleges.netlify.app/',
      icon: School,
      hasDropdown: false,
      external: true
    },
    {
      name: 'Resources',
      href: '/resources',
      icon: Library,
      hasDropdown: false
    },
    {
      name: 'Toppers',
      href: '/toppers',
      icon: Trophy,
      hasDropdown: false
    }
  ]

  // Advanced subject categories for all branches
  const advancedSubjects = {
    'Computer Science': {
      icon: Cpu,
      subjects: [
        'Data Structures & Algorithms',
        'Computer Networks',
        'Operating Systems',
        'Database Management',
        'Software Engineering',
        'Computer Architecture',
        'Theory of Computation',
        'Compiler Design',
        'Machine Learning',
        'Artificial Intelligence'
      ]
    },
    'Electronics': {
      icon: Zap,
      subjects: [
        'Digital Electronics',
        'Analog Circuits',
        'Signal Processing',
        'Communication Systems',
        'Control Systems',
        'VLSI Design',
        'Microprocessors',
        'Electromagnetic Theory'
      ]
    },
    'Mechanical': {
      icon: Building,
      subjects: [
        'Thermodynamics',
        'Fluid Mechanics',
        'Heat Transfer',
        'Machine Design',
        'Manufacturing',
        'Engineering Mechanics',
        'Material Science',
        'Industrial Engineering'
      ]
    },
    'Civil': {
      icon: Building,
      subjects: [
        'Structural Engineering',
        'Geotechnical Engineering',
        'Transportation Engineering',
        'Environmental Engineering',
        'Water Resources',
        'Construction Management',
        'Surveying',
        'Building Materials'
      ]
    },
    'Chemical': {
      icon: Atom,
      subjects: [
        'Chemical Reaction Engineering',
        'Process Control',
        'Mass Transfer',
        'Heat Transfer',
        'Thermodynamics',
        'Fluid Mechanics',
        'Process Design',
        'Chemical Technology'
      ]
    },
    'Electrical': {
      icon: Zap,
      subjects: [
        'Power Systems',
        'Control Systems',
        'Electrical Machines',
        'Power Electronics',
        'Electrical Measurements',
        'Circuit Theory',
        'Electromagnetic Fields',
        'Digital Electronics'
      ]
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  return (
    <motion.header 
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        "bg-white/95 backdrop-blur-md border-b border-gray-100",
        "dark:bg-gray-900/95 dark:border-gray-800",
        isScrolled && "shadow-lg"
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              className="p-2 bg-primary-600 rounded-lg text-white group-hover:bg-primary-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <GraduationCap className="w-5 h-5" />
            </motion.div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              GATE Revolution
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-gray-600 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-800"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </a>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive(item.href)
                        ? "text-primary-600 bg-primary-50 dark:bg-primary-900/20"
                        : "text-gray-600 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-800"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                    {item.hasDropdown && (
                      <ChevronDown className="w-3 h-3 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
                    )}
                  </Link>
                )}

                {/* Advanced Dropdown Menu */}
                {item.hasDropdown && item.dropdownItems && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="p-2">
                      {item.dropdownItems.map((dropdownItem, index) => (
                        <Link
                          key={dropdownItem.name}
                          to={dropdownItem.href}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200"
                        >
                          <dropdownItem.icon className="w-4 h-4" />
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Profile Button */}
            <Link to="/profile">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Profile</span>
              </motion.div>
            </Link>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                "text-gray-600 hover:text-primary-600 hover:bg-gray-100",
                "dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-800"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>



            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "lg:hidden p-2 rounded-lg transition-all duration-200",
                "text-gray-600 hover:text-primary-600 hover:bg-gray-100",
                "dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-800"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle mobile menu"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden border-t border-gray-100 dark:border-gray-800"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="py-4 space-y-2">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 text-gray-600 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-800"
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4" />
                          {item.name}
                        </div>
                      </a>
                    ) : (
                      <Link
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-all duration-200",
                          isActive(item.href)
                            ? "text-primary-600 bg-primary-50 dark:bg-primary-900/20"
                            : "text-gray-600 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-800"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4" />
                          {item.name}
                        </div>
                        {item.hasDropdown && (
                          <ChevronDown className="w-4 h-4 opacity-60" />
                        )}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export default Header
