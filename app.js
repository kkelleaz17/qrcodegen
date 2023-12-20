const express = require('express');
const app = express();
const port = process.env.port || 3001
const fs = require('fs')  
const qr = require('qr-image'); /// npm install qr-image 
const bodyParser = require('body-parser');
const { randomUUID } = require('crypto');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



  app.set('view engine','ejs')
  app.set('views','./views')


  app.get('/',(req,res)=>{
    res.render('index',{})
  })  

  
app.get('/QrCodes/:id', (req, res) => {
    const Qrid = req.params.id;
    const QRCodePath = `./qrcodes/${Qrid}.png`;
  
    if (fs.existsSync(QRCodePath)) {
      const imageBase64 = fs.readFileSync(QRCodePath, { encoding: 'base64' });
        res.render('view', { imageBase64 });
    } else {
      // Send a 404 error if the file does not exist
      res.status(404).send('Image not found');
    }
  });
  

  app.post('/MakeQrCode',async (req,res)=>{
        // randomUUID
    var Name = randomUUID();
    var url = new URL(req.body.url).href
    var png = qr.image(url);
    var writeStream = fs.createWriteStream(`./qrcodes/${Name}.png`)
    png.pipe(writeStream );

    writeStream.on('finish', ()=>{
        res.redirect(`/QrCodes/${Name}`);
    });
    writeStream.on('error', ()=>{
        res.redirect(`/`);
    });

  })  

  app.listen(port,()=>{
    console.log('Hello from 3000')
  })

   
    // const url = answers.URL;

    // var png = qr.image(url);
    // png.pipe(fs.createWriteStream('Link.png'));

    // fs.writeFile('Link.txt',url,(err)=>{
    //     if(err) throw err;
    // })
 

