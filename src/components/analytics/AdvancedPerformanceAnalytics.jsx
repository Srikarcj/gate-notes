import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Target,
  Brain,
  Zap,
  Award,
  BarChart3,
  LineChart,
  Activity,
  Clock,
  Code,
  BookOpen,
  Star,
  Trophy,
  Medal,
  Flame,
  ArrowUp,
  ArrowDown,
  Minus,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useUserProfileStore } from '../../store/userProfileStore'

const AdvancedPerformanceAnalytics = ({ selectedBranch, selectedSubject }) => {
  const [timeRange, setTimeRange] = useState('month')
  const [analysisType, setAnalysisType] = useState('comprehensive') // comprehensive, gfg, difficulty, comparative

  const {
    performance,
    studySessions,
    getSessionAnalytics,
    topicProgress
  } = useUserProfileStore()

  // Advanced performance calculations
  const advancedMetrics = useMemo(() => {
    const sessions = studySessions.slice(0, 50) // Last 50 sessions
    
    // GFG-specific metrics
    const gfgInteractions = sessions.reduce((acc, session) => {
      if (session.interactions) {
        const gfgClicks = session.interactions.filter(i => 
          i.type.includes('gfg') || i.type.includes('practice') || i.type.includes('problem')
        )
        acc.totalGFGInteractions += gfgClicks.length
        acc.practiceAttempts += gfgClicks.filter(i => i.type.includes('practice')).length
        acc.problemAttempts += gfgClicks.filter(i => i.type.includes('problem')).length
      }
      return acc
    }, { totalGFGInteractions: 0, practiceAttempts: 0, problemAttempts: 0 })

    // Difficulty progression analysis
    const difficultyProgression = sessions.reduce((acc, session) => {
      if (session.difficulty) {
        acc[session.difficulty] = (acc[session.difficulty] || 0) + 1
      }
      return acc
    }, {})

    // Topic mastery analysis
    const topicMastery = Object.entries(performance.topicMasteryScores || {})
      .map(([topic, score]) => ({ topic, score }))
      .sort((a, b) => b.score - a.score)

    // Learning velocity (topics completed per week)
    const learningVelocity = sessions.length > 0 ? 
      (performance.totalTopicsCompleted / Math.max(1, sessions.length / 7)) : 0

    // Consistency score (study frequency)
    const studyDays = new Set(sessions.map(s => 
      new Date(s.timestamp).toDateString()
    )).size
    const consistencyScore = Math.min(100, (studyDays / 30) * 100)

    // Focus efficiency (completion rate vs time spent)
    const avgCompletionRate = sessions.length > 0 ?
      sessions.reduce((sum, s) => sum + (s.completionRate || 0), 0) / sessions.length : 0
    const avgSessionTime = sessions.length > 0 ?
      sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length : 0
    const focusEfficiency = avgSessionTime > 0 ? 
      (avgCompletionRate / (avgSessionTime / 3600)) * 100 : 0

    // Subject-wise performance
    const subjectPerformance = sessions.reduce((acc, session) => {
      if (session.subject) {
        if (!acc[session.subject]) {
          acc[session.subject] = { sessions: 0, totalTime: 0, avgCompletion: 0, topics: new Set() }
        }
        acc[session.subject].sessions++
        acc[session.subject].totalTime += session.duration
        acc[session.subject].avgCompletion += session.completionRate || 0
        acc[session.subject].topics.add(session.topicName)
      }
      return acc
    }, {})

    Object.keys(subjectPerformance).forEach(subject => {
      const data = subjectPerformance[subject]
      data.avgCompletion = data.avgCompletion / data.sessions
      data.topicsCount = data.topics.size
      data.avgSessionTime = data.totalTime / data.sessions
    })

    return {
      gfgInteractions,
      difficultyProgression,
      topicMastery,
      learningVelocity,
      consistencyScore,
      focusEfficiency,
      subjectPerformance,
      totalSessions: sessions.length,
      avgSessionTime,
      avgCompletionRate
    }
  }, [studySessions, performance])

  // Performance insights and recommendations
  const insights = useMemo(() => {
    const insights = []

    // GFG engagement insight
    if (advancedMetrics.gfgInteractions.totalGFGInteractions < 10) {
      insights.push({
        type: 'warning',
        title: 'Low GFG Engagement',
        message: 'Consider practicing more problems on GeeksforGeeks to improve your coding skills.',
        action: 'Practice more GFG problems'
      })
    }

    // Consistency insight
    if (advancedMetrics.consistencyScore < 60) {
      insights.push({
        type: 'warning',
        title: 'Inconsistent Study Pattern',
        message: 'Try to study more regularly to improve retention and build momentum.',
        action: 'Set daily study goals'
      })
    }

    // Focus efficiency insight
    if (advancedMetrics.focusEfficiency < 50) {
      insights.push({
        type: 'info',
        title: 'Focus Improvement Opportunity',
        message: 'Your completion rate could be improved. Try shorter, focused study sessions.',
        action: 'Use Pomodoro technique'
      })
    }

    // Learning velocity insight
    if (advancedMetrics.learningVelocity > 2) {
      insights.push({
        type: 'success',
        title: 'Excellent Learning Pace',
        message: 'You\'re completing topics at a great pace! Keep up the momentum.',
        action: 'Continue current approach'
      })
    }

    // Difficulty progression insight
    const easyCount = advancedMetrics.difficultyProgression.Easy || 0
    const hardCount = advancedMetrics.difficultyProgression.Hard || 0
    if (easyCount > hardCount * 3) {
      insights.push({
        type: 'info',
        title: 'Challenge Yourself More',
        message: 'You\'re doing well with easy topics. Try more medium and hard topics.',
        action: 'Attempt harder problems'
      })
    }

    return insights
  }, [advancedMetrics])

  // Performance comparison data (mock data for demonstration)
  const comparisonData = {
    userPercentile: 75,
    averageRating: 1350,
    topPerformers: [
      { name: 'Top 10%', rating: 1800, topics: 45 },
      { name: 'Top 25%', rating: 1600, topics: 35 },
      { name: 'Average', rating: 1350, topics: 25 },
      { name: 'You', rating: performance.overallRating, topics: performance.totalTopicsCompleted }
    ]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Performance Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Deep insights into your learning patterns and progress</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {['comprehensive', 'gfg', 'difficulty', 'comparative'].map((type) => (
            <button
              key={type}
              onClick={() => setAnalysisType(type)}
              className={cn(
                "px-3 py-1 rounded-lg text-sm font-medium transition-colors",
                analysisType === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Learning Velocity',
            value: `${advancedMetrics.learningVelocity.toFixed(1)} topics/week`,
            icon: Zap,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
            trend: advancedMetrics.learningVelocity > 1 ? 'up' : 'down'
          },
          {
            title: 'Focus Efficiency',
            value: `${Math.round(advancedMetrics.focusEfficiency)}%`,
            icon: Target,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 dark:bg-blue-900/20',
            trend: advancedMetrics.focusEfficiency > 50 ? 'up' : 'down'
          },
          {
            title: 'GFG Engagement',
            value: advancedMetrics.gfgInteractions.totalGFGInteractions,
            icon: Code,
            color: 'text-green-600',
            bgColor: 'bg-green-100 dark:bg-green-900/20',
            trend: advancedMetrics.gfgInteractions.totalGFGInteractions > 20 ? 'up' : 'down'
          },
          {
            title: 'Consistency Score',
            value: `${Math.round(advancedMetrics.consistencyScore)}%`,
            icon: Activity,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100 dark:bg-purple-900/20',
            trend: advancedMetrics.consistencyScore > 70 ? 'up' : 'down'
          }
        ].map((metric, index) => {
          const Icon = metric.icon
          const TrendIcon = metric.trend === 'up' ? ArrowUp : metric.trend === 'down' ? ArrowDown : Minus
          
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg", metric.bgColor)}>
                  <Icon className={cn("w-5 h-5", metric.color)} />
                </div>
                <TrendIcon className={cn(
                  "w-4 h-4",
                  metric.trend === 'up' ? "text-green-500" : 
                  metric.trend === 'down' ? "text-red-500" : "text-gray-400"
                )} />
              </div>
              
              <div className={cn("text-2xl font-bold mb-1", metric.color)}>
                {metric.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {metric.title}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Analysis Sections */}
      {analysisType === 'comprehensive' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Topic Mastery Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Topic Mastery Breakdown</h3>
            <div className="space-y-3">
              {advancedMetrics.topicMastery.slice(0, 8).map((item, index) => (
                <div key={item.topic} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium truncate">{item.topic}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all duration-300",
                          item.score >= 90 ? "bg-green-500" :
                          item.score >= 70 ? "bg-yellow-500" :
                          item.score >= 50 ? "bg-orange-500" : "bg-red-500"
                        )}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-10 text-right">
                      {Math.round(item.score)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject Performance</h3>
            <div className="space-y-4">
              {Object.entries(advancedMetrics.subjectPerformance).map(([subject, data]) => (
                <div key={subject} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{subject}</h4>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {data.sessions} sessions
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Topics</div>
                      <div className="font-medium text-gray-900 dark:text-white">{data.topicsCount}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Avg Time</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {Math.round(data.avgSessionTime / 60)}m
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Completion</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {Math.round(data.avgCompletion)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Performance Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Insights</h3>
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insight.type === 'success' ? CheckCircle :
                        insight.type === 'warning' ? AlertCircle : Info
            
            return (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-lg",
                  insight.type === 'success' && "bg-green-50 dark:bg-green-900/20",
                  insight.type === 'warning' && "bg-yellow-50 dark:bg-yellow-900/20",
                  insight.type === 'info' && "bg-blue-50 dark:bg-blue-900/20"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 mt-0.5",
                  insight.type === 'success' && "text-green-600 dark:text-green-400",
                  insight.type === 'warning' && "text-yellow-600 dark:text-yellow-400",
                  insight.type === 'info' && "text-blue-600 dark:text-blue-400"
                )} />
                <div className="flex-1">
                  <h4 className={cn(
                    "font-medium mb-1",
                    insight.type === 'success' && "text-green-900 dark:text-green-100",
                    insight.type === 'warning' && "text-yellow-900 dark:text-yellow-100",
                    insight.type === 'info' && "text-blue-900 dark:text-blue-100"
                  )}>
                    {insight.title}
                  </h4>
                  <p className={cn(
                    "text-sm mb-2",
                    insight.type === 'success' && "text-green-800 dark:text-green-200",
                    insight.type === 'warning' && "text-yellow-800 dark:text-yellow-200",
                    insight.type === 'info' && "text-blue-800 dark:text-blue-200"
                  )}>
                    {insight.message}
                  </p>
                  <button className={cn(
                    "text-sm font-medium underline",
                    insight.type === 'success' && "text-green-700 dark:text-green-300",
                    insight.type === 'warning' && "text-yellow-700 dark:text-yellow-300",
                    insight.type === 'info' && "text-blue-700 dark:text-blue-300"
                  )}>
                    {insight.action}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AdvancedPerformanceAnalytics
