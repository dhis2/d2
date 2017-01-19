import dataStore from '../../../src/datastore/DataStore';
import {init} from '../../../src/d2';

describe('Datastore', () => {
    console.log("abc")
    init({baseUrl: 'http://play.dhis2.org/test/api'}).then(d2 => {
        console.log("afs")
        dataStore().open('asf')

    }).catch(err => {
        console.log(err)
    })

})