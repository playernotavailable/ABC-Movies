// data request http://www.omdbapi.com/?apikey=15cbfa3a&
//poster http://img.omdbapi.com/?apikey=15cbfa3a&
// api key 15cbfa3a

document.addEventListener('DOMContentLoaded', function() {
    
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-index');
    const sortSelect = document.getElementById('sort-select');
    
    let currentMovies = []; 
    
    if (!searchButton || !searchInput) {
        console.error('Elements not found!');
        return;
    }
    
    searchButton.addEventListener('click', function() {
        const keyword = searchInput.value;
        if (keyword.trim()) {
            main(keyword);
        } else {
            alert('Please enter a movie name!');
        }
    });
    
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const keyword = searchInput.value;
            if (keyword.trim()) {
                main(keyword);
            }
        }
    });
    
    sortSelect.addEventListener('change', function() {
        if (currentMovies.length > 0) {
            sortAndDisplayMovies(currentMovies, this.value);
        }
    });
});

async function main(keyword) {
    const movieListEl = document.querySelector(".movie__list");
    
    movieListEl.innerHTML = '<p class="loading">Searching for movies...</p>';
    
    try {
        const url = `https://www.omdbapi.com/?apikey=15cbfa3a&s=${keyword}`;
        
        const response = await fetch(url);
        const movieData = await response.json();

        if (movieData.Response === "True" && movieData.Search) {
            currentMovies = movieData.Search; 
            const sortValue = document.getElementById('sort-select').value;
            sortAndDisplayMovies(currentMovies, sortValue);
        } else {
            movieListEl.innerHTML = `<p class="no-results">No movies found. Try another search!</p>`;
            currentMovies = [];
        }
    } catch (error) {
        console.error('Error:', error);
        movieListEl.innerHTML = '<p class="error">Something went wrong. Please try again.</p>';
        currentMovies = [];
    }
}

function sortAndDisplayMovies(movies, sortType) {
    let sortedMovies = [...movies]; 
    
    switch(sortType) {
        case 'title-asc':
            sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
            break;
        case 'title-desc':
            sortedMovies.sort((a, b) => b.Title.localeCompare(a.Title));
            break;
        case 'year-newest':
            sortedMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
            break;
        case 'year-oldest':
            sortedMovies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
            break;
        case 'type':
            sortedMovies.sort((a, b) => a.Type.localeCompare(b.Type));
            break;
        default:
            break;
    }
    
    const limitedMovies = sortedMovies.slice(0, 6);
    displayMovies(limitedMovies);
}

function displayMovies(movies) {
    const movieListEl = document.querySelector(".movie__list");
    
    movieListEl.innerHTML = movies.map(movie =>
        `<div class="movie__card">
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}" alt="${movie.Title}" class="movie__poster">
            <div class="movie__info">
                <h3 class="movie__title">${movie.Title}</h3>
                <p class="movie__year"><b>Year:</b> ${movie.Year}</p>
                <p class="movie__type"><b>Type:</b> ${movie.Type}</p>
            </div>
        </div>`
    ).join("");
}