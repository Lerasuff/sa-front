const domain = 'http://192.168.0.121'

export const configs = {
    ports: {
        ssoApp: `${domain}:8002/sso`,
        gameNodeApp: `${domain}:8001/game`,
        attach: `${domain}:8003/attach`,
        user: `${domain}:8004/user`,
        cardApp: `${domain}:8005/card`
    }
}

export const BASE_URL = domain;
export const GAME_SERVER = configs.ports.gameNodeApp;
export const CONNECTION_TIMEOUT = 360000;