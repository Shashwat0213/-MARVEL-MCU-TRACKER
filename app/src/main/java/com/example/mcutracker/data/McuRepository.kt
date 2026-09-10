package com.example.mcutracker.data

import android.content.Context
import android.content.SharedPreferences
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

data class UserPreferences(
    val userName: String = "Shashwat",
    val heroTheme: String = "blue", // blue, red, gold, cosmic, ironman, gamma
    val soundEnabled: Boolean = true,
    val isDarkMode: Boolean = true
)

class McuRepository(context: Context) {
    private val db = McuLocalDatabase(context)
    private val prefs: SharedPreferences =
        context.getSharedPreferences("mcu_tracker_prefs", Context.MODE_PRIVATE)

    private val _items = MutableStateFlow<List<McuItem>>(emptyList())
    val items: StateFlow<List<McuItem>> = _items.asStateFlow()

    private val _watchRecords = MutableStateFlow<Map<String, WatchStatus>>(emptyMap())
    val watchRecords: StateFlow<Map<String, WatchStatus>> = _watchRecords.asStateFlow()

    private val _preferences = MutableStateFlow(loadPreferences())
    val preferences: StateFlow<UserPreferences> = _preferences.asStateFlow()

    private val coroutineScope = CoroutineScope(Dispatchers.IO)

    init {
        refreshAll()
    }

    private fun loadPreferences(): UserPreferences {
        return UserPreferences(
            userName = prefs.getString("user_name", "Shashwat") ?: "Shashwat",
            heroTheme = prefs.getString("hero_theme", "blue") ?: "blue",
            soundEnabled = prefs.getBoolean("sound_enabled", true),
            isDarkMode = prefs.getBoolean("dark_mode", true)
        )
    }

    fun refreshAll() {
        coroutineScope.launch {
            val custom = db.getAllCustomMovies()
            val combined = (McuDefaultData.defaultMovies + custom).sortedBy { it.timelineSlot }
            _items.value = combined
            _watchRecords.value = db.getAllWatchRecords()
            _preferences.value = loadPreferences()
        }
    }

    fun saveUserName(name: String) {
        val trimmed = name.trim().ifEmpty { "Shashwat" }
        prefs.edit().putString("user_name", trimmed).apply()
        _preferences.value = _preferences.value.copy(userName = trimmed)
    }

    fun saveHeroTheme(theme: String) {
        prefs.edit().putString("hero_theme", theme).apply()
        _preferences.value = _preferences.value.copy(heroTheme = theme)
    }

    fun saveSoundEnabled(enabled: Boolean) {
        prefs.edit().putBoolean("sound_enabled", enabled).apply()
        _preferences.value = _preferences.value.copy(soundEnabled = enabled)
    }

    fun saveDarkMode(isDark: Boolean) {
        prefs.edit().putBoolean("dark_mode", isDark).apply()
        _preferences.value = _preferences.value.copy(isDarkMode = isDark)
    }

    suspend fun toggleWatched(id: String, currentWatched: Boolean) {
        withContext(Dispatchers.IO) {
            val newStatus = !currentWatched
            db.setWatched(id, newStatus)
            _watchRecords.value = db.getAllWatchRecords()
        }
    }

    suspend fun toggleFavorite(id: String, currentFavorite: Boolean) {
        withContext(Dispatchers.IO) {
            val newStatus = !currentFavorite
            db.setFavorite(id, newStatus)
            _watchRecords.value = db.getAllWatchRecords()
        }
    }

    suspend fun resetAllProgress() {
        withContext(Dispatchers.IO) {
            db.clearAllWatchRecords()
            _watchRecords.value = emptyMap()
        }
    }

    suspend fun addCustomMovie(movie: McuItem) {
        withContext(Dispatchers.IO) {
            db.insertCustomMovie(movie)
            val custom = db.getAllCustomMovies()
            _items.value = (McuDefaultData.defaultMovies + custom).sortedBy { it.timelineSlot }
        }
    }

    suspend fun deleteCustomMovie(id: String) {
        withContext(Dispatchers.IO) {
            db.deleteCustomMovie(id)
            val custom = db.getAllCustomMovies()
            _items.value = (McuDefaultData.defaultMovies + custom).sortedBy { it.timelineSlot }
        }
    }
}
