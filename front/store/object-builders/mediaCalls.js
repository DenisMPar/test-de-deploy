//Nano: Importo de librerias
import store from "..";

//Nano: Importo builders de archivos propios
import { serieBuilder } from "./series";
import { movieBuilder } from "./movies";
import { getLists } from "../../lib/list";

const api_key = process.env.APIKEY;

//Nano: Función para hacer llamado a API y traer los elementos
export async function getMediaFromAPI(caller, query) {
  // `https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&language=en-US&`
  const filter = store.getState().filterReducer.filter;
  const adult = filter.adults;
  const lists = await getLists();
  let baseURL;
  switch (caller) {
    case "trending":
      baseURL = (page) =>
        `https://api.themoviedb.org/3/trending/all/week?api_key=${api_key}&page=${page}`;
      break;
    case "search":
      if (query) {
        baseURL = (page) =>
          `https://api.themoviedb.org/3/search/multi?api_key=${api_key}&language=es-LA&query=${query}&page=${page}&include_adult=${adult}`;
      } else {
        baseURL = (page) =>
          `https://api.themoviedb.org/3/trending/all/week?api_key=${api_key}&page=${page}`;
      }
      break;
    default:
      break;
  }
  const apiCall = async (baseURL) => await fetch(baseURL).then((r) => r.json());
  const apiResponse = await apiCall(baseURL(1));
  const { results, total_pages: pages } = apiResponse;
  const allResults = [...results];
  for (let i = 2; i <= 5 && i < pages; i++) {
    const apiResponse = await apiCall(baseURL(i));
    const { results } = apiResponse;
    allResults.push(...results);
  }

  const allResultsNoDuplicated = allResults.filter(
    (element, index, self) =>
      self.findIndex(
        (element2) =>
          element2.id === element.id &&
          element2.media_type === element.media_type
      ) === index
  );

  const media = await Promise.all(
    allResultsNoDuplicated.map(async (result) => {
      if (result.media_type === "movie")
        return await movieBuilder(result.id, lists, "AR");
      if (result.media_type === "tv")
        return await serieBuilder(result.id, lists, "AR");
    })
  );
  return media;
}
