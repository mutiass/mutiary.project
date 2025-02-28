import React, { useEffect, useReducer, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Search from '../../components/Search/Search';
import Tags from '../../components/Tags/Tags';
import Thumbnails from '../../components/Thumbnails/Thumbnails';
import {
  getAll,
  getAllByTag,
  getAllTags,
  search,
} from '../../services/foodService';
import NotFound from '../../components/NotFound/NotFound';
import Loading from '../../components/Loading/Loading';

const initialState = { foods: [], tags: [] };

const reducer = (state, action) => {
  switch (action.type) {
    case 'FOODS_LOADED':
      return { ...state, foods: action.payload };
    case 'TAGS_LOADED':
      return { ...state, tags: action.payload };
    case 'RESET_FOODS':
      return { ...state, foods: action.payload };
    default:
      return state;
  }
};

export default function HomePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(true); // Tambahkan state loading
  const { foods, tags } = state;
  const { searchTerm, tag } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true); // Set loading ke true sebelum fetching data

    getAllTags().then(tags => dispatch({ type: 'TAGS_LOADED', payload: tags }));

    const loadFoods = tag
      ? getAllByTag(tag)
      : searchTerm
      ? search(searchTerm)
      : getAll();

    loadFoods.then(foods => {
      dispatch({ type: 'FOODS_LOADED', payload: foods });
      setIsLoading(false); // Set loading ke false setelah data selesai dimuat
    });
  }, [searchTerm, tag]);

  // Fungsi untuk reset pencarian & kembali ke tampilan awal HomePage
  const resetSearch = () => {
    navigate('/');
    setIsLoading(true); // Set loading ke true sebelum fetching ulang
    getAll().then(foods => {
      dispatch({ type: 'RESET_FOODS', payload: foods });
      setIsLoading(false); // Set loading ke false setelah data selesai dimuat
    });
  };

  return (
    <>
      <Search />
      <Tags tags={tags} />
      {isLoading ? ( // Tampilkan loading jika sedang fetch
        <Loading />
      ) : foods.length === 0 ? ( // Jika tidak loading dan data kosong, tampilkan NotFound
        <NotFound linkText="Reset Search" onReset={resetSearch} />
      ) : (
        <Thumbnails foods={foods} />
      )}
    </>
  );
}