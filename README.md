# SEO SparkGPT - AI-Powered Content Idea Generator ⚡

SEO SparkGPT is a single-page web application designed as an AI-inspired content idea generator. Users can input a content title or topic, and the tool provides suggestions for SEO keywords, social media hashtags, and short caption ideas. The application features a modern, premium, dark-themed design (with a light theme toggle) and simulates the feel of a professional AI tool.

This project was built for educational and demonstration purposes, showcasing front-end development skills with vanilla HTML, CSS, and JavaScript, including SPA navigation and client-side data simulation.

**➡️ Live Demo (Placeholder):** [**Try SEO SparkGPT!** ✨](https://abhisheksinghshekhawatsde.github.io/SEOSparkGPT/)
*(Replace this link with your actual deployment URL)*

## Screenshot

![SEO SparkGPT Screenshot](https://github.com/AbhishekSinghShekhawatSDE/SEOSparkGPT/blob/c5370eeebf6ad67487c69c115befca7cb707c2e7/Output.jpg)


## Key Features

*   **📝 Content Idea Generation:**
    *   **Keywords:** Extracts core words, generates N-grams, adds common modifiers, deduplicates, and sorts.
    *   **Hashtags:** Converts keywords to hashtags, sanitizes, and filters for validity.
    *   **Captions:** Uses predefined templates dynamically filled with topic/keyword placeholders.
*   **🤖 Client-Side AI Simulation:** All generation logic is performed in the browser using JavaScript rules, mimicking AI behavior without actual LLM integration.
*   **🎨 Dual Theme Interface:**
    *   Defaults to a sophisticated dark theme.
    *   Includes a light theme toggle with preference saved in `localStorage`.
*   **📄 Single-Page Application (SPA):**
    *   Uses URL hash (#) for routing.
    *   Smooth scrolling navigation between sections.
    *   Dynamic title updates.
    *   Handles browser back/forward buttons.
*   **✨ Modern & Premium UI/UX:**
    *   Clean lines, generous spacing, clear visual hierarchy.
    *   Responsive design for desktop, tablet, and mobile.
    *   Subtle transitions and animations.
    *   Font Awesome icons.
*   **⚙️ Interactive Elements:**
    *   Prominent input field with a clear button.
    *   Loading indicator during generation.
    *   User-friendly error messages.
    *   "Copy to Clipboard" functionality for each output section with visual feedback.
*   **📄 Page Sections:**
    *   **Home:** Hero, input, and results.
    *   **Features:** Grid of key capabilities.
    *   **How To Use:** Step-by-step guide.
    *   **Developer:** Brief "Meet the Developer" section.

## Technology Stack

*   **HTML5:** Semantic structure for the web page.
*   **CSS3:** Custom styling, Flexbox, Grid, CSS Variables for theming and responsiveness.
*   **Vanilla JavaScript (ES6+):** All core logic, SPA routing, DOM manipulation, and content generation simulation.
*   **Font Awesome:** For icons (via CDN).
*   **Google Fonts (Inter):** For modern typography.

## Getting Started / How to Run Locally

1.  **Clone the repository (or download the files):**
    ```bash
    git clone https://github.com/your-username/seo-sparkgpt.git
    ```
    *(Replace with your actual repository URL if you create one)*
    Alternatively, if you just have the `index.html`, `style.css`, and `script.js` files, download them into a single folder.

2.  **Navigate to the project directory:**
    ```bash
    cd seo-sparkgpt
    ```

3.  **Open `index.html` in your browser:**
    Simply double-click the `index.html` file, or right-click and choose "Open with" your preferred web browser.

## How to Use

1.  **Navigate to the Home section.**
2.  **Enter Your Topic:** Type your content title or main idea into the prominent input field.
3.  **Hit Generate:** Click the generate button (paper plane icon <i class="fas fa-paper-plane"></i>).
4.  **Review Results:** Explore the generated keywords, hashtags, and caption ideas displayed in their respective cards.
5.  **Copy & Use:** Use the copy buttons (<i class="fas fa-copy"></i>) on each card to easily transfer the generated content.
6.  **Switch Theme:** Use the sun <i class="fas fa-sun"></i> / moon <i class="fas fa-moon"></i> icon in the header to toggle between light and dark themes.


## Non-Goals (For This Iteration)

*   Actual AI/LLM integration.
*   User accounts or database backend.
*   Server-side processing.
*   Complex SEO analysis (e.g., search volume, competition).

## Developer Note

This project serves as a demonstration of front-end web development capabilities, focusing on creating an interactive and aesthetically pleasing user interface with simulated complex functionality using only vanilla web technologies.

---

*This is a DEMO PROJECT for educational & demonstration purposes only. Not intended for commercial use.*
