async function cargarAnimeFiltrado() {
  const tipo = document.getElementById("tipo").value;
  const genero = document.getElementById("genero").value;

  const urlBase = "https://api.jikan.moe/v4/anime";

  // Armar query params para la API
  const params = new URLSearchParams({
    type: tipo || undefined,
    genres: genero || undefined,
    order_by: "popularity",
    sort: "desc",
    limit: 25 // traer hasta 25 animes
  });

  const url = `${urlBase}?${params.toString()}`;

  const card = document.getElementById("anime-card");
  card.innerHTML = "Buscando animes...";

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      card.innerHTML = "No se encontraron animes para esos filtros.";
      return;
    }

    // Elegir uno aleatorio del resultado filtrado
    const animes = data.data.filter(a => a.rating !== "Rx"); // evitar contenido adulto
    if (animes.length === 0) {
      card.innerHTML = "No se encontraron animes aptos para mostrar.";
      return;
    }

    const aleatorio = animes[Math.floor(Math.random() * animes.length)];

    card.innerHTML = `
      <h2>${aleatorio.title}</h2>
      <img src="${aleatorio.images.jpg.image_url}" alt="${aleatorio.title}">
      <p><strong>Géneros:</strong> ${aleatorio.genres.map(g => g.name).join(", ")}</p>
      <p><strong>Puntaje:</strong> ${aleatorio.score ?? "N/A"}</p>
      <p>${aleatorio.synopsis?.substring(0, 400) ?? "Sin sinopsis."}...</p>
      <a href="${aleatorio.url}" target="_blank" rel="noopener noreferrer" class="mal-button">Ver en MyAnimeList</a>
    `;

  } catch (error) {
    card.innerHTML = "Error al buscar animes 😢";
  }
}

// Cargar uno al principio
cargarAnimeFiltrado();
