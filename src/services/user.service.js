import axios from "axios";
import authHeader from "./auth-header";
import config from "../config.json";

const BASE_URL = config.apiBaseUrl;
const API_URL = BASE_URL + "/test/";

const getPublicContent = () => {
  return requester.get(API_URL + "all");
};

const getUserBoard = () => {
  return requester.get(API_URL + "user", { headers: authHeader() });
};

const getModeratorBoard = () => {
  return requester.get(API_URL + "mod", { headers: authHeader() });
};

const getAdminBoard = () => {
  return requester.get(API_URL + "admin", { headers: authHeader() });
};

export default {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};