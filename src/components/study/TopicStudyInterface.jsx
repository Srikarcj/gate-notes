import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  BookOpen, 
  Clock, 
  Star, 
  CheckCircle, 
  PlayCircle,
  PauseCircle,
  RotateCcw,
  ExternalLink,
  Code,
  FileText,
  Lightbulb,
  Target,
  TrendingUp,
  Award,
  Timer,
  Brain,
  Zap,
  BookmarkPlus,
  Share2,
  Download,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronDown,
  Copy,
  Check
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useUserProfileStore } from '../../store/userProfileStore'
import { gfgTopicsDatabase } from '../../data/gfgTopicsDatabase'
import { gfgLinksDatabase, GFGLinkGenerator } from '../../data/gfgLinksDatabase'
import { gfgContentSync } from '../../services/gfgContentSync'

const TopicStudyInterface = ({ 
  topicName, 
  topicData, 
  selectedBranch, 
  selectedSubject, 
  onBack, 
  onComplete 
}) => {
  const [studyMode, setStudyMode] = useState('overview') // overview, theory, examples, practice, quiz
  const [isStudying, setIsStudying] = useState(false)
  const [studyTime, setStudyTime] = useState(0)
  const [currentSection, setCurrentSection] = useState(0)
  const [completedSections, setCompletedSections] = useState(new Set())
  const [showNotes, setShowNotes] = useState(false)
  const [userNotes, setUserNotes] = useState('')
  const [expandedSubtopics, setExpandedSubtopics] = useState(new Set())
  const [copiedCode, setCopiedCode] = useState('')
  const [showGFGLinks, setShowGFGLinks] = useState(true)
  const [performanceData, setPerformanceData] = useState({
    timeSpent: 0,
    sectionsCompleted: 0,
    notesCount: 0,
    practiceAttempts: 0
  })
  const [validatedGFGLinks, setValidatedGFGLinks] = useState(null)
  const [contentRecommendations, setContentRecommendations] = useState([])
  const [syncStatus, setSyncStatus] = useState('idle') // idle, syncing, synced, error

  const studyTimerRef = useRef(null)
  const startTimeRef = useRef(null)

  const {
    updateTopicProgress,
    addStudySession,
    saveUserNotes,
    getUserNotes,
    updatePerformance,
    analytics,
    calculateTopicMastery,
    calculateRatingChange,
    updateSubjectRating,
    calculateGATEReadiness,
    startStudySession,
    trackSessionInteraction,
    updateSessionProgress,
    endStudySession,
    currentSession,
    topicProgress
  } = useUserProfileStore()

  // Get comprehensive topic data from GFG database
  const getTopicContent = () => {
    if (!selectedBranch || !selectedSubject || !topicName) return null
    
    const branchData = gfgTopicsDatabase[selectedBranch]
    if (!branchData) return null
    
    const subjectData = branchData[selectedSubject]
    if (!subjectData) return null
    
    const topic = subjectData.topics?.[topicName]
    if (!topic) return null

    // Get advanced GFG links
    const gfgLinks = GFGLinkGenerator.getAllLinksForTopic(selectedBranch, selectedSubject, topicName)

    return {
      ...topic,
      gfgLink: gfgLinks?.tutorial || `https://www.geeksforgeeks.org/${topicName.toLowerCase().replace(/\s+/g, '-')}/`,
      gfgLinks: gfgLinks || {
        tutorial: `https://www.geeksforgeeks.org/${topicName.toLowerCase().replace(/\s+/g, '-')}/`,
        practice: GFGLinkGenerator.generatePracticeUrl(selectedSubject),
        problems: [],
        videos: GFGLinkGenerator.generateVideoUrl(topicName),
        articles: [],
        search: GFGLinkGenerator.generateSearchUrl(`${topicName} ${selectedSubject}`)
      },
      theory: {
        sections: [
          {
            title: 'Introduction',
            content: topic.description,
            keyPoints: [
              `Difficulty Level: ${topic.difficulty}`,
              `Importance: ${topic.importance}`,
              `GATE Weight: ${topic.gateWeight}`,
              ...(topic.prerequisites || []).map(p => `Prerequisite: ${p}`)
            ]
          },
          {
            title: 'Core Concepts',
            content: `Understanding ${topicName} is crucial for ${selectedSubject}. This topic covers fundamental concepts that are essential for GATE preparation.`,
            keyPoints: topic.subtopics || []
          },
          {
            title: 'Applications',
            content: `${topicName} has wide applications in computer science and engineering. It forms the foundation for many advanced topics.`,
            keyPoints: [
              'Real-world applications',
              'Industry usage',
              'Academic importance',
              'Problem-solving techniques'
            ]
          }
        ],
        examples: [
          {
            title: `Basic ${topicName} Example`,
            description: `A simple example demonstrating ${topicName} concepts`,
            code: `// Example implementation of ${topicName}
// This is a basic demonstration
function example() {
  console.log("Learning ${topicName}");
  // Add your implementation here
}`,
            explanation: `This example shows the basic structure and implementation of ${topicName}.`
          }
        ]
      },
      practiceProblems: [
        {
          title: `${topicName} - Basic Problem`,
          difficulty: 'Easy',
          description: `Solve a basic problem related to ${topicName}`,
          gfgLink: `https://practice.geeksforgeeks.org/problems/${topicName.toLowerCase().replace(/\s+/g, '-')}`
        },
        {
          title: `${topicName} - Intermediate Problem`,
          difficulty: 'Medium',
          description: `Solve an intermediate problem related to ${topicName}`,
          gfgLink: `https://practice.geeksforgeeks.org/problems/${topicName.toLowerCase().replace(/\s+/g, '-')}-2`
        }
      ],
      quiz: [
        {
          question: `What is the primary purpose of ${topicName}?`,
          options: [
            'Data storage',
            'Algorithm optimization',
            'Memory management',
            'All of the above'
          ],
          correct: 3,
          explanation: `${topicName} serves multiple purposes in computer science.`
        }
      ]
    }
  }

  const topicContent = getTopicContent()

  useEffect(() => {
    if (topicName) {
      const notes = getUserNotes(topicName)
      setUserNotes(notes || '')
    }
  }, [topicName, getUserNotes])

  // Validate GFG links and get content recommendations
  useEffect(() => {
    const validateAndSync = async () => {
      if (selectedBranch && selectedSubject && topicName) {
        try {
          // Validate GFG links
          const validated = await gfgContentSync.validateGFGLinks(selectedBranch, selectedSubject, topicName)
          setValidatedGFGLinks(validated)

          // Get content recommendations
          const recommendations = gfgContentSync.getRecommendedContent(
            topicName,
            topicProgress,
            topicContent?.difficulty
          )
          setContentRecommendations(recommendations)
        } catch (error) {
          console.error('Content sync error:', error)
        }
      }
    }

    validateAndSync()
  }, [selectedBranch, selectedSubject, topicName, topicProgress, topicContent])

  useEffect(() => {
    if (isStudying) {
      startTimeRef.current = Date.now()
      studyTimerRef.current = setInterval(() => {
        setStudyTime(prev => prev + 1)
      }, 1000)
    } else {
      if (studyTimerRef.current) {
        clearInterval(studyTimerRef.current)
      }
    }

    return () => {
      if (studyTimerRef.current) {
        clearInterval(studyTimerRef.current)
      }
    }
  }, [isStudying])

  const startStudySessionLocal = () => {
    setIsStudying(true)
    setStudyTime(0)
    startTimeRef.current = Date.now()

    // Start enhanced session tracking
    const sessionId = startStudySession(topicName, selectedSubject, selectedBranch)
    trackSessionInteraction('session_start', {
      topicName,
      subject: selectedSubject,
      branch: selectedBranch
    })
  }

  const pauseStudySession = () => {
    setIsStudying(false)
    if (startTimeRef.current) {
      const sessionTime = Math.floor((Date.now() - startTimeRef.current) / 1000)
      updatePerformanceData('timeSpent', sessionTime)

      // Track pause interaction
      trackSessionInteraction('session_pause', {
        timeSpent: sessionTime,
        sectionsCompleted: completedSections.size
      })
    }
  }

  const endStudySessionLocal = () => {
    setIsStudying(false)
    if (startTimeRef.current) {
      const sessionTime = Math.floor((Date.now() - startTimeRef.current) / 1000)

      // Calculate performance metrics
      const sectionsCompletedCount = completedSections.size
      const totalSections = 5 // overview, theory, examples, practice, quiz
      const completionRate = (sectionsCompletedCount / totalSections) * 100
      const hasNotes = userNotes.length > 0

      // Calculate accuracy based on completion and engagement
      const accuracy = Math.min(100,
        completionRate * 0.7 +
        (hasNotes ? 20 : 0) +
        (sessionTime > 300 ? 10 : 0) // Bonus for spending at least 5 minutes
      )

      // Track session end interaction
      trackSessionInteraction('session_end', {
        timeSpent: sessionTime,
        sectionsCompleted: sectionsCompletedCount,
        completionRate,
        accuracy,
        notesCount: userNotes.length
      })

      // Update session progress before ending
      updateSessionProgress(Array.from(completedSections), userNotes.length)

      // End the enhanced session tracking
      const completedSession = endStudySession()

      // Calculate topic mastery score
      const masteryScore = calculateTopicMastery(
        topicName,
        sessionTime,
        accuracy / 100,
        topicContent?.difficulty || 'Medium'
      )

      // Calculate rating change
      const ratingChange = calculateRatingChange(
        topicName,
        accuracy,
        topicContent?.difficulty || 'Medium',
        sessionTime
      )

      // Update subject rating
      if (selectedSubject) {
        updateSubjectRating(selectedSubject, accuracy)
      }

      // Save study session with performance data (legacy format for compatibility)
      addStudySession({
        topicName,
        subject: selectedSubject,
        branch: selectedBranch,
        duration: sessionTime,
        type: 'study',
        timestamp: new Date().toISOString(),
        sectionsCompleted: sectionsCompletedCount,
        notesCount: userNotes.length,
        masteryScore,
        accuracy,
        ratingChange: ratingChange.change,
        difficulty: topicContent?.difficulty || 'Medium',
        sessionId: completedSession?.id
      })

      // Update topic progress
      const progressIncrease = Math.min(25, sectionsCompletedCount * 10)
      updateTopicProgress(topicName, progressIncrease)

      // Update performance metrics
      updatePerformance({
        totalStudyTime: sessionTime,
        totalTopicsStudied: sectionsCompletedCount === totalSections ? 1 : 0,
        totalTopicsCompleted: sectionsCompletedCount === totalSections ? 1 : 0
      })

      // Recalculate GATE readiness
      calculateGATEReadiness()

      // Sync progress with GFG content service
      const syncProgress = async () => {
        setSyncStatus('syncing')
        try {
          const progressData = {
            topicName,
            subject: selectedSubject,
            branch: selectedBranch,
            completionRate,
            masteryScore,
            studyTime: sessionTime,
            timestamp: new Date().toISOString()
          }

          const syncResult = await gfgContentSync.syncUserProgress(progressData)
          setSyncStatus(syncResult.synced ? 'synced' : 'queued')
        } catch (error) {
          console.error('Progress sync error:', error)
          setSyncStatus('error')
        }
      }

      syncProgress()

      // Show completion notification
      if (onComplete && sectionsCompletedCount === totalSections) {
        onComplete(topicName)
      }
    }
  }

  const updatePerformanceData = (metric, value) => {
    setPerformanceData(prev => ({
      ...prev,
      [metric]: prev[metric] + value
    }))
  }

  const markSectionComplete = (sectionIndex) => {
    const newCompleted = new Set(completedSections)
    newCompleted.add(sectionIndex)
    setCompletedSections(newCompleted)
    updatePerformanceData('sectionsCompleted', 1)

    // Track section completion
    trackSessionInteraction('section_complete', {
      section: sectionIndex,
      totalCompleted: newCompleted.size,
      timeSpent: studyTime
    })

    // Update session progress
    updateSessionProgress(Array.from(newCompleted), userNotes.length)
  }

  const toggleSubtopic = (index) => {
    const newExpanded = new Set(expandedSubtopics)
    const isExpanding = !newExpanded.has(index)

    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedSubtopics(newExpanded)

    // Track subtopic interaction
    trackSessionInteraction('subtopic_toggle', {
      subtopicIndex: index,
      action: isExpanding ? 'expand' : 'collapse',
      timeSpent: studyTime
    })
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(''), 2000)

    // Track code copy interaction
    trackSessionInteraction('code_copy', {
      codeLength: code.length,
      timeSpent: studyTime
    })
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const saveNotes = () => {
    saveUserNotes(topicName, userNotes)
    updatePerformanceData('notesCount', 1)

    // Track notes save interaction
    trackSessionInteraction('notes_save', {
      notesLength: userNotes.length,
      timeSpent: studyTime
    })

    // Update session progress
    updateSessionProgress(Array.from(completedSections), userNotes.length)
  }

  if (!topicContent) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Topic Not Found</h3>
          <p className="text-gray-600 dark:text-gray-400">The requested topic could not be loaded.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile-Responsive Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile-optimized left section */}
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <button
                onClick={onBack}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Back to Topics</span>
                <span className="text-sm font-medium sm:hidden">Back</span>
              </button>

              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block" />

              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">{topicName}</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{selectedSubject} • {selectedBranch}</p>
              </div>
            </div>

            {/* Mobile-optimized right section */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Study Timer - Compact on mobile */}
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Timer className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-xs sm:text-sm font-mono text-gray-900 dark:text-white">
                  {formatTime(studyTime)}
                </span>
              </div>

              {/* Sync Status Indicator */}
              {syncStatus !== 'idle' && (
                <div className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-full text-xs",
                  syncStatus === 'syncing' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
                  syncStatus === 'synced' && "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
                  syncStatus === 'queued' && "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
                  syncStatus === 'error' && "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                )}>
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    syncStatus === 'syncing' && "bg-yellow-500 animate-pulse",
                    syncStatus === 'synced' && "bg-green-500",
                    syncStatus === 'queued' && "bg-blue-500",
                    syncStatus === 'error' && "bg-red-500"
                  )} />
                  <span className="hidden sm:inline">
                    {syncStatus === 'syncing' && 'Syncing'}
                    {syncStatus === 'synced' && 'Synced'}
                    {syncStatus === 'queued' && 'Queued'}
                    {syncStatus === 'error' && 'Error'}
                  </span>
                </div>
              )}

              {/* Study Controls - Mobile optimized */}
              <div className="flex items-center gap-1 sm:gap-2">
                {!isStudying ? (
                  <button
                    onClick={startStudySessionLocal}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-xs sm:text-sm"
                  >
                    <PlayCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Start Study</span>
                    <span className="sm:hidden">Start</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={pauseStudySession}
                      className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-xs sm:text-sm"
                    >
                      <PauseCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Pause</span>
                    </button>
                    <button
                      onClick={endStudySessionLocal}
                      className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs sm:text-sm"
                    >
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">End</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-Responsive Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Mobile-Responsive Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:sticky lg:top-24">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Study Sections</h3>

              {/* Mobile: Horizontal scroll, Desktop: Vertical stack */}
              <nav className="lg:space-y-2">
                <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 -mx-1 px-1">
                {[
                  { id: 'overview', label: 'Overview', icon: Eye },
                  { id: 'theory', label: 'Theory', icon: BookOpen },
                  { id: 'examples', label: 'Examples', icon: Code },
                  { id: 'practice', label: 'Practice', icon: Target },
                  { id: 'quiz', label: 'Quiz', icon: Brain }
                ].map((section) => {
                  const Icon = section.icon
                  const isActive = studyMode === section.id
                  const isCompleted = completedSections.has(section.id)

                  return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setStudyMode(section.id)
                      // Track section navigation
                      trackSessionInteraction('section_navigate', {
                        fromSection: studyMode,
                        toSection: section.id,
                        timeSpent: studyTime
                      })
                    }}
                    className={cn(
                      "flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-lg transition-colors whitespace-nowrap lg:w-full",
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">{section.label}</span>
                    {isCompleted && (
                      <CheckCircle className="w-4 h-4 text-green-500 lg:ml-auto flex-shrink-0" />
                    )}
                  </button>
                )
              })}
                </div>
              </nav>

              {/* Mobile-Responsive Topic Info */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Difficulty</span>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      topicContent.difficulty === 'Easy' && "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
                      topicContent.difficulty === 'Medium' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
                      topicContent.difficulty === 'Hard' && "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    )}>
                      {topicContent.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Importance</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {topicContent.importance}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">GATE Weight</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {topicContent.gateWeight}
                    </span>
                  </div>
                </div>

                {/* Mobile-Responsive Advanced GFG Links */}
                {showGFGLinks && topicContent.gfgLinks && (
                  <div className="mt-3 sm:mt-4 space-y-2">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">GeeksforGeeks Resources</h4>

                    {/* Tutorial Link */}
                    <a
                      href={topicContent.gfgLinks.tutorial}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackSessionInteraction('gfg_tutorial_click', {
                          topicName,
                          timeSpent: studyTime
                        })
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm font-medium">Tutorial</span>
                    </a>

                    {/* Practice Link */}
                    <a
                      href={topicContent.gfgLinks.practice}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackSessionInteraction('gfg_practice_click', {
                          topicName,
                          timeSpent: studyTime
                        })
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <Code className="w-4 h-4" />
                      <span className="text-sm font-medium">Practice</span>
                    </a>

                    {/* Videos Link */}
                    <a
                      href={topicContent.gfgLinks.videos}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackSessionInteraction('gfg_videos_click', {
                          topicName,
                          timeSpent: studyTime
                        })
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Videos</span>
                    </a>

                    {/* Search Link */}
                    <a
                      href={topicContent.gfgLinks.search}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackSessionInteraction('gfg_search_click', {
                          topicName,
                          timeSpent: studyTime
                        })
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm font-medium">Search More</span>
                    </a>
                  </div>
                )}

                {/* Performance Stats */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Session Stats</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Sections</span>
                      <span className="text-gray-900 dark:text-white">{completedSections.size}/5</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Time Spent</span>
                      <span className="text-gray-900 dark:text-white">{formatTime(studyTime)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Notes</span>
                      <span className="text-gray-900 dark:text-white">{userNotes.length > 0 ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile-Responsive Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <AnimatePresence mode="wait">
                {studyMode === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Topic Overview</h2>
                      <button
                        onClick={() => markSectionComplete('overview')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Complete
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Description */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {topicContent.description}
                        </p>
                      </div>

                      {/* Prerequisites */}
                      {topicContent.prerequisites && topicContent.prerequisites.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Prerequisites</h3>
                          <div className="flex flex-wrap gap-2">
                            {topicContent.prerequisites.map((prereq, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm"
                              >
                                {prereq}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Subtopics */}
                      {topicContent.subtopics && topicContent.subtopics.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Subtopics</h3>
                          <div className="space-y-2">
                            {topicContent.subtopics.map((subtopic, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {index + 1}
                                  </div>
                                  <span className="text-gray-900 dark:text-white font-medium">{subtopic}</span>
                                </div>
                                <button
                                  onClick={() => toggleSubtopic(index)}
                                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                  {expandedSubtopics.has(index) ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Study Tips */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Study Tips</h3>
                        </div>
                        <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                          <li>• Start with understanding the basic concepts</li>
                          <li>• Practice with simple examples before moving to complex problems</li>
                          <li>• Take notes on key points and formulas</li>
                          <li>• Test your understanding with the quiz section</li>
                          <li>• Practice problems on GeeksforGeeks for better understanding</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}

                {studyMode === 'theory' && (
                  <motion.div
                    key="theory"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Theory & Concepts</h2>
                      <button
                        onClick={() => markSectionComplete('theory')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Complete
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Theory Sections */}
                      {topicContent.theory?.sections?.map((section, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{section.title}</h3>
                          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{section.content}</p>

                          {section.keyPoints && section.keyPoints.length > 0 && (
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Points:</h4>
                              <ul className="space-y-1">
                                {section.keyPoints.map((point, pointIndex) => (
                                  <li key={pointIndex} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* GFG Articles Integration */}
                      {topicContent.gfgLinks?.articles && topicContent.gfgLinks.articles.length > 0 && (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
                            📚 Related GFG Articles
                          </h3>
                          <div className="space-y-2">
                            {topicContent.gfgLinks.articles.map((article, index) => (
                              <a
                                key={index}
                                href={article}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => {
                                  trackSessionInteraction('gfg_article_click', {
                                    topicName,
                                    articleIndex: index,
                                    timeSpent: studyTime
                                  })
                                }}
                                className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              >
                                <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                                <span className="text-gray-900 dark:text-white">Article {index + 1}</span>
                                <ExternalLink className="w-3 h-3 text-gray-400 ml-auto" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {studyMode === 'examples' && (
                  <motion.div
                    key="examples"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Examples & Code</h2>
                      <button
                        onClick={() => markSectionComplete('examples')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Complete
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Code Examples */}
                      {topicContent.theory?.examples?.map((example, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{example.title}</h3>
                            <button
                              onClick={() => copyCode(example.code)}
                              className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                            >
                              {copiedCode === example.code ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>

                          <p className="text-gray-700 dark:text-gray-300 mb-4">{example.description}</p>

                          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <pre className="text-green-400 text-sm">
                              <code>{example.code}</code>
                            </pre>
                          </div>

                          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Explanation:</h4>
                            <p className="text-blue-800 dark:text-blue-200 text-sm">{example.explanation}</p>
                          </div>
                        </div>
                      ))}

                      {/* Interactive Code Editor */}
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          💻 Try It Yourself
                        </h3>
                        <div className="bg-gray-900 rounded-lg p-4">
                          <textarea
                            className="w-full h-40 bg-transparent text-green-400 font-mono text-sm resize-none outline-none"
                            placeholder={`// Write your ${topicName} code here...\n// Example:\nfunction example() {\n    console.log("Learning ${topicName}");\n}`}
                            onChange={(e) => {
                              trackSessionInteraction('code_edit', {
                                topicName,
                                codeLength: e.target.value.length,
                                timeSpent: studyTime
                              })
                            }}
                          />
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                            Run Code
                          </button>
                          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                            Save to Notes
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {studyMode === 'practice' && (
                  <motion.div
                    key="practice"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Practice Problems</h2>
                      <button
                        onClick={() => markSectionComplete('practice')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Complete
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* GFG Practice Problems */}
                      {topicContent.gfgLinks?.problems && topicContent.gfgLinks.problems.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {topicContent.gfgLinks.problems.map((problem, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Problem {index + 1}</h3>
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded text-xs">
                                  GFG
                                </span>
                              </div>

                              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                Practice problem related to {topicName}
                              </p>

                              <a
                                href={problem}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => {
                                  trackSessionInteraction('gfg_problem_click', {
                                    topicName,
                                    problemIndex: index,
                                    timeSpent: studyTime
                                  })
                                  updatePerformanceData('practiceAttempts', 1)
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                              >
                                <Code className="w-4 h-4" />
                                <span>Solve Problem</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Local Practice Problems */}
                      {topicContent.practiceProblems?.map((problem, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{problem.title}</h3>
                            <span className={cn(
                              "px-2 py-1 rounded text-xs font-medium",
                              problem.difficulty === 'Easy' && "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
                              problem.difficulty === 'Medium' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
                              problem.difficulty === 'Hard' && "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                            )}>
                              {problem.difficulty}
                            </span>
                          </div>

                          <p className="text-gray-600 dark:text-gray-400 mb-4">{problem.description}</p>

                          <a
                            href={problem.gfgLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              trackSessionInteraction('practice_problem_click', {
                                topicName,
                                problemTitle: problem.title,
                                difficulty: problem.difficulty,
                                timeSpent: studyTime
                              })
                              updatePerformanceData('practiceAttempts', 1)
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                          >
                            <Target className="w-4 h-4" />
                            <span>Practice on GFG</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {studyMode === 'quiz' && (
                  <motion.div
                    key="quiz"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Quiz</h2>
                      <button
                        onClick={() => markSectionComplete('quiz')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Complete
                      </button>
                    </div>

                    <div className="space-y-6">
                      {topicContent.quiz?.map((question, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Question {index + 1}: {question.question}
                          </h3>

                          <div className="space-y-2 mb-4">
                            {question.options.map((option, optionIndex) => (
                              <label key={optionIndex} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                <input
                                  type="radio"
                                  name={`question-${index}`}
                                  value={optionIndex}
                                  className="text-blue-600"
                                  onChange={() => {
                                    trackSessionInteraction('quiz_answer', {
                                      topicName,
                                      questionIndex: index,
                                      selectedOption: optionIndex,
                                      isCorrect: optionIndex === question.correct,
                                      timeSpent: studyTime
                                    })
                                  }}
                                />
                                <span className="text-gray-900 dark:text-white">{option}</span>
                              </label>
                            ))}
                          </div>

                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-blue-800 dark:text-blue-200 text-sm">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-Responsive Notes Panel */}
      <AnimatePresence>
        {showNotes && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed right-0 top-0 h-full w-full sm:w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 z-50 shadow-xl"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notes</h3>
                <button
                  onClick={() => setShowNotes(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 -m-2"
                >
                  <EyeOff className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col h-full">
              <textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="Take notes while studying..."
                className="flex-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                style={{ minHeight: 'calc(100vh - 200px)' }}
              />

              <button
                onClick={saveNotes}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors touch-manipulation"
              >
                <FileText className="w-4 h-4" />
                Save Notes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile-Responsive Floating Notes Button */}
      {!showNotes && (
        <button
          onClick={() => setShowNotes(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-40 touch-manipulation"
        >
          <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}
    </div>
  )
}

export default TopicStudyInterface
