import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Clock,
  Zap,
  Brain,
  Star,
  Trophy,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Calendar,
  Users,
  Medal,
  Flame,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useUserProfileStore } from '../../store/userProfileStore'

const PerformanceDashboard = ({ selectedBranch, selectedSubject }) => {
  const [timeRange, setTimeRange] = useState('month') // week, month, all
  const [selectedMetric, setSelectedMetric] = useState('rating') // rating, mastery, consistency, speed

  const {
    performance,
    studySessions,
    topicProgress,
    calculateGATEReadiness,
    calculateConsistencyScore,
    analytics
  } = useUserProfileStore()

  // Calculate real-time metrics
  const metrics = useMemo(() => {
    const gateReadiness = calculateGATEReadiness()
    const consistency = calculateConsistencyScore()
    
    return {
      overallRating: performance.overallRating,
      peakRating: performance.peakRating,
      gateReadiness,
      consistency,
      topicsCompleted: performance.totalTopicsCompleted,
      studyTime: performance.totalStudyTime,
      currentStreak: performance.currentStreak,
      masteryScores: performance.topicMasteryScores,
      subjectRatings: performance.subjectRatings,
      ratingHistory: performance.ratingHistory
    }
  }, [performance, calculateGATEReadiness, calculateConsistencyScore])

  // Rating color based on CodeChef system
  const getRatingColor = (rating) => {
    if (rating >= 2400) return 'text-red-600 dark:text-red-400' // Grandmaster
    if (rating >= 2200) return 'text-orange-600 dark:text-orange-400' // Master
    if (rating >= 1800) return 'text-purple-600 dark:text-purple-400' // Expert
    if (rating >= 1600) return 'text-blue-600 dark:text-blue-400' // Specialist
    if (rating >= 1400) return 'text-green-600 dark:text-green-400' // Apprentice
    if (rating >= 1200) return 'text-cyan-600 dark:text-cyan-400' // Pupil
    return 'text-gray-600 dark:text-gray-400' // Newbie
  }

  const getRatingTitle = (rating) => {
    if (rating >= 2400) return 'Grandmaster'
    if (rating >= 2200) return 'Master'
    if (rating >= 1800) return 'Expert'
    if (rating >= 1600) return 'Specialist'
    if (rating >= 1400) return 'Apprentice'
    if (rating >= 1200) return 'Pupil'
    return 'Newbie'
  }

  const getRatingProgress = (rating) => {
    const thresholds = [1200, 1400, 1600, 1800, 2200, 2400]
    const currentThreshold = thresholds.find(t => rating < t) || 2400
    const previousThreshold = thresholds[thresholds.indexOf(currentThreshold) - 1] || 800
    
    return {
      current: rating,
      next: currentThreshold,
      previous: previousThreshold,
      progress: ((rating - previousThreshold) / (currentThreshold - previousThreshold)) * 100
    }
  }

  const ratingProgress = getRatingProgress(metrics.overallRating)

  // Performance cards data
  const performanceCards = [
    {
      title: 'Overall Rating',
      value: metrics.overallRating,
      subtitle: getRatingTitle(metrics.overallRating),
      icon: Trophy,
      color: getRatingColor(metrics.overallRating),
      change: metrics.ratingHistory.length > 0 ? metrics.ratingHistory[metrics.ratingHistory.length - 1].change : 0,
      progress: ratingProgress.progress
    },
    {
      title: 'GATE Readiness',
      value: `${metrics.gateReadiness}%`,
      subtitle: 'Overall preparation',
      icon: Target,
      color: metrics.gateReadiness >= 80 ? 'text-green-600 dark:text-green-400' : 
             metrics.gateReadiness >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 
             'text-red-600 dark:text-red-400',
      change: 0, // Calculate based on previous week
      progress: metrics.gateReadiness
    },
    {
      title: 'Consistency Score',
      value: `${metrics.consistency}%`,
      subtitle: 'Study regularity',
      icon: Activity,
      color: metrics.consistency >= 80 ? 'text-green-600 dark:text-green-400' : 
             metrics.consistency >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 
             'text-red-600 dark:text-red-400',
      change: 0,
      progress: metrics.consistency
    },
    {
      title: 'Topics Mastered',
      value: Object.keys(metrics.masteryScores).length,
      subtitle: `${metrics.topicsCompleted} completed`,
      icon: Brain,
      color: 'text-blue-600 dark:text-blue-400',
      change: 0,
      progress: Math.min(100, (Object.keys(metrics.masteryScores).length / 50) * 100)
    },
    {
      title: 'Study Streak',
      value: `${metrics.currentStreak} days`,
      subtitle: 'Current streak',
      icon: Flame,
      color: metrics.currentStreak >= 7 ? 'text-orange-600 dark:text-orange-400' : 
             metrics.currentStreak >= 3 ? 'text-yellow-600 dark:text-yellow-400' : 
             'text-gray-600 dark:text-gray-400',
      change: 0,
      progress: Math.min(100, (metrics.currentStreak / 30) * 100)
    },
    {
      title: 'Study Time',
      value: `${Math.round(metrics.studyTime / 3600)}h`,
      subtitle: 'Total hours',
      icon: Clock,
      color: 'text-purple-600 dark:text-purple-400',
      change: 0,
      progress: Math.min(100, (metrics.studyTime / 180000) * 100) // 50 hours = 100%
    }
  ]

  return (
    <div className="space-y-6">
      {/* Mobile-Responsive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Performance Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">CodeChef-style analytics and progress tracking</p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {['week', 'month', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-3 py-1 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                timeRange === range
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Progress Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rating Progress</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {ratingProgress.current} / {ratingProgress.next} to next level
            </p>
          </div>
          <div className={cn("text-2xl font-bold", getRatingColor(metrics.overallRating))}>
            {getRatingTitle(metrics.overallRating)}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${ratingProgress.progress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{ratingProgress.previous}</span>
          <span>{ratingProgress.next}</span>
        </div>
      </div>

      {/* Mobile-Responsive Performance Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {performanceCards.map((card, index) => {
          const Icon = card.icon
          const changeIcon = card.change > 0 ? ArrowUp : card.change < 0 ? ArrowDown : Minus
          
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg", card.color.replace('text-', 'bg-').replace('dark:text-', 'dark:bg-').replace('-600', '-100').replace('-400', '-900/20'))}>
                  <Icon className={cn("w-5 h-5", card.color)} />
                </div>
                {card.change !== 0 && (
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    card.change > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  )}>
                    <changeIcon className="w-3 h-3" />
                    {Math.abs(card.change)}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div>
                  <div className={cn("text-2xl font-bold", card.color)}>
                    {card.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {card.subtitle}
                  </div>
                </div>
                
                {card.progress !== undefined && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className={cn("h-1.5 rounded-full transition-all duration-500", 
                        card.color.replace('text-', 'bg-')
                      )}
                      style={{ width: `${card.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Rating History Chart */}
      {metrics.ratingHistory.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rating Progression</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {metrics.ratingHistory.slice(-20).map((entry, index) => {
              const height = ((entry.rating - 800) / (2400 - 800)) * 100
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className={cn(
                      "w-full rounded-t transition-all duration-300 hover:opacity-80",
                      entry.change > 0 ? "bg-green-500" : entry.change < 0 ? "bg-red-500" : "bg-gray-400"
                    )}
                    style={{ height: `${height}%` }}
                    title={`${entry.rating} (${entry.change > 0 ? '+' : ''}${entry.change})`}
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 transform -rotate-45 origin-left">
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>800</span>
            <span>Rating History (Last 20 sessions)</span>
            <span>2400</span>
          </div>
        </div>
      )}

      {/* Topic Mastery Heatmap */}
      {Object.keys(metrics.masteryScores).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Topic Mastery Heatmap</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(metrics.masteryScores).map(([topic, score]) => (
              <div
                key={topic}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105",
                  score >= 90 ? "bg-green-100 border-green-300 dark:bg-green-900/20 dark:border-green-700" :
                  score >= 70 ? "bg-yellow-100 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700" :
                  score >= 50 ? "bg-orange-100 border-orange-300 dark:bg-orange-900/20 dark:border-orange-700" :
                  "bg-red-100 border-red-300 dark:bg-red-900/20 dark:border-red-700"
                )}
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate" title={topic}>
                  {topic}
                </div>
                <div className={cn(
                  "text-lg font-bold",
                  score >= 90 ? "text-green-700 dark:text-green-400" :
                  score >= 70 ? "text-yellow-700 dark:text-yellow-400" :
                  score >= 50 ? "text-orange-700 dark:text-orange-400" :
                  "text-red-700 dark:text-red-400"
                )}>
                  {Math.round(score)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Study Time Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Study Pattern */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Study Pattern</h3>
          <div className="space-y-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              // Mock data - in real implementation, calculate from studySessions
              const studyTime = Math.random() * 4 // 0-4 hours
              const percentage = (studyTime / 4) * 100

              return (
                <div key={day} className="flex items-center gap-3">
                  <div className="w-8 text-sm text-gray-600 dark:text-gray-400">{day}</div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-12 text-sm text-gray-900 dark:text-white text-right">
                    {studyTime.toFixed(1)}h
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Performance Metrics Radar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Radar</h3>
          <div className="relative w-48 h-48 mx-auto">
            {/* Radar chart background */}
            <svg className="w-full h-full" viewBox="0 0 200 200">
              {/* Grid circles */}
              {[20, 40, 60, 80].map((radius) => (
                <circle
                  key={radius}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-gray-300 dark:text-gray-600"
                />
              ))}

              {/* Grid lines */}
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <line
                  key={angle}
                  x1="100"
                  y1="100"
                  x2={100 + 80 * Math.cos((angle - 90) * Math.PI / 180)}
                  y2={100 + 80 * Math.sin((angle - 90) * Math.PI / 180)}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-gray-300 dark:text-gray-600"
                />
              ))}

              {/* Performance polygon */}
              <polygon
                points={[
                  `${100 + (metrics.gateReadiness * 0.8) * Math.cos(-90 * Math.PI / 180)},${100 + (metrics.gateReadiness * 0.8) * Math.sin(-90 * Math.PI / 180)}`,
                  `${100 + (metrics.consistency * 0.8) * Math.cos(30 * Math.PI / 180)},${100 + (metrics.consistency * 0.8) * Math.sin(30 * Math.PI / 180)}`,
                  `${100 + (80 * 0.8) * Math.cos(150 * Math.PI / 180)},${100 + (80 * 0.8) * Math.sin(150 * Math.PI / 180)}`,
                  `${100 + (70 * 0.8) * Math.cos(270 * Math.PI / 180)},${100 + (70 * 0.8) * Math.sin(270 * Math.PI / 180)}`,
                  `${100 + (60 * 0.8) * Math.cos(330 * Math.PI / 180)},${100 + (60 * 0.8) * Math.sin(330 * Math.PI / 180)}`,
                  `${100 + (90 * 0.8) * Math.cos(210 * Math.PI / 180)},${100 + (90 * 0.8) * Math.sin(210 * Math.PI / 180)}`
                ].join(' ')}
                fill="rgba(59, 130, 246, 0.2)"
                stroke="rgb(59, 130, 246)"
                strokeWidth="2"
              />
            </svg>

            {/* Labels */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs text-gray-600 dark:text-gray-400 absolute -top-4">GATE</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 absolute -right-8 top-8">Speed</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 absolute -right-8 bottom-8">Accuracy</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 absolute -bottom-4">Consistency</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 absolute -left-8 bottom-8">Topics</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 absolute -left-8 top-8">Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-wise Performance */}
      {Object.keys(metrics.subjectRatings).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject-wise Ratings</h3>
          <div className="space-y-3">
            {Object.entries(metrics.subjectRatings).map(([subject, rating]) => (
              <div key={subject} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{subject}</div>
                  <div className={cn("text-sm font-medium", getRatingColor(rating))}>
                    {getRatingTitle(rating)}
                  </div>
                </div>
                <div className={cn("text-xl font-bold", getRatingColor(rating))}>
                  {rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements and Milestones */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'First Topic Completed', icon: CheckCircle, color: 'text-green-500', achieved: metrics.topicsCompleted > 0 },
            { title: 'Week Streak', icon: Flame, color: 'text-orange-500', achieved: metrics.currentStreak >= 7 },
            { title: 'Rating Milestone', icon: Star, color: 'text-yellow-500', achieved: metrics.overallRating >= 1400 },
            { title: 'Study Marathon', icon: Clock, color: 'text-blue-500', achieved: metrics.studyTime >= 36000 },
            { title: 'Subject Master', icon: Trophy, color: 'text-purple-500', achieved: Object.keys(metrics.subjectRatings).length >= 3 },
            { title: 'GATE Ready', icon: Target, color: 'text-red-500', achieved: metrics.gateReadiness >= 80 }
          ].map((achievement, index) => {
            const Icon = achievement.icon
            return (
              <div
                key={achievement.title}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
                  achievement.achieved
                    ? "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-50"
                )}
              >
                <Icon className={cn("w-6 h-6", achievement.achieved ? achievement.color : "text-gray-400")} />
                <div>
                  <div className={cn(
                    "font-medium",
                    achievement.achieved ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                  )}>
                    {achievement.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {achievement.achieved ? 'Achieved' : 'Locked'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PerformanceDashboard
