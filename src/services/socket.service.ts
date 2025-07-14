import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(token: string): Promise<Socket> {
    return new Promise((resolve, reject) => {
      try {
        console.log('Connecting to socket server:', import.meta.env.VITE_API_SECRET);
        
        const userType = localStorage.getItem('userType') || 'student';
        console.log('Connecting with userType:', userType);
        
        this.socket = io(import.meta.env.VITE_API_SECRET, {
          auth: { 
            token,
            userType 
          },
          transports: ['websocket', 'polling'],
          path: '/socket.io',
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
          console.log('Socket connected successfully');
          resolve(this.socket!);
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          reject(error);
        });

        this.socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
        });

      } catch (error) {
        console.error('Socket initialization error:', error);
        reject(error);
      }
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public on(event: string, callback: (...args: any[]) => void): void {
    if (!this.socket) {
      console.warn('Socket not connected');
      return;
    }
    this.socket.on(event, callback);
  }

  public emit(event: string, data: any, callback?: (...args: any[]) => void): void {
    if (!this.socket) {
      console.warn('Socket not connected');
      return;
    }
    if (callback) {
      this.socket.emit(event, data, callback);
    } else {
      this.socket.emit(event, data);
    }
  }

  public removeListener(event: string, callback?: (...args: any[]) => void): void {
    if (!this.socket) return;
    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }
}

export default SocketService.getInstance(); 