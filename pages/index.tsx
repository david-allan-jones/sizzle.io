import { Layout } from "@/components/Layout"
import Link from "next/link"
import styles from '@/styles/Home.module.css'
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function IndexPage() {
    const { t } = useTranslation()

    return <Layout>
        <div className={`${styles.container} darkgray-bg`}>
            <p className={styles.noMargin}>{t('common.welcomeTo')}</p>
            <p className={styles.sizzle}>{t('common.sizzle')}</p>
            <Link className={styles.link} href="/polls">
                <div className={styles.primaryBtn}>
                    {t('common.startNewPoll')}
                </div>
            </Link>
        </div>
    </Layout>
}

export async function getStaticProps(context: { locale: string }) {
    return {
        props: {
            ...(await serverSideTranslations(context.locale, [
                'common',
            ])),
        }
    }
}