"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/actions/db";

export default function AuthPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSignup() {
    try{
      console.log("attempting to create user...")
      const loggeduser = db.getLoggedInUser()
      console.log("loggeduser is " + loggeduser)
      db.createUser(username, password)
    }catch{
      setError(error)
    }
    //db.loginUser(username, password)
    //router.push("/"); // or wherever
  }

  function handleLogin() {
    
    //router.push("/");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-neutral-800">
      <main className="w-full max-w-md bg-white dark:bg-neutral-900 p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Log In / Sign Up</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="px-4 py-2 rounded bg-gray-100 dark:bg-neutral-800"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="px-4 py-2 rounded bg-gray-100 dark:bg-neutral-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleLogin}
              className="w-1/2 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
            >
              Log In
            </button>

            <button
              type="button"
              onClick={handleSignup}
              className="w-1/2 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold"
            >
              Sign Up
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
