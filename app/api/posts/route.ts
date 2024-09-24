// Define the type for the Post data
interface Post {
    id: number;
    title: string;
    content: string;
  }
  
  export async function GET() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;
        const endpoint = '/api/posts/posts/';
        const url = `${baseUrl}${endpoint}`;

      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.JWT_TOKEN}`
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
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  