async function cargarAnimeFiltrado() {
  const tipo = document.getElementById("tipo").value;
  const genero = document.getElementById("genero").value;
  const popularidad = document.getElementById("popularidad").value;

  const urlBase = "https://api.jikan.moe/v4/anime";
  const params = new URLSearchParams();

  // Filtros básicos
  if (tipo) params.append("type", tipo);
  if (genero) params.append("genres", genero);

  // Lógica de popularidad
  if (popularidad === "masvisto") {
    params.append("order_by", "popularity");
    params.append("sort", "desc");
    params.append("limit", 25);
  } else if (popularidad === "recomendado") {
    params.append("order_by", "popularity");
    params.append("sort", "desc");
    params.append("limit", 25);
    params.append("min_score", 7);
    params.append("page", Math.floor(Math.random() * 10) + 1); // páginas 1–10
  } else {
    // Top 100 o Top 1000 o sin filtro de popularidad
    params.append("order_by", "score");
    params.append("sort", "desc");
    params.append("limit", 25);

    if (popularidad === "top100") {
      params.append("page", Math.floor(Math.random() * 4) + 1);
    } else if (popularidad === "top1000") {
      params.append("page", Math.floor(Math.random() * 40) + 1);
    } else {
      params.append("page", Math.floor(Math.random() * 20) + 1);
    }
  }

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

    // Filtro final: evitar Rx y sin imagen
    const animes = data.data.filter(
      a => a.rating !== "Rx" && a.images?.jpg?.image_url
    );

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

window.addEventListener('load', cargarAnimeFiltrado);