import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.get('/experience.html', async (req, res, next) => {
    const id = req.query.id;
    if (!id) {
        return next();
    }

    try {
        let html = fs.readFileSync(path.join(__dirname, 'dist', 'experience.html'), 'utf-8');

        const projectId = 'submit-a';
        const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/retreats/${id}`;
        
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            const fields = data.fields;
            
            if (fields) {
                const name = (fields.Name?.stringValue || 'Experience Details').replace(/"/g, '&quot;');
                const city = fields.City?.stringValue || '';
                const state = fields.State?.stringValue || '';
                let location = `${city}${city && state ? ', ' : ''}${state}`;
                if (location) location += ', India';
                else location = 'India';
                
                const description = (fields.ShortDescription?.stringValue || `Discover ${name} at ${location}.`).replace(/"/g, '&quot;');
                
                let imageUrl = 'https://experientialholidays.info/assets/share-image.jpg';
                if (fields.Media?.arrayValue?.values && fields.Media.arrayValue.values.length > 0) {
                    imageUrl = fields.Media.arrayValue.values[0].stringValue.replace(/"/g, '&quot;');
                }

                // Replace specific meta tags
                html = html.replace(/<title>.*?<\/title>/, `<title>${name} | Experiential Holidays</title>`);
                html = html.replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${name} | Experiential Holidays">`);
                html = html.replace(/<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${description}">`);
                html = html.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${description}">`);
                html = html.replace(/<meta property="og:image" content=".*?">/, `<meta property="og:image" content="${imageUrl}">`);
                
                // Add twitter card support just before </head>
                const twitterCard = `
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${name} | Experiential Holidays">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${imageUrl}">
`;
                html = html.replace('</head>', `${twitterCard}</head>`);
            }
        }
        
        res.send(html);
    } catch (err) {
        console.error('Error fetching dynamic meta:', err);
        next();
    }
});

app.use(express.static(path.join(__dirname, 'dist')));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Production server running on port ${port}`);
});
