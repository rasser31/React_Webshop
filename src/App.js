import React, { useState, useEffect } from 'react'; // Importerer forskellige states jeg bruger
import './App.css'; // Importerer css filen
import axios from 'axios'; // Importerer Axios til at kunne hente data

import mainImage from './assets/black_gold_bar_new.jpg'; // Importerer mit hovedbillede
import { FaShoppingCart } from 'react-icons/fa'; // Importerer indkøbskurv ikoner fra react

function App() {
  // State variabler til at håndtere de forskellige elementer på siden
  const [drinks, setDrinks] = useState([]); // Et state variable for at gemme de drinks der bliver hentet fra API'en
  const [cart, setCart] = useState([]); // Et state variable der styrer produkterne i indkøbskurven
  const [isCartOpen, setIsCartOpen] = useState(false); // Et state variable til at håndtere om indkøbskurven er åben eller lukket
  const [paymentSuccess, setPaymentSuccess] = useState(false); // Et state variable til at styre "betaling gennemført" beskeden
  const [earnedProfit, setEarnedProfit] = useState(0); // Et state variable til at gemme profitten fra betalingerne

  // Et array af de ID'er jeg henter ned fra API'et - CocktailDB
  const drinkIds = [11007, 11008, 11009, 11020];

  // De forskellige priser til drinks
  const drinkPrices = {
    11007: '8.50',
    11008: '7.00',
    11009: '9.25',
    11020: '6.75',
  };

  // De priser det ville "koste" os at lave drinksne (Disse bliver brugt til at udregne profit)
  const drinkPricesBefore = {
    11007: '6.50',
    11008: '5.00',
    11009: '5.25',
    11020: '3.75',
  };

  // Funktionen der henter data fra API'et
  useEffect(() => {
    const fetchDrinksByIds = async () => {
      try {
        // Laver et array af Axios anmodninger til at hente data for de forskellige ID'er specificeret
        const drinkRequests = drinkIds.map(id =>
          axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
        );

        // Venter på at alle anmodninger bliver løst ved brug af Promise.all
        const responses = await Promise.all(drinkRequests);

        // Ekstraherer drink data fra responses
        const drinksData = responses.map(response => response.data.drinks[0]);

        // Tilføjer specifikke priser og tællings egenskaber til hver drink
        const drinksWithPrices = drinksData.map(drink => ({
          ...drink,
          price: drinkPrices[drink.idDrink],
          pricebefore: drinkPricesBefore[drink.idDrink],
          count: 0 // Initialiser count egenskab til 0 for hver drink
        }));

        // Sætter drinks state med hentet data
        setDrinks(drinksWithPrices);
      } catch (error) {
        console.error('Fejl ved hentning af drinks:', error);
      }
    };

    // Kalder fetchDrinksByIds funktionen
    fetchDrinksByIds();
  }, [drinkIds]);

  // Funktion til at tilføje en drink til indkøbskurven
  const addToCart = (drink) => {
    const updatedCart = [...cart]; // Opretter en kopi af den nuværende indkøbskurv
    const index = updatedCart.findIndex(item => item.idDrink === drink.idDrink); // Finder indekset af drinken i indkøbskurven

    // Hvis drinken allerede er i indkøbskurven, øg dens tælling, ellers tilføj den med tælling 1
    if (index !== -1) {
      updatedCart[index].count++;
    } else {
      updatedCart.push({ ...drink, count: 1 });
    }

    // Opdater indkøbskurvens state med den opdaterede indkøbskurv
    setCart(updatedCart);
  };

  // Funktion til at fjerne en drink fra indkøbskurven
  const removeFromCart = (drink) => {
    const updatedCart = [...cart]; // Opretter en kopi af den nuværende indkøbskurv
    const drinkAmount = updatedCart.findIndex(item => item.idDrink === drink.idDrink); // Finder indekset af drinken i indkøbskurven

    // Hvis drinken er i indkøbskurven, formindsk dens tælling
    if (drinkAmount !== -1) {
      updatedCart[drinkAmount].count--;

      // Hvis tællingen bliver 0, fjernes drinken fra indkøbskurven
      if (updatedCart[drinkAmount].count === 0) {
        updatedCart.splice(drinkAmount, 1);
      }

      // Opdater indkøbskurvens state med den opdaterede indkøbskurv
      setCart(updatedCart);
    }
  };

  // Funktion til at beregne det samlede antal varer i indkøbskurven
  const calculateTotalItems = () => {
    return cart.reduce((total, item) => total + item.count, 0); // Summer tællingerne af alle varer i indkøbskurven
  };

  // Funktion til at beregne den samlede pris på varer i indkøbskurven
  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + parseFloat(item.price) * item.count, 0); // Beregner den samlede pris ved at multiplicere pris med tælling for hver vare
  };

  // Funktion til at håndtere betaling
  const handlePayment = () => {
    const profit = calculateTotalPrice() - calculateTotalCost(); // Beregner profit fra købet
    setEarnedProfit(profit); // Sætter en ny værdi på setEarnedProfit state
    setPaymentSuccess(true); // Ændrer setPaymentSuccess statet til at være sandt
    setCart([]); // Ryd indkøbskurven efter gennemført betaling
  };

  // Funktion til at beregne den totale værdi af varer i indkøbskurven
  const calculateTotalCost = () => {
    return cart.reduce((total, item) => total + parseFloat(item.pricebefore) * item.count, 0); // Beregner den samlede omkostning ved at multiplicere prisbefore med tælling for hver vare
  };

  // Funktion til at skifte indkøbskurvens synlighed
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen); // Skifter indkøbskurvens synlighed
    if (!isCartOpen) {
      setPaymentSuccess(false); // Nulstil 'betaling gennemført' beskeden når indkøbskurven er lukket
    }
  };

  return (
    <div className="App">
      <main>
        <img className='main_image' src={mainImage} alt="Hovedbilledet på websitet" /> {/* Indsætter main image */}
        
        <button className="cart-toggle" onClick={toggleCart}> {/* Gør så vi kan trykke på kurven */}
          <FaShoppingCart /> {/* Kurvens ikon */}
          <span className="cart-count">{calculateTotalItems()}</span> {/* Beregner den totale mængde af produkter i kurven, bliver fremvist som et 'notifikations' ligne tal oven på cart iconet */}
        </button>
        
        {isCartOpen && (
          <div className="cart-overlay">
            <div className="cart-card">
              <header className="cart-header">
                <h2>Indkøbskurv</h2>
                <button className="close-cart" onClick={toggleCart}>Luk</button> {/* Giver mulighed for at toggle om kurven er åben eller lukket */}
              </header>
              <ul>
                {cart.map(item => (
                  <li key={item.idDrink} className="cart-item">
                    <img src={item.strDrinkThumb} alt={item.strDrink} className="cart-item-image" />
                    <div>
                      {/* De forskellige informationer der bliver hentet omkring produktet så de nemt kan ses i kurven */}
                      <h3>{item.strDrink}</h3>
                      <p>Pris: ${item.price}</p>
                      <p>Antal: {item.count}</p>
                      <button onClick={() => removeFromCart(item)}>Fjern fra kurv</button> {/* Knappen der gør det muligt at fjerne ting fra kurven */} 
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart-total">
                {/* Fremviser den samlede pris der bliver udregnet ved brug af førpris og nuværende pris */}
                <h3>Samlet pris: ${calculateTotalPrice()}</h3>

                {/* Knappen der gør det muligt at betale. Hvis trykket, bliver onClick udført og sætter 'handlePayment' funktionen igang */}
                <button className="pay-button" onClick={handlePayment}>Betal</button>
                {paymentSuccess && (
                  <p>
                    Betaling gennemført! Virksomheden har tjent ${earnedProfit.toFixed(2)} på dit køb.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        <div className='site-content'>
          <div className='drinks-container'>
            {drinks.map(drink => (
              <div key={drink.idDrink} className='drink'>
                {/* Her går jeg ind og henter de forskellige data jeg har fetched fra mit API (drink.strDrink, drink.strDrinkThumb), samt nogle selvlavede data hvilket er priserne */}
                <img className='drinkImage' src={drink.strDrinkThumb} alt='Billede af specifikke drinks'/>
                <h2>{drink.strDrink}</h2>
                <h3>Pris: ${drink.price}</h3>
                <h3>Pris Før: ${drink.pricebefore}</h3>

                {/* Knap der benytter onClick evented til at tilføje produkter til kurven */}
                <button className='addtocart-button' onClick={() => addToCart(drink)}>Tilføj til kurv</button>
              </div>
            ))}
          </div>
        </div>

        <footer>
        </footer>
      </main>
    </div>
  );
}

export default App;
