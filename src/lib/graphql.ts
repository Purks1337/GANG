export type GraphQLRequestOptions = {
  query: string;
  variables?: Record<string, unknown>;
  headers?: Record<string, string>;
};

export async function executeGraphQL<T = unknown>({ query, variables, headers }: GraphQLRequestOptions): Promise<T> {
  const endpoint = process.env.NEXT_PUBLIC_WP_GRAPHQL_ENDPOINT;
  if (!endpoint) {
    throw new Error("NEXT_PUBLIC_WP_GRAPHQL_ENDPOINT is not set");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GraphQL HTTP ${response.status}: ${text}`);
  }

  const json = (await response.json()) as { data?: T; errors?: Array<{ message: string }>; };

  if (json.errors && json.errors.length > 0) {
    const first = json.errors[0]?.message || "Unknown GraphQL Error";
    throw new Error(`GraphQL Error: ${first}`);
  }

  return json.data as T;
}

export const HEALTH_QUERY = /* GraphQL */ `
  query HealthCheck {
    generalSettings {
      title
      description
    }
  }
`;
