// Scroll to top when clicking on navbar brand
const navbarBrand = document.querySelector('.navbar-brand');
if (navbarBrand) {
    navbarBrand.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default link behavior
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Smooth scrolling
        });
    });
}

// Loader hide on page load
window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hide');
        setTimeout(() => loader.style.display = 'none', 600);
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.padding = '0.5rem 0';
        navbar.style.boxShadow = '0 2px 8px rgba(61,41,86,0.1)';
    } else {
        navbar.style.padding = '0.8rem 0';
        navbar.style.boxShadow = '0 2px 8px rgba(61,41,86,0.04)';
    }
});

// Number counting animation for statistics
const statisticNumbers = document.querySelectorAll('.statistic-number');

const countObserverOptions = {
    threshold: 0.7 // Trigger when 70% of the element is visible
};

const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numberElement = entry.target;
            const targetNumber = parseInt(numberElement.getAttribute('data-target'));
            const duration = 1500; // Animation duration in milliseconds
            const start = 0;
            let startTime = null;

            function animateCount(timestamp) {
                if (!startTime) startTime = timestamp;
                const progress = timestamp - startTime;
                const currentNumber = Math.floor(progress / duration * targetNumber);
                
                // Add '+' sign and handle 5
                if (targetNumber === 5) {
                     numberElement.textContent = '+' + Math.min(currentNumber, targetNumber);
                } else {
                     numberElement.textContent = '+' + Math.min(currentNumber, targetNumber);
                }
               
                if (progress < duration) {
                    requestAnimationFrame(animateCount);
                } else {
                    numberElement.textContent = '+' + targetNumber;
                    observer.unobserve(numberElement); // Stop observing once animation is complete
                }
            }

            requestAnimationFrame(animateCount);
        }
    });
}, countObserverOptions);

statisticNumbers.forEach(numberElement => {
    countObserver.observe(numberElement);
});

// Form submission handling
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;

            try {
                // Assuming 'db' is initialized in home2.html and accessible globally
                if (typeof db !== 'undefined') {
                    await db.collection('contacts').add({
                        name: name,
                        email: email,
                        phone: phone,
                        message: message,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    });

                    formMessage.textContent = 'تم إرسال رسالتك بنجاح!';
                    formMessage.className = 'mt-3 success';
                    contactForm.reset();
                } else {
                    throw new Error('Firebase Firestore is not initialized.');
                }

            } catch (error) {
                console.error("Error adding document: ", error);
                formMessage.textContent = 'حدث خطأ أثناء إرسال الرسالة. الرجاء المحاولة مرة أخرى.';
                formMessage.className = 'mt-3 error';
            }
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Scroll to top button
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

     // Services Tabs Functionality
     const serviceTabs = document.querySelectorAll('.service-tab');
     const serviceContents = document.querySelectorAll('.service-content');

     serviceTabs.forEach(tab => {
         tab.addEventListener('click', () => {
             const targetService = tab.dataset.service;

             serviceTabs.forEach(t => t.classList.remove('active'));
             tab.classList.add('active');

             serviceContents.forEach(content => {
                 if (content.id === `service-${targetService}`) {
                     content.classList.add('active');
                 } else {
                     content.classList.remove('active');
                 }
             });
         });
     });

     // Activate the first tab by default
     if (serviceTabs.length > 0) {
         serviceTabs[0].click();
     }

    // Statistics Counter Animation
    const statisticsSection = document.getElementById('statistics');
    let statsAnimated = false;

    const animateNumbers = () => {
        statisticNumbers.forEach(number => {
            const target = parseInt(number.getAttribute('data-target'));
            let current = 0;
            const duration = 2000; // Animation duration in milliseconds
            const increment = target / (duration / 10);

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    number.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    number.textContent = target;
                }
            };

            updateCounter();
        });
        statsAnimated = true;
    };

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the section is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                animateNumbers();
                // observer.unobserve(entry.target); // Optional: stop observing after animation
            }
        });
    }, observerOptions);

    if (statisticsSection) {
        observer.observe(statisticsSection);
    }

});

// Function to send data to Telegram Bot API (Server-side implementation needed)
async function sendToTelegramBot(data) {
    const botToken = 'YOUR_BOT_TOKEN'; // REPLACE with your bot token
    const chatId = 'YOUR_CHAT_ID'; // REPLACE with your chat ID
    const text = `New Contact Form Submission:\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nMessage: ${data.message}`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text
            })
        });

        const result = await response.json();
        if (!result.ok) {
            console.error('Error sending to Telegram:', result.description);
            // Handle error (e.g., log to console or show user a different message)
        } else {
            console.log('Message sent to Telegram successfully!');
        }

    } catch (error) {
        console.error('Error sending to Telegram:', error);
        // Handle network errors etc.
    }
}

// Add animation to services cards on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate__animated', 'animate__fadeInUp');
        }
    });
}, observerOptions);

document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
});

// Chatbot logic
const chatbotBtn = document.getElementById('chatbot-btn');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotQuestions = document.querySelectorAll('.chatbot-question');
const chatbotForm = document.getElementById('chatbot-form');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotLoader = document.getElementById('chatbot-loader');

function showLoader() {
    if (chatbotLoader) chatbotLoader.classList.remove('d-none');
}
function hideLoader() {
    if (chatbotLoader) chatbotLoader.classList.add('d-none');
}

const faqAnswers = {
    'ما هي الخدمات التي تقدمونها؟': 'نقدم خدمات متكاملة تشمل إدارة السوشيال ميديا، تصميم الجرافيك، إنتاج الفيديو، تصميم المواقع، وتحسين محركات البحث.',
    'كم تستغرق مدة تنفيذ المشروع؟': 'تختلف مدة التنفيذ حسب حجم المشروع وتعقيده. عادةً ما تستغرق المشاريع الصغيرة 2-4 أسابيع، والمشاريع المتوسطة 1-3 أشهر.',
    'كيف يمكنني متابعة تقدم المشروع؟': 'نوفر لك تقارير دورية وتحديثات منتظمة عن تقدم المشروع، كما يمكنك التواصل مع فريق العمل في أي وقت.',
    'أريد عرض الخدمات': '<span>يمكنك استعراض جميع خدماتنا من هنا:</span> <br><a href="#services" class="btn btn-cta btn-sm mt-2">انتقل إلى قسم الخدمات <i class="fas fa-arrow-down"></i></a>'
};

if (chatbotBtn && chatbotWindow && chatbotClose) {
    chatbotBtn.onclick = () => chatbotWindow.classList.remove('d-none');
    chatbotClose.onclick = () => chatbotWindow.classList.add('d-none');
}

chatbotQuestions.forEach(btn => {
    btn.onclick = function() {
        addMessage(this.textContent, false);
        showLoader();
        setTimeout(() => {
            hideLoader();
            addMessage(faqAnswers[this.textContent] || 'عذراً، لم أجد إجابة لهذا السؤال.');
        }, 900);
    };
});

if (chatbotForm) {
    chatbotForm.onsubmit = function(e) {
        e.preventDefault();
        const message = chatbotInput.value.trim();
        if (!message) return;
        addMessage(message, false);
        chatbotInput.value = '';
        showLoader();
        setTimeout(() => {
            hideLoader();
            if (message.includes('خدمة') || message.includes('عرض')) {
                addMessage(faqAnswers['أريد عرض الخدمات']);
            } else {
                addMessage('شكراً على سؤالك! سنقوم بالرد عليك في أقرب وقت ممكن.');
            }
        }, 1200);
    };
}

function addMessage(message, isBot = true) {
    const bubble = document.createElement('div');
    bubble.className = `chatbot-bubble chatbot-bubble-${isBot ? 'bot' : 'user'}`;
    if (message.includes('<a ') || message.includes('<span')) {
        bubble.innerHTML = message;
    } else {
        bubble.textContent = message;
    }
    chatbotMessages.appendChild(bubble);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Sidebar Services Tabs
const serviceTabs = document.querySelectorAll('.service-tab');
const serviceContents = document.querySelectorAll('.service-content');

serviceTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        if (this.classList.contains('active')) return;
        
        // Remove active from all tabs and contents
        serviceTabs.forEach(t => t.classList.remove('active'));
        serviceContents.forEach(c => c.classList.remove('active')); // Remove active only

        // Add active to the clicked tab
        this.classList.add('active');

        // Get the target content
        const targetId = 'service-' + this.getAttribute('data-service');
        const targetContent = document.getElementById(targetId);

        if (targetContent) {
            // Add active to the target content to display it
            targetContent.classList.add('active');
        }
    });
});

// On page load, show the first tab content
window.addEventListener('DOMContentLoaded', function() {
    const firstTab = document.querySelector('.service-tab');
    const firstContent = document.querySelector('.service-content');
    if (firstTab && firstContent) {
        firstTab.classList.add('active');
        firstContent.classList.add('active');
    }
});

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Copy WhatsApp Number
function copyWhatsApp() {
    const number = document.getElementById('whatsappNumber').textContent;
    navigator.clipboard.writeText(number).then(() => {
        // Show success message
        const btn = event.target.closest('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
        btn.classList.add('btn-success');
        btn.classList.remove('btn-outline-success');
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('btn-success');
            btn.classList.add('btn-outline-success');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Share Website
function shareWebsite() {
    if (navigator.share) {
        navigator.share({
            title: '2B Trend - وكالة تسويق رقمي',
            text: 'تعرف على 2B Trend - وكالة تسويق رقمي متكاملة تقدم حلولاً إبداعية لنمو أعمالك',
            url: window.location.href
        }).catch(err => {
            console.error('Error sharing:', err);
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareUrl = encodeURIComponent(window.location.href);
        const shareText = encodeURIComponent('تعرف على 2B Trend - وكالة تسويق رقمي متكاملة تقدم حلولاً إبداعية لنمو أعمالك');
        window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`, '_blank');
    }
}

// Service Card Overlay for Touch Devices
function handleServiceCardTouch() {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    card.addEventListener('touchstart', function(e) {
      // Remove active from all
      cards.forEach(c => c.classList.remove('active'));
      // Add active to this
      this.classList.add('active');
      // Prevent scroll
      e.stopPropagation();
    });
  });
  // Hide overlay when touching outside
  document.addEventListener('touchstart', function(e) {
    if (!e.target.closest('.service-card')) {
      cards.forEach(c => c.classList.remove('active'));
    }
  });
}
// Run on DOMContentLoaded
window.addEventListener('DOMContentLoaded', function() {
  handleServiceCardTouch();
});

// Splash/Welcome Screen hide automatically after 1.5s
window.addEventListener('DOMContentLoaded', function() {
  const splash = document.getElementById('splash');
  if (splash) {
    setTimeout(() => {
      splash.classList.add('hide');
      setTimeout(() => {
        splash.style.display = 'none';
        window.location.hash = '#home';
      }, 800);
    }, 1500);
  }
});

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 80; // Adjust offset for fixed navbar
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        // Handle 'الرئيسية' separately as it links to index.html or #home
        if (current === 'home' && (link.getAttribute('href') === 'index.html' || link.getAttribute('href') === '#home')) {
             link.classList.add('active');
        } else if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Scroll to section smoothly on click (optional but good UX)
document.querySelectorAll('.navbar-nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Special handling for 'الرئيسية' link if it points to index.html but should scroll to #home
const homeLink = document.querySelector('.navbar-nav a[href="index.html"]');
if(homeLink) {
    homeLink.addEventListener('click', function(e) {
        // Check if we are on the index.html page
        if (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/index.html')) {
            e.preventDefault();
            document.querySelector('#home').scrollIntoView({
                behavior: 'smooth'
            });
        }
        // If not on index.html, let the link behave normally (navigate to index.html)
    });
}

// Firebase Configuration (using the config from home.html)
// ... (keep your existing firebase config and initialization if you have it)

// Ensure Firebase is initialized and db is accessible
// const db = firebase.database(); // Uncomment if db is not globally accessible

// Function to load editable content from Firebase
function loadEditableContent() {
    const editableElements = document.querySelectorAll('[data-editable-key]');
    
    if (editableElements.length > 0 && db) {
        // Fetch all editable content under the 'content' node
        db.ref('content').once('value', (snapshot) => {
            const contentData = snapshot.val();
            if (contentData) {
                editableElements.forEach(element => {
                    const key = element.getAttribute('data-editable-key');
                    // Use textContent for simple text nodes, consider innerHTML for rich text if needed
                    if (contentData[key] !== undefined) {
                         // Check if it's a statistic number to handle '+' sign
                        if (element.classList.contains('statistic-number')) {
                            element.textContent = '+' + contentData[key];
                        } else {
                             element.textContent = contentData[key];
                        }
                    }
                });
            }
        }).catch((error) => {
            console.error('Error loading editable content:', error);
        });
    }
}

// Call the function to load editable content when the page loads
window.addEventListener('DOMContentLoaded', loadEditableContent); 