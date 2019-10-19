export type TLogLevel = 'info' | 'debug' | 'warn' | 'error' | 'log';

export function isEnabled(msgLevel: TLogLevel, configLevel: TLogLevel) {
    return convertLevel(msgLevel) >= convertLevel(configLevel);
}

function convertLevel(logLevel: TLogLevel) {
    switch (logLevel) {
        case 'debug':
            return 0;
        case 'info':
            return 1;
        case 'log':
            return 2;
        case 'warn':
            return 3;
        case 'error':
            return 4;
    }
}