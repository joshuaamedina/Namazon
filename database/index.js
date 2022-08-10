//AUTHOR: JOSHUA MEDINA
//NETID: JAM874
//Index.js functions as the startup for our mock webstore app.
//In the following code you will find the routing, configuration of modules, and
//intialization of the database used for the application.

const express = require('express');

const index = express();
const axios = require('axios').default;

index.use(express.json()); //need this middleware for json body.

const config = {
    headers:{
        'X-Api-Key': '6d542129c59047eb9854b0b0a35bc431'
    }
}

const mongoose = require('mongoose');
const url ='mongodb+srv://dbUser:0PAQkY1d4zUchTfH@cluster0.umy1t.mongodb.net/dbExample3?retryWrites=true&w=majority';

const UserModel = require('./schemas/user');
const CartModel = require('./schemas/cart');
const CartItemModel = require('./schemas/cartItem');
const StoreModel = require('./schemas/storeItem');

let database;

const initDataBase = async ()=> {
    //const connection = await client.connect(url)
    database = await mongoose.connect(url);
    if (database) {
        console.log('Successfully connected to my DB');
        //database = client.db(dbName);
    } else {
        console.log('Error connected to my DB');
    }
}

const initUsers = async() =>{
    const users = [];
    const firstNames = await axios.get('https://randommer.io/api/Name?nameType=firstname&quantity=50', config);
    const lastNames = await axios.get('https://randommer.io/api/Name?nameType=surname&quantity=50', config);
    //we can use promise.all since they do not rely on each other
    const carts = await CartModel.find({});
    let tempCarts = [];

    firstNames.data.forEach((firstName, index) => {
        let assignedCart = carts[Math.floor(Math.random() * carts.length)];
        //tempCarts.push(assignedCart);
        let foundCart= tempCarts.find((cart) => {
            return cart == assignedCart
        })
        while (foundCart) {
            assignedCart= carts[Math.floor(Math.random() * carts.length)];
            foundCart = tempCarts.find((cart) => {
                return cart == assignedCart
            })
        }
        tempCarts.push(assignedCart);
        const newUser = {
            firstName: firstName,
            lastName: lastNames.data[index],
            email: firstName + lastNames.data[index] + "@gmail.com",
            cart: assignedCart,
        }
        users.push(newUser)

    })
    await UserModel.create(users);
}
const initStoreItems = async() =>{
    const storeItems = [];
    const nameResults = await axios.get('https://randommer.io/api/Text/LoremIpsum?loremType=normal&type=words&number=100', config);
    const descriptionResults = await axios.get('https://randommer.io/api/Text/LoremIpsum?loremType=normal&type=paragraphs&number=100', config);
    let names = nameResults.data
    names = names.replace(/,/g,'');
    names = names.replace(/\./g,'');
    names = names.split(' ');
    console.log(names[100]);
    let descriptions = descriptionResults.data;
    descriptions = descriptions.replace(/<br ?\/?>/g, "*")
    descriptions = descriptions.split('*');
    console.log(descriptions);

    //we can use promise.all since they do not rely on each other

    names.forEach((name, index) => {
        if(name!= ""){
            const newStoreItem = {
                name: name,
                price: getRandomFloat(20, 500),
                description: descriptions[index]
            }
            storeItems.push(newStoreItem);}
        //await AuthorModel.create(newAuthor);
    })
    await StoreModel.create(storeItems);
}
function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}
const initCartItems = async() =>{
    const cartItems = [];
    const storeItems = await StoreModel.find({});
    //we can use promise.all since they do not rely on each other
    for( let i = 0; i<100; i++){
        const assignedStoreItem = storeItems[Math.floor(Math.random()*storeItems.length)];
        const newCartItem ={
            storeItemId: assignedStoreItem,
            quantity: getRandomInt(100)+1
        }
        cartItems.push(newCartItem)
    }
    await CartItemModel.create(cartItems);
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const initCarts = async() =>{
    const carts = [];
    let temp = [];
    const cartItems = await CartItemModel.find({});
    //we can use promise.all since they do not rely on each other
    for( let i = 0; i<50; i++) {
        let temp2 = [];
        let ran = Math.floor(Math.random() * 10);
        ran = ran % 2;
        if(ran == 0){
            let assignedCartItem = cartItems[Math.floor(Math.random() * cartItems.length)];
            let foundCartItem = temp.find((cartItem) => {
                return cartItem == assignedCartItem
            })
            while (foundCartItem) {
                assignedCartItem = cartItems[Math.floor(Math.random() * cartItems.length)];
                foundCartItem = temp.find((cartItem) => {
                    return cartItem == assignedCartItem
                })
            }
            temp.push(assignedCartItem);
            temp2.push(assignedCartItem)
            const newCart = {
                Items: temp2,
            }
            carts.push(newCart);}
        else
        {
            let assignedCartItem = cartItems[Math.floor(Math.random() * cartItems.length)];
            let assignedCartItem2 = cartItems[Math.floor(Math.random() * cartItems.length)];

            let foundCartItem = temp.find((cartItem) => {return cartItem == assignedCartItem})
            while (foundCartItem) {
                assignedCartItem = cartItems[Math.floor(Math.random() * cartItems.length)];
                foundCartItem = temp.find((cartItem) => {return cartItem == assignedCartItem})
            }
            temp.push(assignedCartItem);
            temp2.push(assignedCartItem)

            foundCartItem = temp.find((cartItem) => {return cartItem == assignedCartItem2})
            while (foundCartItem) {
                assignedCartItem2 = cartItems[Math.floor(Math.random() * cartItems.length)];
                foundCartItem = temp.find((cartItem) => {return cartItem == assignedCartItem2})
            }
            temp.push(assignedCartItem2);
            temp2.push(assignedCartItem2);
            const newCart = {
                Items: temp2,
            }
            carts.push(newCart);
        }
    }
    await CartModel.create(carts);
}

const init = async () => {
    await initDataBase();
/*    await initStoreItems();
    await initCartItems();
    await initCarts();
    await initUsers();
*/
}

init();

//GET ALL the users
index.get('/user', async (req, res) => {
    const foundUsers = await UserModel.find();
    res.send( foundUsers ? foundUsers: 404);

});

//Get user by UserID
index.get('/user/:UserId', async (req, res) => {

    try{
        const foundUser = await UserModel.find({_id:req.params.UserId}).lean();
        console.log(foundUser);
        res.send(foundUser);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(404);
        return e;
    }

});

//Get user cart by UserID
index.get('/user/:UserId/cart', (req, res) => {
    const foundUserCart = users.find((user) => {return user.UserId == req.params.UserId})
    if (!foundUserCart)
        res.send(404);
    else
        res.send(foundUserCart.cart);
});


//Get StoreItem by StoreItemId
index.get('/StoreItem/:StoreItemID', async (req, res) => {
    let foundStoreItem
    try{
        foundStoreItem = await StoreModel.findById(req.params.StoreItemID).lean();
        res.send(foundStoreItem);

    }
    catch (e)
    {
        console.log(e);
        res.sendStatus(404);

    }

});

//Get StoreItem by query parameter
index.get('/StoreItem', (req, res) => {
    let foundStoreItems = storeItems;
    if(req.query.query) {
        foundStoreItems = [];
        for (let i = 0; i < itemCounter; i++) {
            if (storeItems[i].StoreItemName.includes(req.query.query) || storeItems[i].StoreItemDescription.includes(req.query.query))
                foundStoreItems.push(storeItems[i]);
        }
    }
    if(foundStoreItems.length == 0)
        res.sendStatus(404);
    else
        res.send(foundStoreItems);
});

//Clear a user cart by ID
index.delete('/user/:UserId/cart', (req, res) => {
    //const foundUserId = users.indexOf(req.params.UserId);
    const targetUser = users[req.params.UserId];
    targetUser.cart.Items = [];
    res.send(targetUser);
});

//Create a user if the user does not exist!
index.post('/user', (req, res) => {
    let newUser = req.body;
    let exists = false;
    for(let i = 0; i < userCounter; i++) {
        if (newUser.email == users[i].email)
            exists = true;
    }
    if(exists == true)
        res.send("A user with that email already exists!") ;
    else{
        newUser.UserId = userCounter;
        newUser.cart = createNewCart(newUser.UserId);
        cartCounter++;
        userCounter++;
        users.push(newUser);
        carts.push(newUser.cart);
        res.send(newUser);}
});

//Add new item to cart given the CartId
index.post('/cart/:CartId/cartItem', (req, res) => {
    let newItem = req.body;
    let found = false;
    for(let i = 0; i < itemCounter; i++) { //find if store item exist
        if (storeItems[i].StoreItemID == newItem.StoreItemID)
            found = true;
    }
    if (!found)
        res.send(404);
    else {
        let newCart = carts[req.params.CartId] || -1;
        if (newCart == -1)
            res.send("Cart does not exist!");
        else {
            let j = 0;
            for( j; j<newCart.Items.length; j++)  //when an existing item is going to be added, the cartItemId
                newCart.Items[j].cartItemId = j;  //will be updated so there aren't number skips.
            newItem.cartItemId = j;
            newItem.StoreItemID = req.body.StoreItemID;
            newCart.Items.push(newItem);
            for (let i = 0; i < userCounter; i++) { //find correct user with cart.
                if (users[i].cart.CartId == req.params.CartId)
                    users[i].cart = newCart;
            }
            res.send(newCart);
        }
    }
});

//Remove an Item from cart given CartId, and its placement within the cart (cartItemId).
index.delete('/cart/:CartId/cartItem/:cartItemId', (req, res) => {

    let targetCart = carts[req.params.CartId]; //finds the cart

    if (!targetCart.Items.length) //if the cart is empty
        res.send("Cart is empty. No item deleted.");

    let a = req.params.cartItemId //gets the desired item

    for(let i = 0; i < targetCart.Items.length; i++) { //searches all items &
        if (a == targetCart.Items[i].cartItemId)       //removes items if item
            targetCart.Items.splice(i,1);              //is found
    }
    res.send(targetCart); //return the cart with the deleted items.
});

function createNewCart(userID){
    let newCart = {
        CartId: userID,
        Items: [],
    }
    return newCart;
}

index.listen(8080);
