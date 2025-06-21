export async function fetchApi(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error("API Error");
  return response.json();
}
