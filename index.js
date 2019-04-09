let express = require('express');
let session = require('express-session');
let md5 = require('md5');
let base64 = require('js-base64');

let app = express();
// express.static()


app.use(session({
    secret: 'wenrj',
    cookie: { maxAge: 60 * 1000 * 0.5 }
}));

let token = makeToken();

app.get('/', (req, res) => {
    req.session.token = token;
    res.writeHead(200, { 'Content-Type': 'text/html;' });
    res.end(`
        <form action="/form" method="post">
            <input name="name" type="text" />
            <input type="hidden" value="${token}"/>
            <input type="submit" />
        </form>
    `);

});

app.post('/form', (req, res) => {
    console.log(req.session.token, req.session.token === token);
    if (req.session.token === token && !!req.session) {
        console.log('提交');
    } else {
        console.log('重复提交');
    }
    token = makeToken();

})
app.listen(3002);



function makeToken() {
    let token = (new Date().getMilliseconds() + ~~(Math.random() * 10000));
    return base64.Base64.encode(md5(token));
}
