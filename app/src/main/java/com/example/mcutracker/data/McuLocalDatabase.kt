package com.example.mcutracker.data

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

data class WatchStatus(
    val id: String,
    val isWatched: Boolean = false,
    val isFavorite: Boolean = false,
    val timestamp: Long = 0L,
    val rating: Float = 0f,
    val notes: String = ""
)

class McuLocalDatabase(context: Context) : SQLiteOpenHelper(
    context.applicationContext,
    "mcu_tracker.db",
    null,
    1
) {
    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(
            """
            CREATE TABLE watch_records (
                id TEXT PRIMARY KEY,
                is_watched INTEGER NOT NULL DEFAULT 0,
                is_favorite INTEGER NOT NULL DEFAULT 0,
                timestamp INTEGER NOT NULL DEFAULT 0,
                rating REAL NOT NULL DEFAULT 0.0,
                notes TEXT NOT NULL DEFAULT ''
            )
            """.trimIndent()
        )
        db.execSQL(
            """
            CREATE TABLE custom_movies (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                slot INTEGER NOT NULL,
                year INTEGER NOT NULL,
                release_date TEXT NOT NULL,
                rating REAL NOT NULL,
                phase TEXT NOT NULL,
                type TEXT NOT NULL,
                importance TEXT NOT NULL,
                poster TEXT NOT NULL,
                description TEXT NOT NULL DEFAULT '',
                trailer_url TEXT NOT NULL DEFAULT ''
            )
            """.trimIndent()
        )
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("DROP TABLE IF EXISTS watch_records")
        db.execSQL("DROP TABLE IF EXISTS custom_movies")
        onCreate(db)
    }

    fun getAllWatchRecords(): Map<String, WatchStatus> {
        val map = mutableMapOf<String, WatchStatus>()
        val db = readableDatabase
        val cursor = db.query(
            "watch_records",
            null,
            null,
            null,
            null,
            null,
            null
        )
        cursor.use {
            val idIndex = it.getColumnIndexOrThrow("id")
            val watchedIndex = it.getColumnIndexOrThrow("is_watched")
            val favIndex = it.getColumnIndexOrThrow("is_favorite")
            val timeIndex = it.getColumnIndexOrThrow("timestamp")
            val ratingIndex = it.getColumnIndexOrThrow("rating")
            val notesIndex = it.getColumnIndexOrThrow("notes")
            while (it.moveToNext()) {
                val id = it.getString(idIndex)
                map[id] = WatchStatus(
                    id = id,
                    isWatched = it.getInt(watchedIndex) == 1,
                    isFavorite = it.getInt(favIndex) == 1,
                    timestamp = it.getLong(timeIndex),
                    rating = it.getFloat(ratingIndex),
                    notes = it.getString(notesIndex)
                )
            }
        }
        return map
    }

    fun setWatched(id: String, watched: Boolean) {
        val db = writableDatabase
        val current = getWatchStatus(id)
        val values = ContentValues().apply {
            put("id", id)
            put("is_watched", if (watched) 1 else 0)
            put("is_favorite", if (current.isFavorite) 1 else 0)
            put("timestamp", if (watched) System.currentTimeMillis() else 0L)
            put("rating", current.rating)
            put("notes", current.notes)
        }
        db.insertWithOnConflict("watch_records", null, values, SQLiteDatabase.CONFLICT_REPLACE)
    }

    fun setFavorite(id: String, favorite: Boolean) {
        val db = writableDatabase
        val current = getWatchStatus(id)
        val values = ContentValues().apply {
            put("id", id)
            put("is_watched", if (current.isWatched) 1 else 0)
            put("is_favorite", if (favorite) 1 else 0)
            put("timestamp", current.timestamp)
            put("rating", current.rating)
            put("notes", current.notes)
        }
        db.insertWithOnConflict("watch_records", null, values, SQLiteDatabase.CONFLICT_REPLACE)
    }

    fun clearAllWatchRecords() {
        val db = writableDatabase
        db.delete("watch_records", null, null)
    }

    fun getWatchStatus(id: String): WatchStatus {
        val db = readableDatabase
        val cursor = db.query(
            "watch_records",
            null,
            "id = ?",
            arrayOf(id),
            null,
            null,
            null
        )
        cursor.use {
            if (it.moveToFirst()) {
                return WatchStatus(
                    id = id,
                    isWatched = it.getInt(it.getColumnIndexOrThrow("is_watched")) == 1,
                    isFavorite = it.getInt(it.getColumnIndexOrThrow("is_favorite")) == 1,
                    timestamp = it.getLong(it.getColumnIndexOrThrow("timestamp")),
                    rating = it.getFloat(it.getColumnIndexOrThrow("rating")),
                    notes = it.getString(it.getColumnIndexOrThrow("notes"))
                )
            }
        }
        return WatchStatus(id = id)
    }

    fun getAllCustomMovies(): List<McuItem> {
        val list = mutableListOf<McuItem>()
        val db = readableDatabase
        val cursor = db.query("custom_movies", null, null, null, null, null, "slot ASC")
        cursor.use {
            val idIdx = it.getColumnIndexOrThrow("id")
            val titleIdx = it.getColumnIndexOrThrow("title")
            val slotIdx = it.getColumnIndexOrThrow("slot")
            val yearIdx = it.getColumnIndexOrThrow("year")
            val dateIdx = it.getColumnIndexOrThrow("release_date")
            val ratingIdx = it.getColumnIndexOrThrow("rating")
            val phaseIdx = it.getColumnIndexOrThrow("phase")
            val typeIdx = it.getColumnIndexOrThrow("type")
            val impIdx = it.getColumnIndexOrThrow("importance")
            val posterIdx = it.getColumnIndexOrThrow("poster")
            val descIdx = it.getColumnIndexOrThrow("description")
            val trailerIdx = it.getColumnIndexOrThrow("trailer_url")
            while (it.moveToNext()) {
                list.add(
                    McuItem(
                        id = it.getString(idIdx),
                        timelineSlot = it.getInt(slotIdx),
                        title = it.getString(titleIdx),
                        year = it.getInt(yearIdx),
                        releaseDate = it.getString(dateIdx),
                        rating = it.getDouble(ratingIdx),
                        phase = it.getString(phaseIdx),
                        type = it.getString(typeIdx),
                        importance = it.getString(impIdx),
                        poster = it.getString(posterIdx),
                        description = it.getString(descIdx),
                        trailerUrl = it.getString(trailerIdx),
                        isCustom = true
                    )
                )
            }
        }
        return list
    }

    fun insertCustomMovie(movie: McuItem) {
        val db = writableDatabase
        val values = ContentValues().apply {
            put("id", movie.id)
            put("title", movie.title)
            put("slot", movie.timelineSlot)
            put("year", movie.year)
            put("release_date", movie.releaseDate)
            put("rating", movie.rating)
            put("phase", movie.phase)
            put("type", movie.type)
            put("importance", movie.importance)
            put("poster", movie.poster)
            put("description", movie.description)
            put("trailer_url", movie.trailerUrl)
        }
        db.insertWithOnConflict("custom_movies", null, values, SQLiteDatabase.CONFLICT_REPLACE)
    }

    fun deleteCustomMovie(id: String) {
        val db = writableDatabase
        db.delete("custom_movies", "id = ?", arrayOf(id))
    }
}
