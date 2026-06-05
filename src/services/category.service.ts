export async function getCategories() {
  const res = await fetch(
    `${import.meta.env.PUBLIC_STRAPI_URL}/api/categories`
  );

  const data = await res.json();

  return data.data;
}