import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Plus, 
  Download, 
  Star, 
  Eye, 
  Copy, 
  Edit, 
  Trash2,
  ExternalLink,
  Calendar,
  Tag
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { cn } from '../utils/cn'

const ToppersPage = () => {
  const [topperNotes, setTopperNotes] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pdfLink: '',
    category: 'general',
    subject: ''
  })

  // Load topper notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('gateNotesHub_topperNotes')
    if (savedNotes) {
      setTopperNotes(JSON.parse(savedNotes))
    } else {
      // Load sample data if no notes exist
      loadSampleData()
    }
  }, [])

  // Save notes to localStorage whenever topperNotes changes
  useEffect(() => {
    localStorage.setItem('gateNotesHub_topperNotes', JSON.stringify(topperNotes))
  }, [topperNotes])

  const loadSampleData = () => {
    const sampleNotes = [
      {
        id: generateId(),
        title: 'Complete Data Structures Guide',
        description: 'Comprehensive guide covering all data structures with implementations and examples.',
        pdfLink: 'https://www.tutorialspoint.com/data_structures_algorithms/data_structures_algorithms_tutorial.pdf',
        category: 'cse',
        subject: 'Data Structures',
        dateAdded: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        views: 15,
        rating: 4.8,
        downloads: 1250
      },
      {
        id: generateId(),
        title: 'GATE Mathematics Formula Sheet',
        description: 'All important mathematical formulas for GATE preparation in one place.',
        pdfLink: 'https://www.iitg.ac.in/scifac/qip/public_html/cd_cell/chapters/mathematics_gate.pdf',
        category: 'general',
        subject: 'Mathematics',
        dateAdded: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        views: 8,
        rating: 4.9,
        downloads: 2100
      },
      {
        id: generateId(),
        title: 'Control Systems Quick Notes',
        description: 'Concise notes on control systems theory and applications.',
        pdfLink: 'https://nptel.ac.in/content/storage2/courses/108105029/pdf/L-1(GC)%20((EE)NPTEL).pdf',
        category: 'ee',
        subject: 'Control Systems',
        dateAdded: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        views: 3,
        rating: 4.7,
        downloads: 890
      },
      {
        id: generateId(),
        title: 'Digital Electronics Handbook',
        description: 'Complete handbook for digital electronics covering all important topics.',
        pdfLink: 'https://www.iitg.ac.in/scifac/qip/public_html/cd_cell/chapters/digital_electronics.pdf',
        category: 'ece',
        subject: 'Digital Electronics',
        dateAdded: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        views: 12,
        rating: 4.6,
        downloads: 1560
      },
      {
        id: generateId(),
        title: 'Thermodynamics Complete Notes',
        description: 'Detailed notes on thermodynamics for mechanical engineering students.',
        pdfLink: 'https://nptel.ac.in/content/storage2/courses/112103017/pdf/module1/lecture1.pdf',
        category: 'me',
        subject: 'Thermodynamics',
        dateAdded: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        views: 6,
        rating: 4.5,
        downloads: 720
      },
      {
        id: generateId(),
        title: 'Structural Analysis Fundamentals',
        description: 'Essential concepts in structural analysis for civil engineering.',
        pdfLink: 'https://nptel.ac.in/content/storage2/courses/105105104/pdf/L-01.pdf',
        category: 'ce',
        subject: 'Structural Analysis',
        dateAdded: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        views: 9,
        rating: 4.4,
        downloads: 650
      },
      {
        id: generateId(),
        title: 'Process Control Instrumentation',
        description: 'Advanced concepts in process control and instrumentation.',
        pdfLink: 'https://nptel.ac.in/content/storage2/courses/103103027/pdf/L-01.pdf',
        category: 'in',
        subject: 'Process Control',
        dateAdded: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        views: 5,
        rating: 4.3,
        downloads: 480
      }
    ]
    setTopperNotes(sampleNotes)
  }

  const generateId = () => {
    return 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.pdfLink.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!isValidUrl(formData.pdfLink)) {
      toast.error('Please enter a valid URL')
      return
    }

    const newNote = {
      id: generateId(),
      title: formData.title.trim(),
      description: formData.description.trim() || 'No description provided',
      pdfLink: formData.pdfLink.trim(),
      category: formData.category,
      subject: formData.subject.trim() || 'General',
      dateAdded: new Date().toISOString(),
      views: 0,
      rating: 0,
      downloads: 0
    }

    setTopperNotes(prev => [newNote, ...prev])
    setFormData({ title: '', description: '', pdfLink: '', category: 'general', subject: '' })
    setShowAddForm(false)
    toast.success('Topper note added successfully!')
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const deleteNote = (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setTopperNotes(prev => prev.filter(note => note.id !== noteId))
      toast.success('Note deleted successfully')
    }
  }

  const incrementViews = (noteId) => {
    setTopperNotes(prev => 
      prev.map(note => 
        note.id === noteId 
          ? { ...note, views: note.views + 1 }
          : note
      )
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category) => {
    const colors = {
      general: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      cse: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      ece: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      ee: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      me: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      ce: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      in: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    }
    return colors[category] || colors.general
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto container-padding section-padding">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              🏆 Topper's Recommended Notes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Community-driven collection of high-quality study materials shared by successful GATE candidates
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Add Note Form */}
            <div className="lg:col-span-1">
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Add New Note
                  </h2>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus className="w-4 h-4" />
                    {showAddForm ? 'Cancel' : 'Add'}
                  </button>
                </div>

                {showAddForm && (
                  <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Note Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Data Structures - Complete Guide"
                        className="input w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of the note content..."
                        rows="3"
                        className="textarea w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        PDF Link *
                      </label>
                      <input
                        type="url"
                        value={formData.pdfLink}
                        onChange={(e) => setFormData(prev => ({ ...prev, pdfLink: e.target.value }))}
                        placeholder="https://example.com/note.pdf"
                        className="input w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="e.g., Data Structures, Control Systems"
                        className="input w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Branch
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="select w-full"
                      >
                        <option value="general">General / Mathematics</option>
                        <option value="cse">Computer Science & Engineering (CSE)</option>
                        <option value="ece">Electronics & Communication Engineering (ECE)</option>
                        <option value="ee">Electrical Engineering (EE)</option>
                        <option value="me">Mechanical Engineering (ME)</option>
                        <option value="ce">Civil Engineering (CE)</option>
                        <option value="in">Instrumentation Engineering (IN)</option>
                      </select>
                    </div>

                    <button type="submit" className="btn btn-primary w-full">
                      <Plus className="w-4 h-4" />
                      Add Note
                    </button>
                  </motion.form>
                )}
              </motion.div>
            </div>

            {/* Notes List */}
            <div className="lg:col-span-2">
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Saved Topper Notes ({topperNotes.length})
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  High-quality study materials recommended by GATE toppers
                </p>
              </motion.div>

              {topperNotes.length === 0 ? (
                <motion.div
                  className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No topper notes yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Add your first topper-recommended note using the form above.
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {topperNotes.map((note, index) => (
                    <motion.div
                      key={note.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {note.title}
                              </h3>
                              {note.subject && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  Subject: {note.subject}
                                </p>
                              )}
                            </div>
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium uppercase",
                              getCategoryColor(note.category)
                            )}>
                              {note.category}
                            </span>
                          </div>

                          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                            {note.description}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(note.dateAdded)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {note.views} views
                            </span>
                            {note.downloads > 0 && (
                              <span className="flex items-center gap-1">
                                <Download className="w-4 h-4" />
                                {note.downloads} downloads
                              </span>
                            )}
                            {note.rating > 0 && (
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                {note.rating}/5
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={note.pdfLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => incrementViews(note.id)}
                            className="btn btn-primary btn-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View PDF
                          </a>
                          
                          <button
                            onClick={() => copyLink(note.pdfLink)}
                            className="btn btn-secondary btn-sm"
                          >
                            <Copy className="w-4 h-4" />
                            Copy
                          </button>
                          
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="btn btn-ghost btn-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ToppersPage
