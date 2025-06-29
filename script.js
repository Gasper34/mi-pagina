async function cargarAnimeFiltrado() {
  const tipo = document.getElementById("tipo").value;
  const genero = document.getElementById("genero").value;
  const popularidad = document.getElementById("popularidad").value;

  const urlBase = "https://api.jikan.moe/v4/anime";
  const params = new URLSearchParams();

  if (tipo) params.append("type", tipo);
  if (genero) params.append("genres", genero);

  if (popularidad === "masvisto") {
    params.append("order_by", "popularity");
    params.append("sort", "desc");
    params.append("limit", 25);
  } else {
    params.append("order_by", "score");
    params.append("sort", "desc");
    params.append("limit", 25);

    // Simular top 100 o 1000 eligiendo páginas según el filtro
    if (popularidad === "top100") {
      params.append("page", Math.floor(Math.random() * 4) + 1); // páginas 1 a 4 (25x4 = 100)
    } else if (popularidad === "top1000") {
      params.append("page", Math.floor(Math.random() * 40) + 1); // páginas 1 a 40
    } else {
      params.append("page", Math.floor(Math.random() * 20) + 1); // por defecto entre top 500
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

    const animes = data.data.filter(a => a.rating !== "Rx" && a.images?.jpg?.image_url);
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