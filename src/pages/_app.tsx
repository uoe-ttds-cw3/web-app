import { FullBleed } from "@/components/ui/FullBleed";
import { Header } from "@/components/ui/Header";
import { PageLayout } from "@/components/ui/PageLayout";
import { Provider } from "@/components/ui/Provider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Header />
      <PageLayout>
        <Component {...pageProps} />;
      </PageLayout>
    </Provider>
  );
}
