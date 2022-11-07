import { enviroment } from './../env/enviroment';
import axios from "axios";

export const api = axios.create({
   baseURL: enviroment.baseURL
})