import React, { useState } from 'react';
import Head from 'next/head';
import fs from 'fs';

const frameStyle = {
    border: '2px solid black',
    padding: '10px',
    margin: '10px',
};

function sendEmail(email) {
    const body = `Здравствуйте, я нашел вашего питомца.%0A-----------%0AС уважением, ${localStorage.user}`;
    window.open(`mailto:${email}?subject=Потерянный зверь&body=${body}`);
}

function Location(props) {
    if (!props.data) return <p>Loading</p>;
    const { name, address, animal } = props.data;
    return (
        <div style={frameStyle}>
            <h3>Имя: {name}</h3>
            <p>Адрес: {address}</p>
            <p>Животное: {animal}</p>
        </div>
    );
}

export default function Home({ locations, error }) {
    const [errorMessage, setErrorMessage] = useState(error ? 'Ошибка загрузки файла JSON' : null);

    React.useEffect(() => {
        let user = localStorage.getItem('user');
        if (user === null) {
            while (user === null) {
                user = prompt("Введите ваше имя пользователя");
                if (!user) {
                    alert('Обязательно!');
                } else {
                    localStorage.setItem('user', user);
                }
            }
        }
    }, []);

    function logout() {
        localStorage.clear();
        location.reload();
    }

    if (errorMessage) {
        return (
            <div className={styles.container}>
                <Head>
                    <title>Error</title>
                </Head>
                <main className={styles.main}>
                    <h1>Error</h1>
                    <p>{errorMessage}</p>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Petto</title>
                <meta name="description" content="Социальная сеть для питомцев" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <button onClick={logout}>logout</button>
                <h1>Petto</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {locations.map((data, i) => (
                        <div key={i} style={{ zIndex: 2 }} onClick={() => sendEmail(data?.email)}>
                            <Location data={data} />
                        </div>
                    ))}
                </div>
            </main>

            <footer className={styles.footer}>Petto, (c) 2022</footer>
        </div>
    );
}

export async function getServerSideProps() {
    try {
        const filePath = 'public/location.json';
        if (!fs.existsSync(filePath)) {
            throw new Error('JSON файл не найден');
        }
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const locations = JSON.parse(fileContent);
        return {
            props: { locations }
        };
    } catch (error) {
        console.error('Ошибка чтения файла:', error.message);
        return {
            props: { locations: [], error: true } // Pass error flag to the component
        };
    }
}
