// Application CinéMax - JavaScript principal

document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const moviesGrid = document.getElementById('moviesGrid');
    const favoritesGrid = document.getElementById('favoritesGrid');
    const favoritesEmpty = document.getElementById('favoritesEmpty');
    const favoritesCount = document.querySelector('.favorites-count');
    const searchInput = document.querySelector('.search-input');
    const heroSearchInput = document.querySelector('.hero-search-input');
    const totalMoviesEl = document.getElementById('totalMovies');
    const filterToggle = document.getElementById('filterToggle');
    const filtersPanel = document.getElementById('filtersPanel');
    const closeFilters = document.getElementById('closeFilters');
    const applyFilters = document.getElementById('applyFilters');
    const resetFilters = document.getElementById('resetFilters');
    const genreFilter = document.getElementById('genreFilter');
    const yearFilter = document.getElementById('yearFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const sortBy = document.getElementById('sortBy');
    const movieModal = document.getElementById('movieModal');
    const closeModal = document.getElementById('closeModal');
    const modalBody = document.getElementById('modalBody');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // Gestion du thème (clair / sombre)
    const themeToggle = document.getElementById('themeToggle');

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }
        try { localStorage.setItem('cinemax_theme', theme); } catch (e) {}
        if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    // Restaurer thème au chargement
    const savedTheme = localStorage.getItem('cinemax_theme') || 'light';
    applyTheme(savedTheme);
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // Variables d'état
    let currentMovies = [...moviesData];
    let favorites = JSON.parse(localStorage.getItem('cinemax_favorites')) || [];
    let currentFilters = {
        genre: 'all',
        year: 'all',
        rating: 0,
        sortBy: 'title'
    };

    // Initialisation
    function init() {
        updateFavoritesCount();
        renderMovies(currentMovies);
        renderFavorites();
        setupEventListeners();
        showLoading(false);
    }

    // Configuration des écouteurs d'événements
    function setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const page = this.getAttribute('data-page');
                navigateToPage(page);
            });
        });

        // Recherche
        searchInput.addEventListener('input', handleSearch);
        heroSearchInput.addEventListener('input', handleSearch);

        // Filtres
        filterToggle.addEventListener('click', () => {
            filtersPanel.style.display = filtersPanel.style.display === 'block' ? 'none' : 'block';
        });

        closeFilters.addEventListener('click', () => {
            filtersPanel.style.display = 'none';
        });

        applyFilters.addEventListener('click', applyAllFilters);
        resetFilters.addEventListener('click', resetAllFilters);

        // Genres
        document.querySelectorAll('.genre-tag, .genre-card').forEach(genreEl => {
            genreEl.addEventListener('click', function() {
                const genre = this.getAttribute('data-genre');
                if (genre) {
                    navigateToPage('movies');
                    genreFilter.value = genre;
                    applyAllFilters();
                }
            });
        });

        // Modal
        closeModal.addEventListener('click', () => {
            movieModal.style.display = 'none';
        });

        movieModal.addEventListener('click', (e) => {
            if (e.target === movieModal) {
                movieModal.style.display = 'none';
            }
        });

        // Navigation par ancres
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId !== '#') {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }

    // Navigation entre les pages
    function navigateToPage(page) {
        // Mettre à jour les liens de navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });

        // Faire défiler jusqu'à la section correspondante
        const targetSection = document.getElementById(page);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Si on va sur la page des favoris, les re-rendre
        if (page === 'favorites') {
            renderFavorites();
        }
    }

    // Afficher/masquer l'indicateur de chargement
    function showLoading(show) {
        loadingIndicator.style.display = show ? 'flex' : 'none';
    }

    // Gestion de la recherche
    function handleSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase() ||
            heroSearchInput.value.trim().toLowerCase();

        if (searchTerm.length === 0) {
            renderMovies(currentMovies);
            return;
        }

        const filteredMovies = moviesData.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.director.toLowerCase().includes(searchTerm) ||
            movie.cast.some(actor => actor.toLowerCase().includes(searchTerm)) ||
            movie.genres.some(genre => genre.toLowerCase().includes(searchTerm))
        );

        renderMovies(filteredMovies);
    }

    // Application des filtres
    function applyAllFilters() {
        currentFilters.genre = genreFilter.value;
        currentFilters.year = yearFilter.value;
        currentFilters.rating = parseInt(ratingFilter.value);
        currentFilters.sortBy = sortBy.value;

        let filteredMovies = [...moviesData];

        // Filtre par genre
        if (currentFilters.genre !== 'all') {
            filteredMovies = filteredMovies.filter(movie =>
                movie.genres.includes(currentFilters.genre)
            );
        }

        // Filtre par année
        if (currentFilters.year !== 'all') {
            const [startYear, endYear] = currentFilters.year.split('-').map(Number);
            filteredMovies = filteredMovies.filter(movie =>
                movie.year >= startYear && movie.year <= endYear
            );
        }

        // Filtre par note
        if (currentFilters.rating > 0) {
            filteredMovies = filteredMovies.filter(movie =>
                movie.rating >= currentFilters.rating
            );
        }

        // Tri
        filteredMovies.sort((a, b) => {
            switch (currentFilters.sortBy) {
                case 'year':
                    return b.year - a.year; // Du plus récent au plus ancien
                case 'rating':
                    return b.rating - a.rating; // De la meilleure à la moins bonne note
                case 'popularity':
                    return b.popularity - a.popularity; // De la plus populaire à la moins populaire
                default:
                    return a.title.localeCompare(b.title); // Ordre alphabétique
            }
        });

        currentMovies = filteredMovies;
        renderMovies(currentMovies);
        filtersPanel.style.display = 'none';
    }

    // Réinitialisation des filtres
    function resetAllFilters() {
        genreFilter.value = 'all';
        yearFilter.value = 'all';
        ratingFilter.value = '0';
        sortBy.value = 'title';

        currentFilters = {
            genre: 'all',
            year: 'all',
            rating: 0,
            sortBy: 'title'
        };

        currentMovies = [...moviesData];
        renderMovies(currentMovies);
    }

    // Rendu des films
    function renderMovies(movies) {
        showLoading(true);

        // Mise à jour du compteur
        totalMoviesEl.textContent = movies.length;

        // Vider la grille
        moviesGrid.innerHTML = '';

        // Si aucun film ne correspond aux critères
        if (movies.length === 0) {
            moviesGrid.innerHTML = `
                <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <i class="fas fa-film" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                    <h3>Aucun film ne correspond à vos critères</h3>
                    <p>Essayez de modifier vos filtres ou votre recherche</p>
                    <button class="btn reset-filters" id="resetFiltersInline">
                        <i class="fas fa-redo"></i> Réinitialiser les filtres
                    </button>
                </div>
            `;

            const resetBtn = document.getElementById('resetFiltersInline');
            if (resetBtn) resetBtn.addEventListener('click', resetAllFilters);
            showLoading(false);
            return;
        }

        // Créer les cartes de film
        setTimeout(() => {
            movies.forEach(movie => {
                const isFavorite = favorites.includes(movie.id);
                const movieCard = createMovieCard(movie, isFavorite);
                moviesGrid.appendChild(movieCard);
            });
            showLoading(false);
        }, 300); // Petit délai pour l'effet de chargement
    }

    // Création d'une carte de film
    function createMovieCard(movie, isFavorite) {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.dataset.id = movie.id;

        // Générer les étoiles pour la note
        const stars = generateStarRating(movie.rating);

        // Générer les badges de genre
        const genres = movie.genres.map(genre =>
            `<span class="movie-genre">${genre}</span>`
        ).join('');

        card.innerHTML = `
            <div class="movie-poster">
                <img src="${movie.poster}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/300x450/1a1a24/ffffff?text=${encodeURIComponent(movie.title)}'">
                <div class="movie-rating">
                    <i class="fas fa-star"></i> ${movie.rating}/10
                </div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title" title="${movie.title}">${movie.title}</h3>
                <div class="movie-year">${movie.year}</div>
                <div class="movie-genres">${genres}</div>
                <div class="movie-actions">
                    <button class="details-btn" data-id="${movie.id}">
                        <i class="fas fa-info-circle"></i> Détails
                    </button>
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${movie.id}">
                        <i class="fas fa-heart"></i> ${isFavorite ? 'Retirer' : 'Ajouter'}
                    </button>
                </div>
            </div>
        `;

        // Ajouter les événements
        const detailsBtn = card.querySelector('.details-btn');
        const favoriteBtn = card.querySelector('.favorite-btn');

        detailsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showMovieDetails(movie.id);
        });

        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(movie.id, favoriteBtn);
        });

        card.addEventListener('click', () => {
            showMovieDetails(movie.id);
        });

        return card;
    }

    // Générer les étoiles pour la note
    function generateStarRating(rating) {
        const fullStars = Math.floor(rating / 2);
        let stars = '';

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }

        return stars;
    }

    // Basculer l'état "favori" d'un film
    function toggleFavorite(movieId, button) {
        const index = favorites.indexOf(movieId);

        if (index === -1) {
            // Ajouter aux favoris
            favorites.push(movieId);
            button.classList.add('active');
            button.innerHTML = '<i class="fas fa-heart"></i> Retirer';
            showNotification('Film ajouté aux favoris !');
        } else {
            // Retirer des favoris
            favorites.splice(index, 1);
            button.classList.remove('active');
            button.innerHTML = '<i class="fas fa-heart"></i> Ajouter';
            showNotification('Film retiré des favoris');
        }

        // Mettre à jour le localStorage
        localStorage.setItem('cinemax_favorites', JSON.stringify(favorites));

        // Mettre à jour le compteur
        updateFavoritesCount();

        // Re-rendre la section des favoris si elle est visible
        if (document.querySelector('#favorites').getBoundingClientRect().top < window.innerHeight) {
            renderFavorites();
        }
    }

    // Mettre à jour le compteur de favoris
    function updateFavoritesCount() {
        favoritesCount.textContent = favorites.length;
    }

    // Afficher les détails d'un film
    function showMovieDetails(movieId) {
        const movie = moviesData.find(m => m.id === movieId);
        if (!movie) return;

        const isFavorite = favorites.includes(movieId);

        // Générer les étoiles pour la note
        const stars = generateStarRating(movie.rating);

        // Générer la liste des acteurs
        const castList = movie.cast.map(actor => `<li>${actor}</li>`).join('');

        // Générer les badges de genre
        const genres = movie.genres.map(genre =>
            `<span class="movie-genre">${genre}</span>`
        ).join('');

        modalBody.innerHTML = `
            <div class="movie-details">
                <div class="details-header">
                    <div class="details-poster">
                        <img src="${movie.poster}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/300x450/1a1a24/ffffff?text=${encodeURIComponent(movie.title)}'">
                    </div>
                    <div class="details-info">
                        <h2>${movie.title} (${movie.year})</h2>
                        <div class="details-rating">
                            ${stars}
                            <span class="rating-score">${movie.rating}/10</span>
                        </div>
                        <div class="details-meta">
                            <div class="meta-item">
                                <i class="fas fa-clock"></i>
                                <span>${movie.duration}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-user"></i>
                                <span>${movie.director}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-globe"></i>
                                <span>${movie.country}</span>
                            </div>
                        </div>
                        <div class="details-genres">
                            ${genres}
                        </div>
                        <div class="details-actions">
                            <button class="btn watch-trailer" data-trailer="${movie.trailer}">
                                <i class="fas fa-play"></i> Voir la bande-annonce
                            </button>
                            <button class="btn toggle-favorite-modal ${isFavorite ? 'favorite' : ''}" data-id="${movie.id}">
                                <i class="fas fa-heart"></i> ${isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="details-body">
                    <div class="details-section">
                        <h3><i class="fas fa-book-open"></i> Synopsis</h3>
                        <p>${movie.synopsis}</p>
                    </div>
                    
                    <div class="details-grid">
                        <div class="details-section">
                            <h3><i class="fas fa-users"></i> Casting</h3>
                            <ul class="cast-list">
                                ${castList}
                            </ul>
                        </div>
                        
                        <div class="details-section">
                            <h3><i class="fas fa-info-circle"></i> Informations</h3>
                            <div class="info-grid">
                                <div class="info-item">
                                    <strong>Réalisateur:</strong> ${movie.director}
                                </div>
                                <div class="info-item">
                                    <strong>Scénariste:</strong> ${movie.writer}
                                </div>
                                <div class="info-item">
                                    <strong>Box-office:</strong> ${movie.boxOffice}
                                </div>
                                <div class="info-item">
                                    <strong>Popularité:</strong> ${movie.popularity}/100
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Ajouter les événements dans le modal
        const watchTrailerBtn = modalBody.querySelector('.watch-trailer');
        const favoriteBtnModal = modalBody.querySelector('.toggle-favorite-modal');

        watchTrailerBtn.addEventListener('click', () => {
            window.open(movie.trailer, '_blank');
        });

        favoriteBtnModal.addEventListener('click', () => {
            toggleFavorite(movie.id, favoriteBtnModal);
            const isNowFavorite = favorites.includes(movie.id);
            favoriteBtnModal.classList.toggle('favorite', isNowFavorite);
            favoriteBtnModal.innerHTML = `
                <i class="fas fa-heart"></i> ${isNowFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            `;
        });

        // Afficher le modal
        movieModal.style.display = 'flex';
    }

    // Rendre les films favoris
    function renderFavorites() {
        favoritesGrid.innerHTML = '';

        if (favorites.length === 0) {
            favoritesEmpty.style.display = 'block';
            return;
        }

        favoritesEmpty.style.display = 'none';

        const favoriteMovies = moviesData.filter(movie =>
            favorites.includes(movie.id)
        );

        favoriteMovies.forEach(movie => {
            const isFavorite = true; // Tous les films ici sont des favoris
            const movieCard = createMovieCard(movie, isFavorite);
            favoritesGrid.appendChild(movieCard);
        });
    }

    // Afficher une notification
    function showNotification(message) {
        // Créer l'élément de notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;

        // Styles pour la notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--accent-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            z-index: 3000;
            transform: translateX(150%);
            transition: transform 0.3s ease;
            font-weight: 600;
        `;

        document.body.appendChild(notification);

        // Afficher la notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Masquer après 3 secondes
        setTimeout(() => {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Initialiser l'application
    init();
});

// Styles additionnels pour le modal
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .movie-details {
        color: var(--text-primary);
    }
    
    .details-header {
        display: flex;
        gap: 2rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
    }
    
    .details-poster {
        flex: 0 0 250px;
    }
    
    .details-poster img {
        width: 100%;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
    }
    
    .details-info {
        flex: 1;
        min-width: 300px;
    }
    
    .details-info h2 {
        font-size: 2.2rem;
        margin-bottom: 1rem;
    }
    
    .details-rating {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
        color: gold;
    }
    
    .rating-score {
        color: var(--text-primary);
        font-weight: 600;
        margin-left: 0.5rem;
    }
    
    .details-meta {
        display: flex;
        gap: 2rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
    }
    
    .meta-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-secondary);
    }
    
    .meta-item i {
        color: var(--accent-color);
    }
    
    .details-genres {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 2rem;
    }
    
    .details-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }
    
    .details-actions .btn {
        padding: 0.75rem 1.5rem;
    }
    
    .toggle-favorite-modal.favorite {
        background-color: transparent;
        border: 1px solid var(--accent-color);
        color: var(--accent-color);
    }
    
    .details-body {
        margin-top: 2rem;
    }
    
    .details-section {
        margin-bottom: 2rem;
    }
    
    .details-section h3 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        color: var(--accent-color);
    }
    
    .details-section p {
        color: var(--text-secondary);
        line-height: 1.7;
    }
    
    .details-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }
    
    .cast-list {
        list-style: none;
        color: var(--text-secondary);
    }
    
    .cast-list li {
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .cast-list li:last-child {
        border-bottom: none;
    }
    
    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .info-item {
        padding: 0.75rem;
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: var(--border-radius);
    }
    
    @media (max-width: 768px) {
        .details-header {
            flex-direction: column;
        }
        
        .details-poster {
            flex: 0 0 auto;
            max-width: 250px;
            margin: 0 auto;
        }
        
        .details-info {
            min-width: auto;
        }
        
        .details-info h2 {
            font-size: 1.8rem;
        }
        
        .details-actions {
            flex-direction: column;
        }
        
        .details-actions .btn {
            width: 100%;
        }
    }
`;

document.head.appendChild(additionalStyles);