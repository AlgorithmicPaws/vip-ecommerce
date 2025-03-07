import Navbar from "./Navbar";
function MainLayout({ children }) {
    return (
        <>
            <Navbar />
            <main className="container mx-auto p-4">
                {children}
            </main>
        </>
    );
}

export default MainLayout;
