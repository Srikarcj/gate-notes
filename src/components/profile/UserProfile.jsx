import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Settings, 
  Trophy, 
  BarChart3, 
  BookOpen, 
  Clock, 
  Target, 
  Flame,
  Star,
  Code,
  Award,
  Calendar,
  TrendingUp,
  Edit3,
  Save,
  X,
  Camera,
  Mail,
  GraduationCap,
  MapPin,
  Phone
} from 'lucide-react'
import { useUserProfileStore } from '../../store/userProfileStore'

const UserProfile = ({ isOpen, onClose }) => {
  const {
    profile = {},
    performance = {},
    topicProgress = {},
    studySessions = [],
    quizHistory = [],
    achievements = [],
    bookmarkedTopics = [],
    preferences = {},
    solvedProblems = [],
    problemHistory = {},
    updateProfile,
    updatePreferences,
    getStudyStats,
    getTotalStudyTime,
    getStudyStreak,
    getWeeklyProgress
  } = useUserProfileStore()

  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    college: profile?.college || '',
    location: profile?.location || '',
    branch: profile?.branch || '',
    year: profile?.year || '',
    phone: profile?.phone || ''
  })

  const stats = getStudyStats ? getStudyStats() : {
    completedTopics: 0,
    totalTopics: 0,
    studyStreak: 0,
    totalStudyTime: 0,
    averageProgress: 0
  }

  // Enhanced real-time statistics with safe defaults
  const realtimeStats = {
    ...stats,
    totalStudyTime: getTotalStudyTime ? getTotalStudyTime() : 0,
    studyStreak: getStudyStreak ? getStudyStreak() : 0,
    weeklyProgress: getWeeklyProgress ? getWeeklyProgress() : [],
    solvedProblems: (solvedProblems || []).length,
    totalProblems: Object.keys(problemHistory || {}).length,
    problemAccuracy: Object.keys(problemHistory || {}).length > 0
      ? Math.round(((solvedProblems || []).length / Object.keys(problemHistory || {}).length) * 100)
      : 0,
    averageQuizScore: (quizHistory || []).length > 0
      ? Math.round((quizHistory || []).reduce((sum, quiz) => sum + (quiz.score || 0), 0) / (quizHistory || []).length)
      : 0,
    rank: calculateRank(),
    globalRanking: Math.floor(Math.random() * 10000) + 1000, // Mock global ranking
    contestsParticipated: Math.floor(Math.random() * 50) + 10,
    maxRating: Math.floor(Math.random() * 500) + 1200,
    completedTopics: (stats?.completedTopics || 0)
  }

  // Calculate user rank based on performance with safe defaults
  function calculateRank() {
    const completedTopics = stats?.completedTopics || 0
    const studyStreak = getStudyStreak ? getStudyStreak() : 0
    const totalStudyTime = getTotalStudyTime ? getTotalStudyTime() : 0
    const solvedProblemsCount = (solvedProblems || []).length

    const score = (completedTopics * 100) +
                  (studyStreak * 10) +
                  (totalStudyTime / 60) +
                  (solvedProblemsCount * 50)

    if (score > 2000) return { name: 'Grandmaster', color: 'text-red-600 bg-red-100', level: 7 }
    if (score > 1500) return { name: 'Master', color: 'text-purple-600 bg-purple-100', level: 6 }
    if (score > 1000) return { name: 'Expert', color: 'text-blue-600 bg-blue-100', level: 5 }
    if (score > 700) return { name: 'Specialist', color: 'text-cyan-600 bg-cyan-100', level: 4 }
    if (score > 400) return { name: 'Pupil', color: 'text-green-600 bg-green-100', level: 3 }
    if (score > 200) return { name: 'Newbie', color: 'text-gray-600 bg-gray-100', level: 2 }
    return { name: 'Unrated', color: 'text-gray-500 bg-gray-50', level: 1 }
  }

  // Handle profile editing
  const handleEditProfile = () => {
    setEditForm({
      name: profile?.name || '',
      email: profile?.email || '',
      college: profile?.college || '',
      location: profile?.location || '',
      branch: profile?.branch || '',
      year: profile?.year || '',
      phone: profile?.phone || ''
    })
    setIsEditing(true)
  }

  const handleSaveProfile = () => {
    if (updateProfile) {
      updateProfile(editForm)
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditForm({
      name: profile?.name || '',
      email: profile?.email || '',
      college: profile?.college || '',
      location: profile?.location || '',
      branch: profile?.branch || '',
      year: profile?.year || '',
      phone: profile?.phone || ''
    })
  }





  const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60))
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const getRecentActivity = () => {
    return studySessions.slice(0, 5).map(session => ({
      ...session,
      type: 'study'
    })).concat(
      quizHistory.slice(0, 3).map(quiz => ({
        ...quiz,
        type: 'quiz'
      }))
    ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 8)
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 bg-${color}-100 dark:bg-${color}-900/20 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto"
        onClick={onClose}
      >
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
        {/* Enhanced CodeChef-style Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center ring-4 ring-white ring-opacity-30 text-2xl font-bold">
                    {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-full text-xs font-bold ${realtimeStats.rank?.color || 'text-gray-600 bg-gray-100'} dark:bg-opacity-90`}>
                    ★{realtimeStats.rank?.level || 1}
                  </div>
                  <button className="absolute top-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="text-3xl font-bold bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-3 py-1 text-white placeholder-blue-200"
                        placeholder="Your Name"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-3 py-2 text-white placeholder-blue-200 text-sm"
                          placeholder="Email"
                        />
                        <input
                          type="text"
                          value={editForm.college}
                          onChange={(e) => setEditForm({...editForm, college: e.target.value})}
                          className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-3 py-2 text-white placeholder-blue-200 text-sm"
                          placeholder="College"
                        />
                        <input
                          type="text"
                          value={editForm.location}
                          onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                          className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-3 py-2 text-white placeholder-blue-200 text-sm"
                          placeholder="Location"
                        />
                        <select
                          value={editForm.branch}
                          onChange={(e) => setEditForm({...editForm, branch: e.target.value})}
                          className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-3 py-2 text-white text-sm"
                        >
                          <option value="">Select Branch</option>
                          <option value="Computer Science">Computer Science</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Mechanical">Mechanical</option>
                          <option value="Civil">Civil</option>
                          <option value="Electrical">Electrical</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-3xl font-bold mb-1">{profile?.name || 'GATE Aspirant'}</h2>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${realtimeStats.rank?.color || 'text-gray-600 bg-gray-100'} dark:bg-opacity-90`}>
                          {realtimeStats.rank?.name || 'Unrated'}
                        </span>
                        <span className="text-blue-200">Rating: {realtimeStats.maxRating || 1200}</span>
                        <span className="text-blue-200">Global Rank: #{realtimeStats.globalRanking || 5000}</span>
                      </div>
                      <div className="flex items-center gap-4 text-blue-200 text-sm">
                        <div className="flex items-center gap-1">
                          <GraduationCap className="w-4 h-4" />
                          <span>{profile?.college || 'Engineering College'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{profile?.location || 'India'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          <span>{profile?.email || 'student@example.com'}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-2 px-3 py-2 bg-green-500 bg-opacity-20 text-green-300 rounded-lg hover:bg-opacity-30 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 bg-red-500 bg-opacity-20 text-red-300 rounded-lg hover:bg-opacity-30 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditProfile}
                    className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Enhanced Real-time Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
              <div className="text-center p-3 bg-white bg-opacity-10 rounded-lg">
                <div className="text-2xl font-bold">{realtimeStats.completedTopics || 0}</div>
                <div className="text-blue-200 text-xs">Topics Done</div>
              </div>
              <div className="text-center p-3 bg-white bg-opacity-10 rounded-lg">
                <div className="text-2xl font-bold">{realtimeStats.solvedProblems || 0}</div>
                <div className="text-blue-200 text-xs">Problems Solved</div>
              </div>
              <div className="text-center p-3 bg-white bg-opacity-10 rounded-lg">
                <div className="text-2xl font-bold">{realtimeStats.studyStreak || 0}</div>
                <div className="text-blue-200 text-xs">Day Streak</div>
              </div>
              <div className="text-center p-3 bg-white bg-opacity-10 rounded-lg">
                <div className="text-2xl font-bold">{Math.round((realtimeStats.totalStudyTime || 0) / 3600 * 10) / 10}h</div>
                <div className="text-blue-200 text-xs">Study Time</div>
              </div>
              <div className="text-center p-3 bg-white bg-opacity-10 rounded-lg">
                <div className="text-2xl font-bold">{realtimeStats.averageQuizScore || 0}%</div>
                <div className="text-blue-200 text-xs">Quiz Avg</div>
              </div>
              <div className="text-center p-3 bg-white bg-opacity-10 rounded-lg">
                <div className="text-2xl font-bold">{achievements?.length || 0}</div>
                <div className="text-blue-200 text-xs">Achievements</div>
              </div>
            </div>

            {/* Progress Bar for Next Rank */}
            <div className="p-3 bg-white bg-opacity-10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress to {(realtimeStats.rank?.level || 1) < 7 ? 'Next Rank' : 'Grandmaster'}</span>
                <span className="text-sm">{Math.min(100, (((realtimeStats.rank?.level || 1) / 7) * 100))}%</span>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (((realtimeStats.rank?.level || 1) / 7) * 100))}%` }}
                  transition={{ duration: 1.5 }}
                  className="h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'performance', label: 'Performance', icon: BarChart3 },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'activity', label: 'Activity', icon: Clock },
            { id: 'settings', label: 'Settings', icon: Settings }
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Profile Information */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Personal Info */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {profile.email || 'Not provided'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <GraduationCap className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Branch</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {profile.branch || 'Not selected'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Graduation Year</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {profile.graduationYear || 'Not provided'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">College</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {profile.college || 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Study Goals */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Study Goals
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Daily Goal</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {performance.dailyGoal} hours
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Weekly Goal</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {performance.weeklyGoal} hours
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Monthly Goal</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {performance.monthlyGoal} hours
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                  <StatCard
                    icon={Clock}
                    title="Total Study Time"
                    value={formatTime(stats.totalStudyTime)}
                    color="blue"
                  />
                  <StatCard
                    icon={BookOpen}
                    title="Topics Completed"
                    value={stats.totalTopicsCompleted}
                    color="green"
                  />
                  <StatCard
                    icon={Code}
                    title="Problems Solved"
                    value={stats.totalProblemsSolved}
                    color="purple"
                  />
                  <StatCard
                    icon={Star}
                    title="Average Quiz Score"
                    value={`${stats.averageQuizScore}%`}
                    color="yellow"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              {/* Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={TrendingUp}
                  title="Completion Rate"
                  value={`${stats.completionRate}%`}
                  subtitle="Problems solved vs attempted"
                  color="green"
                />
                <StatCard
                  icon={Flame}
                  title="Current Streak"
                  value={`${stats.currentStreak} days`}
                  subtitle={`Best: ${stats.longestStreak} days`}
                  color="orange"
                />
                <StatCard
                  icon={Target}
                  title="Quiz Average"
                  value={`${stats.averageQuizScore}%`}
                  subtitle={`${performance.totalQuizzesTaken} quizzes taken`}
                  color="blue"
                />
                <StatCard
                  icon={Award}
                  title="Achievements"
                  value={achievements.length}
                  subtitle="Unlocked badges"
                  color="purple"
                />
              </div>

              {/* Subject Performance */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Subject Performance
                </h3>
                <div className="space-y-4">
                  {Object.entries(topicProgress).slice(0, 5).map(([topic, progress]) => (
                    <div key={topic} className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{topic}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">
                          {progress.progress || 0}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.length > 0 ? achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-3">
                      <Trophy className="w-8 h-8" />
                      <div>
                        <h3 className="font-bold">{achievement.title}</h3>
                        <p className="text-sm opacity-90">{achievement.description}</p>
                      </div>
                    </div>
                    <p className="text-xs opacity-75">
                      Unlocked on {new Date(achievement.unlockedDate).toLocaleDateString()}
                    </p>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-12">
                    <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No Achievements Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Start studying to unlock your first achievement!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {getRecentActivity().map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'study' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {activity.type === 'study' ? <BookOpen className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.type === 'study' 
                            ? `Studied ${activity.topic || 'a topic'}` 
                            : `Completed quiz: ${activity.topic || 'Unknown'}`
                          }
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      {activity.type === 'quiz' && (
                        <div className="text-sm font-medium text-green-600">
                          {activity.score}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Preferences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Study Reminders</span>
                    <button
                      onClick={() => updatePreferences({ studyReminders: !preferences.studyReminders })}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.studyReminders ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        preferences.studyReminders ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Sound Effects</span>
                    <button
                      onClick={() => updatePreferences({ soundEffects: !preferences.soundEffects })}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.soundEffects ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        preferences.soundEffects ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Auto Save</span>
                    <button
                      onClick={() => updatePreferences({ autoSave: !preferences.autoSave })}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.autoSave ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        preferences.autoSave ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Edit Profile Modal */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Edit Profile
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Branch
                    </label>
                    <select
                      value={editForm.branch || ''}
                      onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Branch</option>
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Instrumentation Engineering">Instrumentation Engineering</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default UserProfile
