const graphql = require('graphql')
const _ = require('lodash');
const User = require('../model/user')
const Post = require('../model/post')
const Hobby = require('../model/hobby')

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString},
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return User.find()
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return Hobby.find()
            }
        }
    })
})

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Documentation for hobby',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userID)
            }
        }
    })
})

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Documentation for post',
    fields: () => ({
        id: {type: GraphQLID},
        comment: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return Post.findById(parent.userID)
            }
        }
    })
})

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQuerType',
    description: 'Description',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return User.findById(args.id)
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({})
            }
        },
        hobby: {
            type: HobbyType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Hobby.findById(args.id)
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                console.log(Hobby.find())
                return Hobby.find({})
            }
        },
        post: {
            type: PostType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Post.findById(args.id)
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({})
            }
        },
    }

})

//Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                profession: {type: GraphQLString}
            },
            resolve(parent, args) {
                let user = new User({
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                })
                return user.save()
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                name: {type: GraphQLString},
                age: {type: GraphQLInt},
                profession: {type: GraphQLString}
            },
            resolve(parent, args) {
                return User.findByIdAndUpdate(args.id, args, {new: true})
            }
        },
        removeUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                removedUser = User.findByIdAndRemove(args.id).exec()
                if (!removedUser) {
                    throw new("Error. Could not remove user")
                }
                return removedUser
            }
        },
        createPost: {
            type: PostType,
            args: {
                comment: {type:  new GraphQLNonNull(GraphQLString)},
                userID: {type:  new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let post = new Post({
                    comment: args.comment,
                    userID: args.userID
                })
                return post.save()
            },
            
        },
        updatePost: {
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                comment: {type: GraphQLString},
                userID: {type:  GraphQLID}
            },
            resolve(parent, args) {
                return Post.findByIdAndUpdate(args.id, args, {new: true})
            }
        },
        removePost: {
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                removedPost = Post.findByIdAndRemove(args.id).exec()
                if (!removedPost) {
                    throw new("Error. Could not remove post")
                }
                return removedPost
            }
        },
        createHobby: {
            type: HobbyType,
            args: {
                title: {type:  new GraphQLNonNull(GraphQLString)},
                description: {type: GraphQLString},
                userID: {type:  new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let hobby = new Hobby({
                    title: args.title,
                    description: args.description,
                    userID: args.userID
                })
                return hobby.save()
            }
        },
        updateHobby: {
            type: HobbyType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                title: {type: GraphQLString},
                description: {type: GraphQLString},
                userID: {type: GraphQLID}
            },
            resolve(parent, args) {
                return Hobby.findByIdAndUpdate(args.id, args, {new: true})
            }
        },
        removeHobby: {
            type: HobbyType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                removedHobby = Hobby.findByIdAndRemove(args.id).exec()
                if (!removedHobby) {
                    throw new("Error. Could not remove hobby")
                }
                return removedHobby
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})
