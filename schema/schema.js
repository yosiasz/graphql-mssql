//1. define types
//2. define relationships between types
//3. define root queries

const graphql = require('graphql');

const {getProducts, getUsers, getProjects} = require('../src/queries/queries');
const {ProjectType, UserType, ProductType} = require('../src/types/types');

let projects= [];
let products = [];
let users = [];
let productusers = [];

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
        users:{
            type: new GraphQLList(UserType),
            args:{
                userid:{type:GraphQLInt}
                },            
            resolve(parentValue, args){  
                users = getUsers(args.userid); 
                return users;                      
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