async function cargarAnime() {
  const id = Math.floor(Math.random() * 5000) + 1; // ID aleatorio
  const url = `https://api.jikan.moe/v4/anime/${id}`;

  const card = document.getElementById("anime-card");
  card.innerHTML = "Cargando anime...";

  try {
    const res = await fetch(url);
    const data = await res.json();
    const anime = data.data;

    if (!anime || anime.rating === "Rx") {
      // Saltar contenido adulto
      cargarAnime();
      return;
    }

    card.innerHTML = `
      <h2>${anime.title}</h2>
      <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
      <p><strong>Géneros:</strong> ${anime.genres.map(g => g.name).join(", ")}</p>
      <p><strong>Puntaje:</strong> ${anime.score ?? "N/A"}</p>
      <p>${anime.synopsis?.substring(0, 400) ?? "Sin sinopsis."}...</p>
      <a href="${anime.url}" target="_blank" rel="noopener noreferrer" class="mal-button">Ver en MyAnimeList</a>
    `;
  } catch (error) {
    card.innerHTML = "Error al cargar el anime 😢";
  }
}

// Cargar uno al principio
cargarAnime();
