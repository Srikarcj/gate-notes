import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Settings, 
  Trophy, 
  BarChart3, 
  BookOpen, 
  Home, 
  Clock, 
  Target, 
  Flame,
  Star,
  Code,
  Award,
  Edit3,
  Save,
  X,
  Camera,
  Mail,
  GraduationCap,
  MapPin,
  Phone,
  ArrowLeft
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUserProfileStore } from '../store/userProfileStore'

const ProfilePage = () => {
  const {
    profile = {},
    studySessions = [],
    quizHistory = [],
    achievements = [],
    solvedProblems = [],
    problemHistory = {},
    updateProfile,
    getStudyStats,
    getTotalStudyTime,
    getStudyStreak
  } = useUserProfileStore()

  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    college: profile?.college || '',
    location: profile?.location || '',
    branch: profile?.branch || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    graduationYear: profile?.graduationYear || '',
    targetExam: profile?.targetExam || 'GATE',
    linkedIn: profile?.linkedIn || '',
    github: profile?.github || '',
    website: profile?.website || ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  const stats = getStudyStats ? getStudyStats() : {
    completedTopics: 0,
    totalTopics: 0,
    studyStreak: 0,
    totalStudyTime: 0
  }
  
  const realtimeStats = {
    ...stats,
    totalStudyTime: getTotalStudyTime ? getTotalStudyTime() : 0,
    studyStreak: getStudyStreak ? getStudyStreak() : 0,
    solvedProblems: (solvedProblems || []).length,
    totalProblems: Object.keys(problemHistory || {}).length,
    averageQuizScore: (quizHistory || []).length > 0 
      ? Math.round((quizHistory || []).reduce((sum, quiz) => sum + (quiz.score || 0), 0) / (quizHistory || []).length)
      : 0,
    rank: calculateRank(),
    globalRanking: Math.floor(Math.random() * 10000) + 1000,
    maxRating: Math.floor(Math.random() * 500) + 1200
  }

  function calculateRank() {
    const score = (stats.completedTopics * 100) + (stats.studyStreak * 10) + (stats.totalStudyTime / 60)
    
    if (score > 1000) return { name: 'Expert', color: 'text-blue-600 bg-blue-100', level: 5 }
    if (score > 500) return { name: 'Specialist', color: 'text-cyan-600 bg-cyan-100', level: 4 }
    if (score > 200) return { name: 'Pupil', color: 'text-green-600 bg-green-100', level: 3 }
    if (score > 100) return { name: 'Newbie', color: 'text-gray-600 bg-gray-100', level: 2 }
    return { name: 'Unrated', color: 'text-gray-500 bg-gray-50', level: 1 }
  }

  // Form validation
  const validateForm = () => {
    const errors = {}

    if (!editForm.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!editForm.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (editForm.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(editForm.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number'
    }

    if (editForm.graduationYear && (editForm.graduationYear < 2020 || editForm.graduationYear > 2030)) {
      errors.graduationYear = 'Please enter a valid graduation year (2020-2030)'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleEditProfile = () => {
    setEditForm({
      name: profile?.name || '',
      email: profile?.email || '',
      college: profile?.college || '',
      location: profile?.location || '',
      branch: profile?.branch || '',
      phone: profile?.phone || '',
      bio: profile?.bio || '',
      graduationYear: profile?.graduationYear || '',
      targetExam: profile?.targetExam || 'GATE',
      linkedIn: profile?.linkedIn || '',
      github: profile?.github || '',
      website: profile?.website || ''
    })
    setFormErrors({})
    setIsEditing(true)
  }

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      return
    }

    setIsSaving(true)

    try {
      if (updateProfile) {
        await updateProfile(editForm)
      }
      setIsEditing(false)
      setFormErrors({})
    } catch (error) {
      console.error('Error saving profile:', error)
      setFormErrors({ general: 'Failed to save profile. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setFormErrors({})
  }

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">User Profile</h1>
            </div>
            
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced CodeChef-style Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center ring-4 ring-white ring-opacity-30 text-2xl font-bold">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-full text-xs font-bold ${realtimeStats.rank?.color || 'text-gray-600 bg-gray-100'}`}>
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
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-3xl font-bold bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-3 py-1 text-white placeholder-blue-200"
                      placeholder="Your Name"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-3 py-2 text-white placeholder-blue-200 text-sm"
                        placeholder="Email"
                      />
                      <input
                        type="text"
                        value={editForm.college}
                        onChange={(e) => handleInputChange('college', e.target.value)}
                        className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-3 py-2 text-white placeholder-blue-200 text-sm"
                        placeholder="College"
                      />
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-3 py-2 text-white placeholder-blue-200 text-sm"
                        placeholder="Location"
                      />
                      <select
                        value={editForm.branch}
                        onChange={(e) => handleInputChange('branch', e.target.value)}
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
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${realtimeStats.rank?.color || 'text-gray-600 bg-gray-100'}`}>
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

            {/* Real-time Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
          </div>
        </div>

        {/* Additional Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-2">
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
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {profile.phone || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">College</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {profile.college || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {profile.location || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Home className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900 dark:text-white">Back to Home</span>
                </Link>
                <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-gray-900 dark:text-white">View Achievements</span>
                </button>
                <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900 dark:text-white">Analytics</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
