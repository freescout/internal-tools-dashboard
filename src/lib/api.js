import axios from "axios";

const api = axios.create({
  baseURL: "https://tt-jsonserver-01.alt-tools.tech",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Analytics
export const fetchAnalytics = () =>
  api.get("/analytics").then((res) => res.data);

// Tools
export const fetchRecentTools = () =>
  api
    .get("/tools", {
      params: {
        _sort: "updated_at",
        _order: "desc",
        _limit: 20,
      },
    })
    .then(({ data }) => data);

export const fetchAllTools = () => api.get("/tools").then((res) => res.data);

// Tools - CRUD
export const createTool = (data) =>
  api.post(`/tools`, data).then((res) => res.data);

export const updateTool = (id, data) =>
  api.put(`/tools/${id}`, data).then((res) => res.data);

export const deleteTool = (id) =>
  api.delete(`/tools/${id}`).then((res) => res.data);

export const bulkDeleteTools = (ids) => Promise.all(ids.map(deleteTool));

export default api;
