package com.example.mcutracker.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.mcutracker.ui.theme.DarkBorder
import com.example.mcutracker.ui.theme.DarkSurfaceVariant
import com.example.mcutracker.ui.theme.LocalThemeColorSet
import kotlinx.coroutines.delay
import java.util.Calendar
import java.util.TimeZone

@Composable
fun DoomsdayCountdownCard(
    modifier: Modifier = Modifier
) {
    val themeColorSet = LocalThemeColorSet.current

    // Avengers: Doomsday release target: May 1, 2026
    val targetMillis = remember {
        Calendar.getInstance(TimeZone.getTimeZone("UTC")).apply {
            set(2026, Calendar.MAY, 1, 0, 0, 0)
            set(Calendar.MILLISECOND, 0)
        }.timeInMillis
    }

    var remainingMillis by remember {
        mutableLongStateOf((targetMillis - System.currentTimeMillis()).coerceAtLeast(0L))
    }

    LaunchedEffect(Unit) {
        while (true) {
            delay(1000L)
            remainingMillis = (targetMillis - System.currentTimeMillis()).coerceAtLeast(0L)
        }
    }

    val totalSeconds = remainingMillis / 1000
    val days = totalSeconds / 86400
    val hours = (totalSeconds % 86400) / 3600
    val minutes = (totalSeconds % 3600) / 60
    val seconds = totalSeconds % 60

    Card(
        modifier = modifier
            .fillMaxWidth()
            .border(
                width = 1.dp,
                brush = Brush.horizontalGradient(
                    listOf(
                        themeColorSet.primary.copy(alpha = 0.5f),
                        themeColorSet.glowColor,
                        themeColorSet.accent.copy(alpha = 0.5f)
                    )
                ),
                shape = RoundedCornerShape(16.dp)
            ),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = DarkSurfaceVariant.copy(alpha = 0.85f)
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Text(
                    text = "⚡",
                    fontSize = 16.sp,
                    modifier = Modifier.padding(end = 6.dp)
                )
                Text(
                    text = "AVENGERS: DOOMSDAY",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = themeColorSet.primary,
                    letterSpacing = 2.sp
                )
            }

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "Countdown to the Multiverse Endgame",
                fontSize = 12.sp,
                color = Color(0xFF94A3B8)
            )

            Spacer(modifier = Modifier.height(14.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                CountdownUnit(value = days.toString(), label = "DAYS", accentColor = themeColorSet.primary)
                CountdownSeparator(color = themeColorSet.primary)
                CountdownUnit(value = hours.toString().padStart(2, '0'), label = "HRS", accentColor = themeColorSet.primary)
                CountdownSeparator(color = themeColorSet.primary)
                CountdownUnit(value = minutes.toString().padStart(2, '0'), label = "MIN", accentColor = themeColorSet.primary)
                CountdownSeparator(color = themeColorSet.primary)
                CountdownUnit(value = seconds.toString().padStart(2, '0'), label = "SEC", accentColor = themeColorSet.accent)
            }
        }
    }
}

@Composable
private fun CountdownUnit(
    value: String,
    label: String,
    accentColor: Color
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .background(
                    color = Color(0xFF09111F),
                    shape = RoundedCornerShape(8.dp)
                )
                .border(
                    width = 1.dp,
                    color = DarkBorder,
                    shape = RoundedCornerShape(8.dp)
                )
                .padding(horizontal = 10.dp, vertical = 6.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = value,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Monospace,
                color = accentColor
            )
        }
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = label,
            fontSize = 10.sp,
            fontWeight = FontWeight.SemiBold,
            color = Color(0xFF64748B),
            letterSpacing = 1.sp
        )
    }
}

@Composable
private fun CountdownSeparator(color: Color) {
    Text(
        text = ":",
        fontSize = 18.sp,
        fontWeight = FontWeight.Bold,
        color = color.copy(alpha = 0.6f),
        modifier = Modifier.padding(bottom = 14.dp)
    )
}
