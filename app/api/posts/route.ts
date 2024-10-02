
interface Post {
  id: number;
  title: string;
  content: string;
}

export async function GET(request: Request) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string || 'http://147.182.223.147:8000';
    const endpoint = '/api/posts/posts/';
    const url = `${baseUrl}${endpoint}`;

    // Extract the Authorization header from the incoming request
    const authHeader = request.headers.get('Authorization');
    const accessToken = authHeader ? authHeader.split(' ')[1] : null;

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}` // Use the token passed in the request
      },
    });

    if (!res.ok) {
      const errorResponse = await res.json();
      throw new Error(errorResponse.detail || 'Failed to fetch posts');
    }

    const data: Post[] = await res.json(); // Use Post type for response

    return new Response(JSON.stringify({ data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
