//md5 battle server
//1. install express

const express = require('express');
const app = express();
const port = 3000;

//make server using express
app.get('/', (req, res) => {
    //send html file to client
    res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

//body-parser
const bodyParser = require('body-parser');
app.use(express.urlencoded({ extended: false }));

//md5 function
const crypto = require('crypto');
function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

//fight function
function fight(stats1, stats2) {
    let hp1 = stats1.hp;
    let hp2 = stats2.hp;
    let atk1 = stats1.atk;
    let atk2 = stats2.atk;
    let def1 = stats1.def;
    let def2 = stats2.def;
    let spd1 = stats1.spd;
    let spd2 = stats2.spd;
    let turn = 0;
    let winner = 0;
    while (hp1 > 0 && hp2 > 0) {
        if (turn % 2 == 0) {
            hp2 -= Math.max(atk1 - def2, 0);
        } else {
            hp1 -= Math.max(atk2 - def1, 0);
        }
        turn++;
    }
    if (hp1 > 0) {
        winner = 1;
    } else {
        winner = 2;
    }
    return winner;
}


//post
app.post('/result', (req, res) => {
    const { name1, name2 } = req.body;
    const hash1 = md5(name1);
    const hash2 = md5(name2);
    console.log(hash1, hash2);
    const stats1 = {
        //set stats by hash
        hp: parseInt(hash1.substr(0, 2), 16),
        attack: parseInt(hash1.substr(2, 2), 16),
        defense: parseInt(hash1.substr(4, 2), 16),
        speed: parseInt(hash1.substr(6, 2), 16),
        luck: parseInt(hash1.substr(8, 2), 16),
        ability: parseInt(hash1.substr(10, 1), 16),
    };
    const stats2 = {
        //set stats by hash
        hp: parseInt(hash2.substr(0, 2), 16),
        attack: parseInt(hash2.substr(2, 2), 16),
        defense: parseInt(hash2.substr(4, 2), 16),
        speed: parseInt(hash2.substr(6, 2), 16),
        luck: parseInt(hash2.substr(8, 2), 16),
        ability: parseInt(hash2.substr(10, 1), 16),
    };
    const result = {
        //set result
        stats1,
        stats2,
        winner: fight(stats1, stats2),
    };
    res.send(result);
});
