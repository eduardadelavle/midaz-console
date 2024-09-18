import { headers } from 'next/headers'

export function _getAcceptLanguage(header: string | null) {
  // Split locales by comma
  let locales = header?.split(',')

  // Discart quality parameters
  return locales?.map((l) => l.split(';')[0])
}

export function getAcceptLanguage() {
  return _getAcceptLanguage(headers().get('Accept-Language'))
}
