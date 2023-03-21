import Head from 'next/head';
import React from "react";
import styles from '@/styles/Layout.module.css'

export function Layout(props: React.PropsWithChildren) {
    return (
        <div className={styles.layoutWrapper}>
            <Head>
                <title>Sizzle</title>
                <meta name="viewport" content="initial-scale=1.0, width=device=width" />
                <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
            </Head>
            <section className={styles.contentWrapper}> 
                {props.children}
            </section>
            <footer className={styles.footer}>
                <div className={styles.flexContainer}>
                    <div className={styles.flexItem}>
                        <p>AUTHOR</p>
                        <p>David Jones</p>
                    </div>
                    <div className={styles.flexItem}>
                        <p>LINKS</p>
                        <div>
                            <a href="https://github.com/david-allan-jones/sizzle.io">Source Code</a>
                        </div>
                        <div>
                            <a href="https://davidjonesdev.com/contact">Contact Author</a>
                        </div>
                    </div>
                </div>        
            </footer>
        </div>
    );
}