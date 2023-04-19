import '@/styles/globals.css'
import "react-datepicker/dist/react-datepicker.css";
import { Poppins } from 'next/font/google'
import { appWithTranslation } from 'next-i18next';

const poppins = Poppins({
    weight: '800',
    subsets: ['latin'],
})

const MyApp = function({ Component, pageProps }) {
    return <main className={poppins.className}>
        <Component {...pageProps} />
    </main>
}

export default appWithTranslation(MyApp)