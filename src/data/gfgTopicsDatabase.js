// Comprehensive GeeksforGeeks-style topic database for all branches and subjects
export const gfgTopicsDatabase = {
  // Computer Science & Engineering
  'Computer Science & Engineering': {
    'Data Structures & Algorithms': {
      icon: 'Code',
      description: 'Master fundamental data structures and algorithms essential for programming and problem-solving',
      difficulty: 'Medium',
      estimatedTime: '120 hours',
      topics: {
        'Arrays': {
          difficulty: 'Easy',
          importance: 'High',
          gateWeight: '8-10 marks',
          prerequisites: ['Basic Programming'],
          description: 'Linear data structure storing elements in contiguous memory locations',
          subtopics: [
            'Array Declaration and Initialization',
            'Array Operations (Insert, Delete, Search)',
            'Multi-dimensional Arrays',
            'Dynamic Arrays',
            'Array Algorithms (Sorting, Searching)',
            'Time and Space Complexity Analysis'
          ],
          theory: {
            overview: 'Arrays are the most fundamental data structure in computer science. They store elements of the same type in contiguous memory locations, providing O(1) random access time.',
            keyPoints: [
              'Fixed size collection of homogeneous elements',
              'Elements accessed using index (0-based in most languages)',
              'Contiguous memory allocation enables cache-friendly operations',
              'Time Complexity: Access O(1), Search O(n), Insert/Delete O(n)'
            ],
            applications: [
              'Implementation of other data structures',
              'Matrix operations and mathematical computations',
              'Lookup tables and hash table implementations',
              'Buffer management in operating systems'
            ],
            sections: [
              {
                title: 'Array Fundamentals',
                content: `Arrays are collections of elements stored in contiguous memory locations. Each element can be accessed directly using its index, making arrays one of the most efficient data structures for random access operations.

**Memory Layout:**
- Elements are stored consecutively in memory
- Address calculation: base_address + (index × element_size)
- Cache-friendly due to spatial locality

**Key Characteristics:**
- Homogeneous: All elements must be of the same data type
- Fixed size: Size determined at declaration time
- Zero-based indexing: First element at index 0
- Direct access: O(1) time complexity for element access`
              },
              {
                title: 'Array Operations',
                content: `**Basic Operations:**

1. **Declaration and Initialization**
\`\`\`c
int arr[5];                    // Declaration
int arr[5] = {1, 2, 3, 4, 5}; // Initialization
\`\`\`

2. **Element Access**
\`\`\`c
int value = arr[2];  // Read element at index 2
arr[0] = 10;         // Write to element at index 0
\`\`\`

3. **Traversal**
\`\`\`c
for(int i = 0; i < size; i++) {
    printf("%d ", arr[i]);
}
\`\`\`

**Time Complexities:**
- Access: O(1)
- Search: O(n)
- Insertion: O(n) - requires shifting
- Deletion: O(n) - requires shifting`
              }
            ]
          },
          practiceProblems: [
            {
              id: 'array_rotation',
              title: 'Array Rotation',
              difficulty: 'Medium',
              description: 'Rotate an array to the right by k steps',
              gateRelevance: 'High',
              companies: ['Google', 'Microsoft', 'Amazon']
            },
            {
              id: 'two_sum',
              title: 'Two Sum Problem',
              difficulty: 'Easy',
              description: 'Find two numbers in array that add up to target',
              gateRelevance: 'High',
              companies: ['Facebook', 'Apple', 'Netflix']
            },
            {
              id: 'max_subarray',
              title: 'Maximum Subarray Sum',
              difficulty: 'Medium',
              description: 'Find contiguous subarray with maximum sum',
              gateRelevance: 'High',
              companies: ['Google', 'Amazon', 'Microsoft']
            }
          ],
          quiz: [
            {
              question: 'What is the time complexity of accessing an element in an array by index?',
              options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
              correct: 0,
              explanation: 'Arrays provide constant time access using index calculation: base_address + (index × element_size). Since this is a simple arithmetic operation, it takes constant time regardless of array size.',
              difficulty: 'Easy',
              topic: 'Time Complexity'
            },
            {
              question: 'Which operation is most efficient on arrays?',
              options: ['Insertion at beginning', 'Deletion from middle', 'Random access', 'Dynamic resizing'],
              correct: 2,
              explanation: 'Random access is O(1) due to direct indexing, while insertion and deletion require shifting elements (O(n)), and dynamic resizing involves creating a new array and copying elements.',
              difficulty: 'Easy',
              topic: 'Array Operations'
            },
            {
              question: 'In a 0-indexed array of size n, what is the valid range of indices?',
              options: ['1 to n', '0 to n', '0 to n-1', '1 to n-1'],
              correct: 2,
              explanation: 'In 0-indexed arrays, indices start from 0 and go up to n-1, where n is the size of the array. Accessing index n would result in an out-of-bounds error.',
              difficulty: 'Easy',
              topic: 'Array Indexing'
            },
            {
              question: 'What happens when you access an array element beyond its bounds in C?',
              options: ['Compilation error', 'Runtime exception', 'Undefined behavior', 'Returns null'],
              correct: 2,
              explanation: 'C does not perform bounds checking, so accessing beyond array bounds leads to undefined behavior. This can cause crashes, security vulnerabilities, or unpredictable program behavior.',
              difficulty: 'Medium',
              topic: 'Memory Safety'
            },
            {
              question: 'Which of the following is NOT an advantage of arrays?',
              options: ['Random access to elements', 'Cache-friendly memory layout', 'Dynamic size', 'Simple implementation'],
              correct: 2,
              explanation: 'Arrays have a fixed size that must be determined at compile time or creation time. Dynamic sizing is actually a disadvantage of arrays compared to dynamic data structures like linked lists.',
              difficulty: 'Medium',
              topic: 'Array Characteristics'
            }
          ]
        },
        'Linked Lists': {
          difficulty: 'Easy',
          importance: 'High',
          gateWeight: '6-8 marks',
          prerequisites: ['Pointers', 'Dynamic Memory Allocation'],
          description: 'Linear data structure with nodes containing data and references to next nodes',
          subtopics: [
            'Singly Linked Lists',
            'Doubly Linked Lists',
            'Circular Linked Lists',
            'Linked List Operations',
            'Applications of Linked Lists',
            'Comparison with Arrays'
          ],
          theory: {
            overview: 'Linked Lists are dynamic data structures where elements (nodes) are stored in sequence, with each node containing data and a reference to the next node.',
            keyPoints: [
              'Dynamic size - can grow or shrink during runtime',
              'Non-contiguous memory allocation',
              'Efficient insertion and deletion at known positions',
              'Sequential access - must traverse from head to reach elements'
            ],
            applications: [
              'Implementation of stacks and queues',
              'Undo functionality in applications',
              'Music playlist management',
              'Memory management in operating systems'
            ],
            sections: [
              {
                title: 'Linked List Structure',
                content: `A linked list consists of nodes, where each node contains:
1. **Data**: The actual information stored
2. **Next**: A pointer/reference to the next node

**Node Structure:**
\`\`\`c
struct Node {
    int data;           // Data part
    struct Node* next;  // Pointer to next node
};
\`\`\`

**Types of Linked Lists:**
- **Singly Linked List**: Each node points to the next node
- **Doubly Linked List**: Each node has pointers to both next and previous nodes
- **Circular Linked List**: Last node points back to the first node`
              },
              {
                title: 'Basic Operations',
                content: `**1. Insertion Operations**
\`\`\`c
// Insert at beginning
struct Node* insertAtBeginning(struct Node* head, int data) {
    struct Node* newNode = createNode(data);
    newNode->next = head;
    return newNode;  // New head
}
\`\`\`

**2. Deletion Operations**
\`\`\`c
// Delete first occurrence of key
struct Node* deleteNode(struct Node* head, int key) {
    if (head == NULL) return NULL;

    if (head->data == key) {
        struct Node* temp = head;
        head = head->next;
        free(temp);
        return head;
    }

    struct Node* current = head;
    while (current->next && current->next->data != key) {
        current = current->next;
    }

    if (current->next) {
        struct Node* temp = current->next;
        current->next = current->next->next;
        free(temp);
    }

    return head;
}
\`\`\`

**Time Complexities:**
- Access: O(n)
- Search: O(n)
- Insertion: O(1) at known position, O(n) to find position
- Deletion: O(1) at known position, O(n) to find position`
              }
            ]
          },
          practiceProblems: [
            {
              id: 'reverse_linked_list',
              title: 'Reverse Linked List',
              difficulty: 'Easy',
              description: 'Reverse a singly linked list iteratively and recursively',
              gateRelevance: 'High',
              companies: ['Microsoft', 'Amazon', 'Facebook']
            },
            {
              id: 'detect_cycle',
              title: 'Detect Cycle in Linked List',
              difficulty: 'Medium',
              description: 'Detect if linked list has a cycle using Floyd\'s algorithm',
              gateRelevance: 'High',
              companies: ['Google', 'Apple', 'Netflix']
            }
          ]
        },
        'Stacks': {
          difficulty: 'Easy',
          importance: 'High',
          gateWeight: '4-6 marks',
          prerequisites: ['Arrays', 'Linked Lists'],
          description: 'LIFO (Last In First Out) data structure with push and pop operations',
          subtopics: [
            'Stack Operations (Push, Pop, Peek)',
            'Stack Implementation using Arrays',
            'Stack Implementation using Linked Lists',
            'Applications of Stacks',
            'Expression Evaluation',
            'Balanced Parentheses Problem'
          ]
        },
        'Queues': {
          difficulty: 'Easy',
          importance: 'High',
          gateWeight: '4-6 marks',
          prerequisites: ['Arrays', 'Linked Lists'],
          description: 'FIFO (First In First Out) data structure with enqueue and dequeue operations',
          subtopics: [
            'Queue Operations (Enqueue, Dequeue)',
            'Circular Queue',
            'Priority Queue',
            'Double-ended Queue (Deque)',
            'Queue Applications',
            'Implementation Techniques'
          ]
        },
        'Trees': {
          difficulty: 'Medium',
          importance: 'Very High',
          gateWeight: '12-15 marks',
          prerequisites: ['Recursion', 'Pointers'],
          description: 'Hierarchical data structure with nodes connected by edges',
          subtopics: [
            'Binary Trees',
            'Binary Search Trees (BST)',
            'Tree Traversals (Inorder, Preorder, Postorder)',
            'AVL Trees',
            'Red-Black Trees',
            'B-Trees and B+ Trees',
            'Heap Data Structure',
            'Tree Applications'
          ]
        },
        'Graphs': {
          difficulty: 'Hard',
          importance: 'Very High',
          gateWeight: '15-20 marks',
          prerequisites: ['Trees', 'Queues', 'Stacks'],
          description: 'Non-linear data structure consisting of vertices connected by edges',
          subtopics: [
            'Graph Representation (Adjacency Matrix, Adjacency List)',
            'Graph Traversals (BFS, DFS)',
            'Shortest Path Algorithms (Dijkstra, Floyd-Warshall)',
            'Minimum Spanning Tree (Kruskal, Prim)',
            'Topological Sorting',
            'Strongly Connected Components',
            'Graph Coloring',
            'Network Flow Algorithms'
          ]
        },
        'Hashing': {
          difficulty: 'Medium',
          importance: 'High',
          gateWeight: '8-10 marks',
          prerequisites: ['Arrays', 'Linked Lists'],
          description: 'Technique to map data to fixed-size values using hash functions',
          subtopics: [
            'Hash Functions',
            'Collision Resolution Techniques',
            'Open Addressing vs Chaining',
            'Hash Table Implementation',
            'Applications of Hashing',
            'Cryptographic Hash Functions'
          ]
        },
        'Sorting Algorithms': {
          difficulty: 'Medium',
          importance: 'High',
          gateWeight: '8-12 marks',
          prerequisites: ['Arrays', 'Recursion'],
          description: 'Algorithms to arrange data elements in specific order',
          subtopics: [
            'Bubble Sort',
            'Selection Sort',
            'Insertion Sort',
            'Merge Sort',
            'Quick Sort',
            'Heap Sort',
            'Counting Sort',
            'Radix Sort',
            'External Sorting'
          ]
        },
        'Searching Algorithms': {
          difficulty: 'Easy',
          importance: 'High',
          gateWeight: '4-6 marks',
          prerequisites: ['Arrays', 'Sorting'],
          description: 'Algorithms to find specific elements in data structures',
          subtopics: [
            'Linear Search',
            'Binary Search',
            'Interpolation Search',
            'Exponential Search',
            'Ternary Search',
            'Search in Rotated Arrays'
          ]
        },
        'Dynamic Programming': {
          difficulty: 'Hard',
          importance: 'Very High',
          gateWeight: '15-20 marks',
          prerequisites: ['Recursion', 'Mathematical Analysis'],
          description: 'Optimization technique solving complex problems by breaking into subproblems',
          subtopics: [
            'Overlapping Subproblems',
            'Optimal Substructure',
            'Memoization vs Tabulation',
            'Classic DP Problems (Knapsack, LCS, LIS)',
            'DP on Trees',
            'DP on Graphs',
            'Space Optimization Techniques'
          ]
        }
      }
    },
    'Computer Networks': {
      icon: 'Globe',
      description: 'Understand network protocols, architectures, and communication systems',
      difficulty: 'Medium',
      estimatedTime: '80 hours',
      topics: {
        'OSI Model': {
          difficulty: 'Easy',
          importance: 'Very High',
          gateWeight: '8-10 marks',
          prerequisites: ['Basic Networking Concepts'],
          description: 'Seven-layer conceptual framework for network communication',
          subtopics: [
            'Physical Layer',
            'Data Link Layer',
            'Network Layer',
            'Transport Layer',
            'Session Layer',
            'Presentation Layer',
            'Application Layer',
            'Layer Interactions and Data Flow'
          ]
        },
        'TCP/IP Protocol Suite': {
          difficulty: 'Medium',
          importance: 'Very High',
          gateWeight: '12-15 marks',
          prerequisites: ['OSI Model'],
          description: 'Internet protocol suite for network communication',
          subtopics: [
            'TCP vs UDP',
            'IP Addressing and Subnetting',
            'IPv4 vs IPv6',
            'TCP Connection Management',
            'Flow Control and Congestion Control',
            'Error Detection and Correction',
            'Network Address Translation (NAT)'
          ]
        },
        'Routing Algorithms': {
          difficulty: 'Medium',
          importance: 'High',
          gateWeight: '8-12 marks',
          prerequisites: ['Graph Algorithms', 'Network Layer'],
          description: 'Algorithms for finding optimal paths in networks',
          subtopics: [
            'Distance Vector Routing (RIP)',
            'Link State Routing (OSPF)',
            'Path Vector Routing (BGP)',
            'Shortest Path Algorithms in Networks',
            'Routing Table Management',
            'Inter-domain vs Intra-domain Routing'
          ]
        }
      }
    },
    'Operating Systems': {
      icon: 'Monitor',
      description: 'Learn system software that manages computer hardware and software resources',
      difficulty: 'Medium',
      estimatedTime: '100 hours',
      topics: {
        'Process Management': {
          difficulty: 'Medium',
          importance: 'Very High',
          gateWeight: '15-20 marks',
          prerequisites: ['System Programming'],
          description: 'Management of processes and their execution in operating systems',
          subtopics: [
            'Process States and Transitions',
            'Process Control Block (PCB)',
            'Process Scheduling Algorithms',
            'Inter-process Communication (IPC)',
            'Process Synchronization',
            'Deadlock Detection and Prevention',
            'Thread Management'
          ]
        },
        'Memory Management': {
          difficulty: 'Medium',
          importance: 'Very High',
          gateWeight: '12-15 marks',
          prerequisites: ['Computer Architecture'],
          description: 'Techniques for managing computer memory efficiently',
          subtopics: [
            'Memory Allocation Strategies',
            'Paging and Segmentation',
            'Virtual Memory',
            'Page Replacement Algorithms',
            'Memory Protection',
            'Garbage Collection'
          ]
        },
        'File Systems': {
          difficulty: 'Medium',
          importance: 'High',
          gateWeight: '8-10 marks',
          prerequisites: ['Storage Systems'],
          description: 'Methods for storing and organizing files on storage devices',
          subtopics: [
            'File System Structure',
            'File Allocation Methods',
            'Directory Implementation',
            'File System Performance',
            'Journaling File Systems',
            'Distributed File Systems'
          ]
        }
      }
    },
    'Database Management Systems': {
      icon: 'Database',
      description: 'Study database design, implementation, and management principles',
      difficulty: 'Medium',
      estimatedTime: '90 hours',
      topics: {
        'Relational Model': {
          difficulty: 'Easy',
          importance: 'Very High',
          gateWeight: '10-12 marks',
          prerequisites: ['Set Theory', 'Mathematical Logic'],
          description: 'Foundation of modern database systems using tables and relationships',
          subtopics: [
            'Relations, Tuples, and Attributes',
            'Keys (Primary, Foreign, Candidate)',
            'Relational Algebra',
            'Relational Calculus',
            'Functional Dependencies',
            'Normalization (1NF, 2NF, 3NF, BCNF)'
          ]
        },
        'SQL': {
          difficulty: 'Easy',
          importance: 'High',
          gateWeight: '8-10 marks',
          prerequisites: ['Relational Model'],
          description: 'Structured Query Language for database operations',
          subtopics: [
            'DDL (Data Definition Language)',
            'DML (Data Manipulation Language)',
            'DCL (Data Control Language)',
            'Joins and Subqueries',
            'Aggregate Functions',
            'Views and Indexes',
            'Stored Procedures and Triggers'
          ]
        },
        'Transaction Management': {
          difficulty: 'Medium',
          importance: 'High',
          gateWeight: '8-12 marks',
          prerequisites: ['Concurrency Control'],
          description: 'Ensuring database consistency and reliability',
          subtopics: [
            'ACID Properties',
            'Transaction States',
            'Concurrency Control Protocols',
            'Locking Mechanisms',
            'Deadlock Handling',
            'Recovery Techniques'
          ]
        }
      }
    }
  },

  // Electronics & Communication Engineering
  'Electronics & Communication Engineering': {
    'Digital Electronics': {
      icon: 'Cpu',
      description: 'Study digital circuits, logic gates, and digital system design',
      difficulty: 'Medium',
      estimatedTime: '80 hours',
      topics: {
        'Number Systems': {
          difficulty: 'Easy',
          importance: 'High',
          gateWeight: '4-6 marks',
          prerequisites: ['Basic Mathematics'],
          description: 'Different number systems and their conversions',
          subtopics: [
            'Binary Number System',
            'Octal Number System',
            'Hexadecimal Number System',
            'Number System Conversions',
            'Binary Arithmetic',
            'Signed Number Representations'
          ]
        },
        'Boolean Algebra': {
          difficulty: 'Easy',
          importance: 'High',
          gateWeight: '6-8 marks',
          prerequisites: ['Number Systems'],
          description: 'Mathematical structure for logical operations',
          subtopics: [
            'Boolean Variables and Functions',
            'Basic Boolean Operations',
            'Boolean Laws and Theorems',
            'Karnaugh Maps',
            'Logic Minimization',
            'Don\'t Care Conditions'
          ]
        },
        'Logic Gates': {
          difficulty: 'Easy',
          importance: 'Very High',
          gateWeight: '8-10 marks',
          prerequisites: ['Boolean Algebra'],
          description: 'Basic building blocks of digital circuits',
          subtopics: [
            'Basic Gates (AND, OR, NOT)',
            'Universal Gates (NAND, NOR)',
            'Exclusive Gates (XOR, XNOR)',
            'Gate Characteristics',
            'Fan-in and Fan-out',
            'Propagation Delay'
          ]
        }
      }
    },
    'Analog Electronics': {
      icon: 'Zap',
      description: 'Study analog circuits, amplifiers, and signal processing',
      difficulty: 'Hard',
      estimatedTime: '120 hours',
      topics: {
        'Diodes': {
          difficulty: 'Medium',
          importance: 'High',
          gateWeight: '8-10 marks',
          prerequisites: ['Semiconductor Physics'],
          description: 'Two-terminal electronic components with nonlinear characteristics',
          subtopics: [
            'PN Junction Diode',
            'Diode Characteristics',
            'Diode Applications',
            'Zener Diodes',
            'Special Purpose Diodes',
            'Diode Circuits and Analysis'
          ]
        },
        'Transistors': {
          difficulty: 'Hard',
          importance: 'Very High',
          gateWeight: '15-20 marks',
          prerequisites: ['Diodes'],
          description: 'Three-terminal semiconductor devices for amplification and switching',
          subtopics: [
            'BJT (Bipolar Junction Transistor)',
            'FET (Field Effect Transistor)',
            'MOSFET',
            'Transistor Biasing',
            'Small Signal Analysis',
            'Frequency Response'
          ]
        }
      }
    },
    'Communication Systems': {
      icon: 'Radio',
      description: 'Learn principles of analog and digital communication',
      difficulty: 'Hard',
      estimatedTime: '100 hours',
      topics: {
        'Modulation Techniques': {
          difficulty: 'Medium',
          importance: 'Very High',
          gateWeight: '12-15 marks',
          prerequisites: ['Signals and Systems'],
          description: 'Techniques for encoding information onto carrier signals',
          subtopics: [
            'Amplitude Modulation (AM)',
            'Frequency Modulation (FM)',
            'Phase Modulation (PM)',
            'Digital Modulation (ASK, FSK, PSK)',
            'Quadrature Amplitude Modulation (QAM)',
            'Modulation Performance Analysis'
          ]
        }
      }
    }
  },

  // Electrical Engineering
  'Electrical Engineering': {
    'Electric Circuits': {
      icon: 'Zap',
      description: 'Fundamental principles of electrical circuits and network analysis',
      difficulty: 'Medium',
      estimatedTime: '90 hours',
      topics: {
        'Circuit Elements': {
          difficulty: 'Easy',
          importance: 'Very High',
          gateWeight: '8-10 marks',
          prerequisites: ['Basic Physics'],
          description: 'Basic components of electrical circuits',
          subtopics: [
            'Resistors, Inductors, Capacitors',
            'Voltage and Current Sources',
            'Dependent Sources',
            'Kirchhoff\'s Laws',
            'Ohm\'s Law',
            'Power and Energy'
          ]
        },
        'Network Theorems': {
          difficulty: 'Medium',
          importance: 'High',
          gateWeight: '10-12 marks',
          prerequisites: ['Circuit Elements'],
          description: 'Fundamental theorems for circuit analysis',
          subtopics: [
            'Thevenin\'s Theorem',
            'Norton\'s Theorem',
            'Superposition Theorem',
            'Maximum Power Transfer',
            'Reciprocity Theorem',
            'Substitution Theorem'
          ]
        }
      }
    },
    'Power Systems': {
      icon: 'Battery',
      description: 'Generation, transmission, and distribution of electrical power',
      difficulty: 'Hard',
      estimatedTime: '120 hours',
      topics: {
        'Power Generation': {
          difficulty: 'Medium',
          importance: 'High',
          gateWeight: '8-12 marks',
          prerequisites: ['Electromagnetic Theory'],
          description: 'Methods and systems for electrical power generation',
          subtopics: [
            'Thermal Power Plants',
            'Hydroelectric Power',
            'Nuclear Power',
            'Renewable Energy Sources',
            'Generator Principles',
            'Power Plant Economics'
          ]
        }
      }
    },
    'Control Systems': {
      icon: 'Settings',
      description: 'Analysis and design of automatic control systems',
      difficulty: 'Hard',
      estimatedTime: '100 hours',
      topics: {
        'System Modeling': {
          difficulty: 'Medium',
          importance: 'Very High',
          gateWeight: '12-15 marks',
          prerequisites: ['Differential Equations', 'Laplace Transform'],
          description: 'Mathematical representation of dynamic systems',
          subtopics: [
            'Transfer Functions',
            'Block Diagrams',
            'Signal Flow Graphs',
            'State Space Representation',
            'System Identification',
            'Linearization Techniques'
          ]
        }
      }
    }
  },

  // Mechanical Engineering
  'Mechanical Engineering': {
    'Thermodynamics': {
      icon: 'Thermometer',
      description: 'Study of heat, work, and energy transformations',
      difficulty: 'Medium',
      estimatedTime: '100 hours',
      topics: {
        'Laws of Thermodynamics': {
          difficulty: 'Medium',
          importance: 'Very High',
          gateWeight: '12-15 marks',
          prerequisites: ['Physics', 'Calculus'],
          description: 'Fundamental principles governing energy transformations',
          subtopics: [
            'Zeroth Law of Thermodynamics',
            'First Law of Thermodynamics',
            'Second Law of Thermodynamics',
            'Third Law of Thermodynamics',
            'Entropy and Enthalpy',
            'Thermodynamic Processes'
          ]
        },
        'Heat Transfer': {
          difficulty: 'Medium',
          importance: 'High',
          gateWeight: '8-12 marks',
          prerequisites: ['Fluid Mechanics', 'Differential Equations'],
          description: 'Mechanisms of thermal energy transfer',
          subtopics: [
            'Conduction Heat Transfer',
            'Convection Heat Transfer',
            'Radiation Heat Transfer',
            'Heat Exchangers',
            'Fins and Extended Surfaces',
            'Transient Heat Transfer'
          ]
        }
      }
    },
    'Fluid Mechanics': {
      icon: 'Droplets',
      description: 'Study of fluid behavior and flow characteristics',
      difficulty: 'Hard',
      estimatedTime: '90 hours',
      topics: {
        'Fluid Properties': {
          difficulty: 'Easy',
          importance: 'High',
          gateWeight: '6-8 marks',
          prerequisites: ['Physics'],
          description: 'Physical properties of fluids and their measurement',
          subtopics: [
            'Density and Specific Weight',
            'Viscosity',
            'Surface Tension',
            'Compressibility',
            'Vapor Pressure',
            'Fluid Classification'
          ]
        }
      }
    },
    'Machine Design': {
      icon: 'Cog',
      description: 'Design principles for mechanical components and systems',
      difficulty: 'Hard',
      estimatedTime: '110 hours',
      topics: {
        'Design Philosophy': {
          difficulty: 'Medium',
          importance: 'High',
          gateWeight: '8-10 marks',
          prerequisites: ['Strength of Materials'],
          description: 'Fundamental principles of mechanical design',
          subtopics: [
            'Design Process',
            'Factor of Safety',
            'Stress Concentration',
            'Fatigue Analysis',
            'Material Selection',
            'Design Optimization'
          ]
        }
      }
    }
  },

  // Civil Engineering
  'Civil Engineering': {
    'Structural Analysis': {
      icon: 'Building',
      description: 'Analysis of forces and deformations in structures',
      difficulty: 'Hard',
      estimatedTime: '120 hours',
      topics: {
        'Statically Determinate Structures': {
          difficulty: 'Medium',
          importance: 'Very High',
          gateWeight: '15-20 marks',
          prerequisites: ['Statics', 'Strength of Materials'],
          description: 'Analysis of structures with sufficient support conditions',
          subtopics: [
            'Beams and Frames',
            'Trusses',
            'Arches',
            'Cables',
            'Influence Lines',
            'Moving Loads'
          ]
        },
        'Statically Indeterminate Structures': {
          difficulty: 'Hard',
          importance: 'High',
          gateWeight: '12-15 marks',
          prerequisites: ['Statically Determinate Structures'],
          description: 'Analysis of structures with redundant supports',
          subtopics: [
            'Method of Consistent Deformations',
            'Slope Deflection Method',
            'Moment Distribution Method',
            'Matrix Methods',
            'Plastic Analysis',
            'Approximate Methods'
          ]
        }
      }
    },
    'Geotechnical Engineering': {
      icon: 'Mountain',
      description: 'Engineering behavior of earth materials',
      difficulty: 'Medium',
      estimatedTime: '100 hours',
      topics: {
        'Soil Mechanics': {
          difficulty: 'Medium',
          importance: 'High',
          gateWeight: '10-12 marks',
          prerequisites: ['Geology', 'Fluid Mechanics'],
          description: 'Physical and mechanical properties of soils',
          subtopics: [
            'Soil Formation and Classification',
            'Phase Relations',
            'Permeability and Seepage',
            'Effective Stress Principle',
            'Shear Strength',
            'Consolidation'
          ]
        }
      }
    },
    'Transportation Engineering': {
      icon: 'Car',
      description: 'Planning, design, and operation of transportation systems',
      difficulty: 'Medium',
      estimatedTime: '80 hours',
      topics: {
        'Highway Engineering': {
          difficulty: 'Medium',
          importance: 'High',
          gateWeight: '8-10 marks',
          prerequisites: ['Surveying'],
          description: 'Design and construction of highway systems',
          subtopics: [
            'Geometric Design',
            'Pavement Design',
            'Traffic Engineering',
            'Highway Materials',
            'Drainage Systems',
            'Highway Safety'
          ]
        }
      }
    }
  },

  // Instrumentation Engineering
  'Instrumentation Engineering': {
    'Measurement and Instrumentation': {
      icon: 'Gauge',
      description: 'Principles of measurement and instrumentation systems',
      difficulty: 'Medium',
      estimatedTime: '90 hours',
      topics: {
        'Measurement Principles': {
          difficulty: 'Easy',
          importance: 'High',
          gateWeight: '8-10 marks',
          prerequisites: ['Basic Electronics'],
          description: 'Fundamental concepts of measurement systems',
          subtopics: [
            'Static and Dynamic Characteristics',
            'Errors in Measurement',
            'Statistical Analysis',
            'Calibration and Standards',
            'Measurement System Design',
            'Data Acquisition Systems'
          ]
        },
        'Sensors and Transducers': {
          difficulty: 'Medium',
          importance: 'Very High',
          gateWeight: '12-15 marks',
          prerequisites: ['Electronics', 'Physics'],
          description: 'Devices for converting physical quantities to electrical signals',
          subtopics: [
            'Resistive Transducers',
            'Capacitive Transducers',
            'Inductive Transducers',
            'Piezoelectric Transducers',
            'Optical Sensors',
            'Smart Sensors'
          ]
        }
      }
    },
    'Process Control': {
      icon: 'Activity',
      description: 'Automatic control of industrial processes',
      difficulty: 'Hard',
      estimatedTime: '100 hours',
      topics: {
        'Control Strategies': {
          difficulty: 'Medium',
          importance: 'High',
          gateWeight: '10-12 marks',
          prerequisites: ['Control Systems'],
          description: 'Methods for controlling industrial processes',
          subtopics: [
            'PID Control',
            'Cascade Control',
            'Feedforward Control',
            'Ratio Control',
            'Adaptive Control',
            'Model Predictive Control'
          ]
        }
      }
    }
  },

  // Mechanical Engineering
  'Mechanical Engineering': {
    'Thermodynamics': {
      icon: 'Flame',
      description: 'Study of heat, work, and energy transformations in mechanical systems',
      difficulty: 'Medium',
      estimatedTime: '100 hours',
      topics: {
        'Laws of Thermodynamics': {
          difficulty: 'Medium',
          importance: 'Very High',
          gateWeight: '12-15 marks',
          prerequisites: ['Basic Physics', 'Mathematics'],
          description: 'Fundamental laws governing energy transformations',
          subtopics: [
            'Zeroth Law of Thermodynamics',
            'First Law of Thermodynamics',
            'Second Law of Thermodynamics',
            'Third Law of Thermodynamics',
            'Entropy and Enthalpy',
            'Internal Energy'
          ]
        },
        'Thermodynamic Cycles': {
          difficulty: 'Hard',
          importance: 'High',
          gateWeight: '10-12 marks',
          prerequisites: ['Laws of Thermodynamics'],
          description: 'Analysis of various thermodynamic cycles used in engines',
          subtopics: [
            'Carnot Cycle',
            'Otto Cycle',
            'Diesel Cycle',
            'Brayton Cycle',
            'Rankine Cycle',
            'Refrigeration Cycles'
          ]
        }
      }
    },
    'Fluid Mechanics': {
      icon: 'Waves',
      description: 'Study of fluid behavior and flow characteristics',
      difficulty: 'Medium',
      estimatedTime: '90 hours',
      topics: {
        'Fluid Properties': {
          difficulty: 'Easy',
          importance: 'High',
          gateWeight: '8-10 marks',
          prerequisites: ['Basic Physics'],
          description: 'Fundamental properties of fluids',
          subtopics: [
            'Density and Specific Weight',
            'Viscosity',
            'Surface Tension',
            'Compressibility',
            'Vapor Pressure',
            'Fluid Statics'
          ]
        },
        'Flow Analysis': {
          difficulty: 'Hard',
          importance: 'Very High',
          gateWeight: '12-15 marks',
          prerequisites: ['Fluid Properties', 'Calculus'],
          description: 'Analysis of fluid flow patterns and characteristics',
          subtopics: [
            'Continuity Equation',
            'Bernoulli\'s Equation',
            'Momentum Equation',
            'Laminar and Turbulent Flow',
            'Boundary Layer Theory',
            'Flow Measurement'
          ]
        }
      }
    },
    'Strength of Materials': {
      icon: 'Wrench',
      description: 'Study of material behavior under various loading conditions',
      difficulty: 'Medium',
      estimatedTime: '110 hours',
      topics: {
        'Stress and Strain': {
          difficulty: 'Medium',
          importance: 'Very High',
          gateWeight: '10-12 marks',
          prerequisites: ['Statics', 'Material Science'],
          description: 'Fundamental concepts of stress and strain in materials',
          subtopics: [
            'Normal Stress and Strain',
            'Shear Stress and Strain',
            'Elastic Modulus',
            'Poisson\'s Ratio',
            'Factor of Safety',
            'Stress-Strain Diagrams'
          ]
        },
        'Bending and Torsion': {
          difficulty: 'Hard',
          importance: 'High',
          gateWeight: '8-10 marks',
          prerequisites: ['Stress and Strain'],
          description: 'Analysis of beams and shafts under bending and torsional loads',
          subtopics: [
            'Bending Moment and Shear Force',
            'Flexural Stress',
            'Deflection of Beams',
            'Torsion of Circular Shafts',
            'Combined Loading',
            'Column Buckling'
          ]
        }
      }
    }
  },

  // Civil Engineering
  'Civil Engineering': {
    'Structural Analysis': {
      icon: 'Building',
      description: 'Analysis of structures under various loading conditions',
      difficulty: 'Hard',
      estimatedTime: '120 hours',
      topics: {
        'Statically Determinate Structures': {
          difficulty: 'Medium',
          importance: 'Very High',
          gateWeight: '12-15 marks',
          prerequisites: ['Statics', 'Strength of Materials'],
          description: 'Analysis of structures with sufficient support conditions',
          subtopics: [
            'Trusses Analysis',
            'Beams and Frames',
            'Method of Joints',
            'Method of Sections',
            'Influence Lines',
            'Moving Loads'
          ]
        },
        'Statically Indeterminate Structures': {
          difficulty: 'Hard',
          importance: 'High',
          gateWeight: '10-12 marks',
          prerequisites: ['Statically Determinate Structures'],
          description: 'Analysis of structures with redundant supports',
          subtopics: [
            'Force Method',
            'Displacement Method',
            'Moment Distribution Method',
            'Slope Deflection Method',
            'Matrix Methods',
            'Plastic Analysis'
          ]
        }
      }
    },
    'Geotechnical Engineering': {
      icon: 'Mountain',
      description: 'Study of soil mechanics and foundation engineering',
      difficulty: 'Medium',
      estimatedTime: '100 hours',
      topics: {
        'Soil Properties': {
          difficulty: 'Medium',
          importance: 'High',
          gateWeight: '8-10 marks',
          prerequisites: ['Basic Geology'],
          description: 'Physical and engineering properties of soils',
          subtopics: [
            'Soil Classification',
            'Phase Relationships',
            'Permeability',
            'Compaction',
            'Consolidation',
            'Shear Strength'
          ]
        },
        'Foundation Engineering': {
          difficulty: 'Hard',
          importance: 'Very High',
          gateWeight: '10-12 marks',
          prerequisites: ['Soil Properties'],
          description: 'Design and analysis of foundations',
          subtopics: [
            'Shallow Foundations',
            'Deep Foundations',
            'Bearing Capacity',
            'Settlement Analysis',
            'Lateral Earth Pressure',
            'Retaining Walls'
          ]
        }
      }
    }
  },

  // Instrumentation Engineering
  'Instrumentation Engineering': {
    'Measurement Systems': {
      icon: 'Gauge',
      description: 'Study of measurement principles and instrumentation systems',
      difficulty: 'Medium',
      estimatedTime: '90 hours',
      topics: {
        'Measurement Fundamentals': {
          difficulty: 'Easy',
          importance: 'Very High',
          gateWeight: '10-12 marks',
          prerequisites: ['Basic Electronics'],
          description: 'Basic principles of measurement and instrumentation',
          subtopics: [
            'Measurement Errors',
            'Accuracy and Precision',
            'Calibration',
            'Standards and Traceability',
            'Statistical Analysis',
            'Uncertainty Analysis'
          ]
        },
        'Transducers and Sensors': {
          difficulty: 'Medium',
          importance: 'High',
          gateWeight: '8-10 marks',
          prerequisites: ['Measurement Fundamentals'],
          description: 'Devices for converting physical quantities to electrical signals',
          subtopics: [
            'Resistive Transducers',
            'Capacitive Transducers',
            'Inductive Transducers',
            'Piezoelectric Transducers',
            'Optical Sensors',
            'Smart Sensors'
          ]
        }
      }
    },
    'Process Control': {
      icon: 'Settings',
      description: 'Automatic control of industrial processes',
      difficulty: 'Hard',
      estimatedTime: '110 hours',
      topics: {
        'Control System Fundamentals': {
          difficulty: 'Medium',
          importance: 'Very High',
          gateWeight: '12-15 marks',
          prerequisites: ['Mathematics', 'Electronics'],
          description: 'Basic principles of automatic control systems',
          subtopics: [
            'Open Loop vs Closed Loop',
            'Transfer Functions',
            'Block Diagrams',
            'Signal Flow Graphs',
            'Time Response',
            'Frequency Response'
          ]
        },
        'Industrial Control Systems': {
          difficulty: 'Hard',
          importance: 'High',
          gateWeight: '10-12 marks',
          prerequisites: ['Control System Fundamentals'],
          description: 'Control systems used in industrial applications',
          subtopics: [
            'PLC Programming',
            'SCADA Systems',
            'DCS Architecture',
            'Fieldbus Communication',
            'Safety Instrumented Systems',
            'Process Optimization'
          ]
        }
      }
    }
  }
}