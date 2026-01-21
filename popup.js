// popup.js

// 1. Restore saved setting when opening the menu
chrome.storage.local.get(['selectedMood'], function(result) {
    if (result.selectedMood) {
        document.getElementById('moodSelector').value = result.selectedMood;
    } else {
        // If nothing saved, default to sadness
        document.getElementById('moodSelector').value = "sadness";
    }
});

// 2. Save immediately when user changes the dropdown
document.getElementById('moodSelector').addEventListener('change', function() {
    const mood = this.value;
    
    // Save to Chrome Storage
    chrome.storage.local.set({ selectedMood: mood }, function() {
        console.log('Mood saved:', mood);
    });
});