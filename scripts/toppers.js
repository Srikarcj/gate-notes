/**
 * Toppers Manager - Handles topper notes management with localStorage
 */

class ToppersManager {
    constructor() {
        this.storageKey = 'gateNotesHub_topperNotes';
        this.topperNotes = this.loadFromStorage();
        
        this.init();
    }

    /**
     * Initialize toppers manager
     */
    init() {
        this.setupEventListeners();
        this.displayTopperNotes();
        this.loadSampleData();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const form = document.getElementById('topperNoteForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }
    }

    /**
     * Handle form submission
     */
    handleFormSubmit() {
        const title = document.getElementById('noteTitle')?.value.trim();
        const description = document.getElementById('noteDescription')?.value.trim();
        const pdfLink = document.getElementById('notePdfLink')?.value.trim();
        const category = document.getElementById('noteCategory')?.value;

        // Validation
        if (!title || !pdfLink) {
            window.gateNotesApp?.showNotification('Please fill in all required fields.', 'error');
            return;
        }

        if (!this.isValidUrl(pdfLink)) {
            window.gateNotesApp?.showNotification('Please enter a valid URL.', 'error');
            return;
        }

        // Create new note
        const newNote = {
            id: this.generateId(),
            title,
            description: description || 'No description provided',
            pdfLink,
            category,
            dateAdded: new Date().toISOString(),
            views: 0
        };

        // Add to storage
        this.topperNotes.push(newNote);
        this.saveToStorage();
        
        // Update display
        this.displayTopperNotes();
        
        // Reset form
        document.getElementById('topperNoteForm').reset();
        
        // Show success message
        window.gateNotesApp?.showNotification('Topper note added successfully!', 'success');
    }

    /**
     * Load topper notes from localStorage
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading from storage:', error);
            return [];
        }
    }

    /**
     * Save topper notes to localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.topperNotes));
        } catch (error) {
            console.error('Error saving to storage:', error);
            window.gateNotesApp?.showNotification('Failed to save note. Storage might be full.', 'error');
        }
    }

    /**
     * Display all topper notes
     */
    displayTopperNotes() {
        const container = document.getElementById('topperNotesList');
        if (!container) return;

        if (this.topperNotes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-sticky-note"></i>
                    <h4>No topper notes yet</h4>
                    <p>Add your first topper-recommended note using the form above.</p>
                </div>
            `;
            return;
        }

        // Sort notes by date (newest first)
        const sortedNotes = [...this.topperNotes].sort((a, b) => 
            new Date(b.dateAdded) - new Date(a.dateAdded)
        );

        container.innerHTML = sortedNotes.map(note => this.createNoteHTML(note)).join('');
    }

    /**
     * Create HTML for a single note
     */
    createNoteHTML(note) {
        const formattedDate = new Date(note.dateAdded).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="topper-note-item" data-id="${note.id}">
                <div class="topper-note-header">
                    <div>
                        <h5 class="topper-note-title">${this.escapeHtml(note.title)}</h5>
                        <span class="topper-note-category">${note.category.toUpperCase()}</span>
                    </div>
                    <div class="note-date">
                        <small>${formattedDate}</small>
                    </div>
                </div>
                
                <p class="topper-note-description">${this.escapeHtml(note.description)}</p>
                
                <div class="note-stats">
                    <span class="note-views">
                        <i class="fas fa-eye"></i> ${note.views} views
                    </span>
                </div>
                
                <div class="topper-note-actions">
                    <a href="${note.pdfLink}" 
                       class="btn btn-primary btn-small" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       onclick="this.closest('.topper-note-item').querySelector('[data-action=view]').click()">
                        <i class="fas fa-external-link-alt"></i> View PDF
                    </a>
                    
                    <button class="btn btn-secondary btn-small" 
                            onclick="window.toppersManager.copyLink('${note.pdfLink}')">
                        <i class="fas fa-copy"></i> Copy Link
                    </button>
                    
                    <button class="btn btn-secondary btn-small" 
                            onclick="window.toppersManager.editNote('${note.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    
                    <button class="btn btn-danger btn-small" 
                            onclick="window.toppersManager.deleteNote('${note.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    
                    <button class="btn btn-secondary btn-small" 
                            data-action="view" 
                            onclick="window.toppersManager.incrementViews('${note.id}')" 
                            style="display: none;">
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Copy link to clipboard
     */
    async copyLink(url) {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(url);
                window.gateNotesApp?.showNotification('Link copied to clipboard!', 'success');
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = url;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                window.gateNotesApp?.showNotification('Link copied to clipboard!', 'success');
            }
        } catch (error) {
            console.error('Failed to copy link:', error);
            window.gateNotesApp?.showNotification('Failed to copy link.', 'error');
        }
    }

    /**
     * Edit note
     */
    editNote(noteId) {
        const note = this.topperNotes.find(n => n.id === noteId);
        if (!note) return;

        // Populate form with existing data
        document.getElementById('noteTitle').value = note.title;
        document.getElementById('noteDescription').value = note.description;
        document.getElementById('notePdfLink').value = note.pdfLink;
        document.getElementById('noteCategory').value = note.category;

        // Remove the note (will be re-added when form is submitted)
        this.deleteNote(noteId, false);

        // Scroll to form
        document.getElementById('topperNoteForm').scrollIntoView({ behavior: 'smooth' });
        
        window.gateNotesApp?.showNotification('Note loaded for editing.', 'info');
    }

    /**
     * Delete note
     */
    deleteNote(noteId, showConfirmation = true) {
        if (showConfirmation && !confirm('Are you sure you want to delete this note?')) {
            return;
        }

        this.topperNotes = this.topperNotes.filter(note => note.id !== noteId);
        this.saveToStorage();
        this.displayTopperNotes();
        
        if (showConfirmation) {
            window.gateNotesApp?.showNotification('Note deleted successfully.', 'success');
        }
    }

    /**
     * Increment view count
     */
    incrementViews(noteId) {
        const note = this.topperNotes.find(n => n.id === noteId);
        if (note) {
            note.views++;
            this.saveToStorage();
            // Update the display without full refresh
            const viewsElement = document.querySelector(`[data-id="${noteId}"] .note-views`);
            if (viewsElement) {
                viewsElement.innerHTML = `<i class="fas fa-eye"></i> ${note.views} views`;
            }
        }
    }

    /**
     * Load sample data if no notes exist
     */
    loadSampleData() {
        if (this.topperNotes.length === 0) {
            const sampleNotes = [
                {
                    id: this.generateId(),
                    title: 'Complete Data Structures Guide',
                    description: 'Comprehensive guide covering all data structures with implementations and examples.',
                    pdfLink: 'https://example.com/data-structures-guide.pdf',
                    category: 'cse',
                    dateAdded: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
                    views: 15
                },
                {
                    id: this.generateId(),
                    title: 'GATE Mathematics Formula Sheet',
                    description: 'All important mathematical formulas for GATE preparation in one place.',
                    pdfLink: 'https://example.com/math-formulas.pdf',
                    category: 'general',
                    dateAdded: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
                    views: 8
                },
                {
                    id: this.generateId(),
                    title: 'Control Systems Quick Notes',
                    description: 'Concise notes on control systems theory and applications.',
                    pdfLink: 'https://example.com/control-systems.pdf',
                    category: 'ee',
                    dateAdded: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
                    views: 3
                }
            ];

            this.topperNotes = sampleNotes;
            this.saveToStorage();
            this.displayTopperNotes();
        }
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Validate URL
     */
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Export notes as JSON
     */
    exportNotes() {
        const dataStr = JSON.stringify(this.topperNotes, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'gate-topper-notes.json';
        link.click();
        
        window.gateNotesApp?.showNotification('Notes exported successfully!', 'success');
    }

    /**
     * Import notes from JSON
     */
    importNotes(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedNotes = JSON.parse(e.target.result);
                if (Array.isArray(importedNotes)) {
                    this.topperNotes = [...this.topperNotes, ...importedNotes];
                    this.saveToStorage();
                    this.displayTopperNotes();
                    window.gateNotesApp?.showNotification('Notes imported successfully!', 'success');
                } else {
                    throw new Error('Invalid file format');
                }
            } catch (error) {
                window.gateNotesApp?.showNotification('Failed to import notes. Invalid file format.', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Make ToppersManager globally available
window.ToppersManager = ToppersManager;
