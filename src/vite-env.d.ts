/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_CLIENT_ID: string;
  readonly VITE_CLIENT_SECRET: string;
  readonly VITE_SCOPE: string;
  readonly VITE_STATE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
