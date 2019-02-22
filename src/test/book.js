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

describe('Test sur une requête GET /book', function() {
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

describe('Test sur une requête POST /book', function () {
    
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
                console.log("Here .. ");
                if (err) console.log(err);
                console.log("Here .. ", res.body);
                expect(res.body.message).to.equal("book successfully added");                
                done();
            });
    })
});