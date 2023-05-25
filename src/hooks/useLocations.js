import { useContext } from 'react';
import { LocationsContext } from '../context/LocationsContext';

export function useLocations() {
  const value = useContext(LocationsContext)
  return value;
}