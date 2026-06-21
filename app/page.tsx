"use client";

import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import outputs from "../amplify_outputs.json";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

Amplify.configure(outputs);

const queryClient = new QueryClient();

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010";


function UserProfile() {
  const { data: attributes, isLoading } = useQuery({
    queryKey: ["user-attributes"],
    queryFn: async () => {
      const attrs = await fetchUserAttributes();
      return attrs;
    },
  });

  if (isLoading)
    return <span className="animate-pulse text-gray-400">...</span>;

  return (
    <span className="font-semibold text-blue-600">
      {attributes?.nickname || "ニックネーム未設定"}
    </span>
  );
}

function ApiDataFetcher() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["api-data"],
    queryFn: async () => {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      const response = await fetch(`${API_BASE_URL}/api/v1/auth_check`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("api error");
      }
      return response.json();
    },
  });

  if (isLoading)
    return <p className="text-gray-500 font-bold mt-4 animate-pulse">通信中...</p>;
  if (error)
    return <p className="text-red-500 font-bold mt-4">エラー: api側の準備ができていません</p>;

  return (
    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded text-green-800">
      <p>apiデータ: {data.message}</p>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <Authenticator>
          {({ signOut, user }) => (
            <div className="p-8 text-center bg-white shadow-md rounded-lg flex flex-col gap-4">
              <h1 className="text-2xl font-bold">ログイン成功！</h1>
              <p className="text-gray-700">
                こんにちは、
                <UserProfile /> さん！
                <br />
                <span className="text-sm text-gray-400">
                  (ID: {user?.signInDetails?.loginId})
                </span>
              </p>
              <ApiDataFetcher />
              <button
                onClick={signOut}
                className="mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
              >
                サインアウト
              </button>
            </div>
          )}
        </Authenticator>
      </main>
    </QueryClientProvider>
  );
}
