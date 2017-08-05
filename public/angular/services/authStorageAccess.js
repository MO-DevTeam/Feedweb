function authStorageAccess() {
    /*
     * setData converts the given data into json string,
     * and stores in the sessionStorage with the key.
     */
    
    this.setData = function(key, value) {
        if (typeof(Storage) !== "undefined") {
        	var str = '';
            if(value.length === 0)
                sessionStorage.removeItem(key);
    		else{
                str = JSON.stringify(value);
                sessionStorage.setItem(key, str);
            }
        }
    };
    /*
     * getData gets the string and decrypts if needed, and returns the object.
     */
    this.getData = function(key) {
        if (typeof(Storage) !== "undefined") {
        	var str = sessionStorage.getItem(key);
        	if(str){
	        	return JSON.parse(str);
        	}
        	return '';
        }
        return null;
    }
}

angular.module('myApp').service('authStorageAccess', authStorageAccess);
