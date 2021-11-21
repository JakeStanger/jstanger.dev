import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  Auth,
} from "firebase/auth";
import Layout from "../layout/Layout";
import React, { useCallback, useEffect, useState } from "react";
import '../../lib/firebase';

export function useAuth(): [Auth, boolean] {
  const auth = getAuth();

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!auth.currentUser);

    onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
    });
  }, [auth]);

  return [auth, loggedIn];
}

const LoginForm: React.FC = () => {
  const [auth] = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ code: string; message: string }>();

  const onEmailChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(ev.target.value);
    },
    []
  );

  const onPasswordChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(ev.target.value);
    },
    []
  );

  const onLogin = useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password).catch(setError);
      setLoading(false);
    },
    [auth, email, password]
  );

  return (
    <Layout title={"Sign in"} maxWidth={500}>
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onLogin}
      >
        <label htmlFor={"email"}>Email</label>
        <input
          type={"email"}
          name={"email"}
          value={email}
          onChange={onEmailChange}
        />
        <label htmlFor={"password"}>Password</label>
        <input
          type={"password"}
          name={"password"}
          value={password}
          onChange={onPasswordChange}
        />
        <button style={{ marginTop: 20, marginBottom: 20 }} type={"submit"}>
          Sign in
        </button>
        {error && <div>{error.code}</div>}
        {loading && <div>Loading...</div>}
      </form>
    </Layout>
  );
};

export default LoginForm;
