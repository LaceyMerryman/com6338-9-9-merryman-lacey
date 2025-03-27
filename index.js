document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const userQuery = document.querySelector("#weather-search").value; 
    const weatherSection = document.querySelector("#weather"); 
    const apiKey = "fa5402a9c0415121fe69202e0e2ea8dd"; 

    // Clear previous results
    weatherSection.innerHTML = "";

    // Construct the API request URL
    const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
    const queryString = `?units=imperial&appid=${apiKey}&q=${userQuery}`;
    const fetchURL = `${weatherUrl}${queryString}`;

    try {
        // Make the API request using async/await
        const response = await fetch(fetchURL);
        const data = await response.json();

        if (data.cod !== 200) {
            weatherSection.innerHTML = `<h2>Location not found</h2>`;
            return;
        }

        // Destructure relevant data from the response
        const { name: city, sys: { country }, coord, weather, main: { temp, feels_like }, dt } = data;
        const { description: weatherCondition, icon: iconCode } = weather[0];
        const lastUpdated = new Date(dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

        // Create the weather icon URL
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // Construct the Google Maps link
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${coord.lat},${coord.lon}`;

        // Insert the data into the weather section
        weatherSection.innerHTML = `
            <h2>${city}, ${country}</h2>
            <a href="${mapUrl}" target="__BLANK">Click to view map</a>
            <img src="${iconUrl}" alt="${weatherCondition}">
            <p style="text-transform: capitalize;">${weatherCondition}</p>
            <p>Current: ${temp.toFixed(2)}° F</p>
            <p>Feels like: ${feels_like.toFixed(2)}° F</p>
            <p>Last updated: ${lastUpdated}</p>
        `;
    } catch (error) {
        weatherSection.innerHTML = `<h2>Something went wrong, please try again.</h2>`;
    }

    // Reset the input field value
    document.querySelector("#weather-search").value = "";
});