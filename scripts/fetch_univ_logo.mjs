import https from 'https';

https.get('https://idlib.university/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const imgMatches = [...body.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
    console.log('All images:', imgMatches.slice(0, 10));
  });
}).on('error', e => console.log('Err:', e.message));
