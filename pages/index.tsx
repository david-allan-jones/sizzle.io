import { Layout } from "@/components/Layout"
import Link from "next/link"

export default function IndexPage() {
    return <Layout>
        <p>Welcome to Snapvote!</p>
        <Link href="/polls">Start a new poll</Link>
    </Layout>
}