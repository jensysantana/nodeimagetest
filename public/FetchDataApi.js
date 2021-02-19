// const axios = require('axios').default;
// import axios from 'axios'

class FetchDataApi {
    base_url = 'http://localhost:4300';
    constructor() {

        }
        ///api/v1/categories
    async fetch(url, obj) {
        return await fetch(`${this.base_url}${url}`, {...obj });
        // return await fetch('http://localhost:4300/api/v1/categories', {
        //     method: 'GET',
        // });
    }
}


// module.exports = FetchDataApi;