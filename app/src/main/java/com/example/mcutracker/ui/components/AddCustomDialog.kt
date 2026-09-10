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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.mcutracker.ui.theme.DarkBorder
import com.example.mcutracker.ui.theme.DarkSurface
import com.example.mcutracker.ui.theme.DarkSurfaceVariant
import com.example.mcutracker.ui.theme.LocalThemeColorSet

@Composable
fun AddCustomDialog(
    onAddMovie: (
        title: String,
        slot: Int,
        year: Int,
        releaseDate: String,
        rating: Double,
        phase: String,
        type: String,
        importance: String,
        poster: String,
        description: String,
        trailerUrl: String
    ) -> Unit,
    onDismiss: () -> Unit
) {
    val themeColorSet = LocalThemeColorSet.current

    var title by remember { mutableStateOf("") }
    var slotStr by remember { mutableStateOf("56") }
    var yearStr by remember { mutableStateOf("2026") }
    var releaseDate by remember { mutableStateOf("2026-05-01") }
    var ratingStr by remember { mutableStateOf("8.0") }
    var phase by remember { mutableStateOf("Phase 6 • Multiverse Saga") }
    var type by remember { mutableStateOf("movie") }
    var importance by remember { mutableStateOf("Must Watch") }
    var posterUrl by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var trailerUrl by remember { mutableStateOf("") }

    var errorMessage by remember { mutableStateOf<String?>(null) }

    Dialog(onDismissRequest = onDismiss) {
        Box(
            modifier = Modifier
                .fillMaxWidth(0.95f)
                .clip(RoundedCornerShape(24.dp))
                .background(DarkSurface)
                .border(1.dp, themeColorSet.primary, RoundedCornerShape(24.dp))
                .padding(20.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState())
            ) {
                Text(
                    text = "Add Custom MCU Entry",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = themeColorSet.primary
                )
                Text(
                    text = "Add upcoming Marvel projects or custom timeline items",
                    fontSize = 11.sp,
                    color = Color(0xFF94A3B8)
                )

                Spacer(modifier = Modifier.height(14.dp))

                CustomField("Title *", title) { title = it }
                Spacer(modifier = Modifier.height(8.dp))

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    CustomField("Slot #", slotStr, Modifier.weight(1f)) { slotStr = it }
                    CustomField("Year", yearStr, Modifier.weight(1f)) { yearStr = it }
                }
                Spacer(modifier = Modifier.height(8.dp))

                CustomField("Release Date", releaseDate) { releaseDate = it }
                Spacer(modifier = Modifier.height(8.dp))

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    CustomField("Rating (e.g. 7.5)", ratingStr, Modifier.weight(1f)) { ratingStr = it }
                    CustomField("Type (movie/series)", type, Modifier.weight(1f)) { type = it }
                }
                Spacer(modifier = Modifier.height(8.dp))

                CustomField("Phase (e.g. Phase 6)", phase) { phase = it }
                Spacer(modifier = Modifier.height(8.dp))

                CustomField("Poster Image URL", posterUrl) { posterUrl = it }
                Spacer(modifier = Modifier.height(8.dp))

                CustomField("Description", description) { description = it }

                if (errorMessage != null) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(text = errorMessage!!, color = Color(0xFFFF4D4D), fontSize = 12.sp)
                }

                Spacer(modifier = Modifier.height(16.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Button(
                        onClick = onDismiss,
                        colors = ButtonDefaults.buttonColors(containerColor = DarkSurfaceVariant),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Cancel", color = Color.White)
                    }

                    Button(
                        onClick = {
                            if (title.isBlank()) {
                                errorMessage = "Title cannot be empty"
                                return@Button
                            }
                            val slot = slotStr.toIntOrNull() ?: 56
                            val year = yearStr.toIntOrNull() ?: 2026
                            val rating = ratingStr.toDoubleOrNull() ?: 7.0
                            onAddMovie(
                                title,
                                slot,
                                year,
                                releaseDate,
                                rating,
                                phase,
                                type,
                                importance,
                                posterUrl,
                                description,
                                trailerUrl
                            )
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = themeColorSet.primary),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Save", color = Color.Black, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
private fun CustomField(
    label: String,
    value: String,
    modifier: Modifier = Modifier,
    onValueChange: (String) -> Unit
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label, fontSize = 12.sp, color = Color(0xFF94A3B8)) },
        singleLine = true,
        shape = RoundedCornerShape(10.dp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedContainerColor = DarkSurfaceVariant,
            unfocusedContainerColor = DarkSurfaceVariant,
            focusedTextColor = Color.White,
            unfocusedTextColor = Color.White,
            focusedBorderColor = Color(0xFF00E5FF),
            unfocusedBorderColor = DarkBorder
        ),
        modifier = modifier.fillMaxWidth()
    )
}
