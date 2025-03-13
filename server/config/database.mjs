import { readFileSync } from 'fs';
import path from 'path';

// Citește fișierul `config.json` și parsează-l într-un obiect JavaScript
const config = JSON.parse(readFileSync(path.resolve('config', 'config.json')));

// Exportă configurațiile pentru a fi folosite în alte fișiere
export default config;
