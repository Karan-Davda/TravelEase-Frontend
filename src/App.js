import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Destinations from "./pages/Destinations";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Destinations />
        </QueryClientProvider>
    );
}

export default App;