//1. define types
//2. define relationships between types
//3. define root queries

const graphql = require('graphql');
const sql = require('mssql');
const config = require('../server/config.js');
let projects= [];
let products = [];
//destructure
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLID,
    GraphQLNonNull
} = graphql;

//project type
const ProjectType = new GraphQLObjectType({
    name: 'Projects',
    fields:() => ({
        projectid: {type: GraphQLID},
        projectname: {type:GraphQLString}
    })
});

const ProductType = new GraphQLObjectType({
    name: 'Products',
    fields:() => ({
        productid: {type: GraphQLID},
        productname: {type:GraphQLString}
    })
});

async function getProducts (productid) {
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
    
};

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

//root query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        //name of the query is project
        project:{
            type:ProjectType,
            //args = parameters sent by use to query. comes down pipeline as string?
            args:{
                    projectid:{type:GraphQLInt}
                 },
            //resolve: this is where we get data from db/other source.     
            resolve(parentValue, args){   

                projects = getProjects(args.projectid);                  
            }
        } ,
        projects:{
            type: new GraphQLList(ProjectType),
            args:{
                projectid:{type:GraphQLInt}
                },
            resolve(parentValue, args){
                projects = getProjects(args.projectid);  

                return projects;
            }
        },
        products:{
            type: new GraphQLList(ProductType),
            args:{
                productid:{type:GraphQLInt}
                },            
            resolve(parentValue, args){  
                products = getProducts(args.productid);  

                return products;                      
            }
        }            
    }

});

module.exports = new  GraphQLSchema({
    query: RootQuery
});