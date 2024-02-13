import React, { useEffect } from "react";

import db, { initDatabase, setup_functions } from "./database/sqlite";
import HomeScreen from "./src/Home";

const App = () => {
    useEffect(() => {
        initDatabase(db);
        setup_functions();
    }, []);
    return <HomeScreen />;
};
export default App;
