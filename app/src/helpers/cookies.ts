const _OPTIONS = {
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
  secure: true
}

export function getCookie(cookies, name) {
  const data = deserialize(cookies.get('__session'))
  return data[name]
}

export function setCookie(cookies, name, value, isLocalhost) {
  const data = deserialize(cookies.get('__session'))
  data[name] = value
  _OPTIONS.secure = !isLocalhost
  cookies.set('__session', serialize(data), _OPTIONS)
}

export function removeCookie(cookies, name, isLocalhost) {
  const data = deserialize(cookies.get('__session'))
  delete data[name]
  _OPTIONS.secure = !isLocalhost
  cookies.set('__session', serialize(data), _OPTIONS)
}

function serialize(obj) {
  try {
    const str = JSON.stringify(obj, function replacer(k, v) {
      if (typeof v === 'function') {
        return v.toString()
      }
      return v
    })
    return str
  } catch (e) {
    return {}
  }
}

function deserialize(str) {
  try {
    const obj = JSON.parse(str, function reciever(k, v) {
      if (typeof v === 'string' && v.startsWith('function')) {
        return Function.call(this, 'return ' + v)()
      }
      return v
    })
    return obj
  } catch (e) {
    return {}
  }
}
