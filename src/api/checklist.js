import axios from 'axios';
import { getToken } from '../utils/auth';

const BASE_URL = 'http://94.74.86.174:8080/api/checklist';

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Checklist (grup)
export const fetchChecklists = () => axios.get(BASE_URL, authHeader());

export const createChecklist = (name) => {
  return axios.post(BASE_URL, { name }, authHeader());
}

export const deleteChecklist = (checklistId) => { 
  return axios.delete(`${BASE_URL}/${checklistId}`, authHeader());
}

// Checklist Item
export const fetchChecklistItems = (checklistId) => {
  return axios.get(`${BASE_URL}/${checklistId}/item`, authHeader());
}

export const addItemToChecklist = (checklistId, itemName) => {
  return axios.post(
    `${BASE_URL}/${checklistId}/item`,
    { itemName },
    authHeader()
  );
}

export const toggleChecklistItemStatus = (checklistId, itemId) => {
  return axios.put(
    `${BASE_URL}/${checklistId}/item/${itemId}`, {}, authHeader()
  );
}

export const renameChecklistItem = (checklistId, itemId, itemName) =>
{
  return axios.put(
    `${BASE_URL}/${checklistId}/item/rename/${itemId}`,
    { itemName },
    authHeader()
  );
}

export const deleteChecklistItem = (checklistId, itemId) => {
  return axios.delete(`${BASE_URL}/${checklistId}/item/${itemId}`, authHeader());
}