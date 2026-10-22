import { createClient } from 'npm:@supabase/supabase-js@2';

// Deploy with JWT verification enabled. Never ship service_role to the client.
// CANDLE_APP_ORIGIN is the exact hosted origin, e.g. https://your-domain.example.
Deno.serve(async (request: Request) => {
  const origin = Deno.env.get('CANDLE_APP_ORIGIN');
  const headers = {'Content-Type':'application/json',
    'Access-Control-Allow-Origin':origin || 'null',
    'Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods':'POST, OPTIONS','Vary':'Origin'};
  const respond = (status:number, message:string) => new Response(JSON.stringify({message}),{status,headers});
  if (!origin || (request.headers.get('Origin') && request.headers.get('Origin') !== origin)) return respond(403,'Origin not allowed');
  if (request.method === 'OPTIONS') return new Response(null,{status:204,headers});
  if (request.method !== 'POST') return respond(405,'POST required');
  const authorization=request.headers.get('Authorization')||'';
  if (!authorization.startsWith('Bearer ')) return respond(401,'Sign in required');
  const url=Deno.env.get('SUPABASE_URL'),key=Deno.env.get('SUPABASE_ANON_KEY'),service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url||!key||!service) return respond(503,'Service unavailable');
  const auth=createClient(url,key,{global:{headers:{Authorization:authorization}},auth:{persistSession:false,autoRefreshToken:false}});
  const {data,error}=await auth.auth.getUser();
  if (error||!data.user) return respond(401,'Sign in required');
  const login=Date.parse(data.user.last_sign_in_at||'');
  if (!Number.isFinite(login)||Date.now()-login>10*60*1000||login>Date.now()+30000) return respond(403,'Sign in again before deleting your account');
  const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
  // The user ID is derived from the verified token, never the request body.
  const result=await admin.auth.admin.deleteUser(data.user.id);
  return result.error?respond(503,'Deletion failed; please retry'):respond(200,'Account deleted');
});
