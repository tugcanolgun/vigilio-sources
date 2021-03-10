import React from 'react';
import {render} from 'react-dom';
import ApiCheck from './AddSource/ApiCheck';
import {BrowserRouter, Route, Switch,} from "react-router-dom";
import Index from "./index/index";
import NavBar from "./HeaderFooter/NavBar";
import AddSchema from "./AddSchema/AddSchema";
import Help from "./Help/Help";


const Main = () => {
  return (
    <div>
      <BrowserRouter>
        <NavBar/>
        <div className="main-content">
          <Switch>
            <Route path="/add">
              <AddSchema/>
            </Route>
            <Route path="/example">
              <ApiCheck/>
            </Route>
            <Route path="/help">
              <Help/>
            </Route>
            <Route path="/">
              <Index/>
            </Route>
          </Switch>
        </div>
        {/*<Footer/>*/}
      </BrowserRouter>
    </div>
  );
}

render(<Main/>, document.getElementById('root'));
