import { useState, useEffect, Fragment } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { Dialog, Transition } from '@headlessui/react';
import { 
  Plus, 
  ExternalLink, 
  Copy, 
  Trash2, 
  Eye, 
  Download, 
  Star, 
  Calendar, 
  Trophy,
  BookOpen,
  Clock,
  BookText,
  Lightbulb,
  BarChart2,
  Zap,
  Target,
  Users,
  CheckCircle,
  TrendingUp,
  Smartphone,
  X,
  Search,
  Link2,
  ChevronDown,
  ChevronUp,
  Award,
  Bookmark
} from 'lucide-react';

const ToppersPage = () => {
  const [activeTab, setActiveTab] = useState('strategy');

  const strategies = [
    {
      title: "Master the Syllabus",
      icon: BookOpen,
      description: "Thoroughly understand the GATE syllabus and weightage of each topic. Focus on high-weightage areas first.",
      tips: [
        "Create a topic-wise checklist",
        "Prioritize based on weightage",
        "Identify your weak areas"
      ]
    },
    {
      title: "Effective Time Management",
      icon: Clock,
      description: "Create a realistic study schedule and stick to it. Allocate time based on topic difficulty and weightage.",
      tips: [
        "Follow the 80/20 rule (Pareto Principle)",
        "Use Pomodoro technique (25/5)",
        "Regular revision cycles"
      ]
    },
    {
      title: "Practice Previous Papers",
      icon: BookText,
      description: "Solve at least 10 years of previous year papers to understand the exam pattern and difficulty level.",
      tips: [
        "Time-bound test series",
        "Analyze mistakes",
        "Focus on repeated concepts"
      ]
    },
    {
      title: "Focus on Concepts",
      icon: Lightbulb,
      description: "Build strong fundamentals rather than rote learning. Understand the 'why' behind every concept.",
      tips: [
        "Relate to real-world applications",
        "Use visualization techniques",
        "Teach others to reinforce learning"
      ]
    },
    {
      title: "Mock Tests & Analysis",
      icon: BarChart2,
      description: "Regularly take full-length mock tests under exam conditions and thoroughly analyze your performance.",
      tips: [
        "Simulate exam environment",
        "Work on time management",
        "Identify weak areas"
      ]
    },
    {
      title: "Healthy Lifestyle",
      icon: Zap,
      description: "Maintain a balanced routine with proper sleep, nutrition, and exercise for optimal performance.",
      tips: [
        "7-8 hours of sleep",
        "Regular exercise",
        "Healthy diet"
      ]
    }
  ];

  const topperProfiles = [
    {
      name: "Rahul Sharma",
      rank: 1,
      year: 2023,
      branch: "Computer Science",
      college: "IIT Bombay",
      score: "1000/1000",
      quote: "Consistency and smart work beat talent when talent doesn't work hard.",
      strategy: "Focused on understanding concepts rather than rote learning. Solved previous year papers religiously."
    },
    {
      name: "Priya Patel",
      rank: 2,
      year: 2023,
      branch: "Electrical Engineering",
      college: "IIT Delhi",
      score: "998/1000",
      quote: "Quality of study matters more than quantity. Stay focused on your goal.",
      strategy: "Created concise notes and revised them regularly. Took weekly mock tests to improve speed and accuracy."
    },
    {
      name: "Amit Kumar",
      rank: 3,
      year: 2023,
      branch: "Mechanical Engineering",
      college: "IIT Madras",
      score: "995/1000",
      quote: "Consistent hard work and self-belief are the keys to success.",
      strategy: "Followed a strict study schedule and focused on weak areas. Made sure to understand the fundamentals thoroughly."
    }
  ];

  const studyResources = [
    {
      type: "Books",
      items: [
        "Standard textbooks recommended by IIT professors",
        "GATE specific guidebooks",
        "Previous year solved papers"
      ]
    },
    {
      type: "Online Platforms",
      items: [
        "NPTEL lectures",
        "GATE Academy video lectures",
        "Online test series"
      ]
    },
    {
      type: "Mobile Apps",
      items: [
        "GATE previous year papers",
        "Formula apps",
        "Quiz apps for quick revision"
      ]
    }
  ];

  const Timeline = () => (
    <div className="space-y-8 relative">
      {[
        { month: 'Jan-Mar', action: 'Syllabus Completion', details: 'Complete 60% of the syllabus' },
        { month: 'Apr-Jun', action: 'Concept Building', details: 'Focus on core concepts and problem-solving' },
        { month: 'Jul-Sep', action: 'Practice & Tests', details: 'Start full-length mock tests' },
        { month: 'Oct-Dec', action: 'Revision Phase', details: 'Intensive revision and doubt clearing' },
        { month: 'Jan-Feb', action: 'Final Preparation', details: 'Last-minute revision and strategy' }
      ].map((item, index) => (
        <motion.div 
          key={index}
          className="flex gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold">
              {index + 1}
            </div>
            {index < 4 && (
              <div className="h-full w-0.5 bg-gradient-to-b from-blue-300 to-purple-300 my-2"></div>
            )}
          </div>
          <div className="flex-1 pb-8">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{item.month}: {item.action}</h4>
            <p className="text-gray-600 dark:text-gray-300">{item.details}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const StrategyCard = ({ title, icon: Icon, description, tips }) => (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      <div className="space-y-2">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-200">{tip}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const TopperCard = ({ profile }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    return (
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{profile.name}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              AIR {profile.rank} | {profile.branch} | {profile.year}
            </p>
            <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">
              {profile.score}
            </p>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
            AIR {profile.rank}
          </div>
        </div>
        
        <blockquote className="mt-4 pl-4 border-l-4 border-blue-500 italic text-gray-700 dark:text-gray-300">
          "{profile.quote}"
        </blockquote>
        
        <div className={`mt-4 transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-24'} overflow-hidden`}>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Strategy:</span> {profile.strategy}
          </p>
        </div>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium flex items-center gap-1"
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      </motion.div>
    );
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-6"
            >
              <Trophy className="w-5 h-5 mr-2" />
              GATE Toppers' Secrets
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Unlock Your Potential
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-400">
                Become a GATE Topper
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-blue-100 max-w-3xl mx-auto mb-8"
            >
              Learn the strategies, study plans, and mindset that helped previous GATE toppers achieve AIR 1
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { id: 'strategy', label: 'Winning Strategies', icon: Target },
            { id: 'toppers', label: 'Topper Profiles', icon: Users },
            { id: 'resources', label: 'Study Resources', icon: BookOpen },
            { id: 'timeline', label: 'Preparation Timeline', icon: Calendar }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'strategy' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {strategies.map((strategy, index) => (
                <StrategyCard key={index} {...strategy} />
              ))}
            </motion.div>
          )}

          {activeTab === 'toppers' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {topperProfiles.map((profile, index) => (
                <TopperCard key={index} profile={profile} />
              ))}
            </motion.div>
          )}

          {activeTab === 'resources' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {studyResources.map((resource, index) => (
                <motion.div 
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  whileHover={{ y: -5 }}
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    {resource.type === 'Books' && <BookText className="w-5 h-5 text-blue-600" />}
                    {resource.type === 'Online Platforms' && <TrendingUp className="w-5 h-5 text-green-600" />}
                    {resource.type === 'Mobile Apps' && <Smartphone className="w-5 h-5 text-purple-600" />}
                    {resource.type}
                  </h3>
                  <ul className="space-y-3">
                    {resource.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-200">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                One Year GATE Preparation Timeline
              </h2>
              <Timeline />
            </motion.div>
          )}
        </div>
      </div>

      {/* Final Tips Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Final Words of Wisdom</h2>
            <div className="space-y-6 text-lg">
              <p>
                "Success in GATE is 20% intelligence and 80% hard work, consistency, and smart preparation."
              </p>
              <p>
                "The secret to getting ahead is getting started. Start today, stay consistent, and success will follow."
              </p>
              <p className="font-semibold text-yellow-300">
                Believe in yourself. You've got this! 🚀
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default ToppersPage
