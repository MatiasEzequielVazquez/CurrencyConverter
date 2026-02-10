// ============================================
// INTERFACES & TYPES
// ============================================

interface ExchangeRates {
    [currency: string]: number;
}

interface APIResponse {
    rates: ExchangeRates;
    base: string;
    date: string;
}

interface ConversionResult {
    amount: number;
    fromCurrency: string;
    toCurrency: string;
    result: number;
    rate: number;
}

// ============================================
// FALLBACK RATES (Plan B)
// ============================================

const FALLBACK_RATES: ExchangeRates = {
    USD: 1,
    EUR: 0.92,
    ARS: 1045,
    GBP: 0.79,
    BRL: 4.97
};

// ============================================
// STATE MANAGEMENT
// ============================================

class CurrencyConverter {
    private rates: ExchangeRates = FALLBACK_RATES;
    private isOnline: boolean = false;
    private lastUpdated: Date | null = null;
    private baseCurrency: string = 'USD';

    constructor() {
        this.init();
    }

    private async init(): Promise<void> {
        await this.fetchRates();
        this.setupEventListeners();
        this.performConversion(); // Initial calculation
    }

    // ============================================
    // API INTEGRATION
    // ============================================

    private async fetchRates(): Promise<void> {
        const statusText = document.getElementById('statusText') as HTMLElement;
        const statusIndicator = document.getElementById('statusIndicator') as HTMLElement;

        try {
            statusText.textContent = 'Fetching rates...';
            
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            
            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data: APIResponse = await response.json();
            
            this.rates = data.rates;
            this.baseCurrency = data.base;
            this.isOnline = true;
            this.lastUpdated = new Date();

            statusText.textContent = 'Live rates active';
            statusIndicator.classList.add('online');
            statusIndicator.classList.remove('offline');

            this.updateLastUpdatedDisplay();
            this.performConversion();

        } catch (error) {
            console.error('Failed to fetch rates:', error);
            this.handleAPIFailure();
        }
    }

    private handleAPIFailure(): void {
        const statusText = document.getElementById('statusText') as HTMLElement;
        const statusIndicator = document.getElementById('statusIndicator') as HTMLElement;

        this.rates = FALLBACK_RATES;
        this.isOnline = false;

        statusText.textContent = 'Using cached rates (offline)';
        statusIndicator.classList.add('offline');
        statusIndicator.classList.remove('online');

        this.updateLastUpdatedDisplay();
    }

    private updateLastUpdatedDisplay(): void {
        const lastUpdatedElement = document.getElementById('lastUpdated') as HTMLElement;
        
        if (this.isOnline && this.lastUpdated) {
            const timeString = this.lastUpdated.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
            lastUpdatedElement.textContent = `Updated at ${timeString}`;
        } else {
            lastUpdatedElement.textContent = 'Using fallback rates';
        }
    }

    // ============================================
    // CONVERSION LOGIC
    // ============================================

    private convert(amount: number, from: string, to: string): ConversionResult {
        // Convert to USD first (base currency)
        const amountInUSD = amount / this.rates[from];
        
        // Convert from USD to target currency
        const result = amountInUSD * this.rates[to];
        
        // Calculate direct exchange rate
        const rate = this.rates[to] / this.rates[from];

        return {
            amount,
            fromCurrency: from,
            toCurrency: to,
            result,
            rate
        };
    }

    private performConversion(): void {
        const amountInput = document.getElementById('amount') as HTMLInputElement;
        const fromSelect = document.getElementById('fromCurrency') as HTMLSelectElement;
        const toSelect = document.getElementById('toCurrency') as HTMLSelectElement;

        const amount = parseFloat(amountInput.value) || 0;
        const fromCurrency = fromSelect.value;
        const toCurrency = toSelect.value;

        // Validate input
        if (amount < 0) {
            amountInput.classList.add('invalid');
            return;
        } else {
            amountInput.classList.remove('invalid');
        }

        const conversion = this.convert(amount, fromCurrency, toCurrency);
        this.displayResult(conversion);
    }

    private displayResult(conversion: ConversionResult): void {
        const resultAmount = document.getElementById('resultAmount') as HTMLElement;
        const exchangeRate = document.getElementById('exchangeRate') as HTMLElement;

        // Format result with proper decimal places
        const formattedResult = conversion.result.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        resultAmount.textContent = formattedResult;
        
        // Display exchange rate
        exchangeRate.textContent = `1 ${conversion.fromCurrency} = ${conversion.rate.toFixed(4)} ${conversion.toCurrency}`;
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================

    private setupEventListeners(): void {
        const amountInput = document.getElementById('amount') as HTMLInputElement;
        const fromSelect = document.getElementById('fromCurrency') as HTMLSelectElement;
        const toSelect = document.getElementById('toCurrency') as HTMLSelectElement;
        const swapButton = document.getElementById('swapButton') as HTMLButtonElement;
        const refreshButton = document.getElementById('refreshButton') as HTMLButtonElement;

        // Real-time conversion on input
        amountInput.addEventListener('input', () => this.performConversion());
        fromSelect.addEventListener('change', () => this.performConversion());
        toSelect.addEventListener('change', () => this.performConversion());

        // Swap currencies
        swapButton.addEventListener('click', () => this.swapCurrencies());

        // Refresh rates
        refreshButton.addEventListener('click', () => this.fetchRates());
    }

    private swapCurrencies(): void {
        const fromSelect = document.getElementById('fromCurrency') as HTMLSelectElement;
        const toSelect = document.getElementById('toCurrency') as HTMLSelectElement;

        const temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;

        this.performConversion();
    }
}

// ============================================
// INITIALIZATION
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new CurrencyConverter();
});