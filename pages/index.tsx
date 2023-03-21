import { Layout } from "@/components/Layout"
import Link from "next/link"
import styles from '@/styles/Home.module.css'

export default function IndexPage() {
    return <Layout>
        <div className={`${styles.container} darkgray-bg`}>
            <p className={styles.noMargin}>Welcome to</p>
            <p className={styles.snapvote}>Snapvote!</p>
            <Link className={styles.link} href="/polls">
                <div className={styles.primaryBtn}>
                    Start a new poll
                </div>
            </Link>
        </div>
    </Layout>
}