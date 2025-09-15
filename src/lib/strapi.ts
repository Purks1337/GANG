/**
 * Strapi API Client
 *
 * This client is configured to work with Strapi's API, handling authentication
 * via an API token and parsing the specific data structure of Strapi responses.
 */

// Define the shape of a Strapi API response for a single item
export interface StrapiDataItem<T> {
  id: number;
  attributes: T;
}

// Define the shape of a Strapi API response for a collection of items
export interface StrapiCollectionResponse<T> {
  data: StrapiDataItem<T>[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Define the shape of a Strapi API response for a single item (non-collection)
export interface StrapiSingleResponse<T> {
  data: StrapiDataItem<T>;
  meta: object;
}

/**
 * The raw attributes for an image file stored in Strapi.
 */
export interface StrapiImageAttributes {
  url: string;
  width: number;
  height: number;
  alternativeText?: string;
}

/**
 * A helper function to construct the full URL for a Strapi asset.
 * @param relativeUrl The relative URL from the Strapi API (e.g., /uploads/image.jpg)
 * @returns The full URL including the base API URL.
 */
export function getStrapiURL(relativeUrl?: string) {
  const baseUrl = process.env.STRAPI_API_URL || "http://127.0.0.1:1337";
  if (!relativeUrl) {
    return "";
  }
  return `${baseUrl}${relativeUrl}`;
}

/**
 * A generic fetch function for interacting with the Strapi API.
 *
 * @param path The API path to request (e.g., "/api/products").
 * @param options Standard fetch options.
 * @returns The JSON response from the API.
 */
export async function strapiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const apiUrl = process.env.STRAPI_API_URL || "http://127.0.0.1:1337";
  const apiToken = process.env.STRAPI_API_TOKEN;

  if (!apiToken) {
    throw new Error(
      "STRAPI_API_URL and STRAPI_API_TOKEN must be set in env"
    );
  }

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    cache: "no-store", // Ensure fresh data from the CMS
  };

  const mergedOptions: RequestInit = {
    ...defaultOptions,
    ...options,
  };

  const requestUrl = `${apiUrl}${path}`;
  const response = await fetch(requestUrl, mergedOptions);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Strapi API Error: ${response.status} ${response.statusText}`, {
        url: requestUrl,
        body: errorBody
    });
    throw new Error(
      `Strapi API returned an error: ${response.status} ${response.statusText} - ${errorBody}`
    );
  }

  return (await response.json()) as T;
}
