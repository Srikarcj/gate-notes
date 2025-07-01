import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, 
  Star, 
  Flame, 
  Target, 
  Clock, 
  BookOpen, 
  Code, 
  Zap,
  Award,
  Crown,
  Medal,
  Sparkles,
  TrendingUp,
  CheckCircle
} from 'lucide-react'
import { useAdvancedStudyStore } from '../../store/advancedStudyStore'

const AchievementSystem = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('achievements')
  const [showNewAchievement, setShowNewAchievement] = useState(null)
  
  const {
    getStudyStats,
    currentStreak,
    longestStreak,
    completedTopics,
    solvedProblems,
    learningStats
  } = useAdvancedStudyStore()

  const stats = getStudyStats()

  // Define achievements
  const achievements = [
    {
      id: 'first_topic',
      title: 'Getting Started',
      description: 'Complete your first topic',
      icon: BookOpen,
      color: 'green',
      requirement: 1,
      current: stats.completedTopics,
      type: 'topics',
      unlocked: stats.completedTopics >= 1
    },
    {
      id: 'topic_master',
      title: 'Topic Master',
      description: 'Complete 10 topics',
      icon: Crown,
      color: 'purple',
      requirement: 10,
      current: stats.completedTopics,
      type: 'topics',
      unlocked: stats.completedTopics >= 10
    },
    {
      id: 'streak_starter',
      title: 'Streak Starter',
      description: 'Maintain a 3-day study streak',
      icon: Flame,
      color: 'orange',
      requirement: 3,
      current: currentStreak,
      type: 'streak',
      unlocked: currentStreak >= 3
    },
    {
      id: 'streak_master',
      title: 'Streak Master',
      description: 'Maintain a 30-day study streak',
      icon: Flame,
      color: 'red',
      requirement: 30,
      current: longestStreak,
      type: 'streak',
      unlocked: longestStreak >= 30
    },
    {
      id: 'problem_solver',
      title: 'Problem Solver',
      description: 'Solve 25 practice problems',
      icon: Code,
      color: 'blue',
      requirement: 25,
      current: stats.problemsSolved,
      type: 'problems',
      unlocked: stats.problemsSolved >= 25
    },
    {
      id: 'speed_learner',
      title: 'Speed Learner',
      description: 'Study for 10 hours total',
      icon: Zap,
      color: 'yellow',
      requirement: 36000000, // 10 hours in milliseconds
      current: stats.totalStudyTime,
      type: 'time',
      unlocked: stats.totalStudyTime >= 36000000
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Score 100% on 5 quizzes',
      icon: Star,
      color: 'gold',
      requirement: 5,
      current: 2, // Mock data
      type: 'perfect_scores',
      unlocked: false
    },
    {
      id: 'dedicated_learner',
      title: 'Dedicated Learner',
      description: 'Study for 7 consecutive days',
      icon: Target,
      color: 'indigo',
      requirement: 7,
      current: currentStreak,
      type: 'streak',
      unlocked: currentStreak >= 7
    }
  ]

  // Define badges based on performance
  const badges = [
    {
      id: 'arrays_expert',
      title: 'Arrays Expert',
      description: 'Master all array-related topics',
      icon: Trophy,
      color: 'blue',
      earned: true
    },
    {
      id: 'algorithm_guru',
      title: 'Algorithm Guru',
      description: 'Complete advanced algorithm topics',
      icon: Crown,
      color: 'purple',
      earned: false
    },
    {
      id: 'quiz_champion',
      title: 'Quiz Champion',
      description: 'Score above 90% on 10 quizzes',
      icon: Medal,
      color: 'gold',
      earned: true
    },
    {
      id: 'consistency_king',
      title: 'Consistency King',
      description: 'Study every day for a month',
      icon: Flame,
      color: 'orange',
      earned: false
    }
  ]

  const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60))
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const getProgressPercentage = (current, requirement) => {
    return Math.min((current / requirement) * 100, 100)
  }

  const AchievementCard = ({ achievement }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-6 rounded-xl border-2 transition-all ${
        achievement.unlocked
          ? `border-${achievement.color}-200 bg-${achievement.color}-50 dark:bg-${achievement.color}-900/20`
          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          achievement.unlocked
            ? `bg-${achievement.color}-500 text-white`
            : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
        }`}>
          <achievement.icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`font-semibold ${
              achievement.unlocked
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {achievement.title}
            </h3>
            {achievement.unlocked && (
              <CheckCircle className={`w-4 h-4 text-${achievement.color}-500`} />
            )}
          </div>
          
          <p className={`text-sm mb-3 ${
            achievement.unlocked
              ? 'text-gray-700 dark:text-gray-300'
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {achievement.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className={`font-medium ${
                achievement.unlocked
                  ? `text-${achievement.color}-600 dark:text-${achievement.color}-400`
                  : 'text-gray-500'
              }`}>
                {achievement.type === 'time' 
                  ? `${formatTime(achievement.current)} / ${formatTime(achievement.requirement)}`
                  : `${achievement.current} / ${achievement.requirement}`
                }
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  achievement.unlocked
                    ? `bg-${achievement.color}-500`
                    : 'bg-gray-400'
                }`}
                style={{ width: `${getProgressPercentage(achievement.current, achievement.requirement)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const BadgeCard = ({ badge }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-4 rounded-xl text-center transition-all ${
        badge.earned
          ? `bg-gradient-to-br from-${badge.color}-400 to-${badge.color}-600 text-white shadow-lg`
          : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
      }`}
    >
      <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
        badge.earned
          ? 'bg-white/20'
          : 'bg-gray-200 dark:bg-gray-700'
      }`}>
        <badge.icon className="w-8 h-8" />
      </div>
      
      <h3 className="font-semibold mb-1">{badge.title}</h3>
      <p className="text-xs opacity-80">{badge.description}</p>
      
      {badge.earned && (
        <div className="mt-2">
          <Sparkles className="w-4 h-4 mx-auto" />
        </div>
      )}
    </motion.div>
  )

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Achievements & Badges
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Track your learning milestones
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'achievements', label: 'Achievements', icon: Award },
            { id: 'badges', label: 'Badges', icon: Medal },
            { id: 'stats', label: 'Statistics', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'achievements' && (
            <div className="grid gap-4">
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.completedTopics}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Topics Completed</div>
              </div>

              <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.problemsSolved}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Problems Solved</div>
              </div>

              <div className="text-center p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {currentStreak}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Current Streak</div>
              </div>

              <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {formatTime(stats.totalStudyTime)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Study Time</div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default AchievementSystem
