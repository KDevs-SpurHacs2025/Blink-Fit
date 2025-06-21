// src/hooks/useGetApi.js
import { useState, useEffect } from "react";
import { getApi } from "../api/getApi";

export function useGetApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getApi(url)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
