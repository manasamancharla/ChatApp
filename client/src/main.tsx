import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { store } from "./app/store.ts";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<Theme>
					<App />
				</Theme>
			</BrowserRouter>
		</Provider>
	</React.StrictMode>
);
