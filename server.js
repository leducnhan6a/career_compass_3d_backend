import app from './src/app.js';

const PORT = process.env.DEV_APP_PORT;


const server = app.listen(PORT, () => {
    console.log(`Webdev Career Compass 3D start with url http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    server.close(() => console.log('exit server express'));
    // window.clearInterval()
    // notify.send(ping...)
});
