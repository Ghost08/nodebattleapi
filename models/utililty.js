'use strict';

function utility() {

    utility.prototype.fnDistinct = function (sourceArray, parameter) {
        let tempDistinct = [...new Set(sourceArray.map(obj => obj[parameter]))];
        return tempDistinct.filter(obj => obj != null && obj != "");
    }

    utility.prototype.fnSortandCount = function (sourceArray, parameter, sortOrder) {
        let stats = [];

        //distinct items
        let params = this.fnDistinct(sourceArray, parameter); //[...new Set(sourceArray.map(obj => obj[parameter]))];

        //calculate battle count
        params.forEach(function (obj) {
            let tempstats = {
                "source": obj.length == "" ? "NA" : obj,
                "count": sourceArray.filter(f => f[parameter] == obj).length
            }
            stats.push(tempstats);
        });

        if (sortOrder == "DESC") {
            //order by desc
            return stats.sort((a, b) => a.count < b.count ? 1 : a.count > b.count ? -1 : 0);
        }

        return stats.sort((a, b) => a.count < b.count ? -1 : a.count > b.count ? 1 : 0);
    }

    utility.prototype.validateEmail = function (email) {
        if (!email) return false;

        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    utility.prototype.isNullOrEmpty = function (value) {

        if (value == null || value == "") {
            return false;
        };

        if (value.replace(/\s/g, '').length == 0) {
            return false;
        }

        return true;

    }

}


module.exports = utility;