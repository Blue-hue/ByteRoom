import { io } from 'socket.io-client';

export const initSocket = async () => {
    const options = {
        transports: ['websocket'],
        reconnectionAttempts: 5,
        'force new connection': true,
        timeout: 10000,
    };
    return io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000', options);
}