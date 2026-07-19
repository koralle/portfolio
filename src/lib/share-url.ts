const productionOrigin = 'https://me.koralle-mgmg.com';

export const getShareUrl = (pathname: string) => new URL(pathname, productionOrigin).toString();
