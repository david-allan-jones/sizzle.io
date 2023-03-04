type Props = {
    visible: boolean,
}

export function LoadingAnimation(props: Props) {
    return <p style={{ display: props.visible ? 'inline': 'none' }}>Loading...</p>
}