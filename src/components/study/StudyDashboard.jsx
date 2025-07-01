import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  Clock,
  Target,
  Award,
  BookOpen,
  Code,
  Brain,
  Zap,
  Calendar,
  Star,
  Trophy,
  Users,
  ChevronRight,
  Play,
  CheckCircle,
  Circle,
  BarChart3,
  PieChart,
  Activity,
  Flame,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter,
  Download,
  Share2,
  Settings,
  Bell,
  Gift,
  Lightbulb,
  MapPin,
  Bookmark,
  Timer,
  Gauge,
  TrendingDown,
  Eye,
  RefreshCw,
  ExternalLink
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useUserProfileStore } from '../../store/userProfileStore'

const StudyDashboard = ({ selectedBranch, selectedSubject, topics, stats, onTopicSelect }) => {
  const {
    studySessions,
    topicProgress,
    achievements,
    performance,
    quizHistory,
    problemHistory,
    bookmarkedTopics,
    getTopicProgress,
    getTotalStudyTime,
    getStudyStreak,
    getRecentActivity,
    getWeeklyProgress,
    getSubjectStats
  } = useUserProfileStore()

  const [timeRange, setTimeRange] = useState('week') // week, month, all
  const [showAllActivity, setShowAllActivity] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState('overview') // overview, performance, goals, insights
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [showInsights, setShowInsights] = useState(true)

  // Enhanced dashboard metrics with comprehensive analytics
  const dashboardMetrics = useMemo(() => {
    const totalStudyTime = getTotalStudyTime()
    const studyStreak = getStudyStreak()
    const recentActivity = getRecentActivity(7) // Last 7 days
    const weeklyData = getWeeklyProgress()

    // Calculate weekly progress
    const weeklyProgress = topics.reduce((acc, [name]) => {
      return acc + getTopicProgress(name)
    }, 0) / Math.max(topics.length, 1)

    // Calculate completion rate
    const completedTopics = topics.filter(([name]) => getTopicProgress(name) >= 100).length
    const inProgressTopics = topics.filter(([name]) => {
      const progress = getTopicProgress(name)
      return progress > 0 && progress < 100
    }).length
    const completionRate = (completedTopics / Math.max(topics.length, 1)) * 100

    // Calculate study efficiency (progress per hour)
    const studyEfficiency = totalStudyTime > 0
      ? (weeklyProgress / (totalStudyTime / 3600)) * 100
      : 0

    // Calculate trends
    const lastWeekTime = weeklyData.slice(-7).reduce((acc, day) => acc + day.hours, 0)
    const previousWeekTime = weeklyData.slice(-14, -7).reduce((acc, day) => acc + day.hours, 0)
    const timeChange = previousWeekTime > 0 ? ((lastWeekTime - previousWeekTime) / previousWeekTime) * 100 : 0

    // Quiz performance
    const recentQuizzes = quizHistory.slice(0, 10)
    const averageQuizScore = recentQuizzes.length > 0
      ? recentQuizzes.reduce((acc, quiz) => acc + quiz.score, 0) / recentQuizzes.length
      : 0

    // Goal progress
    const dailyGoal = performance?.dailyGoal || 2
    const weeklyGoal = performance?.weeklyGoal || 10
    const todayTime = weeklyData[weeklyData.length - 1]?.hours || 0
    const weekTime = weeklyData.reduce((acc, day) => acc + day.hours, 0)

    return {
      totalStudyTime: Math.round(totalStudyTime / 60), // Convert to minutes
      totalStudyHours: Math.round(totalStudyTime / 3600 * 10) / 10, // Convert to hours with 1 decimal
      studyStreak,
      weeklyProgress: Math.round(weeklyProgress),
      completionRate: Math.round(completionRate),
      completedTopics,
      inProgressTopics,
      notStartedTopics: topics.length - completedTopics - inProgressTopics,
      recentSessions: recentActivity.length,
      averageSessionTime: recentActivity.length > 0
        ? Math.round(recentActivity.reduce((acc, session) => acc + session.duration, 0) / recentActivity.length / 60)
        : 0,
      studyEfficiency: Math.round(studyEfficiency),
      timeChange: Math.round(timeChange),
      averageQuizScore: Math.round(averageQuizScore),
      dailyGoalProgress: Math.round((todayTime / dailyGoal) * 100),
      weeklyGoalProgress: Math.round((weekTime / weeklyGoal) * 100),
      bookmarkedCount: bookmarkedTopics.length,
      achievementsCount: achievements.length,
      weeklyData
    }
  }, [topics, getTotalStudyTime, getStudyStreak, getRecentActivity, getWeeklyProgress,
      getTopicProgress, quizHistory, performance, bookmarkedTopics, achievements])

  // Advanced recommendation system
  const getSmartRecommendations = useMemo(() => {
    const recommendations = {
      nextTopics: [],
      reviewTopics: [],
      challengeTopics: [],
      quickWins: []
    }

    topics.forEach(([name, data]) => {
      const progress = getTopicProgress(name)
      const difficulty = data.difficulty?.toLowerCase() || 'medium'
      const importance = data.importance?.toLowerCase() || 'medium'

      // Next topics to study (not started, easy to medium difficulty)
      if (progress === 0 && ['easy', 'medium'].includes(difficulty)) {
        recommendations.nextTopics.push({ name, data, progress, score: importance === 'high' ? 3 : 2 })
      }

      // Topics to review (completed but might need reinforcement)
      if (progress >= 100) {
        const daysSinceCompletion = Math.random() * 30 // Mock data - would track actual completion date
        if (daysSinceCompletion > 7) {
          recommendations.reviewTopics.push({ name, data, progress, daysSince: daysSinceCompletion })
        }
      }

      // Challenge topics (hard difficulty, for advanced learners)
      if (progress === 0 && difficulty === 'hard' && dashboardMetrics.completionRate > 60) {
        recommendations.challengeTopics.push({ name, data, progress })
      }

      // Quick wins (partially completed, easy to finish)
      if (progress > 50 && progress < 100) {
        recommendations.quickWins.push({ name, data, progress })
      }
    })

    // Sort recommendations by score/priority
    recommendations.nextTopics.sort((a, b) => b.score - a.score)
    recommendations.reviewTopics.sort((a, b) => b.daysSince - a.daysSince)
    recommendations.quickWins.sort((a, b) => b.progress - a.progress)

    return recommendations
  }, [topics, getTopicProgress, dashboardMetrics.completionRate])

  // Learning insights and patterns
  const getLearningInsights = useMemo(() => {
    const insights = []

    // Study streak insights
    if (dashboardMetrics.studyStreak >= 7) {
      insights.push({
        type: 'achievement',
        icon: Flame,
        title: 'Great Consistency!',
        message: `You've maintained a ${dashboardMetrics.studyStreak}-day study streak. Keep it up!`,
        color: 'orange'
      })
    } else if (dashboardMetrics.studyStreak === 0) {
      insights.push({
        type: 'motivation',
        icon: Target,
        title: 'Start Your Streak',
        message: 'Study for just 15 minutes today to begin building a learning habit.',
        color: 'blue'
      })
    }

    // Progress insights
    if (dashboardMetrics.completionRate >= 80) {
      insights.push({
        type: 'achievement',
        icon: Trophy,
        title: 'Almost There!',
        message: `You've completed ${dashboardMetrics.completionRate}% of topics. You're doing amazing!`,
        color: 'green'
      })
    } else if (dashboardMetrics.completionRate < 20) {
      insights.push({
        type: 'suggestion',
        icon: Lightbulb,
        title: 'Getting Started',
        message: 'Focus on easy topics first to build momentum and confidence.',
        color: 'yellow'
      })
    }

    // Time management insights
    if (dashboardMetrics.timeChange > 20) {
      insights.push({
        type: 'achievement',
        icon: TrendingUp,
        title: 'Increased Study Time',
        message: `Your study time increased by ${Math.abs(dashboardMetrics.timeChange)}% this week!`,
        color: 'green'
      })
    } else if (dashboardMetrics.timeChange < -20) {
      insights.push({
        type: 'warning',
        icon: TrendingDown,
        title: 'Study Time Decreased',
        message: `Your study time decreased by ${Math.abs(dashboardMetrics.timeChange)}% this week. Try to get back on track!`,
        color: 'red'
      })
    }

    // Goal insights
    if (dashboardMetrics.weeklyGoalProgress >= 100) {
      insights.push({
        type: 'achievement',
        icon: Award,
        title: 'Weekly Goal Achieved!',
        message: 'You\'ve exceeded your weekly study goal. Consider setting a higher target!',
        color: 'purple'
      })
    }

    return insights.slice(0, 3) // Show top 3 insights
  }, [dashboardMetrics])

  // Subject-specific important topics for GATE
  const getSubjectImportantTopics = useMemo(() => {
    if (!selectedSubject) return []

    const subjectTopics = {
      'Computer Science': [
        { name: 'Data Structures', importance: 'Very High', gateWeight: 8, difficulty: 'Medium', progress: getTopicProgress('Data Structures') },
        { name: 'Algorithms', importance: 'Very High', gateWeight: 10, difficulty: 'Hard', progress: getTopicProgress('Algorithms') },
        { name: 'Operating Systems', importance: 'High', gateWeight: 6, difficulty: 'Medium', progress: getTopicProgress('Operating Systems') },
        { name: 'Database Management', importance: 'High', gateWeight: 7, difficulty: 'Medium', progress: getTopicProgress('Database Management') },
        { name: 'Computer Networks', importance: 'High', gateWeight: 6, difficulty: 'Medium', progress: getTopicProgress('Computer Networks') },
        { name: 'Theory of Computation', importance: 'Very High', gateWeight: 8, difficulty: 'Hard', progress: getTopicProgress('Theory of Computation') }
      ],
      'Electronics': [
        { name: 'Digital Electronics', importance: 'Very High', gateWeight: 9, difficulty: 'Medium', progress: getTopicProgress('Digital Electronics') },
        { name: 'Analog Circuits', importance: 'High', gateWeight: 7, difficulty: 'Hard', progress: getTopicProgress('Analog Circuits') },
        { name: 'Control Systems', importance: 'High', gateWeight: 6, difficulty: 'Medium', progress: getTopicProgress('Control Systems') },
        { name: 'Signal Processing', importance: 'High', gateWeight: 6, difficulty: 'Hard', progress: getTopicProgress('Signal Processing') },
        { name: 'Communication Systems', importance: 'High', gateWeight: 5, difficulty: 'Medium', progress: getTopicProgress('Communication Systems') },
        { name: 'Microprocessors', importance: 'High', gateWeight: 5, difficulty: 'Medium', progress: getTopicProgress('Microprocessors') }
      ],
      'Mechanical': [
        { name: 'Thermodynamics', importance: 'Very High', gateWeight: 8, difficulty: 'Medium', progress: getTopicProgress('Thermodynamics') },
        { name: 'Fluid Mechanics', importance: 'High', gateWeight: 7, difficulty: 'Hard', progress: getTopicProgress('Fluid Mechanics') },
        { name: 'Heat Transfer', importance: 'High', gateWeight: 6, difficulty: 'Medium', progress: getTopicProgress('Heat Transfer') },
        { name: 'Machine Design', importance: 'High', gateWeight: 6, difficulty: 'Medium', progress: getTopicProgress('Machine Design') },
        { name: 'Manufacturing', importance: 'High', gateWeight: 5, difficulty: 'Medium', progress: getTopicProgress('Manufacturing') },
        { name: 'Strength of Materials', importance: 'Very High', gateWeight: 7, difficulty: 'Medium', progress: getTopicProgress('Strength of Materials') }
      ],
      'Civil': [
        { name: 'Structural Analysis', importance: 'Very High', gateWeight: 9, difficulty: 'Hard', progress: getTopicProgress('Structural Analysis') },
        { name: 'Concrete Technology', importance: 'High', gateWeight: 7, difficulty: 'Medium', progress: getTopicProgress('Concrete Technology') },
        { name: 'Geotechnical Engineering', importance: 'High', gateWeight: 6, difficulty: 'Medium', progress: getTopicProgress('Geotechnical Engineering') },
        { name: 'Transportation Engineering', importance: 'High', gateWeight: 5, difficulty: 'Medium', progress: getTopicProgress('Transportation Engineering') },
        { name: 'Environmental Engineering', importance: 'High', gateWeight: 5, difficulty: 'Medium', progress: getTopicProgress('Environmental Engineering') },
        { name: 'Hydraulics', importance: 'High', gateWeight: 6, difficulty: 'Medium', progress: getTopicProgress('Hydraulics') }
      ]
    }

    return subjectTopics[selectedSubject] || []
  }, [selectedSubject, getTopicProgress])

  // Enhanced performance metrics with trends
  const performanceMetrics = useMemo(() => [
    {
      id: 'study-time',
      title: 'Total Study Time',
      value: `${dashboardMetrics.totalStudyHours}h`,
      subtitle: `${dashboardMetrics.totalStudyTime} minutes`,
      icon: Clock,
      color: 'blue',
      trend: dashboardMetrics.timeChange,
      trendLabel: `${dashboardMetrics.timeChange > 0 ? '+' : ''}${dashboardMetrics.timeChange}% this week`,
      progress: Math.min(100, (dashboardMetrics.totalStudyHours / 50) * 100) // Assuming 50h is a good milestone
    },
    {
      id: 'completion-rate',
      title: 'Completion Rate',
      value: selectedSubject ?
        `${Math.round((getSubjectImportantTopics.filter(t => t.progress >= 100).length / Math.max(getSubjectImportantTopics.length, 1)) * 100)}%` :
        `${dashboardMetrics.completionRate}%`,
      subtitle: selectedSubject ?
        `${getSubjectImportantTopics.filter(t => t.progress >= 100).length}/${getSubjectImportantTopics.length} ${selectedSubject} topics` :
        `${dashboardMetrics.completedTopics}/${topics.length} topics`,
      icon: Target,
      color: 'green',
      trend: selectedSubject ?
        (getSubjectImportantTopics.filter(t => t.progress >= 100).length > 0 ? 15 : 0) :
        (dashboardMetrics.completionRate > 50 ? 15 : -5),
      trendLabel: selectedSubject ? `${selectedSubject} progress` : 'Great progress!',
      progress: selectedSubject ?
        Math.round((getSubjectImportantTopics.filter(t => t.progress >= 100).length / Math.max(getSubjectImportantTopics.length, 1)) * 100) :
        dashboardMetrics.completionRate
    },
    {
      id: 'study-streak',
      title: 'Study Streak',
      value: `${dashboardMetrics.studyStreak}`,
      subtitle: dashboardMetrics.studyStreak === 1 ? 'day' : 'days',
      icon: Flame,
      color: 'orange',
      trend: dashboardMetrics.studyStreak > 0 ? 1 : 0,
      trendLabel: dashboardMetrics.studyStreak > 0 ? 'Keep it up!' : 'Start today!',
      progress: Math.min(100, (dashboardMetrics.studyStreak / 30) * 100) // 30 days as max
    },
    {
      id: 'efficiency',
      title: 'Study Efficiency',
      value: `${dashboardMetrics.studyEfficiency}%`,
      subtitle: 'Progress per hour',
      icon: Zap,
      color: 'purple',
      trend: dashboardMetrics.studyEfficiency > 50 ? 8 : -3,
      trendLabel: dashboardMetrics.studyEfficiency > 50 ? 'Excellent!' : 'Room for improvement',
      progress: dashboardMetrics.studyEfficiency
    },
    {
      id: 'quiz-performance',
      title: 'Quiz Average',
      value: `${dashboardMetrics.averageQuizScore}%`,
      subtitle: `${quizHistory.length} quizzes taken`,
      icon: Brain,
      color: 'indigo',
      trend: dashboardMetrics.averageQuizScore > 75 ? 12 : -2,
      trendLabel: dashboardMetrics.averageQuizScore > 75 ? 'Outstanding!' : 'Keep practicing',
      progress: dashboardMetrics.averageQuizScore
    },
    {
      id: 'weekly-goal',
      title: 'Weekly Goal',
      value: `${dashboardMetrics.weeklyGoalProgress}%`,
      subtitle: `${dashboardMetrics.weeklyData.reduce((acc, day) => acc + day.hours, 0).toFixed(1)}h / ${performance?.weeklyGoal || 10}h`,
      icon: Calendar,
      color: 'teal',
      trend: dashboardMetrics.weeklyGoalProgress >= 100 ? 25 : 0,
      trendLabel: dashboardMetrics.weeklyGoalProgress >= 100 ? 'Goal achieved!' : 'In progress',
      progress: Math.min(100, dashboardMetrics.weeklyGoalProgress)
    }
  ], [dashboardMetrics, topics.length, quizHistory.length, performance])

  // Smart quick actions based on user progress
  const getSmartQuickActions = useMemo(() => {
    const actions = []

    // Continue learning action
    if (getSmartRecommendations.quickWins.length > 0) {
      actions.push({
        title: 'Complete Topic',
        description: `Finish ${getSmartRecommendations.quickWins[0].name}`,
        icon: Play,
        color: 'blue',
        priority: 'high',
        action: () => console.log('Continue learning')
      })
    } else if (getSmartRecommendations.nextTopics.length > 0) {
      actions.push({
        title: 'Start New Topic',
        description: `Begin ${getSmartRecommendations.nextTopics[0].name}`,
        icon: BookOpen,
        color: 'blue',
        priority: 'medium',
        action: () => console.log('Start new topic')
      })
    }

    // Quiz action
    if (dashboardMetrics.averageQuizScore < 80 || quizHistory.length < 5) {
      actions.push({
        title: 'Take Quiz',
        description: 'Test your knowledge',
        icon: Target,
        color: 'green',
        priority: 'medium',
        action: () => console.log('Take quiz')
      })
    }

    // Practice problems
    actions.push({
      title: 'Practice Problems',
      description: 'Solve coding challenges',
      icon: Code,
      color: 'purple',
      priority: 'medium',
      action: () => console.log('Practice problems')
    })

    // Review action
    if (getSmartRecommendations.reviewTopics.length > 0) {
      actions.push({
        title: 'Review Topics',
        description: `Review ${getSmartRecommendations.reviewTopics.length} completed topics`,
        icon: RefreshCw,
        color: 'orange',
        priority: 'low',
        action: () => console.log('Review topics')
      })
    }

    // Goal setting
    if (dashboardMetrics.weeklyGoalProgress >= 100) {
      actions.push({
        title: 'Set New Goals',
        description: 'Update your study targets',
        icon: Settings,
        color: 'gray',
        priority: 'low',
        action: () => setShowGoalModal(true)
      })
    }

    return actions.slice(0, 4) // Show top 4 actions
  }, [getSmartRecommendations, dashboardMetrics, quizHistory.length])

  return (
    <div className="space-y-6">
      {/* Enhanced Welcome Header with Goals */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">Welcome back!</h1>
                {dashboardMetrics.studyStreak > 0 && (
                  <div className="flex items-center gap-1 bg-orange-500 bg-opacity-20 px-2 py-1 rounded-full">
                    <Flame className="w-4 h-4 text-orange-300" />
                    <span className="text-sm font-medium">{dashboardMetrics.studyStreak} day streak</span>
                  </div>
                )}
              </div>
              <p className="text-blue-100 mb-3">
                {selectedSubject ? `Continue studying ${selectedSubject}` : 'Select a subject to start learning'}
              </p>

              {/* Daily Goal Progress */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-blue-200">Today's Goal</span>
                    <span className="text-sm text-blue-200">{dashboardMetrics.dailyGoalProgress}%</span>
                  </div>
                  <div className="w-full bg-blue-800 bg-opacity-30 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, dashboardMetrics.dailyGoalProgress)}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{dashboardMetrics.weeklyData[dashboardMetrics.weeklyData.length - 1]?.hours.toFixed(1) || 0}h</div>
                  <div className="text-xs text-blue-200">today</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowGoalModal(true)}
                className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              <div className="text-right">
                <div className="text-3xl font-bold">{dashboardMetrics.completionRate}%</div>
                <div className="text-blue-100 text-sm">Complete</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {performanceMetrics.map((metric, index) => {
          const Icon = metric.icon
          const getTrendIcon = () => {
            if (metric.trend > 0) return ArrowUp
            if (metric.trend < 0) return ArrowDown
            return Minus
          }
          const TrendIcon = getTrendIcon()

          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  metric.color === 'blue' && "bg-blue-100 dark:bg-blue-900/20",
                  metric.color === 'green' && "bg-green-100 dark:bg-green-900/20",
                  metric.color === 'orange' && "bg-orange-100 dark:bg-orange-900/20",
                  metric.color === 'purple' && "bg-purple-100 dark:bg-purple-900/20",
                  metric.color === 'indigo' && "bg-indigo-100 dark:bg-indigo-900/20",
                  metric.color === 'teal' && "bg-teal-100 dark:bg-teal-900/20"
                )}>
                  <Icon className={cn(
                    "w-6 h-6",
                    metric.color === 'blue' && "text-blue-600 dark:text-blue-400",
                    metric.color === 'green' && "text-green-600 dark:text-green-400",
                    metric.color === 'orange' && "text-orange-600 dark:text-orange-400",
                    metric.color === 'purple' && "text-purple-600 dark:text-purple-400",
                    metric.color === 'indigo' && "text-indigo-600 dark:text-indigo-400",
                    metric.color === 'teal' && "text-teal-600 dark:text-teal-400"
                  )} />
                </div>

                <div className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                  metric.trend > 0 && "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
                  metric.trend < 0 && "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
                  metric.trend === 0 && "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
                )}>
                  <TrendIcon className="w-3 h-3" />
                  {Math.abs(metric.trend)}%
                </div>
              </div>

              <div className="mb-3">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {metric.subtitle}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">{metric.title}</span>
                  <span className="text-gray-700 dark:text-gray-300">{Math.round(metric.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className={cn(
                      "h-2 rounded-full",
                      metric.color === 'blue' && "bg-blue-500",
                      metric.color === 'green' && "bg-green-500",
                      metric.color === 'orange' && "bg-orange-500",
                      metric.color === 'purple' && "bg-purple-500",
                      metric.color === 'indigo' && "bg-indigo-500",
                      metric.color === 'teal' && "bg-teal-500"
                    )}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {metric.trendLabel}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Learning Insights */}
      {showInsights && getLearningInsights.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Learning Insights</h3>
            <button
              onClick={() => setShowInsights(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getLearningInsights.map((insight, index) => {
              const Icon = insight.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "p-4 rounded-lg border-l-4",
                    insight.color === 'blue' && "bg-blue-50 border-blue-500 dark:bg-blue-900/10 dark:border-blue-400",
                    insight.color === 'green' && "bg-green-50 border-green-500 dark:bg-green-900/10 dark:border-green-400",
                    insight.color === 'orange' && "bg-orange-50 border-orange-500 dark:bg-orange-900/10 dark:border-orange-400",
                    insight.color === 'yellow' && "bg-yellow-50 border-yellow-500 dark:bg-yellow-900/10 dark:border-yellow-400",
                    insight.color === 'red' && "bg-red-50 border-red-500 dark:bg-red-900/10 dark:border-red-400",
                    insight.color === 'purple' && "bg-purple-50 border-purple-500 dark:bg-purple-900/10 dark:border-purple-400"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={cn(
                      "w-5 h-5 mt-0.5 flex-shrink-0",
                      insight.color === 'blue' && "text-blue-600 dark:text-blue-400",
                      insight.color === 'green' && "text-green-600 dark:text-green-400",
                      insight.color === 'orange' && "text-orange-600 dark:text-orange-400",
                      insight.color === 'yellow' && "text-yellow-600 dark:text-yellow-400",
                      insight.color === 'red' && "text-red-600 dark:text-red-400",
                      insight.color === 'purple' && "text-purple-600 dark:text-purple-400"
                    )} />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{insight.message}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Smart Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommended Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {getSmartQuickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={action.action}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 relative",
                  action.priority === 'high' && "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400",
                  action.priority === 'medium' && "border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700",
                  action.priority === 'low' && "border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-25 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800",
                  action.color === 'blue' && action.priority !== 'high' && "hover:border-blue-400 hover:bg-blue-50 dark:hover:border-blue-600 dark:hover:bg-blue-900/20",
                  action.color === 'green' && "hover:border-green-400 hover:bg-green-50 dark:hover:border-green-600 dark:hover:bg-green-900/20",
                  action.color === 'purple' && "hover:border-purple-400 hover:bg-purple-50 dark:hover:border-purple-600 dark:hover:bg-purple-900/20",
                  action.color === 'orange' && "hover:border-orange-400 hover:bg-orange-50 dark:hover:border-orange-600 dark:hover:bg-orange-900/20"
                )}
              >
                {action.priority === 'high' && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
                <Icon className={cn(
                  "w-8 h-8 mx-auto mb-2",
                  action.color === 'blue' && "text-blue-600 dark:text-blue-400",
                  action.color === 'green' && "text-green-600 dark:text-green-400",
                  action.color === 'purple' && "text-purple-600 dark:text-purple-400",
                  action.color === 'orange' && "text-orange-600 dark:text-orange-400",
                  action.color === 'gray' && "text-gray-600 dark:text-gray-400"
                )} />
                <div className="text-sm font-medium text-gray-900 dark:text-white">{action.title}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{action.description}</div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Smart Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Wins */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Wins</h3>
              <div className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                {getSmartRecommendations.quickWins.length}
              </div>
            </div>
            <Zap className="w-5 h-5 text-green-500" />
          </div>

          <div className="space-y-3">
            {getSmartRecommendations.quickWins.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No quick wins available</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Start some topics to see completion opportunities</p>
              </div>
            ) : (
              getSmartRecommendations.quickWins.slice(0, 3).map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <div className="text-sm font-bold text-green-600 dark:text-green-400">
                        {item.progress}%
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {100 - item.progress}% remaining • {item.data.difficulty}
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors">
                    Finish
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Enhanced Next Topics with GFG Links */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedSubject ? `${selectedSubject} Topics` : 'Next Topics'}
              </h3>
              <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                {selectedSubject ? getSubjectImportantTopics.filter(t => t.progress < 100).length : getSmartRecommendations.nextTopics.length}
              </div>
            </div>
            <Star className="w-5 h-5 text-blue-500" />
          </div>

          <div className="space-y-3">
            {selectedSubject ? (
              getSubjectImportantTopics.filter(t => t.progress < 100).length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-green-600 dark:text-green-400">All {selectedSubject} topics completed!</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Excellent work on {selectedSubject}</p>
                </div>
              ) : (
                getSubjectImportantTopics.filter(t => t.progress < 100).slice(0, 3).map((topic, index) => (
                  <motion.div
                    key={topic.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          {topic.gateWeight}m
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{topic.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {topic.difficulty} • {topic.importance} • {topic.gateWeight} GATE marks
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                            <div
                              className="h-1 bg-blue-500 rounded-full transition-all duration-300"
                              style={{ width: `${topic.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{topic.progress}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://www.geeksforgeeks.org/${topic.name.toLowerCase().replace(/\s+/g, '-')}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        GFG
                      </a>
                      <button
                        onClick={() => onTopicSelect?.(topic.name)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                      >
                        {topic.progress > 0 ? 'Continue' : 'Start'}
                      </button>
                    </div>
                  </motion.div>
                ))
              )
            ) : (
              getSmartRecommendations.nextTopics.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">All topics started!</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Focus on completing your current topics</p>
                </div>
              ) : (
                getSmartRecommendations.nextTopics.slice(0, 3).map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {item.data.difficulty} • {item.data.importance || 'Medium'} priority
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://www.geeksforgeeks.org/${item.name.toLowerCase().replace(/\s+/g, '-')}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        GFG
                      </a>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
                        Start
                      </button>
                    </div>
                  </motion.div>
                ))
              )
            )}
          </div>
        </div>
      </div>

      {/* Review & Challenge Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Review Topics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Review Topics</h3>
              <div className="px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-full text-xs font-medium">
                {getSmartRecommendations.reviewTopics.length}
              </div>
            </div>
            <RefreshCw className="w-5 h-5 text-orange-500" />
          </div>

          <div className="space-y-3">
            {getSmartRecommendations.reviewTopics.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No topics to review</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Complete some topics first</p>
              </div>
            ) : (
              getSmartRecommendations.reviewTopics.slice(0, 3).map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Completed • {Math.round(item.daysSince)} days ago
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700 transition-colors">
                    Review
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Challenge Topics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Challenge Topics</h3>
              <div className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
                {getSmartRecommendations.challengeTopics.length}
              </div>
            </div>
            <Trophy className="w-5 h-5 text-red-500" />
          </div>

          <div className="space-y-3">
            {getSmartRecommendations.challengeTopics.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No challenges available</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Complete more topics to unlock challenges</p>
              </div>
            ) : (
              getSmartRecommendations.challengeTopics.slice(0, 3).map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Hard • Advanced topic
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors">
                    Challenge
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Weekly Activity Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Activity</h3>
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekly activity bars */}
        <div className="space-y-4 mb-6">
          {dashboardMetrics.weeklyData.map((day, index) => {
            const maxHours = Math.max(...dashboardMetrics.weeklyData.map(d => d.hours))
            const percentage = maxHours > 0 ? (day.hours / maxHours) * 100 : 0
            const dayName = new Date(day.date).toLocaleDateString('en', { weekday: 'short' })

            return (
              <div key={day.date} className="flex items-center gap-4">
                <div className="w-8 text-sm font-medium text-gray-600 dark:text-gray-400">
                  {dayName}
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-end pr-2"
                    >
                      {day.hours > 0 && (
                        <span className="text-xs text-white font-medium">
                          {day.hours.toFixed(1)}h
                        </span>
                      )}
                    </motion.div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 w-16 text-right">
                  {day.topics} topics
                </div>
              </div>
            )
          })}
        </div>

        {/* Weekly summary */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {dashboardMetrics.weeklyData.reduce((acc, day) => acc + day.hours, 0).toFixed(1)}h
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Hours</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {dashboardMetrics.weeklyData.reduce((acc, day) => acc + day.topics, 0)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Topics Studied</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {(dashboardMetrics.weeklyData.reduce((acc, day) => acc + day.hours, 0) / 7).toFixed(1)}h
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Daily Average</div>
          </div>
        </div>
      </div>

      {/* Goal Setting Modal */}
      <AnimatePresence>
        {showGoalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowGoalModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Study Goals</h3>
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Daily Goal (hours)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="12"
                    step="0.5"
                    defaultValue={performance?.dailyGoal || 2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Weekly Goal (hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    defaultValue={performance?.weeklyGoal || 10}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowGoalModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Save goals logic would go here
                      setShowGoalModal(false)
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Goals
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default StudyDashboard
