# Namazon Project

RESTful API that emulates a customer to online store interaction.<br />
**GET**, **POST**, and **DELETE** requests can be made.<br />

Requests can be made to:<br />
* Get ALL the users
* Get user by UserID
* Get user cart by UserID
* Get StoreItem by StoreItemId
* Get StoreItem by query parameter
* Clear a user cart by ID (DELETE)
* Create a user if the user does not exist (POST)
* Add new item to cart given the CartId (POST)
* Remove an Item from cart given CartId, and its placement within the cart (cartItemId).

The schemas model the carts, cartItems, storeItems, and the users.<br />

database contains schemas and our index.js file.

Author: Joshua Medina