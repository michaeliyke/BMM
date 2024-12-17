import Home from "./pages/Home";
import { DataProvider } from './utils/contexts';

export default function App() {

    return (
        <DataProvider>
            <Home />
        </DataProvider>
    );
}
