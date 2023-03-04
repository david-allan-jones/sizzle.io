import { Footer } from "./Footer";
import { Header } from "./Header";

export function Layout(props: React.PropsWithChildren) {
    return <div>
        <Header />
        <section>
            {props.children}
        </section>
        <Footer />
    </div>
}