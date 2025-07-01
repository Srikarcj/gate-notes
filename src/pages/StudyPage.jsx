import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Code, 
  Trophy, 
  Target, 
  Clock, 
  Star, 
  Filter, 
  Search, 
  ChevronDown,
  Play,
  CheckCircle,
  Circle,
  Zap,
  Brain,
  TrendingUp,
  Award,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Bookmark,
  BookmarkCheck
} from 'lucide-react'
import { cn } from '../utils/cn'
import { gfgTopicsDatabase } from '../data/gfgTopicsDatabase'
import { useUserProfileStore } from '../store/userProfileStore'
import TopicBrowser from '../components/study/TopicBrowser.jsx'
import StudyDashboard from '../components/study/StudyDashboard.jsx'
import ProblemSolver from '../components/study/ProblemSolver.jsx'
import TopicStudyInterface from '../components/study/TopicStudyInterface.jsx'
import ProgressAnalytics from '../components/study/ProgressAnalytics.jsx'
import PerformanceDashboard from '../components/analytics/PerformanceDashboard.jsx'
import SessionAnalytics from '../components/analytics/SessionAnalytics.jsx'
import AdvancedPerformanceAnalytics from '../components/analytics/AdvancedPerformanceAnalytics.jsx'

const StudyPage = () => {
  // State management
  const [activeView, setActiveView] = useState('dashboard') // dashboard, browse, solve, study, analytics
  const [selectedBranch, setSelectedBranch] = useState('Computer Science & Engineering')
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [lastActivity, setLastActivity] = useState(Date.now())
  const [studySession, setStudySession] = useState(null)
  const [realTimeStats, setRealTimeStats] = useState({
    activeTime: 0,
    topicsViewed: 0,
    problemsAttempted: 0
  })

  // User profile store
  const { 
    studySessions, 
    topicProgress, 
    solvedProblems, 
    bookmarkedTopics,
    achievements,
    getTopicProgress,
    updateTopicProgress,
    addStudySession,
    toggleTopicBookmark
  } = useUserProfileStore()

  // Real-time activity tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setLastActivity(Date.now())
      if (studySession) {
        setRealTimeStats(prev => ({
          ...prev,
          activeTime: prev.activeTime + 1
        }))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [studySession])

  // Start study session when user becomes active
  useEffect(() => {
    if (activeView !== 'dashboard' && !studySession) {
      const newSession = {
        id: Date.now(),
        startTime: Date.now(),
        subject: selectedSubject,
        branch: selectedBranch,
        topic: selectedTopic,
        view: activeView
      }
      setStudySession(newSession)
    }
  }, [activeView, selectedSubject, selectedTopic])

  // Track topic views
  useEffect(() => {
    if (selectedTopic) {
      setRealTimeStats(prev => ({
        ...prev,
        topicsViewed: prev.topicsViewed + 1
      }))
    }
  }, [selectedTopic])

  // Available branches
  const branches = Object.keys(gfgTopicsDatabase)

  // Get current subject data
  const getCurrentSubjects = () => {
    if (!selectedBranch || !gfgTopicsDatabase[selectedBranch]) return []
    return Object.keys(gfgTopicsDatabase[selectedBranch])
  }

  // Get current topics
  const getCurrentTopics = () => {
    if (!selectedBranch || !selectedSubject || !gfgTopicsDatabase[selectedBranch]?.[selectedSubject]?.topics) return []
    return Object.entries(gfgTopicsDatabase[selectedBranch][selectedSubject].topics)
  }

  // Filter topics based on search and filters
  const getFilteredTopics = () => {
    let topics = getCurrentTopics()
    
    // Search filter
    if (searchQuery) {
      topics = topics.filter(([name, data]) => 
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        data.overview?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Difficulty filter
    if (filterDifficulty !== 'all') {
      topics = topics.filter(([name, data]) => 
        data.difficulty?.toLowerCase() === filterDifficulty.toLowerCase()
      )
    }
    
    // Status filter
    if (filterStatus !== 'all') {
      topics = topics.filter(([name, data]) => {
        const progress = getTopicProgress(name)
        if (filterStatus === 'completed') return progress >= 100
        if (filterStatus === 'in-progress') return progress > 0 && progress < 100
        if (filterStatus === 'not-started') return progress === 0
        return true
      })
    }
    
    return topics
  }

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, description: 'Overview and statistics' },
    { id: 'browse', label: 'Browse Topics', icon: BookOpen, description: 'Explore study materials' },
    { id: 'study', label: 'Study Topics', icon: Brain, description: 'Deep dive into topic learning' },
    { id: 'solve', label: 'Practice Problems', icon: Code, description: 'Solve coding challenges' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, description: 'Track your progress' }
  ]

  // Quick stats
  const getQuickStats = () => {
    const totalTopics = getCurrentTopics().length
    const completedTopics = getCurrentTopics().filter(([name]) => getTopicProgress(name) >= 100).length
    const inProgressTopics = getCurrentTopics().filter(([name]) => {
      const progress = getTopicProgress(name)
      return progress > 0 && progress < 100
    }).length
    
    return {
      totalTopics,
      completedTopics,
      inProgressTopics,
      completionRate: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0
    }
  }

  const stats = getQuickStats()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile-Responsive Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Mobile-Responsive Logo and Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 sm:gap-3">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">Study Hub</h1>
                  {studySession && (
                    <div className="flex items-center gap-2 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-xs">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      Live • {Math.floor(realTimeStats.activeTime / 60)}:{(realTimeStats.activeTime % 60).toString().padStart(2, '0')}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Advanced Learning Platform
                  {realTimeStats.topicsViewed > 0 && (
                    <span className="ml-2 text-blue-600 dark:text-blue-400">
                      • {realTimeStats.topicsViewed} topics viewed
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.completedTopics}</div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{stats.inProgressTopics}</div>
                <div className="text-xs text-gray-500">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">{stats.completionRate}%</div>
                <div className="text-xs text-gray-500">Completion</div>
              </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "p-2 rounded-lg border transition-colors",
                  showFilters 
                    ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600"
                )}
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Difficulty:</label>
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="all">All</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="not-started">Not Started</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              {/* Branch Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Engineering Branch
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => {
                    setSelectedBranch(e.target.value)
                    setSelectedSubject(null)
                    setSelectedTopic(null)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>

              {/* Subject Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <select
                  value={selectedSubject || ''}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value)
                    setSelectedTopic(null)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="">Select Subject</option>
                  {getCurrentSubjects().map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {navigationItems.map(item => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                        activeView === item.id
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs opacity-75">{item.description}</div>
                      </div>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeView === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <StudyDashboard
                    selectedBranch={selectedBranch}
                    selectedSubject={selectedSubject}
                    topics={getCurrentTopics()}
                    stats={stats}
                    onTopicSelect={(topicName) => {
                      setSelectedTopic(topicName)
                      setActiveView('browse')
                    }}
                  />
                </motion.div>
              )}

              {activeView === 'browse' && (
                <motion.div
                  key="browse"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TopicBrowser
                    topics={getFilteredTopics()}
                    selectedTopic={selectedTopic}
                    onTopicSelect={setSelectedTopic}
                    onStartStudying={(topicName, topicData) => {
                      setSelectedTopic(topicName)
                      setActiveView('study')
                    }}
                    searchQuery={searchQuery}
                  />
                </motion.div>
              )}

              {activeView === 'solve' && (
                <motion.div
                  key="solve"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProblemSolver
                    topics={getFilteredTopics()}
                    selectedTopic={selectedTopic}
                    selectedProblem={selectedProblem}
                    onProblemSelect={setSelectedProblem}
                    onBackToTopics={() => setActiveView('browse')}
                  />
                </motion.div>
              )}

              {activeView === 'study' && (
                <motion.div
                  key="study"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TopicStudyInterface
                    topicName={selectedTopic}
                    topicData={getFilteredTopics().find(([name]) => name === selectedTopic)?.[1]}
                    selectedBranch={selectedBranch}
                    selectedSubject={selectedSubject}
                    onBack={() => setActiveView('browse')}
                    onComplete={(topicName) => {
                      // Handle topic completion
                      setActiveView('browse')
                    }}
                  />
                </motion.div>
              )}

              {activeView === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <PerformanceDashboard
                    selectedBranch={selectedBranch}
                    selectedSubject={selectedSubject}
                  />
                  <AdvancedPerformanceAnalytics
                    selectedBranch={selectedBranch}
                    selectedSubject={selectedSubject}
                  />
                  <SessionAnalytics timeRange="week" />
                  <ProgressAnalytics
                    topics={getCurrentTopics()}
                    selectedBranch={selectedBranch}
                    selectedSubject={selectedSubject}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudyPage
