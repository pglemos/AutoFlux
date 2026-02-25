
export const getAllowedOrigins = (env: { APP_URL?: string }) => {
    return [
        'http://localhost:3000',
        env.APP_URL
    ].filter(Boolean) as string[];
}

export const getCorsHeaders = (origin: string | null, allowedOrigins: string[]) => {
    if (origin && allowedOrigins.includes(origin)) {
        return {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        }
    }
    return {
        'Access-Control-Allow-Origin': 'null',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }
}
