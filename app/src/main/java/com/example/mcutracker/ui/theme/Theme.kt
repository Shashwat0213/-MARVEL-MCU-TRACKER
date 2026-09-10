package com.example.mcutracker.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

val LocalThemeColorSet = staticCompositionLocalOf {
    getThemeColorSet("blue")
}

@Composable
fun McuTrackerTheme(
    heroThemeKey: String = "blue",
    darkTheme: Boolean = true,
    content: @Composable () -> Unit
) {
    val themeColorSet = getThemeColorSet(heroThemeKey)

    val colorScheme = darkColorScheme(
        primary = themeColorSet.primary,
        onPrimary = Color.Black,
        primaryContainer = themeColorSet.primary.copy(alpha = 0.2f),
        onPrimaryContainer = themeColorSet.primary,
        secondary = themeColorSet.secondary,
        onSecondary = Color.Black,
        background = DarkBg,
        onBackground = TextPrimary,
        surface = DarkSurface,
        onSurface = TextPrimary,
        surfaceVariant = DarkSurfaceVariant,
        onSurfaceVariant = TextSecondary,
        outline = DarkBorder,
        error = MarvelRed
    )

    CompositionLocalProvider(LocalThemeColorSet provides themeColorSet) {
        MaterialTheme(
            colorScheme = colorScheme,
            content = content
        )
    }
}
