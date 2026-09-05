"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const AuthProvider = dynamic(
() =>
import("@/context/AuthContext").then(
(module) => module.AuthProvider
),
{
ssr: false,
}
);

interface AuthProviderProps {
children: ReactNode;
}

export default function AuthProviderWrapper({
children,
}: AuthProviderProps) {
return <AuthProvider>{children}</AuthProvider>;
}
