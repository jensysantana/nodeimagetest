// const axios = require('axios').default;
// import axios from 'axios'
// import * as FetchDataApi from '../../FetchDataApi';

class HomePageRender {
    // base_url = 'https://jsonplaceholder.typicode.com';

    constructor() {
        // super();
    }

    async FetchApiData(url, obj) {
        const fetchData = new FetchDataApi();
        return await fetchData.fetch(url, obj);
    }


    // async fetchCategories() {
    //     return await fetch('http://localhost:4300/api/v1/categories', {
    //         method: 'GET',
    //     });
    // }


    // getTodos = async() => {
    //     try {
    //         const res = await axios.get(`${BASE_URL}/todos`);

    //         const todos = res.data;

    //         console.log(`GET: Here's the list of todos`, todos);

    //         return todos;
    //     } catch (e) {
    //         console.error(e);
    //     }
    // };
}