const path = require('path');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('postal.db');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(session({
    secret : 'secret key',
    resave :false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 1000
    }
}));



app.get('/',(req, res) => {
    res.render('index');
});

app.get('/login',(req, res) => {
    if(req.session.username){
       res.render('search',{
        user: { uname: req.session.username},
       }); 
    } else {
        res.render('login');
    }
});


app.post('/login',(req, res) => {
    const { username, password } =req.body;
    if(username === 'user' && password === 'password'){
        req.session.username = username;
        res.render('search');
    } else {
        res.send('Login failed');
    }
});


app.post('/search', (req,res) => {
    var postalcode = req.body.postalcode;
    db.get('SELECT * FROM postalcode WHERE code = ?', [postalcode], (err, row) => {
        if(row){
            console.log(row.code,row.prefecture, row.city, row.address);
            res.json({
                prefecture: row.prefecture,
                city: row.city,
                address: row.address
            })
        } else {
            res.json({
                error: '入力した郵便番号は見つかりませんでした。正しい番号を入力して下さい。'
            })
        }
    });
})

app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(3000, () => {
    console.log('Server is runnig on port 3000');
});