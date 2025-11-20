
function filterTools(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }

    const cards = document.querySelectorAll('.tool-card');
    cards.forEach(card => {
        if (category === 'all' || card.classList.contains(category)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}
function searchTools(query) {
    const searchQuery = query.toLowerCase().trim();
    const cards = document.querySelectorAll('.tool-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        if (searchQuery === '' || cardText.includes(searchQuery)) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });
    const toolsGrid = document.querySelector('.tools-grid');
    let noResults = document.querySelector('.no-results-message');
    
    if (visibleCount === 0 && searchQuery !== '') {
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.className = 'no-results-message';
            noResults.innerHTML = `<p>По запросу "<strong>${query}</strong>" инструментов не найдено</p>`;
            toolsGrid.parentNode.insertBefore(noResults, toolsGrid);
        }
    } else if (noResults) {
        noResults.remove();
    }
}
document.querySelectorAll('.toc a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}
document.addEventListener('DOMContentLoaded', function() {
     setupLazyLoading();
     setupSearch();
     setupAnchorLinks();
     trackScroll();
     setupMobileMenu();
});

function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Закрыть меню при клике на ссылку
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Закрыть меню при клике вне меню
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnHamburger && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Закрыть меню при скролле
    window.addEventListener('scroll', function() {
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }, { passive: true });
}
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const text = section.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    });
}
function setupAnchorLinks() {
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
}
function trackScroll() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
function printPage() {
    window.print();
}
function shareArticle() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: 'Посмотрите эту статью на NightArchive',
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Ссылка скопирована в буфер обмена!');
    }
}
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
window.addEventListener('scroll', function() {
    const scrollTopBtn = document.querySelector('.scroll-to-top');
    if (scrollTopBtn) {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    }
});
let hasUnsavedChanges = false;

window.addEventListener('beforeunload', function(e) {
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
    }
});
function generateTableOfContents() {
    const toc = document.querySelector('.toc');
    if (!toc) return;

    const headings = document.querySelectorAll('h2, h3');
    const list = document.createElement('ul');

    headings.forEach((heading, index) => {
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }

        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${heading.id}`;
        a.textContent = heading.textContent;

        if (heading.tagName === 'H3') {
            li.style.marginLeft = '1.5rem';
        }

        li.appendChild(a);
        list.appendChild(li);
    });

    toc.innerHTML = '';
    toc.appendChild(list);
}
document.addEventListener('DOMContentLoaded', function() {
    console.log('NightArchive initialized');
    if (!navigator.clipboard) {
        console.warn('Clipboard API not available');
    }
    setupKeyboardShortcuts();
});
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            printPage();
        }
    });
}

function trackEvent(eventName, eventData) {
    console.log(`Event: ${eventName}`, eventData);
}
window.addEventListener('error', function(event) {
    console.error('Error:', event.error);
});

function checkConnectivity() {
    if (!navigator.onLine) {
        console.warn('No internet connection');
    }
}

window.addEventListener('online', () => {
    console.log('Connection restored');
});

window.addEventListener('offline', () => {
    console.warn('Connection lost');
});
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
const debouncedScroll = debounce(function() {
    trackScroll();
}, 250);
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}
function closeGithubBanner() {
    const banner = document.getElementById('githubBanner');
    if (banner) {
        banner.classList.add('hidden');
        // Сохраняем дату закрытия (баннер вернётся завтра)
        const today = new Date().toDateString();
        localStorage.setItem('githubBannerClosedDate', today);
    }
}

// Проверяем если ли закрытый баннер при загрузке (показываем один раз в день)
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toDateString();
    const closedDate = localStorage.getItem('githubBannerClosedDate');
    
    // Если баннер был закрыт сегодня, скрываем его
    if (closedDate === today) {
        const banner = document.getElementById('githubBanner');
        if (banner) {
            banner.classList.add('hidden');
        }
    }
});
function prefetchResources() {
    const links = document.querySelectorAll('a[href*=".html"]');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#')) {
            const prefetch = document.createElement('link');
            prefetch.rel = 'prefetch';
            prefetch.href = href;
            document.head.appendChild(prefetch);
        }
    });
}
document.addEventListener('DOMContentLoaded', prefetchResources);
function enhancedTrack(eventName, eventData) {
    const event = new CustomEvent('nightarchive:' + eventName, {
        detail: eventData
    });
    window.dispatchEvent(event);
}
function trackToolSearch(query) {
    enhancedTrack('toolSearch', { query, timestamp: new Date() });
}
function trackPageView(page) {
    enhancedTrack('pageView', { page, timestamp: new Date() });
}
// Initialize tools page
document.addEventListener('DOMContentLoaded', function() {
    // Make sure filter and search functions work
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchTools(e.target.value);
        });
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            filterTools(category);
        });
    });
});

window.NightArchive = {
     filterTools,
     searchTools,
     toggleDarkMode,
     printPage,
     shareArticle,
     scrollToTop,
     validateEmail,
     validateUrl,
     closeGithubBanner,
     trackToolSearch,
     trackPageView,
     enhancedTrack
 };
