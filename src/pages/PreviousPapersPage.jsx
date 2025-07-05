import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  FileText, 
  Download, 
  ExternalLink,
  Search,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Clock,
  Calendar,
  FileSearch,
  GraduationCap,
  BookOpenCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PreviousPapersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBranch, setExpandedBranch] = useState('cse');
  const [savedPapers, setSavedPapers] = useState([]);

  const toggleBranch = (branch) => {
    setExpandedBranch(expandedBranch === branch ? null : branch);
  };

  const toggleSavePaper = (paperId) => {
    setSavedPapers(prev => 
      prev.includes(paperId)
        ? prev.filter(id => id !== paperId)
        : [...prev, paperId]
    );
  };

  const branches = [
    {
      id: 'all',
      name: 'All Branches',
      icon: GraduationCap,
      papers: [
        {
          id: 'all-1',
          title: 'GATE 2024 All Branches',
          year: 2024,
          type: 'Question Paper + Solution',
          link: 'https://www.selfstudys.com/',
          driveLink: 'https://www.selfstudys.com/'
        },
        {
          id: 'all-2',
          title: 'GATE 2023 All Branches',
          year: 2023,
          type: 'Question Paper + Solution',
          link: 'https://www.gateexam.info/gate-solved-previous-year-papers-all-branches/',
          driveLink: 'https://www.gateexam.info/gate-solved-previous-year-papers-all-branches/'
        },
        {
          id: 'all-3',
          title: 'GATE 2022 All Branches',
          year: 2022,
          type: 'Question Paper + Solution',
          link: 'https://www.pw.live/gate/exams/gate-previous-year-question-papers',
          driveLink: 'https://www.pw.live/gate/exams/gate-previous-year-question-papers'
        }
      ]
    },
    {
      id: 'cse',
      name: 'Computer Science (CSE/IT)',
      icon: FileText,
      papers: [
        {
          id: 'cse-1',
          title: 'GATE CSE 2024',
          year: 2024,
          type: 'Question Paper + Solution',
          link: 'https://gateoverflow.in/previous-years',
          driveLink: 'https://drive.google.com/drive/folders/1cizSKoqU8ihukDjUMPz7iSZUHkxfjHa7'
        },
        {
          id: 'cse-2',
          title: 'GATE CSE 2023',
          year: 2023,
          type: 'Question Paper + Solution',
          link: 'https://gateoverflow.in/previous-years',
          driveLink: 'https://drive.google.com/drive/folders/1cizSKoqU8ihukDjUMPz7iSZUHkxfjHa7'
        },
        {
          id: 'cse-3',
          title: 'GATE CSE 2022',
          year: 2022,
          type: 'Question Paper + Solution',
          link: 'https://gateoverflow.in/previous-years',
          driveLink: 'https://drive.google.com/drive/folders/1cizSKoqU8ihukDjUMPz7iSZUHkxfjHa7'
        }
      ]
    },
    {
      id: 'me',
      name: 'Mechanical Engineering (ME)',
      icon: FileText,
      papers: [
        {
          id: 'me-1',
          title: 'GATE ME 2024',
          year: 2024,
          type: 'Question Paper + Solution',
          link: 'https://www.selfstudys.com/gate/mechanical-engineering/online/exam/previous-year-paper-pdf',
          driveLink: 'https://www.selfstudys.com/gate/mechanical-engineering/online/exam/previous-year-paper-pdf'
        }
      ]
    },
    {
      id: 'ce',
      name: 'Civil Engineering (CE)',
      icon: FileText,
      papers: [
        {
          id: 'ce-1',
          title: 'GATE CE 2024',
          year: 2024,
          type: 'Question Paper + Solution',
          link: 'https://www.selfstudys.com/gate/civil-engineering/online/exam/previous-year-paper-pdf',
          driveLink: 'https://www.selfstudys.com/gate/civil-engineering/online/exam/previous-year-paper-pdf'
        }
      ]
    },
    {
      id: 'ee',
      name: 'Electrical Engineering (EE)',
      icon: FileText,
      papers: [
        {
          id: 'ee-1',
          title: 'GATE EE 2024',
          year: 2024,
          type: 'Question Paper + Solution',
          link: 'https://www.selfstudys.com/gate/electrical-engineering/online/exam/previous-year-paper-pdf',
          driveLink: 'https://www.selfstudys.com/gate/electrical-engineering/online/exam/previous-year-paper-pdf'
        }
      ]
    },
    {
      id: 'ece',
      name: 'Electronics & Communication (ECE)',
      icon: FileText,
      papers: [
        {
          id: 'ece-1',
          title: 'GATE ECE 2024',
          year: 2024,
          type: 'Question Paper + Solution',
          link: 'https://www.selfstudys.com/gate/electronics-communication-engineering/online/exam',
          driveLink: 'https://www.selfstudys.com/gate/electronics-communication-engineering/online/exam'
        }
      ]
    },
    {
      id: 'in',
      name: 'Instrumentation Engineering (IN)',
      icon: FileText,
      papers: [
        {
          id: 'in-1',
          title: 'GATE IN 2024',
          year: 2024,
          type: 'Question Paper + Solution',
          link: 'https://collegedunia.com/exams/gate/question-paper?utm_source=chatgpt.com',
          driveLink: 'https://collegedunia.com/exams/gate/question-paper?utm_source=chatgpt.com'
        }
      ]
    },
    {
      id: 'ch',
      name: 'Chemical Engineering (CH)',
      icon: FileText,
      papers: [
        {
          id: 'ch-1',
          title: 'GATE CH 2024',
          year: 2024,
          type: 'Question Paper + Solution',
          link: 'https://collegedunia.com/exams/gate/question-paper?utm_source=chatgpt.com',
          driveLink: 'https://collegedunia.com/exams/gate/question-paper?utm_source=chatgpt.com'
        }
      ]
    }
  ];

  const filteredBranches = branches.map(branch => ({
    ...branch,
    papers: branch.papers.filter(paper => 
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.year.toString().includes(searchQuery)
    )
  })).filter(branch => branch.papers.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <BookOpenCheck className="w-6 h-6" />
              <span className="font-semibold">GATE Previous Year Papers</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Access 20+ Years of
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                GATE Question Papers
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Find and download previous year GATE question papers with solutions for all branches.
              Practice with real exam papers to boost your preparation.
            </p>

            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search papers by year, branch, or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Branches</h2>
              <div className="space-y-2">
                {branches.map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() => {
                      const element = document.getElementById(`branch-${branch.id}`);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      expandedBranch === branch.id
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <branch.icon className="w-4 h-4" />
                      <span>{branch.name}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Saved Papers
                </h3>
                {savedPapers.length > 0 ? (
                  <div className="space-y-2">
                    {savedPapers.map(paperId => {
                      const paper = branches
                        .flatMap(branch => branch.papers)
                        .find(p => p.id === paperId);
                      
                      if (!paper) return null;
                      
                      return (
                        <a
                          key={paper.id}
                          href={paper.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                        >
                          <div className="truncate">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {paper.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {paper.year} • {paper.type}
                            </p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Bookmark className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Save papers to access them here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Papers List */}
          <div className="md:col-span-3 space-y-8">
            {filteredBranches.map((branch) => (
              <div key={branch.id} id={`branch-${branch.id}`} className="scroll-mt-20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <branch.icon className="w-6 h-6 text-blue-500" />
                    {branch.name}
                  </h2>
                  <button
                    onClick={() => toggleBranch(branch.id)}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {expandedBranch === branch.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {(expandedBranch === branch.id || searchQuery) && (
                  <div className="space-y-4">
                    {branch.papers.length > 0 ? (
                      branch.papers.map((paper) => (
                        <motion.div
                          key={paper.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="p-5">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {paper.title}
                                  </h3>
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    {paper.year}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                  {paper.type}
                                </p>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-4">
                                  <span className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {paper.year}
                                  </span>
                                  <span className="flex items-center">
                                    <FileText className="w-4 h-4 mr-1" />
                                    PDF
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col space-y-2 ml-4">
                                <button
                                  onClick={() => toggleSavePaper(paper.id)}
                                  className={`p-2 rounded-lg ${
                                    savedPapers.includes(paper.id)
                                      ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                                      : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                                  }`}
                                  title={savedPapers.includes(paper.id) ? 'Remove from saved' : 'Save paper'}
                                >
                                  <Bookmark
                                    className={`w-5 h-5 ${
                                      savedPapers.includes(paper.id) ? 'fill-current' : ''
                                    }`}
                                  />
                                </button>
                              </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-3">
                              <a
                                href={paper.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <FileSearch className="w-4 h-4 mr-2" />
                                View Paper
                              </a>
                              <a
                                href={paper.driveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-xl">
                        <FileSearch className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                          No papers found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Try adjusting your search or filter to find what you're looking for.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to ace your GATE exam?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Access more study materials, mock tests, and expert guidance to boost your preparation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/resources"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              Explore More Resources
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
            <Link
              to="/study-materials"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              View Study Materials
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PreviousPapersPage;
