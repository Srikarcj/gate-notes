import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Cpu,
  Zap,
  Target,
  BookOpen,
  Play,
  Code,
  Eye,
  Atom,
  Building,
  Microscope,
  Calculator,
  Globe,
  Trophy,
  Star,
  ChevronRight,
  Clock,
  TrendingUp,
  Award,
  Lightbulb,
  X,
  Info,
  FileText,
  CheckCircle,
  Monitor,
  PenTool,
  Save,
  RotateCcw,
  ChevronLeft,
  ChevronDown,
  Copy,
  Download,
  Share2,
  Bookmark,
  BookmarkCheck,
  Timer,
  BarChart3,
  Settings,
  Flame,
  User
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useAdvancedStudyStore } from '../../store/advancedStudyStore'
import { useUserProfileStore } from '../../store/userProfileStore'
import { gfgTopicsDatabase } from '../../data/gfgTopicsDatabase'
import InteractiveCodeEditor from './InteractiveCodeEditor'
import InteractiveQuiz from './InteractiveQuiz'
import StudyAnalytics from './StudyAnalytics'
import AchievementSystem from './AchievementSystem'
import UserProfile from '../profile/UserProfile'

const AdvancedLearningSystem = ({ selectedBranch, selectedSubject }) => {
  const [activeMode, setActiveMode] = useState('overview')
  const [currentTopic, setCurrentTopic] = useState(null)
  const [learningProgress, setLearningProgress] = useState({})
  const [aiInsights, setAiInsights] = useState([])
  const [showTopicPopup, setShowTopicPopup] = useState(false)
  const [selectedTopicOverview, setSelectedTopicOverview] = useState(null)
  const [studyMode, setStudyMode] = useState('overview') // overview, study, practice, notes, quiz
  const [userNotes, setUserNotes] = useState('')
  const [completedSections, setCompletedSections] = useState(new Set())
  const [currentProblem, setCurrentProblem] = useState(null)
  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [studyTimer, setStudyTimer] = useState(0)
  const [isStudying, setIsStudying] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  // Advanced study store
  const {
    startStudySession,
    endStudySession,
    markTopicCompleted,
    updateTopicProgress,
    saveUserNotes,
    toggleBookmark,
    getTopicProgress,
    getTopicNotes,
    isTopicBookmarked,
    getStudyStats,
    currentStreak,
    preferences,
    updatePreferences
  } = useAdvancedStudyStore()

  // User profile store
  const {
    profile,
    performance,
    addStudySession,
    addQuizResult,
    updateTopicProgress: updateProfileTopicProgress,
    addTopicTime,
    markTopicCompleted: markProfileTopicCompleted,
    addProblemAttempt,
    addBookmark,
    removeBookmark,
    getTopicStats,
    unlockAchievement
  } = useUserProfileStore()

  // Advanced learning modes with AI-powered features
  const learningModes = [
    {
      id: 'overview',
      name: 'Smart Overview',
      icon: BookOpen,
      description: 'AI-curated comprehensive explanations',
      color: 'blue'
    },
    {
      id: 'interactive',
      name: 'Interactive Learning',
      icon: Play,
      description: 'Step-by-step guided tutorials',
      color: 'green'
    },
    {
      id: 'visual',
      name: 'Visual Simulations',
      icon: Eye,
      description: 'Advanced 3D visualizations',
      color: 'purple'
    },
    {
      id: 'code',
      name: 'Code Laboratory',
      icon: Code,
      description: 'Interactive coding environment',
      color: 'orange'
    },
    {
      id: 'ai-tutor',
      name: 'AI Tutor',
      icon: Brain,
      description: 'Personalized AI assistance',
      color: 'pink'
    },
    {
      id: 'practice',
      name: 'Smart Practice',
      icon: Target,
      description: 'Adaptive problem solving',
      color: 'indigo'
    }
  ]

  // Comprehensive subject mapping for all branches
  const branchSubjects = {
    'cse': {
      name: 'Computer Science & Engineering',
      icon: Cpu,
      color: 'blue',
      subjects: [
        {
          id: 'dsa',
          name: 'Data Structures & Algorithms',
          icon: Brain,
          difficulty: 'Advanced',
          topics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting', 'Searching'],
          aiFeatures: ['Algorithm Visualization', 'Complexity Analysis', 'Code Generation', 'Performance Optimization']
        },
        {
          id: 'networks',
          name: 'Computer Networks',
          icon: Globe,
          difficulty: 'Intermediate',
          topics: ['OSI Model', 'TCP/IP', 'Routing', 'Network Security', 'Wireless Networks'],
          aiFeatures: ['Network Simulation', 'Protocol Analysis', 'Security Assessment']
        },
        {
          id: 'os',
          name: 'Operating Systems',
          icon: Cpu,
          difficulty: 'Advanced',
          topics: ['Process Management', 'Memory Management', 'File Systems', 'Synchronization'],
          aiFeatures: ['Process Simulation', 'Memory Visualization', 'Deadlock Detection']
        },
        {
          id: 'dbms',
          name: 'Database Management',
          icon: Building,
          difficulty: 'Intermediate',
          topics: ['SQL', 'Normalization', 'Indexing', 'Transactions', 'NoSQL'],
          aiFeatures: ['Query Optimization', 'Schema Design', 'Performance Tuning']
        }
      ]
    },
    'ece': {
      name: 'Electronics & Communication',
      icon: Zap,
      color: 'yellow',
      subjects: [
        {
          id: 'digital',
          name: 'Digital Electronics',
          icon: Cpu,
          difficulty: 'Intermediate',
          topics: ['Logic Gates', 'Boolean Algebra', 'Combinational Circuits', 'Sequential Circuits'],
          aiFeatures: ['Circuit Simulation', 'Logic Optimization', 'Timing Analysis']
        },
        {
          id: 'analog',
          name: 'Analog Circuits',
          icon: Zap,
          difficulty: 'Advanced',
          topics: ['Amplifiers', 'Oscillators', 'Filters', 'Power Supplies'],
          aiFeatures: ['Circuit Analysis', 'Frequency Response', 'Noise Analysis']
        },
        {
          id: 'signals',
          name: 'Signal Processing',
          icon: TrendingUp,
          difficulty: 'Advanced',
          topics: ['Fourier Transform', 'Z-Transform', 'Digital Filters', 'Image Processing'],
          aiFeatures: ['Signal Visualization', 'Filter Design', 'Spectral Analysis']
        }
      ]
    },
    'me': {
      name: 'Mechanical Engineering',
      icon: Building,
      color: 'gray',
      subjects: [
        {
          id: 'thermo',
          name: 'Thermodynamics',
          icon: Atom,
          difficulty: 'Intermediate',
          topics: ['Laws of Thermodynamics', 'Heat Engines', 'Refrigeration', 'Gas Cycles'],
          aiFeatures: ['Cycle Analysis', 'Efficiency Calculation', 'Property Visualization']
        },
        {
          id: 'fluid',
          name: 'Fluid Mechanics',
          icon: Globe,
          difficulty: 'Advanced',
          topics: ['Fluid Statics', 'Fluid Dynamics', 'Bernoulli Equation', 'Turbulence'],
          aiFeatures: ['Flow Visualization', 'CFD Simulation', 'Pressure Analysis']
        }
      ]
    },
    'ee': {
      name: 'Electrical Engineering',
      icon: Zap,
      color: 'yellow',
      subjects: [
        {
          id: 'power',
          name: 'Power Systems',
          icon: Zap,
          difficulty: 'Advanced',
          topics: ['Power Generation', 'Transmission', 'Distribution', 'Protection'],
          aiFeatures: ['Load Flow Analysis', 'Fault Analysis', 'Stability Studies']
        },
        {
          id: 'machines',
          name: 'Electrical Machines',
          icon: Building,
          difficulty: 'Intermediate',
          topics: ['DC Machines', 'Induction Motors', 'Synchronous Machines', 'Transformers'],
          aiFeatures: ['Machine Modeling', 'Performance Analysis', 'Control Systems']
        }
      ]
    },
    'ce': {
      name: 'Civil Engineering',
      icon: Building,
      color: 'stone',
      subjects: [
        {
          id: 'structural',
          name: 'Structural Engineering',
          icon: Building,
          difficulty: 'Advanced',
          topics: ['Beam Analysis', 'Frame Analysis', 'Design of Structures', 'Earthquake Engineering'],
          aiFeatures: ['Structural Analysis', 'Load Calculation', 'Design Optimization']
        },
        {
          id: 'geotechnical',
          name: 'Geotechnical Engineering',
          icon: Microscope,
          difficulty: 'Intermediate',
          topics: ['Soil Mechanics', 'Foundation Design', 'Slope Stability', 'Earth Pressure'],
          aiFeatures: ['Soil Analysis', 'Foundation Design', 'Stability Assessment']
        }
      ]
    },
    'ch': {
      name: 'Chemical Engineering',
      icon: Atom,
      color: 'green',
      subjects: [
        {
          id: 'reaction',
          name: 'Chemical Reaction Engineering',
          icon: Atom,
          difficulty: 'Advanced',
          topics: ['Reaction Kinetics', 'Reactor Design', 'Catalysis', 'Mass Transfer'],
          aiFeatures: ['Reaction Simulation', 'Kinetic Analysis', 'Reactor Optimization']
        },
        {
          id: 'process',
          name: 'Process Control',
          icon: Target,
          difficulty: 'Intermediate',
          topics: ['Control Systems', 'PID Controllers', 'Process Dynamics', 'Instrumentation'],
          aiFeatures: ['Control Simulation', 'Tuning Optimization', 'System Analysis']
        }
      ]
    }
  }

  // AI-powered learning insights
  useEffect(() => {
    const generateAIInsights = () => {
      const insights = [
        {
          type: 'recommendation',
          title: 'Personalized Learning Path',
          description: 'Based on your progress, focus on advanced algorithms next',
          icon: Brain,
          priority: 'high'
        },
        {
          type: 'achievement',
          title: 'Milestone Reached',
          description: 'You\'ve mastered 80% of Data Structures concepts!',
          icon: Trophy,
          priority: 'medium'
        },
        {
          type: 'insight',
          title: 'Learning Pattern',
          description: 'You learn best with visual explanations in the morning',
          icon: Lightbulb,
          priority: 'low'
        }
      ]
      setAiInsights(insights)
    }

    generateAIInsights()
  }, [selectedBranch, selectedSubject])

  // Note: Topic data now comes from gfgTopicsDatabase
  // Old topicOverviews object removed - using GFG database instead

  // Study session management
  useEffect(() => {
    let timer
    if (isStudying && showTopicPopup) {
      timer = setInterval(() => {
        setStudyTimer(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isStudying, showTopicPopup])

  const handleTopicClick = (topicName) => {
    const currentSubject = getCurrentSubject()
    const topicData = getTopicData(topicName)

    if (topicData) {
      // Create comprehensive topic overview from GFG database
      setSelectedTopicOverview({
        topic: topicName,
        subject: currentSubject.name,
        overview: topicData.description,
        difficulty: topicData.difficulty,
        importance: topicData.importance,
        gateWeight: topicData.gateWeight,
        prerequisites: topicData.prerequisites || [],
        subtopics: topicData.subtopics || [],
        keyPoints: topicData.theory?.keyPoints || [],
        applications: topicData.theory?.applications || [],
        gateTopics: topicData.subtopics || [],
        studyContent: {
          theory: topicData.theory || null,
          practiceProblems: topicData.practiceProblems || [],
          quiz: { questions: topicData.quiz || [] }
        }
      })

      // Initialize study session
      setStudyMode('overview')
      setUserNotes(getTopicNotes(topicName))
      setStudyTimer(0)
      setIsStudying(true)
      setShowCodeEditor(false)
      setCurrentProblem(null)

      // Start study session tracking in both stores
      startStudySession(topicName)

      setShowTopicPopup(true)
    } else {
      // Fallback for topics without detailed data
      setSelectedTopicOverview({
        topic: topicName,
        subject: currentSubject.name,
        overview: `${topicName} is an important topic in ${currentSubject.name}. This topic covers fundamental concepts and practical applications that are essential for GATE preparation and professional development.`,
        difficulty: 'Medium',
        importance: 'High',
        gateWeight: '6-8 marks',
        prerequisites: [],
        subtopics: [],
        keyPoints: [
          'Core concepts and theoretical foundations',
          'Practical applications and implementations',
          'Problem-solving techniques and methodologies',
          'Industry relevance and real-world usage'
        ],
        applications: [
          'Academic research and study',
          'Professional software development',
          'System design and architecture',
          'Technical interviews and assessments'
        ],
        gateTopics: [
          'Fundamental concepts and definitions',
          'Problem-solving approaches',
          'Comparative analysis with related topics',
          'Practical applications and examples'
        ],
        studyContent: null
      })

      setStudyMode('overview')
      setUserNotes(getTopicNotes(topicName))
      setStudyTimer(0)
      setIsStudying(true)

      startStudySession(topicName)
      setShowTopicPopup(true)
    }
  }

  const handleCloseStudy = () => {
    const sessionDuration = studyTimer * 1000 // Convert to milliseconds

    // Save study session to user profile
    if (selectedTopicOverview && sessionDuration > 0) {
      addStudySession({
        topic: selectedTopicOverview.topic,
        subject: selectedTopicOverview.subject,
        duration: sessionDuration,
        mode: studyMode,
        sectionsCompleted: Array.from(completedSections)
      })

      // Add time to topic
      addTopicTime(selectedTopicOverview.topic, sessionDuration)

      // Update topic progress in profile
      const currentProgress = getTopicStats(selectedTopicOverview.topic).progress
      const newProgress = Math.min(currentProgress + 10, 100) // Increment by 10%
      updateProfileTopicProgress(selectedTopicOverview.topic, newProgress)
    }

    setIsStudying(false)
    setShowTopicPopup(false)
    endStudySession()

    // Save notes if any
    if (userNotes.trim()) {
      saveUserNotes(selectedTopicOverview.topic, userNotes)
    }
  }

  const formatStudyTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getCurrentBranch = () => {
    return {
      name: selectedBranch || 'Computer Science & Engineering',
      subjects: Object.keys(gfgTopicsDatabase[selectedBranch] || gfgTopicsDatabase['Computer Science & Engineering'] || {})
    }
  }

  const getCurrentSubject = () => {
    if (!selectedBranch || !selectedSubject) return { topics: [] }

    const branchData = gfgTopicsDatabase[selectedBranch]
    if (!branchData) return { topics: [] }

    const subjectData = branchData[selectedSubject]
    if (!subjectData) return { topics: [] }

    return {
      name: selectedSubject,
      icon: subjectData.icon,
      description: subjectData.description,
      difficulty: subjectData.difficulty,
      estimatedTime: subjectData.estimatedTime,
      topics: Object.keys(subjectData.topics || {}),
      topicsData: subjectData.topics || {}
    }
  }

  // Get topic data from GFG database
  const getTopicData = (topicName) => {
    const currentSubject = getCurrentSubject()
    return currentSubject.topicsData[topicName] || null
  }

  return (
    <div className="space-y-8">
      {/* Advanced Learning Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full text-white font-semibold mb-4"
        >
          <Brain className="w-5 h-5" />
          Advanced AI-Powered Learning System
          <Zap className="w-5 h-5" />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {getCurrentBranch().name}
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          {getCurrentSubject().name} - {getCurrentSubject().difficulty} Level
        </p>
      </div>

      {/* Learning Mode Selector */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        {learningModes.map((mode) => (
          <motion.button
            key={mode.id}
            onClick={() => setActiveMode(mode.id)}
            className={cn(
              "p-4 rounded-xl border-2 text-center transition-all duration-300",
              activeMode === mode.id
                ? `border-${mode.color}-500 bg-${mode.color}-50 dark:bg-${mode.color}-900/20`
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <mode.icon className={cn(
              "w-8 h-8 mx-auto mb-2",
              activeMode === mode.id ? `text-${mode.color}-600` : "text-gray-600 dark:text-gray-400"
            )} />
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
              {mode.name}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {mode.description}
            </p>
          </motion.button>
        ))}
      </div>

      {/* AI Insights Panel */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          AI Learning Insights
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          {aiInsights.map((insight, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  insight.priority === 'high' && "bg-red-100 text-red-600 dark:bg-red-900/20",
                  insight.priority === 'medium' && "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20",
                  insight.priority === 'low' && "bg-green-100 text-green-600 dark:bg-green-900/20"
                )}>
                  <insight.icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {insight.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Subject Topics with AI Features */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          {getCurrentSubject().name} - Advanced Topics
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {(getCurrentSubject().topics || []).map((topic, index) => (
            <motion.div
              key={topic}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-primary-300 dark:hover:border-primary-600"
              onClick={() => handleTopicClick(topic)}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {topic}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Clock className="w-3 h-3" />
                    <span>AI-Enhanced Learning</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-purple-600 h-2 rounded-full"
                    style={{ width: `${Math.random() * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {Math.floor(Math.random() * 100)}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Features for Current Subject */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            AI-Powered Features
          </h4>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {(getCurrentSubject().aiFeatures || []).map((feature, index) => (
              <div
                key={feature}
                className="px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-center"
              >
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LeetCode-Style Study Interface */}
      <AnimatePresence>
        {showTopicPopup && selectedTopicOverview && (
          <motion.div
            className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* LeetCode-style Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleCloseStudy}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Back</span>
                </button>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedTopicOverview.topic}
                    </h1>
                    {isTopicBookmarked(selectedTopicOverview.topic) && (
                      <BookmarkCheck className="w-5 h-5 text-yellow-500" />
                    )}
                    <div className="flex items-center gap-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-xs font-medium">
                      <Flame className="w-3 h-3" />
                      <span>{currentStreak} day streak</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{selectedTopicOverview.subject}</span>
                    <div className="flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      <span>{formatStudyTime(studyTimer)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      <span>{getTopicProgress(selectedTopicOverview.topic)}% complete</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Study Mode Tabs */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {[
                  { id: 'overview', label: 'Overview', icon: Info },
                  { id: 'study', label: 'Study', icon: BookOpen },
                  { id: 'practice', label: 'Practice', icon: Code },
                  { id: 'quiz', label: 'Quiz', icon: Target },
                  { id: 'notes', label: 'Notes', icon: PenTool },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setStudyMode(mode.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      studyMode === mode.id
                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <mode.icon className="w-4 h-4" />
                    {mode.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowProfile(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Profile</span>
                </button>
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel - Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  {studyMode === 'overview' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      {/* GFG-Style Topic Information */}
                      <div className="space-y-6">
                        {/* Topic Header with Metadata */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {selectedTopicOverview.topic}
                              </h4>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {selectedTopicOverview.overview}
                              </p>
                            </div>
                          </div>

                          {/* Topic Metadata */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                              <div className={`text-sm font-medium ${
                                selectedTopicOverview.difficulty === 'Easy' ? 'text-green-600' :
                                selectedTopicOverview.difficulty === 'Medium' ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {selectedTopicOverview.difficulty}
                              </div>
                              <div className="text-xs text-gray-500">Difficulty</div>
                            </div>
                            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                              <div className="text-sm font-medium text-purple-600">
                                {selectedTopicOverview.importance}
                              </div>
                              <div className="text-xs text-gray-500">Importance</div>
                            </div>
                            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                              <div className="text-sm font-medium text-orange-600">
                                {selectedTopicOverview.gateWeight}
                              </div>
                              <div className="text-xs text-gray-500">GATE Weight</div>
                            </div>
                            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                              <div className="text-sm font-medium text-blue-600">
                                {getTopicStats(selectedTopicOverview.topic).progress}%
                              </div>
                              <div className="text-xs text-gray-500">Progress</div>
                            </div>
                          </div>
                        </div>

                        {/* Prerequisites */}
                        {selectedTopicOverview.prerequisites && selectedTopicOverview.prerequisites.length > 0 && (
                          <div className="space-y-3">
                            <h5 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                              <Target className="w-4 h-4 text-red-500" />
                              Prerequisites
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {(selectedTopicOverview.prerequisites || []).map((prereq, index) => (
                                <span key={index} className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded-full text-sm">
                                  {prereq}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Subtopics */}
                        {selectedTopicOverview.subtopics && selectedTopicOverview.subtopics.length > 0 && (
                          <div className="space-y-3">
                            <h5 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-indigo-500" />
                              What You'll Learn
                            </h5>
                            <div className="grid gap-2">
                              {(selectedTopicOverview.subtopics || []).map((subtopic, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg">
                                  <CheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                  <span className="text-gray-800 dark:text-gray-200 text-sm">{subtopic}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Key Points Section */}
                      {selectedTopicOverview.keyPoints && selectedTopicOverview.keyPoints.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                            Key Points
                          </h4>
                          <div className="grid gap-3">
                            {(selectedTopicOverview.keyPoints || []).map((point, index) => (
                              <motion.div
                                key={index}
                                className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                                <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                                  {point}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Applications Section */}
                      {selectedTopicOverview.applications && selectedTopicOverview.applications.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            Real-world Applications
                          </h4>
                          <div className="grid md:grid-cols-2 gap-3">
                            {(selectedTopicOverview.applications || []).map((application, index) => (
                              <motion.div
                                key={index}
                                className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                                  {application}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* GATE Topics Section */}
                      {selectedTopicOverview.gateTopics && selectedTopicOverview.gateTopics.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            GATE Exam Focus Areas
                          </h4>
                          <div className="grid gap-3">
                            {(selectedTopicOverview.gateTopics || []).map((topic, index) => (
                              <motion.div
                                key={index}
                                className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                                <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed font-medium">
                                  {topic}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {studyMode === 'study' && selectedTopicOverview.studyContent && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      {/* Theory Sections */}
                      {(selectedTopicOverview.studyContent.theory?.sections || []).map((section, index) => (
                        <div key={index} className="space-y-4">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            {section.title}
                          </h3>
                          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="prose prose-gray dark:prose-invert max-w-none">
                              <div className="whitespace-pre-line text-gray-800 dark:text-gray-200 leading-relaxed">
                                {section.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Examples Section */}
                      {selectedTopicOverview.studyContent.examples && (
                        <div className="space-y-4">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Code className="w-6 h-6 text-green-600 dark:text-green-400" />
                            Code Examples
                          </h3>
                          <div className="space-y-6">
                            {(selectedTopicOverview.studyContent.examples || []).map((example, index) => (
                              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                                  <h4 className="font-semibold text-gray-900 dark:text-white">{example.title}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{example.problem}</p>
                                </div>
                                <div className="p-4">
                                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                    <pre className="text-green-400 text-sm">
                                      <code>{example.solution}</code>
                                    </pre>
                                  </div>
                                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                      <strong>Explanation:</strong> {example.explanation}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {studyMode === 'practice' && selectedTopicOverview.studyContent && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {!showCodeEditor ? (
                        <>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            Practice Problems
                          </h3>
                          <div className="grid gap-6">
                            {selectedTopicOverview.studyContent.practiceProblemsDetailed?.map((problem, index) => (
                              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{problem.title}</h4>
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                        problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                        'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                      }`}>
                                        {problem.difficulty}
                                      </span>
                                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-xs font-medium">
                                        GATE Relevance: {problem.gateRelevance}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <p className="text-gray-700 dark:text-gray-300 mb-4">{problem.description}</p>

                                {/* Examples */}
                                {problem.examples && (
                                  <div className="mb-4">
                                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Examples:</h5>
                                    {(problem.examples || []).map((example, exIndex) => (
                                      <div key={exIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-2">
                                        <div className="text-sm space-y-1">
                                          <div><strong>Input:</strong> {example.input}</div>
                                          <div><strong>Output:</strong> {example.output}</div>
                                          {example.explanation && <div><strong>Explanation:</strong> {example.explanation}</div>}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Constraints */}
                                {problem.constraints && (
                                  <div className="mb-4">
                                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Constraints:</h5>
                                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                      {(problem.constraints || []).map((constraint, cIndex) => (
                                        <li key={cIndex}>• {constraint}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Hints */}
                                {problem.hints && (
                                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-4">
                                    <h5 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">Hints:</h5>
                                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                                      {(problem.hints || []).map((hint, hIndex) => (
                                        <li key={hIndex}>• {hint}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      setCurrentProblem(problem)
                                      setShowCodeEditor(true)
                                    }}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                                  >
                                    Solve Problem
                                  </button>
                                  <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
                                    View Solution
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="h-[600px]">
                          <div className="flex items-center justify-between mb-4">
                            <button
                              onClick={() => setShowCodeEditor(false)}
                              className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              Back to Problems
                            </button>
                          </div>
                          <InteractiveCodeEditor
                            problem={currentProblem}
                            initialCode={currentProblem?.starterCode || ''}
                            testCases={currentProblem?.testCases || []}
                            onSolutionSubmit={(success, code, timeSpent) => {
                              console.log('Solution submitted:', { success, code, timeSpent })
                              if (success) {
                                // Update progress
                                updateTopicProgress(selectedTopicOverview.topic, getTopicProgress(selectedTopicOverview.topic) + 10)
                              }
                            }}
                          />
                        </div>
                      )}
                    </motion.div>
                  )}

                  {studyMode === 'quiz' && selectedTopicOverview.studyContent?.quiz && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <InteractiveQuiz
                        topic={selectedTopicOverview.topic}
                        questions={selectedTopicOverview.studyContent.quiz.questions}
                        onComplete={(results) => {
                          console.log('Quiz completed:', results)
                          // Update progress and analytics
                          if (results.score >= 70) {
                            markTopicCompleted(selectedTopicOverview.topic)
                          }
                        }}
                      />
                    </motion.div>
                  )}

                  {studyMode === 'notes' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <PenTool className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                          Personal Notes
                        </h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleBookmark(selectedTopicOverview.topic)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                              isTopicBookmarked(selectedTopicOverview.topic)
                                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            {isTopicBookmarked(selectedTopicOverview.topic) ? (
                              <BookmarkCheck className="w-4 h-4" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                            {isTopicBookmarked(selectedTopicOverview.topic) ? 'Bookmarked' : 'Bookmark'}
                          </button>
                          <button
                            onClick={() => {
                              saveUserNotes(selectedTopicOverview.topic, userNotes)
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                          >
                            <Save className="w-4 h-4" />
                            Save Notes
                          </button>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <textarea
                          value={userNotes}
                          onChange={(e) => setUserNotes(e.target.value)}
                          placeholder={`Write your notes about ${selectedTopicOverview.topic}...`}
                          className="w-full h-96 p-6 bg-transparent border-none resize-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Your notes are automatically saved locally and synced across devices.
                      </div>
                    </motion.div>
                  )}

                  {studyMode === 'analytics' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <StudyAnalytics topic={selectedTopicOverview.topic} />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Right Panel - Progress & Quick Actions */}
              <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 space-y-6">
                {/* Study Stats */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Study Stats
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {getTopicProgress(selectedTopicOverview.topic)}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Progress</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-lg font-bold text-orange-600 dark:text-orange-400 flex items-center justify-center gap-1">
                        <Flame className="w-4 h-4" />
                        {currentStreak}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Streak</div>
                    </div>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Study Progress</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Overview', completed: studyMode !== 'overview', mode: 'overview' },
                      { label: 'Theory', completed: studyMode === 'study' || completedSections.has('study'), mode: 'study' },
                      { label: 'Practice', completed: completedSections.has('practice'), mode: 'practice' },
                      { label: 'Quiz', completed: completedSections.has('quiz'), mode: 'quiz' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <button
                          onClick={() => setStudyMode(item.mode)}
                          className={`w-4 h-4 rounded-full transition-colors ${
                            item.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                          }`}
                        />
                        <span className={`text-sm ${
                          item.completed ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {item.label}
                        </span>
                        {studyMode === item.mode && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements Preview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      Achievements
                    </h4>
                    <button
                      onClick={() => setShowAchievements(true)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-green-700 dark:text-green-400">Getting Started</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs text-yellow-700 dark:text-yellow-400">Speed Learner (60%)</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Quick Actions</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => toggleBookmark(selectedTopicOverview.topic)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                        isTopicBookmarked(selectedTopicOverview.topic)
                          ? 'text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {isTopicBookmarked(selectedTopicOverview.topic) ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                      {isTopicBookmarked(selectedTopicOverview.topic) ? 'Bookmarked' : 'Bookmark Topic'}
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Copy className="w-4 h-4" />
                      Copy Topic Link
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                    <button
                      onClick={() => {
                        updateTopicProgress(selectedTopicOverview.topic, 0)
                        setCompletedSections(new Set())
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset Progress
                    </button>
                  </div>
                </div>

                {/* Related Topics */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Related Topics</h4>
                  <div className="space-y-2">
                    {(getCurrentSubject().topics || []).filter(t => t !== selectedTopicOverview.topic).slice(0, 4).map((topic, index) => (
                      <button
                        key={index}
                        onClick={() => handleTopicClick(topic)}
                        className="w-full text-left px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievements Modal */}
      <AnimatePresence>
        {showAchievements && (
          <AchievementSystem onClose={() => setShowAchievements(false)} />
        )}
      </AnimatePresence>

      {/* User Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <UserProfile onClose={() => setShowProfile(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdvancedLearningSystem
