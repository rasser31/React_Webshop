import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios'; // Make sure to install axios

import image from './assets/testimage.jpg';

function App() {
  const [drinks, setDrinks] = useState([]);
  const drinkIds = [11007, 11008, 11009, 11010]; // Array of drink IDs you want to fetch

  useEffect(() => {
    const fetchDrinksByIds = async () => {
      try {
        // Map over each drink ID and fetch the drink details
        const drinkRequests = drinkIds.map(id =>
          axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
        );

        // Use Promise.all to send all requests simultaneously
        const responses = await Promise.all(drinkRequests);

        // Extract the drinks data from each response
        const drinksData = responses.map(response => response.data.drinks[0]);

        setDrinks(drinksData);
      } catch (error) {
        console.error('Error fetching drinks:', error);
      }
    };

    fetchDrinksByIds();
  }, [drinkIds]); // Include drinkIds in the dependency array to trigger useEffect when it changes

  return (
    <div className="App">
      <header>
        <div>

        </div>
      </header>
      <main>
        <img className='mainImage' src={image} alt="The main image of the website" />

        <div className='drinks-container'>
          {drinks.map(drink => (
            <div key={drink.idDrink} className='drink'>
              <img className='drinkImage' src={drink.strDrinkThumb} alt='Image of specified drinks'/>
              <h2>{drink.strDrink}</h2>
              {/* You can display other drink details as needed */}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;

