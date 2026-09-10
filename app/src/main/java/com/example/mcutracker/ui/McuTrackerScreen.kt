package com.example.mcutracker.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.mcutracker.ui.components.AddCustomDialog
import com.example.mcutracker.ui.components.EditNameDialog
import com.example.mcutracker.ui.components.FilterSortBar
import com.example.mcutracker.ui.components.HeroSection
import com.example.mcutracker.ui.components.McuItemCard
import com.example.mcutracker.ui.components.MovieDetailDialog
import com.example.mcutracker.ui.components.StatsSection
import com.example.mcutracker.ui.theme.DarkBg
import com.example.mcutracker.ui.theme.DarkBorder
import com.example.mcutracker.ui.theme.DarkSurface
import com.example.mcutracker.ui.theme.DarkSurfaceVariant
import com.example.mcutracker.ui.theme.LocalThemeColorSet
import com.example.mcutracker.ui.theme.MarvelRed

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun McuTrackerScreen(
    viewModel: McuTrackerViewModel
) {
    val uiState by viewModel.uiState.collectAsState()
    val themeColorSet = LocalThemeColorSet.current

    Scaffold(
        contentWindowInsets = WindowInsets.safeDrawing,
        containerColor = DarkBg,
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(8.dp)
                                    .clip(CircleShape)
                                    .background(themeColorSet.primary)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "MARVEL MCU TRACKER",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Black,
                                color = Color.White,
                                letterSpacing = 1.2.sp
                            )
                        }
                        Text(
                            text = "Timeline & Watch Dashboard",
                            fontSize = 10.sp,
                            color = themeColorSet.primary,
                            letterSpacing = 0.5.sp
                        )
                    }
                },
                navigationIcon = {
                    // Reset All Progress Button
                    IconButton(
                        onClick = { viewModel.showResetDialog(true) },
                        modifier = Modifier.padding(start = 4.dp)
                    ) {
                        Text(
                            text = "↺",
                            fontSize = 18.sp,
                            color = Color(0xFF94A3B8)
                        )
                    }
                },
                actions = {
                    // Add Custom Movie Button
                    Box(
                        modifier = Modifier
                            .padding(end = 8.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .background(DarkSurfaceVariant)
                            .border(1.dp, themeColorSet.primary.copy(alpha = 0.5f), RoundedCornerShape(8.dp))
                            .clickable { viewModel.showAddDialog(true) }
                            .padding(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = "+ Add",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = themeColorSet.primary
                        )
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = DarkSurface.copy(alpha = 0.95f)
                )
            )
        }
    ) { innerPadding ->
        LazyVerticalGrid(
            columns = GridCells.Adaptive(minSize = 160.dp),
            contentPadding = PaddingValues(
                start = 14.dp,
                end = 14.dp,
                top = innerPadding.calculateTopPadding() + 10.dp,
                bottom = innerPadding.calculateBottomPadding() + 20.dp
            ),
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            // Header 1: Hero Banner + Doomsday Countdown + Theme Selector
            item(span = { GridItemSpan(maxLineSpan) }) {
                HeroSection(
                    currentThemeKey = uiState.preferences.heroTheme,
                    onSelectTheme = { viewModel.setHeroTheme(it) }
                )
            }

            // Header 2: Stats + Progress + Recommended Next
            item(span = { GridItemSpan(maxLineSpan) }) {
                StatsSection(
                    userName = uiState.preferences.userName,
                    watchedCount = uiState.watchedCount,
                    totalCount = uiState.totalCount,
                    remainingCount = uiState.remainingCount,
                    favoritesCount = uiState.favoritesCount,
                    progressFraction = uiState.progressFraction,
                    nextToWatch = uiState.nextToWatch,
                    onEditNameClick = { viewModel.showNameDialog(true) },
                    onNextMovieClick = { viewModel.openDetail(it) }
                )
            }

            // Header 3: Search Bar & Filters
            item(span = { GridItemSpan(maxLineSpan) }) {
                FilterSortBar(
                    searchQuery = uiState.searchQuery,
                    onSearchQueryChange = { viewModel.setSearchQuery(it) },
                    activeFilter = uiState.activeFilter,
                    onFilterSelect = { viewModel.setFilter(it) },
                    activeSort = uiState.activeSort,
                    onSortSelect = { viewModel.setSort(it) }
                )
            }

            // Section Header: Result Count
            item(span = { GridItemSpan(maxLineSpan) }) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 4.dp, vertical = 2.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "TIMELINE ENTRIES (${uiState.filteredItems.size})",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color(0xFF94A3B8),
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "${uiState.watchedCount} of ${uiState.totalCount} completed",
                        fontSize = 11.sp,
                        color = themeColorSet.primary
                    )
                }
            }

            // Empty State
            if (uiState.filteredItems.isEmpty()) {
                item(span = { GridItemSpan(maxLineSpan) }) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 40.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(text = "🔍", fontSize = 36.sp)
                            Spacer(modifier = Modifier.height(10.dp))
                            Text(
                                text = "No MCU entries found",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Try clearing the search query or changing filters",
                                fontSize = 12.sp,
                                color = Color(0xFF64748B),
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }
            }

            // MCU Movie / Series Items Grid
            items(
                items = uiState.filteredItems,
                key = { it.id }
            ) { item ->
                val isWatched = uiState.watchRecords[item.id]?.isWatched == true
                val isFavorite = uiState.watchRecords[item.id]?.isFavorite == true

                McuItemCard(
                    item = item,
                    isWatched = isWatched,
                    isFavorite = isFavorite,
                    onToggleWatched = { viewModel.toggleWatched(item.id) },
                    onToggleFavorite = { viewModel.toggleFavorite(item.id) },
                    onClick = { viewModel.openDetail(item) }
                )
            }
        }

        // Movie Details Dialog
        if (uiState.selectedMovie != null) {
            val selected = uiState.selectedMovie!!
            val isWatched = uiState.watchRecords[selected.id]?.isWatched == true
            val isFavorite = uiState.watchRecords[selected.id]?.isFavorite == true

            MovieDetailDialog(
                item = selected,
                isWatched = isWatched,
                isFavorite = isFavorite,
                onToggleWatched = { viewModel.toggleWatched(selected.id) },
                onToggleFavorite = { viewModel.toggleFavorite(selected.id) },
                onDeleteCustom = if (selected.isCustom) { { viewModel.deleteCustomMovie(selected.id) } } else null,
                onDismiss = { viewModel.closeDetail() }
            )
        }

        // Add Custom Entry Dialog
        if (uiState.showAddDialog) {
            AddCustomDialog(
                onAddMovie = { title, slot, year, releaseDate, rating, phase, type, importance, poster, desc, trailer ->
                    viewModel.addCustomMovie(
                        title, slot, year, releaseDate, rating, phase, type, importance, poster, desc, trailer
                    )
                },
                onDismiss = { viewModel.showAddDialog(false) }
            )
        }

        // Edit Name Dialog
        if (uiState.showNameDialog) {
            EditNameDialog(
                currentName = uiState.preferences.userName,
                onSaveName = { viewModel.updateUserName(it) },
                onDismiss = { viewModel.showNameDialog(false) }
            )
        }

        // Reset All Confirmation Dialog
        if (uiState.showResetDialog) {
            AlertDialog(
                onDismissRequest = { viewModel.showResetDialog(false) },
                containerColor = DarkSurface,
                titleContentColor = Color.White,
                textContentColor = Color(0xFFCBD5E1),
                title = {
                    Text("Reset Tracker Progress?", fontWeight = FontWeight.Bold)
                },
                text = {
                    Text("This will clear all watched statuses and favorites. Your custom added movies will be preserved.")
                },
                confirmButton = {
                    Button(
                        onClick = { viewModel.resetAll() },
                        colors = ButtonDefaults.buttonColors(containerColor = MarvelRed)
                    ) {
                        Text("Reset All", color = Color.White, fontWeight = FontWeight.Bold)
                    }
                },
                dismissButton = {
                    TextButton(onClick = { viewModel.showResetDialog(false) }) {
                        Text("Cancel", color = Color(0xFF94A3B8))
                    }
                }
            )
        }
    }
}
