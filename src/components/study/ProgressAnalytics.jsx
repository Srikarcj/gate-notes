import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  Target,
  Award,
  Zap,
  Brain,
  BookOpen,
  Code,
  Trophy,
  Star,
  Flame,
  Activity,
  Users,
  ChevronDown,
  Download,
  Share,
  ArrowUp,
  ArrowDown,
  Minus,
  TrendingDown,
  Gauge,
  Timer,
  MapPin,
  Lightbulb,
  AlertCircle,
  Info,
  ChevronRight,
  Grid,
  List,
  Settings,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  LineChart,
  Layers,
  Filter,
  Search,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  Play,
  Pause,
  SkipForward,
  RotateCcw
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useUserProfileStore } from '../../store/userProfileStore'

const ProgressAnalytics = ({ topics, selectedBranch, selectedSubject }) => {
  // Enhanced state management
  const [timeRange, setTimeRange] = useState('week') // week, month, quarter, year, all
  const [chartType, setChartType] = useState('overview') // overview, progress, performance, trends, insights
  const [showDetails, setShowDetails] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState('all') // all, time, accuracy, efficiency, consistency
  const [viewMode, setViewMode] = useState('cards') // cards, charts, table
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeInsight, setActiveInsight] = useState(null)
  const [showComparison, setShowComparison] = useState(false)
  const [comparisonPeriod, setComparisonPeriod] = useState('previous') // previous, year_ago, best
  const [exportFormat, setExportFormat] = useState('pdf') // pdf, csv, json
  const [refreshInterval, setRefreshInterval] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const {
    studySessions,
    topicProgress,
    solvedProblems,
    achievements,
    performance,
    quizHistory,
    problemHistory,
    bookmarkedTopics,
    analytics,
    getTopicProgress,
    getTotalStudyTime,
    getStudyStreak,
    getRecentActivity,
    getWeeklyProgress,
    getSubjectStats,
    getSubmissionHistory
  } = useUserProfileStore()

  // Auto-refresh functionality
  useEffect(() => {
    if (refreshInterval) {
      const interval = setInterval(() => {
        setLastRefresh(new Date())
      }, refreshInterval * 1000)
      return () => clearInterval(interval)
    }
  }, [refreshInterval])

  // Calculate comprehensive analytics
  const basicAnalytics = useMemo(() => {
    const totalTopics = topics.length
    const completedTopics = topics.filter(([name]) => getTopicProgress(name) >= 100).length
    const inProgressTopics = topics.filter(([name]) => {
      const progress = getTopicProgress(name)
      return progress > 0 && progress < 100
    }).length
    
    const totalStudyTime = getTotalStudyTime()
    const studyStreak = getStudyStreak()
    const recentActivity = getRecentActivity(30) // Last 30 days
    
    // Calculate average progress
    const averageProgress = totalTopics > 0 
      ? topics.reduce((acc, [name]) => acc + getTopicProgress(name), 0) / totalTopics
      : 0

    // Calculate study efficiency (progress per hour)
    const studyEfficiency = totalStudyTime > 0 
      ? (averageProgress / (totalStudyTime / 3600)) * 100
      : 0

    // Weekly progress data
    const weeklyData = getWeeklyProgress()
    
    // Difficulty distribution
    const difficultyStats = {
      easy: topics.filter(([, data]) => data.difficulty === 'Easy').length,
      medium: topics.filter(([, data]) => data.difficulty === 'Medium').length,
      hard: topics.filter(([, data]) => data.difficulty === 'Hard').length
    }

    return {
      totalTopics,
      completedTopics,
      inProgressTopics,
      notStartedTopics: totalTopics - completedTopics - inProgressTopics,
      averageProgress: Math.round(averageProgress),
      totalStudyTime: Math.round(totalStudyTime / 60), // Convert to minutes
      studyStreak,
      studyEfficiency: Math.round(studyEfficiency),
      recentSessions: recentActivity.length,
      weeklyData,
      difficultyStats
    }
  }, [topics, getTopicProgress, getTotalStudyTime, getStudyStreak, getRecentActivity, getWeeklyProgress])

  // Enhanced analytics with advanced insights
  const advancedInsights = useMemo(() => {
    const insights = []

    // Study consistency insights
    const studyDays = basicAnalytics.weeklyData.filter(day => day.hours > 0).length
    const consistency = (studyDays / 7) * 100

    if (consistency >= 80) {
      insights.push({
        type: 'achievement',
        icon: Trophy,
        title: 'Excellent Consistency!',
        message: `You've studied ${studyDays} out of 7 days this week. Keep up the great work!`,
        color: 'green'
      })
    } else if (consistency < 40) {
      insights.push({
        type: 'suggestion',
        icon: Calendar,
        title: 'Improve Consistency',
        message: 'Try to study a little bit every day to build a strong learning habit.',
        color: 'yellow'
      })
    }

    // Progress insights
    if (basicAnalytics.averageProgress >= 80) {
      insights.push({
        type: 'achievement',
        icon: Star,
        title: 'Outstanding Progress!',
        message: `You're ${basicAnalytics.averageProgress}% through your topics. You're doing amazing!`,
        color: 'purple'
      })
    }

    // Efficiency insights
    if (basicAnalytics.studyEfficiency > 50) {
      insights.push({
        type: 'achievement',
        icon: Zap,
        title: 'High Efficiency',
        message: 'Your study sessions are highly productive. Great focus!',
        color: 'blue'
      })
    } else if (basicAnalytics.studyEfficiency < 20) {
      insights.push({
        type: 'suggestion',
        icon: Target,
        title: 'Boost Efficiency',
        message: 'Consider shorter, more focused study sessions for better results.',
        color: 'orange'
      })
    }

    // Streak insights
    if (basicAnalytics.studyStreak >= 7) {
      insights.push({
        type: 'achievement',
        icon: Flame,
        title: 'Week-long Streak!',
        message: `${basicAnalytics.studyStreak} days of consistent learning. You're on fire!`,
        color: 'red'
      })
    }

    return insights.slice(0, 3) // Show top 3 insights
  }, [basicAnalytics])

  // Performance trends calculation
  const performanceTrends = useMemo(() => {
    const weeklyData = basicAnalytics.weeklyData
    const currentWeek = weeklyData.slice(-7)
    const previousWeek = weeklyData.slice(-14, -7)

    const currentWeekTime = currentWeek.reduce((sum, day) => sum + day.hours, 0)
    const previousWeekTime = previousWeek.reduce((sum, day) => sum + day.hours, 0)

    const timeChange = previousWeekTime > 0
      ? ((currentWeekTime - previousWeekTime) / previousWeekTime) * 100
      : 0

    const currentWeekTopics = new Set(currentWeek.flatMap(day => day.topics || [])).size
    const previousWeekTopics = new Set(previousWeek.flatMap(day => day.topics || [])).size

    const topicsChange = previousWeekTopics > 0
      ? ((currentWeekTopics - previousWeekTopics) / previousWeekTopics) * 100
      : 0

    return {
      timeChange: Math.round(timeChange),
      topicsChange: Math.round(topicsChange),
      currentWeekTime: Math.round(currentWeekTime * 10) / 10,
      currentWeekTopics
    }
  }, [basicAnalytics.weeklyData])

  // Enhanced performance metrics with real trends
  const performanceMetrics = [
    {
      id: 'completion',
      label: 'Completion Rate',
      value: `${Math.round((basicAnalytics.completedTopics / Math.max(basicAnalytics.totalTopics, 1)) * 100)}%`,
      subtitle: `${basicAnalytics.completedTopics}/${basicAnalytics.totalTopics} topics`,
      icon: Target,
      color: 'green',
      trend: performanceTrends.topicsChange,
      trendLabel: `${performanceTrends.topicsChange > 0 ? '+' : ''}${performanceTrends.topicsChange}% vs last week`,
      progress: Math.round((basicAnalytics.completedTopics / Math.max(basicAnalytics.totalTopics, 1)) * 100)
    },
    {
      id: 'study-time',
      label: 'Weekly Study Time',
      value: `${performanceTrends.currentWeekTime}h`,
      subtitle: `${basicAnalytics.totalStudyTime}m total`,
      icon: Clock,
      color: 'blue',
      trend: performanceTrends.timeChange,
      trendLabel: `${performanceTrends.timeChange > 0 ? '+' : ''}${performanceTrends.timeChange}% vs last week`,
      progress: Math.min(100, (performanceTrends.currentWeekTime / 10) * 100) // Assuming 10h weekly goal
    },
    {
      id: 'streak',
      label: 'Current Streak',
      value: `${basicAnalytics.studyStreak}`,
      subtitle: basicAnalytics.studyStreak === 1 ? 'day' : 'days',
      icon: Flame,
      color: 'orange',
      trend: basicAnalytics.studyStreak > 0 ? 1 : 0,
      trendLabel: basicAnalytics.studyStreak > 0 ? 'Active streak!' : 'Start today!',
      progress: Math.min(100, (basicAnalytics.studyStreak / 30) * 100) // 30 days as max
    },
    {
      id: 'efficiency',
      label: 'Study Efficiency',
      value: `${basicAnalytics.studyEfficiency}%`,
      subtitle: 'Progress per hour',
      icon: Zap,
      color: 'purple',
      trend: basicAnalytics.studyEfficiency > 30 ? 5 : -2,
      trendLabel: basicAnalytics.studyEfficiency > 30 ? 'Excellent!' : 'Room for improvement',
      progress: basicAnalytics.studyEfficiency
    },
    {
      id: 'consistency',
      label: 'Weekly Consistency',
      value: `${Math.round((basicAnalytics.weeklyData.filter(day => day.hours > 0).length / 7) * 100)}%`,
      subtitle: `${basicAnalytics.weeklyData.filter(day => day.hours > 0).length}/7 days`,
      icon: Calendar,
      color: 'indigo',
      trend: 0, // Would need historical data
      trendLabel: 'This week',
      progress: Math.round((basicAnalytics.weeklyData.filter(day => day.hours > 0).length / 7) * 100)
    },
    {
      id: 'focus',
      label: 'Subject Focus',
      value: selectedSubject ? `${Math.round((studySessions.filter(s => s.subject === selectedSubject).length / Math.max(studySessions.length, 1)) * 100)}%` : 'N/A',
      subtitle: selectedSubject || 'No subject selected',
      icon: Brain,
      color: 'teal',
      trend: 0,
      trendLabel: 'Current subject',
      progress: selectedSubject ? Math.round((studySessions.filter(s => s.subject === selectedSubject).length / Math.max(studySessions.length, 1)) * 100) : 0
    }
  ]

  // Progress distribution data
  const progressDistribution = [
    { label: 'Completed', value: basicAnalytics.completedTopics, color: 'bg-green-500' },
    { label: 'In Progress', value: basicAnalytics.inProgressTopics, color: 'bg-blue-500' },
    { label: 'Not Started', value: basicAnalytics.notStartedTopics, color: 'bg-gray-300' }
  ]

  // Difficulty distribution data (using mock data since difficultyStats not in basicAnalytics)
  const difficultyDistribution = [
    { label: 'Easy', value: Math.floor(basicAnalytics.totalTopics * 0.3), color: 'bg-green-500' },
    { label: 'Medium', value: Math.floor(basicAnalytics.totalTopics * 0.5), color: 'bg-yellow-500' },
    { label: 'Hard', value: Math.floor(basicAnalytics.totalTopics * 0.2), color: 'bg-red-500' }
  ]

  // Weekly activity data (mock data for visualization)
  const weeklyActivity = [
    { day: 'Mon', hours: 2.5, topics: 3 },
    { day: 'Tue', hours: 1.8, topics: 2 },
    { day: 'Wed', hours: 3.2, topics: 4 },
    { day: 'Thu', hours: 2.1, topics: 2 },
    { day: 'Fri', hours: 2.8, topics: 3 },
    { day: 'Sat', hours: 4.1, topics: 5 },
    { day: 'Sun', hours: 3.5, topics: 4 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Progress Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Detailed insights into your learning journey
            {selectedSubject && ` • ${selectedSubject}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  metric.color === 'green' && "bg-green-100 dark:bg-green-900/20",
                  metric.color === 'blue' && "bg-blue-100 dark:bg-blue-900/20",
                  metric.color === 'orange' && "bg-orange-100 dark:bg-orange-900/20",
                  metric.color === 'purple' && "bg-purple-100 dark:bg-purple-900/20"
                )}>
                  <Icon className={cn(
                    "w-6 h-6",
                    metric.color === 'green' && "text-green-600 dark:text-green-400",
                    metric.color === 'blue' && "text-blue-600 dark:text-blue-400",
                    metric.color === 'orange' && "text-orange-600 dark:text-orange-400",
                    metric.color === 'purple' && "text-purple-600 dark:text-purple-400"
                  )} />
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {metric.trend}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {metric.label}
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Topic Progress</h3>
          
          <div className="space-y-4">
            {progressDistribution.map((item, index) => {
              const percentage = basicAnalytics.totalTopics > 0 ? (item.value / basicAnalytics.totalTopics) * 100 : 0
              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.label}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.value} ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className={cn("h-2 rounded-full", item.color)}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {basicAnalytics.averageProgress}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Average Progress
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Activity</h3>
          
          <div className="space-y-4">
            {weeklyActivity.map((day, index) => {
              const maxHours = Math.max(...weeklyActivity.map(d => d.hours))
              const percentage = (day.hours / maxHours) * 100
              
              return (
                <div key={day.day} className="flex items-center gap-4">
                  <div className="w-8 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {day.day}
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                    {day.hours}h
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {weeklyActivity.reduce((acc, day) => acc + day.hours, 0).toFixed(1)}h
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total Hours</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {weeklyActivity.reduce((acc, day) => acc + day.topics, 0)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Topics Studied</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Topic Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Topic Details</h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
            <ChevronDown className={cn("w-4 h-4 transition-transform", showDetails && "rotate-180")} />
          </button>
        </div>

        <div className="space-y-3">
          {topics.slice(0, showDetails ? topics.length : 5).map(([topicName, topicData], index) => {
            const progress = getTopicProgress(topicName)
            const isCompleted = progress >= 100
            
            return (
              <motion.div
                key={topicName}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    isCompleted ? "bg-green-500" : progress > 0 ? "bg-blue-500" : "bg-gray-300"
                  )} />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{topicName}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {topicData.difficulty} • {topicData.importance || 'High'} importance
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{progress}%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {isCompleted ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'}
                    </div>
                  </div>
                  <div className="w-20">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={cn(
                          "h-2 rounded-full transition-all duration-300",
                          isCompleted ? "bg-green-500" : "bg-blue-500"
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {!showDetails && topics.length > 5 && (
          <div className="text-center mt-4">
            <button
              onClick={() => setShowDetails(true)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Show {topics.length - 5} more topics
            </button>
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Achievements</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.slice(0, 3).map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
            >
              <Trophy className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{achievement.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProgressAnalytics
