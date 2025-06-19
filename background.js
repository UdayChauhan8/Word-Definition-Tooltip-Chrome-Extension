/**
 * background.js
 *
 * This script handles the API requests to fetch word definitions,
 * manages caching to reduce API calls, and communicates with the content script.
 * It now uses the free dictionaryapi.dev, which doesn't require an API key.
 */

// Cache for definitions to reduce API calls
const definitionCache = new Map();
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Check if a cached definition is still valid
function isCacheValid(cacheEntry) {
    return Date.now() - cacheEntry.timestamp < CACHE_EXPIRY;
}

/**
 * Extracts the most relevant definition from the API response.
 * @param {object} data - The JSON data from the dictionary API.
 * @returns {string|null} The definition text or null if not found.
 */
function extractDefinition(data) {
    if (!Array.isArray(data) || data.length === 0) {
        return null;
    }

    const firstResult = data[0];
    if (firstResult && firstResult.meanings && Array.isArray(firstResult.meanings)) {
        for (const meaning of firstResult.meanings) {
            if (meaning.definitions && Array.isArray(meaning.definitions) && meaning.definitions.length > 0) {
                // Return the first definition found
                return meaning.definitions[0].definition;
            }
        }
    }

    return null; // Return null if no definition is found in the expected structure
}

/**
 * Fetches a definition from the free dictionary API.
 * @param {string} word - The word to look up.
 * @returns {Promise<string|null>} A promise that resolves to the definition or null.
 */
async function fetchDefinition(word) {
    try {
        console.log(`Fetching definition for: "${word}"`);

        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);

        console.log('API Response status:', response.status);

        // If the request was not successful (e.g., 404 Not Found), throw an error.
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response data:', data);

        // Extract the definition from the complex JSON object.
        const definition = extractDefinition(data);
        return definition;

    } catch (error) {
        console.error(`Error fetching definition for "${word}":`, error);
        // We re-throw the error so the calling function knows the fetch failed.
        throw error;
    }
}

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Ensure this is the correct message type
    if (request.action === 'getDefinition') {
        const word = request.word.toLowerCase().trim();

        if (!word) {
            sendResponse({ error: 'No word provided' });
            return true; // Keep the message channel open for async response
        }

        // Check cache first
        if (definitionCache.has(word)) {
            const cacheEntry = definitionCache.get(word);
            if (isCacheValid(cacheEntry)) {
                console.log(`Using cached definition for: "${word}"`);
                sendResponse({ definition: cacheEntry.definition });
                return true; // Indicate async response
            } else {
                // The cache entry has expired, remove it.
                definitionCache.delete(word);
            }
        }

        // If not in cache or expired, fetch from the API
        fetchDefinition(word)
            .then(definition => {
                if (definition) {
                    // Cache the new definition with a fresh timestamp
                    definitionCache.set(word, {
                        definition: definition,
                        timestamp: Date.now()
                    });
                    sendResponse({ definition });
                } else {
                    // The API returned a valid response, but no definition was found
                    sendResponse({ definition: null });
                }
            })
            .catch(error => {
                // The API fetch failed (e.g., 404, network error)
                sendResponse({ error: error.message });
            });

        return true; // Required to indicate that the response will be sent asynchronously.
    }
});

// Periodically clean up expired cache entries to save memory
setInterval(() => {
    for (const [word, cacheEntry] of definitionCache.entries()) {
        if (!isCacheValid(cacheEntry)) {
            console.log(`Removing expired cache for: "${word}"`);
            definitionCache.delete(word);
        }
    }
}, 60 * 60 * 1000); // This check runs every hour

console.log('Word Definition Tooltip extension loaded and ready.');
