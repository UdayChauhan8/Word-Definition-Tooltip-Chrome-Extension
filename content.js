/**
 * content.js
 *
 * This script runs on web pages to detect user text selection,
 * create and manage the definition tooltip, and communicate with the background script.
 *
 * v2.2: Fixed the critical positioning bug causing the tooltip to be off-screen.
 */

let tooltip = null;
let tooltipTimeout = null;

// Creates the tooltip element and appends it to the body
function createTooltip() {
    const tooltipElement = document.createElement('div');
    tooltipElement.className = 'word-definition-tooltip';
    document.body.appendChild(tooltipElement);
    return tooltipElement;
}

/**
 * Displays the tooltip with a definition for the selected text.
 * @param {string} text - The selected word.
 * @param {number} x - The horizontal center for the tooltip, relative to the viewport.
 * @param {number} y - The vertical top position for the tooltip, relative to the viewport.
 */
function showTooltip(text, x, y) {
    if (!tooltip) {
        tooltip = createTooltip();
    }

    if (tooltipTimeout) clearTimeout(tooltipTimeout);

    // Set tooltip position. CSS transform will handle the centering.
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    tooltip.textContent = 'Loading...';
    tooltip.style.opacity = '1';
    tooltip.style.visibility = 'visible';

    // Request the definition from the background script
    chrome.runtime.sendMessage({ action: 'getDefinition', word: text }, (response) => {
        if (chrome.runtime.lastError) {
            if(tooltip) tooltip.textContent = 'Error: Extension reloaded. Please select again.';
            console.error(chrome.runtime.lastError.message);
            return;
        }

        if (tooltip.style.visibility === 'visible') {
            if (response && response.definition) {
                tooltip.textContent = response.definition;
            } else {
                tooltip.textContent = `No definition found for "${text}"`;
            }
            if (tooltipTimeout) clearTimeout(tooltipTimeout);
            tooltipTimeout = setTimeout(hideTooltip, 5000);
        }
    });
}

// Hides the tooltip with a fade-out effect
function hideTooltip() {
    if (tooltip) {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
    }
    if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
    }
}

// Sanitize the selected text
function sanitizeText(text) {
    return text.trim().replace(/[.,;:"“”'‘’!?]+$/, '').replace(/^['"]/, '');
}


// Event listener for when the user selects text
document.addEventListener('mouseup', function(e) {
    if (tooltip && tooltip.contains(e.target)) {
        return;
    }

    const selection = window.getSelection();
    const rawText = selection.toString();
    const selectedText = sanitizeText(rawText);

    if (selectedText && selectedText.length > 1 && !selectedText.includes(' ')) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        if (rect.width > 0 || rect.height > 0) {
            // CORRECT WAY to calculate position for a "position: fixed" element.
            // rect.left and rect.top are already relative to the viewport.
            const xPos = rect.left + rect.width / 2;
            const yPos = rect.top; // Do NOT add window.scrollY

            showTooltip(selectedText, xPos, yPos - 10); // Show 10px above selection
        }
    } else {
        hideTooltip();
    }
});

document.addEventListener('mousedown', function(e) {
    if (tooltip && !tooltip.contains(e.target)) {
        hideTooltip();
    }
});

document.addEventListener('scroll', hideTooltip, true);
document.addEventListener('keydown', hideTooltip);
