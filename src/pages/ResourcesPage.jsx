import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Video, 
  FileText, 
  Download, 
  Brain, 
  Target, 
  Search,
  Calculator,
  Globe,
  TrendingUp,
  Bookmark
} from 'lucide-react'
import { cn } from '../utils/cn'

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Resources', icon: BookOpen, count: 500 },
    { id: 'notes', name: 'Study Materials', icon: FileText, count: 150 },
    { id: 'videos', name: 'Video Lectures', icon: Video, count: 200 },
    { id: 'tests', name: 'Mock Tests', icon: Target, count: 80 },
    { id: 'papers', name: 'Previous Papers', icon: Calculator, count: 50 },
    { id: 'ai', name: 'AI Assistant', icon: Brain, count: 20 }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto container-padding section-padding">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <BookOpen className="w-6 h-6" />
              <span className="font-semibold">Ultimate Learning Resources</span>
              <Brain className="w-6 h-6" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Advanced Study
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Resources Hub
              </span>
            </h1>
            
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Access comprehensive study materials, AI-powered learning tools, 
              and advanced resources for ultimate GATE preparation success.
            </p>

            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources, topics, or subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto container-padding py-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                  selectedCategory === category.id
                    ? "bg-primary-500 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="section-padding bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ultimate Learning Resources
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Advanced AI-powered tools for comprehensive GATE preparation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'AI Study Assistant',
                description: 'Personalized AI tutor for instant doubt solving',
                features: ['24/7 Availability', 'Instant Answers', 'Concept Mapping'],
                color: 'blue'
              },
              {
                icon: Video,
                title: 'Interactive Videos',
                description: 'High-quality video content with interactive elements',
                features: ['HD Quality', 'Subtitles', 'Speed Control'],
                color: 'red'
              },
              {
                icon: Target,
                title: 'Adaptive Tests',
                description: 'AI-powered tests that adapt to your level',
                features: ['Difficulty Adjustment', 'Performance Analytics', 'Weak Area Detection'],
                color: 'green'
              },
              {
                icon: FileText,
                title: 'Study Materials',
                description: 'Detailed study materials for all GATE subjects',
                features: ['All Branches', 'Updated Content', 'Illustrations'],
                color: 'purple'
              },
              {
                icon: Calculator,
                title: 'Previous Papers',
                description: 'Complete collection of GATE papers with solutions',
                features: ['20+ Years', 'Detailed Solutions', 'Topic-wise'],
                color: 'orange'
              },
              {
                icon: TrendingUp,
                title: 'Progress Analytics',
                description: 'Advanced analytics to track preparation',
                features: ['Progress Graphs', 'Strength Analysis', 'Recommendations'],
                color: 'indigo'
              }
            ].map((resource, index) => (
              <motion.div
                key={resource.title}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    resource.color === 'blue' && "bg-blue-100 text-blue-600 dark:bg-blue-900/20",
                    resource.color === 'red' && "bg-red-100 text-red-600 dark:bg-red-900/20",
                    resource.color === 'green' && "bg-green-100 text-green-600 dark:bg-green-900/20",
                    resource.color === 'purple' && "bg-purple-100 text-purple-600 dark:bg-purple-900/20",
                    resource.color === 'orange' && "bg-orange-100 text-orange-600 dark:bg-orange-900/20",
                    resource.color === 'indigo' && "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20"
                  )}>
                    <resource.icon className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {resource.description}
                </p>

                <div className="space-y-2 mb-6">
                  {resource.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium">
                    Access Now
                  </button>
                  <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Quick Access Resources
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Essential study materials for immediate access
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: 'Study Notes', count: '150+', color: 'blue' },
              { icon: Video, title: 'Video Lectures', count: '200+', color: 'red' },
              { icon: FileText, title: 'Previous Papers', count: '50+', color: 'green' },
              { icon: Download, title: 'Downloads', count: '100+', color: 'purple' }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 text-center hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4",
                  item.color === 'blue' && "bg-blue-100 text-blue-600 dark:bg-blue-900/20",
                  item.color === 'red' && "bg-red-100 text-red-600 dark:bg-red-900/20",
                  item.color === 'green' && "bg-green-100 text-green-600 dark:bg-green-900/20",
                  item.color === 'purple' && "bg-purple-100 text-purple-600 dark:bg-purple-900/20"
                )}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-2xl font-bold text-primary-600 mb-2">
                  {item.count}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Resources Available
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ResourcesPage
