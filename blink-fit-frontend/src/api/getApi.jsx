export async function getApi(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("API Error");
  return response.json();
}
