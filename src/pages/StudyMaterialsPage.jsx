import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Download, 
  Search, 
  ChevronDown, 
  ChevronUp,
  Bookmark,
  ArrowUpRight,
  FileText,
  BookOpenText,
  BookA,
  BookKey,
  BookType,
  Cpu,
  Video,
  FlaskConical,
  CircuitBoard,
  Database,
  Network,
  Code2,
  GraduationCap,
  ExternalLink,
  Github,
  BookMarked,
  Cog,
  BookCheck,
  BookPlus,
  BookTemplate
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudyMaterialsPage = () => {
  const [expandedBranch, setExpandedBranch] = useState('cse');
  const [searchQuery, setSearchQuery] = useState('');

  const branches = [
    {
      id: 'cse',
      name: 'Computer Science & IT (CSE/IT)',
      icon: <Code2 className="w-5 h-5" />,
      materials: [
        { 
          title: 'Reddit Topper Drive (AIR-100 & AIR-131)', 
          description: 'Handwritten notes and past papers from top rankers',
          type: 'Notes & Papers',
          format: 'PDF/Drive',
          source: 'Reddit Community',
          url: 'https://drive.google.com/drive/folders/1_Y5ifg_kljqmOyIJqBwe5y0MkEX8tOi7?usp=sharing',
          icon: <GraduationCap className="w-4 h-4" />
        },
        { 
          title: 'GitHub Collection (Aparnaraha)', 
          description: 'CSE notes by Joyoshish, Ribhu, and more',
          type: 'Notes Collection',
          format: 'GitHub/Drive',
          source: 'GitHub Community',
          url: 'https://drive.google.com/drive/folders/1ee-az_S07Gju0OexmlJb69rOl2UsE8vn',
          icon: <Github className="w-4 h-4" />
        },
        { 
          title: 'Additional Resources Drive', 
          description: 'Supplementary study materials and resources',
          type: 'Study Materials',
          format: 'PDF/Drive',
          source: 'Community',
          url: 'https://drive.google.com/drive/folders/1GQIPcmeRrUn2BCesfxK2re33Cp7rHz-v',
          icon: <BookOpenText className="w-4 h-4" />
        },
        {
          title: 'Comprehensive CSE/IT Resources',
          description: 'Complete collection of notes, PYQs, and mock tests',
          type: 'Full Package',
          format: 'PDF/Drive',
          source: 'Multiple Sources',
          url: 'https://drive.google.com/drive/folders/1GQIPcmeRrUn2BCesfxK2re33Cp7rHz-v',
          icon: <BookTemplate className="w-4 h-4" />
        }
      ]
    },
    {
      id: 'me',
      name: 'Mechanical Engineering (ME)',
      icon: <Cog className="w-5 h-5" />,
      materials: [
        { 
          title: 'PW GATE ME Notes', 
          description: 'Comprehensive notes for all ME subjects',
          type: 'Study Material',
          format: 'PDF',
          source: 'Physics Wallah',
          url: 'https://www.selfstudys.com/page/gate-mechanical-engineering-notes',
          icon: <BookOpenText className="w-4 h-4" />
        },
        { 
          title: 'SelfStudys ME PDFs', 
          description: 'Subject-wise notes and mock tests',
          type: 'Notes & Tests',
          format: 'PDF',
          source: 'SelfStudys',
          url: 'https://www.selfstudys.com/page/gate-mechanical-engineering-notes',
          icon: <BookMarked className="w-4 h-4" />
        }
      ]
    },
    {
      id: 'ce',
      name: 'Civil Engineering (CE)',
      icon: <BookCheck className="w-5 h-5" />,
      materials: [
        { 
          title: 'SelfStudys CE PDFs', 
          description: 'Comprehensive notes for all CE subjects',
          type: 'Study Material',
          format: 'PDF',
          source: 'SelfStudys',
          url: 'https://www.scribd.com/document/421971675/Links-for-Civil-Branch-for-GATE-IES-materials-pdf-1-pdf',
          icon: <BookOpenText className="w-4 h-4" />
        },
        { 
          title: 'GATExplore CE Material', 
          description: 'Complete study package with PYQs and tests',
          type: 'Full Package',
          format: 'PDF',
          source: 'GATExplore',
          url: 'https://www.scribd.com/document/421971675/Links-for-Civil-Branch-for-GATE-IES-materials-pdf-1-pdf',
          icon: <BookA className="w-4 h-4" />
        }
      ]
    },
    {
      id: 'ee',
      name: 'Electrical Engineering (EE)',
      icon: <CircuitBoard className="w-5 h-5" />,
      materials: [
        { 
          title: 'SelfStudys EE PDFs', 
          description: 'Comprehensive notes for all EE subjects',
          type: 'Study Material',
          format: 'PDF',
          source: 'SelfStudys',
          url: 'https://www.selfstudys.com/page/gate-electrical-engineering-notes',
          icon: <BookOpenText className="w-4 h-4" />
        },
        { 
          title: 'PW GATE EE Notes', 
          description: 'Complete package with PYQs and mock tests',
          type: 'Full Package',
          format: 'PDF',
          source: 'Physics Wallah',
          url: 'https://www.selfstudys.com/page/gate-electrical-engineering-notes',
          icon: <BookA className="w-4 h-4" />
        }
      ]
    },
    {
      id: 'ece',
      name: 'Electronics & Communication (ECE)',
      icon: <Cpu className="w-5 h-5" />,
      materials: [
        { 
          title: 'SelfStudys ECE PDFs', 
          description: 'Comprehensive notes for all ECE subjects',
          type: 'Study Material',
          format: 'PDF',
          source: 'SelfStudys',
          url: 'https://www.selfstudys.com/page/gate-electronics-communication-engineering-notes#google_vignette',
          icon: <BookOpenText className="w-4 h-4" />
        },
        { 
          title: 'PW GATE EC Notes', 
          description: 'Complete package with PYQs and mock tests',
          type: 'Full Package',
          format: 'PDF',
          source: 'Physics Wallah',
          url: 'https://www.selfstudys.com/page/gate-electronics-communication-engineering-notes#google_vignette',
          icon: <BookA className="w-4 h-4" />
        }
      ]
    },
    {
      id: 'ch',
      name: 'Chemical Engineering (CH)',
      icon: <FlaskConical className="w-5 h-5" />,
      materials: [
        { 
          title: 'GATExplore CH Material', 
          description: 'Comprehensive study material for CH',
          type: 'Study Material',
          format: 'PDF',
          source: 'GATExplore',
          url: 'https://drive.google.com/drive/folders/1YgbRHC4dKyHUkO-hVBvX4wqwZlAnqZDv',
          icon: <BookOpenText className="w-4 h-4" />
        },
        { 
          title: 'SelfStudys CH PDFs', 
          description: 'Complete package with PYQs and mock tests',
          type: 'Full Package',
          format: 'PDF',
          source: 'SelfStudys',
          url: 'https://drive.google.com/drive/folders/1YgbRHC4dKyHUkO-hVBvX4wqwZlAnqZDv',
          icon: <BookA className="w-4 h-4" />
        }
      ]
    },
    {
      id: 'in',
      name: 'Instrumentation (IN)',
      icon: <Video className="w-5 h-5" />,
      materials: [
        { 
          title: 'SelfStudys IN PDFs', 
          description: 'Comprehensive notes for all IN subjects',
          type: 'Study Material',
          format: 'PDF',
          source: 'SelfStudys',
          url: 'https://drive.google.com/file/d/1-kQ1r8iPQi50iFsSTZ7coz4RegS4wV57/view',
          icon: <BookOpenText className="w-4 h-4" />
        }
      ]
    }
  ];

  const filteredBranches = branches.filter(branch => 
    branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.materials.some(material => 
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const toggleBranch = (branchId) => {
    setExpandedBranch(expandedBranch === branchId ? null : branchId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <BookOpen className="w-6 h-6" />
              <span className="font-semibold">Ultimate Study Resources</span>
              <GraduationCap className="w-6 h-6" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              GATE Study Materials
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Branch-wise Collection
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Access comprehensive study materials, previous year papers, and expert-curated resources for all GATE branches.
            </p>

            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search branches, subjects, or resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {filteredBranches.map((branch) => (
            <motion.div 
              key={branch.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => toggleBranch(branch.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                    {branch.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {branch.name}
                  </h2>
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  {expandedBranch === branch.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {expandedBranch === branch.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {branch.materials.map((material, index) => (
                        <motion.div
                          key={index}
                          className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -2 }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                {material.icon || <FileText className="w-4 h-4" />}
                              </div>
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                {material.type}
                              </span>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                              <Bookmark className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {material.title}
                          </h3>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            {material.description}
                          </p>
                          
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Source: {material.source}
                            </span>
                            <a
                              href={material.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                            >
                              {material.format.includes('http') ? 'Open Link' : 'Download'}
                              <ExternalLink className="ml-1 w-4 h-4" />
                            </a>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            We're constantly updating our resources. Check back soon for more study materials or request specific resources.
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Request Resources
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyMaterialsPage;
