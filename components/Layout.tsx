import Head from 'next/head';
import React from "react";
import styles from '@/styles/Layout.module.css'

export function Layout(props: React.PropsWithChildren) {
    return (
        <div>
            <Head>
                <title>Snapvote</title>
                <meta name="viewport" content="initial-scale=1.0, width=device=width" />
                <link rel="icon" type="image/x-icon" href="images/favicon.ico" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet" />
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
                            <a href="https://github.com/david-allan-jones/snapvote">Source Code</a>
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