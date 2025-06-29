async function cargarAnimeFiltrado() {
  const tipo = document.getElementById("tipo").value;
  const genero = document.getElementById("genero").value;
  const popularidad = document.getElementById("popularidad").value;
  const scoreMinimo = parseFloat(document.getElementById("scoreMinimo").value);

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
    params.append("page", Math.floor(Math.random() * 10) + 1);
  } else {
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

    // Filtrar resultados con score >= scoreMinimo, sin contenido adulto, y con imagen
    const animes = data.data.filter(
      (a) =>
        a.rating !== "Rx" &&
        a.images?.jpg?.image_url &&
        (a.score ?? 0) >= scoreMinimo
    );

    if (animes.length === 0) {
      card.innerHTML = "No se encontraron animes aptos para mostrar.";
      return;
    }

    const aleatorio = animes[Math.floor(Math.random() * animes.length)];

    card.innerHTML = `
      <h2>${aleatorio.title}</h2>
      <img src="${aleatorio.images.jpg.image_url}" alt="${aleatorio.title}">
      <p><strong>Géneros:</strong> ${aleatorio.genres
        .map((g) => g.name)
        .join(", ")}</p>
      <p><strong>Puntaje:</strong> <span style="color:${
        aleatorio.score >= 8
          ? "seagreen"
          : aleatorio.score >= 5
          ? "goldenrod"
          : "crimson"
      }; font-weight:bold;">
      ${aleatorio.score ?? "N/A"}
      </span></p>

      <p>${aleatorio.synopsis?.substring(0, 400) ?? "Sin sinopsis."}...</p>
      <a href="${
        aleatorio.url
      }" target="_blank" rel="noopener noreferrer" class="mal-button">Ver en MyAnimeList</a>
    `;
  } catch (error) {
    card.innerHTML = "Error al buscar animes 😢";
  }
}

function mostrarScore(valor) {
  const span = document.getElementById("valorScore");
  span.textContent = valor;

  span.classList.remove("bajo", "medio", "alto");

  if (valor < 5) {
    span.classList.add("bajo");
  } else if (valor < 8) {
    span.classList.add("medio");
  } else {
    span.classList.add("alto");
  }
}

function resetearFiltros() {
  document.getElementById("tipo").value = "";
  document.getElementById("genero").value = "";
  document.getElementById("popularidad").value = "";
  document.getElementById("scoreMinimo").value = 0;

  mostrarScore(0); // Actualizar el texto y color
  cargarAnimeFiltrado(); // Recargar anime
}

window.addEventListener("load", () => {
  // Slider de score
  const slider = document.getElementById("scoreMinimo");
  slider.addEventListener("input", () => mostrarScore(slider.value));
  mostrarScore(slider.value); // Mostrar valor inicial

  // Botón de búsqueda
  const botonBuscar = document.getElementById("botonBuscar");
  botonBuscar.addEventListener("click", cargarAnimeFiltrado);

  // Carga inicial
  cargarAnimeFiltrado();
});