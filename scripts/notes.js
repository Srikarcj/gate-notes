/**
 * Notes Manager - Handles branch and subject selection, notes display
 */

class NotesManager {
    constructor() {
        this.currentBranch = null;
        this.currentSubject = null;
        this.branchData = {};
        this.subjectData = {};
        
        this.init();
    }

    /**
     * Initialize notes manager
     */
    init() {
        this.setupEventListeners();
        this.loadBranchOptions();
    }

    /**
     * Setup event listeners for branch and subject selection
     */
    setupEventListeners() {
        const branchSelect = document.getElementById('branchSelect');
        const subjectSelect = document.getElementById('subjectSelect');

        if (branchSelect) {
            branchSelect.addEventListener('change', (e) => {
                this.handleBranchChange(e.target.value);
            });
        }

        if (subjectSelect) {
            subjectSelect.addEventListener('change', (e) => {
                this.handleSubjectChange(e.target.value);
            });
        }
    }

    /**
     * Load branch options (already in HTML, but could be dynamic)
     */
    loadBranchOptions() {
        // Branch options are already in HTML
        // This method could be used to dynamically load branches from a config file
        console.log('Branch options loaded');
    }

    /**
     * Handle branch selection change
     */
    async handleBranchChange(branchCode) {
        if (!branchCode) {
            this.resetSubjectSelect();
            this.hideNotesDisplay();
            return;
        }

        try {
            window.gateNotesApp?.showLoading();
            
            // Load subjects for selected branch
            const subjects = await this.loadSubjects(branchCode);
            this.populateSubjectSelect(subjects);
            this.currentBranch = branchCode;
            this.hideNotesDisplay();
            
        } catch (error) {
            console.error('Error loading subjects:', error);
            window.gateNotesApp?.showNotification('Failed to load subjects. Please try again.', 'error');
        } finally {
            window.gateNotesApp?.hideLoading();
        }
    }

    /**
     * Handle subject selection change
     */
    async handleSubjectChange(subjectId) {
        if (!subjectId || !this.currentBranch) {
            this.hideNotesDisplay();
            return;
        }

        try {
            window.gateNotesApp?.showLoading();
            
            // Load notes for selected subject
            const notesData = await this.loadNotes(this.currentBranch, subjectId);
            this.displayNotes(notesData);
            this.currentSubject = subjectId;
            
        } catch (error) {
            console.error('Error loading notes:', error);
            window.gateNotesApp?.showNotification('Failed to load notes. Please try again.', 'error');
        } finally {
            window.gateNotesApp?.hideLoading();
        }
    }

    /**
     * Load subjects for a branch
     */
    async loadSubjects(branchCode) {
        const response = await fetch(`data/${branchCode}/subjects.json`);
        if (!response.ok) {
            throw new Error(`Failed to load subjects for ${branchCode}`);
        }
        
        const data = await response.json();
        this.branchData[branchCode] = data;
        return data.subjects;
    }

    /**
     * Load notes for a subject
     */
    async loadNotes(branchCode, subjectId) {
        try {
            const response = await fetch(`data/${branchCode}/${subjectId}.json`);
            if (!response.ok) {
                // If specific subject file doesn't exist, create a placeholder
                return this.createPlaceholderNotes(branchCode, subjectId);
            }
            
            const data = await response.json();
            this.subjectData[`${branchCode}-${subjectId}`] = data;
            return data;
        } catch (error) {
            // Return placeholder data if file doesn't exist
            return this.createPlaceholderNotes(branchCode, subjectId);
        }
    }

    /**
     * Create placeholder notes data
     */
    createPlaceholderNotes(branchCode, subjectId) {
        const subject = this.branchData[branchCode]?.subjects.find(s => s.id === subjectId);
        
        return {
            subject: subject?.name || 'Subject',
            branch: branchCode.toUpperCase(),
            description: subject?.description || 'Comprehensive study materials for this subject.',
            lastUpdated: new Date().toISOString().split('T')[0],
            totalNotes: 5,
            notes: [
                {
                    id: `${subjectId}-001`,
                    title: `Introduction to ${subject?.name || 'Subject'}`,
                    description: 'Fundamental concepts and basic principles',
                    type: 'pdf',
                    url: '#',
                    size: '2.5 MB',
                    pages: 45,
                    difficulty: 'Beginner',
                    topics: ['Basics', 'Fundamentals', 'Introduction'],
                    downloadable: false
                },
                {
                    id: `${subjectId}-002`,
                    title: `Advanced ${subject?.name || 'Subject'} Concepts`,
                    description: 'In-depth coverage of advanced topics',
                    type: 'pdf',
                    url: '#',
                    size: '3.8 MB',
                    pages: 72,
                    difficulty: 'Advanced',
                    topics: ['Advanced Topics', 'Complex Concepts'],
                    downloadable: false
                },
                {
                    id: `${subjectId}-003`,
                    title: 'Practice Problems and Solutions',
                    description: 'Comprehensive problem sets with detailed solutions',
                    type: 'pdf',
                    url: '#',
                    size: '4.2 MB',
                    pages: 95,
                    difficulty: 'Mixed',
                    topics: ['Practice', 'Problems', 'Solutions'],
                    downloadable: false
                },
                {
                    id: `${subjectId}-004`,
                    title: 'Previous Year GATE Questions',
                    description: 'GATE questions from last 10 years with solutions',
                    type: 'pdf',
                    url: '#',
                    size: '3.1 MB',
                    pages: 58,
                    difficulty: 'GATE Level',
                    topics: ['GATE', 'Previous Year', 'Exam Prep'],
                    downloadable: false
                },
                {
                    id: `${subjectId}-005`,
                    title: 'Quick Revision Notes',
                    description: 'Concise notes for last-minute revision',
                    type: 'pdf',
                    url: '#',
                    size: '1.8 MB',
                    pages: 32,
                    difficulty: 'All Levels',
                    topics: ['Revision', 'Quick Notes', 'Summary'],
                    downloadable: false
                }
            ],
            practiceProblems: [
                {
                    title: 'Practice Set 1',
                    description: '50+ practice problems with solutions',
                    url: '#',
                    difficulty: 'Mixed'
                }
            ],
            references: [
                {
                    title: 'Standard Textbook',
                    authors: 'Various Authors',
                    edition: 'Latest Edition'
                }
            ]
        };
    }

    /**
     * Populate subject dropdown
     */
    populateSubjectSelect(subjects) {
        const subjectSelect = document.getElementById('subjectSelect');
        if (!subjectSelect) return;

        // Clear existing options
        subjectSelect.innerHTML = '<option value="">Select a subject...</option>';
        
        // Add subject options
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = `${subject.icon} ${subject.name}`;
            subjectSelect.appendChild(option);
        });

        // Enable the select
        subjectSelect.disabled = false;
    }

    /**
     * Reset subject dropdown
     */
    resetSubjectSelect() {
        const subjectSelect = document.getElementById('subjectSelect');
        if (!subjectSelect) return;

        subjectSelect.innerHTML = '<option value="">First select a branch...</option>';
        subjectSelect.disabled = true;
    }

    /**
     * Display notes for selected subject
     */
    displayNotes(notesData) {
        const notesPlaceholder = document.getElementById('notesPlaceholder');
        const notesDisplay = document.getElementById('notesDisplay');
        const notesTitle = document.getElementById('notesTitle');
        const notesDescription = document.getElementById('notesDescription');
        const notesList = document.getElementById('notesList');

        if (!notesDisplay || !notesList) return;

        // Hide placeholder and show notes display
        if (notesPlaceholder) notesPlaceholder.style.display = 'none';
        notesDisplay.style.display = 'block';

        // Update header
        if (notesTitle) notesTitle.textContent = notesData.subject;
        if (notesDescription) notesDescription.textContent = notesData.description;

        // Clear existing notes
        notesList.innerHTML = '';

        // Display notes
        notesData.notes.forEach(note => {
            const noteElement = this.createNoteElement(note);
            notesList.appendChild(noteElement);
        });

        // Add fade-in animation
        notesDisplay.classList.add('fade-in');
        setTimeout(() => {
            notesDisplay.classList.remove('fade-in');
        }, 500);
    }

    /**
     * Create note element
     */
    createNoteElement(note) {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note-item';
        
        const difficultyClass = note.difficulty.toLowerCase().replace(' ', '-');
        const topicsHtml = note.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('');
        
        noteDiv.innerHTML = `
            <h5>${note.title}</h5>
            <p>${note.description}</p>
            <div class="note-meta">
                <span class="note-size">${note.size}</span>
                <span class="note-pages">${note.pages} pages</span>
                <span class="note-difficulty difficulty-${difficultyClass}">${note.difficulty}</span>
            </div>
            <div class="note-topics">
                ${topicsHtml}
            </div>
            <div class="note-actions">
                ${note.downloadable ? 
                    `<a href="${note.url}" class="btn btn-primary btn-small" target="_blank" rel="noopener">
                        <i class="fas fa-download"></i> Download
                    </a>` :
                    `<button class="btn btn-secondary btn-small" disabled>
                        <i class="fas fa-lock"></i> Coming Soon
                    </button>`
                }
                <button class="btn btn-secondary btn-small" onclick="navigator.share ? navigator.share({title: '${note.title}', url: window.location.href}) : window.gateNotesApp.showNotification('Link copied to clipboard!', 'success')">
                    <i class="fas fa-share"></i> Share
                </button>
            </div>
        `;

        return noteDiv;
    }

    /**
     * Hide notes display
     */
    hideNotesDisplay() {
        const notesPlaceholder = document.getElementById('notesPlaceholder');
        const notesDisplay = document.getElementById('notesDisplay');

        if (notesPlaceholder) notesPlaceholder.style.display = 'block';
        if (notesDisplay) notesDisplay.style.display = 'none';
    }

    /**
     * Search notes (future enhancement)
     */
    searchNotes(query) {
        // Implementation for searching through notes
        console.log('Searching for:', query);
    }
}
