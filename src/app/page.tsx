import styles from "./page.module.css";
import dynamic from "next/dynamic";
const DynamicBraze = dynamic(() => import("./braze"), { ssr: false });

export default function Home() {
  return (
    <main className={styles.main}>
      <DynamicBraze />
    </main>
  );
}
