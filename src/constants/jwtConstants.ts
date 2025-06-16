export const JWT = {
    secretKey: process.env.JWT_SECRET_KEY ?? 'secret',
    refreshSecretKey: process.env.JWT_SECRET_REFRESH_KEY ?? 'secret54',

    accessInspireIn: process.env.TOKEN_EXPIRE_TIME ?? '5h',
    refreshInspireIn: process.env.TOKEN_REFRESH_EXPIRE_TIME ?? '48h',

    salt: process.env.CRYPT_SALT ?? 10,
}
