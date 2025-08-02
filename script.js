// ContentHub - Static JavaScript

// Global state
let downloadingItems = new Set();
let mobileMenuOpen = false;

// DOM Elements
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
    // Close mobile menu if open
    if (mobileMenuOpen) {
        toggleMobileMenu();
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
    
    if (mobileMenu && menuIcon) {
        if (mobileMenuOpen) {
            mobileMenu.classList.add('active');
            menuIcon.textContent = '✕';
        } else {
            mobileMenu.classList.remove('active');
            menuIcon.textContent = '☰';
        }
    }
}

// Download content function
async function downloadContent(itemId, itemTitle) {
    const buttonSelector = `[data-testid*="download"][data-testid*="${itemId}"]`;
    const button = document.querySelector(buttonSelector);
    
    if (!button || downloadingItems.has(itemId)) {
        return;
    }
    
    // Add to downloading set
    downloadingItems.add(itemId);
    
    // Update button state
    updateButtonState(button, true);
    
    try {
        // Simulate download process
        await simulateDownload();
        
        // Show success message
        showNotification(`${itemTitle} downloaded successfully!`, 'success');
        
    } catch (error) {
        // Show error message
        showNotification(`Failed to download ${itemTitle}. Please try again.`, 'error');
    } finally {
        // Remove from downloading set and reset button
        setTimeout(() => {
            downloadingItems.delete(itemId);
            updateButtonState(button, false);
        }, 2000);
    }
}

// Download font function
async function downloadFont(fontId, fontName) {
    const buttonSelector = `[data-testid="button-download-font-${fontId}"]`;
    const button = document.querySelector(buttonSelector);
    
    if (!button || downloadingItems.has(`font-${fontId}`)) {
        return;
    }
    
    // Add to downloading set
    downloadingItems.add(`font-${fontId}`);
    
    // Update button state
    updateButtonState(button, true);
    
    try {
        // Simulate download process
        await simulateDownload();
        
        // Show success message
        showNotification(`${fontName} font downloaded successfully!`, 'success');
        
    } catch (error) {
        // Show error message
        showNotification(`Failed to download ${fontName} font. Please try again.`, 'error');
    } finally {
        // Remove from downloading set and reset button
        setTimeout(() => {
            downloadingItems.delete(`font-${fontId}`);
            updateButtonState(button, false);
        }, 2000);
    }
}

// Update button state
function updateButtonState(button, isLoading) {
    if (!button) return;
    
    const btnText = button.querySelector('.btn-text');
    const btnIcon = button.querySelector('.btn-icon');
    
    if (isLoading) {
        button.disabled = true;
        if (btnIcon) btnIcon.innerHTML = '<span class="loading-spinner"></span>';
        if (btnText) btnText.textContent = 'Downloading...';
    } else {
        button.disabled = false;
        if (btnIcon) btnIcon.textContent = '⬇';
        if (btnText) btnText.textContent = 'Download';
    }
}

// Simulate download process
function simulateDownload() {
    return new Promise((resolve) => {
        setTimeout(resolve, 1500);
    });
}

// Watch preview function
function watchPreview() {
    showNotification('Preview feature coming soon!', 'info');
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        color: 'white',
        fontWeight: '500',
        zIndex: '1000',
        maxWidth: '400px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        fontSize: '0.875rem'
    });
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#10b981';
            break;
        case 'error':
            notification.style.backgroundColor = '#ef4444';
            break;
        case 'info':
        default:
            notification.style.backgroundColor = '#3b82f6';
            break;
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Handle navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
    } else {
        navbar.style.backgroundColor = 'rgba(18, 18, 18, 0.95)';
    }
}

// Intersection Observer for animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe content cards and sections
    const elementsToObserve = document.querySelectorAll('.content-card, .font-card, .section-header');
    elementsToObserve.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (event) => {
        // ESC key closes mobile menu
        if (event.key === 'Escape' && mobileMenuOpen) {
            toggleMobileMenu();
        }
        
        // Enter key on focused buttons
        if (event.key === 'Enter' && event.target.tagName === 'BUTTON') {
            event.target.click();
        }
    });
}

// Add loading spinner CSS if not already present
function addLoadingSpinnerCSS() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .loading-spinner {
            display: inline-block;
            width: 1rem;
            height: 1rem;
            border: 2px solid #ffffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleSheet);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add loading spinner CSS
    addLoadingSpinnerCSS();
    
    // Setup scroll listeners
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Setup intersection observer for animations
    setupIntersectionObserver();
    
    // Setup keyboard navigation
    setupKeyboardNavigation();
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        if (mobileMenuOpen && !event.target.closest('.nav-container')) {
            toggleMobileMenu();
        }
    });
    
    // Add smooth scrolling to hash links
    if (window.location.hash) {
        setTimeout(() => {
            const targetId = window.location.hash.substring(1);
            scrollToSection(targetId);
        }, 100);
    }
    
    // Welcome message
    setTimeout(() => {
        showNotification('Welcome to ContentHub! Start exploring our premium downloads.', 'info');
    }, 1000);
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on desktop resize
    if (window.innerWidth >= 768 && mobileMenuOpen) {
        toggleMobileMenu();
    }
});

// Export functions for global access (if needed)
window.scrollToSection = scrollToSection;
window.toggleMobileMenu = toggleMobileMenu;
window.downloadContent = downloadContent;
window.downloadFont = downloadFont;
window.watchPreview = watchPreview;