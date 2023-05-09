import React, { useState, useEffect } from "react";
import GameDataService from "../services/game";
import { Link } from "react-router-dom";

const GamesList = props => {
  const [games, setGames] = useState([]);
  const [searchName, setSearchName ] = useState("");
  const [searchConsole, setSearchConsole ] = useState("");
  const [searchPrice, setSearchPrice ] = useState("");
  const [prices, setPrices] = useState(["All Prices"]);

  useEffect(() => {
    retrieveGames();
    retrievePrices();
  }, []);

  const onChangeSearchName = e => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };

  const onChangeSearchConsole = e => {
    const searchConsole = e.target.value;
    setSearchConsole(searchConsole);
  };

  const onChangeSearchPrice = e => {
    const searchPrice = e.target.value;
    setSearchPrice(searchPrice);
    
  };

  const retrieveGames = () => {
    GameDataService.getAll()
      .then(response => {
        console.log(response.data);
        setGames(response.data.games);
        
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrievePrices = () => {
    GameDataService.getPrices()
      .then(response => {
        console.log(response.data);
        setPrices(["All Prices"].concat(response.data));
        
      })
      .catch(e => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveGames();
  };

  const find = (query, by) => {
    GameDataService.find(query, by)
      .then(response => {
        console.log(response.data);
        setGames(response.data.games);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const findByName = () => {
    find(searchName, "game_name")
  };

  const findByConsole = () => {
    find(searchConsole, "Console")
  };

  const findByPrice = () => {
    if (searchPrice == "All Prices") {
      refreshList();
    } else {
      find(searchPrice, "price")
    }
  };

  return (
    <div>
      <div className="row pb-1">
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={searchName}
            onChange={onChangeSearchName}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByName}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by console"
            value={searchConsole}
            onChange={onChangeSearchConsole}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByConsole}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg-4">

          <select onChange={onChangeSearchPrice}>
             {prices.map(price => {
               return (
                 <option value={price}> {price.substr(0, 20)} </option>
               )
             })}
          </select>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByPrice}
            >
              Search
            </button>
          </div>

        </div>
      </div>
      <div className="row">
        {games.map((game) => {
          return (
            <div className="col-lg-4 pb-1">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{game.name}</h5>
                  <p className="card-text">
                    <strong>Cuisine: </strong>{game.price}<br/>
                  </p>
                  <div className="row">
                  <Link to={"/games/"+game._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
                    View Reviews
                  </Link>
                  {/* <a target="_blank" href={"https://www.google.com/maps/place/" + address} className="btn btn-primary col-lg-5 mx-1 mb-1">View Map</a> */}
                  </div>
                </div>
              </div>
            </div>
          );
        })}


      </div>
    </div>
  );
};

export default GamesList