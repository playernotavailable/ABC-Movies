// data request http://www.omdbapi.com/?apikey=15cbfa3a&
//poster http://img.omdbapi.com/?apikey=15cbfa3a&
// api key 15cbfa3a

document.addEventListener('DOMContentLoaded', function() {
    
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-index');
    
    if (!searchButton || !searchInput) {
        console.error('Search elements not found!');
        return;
    }
    
    searchButton.addEventListener('click', function() {
        const keyword = searchInput.value;
        console.log('Search clicked, keyword:', keyword); 
        if (keyword.trim()) {
            main(keyword);
        } else {
            alert('Please enter a movie name!');
        }
    });
    
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const keyword = searchInput.value;
            console.log('Enter pressed, keyword:', keyword); 
            if (keyword.trim()) {
                main(keyword);
            }
        }
    });
});

async function main(keyword) {
    const movieListEl = document.querySelector(".movie__list");
    
    console.log('Fetching movies for:', keyword); 
    
    movieListEl.innerHTML = '<p class="loading">Searching for movies...</p>';
    
    try {
        const url = `http://www.omdbapi.com/?apikey=15cbfa3a&s=${keyword}`;
        console.log('Fetching URL:', url); 
        
        const response = await fetch(url);
        const movieData = await response.json();
        
        console.log('API Response:', movieData); 

        if (movieData.Response === "True" && movieData.Search) {
            movieListEl.innerHTML = movieData.Search.map(movie =>
                `<div class="movie__card">
                    <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}" alt="${movie.Title}" class="movie__poster">
                    <div class="movie__info">
                        <h3 class="movie__title">${movie.Title}</h3>
                        <p class="movie__year"><b>Year:</b> ${movie.Year}</p>
                        <p class="movie__type"><b>Type:</b> ${movie.Type}</p>
                    </div>
                </div>`
            ).join("");
        } else {
            movieListEl.innerHTML = `<p class="no-results">No movies found for "${keyword}". Try another search!</p>`;
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
        movieListEl.innerHTML = '<p class="error">Something went wrong. Please check your internet connection.</p>';
    }
}