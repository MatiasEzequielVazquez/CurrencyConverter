# Currency Converter - Real-time Exchange Rates

A TypeScript-based currency converter with real-time exchange rates from exchangerate-api.com and offline fallback support.

## Features

- **Real-time Exchange Rates**: Fetches current rates from external API
- **Instant Conversion**: Updates results as you type
- **Offline Fallback**: Works with cached rates when API is unavailable
- **TypeScript**: Full type safety and interfaces
- **Responsive Design**: Works on all devices

## How to Run

### Option 1: Simple (No TypeScript compilation needed)

1. Compile TypeScript to JavaScript first:
```bash
   tsc script.ts
```
   This creates `script.js`

2. Open `index.html` in your browser

### Option 2: With Live Server (Recommended)

1. Install TypeScript globally (if not installed):
```bash
   npm install -g typescript
```

2. Compile TypeScript:
```bash
   tsc script.ts
```

3. Use VS Code Live Server extension or:
```bash
   python -m http.server 8000
```

4. Open `http://localhost:8000`

## Technical Highlights for Presentation

### TypeScript Features Demonstrated:

1. **Interfaces**: 
   - `ExchangeRates` for rate data structure
   - `APIResponse` for API response typing
   - `ConversionResult` for conversion output

2. **Async/Await**: 
   - Fetching data from external API
   - Error handling with try/catch

3. **Event Handling**:
   - Real-time input validation
   - Currency swap functionality
   - Refresh button interaction

4. **Type Safety**:
   - Proper typing of DOM elements
   - Number validation and formatting

### JavaScript Concepts:

- Fetch API for HTTP requests
- DOM manipulation
- Event listeners
- Class-based architecture
- Error handling with fallbacks

## API Information

- **Provider**: exchangerate-api.com
- **Free Tier**: 1,500 requests/month
- **No API Key Required**: Public endpoint
- **Update Frequency**: Daily

## Fallback Strategy

If API fails (no internet, rate limit exceeded, etc.):
- Automatically switches to hardcoded rates
- Visual indicator shows "offline mode"
- All functionality continues to work
- User is informed via status indicator

## Supported Currencies

- USD - US Dollar
- EUR - Euro
- ARS - Argentine Peso
- GBP - British Pound
- BRL - Brazilian Real

(Easy to add more in HTML select options)

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge
- Firefox
- Safari
- Opera

## License

Free to use and modify.