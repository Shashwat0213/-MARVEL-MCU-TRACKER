package com.example.mcutracker.ui.components

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import coil.compose.AsyncImage
import com.example.mcutracker.data.McuItem
import com.example.mcutracker.ui.theme.DarkBorder
import com.example.mcutracker.ui.theme.DarkSurface
import com.example.mcutracker.ui.theme.DarkSurfaceVariant
import com.example.mcutracker.ui.theme.InfinityGold
import com.example.mcutracker.ui.theme.LocalThemeColorSet
import com.example.mcutracker.ui.theme.MarvelRed

@Composable
fun MovieDetailDialog(
    item: McuItem,
    isWatched: Boolean,
    isFavorite: Boolean,
    onToggleWatched: () -> Unit,
    onToggleFavorite: () -> Unit,
    onDeleteCustom: (() -> Unit)?,
    onDismiss: () -> Unit
) {
    val themeColorSet = LocalThemeColorSet.current
    val context = LocalContext.current

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .clip(RoundedCornerShape(24.dp))
                .background(DarkSurface)
                .border(1.dp, themeColorSet.primary.copy(alpha = 0.5f), RoundedCornerShape(24.dp))
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState())
            ) {
                // Top Banner with Poster
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(240.dp)
                        .background(Color(0xFF09111F))
                ) {
                    AsyncImage(
                        model = item.poster,
                        contentDescription = item.title,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.matchParentSize()
                    )

                    // Gradient overlay
                    Box(
                        modifier = Modifier
                            .matchParentSize()
                            .background(
                                Brush.verticalGradient(
                                    listOf(
                                        Color.Black.copy(alpha = 0.3f),
                                        Color.Transparent,
                                        DarkSurface
                                    )
                                )
                            )
                    )

                    // Close Button
                    Box(
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .padding(12.dp)
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(Color.Black.copy(alpha = 0.7f))
                            .clickable { onDismiss() },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = "✕", color = Color.White, fontSize = 14.sp)
                    }

                    // Timeline Slot & Favorite Badge
                    Row(
                        modifier = Modifier
                            .align(Alignment.TopStart)
                            .padding(12.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(Color.Black.copy(alpha = 0.8f))
                                .border(1.dp, themeColorSet.primary, RoundedCornerShape(8.dp))
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "Timeline Slot #${item.timelineSlot}",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = themeColorSet.primary
                            )
                        }
                    }
                }

                // Details Content
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp, vertical = 12.dp)
                ) {
                    // Phase badge
                    Text(
                        text = item.phase.uppercase(),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = themeColorSet.secondary,
                        letterSpacing = 1.sp
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    // Title
                    Text(
                        text = item.title,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    // Metadata Pill Row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        MetaBadge(label = "Year", value = item.year.toString(), color = Color.White)
                        MetaBadge(label = "Rating", value = "⭐ ${String.format("%.1f", item.rating)}", color = InfinityGold)
                        MetaBadge(label = "Type", value = item.type.capitalize(), color = themeColorSet.primary)
                        MetaBadge(label = "Priority", value = item.importance, color = if (item.importance == "Must Watch") MarvelRed else Color(0xFF94A3B8))
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Lore / Description
                    Text(
                        text = "OVERVIEW",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF94A3B8),
                        letterSpacing = 1.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = item.description.ifEmpty { "Official Marvel Cinematic Universe release (${item.year}). Part of ${item.phase}." },
                        fontSize = 13.sp,
                        color = Color(0xFFCBD5E1),
                        lineHeight = 19.sp
                    )

                    Spacer(modifier = Modifier.height(18.dp))

                    // Action Buttons Row: Watched & Favorite
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Button(
                            onClick = onToggleWatched,
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (isWatched) themeColorSet.primary else DarkSurfaceVariant
                            ),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(
                                text = if (isWatched) "✓ Watched" else "+ Mark Watched",
                                fontWeight = FontWeight.Bold,
                                color = if (isWatched) Color.Black else Color.White
                            )
                        }

                        Button(
                            onClick = onToggleFavorite,
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (isFavorite) MarvelRed.copy(alpha = 0.25f) else DarkSurfaceVariant
                            ),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(
                                text = if (isFavorite) "❤️ Favorite" else "🤍 Add Favorite",
                                fontWeight = FontWeight.Bold,
                                color = if (isFavorite) MarvelRed else Color.White
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Trailer Button
                    OutlinedButton(
                        onClick = {
                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(item.trailerUrl))
                            context.startActivity(intent)
                        },
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = themeColorSet.primary),
                        border = androidx.compose.foundation.BorderStroke(1.dp, themeColorSet.primary),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "▶ Watch Trailer on YouTube",
                            fontWeight = FontWeight.Bold
                        )
                    }

                    // Delete button if custom
                    if (onDeleteCustom != null) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Button(
                            onClick = onDeleteCustom,
                            colors = ButtonDefaults.buttonColors(containerColor = MarvelRed.copy(alpha = 0.2f)),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(text = "🗑 Delete from Tracker", color = MarvelRed, fontWeight = FontWeight.Bold)
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                }
            }
        }
    }
}

@Composable
private fun MetaBadge(label: String, value: String, color: Color) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(DarkSurfaceVariant)
            .border(1.dp, DarkBorder, RoundedCornerShape(8.dp))
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(text = label, fontSize = 9.sp, color = Color(0xFF64748B))
            Text(text = value, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = color)
        }
    }
}

private fun String.capitalize(): String =
    replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }
