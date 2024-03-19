import fs from 'fs';

export default async (req, res) => {
    try {
        const fileContent = fs.readFileSync('public/animals.json', 'utf8');
        const animals = JSON.parse(fileContent);
        res.status(200).json(animals);
    } catch (error) {
        console.error('Ошибка чтения файла:', error);
        res.status(500).json({ error: 'Ошибка чтения файла' });
    }
};
