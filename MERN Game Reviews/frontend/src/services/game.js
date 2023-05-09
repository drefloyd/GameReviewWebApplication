import http from "../http-common";

class GameDataService {
  getAll(page = 0) {
    return http.get(`games?page=${page}`);
  }

  get(id) {
    return http.get(`/game?id=${id}`);
  }

  find(query, by = "game_name", page = 0) {
    return http.get(`games?${by}=${query}&page=${page}`);
  } 

  createReview(data) {
    return http.post("/review-new", data);
  }

  updateReview(data) {
    return http.put("/review-edit", data);
  }

  deleteReview(id, userId) {
    return http.delete(`/review-delete?id=${id}`, {data:{user_id: userId}});
  }

  getPrices(id) {
    return http.get(`/prices`);
  }

}
