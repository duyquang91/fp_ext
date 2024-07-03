import parseCookies, { update } from '../utils/cookiePaser'

describe('Cookie tests', () => {
  it('Test update new cookie to old cookie', () => {
    const oldCookie = 'token=1234; refresh_token=5678'
    const newCookie = 'token=steve; Path=/;, other=test; Path=/'

    expect(update(parseCookies(newCookie), oldCookie) === 'token=steve; refresh_token=5678')
  })
})
