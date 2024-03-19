import fs from 'fs';

export default async (req, res) => {
    try {
        const fileContent = fs.readFileSync('public/location', 'utf8');

        res.status(200).json(animals);
    } catch (error) {
        console.error('Ошибка чтения файла:', error);
        res.status(500).json({ error: 'Ошибка чтения файла' });
    }
};
