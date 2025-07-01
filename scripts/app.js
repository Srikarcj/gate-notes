/**
 * GATE Notes Hub - Main Application
 * Frontend-only platform for GATE preparation materials
 */

class GateNotesApp {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.currentSection = 'notes';
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.setupTheme();
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupEventListeners();
        this.updateStats();
        
        // Initialize modules
        if (typeof NotesManager !== 'undefined') {
            this.notesManager = new NotesManager();
        }
        
        if (typeof ToppersManager !== 'undefined') {
            this.toppersManager = new ToppersManager();
        }
        
        console.log('🧠 GATE Notes Hub initialized successfully!');
    }

    /**
     * Setup theme functionality
     */
    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle.querySelector('i');
        
        // Update icon based on current theme
        if (this.currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
        
        themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        
        const icon = document.querySelector('#themeToggle i');
        if (this.currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
        
        // Add animation class
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    /**
     * Setup navigation functionality
     */
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetSection = link.getAttribute('data-section');
                this.switchSection(targetSection);
                
                // Update active nav link
                navLinks.forEach(nl => nl.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    /**
     * Switch between different sections
     */
    switchSection(sectionName) {
        const sections = document.querySelectorAll('.section');
        const currentActive = document.querySelector('.section.active');

        // Add exit animation to current section
        if (currentActive) {
            currentActive.style.opacity = '0';
            currentActive.style.transform = 'translateY(-20px)';

            setTimeout(() => {
                currentActive.classList.remove('active');
                currentActive.style.opacity = '';
                currentActive.style.transform = '';
            }, 300);
        }

        // Show new section with entrance animation
        setTimeout(() => {
            const targetSection = document.getElementById(sectionName);
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.style.opacity = '0';
                targetSection.style.transform = 'translateY(20px)';

                // Trigger reflow
                targetSection.offsetHeight;

                // Animate in
                targetSection.style.transition = 'all 0.6s ease-out';
                targetSection.style.opacity = '1';
                targetSection.style.transform = 'translateY(0)';

                // Clean up
                setTimeout(() => {
                    targetSection.style.transition = '';
                    targetSection.style.opacity = '';
                    targetSection.style.transform = '';
                }, 600);
            }
        }, currentActive ? 300 : 0);

        this.currentSection = sectionName;

        // Update URL hash without triggering scroll
        history.replaceState(null, null, `#${sectionName}`);

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Setup mobile menu functionality
     */
    setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const nav = document.querySelector('.nav');
        
        mobileMenuToggle.addEventListener('click', () => {
            nav.classList.toggle('mobile-active');
            
            const icon = mobileMenuToggle.querySelector('i');
            if (nav.classList.contains('mobile-active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                nav.classList.remove('mobile-active');
                mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
            }
        });
    }

    /**
     * Setup additional event listeners
     */
    setupEventListeners() {
        // Header scroll effect
        this.setupScrollEffects();
        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (hash && ['notes', 'toppers', 'about'].includes(hash)) {
                this.switchSection(hash);
                
                // Update active nav link
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === hash) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        // Handle initial hash
        const initialHash = window.location.hash.substring(1);
        if (initialHash && ['notes', 'toppers', 'about'].includes(initialHash)) {
            this.switchSection(initialHash);
        }
        
        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.switchSection('notes');
                        break;
                    case '2':
                        e.preventDefault();
                        this.switchSection('toppers');
                        break;
                    case '3':
                        e.preventDefault();
                        this.switchSection('about');
                        break;
                    case 't':
                        e.preventDefault();
                        this.toggleTheme();
                        break;
                }
            }
        });
    }

    /**
     * Setup scroll effects
     */
    setupScrollEffects() {
        let lastScrollY = window.scrollY;
        const header = document.querySelector('.header');

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // Header hide/show on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }

            // Add/remove header shadow based on scroll position
            if (currentScrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScrollY = currentScrollY;
        });

        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const parallax = scrolled * 0.5;
                hero.style.transform = `translateY(${parallax}px)`;
            });
        }
    }

    /**
     * Update statistics in hero section
     */
    async updateStats() {
        try {
            const branches = ['cse', 'ece', 'ee', 'me', 'ce', 'in'];
            let totalSubjects = 0;
            let totalNotes = 0;
            
            for (const branch of branches) {
                try {
                    const response = await fetch(`data/${branch}/subjects.json`);
                    if (response.ok) {
                        const data = await response.json();
                        totalSubjects += data.subjects.length;
                        totalNotes += data.subjects.length * 8; // Estimate 8 notes per subject
                    }
                } catch (error) {
                    console.warn(`Could not load subjects for ${branch}:`, error);
                }
            }
            
            // Update DOM elements
            const totalBranchesEl = document.getElementById('totalBranches');
            const totalSubjectsEl = document.getElementById('totalSubjects');
            const totalNotesEl = document.getElementById('totalNotes');
            
            if (totalBranchesEl) totalBranchesEl.textContent = `${branches.length}+`;
            if (totalSubjectsEl) totalSubjectsEl.textContent = `${totalSubjects}+`;
            if (totalNotesEl) totalNotesEl.textContent = `${totalNotes}+`;
            
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }

    /**
     * Show loading overlay
     */
    showLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.add('active');
        }
    }

    /**
     * Hide loading overlay
     */
    hideLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.remove('active');
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => this.removeNotification(notification), 5000);
        
        // Handle close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
    }

    /**
     * Remove notification
     */
    removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    /**
     * Utility method to format file size
     */
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Utility method to format date
     */
    static formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gateNotesApp = new GateNotesApp();
});
