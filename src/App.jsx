import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from './store/themeStore'
import { useEffect } from 'react'

// Layout Components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import TopBanner from './components/layout/TopBanner'

// Pages
import HomePage from './pages/HomePage'
import StudyPage from './pages/StudyPage'
import CommunityPage from './pages/CommunityPage'
import ToppersPage from './pages/ToppersPage'
import ResourcesPage from './pages/ResourcesPage'
import CollegesPage from './pages/CollegesPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

// Utils
import { cn } from './utils/cn'

function App() {
  const { theme, initializeTheme } = useThemeStore()

  useEffect(() => {
    initializeTheme()
  }, [initializeTheme])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className={cn(
      "min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300",
      "flex flex-col"
    )}>
      <TopBanner />
      <Header />
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <HomePage />
                </motion.div>
              } 
            />
            <Route 
              path="/study" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <StudyPage />
                </motion.div>
              } 
            />
            <Route
              path="/community"
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CommunityPage />
                </motion.div>
              }
            />
            <Route
              path="/toppers"
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ToppersPage />
                </motion.div>
              }
            />
            <Route 
              path="/resources" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ResourcesPage />
                </motion.div>
              } 
            />
            <Route 
              path="/colleges" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CollegesPage />
                </motion.div>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProfilePage />
                </motion.div>
              } 
            />
            <Route 
              path="*" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <NotFoundPage />
                </motion.div>
              } 
            />
          </Routes>
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  )
}

export default App
