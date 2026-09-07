/**
 * events.js
 * Fetches event data from a JSON endpoint (e.g., a published Google Sheet API URL)
 * and populates the #events-list container.
 */

document.addEventListener("DOMContentLoaded", () => {
    const eventsContainer = document.getElementById("events-list");
    if (!eventsContainer) return;

    // REPLACE: Put your Google Sheets JSON API URL or JSON file URL here.
    // E.g., if using a published sheet: 'https://opensheet.elk.sh/YOUR_SPREADSHEET_ID/Sheet1'
    const EVENTS_API_URL = ""; 

    // Function to render mock data while you set up your API
    function renderPlaceholderEvents() {
        const mockData = [
            { date: "Oct 15, 2026", title: "Autumn Supper Club", description: "A five-course seasonal tasting menu.", link: "#" },
            { date: "Nov 02, 2026", title: "Floral Design Workshop", description: "Learn to arrange winter botanicals.", link: "#" },
            { date: "Dec 10, 2026", title: "Winter Solstice Retreat", description: "A day of yoga, meditation, and dining.", link: "#" }
        ];
        renderEvents(mockData);
    }

    // Main fetch function
    async function fetchEvents() {
        // If no URL is provided, show placeholders
        if (!EVENTS_API_URL) {
            console.log("No API URL provided. Loading placeholder events.");
            renderPlaceholderEvents();
            return;
        }

        try {
            const response = await fetch(EVENTS_API_URL);
            if (!response.ok) throw new Error("Network response was not ok");
            
            const data = await response.json();
            
            // NOTE: You may need to map your Google Sheet column names here
            // e.g. const mappedData = data.map(row => ({ title: row['Event Name'], ... }))
            
            renderEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
            eventsContainer.innerHTML = `<div class="text-center" style="grid-column: 1 / -1;"><p>Sorry, we couldn't load the events at this time. Please check back later.</p></div>`;
        }
    }

    // Render the HTML for each event
    function renderEvents(eventsArray) {
        eventsContainer.innerHTML = ""; // Clear loading message

        if (eventsArray.length === 0) {
            eventsContainer.innerHTML = `<div class="text-center" style="grid-column: 1 / -1;"><p>No upcoming events currently scheduled.</p></div>`;
            return;
        }

        eventsArray.forEach(event => {
            // Create DOM elements safely
            const card = document.createElement("div");
            card.className = "card event-card";

            // Expecting data to have: date, title, description, link
            // Adjust property names based on your Google Sheet columns
            card.innerHTML = `
                <div class="event-date">${escapeHTML(event.date || 'TBD')}</div>
                <h3>${escapeHTML(event.title || 'Untitled Event')}</h3>
                <p>${escapeHTML(event.description || '')}</p>
                ${event.link ? `<a href="${escapeHTML(event.link)}" class="btn" style="margin-top:1rem;">More Info</a>` : ''}
            `;
            
            eventsContainer.appendChild(card);
        });
    }

    // Utility to prevent XSS attacks when injecting data from external sources
    function escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Initialize
    fetchEvents();
});
