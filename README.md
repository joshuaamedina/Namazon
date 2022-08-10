# Namazon Project

RESTful API that emulates a customer to online store interaction.<br />
**GET**, **POST**, and **DELETE** requests can be made.<br />

Requests can be made to:<br />
*Get ALL the users<br />
*Get user by UserID<br />
*Get user cart by UserID<br />
*Get StoreItem by StoreItemId<br />
*Get StoreItem by query parameter<br />
*Clear a user cart by ID (DELETE)<br />
*Create a user if the user does not exist (POST)<br />
*Add new item to cart given the CartId (POST)<br />
*Remove an Item from cart given CartId, and its placement within the cart (cartItemId).<br />

The schemas model the carts, cartItems, storeItems, and the users.<br />

database contains schemas and our index.js file.
