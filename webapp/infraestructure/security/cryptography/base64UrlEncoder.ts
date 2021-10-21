import base64url from 'base64url'

import UrlEncoder from '../../../business/security/cryptography/urlEncoder'

export default class Base64UrlEncoder implements UrlEncoder {
  encode (text: string): string {
    return base64url.encode(text)
  }

  decode (encodedText: string): string {
    return base64url.decode(encodedText)
  }
}
