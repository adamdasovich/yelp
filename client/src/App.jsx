import React from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import RestaurantDetailPage from "./RestaurantDetailPage";
import Home from "./Home";
import UpdatePage from "./UpdatePage";
import { RestaurantContextProvider } from "./context/RestaurantContext";

const App = () => {
    return (
        <RestaurantContextProvider>
            <div className='container'>
                <Router>
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <Route 
                            exact path='/restaurants/:id/update' 
                            component={UpdatePage}
                        />
                        <Route 
                            exact path='/restaurants/:id' 
                            component={RestaurantDetailPage}
                        />
                    </Switch>
                </Router>
            </div>
        </RestaurantContextProvider>
    )}

export default App;