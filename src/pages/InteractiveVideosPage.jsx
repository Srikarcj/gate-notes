import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Youtube, ExternalLink, Search } from 'lucide-react';

const branches = [
  {
    id: 'cse',
    name: 'Computer Science & Engineering',
    color: 'from-blue-600 to-indigo-600',
    channels: [
      {
        name: 'Gate Smashers',
        link: 'https://www.youtube.com/@GateSmashers',
        description: 'Full syllabus, problem-solving',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      },
      {
        name: 'Gate Lectures by Ravindrababu Ravula',
        link: 'https://www.youtube.com/@ravindrababu',
        description: 'In-depth lectures, clear explanations',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      },
      {
        name: 'NPTEL',
        link: 'https://www.youtube.com/@nptelhrd',
        description: 'IIT/IISc professors, all subjects',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      },
      {
        name: 'Made Easy',
        link: 'https://www.youtube.com/@madeeasy',
        description: 'Structured, subject-wise lectures',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      },
      {
        name: 'GATE Academy by Umesh Dhande',
        link: 'https://www.youtube.com/@gate_academy',
        description: 'Topic-wise, strategy sessions',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      },
      {
        name: 'Kreatryx GATE (by Unacademy)',
        link: 'https://www.youtube.com/@Kreatryx',
        description: 'Regular updates, top educators',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      }
    ]
  },
  {
    id: 'me',
    name: 'Mechanical Engineering',
    color: 'from-red-600 to-orange-600',
    channels: [
      {
        name: 'Unacademy GATE - ME, PI, XE',
        link: 'https://www.youtube.com/channel/UCrpELe0mluSZ8-2saJH5a0A/',
        description: 'GATE ME, PI, XE',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      },
      {
        name: 'NPTEL',
        link: 'https://www.youtube.com/@nptelhrd',
        description: 'IIT/IISc professors, all subjects',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      },
      {
        name: 'GATE Academy by Umesh Dhande',
        link: 'https://www.youtube.com/@gate_academy',
        description: 'Comprehensive ME lectures',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      },
      {
        name: 'Made Easy',
        link: 'https://www.youtube.com/@madeeasy',
        description: 'Subject-wise, exam strategies',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      },
      {
        name: 'Exergic (Official)',
        link: 'https://www.youtube.com/@ExergicOfficial',
        description: 'ME toppers, strategy, problem-solving',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      },
      {
        name: 'Last Moment Tuitions',
        link: 'https://www.youtube.com/@LastMomentTuitions',
        description: 'Quick revision, subject playlists',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      }
    ]
  },
  // Add other branches with their respective channels
  {
    id: 'ee',
    name: 'Electrical Engineering',
    color: 'from-yellow-500 to-amber-600',
    channels: [
      {
        name: 'GATE Wallah - EE, EC, CS & IN',
        link: 'https://www.youtube.com/@GATEWallah_EE_EC_CS_IN',
        description: 'EE, EC, CS, IN branches',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      },
      {
        name: 'Kreatryx GATE - EE, ECE & IN by Unacademy',
        link: 'https://www.youtube.com/channel/UCXFxwj7DwumpUu5RNWlznTw',
        description: 'EE, ECE, IN',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      },
      {
        name: 'eG Tutorials',
        link: 'https://www.youtube.com/@eGtutorials',
        description: 'Analog, digital, power electronics',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      }
    ]
  },
  {
    id: 'ce',
    name: 'Civil Engineering',
    color: 'from-green-600 to-emerald-600',
    channels: [
      {
        name: 'Let\'s Crack GATE & ESE Civil',
        link: 'https://www.youtube.com/channel/UCiS8ScW2hDTjK3emVMG-YPQ',
        description: 'Unacademy, full syllabus',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      },
      {
        name: 'Engineer4Free',
        link: 'https://www.youtube.com/@Engineer4Free',
        description: 'Free tutorials, basics to advanced',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      }
    ]
  },
  {
    id: 'ece',
    name: 'Electronics & Communication',
    color: 'from-purple-600 to-pink-600',
    channels: [
      {
        name: 'GATE Wallah - EE, EC, CS & IN',
        link: 'https://www.youtube.com/@GATEWallah_EE_EC_CS_IN',
        description: 'ECE, EE, CS, IN',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      },
      {
        name: 'Gatematic Education',
        link: 'https://www.youtube.com/@GatematicEducation',
        description: 'Power electronics, ECE topics',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      }
    ]
  },
  {
    id: 'in',
    name: 'Instrumentation Engineering',
    color: 'from-cyan-500 to-blue-600',
    channels: [
      {
        name: 'Instrumentation Academy',
        link: 'https://www.youtube.com/@InstrumentationAcademy',
        description: 'Control, sensors, measurement',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      },
      {
        name: 'Calibration Academy',
        link: 'https://www.youtube.com/@CalibrationAcademy',
        description: 'Calibration, interview questions',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      }
    ]
  },
  {
    id: 'ch',
    name: 'Chemical Engineering',
    color: 'from-red-500 to-pink-600',
    channels: [
      {
        name: 'Unacademy GATE - Chemical',
        link: 'https://www.youtube.com/channel/UCNqjUT43Y2kt-OC71URYX-w',
        description: 'GATE Chemical, ESE',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      },
      {
        name: 'Chemical Engineering Guy',
        link: 'https://www.youtube.com/channel/UCJam6x5jrQwZpQ3eQF6lY6A',
        description: 'Courses, ebooks, blogs',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      },
      {
        name: 'LearnChemE',
        link: 'https://www.youtube.com/@LearnChemE',
        description: 'University of Colorado Boulder, theory',
        logo: 'https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8QhmS4uVWw1L7aH=s176-c-k-c0x00ffffff-no-rj'
      }
    ]
  }
];

const InteractiveVideosPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBranch, setActiveBranch] = useState('all');

  const filteredBranches = branches.filter(branch => {
    // If no branch is selected or 'all' is selected, show all branches
    if (activeBranch === 'all') return true;
    return branch.id === activeBranch;
  });

  const filteredChannels = (channels) => {
    if (!searchQuery) return channels;
    
    const query = searchQuery.toLowerCase();
    return channels.filter(channel => 
      channel.name.toLowerCase().includes(query) || 
      channel.description.toLowerCase().includes(query)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/resources" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Resources
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Interactive Video Resources</h1>
            <div className="w-24"></div> {/* For alignment */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Search channels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveBranch('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeBranch === 'all' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                All Branches
              </button>
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => setActiveBranch(branch.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeBranch === branch.id 
                      ? `bg-gradient-to-r ${branch.color} text-white` 
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {branch.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Channels Grid */}
        <div className="space-y-12">
          {filteredBranches.map((branch) => (
            <div key={branch.id} className="space-y-4">
              <div className="flex items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{branch.name}</h2>
                <div className={`ml-4 h-1 flex-1 bg-gradient-to-r ${branch.color} rounded-full`}></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChannels(branch.channels).map((channel, index) => (
                  <motion.div
                    key={`${branch.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                          <img
                            className="h-full w-full object-cover"
                            src={channel.logo}
                            alt={channel.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                            {channel.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{channel.description}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <a
                          href={channel.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          <Youtube className="-ml-1 mr-2 h-5 w-5" />
                          Watch on YouTube
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {filteredChannels(branch.channels).length === 0 && (
                  <div className="col-span-3 py-8 text-center">
                    <div className="text-gray-400 dark:text-gray-500">
                      No channels found matching your search.
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InteractiveVideosPage;
