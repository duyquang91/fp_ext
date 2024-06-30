import { convert } from '../userModel'

const validCookie = ` __cf_bm=frB_AqvRSjGd4FwjWeYrCxPIXiMWRJYresgzLKKE4ho-1719670726-1.0.1.1-rxj82nB1nENeTI0xE0q7QBXgFyZNXijEGHakAUE0q2nEAHfHObcNV0xCGJTZXPCVX16r65aLRGWQGc1YxhdU_dDBwYDVDIIbIonNgPQZKik;hl=en;_pxhd=m6Q0AfQD5l2V4Ct0JjUKKyfCTyIBe2ixdBXoAaZT2UZxTIFC6dJ983QxNbY6F0FKj22Qrkq23BkSyEtKH3O2dQ==:ysg6Ax7LtcPlU661/wytiHmAegK/-tGxTEnftbf/iYrqoRTtmun1PMCacIpWgzqvoFZkllYWuXMciqra7uAMS8d/HTuNLLDQyFpotd8oRs4=; dhhPerseusGuestId=1719492579041.441575462685649667.flalytet15; dhhPerseusSessionId=1719492579041.277342335567010891.dipy3ho3gi; ld_key=1719492579041.441575462685649667.flalytet15; token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImtleW1ha2VyLWNvcnBvcmF0ZS1mcC1zZyIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB3cWp6cXdvMHczNnJiZGY2d21oMTN1eXd5ajF3cW1vMmphZG5kaXEiLCJjbGllbnRfaWQiOiJjb3Jwb3JhdGUiLCJ1c2VyX2lkIjoic2dvYmt6Nm4iLCJleHBpcmVzIjoxNzE5Njc0MzI1LCJ0b2tlbl90eXBlIjoiYmVhcmVyIiwic2NvcGUiOiJBUElfQ1VTVE9NRVIgQVBJX1JFR0lTVEVSRURfQ1VTVE9NRVIifQ.dU0Ec56MTQZNj1GhaOvCctDDslUefMhQbcI6W5nEWDbcdtuRA4xIyiH2LN92UtzVfE2r2Tmb7uJPvfNtiU7IqEjYWeDXuCrwzflj1tfnVEgYqLAQSQ0u-Mr4jFDl9HFJR6xXOxmePUkI-XTCQR56Xstsy4gLDNOyVxaIqLSBvjlLgDre5ebvQxKiB8PwKGHib8XwBiG1y7qbjza4VEX8qhG84QbTqWtnTp9fSbjduh8nPP39sgS2GCRTUg9U2ZPu1DQ3ksUcOmV8VbLmkC_fCsYddAprEFMW0CcwVvmEzOyLjRwwQkdrNKG6tnINTsXl7XwHX2aphIuLydlRqsfm1A; refresh_token=o5uyjuxzd1kpc27vbfzrv0o6z2vksarytn2pkwxr; userSource=corporate; dps-session-id=1.2791138_103.85463374_1719492579041.441575462685649667.flalytet15_1719670726_1719672526

`

describe('Validate InitUser', () => {
  it('Validate init user model', () => {
    expect(() => convert({ name: '', email: 'steve@test.com', cookie: 'wed' })).toThrowError()
    expect(() => convert({ name: 'Steve', email: '', cookie: 'wdewd' })).toThrowError()
    expect(() => convert({ name: 'Steve', email: 'steve@test.com', cookie: '' })).toThrowError()
    expect(() => convert({ name: 'Steve', email: 'steve@test', cookie: 'ADWDW' })).toThrowError()
  })

  it('Validate cookie', () => {
    expect(() => convert({ name: 'Steve', email: 'steve@test.com', cookie: validCookie })).not.toThrowError()
  })
})
