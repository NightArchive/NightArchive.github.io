document.addEventListener('DOMContentLoaded', function() {
    const filterTags = document.querySelectorAll('.filter-tag');
    const searchInput = document.getElementById('archiveSearchInput');

    filterTags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.stopPropagation();
            const filter = this.getAttribute('data-filter');
            filterTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            filterArchiveCards(filter);
        });
    });
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterArchiveCardsBySearch(this.value);
        });
    }


});

function filterArchiveCards(filter) {
    const cards = document.querySelectorAll('.archive-card');
    
    cards.forEach(card => {
        if (filter === 'all') {
            card.style.display = '';
        } else {
            const filters = card.getAttribute('data-filter').split(' ');
            if (filters.includes(filter)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

function filterArchiveCardsBySearch(query) {
    const cards = document.querySelectorAll('.archive-card');
    const lowerQuery = query.toLowerCase().trim();
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (lowerQuery === '' || text.includes(lowerQuery)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}
function downloadTool(toolId) {
    console.log(`Downloading tool: ${toolId}`);
    showNotification(`Загрузка ${toolId}...`, 'success');
    trackEvent('tool_download', { tool: toolId, timestamp: new Date() });
}

function reportIssue(toolId) {
    console.log(`Reporting issue for tool: ${toolId}`);
    const message = encodeURIComponent(`Проблема с инструментом: ${toolId}`);
    const telegramUrl = `https://t.me/NightArchiveTg?start=issue_${toolId}`;
    window.open(telegramUrl, '_blank');
    
    trackEvent('tool_issue_reported', { tool: toolId, timestamp: new Date() });
}

function viewGuide(toolId) {
    console.log(`Opening guide for tool: ${toolId}`);
    closeToolModal();
    
    showNotification('Гайд откроется в новой вкладке', 'info');
    window.open(`/guides/${toolId}.html`, '_blank');
    
    trackEvent('tool_guide_viewed', { tool: toolId, timestamp: new Date() });
}
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : ''}
            ${type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' : ''}
            ${type === 'info' ? '<i class="fas fa-info-circle"></i>' : ''}
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                animation: slideInRight 0.3s ease;
                z-index: 3000;
                max-width: 400px;
            }
            
            .notification-success {
                background: rgba(34, 197, 94, 0.2);
                border: 1px solid rgba(34, 197, 94, 0.5);
                color: #22c55e;
            }
            
            .notification-error {
                background: rgba(239, 68, 68, 0.2);
                border: 1px solid rgba(239, 68, 68, 0.5);
                color: #ef4444;
            }
            
            .notification-info {
                background: rgba(59, 130, 246, 0.2);
                border: 1px solid rgba(59, 130, 246, 0.5);
                color: #3b82f6;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.8rem;
            }
            
            .notification-content i {
                font-size: 1.1rem;
            }
            
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @media (max-width: 640px) {
                .notification {
                    bottom: 1rem;
                    right: 1rem;
                    left: 1rem;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
function trackEvent(eventName, eventData) {
    const event = new CustomEvent('nightarchive:' + eventName, {
        detail: eventData
    });
    window.dispatchEvent(event);
    console.log(`Event: ${eventName}`, eventData);
}
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeToolModal();
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.scrollBehavior = 'smooth';
    }
});
window.NightArchiveArchive = {
    openToolModal,
    closeToolModal,
    downloadTool,
    reportIssue,
    viewGuide,
    filterArchiveCards,
    filterArchiveCardsBySearch,
    showNotification,
    trackEvent
};
