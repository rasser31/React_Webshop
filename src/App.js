import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

import mainImage from './assets/black_gold_bar_new.jpg';

function App() {
  const [drinks, setDrinks] = useState([]);
  const drinkIds = [11007, 11008, 11009, 11010]; // Array of drink IDs you want to fetch

  // Define a price map for each drink ID
  const drinkPrices = {
    11007: '$8.50',
    11008: '$7.00',
    11009: '$9.25',
    11010: '$6.75',
  };

  useEffect(() => {
    const fetchDrinksByIds = async () => {
      try {
        const drinkRequests = drinkIds.map(id =>
          axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
        );

        const responses = await Promise.all(drinkRequests);
        const drinksData = responses.map(response => response.data.drinks[0]);

        // Add specific prices to each drink using the drinkPrices map
        const drinksWithPrices = drinksData.map(drink => ({
          ...drink,
          price: drinkPrices[drink.idDrink], // Use the drink ID to find its price
        }));

        setDrinks(drinksWithPrices);
      } catch (error) {
        console.error('Error fetching drinks:', error);
      }
    };

    fetchDrinksByIds();
  }, [drinkIds]);

  return (
    <div className="App">
      <main>
        <img className='main_image' src={mainImage} alt="The main image of the website" />

        <div className='drinks-container'>
          {drinks.map(drink => (
            <div key={drink.idDrink} className='drink'>
              <img className='drinkImage' src={drink.strDrinkThumb} alt='Image of specified drinks'/>
              <h2>{drink.strDrink}</h2>
              <h3>Price: {drink.price}</h3>
              {/* You can display other drink details as needed */}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;


