const sql = require('mssql');
const config = require('../server/config.js');

async function getUsers (userid) {
    try {
        let pool = await sql.connect(config.sqldb)
        let result = await pool.request()
        .query`select * from users`;

        sql.close();
        pool.close();
        
        users = result.recordsets[0]

    } catch (err) {
        console.dir('Error on getUsers', err);
        sql.close();
        pool.close();
        // ... error checks
    }
    return users;  
}

async function getProducts(productid){
    try {
        let pool = await sql.connect(config.sqldb)
        let result = await pool.request()
        .input('productid', sql.Int, productid)                            
        .execute('products_sp')
        
        sql.close();
        pool.close();

        //let projects = [];

        products = result.recordsets[0];
        
        return products;

    } catch (err) {
        console.dir(err);
        sql.close();
        pool.close();
        // ... error checks
    }
    
}

async function getProductUsers (productid) {
    try {
        let pool = await sql.connect(config.sqldb)
        let result = await pool.request()
        .query`select u.* from dbo.productusers p join dbo.users u on p.userid = u.userid where productid = ${productid}`;

        sql.close();
        pool.close();
        
        productusers = result.recordsets[0];
    } catch (err) {
        console.log('Error on getProductUsers', err);
        sql.close();
        pool.close();
        // ... error checks
    }
    return productusers;  

}

async function getProjects (productid) {
    try {
        let pool = await sql.connect(config.sqldb)
        let result = await pool.request()
        .input('projectid', sql.Int, productid)                            
        .execute('projects_sp')
        
        sql.close();
        pool.close();
        
        projects = result.recordsets[0]

    } catch (err) {
        console.dir(err);
        sql.close();
        pool.close();
        // ... error checks
    }
    return projects;  
};

module.exports =  {
    getProducts: getProducts,
    getUsers: getUsers,
    getProductUsers: getProductUsers,
    getProjects: getProjects
}