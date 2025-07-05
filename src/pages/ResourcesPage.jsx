import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Download, 
  Brain, 
  Search,
  Bookmark,
  Play,
  BookOpenText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [savedResources, setSavedResources] = useState([])

  const categories = [
    { id: 'all', name: 'All Resources', icon: BookOpen, count: 500 },
    { id: 'study-materials', name: 'Study Materials', icon: FileText, count: 150 },
    { id: 'interactive-videos', name: 'Interactive Videos', icon: Play, count: 100 },
    { id: 'previous-papers', name: 'Previous Papers', icon: FileText, count: 1000 },
    { id: 'ai', name: 'AI Assistant', icon: Brain, count: 20 }
  ]

  const allResources = [
    {
      id: 'study-materials',
      title: 'Study Materials',
      description: 'Comprehensive notes, formula sheets, and reference materials for all GATE subjects',
      icon: BookOpenText,
      color: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-500',
      link: '/resources/study-materials',
      stats: '150+ Documents',
      featured: true,
      category: 'study-materials',
      tags: ['notes', 'formula', 'reference', 'study']
    },
    {
      id: 'previous-papers',
      title: 'Previous Papers',
      description: 'Access 20+ years of GATE question papers with solutions for all branches',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      iconColor: 'text-green-500',
      link: '/resources/previous-papers',
      stats: '1000+ Papers',
      featured: true,
      category: 'previous-papers',
      tags: ['papers', 'previous year', 'solutions', 'gate']
    },
    {
      id: 'interactive-videos',
      title: 'Interactive Videos',
      description: 'Engaging video lectures with interactive quizzes and problem-solving sessions',
      icon: Play,
      color: 'from-purple-500 to-purple-600',
      iconColor: 'text-purple-500',
      link: '/resources/interactive-videos',
      stats: '100+ Videos',
      featured: true,
      category: 'interactive-videos',
      tags: ['videos', 'lectures', 'tutorials', 'problem-solving']
    },
    {
      id: 'ai',
      title: 'AI Study Assistant',
      description: 'Personalized AI tutor for instant doubt solving',
      icon: Brain,
      color: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-500',
      link: 'https://gatewithme-aitutor.netlify.app/',
      isExternal: true,
      stats: '24/7 Availability',
      featured: true,
      category: 'ai',
      tags: ['ai', 'assistant', 'doubt solving', 'tutor']
    }
  ]

  // Filter resources based on search query and selected category
  const filteredResources = allResources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === 'all' || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Toggle save resource
  const toggleSaveResource = (resourceId) => {
    setSavedResources(prev => 
      prev.includes(resourceId)
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  // Handle resource click
  const handleResourceClick = (resource, e) => {
    if (resource.isExternal) {
      e.preventDefault();
      window.open(resource.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <BookOpen className="w-6 h-6" />
              <span className="font-semibold">Ultimate Learning Resources</span>
              <Brain className="w-6 h-6" />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Advanced Study
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Resources Hub
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Access comprehensive study materials, AI-powered learning tools, 
              and advanced resources for ultimate GATE preparation success.
            </p>

            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources, topics, or subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Quick Access
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Get started with our most popular resources
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allResources
              .filter(resource => resource.featured)
              .map((resource) => (
                <Link
                  key={resource.id}
                  to={resource.link}
                  onClick={(e) => handleResourceClick(resource, e)}
                  className={`block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 ${resource.color.replace('from-', 'border-')} ${resource.isExternal ? 'cursor-pointer' : ''}`}
                  target={resource.isExternal ? '_blank' : '_self'}
                  rel={resource.isExternal ? 'noopener noreferrer' : ''}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${resource.iconColor} bg-opacity-10`}>
                      <resource.icon className="w-6 h-6" />
                    </div>
                    {resource.isExternal && (
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                        External
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                    {resource.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {resource.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {resource.stats}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleSaveResource(resource.id);
                      }}
                      className={`p-1.5 rounded-full ${savedResources.includes(resource.id) ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                      aria-label={savedResources.includes(resource.id) ? 'Remove from saved' : 'Save for later'}
                    >
                      <Bookmark 
                        className={`w-5 h-5 ${savedResources.includes(resource.id) ? 'fill-current' : ''}`} 
                      />
                    </button>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                  selectedCategory === category.id
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Grid Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900/10 dark:to-blue-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              All Resources
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Browse our complete collection of GATE preparation resources
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      resource.color === 'from-blue-500 to-blue-600' && "bg-blue-100 text-blue-600 dark:bg-blue-900/20",
                      resource.color === 'from-green-500 to-green-600' && "bg-green-100 text-green-600 dark:bg-green-900/20",
                      resource.color === 'from-purple-500 to-purple-600' && "bg-purple-100 text-purple-600 dark:bg-purple-900/20"
                    )}>
                      <resource.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      {resource.stats}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {resource.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {resource.tags.slice(0, 3).map((tag, idx) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 mr-2 mb-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {resource.isExternal ? (
                      <a 
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium text-center"
                      >
                        Explore Now
                      </a>
                    ) : (
                      <Link 
                        to={resource.link}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium text-center"
                      >
                        Explore Now
                      </Link>
                    )}
                    <button 
                      onClick={() => toggleSaveResource(resource.id)}
                      className={cn(
                        "px-3 py-2 border rounded-lg transition-colors",
                        savedResources.includes(resource.id)
                          ? "border-yellow-500 text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                          : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      )}
                      aria-label={savedResources.includes(resource.id) ? 'Remove from saved' : 'Save resource'}
                    >
                      <Bookmark 
                        className={cn(
                          "w-4 h-4",
                          savedResources.includes(resource.id) && "fill-current"
                        )} 
                      />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  No resources found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Find the perfect resources for your study needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/resources?category=${category.id}`}
                className="block"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCategory(category.id);
                  // Scroll to resources section
                  document.getElementById('resources-grid')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 text-center hover:shadow-lg transition-all duration-300 h-full flex flex-col"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4",
                    selectedCategory === category.id 
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20" 
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  )}>
                    <category.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {category.count}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-auto">
                    Resources Available
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ResourcesPage
