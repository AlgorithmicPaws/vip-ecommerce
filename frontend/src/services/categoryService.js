import * as api from './apiService';

export const createCategory = async (categoryData) => {
  return api.post('/categories/', categoryData);
}

export const getCategories = async () => {
  const response = await api.get('/categories/'); // Suponiendo que esta es la ruta para obtener las categorías
  return response.data || []; // Devuelve un array vacío si no hay categorías
};