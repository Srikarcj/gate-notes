import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserProfileStore = create(
  persist(
    (set, get) => ({
      // User Profile Information
      profile: {
        name: '',
        email: '',
        avatar: '',
        joinDate: new Date().toISOString(),
        targetExam: 'GATE',
        branch: '',
        graduationYear: '',
        college: '',
        bio: ''
      },

      // Performance Metrics
      performance: {
        totalStudyTime: 0,
        totalTopicsCompleted: 0,
        totalProblemsAttempted: 0,
        totalProblemsSolved: 0,
        totalQuizzesTaken: 0,
        averageQuizScore: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: null,
        weeklyGoal: 10, // hours
        dailyGoal: 2, // hours
        monthlyGoal: 40, // hours

        // CodeChef-style Advanced Metrics
        overallRating: 1200, // Starting rating similar to CodeChef
        peakRating: 1200,
        ratingHistory: [],
        topicMasteryScores: {}, // topic -> mastery score (0-100)
        subjectRatings: {}, // subject -> rating
        branchRatings: {}, // branch -> rating
        gateReadinessScore: 0, // Overall GATE preparation score (0-100)
        consistencyScore: 0, // How consistent the user is (0-100)
        speedScore: 0, // How fast user completes topics (0-100)
        accuracyScore: 0, // Overall accuracy in quizzes/problems (0-100)
        difficultyProgression: {}, // track progression through difficulty levels
        weeklyPerformance: [], // weekly performance data
        monthlyPerformance: [], // monthly performance data
        competitiveRank: null, // rank among all users
        percentile: 0 // percentile among all users
      },

      // Subject-wise Performance
      subjectPerformance: {},
      
      // Topic-wise Progress
      topicProgress: {},
      
      // Study Sessions History with Enhanced Tracking
      studySessions: [],

      // Real-time Session Data
      currentSession: null,
      sessionInteractions: [], // Track user interactions during session
      sessionMetrics: {
        totalSessions: 0,
        averageSessionTime: 0,
        totalInteractions: 0,
        averageInteractionsPerSession: 0,
        sessionCompletionRate: 0,
        averageNotesPerSession: 0,
        topicSwitchRate: 0,
        focusScore: 0 // Based on time spent vs interactions
      },
      
      // Quiz Results History
      quizHistory: [],
      
      // Problem Solving History
      problemHistory: {},
      
      // Achievements and Badges
      achievements: [],
      badges: [],
      
      // Bookmarks and Favorites
      bookmarkedTopics: [],
      favoriteSubjects: [],

      // User Notes Storage
      userNotes: {}, // topicName -> notes content
      
      // Study Preferences
      preferences: {
        theme: 'light',
        language: 'javascript',
        difficulty: 'medium',
        studyReminders: true,
        emailNotifications: true,
        soundEffects: true,
        autoSave: true,
        fontSize: 16,
        codeTheme: 'dark'
      },

      // Learning Path and Goals
      learningPath: {
        currentSubject: '',
        currentTopic: '',
        completedSubjects: [],
        targetCompletionDate: null,
        customGoals: []
      },

      // Statistics for Analytics
      analytics: {
        dailyStats: {},
        weeklyStats: {},
        monthlyStats: {},
        subjectWiseTime: {},
        topicWiseTime: {},
        performanceTrends: []
      },

      // Actions
      updateProfile: (profileData) => {
        set(state => ({
          profile: { ...state.profile, ...profileData }
        }))
      },

      updatePerformance: (performanceData) => {
        set(state => ({
          performance: { ...state.performance, ...performanceData }
        }))
      },

      addStudySession: (session) => {
        set(state => {
          const newSession = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...session
          }
          
          // Update performance metrics
          const updatedPerformance = {
            ...state.performance,
            totalStudyTime: state.performance.totalStudyTime + session.duration,
            lastStudyDate: new Date().toDateString()
          }

          // Update streak
          const today = new Date().toDateString()
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          
          if (state.performance.lastStudyDate === yesterday.toDateString()) {
            updatedPerformance.currentStreak = state.performance.currentStreak + 1
          } else if (state.performance.lastStudyDate !== today) {
            updatedPerformance.currentStreak = 1
          }
          
          updatedPerformance.longestStreak = Math.max(
            updatedPerformance.longestStreak, 
            updatedPerformance.currentStreak
          )

          return {
            studySessions: [newSession, ...state.studySessions].slice(0, 100), // Keep last 100 sessions
            performance: updatedPerformance
          }
        })
      },

      addQuizResult: (quizResult) => {
        set(state => {
          const newQuizResult = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...quizResult
          }

          // Update performance metrics
          const totalQuizzes = state.performance.totalQuizzesTaken + 1
          const newAverageScore = (
            (state.performance.averageQuizScore * state.performance.totalQuizzesTaken + quizResult.score) / 
            totalQuizzes
          )

          return {
            quizHistory: [newQuizResult, ...state.quizHistory].slice(0, 50), // Keep last 50 quiz results
            performance: {
              ...state.performance,
              totalQuizzesTaken: totalQuizzes,
              averageQuizScore: Math.round(newAverageScore * 100) / 100
            }
          }
        })
      },

      updateTopicProgress: (topic, progress) => {
        set(state => ({
          topicProgress: {
            ...state.topicProgress,
            [topic]: {
              progress,
              lastUpdated: new Date().toISOString(),
              timeSpent: (state.topicProgress[topic]?.timeSpent || 0)
            }
          }
        }))
      },

      addTopicTime: (topic, timeSpent) => {
        set(state => ({
          topicProgress: {
            ...state.topicProgress,
            [topic]: {
              ...state.topicProgress[topic],
              timeSpent: (state.topicProgress[topic]?.timeSpent || 0) + timeSpent,
              lastStudied: new Date().toISOString()
            }
          }
        }))
      },

      markTopicCompleted: (topic) => {
        set(state => {
          const updatedProgress = {
            ...state.topicProgress,
            [topic]: {
              ...state.topicProgress[topic],
              progress: 100,
              completed: true,
              completedDate: new Date().toISOString()
            }
          }

          return {
            topicProgress: updatedProgress,
            performance: {
              ...state.performance,
              totalTopicsCompleted: state.performance.totalTopicsCompleted + 1
            }
          }
        })
      },

      addProblemAttempt: (problemId, attempt) => {
        set(state => {
          const problemHistory = {
            ...state.problemHistory,
            [problemId]: [
              ...(state.problemHistory[problemId] || []),
              {
                ...attempt,
                timestamp: new Date().toISOString()
              }
            ]
          }

          const updatedPerformance = {
            ...state.performance,
            totalProblemsAttempted: state.performance.totalProblemsAttempted + 1
          }

          if (attempt.solved) {
            updatedPerformance.totalProblemsSolved = state.performance.totalProblemsSolved + 1
          }

          return {
            problemHistory,
            performance: updatedPerformance
          }
        })
      },

      addBookmark: (topic) => {
        set(state => ({
          bookmarkedTopics: [...new Set([...state.bookmarkedTopics, topic])]
        }))
      },

      removeBookmark: (topic) => {
        set(state => ({
          bookmarkedTopics: state.bookmarkedTopics.filter(t => t !== topic)
        }))
      },

      updatePreferences: (newPreferences) => {
        set(state => ({
          preferences: { ...state.preferences, ...newPreferences }
        }))
      },

      unlockAchievement: (achievement) => {
        set(state => {
          if (!state.achievements.find(a => a.id === achievement.id)) {
            return {
              achievements: [...state.achievements, {
                ...achievement,
                unlockedDate: new Date().toISOString()
              }]
            }
          }
          return state
        })
      },

      updateAnalytics: () => {
        set(state => {
          const today = new Date().toDateString()
          const thisWeek = getWeekKey(new Date())
          const thisMonth = getMonthKey(new Date())

          // Update daily stats
          const dailyStats = {
            ...state.analytics.dailyStats,
            [today]: {
              studyTime: (state.analytics.dailyStats[today]?.studyTime || 0),
              topicsStudied: (state.analytics.dailyStats[today]?.topicsStudied || 0),
              problemsSolved: (state.analytics.dailyStats[today]?.problemsSolved || 0),
              quizzesTaken: (state.analytics.dailyStats[today]?.quizzesTaken || 0)
            }
          }

          return {
            analytics: {
              ...state.analytics,
              dailyStats,
              lastUpdated: new Date().toISOString()
            }
          }
        })
      },

      getStudyStats: () => {
        const state = get()
        return {
          totalStudyTime: state.performance.totalStudyTime,
          totalTopicsCompleted: state.performance.totalTopicsCompleted,
          totalProblemsSolved: state.performance.totalProblemsSolved,
          averageQuizScore: state.performance.averageQuizScore,
          currentStreak: state.performance.currentStreak,
          longestStreak: state.performance.longestStreak,
          completionRate: state.performance.totalProblemsAttempted > 0 
            ? Math.round((state.performance.totalProblemsSolved / state.performance.totalProblemsAttempted) * 100)
            : 0
        }
      },

      getTopicStats: (topic) => {
        const state = get()
        return state.topicProgress[topic] || {
          progress: 0,
          timeSpent: 0,
          completed: false
        }
      },

      // Helper functions
      getTopicProgress: (topicName) => {
        const state = get()
        return state.topicProgress[topicName] || 0
      },

      updateTopicProgress: (topicName, progress) => {
        set((state) => ({
          topicProgress: {
            ...state.topicProgress,
            [topicName]: Math.min(100, Math.max(0, progress))
          }
        }))
      },

      getTotalStudyTime: () => {
        const state = get()
        return state.studySessions.reduce((total, session) => total + session.duration, 0)
      },

      getStudyStreak: () => {
        const state = get()
        const sessions = state.studySessions
        if (sessions.length === 0) return 0

        // Sort sessions by date
        const sortedSessions = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date))

        let streak = 0
        let currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0)

        for (const session of sortedSessions) {
          const sessionDate = new Date(session.date)
          sessionDate.setHours(0, 0, 0, 0)

          const dayDiff = Math.floor((currentDate - sessionDate) / (1000 * 60 * 60 * 24))

          if (dayDiff === streak) {
            streak++
          } else if (dayDiff === streak + 1) {
            streak++
          } else {
            break
          }
        }

        return streak
      },

      getRecentActivity: (days = 7) => {
        const state = get()
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - days)

        return state.studySessions.filter(session => new Date(session.date) >= cutoffDate)
      },

      getWeeklyProgress: () => {
        const state = get()
        const weeklyData = []
        const today = new Date()

        for (let i = 6; i >= 0; i--) {
          const date = new Date(today)
          date.setDate(date.getDate() - i)
          date.setHours(0, 0, 0, 0)

          const nextDate = new Date(date)
          nextDate.setDate(nextDate.getDate() + 1)

          const daySessions = state.studySessions.filter(session => {
            const sessionDate = new Date(session.date)
            return sessionDate >= date && sessionDate < nextDate
          })

          const totalTime = daySessions.reduce((acc, session) => acc + session.duration, 0)
          const uniqueTopics = new Set(daySessions.map(session => session.topicName)).size

          weeklyData.push({
            date: date.toISOString().split('T')[0],
            hours: totalTime / 3600, // Convert seconds to hours
            topics: uniqueTopics,
            sessions: daySessions.length
          })
        }

        return weeklyData
      },

      getSubjectStats: (subject) => {
        const state = get()
        const subjectSessions = state.studySessions.filter(session => session.subject === subject)
        const totalTime = subjectSessions.reduce((acc, session) => acc + session.duration, 0)
        const uniqueTopics = new Set(subjectSessions.map(session => session.topicName)).size

        return {
          totalTime,
          uniqueTopics,
          sessions: subjectSessions.length
        }
      },

      // CodeChef-style Performance Calculation Functions
      calculateTopicMastery: (topicName, studyTime, accuracy, difficulty) => {
        const state = get()
        const baseScore = 50 // Starting score

        // Time factor (faster completion = higher score)
        const timeWeight = Math.max(0, 100 - (studyTime / 3600)) // Penalize if > 1 hour

        // Accuracy factor
        const accuracyWeight = accuracy * 100

        // Difficulty multiplier
        const difficultyMultiplier = {
          'Easy': 1.0,
          'Medium': 1.2,
          'Hard': 1.5
        }[difficulty] || 1.0

        const masteryScore = Math.min(100,
          (baseScore + timeWeight * 0.3 + accuracyWeight * 0.7) * difficultyMultiplier
        )

        set(state => ({
          performance: {
            ...state.performance,
            topicMasteryScores: {
              ...state.performance.topicMasteryScores,
              [topicName]: masteryScore
            }
          }
        }))

        return masteryScore
      },

      calculateRatingChange: (topicName, performance, difficulty, timeSpent) => {
        const state = get()
        const currentRating = state.performance.overallRating

        // Base rating change calculation (similar to ELO)
        const expectedPerformance = 0.5 // Expected 50% performance
        const actualPerformance = performance / 100

        const K = 32 // K-factor for rating changes
        const difficultyMultiplier = {
          'Easy': 0.8,
          'Medium': 1.0,
          'Hard': 1.3
        }[difficulty] || 1.0

        // Time bonus/penalty
        const timeBonus = Math.max(-10, Math.min(10, (3600 - timeSpent) / 360))

        const ratingChange = Math.round(
          K * (actualPerformance - expectedPerformance) * difficultyMultiplier + timeBonus
        )

        const newRating = Math.max(800, currentRating + ratingChange)

        set(state => ({
          performance: {
            ...state.performance,
            overallRating: newRating,
            peakRating: Math.max(state.performance.peakRating, newRating),
            ratingHistory: [
              ...state.performance.ratingHistory,
              {
                date: new Date().toISOString(),
                rating: newRating,
                change: ratingChange,
                topic: topicName,
                reason: 'topic_completion'
              }
            ]
          }
        }))

        return { newRating, change: ratingChange }
      },

      calculateGATEReadiness: () => {
        const state = get()
        const { topicMasteryScores, totalTopicsCompleted, totalStudyTime } = state.performance

        // Calculate based on topic mastery
        const masteryScores = Object.values(topicMasteryScores)
        const averageMastery = masteryScores.length > 0
          ? masteryScores.reduce((sum, score) => sum + score, 0) / masteryScores.length
          : 0

        // Study time factor
        const studyTimeFactor = Math.min(100, (totalStudyTime / 3600) * 2) // 50 hours = 100%

        // Topic completion factor
        const completionFactor = Math.min(100, totalTopicsCompleted * 5) // 20 topics = 100%

        const gateReadiness = Math.round(
          averageMastery * 0.5 + studyTimeFactor * 0.3 + completionFactor * 0.2
        )

        set(state => ({
          performance: {
            ...state.performance,
            gateReadinessScore: gateReadiness
          }
        }))

        return gateReadiness
      },

      calculateConsistencyScore: () => {
        const state = get()
        const sessions = state.studySessions

        if (sessions.length < 7) return 0

        // Calculate daily study consistency over last 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        const recentSessions = sessions.filter(session =>
          new Date(session.timestamp) > thirtyDaysAgo
        )

        // Group by day
        const dailyStudy = {}
        recentSessions.forEach(session => {
          const day = new Date(session.timestamp).toDateString()
          dailyStudy[day] = (dailyStudy[day] || 0) + session.duration
        })

        const studyDays = Object.keys(dailyStudy).length
        const consistencyScore = Math.min(100, (studyDays / 30) * 100)

        set(state => ({
          performance: {
            ...state.performance,
            consistencyScore: Math.round(consistencyScore)
          }
        }))

        return Math.round(consistencyScore)
      },

      updateSubjectRating: (subject, performance) => {
        const state = get()
        const currentSubjectRating = state.performance.subjectRatings[subject] || 1200

        const ratingChange = Math.round((performance - 50) * 2) // -100 to +100 change
        const newRating = Math.max(800, currentSubjectRating + ratingChange)

        set(state => ({
          performance: {
            ...state.performance,
            subjectRatings: {
              ...state.performance.subjectRatings,
              [subject]: newRating
            }
          }
        }))

        return newRating
      },

      // Enhanced Session Tracking Functions
      startStudySession: (topicName, subject, branch) => {
        const sessionId = Date.now().toString()
        const session = {
          id: sessionId,
          topicName,
          subject,
          branch,
          startTime: new Date().toISOString(),
          endTime: null,
          duration: 0,
          interactions: [],
          sectionsVisited: [],
          notesCount: 0,
          completionRate: 0,
          focusScore: 0,
          isActive: true
        }

        set(state => ({
          currentSession: session,
          sessionInteractions: []
        }))

        return sessionId
      },

      trackSessionInteraction: (interactionType, data = {}) => {
        const state = get()
        if (!state.currentSession) return

        const interaction = {
          type: interactionType, // 'section_view', 'note_add', 'code_copy', 'link_click', etc.
          timestamp: new Date().toISOString(),
          data
        }

        set(state => ({
          sessionInteractions: [...state.sessionInteractions, interaction],
          currentSession: {
            ...state.currentSession,
            interactions: [...state.currentSession.interactions, interaction]
          }
        }))
      },

      updateSessionProgress: (sectionsCompleted, notesCount) => {
        const state = get()
        if (!state.currentSession) return

        set(state => ({
          currentSession: {
            ...state.currentSession,
            sectionsVisited: sectionsCompleted,
            notesCount,
            completionRate: (sectionsCompleted.length / 5) * 100 // Assuming 5 sections
          }
        }))
      },

      endStudySession: () => {
        const state = get()
        if (!state.currentSession) return null

        const endTime = new Date().toISOString()
        const duration = Math.floor((new Date(endTime) - new Date(state.currentSession.startTime)) / 1000)

        // Calculate focus score based on interactions vs time
        const interactionCount = state.currentSession.interactions.length
        const focusScore = Math.min(100, Math.max(0,
          100 - (interactionCount / (duration / 60)) * 10 // Penalize too many interactions per minute
        ))

        const completedSession = {
          ...state.currentSession,
          endTime,
          duration,
          focusScore,
          isActive: false
        }

        // Update session metrics
        const totalSessions = state.sessionMetrics.totalSessions + 1
        const totalTime = state.sessionMetrics.averageSessionTime * state.sessionMetrics.totalSessions + duration
        const totalInteractions = state.sessionMetrics.totalInteractions + interactionCount

        const updatedMetrics = {
          totalSessions,
          averageSessionTime: totalTime / totalSessions,
          totalInteractions,
          averageInteractionsPerSession: totalInteractions / totalSessions,
          sessionCompletionRate: ((state.sessionMetrics.sessionCompletionRate * state.sessionMetrics.totalSessions + completedSession.completionRate) / totalSessions),
          averageNotesPerSession: ((state.sessionMetrics.averageNotesPerSession * state.sessionMetrics.totalSessions + completedSession.notesCount) / totalSessions),
          topicSwitchRate: state.sessionMetrics.topicSwitchRate, // Calculate based on topic changes
          focusScore: ((state.sessionMetrics.focusScore * state.sessionMetrics.totalSessions + focusScore) / totalSessions)
        }

        set(state => ({
          studySessions: [completedSession, ...state.studySessions].slice(0, 100),
          sessionMetrics: updatedMetrics,
          currentSession: null,
          sessionInteractions: []
        }))

        return completedSession
      },

      getSessionAnalytics: (timeRange = 'week') => {
        const state = get()
        const now = new Date()
        let cutoffDate = new Date()

        switch (timeRange) {
          case 'day':
            cutoffDate.setDate(now.getDate() - 1)
            break
          case 'week':
            cutoffDate.setDate(now.getDate() - 7)
            break
          case 'month':
            cutoffDate.setMonth(now.getMonth() - 1)
            break
          default:
            cutoffDate = new Date(0) // All time
        }

        const filteredSessions = state.studySessions.filter(session =>
          new Date(session.startTime) >= cutoffDate
        )

        if (filteredSessions.length === 0) {
          return {
            totalSessions: 0,
            totalTime: 0,
            averageSessionTime: 0,
            averageCompletionRate: 0,
            averageFocusScore: 0,
            topTopics: [],
            studyPattern: []
          }
        }

        const totalTime = filteredSessions.reduce((sum, session) => sum + session.duration, 0)
        const averageSessionTime = totalTime / filteredSessions.length
        const averageCompletionRate = filteredSessions.reduce((sum, session) => sum + session.completionRate, 0) / filteredSessions.length
        const averageFocusScore = filteredSessions.reduce((sum, session) => sum + session.focusScore, 0) / filteredSessions.length

        // Top topics by time spent
        const topicTime = {}
        filteredSessions.forEach(session => {
          topicTime[session.topicName] = (topicTime[session.topicName] || 0) + session.duration
        })

        const topTopics = Object.entries(topicTime)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([topic, time]) => ({ topic, time }))

        // Study pattern by hour
        const hourlyPattern = new Array(24).fill(0)
        filteredSessions.forEach(session => {
          const hour = new Date(session.startTime).getHours()
          hourlyPattern[hour] += session.duration
        })

        return {
          totalSessions: filteredSessions.length,
          totalTime,
          averageSessionTime,
          averageCompletionRate,
          averageFocusScore,
          topTopics,
          studyPattern: hourlyPattern
        }
      },

      // Notes Management Functions
      saveUserNotes: (topicName, notes) => {
        set(state => ({
          userNotes: {
            ...state.userNotes,
            [topicName]: notes
          }
        }))
      },

      getUserNotes: (topicName) => {
        const state = get()
        return state.userNotes[topicName] || ''
      },

      deleteUserNotes: (topicName) => {
        set(state => {
          const newNotes = { ...state.userNotes }
          delete newNotes[topicName]
          return { userNotes: newNotes }
        })
      },

      getAllUserNotes: () => {
        const state = get()
        return state.userNotes
      },

      resetProfile: () => {
        set({
          profile: {
            name: '',
            email: '',
            avatar: '',
            joinDate: new Date().toISOString(),
            targetExam: 'GATE',
            branch: '',
            graduationYear: '',
            college: '',
            bio: ''
          },
          performance: {
            totalStudyTime: 0,
            totalTopicsCompleted: 0,
            totalProblemsAttempted: 0,
            totalProblemsSolved: 0,
            totalQuizzesTaken: 0,
            averageQuizScore: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastStudyDate: null,
            weeklyGoal: 10,
            dailyGoal: 2,
            monthlyGoal: 40,
            overallRating: 1200,
            peakRating: 1200,
            ratingHistory: [],
            topicMasteryScores: {},
            subjectRatings: {},
            branchRatings: {},
            gateReadinessScore: 0,
            consistencyScore: 0,
            speedScore: 0,
            accuracyScore: 0,
            difficultyProgression: {},
            weeklyPerformance: [],
            monthlyPerformance: [],
            competitiveRank: null,
            percentile: 0
          },
          studySessions: [],
          quizHistory: [],
          problemHistory: {},
          topicProgress: {},
          achievements: [],
          bookmarkedTopics: [],
          userNotes: {},
          analytics: {
            dailyStats: {},
            weeklyStats: {},
            monthlyStats: {},
            subjectWiseTime: {},
            topicWiseTime: {},
            performanceTrends: []
          }
        })
      }
    }),
    {
      name: 'user-profile-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({
        profile: state.profile,
        performance: state.performance,
        subjectPerformance: state.subjectPerformance,
        topicProgress: state.topicProgress,
        studySessions: state.studySessions,
        quizHistory: state.quizHistory,
        problemHistory: state.problemHistory,
        achievements: state.achievements,
        badges: state.badges,
        bookmarkedTopics: state.bookmarkedTopics,
        favoriteSubjects: state.favoriteSubjects,
        userNotes: state.userNotes,
        preferences: state.preferences,
        learningPath: state.learningPath,
        analytics: state.analytics
      })
    }
  )
)

// Helper functions
const getWeekKey = (date) => {
  const year = date.getFullYear()
  const week = Math.ceil((date.getDate() - date.getDay() + 1) / 7)
  return `${year}-W${week}`
}

const getMonthKey = (date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}`
}
