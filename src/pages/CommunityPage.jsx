import React from 'react'
import { motion } from 'framer-motion'
import { Users, MessageCircle, Trophy, Heart } from 'lucide-react'

const CommunityPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              🏆 Community & Topper's Section
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Connect with fellow GATE aspirants and access topper-recommended study materials
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              className="card text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Study Groups
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Join study groups and collaborate with peers
              </p>
            </motion.div>

            <motion.div
              className="card text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <MessageCircle className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Discussions
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Ask questions and get answers from experts
              </p>
            </motion.div>

            <motion.div
              className="card text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Trophy className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Topper Notes
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access notes shared by GATE toppers
              </p>
            </motion.div>
          </div>

          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Coming Soon!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                We're working hard to bring you an amazing community experience. 
                Stay tuned for updates!
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default CommunityPage
