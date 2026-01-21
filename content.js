/**
 * MoodShield - Content Filtering Engine
 * Refactored: Uses MutationObserver for event-driven protection (0% Idle CPU)
 */

const TRIGGER_CATEGORIES = {
    sadness: ["sad", "depression", "lonely", "breakup", "crying", "death", "grief", "hopeless", "pain"],
    anxiety: ["anxiety", "panic", "stress", "worry", "fear", "fail", "urgent", "pressure"],
    anger: ["fight", "hate", "argument", "rage", "stupid", "idiot", "destroy", "revenge"],
    all: []
};

// Flatten 'all' category
TRIGGER_CATEGORIES.all = [
    ...TRIGGER_CATEGORIES.sadness, 
    ...TRIGGER_CATEGORIES.anxiety, 
    ...TRIGGER_CATEGORIES.anger
];

// Selectors for YouTube Video Titles and Shorts
const TARGET_SELECTORS = "#video-title, .ytd-rich-grid-slim-media, #video-title-link, span.ytd-rich-grid-slim-media";

let activeTriggers = [];

// --- 1. INITIALIZATION ---
chrome.storage.local.get(['selectedMood'], (result) => {
    updateBlocklist(result.selectedMood || 'sadness');
});

chrome.storage.onChanged.addListener((changes) => {
    if (changes.selectedMood) {
        updateBlocklist(changes.selectedMood.newValue);
    }
});

function updateBlocklist(mode) {
    if (!mode || !TRIGGER_CATEGORIES[mode]) mode = 'sadness';
    activeTriggers = TRIGGER_CATEGORIES[mode];
    
    console.log(`[MoodShield] Mode: ${mode.toUpperCase()} | Active Triggers: ${activeTriggers.length}`);
    
    // Scan existing content immediately upon mode change
    scanEntirePage();
}

// --- 2. CORE LOGIC (The Filter) ---
// Checks a single element to see if it needs blocking
function checkAndHide(element) {
    if (!element.innerText) return;
    
    const text = element.innerText.toLowerCase();
    
    if (activeTriggers.some(trigger => text.includes(trigger))) {
        // Find the main container (Card/Row) to hide
        const container = element.closest("ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-reel-item-renderer");
        
        if (container && container.style.display !== "none") {
            container.style.display = "none";
            // LOGGING: Proof for your interview (Console Screenshot)
            console.log(`🛡️ [BLOCKED]: "${text.substring(0, 30)}..." matched trigger.`);
        }
    }
}

// --- 3. MUTATION OBSERVER (The Upgrade) ---
// This runs ONLY when new elements are added to the DOM (Infinite Scroll)
const observer = new MutationObserver((mutations) => {
    // Optimization: If no triggers are active, don't waste CPU
    if (activeTriggers.length === 0) return;

    for (const mutation of mutations) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Ensure it's an Element
                    
                    // Case A: The added node IS the title (Rare, but possible)
                    if (node.matches && node.matches(TARGET_SELECTORS)) {
                        checkAndHide(node);
                    }
                    
                    // Case B: The added node CONTAINS titles (Common - e.g., a new row of videos)
                    // We search only INSIDE the new chunk, not the whole page.
                    else if (node.querySelectorAll) {
                        const newItems = node.querySelectorAll(TARGET_SELECTORS);
                        newItems.forEach(checkAndHide);
                    }
                }
            });
        }
    }
});

// --- 4. START ENGINE ---

// A. Start the Observer (Watches for future scrolls)
observer.observe(document.body, {
    childList: true, // Watch for added elements
    subtree: true    // Watch deep in the hierarchy
});

// B. Scan Initial Page (Handles content already loaded before script ran)
function scanEntirePage() {
    const nodes = document.querySelectorAll(TARGET_SELECTORS);
    nodes.forEach(checkAndHide);
}