/**
 * events.js
 * Fetches event data from OpenSheet/Google Sheets API
 * and populates either the full #events-list OR the #featured-event-container.
 */

document.addEventListener("DOMContentLoaded", () => {
    const eventsContainer = document.getElementById("events-list");
    const featuredContainer = document.getElementById("featured-event-container");

    // Exit early if neither container exists on the page
    if (!eventsContainer && !featuredContainer) return;

    // OpenSheet URL for Google Sheets
    const EVENTS_API_URL = "https://opensheet.elk.sh/1jfjByYM5YGMjUIOCZpD-Nik7xsfXfRz_vU5XzPQENHk/Sheet1"; 

    // Function to render mock data if API fails or isn't set up
    function renderPlaceholderEvents() {
        const mockData = [
            {
                start_date: "08/09/2026",
                end_date: "11/09/2026",
                title: "Spring Woodland & Faith Retreat",
                description: "A 3-day guided getaway featuring outdoor reflection, woodland exercises, and communal fellowship along the river.",
                stripe_link: "https://www.example.com"
            }
        ];
        
        if (eventsContainer) renderAllEvents(mockData);
        if (featuredContainer) renderFeaturedEvent(mockData);
    }

    // Main fetch function
    async function fetchEvents() {
        if (!EVENTS_API_URL || EVENTS_API_URL.includes("YOUR_SPREADSHEET_ID")) {
            console.log("No valid API URL provided. Loading placeholder data.");
            renderPlaceholderEvents();
            return;
        }

        try {
            const response = await fetch(EVENTS_API_URL);
            if (!response.ok) throw new Error("Network response was not ok");
            
            const data = await response.json();

            if (eventsContainer) renderAllEvents(data);
            if (featuredContainer) renderFeaturedEvent(data);

        } catch (error) {
            console.error("Error fetching events:", error);
            const errorMessage = `<div class="text-center" style="grid-column: 1 / -1;"><p>Sorry, we couldn't load the events at this time. Please check back later.</p></div>`;
            
            if (eventsContainer) eventsContainer.innerHTML = errorMessage;
            if (featuredContainer) featuredContainer.innerHTML = errorMessage;
        }
    }

    // 1. Renders ALL events (for /events/ page)
    function renderAllEvents(eventsArray) {
        eventsContainer.innerHTML = ""; 

        if (!eventsArray || eventsArray.length === 0) {
            eventsContainer.innerHTML = `<div class="text-center" style="grid-column: 1 / -1;"><p>No upcoming events currently scheduled.</p></div>`;
            return;
        }

        eventsArray.forEach(event => {
            const card = document.createElement("div");
            card.className = "card event-card";

            const dateDisplay = formatDate(event.start_date, event.end_date);
            const cleanLink = formatUrl(event.stripe_link);

            card.innerHTML = `
                <div class="event-date">${dateDisplay}</div>
                <h3>${escapeHTML(event.title || 'Untitled Event')}</h3>
                <p>${escapeHTML(event.description || '')}</p>
                ${cleanLink ? `<a href="${cleanLink}" target="_blank" rel="noopener noreferrer" class="btn" style="margin-top:1rem;">Book Tickets</a>` : ''}
            `;
            
            eventsContainer.appendChild(card);
        });
    }

    // 2. Renders ONLY the top item (for Home page "What's Next")
    function renderFeaturedEvent(eventsArray) {
        if (!eventsArray || eventsArray.length === 0) {
            featuredContainer.innerHTML = `
                <div class="card text-center">
                    <h3>New Retreat Dates Coming Soon</h3>
                    <p>We are currently finalizing our upcoming schedule. Please check back shortly.</p>
                </div>`;
            return;
        }

        const nextEvent = eventsArray[0]; // Take only item [0]
        const dateDisplay = formatDate(nextEvent.start_date, nextEvent.end_date);
        const cleanLink = formatUrl(nextEvent.stripe_link);

        featuredContainer.innerHTML = `
            <div class="card featured-card">
                <div class="featured-card-content">
                    <span class="event-date">${dateDisplay}</span>
                    <h3>${escapeHTML(nextEvent.title || 'Untitled Retreat Event')}</h3>
                    <p>${escapeHTML(nextEvent.description || 'Join us for a restorative time of fellowship.')}</p>
                </div>
                <div class="featured-card-action">
                    ${
                        cleanLink 
                            ? `<a href="${cleanLink}" target="_blank" rel="noopener noreferrer" class="btn">Book Retreat</a>`
                            : `<a href="mailto:contact@riversedgeretreat.co.uk?subject=Inquiry: ${encodeURIComponent(nextEvent.title || 'Retreat')}" class="btn btn-outline">Register Interest</a>`
                    }
                </div>
            </div>
        `;
    }

    // Helper: Format date strings
    function formatDate(startDate, endDate) {
        let display = escapeHTML(startDate || 'TBD');
        if (endDate && endDate !== startDate) {
            display += ` - ${escapeHTML(endDate)}`;
        }
        return display;
    }

    // Helper: Format URLs
    function formatUrl(url) {
        let rawLink = (url || '').trim();
        if (rawLink && !rawLink.startsWith('http://') && !rawLink.startsWith('https://')) {
            rawLink = `https://${rawLink}`;
        }
        return escapeHTML(rawLink);
    }

    // Helper: Prevent XSS
    function escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Initialize
    fetchEvents();
});