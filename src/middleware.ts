import { NextResponse, NextRequest } from 'next/server'

const secretKey = process.env.VTOKEN;
 
export async function middleware(request: NextRequest) {
  const isValid = await validateSignature(request);
  if (!isValid) {
    return new NextResponse('Unauthorized', {
      status: 401,
    });
  }
}
 
export const config = {
  matcher: '/api/:path*',
}

async function validateSignature(req: NextRequest) {
  const body = req.body;
  const headers = req.headers;
  const nonce = headers.get('x-base-request-nonce');
  const timestamp = headers.get('x-base-request-timestamp');
  const sig = headers.get('x-base-signature');

  if (!nonce || !timestamp || !sig) {
    return false;
  }
  
  const str = timestamp + nonce + secretKey + JSON.stringify(body);

  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const encryptedStr = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  const isValid = encryptedStr === sig;
  return isValid;
}