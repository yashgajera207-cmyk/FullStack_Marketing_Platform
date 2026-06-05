export async function getBlogs() {
  const res = await fetch(
    `${import.meta.env.PUBLIC_STRAPI_URL}/api/blogs?populate=*`
  );

  const data = await res.json();

  return data.data;
}