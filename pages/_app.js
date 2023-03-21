import '@/styles/globals.css'
import "react-datepicker/dist/react-datepicker.css";
import { Poppins } from 'next/font/google'

const poppins = Poppins({
    weight: '800',
    subsets: ['latin'],
})

export default function MyApp({ Component, pageProps }) {
    return <main className={poppins.className}>
        <Component {...pageProps} />
    </main>
}