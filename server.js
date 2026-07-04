import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.get(['/experience', '/experience/:id', '/experience.html'], async (req, res, next) => {
    const id = req.params.id || req.query.id;
    if (!id) {
        return next();
    }

    try {
        let html = fs.readFileSync(path.join(__dirname, 'dist', 'experience.html'), 'utf-8');

        const projectId = 'submit-a';
        let url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/retreats/${id}`;
        
        let response = await fetch(url);
        let data = null;

        if (response.ok) {
            data = await response.json();
        } else {
            // Fallback: Try fetching by slug if document ID doesn't exist
            const queryUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;
            const queryBody = {
                structuredQuery: {
                    from: [{ collectionId: "retreats" }],
                    where: {
                        fieldFilter: {
                            field: { fieldPath: "slug" },
                            op: "EQUAL",
                            value: { stringValue: id }
                        }
                    },
                    limit: 1
                }
            };
            
            const queryResponse = await fetch(queryUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(queryBody)
            });
            
            if (queryResponse.ok) {
                const queryData = await queryResponse.json();
                if (queryData && queryData.length > 0 && queryData[0].document) {
                    data = queryData[0].document;
                }
            }
        }

        if (data) {
            const fields = data.fields;
            
            if (fields) {
                const name = (fields.retreatName?.stringValue || fields.Name?.stringValue || 'Experience Details').replace(/"/g, '&quot;');
                const city = fields.City?.stringValue || fields.city?.stringValue || '';
                const state = fields.State?.stringValue || fields.state?.stringValue || '';
                let location = `${city}${city && state ? ', ' : ''}${state}`;
                if (location) location += ', India';
                else location = 'India';
                
                const description = (fields.description?.stringValue || fields.ShortDescription?.stringValue || `Discover ${name} at ${location}.`).replace(/"/g, '&quot;');
                
                let imageUrl = 'https://firebasestorage.googleapis.com/v0/b/submit-a.firebasestorage.app/o/file_00000000644071fa82872ccf94d36b6f.png?alt=media&token=28d7ea2e-7eb8-486f-aa51-3a6d8a438eb1';
                if (fields.fileUrls?.arrayValue?.values && fields.fileUrls.arrayValue.values.length > 0) {
                    imageUrl = fields.fileUrls.arrayValue.values[0].stringValue.replace(/"/g, '&quot;');
                } else if (fields.Media?.arrayValue?.values && fields.Media.arrayValue.values.length > 0) {
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
                
                const startDate = fields.startDate?.stringValue || '';
                const endDate = fields.endDate?.stringValue || '';
                
                const eventSchema = {
                    "@context": "https://schema.org",
                    "@type": "Event",
                    "name": name,
                    "description": description,
                    "image": [imageUrl],
                    "eventStatus": "https://schema.org/EventScheduled",
                    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
                    "location": {
                        "@type": "Place",
                        "name": location,
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": city,
                            "addressRegion": state,
                            "addressCountry": "IN"
                        }
                    }
                };
                
                if (startDate) eventSchema.startDate = startDate;
                if (endDate) eventSchema.endDate = endDate;

                const schemaScript = `\n    <script type="application/ld+json">\n${JSON.stringify(eventSchema, null, 4)}\n    </script>\n`;

                html = html.replace('</head>', `${twitterCard}${schemaScript}</head>`);
            }
        }
        
        res.send(html);
    } catch (err) {
        console.error('Error fetching dynamic meta:', err);
        next();
    }
});

app.use(express.static(path.join(__dirname, 'dist'), { extensions: ['html'] }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Production server running on port ${port}`);
});
