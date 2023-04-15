type Props = {
    children: React.ReactNode
    onClick: () => void
}

export function IconButtonBase(props: Props) {
    return <div
        onClick={props.onClick}
        className="icon-button-container"
    >
        {props.children}
    </div>
}