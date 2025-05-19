import ImportDialog from "./ImportDialog";


/**
 * The main application component that initializes and manages the state of the application.
 *
 * This component uses the `useState` hook to manage an array of `ICategory` objects as its state.
 * It also uses the `useEffect` hook to load initial data and fetch all categories from the adapters.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * // Usage example
 * <App />
 */
export default function App() {


  return <ImportDialog />
}
