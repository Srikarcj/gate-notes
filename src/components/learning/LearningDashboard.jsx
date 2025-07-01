import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Clock, 
  Star,
  Award,
  Zap,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { cn } from '../../utils/cn'

const LearningDashboard = ({ userProgress, studyData }) => {
  const [activeMetric, setActiveMetric] = useState('overview')
  const [weeklyData, setWeeklyData] = useState([])
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    // Generate weekly study data
    const generateWeeklyData = () => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      return days.map(day => ({
        day,
        minutes: Math.floor(Math.random() * 120) + 30,
        topics: Math.floor(Math.random() * 5) + 1
      }))
    }

    setWeeklyData(generateWeeklyData())

    // Generate AI recommendations
    const generateRecommendations = () => {
      const recs = [
        {
          type: 'focus',
          title: 'Focus on Data Structures',
          description: 'You\'ve been struggling with tree algorithms. Spend more time on BST and AVL trees.',
          priority: 'high',
          icon: 'brain'
        },
        {
          type: 'practice',
          title: 'More Coding Practice',
          description: 'Try solving 5 more algorithm problems to strengthen your implementation skills.',
          priority: 'medium',
          icon: 'code'
        },
        {
          type: 'review',
          title: 'Review Sorting Algorithms',
          description: 'Quick review of merge sort and quick sort before moving to advanced topics.',
          priority: 'low',
          icon: 'refresh'
        }
      ]
      setRecommendations(recs)
    }

    generateRecommendations()
  }, [])

  const getOverallProgress = () => {
    if (!userProgress || Object.keys(userProgress).length === 0) return 0
    const values = Object.values(userProgress)
    return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length)
  }

  const getTotalStudyTime = () => {
    return weeklyData.reduce((total, day) => total + day.minutes, 0)
  }

  const getStrengthsAndWeaknesses = () => {
    if (!userProgress) return { strengths: [], weaknesses: [] }
    
    const topics = Object.entries(userProgress)
    const strengths = topics.filter(([_, progress]) => progress >= 80).map(([topic]) => topic)
    const weaknesses = topics.filter(([_, progress]) => progress < 50).map(([topic]) => topic)
    
    return { strengths, weaknesses }
  }

  const { strengths, weaknesses } = getStrengthsAndWeaknesses()

  const metrics = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      value: `${getOverallProgress()}%`,
      description: 'Overall Progress'
    },
    {
      id: 'time',
      label: 'Study Time',
      icon: Clock,
      value: `${Math.floor(getTotalStudyTime() / 60)}h`,
      description: 'This Week'
    },
    {
      id: 'topics',
      label: 'Topics',
      icon: BookOpen,
      value: Object.keys(userProgress || {}).length,
      description: 'Started'
    },
    {
      id: 'streak',
      label: 'Streak',
      icon: Zap,
      value: '7',
      description: 'Days'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Learning Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Track your progress and get personalized insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <motion.div
            key={metric.id}
            className={cn(
              "p-6 rounded-2xl border cursor-pointer transition-all duration-200",
              activeMetric === metric.id
                ? "bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-800"
                : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg"
            )}
            onClick={() => setActiveMetric(metric.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                activeMetric === metric.id
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              )}>
                <metric.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {metric.description}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed View */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Weekly Activity
          </h3>
          
          <div className="space-y-4">
            {weeklyData.map((day, index) => (
              <motion.div
                key={day.day}
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-300">
                  {day.day}
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(day.minutes / 120) * 100}%` }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                  />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 w-16 text-right">
                  {Math.floor(day.minutes / 60)}h {day.minutes % 60}m
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Insights
          </h3>
          
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                className={cn(
                  "p-4 rounded-lg border",
                  rec.priority === 'high' && "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20",
                  rec.priority === 'medium' && "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20",
                  rec.priority === 'low' && "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    rec.priority === 'high' && "bg-red-500 text-white",
                    rec.priority === 'medium' && "bg-yellow-500 text-white",
                    rec.priority === 'low' && "bg-blue-500 text-white"
                  )}>
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {rec.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Your Strengths
          </h3>
          
          {strengths.length > 0 ? (
            <div className="space-y-3">
              {strengths.map((topic, index) => (
                <motion.div
                  key={topic}
                  className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {topic}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">
                      {userProgress[topic]}% Complete
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Keep studying to build your strengths!</p>
            </div>
          )}
        </div>

        {/* Areas for Improvement */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-red-500" />
            Focus Areas
          </h3>
          
          {weaknesses.length > 0 ? (
            <div className="space-y-3">
              {weaknesses.map((topic, index) => (
                <motion.div
                  key={topic}
                  className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {topic}
                    </div>
                    <div className="text-sm text-red-600 dark:text-red-400">
                      {userProgress[topic]}% Complete - Needs attention
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Great job! No weak areas identified.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LearningDashboard
