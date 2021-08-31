const db = require('./database');
const express = require('express');
const { query } = require('./database');



const app = express();
const getRandom = (ext) => {return `${Math.floor(Math.random() * 10000)}${ext}`}
const myhost = (req) => { return `http://${req.headers.host}`}
const porta = process.env.PORT || 3000

app.set('json spaces', 4)
app.use(express.json())

app.listen(porta, function(){
    console.log("escutando na porta ", porta)
});

app.get('/getlogins', function(req, res){
    
    getlogins().then((logins)=>{
        console.log(logins)
        res.json(logins);  
    })
})

app.post('/newlogin', function(req, res){
    
    jsonlogin = req.body
    addNewLogin(jsonlogin.login).then((data) =>{
        res.json(data);
    })
})

app.post('/select', function(req, res){
    
    querybody = req.body
    select(querybody.query).then((data) =>{
        res.json(data);
    })

})

app.post('/insert', function(req, res){
    
    

})

async function getlogins() {
    try{
    auth_result = await db.query('select * from logins;');
    console.log('pesquisando dados de login...')
    auth_row_count = await auth_result.rowCount;
    if (auth_row_count == 0) {
        console.log('login não encontrado!')
        return {"sucess": false, "result": 'login não encontrado!'}
    } else {
        console.log('login encontrado!')
        // auth_obj = {
        //     clientID: auth_result.rows[0].clientid,
        //     serverToken: auth_result.rows[0].servertoken,
        //     clientToken: auth_result.rows[0].clienttoken,
        //     encKey: auth_result.rows[0].enckey,
        //     macKey: auth_result.rows[0].mackey
        // }
        return {"sucess" : true, "result": auth_result.rows}
    }
    } catch {
        console.log('criando banco de dados...')
        await db.query('CREATE TABLE logins(clientID text, serverToken text, clientToken text, encKey text, macKey text);');
        return {"sucess": false, "result": 'criando banco de dados'}
    }

}

async function select(querytext){
    try{
        makeSelect = await db.query(querytext);
        console.log('pesquisando...')
        return {"sucess" : true, "result": makeSelect.rows}
    } catch (error) {
        console.log('erro select', error)
        return {"sucess": false, "result": error.message}
    }
}


async function addNewLogin(loginJson) {
    try {
        db.query('INSERT INTO logins VALUES($1,$2,$3,$4,$5);',[loginJson.clientID,loginJson.serverToken,loginJson.clientToken,loginJson.encKey,loginJson.macKey])
        db.query('commit;')
        return {"sucess" : true, "result": 'login adicionado'}
    } catch (error) {
        console.log(error)
        return {"sucess": false, "result": error.message}
    }
    
}
async function insert(querytext) {
    try {
        makeinsert = await db.query(querytext)
        makecommit = await db.query('commit;')
        return {"sucess" : true, "result": makeinsert}
    } catch (error) {
        console.log(error)
        return {"sucess": false, "result": error.message}
    }
    
}