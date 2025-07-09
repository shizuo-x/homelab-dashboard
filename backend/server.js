const express = require('express');
const cors = require('cors');
const si = require('systeminformation');
const mongoose = require('mongoose');
const http = require('http');
const { WebSocketServer } = require('ws');
const pty = require('node-pty');
const os = require('os');
const axios = require('axios');

const MONGO_URI = 'mongodb://database:27017/homelab';
mongoose.connect(MONGO_URI).then(() => console.log('MongoDB Connected.')).catch(err => console.error('MongoDB Error:', err));

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dashboardRouter = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRouter);

app.get('/api', (req, res) => res.json({ message: "API is working." }));
app.get('/api/remote-system-info', async (req, res) => { /* ... (Unchanged) ... */ const{ip:t}=req.query;if("127.0.0.1"===t||"localhost"===t)try{const[t,e,o,s]=await Promise.all([si.currentLoad(),si.mem(),si.time(),si.osInfo()]);return res.json({status:"Online",uptime:formatUptime(o.uptime),cpu:Math.round(t.currentLoad),ram:Math.round(e.active/e.total*100)})}catch(t){return res.status(500).json({error:"Failed to get local stats"})}else return res.json({status:"Offline",uptime:"0d 0h",cpu:0,ram:0})});
app.get('/api/check-status', async (req, res) => { /* ... (Unchanged) ... */ const{url:t}=req.query;if(!t)return res.status(400).json({status:"Invalid URL"});try{await axios.get(t,{timeout:8e3,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}}),res.json({status:"Online"})}catch(e){console.error(`Status check for ${t} failed:`,e.message),res.json({status:"Offline"})} });
function formatUptime(seconds){const d=Math.floor(seconds/(3600*24));seconds%=(3600*24);const h=Math.floor(seconds/3600);return`${d}d ${h}h`}

const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
  console.log('Terminal client connected');
  // --- THIS IS THE FIX FOR THE TERMINAL ERROR ---
  // Alpine linux uses 'sh', not 'bash'.
  const shell = os.platform() === 'win32' ? 'powershell.exe' : 'sh';
  const ptyProcess = pty.spawn(shell, [], { name: 'xterm-color', cols: 80, rows: 30, cwd: process.env.HOME, env: process.env });
  
  ptyProcess.onData((data) => ws.send(data));
  ws.on('message', (message) => ptyProcess.write(message));
  ws.on('close', () => { console.log('Terminal client disconnected'); ptyProcess.kill(); });
  ws.on('error', (err) => { console.error('WebSocket error:', err); ptyProcess.kill(); });
});

server.listen(PORT, () => console.log(`Backend server (HTTP & WebSocket) is running on http://localhost:${PORT}`));