
const graphql = require('graphql');
const { getProductUsers} = require('../queries/queries');


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
        productname: {type:GraphQLString},
        productusers: {
            type: new GraphQLList(UserType),
            resolve: (parent, args) => getProductUsers(parent.productid)
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'Users',
    fields:() => ({
        userid: {type: GraphQLID},
        username: {type:GraphQLString}
    })
});

module.exports =  {
    UserType: UserType,
    ProjectType: ProjectType,
    ProductType: ProductType
}