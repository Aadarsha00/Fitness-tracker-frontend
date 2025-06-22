"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "@/context/auth.context";
interface IProps {
  children: React.ReactNode;
}
const queryClient = new QueryClient();
const Provider: React.FC<IProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <>{children}</>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default Provider;
