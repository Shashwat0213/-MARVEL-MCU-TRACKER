package com.example.mcutracker.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.mcutracker.data.McuItem
import com.example.mcutracker.data.McuRepository
import com.example.mcutracker.data.UserPreferences
import com.example.mcutracker.data.WatchStatus
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

enum class McuFilter(val label: String) {
    ALL("All"),
    MOVIES("Movies"),
    SERIES("Web Series"),
    WATCHED("Watched"),
    UNWATCHED("Unwatched"),
    FAVORITES("Favorites")
}

enum class McuSort(val label: String) {
    TIMELINE("Timeline Order"),
    RELEASE_DATE("Release Date"),
    TITLE("Title (A-Z)"),
    RATING("Rating (High-Low)"),
    PHASE("Phase")
}

data class FilterState(
    val query: String = "",
    val filter: McuFilter = McuFilter.ALL,
    val sort: McuSort = McuSort.TIMELINE
)

data class TrackerUiState(
    val items: List<McuItem> = emptyList(),
    val filteredItems: List<McuItem> = emptyList(),
    val watchRecords: Map<String, WatchStatus> = emptyMap(),
    val preferences: UserPreferences = UserPreferences(),
    val searchQuery: String = "",
    val activeFilter: McuFilter = McuFilter.ALL,
    val activeSort: McuSort = McuSort.TIMELINE,
    val totalCount: Int = 0,
    val watchedCount: Int = 0,
    val favoritesCount: Int = 0,
    val remainingCount: Int = 0,
    val progressFraction: Float = 0f,
    val nextToWatch: McuItem? = null,
    val selectedMovie: McuItem? = null,
    val showAddDialog: Boolean = false,
    val showResetDialog: Boolean = false,
    val showNameDialog: Boolean = false
)

class McuTrackerViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = McuRepository(application)

    private val _searchQuery = MutableStateFlow("")
    private val _activeFilter = MutableStateFlow(McuFilter.ALL)
    private val _activeSort = MutableStateFlow(McuSort.TIMELINE)
    private val _selectedMovie = MutableStateFlow<McuItem?>(null)
    private val _showAddDialog = MutableStateFlow(false)
    private val _showResetDialog = MutableStateFlow(false)
    private val _showNameDialog = MutableStateFlow(false)

    private val filterStateFlow = combine(
        _searchQuery,
        _activeFilter,
        _activeSort
    ) { query, filter, sort ->
        FilterState(query, filter, sort)
    }

    val uiState: StateFlow<TrackerUiState> = combine(
        repository.items,
        repository.watchRecords,
        repository.preferences,
        filterStateFlow
    ) { items: List<McuItem>, records: Map<String, WatchStatus>, prefs: UserPreferences, filterState: FilterState ->
        val watchedCount = items.count { records[it.id]?.isWatched == true }
        val favoritesCount = items.count { records[it.id]?.isFavorite == true }
        val totalCount = items.size
        val remainingCount = (totalCount - watchedCount).coerceAtLeast(0)
        val progress = if (totalCount > 0) watchedCount.toFloat() / totalCount else 0f

        val nextToWatch = items
            .sortedBy { it.timelineSlot }
            .firstOrNull { records[it.id]?.isWatched != true }

        val query = filterState.query
        val filter = filterState.filter
        val sort = filterState.sort

        // Filter
        val filtered = items.filter { item ->
            val matchesQuery = query.isBlank() ||
                    item.title.contains(query, ignoreCase = true) ||
                    item.phase.contains(query, ignoreCase = true) ||
                    item.year.toString().contains(query)

            val isWatched = records[item.id]?.isWatched == true
            val isFavorite = records[item.id]?.isFavorite == true

            val matchesFilter = when (filter) {
                McuFilter.ALL -> true
                McuFilter.MOVIES -> item.type.equals("movie", ignoreCase = true)
                McuFilter.SERIES -> item.type.equals("series", ignoreCase = true)
                McuFilter.WATCHED -> isWatched
                McuFilter.UNWATCHED -> !isWatched
                McuFilter.FAVORITES -> isFavorite
            }

            matchesQuery && matchesFilter
        }

        // Sort
        val sorted = when (sort) {
            McuSort.TIMELINE -> filtered.sortedBy { it.timelineSlot }
            McuSort.RELEASE_DATE -> filtered.sortedBy { it.releaseDate }
            McuSort.TITLE -> filtered.sortedBy { it.title }
            McuSort.RATING -> filtered.sortedByDescending { it.rating }
            McuSort.PHASE -> filtered.sortedBy { it.phase }
        }

        TrackerUiState(
            items = items,
            filteredItems = sorted,
            watchRecords = records,
            preferences = prefs,
            searchQuery = query,
            activeFilter = filter,
            activeSort = sort,
            totalCount = totalCount,
            watchedCount = watchedCount,
            favoritesCount = favoritesCount,
            remainingCount = remainingCount,
            progressFraction = progress,
            nextToWatch = nextToWatch
        )
    }.combine(_selectedMovie) { state, selected ->
        state.copy(selectedMovie = selected)
    }.combine(_showAddDialog) { state, showAdd ->
        state.copy(showAddDialog = showAdd)
    }.combine(_showResetDialog) { state, showReset ->
        state.copy(showResetDialog = showReset)
    }.combine(_showNameDialog) { state, showName ->
        state.copy(showNameDialog = showName)
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = TrackerUiState()
    )

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun setFilter(filter: McuFilter) {
        _activeFilter.value = filter
    }

    fun setSort(sort: McuSort) {
        _activeSort.value = sort
    }

    fun toggleWatched(id: String) {
        viewModelScope.launch {
            val isWatched = uiState.value.watchRecords[id]?.isWatched == true
            repository.toggleWatched(id, isWatched)
        }
    }

    fun toggleFavorite(id: String) {
        viewModelScope.launch {
            val isFavorite = uiState.value.watchRecords[id]?.isFavorite == true
            repository.toggleFavorite(id, isFavorite)
        }
    }

    fun setHeroTheme(theme: String) {
        repository.saveHeroTheme(theme)
    }

    fun updateUserName(name: String) {
        repository.saveUserName(name)
        _showNameDialog.value = false
    }

    fun resetAll() {
        viewModelScope.launch {
            repository.resetAllProgress()
            _showResetDialog.value = false
        }
    }

    fun openDetail(movie: McuItem) {
        _selectedMovie.value = movie
    }

    fun closeDetail() {
        _selectedMovie.value = null
    }

    fun showAddDialog(show: Boolean) {
        _showAddDialog.value = show
    }

    fun showResetDialog(show: Boolean) {
        _showResetDialog.value = show
    }

    fun showNameDialog(show: Boolean) {
        _showNameDialog.value = show
    }

    fun addCustomMovie(
        title: String,
        slot: Int,
        year: Int,
        releaseDate: String,
        rating: Double,
        phase: String,
        type: String,
        importance: String,
        poster: String,
        description: String,
        trailerUrl: String
    ) {
        viewModelScope.launch {
            val id = "custom-${System.currentTimeMillis()}"
            val movie = McuItem(
                id = id,
                timelineSlot = slot,
                title = title.trim(),
                year = year,
                releaseDate = releaseDate.trim(),
                rating = rating,
                phase = phase.trim(),
                type = type,
                importance = importance,
                poster = poster.trim().ifEmpty { "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg" },
                description = description.trim(),
                trailerUrl = trailerUrl.trim().ifEmpty {
                    "https://www.youtube.com/results?search_query=${title.replace(" ", "+")}+trailer"
                },
                isCustom = true
            )
            repository.addCustomMovie(movie)
            _showAddDialog.value = false
        }
    }

    fun deleteCustomMovie(id: String) {
        viewModelScope.launch {
            repository.deleteCustomMovie(id)
            if (_selectedMovie.value?.id == id) {
                _selectedMovie.value = null
            }
        }
    }
}
