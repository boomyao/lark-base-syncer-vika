import { NextResponse, NextRequest } from 'next/server'
import crypto from 'crypto';

const secretKey = process.env.VTOKEN;
 
export function middleware(request: NextRequest) {
  const isValid = validateSignature(request);
  if (!isValid) {
    return new NextResponse('Unauthorized', {
      status: 401,
    });
  }
}
 
export const config = {
  matcher: '/api/:path*',
}

function validateSignature(req: NextRequest) {
  const body = req.body;
  const headers = req.headers;
  const nonce = headers.get('x-base-request-nonce');
  const timestamp = headers.get('x-base-request-timestamp');
  const sig = headers.get('x-base-signature');

  if (!nonce || !timestamp || !sig) {
    return false;
  }
  
  const str = timestamp + nonce + secretKey + JSON.stringify(body);
  const sha1 = crypto.createHash('sha1');
  sha1.update(str);  
  const encryptedStr = sha1.digest('hex');
  const isValid = encryptedStr === sig;
  return isValid;
}