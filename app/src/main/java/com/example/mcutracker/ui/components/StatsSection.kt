package com.example.mcutracker.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.mcutracker.data.McuItem
import com.example.mcutracker.ui.theme.DarkBorder
import com.example.mcutracker.ui.theme.DarkSurface
import com.example.mcutracker.ui.theme.DarkSurfaceVariant
import com.example.mcutracker.ui.theme.InfinityGold
import com.example.mcutracker.ui.theme.LocalThemeColorSet
import com.example.mcutracker.ui.theme.MarvelRed

@Composable
fun StatsSection(
    userName: String,
    watchedCount: Int,
    totalCount: Int,
    remainingCount: Int,
    favoritesCount: Int,
    progressFraction: Float,
    nextToWatch: McuItem?,
    onEditNameClick: () -> Unit,
    onNextMovieClick: (McuItem) -> Unit,
    modifier: Modifier = Modifier
) {
    val themeColorSet = LocalThemeColorSet.current
    val animatedProgress by animateFloatAsState(
        targetValue = progressFraction,
        label = "progress"
    )

    Card(
        modifier = modifier
            .fillMaxWidth()
            .border(1.dp, DarkBorder, RoundedCornerShape(20.dp)),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = DarkSurface)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            // User Greeting
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onEditNameClick() },
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "Welcome back, $userName ⚡",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
                Text(
                    text = "Edit ✎",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium,
                    color = themeColorSet.primary
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Stat Cards Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                StatCard(
                    title = "Watched",
                    value = "$watchedCount",
                    sub = "of $totalCount",
                    accentColor = themeColorSet.primary,
                    modifier = Modifier.weight(1f)
                )
                StatCard(
                    title = "Remaining",
                    value = "$remainingCount",
                    sub = "to watch",
                    accentColor = InfinityGold,
                    modifier = Modifier.weight(1f)
                )
                StatCard(
                    title = "Favorites",
                    value = "$favoritesCount",
                    sub = "starred",
                    accentColor = MarvelRed,
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Watch Progress Bar
            val pct = (progressFraction * 100).toInt()
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "OVERALL MCU WATCH PROGRESS",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF94A3B8),
                    letterSpacing = 1.sp
                )
                Text(
                    text = "$pct%",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = themeColorSet.primary
                )
            }

            Spacer(modifier = Modifier.height(6.dp))

            LinearProgressIndicator(
                progress = { animatedProgress },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(8.dp)
                    .clip(RoundedCornerShape(4.dp)),
                color = themeColorSet.primary,
                trackColor = DarkSurfaceVariant
            )

            // Recommended Next
            if (nextToWatch != null) {
                Spacer(modifier = Modifier.height(16.dp))

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(DarkSurfaceVariant)
                        .border(1.dp, themeColorSet.primary.copy(alpha = 0.3f), RoundedCornerShape(12.dp))
                        .clickable { onNextMovieClick(nextToWatch) }
                        .padding(12.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        AsyncImage(
                            model = nextToWatch.poster,
                            contentDescription = nextToWatch.title,
                            modifier = Modifier
                                .size(44.dp, 60.dp)
                                .clip(RoundedCornerShape(6.dp)),
                            contentScale = ContentScale.Crop
                        )

                        Spacer(modifier = Modifier.width(12.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .background(themeColorSet.primary.copy(alpha = 0.2f), RoundedCornerShape(4.dp))
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Text(
                                        text = "RECOMMENDED NEXT",
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = themeColorSet.primary
                                    )
                                }
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "Slot ${nextToWatch.timelineSlot}",
                                    fontSize = 10.sp,
                                    color = Color(0xFF64748B)
                                )
                            }
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = nextToWatch.title,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White,
                                maxLines = 1
                            )
                            Text(
                                text = "${nextToWatch.year} • ${nextToWatch.phase}",
                                fontSize = 11.sp,
                                color = Color(0xFF94A3B8),
                                maxLines = 1
                            )
                        }

                        Text(
                            text = "View ▶",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = themeColorSet.primary,
                            modifier = Modifier.padding(start = 8.dp)
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun StatCard(
    title: String,
    value: String,
    sub: String,
    accentColor: Color,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(DarkSurfaceVariant)
            .border(1.dp, DarkBorder, RoundedCornerShape(12.dp))
            .padding(10.dp)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
            Text(
                text = title,
                fontSize = 11.sp,
                fontWeight = FontWeight.Medium,
                color = Color(0xFF94A3B8)
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = value,
                fontSize = 18.sp,
                fontWeight = FontWeight.Black,
                color = accentColor
            )
            Text(
                text = sub,
                fontSize = 10.sp,
                color = Color(0xFF64748B)
            )
        }
    }
}
