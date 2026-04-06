'use client';

import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);

export default function App() {
  return (
    // Tailwindで画面全体の中央に配置し、薄いグレーの背景をつけます
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <Authenticator>
        {({ signOut, user }) => (
          // ログイン後の画面もTailwindで綺麗に整えます
          <div className="p-8 text-center bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">ログイン成功！</h1>
            <p className="text-gray-700 mb-6">
              こんにちは、<span className="font-semibold">{user?.signInDetails?.loginId}</span> さん！
            </p>
            <button 
              onClick={signOut} 
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
            >
              サインアウト
            </button>
          </div>
        )}
      </Authenticator>
    </main>
  );
}
