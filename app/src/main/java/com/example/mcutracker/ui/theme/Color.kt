package com.example.mcutracker.ui.theme

import androidx.compose.ui.graphics.Color

// Base Dark Palette
val DarkBg = Color(0xFF05070D)
val DarkSurface = Color(0xFF0D1422)
val DarkSurfaceVariant = Color(0xFF131D31)
val DarkBorder = Color(0xFF1E2E4A)
val TextPrimary = Color(0xFFF0F4FC)
val TextSecondary = Color(0xFF94A3B8)
val TextMuted = Color(0xFF64748B)

// Accents
val MarvelRed = Color(0xFFE62429)
val MarvelRedLight = Color(0xFFFF4D4D)
val InfinityGold = Color(0xFFFFD54A)
val InfinityGoldDark = Color(0xFFB48318)
val NeonCyan = Color(0xFF00E5FF)
val CosmicPurple = Color(0xFFA855F7)
val GammaGreen = Color(0xFF00E676)
val StarkGold = Color(0xFFFFC107)

data class ThemeColorSet(
    val primary: Color,
    val secondary: Color,
    val accent: Color,
    val glowColor: Color,
    val name: String
)

fun getThemeColorSet(themeKey: String): ThemeColorSet {
    return when (themeKey.lowercase()) {
        "red" -> ThemeColorSet(
            primary = MarvelRed,
            secondary = MarvelRedLight,
            accent = InfinityGold,
            glowColor = Color(0x66E62429),
            name = "Marvel Red"
        )
        "gold" -> ThemeColorSet(
            primary = InfinityGold,
            secondary = InfinityGoldDark,
            accent = NeonCyan,
            glowColor = Color(0x66FFD54A),
            name = "Infinity Gold"
        )
        "cosmic", "purple" -> ThemeColorSet(
            primary = CosmicPurple,
            secondary = Color(0xFFC084FC),
            accent = NeonCyan,
            glowColor = Color(0x66A855F7),
            name = "Multiverse Cosmic"
        )
        "ironman", "stark" -> ThemeColorSet(
            primary = MarvelRed,
            secondary = StarkGold,
            accent = NeonCyan,
            glowColor = Color(0x66FFC107),
            name = "Stark Armor"
        )
        "gamma", "green" -> ThemeColorSet(
            primary = GammaGreen,
            secondary = Color(0xFF69F0AE),
            accent = NeonCyan,
            glowColor = Color(0x6600E676),
            name = "Gamma Hulk"
        )
        else -> ThemeColorSet(
            primary = NeonCyan,
            secondary = Color(0xFF38BDF8),
            accent = MarvelRed,
            glowColor = Color(0x6600E5FF),
            name = "Massive Blue"
        )
    }
}
