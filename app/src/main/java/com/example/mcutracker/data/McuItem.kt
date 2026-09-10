package com.example.mcutracker.data

data class McuItem(
    val id: String,
    val timelineSlot: Int,
    val title: String,
    val year: Int,
    val releaseDate: String,
    val rating: Double,
    val phase: String,
    val type: String, // "movie" or "series"
    val importance: String, // "Must Watch", "Important", "Optional"
    val poster: String,
    val description: String = "",
    val trailerUrl: String = "",
    val isCustom: Boolean = false
)
