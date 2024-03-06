import React, { useState, useEffect } from 'react';
import './App.css'; // Importing CSS file for styling
import axios from 'axios'; // Importing axios for making HTTP requests

import mainImage from './assets/black_gold_bar_new.jpg'; // Importing main image
import { FaShoppingCart } from 'react-icons/fa'; // Importing shopping cart icon from react-icons library

function App() {
  // State variables to manage drinks, cart, cart visibility, payment success, and earned profit
  const [drinks, setDrinks] = useState([]); // State variable for storing drinks data fetched from the API
  const [cart, setCart] = useState([]); // State variable for managing items in the cart
  const [isCartOpen, setIsCartOpen] = useState(false); // State variable for managing cart visibility
  const [paymentSuccess, setPaymentSuccess] = useState(false); // State variable for managing payment success message visibility
  const [earnedProfit, setEarnedProfit] = useState(0); // State variable for storing earned profit from purchases

  // Array of drink IDs to fetch from the API
  const drinkIds = [11007, 11008, 11009, 11010];

  // Price maps for drinks
  const drinkPrices = {
    11007: '8.50',
    11008: '7.00',
    11009: '9.25',
    11010: '6.75',
  };

  const drinkPricesBefore = {
    11007: '6.50',
    11008: '5.00',
    11009: '5.25',
    11010: '3.75',
  };

  // Function to fetch drinks data from the API
  useEffect(() => {
    const fetchDrinksByIds = async () => {
      try {
        // Create an array of axios requests to fetch drink data for each ID
        const drinkRequests = drinkIds.map(id =>
          axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
        );

        // Wait for all requests to resolve using Promise.all
        const responses = await Promise.all(drinkRequests);

        // Extract drink data from responses
        const drinksData = responses.map(response => response.data.drinks[0]);

        // Add specific prices and count properties to each drink
        const drinksWithPrices = drinksData.map(drink => ({
          ...drink,
          price: drinkPrices[drink.idDrink],
          pricebefore: drinkPricesBefore[drink.idDrink],
          count: 0 // Initialize count property to 0 for each drink
        }));

        // Set drinks state with fetched data
        setDrinks(drinksWithPrices);
      } catch (error) {
        console.error('Error fetching drinks:', error);
      }
    };

    // Call the fetchDrinksByIds function
    fetchDrinksByIds();
  }, [drinkIds]);

  // Function to add a drink to the cart
  const addToCart = (drink) => {
    const updatedCart = [...cart]; // Create a copy of the current cart array
    const index = updatedCart.findIndex(item => item.idDrink === drink.idDrink); // Find the index of the drink in the cart

    // If the drink is already in the cart, increment its count, else add it with count 1
    if (index !== -1) {
      updatedCart[index].count++;
    } else {
      updatedCart.push({ ...drink, count: 1 });
    }

    // Update the cart state with the updated cart array
    setCart(updatedCart);
  };

  // Function to remove a drink from the cart
  const removeFromCart = (drink) => {
    const updatedCart = [...cart]; // Create a copy of the current cart array
    const index = updatedCart.findIndex(item => item.idDrink === drink.idDrink); // Find the index of the drink in the cart

    // If the drink is in the cart, decrement its count
    if (index !== -1) {
      updatedCart[index].count--;

      // If count becomes 0, remove the drink from the cart
      if (updatedCart[index].count === 0) {
        updatedCart.splice(index, 1);
      }

      // Update the cart state with the updated cart array
      setCart(updatedCart);
    }
  };

  // Function to calculate the total number of items in the cart
  const calculateTotalItems = () => {
    return cart.reduce((total, item) => total + item.count, 0); // Sum up the counts of all items in the cart
  };

  // Function to calculate the total price of items in the cart
  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + parseFloat(item.price) * item.count, 0); // Calculate total price by multiplying price with count for each item
  };

  // Function to handle payment
  const handlePayment = () => {
    const profit = calculateTotalPrice() - calculateTotalCost(); // Calculate profit earned from the purchase
    setEarnedProfit(profit); // Set earned profit state
    setPaymentSuccess(true); // Set payment success state
    setCart([]); // Clear the cart after successful payment
  };

  // Function to calculate the total cost of items in the cart before any discounts
  const calculateTotalCost = () => {
    return cart.reduce((total, item) => total + parseFloat(item.pricebefore) * item.count, 0); // Calculate total cost by multiplying pricebefore with count for each item
  };

  // Function to toggle cart visibility
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen); // Toggle cart visibility
    if (!isCartOpen) {
      setPaymentSuccess(false); // Reset payment success message when cart is closed
    }
  };

  return (
    <div className="App">
      <main>
        <img className='main_image' src={mainImage} alt="The main image of the website" />
        
        <button className="cart-toggle" onClick={toggleCart}>
          <FaShoppingCart />
          <span className="cart-count">{calculateTotalItems()}</span>
        </button>
        
        {isCartOpen && (
          <div className="cart-overlay">
            <div className="cart-card">
              <header className="cart-header">
                <h2>Cart</h2>
                <button className="close-cart" onClick={toggleCart}>Close</button>
              </header>
              <ul>
                {cart.map(item => (
                  <li key={item.idDrink} className="cart-item">
                    <img src={item.strDrinkThumb} alt={item.strDrink} className="cart-item-image" />
                    <div>
                      <h3>{item.strDrink}</h3>
                      <p>Price: ${item.price}</p>
                      <p>Quantity: {item.count}</p>
                      <button onClick={() => removeFromCart(item)}>Remove from Cart</button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart-total">
                <h3>Total Price: ${calculateTotalPrice()}</h3>
                <button className="pay-button" onClick={handlePayment}>Pay</button>
                {paymentSuccess && (
                  <p>
                    Payment success! The business has earned ${earnedProfit.toFixed(2)} from your purchase.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className='drinks-container'>
          {drinks.map(drink => (
            <div key={drink.idDrink} className='drink'>
              <img className='drinkImage' src={drink.strDrinkThumb} alt='Image of specified drinks'/>
              <h2>{drink.strDrink}</h2>
              <h3>Price: ${drink.price}</h3>
              <h3>Price Before: ${drink.pricebefore}</h3>
              <button onClick={() => addToCart(drink)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;