const STRAPI_URL =
  import.meta.env.PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

export async function getTeamMembers() {
  try {
    const response =
      await fetch(
        `${STRAPI_URL}/api/team-members?populate=*`
      );

    const result =
      await response.json();

    return (
      result?.data || []
    );
  } catch (error) {

    console.error(
      "TEAM SERVICE ERROR:",
      error
    );

    return [];
  }
}