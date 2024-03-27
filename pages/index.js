import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import "react-awesome-slider/dist/captioned.css";
import styles from '../styles/Home.module.css';
import fs from 'fs';

const buttonStyle = {
    padding: "15px",
    borderRadius: "50%",
    background: "red",
    opacity: 0.7,
    fontSize: "20px"
};

const headerStyle = {
    color: 'white',
    position: "absolute",
    zIndex: 4,
    top: '30%',
    left: '40%'
};

const contentStyle = {
    color: 'white',
    textAlign: "center",
    top: '50%',
    left: '25%',
    position: "absolute",
    zIndex: 4
};

const ownerStyle = {
    color: 'white',
    textAlign: "center",
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 4
};

const bgImg = {
    position: "fixed",
    zIndex: 3,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%"
};

const animalContainerStyle = {
    position: "relative",
    margin: "20px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f5f5f5",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
};

const animalImageStyle = {
    width: "100%",
    height: "auto",
    borderRadius: "10px"
};

const animalTitleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px"
};

const animalContentStyle = {
    fontSize: "16px"
};

function Animal(props) {
    if (!props.data) return <p>Loading</p>;
    const { header, content, img, owner, email } = props.data;

    const handleEmailClick = () => {
        window.location.href = `mailto:${email}`;
    };

    return (
        <div style={animalContainerStyle}>
            <h1 style={headerStyle}>{header}</h1>
            <img
                style={animalImageStyle}
                alt={header}
                src={img}
            />
            <div style={contentStyle}>
                <h2 style={animalTitleStyle}>{header}</h2>
                <p style={animalContentStyle}>{content}</p>


            </div>
        </div>
    );
}

function Location(props) {
    if (!props.data) return <p>Loading</p>;
    const { address, name, animals, contact } = props.data;

    return (
        <div style={animalContainerStyle}>
            <h2 style={animalTitleStyle}>Имя: {name}</h2>
            <p style={animalContentStyle}>Адресс: {address}</p>
            <p style={animalContentStyle}>Кличка питомца: {animals}</p>
            <p style={animalContentStyle}>Контакты: {contact}</p>
        </div>
    );
}

export default function Home({ animals, locations, error }) {
    const [errorMessage, setErrorMessage] = useState(error ? 'Ошибка загрузки файла JSON' : null);

    React.useEffect(() => {
        let user = localStorage.getItem('user');
        if (user === null) {
            while (user === null) {
                user = prompt("Введите ваше имя пользователя");
                if (!user) {
                    alert('Обязательно!');
                }
                else {
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
                <AwesomeSlider style={{ "--slider-height-percentage": "100%" }}>
                    {
                        animals.map((data, i) => <div key={i} style={{ zIndex: 2 }}>
                            <Animal data={data} />
                        </div>)
                    }
                </AwesomeSlider>
                <div>
                    {locations.map((data, i) => <Location key={i} data={data} />)}
                </div>
            </main>

            <footer className={styles.footer}>
                Petto, (c) 2022
            </footer>
        </div>
    )
}

export async function getServerSideProps() {
    try {
        const animalsFilePath = 'public/animals.json';
        const locationsFilePath = 'public/location.json';

        if (!fs.existsSync(animalsFilePath) || !fs.existsSync(locationsFilePath)) {
            throw new Error('JSON файлы не найдены');
        }

        const animalsFileContent = fs.readFileSync(animalsFilePath, 'utf8');
        const locationsFileContent = fs.readFileSync(locationsFilePath, 'utf8');

        const animals = JSON.parse(animalsFileContent);
        const locations = JSON.parse(locationsFileContent);

        return {
            props: { animals, locations }
        };
    } catch (error) {
        console.error('Ошибка чтения файла:', error.message);
        return {
            props: { animals: [], locations: [], error: true } // Pass error flag to the component
        };
    }
}
