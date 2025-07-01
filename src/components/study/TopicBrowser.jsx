import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Clock,
  Star,
  Target,
  CheckCircle,
  Circle,
  Bookmark,
  BookmarkCheck,
  Play,
  Code,
  Brain,
  Zap,
  TrendingUp,
  Award,
  ChevronRight,
  Eye,
  Users,
  Calendar,
  Filter,
  Search,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Tag,
  Layers,
  BarChart3,
  PieChart,
  Activity,
  Flame,
  Trophy,
  MapPin,
  Lightbulb,
  Timer,
  Gauge,
  ArrowUp,
  ArrowDown,
  Minus,
  X,
  ChevronDown,
  Settings,
  Download,
  Share2,
  RefreshCw,
  Info,
  ExternalLink,
  FileText,
  Video,
  Headphones,
  Image as ImageIcon,
  Monitor
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useUserProfileStore } from '../../store/userProfileStore'

const TopicBrowser = ({ topics, selectedTopic, onTopicSelect, onStartStudying, searchQuery }) => {
  // Enhanced state management
  const [viewMode, setViewMode] = useState('grid') // grid, list, compact
  const [sortBy, setSortBy] = useState('recommended') // recommended, name, difficulty, progress, importance, recent
  const [sortOrder, setSortOrder] = useState('asc') // asc, desc
  const [showTopicDetails, setShowTopicDetails] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({
    difficulty: [],
    importance: [],
    status: [],
    tags: [],
    gateWeight: 'all'
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showStats, setShowStats] = useState(true)
  const [bulkSelectMode, setBulkSelectMode] = useState(false)
  const [selectedTopics, setSelectedTopics] = useState(new Set())
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '')

  const {
    getTopicProgress,
    updateTopicProgress,
    bookmarkedTopics,
    toggleTopicBookmark,
    addStudySession,
    studySessions,
    performance
  } = useUserProfileStore()

  // Update local search when prop changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery || '')
  }, [searchQuery])

  // Advanced topic categorization and analysis
  const topicAnalysis = useMemo(() => {
    const analysis = {
      categories: {},
      difficulties: { Easy: 0, Medium: 0, Hard: 0 },
      importance: { High: 0, 'Very High': 0, Medium: 0 },
      status: { completed: 0, inProgress: 0, notStarted: 0 },
      totalTopics: topics.length,
      averageProgress: 0,
      tags: new Set(),
      gateWeights: []
    }

    topics.forEach(([name, data]) => {
      const progress = getTopicProgress(name)

      // Categorize by difficulty
      const difficulty = data.difficulty || 'Medium'
      analysis.difficulties[difficulty] = (analysis.difficulties[difficulty] || 0) + 1

      // Categorize by importance
      const importance = data.importance || 'Medium'
      analysis.importance[importance] = (analysis.importance[importance] || 0) + 1

      // Categorize by status
      if (progress >= 100) analysis.status.completed++
      else if (progress > 0) analysis.status.inProgress++
      else analysis.status.notStarted++

      // Collect tags
      if (data.tags) {
        data.tags.forEach(tag => analysis.tags.add(tag))
      }

      // Collect GATE weights
      if (data.gateWeight) {
        analysis.gateWeights.push(parseInt(data.gateWeight))
      }

      analysis.averageProgress += progress
    })

    analysis.averageProgress = analysis.totalTopics > 0 ? analysis.averageProgress / analysis.totalTopics : 0
    analysis.tags = Array.from(analysis.tags)

    return analysis
  }, [topics, getTopicProgress])

  // Smart recommendation scoring algorithm
  const getRecommendationScore = (name, data, progress) => {
    let score = 0

    // Boost score for partially completed topics (quick wins)
    if (progress > 50 && progress < 100) score += 50

    // Boost score for high importance topics
    if (data.importance === 'Very High') score += 30
    else if (data.importance === 'High') score += 20

    // Boost score for appropriate difficulty based on user level
    const userLevel = topicAnalysis.averageProgress
    if (userLevel < 30 && data.difficulty === 'Easy') score += 25
    else if (userLevel >= 30 && userLevel < 70 && data.difficulty === 'Medium') score += 25
    else if (userLevel >= 70 && data.difficulty === 'Hard') score += 25

    // Boost score for high GATE weight
    const gateWeight = parseInt(data.gateWeight || 0)
    if (gateWeight >= 5) score += 15
    else if (gateWeight >= 3) score += 10

    // Reduce score for completed topics
    if (progress >= 100) score -= 100

    // Boost score for bookmarked topics
    if (bookmarkedTopics.includes(name)) score += 10

    return score
  }

  // Advanced filtering logic
  const filteredAndSortedTopics = useMemo(() => {
    let filtered = [...topics]

    // Apply search filter
    if (localSearchQuery.trim()) {
      const query = localSearchQuery.toLowerCase()
      filtered = filtered.filter(([name, data]) =>
        name.toLowerCase().includes(query) ||
        data.overview?.toLowerCase().includes(query) ||
        data.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        data.difficulty?.toLowerCase().includes(query) ||
        data.importance?.toLowerCase().includes(query)
      )
    }

    // Apply difficulty filter
    if (selectedFilters.difficulty.length > 0) {
      filtered = filtered.filter(([name, data]) =>
        selectedFilters.difficulty.includes(data.difficulty || 'Medium')
      )
    }

    // Apply importance filter
    if (selectedFilters.importance.length > 0) {
      filtered = filtered.filter(([name, data]) =>
        selectedFilters.importance.includes(data.importance || 'Medium')
      )
    }

    // Apply status filter
    if (selectedFilters.status.length > 0) {
      filtered = filtered.filter(([name, data]) => {
        const progress = getTopicProgress(name)
        return selectedFilters.status.some(status => {
          if (status === 'completed') return progress >= 100
          if (status === 'inProgress') return progress > 0 && progress < 100
          if (status === 'notStarted') return progress === 0
          if (status === 'bookmarked') return bookmarkedTopics.includes(name)
          return false
        })
      })
    }

    // Apply GATE weight filter
    if (selectedFilters.gateWeight !== 'all') {
      const weight = parseInt(selectedFilters.gateWeight)
      filtered = filtered.filter(([name, data]) => {
        const topicWeight = parseInt(data.gateWeight || 0)
        return topicWeight >= weight
      })
    }

    // Apply tags filter
    if (selectedFilters.tags.length > 0) {
      filtered = filtered.filter(([name, data]) =>
        data.tags?.some(tag => selectedFilters.tags.includes(tag))
      )
    }

    // Sort topics
    filtered.sort((a, b) => {
      const [nameA, dataA] = a
      const [nameB, dataB] = b
      const progressA = getTopicProgress(nameA)
      const progressB = getTopicProgress(nameB)

      let comparison = 0

      switch (sortBy) {
        case 'recommended':
          // Smart recommendation algorithm
          const scoreA = getRecommendationScore(nameA, dataA, progressA)
          const scoreB = getRecommendationScore(nameB, dataB, progressB)
          comparison = scoreB - scoreA
          break
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 }
          comparison = (difficultyOrder[dataA.difficulty] || 2) - (difficultyOrder[dataB.difficulty] || 2)
          break
        case 'progress':
          comparison = progressB - progressA
          break
        case 'importance':
          const importanceOrder = { 'Medium': 1, 'High': 2, 'Very High': 3 }
          comparison = (importanceOrder[dataB.importance] || 1) - (importanceOrder[dataA.importance] || 1)
          break
        case 'recent':
          // Sort by recent study activity (mock implementation)
          const recentA = studySessions.filter(s => s.topicName === nameA).length
          const recentB = studySessions.filter(s => s.topicName === nameB).length
          comparison = recentB - recentA
          break
        default:
          comparison = nameA.localeCompare(nameB)
      }

      return sortOrder === 'desc' ? -comparison : comparison
    })

    return filtered
  }, [topics, localSearchQuery, selectedFilters, sortBy, sortOrder, getTopicProgress, bookmarkedTopics, studySessions])



  // Enhanced utility functions
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800'
    }
  }

  const getImportanceColor = (importance) => {
    switch (importance?.toLowerCase()) {
      case 'very high': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800'
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800'
    }
  }

  const getStatusColor = (progress) => {
    if (progress >= 100) return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
    if (progress > 0) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400'
    return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400'
  }

  const getGateWeightColor = (weight) => {
    const w = parseInt(weight || 0)
    if (w >= 5) return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400'
    if (w >= 3) return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400'
    if (w >= 1) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400'
    return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400'
  }

  // Enhanced topic interaction functions
  const startStudying = (topicName, topicData) => {
    onTopicSelect(topicName)
    // Navigate to solve view for studying
    if (onStartStudying) {
      onStartStudying(topicName, topicData)
    }
    addStudySession({
      topicName,
      subject: 'Current Subject',
      duration: 0,
      type: 'study',
      timestamp: new Date().toISOString()
    })
    // Close topic details if open
    setShowTopicDetails(false)
  }

  const toggleBulkSelect = (topicName) => {
    const newSelected = new Set(selectedTopics)
    if (newSelected.has(topicName)) {
      newSelected.delete(topicName)
    } else {
      newSelected.add(topicName)
    }
    setSelectedTopics(newSelected)
  }

  const clearAllFilters = () => {
    setSelectedFilters({
      difficulty: [],
      importance: [],
      status: [],
      tags: [],
      gateWeight: 'all'
    })
    setLocalSearchQuery('')
  }

  const applyBulkAction = (action) => {
    selectedTopics.forEach(topicName => {
      switch (action) {
        case 'bookmark':
          if (!bookmarkedTopics.includes(topicName)) {
            toggleTopicBookmark(topicName)
          }
          break
        case 'unbookmark':
          if (bookmarkedTopics.includes(topicName)) {
            toggleTopicBookmark(topicName)
          }
          break
        case 'markComplete':
          updateTopicProgress(topicName, 100)
          break
        case 'reset':
          updateTopicProgress(topicName, 0)
          break
      }
    })
    setSelectedTopics(new Set())
    setBulkSelectMode(false)
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Topic Browser
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredAndSortedTopics.length} of {topics.length} topics
              {localSearchQuery && ` • Searching for "${localSearchQuery}"`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Bulk Actions */}
            {bulkSelectMode && selectedTopics.size > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {selectedTopics.size} selected
                </span>
                <button
                  onClick={() => applyBulkAction('bookmark')}
                  className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  onClick={() => applyBulkAction('markComplete')}
                  className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setBulkSelectMode(false)}
                  className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === 'grid'
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === 'list'
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === 'compact'
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <Layers className="w-4 h-4" />
              </button>
            </div>

            {/* Actions Menu */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBulkSelectMode(!bulkSelectMode)}
                className={cn(
                  "p-2 rounded-lg border transition-colors",
                  bulkSelectMode
                    ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600"
                )}
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={cn(
                  "p-2 rounded-lg border transition-colors",
                  showAdvancedFilters
                    ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600"
                )}
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {topicAnalysis.status.completed}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {topicAnalysis.status.inProgress}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">In Progress</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-lg font-bold text-gray-600 dark:text-gray-400">
                {topicAnalysis.status.notStarted}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Not Started</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {Math.round(topicAnalysis.averageProgress)}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Avg Progress</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {bookmarkedTopics.length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Bookmarked</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-lg font-bold text-red-600 dark:text-red-400">
                {topicAnalysis.difficulties.Hard || 0}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Hard Topics</div>
            </div>
          </div>
        )}

        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Enhanced Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search topics, tags, or descriptions..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {localSearchQuery && (
              <button
                onClick={() => setLocalSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="recommended">Recommended</option>
              <option value="name">Name</option>
              <option value="difficulty">Difficulty</option>
              <option value="progress">Progress</option>
              <option value="importance">Importance</option>
              <option value="recent">Recent Activity</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Filters</h3>
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty
                </label>
                <div className="space-y-2">
                  {['Easy', 'Medium', 'Hard'].map(difficulty => (
                    <label key={difficulty} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters.difficulty.includes(difficulty)}
                        onChange={(e) => {
                          const newDifficulty = e.target.checked
                            ? [...selectedFilters.difficulty, difficulty]
                            : selectedFilters.difficulty.filter(d => d !== difficulty)
                          setSelectedFilters(prev => ({ ...prev, difficulty: newDifficulty }))
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {difficulty} ({topicAnalysis.difficulties[difficulty] || 0})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Importance Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Importance
                </label>
                <div className="space-y-2">
                  {['Medium', 'High', 'Very High'].map(importance => (
                    <label key={importance} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters.importance.includes(importance)}
                        onChange={(e) => {
                          const newImportance = e.target.checked
                            ? [...selectedFilters.importance, importance]
                            : selectedFilters.importance.filter(i => i !== importance)
                          setSelectedFilters(prev => ({ ...prev, importance: newImportance }))
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {importance} ({topicAnalysis.importance[importance] || 0})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <div className="space-y-2">
                  {[
                    { key: 'completed', label: 'Completed', count: topicAnalysis.status.completed },
                    { key: 'inProgress', label: 'In Progress', count: topicAnalysis.status.inProgress },
                    { key: 'notStarted', label: 'Not Started', count: topicAnalysis.status.notStarted },
                    { key: 'bookmarked', label: 'Bookmarked', count: bookmarkedTopics.length }
                  ].map(status => (
                    <label key={status.key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters.status.includes(status.key)}
                        onChange={(e) => {
                          const newStatus = e.target.checked
                            ? [...selectedFilters.status, status.key]
                            : selectedFilters.status.filter(s => s !== status.key)
                          setSelectedFilters(prev => ({ ...prev, status: newStatus }))
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {status.label} ({status.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* GATE Weight Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GATE Weight (min marks)
                </label>
                <select
                  value={selectedFilters.gateWeight}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, gateWeight: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="all">All Topics</option>
                  <option value="1">1+ marks</option>
                  <option value="3">3+ marks</option>
                  <option value="5">5+ marks</option>
                  <option value="7">7+ marks</option>
                </select>
              </div>
            </div>

            {/* Tags Filter */}
            {topicAnalysis.tags.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {topicAnalysis.tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        const newTags = selectedFilters.tags.includes(tag)
                          ? selectedFilters.tags.filter(t => t !== tag)
                          : [...selectedFilters.tags, tag]
                        setSelectedFilters(prev => ({ ...prev, tags: newTags }))
                      }}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                        selectedFilters.tags.includes(tag)
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      )}
                    >
                      <Tag className="w-3 h-3 inline mr-1" />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active Filters Summary */}
            {(selectedFilters.difficulty.length > 0 || selectedFilters.importance.length > 0 ||
              selectedFilters.status.length > 0 || selectedFilters.tags.length > 0 ||
              selectedFilters.gateWeight !== 'all') && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active Filters:
                  </span>
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    {filteredAndSortedTopics.length} results
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Topics Grid/List */}
      {filteredAndSortedTopics.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No topics found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {localSearchQuery || Object.values(selectedFilters).some(f => Array.isArray(f) ? f.length > 0 : f !== 'all')
              ? 'Try adjusting your search or filters'
              : 'Select a subject to view topics'}
          </p>
          {(localSearchQuery || Object.values(selectedFilters).some(f => Array.isArray(f) ? f.length > 0 : f !== 'all')) && (
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className={cn(
          "transition-all duration-300",
          viewMode === 'grid' && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          viewMode === 'list' && "space-y-4",
          viewMode === 'compact' && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        )}>
          {filteredAndSortedTopics.map(([topicName, topicData], index) => {
            const progress = getTopicProgress(topicName)
            const isBookmarked = bookmarkedTopics.includes(topicName)
            const isCompleted = progress >= 100
            const isSelected = bulkSelectMode && selectedTopics.has(topicName)
            const recommendationScore = getRecommendationScore(topicName, topicData, progress)

            return (
              <motion.div
                key={topicName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className={cn(
                  "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 relative",
                  viewMode === 'list' && "flex items-center",
                  isSelected && "ring-2 ring-blue-500 border-blue-500",
                  recommendationScore > 50 && "ring-1 ring-yellow-400 border-yellow-300"
                )}
              >
                {viewMode === 'grid' ? (
                  // Enhanced Grid View
                  <div className="p-6">
                    {/* Recommendation Badge */}
                    {recommendationScore > 50 && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 rounded-full text-xs font-medium">
                        <Star className="w-3 h-3 inline mr-1" />
                        Recommended
                      </div>
                    )}

                    {/* Bulk Select Checkbox */}
                    {bulkSelectMode && (
                      <div className="absolute top-3 right-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleBulkSelect(topicName)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4 mt-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {topicName}
                          </h3>
                          {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {topicData.overview}
                        </p>
                      </div>
                      {!bulkSelectMode && (
                        <button
                          onClick={() => toggleTopicBookmark(topicName)}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <Bookmark className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Enhanced Metadata */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium border", getDifficultyColor(topicData.difficulty))}>
                        {topicData.difficulty || 'Medium'}
                      </span>
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium border", getImportanceColor(topicData.importance))}>
                        {topicData.importance || 'High'}
                      </span>
                      {topicData.gateWeight && (
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium border", getGateWeightColor(topicData.gateWeight))}>
                          <Trophy className="w-3 h-3 inline mr-1" />
                          {topicData.gateWeight} marks
                        </span>
                      )}
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(progress))}>
                        {isCompleted ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'}
                      </span>
                    </div>

                    {/* Tags */}
                    {topicData.tags && topicData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {topicData.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                        {topicData.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                            +{topicData.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Enhanced Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{progress}%</span>
                          {progress > 0 && (
                            <Timer className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className={cn(
                            "h-3 rounded-full transition-all duration-300",
                            isCompleted ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gradient-to-r from-blue-500 to-blue-600"
                          )}
                        />
                        {progress > 0 && progress < 100 && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                        )}
                      </div>
                    </div>

                    {/* Study Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <div className="text-xs font-medium text-gray-900 dark:text-white">
                          {topicData.studyContent?.theory?.sections?.length || 0}
                        </div>
                        <div className="text-xs text-gray-500">Sections</div>
                      </div>
                      <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <div className="text-xs font-medium text-gray-900 dark:text-white">
                          {topicData.quiz?.length || 0}
                        </div>
                        <div className="text-xs text-gray-500">Questions</div>
                      </div>
                      <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <div className="text-xs font-medium text-gray-900 dark:text-white">
                          {topicData.studyContent?.examples?.length || 0}
                        </div>
                        <div className="text-xs text-gray-500">Examples</div>
                      </div>
                    </div>

                    {/* Enhanced Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startStudying(topicName, topicData)}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium",
                          isCompleted
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : progress > 0
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-gray-600 hover:bg-gray-700 text-white"
                        )}
                      >
                        {isCompleted ? (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            Review
                          </>
                        ) : progress > 0 ? (
                          <>
                            <Play className="w-4 h-4" />
                            Continue
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-4 h-4" />
                            Start
                          </>
                        )}
                      </button>

                      {topicData.quiz && (
                        <button
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          title="Take Quiz"
                        >
                          <Target className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        title="More Options"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : viewMode === 'list' ? (
                  // Enhanced List View
                  <div className="flex items-center p-4 w-full">
                    {/* Bulk Select */}
                    {bulkSelectMode && (
                      <div className="mr-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleBulkSelect(topicName)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    <div className="flex-1 flex items-center gap-4">
                      {/* Enhanced Status Icon */}
                      <div className="flex-shrink-0 relative">
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        ) : progress > 0 ? (
                          <div className="relative">
                            <Circle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full" style={{ transform: `scale(${progress / 100})` }} />
                            </div>
                          </div>
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400" />
                        )}
                        {recommendationScore > 50 && (
                          <Star className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1" />
                        )}
                      </div>

                      {/* Topic Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {topicName}
                          </h3>
                          {isBookmarked && <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
                          {topicData.overview}
                        </p>
                        <div className="flex items-center gap-2">
                          {topicData.tags && topicData.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Enhanced Metadata */}
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{progress}%</div>
                          <div className="text-xs text-gray-500">Progress</div>
                        </div>
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium border", getDifficultyColor(topicData.difficulty))}>
                          {topicData.difficulty || 'Medium'}
                        </span>
                        {topicData.gateWeight && (
                          <span className={cn("px-2 py-1 rounded-full text-xs font-medium border", getGateWeightColor(topicData.gateWeight))}>
                            {topicData.gateWeight}m
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startStudying(topicName, topicData)}
                          className={cn(
                            "px-4 py-2 rounded-lg transition-colors font-medium",
                            isCompleted
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : progress > 0
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-gray-600 hover:bg-gray-700 text-white"
                          )}
                        >
                          {isCompleted ? 'Review' : progress > 0 ? 'Continue' : 'Start'}
                        </button>
                        <button
                          onClick={() => toggleTopicBookmark(topicName)}
                          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <Bookmark className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ) : (
                  // Compact View
                  <div className="p-4">
                    {/* Bulk Select */}
                    {bulkSelectMode && (
                      <div className="absolute top-2 left-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleBulkSelect(topicName)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {/* Recommendation Badge */}
                    {recommendationScore > 50 && (
                      <div className="absolute top-2 right-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                      </div>
                    )}

                    {/* Status Indicator */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : progress > 0 ? (
                          <Circle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                        {isBookmarked && <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {progress}%
                      </span>
                    </div>

                    {/* Topic Name */}
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {topicName}
                    </h3>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      <span className={cn("px-2 py-1 rounded text-xs", getDifficultyColor(topicData.difficulty))}>
                        {topicData.difficulty || 'M'}
                      </span>
                      {topicData.gateWeight && (
                        <span className={cn("px-2 py-1 rounded text-xs", getGateWeightColor(topicData.gateWeight))}>
                          {topicData.gateWeight}m
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, delay: index * 0.05 }}
                        className={cn(
                          "h-2 rounded-full",
                          isCompleted ? "bg-green-500" : "bg-blue-500"
                        )}
                      />
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => startStudying(topicName, topicData)}
                      className={cn(
                        "w-full py-2 rounded-lg text-xs font-medium transition-colors",
                        isCompleted
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : progress > 0
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-600 hover:bg-gray-700 text-white"
                      )}
                    >
                      {isCompleted ? 'Review' : progress > 0 ? 'Continue' : 'Start'}
                    </button>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Enhanced Topic Details Modal */}
      <AnimatePresence>
        {showTopicDetails && selectedTopic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTopicDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedTopic}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      {(() => {
                        const topicData = topics.find(([name]) => name === selectedTopic)?.[1]
                        if (!topicData) return null
                        return (
                          <>
                            <span className={cn("px-2 py-1 rounded-full text-xs font-medium border", getDifficultyColor(topicData.difficulty))}>
                              {topicData.difficulty || 'Medium'}
                            </span>
                            <span className={cn("px-2 py-1 rounded-full text-xs font-medium border", getImportanceColor(topicData.importance))}>
                              {topicData.importance || 'High'}
                            </span>
                            {topicData.gateWeight && (
                              <span className={cn("px-2 py-1 rounded-full text-xs font-medium border", getGateWeightColor(topicData.gateWeight))}>
                                <Trophy className="w-3 h-3 inline mr-1" />
                                {topicData.gateWeight} marks
                              </span>
                            )}
                          </>
                        )
                      })()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleTopicBookmark(selectedTopic)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {bookmarkedTopics.includes(selectedTopic) ? (
                      <BookmarkCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Bookmark className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    onClick={() => setShowTopicDetails(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {(() => {
                  const topicData = topics.find(([name]) => name === selectedTopic)?.[1]
                  const progress = getTopicProgress(selectedTopic)

                  if (!topicData) return <div>Topic not found</div>

                  return (
                    <div className="space-y-6">
                      {/* Overview */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Overview</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {topicData.overview}
                        </p>
                      </div>

                      {/* Progress */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Your Progress</h3>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                            <div
                              className={cn(
                                "h-3 rounded-full transition-all duration-300",
                                progress >= 100 ? "bg-green-500" : "bg-blue-500"
                              )}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Key Points */}
                      {topicData.keyPoints && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Key Points</h3>
                          <ul className="space-y-2">
                            {topicData.keyPoints.map((point, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Prerequisites */}
                      {topicData.prerequisites && topicData.prerequisites.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Prerequisites</h3>
                          <div className="flex flex-wrap gap-2">
                            {topicData.prerequisites.map((prereq, index) => (
                              <span key={index} className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded-full text-sm">
                                {prereq}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Study Materials */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Study Materials</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Theory</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {topicData.studyContent?.theory?.sections?.length || 0} sections
                            </p>
                          </div>
                          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <Code className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Examples</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {topicData.studyContent?.examples?.length || 0} examples
                            </p>
                          </div>
                          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <Target className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Quiz</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {topicData.quiz?.length || 0} questions
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  Estimated time: 2-3 hours
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowTopicDetails(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      startStudying(selectedTopic, topics.find(([name]) => name === selectedTopic)?.[1])
                      setShowTopicDetails(false)
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Studying
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

export default TopicBrowser
