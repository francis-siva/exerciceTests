import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import chaiNock from 'chai-nock';
import chaiAsPromised from 'chai-as-promised';
import path from 'path';
import nock from 'nock';

import server from '../server';
import resetDatabase from '../utils/resetDatabase';

// let assert = require('assert');
let assert = require('chai').assert;

chai.use(chaiHttp);
chai.use(chaiNock);
chai.use(chaiAsPromised);

// tout les packages et fonction nescessaire au test sont importé ici, bon courage

// fait les Tests d'integration en premier
// const _initialStructure = {
//     books: []
// };

describe('Test sur une requête GET /book', () => {
    let initialStructure = {
        books: []
    };
    beforeEach((done) => {
        resetDatabase(path.join(__dirname,'../data/books.json'), initialStructure);
        done();
    });

    it('should return code 200', done => {

        chai
            .request(server)
            .get('/book')
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.books).to.be.a('array');
                done();
            });
    })

    it('should return res.body.books.length', done => {

        chai
            .request(server)
            .get('/book')
            .end((err, res) => {
                if (err) console.log(err); //console.log('VaLuE ::: ' + res.body.books.length);
                expect(res.body.books.length).to.equal(0);
                done();
            });
    })

    /*
    it('should be an object Tested by Assert module', done => {
        
        beforeEach(() => {
            resetDatabase(path.basename('./../data/books.json', initialStructure));
        });

        chai
            .request(server)
            .get('/book')
            .end((err, res) => {
                if (err) console.log(err);

                // console.log('2nd Test => ' + chai.request(server).get('/book'));

                const testContent = chai.request(server).get('/book');
                assert.equal(testContent, 'object');
                done();
            });       
    })*/
});

describe('Test sur une requête POST /book', () => {
    
    let initialStructure = {
        books: []
    };

    beforeEach((done) => {
        resetDatabase(path.join('./../data/books.json'), initialStructure);
        done();
    });

    it('should return code 200', done => {
        chai
            .request(server)
            .post('/book')
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);                
                done();
            });
    })

    it('should return key message => \"book successfully added\"', done => {
        chai
            .request(server)
            .post('/book')
            .end((err, res) => {
                console.log("Here req: /book.. ");
                if (err) console.log(err);
                console.log("Here res.body: ", res.body);
                expect(res.body.message).to.equal("book successfully added");                
                done();
            });
    })

    /** Ajout d'un book avec les parmètres title, years, pages depuis la route /book en POST **/
    it('shoud add a book with full keys', done => {
        chai
        .request(server)
        .post('/book')
        .send({
            "title": "JavaScript pour les Nuls",
            "years": "2016",
            "pages": "511"
        })
        .end((err, res) => {
            if (err) console.log('err (value): ' + err);
            console.log('res (value): ' + res);
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.equal('book successfully added');
            done();
        });
    })
});

describe('Test intégration (Mocked Database)', () => {
    let book = {
        books: [{
            'id': '0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9',
            'title': 'Coco raconte Channel 2',
            'years': 1920,
            'pages': 400
        }]
    }

    beforeEach(() =>{
        resetDatabase(path.normalize(`${__dirname}/../data/books.json`), book);
    })

    /* Update d'élément(pages) de book via requête /PUT et son id */
    it('should update data about a book', done => {
        chai
        .request(server)
            .put('/book/0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
            .send({
                "pages": "93"
            })
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body.message).to.be.a('string');
                expect(res.body.message).to.equal('book successfully updated');
                done();
            })
    })

    /* Récupérer les données à partir de l'id d'un book requête GET */
    it('should retrieve data of a book in function by id', done => {
        chai
            .request(server)
            .get('/book/0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.message).to.equal('book fetched');
                expect(res.body.book).to.be.a('object');
                expect(res.body.book.years).to.be.a('number');
                expect(res.body.book.years).to.equal(1920);
                expect(res.body.book.pages).to.be.a('number');
                expect(res.body.book.pages).to.equal(400);
                expect(res.body.book.title).to.be.a('string');
                expect(res.body.book.title).to.equal('Coco raconte Channel 2');
                done();
            });
    })
})


