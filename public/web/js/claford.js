document.addEventListener('DOMContentLoaded', function() {

    function fetchCategories() {

    }

    const categories = new HomePageRender();

    categories.FetchApiData(
            '/api/v1/categories', {
                method: 'GET',
            })
        .then(resp => resp.json())
        .then(data => {
            // alert();
            console.log('---------data---------');
            console.log(data.data);
            console.log(data.data[0].image);
            document.querySelector('h4#change').textContent = data.data[0].image;
            console.log('---------data---------');
        });
    // document.querySelector('h4#change').textContent = 'jensy santana';


});