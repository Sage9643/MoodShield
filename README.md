# MoodShield 🛡️
**A High-Performance Content Filtering Browser Extension**

MoodShield is a privacy-focused browser extension that protects users from triggering or toxic content (sadness, anxiety, anger) on video streaming platforms like YouTube.

## 🚀 Key Features
- **Real-Time Protection:** Instantly blurs or removes video cards with triggering titles.
- **Dynamic Content Support:** Handles infinite scroll and dynamic page loads seamlessly.
- **Customizable Filters:** Users can select their "Mood" (e.g., block Sadness, block Anxiety).
- **Zero-Latency Feel:** Optimized for performance with no UI lag.

## 🛠️ Technical Implementation (The "Senior" Flex)
Unlike traditional blockers that use inefficient polling loops (`setInterval`), MoodShield is built on an **Event-Driven Architecture**:

* **MutationObserver API:** The engine utilizes the `MutationObserver` interface to watch for DOM changes at the browser paint level.
* **Performance:** CPU usage is near-zero when idle. The script wakes up *only* when new nodes are added (e.g., loading more videos), processes them in O(n) time, and sleeps.
* **Scalability:** Designed to handle heavy DOM trees without causing memory leaks or page jank.

## 📦 Installation
1. Clone this repo.
2. Open Chrome/Edge and go to `chrome://extensions`.
3. Enable "Developer Mode" (top right).
4. Click "Load Unpacked" and select this folder.