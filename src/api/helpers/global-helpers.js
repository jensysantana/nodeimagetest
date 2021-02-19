const bcrypt = require('bcryptjs');
const moment = require('moment');
module.exports = class GlobalHelpers {

    async reviewsCalcs(reviews) {

        let newArr = reviews.map(pr => {
            // console.log(pr);
            let resp = pr.reviews;
            // console.log(pr.reviews.length);

            let sumReviews = 0;
            for (const iterator of resp) {
                // console.log('---------pr---------');
                // console.log(iterator.review);
                sumReviews += iterator.review;
                // console.log('---------pr---------');
            }
            pr.reviews = {
                totalReviews: resp.length,
                review: sumReviews / resp.length,
            };
            return pr;
        })

        return newArr;
    }

    async reviewsProccessByObject(reviews) {

        let sumReviews = 0;
        for (const iterator of reviews) {
            sumReviews += iterator.review;
        }
        return {
            totalReviews: reviews.length,
            review: sumReviews / reviews.length,
        };
    }

    async getUrlFromRootSubCategory(menu_items, subcategory) {
        // console.log("getUrlFromRootSubCategory -> subcategory", subcategory)
        // console.log("getUrlFromRootSubCategory -> menu_items", menu_items)
        if (menu_items) {
            let tester = menu_items.find(it => it._id === subcategory)
                // console.log("getUrlFromRootSubCategory -> tester", tester)
            return tester;
        }
        return Promise.reject('Product subCategory not match')
    }
    async getArrayUrlFromRootSubCategory(productSelected) {
        // console.log("getUrlFromRootSubCategory -> subcategory", subcategory)
        // console.log("getUrlFromRootSubCategory -> menu_items", menu_items)
        if (productSelected) {
            for (const iterator of productSelected) {
                iterator.root_subcategory.menu_items = await this.getUrlFromRootSubCategory(iterator.root_subcategory.menu_items, iterator.subcategory)
            }
            return productSelected;
        }
        return Promise.reject('Product subCategory array not match')
    }

    async GenerateStringRandom(lengthString, option) {

        let randomChars = '';
        if (option === 'alphanum') {
            randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        }
        if (option === 'num') {
            randomChars = '0123456789';
        }
        if (option === 'hex') {
            randomChars = "0123456789abcdef";
        }
        let result = '';
        for (let i = 0; i < lengthString; i++) {

            if (option === 'hex') {
                result += randomChars.charAt(Math.floor(Math.random() * 16));
            } else {
                result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
            }
        }
        return result;
    }

    DiffDate(date1, date2, type) {
        let today = moment(date1);
        let dbDate = moment(date2);
        let result = null;
        if (type === 'minute') {
            result = moment.duration(today.diff(dbDate)).asMinutes();
        }
        if (type === 'hours') {
            result = moment.duration(today.diff(dbDate)).asHours();
        }
        if (type === 'days') {
            result = moment.duration(today.diff(dbDate)).asDays();
        }
        if (type === 'weeks') {
            result = moment.duration(today.diff(dbDate)).asWeeks();
        }
        if (type === 'month') {
            result = moment.duration(today.diff(dbDate)).asMonths();
        }
        if (type === 'years') {
            result = moment.duration(today.diff(dbDate)).asYears();
        }
        return result;
    }

    async tokenIsExpired(exp) {
        return moment(exp).isAfter(new Date());
    }

    GRegExp() {
        return {
            email: /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,
            emailOrPhone: /^(?:\d{10}|[\w\.\-]+@[\w\.\-]+\.\w{2,3})$/,
            password: /^(?=.*[a-z\_\.\-])(?=.*[A-Z\_\.\-])(?=.*[0-9])[a-zA-Z0-9\_\.\-]+$/,
            alpha: '^[a-zA-Z]+$',
            alphaNum: '^[a-zA-Z\d]+$',
            alphaSpace: /^[a-zA-Z\s]+$/,
            alphaNumSpace: /^[a-zA-Z\d\s]+$/,
            gender: '^[F|M]+$',
            phoneSpecialChars: '^[0-9\-\(\)]+$',
            phoneNoSpecialChars: '^[0-9]+$',
            dateNoFormated: '/^[a-zA-Z\d\(\)\:\-]+$/', //Fri Jan 17 2020 22:12:27 GMT-0500 (Eastern Standard Time)
            number: /^[\d]+$/,
            isMongoId: /^[a-f\d]{24}$/i,
        }
    }

    async encrypPassword(pass) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(pass, salt);
        if (hashed) {
            return hashed;
        }
    }
    async bcryptCheckUser(userpass, passHash) {
        return await bcrypt.compare(userpass, passHash);
        // if (match) {
        //     return true;
        // }
        // return false;
    }

    async InputTrimer(object) {
        // let newArr = [];
        let newArrObj = {}

        for (const key in object) {

            if (object.hasOwnProperty(key)) {
                let element = object[key];

                if (typeof element === 'string') {
                    element = element.trim();
                }

                Object.assign(newArrObj, {
                    [key]: element
                });
            }
        }
        return newArrObj;
    }

    async dateIsType(exp, type) {
        // let now = moment();
        // exp = moment(exp, 'MM/DD/YYYY ');
        // console.log('------------------');
        // console.log(exp.format('LLL'));
        // console.log('------------------');
        if (type === 'before') {
            return moment(exp).isBefore(new Date());
        }
        if (type === 'same') {
            return moment(exp).isSame(new Date(), 'day');
        }
    }


    getStartOrEndWith(elem, find, startEnd) {
        switch (startEnd) {
            case 'S':
                if (elem.startsWith(find)) {
                    return true;
                }

                break;
            case 'E':
                if (elem.endsWith(find)) {
                    return true;
                }

                break;
            case 'SE':
                if (elem.endsWith(find) || elem.startsWith(find)) {
                    return true;
                }
                break;
        }
    }

    //COOKIES
    async setCookie(cname, cvalue, exdays, path) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();


        // document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        return
    }


    async stringToBase64(str) {
        const buf = Buffer.from(str, 'utf8');
        const encodedData = buf.toString('base64');

        return encodedData;
    }

}