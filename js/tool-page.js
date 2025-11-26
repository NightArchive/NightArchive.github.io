function openLightbox(imageSrc, caption) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    
    if (lightbox && lightboxImage && lightboxCaption) {
        lightboxImage.src = imageSrc;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}
function downloadTool(toolId) {
    console.log(`Downloading tool: ${toolId}`);
    showNotification(`Загрузка инструмента ${toolId}...`, 'success');
    trackEvent('tool_download', { tool: toolId, timestamp: new Date() });
    const toolFiles = {
        'okru-finder': 'Archive/NightArchive - OKru Finder.zip'
    };
    
    const filePath = toolFiles[toolId];
    if (filePath) {
        const link = document.createElement('a');
        link.href = filePath;
        link.download = filePath.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        showNotification(`Инструмент ${toolId} не найден`, 'error');
    }
}

function openGuide(toolId) {
    console.log(`Opening guide for tool: ${toolId}`);
    showNotification('Гайд откроется в новой вкладке', 'info');
    trackEvent('tool_guide_opened', { tool: toolId, timestamp: new Date() });
}

function reportIssue(toolId) {
    console.log(`Reporting issue for tool: ${toolId}`);
    const message = encodeURIComponent(`Проблема с инструментом: ${toolId}`);
    const telegramUrl = `https://t.me/NightArchiveTg?start=issue_${toolId}`;
    window.open(telegramUrl, '_blank');
    trackEvent('tool_issue_reported', { tool: toolId, timestamp: new Date() });
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
    if (!document.getElementById('notification-styles-tool')) {
        const style = document.createElement('style');
        style.id = 'notification-styles-tool';
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
        closeLightbox();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    trackEvent('tool_page_viewed', {
        tool: 'okru-finder',
        timestamp: new Date(),
        referrer: document.referrer
    });
});
document.addEventListener('keydown', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    }
});
window.ToolPage = {
    openLightbox,
    closeLightbox,
    downloadTool,
    openGuide,
    reportIssue,
    showNotification,
    trackEvent
};
