const path = require('path')
const express = require('express')
const hbs = require('hbs');
const geocode = require('./utils/geocode')
const forecast = require('./utils/prediksiCuaca')

const app = express()
const port = process.env.PORT || 4000
//Medefinisikan jalur/path untuk konfigurasi express
const direktoriPublic = path.join(__dirname, '../public')
const direktoriViews = path.join(__dirname, '../templates/views')
const direktoriPartials = path.join(__dirname, '../templates/partials')

// Setup handlebars engine dan lokasi folder views
app.set('view engine', 'hbs')
app.set('views', direktoriViews)
hbs.registerPartials(direktoriPartials)

//Setup direktori statis
app.use(express.static(direktoriPublic))

//ini halaman utama
app.get('', (req, res) => {
    res.render('index', {
        judul: 'Aplikasi Cek Cuaca',
        nama: 'Fachri Rizal' 
    }) 
})

//halaman FAQ
app.get('/bantuan', (req, res) => {
    res.render('bantuan', {
        judul           : 'Bantuan',
        nama            : 'Fachri Rizal',
        teksBantuan     : 'ini adalah teks bantuan',
        faq1 : "Q: Halaman ini digunakan untuk apa?",
        faq2 : "Q: Apa itu API?",
        faq3 : "Q: API apa yang digunakan dalam aplikasi ini? b b",
        faq4 : "Q: Salah satu pola arsitektur API (SOAP, RESTful, GraphQL, gRPC)"
    })
}) 

//halaman infocuaca
app.get('/infocuaca', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: ' Kamu harus memasukan lokasi yang ingin dicari'
        })
    }
        geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
            if (error){
                return res.send({error})
            }
            forecast(latitude, longitude, (error, dataPrediksi) => {
                if (error){
                    return res.send({error})
                }
            res.send({
                prediksiCuaca: dataPrediksi,
                lokasi: location,
                address: req.query.address
            })
        })
    })
})
        

//ini halaman tentang
app.get('/tentang', (req, res) => {
    res.render('tentang', {
        judul : 'Tentang Saya',
        nama : 'Fachri Rizal'
    })
})

app.get('/berita', (req, res) => {
    res.render('berita', {
        judul : 'Berita',
        nama : 'Fachri Rizal'
    })
})

app.get('/bantuan/*', (req, res) => {
    res.render('404', {
        judul: '404',
        nama: 'Fachri Rizal',
        teksbantuan: 'ini adalah teks bantuan'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        judul: '404',
        nama : 'Fachri Rizal',
        pesanKesalahan: 'Halaman tidak ditemukan.'
    })
})

app.listen(port, () => {
    console.log('server berjalan pada port '+ port) 
})