import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAdvancedStudyStore = create(
  persist(
    (set, get) => ({
      // Study Progress
      studyProgress: {},
      completedTopics: new Set(),
      studyTime: {},
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: null,
      
      // User Notes
      userNotes: {},
      bookmarkedTopics: new Set(),
      
      // Practice Progress
      solvedProblems: {},
      problemAttempts: {},
      codeSubmissions: {},
      
      // Learning Analytics
      learningStats: {
        totalStudyTime: 0,
        topicsCompleted: 0,
        problemsSolved: 0,
        averageScore: 0,
        weakAreas: [],
        strongAreas: []
      },
      
      // User Preferences
      preferences: {
        theme: 'light',
        fontSize: 16,
        codeTheme: 'dark',
        autoSave: true,
        notifications: true,
        studyReminders: true
      },
      
      // Current Session
      currentSession: {
        startTime: null,
        currentTopic: null,
        timeSpent: 0,
        sectionsCompleted: []
      },
      
      // Actions
      startStudySession: (topic) => {
        set(state => ({
          currentSession: {
            startTime: Date.now(),
            currentTopic: topic,
            timeSpent: 0,
            sectionsCompleted: []
          }
        }))
      },
      
      endStudySession: () => {
        const state = get()
        const session = state.currentSession
        if (session.startTime) {
          const timeSpent = Date.now() - session.startTime
          const topic = session.currentTopic
          
          set(state => ({
            studyTime: {
              ...state.studyTime,
              [topic]: (state.studyTime[topic] || 0) + timeSpent
            },
            learningStats: {
              ...state.learningStats,
              totalStudyTime: state.learningStats.totalStudyTime + timeSpent
            },
            currentSession: {
              startTime: null,
              currentTopic: null,
              timeSpent: 0,
              sectionsCompleted: []
            }
          }))
          
          // Update streak
          get().updateStreak()
        }
      },
      
      updateStreak: () => {
        const today = new Date().toDateString()
        const lastStudy = get().lastStudyDate
        
        set(state => {
          let newStreak = state.currentStreak
          
          if (lastStudy !== today) {
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            
            if (lastStudy === yesterday.toDateString()) {
              newStreak += 1
            } else if (lastStudy !== today) {
              newStreak = 1
            }
            
            return {
              currentStreak: newStreak,
              longestStreak: Math.max(state.longestStreak, newStreak),
              lastStudyDate: today
            }
          }
          
          return state
        })
      },
      
      markTopicCompleted: (topic) => {
        set(state => ({
          completedTopics: new Set([...state.completedTopics, topic]),
          studyProgress: {
            ...state.studyProgress,
            [topic]: 100
          },
          learningStats: {
            ...state.learningStats,
            topicsCompleted: state.learningStats.topicsCompleted + 1
          }
        }))
      },
      
      updateTopicProgress: (topic, progress) => {
        set(state => ({
          studyProgress: {
            ...state.studyProgress,
            [topic]: progress
          }
        }))
      },
      
      saveUserNotes: (topic, notes) => {
        set(state => ({
          userNotes: {
            ...state.userNotes,
            [topic]: notes
          }
        }))
      },
      
      toggleBookmark: (topic) => {
        set(state => {
          const newBookmarks = new Set(state.bookmarkedTopics)
          if (newBookmarks.has(topic)) {
            newBookmarks.delete(topic)
          } else {
            newBookmarks.add(topic)
          }
          return { bookmarkedTopics: newBookmarks }
        })
      },
      
      submitProblemSolution: (problemId, code, isCorrect, timeSpent) => {
        set(state => ({
          solvedProblems: {
            ...state.solvedProblems,
            [problemId]: {
              solved: isCorrect,
              attempts: (state.solvedProblems[problemId]?.attempts || 0) + 1,
              bestTime: Math.min(state.solvedProblems[problemId]?.bestTime || Infinity, timeSpent),
              lastAttempt: Date.now()
            }
          },
          codeSubmissions: {
            ...state.codeSubmissions,
            [problemId]: [
              ...(state.codeSubmissions[problemId] || []),
              {
                code,
                isCorrect,
                timeSpent,
                timestamp: Date.now()
              }
            ]
          },
          learningStats: isCorrect ? {
            ...state.learningStats,
            problemsSolved: state.learningStats.problemsSolved + 1
          } : state.learningStats
        }))
      },
      
      updatePreferences: (newPreferences) => {
        set(state => ({
          preferences: {
            ...state.preferences,
            ...newPreferences
          }
        }))
      },
      
      getTopicProgress: (topic) => {
        return get().studyProgress[topic] || 0
      },
      
      getTopicNotes: (topic) => {
        return get().userNotes[topic] || ''
      },
      
      isTopicBookmarked: (topic) => {
        return get().bookmarkedTopics.has(topic)
      },
      
      getStudyStats: () => {
        const state = get()
        return {
          ...state.learningStats,
          currentStreak: state.currentStreak,
          longestStreak: state.longestStreak,
          totalTopics: Object.keys(state.studyProgress).length,
          completedTopics: state.completedTopics.size
        }
      },
      
      resetProgress: () => {
        set({
          studyProgress: {},
          completedTopics: new Set(),
          studyTime: {},
          userNotes: {},
          solvedProblems: {},
          codeSubmissions: {},
          currentStreak: 0,
          learningStats: {
            totalStudyTime: 0,
            topicsCompleted: 0,
            problemsSolved: 0,
            averageScore: 0,
            weakAreas: [],
            strongAreas: []
          }
        })
      }
    }),
    {
      name: 'advanced-study-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({
        studyProgress: state.studyProgress,
        completedTopics: Array.from(state.completedTopics),
        studyTime: state.studyTime,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        lastStudyDate: state.lastStudyDate,
        userNotes: state.userNotes,
        bookmarkedTopics: Array.from(state.bookmarkedTopics),
        solvedProblems: state.solvedProblems,
        codeSubmissions: state.codeSubmissions,
        learningStats: state.learningStats,
        preferences: state.preferences
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.completedTopics = new Set(state.completedTopics || [])
          state.bookmarkedTopics = new Set(state.bookmarkedTopics || [])
        }
      }
    }
  )
)
