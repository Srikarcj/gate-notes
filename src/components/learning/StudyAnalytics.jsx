import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target, 
  Award, 
  Flame,
  Calendar,
  BookOpen,
  Code,
  CheckCircle,
  Star,
  Zap,
  Brain,
  Trophy
} from 'lucide-react'
import { useAdvancedStudyStore } from '../../store/advancedStudyStore'

const StudyAnalytics = ({ topic }) => {
  const [timeRange, setTimeRange] = useState('week') // week, month, all
  const [activeTab, setActiveTab] = useState('overview') // overview, progress, performance
  
  const {
    getStudyStats,
    studyTime,
    completedTopics,
    solvedProblems,
    currentStreak,
    longestStreak,
    learningStats
  } = useAdvancedStudyStore()

  const stats = getStudyStats()

  // Calculate study time for different periods
  const getStudyTimeForPeriod = (period) => {
    const now = new Date()
    const periodStart = new Date()
    
    switch (period) {
      case 'week':
        periodStart.setDate(now.getDate() - 7)
        break
      case 'month':
        periodStart.setMonth(now.getMonth() - 1)
        break
      default:
        return Object.values(studyTime).reduce((total, time) => total + time, 0)
    }
    
    // In a real app, you'd filter by timestamp
    return Object.values(studyTime).reduce((total, time) => total + time, 0) * 0.7 // Mock recent activity
  }

  const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60))
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const getPerformanceData = () => {
    const totalProblems = Object.keys(solvedProblems).length
    const solvedCount = Object.values(solvedProblems).filter(p => p.solved).length
    const accuracy = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0
    
    return {
      totalProblems,
      solvedCount,
      accuracy,
      averageAttempts: totalProblems > 0 ? 
        Object.values(solvedProblems).reduce((sum, p) => sum + p.attempts, 0) / totalProblems : 0
    }
  }

  const performanceData = getPerformanceData()

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue', trend }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color}-100 dark:bg-${color}-900/20 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className="w-4 h-4" />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {value}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  )

  const ProgressBar = ({ label, current, total, color = 'blue' }) => {
    const percentage = total > 0 ? (current / total) * 100 : 0
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-300">{label}</span>
          <span className="text-gray-600 dark:text-gray-400">{current}/{total}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`bg-${color}-500 h-2 rounded-full transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-right text-xs text-gray-500 dark:text-gray-500">
          {percentage.toFixed(1)}%
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Study Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track your learning progress and performance
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'progress', label: 'Progress', icon: Target },
          { id: 'performance', label: 'Performance', icon: Trophy }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Clock}
              title="Study Time"
              value={formatTime(getStudyTimeForPeriod(timeRange))}
              subtitle={`${timeRange === 'week' ? 'This week' : timeRange === 'month' ? 'This month' : 'Total'}`}
              color="blue"
              trend={15}
            />
            <StatCard
              icon={Flame}
              title="Current Streak"
              value={`${currentStreak} days`}
              subtitle={`Best: ${longestStreak} days`}
              color="orange"
            />
            <StatCard
              icon={CheckCircle}
              title="Topics Completed"
              value={stats.completedTopics}
              subtitle={`${stats.totalTopics} total topics`}
              color="green"
              trend={8}
            />
            <StatCard
              icon={Code}
              title="Problems Solved"
              value={performanceData.solvedCount}
              subtitle={`${performanceData.accuracy}% accuracy`}
              color="purple"
              trend={12}
            />
          </div>

          {/* Study Activity Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Study Activity
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }, (_, i) => {
                const day = new Date()
                day.setDate(day.getDate() - (6 - i))
                const activity = Math.random() * 4 // Mock activity level
                
                return (
                  <div key={i} className="text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                      {day.toLocaleDateString('en', { weekday: 'short' })}
                    </div>
                    <div
                      className={`w-full h-16 rounded-lg ${
                        activity > 3 ? 'bg-green-500' :
                        activity > 2 ? 'bg-green-400' :
                        activity > 1 ? 'bg-green-300' :
                        activity > 0 ? 'bg-green-200' :
                        'bg-gray-200 dark:bg-gray-700'
                      }`}
                      title={`${Math.floor(activity * 60)} minutes`}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="space-y-6">
          {/* Subject Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Subject Progress
            </h3>
            <div className="space-y-6">
              <ProgressBar
                label="Data Structures & Algorithms"
                current={8}
                total={12}
                color="blue"
              />
              <ProgressBar
                label="Computer Networks"
                current={5}
                total={8}
                color="green"
              />
              <ProgressBar
                label="Operating Systems"
                current={3}
                total={10}
                color="purple"
              />
              <ProgressBar
                label="Database Systems"
                current={6}
                total={9}
                color="orange"
              />
            </div>
          </div>

          {/* Learning Path */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Recommended Learning Path
            </h3>
            <div className="space-y-4">
              {[
                { topic: 'Trees', status: 'current', progress: 60 },
                { topic: 'Graphs', status: 'next', progress: 0 },
                { topic: 'Dynamic Programming', status: 'locked', progress: 0 },
                { topic: 'Advanced Algorithms', status: 'locked', progress: 0 }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.status === 'current' ? 'bg-blue-500 text-white' :
                    item.status === 'next' ? 'bg-yellow-500 text-white' :
                    'bg-gray-300 dark:bg-gray-600 text-gray-500'
                  }`}>
                    {item.status === 'current' ? <Brain className="w-4 h-4" /> :
                     item.status === 'next' ? <Target className="w-4 h-4" /> :
                     <Star className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{item.topic}</h4>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {item.progress}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Problem Solving
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Easy</span>
                  <span className="font-medium text-green-600">15/20</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Medium</span>
                  <span className="font-medium text-yellow-600">8/15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Hard</span>
                  <span className="font-medium text-red-600">2/10</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quiz Performance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Average Score</span>
                  <span className="font-medium text-blue-600">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Quizzes Taken</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Best Score</span>
                  <span className="font-medium text-green-600">98%</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Study Efficiency
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Avg. Session</span>
                  <span className="font-medium">45 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Focus Score</span>
                  <span className="font-medium text-purple-600">92%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Retention</span>
                  <span className="font-medium text-green-600">88%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-500" />
                Strengths
              </h3>
              <div className="space-y-3">
                {['Array Operations', 'Basic Algorithms', 'Time Complexity'].map((strength, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-800 dark:text-gray-200">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-500" />
                Areas to Improve
              </h3>
              <div className="space-y-3">
                {['Graph Algorithms', 'Dynamic Programming', 'System Design'].map((weakness, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <Target className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-800 dark:text-gray-200">{weakness}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudyAnalytics
