module.exports =  {

    
async function getProducts(productid) {
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
}