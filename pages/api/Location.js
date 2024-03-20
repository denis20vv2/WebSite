import fs from 'fs';

export default async (req, res) => {
    try {
        const fileContent = fs.readFileSync('public/location.json', 'utf8');
        const locations = JSON.parse(fileContent);
        res.status(200).json(locations);
    } catch (error) {
        console.error('Ошибка чтения файла:', error);
        res.status(500).json({ error: 'Ошибка чтения файла' });
    }
};
