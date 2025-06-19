# Word Definition Tooltip Chrome Extension

A Chrome extension that displays word definitions in a tooltip when you select text on any webpage. Uses the Merriam-Webster Collegiate Dictionary API for accurate definitions.

## ✨ Features

- **Instant Definitions**: Select any word to see its definition in a clean tooltip
- **Smart Positioning**: Tooltips automatically position themselves within the viewport
- **Caching System**: Definitions are cached for 24 hours to reduce API calls
- **Dark Mode Support**: Automatically adapts to your system's color scheme
- **Accessibility**: Built with ARIA labels and high contrast mode support
- **Secure Storage**: API keys are stored securely in Chrome's sync storage
- **Error Handling**: Graceful handling of network errors and invalid API keys
- **Performance Optimized**: Lightweight and efficient with minimal impact on page performance

## 🚀 Installation

### Step 1: Get Your API Key
1. Visit [Merriam-Webster's Developer Portal](https://dictionaryapi.com/)
2. Sign up for a free account
3. Register for the **Collegiate Dictionary API**
4. Copy your API key

### Step 2: Install the Extension
1. Download or clone this repository to your computer
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top right corner)
4. Click **Load unpacked** and select the extension directory
5. The extension should now appear in your extensions list

### Step 3: Configure Your API Key
1. Click the extension icon in Chrome's toolbar
2. Paste your Merriam-Webster API key into the input field
3. Click **Save API Key**
4. You should see a success message confirming the key is saved and verified

## 📖 Usage

1. **Select a word**: Highlight any single word on any webpage
2. **View definition**: A tooltip will appear above the selected word with its definition
3. **Auto-hide**: The tooltip disappears after 5 seconds or when you click elsewhere
4. **Multiple definitions**: If available, the most common definition is shown

### Supported Text Selection
- ✅ Single words (e.g., "example")
- ✅ Hyphenated words (e.g., "self-contained")
- ✅ Words with apostrophes (e.g., "can't", "wasn't")
- ❌ Multiple words (phrases are ignored)
- ❌ Numbers or symbols only

## 🔧 Technical Details

### Architecture
- **Background Script**: Handles API requests and caching
- **Content Script**: Manages text selection and tooltip display
- **Popup Interface**: Provides settings management
- **Secure Storage**: API keys stored in Chrome's sync storage

### Performance Features
- **Smart Caching**: Definitions cached for 24 hours per word
- **Debounced Requests**: Prevents excessive API calls
- **Efficient DOM**: Minimal DOM manipulation and cleanup
- **Async Operations**: Non-blocking API requests

### Security Features
- **Secure Key Storage**: API keys never exposed to webpage context
- **XSS Protection**: All displayed content is properly escaped
- **Content Security Policy**: Strict CSP prevents code injection
- **HTTPS Only**: All API requests use secure connections

## 🛠️ Development

### File Structure
```
├── manifest.json          # Extension configuration
├── background.js          # Service worker for API handling
├── content.js            # Content script for page interaction
├── popup.html            # Settings interface HTML
├── popup.js              # Settings interface logic
├── styles.css            # Tooltip styling
└── README.md             # This file
```

### Key Components

**Background Script** (`background.js`):
- Manages Merriam-Webster API communication
- Implements intelligent caching with expiration
- Handles error states and API key validation

**Content Script** (`content.js`):
- Detects text selection events
- Creates and positions tooltips
- Manages tooltip lifecycle and cleanup

**Popup Interface** (`popup.html`, `popup.js`):
- Provides user-friendly API key management
- Validates API key format
- Tests API connectivity

## 🔍 Troubleshooting

### Extension Not Working
1. **Check API Key**: Ensure your API key is correctly entered and saved
2. **Reload Extension**: Go to `chrome://extensions/` and click the reload button
3. **Refresh Webpage**: Reload the page where you're trying to use the extension
4. **Check Console**: Open Developer Tools and check for error messages

### No Definitions Appearing
1. **Select Single Words**: Make sure you're selecting only one word
2. **Valid Words**: Ensure you're selecting dictionary words (not proper nouns or technical terms)
3. **Network Connection**: Check your internet connection
4. **API Limits**: Verify you haven't exceeded your API usage limits

### Common Error Messages
- **"API key not configured"**: Set your API key in the extension popup
- **"Invalid API key"**: Verify your API key is correct and active
- **"Extension disconnected"**: Reload the extension and refresh the page
- **"No definition found"**: The word may not be in the dictionary or may be misspelled

## 📝 API Information

This extension uses the **Merriam-Webster Collegiate Dictionary API**:
- **Base URL**: `https://www.dictionaryapi.com/api/v3/references/collegiate/json/`
- **Rate Limits**: 1000 requests per day for free accounts
- **Response Format**: JSON with structured definition data
- **Documentation**: [Merriam-Webster API Docs](https://dictionaryapi.com/products/json)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

### Development Setup
1. Clone the repository
2. Make your changes
3. Test the extension locally
4. Submit a pull request with a clear description

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- [Merriam-Webster API](https://dictionaryapi.com/)
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)

---

**Version**: 1.0.1  
**Last Updated**: 2025  
**Manifest Version**: 3