document.addEventListener('DOMContentLoaded', () => {
    // --- THEME MANAGEMENT ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    themeToggleBtn.addEventListener('click', () => {
        let newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    applyTheme(currentTheme);

    // --- SMOOTH SCROLL NAVIGATION & ACTIVE LINK HIGHLIGHTING ---
    const navLinks = document.querySelectorAll('.nav-link'); // Includes logo and nav items
    const sections = document.querySelectorAll('.page-section'); // All content sections
    const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 65;


    function updateActiveNavLink(targetHash) {
        navLinks.forEach(link => {
            if (link.getAttribute('href') === targetHash) {
                link.classList.add('active-link');
            } else {
                link.classList.remove('active-link');
            }
        });
    }

    function navigateToSection(hash) {
        if (!hash || hash === '#') hash = '#home'; // Default to #home

        const targetSection = document.querySelector(hash);
        if (targetSection) {
            // Calculate scroll position manually for more precise offset
            // const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            // window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            // Using scrollIntoView with scroll-margin-top (CSS) is simpler if browser support is good
             targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });


            document.title = `SEO SparkGPT - ${hash.substring(1).charAt(0).toUpperCase() + hash.substring(2).replace(/-/g, ' ')}`;
            updateActiveNavLink(hash); // Update active link immediately on click
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const hash = link.getAttribute('href');
            
            if (window.location.hash !== hash) {
                history.pushState(null, '', hash);
            }
            navigateToSection(hash);
        });
    });

    // Intersection Observer for updating active link on scroll
    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: `-${headerHeight + 10}px 0px -60% 0px`, // Adjust rootMargin: top offset by header, bottom to ensure section is well in view
        threshold: 0 // Trigger when any part of the section enters/leaves the intersection area
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = '#' + entry.target.id;
                // Only update if not a direct click that already set it
                // Or if a different section is now active due to scrolling
                const currentActive = document.querySelector('#main-nav a.active-link');
                if (!currentActive || currentActive.getAttribute('href') !== sectionId) {
                     updateActiveNavLink(sectionId);
                     // Avoid changing history or title on scroll, only on explicit navigation
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const currentHash = window.location.hash || '#home';
        navigateToSection(currentHash);
    });

    // Initial page load: scroll to hash if present, or set active link for #home
    const initialHash = window.location.hash || '#home';
    if (initialHash && document.querySelector(initialHash)) {
        // Delay slightly for assets to load and layout to stabilize before scrolling
        setTimeout(() => {
            navigateToSection(initialHash);
        }, 100);
    } else {
        navigateToSection('#home'); // Default, ensures title and active link are set
    }


    // --- FOOTER YEAR ---
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // --- INPUT HANDLING ---
    const topicInput = document.getElementById('topic-input');
    const generateBtn = document.getElementById('generate-btn');
    const clearInputBtn = document.getElementById('clear-input-btn');
    const loadingIndicator = document.getElementById('loading-indicator');
    const resultsSection = document.getElementById('results-section');
    const errorMessageArea = document.getElementById('error-message-area');

    topicInput.addEventListener('input', () => {
        clearInputBtn.style.display = topicInput.value.length > 0 ? 'block' : 'none';
        if (topicInput.value.length > 0) {
            clearError();
        }
    });

    clearInputBtn.addEventListener('click', () => {
        topicInput.value = '';
        clearInputBtn.style.display = 'none';
        resultsSection.style.display = 'none';
        clearError();
        topicInput.focus();
    });

    generateBtn.addEventListener('click', handleGeneration);

    // --- ERROR HANDLING ---
    function showError(message) {
        errorMessageArea.textContent = message;
        errorMessageArea.style.display = 'block';
        resultsSection.style.display = 'none';
        loadingIndicator.style.display = 'none';
    }

    function clearError() {
        errorMessageArea.textContent = '';
        errorMessageArea.style.display = 'none';
    }

    // --- OUTPUT ELEMENTS ---
    const keywordsOutput = document.getElementById('keywords-output');
    const hashtagsOutput = document.getElementById('hashtags-output');
    const captionsOutputList = document.getElementById('captions-output');

    const keywordsCard = document.getElementById('keywords-card');
    const hashtagsCard = document.getElementById('hashtags-card');
    const captionsCard = document.getElementById('captions-card');

    // --- COPY FUNCTIONALITY ---
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const targetElement = document.getElementById(targetId);
            const feedbackSpan = button.querySelector('.copy-feedback');
            let textToCopy = '';

            if (targetId === 'captions-output') {
                textToCopy = Array.from(targetElement.children)
                                .map(li => li.textContent)
                                .join('\n\n');
            } else {
                textToCopy = targetElement.textContent;
            }

            if (!textToCopy || textToCopy.startsWith("No relevant")) {
                showCopyFeedback(feedbackSpan, "Nothing to copy!", false);
                return;
            }

            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    showCopyFeedback(feedbackSpan, "Copied!", true);
                })
                .catch(err => {
                    showCopyFeedback(feedbackSpan, "Copy failed!", false);
                    console.error('Failed to copy: ', err);
                });
        });
    });

    function showCopyFeedback(span, message, success) {
        span.textContent = message;
        span.style.color = success ? 'var(--accent-color)' : '#f87171';
        span.classList.add('visible');
        setTimeout(() => {
            span.classList.remove('visible');
            span.textContent = ''; 
        }, 2000);
    }

    // --- GENERATION LOGIC CONSTANTS & HELPERS ---
    const STOP_WORDS = new Set(['a', 'an', 'and', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'can', 'could', 'may', 'might', 'must', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'to', 'of', 'in', 'on', 'at', 'by', 'for', 'with', 'about', 'from', 'up', 'down', 'out', 'over', 'under', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'just']);
    const KEYWORD_MODIFIERS = ["best", "top", "tips", "guide", "review", "how to", "what is", "why", "benefits", "examples", "ideas", "2024", "2025", "ultimate", "complete", "beginner", "advanced"];
    const CAPTION_TEMPLATES = [
        "Unlock the secrets of {topic}! ✨ Discover {keyword1} and {keyword2}. #{tag1} #{tag2}",
        "Thinking about {topic}? Here's a quick guide. Don't miss out on {keyword1}! #ContentCreation #{tag1}",
        "Dive deep into {topic}. We cover {keyword1}, {keyword2}, and more! #{tag1} #ExpertTips",
        "Struggling with {topic}? Try these tips for {keyword1}! More at our blog. #{tag2} #ProTip",
        "New post alert! 🚨 Everything you need to know about {topic}. Featuring {keyword1}. #{tag1} #{tag2}",
        "Your ultimate guide to {topic} is here! Learn about {keyword1} and {keyword2}. #ContentStrategy #{tag1}",
        "Let's talk {topic}! What are your thoughts on {keyword1}? Share below! 👇 #{tag2} #Discussion",
        "Exploring {topic} today. Key takeaway: {keyword1}. What's yours? #{tag1} #LearnSomethingNew",
        "Master {topic} with our expert insights on {keyword1} and {keyword2}. #{tag1} #{tag2} #Knowledge",
        "Just dropped a fresh take on {topic}! Check out why {keyword1} matters. #{tag2} #Innovation",
        "Curious about {topic}? We break down {keyword1} and offer {keyword2} ideas. #{tag1} #Inspiration",
        "Boost your strategy with {topic}! Focus on {keyword1} for maximum impact. #{tag2} #GrowthHacking"
    ];
    const KEYWORD_TARGET_COUNT = 15;
    const HASHTAG_TARGET_COUNT = 15;
    const CAPTION_TARGET_COUNT = 2;
    const MIN_WORD_LENGTH = 3; 
    const MIN_KEYWORD_PHRASE_LENGTH = 3; 
    const MIN_HASHTAG_LENGTH = 3;
    const MAX_HASHTAG_LENGTH = 24;


    function cleanInputText(text) {
        return text.toLowerCase().trim().replace(/\s+/g, ' ');
    }

    function extractCoreWords(cleanedText) {
        return cleanedText.split(' ')
            .map(word => word.replace(/[^a-z0-9]/gi, ''))
            .filter(word => word.length >= MIN_WORD_LENGTH && !STOP_WORDS.has(word) && isNaN(parseInt(word)));
    }
    
    function generateNgrams(words, n) {
        const ngrams = [];
        if (words.length < n) return ngrams;
        for (let i = 0; i <= words.length - n; i++) {
            const ngramSlice = words.slice(i, i + n);
            const significantWords = ngramSlice.filter(word => !STOP_WORDS.has(word) && word.length >= MIN_WORD_LENGTH);
            if (significantWords.length > 0) {
                 ngrams.push(ngramSlice.join(' '));
            }
        }
        return ngrams;
    }

    function generateKeywords(inputText) {
        const cleanedInput = cleanInputText(inputText);
        const allInputWords = cleanedInput.split(' ').filter(Boolean);
        const coreWords = extractCoreWords(cleanedInput);
        
        let potentialKeywords = new Set();

        if (allInputWords.length > 0 && allInputWords.length <= 5) {
            potentialKeywords.add(allInputWords.join(' '));
        }
        
        coreWords.forEach(word => potentialKeywords.add(word));

        [2, 3].forEach(n => {
            const ngrams = generateNgrams(allInputWords, n);
            ngrams.forEach(ngram => potentialKeywords.add(ngram));
        });
        
        KEYWORD_MODIFIERS.forEach(modifier => {
            coreWords.forEach(coreWord => {
                potentialKeywords.add(`${modifier} ${coreWord}`);
                potentialKeywords.add(`${coreWord} ${modifier}`);
            });
            if (allInputWords.length > 1 && allInputWords.length <= 3) {
                potentialKeywords.add(`${modifier} ${allInputWords.join(' ')}`);
            }
        });

        let keywordsArray = Array.from(potentialKeywords)
            .filter(kw => kw.length >= MIN_KEYWORD_PHRASE_LENGTH)
            .map(kw => kw.trim().replace(/\s+/g, ' ')); 

        keywordsArray = Array.from(new Set(keywordsArray));

        keywordsArray.sort((a, b) => {
            const aWords = a.split(' ').length;
            const bWords = b.split(' ').length;
            if (aWords !== bWords) return bWords - aWords; 
            return b.length - a.length; 
        });
        
        return keywordsArray.slice(0, KEYWORD_TARGET_COUNT);
    }

    function sanitizeHashtag(text) {
        return text.toLowerCase()
                   .replace(/\s+/g, '') 
                   .replace(/[^a-z0-9_]/g, '');
    }

    function generateHashtags(keywords, coreWords) {
        let potentialHashtags = new Set();

        keywords.forEach(kw => {
            kw.split(' ').forEach(word => {
                if (word.length >= MIN_HASHTAG_LENGTH && !STOP_WORDS.has(word)) {
                     potentialHashtags.add(sanitizeHashtag(word));
                }
            });
            const fullKwHashtag = sanitizeHashtag(kw);
            if (fullKwHashtag.length <= MAX_HASHTAG_LENGTH) {
                potentialHashtags.add(fullKwHashtag);
            }
        });

        coreWords.forEach(word => {
            potentialHashtags.add(sanitizeHashtag(word));
        });

        let hashtagsArray = Array.from(potentialHashtags)
            .filter(tag => tag.length >= MIN_HASHTAG_LENGTH && tag.length <= MAX_HASHTAG_LENGTH)
            .map(tag => `#${tag}`);
        
        hashtagsArray = Array.from(new Set(hashtagsArray));

        return hashtagsArray.slice(0, HASHTAG_TARGET_COUNT);
    }

    function getRandomElements(arr, count) {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function generateCaptions(topic, keywords, hashtags) {
        if (CAPTION_TEMPLATES.length === 0) return [];
        
        const selectedTemplates = getRandomElements(CAPTION_TEMPLATES, CAPTION_TARGET_COUNT);
        const filledCaptions = [];

        const coreTopicWords = extractCoreWords(cleanInputText(topic));

        for (const template of selectedTemplates) {
            let caption = template;
            caption = caption.replace(/{topic}/g, topic || (coreTopicWords.length > 0 ? coreTopicWords.join(' ') : "this amazing subject"));
            
            caption = caption.replace(/{keyword1}/g, keywords[0] || coreTopicWords[0] || "key aspects");
            caption = caption.replace(/{keyword2}/g, keywords[1] || (keywords[0] && keywords[0] !== (coreTopicWords[1] || keywords[0]) ? (coreTopicWords[1] || keywords[0]) : "valuable insights") );

            caption = caption.replace(/{tag1}/g, hashtags[0] ? hashtags[0].substring(1) : "contentmarketing");
            caption = caption.replace(/{tag2}/g, hashtags[1] ? (hashtags[0] && hashtags[1] !== hashtags[0] ? hashtags[1].substring(1) : "digitalstrategy") : "seo");
            
            filledCaptions.push(caption);
        }
        return filledCaptions;
    }


    // --- MAIN GENERATION FUNCTION ---
    async function handleGeneration() {
        const inputText = topicInput.value.trim();
        if (!inputText) {
            showError("Please enter a topic or title.");
            return;
        }
        clearError();
        resultsSection.style.display = 'none';
        loadingIndicator.style.display = 'flex';

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const generatedKeywords = generateKeywords(inputText);
            const coreWordsForHashtags = extractCoreWords(cleanInputText(inputText)); 
            const generatedHashtags = generateHashtags(generatedKeywords, coreWordsForHashtags);
            const generatedCaptions = generateCaptions(inputText, generatedKeywords, generatedHashtags);

            displayResults(generatedKeywords, generatedHashtags, generatedCaptions);

        } catch (error) {
            console.error("Generation error:", error);
            showError("An unexpected error occurred during generation. Please try again.");
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    function displayResults(kws, hts, caps) {
        if (kws.length > 0) {
            keywordsOutput.textContent = kws.join(', ');
            keywordsCard.querySelector('.no-results-message').style.display = 'none';
            keywordsOutput.style.display = 'block';
        } else {
            keywordsOutput.textContent = '';
            keywordsCard.querySelector('.no-results-message').style.display = 'block';
            keywordsOutput.style.display = 'none';
        }

        if (hts.length > 0) {
            hashtagsOutput.textContent = hts.join(' ');
            hashtagsCard.querySelector('.no-results-message').style.display = 'none';
            hashtagsOutput.style.display = 'block';
        } else {
            hashtagsOutput.textContent = '';
            hashtagsCard.querySelector('.no-results-message').style.display = 'block';
            hashtagsOutput.style.display = 'none';
        }

        captionsOutputList.innerHTML = ''; 
        if (caps.length > 0) {
            caps.forEach(captionText => {
                const li = document.createElement('li');
                li.textContent = captionText;
                captionsOutputList.appendChild(li);
            });
            captionsCard.querySelector('.no-results-message').style.display = 'none';
            captionsOutputList.style.display = 'block';
        } else {
            captionsCard.querySelector('.no-results-message').style.display = 'block';
            captionsOutputList.style.display = 'none';
        }
        resultsSection.style.display = 'grid'; 
    }

});