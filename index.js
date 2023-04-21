const cors = require("cors");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const moment = require("moment");
const momentz = require("moment-timezone");
const qrcode = require('qrcode');
//const html_to_pdf = require('html-pdf-node');
const html_to_pdf = require('puppeteer-html-pdf');
const fs = require("fs");

require("dotenv").config();

const { MongoClient, ObjectID } = require("mongodb");
const url = "mongodb+srv://wetforest:miguel01a.@cluster0.cxjvi.mongodb.net/Produccion?retryWrites=true&w=majority";
const dbNamemongo = "metaJungle";
const client =  new MongoClient(url);

//-----CONNECTION SETTINGS BUCKET-------------------------------------------------
const { Storage } = require("@google-cloud/storage");

const credentialsBucket = {
    type: "service_account",
    project_id: "hackmonkeys-cms",
    private_key_id: "8f1577ac90bd71b4fa7d2401d91bf041d1ebcc45",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC7CfLv5WGXBMug\njRGeYtt/7cBjm+Z3F4pSSLv3EJ1EC4fAKLd3n0HxOIIp0h0b4Q9GrLnwNF/EMlHJ\n5VsTjkKLCatd8bsozc2SxGx/kULKG9xJKpbFnjrQJft82xJdEjz063tFFEevhGqY\niMUeXepnIOqS7VKL2ihYz6F4x3cC4EnSu8KHQRpgwLAnSGISEqls9xnWy71/Wi9I\nT4rgfsKiLepFegZcfZhQUbT0TrFwC+GxnLmVYTaDGBrsLowaRF43ZKwzzzvWHUvB\nijYbCB/krFBVuCv5jIN5HV6Lb8BSGJ9x7WS4kVOHOZsJ4qo2fhC+DexS1CGPOO7S\nrgtk0PHpAgMBAAECggEAAtWthCPAlSKaOHJy4iji5T8z836FIWhurP0TtjSfAY1A\nLzIex7YW8II3/MzFqqrAScSr479TdTyC/1GVzgfRq9xHZ9rWSJHH7BHEiDFqJviB\nn+1AkDmr8AQnWdbTIix41ohsG5mpVXhnCi1GeYWYXBxEWdo1bk+t3Vy2OIejXtyD\nNSPESOd55Hc8w4yI2idRV2sJWE1A+uwrSf6tPwRoprCBDXhJGHriwfhCOmkpGGcd\nLbYnTlaPtiDeiX8Bqhm+zyTxN8T+MolLEgcFCl8+1ddAAPq/uk2Oamq808GSdCRA\n2ok7joUDLaoz0K5/V1KhVG+NXnnZhPr9j6RnabFOAQKBgQDnt576A/s2yNHwq2fO\nkVoocRYuGZvFggcsgmtI1oDZzC5fplPTOzMHDNySrY7CkRjRwQkaWPjJXOiRD4YE\nRSg3FOkoTwoHl84vrVVjPK35G5IENQ4v6dYOE2EpsFtizoG/ySBIhwAl2twJXge4\n1YdxsLjeCvikNfVbV2u6Orgi6QKBgQDOo7ibPENMs6utLM2X5nvvr8/4mm52XY00\nmninaN1TlEyLFFVp5U6hR9W8O3AYvL64WmwN7/U0NEaxRDGr0vFDMTzbBP92N5w1\n9qwCxYkSNWVW9Tvw1hlf0Y9L/VIKNYFahtJesJ1vOO3HkZ01Vus9zYHz62a8FnE/\n8Iol1tr3AQKBgQDYTw6GQE8z7jYlYC0wpXmvhRn6gQdsUhzWTQ1P2oZASx4DRma8\nKmhRLY1/E6vQL9kmffg8c1AT0bp9KCuoMtL+0HNzoI0xV2IwGbQ7Rnr1r+oYKVsM\nGVMsoqSyYSJ+U17GJUAQ1I2ryOpdiDzXK+YbmKiLB1zjFkfsM+ip2YTpeQKBgQCq\nKlbutzywoFDi5j9UNMChDEYWco4+uSF8TSzIp+mDV1+FNLR15RjQZciUHtpb9KqW\nRBgxjgZ9/AKvHfpNhgOaEqULs9zvrDHemojiK2uKbCBM8Nxwos74gikgKbbyo0cn\nllkNEyJCoj3ll3s/nplQJrk6dgL/JvgR8HLDYGCnAQKBgQCQQdctfSfd+N+Y79j0\nC/lj46/DxkSp+EbsBeTsrJYrLXqltJ3+8jXAJ3YXFYbkcV+3YW6A1CYV194Qu28L\npDQMn8QMM0aFXpWK1hHtW5gWf0GIcI0i66K6NOojwapL8KuyFgStISiYsNXY7uny\njDUccfGDIrCCFx3d9KI8tVN7eQ==\n-----END PRIVATE KEY-----\n",
    client_email: "storage-account@hackmonkeys-cms.iam.gserviceaccount.com",
    client_id: "116896198126540271842",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/storage-account%40hackmonkeys-cms.iam.gserviceaccount.com"
  };

  //CONST
  const URL_PREFIX = "https://storage.googleapis.com/bucket-cms-hackmonkeys";
  const PROJECT_ID = "hackmonkeys-cms";
  const GCP_INSTANCE = `bucket-cms-hackmonkeys`; 

  const googleCloud = new Storage({
    credentials: credentialsBucket,
    projectId: PROJECT_ID,
  });

  const storageRepo = googleCloud.bucket(GCP_INSTANCE);
  const directory = "GenPDF";
  const targetDirectory = directory || "default-repo";
    
//-----Fin connection settings bucket---------------------------------------------

app.use(cors({ origin: true }));
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//LISTENING TO THE SERVER
app.listen(3000, async () => {
  console.log(`Example app listening at http://localhost:3000`)
})

app.post("/", async (req, res) => {

    try {

        let { URL } = req.body;

        let dateCreated = momentz
        .tz("America/Santiago")
        .format("YYYY-MM-DD HH:mm:ss");
        
        console.log("Lo que recibo POST:" + JSON.stringify(req.body));
        
        
        await client.connect();
        const db = client.db(dbNamemongo);
        const collection = db.collection("GenPDF");
        console.log ("Conectado a BD OK");
               
        //----Generacion de PDF-----------------------------------------
        const options = { 
            format: 'A3',
            path: `./tmp/file.pdf` 
        }

        console.log('PDF Creado en local: ' + options.path);

        let data = await html_to_pdf.create(URL, options, {
        }, 
            (err) => {
            if (err) throw err;
            console.log('html_to_pdf error', err);
        });
        
        //Subiendo archivo .pdf al Buffer-------------------------------
        let stream = require('stream');
        let bufferStream = new stream.PassThrough();
        bufferStream.end(Buffer.from(data));
        //---------------------------------------------------------------

        //---Enviando file.pdf a Gogle Storage---------------------------
        const filenamePDF = (`file${moment().valueOf()}.pdf`);

        //Ruta para carpeta del buket
        const file = storageRepo.file(`${targetDirectory}/${filenamePDF}`);
        
        //Pipe the 'bufferStream' into a 'file.createWriteStream' method.
        bufferStream.pipe(file.createWriteStream({
        metadata: {
            contentType: 'application/pdf',
            metadata: {
            custom: 'metadata'
            }
        },
        public: true,
        validation: "md5"
        }))
        .on('error', function(err) {
        console.log(err);
        })
        .on('finish', async function() {
        // The public URL can be used to directly access the file via HTTP, upload correct.
        console.log('Almacenado PDF correctamente en Google Storage');
        });
        
        console.log(`${URL_PREFIX}/${directory}`);
        
        let URL_GST = `${URL_PREFIX}/${directory}/${filenamePDF}`;

        //Insertamos en base de datos 
        
        //let recibo = await EnviaPDFMongo(URL_GST, filenamePDF, URL_COR)

        console.log ('PDF y QR generados correctamente, proceso culminado');

        res.status(200).send({
            status: 200,
            url_pdf: URL_GST,
            message: 'Termino bien'
        });
        //-----Fin generacion PDF-------------------------------------------
        
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error de servidor" });
    }

});

/*
async function EnviaPDFMongo(url, filPDF, urlcorta) {
  await client.connect();
  const db = client.db(dbNamemongo);
  const mongoDB = require('mongodb');
  //const collection = db.collection("GenPDF");
  console.log ("Conectado a BD OK");
  
 //-------DESCARGANDO LA IMAGEN A LOCAL ANTES DE ENVIAR A MONGO----
  
  str= 'AJA';
  return str
}
*/

module.exports = {
  GENPDF: app
};
