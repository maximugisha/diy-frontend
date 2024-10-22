
interface Host {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  }
  
  interface Session {
    id: number;
    host: Host;
    channel_name: string;
    start_time: string;
    end_time: string | null;
    is_active: boolean;
  }
  
  export async function GET(request: Request) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;
      const endpoint = '/api/chat/sessions/';
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
        throw new Error(errorResponse.detail || 'Failed to fetch Sessions');
      }
  
      const data: Session[] = await res.json(); // Use Post type for response
  
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
  