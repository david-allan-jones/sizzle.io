import Head from 'next/head';
import React from "react";
import styles from '@/styles/Layout.module.css'
import { useTranslation } from 'next-i18next'

export function Layout(props: React.PropsWithChildren) {
    const { t } = useTranslation('common')

    return (
        <div className={styles.layoutWrapper}>
            <Head>
                <title>{t('common.sizzle')}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device=width" />
                <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
            </Head>
            <section className={styles.contentWrapper}> 
                {props.children}
            </section>
            <footer className={styles.footer}>
                <div className={styles.flexContainer}>
                    <div className={styles.flexItem}>
                        <p>{t('common.author')}</p>
                        <p>{t('common.authorName')}</p>
                    </div>
                    <div className={styles.flexItem}>
                        <p>{t('common.links')}</p>
                        <div>
                            <a href="https://github.com/david-allan-jones/sizzle.io">{t('common.sourceCode')}</a>
                        </div>
                        <div>
                            <a href="https://davidjonesdev.com/contact">{t('common.contactAuthor')}</a>
                        </div>
                    </div>
                </div>        
            </footer>
        </div>
    );
}