import React, { useEffect, useState } from 'react'

function GenericPageContainer({ children }: any) {
    const [bottomNavHeight, setBottomNavHeight] = useState(0);

    useEffect(() => {
        const bottomNavElement = document.querySelector('div.bottom-navigation-bar');
        if (bottomNavElement) {
            const height = bottomNavElement.clientHeight;
            setBottomNavHeight(height);
        }
    }, []);

    return (
        <div style={{
            paddingBottom: bottomNavHeight,
            width: "100%",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {children}
        </div>
    )
}

export default GenericPageContainer