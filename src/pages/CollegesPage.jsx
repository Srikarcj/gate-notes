import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  School, 
  Trophy, 
  MapPin, 
  Star, 
  TrendingUp, 
  Building, 
  Brain,
  Target,
  Award,
  Search,
  Calculator,
  Globe,
  Heart
} from 'lucide-react'
import { cn } from '../utils/cn'

const CollegesPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Colleges', icon: School, count: 150 },
    { id: 'iit', name: 'IITs', icon: Trophy, count: 23 },
    { id: 'nit', name: 'NITs', icon: Award, count: 31 },
    { id: 'iiit', name: 'IIITs', icon: Brain, count: 25 },
    { id: 'gfti', name: 'GFTIs', icon: Building, count: 45 },
    { id: 'private', name: 'Private', icon: Star, count: 26 }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto container-padding section-padding">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <School className="w-6 h-6" />
              <span className="font-semibold">Ultimate College Guide</span>
              <Brain className="w-6 h-6" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Engineering College
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Discover top engineering colleges with AI-powered recommendations, 
              comprehensive data, and ultimate features for informed decisions.
            </p>

            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search colleges, locations, or branches..."
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

      {/* Ultimate Features */}
      <section className="section-padding bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ultimate College Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Advanced tools and insights for perfect college selection
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: 'AI Recommendations',
                description: 'Personalized college suggestions based on your profile',
                color: 'blue'
              },
              {
                icon: Calculator,
                title: 'GATE Score Predictor',
                description: 'Predict your chances with advanced algorithms',
                color: 'green'
              },
              {
                icon: TrendingUp,
                title: 'Placement Analytics',
                description: 'Detailed placement statistics and trends',
                color: 'purple'
              },
              {
                icon: Globe,
                title: 'Virtual Campus Tours',
                description: '360° virtual tours of college campuses',
                color: 'orange'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4",
                  feature.color === 'blue' && "bg-blue-100 text-blue-600 dark:bg-blue-900/20",
                  feature.color === 'green' && "bg-green-100 text-green-600 dark:bg-green-900/20",
                  feature.color === 'purple' && "bg-purple-100 text-purple-600 dark:bg-purple-900/20",
                  feature.color === 'orange' && "bg-orange-100 text-orange-600 dark:bg-orange-900/20"
                )}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Colleges */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Top Engineering Colleges
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Explore the best colleges with comprehensive data and insights
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {[
              {
                name: 'IIT Delhi',
                location: 'New Delhi',
                ranking: 1,
                rating: 4.9,
                fees: '₹2.5L/year',
                placement: '₹17.5L',
                category: 'iit'
              },
              {
                name: 'IIT Bombay',
                location: 'Mumbai',
                ranking: 2,
                rating: 4.8,
                fees: '₹2.5L/year',
                placement: '₹19.2L',
                category: 'iit'
              },
              {
                name: 'NIT Trichy',
                location: 'Tiruchirappalli',
                ranking: 8,
                rating: 4.6,
                fees: '₹1.8L/year',
                placement: '₹12.8L',
                category: 'nit'
              }
            ].map((college, index) => (
              <motion.div
                key={college.name}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-4 left-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold",
                      college.category === 'iit' && "bg-yellow-500 text-white",
                      college.category === 'nit' && "bg-blue-500 text-white"
                    )}>
                      {college.category.toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {college.name}
                    </h3>
                    <div className="flex items-center gap-2 text-white/80">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{college.location}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {college.rating}
                        </span>
                      </div>
                      <span className="text-gray-500 dark:text-gray-400">•</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Rank #{college.ranking}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {college.placement}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">
                        Avg Package
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {college.fees}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">
                        Annual Fees
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium">
                      View Details
                    </button>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default CollegesPage
