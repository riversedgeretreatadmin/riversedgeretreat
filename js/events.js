/**
 * events.js
 * Fetches event data from OpenSheet/Google Sheets API
 * and populates the #events-list container.
 */

document.addEventListener("DOMContentLoaded", () => {
    const eventsContainer = document.getElementById("events-list");
    if (!eventsContainer) return;

    // REPLACE: Put your actual OpenSheet URL here
    const EVENTS_API_URL = "https://opensheet.elk.sh/1jfjByYM5YGMjUIOCZpD-Nik7xsfXfRz_vU5XzPQENHk/Sheet1"; 

    // Function to render mock data matching your sheet structure
    function renderPlaceholderEvents() {
        const mockData = [
            {
                start_date: "08/09/2026",
                end_date: "11/09/2026",
                title: "Test Title",
                description: "This is a test description",
                stripe_link: "https://www.example.com"
            }
        ];
        renderEvents(mockData);
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
            renderEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
            eventsContainer.innerHTML = `<div class="text-center" style="grid-column: 1 / -1;"><p>Sorry, we couldn't load the events at this time. Please check back later.</p></div>`;
        }
    }

    // Render the HTML for each event matching your exact key names
    function renderEvents(eventsArray) {
        eventsContainer.innerHTML = ""; // Clear loading message

        if (eventsArray.length === 0) {
            eventsContainer.innerHTML = `<div class="text-center" style="grid-column: 1 / -1;"><p>No upcoming events currently scheduled.</p></div>`;
            return;
        }

        eventsArray.forEach(event => {
            const card = document.createElement("div");
            card.className = "card event-card";

            // Format date string (combine start_date and end_date if both exist)
            let dateDisplay = escapeHTML(event.start_date || 'TBD');
            if (event.end_date && event.end_date !== event.start_date) {
                dateDisplay += ` - ${escapeHTML(event.end_date)}`;
            }

            // Ensure URLs start with http:// or https:// for external links
            let rawLink = (event.stripe_link || '').trim();
            if (rawLink && !rawLink.startsWith('http://') && !rawLink.startsWith('https://')) {
                rawLink = `https://${rawLink}`;
            }

            card.innerHTML = `
                <div class="event-date">${dateDisplay}</div>
                <h3>${escapeHTML(event.title || 'Untitled Event')}</h3>
                <p>${escapeHTML(event.description || '')}</p>
                ${rawLink ? `<a href="${escapeHTML(rawLink)}" target="_blank" rel="noopener noreferrer" class="btn" style="margin-top:1rem;">Book Tickets</a>` : ''}
            `;
            
            eventsContainer.appendChild(card);
        });
    }

    // Utility to prevent XSS attacks
    function escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Initialize
    fetchEvents();
});
