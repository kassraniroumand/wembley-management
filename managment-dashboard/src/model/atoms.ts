import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

interface AuthState {
  roles: string[];
  token: string
  email: string
  username: string
  refreshToken: string;
}

export const authAtom = atomWithStorage<AuthState | null>('auth', null);
export const authLoadingAtom = atom<boolean>(false);

export const roleAtom = atom((get) => {
  const auth = get(authAtom);
  return auth?.roles ?? [];
});

export const tokenAtom = atom((get) => {
  const auth = get(authAtom);
  return auth?.token ?? "";
});

export const refreshTokenAtom = atom((get) => {
  const auth = get(authAtom);
  return auth?.refreshToken ?? "";
});

export const emailAtom = atom((get) => {
  const auth = get(authAtom);
  return auth?.email ?? "";
});

export const usernameAtom = atom((get) => {
  const auth = get(authAtom);
  return auth?.username ?? "";
});
