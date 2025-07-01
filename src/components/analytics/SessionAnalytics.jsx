import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Clock,
  Activity,
  Target,
  Brain,
  Zap,
  Eye,
  MousePointer,
  FileText,
  ExternalLink,
  Play,
  Pause,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Calendar,
  Users,
  Award
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useUserProfileStore } from '../../store/userProfileStore'

const SessionAnalytics = ({ timeRange = 'week' }) => {
  const [selectedMetric, setSelectedMetric] = useState('overview')
  
  const {
    sessionMetrics,
    currentSession,
    getSessionAnalytics,
    studySessions
  } = useUserProfileStore()

  // Get analytics for selected time range
  const analytics = useMemo(() => {
    return getSessionAnalytics(timeRange)
  }, [timeRange, getSessionAnalytics])

  // Calculate interaction patterns
  const interactionPatterns = useMemo(() => {
    const recentSessions = studySessions.slice(0, 20)
    const patterns = {
      sectionNavigation: 0,
      notesTaking: 0,
      codeInteractions: 0,
      externalLinks: 0,
      pauseResume: 0
    }

    recentSessions.forEach(session => {
      if (session.interactions) {
        session.interactions.forEach(interaction => {
          switch (interaction.type) {
            case 'section_navigate':
              patterns.sectionNavigation++
              break
            case 'notes_save':
              patterns.notesTaking++
              break
            case 'code_copy':
              patterns.codeInteractions++
              break
            case 'gfg_link_click':
              patterns.externalLinks++
              break
            case 'session_pause':
              patterns.pauseResume++
              break
          }
        })
      }
    })

    return patterns
  }, [studySessions])

  // Session quality metrics
  const qualityMetrics = [
    {
      title: 'Focus Score',
      value: `${Math.round(sessionMetrics.focusScore)}%`,
      icon: Target,
      color: sessionMetrics.focusScore >= 80 ? 'text-green-600' : 
             sessionMetrics.focusScore >= 60 ? 'text-yellow-600' : 'text-red-600',
      description: 'Based on interaction patterns and time spent'
    },
    {
      title: 'Completion Rate',
      value: `${Math.round(sessionMetrics.sessionCompletionRate)}%`,
      icon: CheckCircle,
      color: sessionMetrics.sessionCompletionRate >= 80 ? 'text-green-600' : 
             sessionMetrics.sessionCompletionRate >= 60 ? 'text-yellow-600' : 'text-red-600',
      description: 'Average section completion per session'
    },
    {
      title: 'Engagement Level',
      value: `${Math.round(sessionMetrics.averageInteractionsPerSession)}`,
      icon: Activity,
      color: 'text-blue-600',
      description: 'Average interactions per session'
    },
    {
      title: 'Note-taking Habit',
      value: `${Math.round(sessionMetrics.averageNotesPerSession)}`,
      icon: FileText,
      color: 'text-purple-600',
      description: 'Average notes length per session'
    }
  ]

  // Time-based analytics
  const timeAnalytics = [
    {
      title: 'Total Sessions',
      value: analytics.totalSessions,
      subtitle: `${timeRange} period`,
      icon: Play,
      color: 'text-blue-600'
    },
    {
      title: 'Total Study Time',
      value: `${Math.round(analytics.totalTime / 3600)}h ${Math.round((analytics.totalTime % 3600) / 60)}m`,
      subtitle: 'Focused learning',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      title: 'Average Session',
      value: `${Math.round(analytics.averageSessionTime / 60)}min`,
      subtitle: 'Per session',
      icon: BarChart3,
      color: 'text-orange-600'
    },
    {
      title: 'Focus Score',
      value: `${Math.round(analytics.averageFocusScore)}%`,
      subtitle: 'Concentration level',
      icon: Brain,
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Session Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Detailed study session insights and patterns</p>
        </div>
        
        {currentSession && (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Active Session</span>
          </div>
        )}
      </div>

      {/* Current Session Info */}
      {currentSession && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Session</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Topic</div>
              <div className="font-medium text-gray-900 dark:text-white">{currentSession.topicName}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
              <div className="font-medium text-gray-900 dark:text-white">
                {Math.floor((Date.now() - new Date(currentSession.startTime)) / 60000)}min
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Interactions</div>
              <div className="font-medium text-gray-900 dark:text-white">{currentSession.interactions.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completion</div>
              <div className="font-medium text-gray-900 dark:text-white">{currentSession.completionRate}%</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Time-based Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {timeAnalytics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg", metric.color.replace('text-', 'bg-').replace('-600', '-100') + ' dark:bg-opacity-20')}>
                  <Icon className={cn("w-5 h-5", metric.color)} />
                </div>
              </div>
              
              <div>
                <div className={cn("text-2xl font-bold", metric.color)}>
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {metric.subtitle}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {metric.title}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Quality Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Session Quality Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {qualityMetrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <div key={metric.title} className="text-center">
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3", 
                  metric.color.replace('text-', 'bg-').replace('-600', '-100') + ' dark:bg-opacity-20'
                )}>
                  <Icon className={cn("w-6 h-6", metric.color)} />
                </div>
                <div className={cn("text-2xl font-bold", metric.color)}>
                  {metric.value}
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                  {metric.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {metric.description}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Interaction Patterns */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Interaction Patterns</h3>
        <div className="space-y-4">
          {[
            { label: 'Section Navigation', value: interactionPatterns.sectionNavigation, icon: Eye, color: 'blue' },
            { label: 'Notes Taking', value: interactionPatterns.notesTaking, icon: FileText, color: 'green' },
            { label: 'Code Interactions', value: interactionPatterns.codeInteractions, icon: MousePointer, color: 'purple' },
            { label: 'External Links', value: interactionPatterns.externalLinks, icon: ExternalLink, color: 'orange' },
            { label: 'Pause/Resume', value: interactionPatterns.pauseResume, icon: Pause, color: 'red' }
          ].map((pattern) => {
            const Icon = pattern.icon
            const maxValue = Math.max(...Object.values(interactionPatterns))
            const percentage = maxValue > 0 ? (pattern.value / maxValue) * 100 : 0
            
            return (
              <div key={pattern.label} className="flex items-center gap-4">
                <div className={cn("p-2 rounded-lg", `bg-${pattern.color}-100 dark:bg-${pattern.color}-900/20`)}>
                  <Icon className={cn("w-4 h-4", `text-${pattern.color}-600 dark:text-${pattern.color}-400`)} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{pattern.label}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{pattern.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={cn("h-2 rounded-full transition-all duration-300", `bg-${pattern.color}-500`)}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Study Pattern Heatmap */}
      {analytics.studyPattern && analytics.studyPattern.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Daily Study Pattern</h3>
          <div className="grid grid-cols-12 gap-1">
            {analytics.studyPattern.map((time, hour) => {
              const intensity = time > 0 ? Math.min(100, (time / Math.max(...analytics.studyPattern)) * 100) : 0
              return (
                <div
                  key={hour}
                  className={cn(
                    "aspect-square rounded flex items-center justify-center text-xs font-medium transition-all duration-200 hover:scale-110",
                    intensity > 75 ? "bg-green-500 text-white" :
                    intensity > 50 ? "bg-green-400 text-white" :
                    intensity > 25 ? "bg-green-300 text-gray-800" :
                    intensity > 0 ? "bg-green-200 text-gray-700" :
                    "bg-gray-100 dark:bg-gray-700 text-gray-400"
                  )}
                  title={`${hour}:00 - ${Math.round(time / 60)}min`}
                >
                  {hour}
                </div>
              )
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>12 AM</span>
            <span>6 AM</span>
            <span>12 PM</span>
            <span>6 PM</span>
            <span>11 PM</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default SessionAnalytics
