package com.example.mcutracker.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.mcutracker.ui.theme.DarkBorder
import com.example.mcutracker.ui.theme.DarkSurface
import com.example.mcutracker.ui.theme.DarkSurfaceVariant
import com.example.mcutracker.ui.theme.LocalThemeColorSet

data class ThemeOption(val key: String, val name: String, val color: Color)

val THEMES = listOf(
    ThemeOption("blue", "Massive Blue", Color(0xFF00E5FF)),
    ThemeOption("red", "Marvel Red", Color(0xFFE62429)),
    ThemeOption("gold", "Infinity Gold", Color(0xFFFFD54A)),
    ThemeOption("cosmic", "Multiverse Cosmic", Color(0xFFA855F7)),
    ThemeOption("stark", "Stark Armor", Color(0xFFFFC107)),
    ThemeOption("gamma", "Gamma Hulk", Color(0xFF00E676))
)

@Composable
fun HeroSection(
    currentThemeKey: String,
    onSelectTheme: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val themeColorSet = LocalThemeColorSet.current

    Card(
        modifier = modifier
            .fillMaxWidth()
            .border(
                width = 1.dp,
                color = DarkBorder,
                shape = RoundedCornerShape(20.dp)
            ),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(
            containerColor = DarkSurface
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    brush = Brush.verticalGradient(
                        colors = listOf(
                            themeColorSet.primary.copy(alpha = 0.12f),
                            Color.Transparent
                        )
                    )
                )
                .padding(16.dp)
        ) {
            // Tagline
            Text(
                text = "YOUR MCU. YOUR TIMELINE.",
                fontSize = 18.sp,
                fontWeight = FontWeight.Black,
                color = themeColorSet.primary,
                letterSpacing = 1.5.sp
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "Track every movie & series, discover what to watch next, manage your favorites, and keep your progress in one cinematic dashboard.",
                fontSize = 13.sp,
                color = Color(0xFFCBD5E1),
                lineHeight = 18.sp
            )

            Spacer(modifier = Modifier.height(14.dp))

            // Doomsday Countdown Card
            DoomsdayCountdownCard()

            Spacer(modifier = Modifier.height(14.dp))

            // Cinematic Theme Picker
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "CINEMATIC THEMES",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF94A3B8),
                    letterSpacing = 1.sp
                )
                Text(
                    text = themeColorSet.name,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = themeColorSet.primary
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                THEMES.forEach { theme ->
                    val isSelected = currentThemeKey.equals(theme.key, ignoreCase = true)
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(20.dp))
                            .background(
                                if (isSelected) themeColorSet.primary.copy(alpha = 0.2f)
                                else DarkSurfaceVariant
                            )
                            .border(
                                width = if (isSelected) 1.5.dp else 1.dp,
                                color = if (isSelected) theme.color else DarkBorder,
                                shape = RoundedCornerShape(20.dp)
                            )
                            .clickable { onSelectTheme(theme.key) }
                            .padding(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(10.dp)
                                    .clip(CircleShape)
                                    .background(theme.color)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = theme.name,
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                color = if (isSelected) Color.White else Color(0xFF94A3B8)
                            )
                        }
                    }
                }
            }
        }
    }
}
