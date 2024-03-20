'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body>
                <div
                    style={{
                        width: '100%',
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'centers',
                        gap: '30px',
                        backgroundColor: '#000',
                    }}
                >
                    <h2 style={{ color: '#FFF' }}>Something went wrong!</h2>
                    <button
                        onClick={() => reset()}
                        style={{
                            height: '50px',
                            maxWidth: '120px',
                            backgroundColor: '378CE7',
                            color: '#FFF',
                            padding: '4px 8px',
                        }}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    )
}
