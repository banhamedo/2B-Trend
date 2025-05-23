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

// Form Validation and Submission
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        // Form validation
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Reset previous validation states
            contactForm.classList.remove('was-validated');
            
            // Validate form
            if (!contactForm.checkValidity()) {
                contactForm.classList.add('was-validated');
                return;
            }

            // Show loading state
            showFormLoader();

            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                message: document.getElementById('message').value.trim(),
                timestamp: new Date().toISOString() // Use ISO string for timestamp in RTDB
            };

            try {
                // Save to Realtime Database
                await database.ref('contacts').push(formData); // Use database.ref().push()

                // Send to Telegram (if configured)
                await sendToTelegramBot(formData);

                // Show success message
                formMessage.innerHTML = `
                    <div class="alert alert-success alert-dismissible fade show custom-alert" role="alert">
                        <i class="fas fa-check-circle me-2"></i>
                        تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;

                // Reset form
                contactForm.reset();
                contactForm.classList.remove('was-validated');

            } catch (error) {
                console.error("Error:", error);
                formMessage.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show custom-alert" role="alert">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        حدث خطأ أثناء إرسال الرسالة. الرجاء المحاولة مرة أخرى.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
            } finally {
                hideFormLoader();
            }
        });

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.checkValidity()) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                } else {
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                }
            });
        });
    }
});

// Form Loader Functions
function showFormLoader() {
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        const normalTextSpan = submitBtn.querySelector('.normal-text');
        const loadingTextSpan = submitBtn.querySelector('.loading-text');

        if (normalTextSpan) {
            normalTextSpan.classList.add('d-none');
            normalTextSpan.style.display = 'none'; // Add explicit display none
        }
        if (loadingTextSpan) {
            loadingTextSpan.classList.remove('d-none');
            loadingTextSpan.style.display = 'inline-block'; // Add explicit display for loading text
        }
    }
}

function hideFormLoader() {
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = false;
        const normalTextSpan = submitBtn.querySelector('.normal-text');
        const loadingTextSpan = submitBtn.querySelector('.loading-text');

        if (normalTextSpan) {
            normalTextSpan.classList.remove('d-none');
            normalTextSpan.style.display = ''; // Reset display to default
        }
        if (loadingTextSpan) {
            loadingTextSpan.classList.add('d-none');
            loadingTextSpan.style.display = 'none'; // Add explicit display none
        }
    }
}

// Load Statistics Content from Firebase Realtime Database
function loadStatisticsContent() {
    const statisticElements = document.querySelectorAll('.statistic-number[data-editable-key]');
    
    if (statisticElements.length > 0 && typeof database !== 'undefined') {
        // Listen for changes in the /statistics path in Realtime Database
        database.ref('statistics').once('value', (snapshot) => {
            const statisticsData = snapshot.val();
            if (statisticsData) {
                 statisticElements.forEach(element => {
                    const key = element.getAttribute('data-editable-key');
                    if (statisticsData[key] !== undefined) {
                         // Update the data-target attribute and the text content
                         element.setAttribute('data-target', statisticsData[key]);
                         // Set initial text (the IntersectionObserver will animate it)
                          element.textContent = statisticsData[key];
                    }
                });

                // The IntersectionObserver for statistics animation is already set up

            } else {
                console.log('No statistics data found in Realtime Database at /statistics.');
            }
        }).catch((error) => {
            console.error("Error loading statistics content from Realtime Database:", error);
        });
    }
}

// Initialize content loading
window.addEventListener('DOMContentLoaded', () => {
    // Ensure Firebase and Realtime Database are initialized before loading content
    if (typeof firebase !== 'undefined' && typeof database !== 'undefined') {
         loadStatisticsContent(); // Call the specific function for statistics
    }

    // Chatbot functionality
    const openChatbotBtn = document.getElementById('openChatbot');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChatbotBtn = document.getElementById('closeChatbot');

    if (openChatbotBtn && chatbotWindow) {
        openChatbotBtn.addEventListener('click', () => {
            chatbotWindow.classList.toggle('d-none');
        });
    }

    // Close chatbot when clicking the close button
    if (closeChatbotBtn && chatbotWindow) {
        closeChatbotBtn.addEventListener('click', () => {
            chatbotWindow.classList.add('d-none');
        });
    }

    // Chatbot logic initialization
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotQuestions = document.querySelectorAll('.chatbot-question');
    const chatbotForm = document.getElementById('chatbot-form'); // Correct ID
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotLoader = document.getElementById('chatbot-loader');
    const chatbotSend = document.getElementById('chatbotSend'); // Correct ID

    function showLoader() {
        if (chatbotLoader) chatbotLoader.classList.remove('d-none');
    }
    function hideLoader() {
        if (chatbotLoader) chatbotLoader.classList.add('d-none');
    }

    const faqAnswers = { // Define faqAnswers inside DOMContentLoaded if used only here
        'ما هي الخدمات التي تقدمونها؟': 'نقدم خدمات متكاملة تشمل إدارة السوشيال ميديا، تصميم الجرافيك، إنتاج الفيديو، تصميم المواقع، وتحسين محركات البحث.',
        'كم تستغرق مدة تنفيذ المشروع؟': 'تختلف مدة التنفيذ حسب حجم المشروع وتعقيده. عادةً ما تستغرق المشاريع الصغيرة 2-4 أسابيع، والمشاريع المتوسطة 1-3 أشهر. للحصول على تقدير دقيق لمشروعك، يرجى التواصل معنا.',
        'كيف يمكنني متابعة تقدم المشروع؟': 'نوفر لك تقارير دورية وتحديثات منتظمة عن تقدم المشروع، كما يمكنك التواصل مع فريق العمل المخصص لمشروعك في أي وقت.',
        'أريد عرض الخدمات': '<span>يمكنك استعراض جميع خدماتنا من هنا:</span> <br><a href="#services" class="btn btn-cta btn-sm mt-2">انتقل إلى قسم الخدمات <i class="fas fa-arrow-down"></i></a>',
        'ما هو عنوان شركتكم؟': 'نحن وكالة تسويق رقمي مقرها في مصر. يمكنك التواصل معنا عبر الهاتف أو البريد الإلكتروني للحصول على تفاصيل الموقع أو ترتيب اجتماع.',
        'رقم الهاتف الخاص بكم؟': 'يمكنك التواصل معنا هاتفياً على الرقم: \u202A+20 106 955 9498\u202C', // Added LTR markers
        'ما هو البريد الإلكتروني للتواصل؟': 'يمكنك إرسال استفساراتكم إلى بريدنا الإلكتروني: \u202A2btrend99@gmail.com\u202C', // Changed email and added LTR markers
        'هل تقدمون خدمات SEO؟': 'نعم، نقدم خدمات تحسين محركات البحث (SEO) لمساعدتك في زيادة ظهور موقعك في نتائج البحث.',
        'هل تصممون مواقع إلكترونية؟': 'بالتأكيد، نحن متخصصون في تصميم وتطوير المواقع الإلكترونية الحديثة والمتجاوبة.',
        'ما هي ساعات عملكم؟': 'فريق الدعم لدينا متاح على مدار الساعة 24/7 للإجابة على استفساراتكم، ويمكنك ترك رسالة وسنقوم بالرد عليك في أقرب وقت.',
        'كم تكلفة الخدمات؟': 'تختلف تكلفة الخدمات حسب نوع المشروع وحجمه ونطاقه. يرجى التواصل معنا وتقديم تفاصيل عن مشروعك للحصول على عرض سعر مخصص.'
    }; // Define faqAnswers inside DOMContentLoaded if used only here

    chatbotQuestions.forEach(btn => {
        btn.addEventListener('click', function() {
            const userMessage = this.textContent;
            addMessage(userMessage, false); // Display user message immediately
            showLoader();

            // Save user message to Firebase and get the key
            if (typeof database !== 'undefined') {
                const newMessageRef = database.ref('chatbot_messages').push();
                const messageKey = newMessageRef.key;

                newMessageRef.set({
                    userMessage: userMessage,
                    timestamp: new Date().toISOString()
                }).catch((error) => {
                    console.error('Error saving user message to Firebase:', error);
                });

                // Find bot response and update the same Firebase entry
                const botResponse = faqAnswers[userMessage] || 'عذراً، لم أجد إجابة لهذا السؤال.';

                setTimeout(() => {
                    hideLoader();
                    console.log('Bot response before calling addMessage and updating Firebase:', botResponse); // Log for debugging
                    addMessage(botResponse); // Display bot message

                    // Update the Firebase entry with the bot's response
                    if (messageKey) {
                        database.ref('chatbot_messages/' + messageKey).update({
                            botResponse: botResponse,
                            botTimestamp: new Date().toISOString() // Optional: timestamp for bot response
                        }).catch((error) => {
                            console.error('Error updating Firebase with bot response:', error);
                        });
                    }

                }, 900);

            } else {
                 console.error('Firebase Realtime Database is not initialized. Cannot save chatbot message.');
                 // If Firebase is not initialized, just display the messages in the UI
                 const botResponse = faqAnswers[userMessage] || 'عذراً، لم أجد إجابة لهذا السؤال.';
                 setTimeout(() => {
                    hideLoader();
                    addMessage(botResponse);
                 }, 900);
            }
        });
    });

    if (chatbotForm) {
        // Use addEventListener for form submit - Modified to save and update Firebase
        chatbotForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Chatbot form submit event triggered.');
            const message = chatbotInput.value.trim();
            if (!message) {
                console.log('Message is empty, returning.');
                return;
            }
            console.log('User message is not empty:', message);

            addMessage(message, false); // Display user message immediately
            chatbotInput.value = '';
            showLoader();

            // Save user message to Firebase and get the key
            if (typeof database !== 'undefined') {
                 const newMessageRef = database.ref('chatbot_messages').push();
                 const messageKey = newMessageRef.key;

                 newMessageRef.set({
                     userMessage: message,
                     timestamp: new Date().toISOString()
                 }).catch((error) => {
                     console.error('Error saving user message to Firebase:', error);
                 });

                // Simple logic to find an answer
                let botResponse = 'عذراً، لم أجد إجابة لهذا السؤال.'; // Default response
                const cleanedMessage = message.toLowerCase(); // Convert to lowercase for easier matching

                 // Keyword matching logic (keep existing logic)
                 if (faqAnswers[message]) { // Check for exact match first
                      botResponse = faqAnswers[message];
                 } else if (cleanedMessage.includes('خدمة') || cleanedMessage.includes('عرض') || cleanedMessage.includes('خدماتكم') || cleanedMessage.includes('خدمات')) { // Check for service/offer related keywords
                      botResponse = faqAnswers['ما هي الخدمات التي تقدمونها؟'];
                 } else if (cleanedMessage.includes('تواصل') || cleanedMessage.includes('رقم') || cleanedMessage.includes('هاتف') || cleanedMessage.includes('ايميل') || cleanedMessage.includes('بريد الكتروني')) { // Check for contact related keywords
                      botResponse = faqAnswers['رقم الهاتف الخاص بكم؟'] + '<br>' + faqAnswers['ما هو البريد الإلكتروني للتواصل؟']; // Combine answers
                 } else if (cleanedMessage.includes('عنوان') || cleanedMessage.includes('موقع') || cleanedMessage.includes('مكان')) { // Check for location related keywords
                      botResponse = faqAnswers['ما هو عنوان شركتكم؟'];
                 } else if (cleanedMessage.includes('تكلفة') || cleanedMessage.includes('سعر') || cleanedMessage.includes('اسعار') || cleanedMessage.includes('كم')) { // Check for pricing keywords
                      botResponse = faqAnswers['كم تكلفة الخدمات؟'];
                 }
                  else if (cleanedMessage.includes('مدة') || cleanedMessage.includes('وقت') || cleanedMessage.includes('فترة') || cleanedMessage.includes('يستغرق')) { // Check for duration keywords
                     botResponse = faqAnswers['كم تستغرق مدة تنفيذ المشروع؟'];
                 }
                 else if (cleanedMessage.includes('متابعة') || cleanedMessage.includes('تقدم')) { // Check for project progress keywords
                     botResponse = faqAnswers['كيف يمكنني متابعة تقدم المشروع؟'];
                 }
                  else if (cleanedMessage.includes('seo') || cleanedMessage.includes('تحسين محركات البحث')) { // Check for SEO keywords
                     botResponse = faqAnswers['هل تقدمون خدمات SEO؟'];
                 }
                  else if (cleanedMessage.includes('مواقع') || cleanedMessage.includes('تصميم مواقع')) { // Check for website design keywords
                     botResponse = faqAnswers['هل تصممون مواقع إلكترونية؟'];
                 }
                  else if (cleanedMessage.includes('ساعات عمل') || cleanedMessage.includes('متاح')) { // Check for working hours keywords
                     botResponse = faqAnswers['ما هي ساعات عملكم؟'];
                 }

                setTimeout(() => {
                    hideLoader();
                    console.log('Bot response before calling addMessage and updating Firebase:', botResponse); // Log for debugging
                    addMessage(botResponse); // Display bot message

                     // Update the Firebase entry with the bot's response
                     if (messageKey) {
                         database.ref('chatbot_messages/' + messageKey).update({
                             botResponse: botResponse,
                             botTimestamp: new Date().toISOString() // Optional: timestamp for bot response
                         }).catch((error) => {
                             console.error('Error updating Firebase with bot response:', error);
                         });
                     }

                }, 1200);

             } else {
                 console.error('Firebase Realtime Database is not initialized. Cannot save chatbot message.');
                  // If Firebase is not initialized, just display the messages in the UI
                 let botResponse = 'عذراً، لم أجد إجابة لهذا السؤال.';
                 const cleanedMessage = message.toLowerCase();
                 // Keyword matching logic (duplicate from above - consider refactoring if complex)
                 if (faqAnswers[message]) { botResponse = faqAnswers[message]; } else if (cleanedMessage.includes('خدمة') || cleanedMessage.includes('عرض') || cleanedMessage.includes('خدماتكم') || cleanedMessage.includes('خدمات')) { botResponse = faqAnswers['ما هي الخدمات التي تقدمونها؟']; } else if (cleanedMessage.includes('tواصل') || cleanedMessage.includes('رقم') || cleanedMessage.includes('هاتف') || cleanedMessage.includes('ايميل') || cleanedMessage.includes('بريد الكتروني')) { botResponse = faqAnswers['رقم الهاتف الخاص بكم؟'] + '<br>' + faqAnswers['ما هو البريد الإلكتروني للتواصل؟']; } else if (cleanedMessage.includes('عنوان') || cleanedMessage.includes('موقع') || cleanedMessage.includes('مكان')) { botResponse = faqAnswers['ما هو عنوان شركتكم؟']; } else if (cleanedMessage.includes('تكلفة') || cleanedMessage.includes('سعر') || cleanedMessage.includes('اسعار') || cleanedMessage.includes('كم')) { botResponse = faqAnswers['كم تكلفة الخدمات؟']; } else if (cleanedMessage.includes('مدة') || cleanedMessage.includes('وقت') || cleanedMessage.includes('فترة') || cleanedMessage.includes('يستغرق')) { botResponse = faqAnswers['كم تستغرق مدة تنفيذ المشروع؟']; } else if (cleanedMessage.includes('متابعة') || cleanedMessage.includes('تقدم')) { botResponse = faqAnswers['كيف يمكنني متابعة تقدم المشروع؟']; } else if (cleanedMessage.includes('seo') || cleanedMessage.includes('تحسين محركات البحث')) { botResponse = faqAnswers['هل تقدمون خدمات SEO؟']; } else if (cleanedMessage.includes('مواقع') || cleanedMessage.includes('تصميم مواقع')) { botResponse = faqAnswers['هل تصممون مواقع إلكترونية؟']; } else if (cleanedMessage.includes('ساعات عمل') || cleanedMessage.includes('متاح')) { botResponse = faqAnswers['ما هي ساعات عملكم؟']; }
                 setTimeout(() => {
                    hideLoader();
                    addMessage(botResponse);
                 }, 1200);
             }
        });
    }

}); // Close DOMContentLoaded listener

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

function addMessage(message, isBot = true) {
    const bubble = document.createElement('div');
    bubble.className = `chatbot-bubble chatbot-bubble-${isBot ? 'bot' : 'user'}`;

    // Add message to the chat window (Firebase saving moved out of this function)
    if (message.includes('<a ') || message.includes('<span') || message.includes('<br>')) { // Allow basic HTML like links and line breaks
        bubble.innerHTML = message;
    } else {
        bubble.textContent = message;
    }
    chatbotMessages.appendChild(bubble);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    // Removed Firebase saving from here
} 