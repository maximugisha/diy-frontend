interface Profile {
    id: number;
    profile_picture: string;
    biography: string;
    phone_number: number;
    date_of_birth: string;
    interests: string[]; // Array of interests
    first_name: string; 
    username: string;
    last_name: string;
    organization: string;
    email: string;
    role: string;
  }
  
  export async function GET(request: Request) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;
      const endpoint = '/api/account/user-profile/';
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
        throw new Error(errorResponse.detail || 'Failed to fetch profile');
      }
  
      const data: Profile[] = await res.json(); // Use Profile type for response
  
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
  