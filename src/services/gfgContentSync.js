// GeeksforGeeks Content Synchronization Service
// Comprehensive content mapping and progress synchronization system

import { gfgLinksDatabase, GFGLinkGenerator } from '../data/gfgLinksDatabase'

export class GFGContentSyncService {
  constructor() {
    this.cache = new Map()
    this.syncQueue = []
    this.isOnline = navigator.onLine
    this.setupEventListeners()
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.processSyncQueue()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }

  // Content mapping and validation
  async validateGFGLinks(branch, subject, topic) {
    const cacheKey = `${branch}-${subject}-${topic}`
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const links = GFGLinkGenerator.getAllLinksForTopic(branch, subject, topic)
    if (!links) return null

    const validatedLinks = {
      ...links,
      validated: true,
      lastChecked: new Date().toISOString(),
      status: 'active'
    }

    // In a real implementation, you would check if URLs are accessible
    // For now, we'll assume they are valid
    if (this.isOnline) {
      try {
        // Simulate link validation
        await this.checkLinkAccessibility(links.tutorial)
        validatedLinks.tutorialStatus = 'accessible'
      } catch (error) {
        validatedLinks.tutorialStatus = 'inaccessible'
        validatedLinks.fallbackTutorial = this.generateFallbackContent(topic)
      }
    }

    this.cache.set(cacheKey, validatedLinks)
    return validatedLinks
  }

  async checkLinkAccessibility(url) {
    // Simulate link checking - in real implementation, use fetch with no-cors
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 100)
    })
  }

  generateFallbackContent(topic) {
    return {
      title: `${topic} - Study Guide`,
      content: `Comprehensive study material for ${topic}`,
      sections: [
        {
          title: 'Introduction',
          content: `Learn the fundamentals of ${topic} with this comprehensive guide.`
        },
        {
          title: 'Key Concepts',
          content: `Master the essential concepts and principles of ${topic}.`
        },
        {
          title: 'Practice Problems',
          content: `Solve practice problems to reinforce your understanding of ${topic}.`
        }
      ]
    }
  }

  // Progress synchronization
  async syncUserProgress(userProgress) {
    const syncData = {
      timestamp: new Date().toISOString(),
      progress: userProgress,
      device: this.getDeviceInfo(),
      version: '1.0.0'
    }

    if (this.isOnline) {
      try {
        await this.uploadProgress(syncData)
        return { success: true, synced: true }
      } catch (error) {
        this.addToSyncQueue(syncData)
        return { success: true, synced: false, queued: true }
      }
    } else {
      this.addToSyncQueue(syncData)
      return { success: true, synced: false, queued: true }
    }
  }

  async uploadProgress(syncData) {
    // In a real implementation, this would upload to your backend
    // For now, we'll store in localStorage as a backup
    const existingData = JSON.parse(localStorage.getItem('gfg_progress_sync') || '[]')
    existingData.push(syncData)
    localStorage.setItem('gfg_progress_sync', JSON.stringify(existingData.slice(-50))) // Keep last 50 entries
    
    return Promise.resolve(syncData)
  }

  addToSyncQueue(data) {
    this.syncQueue.push(data)
    // Limit queue size
    if (this.syncQueue.length > 100) {
      this.syncQueue = this.syncQueue.slice(-100)
    }
  }

  async processSyncQueue() {
    if (!this.isOnline || this.syncQueue.length === 0) return

    const batch = this.syncQueue.splice(0, 10) // Process 10 items at a time
    
    try {
      for (const item of batch) {
        await this.uploadProgress(item)
      }
    } catch (error) {
      // Re-add failed items to queue
      this.syncQueue.unshift(...batch)
    }
  }

  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  }

  // Content recommendations based on GFG patterns
  getRecommendedContent(currentTopic, userProgress, difficulty = 'Medium') {
    const recommendations = []

    // Find related topics from the same subject
    Object.entries(gfgLinksDatabase).forEach(([branch, branchData]) => {
      Object.entries(branchData).forEach(([subject, subjectData]) => {
        Object.entries(subjectData.topics || {}).forEach(([topicName, topicData]) => {
          if (topicName !== currentTopic && this.isRelatedTopic(currentTopic, topicName)) {
            const userTopicProgress = userProgress[topicName] || 0
            
            recommendations.push({
              topic: topicName,
              subject,
              branch,
              difficulty: topicData.difficulty || difficulty,
              progress: userTopicProgress,
              relevanceScore: this.calculateRelevanceScore(currentTopic, topicName, userTopicProgress),
              gfgLinks: GFGLinkGenerator.getAllLinksForTopic(branch, subject, topicName)
            })
          }
        })
      })
    })

    // Sort by relevance score and return top 5
    return recommendations
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5)
  }

  isRelatedTopic(topic1, topic2) {
    const topic1Words = topic1.toLowerCase().split(/\s+/)
    const topic2Words = topic2.toLowerCase().split(/\s+/)
    
    // Check for common words (simple similarity)
    const commonWords = topic1Words.filter(word => 
      topic2Words.includes(word) && word.length > 3
    )
    
    return commonWords.length > 0
  }

  calculateRelevanceScore(currentTopic, candidateTopic, userProgress) {
    let score = 0
    
    // Base similarity score
    if (this.isRelatedTopic(currentTopic, candidateTopic)) {
      score += 50
    }
    
    // Progress-based scoring
    if (userProgress === 0) {
      score += 30 // Prefer unstarted topics
    } else if (userProgress < 100) {
      score += 20 // Prefer in-progress topics
    } else {
      score += 10 // Completed topics get lower priority
    }
    
    // Difficulty progression
    const currentDifficulty = this.getDifficultyLevel(currentTopic)
    const candidateDifficulty = this.getDifficultyLevel(candidateTopic)
    
    if (candidateDifficulty === currentDifficulty) {
      score += 15 // Same difficulty level
    } else if (candidateDifficulty === currentDifficulty + 1) {
      score += 25 // Next difficulty level
    }
    
    return score
  }

  getDifficultyLevel(topic) {
    // Simple difficulty mapping - in real implementation, use topic metadata
    const easyTopics = ['arrays', 'strings', 'basic']
    const hardTopics = ['dynamic programming', 'graph algorithms', 'advanced']
    
    const topicLower = topic.toLowerCase()
    
    if (easyTopics.some(easy => topicLower.includes(easy))) return 1
    if (hardTopics.some(hard => topicLower.includes(hard))) return 3
    return 2 // Medium
  }

  // Analytics and insights
  generateStudyInsights(userSessions, gfgInteractions) {
    const insights = {
      gfgEngagement: this.calculateGFGEngagement(gfgInteractions),
      learningPath: this.suggestLearningPath(userSessions),
      weakAreas: this.identifyWeakAreas(userSessions),
      recommendations: this.getPersonalizedRecommendations(userSessions)
    }

    return insights
  }

  calculateGFGEngagement(interactions) {
    const totalInteractions = interactions.length
    const uniqueTopics = new Set(interactions.map(i => i.topic)).size
    const practiceAttempts = interactions.filter(i => i.type.includes('practice')).length
    
    return {
      totalInteractions,
      uniqueTopics,
      practiceAttempts,
      engagementScore: Math.min(100, (totalInteractions * 2 + practiceAttempts * 5) / 10)
    }
  }

  suggestLearningPath(sessions) {
    // Analyze user's study patterns and suggest optimal learning path
    const subjectTime = {}
    const topicCompletion = {}
    
    sessions.forEach(session => {
      subjectTime[session.subject] = (subjectTime[session.subject] || 0) + session.duration
      topicCompletion[session.topicName] = session.completionRate || 0
    })
    
    // Find subjects with low time investment
    const underStudiedSubjects = Object.entries(subjectTime)
      .filter(([subject, time]) => time < 3600) // Less than 1 hour
      .map(([subject]) => subject)
    
    return {
      focusSubjects: underStudiedSubjects,
      nextTopics: this.getNextRecommendedTopics(topicCompletion),
      estimatedTimeToComplete: this.estimateCompletionTime(topicCompletion)
    }
  }

  identifyWeakAreas(sessions) {
    const topicPerformance = {}
    
    sessions.forEach(session => {
      if (!topicPerformance[session.topicName]) {
        topicPerformance[session.topicName] = {
          attempts: 0,
          totalTime: 0,
          avgCompletion: 0,
          subject: session.subject
        }
      }
      
      const perf = topicPerformance[session.topicName]
      perf.attempts++
      perf.totalTime += session.duration
      perf.avgCompletion = ((perf.avgCompletion * (perf.attempts - 1)) + (session.completionRate || 0)) / perf.attempts
    })
    
    // Identify topics with low completion rates or high time investment
    return Object.entries(topicPerformance)
      .filter(([topic, perf]) => perf.avgCompletion < 60 || perf.totalTime > 7200) // < 60% completion or > 2 hours
      .map(([topic, perf]) => ({
        topic,
        ...perf,
        improvementSuggestion: this.getImprovementSuggestion(perf)
      }))
  }

  getImprovementSuggestion(performance) {
    if (performance.avgCompletion < 40) {
      return "Focus on understanding fundamentals before moving to advanced concepts"
    } else if (performance.totalTime > 7200) {
      return "Try breaking down the topic into smaller study sessions"
    } else {
      return "Practice more problems to improve retention"
    }
  }

  getNextRecommendedTopics(topicCompletion) {
    // Simple recommendation based on completion status
    const inProgress = Object.entries(topicCompletion)
      .filter(([topic, completion]) => completion > 0 && completion < 100)
      .sort((a, b) => b[1] - a[1]) // Sort by completion percentage
      .slice(0, 3)
      .map(([topic]) => topic)
    
    return inProgress
  }

  estimateCompletionTime(topicCompletion) {
    const totalTopics = Object.keys(topicCompletion).length
    const completedTopics = Object.values(topicCompletion).filter(c => c >= 100).length
    const avgTimePerTopic = 2 // hours
    
    return (totalTopics - completedTopics) * avgTimePerTopic
  }

  getPersonalizedRecommendations(sessions) {
    const recentSessions = sessions.slice(-10) // Last 10 sessions
    const preferredSubjects = this.getPreferredSubjects(recentSessions)
    const studyTimePattern = this.getStudyTimePattern(recentSessions)
    
    return {
      preferredSubjects,
      optimalStudyTime: studyTimePattern.optimalDuration,
      recommendedSchedule: studyTimePattern.preferredTimes,
      nextActions: [
        "Complete in-progress topics",
        "Practice more GFG problems",
        "Review weak areas identified"
      ]
    }
  }

  getPreferredSubjects(sessions) {
    const subjectFreq = {}
    sessions.forEach(session => {
      subjectFreq[session.subject] = (subjectFreq[session.subject] || 0) + 1
    })
    
    return Object.entries(subjectFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([subject]) => subject)
  }

  getStudyTimePattern(sessions) {
    const durations = sessions.map(s => s.duration).filter(d => d > 0)
    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length
    
    const times = sessions.map(s => new Date(s.timestamp).getHours())
    const timeFreq = {}
    times.forEach(hour => {
      timeFreq[hour] = (timeFreq[hour] || 0) + 1
    })
    
    const preferredTimes = Object.entries(timeFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour]) => `${hour}:00`)
    
    return {
      optimalDuration: Math.round(avgDuration / 60), // in minutes
      preferredTimes
    }
  }
}

// Singleton instance
export const gfgContentSync = new GFGContentSyncService()
