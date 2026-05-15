"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";

import { io, Socket } from "socket.io-client";

const SocketContext =
  createContext<Socket | null>(
    null
  );

export const useSocket = () => {
  return useContext(SocketContext);
};

type Props = {
  children: ReactNode;
};

export default function SocketProvider({
  children
}: Props) {
  const [socket, setSocket] =
    useState<Socket | null>(
      null
    );

  useEffect(() => {
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL;

    if (!socketUrl) {
      return;
    }

    const socketInstance = io(socketUrl, {
      withCredentials: true
    });

    socketInstance.on("connect", () => {
      setSocket(socketInstance);
    });

    socketInstance.on("disconnect", () => {
      setSocket(null);
    });

    return () => {
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={socket}
    >
      {children}
    </SocketContext.Provider>
  );
}
